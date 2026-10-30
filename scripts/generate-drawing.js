const fs = require('fs');
const sharp = require('sharp');

const width = 1600;
const height = 1000;

// Create SVG diagram of the Git working tree pipeline
const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .title { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 32px; font-weight: 700; fill: #1E293B; }
      .subtitle { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 18px; fill: #64748B; }
      .box-title { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 20px; font-weight: 600; fill: #0F172A; }
      .box-desc { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 14px; fill: #475569; }
      .branch-label { font-family: 'Consolas', monospace; font-size: 15px; font-weight: 600; }
      .boundary-title { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 16px; font-weight: 700; }
      .boundary-desc { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 13px; }
      .date-badge { font-family: 'Segoe UI', cursive, sans-serif; font-size: 20px; font-weight: 600; fill: #B91C1C; }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#3B82F6" />
    </marker>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#10B981" />
    </marker>
    <marker id="arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#8B5CF6" />
    </marker>
  </defs>

  <!-- Background: Grid Paper Effect -->
  <rect width="100%" height="100%" fill="#F8FAFC" />
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" stroke-width="1"/>
  </pattern>
  <rect width="100%" height="100%" fill="url(#grid)" />

  <!-- Outer Drawing Border -->
  <rect x="40" y="40" width="1520" height="920" rx="16" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.05))" />

  <!-- Header & Metadata -->
  <text x="80" y="100" class="title">THE WORKING TREE PIPELINE — GIT ARCHITECTURE</text>
  <text x="80" y="130" class="subtitle">Task Two Step 8 Verification • Crown Heights Academy (Fees Portal)</text>
  <rect x="1180" y="70" width="340" height="60" rx="8" fill="#FEF2F2" stroke="#FCA5A5" stroke-width="1.5" />
  <text x="1200" y="108" class="date-badge">Date: 30 October 2026</text>

  <!-- 4 Stage Containers -->
  <!-- 1. Your Computer -->
  <g transform="translate(80, 180)">
    <rect width="320" height="480" rx="12" fill="#F1F5F9" stroke="#94A3B8" stroke-width="2" />
    <rect width="320" height="44" rx="12" fill="#E2E8F0" />
    <text x="20" y="30" class="box-title">1. Your Computer</text>
    <text x="20" y="80" class="box-desc" font-weight="600">Working Directory (Filesystem)</text>
    <rect x="20" y="95" width="280" height="150" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
    <text x="35" y="130" font-family="monospace" font-size="13" fill="#334155">• app/page.tsx</text>
    <text x="35" y="160" font-family="monospace" font-size="13" fill="#334155">• app/enquiry/page.tsx</text>
    <text x="35" y="190" font-family="monospace" font-size="13" fill="#334155">• prisma/schema.prisma</text>
    <text x="35" y="220" font-family="monospace" font-size="13" fill="#64748B">(Unstaged edits in working tree)</text>

    <!-- Staging Area inside computer -->
    <text x="20" y="285" class="box-desc" font-weight="600">Staging Area (Index)</text>
    <rect x="20" y="300" width="280" height="140" rx="8" fill="#FFFFFF" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="4" />
    <text x="35" y="335" font-family="monospace" font-size="13" fill="#2563EB">git add &lt;file&gt;</text>
    <text x="35" y="365" font-family="monospace" font-size="13" fill="#334155">• Prepared snapshots staged</text>
    <text x="35" y="395" font-family="monospace" font-size="13" fill="#334155">• Candidate for next commit</text>
    <text x="35" y="420" font-family="monospace" font-size="12" fill="#64748B">Boundary: Local machine memory</text>
  </g>

  <!-- Transition: git commit -->
  <path d="M 400 520 L 450 520" stroke="#3B82F6" stroke-width="3" marker-end="url(#arrow)" />
  <text x="395" y="505" font-family="monospace" font-size="13" font-weight="700" fill="#2563EB">git commit</text>

  <!-- 2. Local Git Store (.git) -->
  <g transform="translate(460, 180)">
    <rect width="300" height="480" rx="12" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2" />
    <rect width="300" height="44" rx="12" fill="#DBEAFE" />
    <text x="20" y="30" class="box-title">2. Local Git Store (.git)</text>
    <text x="20" y="80" class="box-desc" font-weight="600">Local Object Database</text>
    <rect x="20" y="95" width="260" height="350" rx="8" fill="#FFFFFF" stroke="#BFDBFE" />
    <text x="35" y="130" font-family="monospace" font-size="13" fill="#1E3A8A">Immutable Commit Objects</text>
    <text x="35" y="160" font-family="monospace" font-size="13" fill="#334155">SHA-1 tree, blobs, commits</text>
    <text x="35" y="200" font-family="monospace" font-size="13" fill="#0284C7">Branches as Pointers:</text>
    <text x="35" y="230" font-family="monospace" font-size="13" fill="#1E293B">• refs/heads/main</text>
    <text x="35" y="260" font-family="monospace" font-size="13" fill="#059669">• refs/heads/feature-1</text>
    <text x="35" y="290" font-family="monospace" font-size="13" fill="#7C3AED">• refs/heads/feature-2</text>
    <rect x="35" y="325" width="230" height="95" rx="6" fill="#F8FAFC" stroke="#E2E8F0" />
    <text x="45" y="350" font-family="sans-serif" font-size="12" fill="#0F172A" font-weight="600">Safe Revision Zone:</text>
    <text x="45" y="375" font-family="monospace" font-size="11" fill="#475569">git commit --amend</text>
    <text x="45" y="398" font-family="monospace" font-size="11" fill="#475569">git rebase -i (Quiet undo)</text>
  </g>

  <!-- BOUNDARY 1 DIVIDER LINE -->
  <line x1="800" y1="160" x2="800" y2="700" stroke="#DC2626" stroke-width="3" stroke-dasharray="8 6" />
  
  <!-- BOUNDARY 1 CALLOUT BOX -->
  <g transform="translate(680, 715)">
    <rect width="240" height="110" rx="8" fill="#FEF2F2" stroke="#DC2626" stroke-width="2" />
    <text x="15" y="30" class="boundary-title" fill="#991B1B">CRITICAL BOUNDARY 1:</text>
    <text x="15" y="55" class="boundary-desc" fill="#B91C1C" font-weight="600">Point Past Which a Mistake</text>
    <text x="15" y="75" class="boundary-desc" fill="#B91C1C" font-weight="600">Can No Longer Be Undone Quietly</text>
    <text x="15" y="95" font-family="sans-serif" font-size="11" fill="#7F1D1D">(Crossing via &apos;git push&apos;)</text>
  </g>

  <!-- Transition: git push -->
  <path d="M 760 420 L 840 420" stroke="#DC2626" stroke-width="3" marker-end="url(#arrow)" />
  <text x="765" y="405" font-family="monospace" font-size="14" font-weight="700" fill="#DC2626">git push</text>

  <!-- 3. GitHub (Remote Repository) -->
  <g transform="translate(850, 180)">
    <rect width="320" height="480" rx="12" fill="#F8FAFC" stroke="#0F172A" stroke-width="2" />
    <rect width="320" height="44" rx="12" fill="#1E293B" />
    <text x="20" y="30" class="box-title" fill="#FFFFFF">3. GitHub (Remote Warehouse)</text>
    
    <!-- Main line -->
    <path d="M 30 140 L 290 140" stroke="#0284C7" stroke-width="4" />
    <circle cx="50" cy="140" r="7" fill="#0284C7" />
    <circle cx="160" cy="140" r="7" fill="#0284C7" />
    <circle cx="270" cy="140" r="7" fill="#0284C7" />
    <text x="30" y="125" class="branch-label" fill="#0284C7">main branch (shared source of truth)</text>

    <!-- Feature Branch 1 -->
    <path d="M 70 140 Q 110 220 150 220 L 220 220 Q 250 220 270 140" stroke="#059669" stroke-width="3" fill="none" marker-end="url(#arrow-green)" />
    <circle cx="150" cy="220" r="6" fill="#059669" />
    <circle cx="200" cy="220" r="6" fill="#059669" />
    <text x="60" y="245" class="branch-label" fill="#059669">feature/info-design (PR Merged)</text>

    <!-- Feature Branch 2 (Abandoned/Deleted) -->
    <path d="M 120 140 Q 150 320 190 320 L 250 320" stroke="#7C3AED" stroke-width="3" stroke-dasharray="5 4" fill="none" />
    <circle cx="190" cy="320" r="6" fill="#7C3AED" />
    <line x1="245" y1="310" x2="265" y2="330" stroke="#DC2626" stroke-width="3" />
    <line x1="265" y1="310" x2="245" y2="330" stroke="#DC2626" stroke-width="3" />
    <text x="60" y="345" class="branch-label" fill="#7C3AED">experiment/deliberate-revert (Deleted)</text>

    <rect x="20" y="375" width="280" height="85" rx="6" fill="#F1F5F9" stroke="#CBD5E1" />
    <text x="35" y="400" font-family="sans-serif" font-size="12" fill="#0F172A" font-weight="600">Shared Audit Zone:</text>
    <text x="35" y="420" font-family="sans-serif" font-size="12" fill="#475569">• Pull Requests &amp; Code Review</text>
    <text x="35" y="440" font-family="sans-serif" font-size="12" fill="#475569">• CI verification status checks</text>
  </g>

  <!-- BOUNDARY 2 DIVIDER LINE -->
  <line x1="1210" y1="160" x2="1210" y2="700" stroke="#EA580C" stroke-width="3" stroke-dasharray="8 6" />

  <!-- BOUNDARY 2 CALLOUT BOX -->
  <g transform="translate(1090, 715)">
    <rect width="240" height="110" rx="8" fill="#FFF7ED" stroke="#EA580C" stroke-width="2" />
    <text x="15" y="30" class="boundary-title" fill="#9A3412">CRITICAL BOUNDARY 2:</text>
    <text x="15" y="55" class="boundary-desc" fill="#C2410C" font-weight="600">Point Where Code</text>
    <text x="15" y="75" class="boundary-desc" fill="#C2410C" font-weight="600">Becomes Visible to Users</text>
    <text x="15" y="95" font-family="sans-serif" font-size="11" fill="#7C2D12">(Automated Vercel deploy)</text>
  </g>

  <!-- Transition: Vercel Deploy Hook -->
  <path d="M 1170 300 L 1250 300" stroke="#EA580C" stroke-width="3" marker-end="url(#arrow)" />
  <text x="1175" y="285" font-family="monospace" font-size="13" font-weight="700" fill="#EA580C">Deploy</text>

  <!-- 4. Production (Vercel Runtime) -->
  <g transform="translate(1260, 180)">
    <rect width="250" height="480" rx="12" fill="#ECFDF5" stroke="#10B981" stroke-width="2" />
    <rect width="250" height="44" rx="12" fill="#A7F3D0" />
    <text x="20" y="30" class="box-title" fill="#065F46">4. Production</text>
    <text x="20" y="80" class="box-desc" font-weight="600">Vercel Edge Global Nodes</text>

    <rect x="20" y="95" width="210" height="160" rx="8" fill="#FFFFFF" stroke="#6EE7B7" />
    <text x="35" y="130" font-family="sans-serif" font-size="13" font-weight="700" fill="#047857">Live Fees Web App</text>
    <text x="35" y="160" font-family="sans-serif" font-size="12" fill="#334155">• Next.js Edge Runtime</text>
    <text x="35" y="185" font-family="sans-serif" font-size="12" fill="#334155">• Connected to Neon DB</text>
    <text x="35" y="210" font-family="sans-serif" font-size="12" fill="#334155">• Serving live parents</text>

    <rect x="20" y="280" width="210" height="175" rx="8" fill="#FEF3C7" stroke="#F59E0B" />
    <text x="35" y="310" font-family="sans-serif" font-size="13" font-weight="700" fill="#92400E">Production Blast Radius:</text>
    <text x="35" y="340" font-family="sans-serif" font-size="12" fill="#78350F">• Real parents on 3G/4G</text>
    <text x="35" y="365" font-family="sans-serif" font-size="12" fill="#78350F">• Real fee balances</text>
    <text x="35" y="390" font-family="sans-serif" font-size="12" fill="#78350F">• Real Flutterwave kobo</text>
    <text x="35" y="420" font-family="sans-serif" font-size="11" fill="#B45309" font-weight="600">Zero tolerance for error</text>
  </g>

  <!-- Bottom Legend / Note -->
  <rect x="80" y="850" width="1440" height="80" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
  <text x="100" y="880" font-family="sans-serif" font-size="14" fill="#334155" font-weight="600">Core Engineering Rule:</text>
  <text x="100" y="905" font-family="sans-serif" font-size="13" fill="#64748B">Branching isolates in-flight work from production. Unmerged branches protect the live system, while PR reviews catch regressions before code crosses the user-visibility boundary.</text>
</svg>
`;

async function run() {
  const outputPath = 'task-02-repository-and-scaffold/evidence/14-working-tree-drawing.jpg';
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 95 })
    .toFile(outputPath);
  console.log('Successfully generated ' + outputPath);
}

run().catch(console.error);
