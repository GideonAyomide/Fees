import { NextRequest, NextResponse } from 'next/server';
import { getSession, SESSION_COOKIE_NAME, getActiveSessionCount } from '@/lib/session';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { authenticated: false, error: 'No session cookie present.' },
      { status: 401 }
    );
  }

  const session = getSession(token);
  if (!session) {
    return NextResponse.json(
      { authenticated: false, error: 'Session expired or invalidated on server.' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    session: {
      id: session.id,
      phone: session.phone,
      role: session.role,
      expiresAt: new Date(session.expiresAt).toISOString(),
    },
    totalActiveServerSessions: getActiveSessionCount(),
  });
}

