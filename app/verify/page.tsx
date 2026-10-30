'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function VerifyPage() {
  const [email, setEmail] = useState('test-valid@crownheights.edu.ng');
  const [code, setCode] = useState('582910');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    status?: string;
    error?: string;
    message?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, error: 'Network communication error.' });
    } finally {
      setLoading(false);
    }
  };

  const loadScenario = (scenario: 'valid' | 'expired' | 'wrong' | 'reused') => {
    if (scenario === 'valid') {
      setEmail('test-valid@crownheights.edu.ng');
      setCode('582910');
    } else if (scenario === 'expired') {
      setEmail('test-expired@crownheights.edu.ng');
      setCode('839201');
    } else if (scenario === 'wrong') {
      setEmail('test-valid@crownheights.edu.ng');
      setCode('000000');
    } else if (scenario === 'reused') {
      setEmail('test-reused@crownheights.edu.ng');
      setCode('419082');
    }
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1F2937] py-12 px-4 flex flex-col items-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#2D7A5D]">Crown Heights Academy</span>
          <h1 className="text-2xl font-bold text-[#0F3D2E] mt-1">Verify Email Address</h1>
          <p className="text-xs text-slate-500 mt-1">
            Task Four Step 10: Verification lifecycle and refusal state verification.
          </p>
        </div>

        {/* Quick Test Fixtures */}
        <div className="mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="text-xs font-semibold text-slate-700 mb-2">Evidence Test Scenarios:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => loadScenario('expired')}
              className="py-1.5 px-2 bg-amber-50 text-amber-900 border border-amber-300 rounded hover:bg-amber-100 font-medium text-left"
            >
              1. Load Expired Code
            </button>
            <button
              type="button"
              onClick={() => loadScenario('wrong')}
              className="py-1.5 px-2 bg-rose-50 text-rose-900 border border-rose-300 rounded hover:bg-rose-100 font-medium text-left"
            >
              2. Load Wrong Code
            </button>
            <button
              type="button"
              onClick={() => loadScenario('reused')}
              className="py-1.5 px-2 bg-purple-50 text-purple-900 border border-purple-300 rounded hover:bg-purple-100 font-medium text-left"
            >
              3. Load Reused Code
            </button>
            <button
              type="button"
              onClick={() => loadScenario('valid')}
              className="py-1.5 px-2 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded hover:bg-emerald-100 font-medium text-left"
            >
              4. Load Valid Code
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Registered Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              6-Digit Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 582910"
              className="w-full px-3 py-2 text-lg tracking-widest text-center font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F3D2E]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-2.5 px-4 bg-[#0F3D2E] hover:bg-[#1A5C46] disabled:opacity-50 text-white font-medium rounded-md shadow-sm transition-colors text-sm"
          >
            {loading ? 'Verifying Code...' : 'Submit Verification Code'}
          </button>
        </form>

        {/* Status Announcements */}
        {result && (
          <div className="mt-6">
            {result.success ? (
              <div 
                id="verification-success-alert"
                className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-md text-sm"
              >
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <span>✓</span> Verification Successful
                </div>
                <div className="mt-1">{result.message}</div>
              </div>
            ) : (
              <div 
                id="verification-error-alert"
                className="p-4 bg-rose-50 border border-rose-300 text-rose-900 rounded-md text-sm"
              >
                <div className="font-bold flex items-center gap-1.5 text-rose-900">
                  <span>⚠</span> Verification Refusal ({result.status || 'ERROR'})
                </div>
                <div className="mt-1">{result.error}</div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
          <Link href="/auth?tab=login" className="hover:text-[#0F3D2E] underline">
            Back to Sign In
          </Link>
          <Link href="/email-preview" className="hover:text-[#0F3D2E] underline" target="_blank">
            View Rendered Email Preview →
          </Link>
        </div>
      </div>
    </div>
  );
}

