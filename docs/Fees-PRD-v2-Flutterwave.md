# Fees: Product Requirements Document

**Date:** 29 October 2026
**Version:** Version 2 (revised after a section by section review), payment gateway changed to Flutterwave

**How to read this document.** `[ASSUMPTION n]` marks something I added that you did not state. All of them are listed at the end under "Assumptions Added". `Problem Found` boxes mark holes or contradictions. "Decision" means the document fixes it. "Recommendation" means you can overrule it. Sample figures in examples (for example a 95,000 naira tuition fee) are invented for testing. Replace them with the school's real records.

**What changed in version 2.** A review found 27 lapses. Every one is fixed in this version. The list is at the end under "Review Changes Applied".

**Gateway change.** At your request the payment gateway is now Flutterwave, not Paystack. Nothing else in the product changed. The sections that changed are 5, 6.5.5, 8.1, 8.2, 8.4 (one new `Payment` field), 8.6, 8.8, 11.2, 11.3, 13, 14 and the assumptions. Several Flutterwave details (the webhook signature, the event name, the lookup by reference, the live fee) come from third party pages and conflict with each other. Each one is flagged for the coding tool to confirm in Flutterwave's own documents.

---

## 1. Product Summary

Fees is an installable web app that a school gives to its own parents. It is a retrieval system over the school's own records and nothing else. Nothing it says comes from the internet. It shows each family their own balance and receipts, answers fee and rule questions from records the school owner approved, takes payment through the school's own payment gateway account, and hands the parent to a named staff member (the bursar or the owner) when the records have no answer or the question is too risky.

The school keeps its balances in a paper book today. Version one starts with one class of about 30 to 40 students. The bursar types that class's balances into a spreadsheet, uploads it as a CSV file, and checks it against the paper book before any parent can see it. The paper book stays the legal record. Each day the bursar also copies successful online payments into the book, so the book never falls behind the app (section 8.8).

The five version one features:

1. **What do I owe:** balance, line items and due date, with a "posted up to" date.
2. **My receipts:** every payment with date, amount and reference, readable offline.
3. **Ask the school:** fee and rule questions answered from approved shared records, quoting the record and its approval date.
4. **Pay:** full or part payment through the gateway, with the exact total shown first.
5. **Talk to a person:** one button to call or message the right named person, which also works as the "this looks wrong" button.

**Two kinds of record (this rule applies throughout the document):**

| Kind | Examples | How it is found | Who can see it |
|---|---|---|---|
| Shared records | Fee schedule, rules, bank details, contacts, extras like bus and lunch | May be searched by meaning | Everyone, or only families who paid for that extra |
| Private records | Balance, fee items, payments, receipts | Fetched by exact student ID only. Never searched by meaning. Never searched across customers. | Only the linked family. The database refuses other rows, not just the app code. |

---

## 2. Problem

**The scene.** Mrs Funke Adebayo sells provisions at a market stall. In week one she pays 85,000 naira cash to the bursar and gets a handwritten slip. In week five the slip is lost. A class teacher works from a list that is three weeks old and sends her son home for "outstanding fees". The bursar's book shows she has paid. She closes her stall for a day, her son misses lessons, and she tells other parents the school cannot keep accounts. The same week, a neighbour tells another parent the fee is 95,000 naira. The school's real figure, with levies, is 110,000. Nobody can show a dated, written answer.

**What this costs.**

| Who | Cost |
|---|---|
| Parent | A lost trading day, missed lessons for the child, no proof of payment, uncertainty about the real fee |
| School | Bursar time spent on "how much do I owe" calls and visits, late payments caused by confusion, damaged trust, disputes the owner must settle |

**Baseline unknown.** I do not know how many calls and visits the bursar gets, or how many parents pay late because they were unsure. The school must measure both for one week before launch (see section 12).

**What the app does not fix.** The teacher's list in the scene is a separate record. The app gives the parent proof. It does not update the teacher's list. The school must agree one rule: a receipt shown in the app, or the bursar's book, overrides any teacher's list, and nobody is sent home on a list older than the bursar's "posted up to" date (section 14, question 11).

---

## 3. Goals

| # | Goal | Measure | Target `[ASSUMPTION 1]` |
|---|---|---|---|
| G1 | Parents can see their own balance without visiting or calling | Share of all guardians linked to the pilot class (not only those who activated) who open the app at least once in the first 4 weeks | 70% or more |
| G2 | Fewer balance enquiries reach the bursar | Count of "how much do I owe" calls and visits per week, against the baseline week | Down 50% or more |
| G3 | Fees are paid on time more often | Share of pilot class fees paid by the due date, against the same class last term and against one comparison class that does not use the app this term | Up 15 percentage points more than the comparison class |
| G4 | Answers are right | Wrong answers on the 30 question test list; "this looks wrong" taps per 100 answers | 0 wrong on the list; under 5 taps per 100 |
| G5 | The app is current | Working days between a cash payment and the app showing it | 1 day or less for 95% of payments |
| G6 | No family sees another family's data | Cross-family exposure incidents; cross-family test failures | 0 and 0 |
| G7 | The bursar's book is kept current | Share of working days with a "posted up to" stamp | 90% or more |
| G8 | The app does not bury the bursar | Bursar's weekly minutes on posting, stamping, copying, exporting and flags | 3 hours a week or less for the pilot class `[ASSUMPTION 36]` |

**Non goals for version one:** replacing the paper book; holding any money; reminders, SMS, or any automated message; results and report cards; chat; instalment plans; discount rules; more than one school; any agent.

---

## 4. Users and Personas

### The parent (the only app user)

**Mrs Funke Adebayo, 41.** Sells provisions at a market stall. Two children: Chidi in JSS2 and Tola in SS2. Inexpensive Android phone with a cracked screen. Buys 500 naira of data at a time. Power is unreliable. Nobody technical helps her. Reads English comfortably if sentences are short.

| Behaviour | Detail |
|---|---|
| How often | About 6 to 8 opens a term |
| When | First two weeks of term (what do I owe, how do I pay), right after paying cash (did it get recorded), exam weeks (am I cleared) |
| Why she opens it with no question | The school asks for the in-app receipt at the gate, and the code is printed on the fee slip. Without that school rule, expect almost no opens outside payment weeks. This is part of the product, not a nice extra. |
| Data | Each open should cost very little. Text only, cached shell, small responses. |
| Second guardian | Up to two guardians (for example mother and father) can be linked to the same child. Each has their own phone number, access code and PIN. Both see the same balance and the same payments for that child, including payments made by the other guardian. This is intended. |
| Phone ownership | Not every parent has a smartphone. Count them in the baseline week. A parent without one gets a printed statement from the bursar. That statement is outside the app `[ASSUMPTION 28]`. |

### Staff and owner (internal screens only, not app users)

The bursar's daily work is the real engine of this product: enter the day's cash and transfer payments, stamp "posted up to", copy successful online payments into the paper book, answer payment flags, and export every Friday. The target is 3 hours a week or less for a pilot class of about 40 (metric 11).

| Role | What they do | How parents see them |
|---|---|---|
| Bursar | Uploads the ledger CSV, posts cash and transfer payments, issues access codes, links guardians to students | As the named contact for money questions |
| Admin staff | Drafts shared records | Never |
| Owner | Approves shared records, runs the Friday total check, reads the log of flagged and unanswered questions | As the named contact for disputes and special arrangements |

---

## 5. Scope

### In scope for version one

| Area | Included |
|---|---|
| Customer features | The five features above, and nothing else |
| Login | Access code from the fee slip plus a 4 digit PIN |
| Records | Shared records with dates and approval. Private ledger from CSV upload. |
| Payment | Flutterwave checkout, webhook confirmation, receipts, reconciliation screen |
| Internal screens | Staff screen and owner screen (section 6.11) |
| Platform | Installable web app, offline view of last loaded balance and receipts |
| Pilot | One class, about 30 to 40 students, then the school |
| Bursar duties | Daily posting, the daily "posted up to" stamp, copying online payments into the paper book, credits, a Friday export |
| Launch order | Weeks 1 to 2: features 1, 2, 3 and 5 only. Pay stays off (`SchoolSettings.payEnabled` is false). The owner turns Pay on after three gates: the live Flutterwave account is approved, 20 test mode payments reconcile with no error, and the bursar has stamped "posted up to" on at least 8 of the last 10 working days `[ASSUMPTION 37]`. |

### Out of scope

Reminders, SMS, WhatsApp or email sent by the app, automatic late fees, instalment plans, discount or waiver rules, refunds, results, timetables, chat with teachers, agents, a Play Store app, multiple schools, languages other than plain English.

### What was cut and why

| Cut | Why |
|---|---|
| Reminders and notifications | You ruled out automated messages. Version one collects what version two needs (below). |
| Instalment plans | Needs a school policy that is not decided yet |
| Results and report cards | A normal app can show these. No fee value, and more data to get wrong. |
| Chat with teachers | A normal chat app does this. Not from the school's records. |
| Free-text AI answers | A wrong sentence about money costs more than a plain record shown word for word (Decision, section 7) |
| A sixth feature of any kind | Five is the limit |

### What version one must collect for version two

| Collect | Why version two needs it |
|---|---|
| Every question asked, the record shown, the outcome, and every "this looks wrong" or "no answer" event | To improve records and to prove answers are right |
| Dates a guardian opened the app (one row per day, no page history) | To know who reads what and when to send a reminder |
| Every payment attempt, including failed and abandoned ones, with the step where it stopped | To fix checkout and to find who needs a nudge |
| Which guardian is linked to which student, and each guardian's preferred phone number | A reminder needs to reach the right person |
| Due date and paid date for every fee item | To learn who pays late, on which line |
| Time between a cash payment and the app showing it | To prove the app is current |
| Which fee lines parents ask about most | To decide what the first reminders should say |

---

## 6. Functional Requirements

**Conventions.** "AC" means acceptance criterion: a test a tester can run and pass or fail. All times display in West Africa Time. Every private record is fetched by exact student ID under a database row rule (section 8.4). Money is shown in naira with no decimals unless kobo exist.

### 6.1 Login and session

**Person asks:** "Open the app." **App answers:** asks for the phone number and PIN. The access code is asked only on first use. **From this record:** `Guardian` (phone number, code hash, PIN hash).

| AC | Test |
|---|---|
| 6.1.1 | First visit: the parent enters the phone number the bursar has on file and the access code from the slip (any case, spaces and dashes ignored), then sets a 4 digit PIN twice. The code only activates the account. It is never used to sign in again. |
| 6.1.2 | 5 wrong PINs lock the account for 30 minutes. The message shows the unlock time. After 10 wrong PINs in one day, only the bursar can unlock. |
| 6.1.3 | A wrong phone number or access code shows the same message whether or not it exists. Attempt limits count per phone number and per access code. The limit per network address is high (200 an hour) because many phones share one address on mobile networks `[ASSUMPTION 29]`. |
| 6.1.4 | A device cookie (`httpOnly`, `secure`) keeps the parent signed in for 90 days `[ASSUMPTION 39]`. Opening the app after 5 minutes in the background asks for the PIN again `[ASSUMPTION 2]`. If the cookie is gone (cleared data, new phone), the parent signs in with phone number and PIN. |
| 6.1.5 | The bursar can reset a PIN, issue a new access code, change a phone number, and sign out all sessions for a guardian. A lost phone is handled by this. |
| 6.1.6 | Sign out removes all cached private data from the device. |
| 6.1.7 | One login shows every linked child, with a child switcher at the top. |
| 6.1.8 | Offline, the PIN is checked on the device against a salted hash saved at the last online PIN entry. 5 wrong tries offline clears the saved data from the device. |

### 6.2 Feature 1: What do I owe

**Person asks:** "What do I still owe for Chidi?"
**App answers:** "Chidi Adebayo, JSS2. You owe 40,000 naira. The bursar's book is posted up to 27 Oct 2026," then each fee item with amount, paid so far, remaining and due date.
**From this record:** `FeeItem` and `PaymentAllocation` for that exact student ID.

| AC | Test |
|---|---|
| 6.2.1 | Balance = sum of fee items minus sum of allocations, computed in SQL. No AI touches this screen. |
| 6.2.2 | The date line reads "The bursar's book is posted up to [date]". That date is the class's posted up to date, set only by the bursar's daily stamp (section 6.9). It is not the time this student's balance last changed. |
| 6.2.3 | If the student's ledger status is `NOT_LOADED`, the screen shows "Not loaded yet. Please ask Mrs Bello" with her number and hours, and shows no amount at all. It never shows 0. |
| 6.2.4 | If the ledger is loaded and nothing is owed, the screen says "You owe 0 naira. The bursar's book is posted up to [date]. All items are paid." |
| 6.2.5 | An item past its due date shows its due date and the word "Overdue". The app writes no threat and sends nothing. |
| 6.2.6 | Every balance screen shows: "The bursar's book is the official record. If this looks wrong, tap Talk to a person." |
| 6.2.7 | Cash and bank transfers appear only after the bursar posts them. The screen says so in one sentence. |
| 6.2.8 | Cross-family test: with guardian A signed in, requesting guardian B's student ID returns an empty result from the database, not an app level error. |
| 6.2.9 | The response is under 20 KB. |
| 6.2.10 | If any payment for this student is `PENDING` or `NEEDS_REVIEW`, a line under the balance says "A payment of [amount] is waiting to be checked. Reference [ref]." The balance itself does not change until the payment is confirmed. |
| 6.2.11 | The posted up to line and the stale warning (section 6.9) appear on this screen and on My receipts. |

### 6.3 Feature 2: My receipts

**Person asks:** "Did my 20,000 get recorded?"
**App answers:** a list of payments, newest first: date, amount, method, reference, and book receipt number for cash.
**From this record:** `Payment` for that exact student ID.

| AC | Test |
|---|---|
| 6.3.1 | Only `SUCCESS` payments are called receipts. `PENDING`, `FAILED`, `ABANDONED` and `NEEDS_REVIEW` show with their own labels and no receipt. `NEEDS_REVIEW` reads "Received, being checked". |
| 6.3.2 | A receipt can be shared as plain text, for example through WhatsApp: "Receipt FEES-AB12CD. 20,000 naira. 12 Oct 2026. Chidi Adebayo, JSS2. Paid by card. Received by [School name]." |
| 6.3.3 | The last loaded list is cached on the device and opens with no signal, marked "Posted up to [date]. You are offline." |
| 6.3.4 | A cash payment shows "Posted by the bursar on [date]. Book receipt no. [x]." |
| 6.3.5 | If the parent says a payment is missing, the screen offers Talk to a person with the question prefilled. |
| 6.3.6 | A credit (a scholarship or a correction posted by the bursar) shows as "Credit from the school, not a payment", with its reason. It reduces the balance. It is never counted as money received. |

