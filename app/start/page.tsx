"use client";

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import GARInput from '@/app/academy/enroll/GARInput';
import PlanPicker from './PlanPicker';
import ResultPanel from '@/app/components/ResultPanel';
import { v4 as uuid } from 'uuid';

export const dynamic = 'force-dynamic';

export default function StartPage() {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [gar, setGar] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [sessionUrl, setSessionUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitGAR = async (score: number | string) => {
    const s = Number(score);
    const id = user?.id || uuid();
    const payload = {
      id,
      score: s,
      submittedBy: user?.id || 'anonymous',
      approved: false,
      timestamp: new Date().toISOString(),
    };
    setLoading(true);
    try {
      await fetch('/api/academy/gar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setGar(s);
    } catch (e) {
      console.error('Failed to submit GAR', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    try {
      if (selectedPlan === 'starpath') {
        const { createPayment } = await import('@/lib/paymentsClient');
        const resp = await createPayment({ productId: 'starpath', email: user?.primaryEmailAddress?.emailAddress || user?.email || '', userId: user?.id || '' });
        if (resp?.url) {
          setSessionUrl(resp.url);
          window.location.href = resp.url;
        }
      } else {
        const { createStripeSubscription } = await import('@/lib/paymentsClient');
        const resp = await createStripeSubscription({ userId: user?.id || '', email: user?.primaryEmailAddress?.emailAddress || user?.email || '', tier: selectedPlan, name: (user as any)?.fullName || '' });
        if (resp?.data?.clientSecret) {
          // redirect to checkout page with client secret
          window.location.href = `/checkout?tier=${selectedPlan}&client_secret=${encodeURIComponent(resp.data.clientSecret)}`;
        }
      }
    } catch (e) {
      console.error('Purchase failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Start: StarPath Placement</h1>

        {step === 1 && (
          <div>
            <ResultPanel title="Step 1 — Enter GAR Score">
              <p className="text-sm text-gray-300">Provide your manual GAR score so we can recommend the best path.</p>
              <GARInput enrollmentId={user?.id} initialScore={gar ?? ''} approved={false} onSubmit={submitGAR} onApprove={null} />
              <div className="mt-4">
                <button className="px-4 py-2 bg-blue-600 rounded" onClick={() => setStep(2)} disabled={gar == null}>Next: Choose a plan</button>
              </div>
            </ResultPanel>
          </div>
        )}

        {step === 2 && (
          <div>
            <ResultPanel title="Step 2 — Pick a Plan">
              <PlanPicker selected={selectedPlan || ''} onSelect={(id) => setSelectedPlan(id)} />
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-gray-700 rounded" onClick={() => setStep(1)}>Back</button>
                <button className="px-4 py-2 bg-green-600 rounded" onClick={() => setStep(3)} disabled={!selectedPlan}>Continue</button>
              </div>
            </ResultPanel>
          </div>
        )}

        {step === 3 && (
          <div>
            <ResultPanel title="Step 3 — Confirm & Purchase">
              <p className="text-sm text-gray-300">Selected plan: <strong>{selectedPlan}</strong></p>
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-gray-700 rounded" onClick={() => setStep(2)}>Back</button>
                <button className="px-4 py-2 bg-purple-600 rounded" onClick={handlePurchase} disabled={loading}>{loading ? 'Processing...' : 'Complete Purchase'}</button>
              </div>
            </ResultPanel>
          </div>
        )}
      </div>
    </div>
  );
}
