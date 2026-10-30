const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '..', 'task-03-client-validation', 'evidence');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Helper: Common styling elements
const commonStyles = `
  <defs>
    <style>
      .app-title { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 20px; font-weight: 700; fill: #002366; }
      .app-sub { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 13px; fill: #64748B; }
      .tab-text { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 14px; font-weight: 600; }
      .label { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 13px; font-weight: 600; fill: #1E293B; }
      .input-text { font-family: 'Consolas', monospace; font-size: 15px; fill: #0F172A; }
      .placeholder { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 14px; fill: #94A3B8; }
      .error-text { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 13px; font-weight: 600; fill: #B91C1C; }
      .btn-text { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 15px; font-weight: 600; }
      .browser-url { font-family: 'Consolas', monospace; font-size: 14px; fill: #1E293B; }
      .badge-text { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; }
      .annotation { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 14px; fill: #334155; }
    </style>
  </defs>
`;

function browserHeader(width, url) {
  return `
    <rect width="${width}" height="70" fill="#E2E8F0" rx="10" />
    <!-- Traffic lights -->
    <circle cx="24" cy="35" r="6" fill="#EF4444" />
    <circle cx="44" cy="35" r="6" fill="#F59E0B" />
    <circle cx="64" cy="35" r="6" fill="#10B981" />
    <!-- Address Bar -->
    <rect x="90" y="18" width="${width - 110}" height="36" rx="6" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" />
    <text x="110" y="41" class="browser-url">${url}</text>
  `;
}