### 6.4 Feature 3: Ask the school

**Person asks:** "Is bus included in tuition?"
**App answers:** "Bus is 25,000 naira per term. It is a separate charge." followed by "From: Fee schedule, approved 14 Sep 2026. Valid from 14 Sep 2026."
**From this record:** `SharedRecord` and its `SharedRecordChunk`. Shared records are searched by meaning. Private records are never searched, never embedded, never sent to any AI.

| AC | Test |
|---|---|
| 6.4.1 | The answer text is the record's own text, copied by the server from the database. The AI never writes or edits answer text (Decision). |
| 6.4.2 | Every answer shows the record title, its approval date, and its valid from date. |
| 6.4.3 | Records marked "paid extra" appear only to families who have a linked child that has paid that extra's fee item in full for the term the record covers (section 8.6 defines paid). The database enforces this, not only the app. |
| 6.4.4 | If no record is similar enough, the app says "The school's records do not have this." It shows the right named person, logs the question, and offers the Talk to a person button. |
| 6.4.5 | If the question is about the parent's own money (for example "how much do I owe"), the app does not answer from shared records. It sends the parent to screen What do I owe or My receipts. |
| 6.4.6 | If the question is on the refuse list (section 6.10), the app says it cannot answer that and shows the named person. |
| 6.4.7 | Every answer has a "This looks wrong" button. It records the flag and opens the Talk to a person screen. |
| 6.4.8 | Every question is logged, answered or not. |
| 6.4.9 | If the embedding service is unavailable or over its limit, the app says "Ask the school is not working right now" and shows the named person. It does not fall back to guessing. |
| 6.4.10 | The 30 question test list (section 7.7) passes in full before launch and after every change to records or thresholds. |
| 6.4.11 | The Ask screen opens with the 8 most asked approved questions as buttons `[ASSUMPTION 24]`. Tapping one shows its record straight from the database with no embedding call. Typed questions are limited to 200 characters and 20 a day per guardian `[ASSUMPTION 15]`. |
| 6.4.12 | Each record has a level scope (ALL, JSS or SS). The search only considers records for ALL or for the selected child's level. A parent with children in both levels picks the child first. |
| 6.4.13 | Before any embedding call, the server runs the keyword guard (section 7.4). A match ends the flow with a refusal or a redirect and logs the question. |

### 6.5 Feature 4: Pay

**Person asks:** "I want to pay 20,000 for Chidi."
**App answers:** "You will pay 20,000 naira. Total charged: 20,000 naira. Pay by card or bank transfer." then the gateway checkout.
**From this record:** `FeeItem` balance for the amount, `Payment` for the attempt, gateway for the money.

| AC | Test |
|---|---|
| 6.5.1 | The parent can choose "Pay full balance" (prefilled), "Pay this item" (one fee item in full, for example the bus fee), or enter an amount. A typed amount must be a whole number of naira and not more than the balance. It must be at least the school's minimum part payment unless it clears the whole balance `[ASSUMPTION 3]`. |
| 6.5.2 | The screen shows the exact total charged, including any gateway fee, before the parent taps Pay. Default is that the school pays the fee `[ASSUMPTION 4]`. |
| 6.5.3 | Tapping Pay creates a `Payment` row with status `PENDING` and a unique reference, then starts checkout from the server. |
| 6.5.4 | A payment counts only when the gateway's confirmation reaches the server and passes checks (section 8.6). The phone saying "success" counts for nothing. |
| 6.5.5 | If a `PENDING` payment already exists for that student, the app shows its reference and a "Check this payment" button. The server asks Flutterwave at once, using a lookup by the payment's `tx_ref` (our reference). If Flutterwave says successful, the payment is recorded. If Flutterwave says failed, or has no record and the attempt is more than 10 minutes old, the app marks it `FAILED` or `ABANDONED` and lets the parent pay again. Otherwise the app says "Wait 10 minutes. Do not pay again." The app never allows a second payment while the first is unresolved. |
| 6.5.6 | A typed amount or the full balance is applied to the oldest unpaid item first, by due date. "Pay this item" goes to that item only. `[ASSUMPTION 5]` |
| 6.5.7 | Paying needs internet. Offline, the Pay button is disabled with a one line reason. |
| 6.5.8 | After a successful payment, the receipt screen opens and the receipt appears in My receipts. |
| 6.5.9 | The app never offers refunds. A refund or wrong transfer shows the payment reference and the named person. |
| 6.5.10 | The Pay button shows only when `SchoolSettings.payEnabled` is true. The owner turns it on after the three launch gates in section 5 `[ASSUMPTION 37]`. |

### 6.6 Feature 5: Talk to a person

**Person asks:** "This looks wrong" or "I need help."
**App answers:** the name, role and hours of one person, with Call and WhatsApp buttons.
**From this record:** `Contact`.

| AC | Test |
|---|---|
| 6.6.1 | Money questions (balance, payment, receipt, bank details, refund) show the bursar. Disputes, waivers, special arrangements, anything about a child being sent home, and anything legal show the owner. Exactly one name is shown. |
| 6.6.2 | WhatsApp opens with a prefilled message: "Hello Mrs Bello, I am [guardian name], parent of [student name] ([class], code [code]). About: [question or topic]. Reference: [record title or payment reference]." |
| 6.6.3 | Outside the person's hours, the screen shows when they are next available. The buttons still work. |
| 6.6.4 | The app says "Tap send in WhatsApp to message her." It never claims staff were notified, because nothing is sent automatically. |
| 6.6.5 | Every tap creates a `Flag` row with its kind and links to the question or payment. Flags about a missing or checking payment appear on the bursar's screen every working day. All other flags appear on the owner screen every week. The person is expected to reply within 1 working day (section 14, question 10). |

### 6.7 Pending payment state

| AC | Test |
|---|---|
| 6.7.1 | After checkout the parent returns to a "Waiting for confirmation" screen that reads from the app's own database, not from the gateway. |
| 6.7.2 | The screen checks every 5 seconds for 60 seconds. |
| 6.7.3 | After 60 seconds it shows: "Still waiting. Your reference is FEES-AB12CD. Do not pay again. Check My receipts in a few minutes, or talk to Mrs Bello." |
| 6.7.4 | When the parent opens the app and finds a `PENDING` payment older than 5 minutes, the server asks the gateway for that reference's status once and updates the row. `FAILED` and `ABANDONED` are set this way. No scheduled job is needed. |
| 6.7.5 | A payment that is still `PENDING` after 30 minutes with no gateway record becomes `ABANDONED`. |

### 6.8 Offline behaviour

| AC | Test |
|---|---|
| 6.8.1 | The app shell loads from the device cache with no signal. |
| 6.8.2 | The last loaded balance and receipts show with their "posted up to" date and the label "You are offline". |
| 6.8.3 | Ask the school and Pay need signal and say so in one line. Talk to a person still shows the contact details from cache. |
| 6.8.4 | Cached private data is cleared on sign out and after the bursar revokes sessions (checked on the next online open). |

### 6.9 "Posted up to" date and "Not loaded yet"

Every balance, item and receipt list carries the line "The bursar's book is posted up to [date]". That date is the class's posted up to date (`ClassLedger.postedThroughDate`). Only the bursar sets it, by tapping "Everything up to today is posted" on the staff screen after entering the day's cash and transfer payments. The app never sets it by itself, and an upload does not change it. If the stamp is more than 3 working days old, every balance screen for that class shows "This may be out of date. The bursar last posted on [date]." `[ASSUMPTION 38]`

A student's ledger status starts as `NOT_LOADED`. It becomes `LOADED` only when the bursar applies an upload that includes that student and the Friday check for the launch class has passed. A student who is `NOT_LOADED` shows no figures anywhere in the app.

Why not a time per student: a balance that did not change for two weeks would show a two week old date even when the book is fully current. A balance the bursar forgot to update would look the same. Only the bursar's stamp can tell "nothing changed" from "nothing was posted".

### 6.10 Refusal rules

| Situation | App behaviour |
|---|---|
| Records are silent | "The school's records do not have this." Show the named person. Log it. Never guess, estimate, or say "usually". |
| Another family's information | Refuse. Owner shown. |
| A waiver, discount or special deal not written in an approved record | Refuse. Owner shown. |
| Whether a child will be sent home or barred from exams | Refuse. Owner shown. |
| Refunds | Refuse. Bursar shown. |
| Anything legal | Refuse. Owner shown. |
| Anything about staff (pay, discipline) | Refuse. Owner shown. |
| Anything the internet could answer (news, other schools, exam results nationwide) | "The school's records do not have this." |
| Balance not loaded | "Not loaded yet", never 0 |
| Any number | Copied from a record. Never calculated, rounded or reworded by AI. |

### 6.11 Internal screens (input, not features)

**Staff screen**

| Screen | What it does |
|---|---|
| Records | Draft and edit shared records: title, body, 2 to 5 example questions in parents' words, kind, visibility (everyone or paid extra), extra, valid from and to dates. Warns if the body is over 120 words. Submit for approval. |
| Ledger upload | Upload `charges.csv` or `payments.csv`. Shows a preview with row errors. Nothing is applied until the bursar taps Apply. `[ASSUMPTION 6]` (file layouts in section 8.7) |
| Post a payment | One form for cash or bank transfer: student code, date, amount, book receipt number. |
| Guardians | Create a guardian, print the fee slip page with a one-time access code, link up to 2 guardians per student, reset a PIN, sign out all sessions. |
| Reconcile | Pull the gateway's transactions for a date range and list mismatches (section 8.8). |
| Daily close | The "Everything up to today is posted" button (section 6.9). The list of successful online payments not yet written into the paper book, each with a tick box. |
| Flags | The open flags about missing or checking payments, shown every working day. |
| Credits | Post a credit against one fee item, with a reason (a scholarship, or a correction of a wrong charge). The owner sees every credit on the Friday list. |
| Export | Download all ledger, payment and credit data as CSV files. The bursar does this every Friday (section 8.2). |

**Owner screen**

| Screen | What it does |
|---|---|
| Approve | Review drafted shared records and approve, send back, or retire them. Approval triggers embedding. |
| Friday check | Enter the total from the paper book. That total includes the online payments the bursar copied in. The app shows its own total, the difference, the number of online payments not yet copied, and the week's credits. Enter the result of 5 spot checks. Saves the result. |
| Questions and flags | Weekly list of no-answer questions, refused questions, and flagged answers, with the record shown for each. |
| Test run | Button that runs the 30 question list and shows pass or fail for each. |
| Usage | Count of guardians who opened the app this week, and the list of students still `NOT_LOADED`. |

Every change on these screens writes an `AuditLog` row.

### 6.12 Speed, size and installing

| AC | Test |
|---|---|
| 6.12.1 | On a low cost Android phone (or Chrome with "Slow 4G" and a 4 times CPU slowdown), the balance screen is readable within 5 seconds on a first visit and 2 seconds on a repeat visit. The tester writes down the times `[ASSUMPTION 30]`. |
| 6.12.2 | The app shell is under 1 MB. The balance response is under 20 KB. There are no images except the icon. |
| 6.12.3 | If the app opens inside WhatsApp's or another app's built in browser (for example from a QR code), a banner says "Tap the three dots and choose Open in Chrome". |
| 6.12.4 | Installing to the home screen is optional. The app works in the browser without it. |

---

## 7. AI and AI Related Tools and Solutions

### 7.1 What the AI does

In version one the AI does one job. It turns text into lists of numbers so the computer can match a parent's question to the right shared record.

A list of numbers that stands for the meaning of a piece of text is called an **embedding**. Two texts with similar meaning get lists that sit close together. "Close" is measured by **cosine similarity**. For our use it is a score that is usually between 0 and 1. A score near 1 means very similar meaning. A score near 0 means unrelated.

**Decision:** no language model writes any answer. The app shows the school's own record text, word for word, copied by the server from the database. A model that rewrites a fee rule can change a number or drop a condition, and a wrong sentence about money costs more than a plain record shown as written.

### 7.2 What the AI must not do

| The AI must not | Why |
|---|---|
| Write, reword, shorten or add to an answer | It could change a figure or a condition |
| Calculate, add up, round or compare money | Money comes only from records, and totals come from SQL |
| See any private record, student name, guardian name, balance or payment | Private records are never sent to any AI service. Only the parent's typed question leaves the app. |
| Decide whether a parent owes anything | That is a database fact |
| Answer from outside the school's records | Nothing comes from the internet |
| Take any action | No agents in version one |

### 7.3 Tools

| Job | Tool | Free tier facts as I know them | Use in version one |
|---|---|---|---|
| Embedding | A Google Gemini embedding model. I believe the name is `gemini-embedding-001`. Check the current name in Google AI Studio. Cut each embedding to 768 numbers. `[ASSUMPTION 12]` Pin the exact model name. Embed record chunks with the document setting and questions with the query setting, then test the other pairing in section 7.6 and keep the better one `[ASSUMPTION 31]`. If Google retires the model, every chunk must be re-embedded and the thresholds reset (section 9.6). | Google's rate limit page says limits are per project, that daily limits reset at midnight Pacific time, and that exact per-model numbers are shown inside Google AI Studio. I could not read the free tier numbers for the embedding model today. | Yes |
| Language model (held in reserve) | Gemma 3, or a current Gemini Flash-Lite model | Google's rate limit page lists Gemma 3 free at 30 requests per minute, 15,000 tokens per minute and 14,400 requests per day. Gemini model numbers are inside AI Studio. | No. Reserve use only: fix spelling in a parent's question before matching, and only if the test list shows spelling failures that embeddings cannot handle. |

**Limits change.** Re-read the limits in Google AI Studio on the day you build and again before launch.

