'use client';

import { useState } from 'react';

interface SignOutButtonProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

export function SignOutButton({ className, style, label = 'Sign Out' }: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.warn('[Logout]: Network error during logout call', err);
    } finally {
      // Hard navigation to login ensures all cookies and memory states reset completely
      window.location.href = '/auth?tab=login';
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={className}
      aria-label="Sign out of your session"
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        margin: 0,
        font: 'inherit',
        color: 'white',
        fontSize: '0.8125rem',
        textDecoration: 'underline',
        fontWeight: 500,
        cursor: loading ? 'wait' : 'pointer',
        opacity: loading ? 0.7 : 1,
        ...style,
      }}
    >
      {loading ? 'Signing out...' : label}
    </button>
  );
}