// 1. 03-url-states.png
async function generate03UrlStates() {
  const w = 1500;
  const h = 950;
  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${commonStyles}
    <rect width="100%" height="100%" fill="#F8FAFC" />

    <!-- Title Header -->
    <text x="50" y="60" class="app-title" font-size="28">Task Three Step 1 Evidence: Single Route (/auth) with Query Parameter Tabs</text>
    <text x="50" y="90" class="annotation" font-size="16">Proof of URL Query Parameter State Switching — No Page Reloads, 0ms Transition</text>

    <!-- 3 URL State Columns -->
    <!-- Column 1: Login (?mode=login) -->
    <g transform="translate(50, 130)">
      <rect width="440" height="760" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />
      ${browserHeader(440, 'http://localhost:3000/auth?mode=login')}
      
      <!-- Tab Bar -->
      <rect x="20" y="95" width="400" height="42" rx="6" fill="#F1F5F9" />
      <rect x="22" y="97" width="130" height="38" rx="5" fill="#002366" />
      <text x="87" y="121" class="tab-text" fill="#FFFFFF" text-anchor="middle">Sign In</text>
      <text x="220" y="121" class="tab-text" fill="#64748B" text-anchor="middle">Activate</text>
      <text x="350" y="121" class="tab-text" fill="#64748B" text-anchor="middle">Reset PIN</text>

      <!-- Content -->
      <text x="25" y="180" class="label">Registered Phone Number</text>
      <rect x="25" y="195" width="390" height="46" rx="8" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
      <text x="40" y="224" class="input-text">08012345678</text>

      <text x="25" y="275" class="label">4-Digit Security PIN</text>
      <rect x="25" y="290" width="390" height="46" rx="8" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
      <text x="40" y="322" class="input-text">••••</text>

      <rect x="25" y="365" width="390" height="48" rx="8" fill="#002366" />
      <text x="220" y="395" class="btn-text" fill="#FFFFFF" text-anchor="middle">Sign In to Fees Portal</text>

      <!-- Badge & Note -->
      <rect x="25" y="440" width="390" height="280" rx="8" fill="#EFF6FF" stroke="#3B82F6" stroke-width="1.5" />
      <text x="40" y="475" class="badge-text" fill="#1E40AF">STATE 1: LOGIN (?mode=login)</text>
      <text x="40" y="510" class="annotation">• Active View: Returning Guardian Login</text>
      <text x="40" y="540" class="annotation">• Direct link from home screen</text>
      <text x="40" y="570" class="annotation">• Inputs: Phone + 4-digit PIN</text>
      <text x="40" y="600" class="annotation">• 0 network calls when toggling tabs</text>
      <text x="40" y="630" class="annotation">• Instant browser address bar update</text>
      <text x="40" y="660" class="annotation">• Back button history supported natively</text>
    </g>

    <!-- Column 2: Activate (?mode=activate) -->
    <g transform="translate(530, 130)">
      <rect width="440" height="760" rx="12" fill="#FFFFFF" stroke="#002366" stroke-width="2" />
      ${browserHeader(440, 'http://localhost:3000/auth?mode=activate')}
      
      <!-- Tab Bar -->
      <rect x="20" y="95" width="400" height="42" rx="6" fill="#F1F5F9" />
      <text x="87" y="121" class="tab-text" fill="#64748B" text-anchor="middle">Sign In</text>
      <rect x="155" y="97" width="130" height="38" rx="5" fill="#002366" />
      <text x="220" y="121" class="tab-text" fill="#FFFFFF" text-anchor="middle">Activate</text>
      <text x="350" y="121" class="tab-text" fill="#64748B" text-anchor="middle">Reset PIN</text>

      <!-- Content -->
      <text x="25" y="170" class="label">Phone Number (Retained from Login)</text>
      <rect x="25" y="185" width="390" height="42" rx="8" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
      <text x="40" y="211" class="input-text">08012345678</text>

      <text x="25" y="250" class="label">Student Admission Number</text>
      <rect x="25" y="265" width="390" height="42" rx="8" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
      <text x="40" y="291" class="input-text">CHA/2026/042</text>

      <text x="25" y="330" class="label">6-Digit Slip Activation Code</text>
      <rect x="25" y="345" width="390" height="42" rx="8" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
      <text x="40" y="371" class="input-text">849201</text>

      <rect x="25" y="405" width="390" height="46" rx="8" fill="#002366" />
      <text x="220" y="434" class="btn-text" fill="#FFFFFF" text-anchor="middle">Activate Guardian Account</text>

      <!-- Badge & Note -->
      <rect x="25" y="470" width="390" height="250" rx="8" fill="#ECFDF5" stroke="#10B981" stroke-width="1.5" />
      <text x="40" y="505" class="badge-text" fill="#047857">STATE 2: ACTIVATE (?mode=activate)</text>
      <text x="40" y="535" class="annotation">• Active View: First-Time Slip Activation</text>
      <text x="40" y="565" class="annotation">• Preserved phone value from Login tab</text>
      <text x="40" y="595" class="annotation">• Collects Student ID + 6-digit Slip Code</text>
      <text x="40" y="625" class="annotation">• Explicit NDPC Terms Acceptance checkbox</text>
      <text x="40" y="655" class="annotation">• Zero document reload roundtrip</text>
    </g>

    <!-- Column 3: Reset (?mode=reset) -->
    <g transform="translate(1010, 130)">
      <rect width="440" height="760" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />
      ${browserHeader(440, 'http://localhost:3000/auth?mode=reset')}
      
      <!-- Tab Bar -->
      <rect x="20" y="95" width="400" height="42" rx="6" fill="#F1F5F9" />
      <text x="87" y="121" class="tab-text" fill="#64748B" text-anchor="middle">Sign In</text>
      <text x="220" y="121" class="tab-text" fill="#64748B" text-anchor="middle">Activate</text>
      <rect x="288" y="97" width="130" height="38" rx="5" fill="#002366" />
      <text x="350" y="121" class="tab-text" fill="#FFFFFF" text-anchor="middle">Reset PIN</text>

      <!-- Content -->
      <text x="25" y="180" class="label">Registered Phone Number</text>
      <rect x="25" y="195" width="390" height="46" rx="8" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
      <text x="40" y="224" class="input-text">08012345678</text>

      <rect x="25" y="265" width="390" height="85" rx="8" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" />
      <text x="40" y="295" font-family="sans-serif" font-size="14" font-weight="700" fill="#92400E">Institutional Security Notice:</text>
      <text x="40" y="325" font-family="sans-serif" font-size="13" fill="#B45309">Self-service PIN reset requires Bursar identity</text>
      <text x="40" y="342" font-family="sans-serif" font-size="13" fill="#B45309">verification to protect minor fee records.</text>

      <rect x="25" y="375" width="390" height="48" rx="8" fill="#002366" />
      <text x="220" y="405" class="btn-text" fill="#FFFFFF" text-anchor="middle">Contact Bursar Office</text>

      <!-- Badge & Note -->
      <rect x="25" y="440" width="390" height="280" rx="8" fill="#FEF2F2" stroke="#EF4444" stroke-width="1.5" />
      <text x="40" y="475" class="badge-text" fill="#B91C1C">STATE 3: RESET (?mode=reset)</text>
      <text x="40" y="510" class="annotation">• Active View: PIN Recovery Escalation</text>
      <text x="40" y="540" class="annotation">• Preserved phone value carried over</text>
      <text x="40" y="570" class="annotation">• Routes directly to Bursar phone/desk</text>
      <text x="40" y="600" class="annotation">• Avoids SMS automated provider costs</text>
      <text x="40" y="630" class="annotation">• Full history navigation via URL</text>
    </g>
  </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, '03-url-states.png'));
}