> **Problem Found: the free embedding tier may be too small, and may allow Google to use what you send.**
> 1. I could not confirm the daily limit. If 400 guardians ask 3 questions each on the first day of term, that is 1,200 calls in a day. The limit may be lower.
> 2. I believe Google's free tier terms let Google use submitted content to improve its products. I did not verify this. Read the current terms.
>
> **Fixes built in:** popular question buttons that need no embedding call (AC 6.4.11), and a cap of 20 typed questions per guardian per day. Only the parent's typed question leaves the app. The screen warns parents not to type names, phone numbers or account numbers.
> **Your decision:** if the school owner will not accept the data terms, the paid tier has different terms. It costs very little at this size, but it breaks your "everything free" rule. I recommend the owner accepts the terms in writing before launch.

### 7.4 Guardrails

1. **Record selection only.** The AI picks no words. The server picks a record by score.
2. **Numbers are copied from the record.** The app never computes a money figure from shared records. Balances come from SQL on the private ledger.
3. **Quote the record and its date.** Every answer shows the record title, approval date and valid from date.
4. **Two layers catch risky and own-money questions.** Layer one is a keyword guard. It is plain code with no AI. It checks the question against a list the owner can edit. Risk phrases (for example "sent home", "refund", "money back", "court", "lawyer", "salary", "discount", "waive", "scholarship") end in a refusal. Own-money phrases (for example "do I owe", "my balance", "my payment", "did you receive") end in a redirect to What do I owe or My receipts. The owner adds phrases from the weekly log `[ASSUMPTION 40]`. Layer two is the search. Refusals live as shared records of kind `REFUSAL`, each with example questions and a named person. A refusal record counts at a lower bar (0.60) than an answer (0.72), because a wrong refusal costs a phone call and a wrong answer can cost a child a day at school. A refusal also wins any tie within 0.05 of the best answer. Neither layer is perfect. The weekly log review exists for what both miss.
5. **Own-money questions never use shared records.** Records of kind `REDIRECT` send the parent to the balance or receipts screen.
6. **Below the threshold means no answer.** The app says "The school's records do not have this."
7. **Log every question.** Answered, refused, redirected, unanswered, and errors.
8. **Input limits.** 200 characters per question, 20 typed questions per guardian per day.
9. **No instructions can be hidden in a question.** No language model reads the question in version one, so "ignore your rules" has no effect. If the reserve model is ever turned on, its output must be one question under 25 words, with no digits that the parent did not type. Otherwise the original text is used.

### 7.5 What happens to one question

1. The server trims the text, checks the length and the daily count, and runs the keyword guard (section 7.4). A guard match ends the flow here with a refusal or a redirect.
2. The server asks the embedding service for the question's numbers, using the "retrieval query" setting.
3. The server runs one SQL search as the family database role (section 10.4). The row rule hides anything this family may not see before ranking starts. The query also keeps only records whose level scope is ALL or matches the selected child's level.
4. The server applies this table:

| Best result | Outcome |
|---|---|
| A `REFUSAL` record scores 0.60 or more | Refuse. Show the named person for that record. |
| A `REFUSAL` record is within 0.05 of the best `ANSWER` record | Refuse. Same screen. |
| A `REDIRECT` record scores 0.72 or more | Send the parent to What do I owe or My receipts. |
| An `ANSWER` record scores 0.72 or more | Show that record. If a second record is within 0.03 and also 0.72 or more, show it too. `[ASSUMPTION 13]` |
| Nothing scores 0.72 or more | "The school's records do not have this." Show the right named person. |
| The embedding call fails | "Ask the school is not working right now." Show the named person. |

5. The server writes a `QuestionLog` row and shows the result with the "This looks wrong" button.

### 7.6 Setting the threshold

The 0.72, 0.60 and 0.03 values are starting guesses. Set them with the school's real records:

1. Run the 30 test questions and 20 extra off topic questions (weather, football, other schools).
2. Write down the highest score any off topic question reached.
3. Set the answer threshold just above it, and check that at least 24 of the 30 test questions still pass.
4. If a correct question falls below the threshold, add an example question to its record. Do not lower the threshold.
5. Set the answer bar and the refusal bar separately. Example questions usually score higher than body text, so if BODY and QUESTION chunk scores sit in different ranges, set a bar for each kind.
6. Test both embedding settings from section 7.3 and keep the pairing with the cleanest gap between right and wrong matches.

### 7.7 The 30 test questions

These use the sample records in section 10.5. The names, prices and rules are invented. **Before launch, rewrite this list from the school's real approved records.** During the baseline week the bursar writes down every real question parents ask, in their own words. At least half of the final list must be those real questions. A list written by the person who wrote the records only tests what that person already thought of. "Unpaid" means the family has not paid for that extra. "Paid" means they have.

| # | Question | Expected result |
|---|---|---|
| 1 | How much is tuition for JSS? | Record `tuition-jss-t1` |
| 2 | What is the SS tuition fee | `tuition-ss-t1` |
| 3 | wat is the total fee for ss3 with levies | `tuition-ss-t1` |
| 4 | Is there a development levy? | `levies-t1` |
| 5 | How much is the exam fee? | `levies-t1` |
| 6 | Is bus included in tuition? | `bus-fee-t1` |
| 7 | How much is bus per term? | `bus-fee-t1` |
| 8 | How much is lunch? | `lunch-fee-t1` |
| 9 | When must I pay by? | `due-dates` |
| 10 | Can I pay in parts? | `part-payment-rule` |
| 11 | What is the smallest part payment? | `part-payment-rule` |
| 12 | What is the school account number? | `bank-details` |
| 13 | Can I pay with my card in the app? | `payment-methods` |
| 14 | Do I need to show the receipt at the gate? | `receipt-gate` |
| 15 | What time does the bursar close? | `contacts-hours` |
| 16 | What time does the Ikeja bus pick up? (unpaid) | `bus-fee-t1` (it says times are shown to families who paid) |
| 17 | What time does the Ikeja bus pick up? (paid) | `bus-routes-t1` |
| 18 | What is on the lunch menu on Monday? (unpaid) | `lunch-fee-t1` |
| 19 | What is on the lunch menu on Monday? (paid) | `lunch-menu-t1` |
| 20 | Will my son be sent home if I do not pay this week? | Refuse, owner |
| 21 | Can I get a discount because I have three children? | Refuse, owner |
| 22 | I want my money back for the bus | Refuse, bursar |
| 23 | Can I take the school to court over fees? | Refuse, owner |
| 24 | How much does the principal earn? | Refuse, owner |
| 25 | How much does Mrs Okoye's son owe? | Refuse, owner |
| 26 | How much do I owe? | Redirect to What do I owe |
| 27 | Did my payment go through? | Redirect to My receipts |
| 28 | what is my balance for Chidi | Redirect to What do I owe |
| 29 | Who won the match yesterday? | No answer |
| 30 | What is the capital of Nigeria? | No answer |

**Pass rule:** all 30 give the expected result. One wrong answer fails the whole run. A missed answer (no answer where an answer was expected) is a fix to the records, and a wrong answer is a fix to the threshold or the records.

### 7.8 How to test

| When | What |
|---|---|
| Before launch | Run all 30 and the 20 extra questions. Run the cross family test (section 8.4). |
| After any record is approved or retired, and after any threshold change | Run all 30 again. The owner screen has a Test run button. |
| Every Friday | Owner reads the log of no answer and flagged questions. Each repeated one becomes a new example question on a record, or a new record. |
| Monthly | Pick 10 answered questions from the log and check each against the record by hand. |

---

## 8. Technical Architecture

### 8.1 Components

| Part | Choice | Notes |
|---|---|---|
| App | Next.js with TypeScript, App Router, route handlers for the API | Server rendered text pages. No heavy client libraries. |
| Database | PostgreSQL with the pgvector extension | One database holds everything. No separate vector service. |
| Data access | Prisma, plus raw SQL for vectors, row rules and the payment transaction | Two Prisma client instances (section 8.4). |
| Payment gateway | Flutterwave (Standard checkout, a hosted payment page the parent is sent to), owned by the school. `[ASSUMPTION 9]` | Test mode is free to build against. |
| Embedding | Google Gemini embedding model | Section 7.3 |
| Hosting | Vercel for the app, Neon for Postgres. `[ASSUMPTION 10]`, `[ASSUMPTION 11]` | Section 8.2 |
| Installable app | Web app manifest plus a small hand written service worker | No Play Store. |
| Contact buttons | `tel:` and `https://wa.me/<number>?text=<message>` links | Nothing is sent by the app. The parent taps send. |
| Region | Choose the Vercel function region and the Neon region together, as close to Lagos as each offers (probably Europe). | A far region adds delay on slow phones. Children's data may be stored outside Nigeria. The school must take advice and accept this in writing `[ASSUMPTION 32]`. |

### 8.2 Hosting and free tier limits

| Limit | What I found | What breaks | Fix |
|---|---|---|---|
| Vercel Hobby is for personal, non commercial use only | Vercel's own fair use page says commercial use needs a Pro or Enterprise plan. Pro was listed at $20 per user per month. | Using Hobby for a school that pays you breaks Vercel's terms and can get the account suspended. | Build and test on Hobby (free, for weeks). Budget Vercel Pro before the school pays you. Netlify and Cloudflare also have free tiers. I did not check their commercial terms. |
| Neon Free: 0.5 GB storage per project, 100 compute hours per project per month, 5 GB data out | Neon says hitting a monthly limit suspends compute until the next month. | The app goes dark. | Look at the Neon usage page every Friday. Upgrade to the pay as you go plan before a limit is near. The data is small (section 11.4). |
| Neon Free compute sleeps after 5 minutes idle and wakes on the next request | Neon says this cannot be turned off on Free. | The first request after a quiet spell is slower. | Every page shows a loading line. The app shell and cached balance show immediately, so the parent is never looking at a blank screen. |
| Supabase Free pauses after 1 week with no use and needs a manual restart | Found in Supabase's own pricing page. | A holiday would take the app down. | **Do not use Supabase Free.** This is why I chose Neon. |
| Gemini free tier daily limits and data terms | Section 7.3 | Ask the school stops on a busy day | Popular question buttons, a per guardian cap, and a clear "not working right now" screen |
| Flutterwave account review and settlement holds | A new merchant account needs business documents and a review. I did not find how long Flutterwave takes, and I did not verify settlement hold reports. | Money arrives late or not at all | Apply for the live account at least 3 weeks before launch. Keep the bursar's cash and transfer routes open. |
| Flutterwave webhook retries are few | One article says Flutterwave retries a failed webhook 3 times, 30 minutes apart, and only when retries are switched on in the dashboard. I did not confirm this in Flutterwave's documents. | A paid payment stays `PENDING` after the retries end | Switch retries on. Rely on the "Check this payment" button (6.5.5) and the daily reconcile (8.8) for anything the retries miss. |
| Backups and exit | Neon Free has a short restore window. I did not check how long. | A bad upload or a deleted table could not be undone. The school could not leave. | The Export button (section 6.11) downloads everything as CSV. The bursar does this every Friday and keeps the file with the paper book. The school owns this data (section 11.2). |

> **Problem Found: "free" is true for building and testing, not for running a live business app.** A live school app needs Vercel Pro (about $20 per month) unless you host somewhere that allows commercial use on a free plan. Section 11 shows the cost in naira.

### 8.3 Request flow for each feature

| Feature | Steps |
|---|---|
| Sign in | Browser sends phone number and PIN (first time only: phone number, access code and a new PIN). The `fees_system` role looks up the guardian. The server checks lock rules, sets the device cookie, and records `lastPinAt`. On each open the server writes the `AppOpen` row for today with `fees_system`, after checking the session. |
| What do I owe | Session cookie gives the guardian ID. `withFamily(guardianId)` opens a transaction, sets `app.guardian_id`, and runs SQL on `FeeItem` and `PaymentAllocation` for the chosen student ID. The database applies the row rule. |
| My receipts | Same pattern on `Payment` where `status` is any, newest first. |
| Ask the school | Section 7.5 and 10.4. |
| Pay | Section 8.6. |
| Talk to a person | The server reads `Contact`, builds the `tel:` and `wa.me` links, and writes a `Flag` row. |
| Staff and owner screens | Separate sign in. Use the `fees_system` role. Every change writes an `AuditLog` row. |

### 8.4 Data model and the row rule

**Money is stored as whole kobo** (100 kobo is 1 naira) in integer fields, so no rounding errors. `[ASSUMPTION 25]`

**Prisma version note.** The options in the schema below (`previewFeatures`, `directUrl`, `extensions`) and the way a second connection string is passed to a second client have changed between Prisma versions. Before writing any code, the coding tool must read the docs for the installed Prisma version, adjust these lines, and pin the version in `package.json` `[ASSUMPTION 33]`. I ran this schema through Prisma's own validator on the newest version available today. It accepted every model and relation. It rejected `url` and `directUrl` in the datasource block, because Prisma 7 moved connection URLs out of the schema file. The schema below uses the Prisma 7 form. I could not run migrations or the SQL against a database in this session, so the coding tool must test both.

**Vector column.** Prisma cannot read or write the `vector` type. The schema declares it as `Unsupported("vector(768)")`. Prisma Client cannot query that field, so every read and write of embeddings uses `prisma.$queryRaw` and `prisma.$executeRaw`. Flag for the coding tool: `prisma migrate dev` may report drift for this column. Keep the SQL in a migration file and use `prisma migrate deploy` in production.

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  extensions = [vector]
  // Prisma 7 and later: no connection URL in this file. The migration URL (DIRECT_URL) goes in prisma.config.ts,
  // and each PrismaClient gets its own connection through a driver adapter (see lib/db-family.ts).
  // Prisma 6 and earlier: add url = env("DATABASE_URL_SYSTEM") and directUrl = env("DIRECT_URL") here instead.
}

