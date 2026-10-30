# Task Four Step 13: Technical Interview Defense Answers

---

### Hashing

#### 1. Why should you hash passwords?
Passwords must be hashed because a database containing user credentials is a high-value target that will inevitably be targeted by attackers, rogue insiders, or exposed through backups and misconfigured storage buckets. Hashing is a one-way mathematical function that converts a plaintext password into an irreversible fixed-length digest. If an attacker dumps the `Guardian` table, raw passwords are never revealed. Because users frequently reuse the same password across multiple high-stakes services (such as banking, personal email, and corporate accounts), storing plaintext credentials exposes customers to catastrophic collateral account takeovers. A properly designed hash allows the server to verify that an incoming password matches without ever storing, seeing, or needing the plaintext original.

*(118 words)*

---

#### 2. Why use bcrypt instead of SHA-256 for passwords?
SHA-256 was engineered for high-throughput data integrity checks, such as verifying multi-gigabyte file transfers. It executes in microseconds (9.16 µs on our machine). Because it requires virtually no memory and evaluates trivial math, modern GPUs and ASIC mining rigs compute billions of SHA-256 hashes per second. If an attacker steals a database of SHA-256 password hashes, they can precompute rainbow tables or brute-force billions of candidate passwords per second offline.

In contrast, bcrypt (and Argon2id) is an adaptive, slow password-hashing function designed deliberately to consume significant CPU cycles and memory. By configuring a high work factor, computing a single bcrypt hash takes ~100–250 milliseconds. For a legitimate user logging in once, a 200ms delay is imperceptible. For an attacker attempting billions of guesses against a stolen table, that same 200ms delay transforms a 1-day dictionary attack into centuries of impossible computation.

*(149 words)*

---

#### 3. What is a salt and why do you need it?
A salt is a unique, cryptographically random string (typically 16 bytes or 128 bits of entropy) generated uniquely for each user and concatenated with their password before hashing. The salt is stored in plaintext alongside the resulting hash in the database.

A salt is mandatory for two critical reasons:
1. **Defeating Rainbow Tables**: Precomputed lookup tables (rainbow tables) map billions of common passwords to their corresponding hash digests. Salting guarantees that even if ten million users pick `"password123"`, every single stored hash in the database is completely unique.
2. **Preventing Bulk Cracking**: Without a salt, an attacker cracking a stolen table hashes a candidate word once and checks it against every user simultaneously. With a unique salt per row, the attacker is forced to recompute the expensive hash separately for every individual user in the database.

*(138 words)*

---

#### 4. What salt rounds, or what work factor, should you use? Give a number and defend it.
For bcrypt, use **cost factor 12** (or for Argon2id, use $m=65536$ KB, $t=3$ iterations, $p=4$ parallelism).

This number is defended by balancing server throughput against hardware offline resistance:
- On modern server hardware, cost factor 12 produces an execution latency between **150ms and 250ms** per hash.
- An interactive user waiting on a login button cannot perceive a 200ms delay; it feels instantaneous.
- However, for an attacker, a single consumer GPU (e.g. RTX 4090) that normally computes 10 billion SHA-256 hashes per second can only test ~1,000 to 2,000 bcrypt/Argon2 hashes per second.
- Setting the work factor below 10 allows fast offline cracking; setting it above 14 introduces a 1–2 second CPU pause that leaves the web server vulnerable to Denial of Service (DoS) attacks under normal concurrent user load.

*(143 words)*

---

#### 5. You are storing user passwords in a database. Of plain text, SHA-256, AES-256 encryption and adaptive hashing, which is correct and why are the other three wrong? Note that one of the three wrong answers is wrong for a different reason from the other two.
**Adaptive hashing** (Argon2id or bcrypt) is the only correct choice because it is one-way, irreversible, salted by default, and configurable with a computational work factor that neutralizes offline brute-force attacks.

The other three are wrong for distinct architectural reasons:
1. **Plain text is wrong** because zero security exists; anyone with read access to the database, backups, or query logs instantly obtains every user's raw password.
2. **SHA-256 is wrong** because, although it is a one-way hash, it is non-adaptive and catastrophically fast. Attackers test billions of combinations per second on commercial GPUs.
3. **AES-256 encryption is wrong for a fundamentally different reason**: it is **reversible two-way encryption**. Encryption requires an encryption key. The moment that key is compromised (via source code repository leak, environment variable exposure, memory dump, or compromised server), every single password in the database can be decrypted back to plaintext. A password system must never be reversible.

