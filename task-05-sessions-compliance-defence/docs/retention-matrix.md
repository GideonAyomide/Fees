# Data Retention and Erasure Matrix

**Application**: Fees — Crown Heights Academy School Fees & Ledger Management  
**Focus**: Column-Level Data Retention Schedules, Legal Compliance, and NDPA Right to Erasure vs. Tax Law Conflicts  
**Regulation**: Nigeria Data Protection Act (NDPA) 2023, Companies and Allied Matters Act (CAMA) 2020, Personal Income Tax Act (PITA)

---

## 1. Executive Summary & Regulatory Framework

Crown Heights Academy processes both **Personally Identifiable Information (PII)** and **Statutory Financial Records**. These two categories of data operate under conflicting legal obligations:
- **NDPA 2023 (Section 34 - Right to Erasure)** grants data subjects (parents and guardians) the legal right to request the deletion of their personal data without undue delay.
- **CAMA 2020 (Section 375) & Nigerian Tax Legislation** mandate that educational institutions and registered businesses retain accounting records, receipts, ledgers, and proof of payment for a **minimum statutory period of six (6) years** from the financial year-end.

To reconcile this legal conflict, Crown Heights Academy implements a **dual-lifecycle retention architecture**:
1. **PII and Authentication Credentials** are strictly bound to user consent and are purged or irreversibly pseudonymized upon account deletion.
2. **Financial Ledger Entries (Payments, Balances, Receipts)** are permanently retained as immutable accounting entries, decoupled from live guardian credentials.

---

## 2. Table-by-Table & Column-by-Column Retention Matrix