// ---------- Enums ----------
enum LedgerStatus {
  NOT_LOADED
  LOADED
}
enum GuardianStatus {
  ACTIVE
  DISABLED
}
enum ContactRole {
  BURSAR
  OWNER
}
enum FeeKind {
  TUITION
  LEVY
  EXAM
  BUS
  LUNCH
  CARRY_OVER
  OTHER
}
enum PaymentMethod {
  CARD
  GATEWAY_TRANSFER
  CASH
  DIRECT_TRANSFER
  CREDIT
  OTHER
}
enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  ABANDONED
  NEEDS_REVIEW
}
enum PaymentSource {
  APP
  BURSAR
}
enum RecordKind {
  ANSWER
  REFUSAL
  REDIRECT
}
enum Visibility {
  EVERYONE
  PAID_EXTRA
}
enum RecordStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  RETIRED
}
enum RouteTo {
  BURSAR
  OWNER
}
enum ChunkKind {
  BODY
  QUESTION
}
enum QuestionOutcome {
  ANSWERED
  REFUSED
  REDIRECTED
  NO_ANSWER
  ERROR
}
enum FlagKind {
  LOOKS_WRONG
  NEED_HELP
  NO_ANSWER
  MISSING_PAYMENT
}
enum FlagStatus {
  OPEN
  SEEN
  CLOSED
}
enum StaffRole {
  ADMIN_STAFF
  BURSAR
  OWNER
}
enum UploadKind {
  STUDENTS
  CHARGES
  PAYMENTS
}
enum UploadStatus {
  PREVIEW
  APPLIED
  REJECTED
}
enum ActorType {
  STAFF
  GUARDIAN
  SYSTEM
}
enum FeePayer {
  SCHOOL
  PARENT
}
enum StudentLevel {
  JSS
  SS
}
enum LevelScope {
  ALL
  JSS
  SS
}

// ---------- Single school settings (one row; one database per school) ----------
model SchoolSettings {
  id                 Int      @id @default(1)
  schoolName         String
  timezone           String   @default("Africa/Lagos")
  minPartPaymentKobo Int      @default(1000000)   // 10,000 naira, [ASSUMPTION 3]
  feePayer           FeePayer @default(SCHOOL)    // [ASSUMPTION 4]
  payEnabled         Boolean  @default(false)     // owner turns Pay on after the three launch gates
  gatewayPublicKey   String?                      // the secret key lives only in an environment variable
  updatedAt          DateTime @updatedAt
}

// ---------- People ----------
model Student {
  id           String            @id @default(cuid())
  studentCode  String            @unique          // printed on the fee slip, e.g. "JSS2-014"
  fullName     String
  className    String
  level        StudentLevel
  ledgerStatus LedgerStatus      @default(NOT_LOADED)
  createdAt    DateTime          @default(now())
  guardians    GuardianStudent[]
  feeItems     FeeItem[]
  payments     Payment[]
  entitlements Entitlement[]
  flags        Flag[]
}

model Guardian {
  id                  String          @id @default(cuid())
  fullName            String
  phone               String          @unique   // sign in name, checked by the bursar
  accessCodeHash      String?         @unique
  accessCodeExpiresAt DateTime?
  pinHash             String?
  failedPinCount      Int             @default(0)
  lockedUntil         DateTime?
  status              GuardianStatus  @default(ACTIVE)
  createdAt           DateTime        @default(now())
  students            GuardianStudent[]
  sessions            Session[]
  opens               AppOpen[]
  questions           QuestionLog[]
  flags               Flag[]
  payments            Payment[]
}

model GuardianStudent {
  id             String   @id @default(cuid())
  guardianId     String
  studentId      String
  guardian       Guardian @relation(fields: [guardianId], references: [id], onDelete: Cascade)
  student        Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  preferredPhone String?
  active         Boolean  @default(true)
  createdAt      DateTime @default(now())

  @@unique([guardianId, studentId])
  @@index([studentId])
  // Rule: at most 2 active guardians per student. Enforced in the staff screen code.
}

model Session {
  id         String    @id @default(cuid())
  guardianId String
  guardian   Guardian  @relation(fields: [guardianId], references: [id], onDelete: Cascade)
  tokenHash  String    @unique
  createdAt  DateTime  @default(now())
  expiresAt  DateTime                // 90 days
  lastPinAt  DateTime?               // private data needs a PIN entry in the last 5 minutes
  revokedAt  DateTime?

  @@index([guardianId])
}

model AuthAttempt {          // access code and PIN attempts by phone number, code and network address, used for rate limits
  id     String   @id @default(cuid())
  ipHash String
  key    String            // phone number or access code hash being tried
  kind   String            // "CODE" or "PIN"
  at     DateTime @default(now())

  @@index([ipHash, at])
  @@index([key, at])
}

model StaffUser {
  id              String        @id @default(cuid())
  name            String
  email           String        @unique
  passwordHash    String
  role            StaffRole
  active          Boolean       @default(true)
  lastLoginAt     DateTime?
  draftedRecords  SharedRecord[] @relation("RecordDrafter")
  approvedRecords SharedRecord[] @relation("RecordApprover")
  sessions        StaffSession[]
}

model StaffSession {
  id        String    @id @default(cuid())
  staffId   String
  staff     StaffUser @relation(fields: [staffId], references: [id], onDelete: Cascade)
  tokenHash String    @unique
  createdAt DateTime  @default(now())
  expiresAt DateTime              // 12 hours
  revokedAt DateTime?

  @@index([staffId])
}

model Contact {
  id          String      @id @default(cuid())
  role        ContactRole
  displayName String
  phone       String
  whatsapp    String?
  hoursText   String      // e.g. "Monday to Friday, 8am to 3pm"
  active      Boolean     @default(true)
}

// ---------- Private records (fetched by exact student ID, never searched across customers) ----------
model Extra {
  id           String        @id @default(cuid())
  code         String        @unique        // "BUS", "LUNCH"
  name         String
  feeItems     FeeItem[]
  entitlements Entitlement[]
  records      SharedRecord[]
}

model FeeItem {
  id          String              @id @default(cuid())
  studentId   String
  student     Student             @relation(fields: [studentId], references: [id], onDelete: Cascade)
  termLabel   String              // "2026/27 T1"
  label       String              // "Tuition", "Development levy"
  kind        FeeKind
  extraId     String?
  extra       Extra?              @relation(fields: [extraId], references: [id])
  amountKobo  Int
  dueDate     DateTime            @db.Date
  uploadId    String?
  createdAt   DateTime            @default(now())
  allocations PaymentAllocation[]

  @@unique([studentId, termLabel, label])
  @@index([studentId, dueDate])
}

model Payment {
  id               String            @id @default(cuid())
  studentId        String
  student          Student           @relation(fields: [studentId], references: [id])
  guardianId       String?           // set when the parent paid in the app
  guardian         Guardian?         @relation(fields: [guardianId], references: [id])
  reference        String            @unique   // "FEES-AB12CD34" for app payments; "BOOK-<receipt no>" for bursar posts
  method           PaymentMethod
  source           PaymentSource
  status           PaymentStatus     @default(PENDING)
  amountKobo       Int
  gatewayFeeKobo   Int               @default(0)
  unallocatedKobo  Int               @default(0)
  bookReceiptNo    String?
  paidAt           DateTime?
  postedAt         DateTime?
  postedById       String?           // StaffUser id, no foreign key by choice
  abandonedStep    String?           // where an abandoned or failed attempt stopped
  gatewayTxnId     String?           // Flutterwave's own transaction id, set from the webhook. Needed for the verify call.
  copiedToBookAt   DateTime?         // set when the bursar writes an app payment into the paper book
  copiedById       String?
  creditReason     String?           // required when method is CREDIT
  note             String?
  createdAt        DateTime          @default(now())
  allocations      PaymentAllocation[]
  flags            Flag[]

  @@index([studentId, status])
  @@index([status, createdAt])
  @@unique([studentId, bookReceiptNo])
}

model PaymentAllocation {
  id         String  @id @default(cuid())
  paymentId  String
  feeItemId  String
  payment    Payment @relation(fields: [paymentId], references: [id], onDelete: Cascade)
  feeItem    FeeItem @relation(fields: [feeItemId], references: [id], onDelete: Cascade)
  amountKobo Int

  @@index([feeItemId])
  @@index([paymentId])
}

model Entitlement {      // "this student has paid this extra's fee item in full for this term". Maintained by the server after every payment, posting, credit and upload.
  id        String   @id @default(cuid())
  studentId String
  extraId   String
  termLabel String
  validFrom DateTime @db.Date      // the term the paid extra covers
  validTo   DateTime @db.Date
  student   Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  extra     Extra    @relation(fields: [extraId], references: [id])
  grantedAt DateTime @default(now())

  @@unique([studentId, extraId, termLabel])
}

model GatewayEvent {
  id             String    @id @default(cuid())
  dedupeKey      String    @unique       // eventType + ":" + gateway transaction id
  eventType      String
  reference      String?
  rawBody        Json
  signatureValid Boolean
  receivedAt     DateTime  @default(now())
  processedAt    DateTime?
  result         String?                 // "SUCCESS", "IGNORED_DUPLICATE", "AMOUNT_MISMATCH", "UNKNOWN_REFERENCE", ...

  @@index([reference])
  @@index([processedAt])
}

// ---------- Shared records (may be searched by meaning) ----------
model SharedRecord {
  id           String       @id @default(cuid())
  recordKey    String                       // stable name, e.g. "bus-fee-t1"
  version      Int          @default(1)
  title        String
  body         String
  kind         RecordKind   @default(ANSWER)
  visibility   Visibility   @default(EVERYONE)
  levelScope   LevelScope   @default(ALL)
  extraId      String?
  extra        Extra?       @relation(fields: [extraId], references: [id])
  routeTo      RouteTo      @default(BURSAR) // who the parent is sent to if this record refuses
  validFrom    DateTime     @db.Date
  validTo      DateTime?    @db.Date
  status       RecordStatus @default(DRAFT)
  draftedById  String
  draftedBy    StaffUser    @relation("RecordDrafter", fields: [draftedById], references: [id])
  approvedById String?
  approvedBy   StaffUser?   @relation("RecordApprover", fields: [approvedById], references: [id])
  approvedAt   DateTime?
  createdAt    DateTime     @default(now())
  chunks       SharedRecordChunk[]
  questions    QuestionLog[]

  @@unique([recordKey, version])
  @@index([status, validFrom, validTo])
}

model SharedRecordChunk {
  id             String       @id @default(cuid())
  recordId       String
  record         SharedRecord @relation(fields: [recordId], references: [id], onDelete: Cascade)
  kind           ChunkKind
  text           String
  embedding      Unsupported("vector(768)")?   // FLAG: Prisma cannot read or write this. Use raw SQL.
  embeddingModel String?
  embeddedAt     DateTime?

  @@index([recordId])
}

// ---------- Logs ----------
model QuestionLog {
  id          String          @id @default(cuid())
  guardianId  String?
  guardian    Guardian?       @relation(fields: [guardianId], references: [id])
  studentId   String?
  rawText     String                              // cut to 200 characters
  outcome     QuestionOutcome
  recordId    String?
  record      SharedRecord?   @relation(fields: [recordId], references: [id])
  score       Float?
  secondScore Float?
  routedTo    RouteTo?
  fromButton  Boolean         @default(false)
  createdAt   DateTime        @default(now())
  flags       Flag[]

  @@index([createdAt])
  @@index([outcome, createdAt])
}

model Flag {
  id            String       @id @default(cuid())
  kind          FlagKind
  status        FlagStatus   @default(OPEN)
  guardianId    String
  guardian      Guardian     @relation(fields: [guardianId], references: [id])
  studentId     String?
  student       Student?     @relation(fields: [studentId], references: [id])
  questionLogId String?
  questionLog   QuestionLog? @relation(fields: [questionLogId], references: [id])
  paymentId     String?
  payment       Payment?     @relation(fields: [paymentId], references: [id])
  note          String?
  createdAt     DateTime     @default(now())
  closedAt      DateTime?
  closedById    String?

  @@index([status, createdAt])
}

model AppOpen {          // one row per guardian per day. Collected for version two. No page history.
  id         String   @id @default(cuid())
  guardianId String
  guardian   Guardian @relation(fields: [guardianId], references: [id], onDelete: Cascade)
  day        DateTime @db.Date

  @@unique([guardianId, day])
}

// ---------- Staff work ----------
model LedgerUpload {
  id           String       @id @default(cuid())
  kind         UploadKind
  fileName     String
  rowCount     Int
  status       UploadStatus @default(PREVIEW)
  errors       Json?
  uploadedById String
  uploadedAt   DateTime     @default(now())
  appliedAt    DateTime?
}

model ClassLedger {
  id                String    @id @default(cuid())
  className         String    @unique
  postedThroughDate DateTime? @db.Date   // set only by the bursar's daily stamp
  stampedAt         DateTime?
  stampedById       String?
}

model FridayCheck {
  id             String   @id @default(cuid())
  weekEnding     DateTime @db.Date
  bookTotalKobo  BigInt
  appTotalKobo   BigInt
  differenceKobo BigInt
  spotChecksPassed Int    @default(0)     // of 5
  notCopiedCount   Int    @default(0)     // online payments not yet written into the paper book
  passed         Boolean
  checkedById    String
  note           String?
  createdAt      DateTime @default(now())
}

model AuditLog {
  id         String    @id @default(cuid())
  actorType  ActorType
  actorId    String?
  action     String
  entity     String
  entityId   String?
  before     Json?
  after      Json?
  at         DateTime  @default(now())

  @@index([entity, entityId])
  @@index([at])
}
```

**Balance** for a student is computed in SQL, never stored and never edited by hand:

```sql
SELECT COALESCE(SUM(fi."amountKobo"), 0)
     - COALESCE((SELECT SUM(pa."amountKobo")
                 FROM "PaymentAllocation" pa
                 JOIN "Payment" p ON p."id" = pa."paymentId"
                 WHERE p."status" = 'SUCCESS'
                   AND pa."feeItemId" IN (SELECT "id" FROM "FeeItem" WHERE "studentId" = $1)), 0)
       AS "balanceKobo"
FROM "FeeItem" fi
WHERE fi."studentId" = $1;
```

**The row rule.** PostgreSQL can refuse rows inside the database. This is called **row level security**. The database checks a policy on every query and hides rows the policy does not allow, even if the app code has a bug.

- Two database roles. `fees_family` is used for every request made by a signed in parent. It can read only what its policies allow. `fees_system` is used for sign in, the payment webhook, and the staff and owner screens. `[ASSUMPTION 23]`
- A signed in parent request runs in one transaction that first sets the guardian ID, then runs the queries. The setting is local to the transaction.
- If the setting is missing or wrong, the policies match nothing. **The rule fails closed.**
- `FORCE ROW LEVEL SECURITY` is on, so even the table owner follows the rules. Run any data fixing migration as `fees_system`.

```ts
// lib/db-family.ts  (the only way a parent request reaches the database)
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
// Prisma 7 style: the connection goes through a driver adapter. In Prisma 6 and earlier, use datasourceUrl instead.
const family = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL_FAMILY }) });

