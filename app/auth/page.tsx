import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AuthUnifiedForm } from '@/components/auth-unified-form';

export const metadata: Metadata = {
  title: 'Parent Sign In & Activation',
  description: 'Access verified school fee balances and official receipts.',
};

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-on-surface-variant)',
          }}
        >
          <div className="text-body-medium">Loading portal authentication...</div>
        </main>
      }
    >
      <AuthUnifiedForm />
    </Suspense>
  );
}

