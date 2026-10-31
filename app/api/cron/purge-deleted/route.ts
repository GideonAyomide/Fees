import { NextRequest, NextResponse } from 'next/server';
import { executeScheduledAccountPurge } from '@/lib/account-deletion';

/**
 * Task Five Step 6: Scheduled Account Purge Endpoint
 * Idempotent cron handler that purges expired accounts past their 7-day grace period.
 * Adheres to NDPA/GDPR right to erasure while retaining legal tax and accounting ledgers.
 */
export async function POST(request: NextRequest) {
  // Optional cron authorization token check (for production Vercel Cron or Cloudflare Workers)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized cron invocation' }, { status: 401 });
  }

  try {
    const report = await executeScheduledAccountPurge();

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: 'Purge execution failed: ' + (err instanceof Error ? err.message : String(err)),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}

