"use client";
import React, { useEffect, useState } from 'react';

type Consent = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
};

function readConsent(): Consent | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(/(?:^|; )g4t_consent=([^;]+)/);
  if (!m) return null;
  try { return JSON.parse(decodeURIComponent(m[1])); } catch { return null; }
}

function writeConsent(c: Consent) {
  if (typeof document === 'undefined') return;
  const val = encodeURIComponent(JSON.stringify(c));
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  document.cookie = `g4t_consent=${val}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    setShow(!existing);
  }, []);

  if (!show) return null;

  const acceptAll = () => {
    writeConsent({ necessary: true, analytics: true, marketing: true, personalization: true });
    setShow(false);
  };
  const rejectNonEssential = () => {
    writeConsent({ necessary: true, analytics: false, marketing: false, personalization: false });
    setShow(false);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-[1200]">
      <div className="mx-auto max-w-5xl m-3 rounded-lg border border-slate-800 bg-slate-900/95 backdrop-blur p-4 text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm">
            We use cookies to improve your experience, measure performance, and personalize content. You can accept all cookies or reject non-essential ones. Necessary cookies are always on.
          </div>
          <div className="flex gap-2">
            <button onClick={rejectNonEssential} className="px-3 py-2 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800">Reject non-essential</button>
            <button onClick={acceptAll} className="px-3 py-2 rounded-md bg-cyan-500 text-slate-900 font-semibold hover:opacity-90">Accept all</button>
          </div>
        </div>
      </div>
    </div>
  );
}
