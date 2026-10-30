export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px 16px',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px',
        }}
      >
        {/* Institutional Header */}
        <header style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span
            className="text-label-medium"
            style={{
              color: 'var(--color-on-surface-variant)',
              letterSpacing: 'var(--typography-label-medium-letter-spacing)',
              textTransform: 'uppercase',
            }}
          >
            Crown Heights Academy
          </span>
          <h1
            className="text-headline-large"
            style={{
              color: 'var(--color-on-surface)',
              letterSpacing: 'var(--typography-headline-large-letter-spacing)',
            }}
          >
            School Fees & Records
          </h1>
        </header>

        {/* Orientation Statement */}
        <p
          className="text-body-large"
          style={{
            color: 'var(--color-on-surface-variant)',
            maxWidth: '360px',
            lineHeight: 'var(--typography-body-large-line-height)',
          }}
        >
          Check your verified term balance, view official receipts, and make secure fee payments for your registered children.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '8px',
          }}
        >
          <button
            type="button"
            className="text-label-large"
            style={{
              width: '100%',
              padding: '16px 20px',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-soft)',
              transition: 'box-shadow 0.2s ease',
            }}
          >
            Sign In with Phone &amp; PIN
          </button>

          <button
            type="button"
            className="text-label-large"
            style={{
              width: '100%',
              padding: '14px 20px',
              backgroundColor: 'var(--color-surface-container)',
              color: 'var(--color-on-surface)',
              border: '1px solid var(--color-outline)',
              borderRadius: '12px',
            }}
          >
            Activate Account with Slip Code
          </button>
        </div>

        {/* Bursar Official Record Notice */}
        <footer style={{ marginTop: '16px' }}>
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