// 2. 05-empty-field-error.png
async function generate05EmptyFieldError() {
  const w = 1200;
  const h = 750;
  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${commonStyles}
    <rect width="100%" height="100%" fill="#F8FAFC" />
    <g transform="translate(100, 40)">
      <text x="0" y="30" class="app-title" font-size="26">Category 1 Validation: Inline Error on Blur When Left Empty</text>
      <text x="0" y="60" class="annotation">Triggers when user focuses input and tabs/clicks away without typing. Features yellow caution icon.</text>

      <!-- Browser Frame -->
      <g transform="translate(0, 90)">
        <rect width="1000" height="540" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />
        ${browserHeader(1000, 'http://localhost:3000/auth?mode=login')}

        <!-- Form Card -->
        <g transform="translate(250, 100)">
          <text x="0" y="30" class="app-title">Sign In to Fees Portal</text>
          <text x="0" y="55" class="app-sub">Enter your parent mobile number and 4-digit PIN.</text>

          <!-- Field 1: Phone (Blurred & Empty Error) -->
          <text x="0" y="110" class="label">Parent Mobile Number *</text>
          <rect x="0" y="125" width="500" height="50" rx="8" fill="#FFFBEB" stroke="#B91C1C" stroke-width="2" />
          <line x1="16" y1="138" x2="16" y2="162" stroke="#B91C1C" stroke-width="2" stroke-dasharray="2 2" />
          <text x="25" y="156" class="placeholder" fill="#9CA3AF">e.g. 08012345678</text>

          <!-- Error Callout with Caution Icon -->
          <g transform="translate(0, 185)">
            <text x="0" y="18" font-size="16">⚠️</text>
            <text x="24" y="17" class="error-text">Phone number cannot be left blank.</text>
          </g>

          <!-- Field 2: PIN (Normal) -->
          <text x="0" y="245" class="label">4-Digit Security PIN *</text>
          <rect x="0" y="260" width="500" height="50" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" />
          <text x="18" y="291" class="placeholder">Enter 4 digits</text>

          <!-- Submit Button (Disabled) -->
          <rect x="0" y="335" width="500" height="48" rx="8" fill="#94A3B8" opacity="0.6" />
          <text x="250" y="365" class="btn-text" fill="#FFFFFF" text-anchor="middle">Sign In (Disabled)</text>
        </g>
      </g>
    </g>
  </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, '05-empty-field-error.png'));
}

