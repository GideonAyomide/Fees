# Real Defects Log — Task Three (Client Validation & Accessibility)

## Overview
In accordance with Rule 8 of the assessment framework, this document records real defects present in the Task Three codebase by file and line number, detailing the technical failure mode, production cost, and engineering remediation.

---

## Defect 1: The Defenseless Activation Endpoint
* **File Reference**: [`app/api/auth/activate/route.ts#L6-L25`](file:///c:/Users/HP/Desktop/Fees/app/api/auth/activate/route.ts#L6-L25)
* **What is Broken**:
  The `POST /api/auth/activate` route accepts JSON payloads directly without validating data types, string lengths, or required fields on the server. As proven in Step 8 (`evidence/16-direct-request-command-and-response.txt`), an attacker sending a direct HTTP request bypassed all 8 client-side rules, provisioned an account with `acceptTerms: false`, and received `HTTP 200 OK`.
* **Production Cost**:
  Critical security exposure. Malicious bots can flood the school's account registry with thousands of fake records, tie up valid student admission numbers, and bypass statutory parental consent required under the Nigeria Data Protection Act (NDPA).
* **Remediation**:
  In Task Four, install Zod schema validation at the HTTP boundary, verify terms acceptance booleans, and enforce server-side rate-limiting and hashing before any record touches the database.

---

## Defect 2: Lack of In-Flight Submission Debounce Locking
* **File Reference**: [`components/auth-unified-form.tsx#L145-L165`](file:///c:/Users/HP/Desktop/Fees/components/auth-unified-form.tsx#L145-L165)
* **What is Broken**:
  The `handleSubmit` function sets `statusMessage` but lacks an atomic `isSubmitting` state lock that immediately disables the form during an active network fetch.
* **Production Cost**:
  A parent on a fluttering 3G connection who taps the submit button three times in rapid succession dispatches three concurrent HTTP POST requests. If server processing has slight latency, this causes race conditions, duplicate account activation attempts, and confusing multiple SMS notifications.
* **Remediation**:
  Wrap submission handlers in an atomic boolean flag (`isSubmitting`) that instantly disables the submit button and prevents duplicate event dispatches until the server responds.

---

## Defect 3: Failure to Strip International Dialing Prefix (`+234`)
* **File Reference**: [`components/auth-unified-form.tsx#L70-L85`](file:///c:/Users/HP/Desktop/Fees/components/auth-unified-form.tsx#L70-L85)
* **What is Broken**:
  The real-time phone cleaner uses `value.replace(/\D/g, '').slice(0, 11)`. If a parent copies and pastes their phone number from WhatsApp in international format (`+2348012345678`), the regex strips the `+` to yield `23480123456`, which truncates the last two digits and triggers a length/format rejection.
* **Production Cost**:
  High registration drop-off among mobile parents who copy their numbers directly from address books or messaging apps.
* **Remediation**:
  Add prefix normalization logic: if the string begins with `234`, replace it with standard Nigerian local prefix `0` before applying the 11-digit slice.

