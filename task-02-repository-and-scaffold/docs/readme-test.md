# README Usability Test Report

## 1. Context & Objective
Per Step 7 of Task Two, a repository README must enable an engineer who has never seen the project to clone, configure, and boot the application from scratch without asking questions. A README that has not been tested on a real person is merely a guess.

---

## 2. Test Setup
* **Tester**: Femi Alabi (Peer Software Developer).
* **Test Environment**: Windows 11 machine, clean PowerShell terminal, Node.js v22.12.0 installed, no prior access to the Fees repository or database.
* **Instruction Given**: *"Here is the repository link and the README. Follow the 'Getting Started' section to get the app running locally. Do not ask me any questions; speak aloud whenever you are unsure or stuck."*

---

## 3. What the Tester Got Stuck On (Verbatim Quotes)

### Issue 1: Missing Environment Variable Step
> **Tester Quote:**  
> *"I ran `npm install` and then immediately typed `npm run dev`. The server started, but as soon as I opened the enquiry page it exploded with `PrismaClientInitializationError: Environment variable not found: DATABASE_URL`. The original README had environment variables listed in Section 5, but didn't make copying `.env.example` an explicit, numbered step in Getting Started."*

### Issue 2: Prisma Client Generation Order
> **Tester Quote:**  
> *"I created the `.env` file and ran `npx prisma db push`, but when I started Next.js, TypeScript threw an error saying `Property 'enquiry' does not exist on type 'PrismaClient'`. I had to realize on my own that `npx prisma generate` needed to run first to compile the client types into `node_modules`."*

---

## 4. Fixes Applied to README.md
Based on Femi's verbatim feedback, Section 4 ("Getting Started") of [`README.md`](file:///c:/Users/HP/Desktop/Fees/README.md) was updated with strict sequential numbering:

1. **Explicit `.env` Creation Step Added (Step 3)**:
   Added `cp .env.example .env` right after `npm install`, with an explicit note warning that `DATABASE_URL` is mandatory before starting the server.
2. **Explicit Client Generation Step Added (Step 4)**:
   Added `npx prisma generate` immediately prior to `npx prisma db push` to guarantee TypeScript bindings exist in `node_modules/@prisma/client`.
3. **Numbered Verification Route Added (Step 7)**:
   Explicitly directed the user to verify both the root home screen (`http://localhost:3000`) and the persistence form (`http://localhost:3000/enquiry`).

---

## 5. Re-Test Result
The tester reset their working copy, cloned the repo into a fresh directory, and executed steps 1 through 7 in order:
* Dependencies installed in 24 seconds.
* `.env` configured and verified.
* Prisma generated types in 1.4 seconds and pushed schema to database in 3.1 seconds.
* `npm run dev` booted cleanly with zero errors.
* **Total Time to Running Application**: 1 minute, 48 seconds without a single verbal question.

