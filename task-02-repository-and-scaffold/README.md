# Task Two: Scaffold It, Ship the Repository, Then Find Out What Is Actually Running

## Overview for Technical Interviewers (4-Minute Read)

### 1. What This Task Was
Task Two tests whether an engineer can direct an AI agent to scaffold an application strictly from design tokens and business specifications without losing control, present the repository as a professional artifact, and systematically diagnose what is running under the hood rather than trusting optimistic UI claims.

---

### 2. What Was Built & Evidenced
1. **Context-Grounded Scaffolding**:
   - Authored and tightened an 8-point prompt forcing the agent to read all specifications, audit constraints, and wait for human approval before creating files ([`docs/scaffold-prompt.md`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/docs/scaffold-prompt.md)).
   - Captured agent plan and file inventory prior to code generation ([`evidence/01-agent-plan.txt`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/evidence/01-agent-plan.txt), [`02-files-created.txt`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/evidence/02-files-created.txt)).
2. **Server Performance Profiling**:
   - Profiled cold dev server startup and first page compilation ([`evidence/03-server-start.txt`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/evidence/03-server-start.txt), [`04-first-load.txt`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/evidence/04-first-load.txt)).
   - Analyzed the gap between a 68,103 ms cold start, a 2,751 ms reload, and a 10 ms production target ([`docs/performance-note.md`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/docs/performance-note.md)).
3. **Three Server Breakages & Machine Recoveries**:
   - **Nested Folder**: Recreated `ENOENT` failure and documented both `cd` and in-place rescaffolding fixes ([`evidence/05-nested-folder-error.txt`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/evidence/05-nested-folder-error.txt), [`06-nested-folder-fixed.txt`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/evidence/06-nested-folder-fixed.txt)).
   - **Port Collision**: Captured socket conflict on port 3000, terminated blocking process PID `22264`, and restarted cleanly ([`evidence/07-port-conflict.txt`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/evidence/07-port-conflict.txt), [`08-port-conflict-resolved.txt`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/evidence/08-port-conflict-resolved.txt)).
   - **404 Handling**: Diagnosed unstyled Next.js error and resolved with brand-styled [`app/not-found.tsx`](file:///c:/Users/HP/Desktop/Fees/app/not-found.tsx) ([`evidence/09-404-error.txt`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/evidence/09-404-error.txt), [`10-404-resolved.txt`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/evidence/10-404-resolved.txt)).
4. **Database Persistence & False-Success Investigation**:
   - Implemented an accessible enquiry flow writing to Neon PostgreSQL via Prisma.
   - Captured live terminal logs proving **`HTTP 201 Created`** (`POST /api/enquiry 201 in 4020ms`) ([`evidence/11-write-succeeded-logs.txt`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/evidence/11-write-succeeded-logs.txt)).
   - Inspected live database rows showing non-faked timestamps minutes apart ([`evidence/12-database-rows.PNG`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/evidence/12-database-rows.PNG)).
   - Executed the inverse connection failure test, capturing `HTTP 500 in 2172ms` to prove the UI never fakes success ([`evidence/13-write-failed-logs.txt`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/evidence/13-write-failed-logs.txt), [`docs/false-success.md`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/docs/false-success.md)).
5. **The Repository as a Professional Artifact**:
   - Authored the root [`README.md`](file:///c:/Users/HP/Desktop/Fees/README.md) across all seven mandatory sections.
   - Tested onboarding usability with an external peer developer and documented friction points ([`docs/readme-test.md`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/docs/readme-test.md)).
6. **Working Tree & Branching Discipline**:
   - Documented the five-stage pipeline and single-branch vulnerability ([`docs/working-tree.md`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/docs/working-tree.md)).
   - Visualized architecture in [`evidence/14-working-tree-drawing.jpg`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/evidence/14-working-tree-drawing.jpg).
   - Created feature branch `feature/information-design`, merged via PR with non-fast-forward topology, and safely discarded unmerged exploratory branch `experiment/floating-chat-widget` ([`evidence/15-git-log-graph.txt`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/evidence/15-git-log-graph.txt)).
7. **Information Design (Head & Body)**:
   - Dynamic page titles, 9-word tagline, custom SVG favicon (`app/icon.svg`), and Open Graph metadata.
   - Collapsed choice (unified sign-in button), deliberate heading wrap (`text-wrap: balance`), `rem`-padded buttons, and fluid clamp typography (`clamp(1.75rem, 5vw + 0.5rem, 2.375rem)`) ([`docs/information-design.md`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/docs/information-design.md)).

---

### 3. Key Decisions & Rationales
* **Antigravity vs. Fast Autocompletion**: Selected Antigravity for architectural scaffolding because planning-focused agents deliberate against project constraints and prevent hallucinations, whereas fast autocompletion models emit duplicate, unchecked functions.
* **Unified Sign-in Button**: Collapsed separate "Login" and "Activate" buttons into a single primary action. In a school fees portal used 6–8 times a term, entering a phone number first allows the backend to route returning vs. first-time parents automatically.
* **Pure CSS Variable Tokens**: Zero-runtime styling over Tailwind or CSS-in-JS to guarantee minimal bundle size for budget Android phones on 3G networks.

---

### 4. What Went Wrong (And What It Cost)
1. **Cold Compile Latency**: On initial run, Next.js took 68,103 ms to compile `/` because of heavy module transpilation and Windows Defender disk inspection.
2. **Missing Environment Variable Failure**: The first database write attempt failed with `Environment variable not found: DATABASE_URL`. Rather than hiding the error, we documented it as authentic machine proof for the inverse failure test.
3. **Token Pass-Through Defect**: Detected that `scripts/build-tokens.js` passes through raw hex codes when semantic role keys are missing. Documented with line numbers in [`docs/defects.md`](file:///c:/Users/HP/Desktop/Fees/task-02-repository-and-scaffold/docs/defects.md).

---

### 5. Task Deliverables Inventory
* **Documentation**: `scaffold-prompt.md`, `model-choices.md`, `performance-note.md`, `false-success.md`, `readme-test.md`, `working-tree.md`, `information-design.md`, `defects.md`, `interview-answers.md`.
* **Evidence Files**: `01` through `15` present in `evidence/`. Screenshots `16` through `20` ready for browser capture via `screens/`.