*(154 words)*

---

### Validation

#### 6. Why is client-side validation not enough?
Client-side validation runs inside the user's browser, which is an entirely untrusted environment controlled by the client. An attacker does not interact with an application through the browser UI; they use command-line utilities (`curl`, Postman, PowerShell), proxy tools (Burp Suite), or automated scripts that send HTTP POST payloads directly to the server endpoint.

When requests bypass the browser DOM:
- HTML `required` attributes, regex `pattern` properties, and JavaScript validation listeners never execute.
- Disabled submit buttons and hidden elements are completely ignored.
- Arbitrary, unconstrained strings, SQL injection fragments, or oversized payloads reach the server unimpeded.

Client-side validation exists strictly as a user experience convenience—to provide immediate inline visual guidance and prevent needless network roundtrips for honest users. Only server-side boundary validation acts as a security perimeter.

*(132 words)*

---

#### 7. What security checks belong in the frontend, and what must the server enforce regardless?
**Frontend Checks (UX Convenience Only):**
- Immediate visual format hints (e.g. verifying phone number digits or email structure on blur).
- Responsive character counters and button state toggling to prevent accidental double-submits.
- Hiding irrelevant UI controls based on the active client role.
- Masking password fields visually from shoulder surfers.

**Server-Side Invariants (Mandatory Security Enforcement):**
- **Strict boundary schema parsing**: Enforcing data types, maximum byte lengths, character whitelists, and structural regex.
- **Data normalization**: Stripping whitespace, lowercasing emails, and canonicalizing phone numbers.
- **Cryptographic integrity**: Slow adaptive hashing (Argon2id) and breached credential checks.
- **Authorization & Access Control**: Verifying whether the session token belongs to the requesting user and has permission to execute the action.
- **Rate limiting**: Protecting endpoints against automated stuffing and denial of service.

The server must assume every incoming payload was crafted by a hostile attacker.

*(142 words)*

---

#### 8. The user interface hides the delete button for non-administrators. Is that enough? If not, what does an attacker do instead?
Hiding the delete button in the UI is completely useless as a security control. It is security through obscurity.

The browser client is under the absolute control of the user. An attacker simply opens Developer Tools (F12) to inspect the DOM, unhides the button, or identifies the API endpoint in the Network tab (e.g., `DELETE /api/students/:id`). More commonly, the attacker skips the browser entirely and issues a direct HTTP request via `curl`:
```bash
curl -X DELETE https://school.edu.ng/api/students/CHA-042 -H "Cookie: session=..."
```
If the server endpoint relies on the UI to restrict actions rather than inspecting the authenticated session’s role in middleware or route handlers, the server will execute the unauthorized deletion. Access control (authorization) must be enforced at the server boundary on every single request.

*(131 words)*

---

#### 9. What is the difference between validation, encoding and sanitisation?
- **Validation** is a gatekeeper. It inspects an incoming value against an explicit, strict schema (type, length, shape, allowed characters) and rejects the entire request with an error (`HTTP 400`) if the data fails. It answers: *"Does this data conform to our rules?"*
- **Sanitisation** mutates data to make it safe or normalized before processing. Examples include stripping HTML tags, trimming leading/trailing whitespace, or lowercasing email addresses. It answers: *"How do we clean this data so it conforms?"*
- **Encoding** transforms data into a different character representation so that it is interpreted strictly as data rather than executable code by the consumer. Examples include HTML entity encoding (`<` to `&lt;`) to prevent Cross-Site Scripting (XSS), or URL percent-encoding. It answers: *"How do we safely display or transmit this data without changing its meaning?"*

*(138 words)*

---

#### 10. Why would you replace the incoming request body with the parsed and validated data rather than leaving both available?
Leaving the raw request body available alongside parsed data is a severe security vulnerability. 

If both are accessible in the request context, downstream developers or third-party middleware may accidentally reference properties from `req.body` instead of `req.validData`. This creates:
1. **Mass-Assignment Vulnerabilities**: An attacker injects hidden properties (e.g., `{ "phone": "08012345678", "role": "ADMIN", "isSuperuser": true }`). While a schema validator ignores or strips them, an ORM call using `rawBody` will persist the elevated privileges directly into the database.
2. **Bypass of Normalization**: Handlers using the raw body miss boundary transformations (such as trimmed whitespace and lowercased email addresses), causing query failures or subtle authentication bugs.

Replacing the raw body with `result.data` ensures that only validated, sanitized, and type-safe properties exist in memory for downstream handlers.

