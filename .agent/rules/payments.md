---
trigger: model_decision
description: Flutterwave payment start, webhook handling, verify call, pending payments, receipts, allocation, reconciliation screens. Use when working on Pay, the webhook route, or anything that records a payment.
---

# payments.md
Job: how a payment starts, is confirmed, is recorded and is checked. PRD 6.5, 6.7, 8.6, 8.8, 11.3.
Not here: screen wording (screens.md), offline behaviour (offline-cache.md), sign in (auth.md).

## Unconfirmed Flutterwave details
The PRD marks these as unconfirmed: the webhook signature check, the event name, the verify call and the lookup by `tx_ref`. If you cannot open Flutterwave's developer documents, stop and ask. Do not write any of them from memory. Why: a wrong signature check either rejects real payments or accepts forged ones.

## Starting a payment
1. The amount is a whole number of naira, not above the balance, and at least the school's minimum part payment unless it clears the whole balance. Why: PRD 6.5.1.
2. Check that no PENDING payment exists for the student. If one does, do not start another. Why: a second payment while the first is unresolved can charge a parent twice.
3. Insert a Payment row as PENDING with a random reference like FEES-AB12CD34. Send it to Flutterwave as `tx_ref`. Why: the reference ties the gateway's message to our row.
4. Call Flutterwave's Standard payment endpoint from the server. Send `tx_ref`, `amount` in naira (convert from kobo), `currency` NGN, `redirect_url`, and a `customer` with a placeholder email at a domain the school controls that cannot receive mail. Why: checkout needs an email on every payment. Test in test mode that the placeholder is accepted.
5. Redirect the browser to `data.link`. Flutterwave returns the parent to `/pay/waiting?ref=...`. The `status`, `tx_ref` and `transaction_id` in that address are never trusted. They only choose which waiting screen shows. Why: a parent's phone can send any value.
6. The Pay button shows only when `SchoolSettings.payEnabled` is true. Why: Pay is off at launch until the owner turns it on.

## Receiving the confirmation (`POST /api/webhooks/flutterwave`)
7. Read the raw body before any parsing. Why: the signature is made over the raw bytes.
8. Check the signature as the Flutterwave documents say, in constant time. If it fails, store the event with `signatureValid = false`, return 401 and do nothing else. Why: an unsigned message could be forged.
9. Build a dedupe key from the event type and the gateway transaction ID. Insert a GatewayEvent row. If the key exists and has `processedAt`, return 200 and stop. If it exists with no `processedAt`, process it again. Never return 200 for an event that was stored but not processed. Why: a failed first attempt must still be recovered.
10. For the payment event: read `data.tx_ref`, `data.id` and `data.status`. Find the Payment by `tx_ref`. Not found: set the event result UNKNOWN_REFERENCE. Status not successful: mark the payment FAILED unless it is already SUCCESS, and stop. Save `data.id` as `gatewayTxnId`. Why: each outcome needs a stored result the owner can see.
11. Call the verify endpoint with `gatewayTxnId`. Confirm status successful, currency NGN, matching `tx_ref`, and an amount equal to the expected amount after converting naira to kobo. If the call fails or times out, return 500 and change nothing. Why: this stops a forged or replayed message.
12. In one database transaction: stop if the payment is already SUCCESS. If the amount paid differs from the expected total, set NEEDS_REVIEW, open a Flag and stop. Otherwise set SUCCESS and `paidAt`. Allocate the amount to unpaid fee items, oldest due date first. Any leftover goes to `unallocatedKobo` and the payment becomes NEEDS_REVIEW. Recompute Entitlement. Write an AuditLog row. Why: money and status must never be half updated.
13. Return 200 quickly. Keep the handler to: store the event, verify, update. Why: the hosting plan's function time limit is unchecked.
14. A late success for a payment already FAILED or ABANDONED still counts. Why: money received beats a timer.

## Pending payments
15. The "Check this payment" button asks Flutterwave by `tx_ref`. Successful: record it. Failed, or no record and the attempt is over 10 minutes old: mark FAILED or ABANDONED and allow a new payment. Otherwise show the wait message. Why: the parent must never be able to pay twice.
16. When a parent opens the app with a PENDING payment older than 5 minutes, ask the gateway once and update the row. A payment still PENDING after 30 minutes with no gateway record becomes ABANDONED. Do not add a scheduled job. Why: the PRD sizes version one without one.
17. The "Waiting for confirmation" screen reads our own database, never the gateway. It checks every 5 seconds for 60 seconds, then shows the still waiting message. Why: the gateway can be slow or down, and our own database is the record.
18. After success, open the receipt screen. The receipt appears in My receipts. Why: the parent needs proof at once, for example at the gate.

## Money rules
19. A typed amount or the full balance is applied to the oldest unpaid item first, by due date. "Pay this item" goes to that item only. Why: oldest first matches the school's paper book.
20. Show the exact total charged before the parent taps Pay. The school absorbs the gateway fee by default. Why: PRD 6.5.2.
21. The live Flutterwave fee is unconfirmed (1.4 percent against 2.0 percent, and whether a cap applies). Never hard code or quote a rate. Ask the human. Why: sources disagree.
22. Never offer refunds. For a refund or a wrong transfer, show the payment reference and the named person. Why: the school handles refunds by hand and the app holds no money.

## Reconciliation screens
23. A person does reconciliation. Build the screens, not jobs. The Reconcile screen asks Flutterwave for the last 7 days of successful transactions and lists any reference missing from the app, present only in the app, or with a different amount. The staff screen lists successful online payments not yet written into the paper book, each with a tick box. The owner screen lists GatewayEvent rows with no `processedAt`, or with a result other than SUCCESS or IGNORED_DUPLICATE. Why: these catch a payment taken but not recorded.
