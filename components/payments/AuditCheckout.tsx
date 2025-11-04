"use client";
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = typeof window !== 'undefined' ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '') : null;

type Plan = 'full'|'deposit'|'split';

export function AuditCheckout({ leadId }: { leadId: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|undefined>();

  async function start(plan: Plan) {
    try {
      setLoading(true); setError(undefined);
      const res = await fetch('/api/audit/create-payment-intent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId, paymentPlan: plan }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create payment');
      if (!stripePromise) return;
      const stripe = await stripePromise;
      if (!stripe) return;
      await stripe.confirmCardPayment(data.clientSecret);
    } catch (e: any) {
      setError(e?.message || 'Payment failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-300">$299 credited within 30 days if enrolled.</p>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="grid grid-cols-3 gap-2">
        <button disabled={loading} onClick={() => start('full')} className="py-2 rounded bg-cyan-500 text-slate-900 font-semibold">$299</button>
        <button disabled={loading} onClick={() => start('deposit')} className="py-2 rounded bg-cyan-500/90 text-slate-900 font-semibold">$199</button>
        <button disabled={loading} onClick={() => start('split')} className="py-2 rounded bg-cyan-500/80 text-slate-900 font-semibold">2×$159</button>
      </div>
    </div>
  );
}

export default AuditCheckout;
