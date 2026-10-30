# Real Defects Log — Task Two (Scaffold & Repository)

## Overview
In accordance with Rule 8 of the assessment framework, this document records real defects present in the Task Two scaffold by file and line number, detailing the technical failure mode, production cost, and engineering remediation.

---

## Defect 1: Client Form Lacks Submission Rate-Limiting & Idempotency Key
* **File Reference**: [`app/api/enquiry/route.ts#L7-L35`](file:///c:/Users/HP/Desktop/Fees/app/api/enquiry/route.ts#L7-L35)
* **What is Broken**:
  The `POST /api/enquiry` endpoint parses and validates incoming payloads, but performs zero IP-based or account-based rate limiting, and does not enforce an idempotency key header.
* **Production Cost**:
  A parent with a fluttering 3G connection repeatedly mashing the "Submit" button on an Android device dispatches 5 duplicate requests in rapid succession, resulting in 5 identical records written to PostgreSQL. Under malicious bot probing, the database connection pool can be exhausted within seconds, causing denial of service for other parents attempting to check fees.
* **Remediation**:
  In Task Four, install server-side rate limiting via an in-memory/KV token bucket keyed on client IP and parent phone number, and attach a client-generated UUID idempotency key to reject duplicate submissions within a 60-second window.

---

## Defect 2: Phone Input Accepts Non-Digit Formatting Characters on the Client
* **File Reference**: [`app/enquiry/page.tsx#L145-L162`](file:///c:/Users/HP/Desktop/Fees/app/enquiry/page.tsx#L145-L162)
* **What is Broken**:
  The parent phone input uses `<input type="tel">` but lacks client-side formatting sanitization or an `inputMode="numeric"` restriction with regex stripping. If a parent types `080-1234-5678` or `+234 (0) 801 234 5678`, the string passes client inspection but triggers a server-side validation error (`400 Bad Request`), forcing the user to manually re-enter their phone.
* **Production Cost**:
  Frustration and abandonment among non-technical parents on budget phones who paste phone numbers copied from WhatsApp or contact lists containing country codes, spaces, or hyphens.
* **Remediation**:
  In Task Three, implement real-time sanitization on the phone input that strips all non-numeric characters before dispatching the payload, transforming international prefixes (`+234`) into standard local format.

---

## Defect 3: Silent Pass-Through of Raw Hexadecimal Values in Token Compiler
* **File Reference**: [`scripts/build-tokens.js#L141-L157`](file:///c:/Users/HP/Desktop/Fees/scripts/build-tokens.js#L141-L157)
* **What is Broken**:
  When processing color tokens, if a raw hex value (e.g. `#2563EB`) is mistakenly assigned to a component style property without resolving through a semantic role indirection (`--color-primary`), the script silently outputs the raw hex string into `styles/tokens.css` instead of throwing a compilation error.
* **Production Cost**:
  Breaks the single source of truth. If the school modifies its brand palette in Figma, components consuming the raw pass-through fail to update, creating visual divergence across the application.
* **Remediation**:
  Add a strict regex check in `scripts/build-tokens.js` that throws a fatal compilation error whenever a primitive hex value is detected in a semantic tier variable definition.

