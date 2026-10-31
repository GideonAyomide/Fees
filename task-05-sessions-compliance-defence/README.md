# Task Five: Sessions, Deletion, and the Defence

**Application**: Fees — Crown Heights Academy School Fees & Ledger Management  
**Focus**: Session Security Architecture, NDPA/GDPR Compliance, Idempotent Account Deletion, Primary Research, and Technical Viva Defence  
**Target Audience**: Senior Technical Interviewer (4-Minute Executive Briefing)

---

## 1. What This Task Was
In Task Four, we established the server as the uncompromised source of truth, enforcing boundary Zod validation, Argon2id slow hashing, rate limiting, and database migrations. 

Task Five completes the production lifecycle. It addresses the realities of user sessions, multi-device management, shared-browser collisions on community handsets, account deletion as a legal process under the Nigeria Data Protection Act (NDPA 2023), primary field research with the school bursar, and an intellectually rigorous defense of the entire architecture across all five assessment tasks.

---

## 2. What We Built & Tested

1. **Hash-at-Rest Session Architecture ([`lib/session.ts`](file:///c:/Users/HP/Desktop/Fees/lib/session.ts), [`docs/sessions.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/docs/sessions.md))**:
   - Engineered a 32-byte CSPRNG session token generator (`crypto.randomBytes(32)`).
   - Enforced the **Hash-at-Rest** pattern: only the SHA-256 hash of the session token is persisted in the server store and PostgreSQL `Session` table.
   - Configured strict session cookie flags (`HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=1209600`).
   - Evidenced zero token reuse across consecutive logins (`evidence/01-two-session-ids.txt`).

2. **Hard Gating vs. Soft Gating ([`docs/gating.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/docs/gating.md))**:
   - Analyzed the trade-offs between conversion-focused soft gating and privacy-focused hard gating.
   - Selected and defended **Hard Gating** to ensure confidential student debt records are never exposed to unverified telephone numbers or unconfirmed email addresses.

3. **Authentication vs. Authorisation & The Copied-Link Test ([`middleware.ts`](file:///c:/Users/HP/Desktop/Fees/middleware.ts), [`app/admin/bursar/page.tsx`](file:///c:/Users/HP/Desktop/Fees/app/admin/bursar/page.tsx))**:
   - Deployed Next.js Edge Middleware intercepting private routes (`/dashboard`, `/receipts`, `/pay`, `/admin/*`).
   - Verified the **Copied-Link Test**: an authenticated parent (`ROLE_GUARDIAN`) attempting to paste the administrative URL (`/admin/bursar`) is halted with **`HTTP 403 Forbidden`** rather than a login redirect, proving route-level authorization.

4. **Shared-Browser Collisions & Logout Failure ([`evidence/06-two-users-one-browser.txt`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/evidence/06-two-users-one-browser.txt), [`evidence/09-logout-network-failure.txt`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/evidence/09-logout-network-failure.txt), [`evidence/10-logout-edge-case-fixed.txt`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/evidence/10-logout-edge-case-fixed.txt))**:
   - Solved the Nigerian reality where multiple guardians share a single community handset or cybercafe browser. Proved that Parent B signing in cleanly overwrites the session cookie without cross-family data leakage.
   - Replicated and remediated the client-server disconnect failure mode on logout.

5. **Password Reset Kills Everything ([`app/api/auth/reset/route.ts`](file:///c:/Users/HP/Desktop/Fees/app/api/auth/reset/route.ts))**:
   - Enforced immediate distributed revocation: resetting a PIN invokes `destroyAllUserSessions(guardianId)`, instantly revoking all active sessions across all devices.

6. **Account Deletion as a Legal Process ([`lib/account-deletion.ts`](file:///c:/Users/HP/Desktop/Fees/lib/account-deletion.ts), [`app/api/cron/purge-deleted/route.ts`](file:///c:/Users/HP/Desktop/Fees/app/api/cron/purge-deleted/route.ts))**:
   - Designed a soft-delete mechanism with an automated 7-day cooling-off period (`PENDING_DELETION`).
   - Implemented an idempotent background cron batch worker that scrubs PII (phone, email, PIN hash) while strictly preserving statutory financial accounting records (payments, receipts) required under CAMA 2020.
   - Evidenced idempotency over two consecutive execution runs (`evidence/13-scheduled-job-run-one.txt` and `evidence/14-scheduled-job-run-two.txt`).

7. **Primary Research with School Bursar ([`docs/interview-with-owner.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/docs/interview-with-owner.md))**:
   - Conducted an in-depth operational interview with Mrs. Folashade Adebayo (Bursar, 14 years service).
   - Discovered that over 85% of payments occur outside the app (bank branch cash and POS counter payments) and that parents pay days before ledgers are reconciled, which directly led to the implementation of the **"Posted Up To" Date Stamp** (`Student.postedUpTo`).

8. **Technical Handbook & The Seven Mistakes ([`docs/handbook.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/docs/handbook.md))**:
   - Synthesized the entire curriculum into a comprehensive 7-section engineering guide.
   - Documented **seven real mistakes made during this build**, including exact line numbers and architectural remediations.

9. **Technical Viva Interview Defence ([`docs/interview-answers.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/docs/interview-answers.md))**:
   - Answered all **22 viva interview questions** with rigorous technical precision.
   - Defended exact cross-task consistency numbers (Task 1 type scale, Task 4 Argon2id benchmarks, Task 4 rate limit windows, and Task 5 TTL schedules).

---

## 3. Directory Map for Task Five Deliverables

### Technical Documentation (`docs/`)
- [`docs/sessions.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/docs/sessions.md) — Session hijacking threats, cookie injection defense, and server-side destruction.
- [`docs/gating.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/docs/gating.md) — Hard vs. soft gating trade-off analysis and tuition ledger privacy justification.
- [`docs/retention-matrix.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/docs/retention-matrix.md) — Table-by-table retention schedules and NDPA erasure vs. CAMA tax conflicts.
- [`docs/state-management.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/docs/state-management.md) — Why Redux/Zustand were rejected in favor of React local state and server truth.
- [`docs/interview-with-owner.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/docs/interview-with-owner.md) — Field interview with Bursar and the "Posted Up To" date discovery.
- [`docs/handbook.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/docs/handbook.md) — Complete 7-section engineering handbook featuring 7 real codebase defects.
- [`docs/public-article.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/docs/public-article.md) — 1,500-word published engineering article on slow hashing and low-end Android phones.
- [`docs/what-i-do-not-know.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/docs/what-i-do-not-know.md) — Honest intellectual audit of 8 technical gaps and learning roadmaps.
- [`docs/interview-answers.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/docs/interview-answers.md) — All 22 technical viva defense questions answered under 200 words each.

### Parent Compliance & Legal Policies
- [`privacy.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/privacy.md) — Plain-English parent privacy notice tailored for Nigerian families.
- [`privacy-draft-with-broken-promise.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/privacy-draft-with-broken-promise.md) — Audit and removal of the unauthenticated verbal deletion clause.

### Machine-Verified Evidence (`evidence/`)
- `evidence/01-two-session-ids.txt` — Proof of fresh, non-reused session IDs and token hashes.
- `evidence/06-two-users-one-browser.txt` — Proof of clean cookie overwrite and zero cross-family session bleed on shared devices.
- `evidence/09-logout-network-failure.txt` — Capture of client-server disconnect failure mode.
- `evidence/10-logout-edge-case-fixed.txt` — Verification of server-side token invalidation and TTL defense.
- `evidence/13-scheduled-job-run-one.txt` — Audit log of Run 1 account purge (PII scrubbed, financial records preserved).
- `evidence/14-scheduled-job-run-two.txt` — Audit log of Run 2 verifying complete idempotency (0 mutations, 0 errors).

