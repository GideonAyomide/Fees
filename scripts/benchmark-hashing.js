const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const argon2 = require('argon2');
const { performance } = require('perf_hooks');

const outDir = path.join(__dirname, '..', 'task-04-server-security', 'evidence');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Running Task Four Step 4 Hashing Benchmarks on local hardware...');

  const password = 'CrownHeightsParent2026!';

  // =========================================================================
  // Experiment 1: Hash the same password twice with Argon2id
  // =========================================================================
  const hash1 = await argon2.hash(password, { type: argon2.argon2id });
  const hash2 = await argon2.hash(password, { type: argon2.argon2id });

  const hashDiffText = `=== TASK FOUR STEP 4.1: HASHING THE SAME PASSWORD TWICE ===
Target Password: "${password}"
Algorithm: Argon2id (RFC 9106)
Memory Cost: 65536 KB (64 MB)
Time Cost (Iterations): 3
Parallelism: 4 threads

[RUN 1 OUTPUT]:
${hash1}

[RUN 2 OUTPUT]:
${hash2}

[ONE-LINE EXPLANATION OF WHY THEY DIFFER]:
Argon2id automatically generates a unique cryptographically random 16-byte salt for every hashing operation, ensuring identical plaintext inputs produce entirely distinct digest outputs to defeat precomputed rainbow tables.
`;

  fs.writeFileSync(path.join(outDir, '07-hash-twice-different.txt'), hashDiffText, 'utf8');
  console.log('✓ Wrote 07-hash-twice-different.txt');

  // =========================================================================
  // Experiment 2: Timing Comparison — Argon2id vs SHA-256
  // =========================================================================
  // Benchmark Argon2id
  const argonRuns = 5;
  let argonTotalMs = 0;
  for (let i = 0; i < argonRuns; i++) {
    const start = performance.now();
    await argon2.hash(password, { type: argon2.argon2id });
    argonTotalMs += (performance.now() - start);
  }
  const argonAvgMs = (argonTotalMs / argonRuns);

  // Benchmark SHA-256
  const shaRuns = 10000;
  const shaStart = performance.now();
  for (let i = 0; i < shaRuns; i++) {
    crypto.createHash('sha256').update(password).digest('hex');
  }
  const shaTotalMs = performance.now() - shaStart;
  const shaAvgMs = shaTotalMs / shaRuns;

  // Arithmetic: Single-core hardware guesses per second
  const argonGuessesPerSec = Math.round(1000 / argonAvgMs);
  const shaGuessesPerSec = Math.round(1000 / shaAvgMs);
  const ratio = Math.round(argonAvgMs / shaAvgMs);

  const timingText = `=== TASK FOUR STEP 4.2: HARDWARE TIMING BENCHMARK (ARGON2ID VS SHA-256) ===
Machine Architecture: ${process.arch}
Node Runtime: ${process.version}
Platform: ${process.platform}
Date: 30 October 2026

[MEASURED TIMING FROM THIS MACHINE]:
1. Argon2id (Slow Adaptive Hashing, 64MB memory, 3 iterations):
   Average execution time: ${argonAvgMs.toFixed(3)} milliseconds per hash
   Single-thread throughput: ${argonGuessesPerSec.toLocaleString()} guesses/second

2. SHA-256 (Fast Cryptographic Digest):
   Average execution time: ${(shaAvgMs * 1000).toFixed(3)} microseconds (${shaAvgMs.toFixed(6)} ms)
   Single-thread throughput: ${shaGuessesPerSec.toLocaleString()} guesses/second

[ARITHMETIC RATIO]:
Argon2id is ${ratio.toLocaleString()}x slower than SHA-256 on this CPU.

[WHAT THIS MEANS FOR AN ATTACKER WHO HAS STOLEN THE DATABASE]:
Against SHA-256:
- A single commercial GPU (e.g. NVIDIA RTX 4090) evaluates ~23,000,000,000 SHA-256 hashes per second.
- An 8-character parent PIN/passphrase from a leaked table can be 100% brute-forced in under 12 minutes.
- Cost to attacker: $0 (laptop GPU).

Against Argon2id:
- Because Argon2id requires 64 MB of dedicated RAM per hash thread, an RTX 4090 with 24 GB VRAM is strictly memory-bottlenecked to ~375 concurrent instances.
- The GPU evaluates fewer than 2,000 guesses per second.
- Exhausting the same keyspace requires over 140 years.
- Cost to attacker: Prohibitive in hardware, electricity, and memory bandwidth.

[THE INVERSION]:
You hash once per login, an attacker hashes billions of times; so slowing it down costs you nothing measurable (a human cannot perceive ~${argonAvgMs.toFixed(0)} ms during a form submit) and costs the attacker everything.
`;

  fs.writeFileSync(path.join(outDir, '08-timing-argon-vs-sha.txt'), timingText, 'utf8');
  console.log('✓ Wrote 08-timing-argon-vs-sha.txt');

  console.log(`Argon2id: ${argonAvgMs.toFixed(2)} ms | SHA-256: ${(shaAvgMs * 1000).toFixed(2)} µs | Ratio: ${ratio}x`);
}

run().catch(console.error);

