# Enumeration Defense: Protecting Sensitive Data Shapes

## 1. Which Field Has a Sensitive Shape
In the Crown Heights Academy Fees portal, the **Access Slip Code (`slipCode`)** on the activation form represents sensitive security data.

Unlike a public identifier (like a phone number or student name), the slip code functions as an unhashed, one-time shared secret printed physically by the bursar.

---

## 2. Why We Removed Shape Clues & Placeholders

In conventional web forms, developers casually add helpful placeholders such as:
```html
<!-- Vulnerable: Leaks sensitive secret shape -->
<input type="text" placeholder="e.g. 849201" maxLength="6" />
```

We deliberately removed all placeholder numbers and character mask hints from the slip code input:
```html
<!-- Protected: Pure neutral input -->
<input id="slipCode" name="slipCode" type="text" inputMode="numeric" />
```

---

## 3. What an Attacker Gains from Knowing the Shape
If the interface explicitly signals that the slip code is a **6-digit integer**:
1. **Dramatically Narrowed Attack Space**: The attacker immediately knows the search space is exactly $10^6$ ($1,000,000$) possibilities. They know they do not need to test 4-digit codes, 8-digit codes, or alphanumeric strings.
2. **Optimized Brute-Force Scripting**: Automated credential-stuffing bots can target the `/api/auth/activate` endpoint with sequential numeric permutations (`000000` to `999999`) without wasting requests on invalid formats.
3. **Phishing Pretexting**: An attacker attempting social engineering calls a parent or school receptionist pretending to be technical support, citing a "6-digit code" to gain instant institutional credibility.

By removing the length hint and returning identical, generic error messages on both wrong code and wrong student ID, the attacker cannot discern whether failure occurred due to format, unknown student ID, or invalid slip code.

---

## 4. The Trade-Off Accepted
* **The Cost to Legitimate Users**: Removing `"e.g. 123456"` means a legitimate parent who is looking at a cluttered paper fee slip might wonder: *"Am I supposed to enter the receipt number, the student admission number, or the activation code?"*
* **How We Mitigated It**: Instead of an explicit digit mask, we provided an unobtrusive textual hint that appears only once typing begins: *"Enter the code from your printed fee advice slip."*
* **Is It Worth It?**: Yes, 100%. The slip code is the only barrier protecting minors' private financial records and payment histories from public exposure. Hardening the field against automated enumeration is mandatory under our zero-cross-family-exposure security commitment.
