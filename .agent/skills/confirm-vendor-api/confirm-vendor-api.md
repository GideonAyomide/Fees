---
name: confirm-vendor-api
description: Confirm an unconfirmed Flutterwave, Gemini or Prisma fact in the vendor's own documents before writing code that depends on it. Use before any code that calls or configures one of these vendors.
---

# Confirm a vendor fact before you code it

Job: turn each unconfirmed vendor fact into a written note with a source. Then code only from the note.

## Inputs

Get these from the person. Ask for any that are missing.

1. The vendor: Flutterwave, Gemini or Prisma.
2. The feature the code is for.
3. Access to the vendor's current documents. A link or a pasted page works.

## Steps

1. Open the rules file for the vendor. Flutterwave: `payments.md`. Gemini: `ai-pipeline.md`. Prisma: `database.md`. Find every item it marks as unconfirmed or tells you to ask about.
2. Open the PRD sections for the same feature and add any item the PRD marks as unconfirmed. Use PRD 7.3, 8.2, 8.4, 8.6 and 11.3 as needed.
3. Write a checklist. Keep only the items this feature needs. Number each item.
4. Open the vendor's own developer documents. Do not use blogs, forums or summaries. If you cannot open them, stop and tell the person. Do not continue from memory.
5. Record the version you are reading: the Flutterwave API version, the Gemini model name as shown in the documents, or the installed Prisma version from `package.json`.
6. Create the file `vendor-notes/<vendor>-<feature>.md`. Add one line per checklist item with four parts: the item, the fact you found, the document URL, and the version.
7. Compare each fact with the PRD and the rules file. If any fact differs, show the person a table with three columns: item, what the PRD says, what the documents say. Stop until the person decides.
8. List every item only the person can supply. Examples are environment variable names, the exact model name, plan limits and the function time limit. Ask for each one. Do not invent a value.
9. Write code only for items marked confirmed in the note file. Do not write code for an open item.
10. Write a test for each vendor call using sample data copied from the vendor's own examples. Label and report the tests as `testing.md` and `database-safety.md` require.
11. End your response with two lists. List one: confirmed items, each with the note file path. List two: open items, each with the question the person must answer.

## Done when

- Every checklist item is either confirmed in the note file or listed as open.
- No code depends on an open item.
- The note file exists and names a document URL and a version for every confirmed item.