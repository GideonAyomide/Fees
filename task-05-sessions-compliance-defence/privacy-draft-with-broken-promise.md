# Privacy Policy Draft — Analysis of the "Broken Promise" Clause

**Document Context**: Early Privacy Notice Draft (Revision 1.2) for Crown Heights Academy  
**Subject**: Analysis, Removal, and Legal Risk Assessment of the "Verbal Erasure at the School Gate" Promise

---

## 1. The Removed Draft Clause (The "Broken Promise")

In the early draft of our parent-facing Privacy Policy, Section 5 included the following well-intentioned clause:

```markdown
> ### [REMOVED CLAUSE - SECTION 5.3 IN DRAFT 1.2]:
> "If you cannot access the internet or prefer not to use the app, you may simply speak 
> to your child's class teacher or tell the security officer at the school gate that you 
> wish for your Fees app account to be deleted. The school will immediately take down your 
> records and delete your account from our computers within 24 hours without requiring any 
> paperwork."
```

---

## 2. Why This Clause Was Written Originally

The clause was drafted with genuine empathy for the parent persona described in `AGENTS.md`:
- Nigerian parents often have low-end Android handsets, limited mobile data, intermittent electrical power, and varying comfort with digital interfaces.
- The product designer wanted to ensure that parents who struggle with technology were not trapped in a digital system, giving them a familiar, zero-barrier, human way to exercise their data rights by speaking to people they see every morning at drop-off.

---

## 3. Why It Had to Be Broken and Removed (Engineering & Legal Audit)

During the technical and compliance review, this clause was identified as a critical security, operational, and legal hazard. It was permanently excised for four concrete reasons:

### Reason 1: Identity Impersonation and Insecure Authentication
- A verbal request at the school gate provides **zero cryptographic or verifiable authentication**. 
- An estranged spouse, a non-custodial relative, or an adversary in a fee dispute could walk up to a security officer and say: *"I am the father of student JSS1/042, delete our account immediately."*
- Deleting an account without cryptographic proof of identity violates NDPA 2023 principles of data integrity and confidentiality.

### Reason 2: The Physical Chain-of-Custody Breakdown
- Security guards and classroom teachers have primary responsibilities centered around campus safety and student pedagogy. They are not data protection officers (DPOs) and do not have access to backend administrative terminals.
- A verbal message whispered at the morning drop-off rush (7:30 AM in a busy Ibadan school car park) has a near-100% probability of being forgotten, misunderstood, or miscommunicated.
- Promising a 24-hour SLA on an untracked verbal game of "telephone" guarantees regulatory breach under NDPA Section 34.

### Reason 3: Destruction of Statutory Financial Records
- Promising to *"delete your records from our computers within 24 hours"* directly violates the Nigerian Companies and Allied Matters Act (CAMA 2020) and tax regulations.
- If a school bursar were to execute a literal deletion of a student's record from the database, the associated tuition ledger, Flutterwave payment audit trails, and bank reconciliation receipts would be wiped out.
- The school cannot legally promise to erase financial ledger history.

### Reason 4: State Machine Incompatibility with the 7-Day Cooling-Off Period
- Our backend architecture enforces a **7-day grace period** (`PENDING_DELETION`) to protect families from accidental deletion, permit dispute resolution, and allow safe cancellation.
- Promising an immediate 24-hour wipe in policy text contradicts the technical implementation in [`lib/account-deletion.ts`](file:///c:/Users/HP/Desktop/Fees/lib/account-deletion.ts), creating a false promise that would fail any regulatory or consumer protection audit.

---

## 4. The Replacement: Plain, Honest, and Verifiable Process

The clause was replaced in the final [`privacy.md`](file:///c:/Users/HP/Desktop/Fees/task-05-sessions-compliance-defence/privacy.md) with an honest, verifiable procedure:
1. Deletion requests must be initiated either authenticated inside the app or submitted in writing to the designated Bursar (`bursar@crownheights.edu.ng`).
2. The account enters an automated 7-day grace period.
3. Personal credentials (phone, email, PIN) are permanently scrubbed.
4. Historical financial receipts are explicitly declared as permanently retained for tax compliance.

