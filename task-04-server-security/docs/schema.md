# Task Four Step 1: Database Schema Architecture & Specification

## Overview
This document specifies the complete relational schema for Crown Heights Academy's Fees management system. It details the five core tables (plus the student domain table), data types, nullability rules, indexing rationales, write overhead trade-offs, and data duplication decisions.

---

## 1. Schema Tables Specification

### Table 1: `Guardian` (Domain: The People Who Use the System)
Stores parent/guardian identities who authenticate to access student fee balances.

| Column | Data Type | Nullable | Default | Constraints & Indexes | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Primary Key | Unique internal guardian identifier |
| `phone` | `VARCHAR(15)` | No | None | Unique Index (`idx_guardian_phone`) | Nigerian mobile number (`080...`), primary login handle |
| `pinHash` | `VARCHAR(255)` | No | None | None | Argon2id slow cryptographic hash of 4-digit PIN |
| `status` | `VARCHAR(20)` | No | `'ACTIVE'` | None | Account state: `ACTIVE`, `PENDING_VERIFICATION`, `LOCKED` |
| `failedPinAttempts` | `INTEGER` | No | `0` | None | Tracks consecutive failed attempts; locks at 3 attempts |
| `termsAccepted` | `BOOLEAN` | No | `false` | None | Statutory NDPA consent checkbox state |
| `createdAt` | `TIMESTAMP` | No | `NOW()` | None | Account activation timestamp |
| `updatedAt` | `TIMESTAMP` | No | `NOW()` | None | Record modification timestamp |

* **Relationships**:
  * One-to-Many with `Session`: One guardian can hold active sessions across different devices.
  * One-to-Many with `Student`: Up to two guardians can be linked to one child; a guardian can have multiple children enrolled.
* **Indexes & Write Costs**:
  * `idx_guardian_phone` on `phone`: B-Tree index. Essential for O(log n) login lookup by phone. Adds minor overhead on account creation, but login reads outnumber registrations by orders of magnitude.

---

### Table 2: `Student` (Domain: School Enrolment & Private Record Root)
The official student record. All private financial data is strictly partitioned by student ID.

| Column | Data Type | Nullable | Default | Constraints & Indexes | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Primary Key | Unique internal student ID |
| `admissionNumber` | `VARCHAR(30)` | No | None | Unique Index (`idx_student_adm_no`) | Official school admission number (e.g., `CHA/2026/042`) |
| `fullName` | `VARCHAR(100)` | No | None | None | Student full legal name |
| `classLevel` | `VARCHAR(10)` | No | None | None | Academic level: `JSS1`, `JSS2`, `JSS3`, `SS1`, `SS2`, `SS3` |
| `guardianPhone` | `VARCHAR(15)` | No | None | Index (`idx_student_guardian_phone`) | Foreign key / link to primary guardian mobile |
| `slipCodeHash` | `VARCHAR(255)` | No | None | None | Hashed 6-digit paper activation code issued on slip |
| `balanceKobo` | `BIGINT` | No | `0` | None | Current outstanding balance in whole kobo integers |
| `postedUpTo` | `DATE` | No | None | None | Bursar's official ledger posting verification date stamp |
| `createdAt` | `TIMESTAMP` | No | `NOW()` | None | Registration timestamp |

* **Relationships**:
  * Belongs-to `Guardian` via `guardianPhone`.
  * One-to-Many with `Payment`: Historical ledger of settled payments for this child.
  * One-to-Many with `PaymentAttempt`: Historical record of attempted checkouts.
* **Indexes & Write Costs**:
  * `idx_student_adm_no` on `admissionNumber`: B-Tree unique index. Guarantees zero duplicate admissions; fast lookup during first-time slip activation. Negligible write cost during termly student batch ingestion.
  * `idx_student_guardian_phone` on `guardianPhone`: B-Tree index. Allows instant retrieval of all enrolled siblings when a guardian logs in.

---

### Table 3: `Session` (Domain: Their Sessions)
Server-side tracking of authenticated user sessions.

