---
trigger: model_decision
description: CSV upload formats, preview and apply, NOT_LOADED status, Friday check, posted up to date. Use when working on ledger uploads, balances loading, or the Daily close and Friday check screens.
---

# ledger-upload.md
Job: how balances get into the app, and when they may be shown. PRD 6.9, 8.7.
Not here: wording of the date line (screens.md), balance calculation (database.md).

## The files
Amounts are whole naira in the file. The server converts them to kobo. Dates are `YYYY-MM-DD`. Why: the bursar types naira, and the database holds kobo.

| File | Columns | Rules |
|---|---|---|
| `students.csv` | `studentCode, fullName, className` | A new code is added. An existing code only updates name and class. |
| `charges.csv` | `studentCode, termLabel, itemLabel, kind, amountNaira, dueDate, extraCode` | `kind` is one of TUITION, LEVY, EXAM, BUS, LUNCH, CARRY_OVER, OTHER. `extraCode` is blank unless the item is bus or lunch. A row for an item that already has payments allocated cannot change its amount. Reject it. The bursar posts a credit instead. |
| `payments.csv` | `studentCode, paidDate, amountNaira, method, bookReceiptNo, note` | `method` is CASH or TRANSFER. A repeated `(studentCode, bookReceiptNo)` is rejected as a duplicate. Allocate oldest due date first. |

## Applying
1. The preview shows counts of new rows, changed rows and error rows. Nothing is applied until the bursar taps Apply. Why: the bursar checks the file before it changes any balance.
2. If any row has an error, Apply is disabled. The bursar fixes the file. Why: a half applied file leaves balances wrong with no way to tell which.
3. Apply runs in one database transaction. After Apply, recompute Entitlement rows. Why: paid extras depend on balances.

## Loaded or not
4. A student's ledger status starts as NOT_LOADED. It becomes LOADED only when an applied upload includes that student and the Friday check for the launch class has passed. Why: a balance nobody has checked against the paper book must not show.
5. The Friday check: the owner enters the paper book total, which includes online payments the bursar copied in. The app shows its own total, the difference, the number of online payments not yet copied, and the week's credits. The owner also enters the result of spot checks. The launch class is also checked line by line by two people. The check cannot pass while copy to book ticks are missing. Why: matching totals can hide two equal and opposite errors.
6. A NOT_LOADED student shows no figures anywhere in the app. Show "Not loaded yet", never zero. Why: a zero would tell a parent they owe nothing.

## The posted up to date
7. The date belongs to the class (`ClassLedger.postedThroughDate`), not to a student. Only the bursar sets it, by tapping "Everything up to today is posted" on the Daily close screen after entering the day's cash and transfer payments. The app never sets it by itself. An upload never changes it. Why: only the bursar can tell "nothing changed" from "nothing was posted".
