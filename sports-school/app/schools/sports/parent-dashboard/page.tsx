'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { StaticQuickLinks } from '@/components/static/static-quick-links';
import { StaticClassCreator } from '@/components/static/static-class-creator';
import {
  BookOpen,
  Heart,
  Shield,
  Calendar,
  MessageCircle,
  TrendingUp,
  Trophy,
  Star,
  Target,
  Timer,
  Activity,
} from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

// Force dynamic rendering for this page
function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <Card className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500">
      <CardHeader>
        <CardTitle className="text-red-400">Something went wrong</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-300 mb-4">Unable to load component</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try again
        </button>
      </CardContent>
    </Card>
  );
}

export default function SportsParentDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Parent Portal</h1>
              <p className="text-orange-200">Go4it Sports Academy (10-12)</p>
              <Badge className="mt-2 bg-white/20">Athletic Family</Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">3 Children</div>
              <div className="text-orange-200">Championship Track</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense
            fallback={
              <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-orange-400">Loading Quick Links...</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-orange-500/10 rounded"></div>
                    <div className="h-10 bg-orange-500/10 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <StaticQuickLinks userType="parent" schoolId="sports" />
          </Suspense>
        </ErrorBoundary>

        {/* Class Creator */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense
            fallback={
              <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500">
                <CardHeader>
                  <CardTitle className="text-orange-400">Loading Class Information...</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-orange-500/10 rounded"></div>
                    <div className="h-10 bg-orange-500/10 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <StaticClassCreator userType="parent" schoolId="sports" userId="parent-demo" />
          </Suspense>
        </ErrorBoundary>

        {/* Children Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Tyler',
              grade: '10th Grade',
              sport: 'Basketball',
              progress: 92,
              position: 'Point Guard',
            },
            {
              name: 'Maya',
              grade: '11th Grade',
              sport: 'Soccer',
              progress: 88,
              position: 'Midfielder',
            },
            {
              name: 'Jordan',
              grade: '12th Grade',
              sport: 'Track & Field',
              progress: 95,
              position: 'Sprinter',
            },
          ].map((child, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-orange-500 text-white">
                      {child.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {child.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{child.grade}</span>
                    <span className="text-red-300">{child.sport}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Position: {child.position}</span>
                    <Badge className="bg-orange-500 text-xs">{child.progress}%</Badge>
                  </div>
                  <Progress value={child.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Athletic Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Trophy className="w-5 h-5" />
                Athletic Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Team Rankings</span>
                  <Badge className="bg-green-500">Top 5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Individual Awards</span>
                  <span className="text-green-300">12 this season</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Training Attendance</span>
                  <Badge className="bg-green-500">98%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Target className="w-5 h-5" />
                Academic Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Overall GPA</span>
                  <span className="text-blue-300">3.7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Study Hall Hours</span>
                  <Badge className="bg-blue-500">15/week</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>College Prep</span>
                  <Badge className="bg-green-500">On track</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
