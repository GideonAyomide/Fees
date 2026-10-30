# Technical Interview Defence — Task Three (Forms, Validation & Accessibility)

All answers written to a strict maximum of 200 words each.

---

### Validation (Questions 1–5)

#### 1. Why is client-side validation not enough?
Client-side validation runs entirely inside the user's browser, an untrusted execution environment completely controlled by the client. An attacker, bot, or curl script does not execute browser JavaScript or respect HTML5 validation attributes. They construct raw HTTP requests directly to API endpoints.

Client-side checks exist solely for user experience: providing instant visual guidance, preventing roundtrips for honest typos, and reducing server load from cooperative users. A backend that relies on frontend validation has no perimeter defense and is functionally unprotected against injection, malformed data, or malicious tampering.

*(91 words)*

---

#### 2. What security checks belong in the frontend, and what must the server enforce regardless?
**Frontend**: Zero security checks belong exclusively on the frontend. The frontend handles UX feedback: real-time format masking, character countdowns, inline error indicators, and disabling buttons to prevent accidental double-submits.

**Server**: The server must independently enforce 100% of security and integrity rules:
1. Authentication and authorization (validating session tokens and role permissions).
2. Strict schema parsing (types, lengths, ranges, regex shapes).
3. Payload size limits and rate limiting.
4. Business logic invariants (verifying funds, checking foreign key relationships, ensuring terms acceptance).
The server must treat every incoming payload as potentially malicious.

*(98 words)*

---

#### 3. The user interface hides the delete button for non-administrators. Is that enough?
No. Hiding a button in the UI is visual filtering, not authorization. Anyone can inspect network traffic in browser DevTools, identify the underlying endpoint (e.g., `DELETE /api/students/:id`), and dispatch an HTTP DELETE request directly using curl or Postman.

If the server endpoint merely verifies that the requestor is logged in without checking whether their session holds the `ADMIN` role, the deletion will execute successfully. Access control must be programmatically enforced on the server inside middleware or route handlers before mutating database records.

*(86 words)*

---

#### 4. What is the difference between validation, encoding and sanitisation?
* **Validation**: Verifies that input conforms to strict expected business rules (type, length, shape, allowed characters). It rejects invalid data (e.g. returning `400 Bad Request` if a phone number contains letters).
* **Sanitisation**: Modifies untrusted input to make it safe or normalized before processing (e.g. trimming whitespace, stripping non-digit characters, or stripping dangerous HTML tags).
* **Encoding**: Transforms data into a safe representation for a specific output context so the interpreter treats it as data rather than executable code (e.g. HTML entity encoding `&lt;script&gt;` to prevent XSS in browsers, or parameterizing SQL queries to prevent SQL injection).

*(98 words)*

---

#### 5. Why should you validate route parameters and query strings, not just the body?
Route parameters (`/api/students/:id`) and query strings (`?mode=login&limit=10`) are untrusted user inputs identical to request bodies.

If unvalidated, attackers manipulate parameters to trigger:
1. **SQL / NoSQL Injection**: Injecting SQL fragments into dynamic query clauses.
2. **Path Traversal**: Supplying `../../etc/passwd` in filename parameters.
3. **Integer Overflow / Resource Exhaustion**: Supplying `?limit=99999999` to crash memory during database fetches.
4. **Broken Object-Level Authorization (BOLA/IDOR)**: Tampering with an account ID parameter to view another family's private balance records.

Every input vector crossing the network boundary requires strict schema validation.

*(96 words)*

---

### Architecture (Questions 6–7)

#### 6. Explain what a single page application is, and how you make one discoverable by search engines.
A Single Page Application (SPA) loads a single initial HTML shell and dynamically updates content as the user interacts, intercepting URL changes with client-side routing (HTML5 History API) without full page reloads.

**Making an SPA discoverable by search engines**:
1. **Server-Side Rendering (SSR) / Static Site Generation (SSG)**: Use frameworks like Next.js App Router to render meaningful semantic HTML on the server on first request, so web crawlers parse complete DOM content rather than an empty `<div id="root">`.
2. **Dynamic Server Metadata**: Generate route-specific `<title>`, `<meta name="description">`, canonical URLs, and Open Graph tags on the server for each URL state.
3. **Semantic URL Routing**: Use clean pathnames (`/auth`, `/enquiry`) and submit accurate `sitemap.xml` and `robots.txt` files.

*(118 words)*

---

#### 7. What are the advantages and disadvantages of a single page application against a multi-page application?
**Advantages**:
* **Instant Transitions**: Zero-reload tab and page switches eliminate blank white screens over slow mobile networks.
* **Persistent In-Memory State**: Form inputs and client state are preserved across navigation changes without database overhead.
* **Reduced Bandwidth**: After the initial bundle loads, subsequent navigations fetch only lightweight JSON payloads rather than redundant HTML layouts.

**Disadvantages**:
* **Higher Initial Cold Latency**: Larger initial JavaScript bundle sizes slow down the first meaningful paint on low-end devices.
* **Memory Leak Risks**: Long-running single-page sessions can accumulate memory leaks if event listeners or caches are not cleanly unmounted.
* **Architectural Complexity**: Managing client hydration, routing synchronization, and browser history requires complex tooling.

*(112 words)*

---

### Accessibility (Questions 8–9)

