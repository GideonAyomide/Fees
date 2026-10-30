import crypto from 'crypto';

/**
 * Task Four Step 10 & 11: Email Verification & Delivery Engine
 * Generates cryptographic 6-digit codes and renders branded emails using Task One design tokens.
 */

export interface VerificationRecord {
  phone: string;
  email: string;
  code: string;
  expiresAt: number;
  used: boolean;
  attempts: number;
  createdAt: number;
}

// In-memory verification registry for demonstration and testing lifecycle states
const verificationStore = new Map<string, VerificationRecord>();

// Pre-seed test fixtures for direct state verification:
const NOW = Date.now();
verificationStore.set('test-valid@crownheights.edu.ng', {
  phone: '08012345678',
  email: 'test-valid@crownheights.edu.ng',
  code: '582910',
  expiresAt: NOW + 10 * 60 * 1000, // Valid for 10 minutes
  used: false,
  attempts: 0,
  createdAt: NOW,
});

verificationStore.set('test-expired@crownheights.edu.ng', {
  phone: '08023456789',
  email: 'test-expired@crownheights.edu.ng',
  code: '839201',
  expiresAt: NOW - 60 * 1000, // Expired 1 minute ago
  used: false,
  attempts: 0,
  createdAt: NOW - 11 * 60 * 1000,
});

verificationStore.set('test-reused@crownheights.edu.ng', {
  phone: '08034567890',
  email: 'test-reused@crownheights.edu.ng',
  code: '419082',
  expiresAt: NOW + 5 * 60 * 1000,
  used: true, // Already consumed
  attempts: 1,
  createdAt: NOW - 5 * 60 * 1000,
});

/**
 * Generates an unpredictable 6-digit verification code using system CSPRNG.
 * Rejects Math.random() which produces predictable PRNG sequences.
 */
export function generateVerificationCode(): string {
  return String(crypto.randomInt(100000, 1000000));
}

/**
 * Creates and registers a new verification entry with a 10-minute expiry window.
 */
export function createVerificationEntry(phone: string, email: string): VerificationRecord {
  const code = generateVerificationCode();
  const record: VerificationRecord = {
    phone,
    email: email.toLowerCase().trim(),
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes window
    used: false,
    attempts: 0,
    createdAt: Date.now(),
  };
  verificationStore.set(record.email, record);
  return record;
}

export function getVerificationEntry(email: string): VerificationRecord | undefined {
  return verificationStore.get(email.toLowerCase().trim());
}

/**
 * Verifies an entered 6-digit code against our security requirements.
 */
export function verifyCode(email: string, inputCode: string): {
  success: boolean;
  status: 'SUCCESS' | 'EXPIRED' | 'WRONG_CODE' | 'ALREADY_USED' | 'NOT_FOUND';
  error?: string;
} {
  const normalizedEmail = email.toLowerCase().trim();
  const record = verificationStore.get(normalizedEmail);

  if (!record) {
    return {
      success: false,
      status: 'NOT_FOUND',
      error: 'No active verification request found for this email address. Please request a new code.',
    };
  }

  // 1. Reused Code Check
  if (record.used) {
    return {
      success: false,
      status: 'ALREADY_USED',
      error: 'This verification code has already been used. Please log in or request a new code.',
    };
  }

  // 2. Expiration Window Check (10-minute rule)
  if (Date.now() > record.expiresAt) {
    return {
      success: false,
      status: 'EXPIRED',
      error: 'This verification code has expired. Please request a new code.',
    };
  }

  // 3. Code Match Check
  if (record.code !== inputCode.trim()) {
    record.attempts += 1;
    return {
      success: false,
      status: 'WRONG_CODE',
      error: 'Invalid verification code. Please check your email and try again.',
    };
  }

  // Success: mark used immediately (single-use guarantee)
  record.used = true;
  return {
    success: true,
    status: 'SUCCESS',
  };
}

/**
 * Task Four Step 11: Render Branded Email HTML
 * Built strictly with Task One Design System Tokens:
 * Primary: #0F3D2E, Accent: #2D7A5D, Surface: #F8F9FA, On-Surface: #1F2937
 */
export function renderBrandedVerificationEmail(code: string, parentName: string = 'Parent / Guardian'): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Crown Heights Academy Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F9FA; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1F2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8F9FA; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF; border-radius: 8px; border: 1px solid #E5E7EB; box-shadow: 0 4px 6px -1px rgba(15, 61, 46, 0.08); overflow: hidden;">
          
          <!-- Header Bar: Primary 40 (#0F3D2E) -->
          <tr>
            <td style="background-color: #0F3D2E; padding: 24px 32px; text-align: left;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.02em;">
                      CROWN HEIGHTS ACADEMY
                    </div>
                    <div style="font-size: 13px; color: #A7F3D0; font-weight: 500; margin-top: 4px;">
                      Official Bursary & School Fees Portal
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px; text-align: left;">
              <h1 style="font-size: 20px; font-weight: 700; color: #0F3D2E; margin: 0 0 16px 0; line-height: 1.4;">
                Confirm Your Account Activation
              </h1>
              
              <p style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
                Dear ${parentName},
              </p>
              
              <p style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 24px 0;">
                To complete your registration on the Crown Heights Academy Fees portal, enter the 6-digit verification code below:
              </p>

              <!-- Code Highlight Box: Surface-Variant (#F0FDF4) & Accent Border (#2D7A5D) -->
              <div style="background-color: #F0FDF4; border: 2px solid #2D7A5D; border-radius: 8px; padding: 24px; text-align: center; margin: 0 0 24px 0;">
                <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #0F3D2E; margin-bottom: 8px;">
                  Your Verification Code
                </div>
                <div style="font-size: 36px; font-weight: 800; letter-spacing: 0.25em; color: #0F3D2E; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">
                  ${code}
                </div>
                <div style="font-size: 13px; color: #4B5563; margin-top: 8px;">
                  Expires in <strong>10 minutes</strong> (Single-use only)
                </div>
              </div>

              <!-- Security Information Note -->
              <div style="background-color: #FEF3C7; border-left: 4px solid #D97706; padding: 12px 16px; margin: 0 0 24px 0; border-radius: 4px;">
                <p style="font-size: 13px; line-height: 1.5; color: #92400E; margin: 0;">
                  <strong>Security Note:</strong> Crown Heights Academy staff will never ask you for this code on phone calls or WhatsApp. Do not share it with anyone.
                </p>
              </div>

              <p style="font-size: 14px; line-height: 1.5; color: #6B7280; margin: 0 0 8px 0;">
                If you did not request this verification code, please disregard this email or report to the Bursar immediately.
              </p>
            </td>
          </tr>

          <!-- Footer: Brand Accent Outline & Legal -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 20px 32px; border-top: 1px solid #E5E7EB; text-align: center;">
              <p style="font-size: 12px; line-height: 1.5; color: #6B7280; margin: 0 0 4px 0;">
                Crown Heights Academy · Bursary & Student Financial Records
              </p>
              <p style="font-size: 11px; line-height: 1.4; color: #9CA3AF; margin: 0;">
                Official Parent Portal · All transactions processed via Flutterwave · Verified by Bursar
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

