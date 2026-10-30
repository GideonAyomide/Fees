---
trigger: model_decision
description: Service worker, web app manifest, IndexedDB saved data, offline display, clearing cached private data. Use when working on offline behaviour, caching, or the installable app.
---

# offline-cache.md
Job: what the phone stores, shows offline, and clears. PRD 6.8, 8.9, 6.12.4.
Not here: how the PIN is checked (auth.md), screen wording (screens.md).

1. Cache the app shell with a small hand written service worker and a web app manifest. The total download stays under 1 MB. Why: small data bundles and cheap phones.
2. After sign in, save in IndexedDB the last loaded balance, fee items and receipts for each linked child, with the posted up to date. Also save the contact list and the popular question buttons. Why: the parent must see a balance with no signal.
3. When the phone is online, each open fetches fresh data and replaces the saved copy. Why: a saved balance must not go stale silently.
4. Never save shared records except the popular question list. Never save another family's data. Why: the phone must hold only what that family may see.
5. Offline, the app shell and saved data show with the offline wording in screens.md. Ask the school and Pay need signal and say so in one line. Talk to a person still shows the contacts from the saved copy. The Pay button is disabled offline with a one line reason. Why: the parent must know why a button does not work.
6. Clear all saved private data on: sign out; 5 wrong offline PIN tries; and after the bursar revokes sessions (checked on the next online open). Why: a lost or shared phone must not keep a family's balance.
7. The PIN screen is a screen lock. It is not encryption, and the saved data is not encrypted. Never describe it as encrypted. Do not add encryption without asking. Why: PRD assumption 16 chose this because encryption adds work and can fail on cheap phones.
