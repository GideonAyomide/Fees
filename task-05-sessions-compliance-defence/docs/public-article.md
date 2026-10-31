# Why We Made Password Hashing 21,000x Slower: Engineering Authentication for Low-End Android Phones in Nigeria

**Author**: Lead Software Engineer, Fees Project  
**Publication Target**: Substack Engineering Journal / LinkedIn Tech Essay  
**Word Count**: ~1,500 Words  
**Tags**: Software Architecture, Cybersecurity, Cryptography, Next.js, Engineering Trade-Offs, Africa Tech

---

### The Siren Call of Modern Web Development
In contemporary web engineering, the dominant obsession is speed. We benchmark Time to Interactive down to the millisecond, shave kilobytes from JavaScript bundles, deploy edge functions in Frankfurt and Virginia to save 12ms of round-trip network latency, and pride ourselves on blazing-fast response times. 

So when our team deliberately chose a cryptographic password-hashing algorithm that is **21,460 times slower** than standard hashing, it raised immediate eyebrows during code review. 

Why would any engineer building a school fees management system for Nigerian parents—many of whom are running Android 9 on inexpensive handsets connected to congested 3G cell towers—intentionally inject a 200-millisecond compute pause into the authentication pipeline?

The answer lies in understanding the brutal economics of modern database leaks, the mathematics of parallel offline cracking, and the ethical responsibility of software engineers who build for communities with no technical recourse.

---

### The Context: A School in Ibadan
The application we were building is called **Fees**, an installable web app for Crown Heights Academy, a private school in Ibadan, Nigeria. 

The primary user of Fees is not a Silicon Valley tech enthusiast with a multi-gigabit fibre connection and the latest iPhone. It is a parent who opens the app perhaps six to eight times a term. They own a modest smartphone, purchase mobile data in small daily bundles, contend with frequent municipal power cuts, and have nobody technical to help them when software breaks. 

More importantly, the data this app handles is intensely sensitive: confidential tuition debt, fee balances, and payment receipts. In many Nigerian communities, exposing what a family owes the school is not merely a privacy infraction; it is a profound social indignity that can lead to family estrangement, legal battles, or child stigmatization.

When building the authentication system for these parents, we were faced with an immediate foundational question: *How should we store their 4-digit security PINs?*

---

### The Naive Path: Fast Hashes and the Catastrophe of Leaks
Many junior developers, when tasked with securing a password or PIN, reach for SHA-256 or MD5. The reasoning seems sound on the surface: SHA-256 is an established cryptographic primitive, natively supported in every language runtime, and virtually instantaneous. On our local development hardware, computing a SHA-256 hash takes **0.0091 milliseconds**. 

That means a single server can process 100,000 hashes per second without breaking a sweat. It feels efficient. It feels clean.

It is also an absolute death sentence for user security.

To understand why, you have to stop thinking like a software engineer serving a live user, and start thinking like a threat actor who has just downloaded a leaked database dump from an exposed S3 bucket or a compromised server.

A parent’s PIN in our system is a 4-digit number (from `0000` to `9999`). There are exactly **10,000 possible combinations**. 

If an attacker obtains a database dump containing SHA-256 hashes of 4-digit PINs, how long does it take them to crack every single PIN in the school?

At 0.0091 milliseconds per guess on a standard laptop CPU, an attacker can test all 10,000 possible PINs in **91 milliseconds**—less than the blink of an eye. If they bring an inexpensive modern gaming GPU (such as an Nvidia RTX 4090), which can compute billions of SHA-256 hashes per second, **the entire database of 1,000 families is unmasked in less than one microsecond**. Salted hashes do not prevent this; salting only stops pre-computed rainbow tables, but does nothing to deter high-speed brute-force attacks against a tiny 10,000-entry keyspace.

---

### The Counter-Intuitive Remedy: Memory-Hard Cryptography
This brings us to the core tenet of defensive cryptography: **The algorithm must be engineered to be cheap for the defender, but prohibitively expensive for the attacker.**

A legitimate parent logs in once or twice a week. If verifying their PIN takes **196 milliseconds** instead of 0.009 milliseconds, the parent does not notice. To human perception, anything under 250 milliseconds feels instantaneous—especially when compared to the 1,200ms radio latency of an MTN mobile data connection. The 200ms computational cost to the legitimate user is effectively zero.

For the attacker, however, the equation is inverted. 

