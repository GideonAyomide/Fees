# Password Hashing: Why Slow Is Correct & Hardware Timing Defense

## 1. The Scenario & The Fallacy of Fast
In naive software development, engineers are conditioned to optimize for raw CPU execution speed. When choosing a cryptographic function for password storage, developers mistakenly reach for SHA-256 or MD5 because they execute in microseconds. 

This error was illustrated when Chijioke's driving school platform was breached. A contractor had hashed 300 student passwords using SHA-256 without memory hardness. Within 24 hours of the database dump being leaked on a public hacking forum, the attacker cracked over 85% of the plaintext passwords using standard dictionary lists, because several students reused their portal passwords on their personal banking accounts. 

Nothing was unpatched. No zero-day vulnerability was exploited. The failure was a single architectural algorithm choice made by someone who believed "fast is good."

---

## 2. Why Fast Is an Attacker's Weapon
Cryptographic hash functions like SHA-256, SHA-512, and MD5 were designed for **data integrity verification** (e.g. verifying that a 2GB file transfer was not corrupted), not for credential storage. They are mathematically structured to compute digests in nanoseconds with zero memory overhead.

When an attacker steals a database table containing fast hashes:
1. **Zero Resistance**: The attacker does not attack the live server; they attack the leaked database offline on their own hardware.
2. **Extreme GPU Parallelization**: A modern commercial GPU (such as an NVIDIA RTX 4090) contains thousands of arithmetic logic units (ALUs) capable of computing over **23 billion SHA-256 hashes per second**.
3. **Cheap Brute Force**: An entire 6-digit numeric space or 8-character lowercase password space is cracked in fractions of a second.

---

## 3. Why Slow Is Correct: Adaptive Memory-Hard Hashing (Argon2id)
To secure credentials, we selected **Argon2id** (RFC 9106), the winner of the Password Hashing Competition.

Argon2id introduces two protective dimensions that destroy offline GPU attacks:
1. **Time Cost (Iterations)**: Forces the CPU to execute multiple iterative hashing loops.
2. **Memory Hardness (`m=65536` / 64 MB RAM)**: Requires each hashing thread to allocate and sequentially access 64 megabytes of system memory.

### The Impact on Attackers:
While a GPU can run thousands of parallel SHA-256 threads in registers without RAM, it cannot parallelize Argon2id because GPU VRAM is rapidly exhausted. A 24 GB GPU is physically constrained to fewer than 375 concurrent hash operations, collapsing attacker throughput from **23,000,000,000 guesses/sec down to under 2,000 guesses/sec**.

---

## 4. Hardware Timing Measurements & Arithmetic (From This Machine)

Benchmarks executed on our actual development machine (`x64`, Windows, Node.js `v24.19.0`):

| Algorithm | Type | Average Execution Time | Hardware Throughput (1 Core) |
| :--- | :--- | :--- | :--- |
| **Argon2id** | Slow Adaptive Hash | **196.509 ms** | **5 guesses/sec** |
| **SHA-256** | Fast Digest | **0.009157 ms** (9.16 µs) | **109,204 guesses/sec** |

### The Arithmetic:
$$\text{Slowdown Factor} = \frac{196.509\text{ ms}}{0.009157\text{ ms}} = 21,460\times$$

On our local CPU, Argon2id is **21,460 times slower** than SHA-256. 
* To test 1,000,000 candidate passwords against SHA-256 on this CPU takes **9.15 seconds**.
* To test the same 1,000,000 candidate passwords against Argon2id takes **196,509 seconds** (**54.5 hours** on a single thread).

---

## 5. The Inversion: The Core Security Principle

> **The Inversion in Our Own Words:**  
> A legitimate parent logs into Crown Heights Academy only once per session, so taking **196 milliseconds** to hash their PIN costs the user nothing measurable (it is completely indistinguishable from normal network transit). However, an offline attacker trying to break a stolen database must execute that hash **billions of times**. By deliberately slowing the computation, we impose zero friction on legitimate humans while imposing an astronomical, mathematically insurmountable cost on the attacker.

---

## 6. Salting: Mechanism, Automation & Attacker Vulnerability

### What Salting Does:
A cryptographic salt is a sequence of cryptographically random bytes appended to the plaintext password prior to hashing. It ensures that two users with the exact same password (or one user with identical passwords on different accounts) produce completely different stored hash values.

### Does Argon2id Handle Salting Automatically?
**Yes.** The `argon2` implementation automatically generates a fresh, cryptographically secure 16-byte random salt from the operating system's entropy pool (`/dev/urandom` / Windows CryptGenRandom) for every single call to `argon2.hash()`. The salt is encoded directly into the resulting modular crypt format string (e.g., `$argon2id$v=19$m=65536,p=4,t=3$EvpoA0GeMmW9...`).

### What an Attacker Could Do If We Skipped Salting:
If salting were skipped:
1. **Rainbow Table Lookup**: Attackers could instantly reverse hashes using precomputed lookup tables (terabytes of pre-hashed passwords indexed for instant O(1) retrieval).
2. **Cross-Account Correlation**: Attackers could immediately see every parent who uses the default initial PIN or common pin (e.g. `1234` or `0000`), because all matching passwords would produce the identical stored hash in the database table.

