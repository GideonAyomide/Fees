---
trigger: model_decision
description: Ask the school flow: keyword guard, embeddings, similarity search, outcome table, refusal topics, question logging. Use when working on Ask the school, shared records search, or embedding code.
---

# ai-pipeline.md
Job: how a typed question becomes a record, a redirect or a refusal. PRD 6.10, 7, 9, 10.4 to 10.6.
Not here: exact screen wording (screens.md), table access (database.md).

## What the AI may do
1. The AI makes embeddings and nothing else. It never writes, rewords, shortens, adds to, calculates or compares an answer or a money figure. Why: a rewritten fee rule can change a number or drop a condition.
2. The answer is the record's own text, word for word, with its title, approval date and valid from date. Never shorten it. Why: the school approved those exact words.
3. Send only the parent's typed question to the embedding service. Never send a name, balance, payment or any private record. Why: private records never leave the database.
4. The reserve language model stays off in version one. Why: with no model reading the question, a hidden instruction in it has no effect.

## One question, in this order
5. (a) Trim the text. Check the length and the daily count. Run the keyword guard. A guard match ends the flow. (b) Embed the question with the retrieval query setting. (c) Run one SQL search as `fees_family`. Take the top 5 records by each record's best chunk score. (d) Apply the outcome table below. (e) Write one QuestionLog row. Show the result with the "This looks wrong" button. Why: the guard runs before any embedding call, so risky questions never reach Google.
6. Limits: 200 characters per question and 20 typed questions per guardian per day. Why: it protects the free tier on a busy day.
7. The keyword guard is plain code with no AI. The owner edits its phrase list. Risk phrases end in a refusal (for example "sent home", "refund", "court", "lawyer", "salary", "discount", "waive", "scholarship"). Own-money phrases end in a redirect to What do I owe or My receipts (for example "do I owe", "my balance", "did you receive"). Why: the search alone can miss risky wording.

## Outcome table
Record kinds are ANSWER, REFUSAL and REDIRECT. Chunk kinds are BODY and QUESTION.

| Best result | Outcome |
|---|---|
| A REFUSAL record at 0.60 or more | Refuse. Show that record's named person. |
| A REFUSAL record within 0.05 of the best ANSWER record | Refuse. Same screen. |
| A REDIRECT record at 0.72 or more | Send the parent to What do I owe or My receipts. |
| An ANSWER record at 0.72 or more | Show it. If a second record is within 0.03 and also at 0.72 or more, show it too. |
| Nothing at 0.72 or more | "No answer" result. Show the right named person. |
| The embedding call fails | "Not working" result. Show the named person. |

8. Own-money questions never use shared records. Why: balances come only from the private ledger.
9. The thresholds in the table are starting guesses. The human sets the final values from the PRD 7.6 test. Never change them yourself. Why: a wrong value shows a wrong record or hides a right one.
10. Refuse these topics and show the named person: another family's information (owner); a waiver, discount or special deal not in an approved record (owner); whether a child will be sent home or barred from exams (owner); refunds (bursar); anything legal (owner); staff pay or discipline (owner). For anything the internet could answer, give the "no answer" result. Why: PRD 6.10.

## Embedding
11. The PRD believes the embedding model is `gemini-embedding-001` but did not confirm it. Ask the human for the exact model name before you write embedding code. Pin it. Store the model name on every chunk. Cut each embedding to 768 numbers. Use the document setting for record chunks and the query setting for questions. Why: models are never mixed in one search, because scores from two models cannot be compared.
12. Re-embed a record's chunks when the record changes. Re-embed every chunk when the model changes. Why: old numbers no longer match the new text or model.
13. Gemini free tier limits and data terms are unconfirmed. The PRD believes Google may use submitted content on the free tier. Ask the human before you write embedding code. Why: parents' typed questions go to Google.

## Logging and tests
14. Log every question: answered, refused, redirected, unanswered, error. Why: the owner reads this weekly to fix records.
15. After any change to shared records, the keyword guard list, a threshold or the model, the human re-runs the 30 question list (PRD 7.7). Say so in your response. Why: a silent change can break a right answer.
