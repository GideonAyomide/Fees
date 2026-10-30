---
trigger: model_decision
description: Fees database roles, row level security, which tables a parent can read, money in kobo, balance in SQL, vector column handling. Use when writing or changing any code that reads or writes data, queries, Prisma usage, or adds a table.
---

# database.md
Job: the shape of the Fees data and who may read it. PRD 8.4 and 10.1 to 10.3.
Not here: how to behave around a database (database-safety.md), CSV rules (ledger-upload.md), the search decision table (ai-pipeline.md).

## Roles and access
1. Two database roles exist. `fees_family` serves every request from a signed in parent. `fees_system` serves sign in, the payment webhook, and the staff and owner screens. Why: the family role sees only its own family's rows. The system role sees everything.
2. Never use `fees_system` for a parent request. Why: it skips the row rule, and the PRD names this as a cause of one family seeing another's data.
3. Every parent request goes through `lib/db-family.ts` (`withFamily(guardianId)`). It opens one transaction and sets the guardian ID for that transaction only. Why: the row rules read that setting. If it is missing, they match nothing.
4. You may add app code checks. They never replace the database rule. Why: a bug in app code must not be able to expose a row.

## Which tables a parent can reach
5. Private, own family only: GuardianStudent, Student, FeeItem, Payment, PaymentAllocation, Entitlement, QuestionLog, Flag.
6. School facts, readable by any signed in parent: Extra, Contact, SchoolSettings, ClassLedger.
7. Shared records, only when approved, in date and visible to that family: SharedRecord, SharedRecordChunk.
8. No parent access: Guardian, Session, AuthAttempt, StaffUser, StaffSession, GatewayEvent, LedgerUpload, FridayCheck, AuditLog, AppOpen. If a parent screen needs data from one of these, stop and ask.
9. `fees_family` may insert only: a Payment (status PENDING, source APP, for its own student), a QuestionLog row and a Flag row. Why: a parent request must not be able to write a paid status.
Why for 5 to 9: the agent must know which table is which, because a wrong guess is a data exposure.

## Money and balance
10. Store money in whole kobo in integer fields. Why: no rounding errors.
11. Balance is the sum of fee items minus the sum of allocations, computed in SQL (PRD 6.2.1). Never compute it in app code or with AI. Why: balances are the one number the school will check by hand.
12. An extra counts as paid for a term when its fee item for that term has nothing left to pay, credits included. Recompute Entitlement after every successful online payment, posted payment, credit and applied upload. Why: access to paid extras depends on it.

## Vectors
13. Read and write the vector column with raw SQL only. Why: Prisma Client cannot query that type.
14. Search is exact at launch. Do not propose a vector index. Why: an approximate index plus the visibility filter can return fewer rows than asked, and the PRD requires the 30 question list re-run if one is ever added.
15. The search query keeps its own status, date and level checks even though the row rule already hides rows. Why: it is a second guard. The level filter helps accuracy and is not a security rule.
16. Run two Prisma client instances, one per role. Connection strings come from the environment (names in env-and-hosting.md). Use the Prisma 7 form in PRD 8.4. Why: each role needs its own connection.

## Tests and new tables
17. Cross family test: with guardian A signed in, a count of each private table filtered to guardian B's student must be 0. Repeat with no guardian set. It must also be 0. It must pass before every release. The human runs it (database-safety.md rule 1). Why: it is the proof that no family sees another's data.
18. A new table has no row rule until the human re-runs the row rule step (PRD 8.4). Say this in any proposal that adds a table. Why: a table with no rule is a table with no protection.
