import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Parent Dashboard | Crown Heights Academy Fees',
  description: 'Verified student term fee balance, line items, and official payment receipts',
};

export default function ParentDashboardPage() {
  // Demonstration student financial partition data (whole kobo integers)
  const student = {
    fullName: 'Fatima Abubakar',
    admissionNumber: 'JSS1/042',
    classLevel: 'JSS 1B',
    balanceKobo: BigInt(15000000), // ₦150,000.00 in whole kobo
    postedUpTo: '2026-10-24T12:00:00Z',
  };

  const balanceNaira = (Number(student.balanceKobo) / 100).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedPostedDate = new Date(student.postedUpTo).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const feeItems = [
    { name: 'Tuition Fee (Term 1)', amount: '₦95,000.00', status: 'UNPAID' },
    { name: 'Development Levy', amount: '₦25,000.00', status: 'UNPAID' },
    { name: 'Science & Computer Lab Levy', amount: '₦15,000.00', status: 'UNPAID' },
    { name: 'PTA Termly Contribution', amount: '₦10,000.00', status: 'UNPAID' },
    { name: 'Sports & Healthcare Facilities', amount: '₦5,000.00', status: 'UNPAID' },
  ];

  const receipts = [
    {
      id: 'rcpt_001',
      date: '12 Sep 2026',
      amount: '₦50,000.00',
      ref: 'FLW-CH-948214',
      type: 'Online Card Payment',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface, #F9F9FF)',
        color: 'var(--color-on-surface, #161C25)',
        fontFamily: 'DM Sans, system-ui, sans-serif',
      }}
    >
      {/* Top Brand Navigation Header */}
      <header
        style={{
          backgroundColor: 'var(--color-primary, #2563EB)',
          color: 'var(--color-on-primary, #FFFFFF)',
          padding: '1rem 1.5rem',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <div
          style={{
            maxWidth: '56rem',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}
            >
              👑
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                Crown Heights Academy
              </h1>
              <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>Official Parent Fees Portal</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '0.25rem 0.625rem',
                borderRadius: '9999px',
                fontWeight: 600,
              }}
            >
              Guardian Session
            </span>
            <Link
              href="/auth?tab=login"
              style={{
                fontSize: '0.8125rem',
                color: 'white',
                textDecoration: 'underline',
                fontWeight: 500,
              }}
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '56rem', margin: '2rem auto', padding: '0 1rem' }}>
        {/* Student Profile Identity Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-outline, #DEE2F1)',
            borderRadius: '0.75rem',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-soft)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant, #424752)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Registered Student File
            </div>
            <h2 style={{ margin: '0.25rem 0 0', fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-primary, #2563EB)' }}>
              {student.fullName}
            </h2>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant, #424752)', marginTop: '0.25rem' }}>
              Admission No: <strong>{student.admissionNumber}</strong> · Class: <strong>{student.classLevel}</strong>
            </div>
          </div>

          {/* "Posted Up To" Official Stamp (PRD Section 6.2 & 8.7) */}
          <div
            style={{
              backgroundColor: 'var(--color-primary-container, #DBE1FF)',
              color: 'var(--color-on-primary-container, #003EA8)',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #C4D0F8',
              fontSize: '0.75rem',
              textAlign: 'right',
            }}
          >
            <div style={{ fontWeight: 600 }}>Official Bursar Stamp</div>
            <div style={{ fontSize: '0.7rem', marginTop: '0.125rem' }}>
              Ledger verified up to: <strong>{formattedPostedDate}</strong>
            </div>
          </div>
        </div>

        {/* Feature 1: What Do I Owe? (Balance Card with DM Sans Display Large) */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid var(--color-primary, #2563EB)',
            borderRadius: '0.75rem',
            padding: '2rem 1.5rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-medium)',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
              color: 'var(--color-on-surface-variant, #424752)',
            }}
          >
            Verified Outstanding Balance
          </span>

          {/* DM Sans Display Large (32px / 40px line-height per Task One tokens) */}
          <div
            className="text-display-large"
            style={{
              fontSize: '2rem',
              lineHeight: '2.5rem',
              fontWeight: 800,
              color: 'var(--color-primary, #2563EB)',
              marginTop: '0.5rem',
              letterSpacing: '-0.02em',
            }}
          >
            ₦{balanceNaira}
          </div>

          <p style={{ fontSize: '0.8125rem', color: 'var(--color-on-surface-variant, #424752)', marginTop: '0.5rem' }}>
            Payments made after {formattedPostedDate} will appear after the Bursar’s Friday reconciliation.
          </p>

          {/* Payment Action Button */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              style={{
                backgroundColor: 'var(--color-primary, #2563EB)',
                color: 'var(--color-on-primary, #FFFFFF)',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.875rem 2rem',
                fontSize: '0.9375rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-soft)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>💳</span> Pay Tuition via Flutterwave
            </button>

            {/* Talk to a Person / This Looks Wrong Button (Feature 5) */}
            <a
              href="mailto:bursar@crownheights.edu.ng?subject=Fee%20Query%20for%20Fatima%20Abubakar%20(JSS1/042)"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-primary, #2563EB)',
                border: '1px solid var(--color-primary, #2563EB)',
                borderRadius: '0.5rem',
                padding: '0.875rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>📞</span> This Looks Wrong (Contact Bursar)
            </a>
          </div>
        </section>

        {/* Feature 1 & 2: Line Items Breakdown & Official Receipts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Fee Line Items */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-outline, #DEE2F1)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: 'var(--color-on-surface, #161C25)' }}>
              Current Term Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {feeItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '0.75rem',
                    borderBottom: idx === feeItems.length - 1 ? 'none' : '1px solid var(--color-outline-variant, #EEF0FF)',
                    fontSize: '0.875rem',
                  }}
                >
                  <span style={{ color: 'var(--color-on-surface, #161C25)' }}>{item.name}</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-on-surface, #161C25)' }}>{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 2: Official Receipts (Offline Viewable) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-outline, #DEE2F1)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-on-surface, #161C25)' }}>
                Official Payment Receipts
              </h3>
              <span style={{ fontSize: '0.6875rem', color: '#16A34A', fontWeight: 600 }}>✓ Verified</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {receipts.map((rcpt) => (
                <div
                  key={rcpt.id}
                  style={{
                    backgroundColor: 'var(--color-surface, #F9F9FF)',
                    border: '1px solid var(--color-outline, #DEE2F1)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-primary, #2563EB)' }}>
                      {rcpt.amount}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant, #424752)' }}>{rcpt.date}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-on-surface-variant, #424752)', marginTop: '0.25rem' }}>
                    Ref: <code>{rcpt.ref}</code> · {rcpt.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
