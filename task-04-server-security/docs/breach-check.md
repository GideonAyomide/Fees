# Breached Password Verification: K-Anonymity & Privacy Preservation

## 1. Why Check for Breached Credentials on Registration?
Users reuse passwords across multiple services. When a third-party website is breached, attackers assemble massive credential stuffing databases. If a parent registers on Crown Heights Academy using a password or PIN already compromised in an external dump, their student fee records are vulnerable from minute zero.

Checking passwords against a breach corpus at registration prevents weak or exposed credentials from ever entering the system.

---

## 2. The K-Anonymity Mechanism (How It Works Without Leaking the Password)

A naive implementation would send the user's password (or full hash) to an external security API. **That would be catastrophic:** sending credentials across the internet to a third party creates a new, severe data exposure vector.

Instead, we use **K-Anonymity** via the HaveIBeenPwned Range API:

```
[Plaintext Password / Slip Code]
           │
           ▼ (SHA-1 Cryptographic Hash)
[ 7C4A8 D09CA3762AF61E59520943DC26494F8941B ]
    │                      │
    ▼ (First 5 Chars)      ▼ (Remaining 35 Chars)
 [PREFIX: "7C4A8"]     [SUFFIX: "D09CA376..."]
    │                      │
    │ (Sent to API)        │ (STAYS ON LOCAL SERVER)
    ▼                      │
GET /range/7C4A8           │
    │                      │
    ▼ (API Returns ~800 matching hash suffixes)
[List of Suffixes + Occurrence Counts]
    │                      │
    └──────────┬───────────┘
               ▼ (Local Comparison)
   Does returned list contain our local suffix?
      ├── YES ──> REJECT (Breached in N occurrences)
      └── NO  ──> ACCEPT (Clean credential)
```

### The 4 Exact Steps:
1. **Local Hash**: We calculate the SHA-1 hash of the candidate credential locally:
   `SHA-1("123456") = 7C4A8D09CA3762AF61E59520943DC26494F8941B`
2. **K-Anonymity Split**:
   * **Prefix**: The first 5 hexadecimal characters (`7C4A8`).
   * **Suffix**: The remaining 35 hexadecimal characters (`D09CA3762AF61E59520943DC26494F8941B`).
3. **Range Query**:
   We dispatch an HTTP GET request to `https://api.pwnedpasswords.com/range/7C4A8`.
   The remote API returns approximately 500 to 1,000 hash suffixes that share that same 5-character prefix, along with breach frequency counts.
4. **Local Matching**:
   Our server scans the returned list locally in memory. If our 35-character suffix matches a line in the returned payload, we know with mathematical certainty that the password has been breached, and by how many times (e.g. 210,461,208 times for `123456`).

---

## 3. Why the Naive Version Is an Unacceptable Thing to Build

If an engineer built the naive version:
* **Direct Exposure to Third-Party Breaches**: If the third-party breach service is compromised or logs inbound query parameters, all of your users' plain passwords are now compromised.
* **Network Interception Risk**: Man-in-the-middle attackers or malicious proxy administrators could sniff full hashes or passwords in transit.
* **Severe Regulatory Violations**: Under the Nigeria Data Protection Act (NDPA) and GDPR, transmitting unencrypted authentication secrets to an external processor without explicit data processing agreements constitutes a punishable regulatory infraction.

With K-Anonymity, the remote service learns only that *someone* on our server is registering a password whose SHA-1 begins with `7C4A8`—a mathematical bucket containing hundreds of completely unrelated words and strings. The remote service has zero ability to determine which specific credential was checked.

