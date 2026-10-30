# Task One: The Design System, and Proving the Agent Used It

## What This Task Was
This task establishes a formal design system for **Fees** (Crown Heights Academy), exports it from Figma into code as a machine-readable single source of truth, and enforces an unambiguous two-tier token architecture: primitive colors serve strictly as the internal palette backing, while semantic color roles serve as the sole public contract consumed by UI components.

## What You Built
1. **Design System Specification & Export**:
   - `06-tokens-complete.json`: Complete design token export from Figma containing 151 primitive color tokens, 50 semantic color roles, 3 elevation drop-shadows, and 15 typography styles.
   - `05-tokens-incomplete.json`: Intentional flawed export capturing the common omission where Figma color variables are excluded.
2. **Automated Token Compiler (`scripts/build-tokens.js`)**:
   - Compiles JSON tokens into CSS custom properties (`styles/tokens.css`).
   - Resolves all token references (`{primitives....}`) to CSS `var(--primitive-...)` variables.
   - Generates `.text-*` utility classes for rapid type implementation.
3. **Automated Test Suite (`tests/tokens.test.js`)**:
   - Verifies 100% reference resolution, WCAG contrast thresholds, and file generation integrity.

## What You Decided
1. **Two-Tier Separation Over Flat Tokens**:
   - Primitives (`--primitive-*`) are isolated from UI code. Components bind exclusively to semantic Color Roles (`--color-*` / `--color-role-*`). This enables future theming (dark mode, high-contrast) and brand updates without touching component code.
2. **Brand-Tinted Shadows (`#2563EB`)**:
   - Shadows are tinted with primary blue at low opacities (12%–20%) rather than neutral black, creating a natural optical depth that integrates with the school's brand palette.
3. **Typography Tailored for Budget Android Hardware**:
   - Used **Inter** across all 15 styles with a heavier **500 Medium** weight on body text to prevent stroke fading under bright sunlight on low-cost LCD screens.
   - Applied tight visual tracking (`-2.0%` on Display, `-1.0%` on Headlines/Body) to enhance scannability for large monetary amounts.

## What You Got Wrong
1. **Silent Pass-Through of Direct Hex in Converter**:
   - In `scripts/build-tokens.js` (lines 141–157), if a designer inputs a raw hex code into a color role instead of referencing a primitive, the script outputs it without warning. In production, this allows direct hex to bypass the primitive tier, causing themes to break silently.
2. **Unhandled Key Typos in Source Export**:
   - In `design-tokens.tokens.json`, the role was exported as `"on tertairy container"`. A hardcoded fallback was required in `build-tokens.js` to alias it to `on-tertiary-container`, highlighting the need for schema validation on the token JSON.

