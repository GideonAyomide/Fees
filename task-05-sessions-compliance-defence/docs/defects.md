# Task Five: Defects & Production Risk Analysis

**Application**: Fees — Crown Heights Academy  
**Scope**: Codebase Defects, Vulnerability Line References, and Operational Cost Analysis  
**Curriculum Requirement**: Page 35–36 (`docs/defects.md`)

---

## 1. Summary of Identified Defects in Session & Deletion Architecture

A senior engineering submission must account for its real failure modes. In Task Five, we identified and cataloged four authentic production defects across our session management, logout, and deletion pipelines:

---

### Defect 1: In-Memory Session Storage Loss on Serverless Worker Restarts
- **File & Line**: [`lib/session.ts#L42`](file:///c:/Users/HP/Desktop/Fees/lib/session.ts#L42)
  ```typescript
  const sessionStore = new Map<string, SessionData>();
  ```
- **The Defect**: While sessions are asynchronously persisted to PostgreSQL, the fast session resolution path in `getSession` relies on an in-memory Node.js `Map` (`sessionStore`).
- **Operational & Production Cost**: In a multi-instance serverless deployment (such as Vercel Edge/Serverless functions or AWS Lambda), each incoming request may hit a different cold-started microVM that lacks the in-memory map entry. Parents who just signed in can experience intermittent session drops, forcing them to re-enter their PIN while standing at the school gate.
- **Remediation**: Back the session store with a low-latency distributed Redis cache (e.g. Upstash Redis) or query PostgreSQL session rows directly with read-replica connection pooling.

---

### Defect 2: Client-Server Desynchronization on Logout Network Failure
- **File & Line**: [`app/api/auth/logout/route.ts#L9-L38`](file:///c:/Users/HP/Desktop/Fees/app/api/auth/logout/route.ts#L9)
- **The Defect**: If a parent clicks "Sign Out" and their mobile data connection drops before the HTTP POST reaches `/api/auth/logout`, client-side script clears the browser cookie, but the server session record remains active in the database.
- **Operational & Production Cost**: A zombie session remains alive on the server until the 14-day rolling TTL expires. If an attacker had intercepted the token prior to the network drop, they can continue making API requests even though the parent believes they logged out.
- **Remediation**: Implemented the multi-layer mitigation in [`evidence/10-logout-edge-case-fixed.txt`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/evidence/10-logout-edge-case-fixed.txt): immediate server-side revocation on password reset (`destroyAllUserSessions`) and bounding rolling TTLs to deterministic expiry.

---

### Defect 3: Cron Purge Batch Lock Contention Under High Deletion Volumes
- **File & Line**: [`lib/account-deletion.ts#L107-L150`](file:///c:/Users/HP/Desktop/Fees/lib/account-deletion.ts#L107)
- **The Defect**: The scheduled purge executes inside a single monolithic loop, updating `Guardian` rows and reading `Payment` rows synchronously.
- **Operational & Production Cost**: If hundreds of deletion requests mature on the same day (e.g. at the end of the school year when a graduating class leaves), acquiring row-level locks sequentially can cause database connection pool exhaustion and transaction timeouts, stalling incoming parent fee payments.
- **Remediation**: Batch purges into small chunked cursor transactions (e.g. 50 records per batch) with intermediate sleep pauses (`SET lock_timeout = '2s'`).

---

### Defect 4: Unauthenticated Proxy Header Trust in Staff Role Validation
- **File & Line**: [`middleware.ts#L49`](file:///c:/Users/HP/Desktop/Fees/middleware.ts#L49)
  ```typescript
  const isStaffSession = request.cookies.get('cha_staff_role')?.value === 'BURSAR';
  ```
- **The Defect**: The Edge Middleware verifies the `cha_staff_role` cookie name and value, but does not cryptographically sign the role claim with an HMAC secret key at the edge.
- **Operational & Production Cost**: If an attacker discovers the cookie name, they could attempt to forge the cookie on an unencrypted or vulnerable network client, bypassing role-based route checks.
- **Remediation**: Sign the session token with an HMAC SHA-256 JWT containing role claims or perform an edge database lookup against the hashed token in PostgreSQL.

