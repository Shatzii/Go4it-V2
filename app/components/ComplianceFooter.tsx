'use client';

import { useEffect, useState } from 'react';
import { brand } from '@/lib/brand';

export default function ComplianceFooter() {
  const [requiresCompliance, setRequiresCompliance] = useState(false);

  useEffect(() => {
    // Check if compliance is required via cookie or session storage
    const complianceCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('requires-compliance='));
    
    const requiresComplianceValue = complianceCookie?.split('=')[1] === 'true';
    setRequiresCompliance(requiresComplianceValue);
  }, []);

  if (!requiresCompliance) {
    return null;
  }

  return (
    <section className="w-full border-t border-slate-800 mt-12 py-6 text-xs text-slate-300">
      <div className="container mx-auto px-4 space-y-2">
        <p className="font-semibold">{brand.a11y.safetyLine}</p>
        <p className="leading-relaxed">{brand.complianceFooter}</p>
      </div>
    </section>
  );
}
