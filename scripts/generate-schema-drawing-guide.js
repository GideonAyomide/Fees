const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '..', 'task-04-server-security', 'evidence');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const w = 1800;
const h = 1200;

const svg = `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .main-title { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 32px; font-weight: 700; fill: #002366; }
      .sub-title { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 16px; fill: #475569; }
      .guide-badge { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 18px; font-weight: 700; fill: #B91C1C; }
      .table-header { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 18px; font-weight: 700; fill: #FFFFFF; }
      .col-pk { font-family: 'Consolas', monospace; font-size: 13px; font-weight: 700; fill: #D97706; }
      .col-name { font-family: 'Consolas', monospace; font-size: 13px; font-weight: 600; fill: #0F172A; }
      .col-type { font-family: 'Consolas', monospace; font-size: 12px; fill: #2563EB; }
      .col-null { font-family: 'Consolas', monospace; font-size: 11px; fill: #64748B; }
      .card-desc { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 12px; fill: #334155; }
      .box-title { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 16px; font-weight: 700; }
      .callout-text { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 13px; fill: #1E293B; line-height: 1.4; }
    </style>
    <marker id="rel-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#002366" />
    </marker>
    <marker id="rel-arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#B91C1C" />
    </marker>
  </defs>

  <!-- Background Grid Paper Effect -->
  <rect width="100%" height="100%" fill="#F8FAFC" />
  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" stroke-width="0.8"/>
  </pattern>
  <rect width="100%" height="100%" fill="url(#grid)" />

  <!-- Outer Canvas Container -->
  <rect x="30" y="30" width="1740" height="1140" rx="16" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />

  <!-- Title Header & Hand-Drawn Guide Banner -->
  <text x="60" y="80" class="main-title">DATABASE SCHEMA ARCHITECTURE — 5+ TABLES ERD</text>
  <text x="60" y="110" class="sub-title">Crown Heights Academy Fees Portal • Task Four Step 1 Architecture Guide</text>

  <!-- Instruction Box for the Human Hand-Drawing -->
  <rect x="1100" y="50" width="630" height="75" rx="8" fill="#FEF2F2" stroke="#EF4444" stroke-width="2" />
  <text x="1120" y="80" class="guide-badge">HAND-DRAWING INSTRUCTION FOR STEP 1:</text>
  <text x="1120" y="105" font-family="sans-serif" font-size="14" fill="#991B1B">Draw this layout on paper by hand. Include today's date in handwriting.</text>
  <text x="1120" y="120" font-family="sans-serif" font-size="13" fill="#B91C1C">Photograph it and save as: evidence/01-schema-drawing.jpg</text>

  <!-- ========================================================================= -->
  <!-- TABLE 1: GUARDIAN (Domain 1: The People Who Use the System) -->
  <!-- ========================================================================= -->
  <g transform="translate(60, 160)">
    <rect width="360" height="340" rx="10" fill="#FFFFFF" stroke="#002366" stroke-width="2" />
    <rect width="360" height="42" rx="10" fill="#002366" />
    <text x="15" y="27" class="table-header">1. Guardian (App User / Parent)</text>
    <rect x="0" y="32" width="360" height="10" fill="#002366" />

    <!-- Table Columns -->
    <g transform="translate(15, 60)">
      <text x="0" y="0" class="col-pk">PK</text>
      <text x="35" y="0" class="col-name">id</text>
      <text x="180" y="0" class="col-type">UUID</text>
      <text x="260" y="0" class="col-null">NOT NULL</text>

      <text x="0" y="28" class="col-pk">UQ</text>
      <text x="35" y="28" class="col-name">phone</text>
      <text x="180" y="28" class="col-type">VARCHAR(15)</text>
      <text x="260" y="28" class="col-null">INDEX</text>

      <text x="35" y="56" class="col-name">pinHash</text>
      <text x="180" y="56" class="col-type">VARCHAR(255)</text>
      <text x="260" y="56" class="col-null">Argon2id</text>

      <text x="35" y="84" class="col-name">status</text>
      <text x="180" y="84" class="col-type">ENUM</text>
      <text x="260" y="84" class="col-null">ACTIVE/LOCK</text>

      <text x="35" y="112" class="col-name">failedAttempts</text>
      <text x="180" y="112" class="col-type">INT</text>
      <text x="260" y="112" class="col-null">DEFAULT 0</text>

      <text x="35" y="140" class="col-name">termsAccepted</text>
      <text x="180" y="140" class="col-type">BOOLEAN</text>
      <text x="260" y="140" class="col-null">NOT NULL</text>

      <text x="35" y="168" class="col-name">createdAt</text>
      <text x="180" y="168" class="col-type">TIMESTAMP</text>
      <text x="260" y="168" class="col-null">NOW()</text>

      <text x="35" y="196" class="col-name">updatedAt</text>
      <text x="180" y="196" class="col-type">TIMESTAMP</text>
      <text x="260" y="196" class="col-null">NOW()</text>

      <!-- Note -->
      <line x1="0" y1="215" x2="330" y2="215" stroke="#E2E8F0" />
      <text x="5" y="235" class="card-desc">• Login identifier is phone number</text>
      <text x="5" y="255" class="card-desc">• PIN stored only as Argon2id slow hash</text>
    </g>
  </g>

  <!-- ========================================================================= -->
  <!-- TABLE 2: SESSION (Domain 2: Their Sessions) -->
  <!-- ========================================================================= -->
  <g transform="translate(60, 540)">
    <rect width="360" height="310" rx="10" fill="#FFFFFF" stroke="#002366" stroke-width="2" />
    <rect width="360" height="42" rx="10" fill="#002366" />
    <text x="15" y="27" class="table-header">2. Session (Server-Side Tracking)</text>
    <rect x="0" y="32" width="360" height="10" fill="#002366" />

    <g transform="translate(15, 60)">
      <text x="0" y="0" class="col-pk">PK</text>
      <text x="35" y="0" class="col-name">id</text>
      <text x="180" y="0" class="col-type">UUID</text>
      <text x="260" y="0" class="col-null">NOT NULL</text>

      <text x="0" y="28" class="col-pk">UQ</text>
      <text x="35" y="28" class="col-name">tokenHash</text>
      <text x="180" y="28" class="col-type">VARCHAR(64)</text>
      <text x="260" y="28" class="col-null">INDEX</text>

      <text x="0" y="56" class="col-pk">FK</text>
      <text x="35" y="56" class="col-name">guardianId</text>
      <text x="180" y="56" class="col-type">UUID</text>
      <text x="260" y="56" class="col-null">INDEX</text>

      <text x="35" y="84" class="col-name">ipAddress</text>
      <text x="180" y="84" class="col-type">VARCHAR(45)</text>
      <text x="260" y="84" class="col-null">NOT NULL</text>

      <text x="35" y="112" class="col-name">userAgent</text>
      <text x="180" y="112" class="col-type">TEXT</text>
      <text x="260" y="112" class="col-null">NULLABLE</text>

      <text x="35" y="140" class="col-name">expiresAt</text>
      <text x="180" y="140" class="col-type">TIMESTAMP</text>
      <text x="260" y="140" class="col-null">INDEX</text>

      <text x="35" y="168" class="col-name">createdAt</text>
      <text x="180" y="168" class="col-type">TIMESTAMP</text>
      <text x="260" y="168" class="col-null">NOW()</text>

      <line x1="0" y1="188" x2="330" y2="188" stroke="#E2E8F0" />
      <text x="5" y="208" class="card-desc">• Stores SHA-256 hash of random token</text>
      <text x="5" y="228" class="card-desc">• Deleted on server-side logout</text>
    </g>
  </g>

  <!-- Relationship: Guardian (1) to Session (Many) -->
  <path d="M 240 500 L 240 540" stroke="#002366" stroke-width="2.5" marker-end="url(#rel-arrow)" />
  <text x="250" y="525" font-family="monospace" font-size="12" font-weight="700" fill="#002366">1 : N</text>

  <!-- ========================================================================= -->
  <!-- TABLE 3: STUDENT (Child Link Domain) -->
  <!-- ========================================================================= -->
  <g transform="translate(480, 160)">
    <rect width="360" height="340" rx="10" fill="#FFFFFF" stroke="#002366" stroke-width="2" />
    <rect width="360" height="42" rx="10" fill="#002366" />
    <text x="15" y="27" class="table-header">3. Student (School Enrolment)</text>
    <rect x="0" y="32" width="360" height="10" fill="#002366" />

    <g transform="translate(15, 60)">
      <text x="0" y="0" class="col-pk">PK</text>
      <text x="35" y="0" class="col-name">id</text>
      <text x="180" y="0" class="col-type">UUID</text>
      <text x="260" y="0" class="col-null">NOT NULL</text>

      <text x="0" y="28" class="col-pk">UQ</text>
      <text x="35" y="28" class="col-name">admissionNo</text>
      <text x="180" y="28" class="col-type">VARCHAR(30)</text>
      <text x="260" y="28" class="col-null">INDEX</text>

      <text x="35" y="56" class="col-name">fullName</text>
      <text x="180" y="56" class="col-type">VARCHAR(100)</text>
      <text x="260" y="56" class="col-null">NOT NULL</text>

      <text x="35" y="84" class="col-name">classLevel</text>
      <text x="180" y="84" class="col-type">VARCHAR(10)</text>
      <text x="260" y="84" class="col-null">JSS / SS</text>

      <text x="0" y="112" class="col-pk">FK</text>
      <text x="35" y="112" class="col-name">guardianPhone</text>
      <text x="180" y="112" class="col-type">VARCHAR(15)</text>
      <text x="260" y="112" class="col-null">INDEX</text>

      <text x="35" y="140" class="col-name">slipCodeHash</text>
      <text x="180" y="140" class="col-type">VARCHAR(255)</text>
      <text x="260" y="140" class="col-null">NOT NULL</text>

      <text x="35" y="168" class="col-name">balanceKobo</text>
      <text x="180" y="168" class="col-type">BIGINT</text>
      <text x="260" y="168" class="col-null">INTEGER</text>

      <text x="35" y="196" class="col-name">postedUpTo</text>
      <text x="180" y="196" class="col-type">DATE</text>
      <text x="260" y="196" class="col-null">Bursar Stamp</text>

      <line x1="0" y1="215" x2="330" y2="215" stroke="#E2E8F0" />
      <text x="5" y="235" class="card-desc">• Private record fetched by exact ID only</text>
      <text x="5" y="255" class="card-desc">• Up to 2 guardians can link to one student</text>
    </g>
  </g>

  <!-- Relationship: Guardian to Student -->
  <path d="M 420 280 L 480 280" stroke="#002366" stroke-width="2.5" marker-end="url(#rel-arrow)" />
  <text x="435" y="270" font-family="monospace" font-size="12" font-weight="700" fill="#002366">1 : N</text>

  <!-- ========================================================================= -->
  <!-- TABLE 4: PAYMENT (Domain 3A: Money Table - Official Book) -->
  <!-- ========================================================================= -->
  <g transform="translate(900, 160)">
    <rect width="380" height="370" rx="10" fill="#FFFFFF" stroke="#047857" stroke-width="2" />
    <rect width="380" height="42" rx="10" fill="#047857" />
    <text x="15" y="27" class="table-header">4. Payment (The Official Money Table)</text>
    <rect x="0" y="32" width="380" height="10" fill="#047857" />

    <g transform="translate(15, 60)">
      <text x="0" y="0" class="col-pk">PK</text>
      <text x="35" y="0" class="col-name">id</text>
      <text x="190" y="0" class="col-type">UUID</text>
      <text x="280" y="0" class="col-null">NOT NULL</text>

      <text x="0" y="28" class="col-pk">UQ</text>
      <text x="35" y="28" class="col-name">reference</text>
      <text x="190" y="28" class="col-type">VARCHAR(50)</text>
      <text x="280" y="28" class="col-null">INDEX</text>

      <text x="0" y="56" class="col-pk">FK</text>
      <text x="35" y="56" class="col-name">studentId</text>
      <text x="190" y="56" class="col-type">UUID</text>
      <text x="280" y="56" class="col-null">INDEX</text>

      <text x="35" y="84" class="col-name">amountKobo</text>
      <text x="190" y="84" class="col-type">BIGINT</text>
      <text x="280" y="84" class="col-null">WHOLE KOBO</text>

      <text x="35" y="112" class="col-name">flwTransactionId</text>
      <text x="190" y="112" class="col-type">VARCHAR(50)</text>
      <text x="280" y="112" class="col-null">UNIQUE</text>

      <text x="35" y="140" class="col-name">channel</text>
      <text x="190" y="140" class="col-type">VARCHAR(30)</text>
      <text x="280" y="140" class="col-null">CARD/USSD</text>

      <text x="35" y="168" class="col-name">status</text>
      <text x="190" y="168" class="col-type">VARCHAR(20)</text>
      <text x="280" y="168" class="col-null">SUCCESSFUL</text>

      <text x="35" y="196" class="col-name">reconciled</text>
      <text x="190" y="196" class="col-type">BOOLEAN</text>
      <text x="280" y="196" class="col-null">DEFAULT FALSE</text>

      <text x="35" y="224" class="col-name">paidAt</text>
      <text x="190" y="224" class="col-type">TIMESTAMP</text>
      <text x="280" y="224" class="col-null">NOT NULL</text>

      <line x1="0" y1="245" x2="350" y2="245" stroke="#E2E8F0" />
      <text x="5" y="265" class="card-desc">• Legal record: Retained permanently</text>
      <text x="5" y="285" class="card-desc">• Stores only VERIFIED successful transactions</text>
    </g>
  </g>

  <!-- Relationship: Student to Payment -->
  <path d="M 840 280 L 900 280" stroke="#047857" stroke-width="2.5" marker-end="url(#rel-arrow)" />
  <text x="855" y="270" font-family="monospace" font-size="12" font-weight="700" fill="#047857">1 : N</text>

  <!-- ========================================================================= -->
  <!-- TABLE 5: PAYMENT ATTEMPT (Domain 3B: Money-Attempts Table - SEPARATE) -->
  <!-- ========================================================================= -->
  <g transform="translate(900, 570)">
    <rect width="380" height="380" rx="10" fill="#FFFFFF" stroke="#DC2626" stroke-width="2" />
    <rect width="380" height="42" rx="10" fill="#DC2626" />
    <text x="15" y="27" class="table-header">5. PaymentAttempt (Drop-off &amp; Audit)</text>
    <rect x="0" y="32" width="380" height="10" fill="#DC2626" />

    <g transform="translate(15, 60)">
      <text x="0" y="0" class="col-pk">PK</text>
      <text x="35" y="0" class="col-name">id</text>
      <text x="190" y="0" class="col-type">UUID</text>
      <text x="280" y="0" class="col-null">NOT NULL</text>

      <text x="0" y="28" class="col-pk">UQ</text>
      <text x="35" y="28" class="col-name">attemptRef</text>
      <text x="190" y="28" class="col-type">VARCHAR(50)</text>
      <text x="280" y="28" class="col-null">INDEX</text>

      <text x="0" y="56" class="col-pk">FK</text>
      <text x="35" y="56" class="col-name">studentId</text>
      <text x="190" y="56" class="col-type">UUID</text>
      <text x="280" y="56" class="col-null">INDEX</text>

      <text x="35" y="84" class="col-name">amountKobo</text>
      <text x="190" y="84" class="col-type">BIGINT</text>
      <text x="280" y="84" class="col-null">WHOLE KOBO</text>

      <text x="35" y="112" class="col-name">flwRef</text>
      <text x="190" y="112" class="col-type">VARCHAR(100)</text>
      <text x="280" y="112" class="col-null">INDEX</text>

      <text x="35" y="140" class="col-name">status</text>
      <text x="190" y="140" class="col-type">VARCHAR(20)</text>
      <text x="280" y="140" class="col-null">ABANDONED/FAIL</text>

      <text x="35" y="168" class="col-name">failureReason</text>
      <text x="190" y="168" class="col-type">TEXT</text>
      <text x="280" y="168" class="col-null">NULLABLE</text>

      <text x="35" y="196" class="col-name">ipAddress</text>
      <text x="190" y="196" class="col-type">VARCHAR(45)</text>
      <text x="280" y="196" class="col-null">AUDIT TRAIL</text>

      <text x="35" y="224" class="col-name">initiatedAt</text>
      <text x="190" y="224" class="col-type">TIMESTAMP</text>
      <text x="280" y="224" class="col-null">NOW()</text>

      <line x1="0" y1="248" x2="350" y2="248" stroke="#E2E8F0" />
      <text x="5" y="268" class="card-desc">• Records abandoned, timed out &amp; bad 3G attempts</text>
      <text x="5" y="288" class="card-desc">• Never pollutes official payments ledger</text>
      <text x="5" y="308" class="card-desc">• Source of truth for 14-month tax audit checks</text>
    </g>
  </g>

  <!-- Relationship: Student to PaymentAttempt -->
  <path d="M 660 500 L 660 650 L 900 650" fill="none" stroke="#DC2626" stroke-width="2.5" marker-end="url(#rel-arrow-red)" />
  <text x="670" y="580" font-family="monospace" font-size="12" font-weight="700" fill="#DC2626">1 : N (Attempts)</text>

  <!-- ========================================================================= -->
  <!-- TABLE 6: POLICY CHUNK (Domain 4: Chunks for Retrieval System) -->
  <!-- ========================================================================= -->
  <g transform="translate(1330, 160)">
    <rect width="380" height="370" rx="10" fill="#FFFFFF" stroke="#7C3AED" stroke-width="2" />
    <rect width="380" height="42" rx="10" fill="#7C3AED" />
    <text x="15" y="27" class="table-header">6. PolicyChunk (Shared Records)</text>
    <rect x="0" y="32" width="380" height="10" fill="#7C3AED" />

    <g transform="translate(15, 60)">
      <text x="0" y="0" class="col-pk">PK</text>
      <text x="35" y="0" class="col-name">id</text>
      <text x="190" y="0" class="col-type">UUID</text>
      <text x="280" y="0" class="col-null">NOT NULL</text>

      <text x="35" y="28" class="col-name">title</text>
      <text x="190" y="28" class="col-type">VARCHAR(150)</text>
      <text x="280" y="28" class="col-null">NOT NULL</text>

      <text x="35" y="56" class="col-name">content</text>
      <text x="190" y="56" class="col-type">TEXT</text>
      <text x="280" y="56" class="col-null">APPROVED TEXT</text>

      <text x="35" y="84" class="col-name">category</text>
      <text x="190" y="84" class="col-type">VARCHAR(50)</text>
      <text x="280" y="84" class="col-null">BUS/UNIFORM</text>

      <text x="35" y="112" class="col-name">levelScope</text>
      <text x="190" y="112" class="col-type">VARCHAR(10)</text>
      <text x="280" y="112" class="col-null">ALL / JSS / SS</text>

      <text x="35" y="140" class="col-name">approvalDate</text>
      <text x="190" y="140" class="col-type">DATE</text>
      <text x="280" y="140" class="col-null">OWNER SIGNED</text>

      <text x="35" y="168" class="col-name">isActive</text>
      <text x="190" y="168" class="col-type">BOOLEAN</text>
      <text x="280" y="168" class="col-null">DEFAULT TRUE</text>

      <text x="35" y="196" class="col-name">embedding</text>
      <text x="190" y="196" class="col-type">vector(768)</text>
      <text x="280" y="196" class="col-null">pgvector</text>

      <line x1="0" y1="225" x2="350" y2="225" stroke="#E2E8F0" />
      <text x="5" y="245" class="card-desc">• Shared record: Same for all families</text>
      <text x="5" y="265" class="card-desc">• Only chunks with owner approval are searched</text>
      <text x="5" y="285" class="card-desc">• AI retrieves verbatim; never writes answers</text>
    </g>
  </g>

  <!-- ========================================================================= -->
  <!-- BOTTOM ARCHITECTURAL CALLOUT PANELS -->
  <!-- ========================================================================= -->
  <g transform="translate(60, 880)">
    <!-- Callout 1: Money Attempts Separation -->
    <rect width="600" height="250" rx="10" fill="#FEF2F2" stroke="#DC2626" stroke-width="1.5" />
    <text x="20" y="32" class="box-title" fill="#991B1B">CRITICAL RULE: MONEY-ATTEMPTS TABLE SEPARATION</text>
    <text x="20" y="65" class="callout-text" font-weight="700">Why payment attempts are NEVER combined into the Payment ledger:</text>
    <text x="20" y="95" class="callout-text">1. <tspan font-weight="600">Funnel &amp; Drop-off Telemetry:</tspan> Shows exactly where parents drop off</text>
    <text x="38" y="115" class="callout-text">(e.g. 3G network timeouts vs. bank decline on USSD vs. abandoned tab).</text>
    <text x="20" y="145" class="callout-text">2. <tspan font-weight="600">Tax Authority &amp; Legal Audit Source of Truth:</tspan> In a tax inquiry 14 months</text>
    <text x="38" y="165" class="callout-text">later, the official Payment ledger must match the bank deposit statement to the kobo.</text>
    <text x="38" y="185" class="callout-text">Keeping attempts separate guarantees zero ledger pollution from ghost intents.</text>
    <text x="20" y="215" class="callout-text" fill="#B91C1C" font-weight="700">• Retained permanently: All attempts logged with IP and gateway timestamp.</text>
  </g>

  <g transform="translate(690, 970)">
    <!-- Callout 2: Whole Kobo Storage Rule -->
    <rect width="480" height="160" rx="10" fill="#EFF6FF" stroke="#2563EB" stroke-width="1.5" />
    <text x="20" y="32" class="box-title" fill="#1E40AF">CURRENCY ARCHITECTURE: WHOLE KOBO</text>
    <text x="20" y="60" class="callout-text">• Money is stored exclusively in BIGINT / INTEGER whole kobo.</text>
    <text x="20" y="85" class="callout-text">• Example: ₦85,000.00 is stored as 8,500,000 kobo.</text>
    <text x="20" y="110" class="callout-text">• Eliminates IEEE-754 floating-point rounding errors.</text>
    <text x="20" y="135" class="callout-text">• Flutterwave naira amounts converted strictly at boundary.</text>
  </g>

  <g transform="translate(1200, 970)">
    <!-- Callout 3: Row-Level Security Notice -->
    <rect width="510" height="160" rx="10" fill="#FFFBEB" stroke="#D97706" stroke-width="1.5" />
    <text x="20" y="32" class="box-title" fill="#92400E">DATABASE SAFETY &amp; ROW RULE STEP</text>
    <text x="20" y="60" class="callout-text">• Adding tables requires re-running migrations/0002_row_rules.sql.</text>
    <text x="20" y="85" class="callout-text">• PostgreSQL itself enforces row isolation: Parents see ONLY their own child.</text>
    <text x="20" y="110" class="callout-text">• Agent never connects to database; human executes migrations by hand.</text>
    <text x="20" y="135" class="callout-text">• Zero cross-family exposures tolerated in release verification.</text>
  </g>

</svg>
`;

async function run() {
  console.log('Generating Task Four Schema Architecture Guide for hand-drawing...');
  const outPath = path.join(outDir, '01-schema-drawing-guide.png');
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log('✓ 01-schema-drawing-guide.png created at:', outPath);
}

run().catch(console.error);