| Column | Data Type | Nullable | Default | Constraints & Indexes | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Primary Key | Internal session row ID |
| `sessionTokenHash` | `VARCHAR(64)` | No | None | Unique Index (`idx_session_token`) | SHA-256 hash of high-entropy 32-byte cryptographic token |
| `guardianId` | `UUID` | No | None | Index (`idx_session_guardian`) | Foreign key referencing `Guardian.id` |
| `ipAddress` | `VARCHAR(45)` | No | None | None | IPv4 / IPv6 address of the client device |
| `userAgent` | `VARCHAR(255)` | Yes | `NULL` | None | Truncated browser user agent for audit forensics |
| `expiresAt` | `TIMESTAMP` | No | None | Index (`idx_session_expires`) | Hard expiration timestamp (14-day rolling window) |
| `createdAt` | `TIMESTAMP` | No | `NOW()` | None | Sign-in timestamp |

* **Relationships**:
  * Many-to-One with `Guardian`: Multiple concurrent sessions per user.
* **Indexes & Write Costs**:
  * `idx_session_token` on `sessionTokenHash`: B-Tree unique index. Queried on every authenticated request in middleware. Essential for sub-5ms session verification.
  * `idx_session_expires` on `expiresAt`: B-Tree index. Enables background sweeper job to purge expired session rows efficiently in batch.

---

### Table 4: `Payment` (Domain: The Official Money Table)
The legal financial record of verified, settled payments. Retained permanently down to two kobo.

| Column | Data Type | Nullable | Default | Constraints & Indexes | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Primary Key | Internal payment identifier |
| `reference` | `VARCHAR(50)` | No | None | Unique Index (`idx_payment_ref`) | Internal merchant payment reference (`CHA-PAY-2026-XXXX`) |
| `studentId` | `UUID` | No | None | Index (`idx_payment_student`) | Foreign key referencing `Student.id` |
| `amountKobo` | `BIGINT` | No | None | None | Transaction value in whole kobo integers (e.g. ₦45,000 = 4,500,000) |
| `channel` | `VARCHAR(30)` | No | None | None | Checkout method: `CARD`, `BANK_TRANSFER`, `USSD` |
| `flwTransactionId` | `VARCHAR(50)` | No | None | Unique Index (`idx_payment_flw_id`) | Official Flutterwave verified transaction identifier |
| `status` | `VARCHAR(20)` | No | `'SUCCESSFUL'` | None | Final transaction settlement state |
| `reconciled` | `BOOLEAN` | No | `false` | None | Stamped by Bursar when copied to paper cash book |
| `paidAt` | `TIMESTAMP` | No | None | None | Gateway verified timestamp in West Africa Time (WAT) |
| `createdAt` | `TIMESTAMP` | No | `NOW()` | None | Database ingestion timestamp |

* **Relationships**:
  * Many-to-One with `Student`: Historical receipts linked to a specific child.
* **Indexes & Write Costs**:
  * `idx_payment_ref` on `reference`: B-Tree unique index. Used by Flutterwave webhook to verify idempotent processing.
  * `idx_payment_flw_id` on `flwTransactionId`: B-Tree unique index. Prevents double-credit replay attacks.
  * `idx_payment_student` on `studentId`: B-Tree index. Fetches student payment history for receipt view.

---

### Table 5: `PaymentAttempt` (Domain: Money-Attempts Table — Strictly Separate)
Tracks all payment initializations, including abandoned, timed-out, network-failed, and declined checkouts.

| Column | Data Type | Nullable | Default | Constraints & Indexes | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Primary Key | Unique attempt record identifier |
| `attemptReference`| `VARCHAR(50)` | No | None | Unique Index (`idx_attempt_ref`) | Initial transaction tracking reference passed to checkout |
| `studentId` | `UUID` | No | None | Index (`idx_attempt_student`) | Foreign key referencing `Student.id` |
| `amountKobo` | `BIGINT` | No | None | None | Intended checkout amount in whole kobo integers |
| `flwRef` | `VARCHAR(100)` | Yes | `NULL` | Index (`idx_attempt_flw_ref`) | Flutterwave checkout session reference |
| `status` | `VARCHAR(20)` | No | `'INITIATED'` | None | State: `INITIATED`, `ABANDONED`, `FAILED`, `TIMEOUT` |
| `failureReason` | `TEXT` | Yes | `NULL` | None | Error description (e.g., "Insufficient funds", "3G network socket hang up") |
| `ipAddress` | `VARCHAR(45)` | No | None | None | Client IP address at initialization |
| `initiatedAt` | `TIMESTAMP` | No | `NOW()` | None | Timestamp checkout modal was opened |
| `completedAt` | `TIMESTAMP` | Yes | `NULL` | None | Timestamp of terminal state or gateway webhook receipt |

