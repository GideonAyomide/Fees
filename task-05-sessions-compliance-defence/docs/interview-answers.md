# Task Five Technical Viva: Interview Questions & Answers

**Application**: Fees — Crown Heights Academy School Fees & Ledger Management  
**Focus**: Architectural Defense, Session Cryptography, Compliance & Cross-Task Consistency  
**Standard**: Rigorous Technical Accuracy, Explicit Evidence Citations, Under 200 Words Per Answer

---

### Question 1: What is the Hash-at-Rest pattern for session management, and why is storing raw session tokens in the database a critical vulnerability?
**Answer**:
The Hash-at-Rest pattern ensures that only the one-way cryptographic hash of a session token is stored on the server, while the plaintext token is transmitted exclusively to the client inside an `HttpOnly` cookie. When a user authenticates, the server generates a high-entropy 32-byte token via `crypto.randomBytes(32)` and persists `crypto.createHash('sha256').update(rawToken).digest('hex')` in the `Session` table.

Storing plaintext session tokens in a database is fatal because any SQL injection, backup snapshot leak, or compromised read-replica hands an adversary pre-authenticated, ready-to-use session cookies for every active user. By storing only the SHA-256 hash, a stolen session database is useless: SHA-256 is mathematically irreversible, meaning the attacker cannot compute the original 32-byte hex token needed to construct a valid browser cookie.

---

### Question 2: Why did Crown Heights Academy select "Hard Gating" instead of "Soft Gating" for new parent account activations?
**Answer**:
Soft gating allows users to access an application immediately upon account creation, deferring email verification until a later milestone. Hard gating completely blocks access to protected records until cryptographic proof of email or phone ownership is established.

For Crown Heights Academy, soft gating was firmly rejected. Fees is not an e-commerce platform where maximizing frictionless sign-up conversions matters. It is a private tuition fee ledger. Allowing an unverified user into the dashboard—even for a few minutes—would expose sensitive student debts and fee line items if a stranger typed a typo-ridden phone number or impersonated a guardian. Hard gating guarantees that no private academic or financial record is rendered until the parent proves ownership of the communication channel via a 6-digit CSPRNG verification code.

---

### Question 3: How does your implementation distinguish between Authentication and Authorisation, and what did the "Copied-Link Test" prove?
**Answer**:
Authentication answers *"Who are you?"* by verifying credentials (phone and Argon2id PIN) and issuing a cryptographically signed session cookie. Authorisation answers *"What are you permitted to do?"* by checking whether that authenticated identity possesses the necessary role claims for a specific protected resource.

In Step 10, we executed the **Copied-Link Test**: a parent logged in with legitimate `GUARDIAN` credentials pasted the administrative route URL (`/admin/bursar`). Next.js Edge Middleware (`middleware.ts`) inspected the session token. Because the user was fully authenticated, authentication passed. However, the middleware checked the role claim. Because the user lacked the `BURSAR` role, the server halted the request with **`HTTP 403 Forbidden`** rather than redirecting to login. This proved that route security validates authorization, preventing authenticated privilege escalation.

---

### Question 4: How does your application resolve the shared-browser problem when two parents use the same community phone or cybercafe terminal?
**Answer**:
In Nigeria, multiple guardians frequently share a single household smartphone or cybercafe computer. If Parent A uses the browser and walks away without clicking sign out, a subsequent login by Parent B on the same browser must never expose Parent A's tuition balance.

When Parent B logs in, the server generates a fresh 32-byte cryptographic session token and issues a new `Set-Cookie: cha_fees_session` response. This completely overwrites the browser's previous cookie. Furthermore, the Next.js backend never binds state to client-side storage or persistent tabs; private student ledger queries are partitioned strictly by the verified `guardianId` extracted from the active session token in the incoming cookie. Finally, PostgreSQL row-level security (`0002_row_rules.sql`) enforces database-level refusal if a request attempts to query another family's student ID.

---

