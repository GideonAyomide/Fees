# Task Three: The Form, Attacked from Both Sides

## Overview for Technical Interviewers (4-Minute Read)

### 1. What This Task Was
Task Three examines the public boundary of web software: forms. It tests whether an engineer can build a resilient single-page authentication interface that collects accurate parent data, complies with accessibility standards across color blindness and screen readers, and understands that client-side validation is solely an ergonomics layer that provides exactly zero security against direct HTTP attacks.

---

### 2. What Was Built & Evidenced
1. **Unified Single-Page Authentication**:
   - Collapsed three separate auth routes (`/login`, `/activate`, `/reset`) into a single component ([`app/auth/page.tsx`](file:///c:/Users/HP/Desktop/Fees/app/auth/page.tsx), [`components/auth-unified-form.tsx`](file:///c:/Users/HP/Desktop/Fees/components/auth-unified-form.tsx)) driven by URL query parameter `?mode=login|activate|reset`.
   - Recorded route page count reduction from 5 pages to 3 pages ([`evidence/01-page-count-before.txt`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/evidence/01-page-count-before.txt), [`02-page-count-after.txt`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/evidence/02-page-count-after.txt)).
   - Captured server logs proving zero network reload and zero session churn during mode switching ([`evidence/04-form-switch-logs.txt`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/evidence/04-form-switch-logs.txt)).
   - Analyzed single-page rationale and defined enterprise KYC scenarios where multi-page routes are superior ([`docs/spa-rationale.md`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/docs/spa-rationale.md)).
2. **Form Information Design & Legal Provenance**:
   - Justified every retained field against three business criteria and eliminated non-essential fields ([`docs/field-justification.md`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/docs/field-justification.md)).
   - Documented provenance of statutory NDPA guardian terms from the Nigeria Data Protection Commission, and audited the removal of non-functional decorative watermarks ([`docs/terms-note.md`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/docs/terms-note.md)).
3. **Client-Side Validation in Four Categories**:
   - Implemented empty field detection on blur, structural length gating (10–11 digit phone, 4-digit PIN, 6-digit slip code), real-time validation asymmetry (real-time for registration, on-submit for login), and accessible ARIA alerts with caution icons (`⚠️`).
   - Defended each rule, what breaks without it, and documented the legitimate users wrongly excluded ([`docs/validation-rules.md`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/docs/validation-rules.md)).
4. **Input Type Trap & Sensitive Data Enumeration**:
   - Rejected `<input type="number">` to eliminate default zeros, spinner arrows, and leading zero truncation on mobile; implemented `<input type="text" inputMode="numeric">` ([`screens/number-input-trap-demonstration.html`](file:///c:/Users/HP/Desktop/Fees/screens/number-input-trap-demonstration.html)).
   - Stripped placeholder digit clues from the access slip code to protect against automated $10^6$ brute-force enumeration ([`docs/enumeration.md`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/docs/enumeration.md)).
5. **Accessibility Audit & Screen Reader Verification**:
   - Audited the form across color independence, keyboard reachability, focus visibility, screen reader announcement, and error association.
   - Identified and fixed 4 real defects: disabled button tab order vanishing, mouse-only acceptance checkbox hitboxes, missing `aria-required`, and unlinked helper text ([`docs/accessibility-audit.md`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/docs/accessibility-audit.md)).
6. **Button Behavior & Disabled Explanations**:
   - Evaluated the hidden button anti-pattern vs. a visible disabled button that explains missing requirements upon clicking ([`screens/button-states-demonstration.html`](file:///c:/Users/HP/Desktop/Fees/screens/button-states-demonstration.html)).
7. **Direct Request Attack (The Client-Side Fallacy)**:
   - Attacked the form through the browser and documented DOM element mutation vulnerabilities ([`evidence/15-form-attack-results.txt`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/evidence/15-form-attack-results.txt)).
   - Sent a direct command-line HTTP POST request to `/api/auth/activate` bypassing the browser; proved that the server accepted invalid bot data and provisioned an account with `acceptTerms: false` and `HTTP 200 OK` ([`evidence/16-direct-request-command-and-response.txt`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/evidence/16-direct-request-command-and-response.txt), [`docs/client-side-is-not-security.md`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/docs/client-side-is-not-security.md)).
8. **Deterministic Rollback**:
   - Introduced a regretted commit, identified its exact SHA (`2c78d63`), and executed an atomic `git revert` without agent hallucination ([`evidence/17-commit-list-and-rollback.txt`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/evidence/17-commit-list-and-rollback.txt), [`docs/rollback.md`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/docs/rollback.md)).
9. **Defects & Interview Defense**:
   - Documented real defects with file and line references ([`docs/defects.md`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/docs/defects.md)).
   - Answered all 15 technical interview questions under 200 words each ([`docs/interview-answers.md`](file:///c:/Users/HP/Desktop/Fees/task-03-client-validation/docs/interview-answers.md)).

---

### 3. Key Decisions & Rationales
* **URL Parameter Tabs (`?mode=...`)**: Eliminates 3G latency and preserves typed phone state when parents toggle between login and activation.
* **Text Input with Numeric InputMode**: Guarantees leading zeros (`080...`) are preserved while invoking the native phone keypad on Android.
* **Caution Icon Beside Red Errors**: Ensures deuteranopic (red-green color-blind) parents perceive error alerts instantly.
* **Honest Direct-Request Acceptance**: Refusing to hide that our server endpoint initially accepted malformed data; this failure motivates the server-side security controls in Task Four.

---

### 4. What Went Wrong (And What It Cost)
1. **Defenseless Endpoint Exposure**: The activation route accepted malformed bot data via direct HTTP requests because server-side schema validation was deferred to Task Four.
2. **Missing Submit Lock**: Double-clicking the submit button quickly dispatched duplicate requests on throttled connections.
3. **International Phone Truncation**: Copy-pasting `+234` numbers stripped the plus sign without re-prefixing `0`, causing valid numbers to fail length checks. Documented in `docs/defects.md`.
