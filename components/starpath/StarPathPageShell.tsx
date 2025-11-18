"use client";

import { ReactNode } from "react";

interface StarPathPageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function StarPathPageShell({ title, subtitle, children, className = "" }: StarPathPageShellProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-slate-400">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
