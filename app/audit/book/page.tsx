'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import AuditCheckout from '@/components/payments/AuditCheckout';
import { flags } from '@/lib/flags';

export default function AuditBookPage() {
  const sp = useSearchParams();
  const leadIdStr = sp ? sp.get('leadId') : null;
  const leadId = leadIdStr ? parseInt(leadIdStr) : NaN;

  if (!flags.OFFERS) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold">Credit Audit</h1>
        <p className="text-slate-300 mt-2">This feature is not enabled.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-white mb-2">Book Your 48‑Hour Credit Audit</h1>
      <p className="text-slate-300 mb-6">$299 credited if enrolled within 30 days. Secure payment powered by Stripe.</p>
      {Number.isFinite(leadId) ? (
        <div className="max-w-md bg-slate-900 border border-slate-800 rounded-lg p-6">
          <AuditCheckout leadId={leadId} />
        </div>
      ) : (
        <div className="max-w-xl bg-slate-900 border border-slate-800 rounded-lg p-6">
          <p className="text-sm text-slate-300">Missing leadId. Append <code className="text-xs bg-slate-800 px-1 py-0.5 rounded">?leadId=123</code> to the URL after capturing an RSVP or creating a lead.</p>
        </div>
      )}
    </div>
  );
}
