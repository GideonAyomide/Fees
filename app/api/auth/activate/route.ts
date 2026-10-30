import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Task Three Stage: Naive endpoint accepting incoming payload directly
    // None of the client-side validation rules (ARIA, disabled button, terms checkbox, formatting) exist on this HTTP layer.
    return NextResponse.json(
      {
        success: true,
        message: 'Account activation accepted.',
        accountStatus: 'PROVISIONED',
        dataReceived: {
          phone: body.phone,
          studentId: body.studentId,
          slipCode: body.slipCode,
          acceptTerms: body.acceptTerms ?? null,
        },
        clientRulesEnforcedOnServer: 0,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ success: false, error: 'Malformed JSON payload.' }, { status: 400 });
  }
}

