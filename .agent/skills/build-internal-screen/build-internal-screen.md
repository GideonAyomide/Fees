---
name: build-internal-screen
description: Build one staff or owner screen from PRD 6.11, with every data-changing action checked, validated and audited. Use for each of the 14 internal screens listed in screens.md.
---

# Build one internal screen

Job: build one staff or owner screen and prove that every action on it writes one audit row.

## Inputs

Get these from the person. Ask for any that are missing.

1. The screen name, exactly as written in `screens.md` rule 7.
2. The role that may open it: bursar, admin staff or owner. The PRD does not say. Do not guess.
3. Any wording the PRD does not give. Ask only if the screen needs it.

## Steps

1. Check the screen name against the two lists in `screens.md` rule 7. If it is not on a list, stop and tell the person. Build nothing.
2. Open the screen's row in PRD 6.11. Open the section 6 acceptance criteria that name this screen. Write the criteria numbers at the top of your response. If none exist, stop and ask.
3. Open the rules file for the screen from this table. Read it before you write code.

| Screen | Read |
|---|---|
| Ledger upload, Daily close, Friday check | `ledger-upload.md` |
| Post a payment, Credits, Reconcile | `payments.md` and `database.md` |
| Guardians | `auth.md` |
| Questions and flags, Test run | `ai-pipeline.md` |
| Records, Approve | PRD 6.11 and 9.6, and `ai-pipeline.md` |
| Flags, Export, Usage | PRD 6.11 and 8.8 |

4. List every action on the screen that changes data. Number them. Each numbered action needs exactly one audit row. List the reads separately.
5. Search the codebase for helpers that already do part of the work: the staff session check, the audit writer, and the Entitlement recompute. Reuse each one you find. Do not write a second copy.
6. Build each numbered action in this order:
   1. Check the staff session and the role from input 2. Follow `auth.md`.
   2. Validate the input on the server. Follow `security.md`.
   3. Make the change and write its audit row in one transaction, using the system database role named in `database.md`.
   4. Recompute Entitlement if the action posts a payment, posts a credit or applies an upload. Follow `database.md`.
   5. Return a plain error on any failure. Follow `security.md`.
7. If any step needs a table, column or row rule that does not exist, stop. Follow `database-safety.md` and put a change proposal in your response.
8. Build the page. Use the exact strings from `screens.md`. If a string you need is not there, stop and ask.
9. Write one test per numbered action. Each test must assert that exactly one audit row is written and that a user without the allowed role is refused. Use invented data. Label and report the tests as `testing.md` and `database-safety.md` require.
10. Go through the criteria numbers from step 2. Mark each one as: passes in a test that ran, covered by a test not run, or not covered. Fix any "not covered" before you finish.
11. End your response with a table: one row per numbered action, with its audit row and its test.

## Done when

- The screen is one of the 14 listed in `screens.md`.
- Every numbered action appears in the step 11 table with one audit row and one test.
- Every criterion from step 2 is marked.
- No helper from step 5 was written twice.