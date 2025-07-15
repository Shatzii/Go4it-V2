'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { StaticQuickLinks } from '@/components/static/static-quick-links';
import { StaticClassCreator } from '@/components/static/static-class-creator';
import { 
  BookOpen, Heart, Shield, Calendar, 
  MessageCircle, TrendingUp, Trophy, Star
} from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
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

// Force dynamic rendering for this page to prevent static generation issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Prevent static generation during build
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export default function PrimaryParentDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Parent Portal</h1>
              <p className="text-red-200">SuperHero School (K-6)</p>
              <Badge className="mt-2 bg-white/20">Active Parent</Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">3 Children</div>
              <div className="text-red-200">All Enrolled</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={
            <Card className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500">
              <CardHeader>
                <CardTitle className="text-red-400">Loading Quick Links...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-red-500/10 rounded"></div>
                  <div className="h-10 bg-red-500/10 rounded"></div>
                </div>
              </CardContent>
            </Card>
          }>
            <StaticQuickLinks userType="parent" schoolId="primary" />
          </Suspense>
        </ErrorBoundary>

        {/* Class Creator */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={
            <Card className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500">
              <CardHeader>
                <CardTitle className="text-red-400">Loading Class Information...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-red-500/10 rounded"></div>
                  <div className="h-10 bg-red-500/10 rounded"></div>
                </div>
              </CardContent>
            </Card>
          }>
            <StaticClassCreator userType="parent" schoolId="primary" userId="parent-demo" />
          </Suspense>
        </ErrorBoundary>

        {/* Children Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Alex', grade: '3rd Grade', progress: 85, superhero: 'Lightning Kid' },
            { name: 'Emma', grade: '1st Grade', progress: 92, superhero: 'Super Star' },
            { name: 'Noah', grade: '5th Grade', progress: 78, superhero: 'Thunder Hero' }
          ].map((child, index) => (
            <Card key={index} className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-red-500 text-white">
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
                    <span className="text-orange-300">{child.superhero}</span>
                  </div>
                  <Progress value={child.progress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="text-green-300">{child.progress}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Safety & Communication */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Shield className="w-5 h-5" />
                Safety Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Online Safety Status</span>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Screen Time Today</span>
                  <span className="text-green-300">2h 15m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Safe Content Filter</span>
                  <Badge className="bg-green-500">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <MessageCircle className="w-5 h-5" />
                Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Unread Messages</span>
                  <Badge className="bg-purple-500">2</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Next Parent Meeting</span>
                  <span className="text-purple-300">Tomorrow 3PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Teacher Availability</span>
                  <Badge className="bg-green-500">Online</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}