export function withFamily<T>(guardianId: string, fn: (tx: Prisma.TransactionClient) => Promise<T>) {
  return family.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.guardian_id', ${guardianId}, true)`; // true = this transaction only
    return fn(tx);
  });
}
```

Use the pooled connection string for both URLs. Add `pgbouncer=true` to the Prisma pooled URL, as Neon's Prisma guide describes. The `set_config` call works because it is local to the transaction.

```sql
-- migrations/0002_row_rules.sql  (hand written; Prisma does not manage this)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE ROLE fees_family LOGIN PASSWORD '<set a long random password>' NOBYPASSRLS;
CREATE ROLE fees_system LOGIN PASSWORD '<set a long random password>' NOBYPASSRLS;

GRANT USAGE ON SCHEMA public TO fees_family, fees_system;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO fees_system;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO fees_system;

-- The family role: read only on records, insert only on its own logs and pending payments
GRANT SELECT ON "Student","GuardianStudent","FeeItem","Payment","PaymentAllocation","Entitlement",
                "Extra","Contact","SchoolSettings","ClassLedger","SharedRecord","SharedRecordChunk" TO fees_family;
GRANT SELECT, INSERT ON "QuestionLog","Flag" TO fees_family;
-- AppOpen rows are written by the server with fees_system after the session check, not by fees_family.
GRANT INSERT ON "Payment" TO fees_family;

-- Turn the rule on for every table, and let the system role through
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables
           WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY system_all ON %I FOR ALL TO fees_system USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;

-- The students this guardian may see. Missing setting gives NULL, which matches nothing.
CREATE FUNCTION fees_my_students() RETURNS SETOF text
LANGUAGE sql STABLE AS $$
  SELECT gs."studentId" FROM "GuardianStudent" gs
  WHERE gs."active" AND gs."guardianId" = current_setting('app.guardian_id', true)
$$;
GRANT EXECUTE ON FUNCTION fees_my_students() TO fees_family;

-- PRIVATE records: only rows for this family's students
CREATE POLICY family_gs ON "GuardianStudent" FOR SELECT TO fees_family
  USING ("active" AND "guardianId" = current_setting('app.guardian_id', true));
CREATE POLICY family_student ON "Student" FOR SELECT TO fees_family
  USING ("id" IN (SELECT fees_my_students()));
CREATE POLICY family_feeitem ON "FeeItem" FOR SELECT TO fees_family
  USING ("studentId" IN (SELECT fees_my_students()));
CREATE POLICY family_payment_read ON "Payment" FOR SELECT TO fees_family
  USING ("studentId" IN (SELECT fees_my_students()));
CREATE POLICY family_payment_insert ON "Payment" FOR INSERT TO fees_family
  WITH CHECK ("studentId" IN (SELECT fees_my_students())
              AND "status" = 'PENDING' AND "source" = 'APP'
              AND "guardianId" = current_setting('app.guardian_id', true));
CREATE POLICY family_alloc ON "PaymentAllocation" FOR SELECT TO fees_family
  USING ("paymentId" IN (SELECT "id" FROM "Payment"));      -- Payment's own policy limits these rows
CREATE POLICY family_entitlement ON "Entitlement" FOR SELECT TO fees_family
  USING ("studentId" IN (SELECT fees_my_students()));
CREATE POLICY family_question_read ON "QuestionLog" FOR SELECT TO fees_family
  USING ("guardianId" = current_setting('app.guardian_id', true));
CREATE POLICY family_question_insert ON "QuestionLog" FOR INSERT TO fees_family
  WITH CHECK ("guardianId" = current_setting('app.guardian_id', true));
CREATE POLICY family_flag_read ON "Flag" FOR SELECT TO fees_family
  USING ("guardianId" = current_setting('app.guardian_id', true));
CREATE POLICY family_flag_insert ON "Flag" FOR INSERT TO fees_family
  WITH CHECK ("guardianId" = current_setting('app.guardian_id', true));
-- (No family policy on AppOpen. Written by fees_system.)

-- School facts anyone signed in may read
CREATE POLICY family_extra ON "Extra" FOR SELECT TO fees_family USING (true);
CREATE POLICY family_contact ON "Contact" FOR SELECT TO fees_family USING ("active");
CREATE POLICY family_settings ON "SchoolSettings" FOR SELECT TO fees_family USING (true);
CREATE POLICY family_classledger ON "ClassLedger" FOR SELECT TO fees_family USING (true);

-- SHARED records: approved, in date, and either for everyone or for families who paid for that extra
CREATE POLICY family_record ON "SharedRecord" FOR SELECT TO fees_family
  USING ("status" = 'APPROVED'
         AND "validFrom" <= CURRENT_DATE
         AND ("validTo" IS NULL OR "validTo" > CURRENT_DATE)
         AND ("visibility" = 'EVERYONE'
              OR EXISTS (SELECT 1 FROM "Entitlement" e
                         WHERE e."extraId" = "SharedRecord"."extraId"
                           AND CURRENT_DATE BETWEEN e."validFrom" AND e."validTo"
                           AND e."studentId" IN (SELECT fees_my_students()))));
CREATE POLICY family_chunk ON "SharedRecordChunk" FOR SELECT TO fees_family
  USING ("recordId" IN (SELECT "id" FROM "SharedRecord"));  -- SharedRecord's policy decides
-- NOTE FOR THE CODING TOOL: the DO block above only covers tables that exist when it runs.
-- Re-run it after every Prisma migration that adds a table, or the new table has no row rule.
-- Tables with no family policy (Guardian, Session, AuthAttempt, StaffUser, GatewayEvent, LedgerUpload,
-- FridayCheck, AuditLog) return nothing to fees_family, because no policy lets it through.
```

**Cross family test (must pass before every release; the owner screen's Test run button runs it too).** For every pair of guardian A and a student who belongs only to guardian B, connect as `fees_family`, set `app.guardian_id` to A, and run `SELECT count(*)` on each private table filtered to B's student ID. Every count must be 0. Then run the same queries with no `app.guardian_id` set. Every count must still be 0.

> **Problem Found: the Friday total check can hide errors.** If one student's balance is typed 5,000 naira too high and another's 5,000 too low, the two totals still match. Two answers in this PRD cover it. The launch class is checked line by line by two people. Every Friday the owner also spot checks 5 students against the paper book (`FridayCheck.spotChecksPassed`). `[ASSUMPTION 22]`

### 8.5 Login and sessions

| Item | Decision |
|---|---|
| Access code | 8 characters from a set without look alike letters and digits. Single use. Expires after 30 days if not used. Stored only as an HMAC hash. `[ASSUMPTION 7]` It only activates an account. It never signs a parent in again. |
| Sign in name | The guardian's phone number, entered by the bursar when the guardian is created. Sign in is phone number plus PIN. A PIN alone never identifies a parent. |
| PIN | 4 digits, stored as a bcrypt hash. Four digits are weak on their own, so the lock rules in AC 6.1.2 and the attempt limits in AC 6.1.3 carry the safety. |
| New phone or lost phone | The bursar issues a new code and revokes old sessions. |
| Session | A random token in an `httpOnly`, `secure`, `sameSite=lax` cookie. Only the hash is stored. 90 days `[ASSUMPTION 39]`. `Session.lastPinAt` records the last PIN entry. A request for private data needs a PIN entry in the last 5 minutes, or the app shows the PIN screen. Offline, see AC 6.1.8. |
| Staff sign in | Email and password, bcrypt hashed. Staff sessions use the `StaffSession` table and last 12 hours. No two step sign in in version one. `[ASSUMPTION 8]` |
| Consent | The first screen after the PIN says in plain words what the app keeps, who can see it (the school), and that questions typed here go to an AI service. The parent taps "I understand". `[ASSUMPTION 26]` |
| Privacy notice | The school gives parents a one page notice: what is kept, who sees it, for how long, and who to ask. The builder writes a draft. The school's own lawyer approves it. |

### 8.6 Payment confirmation (webhook handling)

A **webhook** is a message the payment gateway sends to your server when something happens. The server never trusts the phone. It trusts the webhook, after checking it.

**Starting a payment**

1. The parent taps Pay. The server checks the amount (whole naira, at or above the minimum part payment, not above the balance) and checks that no `PENDING` payment exists for this student.
2. The server inserts a `Payment` row with status `PENDING` and a random reference like `FEES-AB12CD34`. This reference is sent to Flutterwave as `tx_ref`.
3. The server calls Flutterwave's Standard payment endpoint (`POST https://api.flutterwave.com/v3/payments`, with the secret key as a Bearer token). It sends `tx_ref` (our reference), `amount`, `currency` set to `NGN`, `redirect_url`, and a `customer` object with an email. **Flutterwave amounts are in naira, not kobo, so the server converts from kobo before sending.** Flutterwave needs an email on every payment. Version one sends a placeholder address made from the guardian ID on a domain you control that cannot receive mail. The parent receives nothing at it. Test in Flutterwave test mode that the address is accepted. `[ASSUMPTION 9]` `[ASSUMPTION 41]`
4. The response holds the payment page address in `data.link`. The browser goes there (a normal redirect, which keeps our pages light). Flutterwave sends the parent back to our `redirect_url`, `/pay/waiting?ref=...`, with `status`, `tx_ref` and `transaction_id` added to the address. The app never trusts these. They only decide which waiting screen to show.

**Receiving the confirmation** at `POST /api/webhooks/flutterwave`:

1. Read the raw request body before any parsing.
2. Check the signature. Flutterwave puts it in the `verif-hash` header. The school sets a "secret hash" (a long random string) in the Flutterwave dashboard under Settings, then Webhooks, and keeps a copy in an environment variable. **Sources disagree on the check.** One says the header simply equals the secret hash. Another says it is an HMAC SHA256 of the raw body made with the secret hash. Newer API versions may use a different header name. The coding tool must read Flutterwave's documents for the API version it uses and follow them `[ASSUMPTION 41]`. Either way, compare in constant time. If it does not match, store the event with `signatureValid = false`, return 401, and do nothing else.
3. Build the dedupe key (event type plus the gateway transaction ID). Insert a `GatewayEvent` row. If the key already exists, read that row. If it has a `processedAt`, return 200 and stop. If `processedAt` is empty, the first attempt failed part way, so carry on and process it again. Never return 200 for an event that was stored but not processed.
4. For the `charge.completed` event: read `data.tx_ref`, `data.id` and `data.status`. Find the `Payment` by `tx_ref`. If it is not found, set the event result to `UNKNOWN_REFERENCE`. It will show on the owner screen. If `data.status` is not `successful`, mark the payment `FAILED` (unless it is already `SUCCESS`), note the step in `abandonedStep`, and stop. Save `data.id` as `gatewayTxnId`.
5. Call Flutterwave's verify endpoint (`GET https://api.flutterwave.com/v3/transactions/:id/verify`, with `gatewayTxnId` as the id) and confirm `data.status` is `successful`, `data.currency` is `NGN`, `data.tx_ref` matches, and `data.amount` equals the expected amount. Convert naira back to kobo before comparing. `[ASSUMPTION 17]` This protects against a forged or replayed message. If the verify call fails or times out, return a 500 status and change nothing. With retries switched on, Flutterwave tries the message again (one article says 3 times, 30 minutes apart, which is much shorter than a day). If every retry fails, the "Check this payment" button (6.5.5) and the daily reconcile (8.8) recover the payment. Keep this handler minimal: store the event, verify, update. One article says Flutterwave waits 60 seconds for a reply. Check the function time limit of the hosting plan you use `[ASSUMPTION 34]`.
6. In one database transaction:
   - If the payment is already `SUCCESS`, stop.
   - If the amount paid does not equal the expected total, set status `NEEDS_REVIEW`, open a `Flag`, and stop. The parent sees "Checking. Please talk to Mrs Bello." with the reference, and the balance screen shows "A payment of [amount] is waiting to be checked" (AC 6.2.10).
   - Otherwise set `SUCCESS` and `paidAt`.
   - Allocate the amount to unpaid fee items, oldest due date first. Anything left over goes to `unallocatedKobo` and the payment becomes `NEEDS_REVIEW`.
   - Recompute `Entitlement` rows for the student.
   - Write an `AuditLog` row.
7. Return 200 quickly. Flutterwave treats any other status, or a timeout, as a failed delivery. Check the retry rules in Flutterwave's documents.

A late success for a payment already marked `ABANDONED` or `FAILED` still counts. Money received beats a timer.

**When is an extra paid?** An extra counts as paid for a term when the student's fee item for that extra in that term has nothing left to pay (fully allocated, credits included). A part paid bus fee is not paid. The server recomputes `Entitlement` after every successful online payment, every posted payment, every credit and every applied upload. The entitlement runs from the term's start date to its end date.

### 8.7 CSV uploads (the way balances get in)

All amounts are whole naira in the file. The server converts them to kobo. Dates are `YYYY-MM-DD`. `[ASSUMPTION 21]`

| File | Columns | Rules |
|---|---|---|
| `students.csv` | `studentCode, fullName, className` | New codes are added. An existing code only updates name and class. |
| `charges.csv` | `studentCode, termLabel, itemLabel, kind, amountNaira, dueDate, extraCode` | `kind` is one of `TUITION, LEVY, EXAM, BUS, LUNCH, CARRY_OVER, OTHER`. `extraCode` is blank unless the item is bus or lunch. An item that has payments allocated cannot change its amount. The row is rejected, and the bursar must post a credit (section 6.11) instead. |
| `payments.csv` | `studentCode, paidDate, amountNaira, method, bookReceiptNo, note` | `method` is `CASH` or `TRANSFER`. A repeated `(studentCode, bookReceiptNo)` is rejected as a duplicate. Payments are allocated oldest due date first. |

**Apply is all or nothing.** The preview shows counts of new rows, changed rows and error rows. If any row has an error, Apply is disabled and the bursar fixes the file. Applying runs in one database transaction. A student's `ledgerStatus` changes to `LOADED` only after the launch class check (section 6.9) has passed. The date shown to parents is the class's posted up to date, set only by the bursar's daily stamp (section 6.9). An upload does not change it. After Apply, the server recomputes `Entitlement` rows for every student the upload touched.

### 8.8 Reconciliation

Reconciliation means matching two lists that should agree. A person does it. Nothing runs by itself.