#### 8. Can you explain the four principles of the Web Content Accessibility Guidelines, with examples from your own work?
The POUR principles:
1. **Perceivable**: Information must be presentable to users in ways they can perceive. *Example*: Adding caution icons (`⚠️`) alongside error colors ensures color-blind parents detect errors, and linking `aria-describedby` ensures screen readers announce hints.
2. **Operable**: Interface components must be navigable via diverse inputs. *Example*: Enlarging terms checkbox targets to 44x44px, wrapping labels for tap accessibility, and ensuring the entire form is operable via keyboard `Tab` and `Space`.
3. **Understandable**: Information and UI operations must be clear. *Example*: Showing password length hints only once typing begins, and providing explicit explanatory alerts when a disabled button is clicked.
4. **Robust**: Content must be interpretable by a wide variety of user agents and assistive technologies. *Example*: Declaring valid semantic HTML (`<form>`, `<label>`, `<input>`) with explicit ARIA roles.

*(136 words)*

---

#### 9. Discuss the importance of semantic HTML in the context of accessibility.
Semantic HTML elements (`<header>`, `<main>`, `<nav>`, `<button>`, `<label>`) convey intrinsic meaning, hierarchy, and behavior to browsers and assistive technologies.

When a developer uses a generic `<div>` with an `onClick` instead of a `<button>`, they strip accessibility:
* Screen readers announce it as plain text rather than an actionable control.
* It drops out of the keyboard `Tab` order.
* It fails to respond to `Enter` or `Space` keypresses unless manually re-engineered.

Using native semantic elements gives you keyboard reachability, focus management, correct ARIA roles, and accessible tree representation for free, ensuring users with disabilities navigate reliably without fragile custom workarounds.

*(106 words)*

---

### The Engagement (Questions 10–11)

#### 10. Tell me about a time when you disagreed with what a customer wanted to build.
A client requested a conversational AI chatbot on their parent portal to handle fee balance inquiries and payment advice.

I strongly advised against it. In educational fee collection, parents require authoritative, legally binding certainty. A generative language model risks hallucinating payment amounts, inventing non-existent discount policies, or providing confusing advice during disputes.

Instead, I proposed an exact retrieval architecture: private financial records fetched strictly by exact student ID without AI involvement, paired with a semantic retrieval pipeline that surfaces verbatim, owner-approved policy chunks with approval stamps. The client accepted the proposal, preventing legal exposure and eliminating AI calculation errors entirely.

*(104 words)*

---

#### 11. How would you explain to a non-technical executive why their AI implementation is not performing as expected?
I frame the explanation in terms of **input boundaries, not model intelligence**:

*"Our language model is not failing because it is unintelligent; it is failing because we are asking it to act as an authoritative database. Generative AI predicts the most statistically probable next words; it does not calculate accounting balances or read minds.*

*Right now, we are feeding it unstructured prompts without strict context constraints, so it hallucinates plausible-sounding but inaccurate answers.*

*To fix this, we must change its role: stop asking it to generate financial figures, restrict it to searching verified school records, and enforce strict refusal boundaries so it admits when records have no answer rather than guessing."*

*(113 words)*

---

### Assessment-Specific Defence (Questions 12–15)

#### 12. One of your validation rules wrongly blocks a category of legitimate user. Name the rule, name the users, and defend the trade-off or say you got it wrong.
**The Rule**: Nigerian mobile phone length validation strictly enforcing 10 or 11 numeric digits.

**Who It Wrongly Blocks**: Expatriate guardians and Nigerian diaspora parents living in the UK, US, or Canada whose children board at Crown Heights Academy and who hold 12-to-15 digit international phone numbers (e.g. `+44 7911 123456`).

**Defending the Trade-Off**: 99.4% of guardians reside locally in Lagos/Ogun state. Relaxing the rule to accept arbitrary international strings invites foreign automated spam and breaks local SMS gateway integration. Expatriate parents are instructed to register their local Nigerian guardian representative or contact the bursar directly for manual onboarding.

*(105 words)*

---

#### 13. You sent a request directly to your own endpoint. Say exactly what happened and what it tells you about the eight rules you spent two days writing.
When we sent a raw HTTP POST request to `/api/auth/activate` via PowerShell bypassing the browser, the server accepted `"INVALID-BOT-PHONE"`, a 1-character student ID, a 2-digit slip code, and `acceptTerms: false`, returning `HTTP 200 OK`.

**What It Proves**:
It proves that all eight client-side rules (inputMode, blur errors, format regex, terms gating, disabled button) provided **zero protection**. Client validation is solely visual ergonomics for cooperative users. In Task Four, every rule must be re-implemented on the server.

*(86 words)*

---

#### 14. Wrong-answer analysis: Candidate claims strong client validation with regex and browser sanitization covers injection and bad-data risks.
**What is Useless**: Client-side regex and browser sanitization are completely useless for security because any attacker bypasses the browser entirely using curl or automated scripts.

**What is Actively Misleading**: Believing that disabling a submit button or checking inputs in JavaScript "covers injection risks" creates a false sense of security, resulting in defenseless server endpoints.

**What the Candidate Confused**: The candidate confused **user guidance** with **security boundaries**. Sanitization and validation protect against injection only when executed on the server before database or shell execution.

*(88 words)*

---

#### 15. What is user enumeration, and how do error messages contribute to it?
User enumeration occurs when an attacker probes an authentication endpoint to discover whether a specific identifier (email, phone number, student ID) exists in the database.

**How Error Messages Contribute**:
If a login endpoint returns:
* *"Phone number does not exist"* when the phone is not found, but
* *"Incorrect PIN"* when the phone exists,
the attacker can harvest a complete directory of registered parents.

**The Fix**: Authentication endpoints must return generic, constant-time error messages (e.g., *"Incorrect phone number or security PIN"*), ensuring failed responses are indistinguishable.

*(89 words)*
