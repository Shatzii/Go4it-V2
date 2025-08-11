'use client';

import { useState, useEffect } from 'react';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const router = useRouter();

  const handleComplete = () => {
    // Mark onboarding as completed
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
    router.push('/dashboard');
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_skipped', 'true');
    setShowOnboarding(false);
    router.push('/dashboard');
  };

  useEffect(() => {
    // Check if user has already completed onboarding
    const completed = localStorage.getItem('onboarding_completed');
    const skipped = localStorage.getItem('onboarding_skipped');
    
    if (completed || skipped) {
      router.push('/dashboard');
      return;
    }
  }, [router]);

  if (!showOnboarding) {
    return null;
  }

  return (
    <OnboardingWizard onComplete={handleComplete} onSkip={handleSkip} />
  );
}