*(136 words)*

---

#### 11. Why validate route parameters and query strings, not just the body?
Route parameters (`/api/students/[id]`) and query parameters (`/api/records?limit=10&page=1`) enter the application through untrusted HTTP URLs. Validating only the JSON body leaves these URL attack surfaces wide open.

Attackers routinely target URL parameters for:
1. **SQL / NoSQL Injection**: Injecting malicious syntax into query strings (e.g., `?studentId=' OR 1=1--`).
2. **Path Traversal**: Supplying `../../etc/passwd` inside file or resource parameters.
3. **Integer Overflow & DoS**: Submitting `?limit=9999999999` to force the database into allocating gigabytes of memory or crashing the connection pool.
4. **Type Confusion**: Passing arrays instead of primitives (e.g. `?id[]=1&id[]=2`) to exploit framework parameter parsing bugs.

Route and query inputs must be validated against strict schemas (e.g. UUID, positive bounded integer) before touching any internal database query.

*(136 words)*

---

### Rate Limiting

#### 12. How do you rate limit unauthenticated requests, and what is the problem with the header you would reach for first?
Unauthenticated requests are rate limited by keying against client network identifiers, primarily the client IP address.

The critical vulnerability lies in the header developers reach for first: `X-Forwarded-For`. 

`X-Forwarded-For` is an arbitrary HTTP request header. Any HTTP client or command-line tool can spoof it:
```bash
curl -H "X-Forwarded-For: 198.51.100.42" https://fees.app/api/auth/login
```
If the server naively reads `headers.get('x-forwarded-for')`, an attacker can rotate a fake IP string on every request, resetting their rate-limiting counter and brute-forcing passwords with impunity.

In production, rate limiters must rely on socket addresses (`socket.remoteAddress`) or read unforgeable reverse proxy headers (`CF-Connecting-IP` in Cloudflare) configured to drop untrusted client headers at the network ingress boundary.

*(122 words)*

---

#### 13. Which rate limiting algorithm would you choose for a production API, and what is the boundary burst problem?
For a production API, I would choose the **Sliding Window Counter** or **Token Bucket** algorithm.

The **Boundary Burst Problem** occurs in naive **Fixed Window** algorithms. In a fixed window allowing 100 requests per minute reset at the top of each clock minute (12:00:00, 12:01:00):
- An attacker sends 100 requests at 12:00:59 (the end of the first window).
- The clock ticks to 12:01:00, resetting the counter.
- The attacker immediately fires another 100 requests at 12:01:01 (the start of the second window).

Within a two-second interval, the server processes 200 requests—**twice the intended rate limit**. This burst can crash database connection pools or trigger upstream rate limits. A Sliding Window algorithm tracks previous window weights, smoothing boundaries and preventing burst spikes.

*(136 words)*

---

#### 14. Why use a shared store for your counters rather than in-memory counters on each server?
In-memory counters store rate-limiting state inside the local memory heap of a single Node.js process (e.g., in a `Map`).

This architecture fails in modern production environments:
1. **Multi-Instance / Serverless Scaling**: In clustered environments, Kubernetes pods, or serverless deployments (Vercel/AWS Lambda), requests are distributed across multiple isolated server instances. An attacker sending 100 requests across 10 server instances hits each node only 10 times, bypassing the 5-attempt limit.
2. **Process Recycling & Deployments**: Every routine code deployment, pod reschedule, or server restart wipes local memory clean, resetting all active lockout records to zero.

A shared, centralized store (such as Redis) maintains global atomic counters (`INCR`, `EXPIRE`), ensuring rate limits are universally enforced regardless of how many server replicas handle incoming traffic.

*(134 words)*

---

#### 15. What HTTP status code should a rate limiter return, and why is 403 the wrong choice?
A rate limiter must return **`HTTP 429 Too Many Requests`**, accompanied by a standard `Retry-After: <seconds>` response header indicating when the client may retry.

`HTTP 403 Forbidden` is the wrong choice because it denotes an **authorization failure**. A 403 status informs the client: *"The server understood your request, but refuses to authorize it because you do not have permission, regardless of how many times you try."*

In contrast, a rate-limited request is not unauthorized; the client's credentials may be completely valid, but they have temporarily exceeded their allocated velocity budget. Returning 403 misleads client applications, corrupts telemetry, prevents automated clients from executing standard exponential backoff retries, and obscures whether an issue is an access-control bug or a traffic-throttling event.

*(128 words)*

---

