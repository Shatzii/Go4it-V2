'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CourseManagement from '@/components/ui/course-management'
import { 
  BookOpen, 
  Users, 
  Calendar, 
  GraduationCap,
  Home,
  BarChart3,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export default function CourseManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
              <p className="text-gray-600 mt-1">
                Manage courses, enrollment, and scheduling across all schools
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-blue-600">127</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Enrolled Students</p>
                <p className="text-2xl font-bold text-green-600">6,950</p>
              </div>
              <Link href="/">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CourseManagement />
      </div>
    </div>
  )
}