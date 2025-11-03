'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Trophy,
  BookOpen,
  Target,
  Calendar,
  BarChart3,
  Star,
  Activity,
  CheckCircle,
  Heart,
  Brain,
  Zap,
  ArrowRight,
  Smartphone,
} from 'lucide-react';
import ClientOnly from '@/components/ClientOnly';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SmoothProgress } from '@/components/simple-transitions';
import OnboardingManager from '@/components/onboarding/OnboardingManager';
import OnboardingTrigger from '@/components/onboarding/OnboardingTrigger';
import { TodayTiles } from '@/components/dashboard/Tiles';
import { flags } from '@/lib/flags';

function DashboardComponent() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [dashboardData] = useState({
    stats: {
      garScore: 87,
      overallProgress: 65,
      coursesEnrolled: 6,
      studyStreak: 15,
      ncaaEligible: true,
    },
    recentAnalyses: [
      {
        id: 1,
        sport: 'Basketball',
        score: 89,
        date: '2024-01-15',
        improvements: ['Shooting form', 'Footwork'],
        verified: true,
      },
      {
        id: 2,
        sport: 'Soccer',
        score: 85,
        date: '2024-01-14',
        improvements: ['First touch', 'Passing accuracy'],
        verified: true,
      },
    ],
    achievements: [
      {
        id: 1,
        title: 'Sports Scholar',
        description: 'Completed 5 sports science courses',
        unlocked: true,
        category: 'academic',
      },
      {
        id: 2,
        title: 'NCAA Ready',
        description: 'Passed NCAA eligibility requirements',
        unlocked: true,
        category: 'compliance',
      },
      {
        id: 3,
        title: 'Athletic Excellence',
        description: 'Achieved 90% in athletic training',
        unlocked: false,
        category: 'athletic',
      },
    ],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (error) {
        // Error logged to console
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <ClientOnly>
        <div className="min-h-screen bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Athletic Dashboard</h1>
              <p className="text-slate-400">Loading your latest performance data...</p>
            </div>
            <div className="flex justify-center mt-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
          </div>
        </div>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8" data-onboarding="dashboard-header">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Athletic Dashboard</h1>
                <p className="text-slate-400">Track your athletic and academic progress</p>
              </div>
              <OnboardingTrigger
                flowId="dashboard"
                variant="button"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <Brain className="w-3 h-3 mr-1" />
                AI Enhanced
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                <Activity className="w-3 h-3 mr-1" />
                Real-time Analytics
              </Badge>
              <Button
                size="sm"
                onClick={() => (window.location.href = '/starpath')}
                className="ml-4"
              >
                View StarPath
              </Button>
            </div>
          </div>

          {/* Dashboard V2 Tiles - Feature Flag Enabled */}
          {flags.DASHBOARD_V2 && user?.id && (
            <div className="mb-8">
              <TodayTiles studentId={user.id} />
            </div>
          )}

          {/* StarPath Quick Overview */}
          <div className="mb-8" data-onboarding="starpath-progress">
            <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-white">StarPath Progress</div>
                    <div className="text-slate-400 text-sm font-normal">Level 3 • 2,450 XP</div>
                  </div>
                  <div className="ml-auto">
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => (window.location.href = '/starpath')}
                    >
                      View Full StarPath
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 text-sm">Overall Progress</span>
                      <span className="text-primary text-sm font-medium">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">4</div>
                    <div className="text-slate-400 text-sm">Technical Level</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">3</div>
                    <div className="text-slate-400 text-sm">Physical Level</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">7</div>
                    <div className="text-slate-400 text-sm">Achievements</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Grid - Single Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800 border-slate-700" data-onboarding="gar-score">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">GAR Score</p>
                    <p className="text-2xl font-bold text-green-400">
                      {dashboardData.stats.garScore}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-8 h-8 text-green-400" />
                    <CheckCircle
                      className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                      fill="currentColor"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Overall Progress</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {dashboardData.stats.overallProgress}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
                <div className="mt-3">
                  <SmoothProgress value={dashboardData.stats.overallProgress} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Academy Courses</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {dashboardData.stats.coursesEnrolled}
                    </p>
                  </div>
                  <BookOpen className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Study Streak</p>
                    <p className="text-2xl font-bold text-orange-400">
                      {dashboardData.stats.studyStreak} days
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next-Gen Features Showcase */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  Next-Generation Platform Features
                  <Badge variant="outline" className="text-primary border-primary">
                    NEW
                  </Badge>
                </CardTitle>
                <p className="text-slate-400">
                  Access cutting-edge AI technology and professional-grade analytics
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button
                    className="h-24 flex flex-col gap-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-left"
                    onClick={() => (window.location.href = '/test-video-analysis')}
                    data-onboarding="quick-actions"
                  >
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <span className="font-medium">AI Video Analysis</span>
                    </div>
                    <span className="text-xs text-slate-400">25+ body points • Sub-100ms</span>
                  </Button>

                  <Button
                    className="h-24 flex flex-col gap-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-left"
                    onClick={() => (window.location.href = '/mobile-analysis')}
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-blue-400" />
                      <span className="font-medium">Mobile Edge AI</span>
                    </div>
                    <span className="text-xs text-slate-400">Real-time • Offline capable</span>
                  </Button>

                  <Button
                    className="h-24 flex flex-col gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-left"
                    onClick={() => (window.location.href = '/recruiting-hub')}
                  >
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-400" />
                      <span className="font-medium">Smart Recruiting</span>
                    </div>
                    <span className="text-xs text-slate-400">500+ coaches • AI matching</span>
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    Powered by TensorFlow.js, MediaPipe, and edge computing
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (window.location.href = '/academy/daily-schedule')}
                  >
                    Daily Schedule
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Analyses */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Recent Video Analyses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentAnalyses.map((analysis) => (
                      <div key={analysis.id} className="border border-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{analysis.sport}</h3>
                            {analysis.verified && (
                              <div className="flex items-center gap-1">
                                <CheckCircle
                                  className="w-4 h-4 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                                  fill="currentColor"
                                />
                                <span className="text-blue-400 text-xs font-semibold">
                                  VERIFIED
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-green-400">
                              {analysis.score}
                            </span>
                            <span className="text-sm text-slate-400">GAR</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{analysis.date}</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.improvements.map((improvement, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-slate-700 text-slate-300"
                            >
                              {improvement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* NCAA Status */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    NCAA Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Eligibility Status</span>
                      <Badge variant="default" className="bg-green-500">
                        {dashboardData.stats.ncaaEligible ? 'Eligible' : 'Not Eligible'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Current GPA</span>
                      <span className="text-sm text-white">3.8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Credits Completed</span>
                      <span className="text-sm text-white">45/120</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                        style={{ width: '37.5%' }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.achievements
                      .filter((a) => a.unlocked)
                      .map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex items-center gap-3 p-2 bg-slate-700 rounded"
                        >
                          <Star className="w-6 h-6 text-yellow-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">{achievement.title}</p>
                            <p className="text-xs text-slate-400">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => (window.location.href = '/upload')}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Upload Video
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => (window.location.href = '/performance-analytics')}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Performance Analytics
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => (window.location.href = '/wellness-hub')}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Wellness Hub
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => (window.location.href = '/academy')}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Academy
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => (window.location.href = '/ai-coach')}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      AI Coach
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {/* Onboarding Manager */}
        <OnboardingManager flowId="dashboard" autoStart={true} autoStartDelay={3000} />
      </div>
    </ClientOnly>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <DashboardComponent />
      </ErrorBoundary>
    </ProtectedRoute>
  );
}