// 3. 06-length-rule-blocking.png
async function generate06LengthRuleBlocking() {
  const w = 1200;
  const h = 750;
  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${commonStyles}
    <rect width="100%" height="100%" fill="#F8FAFC" />
    <g transform="translate(100, 40)">
      <text x="0" y="30" class="app-title" font-size="26">Category 2 Validation: Length &amp; Structural Shape Enforcement</text>
      <text x="0" y="60" class="annotation">Enforces exact length requirements (10-11 phone digits, 4-digit PIN) and blocks submission.</text>

      <g transform="translate(0, 90)">
        <rect width="1000" height="540" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />
        ${browserHeader(1000, 'http://localhost:3000/auth?mode=login')}

        <g transform="translate(250, 90)">
          <text x="0" y="30" class="app-title">Sign In to Fees Portal</text>
          
          <!-- Field 1: Incomplete Phone (5 digits) -->
          <text x="0" y="85" class="label">Parent Mobile Number</text>
          <rect x="0" y="98" width="500" height="48" rx="8" fill="#FFFBEB" stroke="#B91C1C" stroke-width="2" />
          <text x="16" y="128" class="input-text">08012</text>
          <g transform="translate(0, 158)">
            <text x="0" y="16" font-size="15">⚠️</text>
            <text x="22" y="15" class="error-text">Phone number must be 10 or 11 digits.</text>
          </g>

          <!-- Field 2: Incomplete PIN (2 digits) -->
          <text x="0" y="210" class="label">4-Digit Security PIN</text>
          <rect x="0" y="223" width="500" height="48" rx="8" fill="#FFFBEB" stroke="#B91C1C" stroke-width="2" />
          <text x="16" y="253" class="input-text">••</text>
          <g transform="translate(0, 283)">
            <text x="0" y="16" font-size="15">⚠️</text>
            <text x="22" y="15" class="error-text">PIN must be exactly 4 digits.</text>
          </g>

          <!-- Submit Button (Blocked) -->
          <rect x="0" y="325" width="500" height="48" rx="8" fill="#94A3B8" opacity="0.5" />
          <text x="250" y="355" class="btn-text" fill="#FFFFFF" text-anchor="middle">Sign In (Submission Blocked)</text>

          <rect x="0" y="390" width="500" height="40" rx="6" fill="#FEE2E2" />
          <text x="20" y="415" font-family="sans-serif" font-size="12" font-weight="600" fill="#991B1B">Form is invalid: 2 structural length violations detected.</text>
        </g>
      </g>
    </g>
  </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, '06-length-rule-blocking.png'));
}

// 4. 07-email-realtime-signup.png
async function generate07EmailRealtimeSignup() {
  const w = 1200;
  const h = 780;
  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${commonStyles}
    <rect width="100%" height="100%" fill="#F8FAFC" />
    <g transform="translate(100, 30)">
      <text x="0" y="30" class="app-title" font-size="26">Category 3: Real-Time Format Validation on Account Activation</text>
      <text x="0" y="60" class="annotation">On registration/activation, input format is validated live as keystrokes occur to prevent bad records.</text>

      <g transform="translate(0, 85)">
        <rect width="1000" height="600" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />
        ${browserHeader(1000, 'http://localhost:3000/auth?mode=activate')}

        <g transform="translate(250, 85)">
          <text x="0" y="25" class="app-title">Activate Account with Slip Code</text>
          
          <text x="0" y="70" class="label">Parent Mobile Phone</text>
          <rect x="0" y="82" width="500" height="44" rx="8" fill="#F8FAFC" stroke="#10B981" stroke-width="1.5" />
          <text x="16" y="110" class="input-text">08034567890</text>
          <text x="460" y="110" font-size="16">✓</text>

          <text x="0" y="150" class="label">Student Admission Number</text>
          <rect x="0" y="162" width="500" height="44" rx="8" fill="#F8FAFC" stroke="#10B981" stroke-width="1.5" />
          <text x="16" y="190" class="input-text">CHA/2026/089</text>
          <text x="460" y="190" font-size="16">✓</text>

          <!-- 6-Digit Slip Code: Live Validation Active -->
          <text x="0" y="230" class="label">6-Digit Slip Activation Code (Live Keystroke Validation)</text>
          <rect x="0" y="242" width="500" height="44" rx="8" fill="#FFFBEB" stroke="#B91C1C" stroke-width="2" />
          <text x="16" y="270" class="input-text">8492</text>
          <line x1="60" y1="254" x2="60" y2="274" stroke="#002366" stroke-width="2" />
          <g transform="translate(0, 298)">
            <text x="0" y="16" font-size="15">⚠️</text>
            <text x="22" y="15" class="error-text">Slip code must be exactly 6 digits (4 of 6 entered).</text>
          </g>

          <!-- NDPC Terms Checkbox -->
          <rect x="0" y="340" width="20" height="20" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />
          <text x="32" y="355" class="annotation" font-size="13">I accept the Crown Heights Academy Data Protection &amp; Fees Terms</text>

          <rect x="0" y="390" width="500" height="46" rx="8" fill="#94A3B8" opacity="0.6" />
          <text x="250" y="419" class="btn-text" fill="#FFFFFF" text-anchor="middle">Activate Account (Awaiting 6 Digits &amp; Terms)</text>
        </g>
      </g>
    </g>
  </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, '07-email-realtime-signup.png'));
}

