---
trigger: model_decision
description: Environment variable names, Vercel and Neon limits, region choice, deployment facts. Use when working on configuration, deployment, or anything that reads an environment variable.
---

# env-and-hosting.md
Job: environment variable names and the hosting facts the build depends on. PRD 8.1, 8.2, 8.4.
Not here: how to handle secrets (security.md), how the webhook is written (payments.md).

## Environment variable names
1. The PRD names three: `DATABASE_URL_FAMILY` (the fees_family connection), `DATABASE_URL_SYSTEM` (the fees_system connection) and `DIRECT_URL` (the migration connection, set in `prisma.config.ts`). Why: the code needs one name per connection, and the PRD fixes these three.
2. The PRD gives no names for the Flutterwave secret key, the webhook secret hash, the Gemini key or any session secret. Ask the human for the names. Do not invent them. Why: a made up name that the human never sets fails silently on deploy.

## Hosting facts
3. Build and test on Vercel Hobby. A live school app needs a paid Vercel plan, because Hobby is for non commercial use. Why: a live app on Hobby breaks Vercel's terms and the account can be suspended.
4. Neon Free has 0.5 GB storage, 100 compute hours a month and 5 GB data out. Hitting a limit suspends compute. Why: the app goes dark.
5. Neon Free compute sleeps after 5 minutes idle. This cannot be turned off. The loading line in screens.md covers it. Why: the first request after a quiet spell is slower, and the parent must not see a blank page.
6. Never use Supabase Free. Why: it pauses after one week with no use.
7. Choose the Vercel region and the Neon region together, as close to Lagos as each offers. This is probably Europe, so children's data may be stored outside Nigeria. The school must take advice and accept this in writing. Ask the human to confirm before you fix a region. Why: a far region slows slow phones, and data law applies.
8. The hosting plan's function time limit is unchecked. Ask the human for it before you write the webhook. Why: a timeout loses a payment confirmation.
9. Neon Free has a short restore window that the PRD did not check. The Export screen downloads everything as CSV, and the bursar does this every Friday. Why: a bad upload or a deleted table could not otherwise be undone.
