# Fees — Crown Heights Academy

## 1. What This Is
Crown Heights Academy Fees is an installable, low-bandwidth web application for parents to check exact student term balances, verify official receipts, and make secure fee payments from approved school records without AI guessing.

---

## 2. Status
* **Finished**:
  * Formal two-tier design system with 14-tone palette pinned around brand royal blue (`#2563EB`), pure CSS variable token compiler, and WCAG 2.1 AA/AAA contrast ratios.
  * Foundational Next.js 15 App Router scaffold and 100vh minimal institutional home shell.
  * Deliberate server breakage diagnostics and recovery procedures (nested directories, port collisions, and custom brand 404 handler).
  * Database persistence verification with `Enquiry` model on PostgreSQL/Neon returning `HTTP 201 Created` with authentic timestamps and connection failure handling returning `HTTP 500`.
* **Half Done**:
  * Parent enquiry workflow (UI form and API endpoint functional; staff review notifications and responses scheduled for subsequent tasks).
  * Parent authentication architecture (phone + PIN sign-in and activation slip flow specified in PRD, awaiting session middleware implementation).
* **Not Started**:
  * Flutterwave Standard checkout integration and webhook signature verification (gated behind pilot launch checks).
  * pgvector semantic similarity search and keyword guard pipeline for school policy rules.
  * Bursar internal ledger CSV upload, daily close, and Friday reconciliation views.

---

## 3. The Stack, with Reasons
* **Next.js 15 (App Router)**: Server-rendered text pages and lightweight HTML bundles over a heavy client SPA to ensure fast cold loads on budget Android devices over 3G/4G networks.
* **TypeScript**: Strict compile-time type safety over vanilla JavaScript to eliminate data shape errors when handling currency integers.
* **PostgreSQL with pgvector**: Unified relational data and vector similarity storage in a single database over a separate vector SaaS to avoid multi-system synchronization failures.
* **Prisma ORM**: Type-safe query construction and structured schema definitions over raw query strings, while allowing raw SQL for row-level security and vector indexing.
* **Pure CSS Variables (Tokens)**: Direct browser CSS variable consumption over Tailwind or runtime CSS-in-JS to eliminate client runtime parsing overhead.
* **Neon**: Serverless PostgreSQL with connection pooling and instant branching over self-hosted databases to simplify developer environment parity.

---

## 4. Getting Started
To take this project from a fresh clone to a running local instance:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/fees.git
   cd fees
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   *(Open `.env` and configure your `DATABASE_URL` with a PostgreSQL connection string).*

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Push database schema:**
   ```bash
   npx prisma db push
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open the application:**
   Navigate to `http://localhost:3000` in your web browser.

---

## 5. Environment Variables
* `DATABASE_URL`: PostgreSQL connection string with connection pooling parameters for Prisma ORM and raw SQL queries.
* `NEXT_PUBLIC_APP_URL`: Base canonical URL of the application used for absolute redirection and webhook destination resolution.
* `FLW_PUBLIC_KEY`: Flutterwave public API key used to initialize client-side Standard checkout modal.
* `FLW_SECRET_KEY`: Flutterwave secret API key used for server-side payment verification calls.
* `FLW_SECRET_HASH`: Secret hash configured in Flutterwave dashboard to verify the authenticity of inbound webhook signatures.

---

## 6. What This Deliberately Does Not Do
* **No automated reminders, push notifications, or SMS/WhatsApp alerts**: Avoids recurring broadcast costs for the school and spamming parents; all interaction is strictly on-demand pull retrieval.
* **No generative AI text answers or math calculations**: Language models are strictly prohibited from generating, paraphrasing, or calculating fee amounts; AI is restricted to semantic chunk retrieval of verbatim school records.
* **No student report cards, academic grades, or teacher chat**: Keeps the application strictly focused on financial clarity, receipts, and dispute resolution without scope creep.
* **No online payment before ledger posting**: Payments are held offline until the bursar has verified the paper ledger to prevent out-of-order posting and duplicate charges.
* **No client-side financial calculations**: All balances and line items are stored and calculated on the server in whole kobo integers to prevent floating-point rounding errors.

---

## 7. Known Defects
* [`scripts/build-tokens.js`](file:///c:/Users/HP/Desktop/Fees/scripts/build-tokens.js#L141-L157): Contains silent pass-through of raw hexadecimal color values when tokens lack proper semantic role indirection.
* [`app/api/enquiry/route.ts`](file:///c:/Users/HP/Desktop/Fees/app/api/enquiry/route.ts#L7-L35): Route handler lacks IP/account rate-limiting on submission attempts, leaving the endpoint open to automated bot submissions prior to Task Four server controls.
* [`app/enquiry/page.tsx`](file:///c:/Users/HP/Desktop/Fees/app/enquiry/page.tsx#L145-L162): Phone number input accepts non-digit punctuation (e.g. hyphens or parentheses) on the client before being rejected by the server validation regex.

