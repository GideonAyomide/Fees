---
trigger: model_decision
description: Parent and staff sign in, access codes, PIN rules and lockouts, sessions and cookies, consent screen. Use when working on login, sessions, PINs, or guardian management.
---

# auth.md
Job: how parents, staff and the owner sign in and stay signed in. PRD 6.1, 8.5.
Not here: what is cleared from the phone (offline-cache.md), universal secret handling (security.md).

## Parents
1. First visit: the parent enters the phone number the bursar has on file and the access code, then sets a 4 digit PIN twice. Ignore case, spaces and dashes in the code. Why: parents mistype codes copied from paper.
2. The access code is 8 characters from a set without look alike letters and digits. It works once, expires after 30 days if unused, and is stored only as an HMAC hash. It only activates the account and never signs anyone in again. Why: a printed code must not become a password.
3. Sign in is phone number plus PIN. A PIN alone never identifies a parent. Why: a 4 digit PIN is not unique, so many parents can hold the same one.
4. Store the PIN as a bcrypt hash. Why: four digits are weak, so the locks below carry the safety.
5. 5 wrong PINs lock the account for 30 minutes and the message shows the unlock time. After 10 wrong PINs in one day, only the bursar can unlock it. Why: it limits guessing.
6. A wrong phone number and a wrong access code show the same message. Count attempts per phone number and per access code. The limit per network address is high (200 an hour). Why: many phones share one address on mobile networks, and the message must not reveal which phone numbers exist.
7. A session is a random token in an `httpOnly`, `secure`, `sameSite=lax` cookie. Store only the token's hash. It lasts 90 days. If the cookie is gone, sign in with phone number and PIN. Why: a parent must not sign in on every open when data bundles are small, and a stolen cookie must not reveal a usable token.
8. Record `Session.lastPinAt`. A request for private data needs a PIN entry in the last 5 minutes, or the app shows the PIN screen. Why: a phone left unlocked must not show a balance.
9. The first screen after the PIN says in plain words what the app keeps, who can see it (the school), and that typed questions go to an AI service. The parent taps "I understand". Why: PRD 8.5 consent.
10. The bursar can reset a PIN, issue a new access code, change a phone number, and sign out all sessions for a guardian. Why: this is how a lost phone is handled.
11. At each online PIN entry, save a salted hash of the PIN on the device. Offline, check the PIN against it. Why: parents must reach saved data without signal.

## Staff and owner
12. Staff and owner sign in with email and password, stored as a bcrypt hash, through a separate sign in from parents. Sessions use the StaffSession table and last 12 hours. There is no two step sign in in version one. Why: the PRD keeps version one small and names the owner account as the weakest point.