| Check | Who and when | What it compares | If different |
|---|---|---|---|
| Gateway against the app | Bursar, every working day | The Reconcile screen asks Flutterwave for the last 7 days of successful transactions and lists any reference that is missing from the app, present in the app but not in Flutterwave, or carries a different amount | A missing reference is a paid but not recorded payment. Fix it the same day and tell the parent. |
| Unprocessed events | Owner, every Friday | `GatewayEvent` rows with no `processedAt`, or with a result other than `SUCCESS` or `IGNORED_DUPLICATE` | Each one is handled by hand |
| Gateway payouts against the bank | Owner, every month | Flutterwave's settlement list against the school's bank statement | Raise with Flutterwave |
| App payments into the paper book | Bursar, every working day | The staff screen lists successful online payments not yet written into the paper book. The bursar writes each one in the book and ticks it. | An unticked payment older than 2 working days shows on the owner screen |
| Book against the app | Owner, every Friday | Paper book total (including payments copied from the app) against app total, plus 5 spot checks. The check cannot pass while copy to book ticks are missing. | See risk 3 |

### 8.9 Offline caching

| Item | Detail |
|---|---|
| App shell | A small service worker caches the pages, styles and scripts. The total download stays under 1 MB. |
| Private data | After sign in, the last loaded balance, fee items and receipts for each linked child are saved in the phone's IndexedDB, with the "posted up to" date. The contact list and the popular question buttons are saved too. |
| Refresh | When the phone is online, each open fetches fresh data and replaces the saved copy. |
| Offline display | Saved data shows with "Posted up to [date]. You are offline." |
| Limits | The saved data never includes shared records other than the popular question list. Nothing from other families. |
| Sign out | Clears the saved data. |
| Protection | The PIN screen is a lock on the screen. It is not a lock on the stored data. The saved data is not encrypted on the device. A person who unlocks the phone and knows how to open the browser's storage tools could read it without the PIN. `[ASSUMPTION 16]` |
| Offline PIN | At each online PIN entry the app saves a salted hash of the PIN on the device. Offline, the PIN is checked against it. 5 wrong tries offline clears the saved data. |

---

## 9. Vector Database Architecture and Design

**What this is.** PostgreSQL with the **pgvector** extension. pgvector is an add on that lets Postgres store embeddings in a column and find the closest ones. There is no separate vector service to run, pay for or keep in step.

### 9.1 What is embedded

Only shared records. Three kinds of chunk are embedded:

| Chunk kind | Text | Why |
|---|---|---|
| `BODY` | The record's title and body text | Matches questions that use the record's own words |
| `QUESTION` | One example question written by staff in a parent's words | Matches how parents actually ask |
| (Refusal and redirect records) | Their example questions, as `QUESTION` chunks | So risky and own-money questions are caught by the same search |

### 9.2 Chunking

- **Decision:** records are short on purpose. The staff screen warns above 120 words.
- A record of 120 words or fewer is one `BODY` chunk with its title in front.
- A longer record is split on paragraph breaks into chunks of at most 120 words, each starting with the title. `[ASSUMPTION 14]`
- Each record has 2 to 5 example questions. Each is its own `QUESTION` chunk.
- The first sentence of every record says who it applies to ("For JSS students", "For all students") so SS and JSS records do not get mixed up.

### 9.3 How visibility filters before ranking

The row rule (section 8.4) is part of every query. Postgres removes hidden rows first, then ranks what is left. A family that has not paid for bus never has the bus times record in the list being ranked, so it can never win. The SQL in section 10.4 repeats the status and date checks as a second guard. It also filters by level scope. That filter helps accuracy and is not a security rule, because shared records are the same for every family.

### 9.4 How retrieval picks a record

1. Embed the question (768 numbers).
2. For each visible record, take its best chunk score.
3. Rank records by that score. Take the top 5.
4. Apply the table in section 7.5.

With a few hundred chunks, the search compares the question to every chunk (an exact search), which takes a few milliseconds and cannot miss.

### 9.5 The similarity threshold

Start at 0.72 for answers and 0.60 for refusals, with a 0.03 margin for showing a second record and a 0.05 margin for refusal ties. Use separate bars for BODY and QUESTION chunks if their scores sit in different ranges. Set the real values with section 7.6 using the school's records. `[ASSUMPTION 13]`

### 9.6 Re-embedding when a record changes

| Event | What happens |
|---|---|
| Staff edits an approved record | The edit creates a new row with `version + 1` and status `DRAFT`. The old version stays live. |
| Owner approves the new version | The server embeds every chunk of the new version. If any embedding call fails, the version stays `PENDING_APPROVAL` and nothing changes for parents. If all succeed, the new version is `APPROVED`, and the old version gets a `validTo` equal to the new version's `validFrom`, so there is no gap and no overlap. Approval is blocked if two approved versions of one `recordKey` would overlap. |
| The embedding model changes | Every chunk is re-embedded in one run. Each chunk stores `embeddingModel`. Never mix models in one search. With about 300 chunks this takes minutes and fits in a free tier. A model retired by Google counts as a change. Re-run the 30 questions and reset the thresholds (section 7.6). |
| A record is retired | Status `RETIRED`. It stops showing. Old receipts and logs still point to it. |

### 9.7 Why private records are never embedded or searched

1. **Wrong family risk.** A search by meaning ranks across rows. A balance question could rank another family's row first. Private records are fetched only by exact student ID, and the row rule blocks all others.
2. **Privacy.** Embedding a record means sending its text to an outside service. A child's name, balance and payments would leave the school's control.
3. **Exactness.** Money must be exact. Search by meaning is approximate by design.
4. **No need.** The parent already tells the app which child. An exact lookup is faster and cannot be wrong.

### 9.8 Size

768 numbers at 4 bytes each is about 3 KB per chunk. 100 records with 4 chunks each is 400 chunks, about 1.2 MB. This is far inside Neon's 0.5 GB free storage.

---

## 10. Vector Database Model

### 10.1 Table definition

Prisma creates this table from the schema. The raw SQL below is the shape it must end up with, and it holds the parts Prisma cannot express.

```sql
CREATE EXTENSION IF NOT EXISTS vector;

-- Created by Prisma from model SharedRecordChunk. Final shape:
-- "SharedRecordChunk" (
--   "id"             text PRIMARY KEY,
--   "recordId"       text NOT NULL REFERENCES "SharedRecord"("id") ON DELETE CASCADE,
--   "kind"           "ChunkKind" NOT NULL,        -- BODY or QUESTION
--   "text"           text NOT NULL,
--   "embedding"      vector(768),                 -- 768 numbers, cosine distance used
--   "embeddingModel" text,
--   "embeddedAt"     timestamptz
-- );
-- A chunk without an embedding is never searched (the query filters IS NOT NULL),
-- and approval is blocked until every chunk of a record has one.
```

Write an embedding with raw SQL:

```sql
UPDATE "SharedRecordChunk"
SET "embedding" = $1::vector, "embeddingModel" = $2, "embeddedAt" = now()
WHERE "id" = $3;
-- $1 is a text like '[0.0123,-0.0441, ... 768 numbers ...]'
```

### 10.2 Index choice

| Size | Index | Why |
|---|---|---|
| Under about 10,000 chunks (all of version one) | **No vector index.** Exact search. | Fast enough, perfect recall, and the row rule filter works exactly. |
| Over about 10,000 chunks | HNSW index (a fast approximate nearest neighbour index) | Only then add it |

```sql
-- Do not run this at launch. Add only past about 10,000 chunks.
CREATE INDEX shared_chunk_embedding_hnsw
  ON "SharedRecordChunk" USING hnsw ("embedding" vector_cosine_ops);
```

If the HNSW index is ever added, an approximate index applied together with a visibility filter can return fewer rows than asked. Re-run the 30 test questions after adding it, and read pgvector's notes on filtering with indexes.

**Vector dimension: 768.** pgvector indexes vectors up to 2,000 dimensions, so 768 leaves room. A smaller list is cheaper to store and faster to compare.

### 10.3 Other indexes

`SharedRecord(status, validFrom, validTo)` and `SharedRecordChunk(recordId)` are in the Prisma schema.

### 10.4 The search query

```sql
-- Runs as role fees_family inside withFamily(guardianId, ...). The row rule has already hidden
-- records this family may not see. The checks below are a second guard.
SELECT r."id"        AS "recordId",
       r."recordKey",
       r."kind",
       r."routeTo",
       r."title",
       r."body",
       r."validFrom",
       r."approvedAt",
       max(1 - (c."embedding" <=> $1::vector)) AS "score"   -- <=> is cosine distance; 1 minus it is similarity
FROM "SharedRecordChunk" c
JOIN "SharedRecord" r ON r."id" = c."recordId"
WHERE c."embedding" IS NOT NULL
  AND r."status" = 'APPROVED'
  AND r."validFrom" <= CURRENT_DATE
  AND (r."validTo" IS NULL OR r."validTo" > CURRENT_DATE)
  AND r."levelScope" IN ('ALL', $2::"LevelScope")   -- $2 is the selected child's level
GROUP BY r."id"
ORDER BY "score" DESC
LIMIT 5;
```

### 10.5 Example rows (sample data, invented)

Records:

| recordKey | kind | visibility | Title | Body |
|---|---|---|---|---|
| `tuition-jss-t1` | ANSWER | EVERYONE | JSS tuition, First Term 2026/27 | For JSS students. Tuition is 85,000 naira for the term. Levies are listed separately. Total with levies is 110,000 naira. |
| `tuition-ss-t1` | ANSWER | EVERYONE | SS tuition, First Term 2026/27 | For SS students. Tuition is 95,000 naira for the term. Levies are listed separately. Total with levies is 120,000 naira. |
| `levies-t1` | ANSWER | EVERYONE | Levies, First Term 2026/27 | For all students. Development levy is 15,000 naira. Exam fee is 10,000 naira. |
| `bus-fee-t1` | ANSWER | EVERYONE | School bus fee | For all students. Bus is 25,000 naira for the term. It is separate from tuition. Pick up points and times are shown to families who have paid for bus. |
| `bus-routes-t1` | ANSWER | PAID_EXTRA (BUS) | Bus pick up times | For families who paid for bus. Ikeja route: 6:30am at the market junction. Agege route: 6:45am at the railway gate. |
| `lunch-fee-t1` | ANSWER | EVERYONE | Lunch fee | For all students. Lunch is 30,000 naira for the term. The weekly menu is shown to families who have paid for lunch. |
| `lunch-menu-t1` | ANSWER | PAID_EXTRA (LUNCH) | Lunch menu | For families who paid for lunch. Monday: rice and stew. Tuesday: beans and plantain. |
| `due-dates` | ANSWER | EVERYONE | Due dates | Fees are due on or before the date printed on the fee slip. |
| `part-payment-rule` | ANSWER | EVERYONE | Part payments | Part payments are accepted. The smallest part payment is 10,000 naira. |
| `bank-details` | ANSWER | EVERYONE | School bank account | Bank: [bank name]. Account name: [school name]. Account number: [number]. Transfers show in the app after the bursar posts them. |
| `payment-methods` | ANSWER | EVERYONE | How to pay | Pay by card or bank transfer in this app, or pay cash to the bursar, who gives a book receipt. |
| `receipt-gate` | ANSWER | EVERYONE | Receipts at the gate | Show the receipt from this app at the gate for exam clearance. |
| `contacts-hours` | ANSWER | EVERYONE | Bursar and owner hours | Bursar Mrs Bello: Monday to Friday, 8am to 3pm. Owner: by appointment. |
| `refuse-sent-home` | REFUSAL (owner) | EVERYONE | Sent home or barred | (Body is never shown.) Questions about a child being sent home or barred from exams. |
| `redirect-balance` | REDIRECT | EVERYONE | My balance | (Body is never shown.) Questions about how much this family owes. |

Level scope: `tuition-jss-t1` is JSS, `tuition-ss-t1` is SS, and every other record is ALL.

Chunks (embedding shown shortened; the real column holds 768 numbers):

| id | recordKey | kind | text | embedding |
|---|---|---|---|---|
| ch_01 | `bus-fee-t1` | BODY | School bus fee. For all students. Bus is 25,000 naira for the term. It is separate from tuition... | `[0.0123, -0.0441, 0.0087, ...]` |
| ch_02 | `bus-fee-t1` | QUESTION | Is bus included in tuition? | `[0.0151, -0.0398, 0.0102, ...]` |
| ch_03 | `bus-fee-t1` | QUESTION | How much is the bus? | `[0.0140, -0.0420, 0.0091, ...]` |
| ch_04 | `tuition-jss-t1` | BODY | JSS tuition, First Term 2026/27. For JSS students. Tuition is 85,000 naira... | `[-0.0211, 0.0302, 0.0155, ...]` |
| ch_05 | `refuse-sent-home` | QUESTION | Will my child be sent home if I do not pay? | `[0.0004, 0.0517, -0.0233, ...]` |
| ch_06 | `redirect-balance` | QUESTION | How much do I owe? | `[0.0291, 0.0010, 0.0344, ...]` |

### 10.6 Worked example

A parent whose family has not paid for bus types: **"is bus fee part of school fees?"**

1. The server trims the text (30 characters, under the limit) and calls the embedding service. It gets 768 numbers.
2. The server runs the query in 10.4 as `fees_family`. The row rule hides `bus-routes-t1` and `lunch-menu-t1`, because this family has no bus or lunch entitlement.
3. The best chunk per record, with illustrative scores (not measured):

| Rank | Record | Best chunk | Score |
|---|---|---|---|
| 1 | `bus-fee-t1` | QUESTION "Is bus included in tuition?" (ch_02) | 0.86 |
| 2 | `tuition-jss-t1` | BODY (ch_04) | 0.74 |
| 3 | `levies-t1` | BODY | 0.66 |

4. The best record is an `ANSWER` record, 0.86 is above 0.72, and no `REFUSAL` record scores 0.60 or more. The second record scores 0.74, which is 0.12 below the first, so only one record shows.
5. The screen shows the record body exactly as stored: "For all students. Bus is 25,000 naira for the term. It is separate from tuition. Pick up points and times are shown to families who have paid for bus." Under it: "From: School bus fee. Approved 14 Sep 2026. Valid from 14 Sep 2026." Under that: the "This looks wrong" button.
6. The server writes a `QuestionLog` row: outcome `ANSWERED`, record `bus-fee-t1`, score 0.86, second score 0.74.

