const { describe, it } = require('node:test');
const assert = require('node:assert');

function isTransientConnectionError(error) {
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes('10054') ||
    msg.includes('ConnectionReset') ||
    msg.includes('forcibly closed') ||
    msg.includes('ECONNRESET') ||
    msg.includes("Can't reach database server") ||
    msg.includes('Engine closed') ||
    msg.includes('Connection pool timeout')
  );
}

describe('Transient Connection Error Detection and Retry', () => {
  it('correctly flags OS Error 10054 as transient', () => {
    const err = new Error(
      'prisma:error Error in PostgreSQL connection: Error { kind: Io, cause: Some(Os { code: 10054, kind: ConnectionReset, message: "An existing connection was forcibly closed by the remote host." }) }'
    );
    assert.strictEqual(isTransientConnectionError(err), true);
  });

  it('correctly ignores non-connection application errors', () => {
    const err = new Error('Unique constraint failed on the fields: (`phone`)');
    assert.strictEqual(isTransientConnectionError(err), false);
  });

  it('retries automatically on 10054 and succeeds on subsequent attempt', async () => {
    let callCount = 0;
    async function testQuery() {
      callCount++;
      if (callCount === 1) {
        throw new Error(
          'prisma:error Error in PostgreSQL connection: Error { kind: Io, cause: Some(Os { code: 10054, kind: ConnectionReset, message: "An existing connection was forcibly closed by the remote host." }) }'
        );
      }
      return { id: 'g-test-uuid', phone: '08012345678' };
    }

    async function executeWithRetry(fn, maxRetries = 2, delayMs = 50) {
      let attempts = 0;
      while (true) {
        try {
          return await fn();
        } catch (err) {
          attempts++;
          if (attempts <= maxRetries && isTransientConnectionError(err)) {
            await new Promise((r) => setTimeout(r, delayMs));
            continue;
          }
          throw err;
        }
      }
    }

    const res = await executeWithRetry(testQuery);
    assert.strictEqual(callCount, 2);
    assert.strictEqual(res.phone, '08012345678');
  });
});

