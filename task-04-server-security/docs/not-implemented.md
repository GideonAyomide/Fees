# Task Four Step 12: Security Controls Deliberately Not Implemented

## Overview
A security checklist mentality attempts to implement every available control regardless of context, producing bloated, unusable systems that fail in the field. Security engineering requires conscious trade-offs between friction, infrastructure cost, failure modes, and user reality.

This document analyzes four specific security controls considered for Crown Heights Academy's Fees platform and deliberately deferred or rejected for the MVP.

---

## 1. Cloudflare Turnstile / Google reCAPTCHA v3 (Bot Mitigation)

### What It Is
An automated browser challenge widget placed on authentication endpoints that evaluates mouse movements, browser fingerprints, and telemetry to calculate a risk score or present visual puzzles before allowing a POST submission.

### Why It Was Not Worth It at This Stage
1. **Bandwidth & Performance Overhead**: In Nigeria, parents access the portal on inexpensive Android smartphones over metering mobile connections (e.g. 50MB daily bundles). Loading third-party CAPTCHA scripts injects 300KB–800KB of external JavaScript, increasing initial load times by 2–4 seconds and draining user data.
2. **High False Positive Rate on Mobile**: In emerging markets, hundreds of mobile devices share carrier-grade NAT (CGNAT) gateway IPs (e.g. MTN or Airtel proxy ranges). Automated CAPTCHA scoring engines frequently flag shared cellular IP blocks as "suspicious," forcing non-technical parents into frustrating, repetitive image identification challenges.
3. **Existing Boundary Controls are Sufficient**: Account activation already requires a unique 6-digit paper activation slip code printed directly by the Bursar. An automated bot script cannot register without physical possession of this paper slip, rendering automated account creation attacks unviable.

### What Would Have to Change to Add It
- If the Bursar reports automated credential stuffing flooding the login endpoint from offshore cloud data centers (AWS/DigitalOcean IPs), and our backend rate limiter (Step 8) proves insufficient, we would implement invisible Cloudflare Turnstile strictly for requests arriving outside Nigerian ASNs (autonomous system networks).

---

## 2. WebAuthn / FIDO2 Hardware Passkeys (Biometric Authentication)

### What It Is
A public-key cryptography standard that replaces passwords and PINs with device-bound biometric credentials (fingerprint sensors, Windows Hello, Face ID) stored on hardware secure enclaves (TPM / Android Keystore).

### Why It Was Not Worth It at This Stage
1. **Device Disparity & Fragmented Android Hardware**: Many of our parents utilize sub-$100 Android devices (e.g., Tecno, itel, Infinix) running stripped-down Android Go editions without Google Play Services or hardware TPM/TEE support. Enforcing or relying on WebAuthn would lock out a significant portion of our parent demographic.
2. **Account Sharing Dynamics**: In Nigerian families, school fee management is frequently delegated between spouses, older siblings, or relatives. A device-bound passkey tied to the father’s office laptop prevents the mother from checking fee receipts from her phone at home.
3. **Recovery Complexity**: If a low-end phone is lost or reset, passkey recovery without enterprise cloud synchronization requires manual administrator intervention, overwhelming the single school Bursar with identity reset requests.

### What Would Have to Change to Add It
- When device fleet analytics indicate that >85% of our active parent sessions originate from devices supporting FIDO2 passkeys with reliable cloud sync, and the school expands from a single pilot class to multiple nationwide campuses.

---

## 3. Mandatory SMS OTP on Every Login (Multi-Factor Authentication)

### What It Is
Transmitting an SMS one-time passcode to the guardian’s mobile number on every single sign-in attempt, requiring both the 4-digit PIN and the SMS code to grant a session.

### Why It Was Not Worth It at This Stage
1. **Prohibitive Telco Costs**: In Nigeria, transactional SMS delivery costs ₦4.00–₦5.00 per message through aggregators (Termii, Twilio). If 500 parents log in 8 times a term, the school incurs recurring overhead of ₦20,000+ per term solely for SMS gateway bills—a recurring expenditure the school management refused to fund for an MVP.
2. **SMS Delivery Unreliability**: Local telco DND (Do-Not-Disturb) filters and network congestion frequently delay SMS delivery by 5 to 20 minutes, during which the session token expires. This causes parents to abandon the portal and phone the Bursar in frustration.
3. **Session Model Fits the Risk**: Parents open the app 6 to 8 times a term to view static fee balances and pay. They cannot alter grades, withdraw cash, or modify school records. The risk profile does not justify per-login MFA.

### What Would Have to Change to Add It
- If the app is expanded to permit sensitive administrative actions (e.g., updating bank payout accounts or authorizing fee refunds), mandatory MFA would be enabled strictly for staff and bursar administrative roles.

---

## 4. Column-Level Database Encryption with AWS/GCP KMS (Hardware Key Vault)

### What It Is
Encrypting individual sensitive database columns (such as `phone`, `balanceKobo`, and `email`) at the application layer using envelope encryption with keys stored in an external cloud Key Management Service (AWS KMS or Google Cloud KMS) before writing to PostgreSQL.

### Why It Was Not Worth It at This Stage
1. **Loss of Database Querying & Indexing**: Envelope encryption destroys database B-Tree indexability. Searching for a student by phone number or querying outstanding balances across a class would require full-table client-side decryption, causing catastrophic performance degradation as the ledger grows.
2. **Architectural Complexity & Cloud Lock-in**: Managing external KMS key rotations, IAM roles, and latency overhead (an extra 30ms roundtrip per cryptographic operation) violates the simplicity mandate of an MVP built on Next.js and Neon.
3. **Database-Level Controls Already Protect Data**: All disks in Neon PostgreSQL are encrypted at rest using AES-256. Database access is strictly governed by PostgreSQL Row-Level Security (RLS) policies (`migrations/0002_row_rules.sql`) where the database itself enforces tenant isolation.

### What Would Have to Change to Add It
- If the National Data Protection Commission (NDPC) issues a formal compliance mandate requiring application-layer cryptographic tokenization of student academic records, or if the system expands to store sensitive financial banking data (e.g. raw card PANs), which is currently prohibited by our Flutterwave redirect model.

