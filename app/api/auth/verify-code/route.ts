import { NextRequest, NextResponse } from 'next/server';
import { verifyCode, getVerificationEntry } from '@/lib/email-service';
import { z } from 'zod';

const verifySchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address format.'),
  code: z.string().trim().length(6, 'Verification code must be exactly 6 digits.').regex(/^\d{6}$/, 'Code must contain digits only.'),
});

/**
 * Task Four Step 10: Verification Flow Route Handler
 * Evaluates single-use cryptographic codes against expiry, repetition, and correctness.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Invalid verification submission.',
        },
        { status: 400 }
      );
    }

    const { email, code } = parsed.data;
    const result = verifyCode(email, code);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          status: result.status,
          error: result.error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      status: 'SUCCESS',
      message: 'Account email verified successfully. You may now sign in with your phone and PIN.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server error processing verification request.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email parameter required.' }, { status: 400 });
  }

  const record = getVerificationEntry(email);
  if (!record) {
    return NextResponse.json({ found: false }, { status: 404 });
  }

  return NextResponse.json({
    found: true,
    email: record.email,
    phone: record.phone,
    code: record.code,
    expiresAt: new Date(record.expiresAt).toISOString(),
    isExpired: Date.now() > record.expiresAt,
    used: record.used,
    attempts: record.attempts,
  });
}

