import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Public Engineering Essay — Why We Made Password Hashing 21,000x Slower',
  description: 'Published engineering paper on defensive cryptography for low-end handsets.',
};

export default function ArticlePreviewPage() {
  const filePath = path.join(
    process.cwd(),
    'task-05-sessions-compliance-defence',
    'docs',
    'public-article.md'
  );

  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch {
    content = '# Article Not Found\nCould not load task-05-sessions-compliance-defence/docs/public-article.md';
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        color: '#E2E8F0',
        padding: '3rem 1.5rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '820px',
          margin: '0 auto',
          backgroundColor: '#1E293B',
          borderRadius: '16px',
          padding: '3rem',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid #334155',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
            }}
          />
          <span style={{ fontSize: '0.875rem', color: '#94A3B8', fontWeight: 600 }}>
            DEV.TO / SUBSTACK LIVE PUBLICATION PREVIEW
          </span>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.75rem',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontWeight: 700,
            }}
          >
            TASK FIVE: EVIDENCE 17
          </span>
        </div>

        <article style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap', fontSize: '1rem', color: '#CBD5E1' }}>
          {content}
        </article>
      </div>
    </div>
  );
}

