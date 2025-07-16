'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Scale, BookOpen, GraduationCap, Calendar, 
  MessageCircle, TrendingUp, Trophy, FileText,
  DollarSign, Users, Briefcase, Award
} from 'lucide-react';
import { SafeDynamicLoader, createSafeDynamicImport } from '@/components/dynamic/safe-dynamic-loader';

// Safe dynamic imports for better production builds
const QuickLinks = createSafeDynamicImport(
  () => import('@/components/dashboard/quick-links').then(mod => ({ default: mod.QuickLinks })),
  {
    fallbackTitle: "Quick Links Error",
    fallbackMessage: "Unable to load quick links component",
    loadingComponent: (
      <Card className="bg-gradient-to-r from-gray-500/20 to-blue-500/20 border-gray-500">
        <CardHeader>
          <CardTitle className="text-gray-400">Loading Quick Links...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-500/10 rounded-lg animate-pulse"></div>
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
      <Card className="bg-gradient-to-r from-blue-500/20 to-gray-500/20 border-blue-500">
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
export default function LawParentDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-600 to-blue-600 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Parent Portal</h1>
              <p className="text-gray-200">Future Legal Professionals (11-12)</p>
              <Badge className="mt-2 bg-white/20">Law School Parent</Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">1 Student</div>
              <div className="text-gray-200">Pre-Law Track</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <SafeDynamicLoader
          fallbackTitle="Quick Links Error"
          fallbackMessage="Unable to load quick links component"
        >
          <QuickLinks userType="parent" schoolId="law" />
        </SafeDynamicLoader>

        {/* Class Creator */}
        <SafeDynamicLoader
          fallbackTitle="Class Creator Error"
          fallbackMessage="Unable to load class creator component"
        >
          <ClassCreator userType="parent" schoolId="law" userId="parent-demo" />
        </SafeDynamicLoader>

        {/* Student Overview */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-gradient-to-br from-gray-500/20 to-blue-500/20 border-gray-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-400">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gray-500 text-white">
                    J
                  </AvatarFallback>
                </Avatar>
                Justice Williams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>12th Grade</span>
                  <span className="text-blue-300">GPA: 3.95</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pre-Law Track</span>
                  <Badge className="bg-gray-500 text-xs">94%</Badge>
                </div>
                <Progress value={94} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Law School & Financial */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Scale className="w-5 h-5" />
                Law School Preparation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>LSAT Prep Progress</span>
                  <Badge className="bg-blue-500">Excellent</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Law School Applications</span>
                  <span className="text-blue-300">8 submitted</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mock Trial Participation</span>
                  <Badge className="bg-blue-500">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Legal Writing Skills</span>
                  <Badge className="bg-blue-500">Advanced</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <DollarSign className="w-5 h-5" />
                Billing & Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Monthly Tuition</span>
                  <span className="text-green-300">$3,200</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Next Payment</span>
                  <Badge className="bg-green-500">Due Jan 15</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Account Status</span>
                  <Badge className="bg-green-500">Current</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Law School Prep Fee</span>
                  <span className="text-green-300">$500</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legal Achievements */}
        <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Award className="w-5 h-5" />
              Legal Achievements & Awards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-sm font-medium">Mock Trial Champion</div>
                <div className="text-xs text-yellow-300">Regional Competition</div>
              </div>
              <div className="text-center">
                <FileText className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-sm font-medium">Legal Writing Award</div>
                <div className="text-xs text-yellow-300">Constitutional Law Essay</div>
              </div>
              <div className="text-center">
                <Briefcase className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-sm font-medium">Internship Secured</div>
                <div className="text-xs text-yellow-300">District Attorney's Office</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}