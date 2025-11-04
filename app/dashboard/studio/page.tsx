/**
 * Studio Dashboard Page
 * Feature-flagged Elite Integrated Core Studio
 */
import { StudioDashboard } from '@/components/dashboard/studio-dashboard';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio - Go4it Sports Academy',
  description: 'Elite Integrated Core Studio - 3-hour daily cross-curricular learning',
};

export default function StudioPage() {
  // Feature flag check
  const featureEnabled = process.env.NEXT_PUBLIC_FEATURE_STUDIO === 'true';

  if (!featureEnabled) {
    redirect('/dashboard');
  }

  return <StudioDashboard />;
}
