import { NextRequest, NextResponse } from 'next/server';
import { destroySession, SESSION_COOKIE_NAME, getSession } from '@/lib/session';

/**
 * Task Five Step 4: Server-Side Logout Route Handler
 * Ensures session is permanently destroyed in the server database,
 * not merely deleted in browser client memory.
 */
export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Verify session before destruction for audit logging
  const existingSession = token ? getSession(token) : null;

  if (token) {
    destroySession(token);
  }

  const isHtml = request.headers.get('accept')?.includes('text/html');

  const response = isHtml
    ? NextResponse.redirect(new URL('/auth?tab=login', request.url))
    : NextResponse.json({
        success: true,
        message: 'Logged out successfully. Server session destroyed.',
        sessionDestroyed: !!existingSession,
        phone: existingSession?.phone,
      });

  // Clear cookies on response
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });

  response.cookies.set({
    name: 'cha_staff_role',
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    destroySession(token);
  }

  const response = NextResponse.redirect(new URL('/auth?tab=login', request.url));

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });

  response.cookies.set({
    name: 'cha_staff_role',
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}

