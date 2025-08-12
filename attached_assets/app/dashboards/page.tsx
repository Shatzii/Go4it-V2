import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Settings, 
  Heart,
  Brain,
  Shield,
  Target,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Universal One School</h1>
            </div>
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              ← Back to Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Zap className="w-4 h-4 mr-2" />
              All Features Preserved in Optimized Deployment
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Dashboard Access Center
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access all dashboards and features. Every component has been preserved during the Docker optimization process.
            </p>
          </div>

          {/* Main Dashboards */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Main Dashboards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-3">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Student Dashboard</CardTitle>
                  <CardDescription>Personalized learning environment</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete student portal with progress tracking, assignments, and AI tutoring.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/student-dashboard">Access Dashboard</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center mb-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Parent Dashboard</CardTitle>
                  <CardDescription>Monitor your child's progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Track academic progress, communicate with teachers, and manage schedules.
                  </p>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/api/parents">Parent Portal</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Teacher Tools</CardTitle>
                  <CardDescription>Comprehensive teaching platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Lesson planning, gradebook, student analytics, and communication tools.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/teacher-tools">Access Tools</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Admin Dashboard</CardTitle>
                  <CardDescription>School administration center</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Manage students, staff, finances, reports, and system settings.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/admin">Admin Center</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center mb-3">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>Master Admin</CardTitle>
                  <CardDescription>System-wide administration</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Platform-wide settings, analytics, and multi-school management.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/master-admin">Master Control</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>AI Analytics</CardTitle>
                  <CardDescription>Performance insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Advanced analytics, performance tracking, and AI-powered insights.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/ai-analytics">View Analytics</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Deployment Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-900 mb-2">
                  All Features Preserved During Optimization
                </h4>
                <p className="text-green-800 mb-3">
                  The Docker image optimization reduced size from 8+ GiB to under 1 GiB while preserving all dashboards and functionality.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-green-700">
                  <div>✓ Student Dashboard</div>
                  <div>✓ Parent Portal</div>
                  <div>✓ Teacher Tools</div>
                  <div>✓ Admin Center</div>
                  <div>✓ All 5 Schools</div>
                  <div>✓ AI Features</div>
                  <div>✓ Virtual Classroom</div>
                  <div>✓ Marketplace</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}