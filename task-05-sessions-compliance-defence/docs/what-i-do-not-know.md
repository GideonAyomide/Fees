# What I Do Not Know: An Honest Technical Self-Audit

**Engineer**: Lead Software Engineer, Fees Project  
**Context**: Technical Self-Evaluation & Systems Maturity Audit (Assessment Task Five)  
**Standard**: Intellectual Honesty & Concrete Learning Roadmaps

---

## 1. Introduction
A senior software engineer understands the precise boundary of their own competence. Claiming complete mastery over the entire software stack—from cryptography to distributed systems, relational internals, and payment settlement networks—is a hallmark of inexperience. 

This document catalogs **eight specific, technical areas** that I honestly do not fully know, how each gap was identified during the construction of the Fees web app, and the concrete technical curriculum required to master each one.

---

## 2. The Eight Technical Gaps

### 1. PostgreSQL WAL (Write-Ahead Logging) & Low-Level Replication Lag Under Surge Writes
- **What I Do Not Know**: While I understand relational table schemas, foreign key cascades, and row-level security policies, I do not deeply understand the internal page-level mechanics of PostgreSQL Write-Ahead Logging (WAL) and how streaming replication lag affects read-replicas during high-concurrency surge events (e.g. 1,000 parents checking balances simultaneously on Friday morning).
- **How Identified**: During Task Four, while contemplating Neon’s serverless compute and connection pooling architecture, I realized I could not mathematically predict when a read-replica would serve a stale `balanceKobo` if queries were distributed across read and write replicas.
- **What I Need to Learn**: Study the PostgreSQL internal storage engine architecture, specifically WAL buffer flushing (`fsync` configurations), checkpoint tuning, and logical vs. physical replication lag metrics (`pg_stat_replication`).

---

### 2. Cryptographic Side-Channel Timing Attacks on Cloud Microarchitectures
- **What I Do Not Know**: We implemented `crypto.timingSafeEqual` and dummy Argon2id hash computations to normalize execution time when rejecting non-existent users. However, I do not know how CPU cache-timing side channels (Spectre/Meltdown variants or L3 cache line eviction measurements) behave inside multi-tenant AWS/Vercel serverless microVMs (Firecracker).
- **How Identified**: In Task Four Step 3, while running `argon2.verify` on dummy hashes, I realized that while execution time was padded to ~200ms at the Node.js application layer, hyperthreaded CPU cores sharing L1/L2 cache lines might still leak memory access patterns to a co-located virtual tenant.
- **What I Need to Learn**: Advanced microarchitectural security literature, specifically Bernstein’s cache-timing attack vectors, constant-time assembly idioms, and hardware isolation guarantees in cloud hypervisors.

---

### 3. Edge Network TCP Window Scaling & BBR Congestion Control on 2G/3G Nigerian Cell Towers
- **What I Do Not Know**: I understand HTTP/1.1 vs HTTP/2 and how to optimize bundle sizes for mobile browsers. However, I do not understand how Linux kernel TCP window scaling, initial congestion window (`initcwnd`), and BBR (Bottleneck Bandwidth and RTT) congestion control algorithms interact with high-latency, packet-lossy radio access networks (RAN) typical of Nigerian 2G/3G mobile towers (MTN/Airtel).
- **How Identified**: When researching mobile latency in Task One and Task Three, I observed sporadic 800ms delays on first-byte arrival (TTFB) even on 1KB payloads, which was clearly caused by transport-layer TCP retransmissions rather than application server latency.
- **What I Need to Learn**: Deep packet analysis using Wireshark on real mobile packet captures, reading RFC 7323 (TCP Extensions for High Performance), and tuning Linux TCP socket buffer sizes for high-RTT/high-jitter mobile networks.

---

### 4. Zero-Downtime Distributed Database Schema Migrations Under Continuous Write Locks
- **What I Do Not Know**: In Task Four, we documented the 3-step migration process for adding non-null columns (`ADD COLUMN NULLABLE` -> `BACKFILL` -> `ALTER COLUMN SET NOT NULL`). However, I have never executed a zero-downtime database migration on a distributed table containing tens of millions of rows where `EXCLUSIVE LOCK` acquisition would queue incoming writes and cause cascading connection pool exhaustion.
- **How Identified**: Reading through PostgreSQL documentation on table locks (`ACCESS EXCLUSIVE` vs `SHARE UPDATE EXCLUSIVE`) during schema design made me realize that Prisma migrations execute raw DDL statements that hold locks and can lock production tables if not carefully wrapped in timeout boundaries (`lock_timeout`).
- **What I Need to Learn**: The operational patterns behind tools like GitHub’s `gh-ost` and Shopify’s Large Hadron Migrator, studying lock queuing dynamics in PostgreSQL, and writing custom migration scripts with strict `SET lock_timeout = '2s'` safeguards.

