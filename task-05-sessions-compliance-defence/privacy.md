# Privacy Notice for Parents and Guardians

**School**: Crown Heights Academy  
**Effective Date**: 2026/2027 Academic Session  
**Language**: Plain English for Nigerian Families

---

## 1. What This App Is For
The **Fees** web app helps you check your child’s school fees balance, view official payment receipts, and make tuition payments online through our Flutterwave payment gateway. 

It shows you only what is in Crown Heights Academy’s official school ledger. It is not connected to social media, does not show advertisements, and does not sell or share your family's information with outside companies.

---

## 2. Information We Collect About You
To let you access your child's records safely, we hold:
- **Your Phone Number and Email Address**: Used to verify your identity when you sign in or reset your 4-digit PIN.
- **Your Child’s School Details**: Admission number, full name, class level, and tuition fees owed.
- **Payment Records**: Dates, amounts paid (in Naira and whole kobo), Flutterwave bank references, and official receipt numbers.
- **Sign-in Session Records**: The IP address and device type you use to log in, kept for 14 days to prevent unauthorized people from guessing your PIN.

---

## 3. How We Protect Your Information
- **Your Records Are Private to Your Family**: Our database uses PostgreSQL row-level security rules. Even if our app has a software bug, the database itself refuses to show another family’s tuition debt to your account.
- **Your Security PIN Is Protected**: We never store your actual PIN. We use Argon2id cryptographic slow-hashing to scramble your PIN into an irreversible mathematical string. Even if someone stole our database, they cannot read your PIN.
- **Sessions Are Secured at Rest**: When you log in, your device receives a temporary digital key. We only keep a SHA-256 hash of that key on our servers, so a leaked database cannot be used to hijack your login.
- **No Third-Party Tracking**: We use no tracking cookies, analytics trackers, or third-party advertising scripts.

---

## 4. How Long We Keep Your Data
- **Active Family Records**: Kept for as long as your child is enrolled at Crown Heights Academy.
- **Financial Receipts**: Kept for at least **6 years** after payment. Under Nigerian accounting and tax laws, the school is legally required to keep proof of school fees paid for government tax audits.
- **Login Sessions**: Expire automatically after **14 days** of inactivity or immediately when you tap "Sign Out".

---

## 5. Deleting Your Account (Right to Erasure)
If your child leaves Crown Heights Academy or you wish to delete your account:
1. You can submit an account deletion request through the school portal or by contacting the Bursar in writing.
2. We place your account into a **7-day grace period**. All sign-in sessions across your phones and tablets are immediately switched off. If you change your mind within 7 days, you can contact the Bursar to cancel the deletion.
3. After 7 days, our automated system permanently erases your phone number, email address, and security PIN from the active system.
4. **Important Legal Note on Past Receipts**: We do not delete past receipts for school fees you have already paid. Those receipts remain in our accounting records to comply with Nigerian tax law, but your personal phone number and sign-in credentials are completely wiped.

---

## 6. Who to Contact
If you have any questions about your balance, receipts, or data privacy:
- **Tuition & Money Questions**: Mrs. Adebayo (School Bursar) — bursar@crownheights.edu.ng
- **Disputes & Formal Privacy Requests**: School Administrator / Owner — admin@crownheights.edu.ng
- **Physical Address**: Crown Heights Academy, Plot 14 Commercial Layout, Ibadan, Nigeria.

