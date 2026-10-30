# Information Design on the Form: Field Justification

## 1. Overview
In accordance with Step 2 of Task Three, every field on the Crown Heights Academy authentication form is justified against three strict business criteria:
1. **Why it is needed**.
2. **What the business does with it**.
3. **What happens if the user gets it wrong**.

Any field failing all three has been ruthlessly removed.

---

## 2. Retained Fields

### 1. Parent Phone Number (`phone`)
* **Why it is needed**: It is the single universal identifier for families in Nigeria. Parents rarely have active work emails on their mobile devices, but 100% have an active mobile phone number.
* **What the business does with it**: The bursar queries private fee ledgers and matches incoming Flutterwave payment alerts against the primary guardian's registered telephone number.
* **What happens if the user gets it wrong**: If mistyped, the system cannot look up their student's ledger. The user cannot log in and sees a generic error ("Incorrect phone number or security details").

### 2. Student Admission Number (`studentId` — Activation Only)
* **Why it is needed**: Connects a physical parent identity to one or more registered children at Crown Heights Academy.
* **What the business does with it**: Resolves exact student records and links up to two verified guardians to that child's private ledger.
* **What happens if the user gets it wrong**: Account activation halts immediately with a clear prompt to inspect the child's ID badge or admission letter.

### 3. Access Slip Code (`slipCode` — Activation Only)
* **Why it is needed**: Proves physical possession of the official fee advice slip printed by the bursar. This eliminates unauthorized strangers claiming a child's account.
* **What the business does with it**: Verifies that the activation request originates from the legitimate guardian who received the paper slip from the school office.
* **What happens if the user gets it wrong**: Activation fails; after three failed attempts, the code is locked to prevent automated brute-force enumeration.

### 4. Security PIN (`pin` — Sign In Only)
* **Why it is needed**: Provides fast, memorable authentication for parents opening the web app 6–8 times a term on their phones without requiring complex alphanumeric passwords.
* **What the business does with it**: Verified server-side against an Argon2id hash to issue a secure, scoped session cookie.
* **What happens if the user gets it wrong**: The attempt is rejected with a constant-time comparison, incrementing a rate-limit counter to prevent PIN guessing.

### 5. Terms & Privacy Acceptance Checkbox (`acceptTerms` — Activation Only)
* **Why it is needed**: Legal compliance under the Nigeria Data Protection Act (NDPA) and PRD Section 6.1 (Explicit guardian consent before displaying private child fee balances).
* **What the business does with it**: Stamps an immutable consent record (`consentGivenAt`) in the database audit log.
* **What happens if the user gets it wrong**: Activation is physically blocked until explicit consent is toggled.

---

## 3. Fields Evaluated and Removed (Defending Minimal Scope)

1. **Email Address**: Removed. Crown Heights Academy parents often do not maintain active personal email addresses on their mobile phones; requiring email creates immediate drop-off.
2. **Parent Home Address**: Removed. The school paper book already holds the residential address; asking for it on login creates unnecessary data collection risk.
3. **Username / Nickname**: Removed. Phone numbers are unique and eliminate forgotten-username support requests.
4. **Confirm PIN Field**: Removed on login, replaced with a visibility toggle and strict length gating.

