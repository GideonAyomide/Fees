# Typography System: Type Scale & Metrics

### Font Family
The entire scale is set in **Inter**, a clean, highly legible neo-grotesque sans-serif with tall x-height and clear apertures, optimized for reading under poor lighting on inexpensive Android mobile screens.

### Complete 15-Style Specification

| Role | Size | Font Family | Weight | Font Size | Line Height | Multiplier | Letter Spacing | Tracking (% of size) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | Large | Inter | 600 (SemiBold) | `57px` | `64px` | ~1.12x | `-1.14px` | -2.0% |
| **Display** | Medium | Inter | 600 (SemiBold) | `45px` | `52px` | ~1.16x | `-0.90px` | -2.0% |
| **Display** | Small | Inter | 600 (SemiBold) | `36px` | `44px` | ~1.22x | `-0.72px` | -2.0% |
| **Headline**| Large | Inter | 500 (Medium) | `32px` | `40px` | 1.25x | `-0.32px` | -1.0% |
| **Headline**| Medium | Inter | 500 (Medium) | `28px` | `36px` | ~1.29x | `-0.28px` | -1.0% |
| **Headline**| Small | Inter | 500 (Medium) | `24px` | `32px` | ~1.33x | `-0.24px` | -1.0% |
| **Title** | Large | Inter | 500 (Medium) | `22px` | `28px` | ~1.27x | `-0.22px` | -1.0% |
| **Title** | Medium | Inter | 500 (Medium) | `16px` | `24px` | 1.50x | `-0.16px` | -1.0% |
| **Title** | Small | Inter | 500 (Medium) | `14px` | `20px` | ~1.43x | `-0.14px` | -1.0% |
| **Body** | Large | Inter | 500 (Medium) | `16px` | `24px` | 1.50x | `-0.16px` | -1.0% |
| **Body** | Medium | Inter | 500 (Medium) | `14px` | `20px` | ~1.43x | `-0.14px` | -1.0% |
| **Body** | Small | Inter | 500 (Medium) | `12px` | `16px` | ~1.33x | `-0.12px` | -1.0% |
| **Label** | Large | Inter | 500 (Medium) | `14px` | `20px` | ~1.43x | `-0.14px` | -1.0% |
| **Label** | Medium | Inter | 500 (Medium) | `12px` | `16px` | ~1.33x | `-0.12px` | -1.0% |
| **Label** | Small | Inter | 500 (Medium) | `11px` | `16px` | ~1.45x | `-0.11px` | -1.0% |

---

### Line Height Multiplier Rationale

Standard typographic systems govern line-height using proportional multipliers tailored to font size:
1. **Body and Title (1.4x to 1.5x)**:
   - `Body Large` and `Title Medium` use `1.50x` (`16px * 1.5 = 24px`).
   - `Body Medium` and `Label Large` use `1.43x` (`14px * 1.43 ≈ 20px`).
   - *Reasoning*: Continuous paragraph text and multi-line explanations require generous vertical rhythm (1.4x to 1.5x) to prevent lines of text from visually colliding during scanning on mobile viewports.
2. **Display and Headline (1.12x to 1.33x)**:
   - `Display Large` uses `1.12x` (`57px` font size with `64px` line height).
   - *Reasoning*: As type increases in size, the eye requires proportionally tighter line height so multi-line headlines hold together as a single visual unit rather than breaking into fragmented rows.
3. **Compact Micro-Labels (1.33x to 1.45x)**:
   - Small badges, due dates, and status labels (`11px` to `12px`) use `16px` line heights so their bounding box aligns cleanly to 4px and 8px grid increments.

---

### Letter Spacing Rationale

Inter is designed with optical corrections for UI screens. Rather than using zero or wide tracking:
- **Display sizes** use compact visual tracking (`-2.0%` of font size, e.g. `-1.14px` on `57px`) to reduce gaping white gaps between large glyphs.
- **Body and Labels** use a subtle negative tracking (`-1.0%` of font size, e.g. `-0.16px` on `16px`) to tighten character rhythm and improve rapid scannability on dense data displays such as fee item breakdowns and receipt lists.

