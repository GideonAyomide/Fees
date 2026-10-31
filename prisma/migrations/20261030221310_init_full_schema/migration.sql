-- CreateTable
CREATE TABLE "Guardian" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "pinHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "failedPinAttempts" INTEGER NOT NULL DEFAULT 0,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guardian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "admissionNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "classLevel" TEXT NOT NULL,
    "guardianPhone" TEXT NOT NULL,
    "slipCodeHash" TEXT NOT NULL,
    "balanceKobo" BIGINT NOT NULL DEFAULT 0,
    "postedUpTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionTokenHash" TEXT NOT NULL,
    "guardianId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "amountKobo" BIGINT NOT NULL,
    "channel" TEXT NOT NULL,
    "flwTransactionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUCCESSFUL',
    "reconciled" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentAttempt" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "amountKobo" BIGINT NOT NULL,
    "channel" TEXT,
    "failureReason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ABANDONED',
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentPhone" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_phone_key" ON "Guardian"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Student_admissionNumber_key" ON "Student"("admissionNumber");

-- CreateIndex
CREATE INDEX "Student_guardianPhone_idx" ON "Student"("guardianPhone");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionTokenHash_key" ON "Session"("sessionTokenHash");

-- CreateIndex
CREATE INDEX "Session_guardianId_idx" ON "Session"("guardianId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reference_key" ON "Payment"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_flwTransactionId_key" ON "Payment"("flwTransactionId");

-- CreateIndex
CREATE INDEX "Payment_studentId_idx" ON "Payment"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentAttempt_reference_key" ON "PaymentAttempt"("reference");

-- CreateIndex
CREATE INDEX "PaymentAttempt_studentId_idx" ON "PaymentAttempt"("studentId");

-- CreateIndex
CREATE INDEX "PaymentAttempt_status_idx" ON "PaymentAttempt"("status");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_guardianPhone_fkey" FOREIGN KEY ("guardianPhone") REFERENCES "Guardian"("phone") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "Guardian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentAttempt" ADD CONSTRAINT "PaymentAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
