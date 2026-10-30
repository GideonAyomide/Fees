# Task Four: The Server Is the Source of Truth

**Application**: Fees — Crown Heights Academy School Fees & Ledger Management  
**Focus**: Database Schema Architecture, Migrations, Adaptive Hashing, Boundary Schema Validation, Rate Limiting & Verification  
**Evaluation Target**: Technical Interviewer (4-Minute Executive Briefing)

---

## 1. What This Task Was
In Task Three, we built a single-page authentication interface and audited client-side validation, ending with a direct PowerShell HTTP attack that bypassed browser controls and proved that **client-side validation is not security**. 

Task Four closes that vulnerability completely. It establishes the backend server as the uncompromised source of truth. We engineered a normalized relational database schema for Crown Heights Academy, verified migration failure modes, enforced memory-hard password hashing (Argon2id), implemented strict boundary validation schemas (Zod), applied sliding-window rate limiting (and proved how to defeat it), added k-anonymity breached credential checking, and implemented an asynchronous email verification system with branded design system tokens.

---

## 2. What We Built & Tested
1. **Relational Schema & Migrations (`docs/schema.md`, `docs/migrations.md`)**:
   - Designed 5 core relational tables: `Guardian`, `Student`, `Session`, `Payment`, and `PaymentAttempt` (plus vector chunk table for future retrieval).
   - Enforced database separation between settled financial payments (`Payment`) and abandoned checkouts (`PaymentAttempt`).
   - Replicated authentic migration failure modes: adding a non-null column without default (`evidence/04-required-column-failure.txt`), the 3-step migration remedy (`evidence/05-required-column-three-steps.txt`), and schema client drift (`evidence/06-drift-error.txt`).
2. **Slow Adaptive Hashing (`docs/hashing.md`)**:
   - Implemented Argon2id slow cryptographic hashing.
   - Captured real machine hardware benchmarks (`evidence/08-timing-argon-vs-sha.txt`): Argon2id takes **196.509 ms**, while SHA-256 takes **0.009157 ms** (Argon2id is **21,460x slower**).
   - Proved that while slowing down hashing costs a legitimate user nothing (200ms per login), it forces an attacker with a stolen database dump into 54+ hours of CPU cracking per 1M guesses.
3. **Boundary Schema Validation (`docs/validation-placement.md`)**:
   - Deployed Zod schemas at backend route boundaries (`lib/auth-validation.ts`).
   - Timed validation overhead: in-memory Zod parsing adds only **0.0318 ms** (`evidence/11-validation-timing.txt`).
   - Re-executed the direct HTTP attack from Task Three: server halted the malicious request in **2.00 ms** with `HTTP 400 Bad Request` and structured validation issues (`evidence/12-direct-request-before-and-after.txt`).
4. **Rate Limiting & Intentional Defeat (`docs/rate-limiting.md`)**:
   - Implemented sliding-window IP rate limiting (5 requests / 60 seconds) on `/api/auth/*`.
   - Evidenced lockout with `HTTP 429 Too Many Requests` (`Retry-After: 60`).
   - Successfully defeated our own rate limiter by spoofing `X-Forwarded-For: 198.51.100.42` (`evidence/14-rate-limit-defeated.txt`), demonstrating why trusting unvalidated proxy headers is a fatal vulnerability.
5. **Breached Credential Hygiene (`docs/breach-check.md`)**:
   - Integrated HaveIBeenPwned k-anonymity API (sending only 5-character SHA-1 prefix, evaluating 35-character suffix locally in memory).
   - Refused compromised slip codes (e.g. `123456`, appearing in 210M+ breaches).
