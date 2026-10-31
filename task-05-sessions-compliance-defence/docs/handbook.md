# Crown Heights Academy: Comprehensive Engineering Handbook

**Application**: Fees — School Fees Ledger & Parent Portal  
**Scope**: Full Curriculum Synthesis (Tasks 1 through 5)  
**Standard**: Production-Grade Systems Engineering, Defensive Architecture & Honest Defect Analysis  
**Author**: Lead Software Engineer, Fees Project

---

## Section 1: Design Systems & Token Architecture

### 1.1 The Role of Design Tokens in Mission-Critical Software
A design system is not a styling library; it is a shared contractual language between business requirements, accessibility standards, and code. In the Fees application, design decisions are governed by tokens defined in a single source of truth (`tokens.json`) and compiled into CSS Custom Properties (`globals.css`).

### 1.2 Mathematical Type Scale & Low-End Display Optimization
Low-cost Android smartphones (e.g., Tecno, Infinix, itel) often feature low pixel density (160–240 DPI) and aggressive font rendering engines. To prevent typographic clipping and unreadable numbers, we deployed the **DM Sans** typeface across a strict 15-step mathematical type scale:
- **Display Large**: 32px font size with a generous **40px line-height** (1.25 ratio), ensuring prominent tuition figures (`₦150,000`) never clip their descenders or collision-overlap with currency symbols.
- **Body Medium**: 15px font size with a **24px line-height** (1.6 ratio), engineered specifically for legibility when parents read payment terms in bright Nigerian sunlight.
- **Micro / Subtext**: 12px font size with an **18px line-height** for secondary metadata such as receipt numbers and "Posted Up To" stamps.

### 1.3 Tinted Shadow Elevations vs. Flat Visual Noise
Standard grey CSS shadows (`rgba(0,0,0,0.1)`) create a muddy, unpolished visual appearance on budget IPS LCD displays. We engineered a primary-tinted elevation system where shadow ambient occlusions are tinted with our brand primary hue (`#0F3D2E` deep institutional green):
- `elevation-card`: `0 2px 4px rgba(15, 61, 46, 0.06), 0 4px 12px rgba(15, 61, 46, 0.08)`
- `elevation-modal`: `0 8px 24px rgba(15, 61, 46, 0.12), 0 16px 48px rgba(15, 61, 46, 0.16)`
This creates depth and natural contrast without visual clutter.

---

## Section 2: Repository Scaffolding, Git Hygiene & Server Diagnostics

### 2.1 Git Cleanliness and Linear Progression
The project repository maintains strict Git discipline across the five assessment phases. Uncommitted files, arbitrary feature branches, and giant "everything" commits were avoided in favor of atomic, verifiable milestones tied directly to PRD acceptance criteria.

### 2.2 Replicating and Diagnosing Three Deliberate Server Failure Modes
To verify that our deployment setup was resilient and diagnostic messages were actionable, we simulated and resolved three production failure modes:
1. **Nested Directory Trapping**: An unintended parent folder wrap caused relative path resolution failures (`MODULE_NOT_FOUND`). Remedied by auditing root package manifests.
2. **Port Conflict (`EADDRINUSE`)**: A zombie Node.js process held port 3000 (`PID 18452`). We diagnosed the locked socket via PowerShell `Get-NetTCPConnection -LocalPort 3000` and terminated the orphaned PID safely.
3. **Route Not Found (404 / 500 Route Cascades)**: Created dedicated fallback error boundaries (`not-found.tsx`, `error.tsx`) displaying structured, human-readable recovery links rather than default framework crash pages.

### 2.3 The Database Health Probe (`POST /api/enquiry`)
We implemented a dedicated diagnostic route (`/api/enquiry`) that performs live round-trip database queries, validates database driver connectivity, logs transaction timing, and reports healthy vs. degraded states without exposing sensitive table schemas or credentials.

---

## Section 3: Accessible Forms & Two-Sided Validation

### 3.1 The Form Asymmetry Principle
Client-side validation and server-side validation are fundamentally different disciplines with opposing objectives:
- **Client Validation is User Experience**: It helps the legitimate user avoid frustration by providing immediate, real-time feedback (empty blur checks, phone length limits, email structure validation).
- **Server Validation is Security**: The server assumes that the client is malicious, compromised, or completely bypassed by an attacker executing raw HTTP requests.

