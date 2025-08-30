'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, User, Trophy, Target, Star, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Go4It Sports',
      description: 'Your journey to athletic excellence starts here',
      icon: <Star className="w-6 h-6" />,
      component: <WelcomeStep />
    },
    {
      id: 'profile',
      title: 'Create Your Profile',
      description: 'Tell us about yourself and your athletic goals',
      icon: <User className="w-6 h-6" />,
      component: <ProfileStep />
    },
    {
      id: 'gar-intro',
      title: 'Understanding GAR Score',
      description: 'Learn how our AI evaluates your performance',
      icon: <Trophy className="w-6 h-6" />,
      component: <GARIntroStep />
    },
    {
      id: 'starpath',
      title: 'Your StarPath Journey',
      description: 'Discover how to level up your skills',
      icon: <Target className="w-6 h-6" />,
      component: <StarPathStep />
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={onSkip} className="text-slate-400">
              Skip Tour
            </Button>
            <div className="text-sm text-slate-400">
              {currentStep + 1} of {steps.length}
            </div>
          </div>
          <Progress value={progress} className="mb-6" />
          <div className="flex justify-center mb-4 text-blue-400">
            {steps[currentStep].icon}
          </div>
          <CardTitle className="text-2xl text-white">
            {steps[currentStep].title}
          </CardTitle>
          <p className="text-slate-400">
            {steps[currentStep].description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {steps[currentStep].component}
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WelcomeStep() {
  return (
    <div className="text-center space-y-4">
      <div className="text-4xl mb-4">🏆</div>
      <h3 className="text-xl font-semibold text-white">Built for Athletes Like You</h3>
      <p className="text-slate-300">
        Go4It Sports is designed specifically for neurodivergent student athletes, 
        with features that help you focus, track progress, and reach your goals.
      </p>
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { icon: '⚡', title: 'AI Analysis', desc: 'Smart feedback' },
          { icon: '📈', title: 'Progress Tracking', desc: 'Visual growth' },
          { icon: '🎯', title: 'Clear Goals', desc: 'Step-by-step' }
        ].map((item, index) => (
          <div key={index} className="text-center p-3 bg-slate-800 rounded-lg">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="text-sm font-medium text-white">{item.title}</div>
            <div className="text-xs text-slate-400">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileStep() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Quick Profile Setup</h3>
      <p className="text-slate-300">
        We&apos;ll help you create your athlete profile in just a few minutes. 
        You can always update this information later.
      </p>
      <div className="space-y-3">
        {[
          'Basic information (name, age, sport)',
          'Athletic goals and aspirations',
          'Current skill level and experience',
          'Areas you want to improve'
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-slate-300">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GARIntroStep() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Your GAR Score</h3>
      <p className="text-slate-300">
        The Growth & Ability Rating (GAR) uses AI to analyze your performance 
        across five key areas, giving you a comprehensive athletic score.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: 'Speed', score: 8.5, color: 'bg-blue-500' },
          { name: 'Agility', score: 7.8, color: 'bg-green-500' },
          { name: 'Strength', score: 8.2, color: 'bg-purple-500' },
          { name: 'Technique', score: 9.1, color: 'bg-yellow-500' }
        ].map((metric, index) => (
          <div key={index} className="bg-slate-800 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-300">{metric.name}</span>
              <span className="text-sm font-bold text-white">{metric.score}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${metric.color}`}
                style={{ width: `${(metric.score / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StarPathStep() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">StarPath Progression</h3>
      <p className="text-slate-300">
        Your personalized skill tree that turns training into a rewarding game. 
        Complete challenges, earn XP, and unlock new abilities.
      </p>
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-medium">Current Level: Rookie</span>
          <span className="text-blue-400 text-sm">1,250 XP</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 mb-3">
          <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full" style={{ width: '60%' }} />
        </div>
        <div className="text-xs text-slate-400">
          750 XP to next level: Prospect
        </div>
      </div>
    </div>
  );
}