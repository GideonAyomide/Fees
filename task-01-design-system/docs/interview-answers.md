# Interview Defence: Task One

### 1. How would you structure design tokens?
I structure design tokens into a three-tier architecture:
1. **Global/Primitive Tokens**: Foundational raw values (e.g., `--primitive-primary-40: #2563EB;`, `--primitive-spacing-16: 16px;`). These are internal palette definitions and are never consumed directly by UI components.
2. **Semantic/System Tokens**: Context-aware roles that define design intent (e.g., `--color-primary: var(--primitive-primary-40);`, `--color-surface`, `--color-on-surface`). These map primitives to their functional purpose.
3. **Component Tokens**: Scoped variables tied to specific elements (e.g., `--button-primary-bg: var(--color-primary);`).

This hierarchy isolates change. A brand refresh updates primitives; dark mode or high-contrast themes simply remap semantic aliases; and component changes remain strictly localized without touching global styles. *(109 words)*

---

### 2. When is a token change breaking?
A token change is breaking in three distinct scenarios:
1. **Name Deletion or Renaming**: Renaming `--color-primary` to `--color-brand` or deleting an existing token leaves consuming components with unresolved CSS variables, causing elements to render transparent or unstyled.
2. **Semantic Role Inversion**: Changing the established intent of a role—such as changing `--color-surface` from light neutral to dark accent—breaks legibility and contrast across all nested child components.
3. **Contrast Regression**: Altering a primitive value (e.g., shifting primary blue from `#2563EB` to `#60A5FA`) such that its relationship with `--color-on-primary` drops below the WCAG 4.5:1 threshold. 

Cosmetic value tweaks (e.g., adjusting border radius from 8px to 10px) are non-breaking, but altering token identifiers, semantic contracts, or accessibility ratios breaks production software. *(127 words)*

---

### 3. How would you support multiple brands and themes?
Multiple brands and themes are supported entirely through semantic indirection. UI components are built to consume only semantic role variables (`--color-surface`, `--color-primary`, `--color-on-surface`), never raw primitive values.

Brands and themes are defined as discrete sets of semantic mappings scoped to CSS selectors or data attributes (e.g., `[data-theme="dark"]` or `[data-brand="secondary-school"]`). To switch themes, you swap which primitives the semantic roles point to:
```css
:root {
  --color-surface: var(--primitive-neutral-98);
  --color-on-surface: var(--primitive-neutral-10);
}
[data-theme="dark"] {
  --color-surface: var(--primitive-neutral-10);
  --color-on-surface: var(--primitive-neutral-98);
}
```
Component code remains 100% unchanged across all brands and themes. *(104 words)*

---

### 4. Can tokens guarantee accessible contrast?
No. Design tokens cannot independently guarantee accessible contrast. Tokens represent isolated CSS values, whereas contrast is an optical relationship between two colors rendered concurrently in the DOM.

Even if a design system provides accessible pairings (such as `--color-primary` and `--color-on-primary`), a developer can mistakenly place `--color-on-surface-variant` on top of `--color-primary`, producing an unreadable 2:1 contrast ratio. Tokens provide the building blocks for accessibility, but guaranteeing compliance requires pairing conventions, strict component encapsulation (e.g. compound Button components that bind text and background together), automated CI axe-core testing, and visual QA audits. *(101 words)*

---

### 5. How do you ensure that colour contrast guidelines are met within a website or application's design?
I ensure contrast compliance through a four-layer verification pipeline:
1. **Mathematical Verification in Design**: Calculate relative luminance for all official role pairs during token generation, ensuring text/background combinations meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text).
2. **Component Encapsulation**: Enforce valid role pairings inside design system components so developers cannot accidentally pair mismatched foreground and background tokens.
3. **Automated CI Auditing**: Run headless Lighthouse and axe-core accessibility scanners across rendered pages during automated pull request builds.
4. **Hardware and Vision Simulation**: Test interfaces on low-brightness budget mobile screens and run color-blindness simulation filters (protanopia, deuteranopia) to ensure information is conveyed through typography and icons rather than color alone. *(118 words)*

---

### 6. Can you discuss the differences between WCAG levels A, AA and AAA?
WCAG organizes accessibility conformance into three progressive tiers:
- **Level A (Essential Minimum)**: Addresses critical barriers that completely block disabled users (e.g., full keyboard navigability, alternative text for non-text content, no keyboard traps, and not relying solely on color to convey state).
- **Level AA (Global Industry Standard)**: The target for commercial and government applications. Requires 4.5:1 contrast for regular text, 3:1 for large text (18pt or bold 14pt) and UI components, visible keyboard focus indicators, and consistent navigation patterns.
- **Level AAA (Specialized Enhancement)**: The highest standard. Requires 7:1 contrast for normal text, 4.5:1 for large text, sign language interpretation for audio, and no timing constraints. Full AAA compliance is rarely feasible across an entire app, but is selectively applied to critical legal and financial notices. *(127 words)*

