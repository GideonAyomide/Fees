# Model Choices: Strategic Allocation & Trade-Offs

### 1. Which Model for Which Job

In this project, AI models are treated as specialized engineering tools rather than interchangeable chat engines:

- **Antigravity (Deliberate Planning & Scaffolding)**:
  - *Allocated To*: Initial repository scaffolding, architectural planning, design token compiler construction, and compliance auditing.
  - *Why*: Antigravity is built around deep context discovery. It ingests and synthesizes repository rules (`AGENTS.md`, `Fees-PRD-v2-Flutterwave.md`, `.agent/rules/*`), plans multi-step operations before executing tools, and strictly respects "stop-and-ask" safety gates. For scaffolding, deliberate speed is an asset; handing control to an unconstrained model at the scaffold stage results in bloated, unmaintainable boilerplate.
- **Fast Code-Generation Models (e.g., Open Code / Fast Autocomplete Models)**:
  - *Allocated To*: Localized unit test suites, pure mathematical algorithms (such as WCAG contrast formulas), and self-contained utility functions.
  - *Why*: Once architectural boundaries, types, and token schemas are established by the planning model, fast models excel at rapid code emission where the scope is strictly isolated to a single file.

---

### 2. Observed Differences in Practice

| Dimension | Antigravity (Planning Model) | Fast Generation Model (Open Code) |
| :--- | :--- | :--- |
| **Time-to-First-Token** | Slower (reads context, parses rules, builds internal mental model). | Instantaneous (begins streaming code immediately). |
| **Negative Constraints** | High compliance. Respects instructions like *"Do NOT build the product yet"* and *"No raw hex codes"*. | Low compliance. Tends to build complete signup flows and dashboards unprompted. |
| **Context Integration** | Deep. Cross-references PRD acceptance criteria and design system rules across multiple files. | Shallow. Optimizes for local completion, frequently inventing unapproved packages or CSS classes. |
| **Failure Mode** | Over-deliberation or verbose pre-flight plans. | Premature implementation and hallucinated libraries. |

---

### 3. One Task Where I Chose Wrong and Switched

- **The Task**: Generating the token conversion compiler (`scripts/build-tokens.js`) from `design-tokens.tokens.json`.
- **The Wrong Choice**: I initially reached for a fast code-completion model, expecting a quick 20-line JSON-to-CSS loop.
- **What Went Wrong**: The fast model ignored the crucial design system rule requiring a strict two-tier separation between primitive base colors and semantic color roles. It treated all 151 tokens as a flat dictionary, generating direct hex CSS variables like `--primary-primary40: #2563eb;` and directly applying them to components. It failed to resolve the `{primitives.primary.primary40}` path references and completely discarded the public semantic contract (`--color-primary`, `--color-surface`).
- **The Switch**: I halted the fast model, discarded its script, and engaged Antigravity with the tightened prompt. Antigravity systematically indexed all 151 primitive tokens into a lookup map, resolved all 50 semantic color roles to `var(--primitive-...)` references, preserved the source of truth, and generated typography utility classes with zero unresolved references.