6. **Email Verification & Background Worker (`docs/verification-design.md`, `docs/email-copy.md`)**:
   - Generated 6-digit cryptographic codes via system CSPRNG (`crypto.randomInt`).
   - Enforced a 10-minute expiry window justified by Nigerian mobile data realities.
   - Built branded email templates using Task One tokens (`#0F3D2E`, `#2D7A5D`, `#F8F9FA`, `#1F2937`).
   - Evidenced synchronous vs async background dispatch (`evidence/18-registration-timing-sync-vs-job.txt`): synchronous SMTP takes **882.33 ms**, background queue takes **0.04 ms** (**22,058x speedup**).
   - Validated all 4 lifecycle states: Valid, Expired, Wrong Code, and Reused Code (`app/verify/page.tsx`).

---

## 3. What We Decided
- **Argon2id over bcrypt**: Argon2id provides memory-hardness (64 MB RAM per hash), rendering modern parallel GPU and ASIC attacks ineffective.
- **Fail-Open on Login, Fail-Closed on Activation**: Guaranteed that a temporary Redis or network hiccup never prevents a parent at the school gate from seeing their tuition balance, while strictly gating new identity creation.
- **Whole Kobo Integer Arithmetic**: Stored currency as 64-bit integers (`balanceKobo`, `amountKobo`) to eliminate IEEE-754 floating-point rounding errors across school ledgers.
- **Four Deliberately Omitted Controls (`docs/not-implemented.md`)**: Omitted CAPTCHAs, hardware passkeys, mandatory per-login SMS MFA, and column-level KMS encryption to preserve accessibility on low-end Nigerian Android phones and prevent prohibitive per-login SMS costs for the school.

---

## 4. What We Got Wrong (Real Codebase Defects)
We identified and cataloged four real defects in `docs/defects.md`:
1. **In-Memory Rate Limiting State Loss ([`lib/rate-limiter.ts#L8`](file:///c:/Users/HP/Desktop/Fees/lib/rate-limiter.ts#L8))**: Rate limit counters live in a transient Node.js `Map`, resetting on every serverless instance restart or Vercel redeploy.
2. **Untrusted Header Spoofing ([`lib/rate-limiter.ts#L26`](file:///c:/Users/HP/Desktop/Fees/lib/rate-limiter.ts#L26))**: The rate limiter trusts client-supplied `X-Forwarded-For` headers, allowing attackers to bypass lockouts via IP rotation.
3. **Fail-Open Timeout on Breached Credential API ([`lib/breach-check.ts#L45`](file:///c:/Users/HP/Desktop/Fees/lib/breach-check.ts#L45))**: Network timeouts to HaveIBeenPwned fail open, allowing breached codes through if the external service is degraded.
4. **Verification Code Non-Idempotency ([`lib/email-service.ts#L107`](file:///c:/Users/HP/Desktop/Fees/lib/email-service.ts#L107))**: Successful verification marks codes as used immediately without an idempotency grace period, causing client network retry attempts to fail with an alarmist error.

---

## 5. Artifacts and Evidence Directory Map
- `docs/schema.md` — Relational tables, nullability, indexing trade-offs, and tax audit reasoning.
- `docs/migrations.md` — Forward-only migrations, non-null column additions, and drift recovery.
- `docs/hashing.md` — Argon2id vs SHA-256 timings, hardware mathematics, and rainbow table defense.
- `docs/validation-placement.md` — Request lifecycle architecture, what runs before/after, and why schemas beat manual route checks.
- `docs/rate-limiting.md` — Sliding window counters, header spoofing attack, and multi-tenant connection limits.
- `docs/breach-check.md` — K-anonymity prefix matching mechanics and privacy justification.
- `docs/verification-design.md` — CSPRNG code generation, 10-minute expiry justification, and async workers.
- `docs/email-copy.md` — Brand token styling, agent purple button error, and authentic parent copy.
- `docs/not-implemented.md` — Detailed analysis of four deferred security controls.
- `docs/defects.md` — Production defects, line references, and operational costs.
- `docs/interview-answers.md` — All 19 technical defense interview questions answered under 200 words each.
- `evidence/` — 18 machine-verified text, benchmark, and visual deliverables.

