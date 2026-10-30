import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateEnquiryInput, EnquiryInput } from '@/lib/validation/enquiry';

export async function POST(request: NextRequest) {
  try {
    const body: EnquiryInput = await request.json();

    // Server-side validation (security.md: Validate every input on the server before use)
    const validation = validateEnquiryInput(body);
    if (!validation.isValid || !validation.sanitized) {
      return NextResponse.json(
        { success: false, error: validation.error || 'Invalid input.' },
        { status: 400 }
      );
    }

    const { parentPhone, studentName, message } = validation.sanitized;

    // Persist enquiry to PostgreSQL via Prisma
    const enquiry = await prisma.enquiry.create({
      data: {
        parentPhone,
        studentName,
        message,
      },
    });

    // Return 201 Created with record metadata (Step 6 verification)
    return NextResponse.json(
      {
        success: true,
        id: enquiry.id,
        createdAt: enquiry.createdAt.toISOString(),
        status: enquiry.status,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    // Log error internally (without leaking sensitive data to client)
    console.error('[API /api/enquiry POST error]:', err instanceof Error ? err.message : 'Unknown database error');

    // Never return raw SQL, stack traces, or credentials to client (security.md Rule 8)
    return NextResponse.json(
      {
        success: false,
        error: 'The school records service is currently unavailable. Please try again later or contact the bursar directly.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        createdAt: true,
        studentName: true,
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (err: unknown) {
    console.error('[API /api/enquiry GET error]:', err instanceof Error ? err.message : 'Unknown database error');
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to retrieve records at this time.',
      },
      { status: 500 }
    );
  }
}
