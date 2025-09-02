'use client';

import { useState, useEffect } from 'react';
import { OnboardingStep } from '@/components/onboarding/OnboardingTooltip';

interface OnboardingState {
  isActive: boolean;
  currentStep: number;
  completedSteps: string[];
  skippedFlows: string[];
}

interface UseOnboardingProps {
  flowId: string;
  steps: OnboardingStep[];
  autoStart?: boolean;
  persistState?: boolean;
}

export function useOnboarding({
  flowId,
  steps,
  autoStart = false,
  persistState = true,
}: UseOnboardingProps) {
  const [state, setState] = useState<OnboardingState>({
    isActive: false,
    currentStep: 0,
    completedSteps: [],
    skippedFlows: [],
  });

  // Load state from localStorage
  useEffect(() => {
    if (persistState) {
      const saved = localStorage.getItem(`onboarding_${flowId}`);
      if (saved) {
        try {
          const parsedState = JSON.parse(saved);
          setState((prevState) => ({ ...prevState, ...parsedState }));
        } catch (error) {
          console.error('Failed to parse onboarding state:', error);
        }
      }
    }
  }, [flowId, persistState]);

  // Save state to localStorage
  useEffect(() => {
    if (persistState) {
      localStorage.setItem(`onboarding_${flowId}`, JSON.stringify(state));
    }
  }, [state, flowId, persistState]);

  // Auto-start onboarding
  useEffect(() => {
    if (autoStart && !state.skippedFlows.includes(flowId) && !isCompleted()) {
      startOnboarding();
    }
  }, [autoStart, flowId, state.skippedFlows]);

  const startOnboarding = () => {
    setState((prev) => ({
      ...prev,
      isActive: true,
      currentStep: 0,
    }));
  };

  const completeOnboarding = () => {
    const completedSteps = steps.map((step) => step.id);
    setState((prev) => ({
      ...prev,
      isActive: false,
      completedSteps: [...prev.completedSteps, ...completedSteps],
    }));
  };

  const skipOnboarding = () => {
    setState((prev) => ({
      ...prev,
      isActive: false,
      skippedFlows: [...prev.skippedFlows, flowId],
    }));
  };

  const resetOnboarding = () => {
    setState({
      isActive: false,
      currentStep: 0,
      completedSteps: [],
      skippedFlows: [],
    });
    if (persistState) {
      localStorage.removeItem(`onboarding_${flowId}`);
    }
  };

  const isCompleted = () => {
    return steps.every((step) => state.completedSteps.includes(step.id));
  };

  const isSkipped = () => {
    return state.skippedFlows.includes(flowId);
  };

  const getProgress = () => {
    const completedCount = steps.filter((step) => state.completedSteps.includes(step.id)).length;
    return Math.round((completedCount / steps.length) * 100);
  };

  return {
    ...state,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    isCompleted: isCompleted(),
    isSkipped: isSkipped(),
    progress: getProgress(),
  };
}

// Predefined onboarding flows for different parts of the app
export const onboardingFlows = {
  dashboard: [
    {
      id: 'dashboard_welcome',
      target: '[data-onboarding="dashboard-header"]',
      title: 'Welcome to Your Dashboard!',
      description:
        'This is your command center where you can track your athletic progress, view your GAR scores, and manage your StarPath journey.',
      placement: 'bottom' as const,
      priority: 'high' as const,
    },
    {
      id: 'dashboard_gar_score',
      target: '[data-onboarding="gar-score"]',
      title: 'Your GAR Score',
      description:
        'Your Growth & Ability Rating (GAR) is a comprehensive score that measures your athletic potential across physical, cognitive, and psychological dimensions.',
      placement: 'right' as const,
      priority: 'high' as const,
    },
    {
      id: 'dashboard_starpath',
      target: '[data-onboarding="starpath-progress"]',
      title: 'StarPath Progression',
      description:
        'Track your skill development through our gamified StarPath system. Complete challenges and unlock new abilities!',
      placement: 'left' as const,
      priority: 'medium' as const,
    },
    {
      id: 'dashboard_quick_actions',
      target: '[data-onboarding="quick-actions"]',
      title: 'Quick Actions',
      description:
        'Use these buttons to quickly access key features like uploading videos for GAR analysis, viewing your academy schedule, or managing your profile.',
      placement: 'top' as const,
      priority: 'medium' as const,
    },
  ],

  garUpload: [
    {
      id: 'gar_upload_intro',
      target: '[data-onboarding="gar-upload-form"]',
      title: 'GAR Video Analysis',
      description:
        'Upload your athletic performance videos to get detailed AI-powered analysis and improve your GAR score.',
      placement: 'bottom' as const,
      priority: 'high' as const,
    },
    {
      id: 'gar_sport_selection',
      target: '[data-onboarding="sport-selector"]',
      title: 'Select Your Sport',
      description:
        'Choose the sport that matches your video for the most accurate analysis. We support 13 different sports!',
      placement: 'right' as const,
      priority: 'high' as const,
    },
    {
      id: 'gar_analysis_method',
      target: '[data-onboarding="analysis-method"]',
      title: 'Analysis Method',
      description:
        'Choose between our reliable Fixed Upload Analysis (recommended) for fastest results, or Local AI Models for advanced computer vision.',
      placement: 'bottom' as const,
      priority: 'medium' as const,
    },
  ],

  academy: [
    {
      id: 'academy_overview',
      target: '[data-onboarding="academy-header"]',
      title: 'Go4It Academy',
      description:
        'Complete your education with NCAA-approved coursework while pursuing your athletic dreams. Access courses from Khan Academy, MIT, and more!',
      placement: 'bottom' as const,
      priority: 'high' as const,
    },
    {
      id: 'academy_courses',
      target: '[data-onboarding="course-grid"]',
      title: 'Your Courses',
      description:
        'Browse and enroll in courses covering Mathematics, Science, English, and Social Studies. All courses are designed for student-athletes.',
      placement: 'top' as const,
      priority: 'high' as const,
    },
    {
      id: 'academy_schedule',
      target: '[data-onboarding="schedule-link"]',
      title: 'Class Schedule',
      description:
        'View your weekly class schedule, upcoming assignments, and important academic deadlines.',
      placement: 'left' as const,
      priority: 'medium' as const,
    },
  ],

  starpath: [
    {
      id: 'starpath_intro',
      target: '[data-onboarding="starpath-tree"]',
      title: 'Your StarPath Journey',
      description:
        'Level up your athletic abilities through our gamified progression system. Each node represents a skill to master!',
      placement: 'bottom' as const,
      priority: 'high' as const,
    },
    {
      id: 'starpath_current_level',
      target: '[data-onboarding="current-level"]',
      title: 'Current Level',
      description:
        'Track your current progression level and see how many XP points you need to advance to the next tier.',
      placement: 'right' as const,
      priority: 'medium' as const,
    },
    {
      id: 'starpath_challenges',
      target: '[data-onboarding="challenges"]',
      title: 'Daily Challenges',
      description:
        'Complete daily challenges to earn XP points and accelerate your progression through the StarPath system.',
      placement: 'left' as const,
      priority: 'medium' as const,
    },
  ],
};
