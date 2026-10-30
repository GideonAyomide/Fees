import { NextRequest, NextResponse } from 'next/server';
import { resetSchema } from '@/lib/auth-validation';
import { checkRateLimit } from '@/lib/rate-limiter';
import { performance } from 'perf_hooks';

/**
 * Task Four Step 6 & 8: PIN Reset Endpoint
 */
export async function POST(request: NextRequest) {
  const startTime = performance.now();

  const rateLimit = checkRateLimit(request, 'reset');
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many reset attempts. Please wait 60 seconds.',
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
    const result = resetSchema.safeParse(rawBody);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path.join('.') || 'root';
        fieldErrors[fieldName] = issue.message;
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed: Invalid reset request shape.',
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = result.data;
    const elapsedMs = performance.now() - startTime;

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset code queued for background delivery.',
        recipient: {
          phone: validData.phone,
          email: validData.email,
        },
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

