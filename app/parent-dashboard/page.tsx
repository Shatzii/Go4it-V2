'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Award,
  MessageCircle,
  Bell,
  Settings,
  Download,
  Eye,
  Target,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  AlertCircle,
  Star,
  Heart,
  CreditCard
} from 'lucide-react'

interface Student {
  id: string
  name: string
  grade: string
  school: string
  avatar: string
  overallProgress: number
  recentActivity: string
  nextAssignment: string
  accommodations: string[]
}

interface ProgressData {
  subject: string
  currentGrade: number
  trend: 'up' | 'down' | 'stable'
  assignments: {
    completed: number
    total: number
  }
  lastActivity: string
  upcomingTests: string[]
}

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  icon: string
  category: 'academic' | 'behavior' | 'participation'
}

export default function ParentDashboard() {
  const [selectedStudent, setSelectedStudent] = useState<string>('1')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('week')
  const [notifications, setNotifications] = useState<any[]>([])

  // Sample student data - would come from API
  const students: Student[] = [
    {
      id: '1',
      name: 'Emma Rodriguez',
      grade: 'K',
      school: 'SuperHero Elementary',
      avatar: '👧',
      overallProgress: 92,
      recentActivity: 'Completed Math Hero Mission',
      nextAssignment: 'Reading Adventure due Friday',
      accommodations: ['Visual learning aids', 'Extra time for tasks']
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      grade: '3',
      school: 'SuperHero Elementary',
      avatar: '👦',
      overallProgress: 88,
      recentActivity: 'Science Experiment completed',
      nextAssignment: 'Number Ninja Challenge',
      accommodations: ['ADHD support', 'Movement breaks', 'Front row seating']
    }
  ]

  const progressData: ProgressData[] = [
    {
      subject: 'Mathematics',
      currentGrade: 95,
      trend: 'up',
      assignments: { completed: 18, total: 20 },
      lastActivity: '2 hours ago',
      upcomingTests: ['Addition/Subtraction Quiz - Friday']
    },
    {
      subject: 'English Language Arts',
      currentGrade: 89,
      trend: 'stable',
      assignments: { completed: 15, total: 18 },
      lastActivity: '1 day ago',
      upcomingTests: ['Reading Comprehension Test - Monday']
    },
    {
      subject: 'Science',
      currentGrade: 92,
      trend: 'up',
      assignments: { completed: 12, total: 14 },
      lastActivity: '3 hours ago',
      upcomingTests: []
    },
    {
      subject: 'Social Studies',
      currentGrade: 86,
      trend: 'down',
      assignments: { completed: 10, total: 12 },
      lastActivity: '2 days ago',
      upcomingTests: ['Community Helpers Quiz - Wednesday']
    }
  ]

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Math Master',
      description: 'Completed 10 math assignments in a row with A grades',
      date: '2024-07-14',
      icon: '🏆',
      category: 'academic'
    },
    {
      id: '2',
      title: 'Helpful Hero',
      description: 'Helped classmates during group activities',
      date: '2024-07-13',
      icon: '🤝',
      category: 'behavior'
    },
    {
      id: '3',
      title: 'Perfect Attendance',
      description: 'No absences this month',
      date: '2024-07-12',
      icon: '⭐',
      category: 'participation'
    }
  ]

  const weeklyProgress = [
    { day: 'Mon', completed: 4, total: 5 },
    { day: 'Tue', completed: 5, total: 5 },
    { day: 'Wed', completed: 3, total: 4 },
    { day: 'Thu', completed: 4, total: 4 },
    { day: 'Fri', completed: 2, total: 3 }
  ]

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        message: `${students.find(s => s.id === selectedStudent)?.name} just submitted an assignment`,
        type: 'success',
        timestamp: new Date().toISOString()
      }
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)])
    }, 15000)

    return () => clearInterval(interval)
  }, [selectedStudent])

  const selectedStudentData = students.find(s => s.id === selectedStudent)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600'
    if (grade >= 80) return 'text-blue-600'
    if (grade >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Universal One School
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-semibold text-gray-900">Parent Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                P
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Student Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Children</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <div
                key={student.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedStudent === student.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setSelectedStudent(student.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{student.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.school} - Grade {student.grade}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Overall Progress</span>
                    <span className="text-sm font-semibold text-green-600">{student.overallProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${student.overallProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{student.recentActivity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedStudentData && (
          <>
            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Overall Grade</p>
                    <p className="text-2xl font-bold text-green-600">A-</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Assignments</p>
                    <p className="text-2xl font-bold text-blue-600">18/20</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Attendance</p>
                    <p className="text-2xl font-bold text-purple-600">98%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Achievements</p>
                    <p className="text-2xl font-bold text-yellow-600">{achievements.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                {/* Subject Progress */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Subject Progress</h3>
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value as any)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="semester">This Semester</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    {progressData.map((subject) => (
                      <div key={subject.subject} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-gray-900">{subject.subject}</h4>
                            {getTrendIcon(subject.trend)}
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${getGradeColor(subject.currentGrade)}`}>
                              {subject.currentGrade}%
                            </p>
                            <p className="text-xs text-gray-500">Last activity: {subject.lastActivity}</p>
                          </div>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600">Assignments</span>
                              <span className="text-sm font-semibold">
                                {subject.assignments.completed}/{subject.assignments.total}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${(subject.assignments.completed / subject.assignments.total) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            {subject.upcomingTests.length > 0 && (
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Upcoming Tests:</p>
                                {subject.upcomingTests.map((test, idx) => (
                                  <p key={idx} className="text-sm text-orange-600 font-medium">{test}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Activity Chart */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Activity</h3>
                  <div className="flex items-end gap-4 h-40">
                    {weeklyProgress.map((day) => (
                      <div key={day.day} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-t flex-1 flex flex-col justify-end">
                          <div 
                            className="bg-blue-500 rounded-t"
                            style={{ height: `${(day.completed / day.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="text-xs font-semibold text-gray-700">{day.day}</p>
                          <p className="text-xs text-gray-500">{day.completed}/{day.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Recent Achievements */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Achievements</h3>
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600 mb-1">{achievement.description}</p>
                          <p className="text-xs text-gray-500">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Events</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">Parent-Teacher Conference</p>
                        <p className="text-sm text-gray-600">Friday, July 19 at 3:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <BookOpen className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">Science Fair Project Due</p>
                        <p className="text-sm text-gray-600">Monday, July 22</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <Award className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900">Honor Roll Ceremony</p>
                        <p className="text-sm text-gray-600">Wednesday, July 24 at 10:00 AM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accommodations Status */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Accommodations</h3>
                  <div className="space-y-3">
                    {selectedStudentData.accommodations.map((accommodation, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-700">{accommodation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <MessageCircle className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">Message Teacher</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Calendar className="w-5 h-5 text-green-500" />
                      <span className="font-medium">Schedule Meeting</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="w-5 h-5 text-purple-500" />
                      <span className="font-medium">Download Report</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-5 h-5 text-orange-500" />
                      <span className="font-medium">View Full Schedule</span>
                    </button>
                    <Link href="/parent-dashboard/payments">
                      <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <CreditCard className="w-5 h-5 text-emerald-500" />
                        <span className="font-medium">Payment Center</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Real-time Notifications */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          {notifications.slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className="bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-sm animate-slide-in"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}