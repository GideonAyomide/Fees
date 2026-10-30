# Typographic Divergences from Material Design 3 Baseline

### Overview
Material Design 3 provides a sensible baseline, but a generic baseline produces generic software. In the Fees design system, we deliberately diverged from the M3 defaults in three places to serve low-cost Android mobile devices and high-stress financial retrieval.

---

### Divergence 1: Body Font Weight (500 Medium vs. M3 Default 400 Regular)

- **Material Default**: 400 (Regular) for `Body Large`, `Body Medium`, and `Body Small`.
- **Our Choice**: 500 (Medium) across all Body styles.
- **Why We Chose It**:
  Fees is used by parents outdoors in direct Nigerian sunlight on budget Android smartphones (Tecno, Infinix, itel) featuring low-contrast, low-brightness LCD screens with coarse subpixel rendering. A standard 400 regular weight renders hairline strokes that wash out completely under glare, leading parents to misread line items or critical dates. 500 Medium thickens font stems and maintains legibility even on low-end hardware with 4x CPU throttling.
- **Where This Choice Would Be the Wrong One**:
  In a long-form reading application, such as a blog, an e-book reader, or extensive legal documentation. Across paragraphs with 1,000+ words, 500 Medium creates high visual density ("typographic shout") and eye fatigue, darkening the page's optical gray value and making sustained reading exhausting on desktop displays.

---

### Divergence 2: Display & Headline Negative Letter Spacing (-2.0% vs. M3 Default 0px)

- **Material Default**: `0px` letter-spacing for `Display Large` (57px) and `Headline Large` (32px).
- **Our Choice**: Compact visual tracking of `-2.0%` on Display styles (`-1.14px` on Display Large) and `-1.0%` on Headlines (`-0.32px` on Headline Large).
- **Why We Chose It**:
  Inter features generous side-bearings designed for body text. When rendered at 57px, default spacing makes large headings appear fragmented, with excessive white gaps between letterforms. Tightening the tracking binds words into cohesive, punchy units that parents scan instantaneously when checking outstanding balances (e.g., large fee figures like "₦120,000").
- **Where This Choice Would Be the Wrong One**:
  This choice fails on all-caps text or when rendering localized African languages with tone marks and diacritics (such as Yoruba or Igbo: `à`, `á`, `ẹ`, `ọ`, `ṅ`). Negative tracking forces adjacent diacritical marks and ascenders into optical collision, degrading legibility and making the characters visually unparseable.

---

### Divergence 3: Display Large Line Height (64px / ~1.12x vs. M3 Recommended 72px / 1.25x)

- **Material Default**: 72px line height for 57px type (allowing comfortable multi-line wrapping).
- **Our Choice**: Locked 64px line height (`~1.12x` multiplier) paired with 600 SemiBold weight.
- **Why We Chose It**:
  In the Fees app, Display Large is reserved strictly for high-impact single numbers and short status lines ("You owe ₦0"). Mobile viewports on small devices (e.g. 360x640px) have scarce vertical real estate. A loose 72px line height pushes the critical "posted up to" date and payment status below the fold. The 64px height keeps the entire balance statement above the fold.
- **Where This Choice Would Be the Wrong One**:
  In an application where display headings wrap onto three or four lines (such as a marketing landing page or news headline). At 1.12x, the descenders of line one (e.g. 'g', 'j', 'p', 'y') will visually crash into the ascenders of line two (e.g. 'b', 'd', 'h', 'k', 'l'), creating an illegible pile-up.