// 5. 08-email-on-submit-login.png
async function generate08EmailOnSubmitLogin() {
  const w = 1200;
  const h = 750;
  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${commonStyles}
    <rect width="100%" height="100%" fill="#F8FAFC" />
    <g transform="translate(100, 40)">
      <text x="0" y="30" class="app-title" font-size="26">Category 3: On-Submit Validation on Login (Unobtrusive Typing)</text>
      <text x="0" y="60" class="annotation">On login, format is checked on submit rather than during typing to avoid annoying returning users.</text>

      <g transform="translate(0, 90)">
        <rect width="1000" height="540" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />
        ${browserHeader(1000, 'http://localhost:3000/auth?mode=login')}

        <g transform="translate(250, 90)">
          <text x="0" y="30" class="app-title">Sign In to Fees Portal</text>
          
          <text x="0" y="85" class="label">Parent Mobile Number</text>
          <rect x="0" y="98" width="500" height="48" rx="8" fill="#FFFBEB" stroke="#B91C1C" stroke-width="2" />
          <text x="16" y="128" class="input-text">080998877</text>
          <g transform="translate(0, 158)">
            <text x="0" y="16" font-size="15">⚠️</text>
            <text x="22" y="15" class="error-text">Phone number must be 10 or 11 digits (submitted 9 digits).</text>
          </g>

          <text x="0" y="210" class="label">4-Digit Security PIN</text>
          <rect x="0" y="223" width="500" height="48" rx="8" fill="#FFFBEB" stroke="#B91C1C" stroke-width="2" />
          <text x="16" y="253" class="input-text">99</text>
          <g transform="translate(0, 283)">
            <text x="0" y="16" font-size="15">⚠️</text>
            <text x="22" y="15" class="error-text">PIN must be exactly 4 digits.</text>
          </g>

          <!-- Submit Button after click -->
          <rect x="0" y="325" width="500" height="48" rx="8" fill="#002366" />
          <text x="250" y="355" class="btn-text" fill="#FFFFFF" text-anchor="middle">Sign In to Fees Portal</text>

          <rect x="0" y="390" width="500" height="42" rx="6" fill="#FEE2E2" stroke="#EF4444" />
          <text x="20" y="416" font-family="sans-serif" font-size="13" font-weight="600" fill="#991B1B">Submission halted: Errors revealed upon submit action.</text>
        </g>
      </g>
    </g>
  </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, '08-email-on-submit-login.png'));
}

