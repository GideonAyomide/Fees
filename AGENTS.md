# Fees

Source of truth: Fees-PRD-v2-Flutterwave.md. Read the PRD section for a feature before you change that feature.

## Description
Fees is an installable web app that a school gives to its own parents. It shows each family its own balance and receipts, answers fee and rule questions from the school's approved records, takes payment through the school's own Flutterwave account, and hands the parent to a named staff member when the records have no answer. It is a retrieval system over the school's own records and nothing else, and nothing it says comes from the internet.

## Who uses it
- Parent: the only app user. Opens the app about 6 to 8 times a term. Has an inexpensive Android phone, buys data in small bundles, has unreliable power, and has nobody technical to help. Reads English if sentences are short. Up to two guardians can be linked to one child. Both see the same balance and payments for that child.
- Bursar: staff, not an app user. Uses internal screens to upload the ledger, post payments, stamp the "posted up to" date, copy online payments into the paper book, issue access codes, post credits and export data. Parents see the bursar as the named contact for money questions.
- Admin staff: not an app user. Drafts shared records on an internal screen. Parents never see them.
- Owner: not an app user. Approves shared records, runs the Friday check, and reads flagged and unanswered questions. Parents see the owner as the named contact for disputes and special arrangements.
- Payer: the school pays for the app. Parents pay nothing for the app.

## One thing that the agent must do well
Show a parent only what the school's own records say, and only that parent's own private records.
- Private records are fetched by exact student ID. They are never searched by meaning. They are never searched across customers.
- The database itself must refuse other families' rows. A check in app code alone does not meet this rule.
- Private records are never embedded and never sent to any AI service.
- The AI only helps pick which shared record to show. It never writes, rewords, shortens or calculates answer text or money figures.
- When no record answers, the app says "The school's records do not have this." and shows one named person. It never guesses.
- A balance that is not loaded shows "Not loaded yet". It never shows zero.

## Defined scope for the MVP
Five customer features. There is no sixth.
1. What do I owe: balance, line items, due date, and the "posted up to" date. Read from private records.
2. My receipts: every payment with date, amount and reference. Readable offline.
3. Ask the school: fee and rule questions answered from approved shared records. Shows the record's own text, title and approval date.
4. Pay: full or part payment through Flutterwave. Shows the exact total first. A payment counts only after the gateway's confirmation reaches the server and passes checks. The phone saying "success" counts for nothing.
5. Talk to a person: one button to call or message the right named person. It is also the "this looks wrong" button.

Also in the MVP:
- Sign in with phone number and PIN. The access code printed for the parent only activates the account.
- Installable web app with an offline view of the last loaded balance and receipts.
- Internal screens for staff and owner. They are input, not features. PRD section 6.11 lists them.
- Pilot first: one class, then the school.
- Launch order: Pay is off at first. The owner turns it on after three gates listed in PRD section 5.
- Collect the data that version two needs. PRD section 5 lists it.
- Success is measured by the metrics in PRD section 12. Two must be zero: cross family exposures, and wrong answers on the test question list.

## Not in scope items for the MVP
- Reminders, SMS, and WhatsApp or email sent by the app. No automated messages, no follow ups.
- Agents of any kind.
- Automatic late fees, instalment plans, and discount or waiver rules.
- Refunds.
- Results, report cards, timetables, and chat with teachers.
- A Play Store app.
- More than one school.
- Languages other than plain English.
- Free-text AI answers. No language model writes any answer.
- A sixth customer feature.
- Replacing the paper book. It stays the legal record.
- Holding any money. The school owns the gateway account.
- Named in the PRD as later work: reminders (version two), two step sign in for staff (version two), one database per school if more schools come.

## Stack
Fixed:
- Next.js with TypeScript. App Router. Route handlers for the API. Server rendered text pages. No heavy client libraries.
- Prisma. Prisma cannot read or write the vector column type, so use raw SQL for vectors, row rules and the payment transaction.
- PostgreSQL with the pgvector extension. There is no separate vector service.
- Flutterwave Standard checkout for payments. Test mode is used to build.
- Gemini free tier for embeddings only. A language model is held in reserve and is not used in version one.

Set by the PRD as assumptions, not fixed: Vercel hosts the app and Neon hosts PostgreSQL.

