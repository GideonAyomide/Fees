# Task Five Step 1: Session Security Architecture

## 1. What Session Hijacking Is

Session hijacking occurs when an attacker obtains the session identifier of an authenticated user and uses it to impersonate that user without ever possessing their primary credentials (phone number and 4-digit PIN). 

In web applications, the session token functions as a temporary cryptographic bearer pass. Once the server accepts credentials and issues a cookie, subsequent HTTP requests do not include the password; they transmit the session token. If an attacker intercepts, exfiltrates, or predicts this token, the server cannot distinguish between HTTP requests sent by the legitimate parent and requests sent by the attacker. To the server's access control middleware, the attacker *is* the account owner.

---

## 2. How a Stolen Identifier Is Used

An attacker who obtains a valid session token (e.g. `8f358028949d3a5f...`) exploits it through direct HTTP request injection:
1. **Cookie Injection**: The attacker opens their own browser, opens Developer Tools, and manually sets `document.cookie = "cha_fees_session=8f358028949d3a5f..."`, or uses proxy tools like Burp Suite or `curl`:
   ```bash
   curl -H "Cookie: cha_fees_session=8f358028949d3a5f..." https://fees.crownheights.edu.ng/api/guardian/balance
   ```
2. **Accessing Private Data**: The server matches the hash of this token to the active session record in the database, retrieves the linked `guardianId`, and exposes student tuition balances, payment receipts, and family contact records.
3. **Triggering Unauthorized Actions**: The attacker can initiate payments or tamper with communication channels without being challenged for the PIN.

---

## 3. What Logging Out Does to a Session

A naive application logs out on the front end only: it deletes the cookie in the browser, clears client state, and redirects the user to the login form, leaving the session row alive in the database until natural expiration. If an attacker already copied the token, that token remains fully valid for days.

In Crown Heights Academy, **logging out is a mandatory server-side deletion**:
1. When the user clicks "Log Out", a `POST /api/auth/logout` request is dispatched to the backend.
2. The server extracts the session cookie, computes its SHA-256 hash, and immediately executes `DELETE FROM "Session" WHERE "tokenHash" = :hash`.
3. The server clears the cookie by responding with `Set-Cookie: cha_fees_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`.
4. Even if an attacker possesses the stolen token string, any subsequent request bearing it results in an immediate `HTTP 401 Unauthorized` because the corresponding hash no longer exists in the server database.

---

## 4. What Crown Heights Academy Does to Limit Damage if a Token Is Stolen

If a session token is stolen before logout, our application architecture limits the potential damage through six deliberate defense-in-depth controls:

### 1. Hash-at-Rest Database Storage
Session tokens are never stored in plaintext in the database. The database holds only the SHA-256 hash (`tokenHash`). If a database dump or backup file is stolen, an attacker cannot reverse the hashes into valid session cookies to hijack user accounts.

### 2. Cookie Security Flags
- **`HttpOnly`**: JavaScript cannot read the cookie (`document.cookie` returns nothing). Malicious third-party scripts or XSS vulnerabilities cannot exfiltrate the token.
- **`Secure`**: The cookie is transmitted strictly over TLS-encrypted connections, preventing interception on open Wi-Fi networks.
- **`SameSite=Lax`**: The browser refuses to attach the cookie on cross-site requests, mitigating Cross-Site Request Forgery (CSRF).

### 3. IP and User-Agent Forensic Binding
Each session record binds the original `ipAddress` and `userAgent`. While cellular IP roaming prevents strict IP blocking, sudden geographic or ASN jumps trigger heightened scrutiny.

### 4. Limited Scope Boundary (MVP Architecture)
Even with a valid session, the Fees portal deliberately contains **no write actions that can extract funds or alter legal records**:
- Parents cannot alter balances (balances are stamped by the Bursar).
- Money cannot be withdrawn or redirected (payments flow strictly into the school's own Flutterwave gateway).
- The legal cash book remains the official paper book.

### 5. Rolling Expiration Windows
Sessions are bounded to a 14-day rolling lifetime, with automatic background cleanup of stale records.

### 6. Universal Revocation on Password Reset
Resetting a security PIN instantly deletes **all** active session rows linked to that user across every browser and device (`destroyAllUserSessions`).