The AI did one thing: turn the question into numbers. Every word on the screen came from the school.

---

## 11. Business Model

### 11.1 Who pays

**The school pays.** Parents pay nothing for the app. Parents pay school fees as before. If they pay online, the gateway fee applies (section 11.3), and by default the school absorbs it.

| The school pays for | Costs the school nothing |
|---|---|
| A one time setup: loading shared records, loading the launch class, training the bursar and owner, writing the test list, opening the payment account, printing the first fee slips | The parent's use of the app |
| A subscription each term | Building and testing on free tiers (section 11.2) |
| The gateway fee on each online payment (default) | |

### 11.2 Cost to run

| Item | Build and test (weeks) | Live |
|---|---|---|
| Vercel | $0 on Hobby (personal, non commercial only) | $20 per month on Pro (one seat). Vercel's pricing page lists commercial use as allowed on Pro. |
| Neon database | $0 on Free | $0 while under the Free limits. Pay as you go after that: $0.106 per compute hour and $0.35 per GB per month, as listed on Neon's page. At this size, under about $2 per month. `[ASSUMPTION 11]` |
| Embedding | $0 on the free tier | $0 if the free tier holds. Check the paid price if it does not. |
| Payment gateway | $0. Flutterwave test mode needs no payment. | Per transaction (below) |
| Domain name (optional) | $0, use the free Vercel address | A few thousand naira a year. I did not check prices. |

**In naira.** The dollar rate changes. At a placeholder rate of 1,500 naira to the dollar, $20 is 30,000 naira per month. Hosting for 3 months is about 90,000 naira. Add about 3,000 to 9,000 naira for the database if it leaves the free plan. **Replace 1,500 with today's rate before you quote the school.** `[ASSUMPTION 19]`

**Who pays and who owns what.** The builder pays for Vercel Pro and any paid Neon or Google usage, so the school's subscription must cover them. The school owns its data and its Flutterwave account. The builder holds the other accounts during the pilot. The agreement says that at its end the builder hands over the code and a full CSV export, or moves the hosting accounts to the school `[ASSUMPTION 35]`.

### 11.3 The gateway fee

**Free to build with:** Flutterwave's test mode lets you build and test the whole payment flow with no money moving. One source says test mode opens straight after signup, before business verification. I found no monthly fee or setup fee in the pages I read. I did not confirm either point in Flutterwave's own documents. Confirm both when you open the account.

**Live cost per transaction (Nigeria, local cards).** I found two different rates and could not settle them. I could not open Flutterwave's own Nigeria pricing page in this session.

| Source | Local card rate | Cap |
|---|---|---|
| Older published rate, repeated by some 2026 blog posts | 1.4%, no flat fee | Some sources report a 2,000 naira cap. Others do not. |
| A June 2026 article (updated August 2026) and a software directory | 2.0% in total: 1.4% plus a 0.6% platform fee added in April 2025 | Unclear whether the 2,000 naira cap still applies |

**Planning decision:** use 2.0% until Flutterwave confirms in writing. It is the safer number. I found no fee for bank transfer or USSD, and no Nigeria VAT rate (one page says VAT may be added). Settlement is reported as the next working day.

The school absorbs the fee by default. These are the amounts:

| Payment | 1.4%, no cap | 2.0%, no cap | 2.0%, capped at 2,000 |
|---|---|---|---|
| 50,000 naira | Fee **700**. The school receives 49,300. | Fee **1,000**. The school receives 49,000. | Fee **1,000**. The school receives 49,000. |
| 150,000 naira | Fee **2,100**. The school receives 147,900. | Fee **3,000**. The school receives 147,000. | Fee **2,000**. The school receives 148,000. |

If a 2,000 naira cap also applies to the 1.4% rate, the fee on 150,000 naira is 2,000, not 2,100.

**If the school passes the fee on:** I found no Flutterwave setting that adds the fee for you. The app would compute the total itself as price divided by (1 minus the rate). At 2.0% with no cap, a 50,000 naira payment becomes 51,021 naira (rounded up). If the rate in the app is wrong, the school is short. This is a reason to keep the default that the school absorbs the fee.

**Part payments.** With a percentage only fee, five payments of 20,000 naira cost the same total as one payment of 100,000 naira (2,000 naira at 2.0%). If Flutterwave adds a flat fee, parts cost more. If a cap applies, one large payment costs less than many small ones. Check the contract.

> **Problem Found: I could not confirm Flutterwave's current Nigeria fee.** Sources disagree (1.4% against 2.0%). None I could read said whether a 2,000 naira cap applies. I found no special rate for schools. **Ask Flutterwave in writing for:** the local card rate, any platform fee, whether a cap applies, the bank transfer and USSD fees, whether VAT is added, and whether schools or high volume merchants get a lower rate. Do not quote the school a gateway cost until you have the answer.

**Who absorbs the fee.** **Decision (default):** the school absorbs it, so the parent pays exactly the fee on the slip. `[ASSUMPTION 4]` The app shows the exact total before the parent taps Pay. If the school chooses to pass the fee on, the app shows the higher total plainly. Surprise charges are what break trust.

### 11.4 When the free tiers would run out

| Resource | Estimate for one school of 400 students | Runs out when |
|---|---|---|
| Neon storage (0.5 GB) | About 400 students times 60 rows a term times about 200 bytes is 5 MB a year. Logs add about 10 MB a year. Records add about 1 MB. | Many years |
| Neon compute (100 hours a month) | Depends on how long the database stays awake. It sleeps after 5 minutes idle. I could not measure this. | Possibly during term start weeks. Check the usage page every Friday. |
| Embedding calls | Typed questions plus popular buttons that cost nothing. Estimate 3,000 to 10,000 typed questions a term. | Unknown. Check the limit in Google AI Studio. |
| Vercel Hobby | Not allowed for commercial use at all | The day the school pays you |

### 11.5 A pricing approach `[ASSUMPTION 20]`

**Recommendation** (you decide):

| Item | Price | Why |
|---|---|---|
| Setup, once | 100,000 naira | Covers your time to load records, train staff, run the test list and set up the payment account |
| Subscription, per term, per school up to 400 students | 150,000 naira | Hosting is about 90,000 to 99,000 naira per term at the placeholder rate. About 50,000 to 60,000 naira is left to pay for your support. |

This is thin. You are being paid for support, not for software. The costs are in dollars and the price is in naira. If the naira falls, the margin shrinks, so put a price review in the agreement every term, tied to the dollar rate on the invoice date. The bursar now has more daily work, and so will you. Treat the first term as a paid pilot and write down your own support hours. An illustration with invented figures: a school with 300 students and 110,000 naira fees per term collects 33 million naira a term. If 15 more percent of that arrives on time, about 5 million naira reaches the school earlier. A 150,000 naira fee is a small part of that. Use the school's real numbers in the pitch.

### 11.6 If it is later sold to many schools

**Recommendation:** one database per school. Neon's free plan allows many projects, and a separate database is the strongest wall between schools. A school's records can then never be in the same table as another school's. The app reads a small school settings table (by web address) to pick the right database and the right Flutterwave account. Each school owns its Flutterwave account, so no school's money passes through you. Review this at 5 schools. Moving to one shared database with a `schoolId` on every table is possible, but then every row rule needs a school check as well. Do not do it early.

---

## 12. Success Metrics

**The baseline is unknown.** Nobody has counted. For one week before launch, the bursar keeps a paper tally sheet at the desk. Each day, mark a line for every call, visit or message asking "how much do I owe" or "did you receive my payment", with the pilot class's parents separate. In the same week, the bursar counts from the paper book what share of the pilot class's fees were paid by the due date last term. Pick a week that matches the launch week of the term, so the season does not distort the comparison. On the same sheet, the bursar writes down the words of each real question parents ask (section 7.7).

| # | Metric | How it is measured | Baseline | Target (pilot class, first term) `[ASSUMPTION 1]` |
|---|---|---|---|---|
| 1 | Share of guardians who opened the app in the term | Count of guardians with an `AppOpen` row, divided by all guardians linked to the pilot class (not only those who activated) | Not applicable | 70% or more by week 4 |
| 2 | Drop in "how much do I owe" calls and visits | The bursar's tally sheet, weekly | Measured in the baseline week | Down 50% or more by week 6 |
| 3 | Share of fees paid before the due date | Paper book last term against the app's paid dates this term, same class, and the same measure for one comparison class that does not use the app this term. The app gets credit only for the gap between the two. | Last term, from the paper book, for both classes | Up 15 percentage points more than the comparison class |
| 4 | "This looks wrong" taps per 100 answers | `Flag` rows of kind `LOOKS_WRONG` divided by answered `QuestionLog` rows, times 100 | Not applicable | Under 5, and every one reviewed within 2 working days |
| 5 | Wrong answer rate on the test list | Owner screen Test run | Not applicable | 0 of 30 wrong, every run |
| 6 | Time from a cash payment to the app showing it | `postedAt` minus the date written on the bursar's book receipt | Not applicable | 1 working day or less for 95% of payments |
| 7 | Questions with no answer | `QuestionLog` outcome `NO_ANSWER` share, weekly | First month sets the baseline | Falling every month as records improve |
| 8 | Payments taken but not recorded | Reconcile screen, count of references missing from the app | Not applicable | 0 left open after one working day |
| 9 | Cross family exposures | Incident log plus the cross family test | Not applicable | 0 |
| 10 | Freshness of the book | Share of working days with a "posted up to" stamp | Not applicable | 90% or more |
| 11 | Bursar time on the app | The bursar's weekly tally of minutes spent posting, stamping, copying, exporting and answering flags | Not applicable | 3 hours a week or less for the pilot class. Above 5 hours means stop and redesign `[ASSUMPTION 36]` |

---

## 13. Risks

Ordered by how bad it is if it happens, not by how likely it is. Risks 6 and 7 are the most likely. Risk 6 feeds Risk 3.

### Risk 1: Another family's record is shown

| | |
|---|---|
| **Cause** | A guardian linked to the wrong student (the bursar mistypes a code). A bug that uses the `fees_system` database role for a parent request. Saved data left on a shared phone. A stolen phone with a known PIN. |
| **Damage** | A stranger sees a child's name, fees and payments. Trust ends and the school may drop the app. The school has duties under data protection law. |
| **Prevention** | The database row rule (section 8.4). Parent requests can only use the `fees_family` role. The cross family test runs before every release. The link screen shows "Link Mrs X (phone ending 123) to Chidi Adebayo, JSS2. Is this right?" and the owner sees new links each Friday. Sign out clears the phone's saved data. The bursar can revoke sessions. Two guardians per student at most. |

### Risk 2: A payment is taken but not recorded

| | |
|---|---|
| **Cause** | The webhook fails (server down, a signature bug, a gateway outage). The parent closes the browser before returning. The amount does not match. A duplicate reference. |
| **Damage** | The parent is out of pocket and the school is accused of keeping the money. |
| **Prevention** | The webhook is the only source of truth. On the next open, the server checks any `PENDING` payment older than 5 minutes directly with Flutterwave. The bursar's daily reconcile (8.8). Unprocessed events appear on the owner screen. The reference is shown on every pending screen, with the named person. Late successes still count. A duplicate message is skipped only if the first one finished. A stored but unprocessed event is processed again. A failed verify call returns a 500 so Flutterwave retries, if retries are switched on. Flutterwave's retries are few, so the "Check this payment" button and the daily reconcile recover anything they miss. |

### Risk 3: A stale or wrong balance is shown with confidence

| | |
|---|---|
| **Cause** | The bursar posts payments late. A typing error from the paper book. Offsetting errors hide inside a matching Friday total. An upload applied twice. An offline screen read as current. |
| **Damage** | A child is sent home over a balance that is wrong. A parent underpays. Disputes the owner must settle. |
| **Prevention** | The posted up to date on every figure, with a warning after 3 working days without a stamp. "Not loaded yet" instead of zero. The paper book wins and the app says so. The launch class is checked line by line by two people. The Friday total plus 5 spot checks. Uploads are all or nothing and reject duplicate receipt numbers. Offline screens say "You are offline". Target: cash posted the same working day. |

### Risk 4: A wrong or out of date shared record is shown with the school's approval

| | |
|---|---|
| **Cause** | A fee changes and the record is not updated. The owner approves without reading. The search returns a related record, such as SS tuition for a JSS question. |
| **Damage** | A parent pays the wrong amount. A quarrel about what the school "said". |
| **Prevention** | Owner approval. `validTo` dates. Every answer shows the record title, approval date and valid from date. The first sentence of every record says who it applies to. The test list. The "This looks wrong" button. Old versions are retired, not edited. |

### Risk 5: Free tier or vendor trouble on the busiest day

| | |
|---|---|
| **Cause** | Neon compute limit reached. A slow wake up. The embedding quota used up at term start. A Flutterwave account review or settlement hold. Vercel terms. |
| **Damage** | The app is down on the day parents most need it. They go back to queues. Payments are confused. |
| **Prevention** | Popular question buttons that need no embedding call. A weekly look at Neon usage. The paid plans decided before term starts. Apply for the live Flutterwave account 3 weeks early. The paper book and the bursar's desk stay open as before. |

### Risk 6: The bursar stops posting daily

| | |
|---|---|
| **Cause** | The bursar's work grows: paper book, daily posting, the daily stamp, copying online payments into the book, flags, the Friday export. A busy week, illness or a holiday breaks the habit. |
| **Damage** | Balances go stale (Risk 3), online payments are missing from the paper book, and parents lose trust within a term. |
| **Prevention** | The daily stamp and the stale warning make a missed day visible to parents and to the owner. Metrics 10 and 11 measure it. The pilot class stays at about 40 students. A named backup (the owner or an admin clerk) can post and stamp. Pay stays off until the bursar has kept the habit for 2 weeks (section 5). |

### Risk 7: Parents do not open it

| | |
|---|---|
| **Cause** | No reason to open it outside payment weeks, no smartphone, a forgotten PIN, or an in-app browser that cannot install the app. |
| **Damage** | The school does the work and sees none of the benefit. Metrics 1 to 3 do not move. |
| **Prevention** | The school's gate rule (receipt shown from the app, section 14 question 11). The code and QR on the fee slip. A printed statement for parents without a smartphone. The Open in Chrome banner (AC 6.12.3). A smartphone count before launch (question 19). |

---

