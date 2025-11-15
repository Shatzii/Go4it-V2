"use client";

import React from 'react';

export default function ResultPanel({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="p-4 border rounded bg-gray-900 border-gray-700">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