### Question 5: What happens during a "Logout Network Failure," and how does your architecture defend against zombie sessions?
**Answer**:
If a parent taps "Sign Out" at the school gate and their cellular connection drops before `POST /api/auth/logout` reaches the server, an asymmetric state disconnect occurs: the client-side JavaScript clears the local cookie, but the server never received the revocation request.

We mitigate this through defense-in-depth:
1. **Absolute Rolling TTL**: Every session has an absolute 14-day expiry (`expiresAt`), ensuring abandoned sessions expire deterministically.
2. **Password Reset Revocation**: Any PIN reset invokes `destroyAllUserSessions(guardianId)`, instantly wiping all active database session rows across all devices.
3. **Account Deletion Revocation**: Soft-deleting an account immediately wipes all session records.
4. **Idempotent Server Cleanup**: The logout route sets `Max-Age=0` in the response header even if database operations fail, ensuring the browser cookie is purged regardless of partial server warnings.

---

### Question 6: Explain the "Password Reset Kills Everything" principle and how it is enforced across distributed sessions.
**Answer**:
If an attacker steals a parent’s phone, intercepts a session cookie on public Wi-Fi, or clones an active session, simply changing the password in the database is useless if existing session tokens remain valid.

Under the "Password Reset Kills Everything" principle, changing a PIN or password must immediately destroy every active session across all devices. In [`app/api/auth/reset/route.ts`](file:///c:/Users/HP/Desktop/Fees/app/api/auth/reset/route.ts), upon verifying the 6-digit reset code and updating the Argon2id `pinHash`, the server immediately executes `destroyAllUserSessions(guardianId)`. This deletes every active session matching that guardian ID from both the server-side session store and the PostgreSQL `Session` table. A thief holding a stolen session cookie on another device is instantly refused on their very next request.

---

### Question 7: How does your system reconcile NDPA Right to Erasure with statutory CAMA tax retention laws?
**Answer**:
Section 34 of the Nigeria Data Protection Act (NDPA 2023) gives parents the right to request deletion of their personal data. However, Section 375 of the Companies and Allied Matters Act (CAMA 2020) and Nigerian tax law require businesses to retain financial ledgers and receipts for a minimum statutory period of six (6) years.

We resolve this legal conflict through **Pseudonymised Ledger Preservation**:
1. When deletion is requested, the account enters a 7-day grace period (`PENDING_DELETION`), immediately revoking all sign-in sessions.
2. When the background purge executes, personal identification (phone number, email address, Argon2id PIN hash) is permanently erased or overwritten with an irreversible pseudonym (`PURGED_<uuid>_<timestamp>`).
3. Historical `Payment` rows, whole kobo values, and bank receipt numbers remain intact in the database, linked to the anonymized student record, satisfying tax audit requirements without retaining guardian PII.

---

### Question 8: Why is the background account purge designed to be idempotent, and how did you verify it?
**Answer**:
A background maintenance job is idempotent if running it multiple times produces the exact same system state as running it once, without throwing duplicate key errors or corrupting records. In production cloud environments, cron schedulers frequently trigger duplicate invocations due to network retries or worker restarts.

In [`lib/account-deletion.ts`](file:///c:/Users/HP/Desktop/Fees/lib/account-deletion.ts), the purge queries accounts where `scheduledPurgeAt <= NOW()` and `status === 'PENDING_DELETION'`. We verified idempotency via two consecutive runs (`evidence/13-scheduled-job-run-one.txt` and `evidence/14-scheduled-job-run-two.txt`):
- **Run 1**: Found 1 eligible account, scrubbed PII, marked status as `PURGED`, and preserved 1 financial record in 12ms.
- **Run 2**: Executed 5 seconds later; found 0 eligible accounts, performed 0 mutations, and completed cleanly in 1ms with zero errors.

---

### Question 9: Why did you remove the "verbal deletion at the school gate" clause from the parent privacy policy?
**Answer**:
The early privacy draft promised that parents could verbally tell a security officer or class teacher at the school gate to delete their account within 24 hours. 

During our security and legal audit, this was excised because:
1. **Zero Authentication**: A verbal request allows an estranged spouse or adversary to maliciously delete another family's account without proof of identity.
2. **Chain-of-Custody Failure**: Gate guards and teachers are focused on student safety and pedagogy; verbal messages during morning drop-off are easily forgotten or distorted, guaranteeing regulatory failure under NDPA.
3. **Statutory Violation**: A literal 24-hour wipe of school records destroys financial receipts required for tax audits under CAMA 2020.
4. It was replaced with an authenticated, verifiable digital and written workflow with a 7-day grace period.

---

### Question 10: Why did Fees reject global frontend state stores like Redux or Zustand in favor of local React state and server truth?
**Answer**:
Crown Heights Academy parents access Fees on low-end Android smartphones (1GB–2GB RAM) over metered cellular connections. 

Global state stores were rejected because:
1. **Bundle Overhead**: Adding Redux/Zustand adds 45KB–120KB of minified JavaScript, increasing download time on metered bundles.
2. **Memory Overhead**: Storing full client state trees consumes precious RAM, risking browser tab crashes on entry-level devices.
3. **The "Stale Balance" Hazard**: Caching tuition debt in client memory leads to disputes if the bursar posts a payment while the parent's app is open. By querying the server directly for every balance view, the app always renders authentic server truth.

---

### Question 11: How does the login form preserve user input when transitioning from a failed login to a PIN reset?
**Answer**:
In [`components/auth-unified-form.tsx`](file:///c:/Users/HP/Desktop/Fees/components/auth-unified-form.tsx), when a parent attempts to sign in with an email address (`fatima.abubakar@example.com`) and fails because they forgot their 4-digit PIN, tapping "Forgot PIN" does not force them to retype their details.

The component inspects the local `identifier` state. If the string contains an `@` symbol, it automatically transfers the trimmed, lowercased string into the reset form’s `email` state and updates the URL to `/auth?mode=reset` via `window.history.pushState`. This eliminates frustrating mobile retyping on sluggish virtual keyboards while maintaining client state cleanliness.

---

### Question 12: What primary research insight from Mrs. Adebayo (Bursar) directly contradicted your initial software design?
**Answer**:
Our initial engineering design assumed that all tuition fees would be paid via automated Flutterwave card transactions in single lumpsums, and that the app balance could be updated in real time via webhooks.

Mrs. Adebayo revealed that over **85% of payments occur outside the app** (cash deposits at bank branches and POS counter payments) and that most families pay in staggered partial installments. Most critically, she explained that parents pay at the bank on Wednesday, but the bursar reconciles the paper ledger on Friday. If the app showed an outstanding debt on Thursday, parents accused the school of corruption. This revelation forced us to introduce the **"Posted Up To" Date Stamp** (`Student.postedUpTo`), explicitly displaying when the paper book was last reconciled.

---

### Question 13: What are the security flags configured on the `cha_fees_session` cookie, and what attack does each flag mitigate?
**Answer**:
The session cookie is configured with four mandatory security flags:
1. **`HttpOnly`**: Prevents client-side JavaScript (`document.cookie`) from accessing the session token, completely neutralizing Cross-Site Scripting (XSS) session theft.
2. **`Secure`**: Enforces that the cookie is transmitted strictly over TLS/HTTPS encrypted channels, preventing unencrypted plaintext sniffing on open Wi-Fi.
3. **`SameSite=Lax`**: Restricts cookie transmission on cross-origin requests, defending against Cross-Site Request Forgery (CSRF) while allowing normal top-level external navigation.
4. **`Path=/` & `Max-Age=1209600`**: Scopes the session across the entire domain and bounds token lifetime to exactly 14 days.

---

### Question 14: How does your rate limiter defend against brute-force attacks, and how was it intentionally defeated?
**Answer**:
Our rate limiter in [`lib/rate-limiter.ts`](file:///c:/Users/HP/Desktop/Fees/lib/rate-limiter.ts) implements a sliding-window counter allowing a maximum of 5 requests per 60 seconds per IP address on sensitive routes (`/api/auth/*`). A sixth attempt is blocked with `HTTP 429 Too Many Requests` and a `Retry-After: 60` header.

In Task Four, we proved how to **defeat this limiter** (`evidence/14-rate-limit-defeated.txt`): because the code extracted IP addresses directly from `request.headers.get('x-forwarded-for')` without validating upstream reverse-proxy trust, an attacker sent requests with rotating spoofed headers (`X-Forwarded-For: 198.51.100.42`). The server treated each spoofed header as a distinct client IP, resetting the counter and allowing unrestricted brute-force guessing.

---

### Question 15: How does the HaveIBeenPwned k-anonymity protocol protect user privacy while checking breached credentials?
**Answer**:
K-anonymity is a mathematical privacy guarantee where an entity cannot be distinguished from at least $k-1$ other entities.

When checking a student access code or PIN:
1. The server computes the SHA-1 hash of the candidate code.
2. The server extracts the first 5 hexadecimal characters (the prefix) and sends only those 5 characters to the HaveIBeenPwned API (`/range/{prefix}`).
3. The API returns a list of ~500 hash suffixes that share that same prefix.
4. The server compares the remaining 35 characters locally in memory.
Because the external service only ever receives the 5-character prefix, it is mathematically impossible for HaveIBeenPwned or any network eavesdropper to determine what code the user was testing.

---

### Question 16: Why is whole kobo integer arithmetic mandatory in school fees accounting, and what error does it eliminate?
**Answer**:
Computers represent decimal numbers using IEEE-754 binary floating-point representation. In floating-point math, numbers like `0.1` and `0.2` cannot be represented with exact precision, resulting in drift errors such as `0.1 + 0.2 = 0.30000000000000004`.

In a school fees ledger tracking millions of Naira across thousands of students, floating-point rounding causes ledger imbalances where debits and credits differ by fractions of a kobo, violating double-entry accounting rules and failing audit reconciliation. By storing all money as 64-bit integers representing **whole kobo** (`balanceKobo = 15000000n` for ₦150,000.00), every addition and subtraction is exact down to the last kobo.

---

### Question 17: What was the cause of the Neon PostgreSQL "OS Error 10054 ConnectionReset" and how did you resolve it?
**Answer**:
Neon serverless PostgreSQL suspends free compute instances after 5 minutes of idle time. While compute is suspended, the local Next.js dev server kept stale TCP sockets open in Prisma's connection pool. When a query was executed after an idle period, Windows received a TCP reset (`WSAECONNRESET` / OS 10054) because Neon had severed the idle socket.

We resolved this in [`lib/prisma.ts`](file:///c:/Users/HP/Desktop/Fees/lib/prisma.ts) by:
1. Extending Prisma Client via `$extends` query middleware to catch transient connection errors (10054, `ConnectionReset`).
2. Pausing for 1.2 seconds to allow Neon's serverless compute to wake up and re-establish the TCP handshake.
3. Automatically retrying the query, allowing requests to succeed transparently without false user rejections.

---

### Question 18: What are the three steps required to safely add a non-nullable column to a production database table?
**Answer**:
Adding a non-nullable column without a default to an existing table containing rows causes PostgreSQL to throw `column contains null values` and aborts the migration (`evidence/04-required-column-failure.txt`).

The zero-downtime production remedy requires three deterministic steps:
1. **Step 1: Add Column as Nullable**: Execute `ALTER TABLE "Student" ADD COLUMN "postedUpTo" TIMESTAMP WITH TIME ZONE NULL;` so existing writes succeed without violation.
2. **Step 2: Backfill Existing Data**: Execute an `UPDATE` query populating existing rows with deterministic default values or business timestamps.
3. **Step 3: Enforce Constraint**: Execute `ALTER TABLE "Student" ALTER COLUMN "postedUpTo" SET NOT NULL;` after every row has been safely backfilled.

---

### Question 19: Why must the hand-written row-level security migration (`migrations/0002_row_rules.sql`) be re-run whenever a new table is added?
**Answer**:
In PostgreSQL, Row-Level Security (RLS) is disabled by default on newly created tables. Prisma schema migrations generate standard relational DDL statements (`CREATE TABLE`, `ALTER TABLE`) but cannot generate or manage PostgreSQL RLS policies or application roles (`fee_parent`, `fee_staff`).

Whenever a migration adds or alters a table containing private records (such as `Session` or future audit logs), the administrator must explicitly re-execute [`migrations/0002_row_rules.sql`](file:///c:/Users/HP/Desktop/Fees/migrations/0002_row_rules.sql). This enables RLS (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) and grants explicit row-filtering policies, ensuring the database engine itself rejects unauthorized queries even if application code is compromised.

---

### Question 20: Cross-Task Consistency Verification (Defend Your Exact Machine Benchmarks)
**Question**: *Prove that your system implementations are consistent across all five tasks by citing the exact numbers and parameters from Tasks 1, 4, and 5.*

**Answer**:
Our implementation maintains exact, machine-verified consistency across all assessment tasks:
1. **Task 1 Typography Scale**: In [`task-01-design-system/docs/type-scale.md`](file:///c:/Users/HP/Desktop/Fees/task-01-design-system/docs/type-scale.md), the **Display Large** style for tuition balances is configured with a font size of **32px** and an exact line-height of **40px** (1.25 ratio) in DM Sans, while Body Medium is set to **15px** with a **24px** line-height.
2. **Task 4 Hashing Benchmarks**: In [`task-04-server-security/evidence/08-timing-argon-vs-sha.txt`](file:///c:/Users/HP/Desktop/Fees/task-04-server-security/evidence/08-timing-argon-vs-sha.txt), our hardware benchmark recorded Argon2id at **196.509 ms** (with parameters $m=65536, t=3, p=4$), while SHA-256 took **0.009157 ms**, proving Argon2id is **21,460 times slower**.
3. **Task 4 Rate Limiting Window**: In [`lib/rate-limiter.ts`](file:///c:/Users/HP/Desktop/Fees/lib/rate-limiter.ts), the sliding window enforces exactly **5 attempts per 60 seconds**, returning `HTTP 429` with `Retry-After: 60`.
4. **Task 5 Session Lifecycle**: In [`lib/session.ts`](file:///c:/Users/HP/Desktop/Fees/lib/session.ts), session tokens are **32-byte** CSPRNG values with a rolling **14-day** TTL (`1,209,600,000 ms`), while deletion cooling-off in [`lib/account-deletion.ts`](file:///c:/Users/HP/Desktop/Fees/lib/account-deletion.ts) is exactly **7 days** (`604,800,000 ms`).

---

### Question 21: Describe a real mistake made during this project, its exact code location, and how it was remediated.
**Answer**:
In [`app/api/auth/login/route.ts#L101-L106`](file:///c:/Users/HP/Desktop/Fees/app/api/auth/login/route.ts#L101), we attempted to perform a dual-handle lookup using a ternary operator inside the Prisma query:
```typescript
where: isEmail ? { email: { equals: identifier, mode: 'insensitive' } } : { phone: identifier }
```
Because TypeScript evaluated the object literal as a union type `{ email: ... } | { phone: ... }`, Prisma’s type definitions rejected the argument under strict excess property checks (`Property 'email' does not exist on type 'GuardianWhereInput'`), failing `npx tsc --noEmit`.

We remediated this by separating the query into explicit branches (`isEmail ? await prisma.guardian.findFirst(...) : await prisma.guardian.findUnique(...)`). This eliminated the union mismatch and restored clean type compilation.

---

### Question 22: If you had three more months to work on Fees, what single architectural feature would you build, and why?
**Answer**:
If granted three additional months, I would engineer a **Cryptographic Distributed Offline Reconciliation Engine** using SQLite / OPFS (Origin Private File System) on the client, synchronized via operational transforms to PostgreSQL.

Currently, if cellular towers go down in Ibadan during Friday fee collections, parents can view cached receipts via the Service Worker, but cannot submit offline payment declarations or receive cryptographically verifiable payment slips at the school gate. Building an append-only, signed local transaction queue with Ed25519 digital signatures would allow the bursar to scan a parent’s phone via QR code and issue an authenticated receipt offline, reconciling with the central Neon database when power and connectivity are restored.

