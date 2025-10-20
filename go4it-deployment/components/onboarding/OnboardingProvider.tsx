'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { OnboardingStep } from './OnboardingTooltip';

interface OnboardingContextType {
  activeFlow: string | null;
  isOnboardingActive: boolean;
  startFlow: (flowId: string, steps: OnboardingStep[]) => void;
  stopFlow: () => void;
  currentSteps: OnboardingStep[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  const [currentSteps, setCurrentSteps] = useState<OnboardingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);

  const startFlow = (flowId: string, steps: OnboardingStep[]) => {
    setActiveFlow(flowId);
    setCurrentSteps(steps);
    setCurrentStep(0);
    setIsOnboardingActive(true);
  };

  const stopFlow = () => {
    setActiveFlow(null);
    setCurrentSteps([]);
    setCurrentStep(0);
    setIsOnboardingActive(false);
  };

  // Global keyboard shortcuts for onboarding
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOnboardingActive) return;

      if (e.key === 'Escape') {
        stopFlow();
      } else if (e.key === 'ArrowRight' && currentStep < currentSteps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOnboardingActive, currentStep, currentSteps.length]);

  const value = {
    activeFlow,
    isOnboardingActive,
    startFlow,
    stopFlow,
    currentSteps,
    currentStep,
    setCurrentStep,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider');
  }
  return context;
}
