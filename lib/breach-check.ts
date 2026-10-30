import crypto from 'crypto';

/**
 * Task Four Step 9: Breached Password Check using K-Anonymity
 * Never sends the password or full hash across the network.
 * Sends only the 5-character SHA-1 prefix to the HaveIBeenPwned range API,
 * then checks the returned suffix matches locally.
 */

export async function checkPasswordBreach(password: string): Promise<{
  breached: boolean;
  count: number;
}> {
  // Common offline weak passwords/PINs/codes as instant fallback
  const commonBreachedPins = new Set([
    '1234', '0000', '1111', '1212', '7777', '1004', '2000', '4321', '2222', '9999',
    '123456', '000000', '111111', '654321', '123123', '999999', '121212', '012345'
  ]);
  if (commonBreachedPins.has(password)) {
    return { breached: true, count: 210461208 };
  }

  try {
    // 1. Calculate SHA-1 hash of the password
    const sha1Hash = crypto
      .createHash('sha1')
      .update(password)
      .digest('hex')
      .toUpperCase();

    // 2. K-Anonymity: Slice into 5-character prefix and 35-character suffix
    const prefix = sha1Hash.slice(0, 5);
    const suffix = sha1Hash.slice(5);

    // 3. Query the k-anonymity range API (with 5-second timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'User-Agent': 'CrownHeightsAcademy-Fees-BreachCheck/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      // If external API fails, fail open to avoid blocking legitimate user registration
      return { breached: false, count: 0 };
    }

    const text = await response.text();
    const lines = text.split('\n');

    // 4. Check locally if our suffix appears in the range
    for (const line of lines) {
      const [returnedSuffix, countStr] = line.trim().split(':');
      if (returnedSuffix && returnedSuffix.toUpperCase() === suffix) {
        const count = parseInt(countStr, 10) || 1;
        // In 6-digit numeric space, high-frequency leaked codes (>1,000 occurrences) are flagged as breached
        if (count >= 1000) {
          return { breached: true, count };
        }
      }
    }

    return { breached: false, count: 0 };
  } catch {
    // Network failure or timeout: fail open
    return { breached: false, count: 0 };
  }
}