We selected **Argon2id** (RFC 9106), the winner of the Password Hashing Competition. Argon2id is not just CPU-intensive; it is **memory-hard**. We tuned its operational parameters specifically:
- **Type**: `argon2id` (hybrid resistance against both side-channel cache attacks and GPU cracking).
- **Memory Cost (`m`)**: `65,536 KB` (exactly 64 megabytes of RAM required for every single hash calculation).
- **Time Cost (`t`)**: `3` iterations.
- **Parallelism (`p`)**: `4` threads.

Let us examine what those parameters do to the physics of an attack.

By mandating **64 megabytes of RAM** for each individual hash calculation, Argon2id renders parallel GPU and ASIC cracking rigs nearly useless. A high-end GPU has thousands of compute cores, but very limited high-speed memory per core. If each hash calculation demands 64MB of dedicated RAM, a GPU with 24GB of VRAM cannot run tens of thousands of parallel threads; it is bottlenecked to a few hundred simultaneous attempts before running out of memory.

On our benchmark hardware, computing one Argon2id hash took **196.509 milliseconds**. 

Now consider the attacker attempting to crack 1,000 parent PINs:
- Testing 10,000 possibilities for one PIN now takes **1,965 seconds (32.7 minutes)** on a dedicated CPU core.
- Cracking all 1,000 families across the school requires **32,700 core-hours** of continuous, heavy computation.
- Attempting 1 million guesses across a breached multi-tenant dump requires **54.5 hours of sustained, multi-core CPU cracking** that generates massive thermal load and costs real money in cloud compute.

We transformed a trivial 90-millisecond offline crack into an expensive, multi-day computational slog—without imposing a single millisecond of perceptible delay on the parent standing at the school gate.

---

### But What About Low-End Handsets?
When engineers first hear about memory-hard cryptography, their immediate concern is device performance: *"If the parent’s phone only has 1GB of RAM, won't a 64MB Argon2id hash freeze their browser?"*

This question highlights the single most important architectural boundary we established in the Fees project: **The browser is an untrusted presentation layer; the server is the uncompromised source of truth.**

Argon2id is executed **exclusively on the server**. The parent's inexpensive Android phone never computes the hash. The phone simply captures the 4-digit PIN, transmits it over an encrypted TLS connection inside a JSON payload, and lets the server’s multicore Node.js runtime perform the memory-hard calculation. 

The client handset experiences zero memory pressure, zero battery drain, and zero interface freezing. The phone remains fluid and responsive, while the backend bears the cryptographic shield.

---

### Layering Defense-in-Depth
Slow hashing alone is never enough. Security is a system of interlocking constraints, not a single silver bullet. Around our Argon2id hashing engine, we constructed four additional layers of boundary protection:

1. **Sliding-Window Rate Limiting**: We enforced a strict limit of 5 failed login attempts per 60 seconds per IP address (`HTTP 429 Too Many Requests`). This halts live brute-force attacks at the front door before they can even consume server CPU cycles.
2. **K-Anonymity Breached Credential Auditing**: Before an access slip code or PIN is accepted during activation, our backend queries the HaveIBeenPwned database using the k-anonymity protocol (sending only the first 5 characters of the SHA-1 hash). Any code that has appeared in public data breaches is rejected immediately.
3. **Hash-at-Rest Session Tokens**: When a parent successfully authenticates, we generate a high-entropy 32-byte cryptographic token (`crypto.randomBytes(32)`). But we do not store that token in our database. We store only the **SHA-256 hash** of the token. If an attacker dumps our session table, they obtain only hashes of random tokens, which cannot be reversed into valid browser session cookies.
4. **Indistinguishable Error Responses**: When an authentication attempt fails, our route handler computes a dummy Argon2id hash against a constant salt if the user does not exist. Both "User not found" and "Wrong PIN" return an identical generic error message (`HTTP 401 Unauthorized`) in identical execution time, eliminating timing side-channels and user enumeration.

---

### The Engineering Takeaway
As software engineers, we are often seduced by the metrics that make our graphs look pretty in internal dashboards: microsecond response times, zero-latency caches, and lightweight compute. 

But engineering is not the pursuit of raw speed; it is the discipline of making deliberate, mathematically justified trade-offs. 

By choosing to make password verification 21,000 times slower on the server, we protected a community of vulnerable families from having their private financial records laid bare in the event of an infrastructure breach. We proved that with thoughtful architecture, you can build enterprise-grade cryptographic security that protects users on the lowest-end hardware without sacrificing their user experience.

True craftsmanship isn't making everything fast. It's knowing exactly what to slow down.

