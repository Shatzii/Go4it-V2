'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OnboardingTrigger from './OnboardingTrigger';
import OnboardingManager from './OnboardingManager';
import { Play, Settings, BookOpen, Target } from 'lucide-react';

export default function OnboardingDemo() {
  const [demoSection, setDemoSection] = useState('overview');

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8" data-onboarding="demo-header">
          <h1 className="text-4xl font-bold mb-4">Interactive Onboarding System Demo</h1>
          <p className="text-slate-300 text-lg">
            Experience our comprehensive guided tour system designed for Go4It Sports Platform
          </p>
        </div>

        {/* Demo Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700" data-onboarding="dashboard-demo">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-blue-400" />
                Dashboard Tour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4">
                Complete dashboard walkthrough with GAR scores, StarPath progress, and quick
                actions.
              </p>
              <OnboardingTrigger flowId="dashboard" variant="button" size="sm" className="w-full" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700" data-onboarding="gar-demo">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Play className="w-5 h-5 text-green-400" />
                GAR Upload Tour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4">
                Learn how to upload videos for AI analysis with sport selection and analysis
                methods.
              </p>
              <OnboardingTrigger flowId="garUpload" variant="button" size="sm" className="w-full" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700" data-onboarding="academy-demo">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Academy Tour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4">
                Explore the educational academy with NCAA-approved courses and scheduling system.
              </p>
              <OnboardingTrigger flowId="academy" variant="button" size="sm" className="w-full" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700" data-onboarding="starpath-demo">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="w-5 h-5 text-yellow-400" />
                StarPath Tour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4">
                Discover the gamified progression system with skill trees and XP challenges.
              </p>
              <OnboardingTrigger flowId="starpath" variant="button" size="sm" className="w-full" />
            </CardContent>
          </Card>
        </div>

        {/* System Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Key Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  Interactive
                </Badge>
                <span className="text-sm">Smart tooltips with contextual help</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Persistent
                </Badge>
                <span className="text-sm">Saves progress and remembers completion</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  Adaptive
                </Badge>
                <span className="text-sm">Auto-starts for new users, skippable</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  Accessible
                </Badge>
                <span className="text-sm">Keyboard navigation and ADHD-friendly</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Technical Implementation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="text-slate-300">• </span>
                <span className="text-white">Spotlight highlighting</span> with overlay effects
              </div>
              <div className="text-sm">
                <span className="text-slate-300">• </span>
                <span className="text-white">Auto-positioning</span> tooltips with collision
                detection
              </div>
              <div className="text-sm">
                <span className="text-slate-300">• </span>
                <span className="text-white">LocalStorage persistence</span> for user progress
              </div>
              <div className="text-sm">
                <span className="text-slate-300">• </span>
                <span className="text-white">Global context provider</span> for state management
              </div>
              <div className="text-sm">
                <span className="text-slate-300">• </span>
                <span className="text-white">Priority-based flow</span> organization
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sample Elements for Demo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-onboarding="demo-elements">
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400">Sample GAR Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">87</div>
              <p className="text-sm text-slate-300">Growth & Ability Rating</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">StarPath Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">Level 5</div>
              <p className="text-sm text-slate-300">2,840 XP Earned</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-400">Academy Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">82%</div>
              <p className="text-sm text-slate-300">Course Completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Demo */}
        <div className="mt-8 flex justify-center gap-4" data-onboarding="quick-actions-demo">
          <Button className="bg-blue-600 hover:bg-blue-700">Start Video Analysis</Button>
          <Button variant="outline">View Academy Schedule</Button>
          <Button variant="outline">Check StarPath Progress</Button>
        </div>
      </div>
    </div>
  );
}
