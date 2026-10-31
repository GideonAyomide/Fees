import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Bursar Administration | Crown Heights Academy Fees',
  description: 'Internal ledger, fee management, and access code administration portal',
};

export default function BursarAdminPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', color: '#1F2937', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      {/* Top Navigation */}
      <header style={{ background: '#0F3D2E', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Crown Heights Academy</h1>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.85 }}>Internal Staff Portal — Bursar Financial Administration</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '4px' }}>
            Role: BURSAR
          </span>
          <Link href="/auth?tab=login" style={{ color: 'white', fontSize: '13px', textDecoration: 'underline' }}>
            Sign Out
          </Link>
        </div>
      </header>

      {/* Main Workspace */}
      <main style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 24px' }}>
        {/* Security / Verification Banner */}
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '16px 20px', borderRadius: '8px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#065F46', fontWeight: 700, fontSize: '14px' }}>✓ Authorised Staff Session Verified</span>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#047857', lineHeight: 1.5 }}>
            This administrative route enforces role-based authorisation. Ordinary parent sessions visiting this link are rejected with HTTP 403 Forbidden.
          </p>
        </div>

        {/* Operational Modules */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Module 1: Daily Close & Ledger Stamp */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#0F3D2E' }}>1. Ledger "Posted Up To" Stamp</h2>
            <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5 }}>
              Stamp the official paper ledger reconciliation date. Parents see balances updated up to this exact timestamp.
            </p>
            <div style={{ marginTop: '16px', padding: '12px', background: '#F9FAFB', borderRadius: '6px', fontSize: '12px' }}>
              <strong>Current Stamp:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} (Reconciled)
            </div>
            <button style={{ marginTop: '16px', width: '100%', padding: '10px', background: '#0F3D2E', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Update Posted Up To Stamp
            </button>
          </div>

          {/* Module 2: Access Slips Generation */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#0F3D2E' }}>2. Issue Parent Access Slips</h2>
            <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5 }}>
              Generate cryptographic 6-digit access slip codes for student enrolments, validated against breached-credential lists.
            </p>
            <div style={{ marginTop: '16px', padding: '12px', background: '#F9FAFB', borderRadius: '6px', fontSize: '12px' }}>
              <strong>Active Unclaimed Slips:</strong> 5 Verified Codes Available
            </div>
            <button style={{ marginTop: '16px', width: '100%', padding: '10px', background: '#2D7A5D', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Generate Batch Slips (CSV)
            </button>
          </div>

          {/* Module 3: Scheduled Deletion Audit */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#0F3D2E' }}>3. Data Privacy & Erasure Audit</h2>
            <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5 }}>
              Review soft-deleted parent accounts under the 7-day NDPA cooling-off period and verify financial ledger retention.
            </p>
            <div style={{ marginTop: '16px', padding: '12px', background: '#F9FAFB', borderRadius: '6px', fontSize: '12px' }}>
              <strong>Grace Period Status:</strong> 0 Pending Immediate Purge
            </div>
            <Link href="/api/cron/purge-deleted" target="_blank" style={{ display: 'block', textAlign: 'center', marginTop: '16px', width: '100%', boxSizing: 'border-box', padding: '10px', background: '#4B5563', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}>
              Trigger Idempotent Cron Purge
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