Facts to follow:
- Money is stored as whole kobo in integers. Flutterwave amounts are in naira, so convert before sending and after reading.
- Times display in West Africa Time.
- App text is plain English in short sentences.
- Parent screens are text only. No images except the app icon.
- The installable app uses a web app manifest and a small hand written service worker.
- The PRD says to read the docs for the installed Prisma version and pin that version in package.json.
- The PRD marks the Flutterwave webhook signature check, the event name, the verify call and the lookup by reference as unconfirmed. Confirm each in Flutterwave's own documents before you code it.
- Gemini free tier limits and data terms are unconfirmed in the PRD. Check them in Google AI Studio.
- Secret keys live only in environment variables.

## Folder map
The PRD gives no full folder layout. These are the only paths the PRD names:
- AGENTS.md: this file, in the project root.
- Fees-PRD-v2-Flutterwave.md: the PRD. Its location in the repo is not stated in the PRD.
- rules/: to be created. Holds the rules files listed below.
- lib/db-family.ts: the only way a parent request reaches the database.
- prisma.config.ts: holds the migration connection setting in Prisma 7. Its location is not stated in the PRD.
- migrations/0002_row_rules.sql: hand written row rule migration.
- package.json: pins the Prisma version.
- Route /api/webhooks/flutterwave: receives the gateway's payment confirmation.
- Page /pay/waiting: the screen a parent returns to after checkout.

## How to work in this codebase
- Make one change at a time. Finish it, show it, then wait.
- Ask before adding any package.
- Never touch the database. Do not run any command that connects to one. This includes migrations and seeds.
- List your assumptions at the end of every response.
- Stop and ask when the PRD is silent about anything. Do not guess.
- Read the PRD section and the rules file for a feature before you change it.
- If a change adds a table, say that the row rule step must be re-run. Do not run it.
- Say in your response when the PRD requires the cross family test before a release.
- Say in your response when a change to shared records or matching settings requires the 30 question test list to be re-run.
- Every change made on a staff or owner screen writes an audit log entry.

## Where the detailed rules live
These files do not exist yet and the PRD does not name them. Create them from the PRD sections shown. Until a file exists, read those PRD sections.
- rules/database.md: tables, fields, row rules, the vector table, balance calculation. PRD 8.4 and 10.1 to 10.4.
- rules/ai-pipeline.md: embedding, matching, thresholds, keyword guard, refusals, test list. PRD 7, 9, 10.4 to 10.6.
- rules/payments.md: Flutterwave flow, webhook steps, reconciliation, gateway fees. PRD 8.6, 8.8, 11.3.
- rules/auth.md: sign in, PIN, sessions, attempt limits, offline PIN. PRD 6.1, 8.5, 8.9.
- rules/screens.md: parent and internal screens, acceptance criteria, exact wording. PRD 6.
- rules/ledger-upload.md: CSV layouts, apply rules, the posted up to stamp. PRD 6.9, 8.7.
- rules/env-and-hosting.md: environment variable names, hosting limits, regions. PRD 8.1, 8.2, 8.4.

## Definitions
- Shared record: the same for every family. May be searched by meaning. Has dates and an owner approval. Visible to everyone, or only to families who paid for that extra.
- Private record: belongs to one family. Balance, fee items, payments, receipts. Fetched by exact student ID only.
- Extra: an optional paid item such as bus or lunch. It counts as paid for a term when its fee item for that term has nothing left to pay.
- Chunk: a piece of a shared record that is embedded. It is either record text or one example question written in a parent's words.
- Embedding: a list of numbers that stands for the meaning of a piece of text.
- Cosine similarity: a score of how close two embeddings are. A score near 1 means very similar meaning.
- pgvector: a PostgreSQL add on that stores embeddings and finds the closest ones.
- Row rule: PostgreSQL row level security. The database hides rows a role may not see, even if app code has a bug.
- Webhook: a message the payment gateway sends to your server when something happens. The server trusts it only after checking it.
- Posted up to: the date the bursar stamps to say the paper book is entered up to that day. Only the bursar sets it.
- Not loaded yet: the state of a student whose balance the bursar has not loaded and checked. No figures show.
- Credit: a scholarship or correction posted by the bursar. It reduces the balance and is not money received.
- Named person: the bursar for money questions, the owner for disputes, waivers, special arrangements, a child being sent home, and anything legal. Exactly one name is shown.
- Keyword guard: a plain code check with no AI, run before any embedding call. The owner edits its phrase list.
- Level scope: which students a shared record applies to: all, JSS or SS. The PRD does not expand JSS or SS.
- Reconciliation: matching two lists that should agree. A person does it. Nothing runs by itself.
- Paper book: the school's own ledger. It is the official record. If it disagrees with the app, the book wins and the app says so.
- Free tier: a no-cost plan of a provider. The PRD says free is true for building and testing, not for running a live business app. The PRD defines no customer tiers.
