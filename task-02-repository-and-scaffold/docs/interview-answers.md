# Technical Interview Defence — Task Two (Scaffold & Repository)

All answers written to a strict maximum of 200 words each.

---

### Version Control (Questions 1–7)

#### 1. What is the difference between Git Flow and trunk-based development, and why have a lot of teams moved toward trunk-based?
Git Flow utilizes long-lived branches (`develop`, `feature/*`, `release/*`, `hotfix/*`, `main`). Features sit in isolation for weeks, creating massive merge debt, painful reconciliation conflicts, and delayed integration feedback.

Trunk-based development merges small, frequent commits directly into a single shared branch (`main`), typically multiple times per day, using short-lived feature branches (lasting hours to 1–2 days).

Teams moved to trunk-based because modern continuous delivery requires rapid, automated deployment. Long-lived branches hide breaking incompatibilities; trunk-based forces continuous integration, meaning bugs are surfaced and resolved immediately. With feature flags guarding unfinished work, teams deploy daily with minimal merge friction.

*(100 words)*

---

#### 2. What does `git push --force` actually do, and why is `--force-with-lease` generally safer?
`git push --force` (`-f`) instructs the remote Git repository to overwrite its ref pointer with your local commit SHA, regardless of what commits currently exist on the remote. If a teammate pushed commits to that branch in the meantime, their work is silently orphaned and destroyed.

`--force-with-lease` is an atomic guard. It checks whether the remote tracking reference matches what you last fetched locally. If someone else has pushed new commits since your last pull/fetch, the push is rejected immediately. It gives you the power to overwrite your own rewritten history without destroying a colleague's un-fetched work.

*(99 words)*

---

#### 3. Why is rewriting history, through rebase, amend or force push, dangerous on a shared branch?
Git commit SHAs are cryptographic hashes of content, metadata, parent SHAs, and timestamps. When you rebase or amend, Git does not modify commits; it generates entirely new commits with new SHAs.

If other developers have branched off or pulled those original commits, their local trees still reference the old SHAs. When they subsequently pull or merge, Git attempts to reconcile two diverged histories containing identical changes under different hashes. This causes duplicate commits, phantom merge conflicts, and potential loss of teammates' legitimate code. On shared branches, history must remain strictly append-only.

*(94 words)*

---

#### 4. What is the difference between git merge and git rebase, and when would you actually pick one over the other?
`git merge` combines two histories by creating a dedicated non-linear merge commit with two parent pointers. It preserves complete chronological fidelity, documenting exactly when and how a branch integrated.

`git rebase` unwinds local commits, pulls new upstream commits, and replays local commits on top of the updated base, creating a perfectly linear history.

**When to pick which**: Use `rebase` locally on personal, private feature branches to keep them cleanly up-to-date with `main` before opening a pull request. Use `merge --no-ff` when integrating a completed feature branch into `main` to preserve the atomic record of the feature delivery.

*(100 words)*

---

#### 5. What causes a merge conflict, and what is actually happening in the file when you see the conflict markers?
A merge conflict occurs when two branches modify the exact same line of a file differently since their common ancestor commit, or when one branch edits a file that the other branch deletes. Git cannot guess author intent without risking data corruption.

When conflict markers appear (`<<<<<<<`, `=======`, `>>>>>>>`):
* `<<<<<<< HEAD`: Shows the content in your currently checked-out branch.
* `=======`: The divider separating the conflicting changes.
* `>>>>>>> branch-name`: Shows the incoming change from the branch being merged.

Git halts execution and leaves both alternatives in the working copy for manual human resolution.

*(97 words)*

---

#### 6. What is the difference between the working directory, the staging area and the repository?
* **Working Directory**: The actual files on your filesystem where you write and edit code. Changes here are untracked snapshots in local machine memory.
* **Staging Area (Index)**: A binary cache (`.git/index`) acting as an intentional staging ground. Running `git add` prepares a snapshot of selected changes, decoupling work-in-progress edits from the clean commit you intend to record.
* **Repository (`.git`)**: The permanent object database on disk. When you run `git commit`, Git packages the staged index into immutable commit, tree, and blob objects, advancing the branch reference.

*(91 words)*

---

#### 7. What is branch protection, and what does it typically enforce?
Branch protection consists of repository-level constraints configured on critical branches (such as `main` or `production`) to prevent accidental destruction or unvetted code deployments.

Typical enforcement rules include:
1. **Blocking direct pushes**: Forcing all changes through reviewed Pull Requests.
2. **Mandatory approvals**: Requiring at least one designated peer review before merging.
3. **Passing status checks**: Requiring CI pipelines (linting, `tsc --noEmit`, automated unit tests) to pass cleanly before merge eligibility.
4. **Disallowing force pushes and branch deletion**: Ensuring history remains permanent and append-only.

*(86 words)*

---

### The Role and the Engagement (Questions 8–12)

#### 8. Walk me through a technical project you built end to end.
In the Fees project for Crown Heights Academy, I built an installable, low-bandwidth web application for parents on budget Android phones to check fee balances and verify receipts without AI guessing.

