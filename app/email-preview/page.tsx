import React from 'react';
import { renderBrandedVerificationEmail } from '@/lib/email-service';

export const metadata = {
  title: 'Branded Email Verification Template Preview - Crown Heights Academy',
};

export default function EmailPreviewPage() {
  const emailHtml = renderBrandedVerificationEmail('582910', 'Mrs. Fatima Abubakar');

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <h1 className="text-xl font-bold text-[#2563EB]">Task Four Step 11: Branded Verification Email</h1>
        <p className="text-sm text-slate-600 mt-1">
          Rendered using Task One Design System Tokens (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">styles/tokens.css</code>): 
          Primary 40 (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">#2563EB</code> Royal Blue), 
          Primary Container (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">#DBE1FF</code>), 
          On-Primary Container (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">#003EA8</code>), 
          Surface (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">#F9F9FF</code>), and 
          On-Surface Charcoal (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">#161C25</code>).
        </p>
      </div>

      <div 
        className="w-full max-w-2xl bg-white rounded-lg shadow-md overflow-hidden border border-slate-200"
        dangerouslySetInnerHTML={{ __html: emailHtml }}
      />
    </div>
  );
}
