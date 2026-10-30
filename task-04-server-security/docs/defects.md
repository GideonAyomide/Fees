# Task Four Step 13: Real Defects, File References, and Production Costs

## Overview
A project claiming zero defects in security engineering is either trivial or misrepresenting its work. Every architectural decision introduces trade-offs and edge-case failure modes. This document identifies four real defects in our implementation, citing exact file paths and line numbers, and analyzing their potential cost in a production environment.

---

## Defect 1: In-Memory Rate Limiting State Reset on Serverless Scaling & Restarts
- **File Reference**: [`lib/rate-limiter.ts`](file:///c:/Users/HP/Desktop/Fees/lib/rate-limiter.ts#L8-L9)
- **Code**:
  ```typescript
  // In-memory counter store for rate-limiting
  const store = new Map<string, RateLimitRecord>();
  ```

### Mechanism
The rate-limiting counters are maintained inside a transient in-memory Node.js `Map` (`store`). When deployed on serverless hosting (Vercel) or a multi-instance container cluster (AWS ECS/Kubernetes), each serverless invocation or replica spins up with an empty `Map`. Furthermore, any server process reboot or routine redeployment purges all active lockout counters.

### Production Cost
An attacker attempting brute-force PIN guessing or credential stuffing can bypass the 5-attempt rate limit by distributing concurrent HTTP requests across multiple Vercel edge instances or simply waiting for server cold-start recycling. In production, this defect allows automated distributed brute-force attacks unless counters are migrated to a shared, persistent Redis store (e.g., Upstash Redis) with atomic `INCR` and `EXPIRE` operations.

---

## Defect 2: Untrusted Header Spoofing in Client IP Extraction
- **File Reference**: [`lib/rate-limiter.ts`](file:///c:/Users/HP/Desktop/Fees/lib/rate-limiter.ts#L26-L28)
- **Code**:
  ```typescript
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = (forwarded ? forwarded.split(',')[0].trim() : realIp) || '127.0.0.1';
  ```

### Mechanism
The rate limiter blindly trusts the first entry in the incoming `X-Forwarded-For` HTTP header supplied by the HTTP client. Because any client or command-line utility (`curl`, PowerShell `Invoke-RestMethod`) can inject arbitrary `X-Forwarded-For: <fake-ip>` values, an attacker can rotate IP strings programmatically on every request (as demonstrated in `evidence/14-rate-limit-defeated.txt`).

### Production Cost
This allows any script kiddie with a basic proxy-header rotation loop to completely neutralize the rate-limiting defense. In production, the reverse proxy (Vercel Edge, Cloudflare, or NGINX) must be configured to strip untrusted upstream headers and append the true client IP to a trusted, unforgeable header (`CF-Connecting-IP` or the rightmost trusted hop in `X-Forwarded-For`).

---

## 3. Defect 3: Fail-Open Vulnerability on Breached Credential Check Timeout
- **File Reference**: [`lib/breach-check.ts`](file:///c:/Users/HP/Desktop/Fees/lib/breach-check.ts#L45-L48)
- **Code**:
  ```typescript
  if (!response.ok) {
    // If external API fails, fail open to avoid blocking legitimate user registration
    return { breached: false, count: 0 };
  }
  ```

### Mechanism
The breached password checker relies on an external HTTP request to HaveIBeenPwned's range API with a 5-second timeout. If the external API is unreachable, times out, or returns a 5xx error, the catch block and error handler return `{ breached: false, count: 0 }`.

### Production Cost
An attacker can deliberately degrade or block outbound network connectivity to `api.pwnedpasswords.com` (e.g., via DNS poisoning or packet flooding) to force the registration handler into a permanent "fail-open" state. Once in this state, compromised and leaked activation codes pass into the database without restriction.

---

## 4. Defect 4: Verification Code Non-Idempotency on Network Retries
- **File Reference**: [`lib/email-service.ts`](file:///c:/Users/HP/Desktop/Fees/lib/email-service.ts#L107-L113)
- **Code**:
  ```typescript
  // 1. Reused Code Check
  if (record.used) {
    return {
      success: false,
      status: 'ALREADY_USED',
      error: 'This verification code has already been used. Please log in or request a new code.',
    };
  }
  ...
  // Success: mark used immediately
  record.used = true;
  ```

### Mechanism
When a valid 6-digit verification code is entered, the server marks `record.used = true` immediately upon verification. In mobile network conditions common across Nigeria, mobile browsers frequently encounter a socket disconnect on the return response path. When the browser or parent automatically resubmits the request, the second attempt is rejected as `ALREADY_USED`.

### Production Cost
A legitimate parent who has successfully verified their account receives an intimidating error stating their code has already been used, inducing panic that someone else has compromised their child's account. This leads to unnecessary emergency phone calls to the school Bursar. A production-ready implementation must include an idempotency grace window (e.g., if re-verified by the same IP/session within 30 seconds, return `HTTP 200 (Already Verified)`).

