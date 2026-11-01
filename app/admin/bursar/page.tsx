import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Bursar Administration | Crown Heights Academy Fees',
  description: 'Internal ledger, fee management, and access code administration portal',
};

export default function BursarAdminPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface, #F9F9FF)',
        color: 'var(--color-on-surface, #161C25)',
        fontFamily: 'DM Sans, system-ui, sans-serif',
      }}
    >
      {/* Top Navigation Header: Royal Blue (--color-primary) */}
      <header
        style={{
          backgroundColor: 'var(--color-primary, #2563EB)',
          color: 'var(--color-on-primary, #FFFFFF)',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-soft)',
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
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Crown Heights Academy
            </h1>
            <p style={{ margin: 0, fontSize: '0.8125rem', opacity: 0.9 }}>
              Internal Staff Portal — Bursar Financial Administration
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '0.25rem 0.625rem',
              borderRadius: '9999px',
              fontWeight: 600,
            }}
          >
            Role: BURSAR
          </span>
          <Link
            href="/auth?tab=login"
            style={{
              color: 'white',
              fontSize: '0.8125rem',
              textDecoration: 'underline',
              fontWeight: 500,
            }}
          >
            Sign Out
          </Link>
        </div>
      </header>

      {/* Main Workspace */}
      <main style={{ maxWidth: '64rem', margin: '2rem auto', padding: '0 1.5rem' }}>
        {/* Security / Verification Banner (Primary Container) */}
        <div
          style={{
            backgroundColor: 'var(--color-primary-container, #DBE1FF)',
            border: '1px solid #C4D0F8',
            padding: '1rem 1.25rem',
            borderRadius: '0.75rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-on-primary-container, #003EA8)', fontWeight: 700, fontSize: '0.875rem' }}>
              ✓ Authorised Staff Session Verified
            </span>
          </div>
          <p style={{ margin: '0.375rem 0 0', fontSize: '0.8125rem', color: 'var(--color-on-primary-container, #003EA8)', lineHeight: 1.5 }}>
            This administrative route enforces role-based authorisation. Ordinary parent sessions visiting this link are rejected with HTTP 403 Forbidden.
          </p>
        </div>

        {/* Operational Modules Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Module 1: Daily Close & Ledger Stamp */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-outline, #DEE2F1)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-primary, #2563EB)' }}>
              1. Ledger "Posted Up To" Stamp
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-on-surface-variant, #424752)', lineHeight: 1.5 }}>
              Stamp the official paper ledger reconciliation date. Parents see balances updated up to this exact timestamp.
            </p>
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: 'var(--color-surface, #F9F9FF)',
                border: '1px solid var(--color-outline, #DEE2F1)',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
              }}
            >
              <strong>Current Stamp:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} (Reconciled)
            </div>
            <button
              style={{
                marginTop: '1rem',
                width: '100%',
                padding: '0.625rem',
                backgroundColor: 'var(--color-primary, #2563EB)',
                color: 'var(--color-on-primary, #FFFFFF)',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              Update Posted Up To Stamp
            </button>
          </div>

          {/* Module 2: Access Slips Generation */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-outline, #DEE2F1)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-primary, #2563EB)' }}>
              2. Issue Parent Access Slips
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-on-surface-variant, #424752)', lineHeight: 1.5 }}>
              Generate cryptographic 6-digit access slip codes for student enrolments, validated against breached-credential lists.
            </p>
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: 'var(--color-surface, #F9F9FF)',
                border: '1px solid var(--color-outline, #DEE2F1)',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
              }}
            >
              <strong>Active Unclaimed Slips:</strong> 5 Verified Codes Available
            </div>
            <button
              style={{
                marginTop: '1rem',
                width: '100%',
                padding: '0.625rem',
                backgroundColor: 'var(--color-primary, #2563EB)',
                color: 'var(--color-on-primary, #FFFFFF)',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              Generate Batch Slips (CSV)
            </button>
          </div>

          {/* Module 3: Scheduled Deletion Audit */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-outline, #DEE2F1)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-primary, #2563EB)' }}>
              3. Data Privacy & Erasure Audit
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-on-surface-variant, #424752)', lineHeight: 1.5 }}>
              Review soft-deleted parent accounts under the 7-day NDPA cooling-off period and verify financial ledger retention.
            </p>
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: 'var(--color-surface, #F9F9FF)',
                border: '1px solid var(--color-outline, #DEE2F1)',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
              }}
            >
              <strong>Grace Period Status:</strong> 0 Pending Immediate Purge
            </div>
            <Link
              href="/api/cron/purge-deleted"
              target="_blank"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '1rem',
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.625rem',
                backgroundColor: 'var(--color-on-surface-variant, #424752)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
              }}
            >
              Trigger Idempotent Cron Purge
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
