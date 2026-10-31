import { PrismaClient } from '@prisma/client';

/**
 * Determines whether a database error is due to an idle connection reset,
 * Neon scale-to-zero cold start, or network socket drop (e.g. Windows OS Error 10054).
 */
export function isTransientConnectionError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes('10054') ||
    msg.includes('ConnectionReset') ||
    msg.includes('forcibly closed') ||
    msg.includes('ECONNRESET') ||
    msg.includes("Can't reach database server") ||
    msg.includes('Engine closed') ||
    msg.includes('Connection pool timeout') ||
    msg.includes('Connection lost')
  );
}

/**
 * Ensures the connection URL includes safe timeout and SSL query parameters
 * for Neon serverless PostgreSQL compute instances.
 */
function getNormalizedDatabaseUrl(): string | undefined {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) return undefined;
  try {
    const parsed = new URL(rawUrl);
    let modified = false;
    if (!parsed.searchParams.has('sslmode')) {
      parsed.searchParams.set('sslmode', 'require');
      modified = true;
    }
    if (!parsed.searchParams.has('connect_timeout')) {
      parsed.searchParams.set('connect_timeout', '30');
      modified = true;
    }
    return modified ? parsed.toString() : rawUrl;
  } catch {
    return rawUrl;
  }
}

/**
 * Factory function creating a resilient PrismaClient with automatic
 * retry capabilities for transient serverless socket drops.
 */
function createPrismaClient() {
  const datasourceUrl = getNormalizedDatabaseUrl();
  const baseClient = new PrismaClient({
    datasourceUrl,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  return baseClient.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          try {
            return await query(args);
          } catch (error) {
            if (isTransientConnectionError(error)) {
              if (process.env.NODE_ENV === 'development') {
                console.warn(
                  `[Prisma Resilient Connection] Idle socket reset (10054) on ${model}.${operation}. Waking Neon compute and retrying in 1200ms...`
                );
              }
              // Wait 1200ms to allow Neon compute to wake from sleep and renegotiate TCP handshake
              await new Promise((resolve) => setTimeout(resolve, 1200));
              return await query(args);
            }
            throw error;
          }
        },
      },
    },
  });
}

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
