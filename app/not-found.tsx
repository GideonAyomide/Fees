import Link from 'next/link';

export default function NotFound() {
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
        color: 'var(--color-on-surface)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
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
        <h1 className="text-headline-medium">Page Not Found</h1>
        <p
          className="text-body-medium"
          style={{
            color: 'var(--color-on-surface-variant)',
          }}
        >
          The page or record you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="text-label-large"
          style={{
            marginTop: '8px',
            padding: '12px 24px',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-soft)',
            display: 'inline-block',
          }}
        >
          Return to Portal Home
        </Link>
      </div>
    </main>
  );
}

