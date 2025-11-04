"use client";
import React from 'react';
import { capture } from '@/lib/analytics/client';

export function StickyAuditRail({ visible = false, onClickAction }: { visible?: boolean; onClickAction?: () => void }) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-3 left-3 right-3 md:left-auto md:right-6 md:w-80 bg-slate-900 border border-slate-800 rounded-md shadow-lg p-4 z-[1100]">
      <div className="text-sm mb-2">Book your $299 Credit Audit (credited if enrolled within 30 days)</div>
      <button
        className="w-full py-2 rounded-md bg-cyan-500 text-slate-900 font-semibold hover:opacity-90 focus-brand"
  onClick={() => { capture('cta_click', { id: 'audit_sticky', location: 'sticky_rail' }); onClickAction?.(); }}
      >
        Book Credit Audit
      </button>
    </div>
  );
}

export default StickyAuditRail;
