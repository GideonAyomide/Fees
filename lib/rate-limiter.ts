import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory counter store for rate-limiting
const store = new Map<string, RateLimitRecord>();

/**
 * Task Four Step 8: Server-Side Rate Limiter
 * Window: 60,000 ms (1 minute)
 * Max Attempts: 5 requests per window per IP
 */
const WINDOW_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

export function checkRateLimit(request: NextRequest, action = 'auth'): {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  clientIp: string;
} {
  // Extract client IP address from request headers or default
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = (forwarded ? forwarded.split(',')[0].trim() : realIp) || '127.0.0.1';

  const key = `${action}:${clientIp}`;
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    // Window expired or new key: start fresh window
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return {
      allowed: true,
      remaining: MAX_ATTEMPTS - 1,
      resetSeconds: Math.ceil(WINDOW_MS / 1000),
      clientIp,
    };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const resetSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      resetSeconds,
      clientIp,
    };
  }

  record.count += 1;
  const resetSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - record.count,
    resetSeconds,
    clientIp,
  };
}

