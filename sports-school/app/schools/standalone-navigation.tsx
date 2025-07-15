'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  BookOpen, 
  Calendar, 
  Users, 
  Target, 
  Play,
  MessageSquare,
  Settings,
  Home,
  School
} from 'lucide-react'
import Link from 'next/link'

interface StandaloneNavigationProps {
  schoolPath: string
  schoolName: string
  schoolTheme: string
  gradeLevel: string
  themeColor: string
}

export default function StandaloneNavigation({ 
  schoolPath, 
  schoolName, 
  schoolTheme, 
  gradeLevel, 
  themeColor 
}: StandaloneNavigationProps) {
  
  const navigationItems = [
    {
      title: 'AI Teachers',
      href: `${schoolPath}/ai-teachers`,
      icon: Brain,
      description: 'Chat with specialized AI teachers'
    },
    {
      title: 'My Assignments',
      href: `${schoolPath}/assignments`,
      icon: BookOpen,
      description: 'View and submit assignments'
    },
    {
      title: 'My Schedule',
      href: `${schoolPath}/schedule`,
      icon: Calendar,
      description: 'Check class schedule'
    },
    {
      title: 'Virtual Classroom',
      href: `${schoolPath}/virtual-classroom`,
      icon: Play,
      description: 'Join live classes'
    },
    {
      title: 'Study Groups',
      href: `${schoolPath}/study-groups`,
      icon: Users,
      description: 'Find study partners'
    },
    {
      title: 'Progress Tracking',
      href: `${schoolPath}/progress`,
      icon: Target,
      description: 'Track learning progress'
    }
  ]

  const quickLinks = [
    {
      title: 'Student Dashboard',
      href: `${schoolPath}/student-dashboard`,
      icon: Home,
      color: 'bg-blue-500'
    },
    {
      title: 'Teacher Portal',
      href: `${schoolPath}/teacher-portal`,
      icon: School,
      color: 'bg-green-500'
    },
    {
      title: 'Parent Portal',
      href: `${schoolPath}/parent-portal`,
      icon: Users,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* School Header */}
        <div className={`bg-gradient-to-r ${themeColor} text-white rounded-lg p-6 mb-8`}>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">{schoolName}</h1>
            <p className="text-lg opacity-90">{schoolTheme}</p>
            <Badge className="mt-2 bg-white/20 text-white">{gradeLevel}</Badge>
          </div>
        </div>

        {/* Quick Access Portals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link key={link.href} href={link.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 ${link.color} rounded-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{link.title}</h3>
                        <p className="text-sm text-gray-600">Access your portal</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Navigation Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              {schoolName} Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <h3 className="font-medium">{item.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Shared AI Engine Notice */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-blue-800">Shared AI Engine</h3>
            </div>
            <p className="text-sm text-blue-700">
              All schools share the same advanced AI teachers and learning engine, 
              customized for your specific school environment and grade level.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}