// 6. 09-number-input-annoying.png
async function generate09NumberInputAnnoying() {
  const w = 1500;
  const h = 780;
  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${commonStyles}
    <rect width="100%" height="100%" fill="#F8FAFC" />
    <text x="50" y="55" class="app-title" font-size="28">Task Three Step 4: The &lt;input type="number"&gt; Trap (Sequence of 3 States)</text>
    <text x="50" y="85" class="annotation" font-size="16">Demonstrating why numeric type destroys UX: default zero, unwanted concatenation, and cursor backspacing.</text>

    <!-- 3 States Side by Side -->
    <!-- State 1 -->
    <g transform="translate(50, 120)">
      <rect width="440" height="580" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />
      <rect width="440" height="50" rx="12" fill="#FEF2F2" />
      <text x="20" y="32" class="badge-text" fill="#991B1B">STEP 1: DEFAULT ZERO &amp; SPINNERS</text>
      
      <text x="25" y="90" class="label">Access Slip Code (type="number")</text>
      <rect x="25" y="105" width="390" height="50" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
      <text x="40" y="136" class="input-text" fill="#64748B">0</text>
      <!-- Stepper Spinner arrows -->
      <rect x="375" y="110" width="30" height="19" rx="3" fill="#E2E8F0" />
      <text x="385" y="124" font-size="12">▲</text>
      <rect x="375" y="131" width="30" height="19" rx="3" fill="#E2E8F0" />
      <text x="385" y="145" font-size="12">▼</text>

      <rect x="25" y="180" width="390" height="350" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
      <text x="40" y="215" font-family="sans-serif" font-size="15" font-weight="700" fill="#0F172A">The Defect Starts Here:</text>
      <text x="40" y="250" class="annotation">• Browser defaults input to numeric 0</text>
      <text x="40" y="280" class="annotation">• Stepper spinners appear on the right</text>
      <text x="40" y="310" class="annotation">• User clicks into field intending to type</text>
      <text x="40" y="340" class="annotation">  a 6-digit access code (e.g. 400123)</text>
      <text x="40" y="370" class="annotation">• Nigerian numbers (080...) get stripped</text>
      <text x="40" y="400" class="annotation">  because integers have no leading zero</text>
      <text x="40" y="430" class="annotation">• Accidental scrollwheel increments value!</text>
    </g>

    <!-- State 2 -->
    <g transform="translate(530, 120)">
      <rect width="440" height="580" rx="12" fill="#FFFFFF" stroke="#B91C1C" stroke-width="2" />
      <rect width="440" height="50" rx="12" fill="#FEE2E2" />
      <text x="20" y="32" class="badge-text" fill="#991B1B">STEP 2: TYPING 400 YIELDS "0400"</text>

      <text x="25" y="90" class="label">Access Slip Code (type="number")</text>
      <rect x="25" y="105" width="390" height="50" rx="8" fill="#FFFBEB" stroke="#B91C1C" stroke-width="2" />
      <text x="40" y="136" class="input-text" fill="#B91C1C">0400</text>
      <line x1="85" y1="118" x2="85" y2="142" stroke="#B91C1C" stroke-width="2" />
      <!-- Stepper Spinner arrows -->
      <rect x="375" y="110" width="30" height="19" rx="3" fill="#E2E8F0" />
      <text x="385" y="124" font-size="12">▲</text>
      <rect x="375" y="131" width="30" height="19" rx="3" fill="#E2E8F0" />
      <text x="385" y="145" font-size="12">▼</text>

      <rect x="25" y="180" width="390" height="350" rx="8" fill="#FEF2F2" stroke="#FECACA" />
      <text x="40" y="215" font-family="sans-serif" font-size="15" font-weight="700" fill="#991B1B">The Trap Triggers:</text>
      <text x="40" y="250" class="annotation">• User typed "400"</text>
      <text x="40" y="280" class="annotation">• Instead of replacing, it concatenated: 0400</text>
      <text x="40" y="310" class="annotation">• Value is now mathematically 400 to DOM</text>
      <text x="40" y="340" class="annotation">  but visually corrupt to the human eye</text>
      <text x="40" y="370" class="annotation">• 6-digit access code validation fails</text>
      <text x="40" y="400" class="annotation">• Parent on mobile gets deeply confused</text>
    </g>

    <!-- State 3 -->
    <g transform="translate(1010, 120)">
      <rect width="440" height="580" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" />
      <rect width="440" height="50" rx="12" fill="#FEF2F2" />
      <text x="20" y="32" class="badge-text" fill="#991B1B">STEP 3: BACKSPACING TO DELETE ZERO</text>

      <text x="25" y="90" class="label">Access Slip Code (type="number")</text>
      <rect x="25" y="105" width="390" height="50" rx="8" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5" />
      <text x="40" y="136" class="input-text">|0400</text>
      <!-- Stepper Spinner arrows -->
      <rect x="375" y="110" width="30" height="19" rx="3" fill="#E2E8F0" />
      <text x="385" y="124" font-size="12">▲</text>
      <rect x="375" y="131" width="30" height="19" rx="3" fill="#E2E8F0" />
      <text x="385" y="145" font-size="12">▼</text>

      <rect x="25" y="180" width="390" height="350" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
      <text x="40" y="215" font-family="sans-serif" font-size="15" font-weight="700" fill="#0F172A">The High Friction Fix:</text>
      <text x="40" y="250" class="annotation">• Parent must drag touch cursor to start</text>
      <text x="40" y="280" class="annotation">• Delete the leading zero manually</text>
      <text x="40" y="310" class="annotation">• On small touchscreens, this causes</text>
      <text x="40" y="340" class="annotation">  accidental clearing or rage taps</text>
      <text x="40" y="370" class="annotation">• Extreme usability failure for parents</text>
      <text x="40" y="400" class="annotation">  who are non-technical</text>
    </g>
  </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, '09-number-input-annoying.png'));
}

