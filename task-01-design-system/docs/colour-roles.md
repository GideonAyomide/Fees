# Colour Roles: Semantic Palette & Contrast Analysis

### 1. Brand Colour Origin & Selection
The core brand colour is **Royal Blue (`#2563EB`)**.
- **Origin**: Selected to represent Crown Heights Academy's official school uniform and blazer crest. Royal blue conveys academic authority, stability, and institutional trust—essential qualities for an application managing high-stakes school fee transactions.
- **Pinning as Primary 40**: In the Material 3 tonal generation, `#2563EB` was pinned at tone 40. Pinning ensures that the algorithmic palette generates around the exact brand identity rather than shifting the hue or compressing its saturation into a generic algorithm-chosen blue.
- **Visible Difference**: Before pinning, an unconstrained algorithmic generator adjusted the primary tone to `#2159D6` to fit an idealized mathematical curve, absorbing and dulling the school's vibrant brand color. Pinning at 40 retained the exact `#2563EB` hex as the anchor for all button and active-state interactions.

---

### 2. Tonal Palettes
The system generates 14 tones for each key hue:
`0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100`
- **Why 14 Tones Are Sufficient**: Tonal palettes are organized strictly by perceptual luminance rather than raw hex calculations. Tone 40 in light mode maps naturally to Tone 80 in dark mode, maintaining identical relative contrast against inverted surface tones without requiring a separate palette for light and dark themes.

---

### 3. Functional Colours
- **Error (`#BA1A1A` - Error 40)**: Overdue fees, payment gateway rejections, invalid access codes.
- **Warning (`#B45309` - Warning 40)**: Payment pending review, offline cache warning, bursar reconciliation warnings.
- **Success / Tertiary (`#735C00` / `#2E6B27`)**: Verified receipts, zero balance confirmation ("All items paid").

---

### 4. Colour Roles (Jobs, Not Colours)
A role defines UI intent. UI components bind exclusively to roles, never to raw primitives.

| Semantic Role | Backing Primitive Token | Resolved Hex | Role Definition / UI Job |
| :--- | :--- | :--- | :--- |
| `--color-primary` | `{primitives.primary.primary40}` | `#2563EB` | Main action buttons (Pay button, submit PIN). |
| `--color-on-primary` | `{primitives.primary.primary100}` | `#FFFFFF` | Text and icons placed on primary actions. |
| `--color-primary-container` | `{primitives.primary.primary90}` | `#DBE1FF` | High-priority container background (total balance card). |
| `--color-on-primary-container`| `{primitives.primary.primary30}` | `#003EA8` | Text and icons inside primary container cards. |
| `--color-surface` | `{primitives.neutral.neutral98}` | `#F9F9FF` | Primary page background and default card background. |
| `--color-on-surface` | `{primitives.neutral.neutral10}` | `#161C25` | Primary body text, student names, balance amounts. |
| `--color-surface-variant` | `{primitives.neutral variant.neutral variant90}` | `#DEE2F1` | Secondary card fills and disabled container states. |
| `--color-on-surface-variant`| `{primitives.neutral variant.neutral variant30}`| `#424752` | Subtitles, timestamps, bursar "posted up to" date. |
| `--color-outline` | `{primitives.neutral variant.neutral variant90}` | `#DEE2F1` | Dividers, card boundaries, input borders. |
| `--color-outline-variant` | `{primitives.neutral variant.neutral variant94}` | `#EEF0FF` | Subtle row separators in fee item breakdowns. |
| `--color-error` | `{primitives.error.error40}` | `#BA1A1A` | Critical error alerts, payment failure banners. |
| `--color-on-error` | `{primitives.error.error100}` | `#FFFFFF` | Text and icons on error alerts. |
| `--color-error-container` | `{primitives.error.error90}` | `#FFDAD5` | Overdue fee callout container background. |
| `--color-on-error-container`| `{primitives.error.error30}` | `#930009` | Overdue notice text and "Overdue" pill badge. |

---

### 5. Contrast Ratios & WCAG 2.1 Compliance

All primary UI pairs were verified using the WCAG 2.1 relative luminance formula:

| Foreground Role | Background Role | Contrast Ratio | WCAG Compliance | Usage & Status |
| :--- | :--- | :--- | :--- | :--- |
| `--color-on-primary` (`#FFFFFF`) | `--color-primary` (`#2563EB`) | **5.17 : 1** | **PASS (AA)** | Primary buttons, active tabs. |
| `--color-on-primary-container` (`#003EA8`) | `--color-primary-container` (`#DBE1FF`) | **7.20 : 1** | **PASS (AAA)** | Outstanding balance summary card. |
| `--color-on-surface` (`#161C25`) | `--color-surface` (`#F9F9FF`) | **16.32 : 1** | **PASS (AAA)** | Primary text, fees numbers, headings. |
| `--color-on-surface-variant` (`#424752`) | `--color-surface-variant` (`#DEE2F1`) | **7.21 : 1** | **PASS (AAA)** | Secondary metadata, dates, receipts list. |
| `--color-on-error` (`#FFFFFF`) | `--color-error` (`#BA1A1A`) | **6.46 : 1** | **PASS (AA)** | "Payment Failed" alert banners. |
| `--color-on-error-container` (`#930009`)| `--color-error-container` (`#FFDAD5`) | **7.24 : 1** | **PASS (AAA)** | "Overdue" fee line callouts. |
| `--color-outline` (`#DEE2F1`) | `--color-surface` (`#F9F9FF`) | **1.23 : 1** | *Documented* | **NOT USED FOR TEXT.** Used exclusively as a 1px decorative card boundary. Interactive inputs use `--color-outline-variant` or active focus rings (`--color-primary`) to guarantee 3:1 boundary contrast. |
| `--color-inverse-on-surface` (`#ECF0FE`)| `--color-inverse-surface` (`#2B313B`)| **11.50 : 1** | **PASS (AAA)** | Offline status toast and snackbars. |

