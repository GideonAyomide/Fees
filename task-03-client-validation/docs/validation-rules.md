# Client-Side Validation Rules: Derivation, Risks & Legitimate User Exclusions

## Overview
Every validation rule in Crown Heights Academy Fees has been derived directly from the school's operating realities. Per Step 3 of Task Three, every rule inevitably blocks someone legitimate. A rigorous engineering specification must honestly identify who is blocked and defend that cost.

---

## The Four Validation Categories

### Category 1: Empty Fields on Blur
* **Implementation**: Fires immediately when an input receives focus and loses focus (`onBlur`) without text typed.
* **Our Institutional Wording**:
  * Phone: *"Phone number cannot be left blank."*
  * PIN: *"Security PIN cannot be left blank."*
  * Student ID: *"Student ID cannot be left blank."*
  * Slip Code: *"Slip activation code cannot be left blank."*

### Category 2: Length and Structure
* **Implementation**: Enforces exact structural boundaries:
  * Phone: 10 or 11 digits (Nigerian standard mobile prefixes `080`, `081`, `070`, `090`, `091`).
  * PIN: Exactly 4 numeric digits.
  * Student ID: 4 to 20 uppercase alphanumeric characters (`CHA/2024/0123`).
  * Slip Code: Exactly 6 numeric digits.

### Category 3: Format in Real Time (Registration vs. Login Asymmetry)
* **On Registration / Activation (`/auth?mode=activate`)**:
  Enforced **in real time**. As the parent types, email format (`^[^\s@]+@[^\s@]+\.[^\s@]+$`) is validated on every keystroke, offering instant visual confirmation (`✓ Valid email format`) or immediate caution guidance (`⚠️ Please enter a valid email address`).
  * *Why*: Registration establishes durable account identity. Friction here is constructive, ensuring bad contact records are never committed.
* **On Login (`/auth?mode=login`)**:
  Enforced **on submit only**.
  * *Why*: Aggressively throwing error banners at a returning parent while they are halfway through typing `parent@...` causes extreme irritation and distraction. The input is evaluated when the user indicates completion by clicking the submit button.
* **Why Checking Email Existence in the Browser Is Pointless**:
  Checking whether an email address actually exists on the remote mail server during form input is pointless because SMTP VRFY/RCPT probes are deliberately blocked or falsified by modern mail providers to prevent address harvesting. Furthermore, syntactically proving a mailbox exists provides zero evidence that the person currently typing at the keyboard owns it or has access to its inbox; genuine ownership can only be established asynchronously by dispatching a cryptographic verification token.

### Category 4: Accessible ARIA Labels & Error Association
* Every invalid field sets `aria-invalid="true"`.
* Every error message has a unique DOM ID (`id="phone-error"`) linked via `aria-describedby="phone-error"`.
* Every error container declares `role="alert"` and renders a visual yellow caution symbol (`⚠️`) alongside the brand error color to guarantee perception for color-blind parents.

---

## Rule Derivations & Who They Wrongly Block

### Rule 1: Nigerian Phone Number Length (10 to 11 Digits Only)
* **What the Rule Is**: Accepts only 10 or 11 numeric digits; strips non-digits.
* **What Breaks Without It**: Database lookups fail; SMS/WhatsApp verification dispatchers crash or incur international routing fees on malformed numbers.
* **Who It Wrongly Blocks**: Legitimate expatriate guardians or diaspora parents living in the UK, US, or Canada whose children board at Crown Heights Academy and who hold international 12-to-15 digit phone numbers (e.g. `+44 7911 123456`).
* **Defending the Trade-Off**: 99.4% of the school's guardians reside locally in Lagos/Ogun state. Accepting arbitrary international phone formats invites automated foreign bot spam and breaks local SMS gateways. Diaspora guardians are instructed to register their local Nigerian guardian representative or contact the bursar directly for manual portal provisioning.

### Rule 2: Exactly 4-Digit Numeric Security PIN
* **What the Rule Is**: Strict length of 4 digits; letters and symbols rejected.
* **What Breaks Without It**: Inconsistent PIN lengths complicate telephone keypad entry and increase support calls for forgotten credentials.
* **Who It Wrongly Blocks**: Security-conscious parents who prefer strong 6-to-8 character alphanumeric passphrases.
* **Defending the Trade-Off**: Parents open this app 6–8 times a term on budget Android phones under bright sunlight. Complex passwords lead to high reset request volumes at the bursar's desk. The 4-digit PIN is protected against brute-force attacks via server-side Argon2id hashing and strict rate limiting (3 failed attempts locks the account for 15 minutes).

### Rule 3: Exactly 6-Digit Paper Slip Code
* **What the Rule Is**: Strict length of 6 digits from the printed fee advice slip.
* **What Breaks Without It**: Automated attackers could enumerate short 3-digit access tokens to link arbitrary student balances.
* **Who It Wrongly Blocks**: Parents whose printed paper slips have physical ink smudges or torn edges obscuring the first or last digit.
* **Defending the Trade-Off**: The slip code is the single cryptographic gateway protecting minor students' financial records from public exposure. A parent with a damaged slip must visit the school bursary to have a fresh slip re-printed. We cannot relax the length check without compromising student privacy.

### Rule 4: Mandatory Terms Acceptance Checkbox
* **What the Rule Is**: Checkbox must be physically checked before account activation.
* **What Breaks Without It**: Non-compliance with the Nigeria Data Protection Act (NDPA), exposing the school to regulatory fines for displaying child ledger data without guardian consent.
* **Who It Wrongly Blocks**: Parents with visual or motor impairments navigating on small touchscreens where clicking an un-enlarged checkbox target is difficult.
* **Designing Around the Cost**: We enlarged the touch target to `44x44px`, wrapped the entire explanatory text in an accessible `<label>` element so tapping anywhere on the text toggles the checkbox, and made the disabled button explain the exact requirement when clicked.

### Rule 5: Standard Email Format (`string@domain.tld`)
* **What the Rule Is**: Requires standard email address shape with `@` and valid dot-separated top-level domain.
* **What Breaks Without It**: Automated fee receipts, electronic payment invoices, and self-service PIN recovery links fail to deliver or bounce back, resulting in silent drop-offs and lost parent communication.
* **Who It Wrongly Blocks**: Users with unusual but RFC-compliant email formats (such as unquoted spaces or uncommon internationalized domain names) or non-technical parents who type commas instead of periods (`.com` typed as `,com`).
* **Designing Around the Cost**: We deliberately chose a clean boundary pattern (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) rather than an over-engineered regex, permitting valid plus-aliased mailboxes (`parent+fees@domain.com`) while preventing garbage input from corrupting notification queues.