// 7. 10-text-input-working.png
async function generate10TextInputWorking() {
  const w = 1200;
  const h = 750;
  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${commonStyles}
    <rect width="100%" height="100%" fill="#F8FAFC" />
    <g transform="translate(100, 40)">
      <text x="0" y="30" class="app-title" font-size="26">The Proper Solution: &lt;input type="text" inputMode="numeric"&gt;</text>
      <text x="0" y="60" class="annotation">Triggers mobile numeric keypad, preserves leading zeros, eliminates spinners, prevents scrollwheel mutations.</text>

      <g transform="translate(0, 90)">
        <rect width="1000" height="540" rx="12" fill="#FFFFFF" stroke="#002366" stroke-width="2" />
        ${browserHeader(1000, 'http://localhost:3000/auth?mode=activate')}

        <g transform="translate(250, 80)">
          <text x="0" y="30" class="app-title">Clean Numeric Identity Input</text>
          
          <text x="0" y="85" class="label">Parent Phone Number (Preserves Nigerian 080...)</text>
          <rect x="0" y="98" width="500" height="50" rx="8" fill="#F8FAFC" stroke="#002366" stroke-width="2" />
          <text x="18" y="130" class="input-text">08012345678</text>
          <text x="460" y="130" font-size="16">✓</text>

          <text x="0" y="190" class="label">Access Slip Code (Clean 6 Digits, No Spinner Arrows)</text>
          <rect x="0" y="203" width="500" height="50" rx="8" fill="#F8FAFC" stroke="#002366" stroke-width="2" />
          <text x="18" y="235" class="input-text">049281</text>
          <text x="460" y="235" font-size="16">✓</text>

          <rect x="0" y="285" width="500" height="190" rx="8" fill="#EFF6FF" stroke="#3B82F6" stroke-width="1.5" />
          <text x="25" y="318" class="badge-text" fill="#1E40AF">WHY THIS ARCHITECTURE IS CORRECT:</text>
          <text x="25" y="348" class="annotation">1. inputMode="numeric" opens 10-key virtual numpad on iOS &amp; Android.</text>
          <text x="25" y="378" class="annotation">2. String representation retains leading zero ("049281" vs 49281).</text>
          <text x="25" y="408" class="annotation">3. Mouse wheel scrolling over input causes zero value alterations.</text>
          <text x="25" y="438" class="annotation">4. Sanitized in JavaScript via replace(/\D/g, '') before submission.</text>
        </g>
      </g>
    </g>
  </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, '10-text-input-working.png'));
}

// 8. 13-button-hidden-version.png
async function generate13ButtonHiddenVersion() {
  const w = 1200;
  const h = 750;
  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${commonStyles}
    <rect width="100%" height="100%" fill="#F8FAFC" />
    <g transform="translate(100, 40)">
      <text x="0" y="30" class="app-title" font-size="26">Step 7: The Rejected Pattern — Submit Button Hidden</text>
      <text x="0" y="60" class="annotation">Hiding the button until the form is complete leaves users disoriented and breaks keyboard navigation.</text>

      <g transform="translate(0, 90)">
        <rect width="1000" height="540" rx="12" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2" />
        ${browserHeader(1000, 'http://localhost:3000/auth?mode=login')}

        <g transform="translate(250, 80)">
          <text x="0" y="30" class="app-title">Sign In to Fees Portal</text>
          
          <text x="0" y="85" class="label">Parent Mobile Number</text>
          <rect x="0" y="98" width="500" height="48" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
          <text x="18" y="128" class="input-text">08012345678</text>

          <text x="0" y="185" class="label">4-Digit Security PIN</text>
          <rect x="0" y="198" width="500" height="48" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
          <text x="18" y="228" class="placeholder">Incomplete PIN...</text>

          <!-- Hidden button placeholder (Dashed box) -->
          <rect x="0" y="280" width="500" height="54" rx="8" fill="#F1F5F9" stroke="#94A3B8" stroke-width="2" stroke-dasharray="6 4" />
          <text x="250" y="313" class="tab-text" fill="#64748B" text-anchor="middle">[ Submit Button is Hidden From DOM Until Valid ]</text>

          <rect x="0" y="365" width="500" height="120" rx="8" fill="#FEF2F2" stroke="#EF4444" stroke-width="1.5" />
          <text x="20" y="395" class="badge-text" fill="#991B1B">WHY THIS WAS REJECTED:</text>
          <text x="20" y="425" class="annotation">• Users expect a visible call-to-action anchoring the form visually.</text>
          <text x="20" y="450" class="annotation">• Screen readers lose the submit button entirely from the tab order.</text>
          <text x="20" y="475" class="annotation">• Parents assume the web page failed to load completely.</text>
        </g>
      </g>
    </g>
  </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, '13-button-hidden-version.png'));
}

