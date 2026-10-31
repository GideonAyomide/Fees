/**
 * Database Activation Persistence Integration Test
 * Label: not run: needs a database
 * 
 * Command for human to run after running 'npx prisma db push':
 *   node tests/db-activation-persistence.test.js
 */

const { PrismaClient } = require('@prisma/client');
const assert = require('assert');

const prisma = new PrismaClient();

async function runTest() {
  console.log('--- Testing PostgreSQL Guardian & Student Activation Persistence ---');

  const testPhone = '08099887766';
  const testEmail = 'persistence_test@crownheights.edu.ng';
  const testAdmissionNo = 'CHA/2026/TEST01';
  const dummyPinHash = '$argon2id$v=19$m=65536,t=3,p=4$dGVzdHNhbHQxMjM0NTY3OA$Fm184F/2u8GkQfA4wY8q+eK2O7I2B1jF3gW9uC1k0bU';

  try {
    // 1. Clean up any existing test records
    await prisma.student.deleteMany({ where: { admissionNumber: testAdmissionNo } });
    await prisma.guardian.deleteMany({ where: { phone: testPhone } });

    // 2. Create Guardian with phone and email
    const guardian = await prisma.guardian.create({
      data: {
        phone: testPhone,
        email: testEmail,
        pinHash: dummyPinHash,
        status: 'ACTIVE',
        termsAccepted: true,
      },
    });

    assert.ok(guardian.id, 'Guardian ID should be created');
    assert.strictEqual(guardian.phone, testPhone);
    assert.strictEqual(guardian.email, testEmail);
    console.log('✓ Step 1 Passed: Guardian persisted with phone and email');

    // 3. Link Student record
    const student = await prisma.student.create({
      data: {
        admissionNumber: testAdmissionNo,
        fullName: 'Test Student One',
        classLevel: 'JSS1',
        guardianPhone: guardian.phone,
        slipCodeHash: 'dummy_slip_hash',
        balanceKobo: BigInt(5000000), // 50,000 Naira in kobo
      },
    });

    assert.ok(student.id, 'Student record created');
    assert.strictEqual(student.guardianPhone, testPhone);
    console.log('✓ Step 2 Passed: Student linked to guardian');

    // 4. Verify lookup by email (Case-insensitive)
    const lookedUpByEmail = await prisma.guardian.findFirst({
      where: { email: { equals: testEmail.toUpperCase(), mode: 'insensitive' } },
    });
    assert.ok(lookedUpByEmail, 'Guardian should be retrievable by email');
    assert.strictEqual(lookedUpByEmail.id, guardian.id);
    console.log('✓ Step 3 Passed: Guardian retrieved by case-insensitive email');

    // 5. Clean up
    await prisma.student.deleteMany({ where: { admissionNumber: testAdmissionNo } });
    await prisma.guardian.deleteMany({ where: { phone: testPhone } });
    console.log('✓ Step 4 Passed: Cleaned up test records');

    console.log('\nAll Database Activation Persistence tests PASSED!');
  } catch (error) {
    console.error('Test failed with error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();

