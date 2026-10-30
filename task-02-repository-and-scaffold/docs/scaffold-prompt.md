# Scaffolding Prompt: Evolution & Rationale

### First Draft (Author's Draft)

```text
Write a scaffolding prompt for my AI coding agent to set up fees from scratch
The agent already has my context files and design system in the workspace. The prompt must make the agent:
- Find and read all the context files and the design system before writing code. Summarize what it understood, then stop and wait for my go ahead.
- Treat those files as the source of truth, if two files disagree, ask me and do not assume.
- Use only the design system tokens for styling. No hard coded values. And the agent must follow the design system rules, especially in applying colors.
- Build on the foundation: project setup, folder structure, base layout and a home screen that is 100vh and minimalistic. List the files it created and any assumptions it made.
- Keep it short and plain. Then audit and tell me what is missing.
```

---

### Final Version (Tightened Contract)

```text
You are an expert software engineer setting up the foundational scaffold for the Fees project.

Before generating any project files or writing any code, execute these instructions strictly in order:

1. Context Discovery & Read-Phase:
   Locate and read all repository context files (AGENTS.md, docs/Fees-PRD-v2-Flutterwave.md, .agent/rules/*, styles/tokens.css, design-tokens.tokens.json).
2. Deliberate Stop & Plan:
   Provide a concise summary of your technical understanding of the architecture, stack constraints (Next.js App Router, TypeScript, pure CSS variables, no heavy client libraries), and the domain requirements. State your step-by-step scaffolding plan and list all initial assumptions. STOP and wait for my explicit approval before creating or modifying any files.
3. Single Source of Truth:
   Treat the context files and design tokens as the sole source of truth. If any two files contradict each other or if requirements are ambiguous, STOP and ask me for clarification—do NOT guess or make unilateral decisions.
4. Strict Token Consumption:
   Apply styling exclusively through the design system CSS variables (styles/tokens.css). Do not hardcode any hex codes, RGB values, pixel font sizes, or ad-hoc margins. Strictly respect the two-tier rule: use semantic color roles (--color-*) on the UI; do not use raw primitives (--primitive-*).
5. Foundation Only (Scope Boundary):
   Build ONLY the project scaffold: the core Next.js project configuration (package.json, tsconfig.json, next.config.ts), global layout importing tokens.css, and a minimal, responsive 100vh home screen shell. Do NOT implement authentication flows, database models, payment endpoints, or customer features yet.
6. Execution Inventory:
   After execution, list every file created or modified, and explicitly record every assumption made during the run.
7. Self-Audit:
   Conclude by auditing your output line-by-line against these eight constraints, declaring whether each was satisfied or if any violation occurred.
```

---

### What Changed Between the Drafts and Why

The initial draft correctly identified the essential requirements, but like most human-written prompts, it was vulnerable to common AI failure modes:
1. **Preventing Premature Code Generation**: In the first draft, the phrase *"Summarize what it understood, then stop and wait for my go ahead"* was grouped with other points, which agents frequently treat as a suggestion while proceeding to write code in the same pass. The tightened version isolates this into a dedicated **Phase 1 (Discovery & Plan)** with an explicit, capitalized **STOP** command requiring user approval before any file creation tool is called.
2. **Explicit Stack Constraints**: The first draft mentioned *"project setup, folder structure, base layout"*. The final version explicitly anchors this to the project's non-negotiable tech stack defined in the PRD (Next.js App Router, TypeScript, zero unapproved client libraries), preventing the agent from reaching for generic templates (e.g. Create React App, Tailwind, or Vite).
3. **Hardening Design Token Rules**: The draft noted *"no hard coded values... especially in applying colors"*. The final version makes this actionable by explicitly referencing the compiled `styles/tokens.css` file and reinforcing the system contract: semantic color roles (`--color-*`) must be used for UI elements, while raw primitives (`--primitive-*`) are forbidden on components.
4. **Formal Self-Audit**: The draft ended with *"Then audit and tell me what is missing"*. The tightened version elevates this into an active compliance gate where the agent must evaluate its own output against each numbered constraint, forcing it to catch its own hallucinations or scope creep before the user reviews it.

