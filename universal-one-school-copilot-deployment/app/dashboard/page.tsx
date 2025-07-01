'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import StudentDashboard from '@/components/dashboard/student-dashboard'
import ParentPortal from '@/components/dashboard/parent-portal'
import AdminDashboard from '@/components/dashboard/admin-dashboard'
import AdminToggle from '@/components/ui/admin-toggle'
import LoginForm from '@/components/auth/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, GraduationCap, Settings, MessageCircle } from 'lucide-react'

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [showRoleSelector, setShowRoleSelector] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      // Set role based on user data
      const role = user.role || 'student'
      setUserRole(role)
      setShowRoleSelector(false)
    } else {
      setUserRole(null)
      setShowRoleSelector(false)
    }
  }, [user, isAuthenticated])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">The Universal One School</h1>
            <p className="text-gray-600">Access your personalized learning dashboard</p>
          </div>
          <LoginForm redirectTo="/dashboard" />
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowRoleSelector(true)}
              className="text-sm"
            >
              Demo Mode (No Login Required)
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Demo role selection for testing purposes (only if user clicked demo mode)
  if (showRoleSelector || (!userRole && !isAuthenticated)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Demo Mode - Select Your Role</CardTitle>
            <CardDescription>Choose your dashboard view for testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full flex items-center space-x-2" 
              onClick={() => {
                setUserRole('student')
                setShowRoleSelector(false)
              }}
            >
              <GraduationCap className="h-5 w-5" />
              <span>Student Dashboard</span>
            </Button>
            <Button 
              className="w-full flex items-center space-x-2" 
              variant="outline"
              onClick={() => {
                setUserRole('parent')
                setShowRoleSelector(false)
              }}
            >
              <Users className="h-5 w-5" />
              <span>Parent Portal</span>
            </Button>
            <Button 
              className="w-full flex items-center space-x-2" 
              variant="outline"
              onClick={() => {
                setUserRole('admin')
                setShowRoleSelector(false)
              }}
            >
              <Settings className="h-5 w-5" />
              <span>Admin Dashboard</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render appropriate dashboard based on role
  const renderDashboard = () => {
    switch (userRole) {
      case 'student':
        return <StudentDashboard />
      case 'parent':
        return <ParentPortal />
      case 'admin':
        return <AdminDashboard />
      case 'teacher':
        return <AdminDashboard /> // Use admin dashboard for teachers for now
      default:
        return <StudentDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminToggle />
      {/* Admin Access Notice */}
      {(localStorage.getItem('admin_mode') === 'true' || localStorage.getItem('master_admin') === 'true') && (
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Admin Access:</strong> You have full access to all dashboard views and can switch between roles.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                The Universal One School
              </h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)} Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/innovations'}
              >
                <Users className="h-4 w-4 mr-2" />
                Innovations
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setUserRole(null)
                  localStorage.removeItem('user_role')
                }}
              >
                Switch Role
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </div>
    </div>
  )
}