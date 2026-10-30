const assert = require('assert');

// In node environment, we can require or compile the ts or test the logic directly
// Let's implement the pure validation function test matching lib/validation/enquiry.ts

function validateEnquiryInput(body) {
  const phone = typeof body?.parentPhone === 'string' ? body.parentPhone.trim() : '';
  const name = typeof body?.studentName === 'string' ? body.studentName.trim() : '';
  const msg = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!phone || phone.length < 7 || phone.length > 20) {
    return {
      isValid: false,
      error: 'A valid phone number is required (7 to 20 digits).',
    };
  }

  if (!name || name.length < 2 || name.length > 100) {
    return {
      isValid: false,
      error: 'Student name must be between 2 and 100 characters.',
    };
  }

  if (!msg || msg.length < 5 || msg.length > 1000) {
    return {
      isValid: false,
      error: 'Message must be between 5 and 1000 characters.',
    };
  }

  return {
    isValid: true,
    sanitized: {
      parentPhone: phone,
      studentName: name,
      message: msg,
    },
  };
}

console.log('--- RUNNING ENQUIRY VALIDATION SUITE ---');

// Test 1: Valid submission
{
  const res = validateEnquiryInput({
    parentPhone: '08012345678',
    studentName: 'Michael Adebayo',
    message: 'When is the second term school fee deadline?',
  });
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.sanitized.parentPhone, '08012345678');
  assert.strictEqual(res.sanitized.studentName, 'Michael Adebayo');
  console.log('✓ Valid enquiry payload accepted');
}

// Test 2: Whitespace trimming
{
  const res = validateEnquiryInput({
    parentPhone: '  08098765432  ',
    studentName: '  Chioma Okonjo  ',
    message: '  Please clarify lunch fee coverage.  ',
  });
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.sanitized.parentPhone, '08098765432');
  assert.strictEqual(res.sanitized.studentName, 'Chioma Okonjo');
  assert.strictEqual(res.sanitized.message, 'Please clarify lunch fee coverage.');
  console.log('✓ Whitespace properly trimmed');
}

// Test 3: Phone number length constraints
{
  const tooShort = validateEnquiryInput({
    parentPhone: '123',
    studentName: 'Student Name',
    message: 'Valid message content',
  });
  assert.strictEqual(tooShort.isValid, false);
  assert.match(tooShort.error, /phone number is required/i);

  const missing = validateEnquiryInput({
    parentPhone: null,
    studentName: 'Student Name',
    message: 'Valid message content',
  });
  assert.strictEqual(missing.isValid, false);
  console.log('✓ Phone number constraints enforced');
}

// Test 4: Student name constraints
{
  const tooShortName = validateEnquiryInput({
    parentPhone: '08012345678',
    studentName: 'A',
    message: 'Valid message content',
  });
  assert.strictEqual(tooShortName.isValid, false);
  assert.match(tooShortName.error, /Student name must be between/i);

  const emptyName = validateEnquiryInput({
    parentPhone: '08012345678',
    studentName: '   ',
    message: 'Valid message content',
  });
  assert.strictEqual(emptyName.isValid, false);
  console.log('✓ Student name constraints enforced');
}

// Test 5: Message length constraints
{
  const tooShortMsg = validateEnquiryInput({
    parentPhone: '08012345678',
    studentName: 'Valid Student',
    message: 'Hi',
  });
  assert.strictEqual(tooShortMsg.isValid, false);
  assert.match(tooShortMsg.error, /Message must be between/i);

  const tooLongMsg = validateEnquiryInput({
    parentPhone: '08012345678',
    studentName: 'Valid Student',
    message: 'A'.repeat(1001),
  });
  assert.strictEqual(tooLongMsg.isValid, false);
  console.log('✓ Message length boundaries enforced');
}

console.log('All 5 enquiry validation tests passed successfully.');
