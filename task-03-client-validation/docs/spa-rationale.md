# Single-Page Authentication Architecture: Rationale & Trade-Offs

## 1. Context & Business Drivers
In the Crown Heights Academy Fees portal, parents open the web application on budget Android smartphones over intermittent 3G networks and metered data bundles. Every avoidable HTTP roundtrip costs real money, battery life, and attention.

---

## 2. Why Instant Form Switching Matters

### 1. Zero-Latency Transitions
In a collapsed single-page architecture, the three authentication states:
* `/auth?mode=login` (Sign In with Phone & PIN)
* `/auth?mode=activate` (Activate Account with Slip Code)
* `/auth?mode=reset` (Reset PIN / Request Bursar Contact)
are rendered by a single component conditionally mounting sub-views based on the URL search parameter. Switching tabs takes **0 milliseconds** on the client without contacting the server or re-parsing HTML bundles.

### 2. State Preservation Across Intent Changes
A parent frequently attempts to sign in, realizes they have never activated their account with the school's paper slip code, and toggles from **Login** to **Activate**. In a multi-page setup, navigating to a new URL wipes all input state, forcing the parent to re-type their 11-digit phone number. In our unified component, shared state (such as the entered phone number) is preserved seamlessly across tab changes.

### 3. Elimination of White-Screen Reloads
On spotty 3G connections, full page reloads frequently stall on blank screens while waiting for network handshake timeouts. A client-side query parameter switch maintains the institutional shell, primary header, and background contrast uninterrupted.

---

## 3. What the User Experience Was Before
Prior to collapsing into a unified query-parameter architecture:
1. **Network Overhead**: Clicking "Forgot PIN" dispatched an HTTP `GET /auth/reset` document request, causing the browser to clear the DOM, download server-rendered HTML, and re-execute client JavaScript hydration.
2. **Orientation Disorientation**: On low-end Android hardware, the intermediate blank white screen caused parents to believe the network had dropped, prompting repeated tapping and accidental navigation bounces.
3. **Frustration from Input Loss**: Any partial typing (phone number or child's name) was discarded on navigation, causing high abandonment during school morning rush hours.

---

## 4. When Separate Pages Would Be the Better Choice (The Trade-Off)

Single-page architecture is not universally superior. There is a distinct architectural situation where **separate multi-page routes** (`/login`, `/signup`, `/reset`) are the objectively better choice:

### The Enterprise / Complex KYC Funnel Scenario
When an authentication or onboarding workflow involves:
1. **Heavily Differentiated Assets & Heavy Bundles**: If the registration flow requires biometric camera capture, document upload SDKs (e.g. passport scanning), or rich credit card tokenizers, embedding all of that code into a single `/auth` route bloats the JavaScript bundle for the 90% of returning users who only need a lightweight 2-field login form. Separate routes allow granular code-splitting.
2. **Distinct Security & Content Security Policies (CSP)**: An identity verification or document scanning route may require specific `script-src` and `worker-src` permissions that should strictly never be granted to a simple login page. Separate URLs permit unique HTTP response security headers per route.
3. **Isolated Server-Side Audit Logs & Funnel Analytics**: Enterprise compliance teams (and payment gateway risk engines) often require server-level access logs proving that a user explicitly navigated through `/compliance/terms-acceptance` before hitting `/compliance/identity-verify`. In an SPA, internal tab switches do not hit server access logs unless custom telemetry is instrumented.