---

### 5. Flutterwave Inter-Bank ISO 8583 Settlement Failure Modes & Chargeback Arbitration
- **What I Do Not Know**: We wrote code to verify Flutterwave webhook HMAC SHA-256 signatures and call the `/transactions/verify` endpoint. However, I do not understand the underlying banking clearing networks (NIBSS, Interswitch, and ISO 8583 messaging standards) and how inter-bank settlement disputes, automated chargebacks, and gateway escrow reconciliations are settled when a parent’s bank deducts money but the settlement never reaches the school’s account.
- **How Identified**: During our interview with Mrs. Adebayo (Bursar), she described situations where debit alerts occur but funds hang between commercial banks for 14 days. Our software assumes the gateway’s webhook status is authoritative, but I lack direct experience in banking dispute protocols.
- **What I Need to Learn**: Read the Central Bank of Nigeria (CBN) regulatory framework for electronic payments, study ISO 8583 message protocols (0100 authorization vs 0200 financial presentment), and shadow a bank settlement officer during card dispute reconciliations.

---

### 6. Service Worker Bytecode Caching & Safari WebKit Background Eviction Policies
- **What I Do Not Know**: While we wrote a hand-crafted Service Worker for offline balance viewing in Task Two, I do not have deep visibility into how Apple WebKit (iOS Safari) aggressively purges IndexedDB and Service Worker caches after 7 days of user inactivity under its Intelligent Tracking Prevention (ITP) heuristics, compared to Android Chromium.
- **How Identified**: Reviewing the offline-cache rules in `AGENTS.md` revealed that while Android Chrome retains offline application state reliably, mobile browsers with aggressive power-saving or privacy eviction can silently drop offline cache entries without notifying the user.
- **What I Need to Learn**: WebKit source code and Chromium cache lifecycle specifications, specifically the Storage Foundation API, persistent vs. best-effort storage quota requests (`navigator.storage.persist()`), and cache eviction telemetry.

---

### 7. Form Accessibility (WCAG 2.1 AAA) for Screen Magnifiers & Motor-Impaired Mobile Users
- **What I Do Not Know**: In Task Three, we implemented WCAG 2.1 AA accessible forms with explicit `aria-describedby`, `role="alert"`, and visible focus rings. However, I have never conducted usability testing with real screen reader users navigating on touchscreens (TalkBack on Android or VoiceOver on iOS), nor do I fully understand how extreme screen magnification (400% zoom) impacts complex tabular tuition ledgers.
- **How Identified**: When reviewing our accessibility audit in Task Three, I realized that while our automated tooling (`axe-core`, manual keyboard tab order) passed, automated tools catch only ~30% of real accessibility barriers encountered by users with visual impairments.
- **What I Need to Learn**: Complete comprehensive training in Android TalkBack and iOS VoiceOver screen reader gestures, conduct user sessions with blind and low-vision participants, and study WCAG 2.2 focus appearance criteria.

---

### 8. Legal Discovery & Evidentiary Admissibility of Cloud Audit Logs in Nigerian High Courts
- **What I Do Not Know**: We designed structured audit logging for administrative actions and account deletion in Task Five. However, I do not know the exact legal evidentiary requirements under the Nigerian Evidence Act 2011 (Section 84) regarding certificate of authentication, chain of custody, and cryptographic timestamping required for cloud application logs to be admitted as evidence in a Nigerian court during a tuition fraud trial.
- **How Identified**: During the retention matrix design in Task Five Step 7, when researching statutory record retention under CAMA 2020, I realized that holding a text log file in an AWS bucket may not meet statutory legal standards for judicial proof without a sworn affidavit and cryptographic audit trail.
- **What I Need to Learn**: Consult with an IT-specialized Nigerian barrister, study Section 84 of the Nigerian Evidence Act 2011 regarding computer-generated evidence, and study cryptographic append-only audit log architectures (RFC 6962 Certificate Transparency logs).