### 3.2 Four Client Validation Categories
In [`components/auth-unified-form.tsx`](file:///c:/Users/HP/Desktop/Fees/components/auth-unified-form.tsx), validation rules are organized into four explicit categories:
1. **Category 1 (Empty on Blur)**: If a user clicks into a required field (e.g. Phone Number) and clicks away without typing, an immediate inline error is displayed.
2. **Category 2 (Length & Numeric Structure)**: Phone numbers are validated for 10 or 11 digits using numeric `inputMode="numeric"` to summon the telephone numpad, preventing letter entry while avoiding HTML5 spin-button glitches.
3. **Category 3 (Format Asymmetry)**: Email fields permit asymmetric input (allowing mixed-case typing), while validating standard RFC-compliant address shapes.
4. **Category 4 (Accessibility & ARIA)**: Every input error is explicitly linked to its input via `aria-describedby="[field]-error"`, using `role="alert"` and high-contrast warning icons so screen readers announce errors immediately upon occurrence.

### 3.3 The Direct HTTP Security Attack
To prove that **client validation is not security**, we executed direct PowerShell `Invoke-RestMethod` and curl commands bypassing the browser completely. We transmitted malformed JSON payloads, negative values, and script injection strings directly to the backend. The server halted every attempt at the Zod schema boundary, returning structured `HTTP 400 Bad Request` responses in under **2.00 ms**.

---

## Section 4: Relational Database Modeling, Schema Migrations & Integrity

### 4.1 Schema Normalization and Financial Partitions
The database architecture enforces strict relational separation:
- `Guardian`: Authentication credentials, phone, email, and security state.
- `Student`: Enrolment ledger, student admission numbers, and tuition balance.
- `Payment`: Immutable settled financial payments with bank references and timestamps.
- `PaymentAttempt`: Transient checkout records (abandoned carts), permanently separated from settled money.
- `Session`: Hash-at-rest session tokens with foreign-key linkage.

### 4.2 Integer Arithmetic for Financial Integrity
Floating-point arithmetic (`0.1 + 0.2 = 0.30000000000000004`) causes disastrous rounding errors in financial software. Every currency value across our system is stored as a 64-bit integer representing **whole kobo** (`balanceKobo`, `amountKobo`). Conversions to Naira occur only at the presentation layer (`₦150,000.00`).

### 4.3 Replicating Migration Failures & Drift
During Task Four, we replicated three authentic database engineering failure modes:
1. **The Non-Null Column Failure**: Adding a non-nullable column without a default to a table containing existing rows (`evidence/04-required-column-failure.txt`).
2. **The 3-Step Production Migration**: Demonstrating the zero-downtime remedy: (a) Add column as nullable, (b) Backfill existing rows with deterministic values, (c) Alter column to `SET NOT NULL`.
3. **Prisma Client Drift**: Demonstrating what happens when the database schema diverges from the generated TypeScript client types (`evidence/06-drift-error.txt`).

---

## Section 5: Cryptography, Slow Hashing & Rate Limiting

### 5.1 Memory-Hard Password Hashing (Argon2id)
We deployed Argon2id (RFC 9106) with parameters `m=65536` (64 MB RAM), `t=3` iterations, and `p=4` parallelism. 
- Hardware benchmarks proved Argon2id takes **196.509 ms**, while SHA-256 takes **0.009 ms** (21,460x slower).
- Slow hashing forces an attacker who leaks a database dump into **54.5 hours of continuous multi-core CPU cracking per 1M guesses**, while legitimate parents experience imperceptible login overhead.

### 5.2 K-Anonymity Breached Credential Auditing
During account activation, student access slips and PINs are cross-referenced against the HaveIBeenPwned database of 800M+ leaked credentials using the **k-anonymity mathematical model**:
- The client/server computes the SHA-1 hash of the candidate code.
- Only the first 5 hexadecimal characters are sent over the network.
- The external service returns matching 35-character suffixes.
- The server performs the match locally in memory, proving a code is breached without ever revealing the user's secret to the external service.

### 5.3 Sliding-Window Rate Limiting & The Proxy Defeat
To protect against online brute-force attacks, we deployed a sliding-window rate limiter (5 requests / 60 seconds per IP). We then deliberately demonstrated how to **defeat our own rate limiter** by spoofing client-supplied `X-Forwarded-For: 198.51.100.42` headers (`evidence/14-rate-limit-defeated.txt`), demonstrating why trusting unvalidated proxy headers in cloud environments is a fatal vulnerability.

---

## Section 6: Session Architecture, Authentication & Role Authorisation

### 6.1 Cryptographic Tokens & Hash-at-Rest
Upon authentication, the server generates a 32-byte CSPRNG token (`crypto.randomBytes(32)`).
- The raw token is sent to the client exclusively in an `HttpOnly; Secure; SameSite=Lax; Path=/` cookie (`cha_fees_session`).
- The database stores only the **SHA-256 hash** of that token. Even a full database dump cannot be reversed into valid session cookies.

### 6.2 Authentication vs. Authorisation: The Copied-Link Test
Next.js Edge Middleware (`middleware.ts`) enforces strict role-based access control. In Step 10, we proved the difference between Authentication (verifying *who* you are) and Authorisation (verifying *what* you can do):
- An ordinary logged-in parent attempting to access `/admin/bursar` is halted with **`HTTP 403 Forbidden`**.

### 6.3 Shared Browser Collision & Session Overwrite
In Nigeria, multiple guardians frequently share a single community handset or cybercafe browser. When Parent B signs in on the same browser without clicking logout, the server overwrites the session cookie with Parent B's fresh cryptographic token. The private student ledger partition resolves strictly to Parent B's verified Guardian ID, completely preventing session bleed.

---

## Section 7: Data Compliance, Legal Retention & Real Production Defects

### 7.1 NDPA Right to Erasure vs. Statutory CAMA Tax Retention
Under the Nigeria Data Protection Act (NDPA 2023 Section 34), parents have the right to request deletion of their personal records. However, under the Companies and Allied Matters Act (CAMA 2020) and Nigerian tax law, educational businesses must retain accounting ledgers and payment receipts for a **minimum of 6 years**.
We reconciled this conflict through **Pseudonymised Ledger Preservation**:
1. When deletion is requested, the account enters a **7-day cooling-off period** (`PENDING_DELETION`) and all active sessions are instantly revoked.
2. Upon purge, personal credentials (phone, email, PIN hash) are permanently overwritten with irreversible pseudonym hashes (`PURGED_<uuid>_<timestamp>`).
3. Historical `Payment` rows, whole kobo values, and bank receipt numbers remain intact for tax audit, linked to the anonymized student record.

---

## 7.2 Seven Real Codebase Mistakes Made During This Build

In accordance with the curriculum requirement for intellectual honesty, here are **seven real, authentic mistakes** made during the construction of the Fees codebase, their exact file references, and their operational consequences:

### Mistake 1: Untrusted Reverse Proxy Header Spoofing in Rate Limiter
- **File Reference**: [`lib/rate-limiter.ts#L26-L32`](file:///c:/Users/HP/Desktop/Fees/lib/rate-limiter.ts#L26)
- **The Defect**: The rate limiter extracted client IP addresses by reading `request.headers.get('x-forwarded-for')` directly without verifying whether the request came from a trusted upstream reverse proxy.
- **Consequence**: An attacker spoofed arbitrary IP addresses by sending custom HTTP headers (`X-Forwarded-For: 198.51.100.42`), completely defeating the sliding-window lockout and brute-forcing PINs without restriction (`evidence/14-rate-limit-defeated.txt`).
- **Remediation**: Extract IP strictly from platform-verified connection context (`request.ip` on Vercel) or validate upstream proxy CIDR blocks.

### Mistake 2: In-Memory Rate Limiting State Loss on Serverless Cold-Starts
- **File Reference**: [`lib/rate-limiter.ts#L8`](file:///c:/Users/HP/Desktop/Fees/lib/rate-limiter.ts#L8)
- **The Defect**: Rate limit buckets were stored in an in-memory Node.js `Map` (`rateLimitStore`).
- **Consequence**: In a serverless cloud environment (such as Vercel or AWS Lambda), every cold start or redeployment spun up a fresh microVM with an empty `Map`, wiping all active rate-limiting penalties and allowing attackers to resume attacks.
- **Remediation**: Migrate rate-limiting state to an external Redis / Upstash cluster or atomic PostgreSQL counter.

### Mistake 3: Fail-Open Timeout Vulnerability on Breached Credential API
- **File Reference**: [`lib/breach-check.ts#L45-L52`](file:///c:/Users/HP/Desktop/Fees/lib/breach-check.ts#L45)
- **The Defect**: When the HaveIBeenPwned API timed out (5-second timeout boundary), the catch block returned `{ breached: false, count: 0 }` to avoid blocking user activation.
- **Consequence**: An attacker could deliberately flood or degrade the external HaveIBeenPwned network connection, forcing timeouts that caused the system to fail-open and accept compromised slip codes (like `123456`).
- **Remediation**: For high-security environments, fail-closed or enforce an offline bloom-filter cache of the top 100,000 common codes.

### Mistake 4: Non-Idempotent Email Verification Code Consumption
- **File Reference**: [`lib/email-service.ts#L107`](file:///c:/Users/HP/Desktop/Fees/lib/email-service.ts#L107)
- **The Defect**: The `verifyCode` function marked a 6-digit code as `record.used = true` immediately upon the first successful validation attempt.
- **Consequence**: In poor mobile network conditions, if the client’s browser timed out waiting for the server’s HTTP 200 response and automatically retried the POST request, the second request hit `record.used === true` and was rejected with a terrifying `"This verification code has already been used"` error banner.
- **Remediation**: Implement a 60-second idempotency window permitting the exact same valid payload to return success within a short time window.

### Mistake 5: Stale Pooled Sockets on Neon Scale-to-Zero (OS Error 10054)
- **File Reference**: [`lib/prisma.ts#L1-L16`](file:///c:/Users/HP/Desktop/Fees/lib/prisma.ts#L1) (Original implementation prior to resilient retry extension)
- **The Defect**: Prisma Client held open persistent TCP sockets in its pool to Neon PostgreSQL. When Neon suspended its free-tier compute after 5 minutes of inactivity, Windows received a TCP reset (`WSAECONNRESET` / OS 10054) on the next query.
- **Consequence**: Parents attempting to log in after an idle period saw false rejection errors ("Incorrect phone number or PIN") because the login route caught the database exception and fell back to empty fixtures.
- **Remediation**: Implemented query extensions (`$extends`) with automatic transient connection detection, URL parameter normalization (`connect_timeout=30`), and a 1.2-second wait-and-retry mechanism to allow Neon compute to wake cleanly.

### Mistake 6: Union Type Inference Conflict on Dual-Handle Login Queries
- **File Reference**: [`app/api/auth/login/route.ts#L101-L106`](file:///c:/Users/HP/Desktop/Fees/app/api/auth/login/route.ts#L101)
- **The Defect**: Querying the database via a ternary operator (`where: isEmail ? { email: identifier } : { phone: identifier }`) caused TypeScript to evaluate the argument as a union type `{ email: string } | { phone: string }`, failing Prisma's strict excess property validation.
- **Consequence**: Broke TypeScript compilation during CI typechecks, preventing production builds.
- **Remediation**: Separated the database calls into explicit branches (`isEmail ? await prisma.guardian.findFirst(...) : await prisma.guardian.findUnique(...)`).

### Mistake 7: Foreign Key Violation During Unauthenticated Mock Unit Testing
- **File Reference**: [`lib/session.ts#L74-L87`](file:///c:/Users/HP/Desktop/Fees/lib/session.ts#L74)
- **The Defect**: `createSession` attempted to asynchronously persist session records to PostgreSQL using mock `guardianId` strings (e.g. `'guardian-uuid-user1'`) without verifying whether those records existed in the database `Guardian` table.
- **Consequence**: Unit test runs triggered foreign key constraint errors (`Session_guardianId_fkey`) in the background console logs.
- **Remediation**: Wrapped Prisma session creation in non-blocking error handlers with environment-aware guards, ensuring unit test suites run cleanly without database pollution.