---

### 7. Discuss the importance of semantic HTML in the context of accessibility.
Semantic HTML elements (`<main>`, `<nav>`, `<article>`, `<button>`, `<fieldset>`) provide native accessibility semantics that `<div>` and `<span>` elements lack. 

When browsers encounter semantic tags, they automatically populate the browser Accessibility Tree with standardized roles, properties, and states. Assistive technologies use these landmarks to announce structure and allow screen reader users to jump between sections. Furthermore, native interactive elements like `<button>` provide out-of-the-box keyboard focus management (`Tab`), event handlers (`Enter` and `Space`), and state announcements without custom JavaScript or fragile ARIA workarounds. Semantic HTML ensures the application is operable across all assistive devices by default. *(102 words)*

---

### 8. How do you handle design handoff to developers using Figma?
I approach design handoff as an automated engineering pipeline:
1. **Token Synchronization**: All Figma variables (colors, typography scales, spacing, shadows) mirror the codebase naming schema 1-to-1.
2. **Automated Token Export**: Tokens are exported from Figma via JSON and compiled to CSS variables via automated build scripts, eliminating manual copy-pasting.
3. **Figma Code Connect**: Figma components are linked directly to production repository code snippets, displaying exact props and variants.
4. **Interactive Specs**: Every design spec includes explicit responsive wrapping boundaries, tap targets (minimum 48x48px), loading skeletons, and empty/error states.
5. **Handoff Review**: A live walkthrough with engineering to review edge cases, offline behavior, and accessibility pairing rules before implementation begins. *(115 words)*

---

### 9. Why do AI-generated interfaces tend to look generic, and what specifically do you hand an agent to stop it?
AI models are statistical completion engines trained on common web templates. When asked to generate an interface without strict constraints, the model outputs the statistically most probable pattern: centered cards, generic slate-gray palettes, floating purple gradients, and standard 8px radiuses.

To prevent generic outputs, you must strip the agent of aesthetic discretion by handing it:
1. **A Compiled CSS Token File**: A single source of truth (`tokens.css`) containing strictly enforced semantic roles.
2. **Explicit Negative Constraints**: Strict rules forbidding raw hex values, arbitrary inline styles, and unapproved UI libraries.
3. **Domain-Specific Information Architecture**: Exact typography utility classes and text-first component hierarchies derived from the real-world business brief. *(113 words)*

---

### 10. Your line height for display large is a specific number. Why that number and not one step either side of it? What would you lose with each?
Our `Display Large` style pairs 57px type with a 64px line height (`~1.12x` multiplier).
- **One Step Tighter (e.g. 56px–60px)**: Descenders on line one visually collide with tall ascenders and currency symbols on line two (e.g. the vertical stroke of the Nigerian Naira symbol "₦" crashing into digits below), destroying character recognition.
- **One Step Looser (e.g. 72px / 1.25x)**: The line height adds excessive vertical whitespace. On budget Android screens with 640px vertical viewports, an extra 16px pushes the critical due date and bursar ledger stamp below the fold.

64px is the precise optical threshold that prevents glyph collisions while keeping the entire balance statement visible without scrolling. *(117 words)*

---

### 11. Point at one place in your own token structure that you would build differently if you started again. Say what you would do instead and what it would cost.
In our current export, primitive color scales contain repetitive nested keys in their path definitions (e.g., `primitives.neutral variant.neutral variant90` and `primitives.primary.primary40`). In addition, `key colours` contains a Figma export typo (`neutral variant key coour`).

If starting again, I would enforce strict dot notation (`primitives.<group>.<tone>`, such as `primitives.primary.40` and `primitives.neutral-variant.90`). 

**What It Would Cost**: Refactoring this now requires modifying the Figma variable collections, re-exporting the JSON tokens, updating the resolution parser in `build-tokens.js`, and adjusting any downstream token mapping files. *(92 words)*

---

### 12. Wrong-answer analysis. A candidate says: "I set up design tokens by exporting the hex values from Figma into a CSS file, so every colour in the codebase comes from one place. That makes it a single source of truth." This sounds correct and is not. Say precisely what is missing and what will go wrong in month four.
**What Is Missing**: The candidate exported only raw primitives (hex codes) and failed to construct a semantic role tier (Color Roles like `surface`, `on-surface`, `primary`). They created a centralized color palette, not a design system.

**What Goes Wrong in Month Four**: When the business requests dark mode, high-contrast accessibility themes, or a brand refresh in month four, the team discovers that components directly consume raw palette names (`--blue-500`, `--hex-2563eb`). To invert surface colors for dark mode, developers cannot simply remap a semantic alias; they must manually inspect and rewrite thousands of lines of component CSS. Modifying `--blue-500` changes buttons and backgrounds indiscriminately, destroying contrast and breaking the UI. *(112 words)*

