# Forward-Only Migrations, Schema Drift, and Operational Discipline

## Overview
This document explains the rationale and operational practices governing database migrations at Crown Heights Academy, specifically covering forward-only migration discipline, the hazards of mutating historical migrations, and why migrations must strictly be executed by human operators rather than autonomous agents.

---

## 1. Why Forward-Only Migrations?

A **forward-only migration architecture** dictates that any modification to a database's structure, columns, indexes, or constraints must only be applied as a new, incremental, forward-marching migration script.

### The Failure It Prevents: State Divergence & Rollback Data Destruction
In traditional development, engineers sometimes attempt "down" or "rollback" migrations (`DROP COLUMN`, `DROP TABLE`) to undo changes. In production, down migrations are catastrophic:
1. **Permanent Data Destruction**: Dropping a column destroys historical customer and audit data instantly. Once dropped, that data is unrecoverable without restoring multi-gigabyte cold database backups.
2. **Environment Divergence**: When multiple developer branches, staging environments, and production run rollback scripts, schemas fall out of synchronization. Two environments that ran different rollback orders end up with distinct catalog states despite sharing the same Git commit.
3. **Continuous Deployment Incompatibility**: In modern continuous deployment (CD), application code and database schemas must remain backward-compatible during zero-downtime rolling deploys. A forward-only migration introduces changes non-destructively (e.g. adding an optional column, backfilling data, and only then deprecating old fields).

---

## 2. Why You Never Edit a Migration That Has Already Run

Once a migration file (e.g., `0001_initial/migration.sql`) has executed in any shared environment (production, staging, or a colleague's local machine), its file in the repository must be treated as **immutable**.

### What Goes Wrong If You Edit It:
1. **Prisma & ORM Migration Checksum Mismatch**:
   Database migration runners store a cryptographic SHA-256 hash of each applied migration script in an internal tracking table (`_prisma_migrations`). If a developer retroactively modifies a migration file:
   * The ORM detects that the checksum on disk differs from the recorded checksum in the database.
   * The migration engine halts deployment immediately with an unrecoverable `MigrationChecksumMismatch` error, refusing to proceed until manual database surgery is performed.
2. **Silent Schema Drift in Production**:
   If an edited migration is applied to a fresh development environment, the developer's local database reflects the edited version, while the production database still reflects the original version. The application runs locally but crashes in production when querying fields that only exist in the modified script.

---

## 3. Why We Run Migrations by Hand (The Propose-and-Stop Rule)

Under our project's strict database safety protocol ([`.agent/rules/database-safety.md`](file:///c:/Users/HP/Desktop/Fees/.agent/rules/database-safety.md)), AI agents are forbidden from executing commands that connect to or modify a database (`prisma migrate`, `prisma db push`, `SQL` executions). The agent proposes the schema changes in text, and the human developer executes them by hand in their terminal.

### The Security & Operational Rationale:
1. **Accidental Production Destruction**: An autonomous agent operating in a terminal does not distinguish between a development branch and a production connection string if an environment variable is misconfigured or inherited. A single automated `prisma migrate reset --force` or table drop would obliterate production fee records.
2. **Human Deliberation on Data Loss**: When adding a non-nullable column to a table with existing rows, automated tools either crash or drop existing records. A human engineer deliberates and breaks the change into three deliberate stages:
   * Stage 1: Add column as nullable (`optional`).
   * Stage 2: Backfill existing rows with sensible defaults.
   * Stage 3: Alter column to `NOT NULL` (required).
3. **Dual-Key Control**: Critical business infrastructure (such as student fee balances and legal payment audit tables) requires dual-key authorization: the AI assists in drafting the code, but human hands turn the key to commit structural changes to persistent storage.

---

## 4. The Honest Cost of Running Migrations by Hand

While the propose-and-stop rule provides vital safety, it comes with real, quantifiable operational costs that must be acknowledged:
1. **Deployment Friction & Slower Velocity**:
   A workflow requiring manual terminal intervention cannot achieve fully autonomous zero-touch continuous deployment. Every schema evolution requires a human engineer to open a terminal, authenticate credentials, verify connection strings, and monitor the migration output.
2. **Human Forgetfulness & Drift Vulnerability**:
   Humans forget. A developer pulling the latest code from `main` may forget to run `npx prisma migrate dev`, leading to schema drift where the newly pulled application code expects database columns that have not yet been applied locally.
3. **Time-Zone Bottlenecks**:
   If an automated CI/CD pipeline stops at a migration gate requiring human execution, deployments are blocked whenever the designated database operator is unavailable, out of coverage, or in a different time zone.

Despite these friction costs, in a financial school fees retrieval system where minor records and legal payments are stored, the cost of a delay is minor; the cost of an automated table wipe is fatal.

