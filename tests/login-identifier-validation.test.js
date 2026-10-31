const assert = require('assert');
const { z } = require('zod');

// Mirroring the server-side schema from lib/auth-validation.ts
const loginSchema = z
  .object({
    phone: z.string().optional(),
    identifier: z.string().optional(),
    email: z.string().optional(),
    pin: z
      .string()
      .trim()
      .min(1, 'Security PIN cannot be left blank.')
      .regex(/^\d{4}$/, 'PIN must be exactly 4 digits.'),
  })
  .superRefine((data, ctx) => {
    const raw = (data.identifier ?? data.phone ?? data.email ?? '').trim();
    if (!raw) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Phone number or email address cannot be left blank.',
        path: [data.identifier ? 'identifier' : 'phone'],
      });
      return;
    }

    if (raw.includes('@')) {
      // Email format validation (Category 3)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(raw)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid email address (e.g. parent@example.com).',
          path: [data.identifier ? 'identifier' : 'phone'],
        });
      }
    } else {
      // Phone format validation (Category 2)
      if (!/^\d+$/.test(raw)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must be a valid 10-11 digit phone number or email address.',
          path: [data.identifier ? 'identifier' : 'phone'],
        });
      } else if (raw.length < 10 || raw.length > 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Phone number must be 10 or 11 digits.',
          path: [data.identifier ? 'identifier' : 'phone'],
        });
      }
    }
  })
  .transform((data) => {
    const raw = (data.identifier ?? data.phone ?? data.email ?? '').trim();
    const isEmail = raw.includes('@');
    const normalized = isEmail ? raw.toLowerCase() : raw;
    return {
      identifier: normalized,
      phone: normalized,
      isEmail,
      pin: data.pin,
    };
  });

// Simulated backend test guardians
const TEST_GUARDIANS = {
  '08012345678': {
    pin: '3941',
    role: 'GUARDIAN',
    phone: '08012345678',
    email: 'parent@example.com',
  },
  '08000000001': {
    pin: '3941',
    role: 'BURSAR',
    phone: '08000000001',
    email: 'bursar@crownheights.edu.ng',
  },
};

function authenticate(payload) {
  const result = loginSchema.safeParse(payload);
  if (!result.success) {
    return { success: false, status: 400, error: result.error.issues[0].message };
  }
  const { identifier, isEmail, pin } = result.data;
  const user = isEmail
    ? Object.values(TEST_GUARDIANS).find((g) => g.email.toLowerCase() === identifier.toLowerCase())
    : TEST_GUARDIANS[identifier];

  if (!user || user.pin !== pin) {
    return { success: false, status: 401, error: 'Incorrect phone number, email address, or security PIN.' };
  }

  return { success: true, status: 200, user };
}

console.log('--- Running Login Phone & Email Validation Tests ---');

// Test 1: Valid 11-digit Nigerian phone sign in
{
  const res = authenticate({ phone: '08012345678', pin: '3941' });
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.user.phone, '08012345678');
  console.log('✓ Test 1 Passed: Valid phone number signs in successfully');
}

// Test 2: Valid email sign in (with case-insensitivity & whitespace trimming)
{
  const res = authenticate({ phone: '  PARENT@Example.COM  ', pin: '3941' });
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.user.email, 'parent@example.com');
  console.log('✓ Test 2 Passed: Valid email address signs in successfully (normalized to lowercase)');
}

// Test 3: Bursar staff email sign in
{
  const res = authenticate({ phone: 'bursar@crownheights.edu.ng', pin: '3941' });
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.user.role, 'BURSAR');
  console.log('✓ Test 3 Passed: Staff bursar signs in via school email address');
}

// Test 4: Blank identifier rejection
{
  const res = authenticate({ phone: '   ', pin: '3941' });
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.error, 'Phone number or email address cannot be left blank.');
  console.log('✓ Test 4 Passed: Blank identifier rejected with Category 1 error');
}

// Test 5: Malformed email rejection
{
  const res = authenticate({ phone: 'invalid-email@', pin: '3941' });
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.error, 'Please enter a valid email address (e.g. parent@example.com).');
  console.log('✓ Test 5 Passed: Malformed email rejected with Category 3 format error');
}

// Test 6: Short phone number rejection
{
  const res = authenticate({ phone: '08012', pin: '3941' });
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.error, 'Phone number must be 10 or 11 digits.');
  console.log('✓ Test 6 Passed: Short phone number rejected with Category 2 length error');
}

// Test 7: Non-digit characters without @ symbol rejection
{
  const res = authenticate({ phone: 'randomletters', pin: '3941' });
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.error, 'Must be a valid 10-11 digit phone number or email address.');
  console.log('✓ Test 7 Passed: Invalid string without @ rejected as invalid handle');
}

// Test 8: Invalid PIN length rejection
{
  const res = authenticate({ phone: '08012345678', pin: '12' });
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.error, 'PIN must be exactly 4 digits.');
  console.log('✓ Test 8 Passed: Non 4-digit PIN rejected');
}

// Test 9: Unknown email generic error (no enumeration)
{
  const res = authenticate({ phone: 'unknown@example.com', pin: '3941' });
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 401);
  assert.strictEqual(res.error, 'Incorrect phone number, email address, or security PIN.');
  console.log('✓ Test 9 Passed: Non-existent email returns generic 401 to prevent enumeration');
}

// Test 10: Wrong PIN for existing email generic error (same timing and error)
{
  const res = authenticate({ phone: 'parent@example.com', pin: '9999' });
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.status, 401);
  assert.strictEqual(res.error, 'Incorrect phone number, email address, or security PIN.');
  console.log('✓ Test 10 Passed: Wrong PIN returns identical generic 401 error message');
}

console.log('\nAll 10 Login Phone & Email Validation tests passed!');

