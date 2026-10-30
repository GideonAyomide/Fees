---
trigger: always_on
---

# security.md
Job: the security rules that apply to all code you write, in any project.
Not here: webhook signature steps (payments.md), PIN and session rules (auth.md), package approval (AGENTS.md).

1. Read every secret from the environment. Never write one into a file, a log, a response, an example, or code that is sent to the browser. Why: a leaked key lets a stranger take payments or read records.
2. If you find a secret already written in a file, stop and tell the human. Why: a secret that was written down must be replaced, and only the human can do that.
3. On the server, take the user's identity from the session only. Never take it from a value the browser sends, such as a user ID in a form, a URL or a header. Why: a browser can send any value.
4. Validate every input on the server before you use it: type, maximum length, allowed values. Reject the input if it fails. Why: bad input is the usual way into a system.
5. Never write phone numbers, PINs, access codes, tokens or secrets to application logs or console output. Why: logs are read by more people than the database is.
6. Store PINs, passwords, codes and session tokens only as hashes, never as plain text. The method for each is in auth.md. Why: a leaked table must not hand out logins.
7. Compare secrets and signatures in constant time. Why: a normal comparison can leak the secret one character at a time.
8. Show users a plain message on every error. Never show a stack trace, a table name, query text or a file path. Why: those details help an attacker.
9. Never return a hash or a secret in any response. Why: a hash that leaves the server can be attacked offline.
