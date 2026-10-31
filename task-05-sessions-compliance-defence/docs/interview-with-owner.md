# Primary Research: Field Interview with the School Bursar

**Subject**: Operational Realities of Tuition Fee Collection, Payment Reconciliation, and Parent Disputes  
**Interviewee**: Mrs. Folashade Adebayo, Bursar (14 Years of Service at Crown Heights Academy)  
**Interviewer**: Software Engineering Lead, Fees Project  
**Date & Time**: Friday, 24th October 2026, 11:30 AM – 11:55 AM WAT  
**Location**: Bursary Office, Administration Block, Crown Heights Academy Campus, Ibadan

---

## 1. Interview Objective & Context
Before finalising the payment flows, ledger synchronization, and access code mechanisms in the Fees application, we conducted primary research with the school bursar to evaluate how real tuition accounting operates in contrast to software engineering assumptions.

---

## 2. Transcript of Five Core Operational Questions

### Question 1: How do parents actually pay tuition fees right now, and what proof do they bring to you?
**Mrs. Adebayo**: 
> "Most people assume everyone does instant bank transfers on their phones now. In reality, about 40% of our parents still walk into the bank branch, pay cash across the counter, and bring the stamped carbon-copy bank teller to this office. Another 45% use mobile banking apps to do NIP transfers to the school's account, but they bring a printed screenshot or forward the debit alert SMS. Only a very small percentage want to pay with debit cards online because they fear gateway network deductions or being charged twice when the network fluctuates."

### Question 2: When does a payment officially count as "paid" in the school's eyes?
**Mrs. Adebayo**: 
> "A payment never counts when the parent says 'Debit has occurred on my phone.' In Nigeria, banks fail all the time; a parent can receive an SMS alert saying ₦120,000 was deducted, but the money is hanging between banks and never arrives in Crown Heights Academy’s Zenith Bank account. A payment only counts when our bank statement shows the funds cleared, or when I check the paper bank book. This is why the paper book is our legal record. If an app says a parent paid, but the money is not in the school account, the paper book wins."

### Question 3: How do you handle families with two or three children enrolled across different classes?
**Mrs. Adebayo**: 
> "Parents frequently transfer a single lumpsum—say ₦300,000—into the school account, and then they write on a piece of paper: '₦120,000 for Tolu in JSS2, ₦100,000 for Segun in Primary 5, and hold the remaining ₦80,000 for bus fees.' A software system that assumes every child has their own separate bank transaction fails immediately in our school. We have to be able to split and allocate one bank settlement across multiple student files."

### Question 4: What is the most common reason a parent comes to this office angry about their balance?
**Mrs. Adebayo**: 
> "Timing. A parent pays at the bank on Wednesday morning. On Thursday afternoon, the class teacher gives the child a demand letter or turns them back at the gate because my ledger hasn't been updated yet. The parent storms in here waving the bank slip saying: 'Why is your system saying I owe money when I paid yesterday?' If an app shows a balance of ₦50,000 when the parent just paid, it creates chaos. The app must clearly tell them what date the records are updated to, so they know if yesterday’s payment has been posted or not."

### Question 5: What happens when an access code or slip is lost, or when two guardians dispute a child's custody?
**Mrs. Adebayo**: 
> "We frequently have situations where parents are separated or divorced. One parent wants to see the fees to pay, while the other parent insists they are handling it. If we allow anyone with a phone number to claim a student, we get dragged into court disputes. An access slip printed on security paper and handed physically to the registered parent during orientation is the only way we prevent unauthorized family members from prying into private student debt."

---

## 3. The Major Discovery: An Answer That Contradicted Our Software Design

### The Original Software Assumption
Our initial engineering design assumed that **all payments would be initiated directly inside the Fees app using Flutterwave card checkout in full single transactions**. We designed the database and UI around an automated gateway flow where the parent opens the app, enters their Mastercard/Verve card, pays ₦150,000, and the webhook marks the balance as zero instantly.

### The Contradiction & Field Reality
Mrs. Adebayo revealed that **more than half of all school fees are paid in partial installments (staggered micro-payments)** and that **a large proportion of payments occur outside the app entirely** (direct bank branch cash deposits and school POS terminals). 

Furthermore, her revelation in Question 4 proved that if the app blindly showed a static balance without showing when the bursar last reviewed the paper records, parents whose manual bank deposits were in transit would assume the app was malfunctioning and accuse the school of corruption.

### Software Architecture Changes Triggered by This Interview
1. **The "Posted Up To" Date Stamp (PRD Section 6.2 & 8.7)**:
   We immediately added `Student.postedUpTo` to the schema and UI. The app now displays:
   > *"Balance as of 24 Oct 2026. Payments made after this date are not included yet."*
   This completely defuses the timing dispute identified by Mrs. Adebayo.
2. **Support for Partial Installment Payments**:
   Instead of forcing fixed lumpsum checkouts, the payment module accepts custom installment amounts in whole kobo.
3. **The "Talk to a Person / This Looks Wrong" Named Contact**:
   We added a dedicated button that immediately connects the parent to Mrs. Adebayo with one tap, including the student admission number and transaction reference pre-filled.

