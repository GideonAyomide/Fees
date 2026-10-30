import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/auth-validation';
import { checkRateLimit } from '@/lib/rate-limiter';
import { performance } from 'perf_hooks';

/**
 * Task Four Step 5, 6, 8: Login Endpoint
 * Strict schema validation, whitespace trimming, and rate limiting.
 */
export async function POST(request: NextRequest) {
  const startTime = performance.now();

  // 1. Rate Limiting Check (Step 8)
  const rateLimit = checkRateLimit(request, 'login');
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many failed login attempts. Please wait 60 seconds before trying again.',
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

    // 2. Strict Zod Boundary Validation
    const result = loginSchema.safeParse(rawBody);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path.join('.') || 'root';
        fieldErrors[fieldName] = issue.message;
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed: Invalid credentials format.',
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = result.data;
    const elapsedMs = performance.now() - startTime;

    // Notice: Step 5 PIN is trimmed of whitespace, but characters are preserved
    return NextResponse.json(
      {
        success: true,
        message: 'Credentials format verified. Ready for database authentication.',
        phone: validData.phone,
        pinTrimmedLength: validData.pin.length,
        executionTimeMs: Number(elapsedMs.toFixed(2)),
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Malformed JSON payload.' },
      { status: 400 }
    );
  }
}

