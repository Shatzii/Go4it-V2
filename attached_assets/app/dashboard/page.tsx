'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Brain, 
  Trophy,
  MessageSquare,
  BarChart3,
  Settings,
  School,
  GraduationCap,
  Target,
  Clock,
  Bell,
  Star
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState({
    name: 'Student Name',
    role: 'student',
    school: 'Primary School',
    grade: '5th Grade',
    avatar: '/avatar-placeholder.png'
  })

  const quickActions = [
    { title: 'AI Teachers', href: '/ai-teachers', icon: Brain, description: 'Chat with specialized AI teachers' },
    { title: 'My Courses', href: '/course-management', icon: BookOpen, description: 'View and manage your courses' },
    { title: 'Schedule', href: '/block-scheduling', icon: Calendar, description: 'Check your class schedule' },
    { title: 'Virtual Classroom', href: '/virtual-classroom', icon: School, description: 'Join live classes' },
    { title: 'Study Buddy', href: '/study-buddy', icon: Users, description: 'Find study partners' },
    { title: 'Assignments', href: '/assignments', icon: Target, description: 'View upcoming assignments' }
  ]

  const recentActivities = [
    { type: 'assignment', title: 'Math homework submitted', time: '2 hours ago', icon: BookOpen },
    { type: 'chat', title: 'Talked with Professor Newton', time: '4 hours ago', icon: MessageSquare },
    { type: 'grade', title: 'Science quiz graded: A-', time: '1 day ago', icon: Trophy },
    { type: 'schedule', title: 'New class added: Art History', time: '2 days ago', icon: Calendar }
  ]

  const upcomingEvents = [
    { title: 'Math Test - Algebra', date: 'Today, 2:00 PM', type: 'test' },
    { title: 'Science Lab - Chemistry', date: 'Tomorrow, 10:00 AM', type: 'class' },
    { title: 'English Essay Due', date: 'Friday, 11:59 PM', type: 'assignment' },
    { title: 'Parent-Teacher Conference', date: 'Next Monday, 3:00 PM', type: 'meeting' }
  ]

  const coursesProgress = [
    { subject: 'Mathematics', progress: 78, grade: 'A-', teacher: 'Professor Newton' },
    { subject: 'Science', progress: 85, grade: 'A', teacher: 'Dr. Curie' },
    { subject: 'English', progress: 72, grade: 'B+', teacher: 'Ms. Shakespeare' },
    { subject: 'Social Studies', progress: 81, grade: 'A-', teacher: 'Professor Timeline' }
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'test': return Target
      case 'class': return School
      case 'assignment': return BookOpen
      case 'meeting': return Users
      default: return Bell
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
              <p className="text-gray-600 mt-1">{user.school} • {user.grade}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                <GraduationCap className="h-4 w-4 mr-1" />
                {user.role === 'student' ? 'Student' : 'Teacher'}
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Card key={action.href} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <Link href={action.href} className="block">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Icon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">{action.title}</h3>
                                <p className="text-sm text-gray-600">{action.description}</p>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities and Upcoming Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => {
                      const Icon = activity.icon
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-white rounded-full">
                            <Icon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event, index) => {
                      const Icon = getEventIcon(event.type)
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-white rounded-full">
                            <Icon className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{event.title}</p>
                            <p className="text-xs text-gray-500">{event.date}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  My Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {coursesProgress.map((course, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{course.subject}</h3>
                          <Badge variant="secondary">{course.grade}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Teacher: {course.teacher}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                    <div className="text-sm font-medium text-blue-900">9:00 AM</div>
                    <div className="flex-1">
                      <p className="font-medium">Mathematics - Algebra</p>
                      <p className="text-sm text-gray-600">Room 101 • Professor Newton</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                    <div className="text-sm font-medium text-green-900">10:30 AM</div>
                    <div className="flex-1">
                      <p className="font-medium">Science - Chemistry Lab</p>
                      <p className="text-sm text-gray-600">Lab 202 • Dr. Curie</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border-l-4 border-l-purple-500">
                    <div className="text-sm font-medium text-purple-900">1:00 PM</div>
                    <div className="flex-1">
                      <p className="font-medium">English - Creative Writing</p>
                      <p className="text-sm text-gray-600">Room 301 • Ms. Shakespeare</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/block-scheduling">
                    <Button className="w-full">
                      View Full Schedule
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Academic Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">B+</div>
                    <div className="text-sm text-gray-600">Overall GPA</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">87%</div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-gray-600">Assignments Due</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">95%</div>
                    <div className="text-sm text-gray-600">Attendance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}