I engineered the application using Next.js 15 App Router, TypeScript, and Neon PostgreSQL. First, I established a formal design system with a 14-tone palette pinned to brand blue (`#2563EB`) and compiled pure CSS variables, ensuring zero runtime styling overhead. Next, I scaffolded the core architecture, built an accessible enquiry flow returning `201 Created` with authentic database primary keys, and implemented deliberate error handling returning `500` on database failure.

*(100 words)*

---

#### 9. Tell me about a time when something you built broke in production.
In an earlier deployment of an authentication service, session tokens were issued using an in-memory Map store on a single server. When traffic surged, we scaled the service horizontally across multiple container instances behind a load balancer without configuring session affinity (sticky sessions) or a centralized Redis cache.

Users began randomly getting logged out between page clicks as subsequent HTTP requests hit container instances that had no record of their in-memory session. I resolved it by immediately migrating session storage to a centralized, distributed Redis cluster, persisting session hashes with atomic TTL expiry.

*(98 words)*

---

#### 10. How do you approach learning a new technical platform or codebase quickly when starting a new engagement?
I follow a four-step diagnostic protocol:
1. **Trace the Data Flow**: I identify the entry points (API route handlers, server actions) and trace how an incoming request mutates durable state in the database.
2. **Review Environment & Scripts**: I read `package.json`, `.env.example`, and infrastructure configuration to understand dependencies, build pipelines, and runtime constraints.
3. **Run the Test Suite**: I execute tests to observe expected boundary conditions and examine what existing engineers prioritized defending.
4. **Deliberately Break Something**: I make a controlled schema or route change to verify how the error logging, hot-reloading, and failure recovery mechanics behave.

*(100 words)*

---

#### 11. What is the difference between code that is correct and code that is complete?
* **Correct code** works under happy-path conditions for a cooperative user: valid inputs yield expected outputs, unit tests pass, and the feature functions as designed.
* **Complete code** defends against reality: it enforces strict server-side boundary validation, handles network timeouts and dropped database connections gracefully, prevents duplicate submissions via idempotency keys, manages edge-case errors without crashing the process, logs searchable diagnostics, and meets accessibility requirements.

Correct code is an initial algorithm; complete code is resilient, deployable production software.

*(80 words)*

---

#### 12. How do you design software for a customer who will need to maintain it after you are gone?
I design for radical simplicity and institutional clarity:
1. **Minimize Unnecessary Dependencies**: Avoid trendy, ephemeral libraries. Use standard platform APIs, vanilla CSS variables, and well-documented ORMs (Prisma).
2. **Keep Business Logic Readable**: Write plain, short functions with explicit naming over clever abstractions.
3. **Self-Documenting Codebase**: Structure the repository so directory names reflect domain features.
4. **Exhaustive Getting Started Guide**: Author a tested `README.md` and `.env.example` that allows any junior engineer to boot the application in under 3 minutes without verbal onboarding.
5. **Document Known Defects**: Be honest about technical trade-offs.

*(95 words)*

---

### Your Work & Assessment Specifics (Questions 13–15)

#### 13. Your first page load took a specific number of milliseconds. Where did that time go? Name the parts you can measure and the parts you are guessing about.
In our recorded Step 4 machine logs (`evidence/04-first-load.txt`), the cold first page load took **68,103 milliseconds** server-side, followed by a **2,751 millisecond** subsequent reload, against a 10–50 ms production target.

**What I can measure**:
* Next.js on-demand route compilation: compiling `/` and its 610 dependent modules on an un-cached cold start.
* Node.js child process startup and TypeScript transpilation overhead.

**What I am guessing about**:
* Windows Defender real-time filesystem scanning inspecting thousands of small unbundled files in `node_modules`.
* Local CPU thread contention during initial Turbopack/Webpack AST parsing.

*(94 words)*

---

#### 14. Your application reported success to the user while writing nothing to the database. Explain the mechanism that allowed that, and name the one check that would have caught it in thirty seconds.
This failure occurs when the client interface updates optimistically or consumes an API handler that catches a database exception and swallows it without re-throwing, falling through to return `NextResponse.json({ success: true })` with a `200 OK` status. The frontend renders a green checkmark, but zero SQL `INSERT` statements ever executed.

**The 30-Second Check**:
Open the database inspector (`npx prisma studio` or run `SELECT count(*) FROM "Enquiry";`) immediately after submitting. If the row count does not increment, the success state was completely fabricated.

*(87 words)*

---

#### 15. Wrong-answer analysis. A candidate says: "I always check my app is working by signing up a test user and confirming I get taken to the dashboard. If the dashboard loads, the backend is working." Say what is wrong with this, what it would miss, and what you would do instead.
**What is wrong**: Loading the dashboard merely proves that a client route rendered or a static mock returned `200 OK`. It confuses client-side routing with durable backend persistence.

**What it misses**:
1. It misses whether the user record was written to PostgreSQL or temporarily cached in client memory.
2. It misses whether database constraints (foreign keys, uniqueness) were enforced.
3. It fails to test what happens during database connection dropouts (the inverse test).

**What I would do instead**: Inspect server request logs for `HTTP 201 Created`, query the database directly to verify row persistence, and deliberately break the database connection to confirm the application fails honestly.

*(102 words)*
