"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:hidden flex items-center">
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className={`md:hidden ${open ? '' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-900 border-t border-slate-700">
          <Link href="/dashboard" className="block text-slate-300 hover:text-white px-3 py-2 rounded-md">Dashboard</Link>
          <Link href="/video-analysis" className="block text-slate-300 hover:text-white px-3 py-2 rounded-md">GAR Analysis</Link>
          <Link href="/starpath" className="block text-slate-300 hover:text-white px-3 py-2 rounded-md">StarPath</Link>
          <Link href="/academy" className="block text-slate-300 hover:text-white px-3 py-2 rounded-md">Academy</Link>
          <Link href="/challenges" className="block text-slate-300 hover:text-white px-3 py-2 rounded-md">Challenges</Link>
          <Link href="/recruiting-hub" className="block text-slate-300 hover:text-white px-3 py-2 rounded-md">Recruiting</Link>
          <Link href="/ai-football-coach" className="block text-slate-300 hover:text-white px-3 py-2 rounded-md">AI Coach</Link>
          <Link href="/pricing" className="block text-slate-300 hover:text-white px-3 py-2 rounded-md">Pricing</Link>
          <Link href="/user/settings" className="block text-slate-300 hover:text-white px-3 py-2 rounded-md">Settings</Link>
        </div>
      </div>
    </>
  );
}
