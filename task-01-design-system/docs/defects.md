# Known Defects: Task One

### Defect 1: Silent Pass-Through of Direct Hex in Color Roles
- **File Reference**: [scripts/build-tokens.js](file:///c:/Users/HP/Desktop/Fees/scripts/build-tokens.js#L141-L157)
- **Line Numbers**: Lines 141–157
- **Description**:
  The token converter script checks whether `token.value` starts with `{` and ends with `}` to resolve primitive references. However, if a designer inputs a raw hex value directly into a color role in Figma (e.g. `"surface": { "value": "#F9F9FF" }` instead of `{primitives.neutral.neutral98}`), the script silently outputs `--color-surface: #F9F9FF;` without throwing a validation error or warning.
- **Production Cost**:
  In production, this allows direct hex values to bypass the primitive tier unnoticed. If the brand or theme palette is updated (e.g., switching from light mode to dark mode, or updating brand primary from `#2563EB` to a new shade), the unlinked role will fail to update. Components relying on `--color-surface` would remain hardcoded to light surface, breaking theme cohesion and requiring manual code audits to locate which token broke the contract.

---

### Defect 2: Unhandled Typo in Figma Token Key Names
- **File Reference**: [design-tokens.tokens.json](file:///c:/Users/HP/Desktop/Fees/design-tokens.tokens.json#L934) & [scripts/build-tokens.js](file:///c:/Users/HP/Desktop/Fees/scripts/build-tokens.js#L162-L167)
- **Line Numbers**: Line 934 in `design-tokens.tokens.json`; Line 162 in `scripts/build-tokens.js`
- **Description**:
  In `design-tokens.tokens.json`, the token role was exported as `"on tertairy container"` (misspelled `tertairy` with an extra `a`). While `build-tokens.js` was patched with a special-case fallback to also generate `--color-on-tertiary-container`, the script did not implement an automated fuzzy spellchecker or schema validator for token names.
- **Production Cost**:
  If a developer reads the official Material Design documentation and types `var(--color-on-tertiary-container)`, but another developer copies the raw token key `var(--color-on-tertairy-container)`, the codebase splits into two divergent naming conventions. If the hardcoded patch in `build-tokens.js` is ever refactored, references using one of the two spellings will silently break and render transparent/unpainted text in production.

