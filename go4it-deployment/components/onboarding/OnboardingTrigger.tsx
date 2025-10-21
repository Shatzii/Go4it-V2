'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Play, RotateCcw } from 'lucide-react';
import { useOnboarding, onboardingFlows } from '@/hooks/useOnboarding';
import { Badge } from '@/components/ui/badge';

interface OnboardingTriggerProps {
  flowId: keyof typeof onboardingFlows;
  variant?: 'button' | 'icon' | 'badge';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export default function OnboardingTrigger({
  flowId,
  variant = 'button',
  size = 'default',
  className = '',
}: OnboardingTriggerProps) {
  const steps = onboardingFlows[flowId];
  const { isActive, startOnboarding, resetOnboarding, isCompleted, isSkipped, progress } =
    useOnboarding({
      flowId,
      steps,
      autoStart: false,
      persistState: true,
    });

  const getButtonText = () => {
    if (isCompleted) return 'Restart Tour';
    if (isSkipped) return 'Take Tour';
    if (progress > 0) return 'Continue Tour';
    return 'Start Tour';
  };

  const getButtonIcon = () => {
    if (isCompleted || isSkipped) return <RotateCcw className="w-4 h-4" />;
    return <Play className="w-4 h-4" />;
  };

  const handleClick = () => {
    if (isCompleted || isSkipped) {
      resetOnboarding();
    }
    startOnboarding();
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={`relative ${className}`}
        title={getButtonText()}
      >
        <HelpCircle className="w-5 h-5" />
        {progress > 0 && progress < 100 && (
          <Badge
            variant="secondary"
            className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-blue-500 text-white"
          >
            {Math.round(progress / 20)}
          </Badge>
        )}
      </Button>
    );
  }

  if (variant === 'badge') {
    return (
      <Badge
        variant={isCompleted ? 'default' : 'secondary'}
        className={`cursor-pointer hover:bg-blue-600 ${className}`}
        onClick={handleClick}
      >
        {isCompleted ? '✓ Tour Complete' : `${progress}% Complete`}
      </Badge>
    );
  }

  return (
    <Button
      variant={isCompleted ? 'outline' : 'default'}
      size={size}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
      disabled={isActive}
    >
      {getButtonIcon()}
      {getButtonText()}
      {progress > 0 && progress < 100 && (
        <Badge variant="secondary" className="ml-1">
          {progress}%
        </Badge>
      )}
    </Button>
  );
}
