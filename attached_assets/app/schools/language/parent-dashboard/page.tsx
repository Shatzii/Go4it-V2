'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { StaticQuickLinks } from '@/components/static/static-quick-links';
import { StaticClassCreator } from '@/components/static/static-class-creator';
import { 
  BookOpen, Heart, Shield, Calendar, 
  MessageCircle, TrendingUp, Trophy, Star,
  Globe, Languages, MapPin
} from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

// Force dynamic rendering for this page
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

export default function LanguageParentDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Parent Portal</h1>
              <p className="text-green-200">Global Language Academy (9-12)</p>
              <Badge className="mt-2 bg-white/20">Multilingual Family</Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">2 Children</div>
              <div className="text-green-200">Cultural Immersion</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={
            <Card className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-400">Loading Quick Links...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-green-500/10 rounded"></div>
                  <div className="h-10 bg-green-500/10 rounded"></div>
                </div>
              </CardContent>
            </Card>
          }>
            <StaticQuickLinks userType="parent" schoolId="language" />
          </Suspense>
        </ErrorBoundary>

        {/* Class Creator */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={
            <Card className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-400">Loading Class Information...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-green-500/10 rounded"></div>
                  <div className="h-10 bg-green-500/10 rounded"></div>
                </div>
              </CardContent>
            </Card>
          }>
            <StaticClassCreator userType="parent" schoolId="language" userId="parent-demo" />
          </Suspense>
        </ErrorBoundary>

        {/* Children Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Sofia', grade: '10th Grade', language: 'Spanish', progress: 88, cultural: 'Latin America' },
            { name: 'Kenji', grade: '11th Grade', language: 'Japanese', progress: 91, cultural: 'East Asia' }
          ].map((child, index) => (
            <Card key={index} className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-green-500 text-white">
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
                    <span className="text-teal-300">{child.language}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cultural Focus: {child.cultural}</span>
                    <Badge className="bg-green-500 text-xs">{child.progress}%</Badge>
                  </div>
                  <Progress value={child.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Language & Cultural Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Globe className="w-5 h-5" />
                Language Proficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Spanish (Sofia)</span>
                  <Badge className="bg-blue-500">Intermediate</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Japanese (Kenji)</span>
                  <Badge className="bg-blue-500">Advanced</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cultural Studies</span>
                  <Badge className="bg-green-500">Excellent</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <MapPin className="w-5 h-5" />
                Cultural Immersion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Virtual Exchange</span>
                  <span className="text-purple-300">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cultural Projects</span>
                  <Badge className="bg-purple-500">4 completed</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Language Certification</span>
                  <Badge className="bg-green-500">In progress</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}