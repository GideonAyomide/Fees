# Task Four Step 11: Branded Email Design & Copywriting Analysis

## 1. Design System Token Integration

Transactional emails sent by the Fees system must visually reassure parents that they are communicating with Crown Heights Academy rather than a phishing scam.

### Token Alignment Table (Sourced Directly from `styles/tokens.css` & `tokens.json`)
| Design Token (Task One) | CSS Variable / Token | Rendered Value | Application in Email Template |
| :--- | :--- | :--- | :--- |
| **Primary 40 (Royal Blue)** | `--primitive-primary-40` / `--color-primary` | `#2563EB` | Email header banner, section title, code digit typography, primary border |
| **Primary Container** | `--primitive-primary-90` / `--color-primary-container` | `#DBE1FF` | Verification code highlight container background fill |
| **On-Primary Container** | `--primitive-primary-30` / `--color-on-primary-container` | `#003EA8` | Subheader text, verification code digits label |
| **Neutral Surface** | `--primitive-neutral-98` / `--color-surface` | `#F9F9FF` | Outer email background canvas |
| **On-Surface Charcoal** | `--primitive-neutral-10` / `--color-on-surface` | `#161C25` | High-contrast body paragraph text (Contrast Ratio: 12.2:1) |
| **Outline Variant** | `--primitive-neutral-variant-90` / `--color-outline` | `#DEE2F1` | Card container border and footer divider |
| **Warning / Alert Amber** | `--primitive-warning-40` / `--color-warning` | `#B45309` | Anti-phishing fraud prevention warning box |

### Tracing the Visual Alignment
In early iterations, an automated assistant introduced an arbitrary green palette (`#0F3D2E`), mistakenly treating it as the primary color. However, as documented in [`styles/tokens.css`](file:///c:/Users/HP/Desktop/Fees/styles/tokens.css) and [`task-01-design-system/docs/colour-roles.md`](file:///c:/Users/HP/Desktop/Fees/task-01-design-system/docs/colour-roles.md), Crown Heights Academy's official institutional brand color is **Royal Blue (`#2563EB`)**, derived from the school blazer crest.

To fix this divergence:
1. `lib/email-service.ts` was synchronized directly with `styles/tokens.css`:
   - Header Bar: Royal Blue `#2563EB`
   - Code Highlight Fill: Primary Container `#DBE1FF`
   - Code Digits Label: On-Primary Container `#003EA8`
   - Canvas: Surface `#F9F9FF`
   - Text: On-Surface Charcoal `#161C25`
2. Single-use monospace font family (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`) for the 6-digit code to prevent digit confusion (e.g., mistaking `0` for `O` or `1` for `l`).

---

## 2. Honest Copywriting Critique: Agent Copy vs. Real Customer Reality

### What the Agent Wrote:
> "Dear Parent / Guardian,
> To complete your registration on the Crown Heights Academy Fees portal, enter the 6-digit verification code below:
> [ 582910 ]
> Expires in 10 minutes (Single-use only).
> Security Note: Crown Heights Academy staff will never ask you for this code on phone calls or WhatsApp. Do not share it with anyone.
> If you did not request this verification code, please disregard this email or report to the Bursar immediately."

---

### What Is Defective About the Agent's Copy:

1. **Impersonal Greeting**:
   * *Agent*: "Dear Parent / Guardian"
   * *Problem*: In Nigerian private schools, parents pay substantial tuition and expect personal recognition. An impersonal greeting looks like spam.
   * *Real Business Fix*: "Dear Mrs. Abubakar," (using the parent's actual surname from the student record).

2. **Abstract Technical Terminology**:
   * *Agent*: "Expires in 10 minutes (Single-use only)"
   * *Problem*: "Single-use only" is software developer jargon. It creates confusion if a parent wonders whether they can ever log in again tomorrow.
   * *Real Business Fix*: "This code works once. Enter it now on your screen. After 10 minutes, you will need to request a fresh code."

3. **Missing Critical Student Association**:
   * *Agent*: Omits which child the registration is linked to.
   * *Problem*: A parent with two children at Crown Heights Academy needs confirmation of which child’s ledger they are activating.
   * *Real Business Fix*: "You are activating fee records for your child: **Fatima Abubakar (JSS 2B)**."

4. **Vague Action for Unauthorized Requests**:
   * *Agent*: "report to the Bursar immediately."
   * *Problem*: How? Which number? Where?
   * *Real Business Fix*: "If you did not request this code, call the Bursary Office directly on **0803 000 1234** (Mon–Fri, 8am–4pm)."

---

## 3. Revised Copy for Production

```text
Subject: Crown Heights Academy: Your 6-Digit Fee Portal Code is 582910

Dear Mrs. Fatima Abubakar,

You are setting up online access for your child, Fatima Abubakar (Class: JSS 2B).

Your one-time verification code is:
  5 8 2 9 1 0

This code works once and expires in 10 minutes. Enter it on your phone now.

IMPORTANT SECURITY NOTICE:
The Bursar and school teachers will NEVER call you or message you on WhatsApp to ask for this code. Never tell it to anyone.

If you did not make this request, please alert the Bursar immediately at 0803 000 1234.

Warm regards,
Mr. K. Adeleke
Bursar, Crown Heights Academy
```
