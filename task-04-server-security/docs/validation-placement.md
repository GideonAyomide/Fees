# Task Four Step 6: Server Boundary Validation Placement

## 1. Where Validation Sits in the Request Lifecycle

In Crown Heights Academy's Fees application, validation is an architectural perimeter, not a feature inside the business logic. It sits at the absolute boundary between the untrusted outside network and the trusted application core.

```
[ Incoming HTTP Request ]
          │
          ▼
1. IP Extraction & Rate Limiting (checkRateLimit)
          │
          ▼
2. Schema Boundary Validation (Zod safeParse) ──[ Invalid ]──► HTTP 400 Bad Request (Stops immediately)
          │ (Valid, Trimmed & Normalized)
          ▼
3. Boundary Sanitization & Normalization (Lowercased email, trimmed PIN)
          │
          ▼
4. Credential Hygiene / Breach Check (checkPasswordBreach)
          │
          ▼
5. Database Lookups & Operations (Student ID verification, Argon2id slow hashing)
          │
          ▼
6. Background Job Dispatch (Async Email Verification Dispatch)
          │
          ▼
[ HTTP 200 / 201 Response ]
```

---

## 2. What Runs Before Validation

Only operations required to protect the server's availability may run before validation:
1. **Network Layer Rate Limiting**: The client IP address is extracted from headers/socket and evaluated against our sliding-window rate limiter. If an IP exceeds 5 requests per 60 seconds, it is rejected with `HTTP 429 Too Many Requests` before JSON body parsing consumes server CPU and memory.
2. **Payload Size Clamping**: Next.js and Node.js stream parsers enforce a maximum request body buffer size (e.g., 1MB) to prevent buffer-exhaustion Denial-of-Service attacks.
3. **JSON Deserialization**: The raw byte stream is converted to an untrusted JavaScript object via `request.json()`. Any JSON syntax error triggers an immediate `HTTP 400`.

---

## 3. What Must NEVER Run Before Validation

Under no circumstances should any of the following occur prior to successful schema validation:
1. **Database Queries**: Never query the database (e.g. `SELECT * FROM "Student" WHERE "phone" = ...`) before validating that the input is a valid Nigerian phone number and the student ID meets the regex shape. Running queries on unvalidated input invites SQL injection, forces unnecessary connection-pool exhaustion, and leaks database query overhead.
2. **Slow Hashing Algorithms**: Argon2id requires significant CPU time and memory (~196.5 ms and 64 MB of RAM per call on our machine). Calling Argon2id before validating the field lengths would allow an attacker to send arbitrary garbage payloads and peg the server's CPU cores at 100%.
3. **External Service Calls**: Never call SMTP servers, payment gateways (Flutterwave), or external APIs before ensuring all required fields are present and structurally valid.
4. **Session Issuance**: Never issue cookies or tokens until every constraint is validated.
5. **Business Logic or File Operations**: Access control, ledger mutations, or file operations must never execute against unverified shapes.

---

## 4. Why Manual Route-Handler Validation Is Worse Than a Schema

Developers often write manual validation in route handlers because an `if (!req.body.phone) return res.status(400)` looks simple and requires no dependencies. In practice, manual validation is vastly inferior for five architectural reasons:

### 1. Incomplete Coverage and Type Narrowing Failure
In TypeScript, manual `if` statements do not produce safe, compile-time type narrowing across nested objects. Zod’s `safeParse` returns a strongly typed `result.data` where every property is guaranteed to match the runtime schema. Without a schema, developers frequently validate `phone` and forget `slipCode`, leading to unhandled `undefined` runtime exceptions deep in the database layer.

### 2. Failure to Strip Unknown / Injected Properties
Manual checks only verify properties the developer remembered to inspect. If an attacker submits `{ "phone": "08012345678", "role": "ADMIN", "isSuperuser": true }`, manual property checks pass because `phone` exists. If that object is later passed to an ORM or update method, mass-assignment vulnerabilities occur. A schema validator strips or rejects unexpected fields at the perimeter.

### 3. Co-location of Validation, Normalization, and Transformation
Zod schemas unify structural validation with data sanitization. In our `activateSchema`:
```typescript
email: z.string().trim().toLowerCase().email(),
studentId: z.string().trim().toUpperCase().min(4),
pin: z.string().trim().regex(/^\d{4}$/)
```
Trimming whitespace and lowercasing email occurs automatically during parsing. Hand-written route handlers require scattered `trim()` and `toLowerCase()` calls across multiple files, creating discrepancies where one handler normalizes and another forgets.

### 4. Single Source of Truth for Client and Server
Zod schemas can be shared between the client UI form and the backend API route handler. This guarantees that client-side visual aids and backend security gates speak the exact same language and return identical error messages, preventing edge-case desynchronization.

### 5. Structured, Machine-Readable Error Formats
Manual validation typically returns the first error it encounters with inconsistent strings. Zod evaluates the entire payload, returning structured field-level maps (`fieldErrors`) with specific issue codes, enabling accessible UI error mapping without brittle string regexing.

---

## 5. Timing Analysis: What Causes the "Two-to-Three Second Delay"

In our hardware benchmarks (`evidence/11-validation-timing.txt`):
* Pure in-memory Zod schema validation: **0.0318 ms** per request.
* Rejection of invalid payloads: **2.00 ms** total server execution.
* Full valid request with external breach verification: **895.48 ms** (cold: **2,164.20 ms**).

The 2-to-3 second latency observed in classroom experiments is **never caused by schema parsing**. It is caused by:
1. Synchronous outbound network requests (e.g. HaveIBeenPwned API calls or DNS lookups) executed inside the validation hook.
2. Synchronous SMTP connection handshakes to remote mail providers (e.g. Gmail / SendGrid) blocking the request thread.
3. Database connection pool initialization on remote serverless databases (Neon).

By ensuring that schema parsing runs synchronously in memory (< 1 ms), and pushing external tasks (like email delivery) to background processes, the server remains responsive and resilient under attack.

