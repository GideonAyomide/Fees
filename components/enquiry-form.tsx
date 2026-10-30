'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

interface SubmissionResult {
  id: string;
  createdAt: string;
  status: string;
}

export function EnquiryForm() {
  const [parentPhone, setParentPhone] = useState('');
  const [studentName, setStudentName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentPhone, studentName, message }),
      });

      const data = await res.json();

      if (res.status === 201 && data.success) {
        setResult({
          id: data.id,
          createdAt: data.createdAt,
          status: data.status,
        });
        setMessage('');
      } else {
        setErrorMessage(data.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch {
      setErrorMessage('Network connection lost. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-on-surface)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '28.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link
            href="/"
            className="text-label-medium"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              alignSelf: 'flex-start',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            ← Back to Home
          </Link>
          <span
            className="text-label-medium"
            style={{
              color: 'var(--color-on-surface-variant)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Crown Heights Academy
          </span>
          <h1 className="text-headline-medium">Ask the School</h1>
          <p className="text-body-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
            Send a fee or policy enquiry directly to school staff.
          </p>
        </header>

        {result && (
          <div
            role="status"
            style={{
              padding: '1rem',
              backgroundColor: 'var(--color-surface-container)',
              border: '1px solid var(--color-primary)',
              borderRadius: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                }}
              />
              <span className="text-label-large" style={{ color: 'var(--color-primary)' }}>
                Enquiry Recorded (201 Created)
              </span>
            </div>
            <p className="text-body-medium">
              Your message was saved to school records. A staff member will review it shortly.
            </p>
            <div
              style={{
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                backgroundColor: 'var(--color-surface)',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.25rem',
                color: 'var(--color-on-surface-variant)',
                wordBreak: 'break-all',
              }}
            >
              <div><strong>Record ID:</strong> {result.id}</div>
              <div><strong>Timestamp:</strong> {result.createdAt}</div>
              <div><strong>Status:</strong> {result.status}</div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            style={{
              padding: '1rem',
              backgroundColor: 'var(--color-surface-container)',
              border: '1px solid var(--color-error)',
              borderRadius: '0.5rem',
              color: 'var(--color-error)',
            }}
          >
            <div className="text-label-large" style={{ marginBottom: '0.25rem' }}>
              Submission Error (500)
            </div>
            <p className="text-body-medium">{errorMessage}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            backgroundColor: 'var(--color-surface-container)',
            borderRadius: '0.75rem',
            border: '1px solid var(--color-outline-variant)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label htmlFor="parentPhone" className="text-label-medium">
              Parent Phone Number
            </label>
            <input
              id="parentPhone"
              type="tel"
              required
              placeholder="e.g. 08012345678"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              disabled={isSubmitting}
              style={{
                padding: '0.625rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--color-outline)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-on-surface)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label htmlFor="studentName" className="text-label-medium">
              Student Full Name
            </label>
            <input
              id="studentName"
              type="text"
              required
              placeholder="e.g. Michael Adebayo"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              disabled={isSubmitting}
              style={{
                padding: '0.625rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--color-outline)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-on-surface)',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label htmlFor="message" className="text-label-medium">
              Your Enquiry
            </label>
            <textarea
              id="message"
              required
              rows={4}
              placeholder="Write your fee question or message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              style={{
                padding: '0.625rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--color-outline)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-on-surface)',
                fontSize: '0.875rem',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="text-label-large"
            style={{
              marginTop: '0.5rem',
              padding: '0.875rem 1.5rem',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'opacity 0.15s ease',
            }}
          >
            {isSubmitting ? 'Sending to School...' : 'Submit Enquiry'}
          </button>
        </form>
      </div>
    </main>
  );
}

