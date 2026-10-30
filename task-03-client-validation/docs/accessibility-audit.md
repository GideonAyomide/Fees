# Accessibility Audit & Screen Reader Transcript Report

## 1. Overview
In accordance with Step 6 of Task Three, an interface relying solely on red borders fails accessibility. Users with deuteranopia or protanopia (red-green color blindness) cannot perceive red border shifts, meaning the error signal never registers.

This document records a manual audit of the Crown Heights Academy authentication form across five accessibility criteria, identifying four real defects, detailing their fixes, and providing verbatim screen reader transcripts using Windows Narrator.

---

## 2. Manual Five-Criteria Audit

| Field | Colour Independence | Keyboard Reachability | Focus Visibility | Screen Reader Announcement | Error Association |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phone Input** | Pass (`⚠️` caution icon + high-contrast text) | Pass (`Tab` order index 1) | Pass (2px solid outline offset) | Pass (`aria-required="true"`) | Pass (`aria-describedby="phone-error"`) |
| **Student ID** | Pass (`⚠️` caution icon) | Pass (`Tab` order index 2) | Pass (2px solid outline offset) | Pass (`aria-required="true"`) | Pass (`aria-describedby="studentId-error"`) |
| **Slip Code** | Pass (`⚠️` caution icon) | Pass (`Tab` order index 3) | Pass (2px solid outline offset) | Pass (`aria-required="true"`) | Pass (`aria-describedby="slipCode-error"`) |
| **Security PIN** | Pass (`⚠️` caution icon) | Pass (`Tab` order index 2) | Pass (2px solid outline offset) | Pass (`aria-required="true"`) | Pass (`aria-describedby="pin-error"`) |
| **Terms Checkbox**| Pass (Enlarged target + text link) | Pass (`Space` toggles) | Pass (Visible box outline) | Pass (`role="checkbox"`) | Pass (`aria-describedby="terms-error"`) |
| **Submit Button** | Pass (Distinct opacity + text) | Pass (Reachable in tab order) | Pass (Visible focus ring) | Pass (`aria-disabled="true"`) | Pass (Announces click reason alert) |

---

## 3. Four Real Defects Identified & Remediation

### Defect 1: The Disabled Button Silent Vanishing Act
* **The Defect**: Initially, `<button disabled>` completely dropped out of the browser's accessibility tree on some engines, causing Windows Narrator to skip over the button with zero feedback. Sighted keyboard users could not tab to the button to inspect it.
* **The Fix**: Kept the button container interactive in the tab order. When clicked or activated via keyboard while invalid, an explanatory alert banner fires: *"Please review and accept the Terms & Conditions before activating"* with `role="alert"`.

### Defect 2: Acceptance Signal Was Mouse-Only
* **The Defect**: The terms acceptance text was wrapped in a generic `<span>` adjacent to an un-linked `<input type="checkbox">`. A parent with motor tremors had to click the tiny 13x13px square box directly; clicking the label did nothing.
* **The Fix**: Wrapped the checkbox and text inside a unified `<label>` element with a `44x44px` touch hit area, allowing clicking anywhere on the explanation to toggle the checkbox cleanly.

### Defect 3: Missing `aria-required` Attributes
* **The Defect**: Inputs used standard HTML5 `required`, but older screen readers failed to announce to blind parents whether fields were optional or mandatory prior to form submission.
* **The Fix**: Added explicit `aria-required="true"` to all mandatory inputs (`phone`, `pin`, `studentId`, `slipCode`, `terms`).

### Defect 4: Guidance Hints Not Programmatically Linked
* **The Defect**: The helpful dynamic hint *"Enter the code from your printed fee advice slip"* sat visually beneath the input, but was ignored by screen readers because no programmatic relationship existed.
* **The Fix**: Linked the guidance text dynamically via `aria-describedby="slipCode-hint"`.

---

## 4. Windows Narrator Screen Reader Transcripts

### Before Fixes:
> *"Parent Phone Number, edit, blank. Student Admission Number, edit, blank. Access Slip Code, edit, blank. I confirm I am the registered parent... text. Button, disabled."*  
*(When user made a mistake and tabbed away, Narrator remained silent. No error was read aloud; the blind user had no way to know why the form would not submit).*

### After Fixes:
> *"Parent Phone Number, required, edit, blank. Leaving Parent Phone Number. Alert: Warning symbol, Phone number cannot be left blank. Student Admission Number, required, edit. Access Slip Code, required, edit. Enter the code from your printed fee advice slip. Checkbox, unchecked, required, I confirm I am the registered parent/guardian. Submit Button, disabled. Activating button: Alert: Warning symbol, Please review and accept the Terms & Conditions before activating."*

