"use client";

import { ReactNode } from "react";

interface StarPathSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function StarPathSection({ title, children, className = "" }: StarPathSectionProps) {
  return (
    <section className={`mb-8 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold text-amber-400 mb-4 border-b border-amber-500/20 pb-2">
          {title}
        </h2>
      )}
      <div>{children}</div>
    </section>
  );
}
