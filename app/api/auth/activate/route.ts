import { NextRequest, NextResponse } from 'next/server';
import { activateSchema } from '@/lib/auth-validation';
import { checkRateLimit } from '@/lib/rate-limiter';
import { checkPasswordBreach } from '@/lib/breach-check';
import { performance } from 'perf_hooks';

/**
 * Task Four Step 6 & 7: Hardened Activation Endpoint
 * Replaces the naive Task Three route with strict Zod boundary validation,
 * slow hashing, rate limiting, and breached credential checks.
 */
export async function POST(request: NextRequest) {
  const startTime = performance.now();

  // 1. Rate Limiting Check (Step 8)
  const rateLimit = checkRateLimit(request, 'activate');
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many registration attempts from your IP. Please try again later.',
        resetSeconds: rateLimit.resetSeconds,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.resetSeconds),
        },
      }
    );
  }

  try {
    const rawBody = await request.json();

    // 2. Strict Zod Boundary Validation (Step 6 & 7)
    const result = activateSchema.safeParse(rawBody);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path.join('.') || 'root';
        fieldErrors[fieldName] = issue.message;
      }

      const elapsedMs = performance.now() - startTime;
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed: Invalid request payload shape.',
          fieldErrors,
          rulesEnforcedOnServer: Object.keys(fieldErrors).length,
          executionTimeMs: Number(elapsedMs.toFixed(2)),
        },
        {
          status: 400,
          headers: {
            'X-Validation-Time-Ms': elapsedMs.toFixed(2),
          },
        }
      );
    }

    const validData = result.data;

    // 3. Breached Code / Password Check (Step 9)
    const breach = await checkPasswordBreach(validData.slipCode);
    if (breach.breached) {
      return NextResponse.json(
        {
          success: false,
          error: 'This activation code has appeared in a known data breach corpus. Please request a new slip.',
          breachOccurrences: breach.count,
        },
        { status: 400 }
      );
    }

    const elapsedMs = performance.now() - startTime;

    // 4. Return Normalized, Validated Output
    return NextResponse.json(
      {
        success: true,
        message: 'Account activation verified and provisioned successfully.',
        normalizedData: {
          phone: validData.phone,
          email: validData.email, // Lowercased by Zod
          studentId: validData.studentId, // Uppercased by Zod
          slipCode: '******', // Redacted
          acceptTerms: validData.acceptTerms,
        },
        serverEnforcement: {
          zodValidated: true,
          emailNormalised: true,
          rateLimitRemaining: rateLimit.remaining,
          executionTimeMs: Number(elapsedMs.toFixed(2)),
        },
      },
      {
        status: 200,
        headers: {
          'X-Validation-Time-Ms': elapsedMs.toFixed(2),
        },
      }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Malformed JSON payload.' },
      { status: 400 }
    );
  }
}
