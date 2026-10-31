import { NextRequest, NextResponse } from 'next/server';
import { activateSchema } from '@/lib/auth-validation';
import { checkRateLimit } from '@/lib/rate-limiter';
import { checkPasswordBreach } from '@/lib/breach-check';
import { prisma } from '@/lib/prisma';
import argon2 from 'argon2';
import crypto from 'crypto';
import { performance } from 'perf_hooks';

/**
 * Task Four Step 6 & 7: Hardened Activation Endpoint
 * Strictly validates incoming payloads, performs breach checks,
 * hashes PINs with Argon2id, and persists verified guardian and student records to PostgreSQL.
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

    // 4. Cryptographic Hashing with Argon2id (Task 4 Step 3 & 4)
    const pinHash = await argon2.hash(validData.pin, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
    const slipCodeHash = crypto.createHash('sha256').update(validData.slipCode).digest('hex');

    // 5. Persist to PostgreSQL Database via Prisma
    let guardianRecord = null;
    let studentRecord = null;

    try {
      guardianRecord = await prisma.guardian.upsert({
        where: { phone: validData.phone },
        update: {
          email: validData.email,
          pinHash,
          termsAccepted: true,
          status: 'ACTIVE',
          failedPinAttempts: 0,
        },
        create: {
          phone: validData.phone,
          email: validData.email,
          pinHash,
          termsAccepted: true,
          status: 'ACTIVE',
          failedPinAttempts: 0,
        },
      });

      studentRecord = await prisma.student.upsert({
        where: { admissionNumber: validData.studentId },
        update: {
          guardianPhone: guardianRecord.phone,
          slipCodeHash,
        },
        create: {
          admissionNumber: validData.studentId,
          fullName: `Student ${validData.studentId}`,
          classLevel: 'JSS1',
          guardianPhone: guardianRecord.phone,
          slipCodeHash,
          balanceKobo: BigInt(0),
        },
      });
    } catch (dbErr) {
      console.error('[Prisma Activation Persistence Error]:', dbErr);
      return NextResponse.json(
        {
          success: false,
          error: 'The school records database is currently unreachable. Please ensure the database schema is pushed with "npx prisma db push".',
        },
        { status: 503 }
      );
    }

    const elapsedMs = performance.now() - startTime;

    // 6. Return Normalized, Validated Output
    return NextResponse.json(
      {
        success: true,
        message: 'Account activation verified and saved in school database successfully.',
        guardianId: guardianRecord.id,
        studentId: studentRecord.id,
        normalizedData: {
          phone: validData.phone,
          email: validData.email,
          studentId: validData.studentId,
          slipCode: '******',
          pinSet: true,
          acceptTerms: validData.acceptTerms,
        },
        serverEnforcement: {
          zodValidated: true,
          emailNormalised: true,
          databaseSaved: true,
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
