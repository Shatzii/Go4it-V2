"use client";

import React from 'react';

export default function PlanPicker({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <div className={`p-4 border rounded ${selected === 'starpath' ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700'}`}>
        <h3 className="text-lg font-bold">StarPath One-Time Assessment</h3>
        <p className="text-sm text-gray-300">One-time assessment + placement report — $249</p>
        <button className="mt-3 px-4 py-2 bg-purple-600 rounded" onClick={() => onSelect('starpath')}>Select StarPath</button>
      </div>

      <div className={`p-4 border rounded ${selected === 'starter' ? 'border-green-500 bg-green-900/10' : 'border-gray-700'}`}>
        <h3 className="text-lg font-bold">Starter Subscription</h3>
        <p className="text-sm text-gray-300">Monthly access to training tools and basic GAR analysis — $19/mo</p>
        <button className="mt-3 px-4 py-2 bg-green-600 rounded" onClick={() => onSelect('starter')}>Select Starter</button>
      </div>
    </div>
  );
}