## 14. Open Questions

Every open question has a default already built in. Change any default and the PRD changes with it.

| # | Question | Default used in this PRD | Who answers |
|---|---|---|---|
| 1 | How many students does the school have? | 400 or fewer. Pilot class of 30 to 40. | Owner |
| 2 | Who types the balances, and how many hours a day? | The bursar, about 1 hour a day for the pilot class. This will not stretch to the whole school without more help. | Bursar |
| 3 | Do students already have IDs? | No. The app creates student codes like `JSS2-014`. | Bursar |
| 4 | What is the school's policy when someone stops paying? | Balance and receipts are never hidden. Only the detail of paid extras (bus times, lunch menu) stops showing. | Owner |
| 5 | What happens with part payments? | Accepted. Minimum 10,000 naira. Applied to the oldest unpaid item first. | Owner |
| 6 | Who pays the gateway fee? | The school. | Owner |
| 7 | Which Flutterwave rate does the school get, is there a cap, and is VAT added? | Planning rate of 2.0% with no cap. Ask Flutterwave in writing (section 11.3). | Owner |
| 8 | Is this for one school or many? | One school now. One database per school if more come. | You |
| 9 | Which language do parents read? | Plain English, short sentences. | Owner |
| 10 | What are the bursar's and owner's hours, and how fast do they reply? | Bursar Monday to Friday 8am to 3pm. Owner by appointment. Both agree to reply within 1 working day. | Bursar, owner |
| 11 | Will the school accept the in-app receipt as proof of payment at the gate? | Yes. Without this, parents have no reason to open the app outside payment weeks. | Owner |
| 12 | Does the school have the business papers the payment account needs? | Unknown. Ask now. | Owner |
| 13 | Will the owner accept that parents' typed questions go to Google's embedding service, and accept its free tier terms? | Needs a written yes (section 7.3). | Owner |
| 14 | What is the real dollar rate to use for hosting costs? | 1,500 naira per dollar placeholder. | You |
| 15 | Which hosting will you use after the build? | Vercel Pro. | You |
| 16 | What are the real fees, rules and extras for the shared records? | Invented samples (section 10.5). | Bursar, owner |
| 17 | Is a 4 digit PIN good enough for the school? | Yes, with the lock rules. | Owner |
| 18 | Does the school want the Friday spot check to be 5 students, or more? | 5. | Owner |
| 19 | How many parents in the pilot class have an Android smartphone? | Most do. Count in the baseline week. Others get a printed statement. | Bursar |
| 20 | Will the bursar and owner publish their own WhatsApp numbers, or does the school have a shared line? | Personal numbers, with written consent. | Bursar, owner |
| 21 | Who will own the Vercel, Neon, Google and Flutterwave accounts during the pilot and after it? | The builder holds Vercel, Neon and Google. The school owns Flutterwave. Handover terms are written down (section 11.2). | You, owner |
| 22 | Is there a comparison class that will not use the app this term? | Yes, one class of similar size. | Owner |
| 23 | Where may the school store children's data, and who writes the privacy notice? | Nearest Neon and Vercel regions to Lagos. The school's lawyer approves a notice the builder drafts. | Owner |
| 24 | Which week of the term is the baseline week? | The week that matches the launch week of the term. | Bursar |
| 25 | Who may post credits, and does the owner sign off above an amount? | The bursar posts. The owner sees every credit on the Friday list. | Owner |

---

## Assumptions Added

**Check these first.** If any of these is wrong, the build changes: 4 (who pays the gateway fee), 9 (Flutterwave), 41 (its webhook and lookup details), 10 and 11 (hosting), 12 (embedding model), 20 (pricing), 36 (bursar time), 37 (launch gates).

| # | Assumption | Reason | Section |
|---|---|---|---|
| 1 | Goal targets (70% open, 50% fewer calls, 15 points more on time, under 5 taps per 100) | You asked for measurable goals. These are guesses until the baseline week is measured. | 3, 12 |
| 2 | The app asks for the PIN again after 5 minutes in the background. Lock rules in AC 6.1.2 and rate limits in AC 6.1.3. | A shared phone is common. This protects it at low cost. | 6.1 |
| 3 | Minimum part payment is 10,000 naira, except when the payment clears the whole balance. | Each part costs the school a gateway fee (section 11.3). A parent with a small balance must still be able to pay. | 6.5, 8.4, 11.3 |
| 4 | The school pays the gateway fee. | A parent seeing a surprise charge breaks trust. | 6.5, 11.3 |
| 5 | Part payments go to the oldest unpaid item first. | This is your stated default, listed again as you asked. | 6.5, 8.6 |
| 6 | The staff screen uploads CSV files and does not read a spreadsheet directly. | This is your stated default, listed again as you asked. | 6.11, 8.7 |
| 7 | Access codes are 8 characters, single use, and expire after 30 days. | A code left on a slip should not work forever. | 8.5 |
| 8 | Staff sign in with email and password, with no two step sign in in version one. | Keeps version one small. The owner account is the weakest point. Add two step sign in in version two. | 8.5 |
| 9 | Flutterwave is the payment gateway, and each payment uses a placeholder email address. | You chose Flutterwave. Its checkout needs a customer email. | 8.1, 8.6 |
| 10 | The app is hosted on Vercel, Hobby for build and test, Pro for live. | Hobby forbids commercial use. | 8.1, 8.2, 11.2 |
| 11 | Neon Free is the database host. | It does not pause for a week and need a manual restart, as Supabase Free does. | 8.1, 8.2, 11.2 |
| 12 | The embedding model is a Google Gemini embedding model, cut to 768 numbers. | It has a free tier and a 768 size fits pgvector's index limit. I could not read the exact free limits. | 7.3, 10.1 |
| 13 | Starting thresholds are 0.72 (answer), 0.60 (refusal), 0.03 (show a second record), 0.05 (refusal wins a tie). There is no vector index at launch. | These are guesses until section 7.6 sets them. An exact search is correct at this size. | 7.5, 9.5, 10.2 |
| 14 | Records are at most 120 words per chunk, with 2 to 5 example questions each. | Short records give clean matches and short screens on slow phones. | 9.2 |
| 15 | Typed questions are limited to 200 characters and 20 a day per guardian. The screen warns parents not to type names, phone numbers or account numbers. | Protects the free embedding limit and parents' privacy. | 7.3, 7.4 |
| 16 | Saved data on the phone is protected by the PIN screen and is not encrypted. | Encrypting it adds work and can fail on cheap phones. | 8.9 |
| 17 | Every `charge.completed` message is double checked with Flutterwave's verify call. | A forged message is a real attack on a payment system. | 8.6 |
| 18 | Payment waiting screen: check every 5 seconds for 60 seconds. One direct check with Flutterwave after 5 minutes. `PENDING` becomes `ABANDONED` after 30 minutes. | These are normal values. Nothing runs by itself in the background. | 6.7 |
| 19 | The dollar rate is a placeholder of 1,500 naira. | I do not have today's rate. | 11.2 |
| 20 | Setup price 100,000 naira and 150,000 naira per term for up to 400 students. | A starting point that covers hosting plus some support. | 11.5 |
| 21 | CSV layouts as written, and Apply is all or nothing. | A half applied upload is worse than a rejected one. | 8.7 |
| 22 | The launch class is checked line by line by two people, and the Friday check adds 5 spot checks. | The total alone can hide offsetting errors. | 8.4 |
| 23 | Two database roles, `fees_family` and `fees_system`. | Lets the database, not the app code, protect parents' data. | 8.4 |
| 24 | The Ask screen shows the 8 most asked approved questions as buttons. | Cheaper, faster, and easier to use than typing on a cheap phone. | 6.4 |
| 25 | Money is stored as whole kobo in integers. Term labels look like `2026/27 T1`. | No rounding mistakes. | 8.4 |
| 26 | Nigeria's data protection law applies to the school. A consent line is shown after the first PIN. | The app holds children's and money records. I am not a lawyer. The school should confirm with one. | 8.5 |
| 27 | The sample names and figures (Mrs Bello, Mrs Adebayo, all prices, due dates, bus routes) are invented. | There are no real records yet. | Throughout |
| 28 | Some parents have no smartphone. The bursar gives them a printed statement, outside the app. | Coverage is unknown until counted. | 4, 14 |
| 29 | Attempt limits count per phone number and per access code. The network address limit is 200 an hour. | Many phones share one address on mobile networks. | 6.1 |
| 30 | Speed target: readable in 5 seconds first visit and 2 seconds repeat, on Slow 4G with a 4 times CPU slowdown. | A guess for cheap phones. Retest on a real phone. | 6.12 |
| 31 | Record chunks use the embedding document setting and questions use the query setting. Test the other pairing. | Pairing affects scores. | 7.3, 7.6 |
| 32 | Vercel and Neon regions are chosen close to Lagos. The school accepts storing children's data offshore after taking advice. | A far region slows slow phones. Data law applies. | 8.1 |
| 33 | Prisma options in the schema may differ in the installed version. The coding tool checks the docs and pins the version. | Prisma changes between versions. | 8.4 |
| 34 | The webhook handler stays minimal because the hosting plan's function time limit was not checked. | Avoids timeouts. | 8.6 |
| 35 | The school owns its data. The builder holds hosting accounts and hands over code and an export at the end. | Exit must be possible. | 11.2 |
| 36 | The bursar's time target is 3 hours a week for the pilot class. | A guess. Measure in the pilot. | 3, 12 |
| 37 | Pay is off at launch and turns on after three gates. | Pay carries the most risk. Reading features prove the records first. | 5, 6.5 |
| 38 | A balance screen shows a stale warning after 3 working days without a stamp. | A guess for a normal school week. | 6.9 |
| 39 | The device cookie lasts 90 days. PIN is asked again after 5 minutes away. Staff sessions last 12 hours. | Balances sign in often enough without annoying parents. | 6.1, 8.5 |
| 40 | The keyword guard starts with a short list of phrases and the owner adds more from the weekly log. | The search alone can miss risky wording. | 7.4 |
| 41 | The Flutterwave details in 8.6 (the webhook signature check, the `charge.completed` event, the verify call, the lookup by `tx_ref`, the 3 retries) come from third party pages that sometimes disagree. The coding tool confirms each one in Flutterwave's own documents for the API version it uses. | I could not open Flutterwave's developer documents in full. A wrong signature check would either reject real payments or accept forged ones. | 8.6 |

---

## Answers I Need From You First

1. **How many students are in the pilot class, how many of their parents have an Android smartphone, and who will type, stamp and copy payments each day (how many hours)?** The pilot plan depends on this.
2. **Will the school accept the in-app receipt as proof of payment at the gate?** Without this rule, expect very few opens outside payment weeks.
3. **Which Flutterwave rate does the school get (1.4% or 2.0%, with or without a 2,000 naira cap), is VAT added, and does the school have the business papers to open a live account?** This changes the money the school keeps on every large payment, and it takes weeks to set up.
4. **What is the school's policy when a family stops paying, and what is the smallest part payment it will accept?** My defaults are in section 14.
5. **Will the owner accept that parents' typed questions go to Google's embedding service under its free tier terms, and who will pay for hosting once the school is live?** The first is a written yes. The second decides whether the build stays on free tiers or moves to Vercel Pro.

---

## Review Changes Applied

A section by section review of version 1 found 27 lapses. All are fixed above. This table shows where.

| # | Severity | Lapse found in version 1 | Fixed in |
|---|---|---|---|
| 1 | Critical | A duplicate payment message was skipped even when the first attempt had failed, so a payment could be lost | 8.6, 13 |
| 2 | Critical | Online payments were never copied into the paper book, so the Friday total could not be trusted | 6.11, 8.4, 8.8 |
| 3 | Critical | A per student "as at" time could not tell "nothing changed" from "nothing was posted" | 6.2, 6.9, 8.4 |
| 4 | Critical | Risky and own-money questions were caught only by fuzzy search, with one shared threshold | 7.4, 7.5, 7.6, 9.5 |
| 5 | Critical | Paid extras ignored the term, and "paid" was never defined | 6.4.3, 8.4, 8.6 |
| 6 | Critical | A PIN alone could not identify a parent, and the offline PIN check could not work | 6.1, 8.5, 8.9 |
| 7 | High | Money received but not yet checked was not shown on the balance screen | 6.2.10, 6.3.1, 8.6 |
| 8 | High | A pending payment could lock the parent out for up to 30 minutes | 6.5.5 |
| 9 | High | The minimum part payment blocked small balances, and a parent could not pay one item | 6.5.1, 6.5.6 |
| 10 | High | There was no way to record a credit or a correction | 6.3.6, 6.11, 8.4, 8.7 |
| 11 | High | A failed verify call and the function time limit were not handled | 8.6 |
| 12 | High | Payment flags waited for the owner's Friday review | 6.6.5, 6.11 |
| 13 | High | No backup, no export, no data ownership terms | 6.11, 8.2, 11.2 |
| 14 | High | Wrong adoption denominator, no comparison class, baseline timing, test list written by the record author | 3, 7.7, 12 |
| 15 | High | Thin margin, dollar costs against a naira price, unclear account ownership | 11.2, 11.5, 14 |
| 16 | High | Bursar workload was not sized, and Pay launched with everything else | 4, 5, 6.5.10, 12, 13 |
| 17 | Medium | Staff sessions were missing from the schema | 8.4, 8.5 |
| 18 | Medium | Network address limits would lock out parents on shared mobile networks | 6.1.3, 8.4 |
| 19 | Medium | Re-embedding left a gap in record dates and did not check overlap | 9.6 |
| 20 | Medium | Embedding settings and model retirement were not handled | 7.3, 7.6, 9.6 |
| 21 | Medium | JSS and SS records could not be told apart by meaning | 6.4.12, 8.4, 10.4 |
| 22 | Medium | Prisma options were written as fact without a version check | 8.4 |
| 23 | Medium | The app open record went through the family role and its row rules | 8.3, 8.4 |
| 24 | Medium | Parents without smartphones and low adoption were not in the risks | 4, 13, 14 |
| 25 | Medium | No speed test on a cheap phone and no handling of in-app browsers | 6.12 |
| 26 | Medium | Region, offshore storage, privacy notice and publishing staff numbers were not decided | 8.1, 8.5, 14 |
| 27 | Medium | The problem scene's root cause, the teacher's stale list, was not addressed | 2, 14 |
