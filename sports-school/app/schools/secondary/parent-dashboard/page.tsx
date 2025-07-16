'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, Heart, Shield, Calendar, 
  MessageCircle, TrendingUp, Trophy, Star,
  GraduationCap, DollarSign, Users
} from 'lucide-react';
import { SafeDynamicLoader, createSafeDynamicImport } from '@/components/dynamic/safe-dynamic-loader';

// Safe dynamic imports for better production builds
const QuickLinks = createSafeDynamicImport(
  () => import('@/components/dashboard/quick-links').then(mod => ({ default: mod.QuickLinks })),
  {
    fallbackTitle: "Quick Links Error",
    fallbackMessage: "Unable to load quick links component",
    loadingComponent: (
      <Card className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500">
        <CardHeader>
          <CardTitle className="text-indigo-400">Loading Quick Links...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-indigo-500/10 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
);

const ClassCreator = createSafeDynamicImport(
  () => import('@/components/dashboard/class-creator').then(mod => ({ default: mod.ClassCreator })),
  {
    fallbackTitle: "Class Creator Error",
    fallbackMessage: "Unable to load class creator component",
    loadingComponent: (
      <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500">
        <CardHeader>
          <CardTitle className="text-blue-400">Loading Class Information...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-blue-500/10 rounded"></div>
            <div className="h-10 bg-blue-500/10 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }
);

// Force dynamic rendering for this page to prevent static generation issues
// Prevent static generation during build
export default function SecondaryParentDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Parent Portal</h1>
              <p className="text-purple-200">S.T.A.G.E Prep Global Academy (7-12)</p>
              <Badge className="mt-2 bg-white/20">Premium Parent</Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">2 Children</div>
              <div className="text-purple-200">College Track</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <SafeDynamicLoader
          fallbackTitle="Quick Links Error"
          fallbackMessage="Unable to load quick links component"
        >
          <QuickLinks userType="parent" schoolId="secondary" />
        </SafeDynamicLoader>

        {/* Class Creator */}
        <SafeDynamicLoader
          fallbackTitle="Class Creator Error"
          fallbackMessage="Unable to load class creator component"
        >
          <ClassCreator userType="parent" schoolId="secondary" userId="parent-demo" />
        </SafeDynamicLoader>

        {/* Children Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Jordan', grade: '10th Grade', gpa: 3.8, track: 'College Prep', progress: 85 },
            { name: 'Taylor', grade: '12th Grade', gpa: 3.9, track: 'AP Advanced', progress: 92 }
          ].map((child, index) => (
            <Card key={index} className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-purple-500 text-white">
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
                    <span className="text-indigo-300">GPA: {child.gpa}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{child.track}</span>
                    <Badge className="bg-purple-500 text-xs">{child.progress}%</Badge>
                  </div>
                  <Progress value={child.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* College & Financial */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <GraduationCap className="w-5 h-5" />
                College Preparation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>SAT Prep Progress</span>
                  <Badge className="bg-green-500">On Track</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>College Applications</span>
                  <span className="text-green-300">5 submitted</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Scholarship Apps</span>
                  <Badge className="bg-green-500">3 pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <DollarSign className="w-5 h-5" />
                Billing & Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Monthly Tuition</span>
                  <span className="text-blue-300">$2,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Next Payment</span>
                  <Badge className="bg-blue-500">Due Jan 15</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Account Status</span>
                  <Badge className="bg-green-500">Current</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}