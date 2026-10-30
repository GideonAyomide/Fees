# The Working Tree: Pipeline Architecture & Single-Branch Vulnerability

## 1. Context & Architecture
Per Step 8 of Task Two, the Git working tree is not merely a local storage mechanism; it is a multi-stage pipeline carrying code from local developer authoring through to production runtime visibility:

```text
[ Working Directory ]  ->  [ Staging Area (Index) ]  ->  [ Local Repository (.git) ]  ->  [ Remote (GitHub) ]  ->  [ Production (Vercel) ]
     (Your computer)              (git add)                     (git commit)                    (git push)             (Deployment webhook)
```

Within this pipeline, branches are isolated pointers holding concurrent lines of work together.

---

## 2. The Two Critical Boundary Points

### Boundary Point 1: Where Code Becomes Visible to Users
* **Location**: The deployment trigger upon merging/pushing to the production tracking branch on GitHub (e.g. `main`).
* **Mechanism**: When a commit lands on `main` on GitHub, CI/CD webhooks automatically trigger an edge build on Vercel, deploying the new bundle globally across edge nodes.
* **Impact**: Prior to this boundary (in the local working directory, staging area, or on an unmerged feature branch), code changes are completely invisible to end-user parents. Past this point, any breaking bug, unstyled element, or broken API route immediately affects every live visitor.

### Boundary Point 2: The Point Past Which a Mistake Can No Longer Be Undone Quietly
* **Location**: Pushing to the shared remote repository on GitHub (`git push`).
* **Mechanism**: On a local machine, history can be rewritten silently (`git commit --amend`, `git reset HEAD~1`, `git rebase -i`). Once a commit is pushed to the remote repository, other team members, automated CI runners, and deployment hooks fetch that commit SHA.
* **Impact**: Attempting to rewrite remote history via `git push --force` breaks other developers' working copies and corrupts remote tracking refs. A mistake that has crossed to the remote can no longer be erased quietly; it requires an explicit, public compensating commit (`git revert <sha>`) that remains forever visible in the permanent audit trail.

---

## 3. What Breaks When a Tree Has Only One Branch (`main`)

Working directly on `main` without feature branches is common in solo prototype development, but introduces three fatal operational failures:

### 1. Coupled In-Flight Work and Deployment Blocking
When developing directly on `main`, incomplete or experimental work cannot be decoupled from hotfixes. If an engineer is halfway through refactoring the database schema and a critical regression appears in production (e.g., fee amounts displaying incorrectly), the engineer cannot ship a one-line bug fix without also deploying their unfinished schema refactor.

### 2. Elimination of Code Review & Pre-Merge Gatekeeping
A single-branch model bypasses GitHub Pull Request mechanics entirely. Automated linting, type-checks (`tsc --noEmit`), and integration tests cannot run as required status checks before code lands in the deployment stream. Code is merged before it is verified, rather than verified before it is merged.

### 3. Destruction of Rollback Granularity
When multiple features are authored directly on `main`, commits become intertwined. If Feature B turns out to be defective, rolling it back via `git revert` is fraught with merge conflicts because Feature A and Feature C depend on the same commit sequence. Feature branches isolate changes so an entire feature can be cleanly discarded or merged independently.

---

## 4. Why This Matters More After Your First Deployment Than Before It

Before the first deployment, the cost of broken software is virtually zero. No parent is checking balances, no bursar is reconciling payments, and no transactions are in-flight. If the local development server crashes or `main` is in a broken state for two days, only the developer's time is lost.

**After the first deployment, everything changes:**
1. **Real Humans Depend on Uptime**: Crown Heights Academy parents open the web app to pay fees or verify balances before taking their children to school. A broken `main` immediately locks parents out or displays alarming errors.
2. **Financial and Legal Liability**: In production, financial transactions pass through Flutterwave and writes hit Neon PostgreSQL. A faulty commit deployed to production can corrupt ledger rows, duplicate payment attempts, or leak cross-family balances.
3. **Emergency Fixes Are Inevitable**: In production, critical fixes (hotfixes) must be shipped within minutes. With a branching model (`main` protected, changes developed on short-lived branches like `fix/fee-rounding`), a hotfix can be branched from `main`, tested, reviewed, and fast-forward merged in five minutes without dragging along weeks of experimental code.