#### 16. What do you do when your rate limit store is unavailable: fail open or fail closed? Answer for your own application specifically.
For Crown Heights Academy's Fees application, the system **fails open for login and balance viewing, but fails closed for account activation and password reset**.

Here is why:
- **Authentication & Fee Viewing (Fail Open)**: When a rural parent is standing in line at the school gate during resumption week trying to verify that their tuition payment cleared, an infrastructure outage in our Redis cluster must not prevent them from viewing their balance or receipts. Failing closed would lock every parent out of the school portal during a high-stakes moment.
- **Account Activation & PIN Reset (Fail Closed)**: These endpoints create identities and issue cryptographic verification codes. If our rate limiter is down, an attacker could flood the SMS/email gateway or brute-force slip codes. We fail closed on account creation to protect credential integrity.

*(145 words)*

---

### Work-Specific Questions

#### 17. You have two timing numbers for hashing, from your own machine. Walk me through what they mean for an attacker who has stolen your user table.
On our benchmarked machine (`evidence/08-timing-argon-vs-sha.txt`):
- **Argon2id**: **196.509 ms** per hash
- **SHA-256**: **0.009157 ms** (9.16 µs) per hash
- **Speed Ratio**: Argon2id is **21,460 times slower**.

For an attacker who dumps the `Guardian` table:
1. **Against SHA-256**: An attacker testing a wordlist of 1,000,000 candidate passwords against a stolen SHA-256 hash executes the entire dictionary in **9.15 seconds** using a single standard CPU thread. On a modern gaming GPU running Hashcat, that same 1,000,000-word crack finishes in under **2 milliseconds**.
2. **Against Argon2id**: Computing 1,000,000 guesses using Argon2id requires:
   $$1,000,000 \times 0.1965\text{ s} = 196,500\text{ seconds} \approx \mathbf{54.58\text{ hours}}$$
   Because Argon2id demands 64 MB of RAM per hash ($m=65536$), GPUs cannot parallelize billions of threads without running out of high-speed memory.

A 200ms delay costs an authentic parent logging in nothing, but forces an attacker into computational insolvency.

*(154 words)*

---

#### 18. How does a breached password check avoid sending the password anywhere? Explain the mechanism in your own words, then say what the naive version would leak.
Our implementation uses **k-Anonymity** via the HaveIBeenPwned range API (`lib/breach-check.ts`):
1. The server hashes the user's password using SHA-1 (e.g. `749201` $\rightarrow$ `A94A8FE5...`).
2. The server slices the 40-character hex hash into two pieces: a **5-character prefix** (`A94A8`) and a **35-character suffix** (`FE5CCB19...`).
3. The server sends **only the 5-character prefix** to the API (`GET /range/A94A8`).
4. The API returns a list of hundreds of anonymous hash suffixes that share that same 5-character prefix, along with their breach counts.
5. The server searches that list locally in memory for our 35-character suffix.

**What the naive version would leak**:
A naive implementation would send the plaintext password or full SHA-1 hash over the network to a third-party API. Doing so hands the third-party service every user's credential in transit, creating a catastrophic single point of failure and violating data privacy laws.

*(153 words)*

---

#### 19. Wrong-answer analysis. A candidate says: "I hash passwords with SHA-256 plus a random salt per user, which means even if the database is stolen the passwords cannot be reversed, because hashing is one-way. I also rate limit login attempts by IP, so brute force is not possible." Every sentence contains something true. Say what is wrong, in order of severity, and what the candidate has misunderstood about the threat model.
The candidate fundamentally misunderstands the **threat model of an offline database breach**.

Here are the flaws in order of severity:

1. **Fatal: Believing IP rate limiting stops brute force (Severity: Critical)**:
   The candidate confuses an *online attack* against a web server with an *offline attack* against a stolen database. When an attacker dumps the database, the server, its network, and its IP rate limits are no longer involved. The attacker runs cracking software on their own private GPU rig with zero rate limits.

2. **Severe: Claiming salted SHA-256 cannot be reversed (Severity: High)**:
   While SHA-256 is mathematically one-way, it is not irreversible in practice against dictionary passwords. Because SHA-256 takes only 9 microseconds, a salted dictionary attack on an offline dump easily checks tens of millions of candidate words per second.

3. **Minor: Salting only stops rainbow tables, not fast hashing (Severity: Medium)**:
   A salt prevents an attacker from cracking all users simultaneously with precomputed tables, but it does nothing to slow down an attacker targeting an individual user using high-speed hardware.

*(172 words)*