* **Relationships**:
  * Many-to-One with `Student`.
* **Indexes & Write Costs**:
  * `idx_attempt_ref` on `attemptReference`: Fast lookup when parent returns to `/pay/waiting`.
  * `idx_attempt_flw_ref` on `flwRef`: Lookup index during inbound webhook correlation.

---

### Table 6: `PolicyChunk` (Domain: Chunks for Retrieval System)
Approved shared school rules and fee policy documents for retrieval.

| Column | Data Type | Nullable | Default | Constraints & Indexes | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | `gen_random_uuid()` | Primary Key | Chunk identifier |
| `title` | `VARCHAR(150)` | No | None | None | Record title (e.g., "School Bus Transport Policy Zone 2") |
| `content` | `TEXT` | No | None | None | Exact approved institutional text (never reworded by AI) |
| `category` | `VARCHAR(50)` | No | None | None | Policy area: `TUITION`, `TRANSPORT`, `UNIFORM`, `FEEDING` |
| `levelScope` | `VARCHAR(10)` | No | `'ALL'` | None | Applicable level: `ALL`, `JSS`, `SS` |
| `approvalDate` | `DATE` | No | None | None | Formal date approved and stamped by the School Owner |
| `isActive` | `BOOLEAN` | No | `true` | None | Toggle state; inactive records are ignored during search |
| `embedding` | `TEXT` | Yes | `NULL` | None | Placeholder for pgvector 768-dim embedding representation |

---

## 2. Separation of Money vs. Money-Attempts (Two Core Reasons)

### 1. Funnel & Drop-off Diagnostics
In emerging market mobile web environments, over 40% of checkout initializations fail before settlement due to:
* 3G/EDGE network socket timeouts and packet drops.
* Insufficient account balance on USSD or bank transfer prompts.
* Parents closing the modal to check their cash balance.

If attempts were recorded directly inside the official `Payment` table, the general ledger would be overwhelmed with incomplete, aborted, and void rows. By isolating attempts into `PaymentAttempt`, the Bursar and engineering team gain precise drop-off analytics (e.g. "72 parents clicked Pay today, but 29 aborted on USSD prompt") without compromising accounting integrity.

### 2. Tax Authority & Legal Audit Source of Truth (The 14-Month Scenario)

#### Accounting to the Federal Inland Revenue Service (FIRS) 14 Months Later:
If the tax authority issues a formal inquiry fourteen months after a fiscal year demanding an exact audit of a disputed fee transaction:
1. **Reconciliation Against Bank Statements**: The official `Payment` table contains strictly verified settlements where Flutterwave settled funds directly into the school's commercial bank account. Every kobo in `Payment` corresponds 1:1 to an audited bank credit advice and receipt number.
2. **Exclusion of Ghost Entries**: If a disgruntled parent claims they paid ₦85,000 fourteen months ago but the school has no record, the `PaymentAttempt` audit log allows the school to prove conclusively to tax auditors and court adjudicators:
   * *The parent initialized checkout reference `CHA-ATT-2025-0914` on 14 September 2025 at 08:14 WAT from IP `102.89.41.12`.*
   * *Flutterwave returned failure code `ERR_INSUFFICIENT_FUNDS` at 08:16 WAT.*
   * *Zero naira entered the school's account, and no receipt was issued.*
3. **Defensible Audit Separation**: Storing attempts separately ensures the official tax return reflects only true gross income, while the attempts table provides an immutable legal defence against non-payment disputes and chargeback litigation.

---

## 3. Where Data Is Stored Twice (And Why It Is Accepted)

In a purely normalized relational database (3NF), `balanceKobo` would be calculated dynamically on every query using `SUM(fee_items) - SUM(payments)`. However, in this architecture, the student's current balance is explicitly stored as a denormalized column `Student.balanceKobo` alongside the Bursar's verification stamp `postedUpTo`.

### Justification:
1. **The Paper Book Is the Legal Master**: In Crown Heights Academy, the physical paper ledger in the Bursar's office is the legal source of truth. Online payments only update the student's provisional balance; the official balance remains frozen until the Bursar verifies bank deposits and stamps the `postedUpTo` date.
2. **Zero Floating-Point Drift on 3G**: Calculating complex rolling balances across historical credit items on mobile requests creates latency and database lock contention during morning rush hours. Storing the integer kobo balance directly guarantees instant sub-10ms reads and matches the Bursar's verified stamp exactly.

