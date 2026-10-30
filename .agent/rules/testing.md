---
trigger: always_on
---

# testing.md
Job: what "done" means for a change, in any project.
Not here: the Fees release tests themselves (cross family test in database.md, 30 question list in ai-pipeline.md).

1. Tie every change to one PRD acceptance criterion, for example 6.2.3. If none fits, stop and ask. Why: a change with no criterion has no way to be called finished.
2. A change is done when a test for that criterion exists and passes. Run every test that can run without a database, Flutterwave or Gemini. Why: reading your own code is not proof.
3. Tests that need a database, Flutterwave or Gemini are written but not run (database-safety.md rule 8). Why: you cannot reach them, and the human must know they are unchecked.
4. End every response with a "Tests" section before the "Assumptions" section. It has three lists: ran and passed, ran and failed, not run and why. Why: the human reads this to decide what to check.
5. Never report a failing test as passing. Paste the first failing output. Why: a false pass costs more than a failure.
6. Do not edit, skip or delete an existing test to make it pass. If you think a test is wrong, say so and stop. Why: changing the test hides the bug.
7. A release is not ready until the human has run the cross family test and the 30 question list and reported both as passed. Why: the PRD sets zero tolerance on both.
