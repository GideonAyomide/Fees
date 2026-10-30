import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'School Fees & Records | Crown Heights Academy',
    template: '%s | Crown Heights Academy',
  },
  description: 'Official school fee balances and receipts for registered families.',
  metadataBase: new URL('https://fees.crownheights.edu.ng'),
  openGraph: {
    title: 'Crown Heights Academy Fees',
    description: 'Official school fee balances and receipts for registered families.',
    url: 'https://fees.crownheights.edu.ng',
    siteName: 'Crown Heights Academy',
    locale: 'en_NG',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
