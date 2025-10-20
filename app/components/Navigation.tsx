'use client';

import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return null; // Home page has its own nav
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Go4It Sports
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</a>
            <a href="/recruiting-hub" className="text-slate-300 hover:text-white transition-colors">Recruiting</a>
            <a href="/academy" className="text-slate-300 hover:text-white transition-colors">Academy</a>
          </div>
        </div>
      </div>
    </nav>
  );
}