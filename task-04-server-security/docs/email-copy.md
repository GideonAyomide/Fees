# Task Four Step 11: Branded Email Design & Copywriting Analysis

## 1. Design System Token Integration

Transactional emails sent by the Fees system must visually reassure parents that they are communicating with Crown Heights Academy rather than a phishing scam.

### Token Alignment Table
| Design Token (Task One) | CSS Variable / Token | Rendered Value | Application in Email Template |
| :--- | :--- | :--- | :--- |
| **Primary 40** | `--color-primary-40` | `#0F3D2E` | Email header banner, code digit typography, primary CTAs |
| **Primary Accent / Mint** | `--color-primary-60` | `#2D7A5D` | 2px verification box border, secondary subheaders |
| **Surface Variant** | `--color-surface-variant` | `#F0FDF4` | Verification code highlight container background |
| **Neutral Surface** | `--color-surface` | `#F8F9FA` | Outer email background canvas |
| **On-Surface Charcoal** | `--color-on-surface` | `#1F2937` | High-contrast body paragraph text (Contrast Ratio: 11.8:1) |
| **Warning / Alert Amber** | `--color-warning` | `#D97706` / `#92400E`| Anti-phishing fraud prevention warning box |

### Tracing the "Purple Button" Omission
In initial prototyping, an automated assistant generated an email template with a generic Indigo/Purple header (`#4F46E5`), standard for generic Tailwind templates. This occurred because the agent defaulted to its base training distribution rather than consuming the project's CSS tokens in `globals.css` and `tokens-complete.json`. 

To fix this, `lib/email-service.ts` was explicitly configured with the Crown Heights Academy palette:
- Hardcoded Deep Forest Green `#0F3D2E` (WCAG AAA compliant contrast against white text at 11.4:1).
- Single-use monospace font family (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`) for the 6-digit code to prevent digit confusion (e.g., mistaking `0` for `O` or `1` for `l`).

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