| Table | Column Name | Classification | Retention Duration | Disposal / Purge Mechanism | Legal / Operational Justification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Guardian` | `id` | Identifier | Permanent (Pseudonymized) | Preserved as UUID foreign key | Retains referential integrity for historical payment relationships without retaining identity. |
| `Guardian` | `phone` | PII (Primary Handle) | Active + 7-Day Grace Period | Overwritten with `PURGED_<uuid>_<timestamp>` | NDPA Section 34 right to erasure; prevents phone number reuse or lookup. |
| `Guardian` | `email` | PII (Communication) | Active + 7-Day Grace Period | Overwritten with `NULL` | Erased completely to eliminate re-identification risk. |
| `Guardian` | `pinHash` | Credential (Argon2id) | Active + 7-Day Grace Period | Overwritten with `'$PURGED$'` | Prevents credential dictionary cracking or post-erasure credential leakage. |
| `Guardian` | `status` | State Machine | Permanent | Set to `'PURGED'` | Audit log state proving compliance with legal deletion workflow. |
| `Guardian` | `failedPinAttempts`| Security State | Active | Reset to `0` upon deletion | Transient operational security counter. |
| `Guardian` | `termsAccepted` | Legal Consent | Permanent | Retained as `true` / `false` | Proof that consent was granted during active account lifespan. |
| `Student` | `id` | Identifier | Permanent | Preserved as UUID | Academic enrolment identity. |
| `Student` | `admissionNumber` | Enrolment Key | Permanent | Preserved | School legal enrolment record (statutory academic registry). |
| `Student` | `fullName` | Student PII | Enrolment + 6 Years post-grad | Retained in school records | Ministry of Education compliance. |
| `Student` | `classLevel` | Academic Metadata | Active Term | Updated annually | Academic progression tracking. |
| `Student` | `balanceKobo` | Financial Ledger | Permanent | Retained (Whole kobo integer) | Official school ledger balance; cannot be destroyed. |
| `Student` | `postedUpTo` | Ledger Stamp | Permanent | Retained | Bursar paper book synchronization audit trail. |
| `Session` | `id` | Session Key | Max 14 Days | Automatic expiry / explicit delete | Temporary authorization ticket. |
| `Session` | `sessionTokenHash`| Credential Hash | Max 14 Days | Hard delete (`DELETE FROM "Session"`) | Hash-at-rest token; wiped on logout, reset, or deletion. |
| `Session` | `guardianId` | Foreign Key | Max 14 Days | Cascading delete on session purge | Ephemeral linkage. |
| `Session` | `ipAddress` | Network Metadata | Max 14 Days | Hard delete | Fraud prevention and brute-force correlation window. |
| `Session` | `userAgent` | Client Metadata | Max 14 Days | Hard delete | Device collision diagnostics. |
| `Session` | `expiresAt` | Expiry Timestamp | Max 14 Days | Purged when `expiresAt < NOW()` | Rolling 14-day inactivity lifecycle. |
| `Payment` | `id` | Financial Primary Key | Permanent (Min. 6 Years) | Immutable Retention | CAMA 2020 statutory financial accounting record. |
| `Payment` | `studentId` | Ledger Reference | Permanent (Min. 6 Years) | Immutable Retention | Links payment to enrolment ledger. |
| `Payment` | `amountKobo` | Currency Integer | Permanent (Min. 6 Years) | Immutable Retention | Whole kobo exact payment amount (tax audit). |
| `Payment` | `flutterwaveRef` | Gateway Reference | Permanent (Min. 6 Years) | Immutable Retention | Bank settlement reconciliation proof. |
| `Payment` | `bankReceiptNo` | Paper Reference | Permanent (Min. 6 Years) | Immutable Retention | Paper book legal record synchronization. |
| `Payment` | `paidAt` | Timestamp | Permanent (Min. 6 Years) | Immutable Retention | West Africa Time (WAT) official transaction stamp. |
| `PaymentAttempt`| `id` | Checkout Log | 90 Days | Batched purge past 90 days | Diagnosing abandoned carts; non-financial operational telemetry. |
| `PaymentAttempt`| `amountKobo` | Attempt Value | 90 Days | Batched purge past 90 days | Temporary reconciliation log. |
| `PaymentAttempt`| `status` | State (`INIT`, `FAIL`)| 90 Days | Batched purge past 90 days | Debugging payment gateway timeouts. |

---

## 3. Resolving the NDPA Erasure vs. CAMA Tax Retention Conflict

When a parent invokes their **Right to Erasure** under NDPA 2023 Section 34, a naive software implementation would execute:
```sql
-- DANGEROUS / ILLEGAL FINANCIAL CODE
DELETE FROM "Guardian" WHERE id = '...'; -- Fails FK constraint or destroys accounting ledger!
```

### The Legal Problem
Deleting financial records constitutes **destruction of statutory accounting evidence** under Nigerian tax laws, exposing school proprietors to severe regulatory penalties. Conversely, refusing deletion violates data protection rights.

### The Crown Heights Academy Resolution: Pseudonymised Ledger Preservation
1. **Soft Delete & Cooling-Off Period**:
   The deletion request marks the guardian account as `PENDING_DELETION`. The user is immediately logged out, all active sessions across all devices are revoked, and a 7-day cancellation grace period begins.
2. **PII Strip (The Scrub)**:
   When the background purge runs past Day 7, the guardian's `phone` and `email` are replaced with an irreversible hash pseudonym (`PURGED_<uuid>_<timestamp>`). The Argon2id `pinHash` is overwritten with `'$PURGED$'`.
3. **Ledger Preservation**:
   The historical `Payment` records remain intact, preserving `amountKobo`, `flutterwaveRef`, and `paidAt`. The payment now references an anonymised student ledger row, allowing the bursar to prove to tax auditors that ₦150,000 was collected on October 12, without maintaining the personal telephone number or access credentials of the departed family.

---

## 4. Session Purge Lifecycles

Active sessions are purged under four distinct deterministic conditions:
1. **Explicit Sign Out**: The server immediately deletes the session row corresponding to `tokenHash` from the database and clears the browser cookie (`Max-Age=0`).
2. **Security PIN Reset**: Resetting a PIN invokes `destroyAllUserSessions(guardianId)`, invalidating all active sessions on every desktop, tablet, and mobile device.
3. **Account Deletion Request**: Requesting account deletion immediately revokes all sessions.
4. **Natural Rolling Expiry**: Any session whose `expiresAt` is less than `Date.now()` is refused by Edge Middleware and pruned by background sweepers.

