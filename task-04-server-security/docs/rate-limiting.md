# Rate Limiting: Configuration, Bypass Vectors, and Architectural Limits

## 1. Rate Limiting Configuration
In the Crown Heights Academy Fees application, we implemented sliding window rate limiting on all public authentication boundaries (`/api/auth/activate`, `/api/auth/login`, and `/api/auth/reset`):
* **Window Duration**: 60 seconds (1 minute).
* **Maximum Requests**: 5 attempts per window.
* **HTTP Status Code**: `429 Too Many Requests` with standard `Retry-After: <seconds>` response header.

### Justification of the Numbers:
* **The 5-Attempt Ceiling**: A legitimate human parent typing their 11-digit phone number and 4-digit PIN makes at most 2 to 3 attempts if they mistype. Allowing 5 attempts accommodates normal human error while capping automated credential stuffers to at most 5 attempts per minute.
* **The 60-Second Window**: Long enough to destroy the economics of automated brute-force scripts, but short enough that a genuine parent who made typos is not permanently locked out or driven to call the school bursar during morning drop-off hours.

---

## 2. Why IP-Based Rate Limiting Alone Is Insufficient

Relying solely on client IP addresses as the rate limiting key fails against two opposite operational realities:

### Vector 1: Distributed Botnets & Cloud Egress Rotation
Modern automated attackers do not attack from a single fixed IP. Attackers use:
* **Residential Proxy Networks**: Rotating thousands of residential IP addresses for pennies.
* **Mobile IP Hopping**: Toggling airplane mode on mobile cellular interfaces to acquire a fresh CGNAT IPv4 address every few seconds.
* **Spoofed Headers**: If an application naively reads `X-Forwarded-For` without validating upstream reverse proxies, an attacker simply injects a random IP on every request.

### Vector 2: Carrier-Grade NAT (CGNAT) & Shared Corporate/School Networks
In Nigeria and emerging markets, telecom carriers (MTN, Airtel, Glo) place tens of thousands of mobile subscribers behind shared **Carrier-Grade NAT (CGNAT)** gateways. Furthermore:
* A school staff room sharing a single Starlink or fiber router presents all 40 teachers as one single IP address.
* If one teacher mistypes their PIN 5 times, **every other teacher in the school is locked out** of the fees portal.

---

## 3. What Serious Applications Key On (Beyond Raw IP)

To defeat distributed attacks without harming shared-network users, production-grade applications implement multi-dimensional composite keys:

1. **Target Account Identifier (Email or Phone Number)**:
   Keying counters on `auth:phone:${phone}` or `auth:email:${email}`. Even if an attacker rotates across 10,000 IP addresses, attempts targeting one specific guardian account accumulate against that account's lockout counter.
2. **Device & Browser Fingerprinting (Hardware Identifiers)**:
   Extracting stable client attributes (TLS client hello fingerprints, JA3/JA4 hashes, Canvas/WebGL rendering hashes, HTTP/2 header ordering) to track the physical device regardless of IP rotation.
3. **Behavioral Proof-of-Work (PoW) or Invisible CAPTCHA**:
   Requiring clients exceeding low thresholds to compute a cryptographic puzzle (e.g. Cloudflare Turnstile) before accepting subsequent submissions.

---

## 4. Counter Storage: In-Memory vs. Shared Distributed Stores

In this phase, rate limit counters are stored in an in-memory `Map` within the Next.js process.

### The Architectural Trade-Off:
* **In-Memory Store (Current)**:
  * *Advantage*: Zero external latency (<0.05ms lookup), zero infrastructure cost, zero external dependencies.
  * *Disadvantage*: Counters do not survive server restarts. In multi-instance serverless deployments (e.g. Vercel serverless functions), each lambda container maintains an isolated memory space, allowing an attacker to spread requests across multiple parallel instances.
* **Distributed Shared Store (Redis / Upstash)**:
  * *Advantage*: Global consistency across all serverless regions and instances; atomic increment commands (`INCRBY`, `EXPIRE`) guarantee exact synchronization.
  * *Disadvantage*: Adds 5–15ms of network latency per request and introduces an infrastructure dependency that must be configured to fail open or closed during Redis outages.

