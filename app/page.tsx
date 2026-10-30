import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Official school fee balances and receipts for registered families.',
  keywords: [
    'Crown Heights Academy',
    'School Fees',
    'Term Balance',
    'Parent Portal',
    'Official Receipts',
  ],
};

export default function HomePage() {
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
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '28rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem',
        }}
      >
        {/* Linked Institutional Logo / Crest (Item 6: Logo links home) */}
        <Link
          href="/"
          aria-label="Crown Heights Academy Home"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
        >
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '0.75rem',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <span style={{ fontSize: '1.75rem' }} role="img" aria-label="Crown Crest">
              👑
            </span>
          </div>
        </Link>

        {/* Header with Responsive Clamp & Balanced Wrap (Items 1, 3 & 7) */}
        <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Note: Redundant uppercase subtitle removed per Item 1 */}
          <h1
            className="text-headline-large"
            style={{
              color: 'var(--color-on-surface)',
              fontSize: 'clamp(1.75rem, 5vw + 0.5rem, 2.375rem)',
              lineHeight: 1.2,
              letterSpacing: 'var(--typography-headline-large-letter-spacing)',
              maxWidth: '20rem',
              margin: '0 auto',
              textWrap: 'balance',
            }}
          >
            School Fees &amp; Official Records
          </h1>
        </header>

        {/* Orientation Statement */}
        <p
          className="text-body-large"
          style={{
            color: 'var(--color-on-surface-variant)',
            maxWidth: '22rem',
            lineHeight: 'var(--typography-body-large-line-height)',
            fontSize: '1rem',
          }}
        >
          Check your verified term balance, view official receipts, and make secure fee payments for your registered children.
        </p>

        {/* Actions Container: Collapsed Choice (Item 2) & Rem-Padded Buttons (Items 4, 5, 6) */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
            marginTop: '0.5rem',
          }}
        >
          {/* Collapsed Unified Primary Action (Item 2): Replaces separate Login & Activate buttons */}
          <button
            type="button"
            className="text-label-large"
            style={{
              width: '100%',
              padding: '0.9375rem 1.5rem',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              border: 'none',
              borderRadius: '0.75rem',
              boxShadow: 'var(--shadow-soft)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            Sign In or Activate with Phone
          </button>

          {/* Secondary Action: Ask the School */}
          <Link
            href="/enquiry"
            className="text-label-large"
            style={{
              width: '100%',
              padding: '0.875rem 1.5rem',
              backgroundColor: 'var(--color-surface-container)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-outline)',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              textAlign: 'center',
              display: 'block',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            Have a question? Ask the School →
          </Link>
        </div>

        {/* Bursar Official Record Notice */}
        <footer style={{ marginTop: '1rem' }}>
          <p
            className="text-body-small"
            style={{
              color: 'var(--color-on-surface-variant)',
              opacity: 0.85,
            }}
          >
            The bursar&apos;s book is the official record.
          </p>
        </footer>
      </div>
    </main>
  );
}
