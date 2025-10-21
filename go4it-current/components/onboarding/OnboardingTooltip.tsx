'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Lightbulb, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface OnboardingStep {
  id: string;
  target: string; // CSS selector for the element to highlight
  title: string;
  description: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    text: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}

interface OnboardingTooltipProps {
  steps: OnboardingStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  currentStep?: number;
  autoProgress?: boolean;
  theme?: 'dark' | 'light';
}

export default function OnboardingTooltip({
  steps,
  isActive,
  onComplete,
  onSkip,
  currentStep = 0,
  autoProgress = false,
  theme = 'dark',
}: OnboardingTooltipProps) {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const step = steps[activeStep];

  useEffect(() => {
    if (!isActive || !step) return;

    const updatePosition = () => {
      const targetElement = document.querySelector(step.target);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      let newPosition = { top: 0, left: 0 };

      switch (step.placement) {
        case 'top':
          newPosition = {
            top: rect.top + scrollY - 100,
            left: rect.left + scrollX + rect.width / 2 - 150,
          };
          break;
        case 'bottom':
          newPosition = {
            top: rect.bottom + scrollY + 20,
            left: rect.left + scrollX + rect.width / 2 - 150,
          };
          break;
        case 'left':
          newPosition = {
            top: rect.top + scrollY + rect.height / 2 - 75,
            left: rect.left + scrollX - 320,
          };
          break;
        case 'right':
          newPosition = {
            top: rect.top + scrollY + rect.height / 2 - 75,
            left: rect.right + scrollX + 20,
          };
          break;
      }

      setPosition(newPosition);
      setIsVisible(true);

      // Add highlight to target element
      targetElement.classList.add('onboarding-highlight');

      // Add overlay
      const overlay = document.createElement('div');
      overlay.className = 'onboarding-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        pointer-events: none;
      `;
      document.body.appendChild(overlay);

      // Create spotlight effect
      const spotlight = document.createElement('div');
      spotlight.className = 'onboarding-spotlight';
      spotlight.style.cssText = `
        position: absolute;
        top: ${rect.top}px;
        left: ${rect.left}px;
        width: ${rect.width + 8}px;
        height: ${rect.height + 8}px;
        border-radius: 8px;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 0 0 9999px rgba(0, 0, 0, 0.5);
        z-index: 9999;
        pointer-events: none;
        transition: all 0.3s ease;
      `;
      document.body.appendChild(spotlight);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);

      // Clean up highlights and overlays
      document.querySelectorAll('.onboarding-highlight').forEach((el) => {
        el.classList.remove('onboarding-highlight');
      });
      document.querySelectorAll('.onboarding-overlay, .onboarding-spotlight').forEach((el) => {
        el.remove();
      });
    };
  }, [isActive, activeStep, step]);

  useEffect(() => {
    if (autoProgress && activeStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setActiveStep((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeStep, autoProgress, steps.length]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    // Clean up
    document.querySelectorAll('.onboarding-highlight').forEach((el) => {
      el.classList.remove('onboarding-highlight');
    });
    document.querySelectorAll('.onboarding-overlay, .onboarding-spotlight').forEach((el) => {
      el.remove();
    });
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    // Clean up
    document.querySelectorAll('.onboarding-highlight').forEach((el) => {
      el.classList.remove('onboarding-highlight');
    });
    document.querySelectorAll('.onboarding-overlay, .onboarding-spotlight').forEach((el) => {
      el.remove();
    });
    onSkip();
  };

  if (!isActive || !step || !isVisible) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Target className="w-4 h-4" />;
      case 'medium':
        return <Lightbulb className="w-4 h-4" />;
      case 'low':
        return <Zap className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  return (
    <div
      className="fixed z-[10000] w-80"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        animation: 'fadeInBounce 0.5s ease-out',
      }}
    >
      <Card
        className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} shadow-2xl`}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${getPriorityColor(step.priority)}`}>
                {step.icon || getPriorityIcon(step.priority)}
              </div>
              <div>
                <h3
                  className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  {step.title}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  Step {activeStep + 1} of {steps.length}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className={`h-8 w-8 p-0 ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <p
            className={`mb-6 text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}
          >
            {step.description}
          </p>

          {/* Action Button */}
          {step.action && (
            <div className="mb-4">
              <Button
                onClick={step.action.onClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {step.action.text}
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={activeStep === 0}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === activeStep
                      ? 'bg-blue-500'
                      : index < activeStep
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              size="sm"
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {activeStep === steps.length - 1 ? 'Complete' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Arrow pointing to target */}
      <div
        className={`absolute w-0 h-0 ${
          step.placement === 'top'
            ? 'border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-slate-800 top-full left-1/2 transform -translate-x-1/2'
            : step.placement === 'bottom'
              ? 'border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-slate-800 bottom-full left-1/2 transform -translate-x-1/2'
              : step.placement === 'left'
                ? 'border-t-[10px] border-b-[10px] border-l-[10px] border-t-transparent border-b-transparent border-l-slate-800 left-full top-1/2 transform -translate-y-1/2'
                : 'border-t-[10px] border-b-[10px] border-r-[10px] border-t-transparent border-b-transparent border-r-slate-800 right-full top-1/2 transform -translate-y-1/2'
        }`}
      />
    </div>
  );
}
