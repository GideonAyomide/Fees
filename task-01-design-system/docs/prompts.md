# Prompts Log: Design Tokens Conversion

### Step 6: Convert JSON to CSS Variables by Instructing an Agent

The prompt submitted to the AI agent to convert `design-tokens.tokens.json` to CSS variables is recorded verbatim below.

#### Prompt (Verbatim)
```text
Write a Javascript script that you will use to convert the design system in @[c:\Users\HP\Desktop\Fees\design-tokens.tokens.json] to CSS variables.
Take note of the primitive colors in the system and the color roles. Using standard system practise, remember that the color roles are what will be used directly on the UI and the primitive will not be used directly on the UI.
Use CSS variables and ensure that this design system remains the source of truth for UI implementation.
```

#### What Was Required & Explicitly Instructed
1. **Source of Truth**: The script must parse `design-tokens.tokens.json` directly and output a browser-ready CSS file (`styles/tokens.css`).
2. **Two-Tier Separation (Primitives vs. Color Roles)**:
   - **Primitives (`--primitive-*`)**: Base palette values (151 color values across primary, secondary, tertiary, neutral, neutral variant, error, warning, and key colors). These must be kept internal/private and marked with warnings prohibiting direct UI component consumption.
   - **Color Roles (`--color-*` & `--color-role-*`)**: Semantic tokens (50 roles based on Material Design 3). The script must resolve token path references (e.g. `{primitives.primary.primary40}`) into CSS variable references (`var(--primitive-primary-40)`) so the UI binds strictly to semantic roles.
3. **Typography & Shadows**: In addition to colors, the script must parse the 15 typography styles into CSS custom properties and `.text-*` utility classes, and translate drop-shadow definitions into `--shadow-*` box-shadow properties.

#### Iterations & What Changed During Development
1. **Initial Draft vs. Refined Instruction**:
   - An early mental draft simply asked to "convert tokens.json to CSS variables". This was discarded because generic conversion tools flatten all tokens into a single pool without distinguishing primitives from roles, which leads AI agents to directly apply arbitrary primitives (like `--primitive-primary-40`) in UI code.
   - The final prompt explicitly insisted on standard design system practice: primitive colors are private palette tokens, color roles are the sole public UI contract, and the design system JSON must remain the single source of truth.
2. **Path Reference Resolution**:
   - The token JSON contained nested path references like `{primitives.primary.primary40}` and `{primitives.neutral variant.neutral variant90}`. The agent built an indexed lookup map (`tokenPathToVar`) to normalize keys and resolve all 50 references with 0 dangling references.
   - A typo in the Figma export (`on tertairy container` instead of `on tertiary container`) was resolved by generating the exact token name plus a corrected spelling alias.

