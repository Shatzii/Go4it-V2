'use client';

import React, { useEffect } from 'react';
import OnboardingTooltip from './OnboardingTooltip';
import { useOnboarding, onboardingFlows } from '@/hooks/useOnboarding';
import { useAuth } from '@/hooks/useAuth';

interface OnboardingManagerProps {
  flowId: keyof typeof onboardingFlows;
  autoStart?: boolean;
  autoStartDelay?: number;
}

export default function OnboardingManager({
  flowId,
  autoStart = false,
  autoStartDelay = 2000,
}: OnboardingManagerProps) {
  const { user, isAuthenticated } = useAuth();
  const steps = onboardingFlows[flowId];

  const {
    isActive,
    currentStep,
    setCurrentStep,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    isCompleted,
    isSkipped,
  } = useOnboarding({
    flowId,
    steps,
    autoStart: false,
    persistState: true,
  });

  // Auto-start onboarding with delay for new users
  useEffect(() => {
    if (autoStart && isAuthenticated && user && !isCompleted && !isSkipped && !isActive) {
      const timer = setTimeout(() => {
        startOnboarding();
      }, autoStartDelay);

      return () => clearTimeout(timer);
    }
  }, [
    autoStart,
    isAuthenticated,
    user,
    isCompleted,
    isSkipped,
    isActive,
    autoStartDelay,
    startOnboarding,
  ]);

  if (!isActive || !steps.length) {
    return null;
  }

  return (
    <OnboardingTooltip
      steps={steps}
      isActive={isActive}
      currentStep={currentStep}
      onComplete={completeOnboarding}
      onSkip={skipOnboarding}
      theme="dark"
    />
  );
}
