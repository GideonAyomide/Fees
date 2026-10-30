---
trigger: glob
globs: app/**/*.tsx, components/**/*.tsx
---

# screens.md
Job: what each screen shows and says, and which internal screens exist. PRD 6.
Not here: how answers are chosen (ai-pipeline.md), how the posted up to date is set (ledger-upload.md), the offline cache (offline-cache.md), colours, fonts and layout style (a design skill covers those).

## Exact wording
Use these strings exactly. Do not reword them. Why: testers check these words.
- No answer: "The school's records do not have this."
- Balance not loaded: "Not loaded yet"
- Balance screen notice: "The bursar's book is the official record. If this looks wrong, tap Talk to a person."
- Date line on every balance, item list and receipt list: "The bursar's book is posted up to [date]"
- Offline: "Posted up to [date]. You are offline."
- Ask the school fails: "Ask the school is not working right now."
- Payment pending, second attempt: "Wait 10 minutes. Do not pay again."
- After 60 seconds waiting: "Still waiting. Your reference is [reference]. Do not pay again. Check My receipts in a few minutes, or talk to [named person]."
- Payment under review: "Checking. Please talk to [named person]." with the reference. The balance screen also shows "A payment of [amount] is waiting to be checked".
- Opened inside another app's browser: "Tap the three dots and choose Open in Chrome".
The named person comes from the Contact table. Never hard code a name. Any other text is plain English in short sentences. If a screen needs wording the PRD does not give, stop and ask.

## Parent screens
1. Text only. No images except the app icon. Why: small data bundles and cheap phones.
2. The balance screen is readable within 5 seconds on a first visit and 2 seconds on a repeat visit, on a low cost Android phone or Chrome with Slow 4G and a 4 times CPU slowdown. The balance response is under 20 KB. Why: PRD 6.12.
3. Every page shows a loading line. Why: Neon's database sleeps when idle, so the first request can be slow.
4. Ask the school shows the record title, approval date, valid from date, the record text, and a "This looks wrong" button. Why: every answer must show which approved record it came from and when.
5. Talk to a person shows exactly one named person with `tel:` and `https://wa.me/<number>?text=<message>` links. The app sends nothing. The parent taps send. Why: no automated messages in version one.
6. A receipt can be shared as plain text, for example "Receipt FEES-AB12CD. 20,000 naira. 12 Oct 2026. Chidi Adebayo, JSS2. Paid by card. Received by [School name]." Why: parents show receipts at the school gate.

## Internal screens
7. Build only these screens. Build no other admin screen. Why: they are input, not features.
- Staff: Records, Ledger upload, Post a payment, Guardians, Reconcile, Daily close, Flags, Credits, Export.
- Owner: Approve, Friday check, Questions and flags, Test run, Usage.
8. Every action on these screens that changes data writes one AuditLog row. Why: the owner must be able to see who changed what.

## Done
9. A screen is done when the PRD acceptance criteria for it in section 6 pass. Why: they are the tests.
