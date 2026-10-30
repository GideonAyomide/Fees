---
trigger: always_on
---

# database-safety.md
Job: how you behave around any database, in any project.
Not here: the Fees tables, roles and row rules (database.md).

A database change means any change to a table, column, index, row rule, role, extension, grant or stored data row.

1. Write code that uses a database. Never run that code against a database. This includes the dev server, any test run that connects, and any script. Why: one wrong run can change or expose real records.
2. You are not given a connection string. If you find one in a file, stop and tell the human. Why: a connection string in reach is a way to break rule 1 by accident.
3. Never run `prisma migrate`, `prisma db push`, `prisma db pull`, `prisma db seed`, `prisma studio` or any SQL tool. You may run `prisma generate`, `prisma validate`, `prisma format`, type checks and lint, because they do not connect. Why: the first group changes or reads a database, the second does not.
4. Do not edit the Prisma schema file. Do not write a migration file. Why: a schema or migration change is a database change.
5. When a task needs a database change, stop. Put a proposal in your response with four parts: the change as text, why the task needs it, what could break, and how to undo it. Why: the human must approve every database change before it exists.
6. Start the proposal with the word "DESTRUCTIVE:" if it drops, deletes, truncates or narrows anything. Why: the human must see data loss before reading anything else.
7. Use invented data in code, examples and tests. Never use a real name, phone number or balance. Why: test data leaks into screenshots and logs.
8. Write tests that need a database, but do not run them. Label each "not run: needs a database" and give the human the command to run it. Why: you cannot run them, and an unlabeled test looks like a passed test.