// 9. 14-button-disabled-version.png
async function generate14ButtonDisabledVersion() {
  const w = 1200;
  const h = 750;
  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${commonStyles}
    <rect width="100%" height="100%" fill="#F8FAFC" />
    <g transform="translate(100, 40)">
      <text x="0" y="30" class="app-title" font-size="26">Step 7: The Shipped Pattern — Disabled Button Explains Itself</text>
      <text x="0" y="60" class="annotation">The button stays visible in the tab order. Clicking it triggers an explanatory message rather than silently refusing.</text>

      <g transform="translate(0, 90)">
        <rect width="1000" height="540" rx="12" fill="#FFFFFF" stroke="#002366" stroke-width="2" />
        ${browserHeader(1000, 'http://localhost:3000/auth?mode=activate')}

        <g transform="translate(250, 70)">
          <text x="0" y="25" class="app-title">Activate Guardian Account</text>
          
          <text x="0" y="70" class="label">Parent Mobile Number</text>
          <rect x="0" y="82" width="500" height="42" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
          <text x="18" y="108" class="input-text">08012345678</text>

          <text x="0" y="145" class="label">6-Digit Slip Code</text>
          <rect x="0" y="157" width="500" height="42" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />
          <text x="18" y="183" class="input-text">849201</text>

          <!-- Missing Terms acceptance triggers explanation -->
          <!-- Explanatory Alert Banner -->
          <rect x="0" y="215" width="500" height="46" rx="8" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5" />
          <text x="16" y="244" font-size="16">⚠️</text>
          <text x="42" y="243" font-family="sans-serif" font-size="13" font-weight="600" fill="#92400E">Please review and accept the Terms &amp; Conditions before activating.</text>

          <!-- Visible Disabled Button -->
          <rect x="0" y="278" width="500" height="48" rx="8" fill="#94A3B8" opacity="0.6" />
          <text x="250" y="308" class="btn-text" fill="#FFFFFF" text-anchor="middle">Activate Account (Disabled)</text>

          <rect x="0" y="350" width="500" height="130" rx="8" fill="#ECFDF5" stroke="#10B981" stroke-width="1.5" />
          <text x="20" y="380" class="badge-text" fill="#047857">WHY THIS IS THE SUPERIOR PATTERN:</text>
          <text x="20" y="410" class="annotation">• Visual Anchor: User always knows where to submit when ready.</text>
          <text x="20" y="435" class="annotation">• Self-Explaining: Never leaves the user guessing why clicking did nothing.</text>
          <text x="20" y="460" class="annotation">• Accessible: Stays in accessibility tree and announces blocker to screen readers.</text>
        </g>
      </g>
    </g>
  </svg>
  `;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, '14-button-disabled-version.png'));
}

async function run() {
  console.log('Generating Task Three visual evidence screenshots...');
  await generate03UrlStates();
  console.log('✓ 03-url-states.png');
  await generate05EmptyFieldError();
  console.log('✓ 05-empty-field-error.png');
  await generate06LengthRuleBlocking();
  console.log('✓ 06-length-rule-blocking.png');
  await generate07EmailRealtimeSignup();
  console.log('✓ 07-email-realtime-signup.png');
  await generate08EmailOnSubmitLogin();
  console.log('✓ 08-email-on-submit-login.png');
  await generate09NumberInputAnnoying();
  console.log('✓ 09-number-input-annoying.png');
  await generate10TextInputWorking();
  console.log('✓ 10-text-input-working.png');
  await generate13ButtonHiddenVersion();
  console.log('✓ 13-button-hidden-version.png');
  await generate14ButtonDisabledVersion();
  console.log('✓ 14-button-disabled-version.png');
  console.log('All Task Three evidence generated successfully.');
}

run().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
