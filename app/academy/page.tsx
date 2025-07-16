'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Brain, 
  Star, 
  Calendar, 
  MessageCircle, 
  GraduationCap, 
  Clock, 
  Map, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  Video, 
  CreditCard, 
  Bell, 
  Upload, 
  Download,
  Users,
  Settings,
  Play,
  FileText,
  CheckCircle,
  Award,
  User
} from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  tier?: string
  level?: string
  points?: number
  icon?: string
  unlocked: boolean
  category: string
  unlockedAt?: Date
}

interface StudentProgress {
  id: string
  userId: string
  courseId: string
  completedLessons: number
  totalLessons: number
  points: number
  streakDays: number
  lastActivity: Date
}

interface Course {
  id: string
  title: string
  description: string
  schoolId: string
  difficulty: string
  subjects: string[]
}

export default function Go4ItAcademy() {
  const [activeTab, setActiveTab] = useState('student')
  const [selectedSchool, setSelectedSchool] = useState('go4it-academy')
  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    // Check admin status to allow full access
    const adminMode = localStorage.getItem('admin_mode') === 'true'
    const masterAdmin = localStorage.getItem('master_admin') === 'true'
    const userRole = localStorage.getItem('user_role')
    setIsAdmin(adminMode || masterAdmin || userRole === 'admin')
  }, [])

  const courses = [
    {
      id: 'sports-science',
      title: 'Sports Science & Performance',
      description: 'Advanced sports science curriculum designed for student athletes',
      difficulty: 'Advanced',
      subjects: ['Exercise Physiology', 'Sports Psychology', 'Biomechanics', 'Nutrition'],
      progress: 75,
      nextLesson: 'Biomechanical Analysis',
      estimatedTime: '45 mins'
    },
    {
      id: 'ncaa-compliance',
      title: 'NCAA Compliance & Eligibility',
      description: 'Understanding NCAA requirements and maintaining eligibility',
      difficulty: 'Intermediate',
      subjects: ['Academic Standards', 'Amateurism Rules', 'Recruiting Guidelines'],
      progress: 60,
      nextLesson: 'Academic Progress Rate',
      estimatedTime: '30 mins'
    },
    {
      id: 'athletic-development',
      title: 'Athletic Development & Training',
      description: 'Comprehensive athletic training and development program',
      difficulty: 'Advanced',
      subjects: ['Strength Training', 'Speed & Agility', 'Sport-Specific Skills'],
      progress: 85,
      nextLesson: 'Plyometric Training',
      estimatedTime: '60 mins'
    },
    {
      id: 'academic-support',
      title: 'Academic Support for Athletes',
      description: 'Specialized academic support for student athletes',
      difficulty: 'Beginner',
      subjects: ['Time Management', 'Study Skills', 'Test Preparation'],
      progress: 40,
      nextLesson: 'Time Management Strategies',
      estimatedTime: '25 mins'
    }
  ]

  const achievements = [
    { 
      id: 'sports-scholar', 
      title: 'Sports Scholar', 
      description: 'Completed 5 sports science courses', 
      icon: Trophy, 
      color: 'text-yellow-600',
      unlocked: true,
      category: 'academic'
    },
    { 
      id: 'ncaa-ready', 
      title: 'NCAA Ready', 
      description: 'Passed NCAA eligibility requirements', 
      icon: GraduationCap, 
      color: 'text-blue-600',
      unlocked: true,
      category: 'compliance'
    },
    { 
      id: 'athletic-excellence', 
      title: 'Athletic Excellence', 
      description: 'Achieved 90% in athletic training', 
      icon: Award, 
      color: 'text-green-600',
      unlocked: false,
      category: 'athletic'
    },
    { 
      id: 'study-streak', 
      title: 'Study Streak', 
      description: '30-day learning streak', 
      icon: Target, 
      color: 'text-purple-600',
      unlocked: true,
      category: 'engagement'
    }
  ]

  const todaysGoals = [
    { title: 'Complete Sports Science Module', completed: true, subject: 'Sports Science' },
    { title: 'Review NCAA Compliance Rules', completed: false, subject: 'NCAA Compliance' },
    { title: 'Athletic Training Session', completed: false, subject: 'Athletic Development' },
    { title: 'Submit Academic Progress Report', completed: true, subject: 'Academic Support' }
  ]

  const aiTeachersAvailable = [
    { name: 'Coach Thompson', subject: 'Athletic Development', status: 'online', lastHelped: '1 hour ago' },
    { name: 'Dr. Martinez', subject: 'Sports Science', status: 'online', lastHelped: '2 hours ago' },
    { name: 'Prof. NCAA', subject: 'NCAA Compliance', status: 'busy', lastHelped: '30 minutes ago' },
    { name: 'Ms. Academic', subject: 'Academic Support', status: 'online', lastHelped: '45 minutes ago' }
  ]

  const StudentDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to Go4It Sports Academy</h1>
        <p className="text-lg opacity-90">Your comprehensive athletic and academic development platform</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Courses Enrolled</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold">65%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Achievements</p>
                <p className="text-2xl font-bold">{achievements.filter(a => a.unlocked).length}</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Study Streak</p>
                <p className="text-2xl font-bold">15 days</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Courses */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Current Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{course.title}</h3>
                      <Badge variant={course.difficulty === 'Advanced' ? 'destructive' : course.difficulty === 'Intermediate' ? 'default' : 'secondary'}>
                        {course.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress: {course.progress}%</span>
                      <span className="text-sm text-gray-500">{course.estimatedTime}</span>
                    </div>
                    <Progress value={course.progress} className="mb-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Next: {course.nextLesson}</span>
                      <Button size="sm" className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        Continue
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Today's Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysGoals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${goal.completed ? 'bg-green-500' : 'bg-gray-200'}`}>
                      {goal.completed && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                        {goal.title}
                      </p>
                      <p className="text-xs text-gray-500">{goal.subject}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Teachers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Teachers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiTeachersAvailable.map((teacher, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${teacher.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{teacher.name}</p>
                      <p className="text-xs text-gray-500">{teacher.subject}</p>
                      <p className="text-xs text-gray-400">Last helped: {teacher.lastHelped}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.filter(a => a.unlocked).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{achievement.title}</p>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const ParentPortal = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Parent Portal</h1>
        <p className="text-lg opacity-90">Monitor your child's academic and athletic progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Academic Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Academic Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Overall GPA</span>
                <span className="font-semibold">3.8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Courses Completed</span>
                <span className="font-semibold">12/16</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">NCAA Eligible</span>
                <Badge variant="default" className="bg-green-500">Yes</Badge>
              </div>
              <Progress value={75} />
            </div>
          </CardContent>
        </Card>

        {/* Athletic Development */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Athletic Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Training Sessions</span>
                <span className="font-semibold">24/30</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Skill Progression</span>
                <span className="font-semibold">Advanced</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">GAR Score</span>
                <span className="font-semibold text-green-600">87</span>
              </div>
              <Progress value={80} />
            </div>
          </CardContent>
        </Card>

        {/* Communication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-3">
                <p className="text-sm font-medium">Coach Thompson</p>
                <p className="text-xs text-gray-600">Great progress in training!</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
              <div className="border-l-4 border-green-500 pl-3">
                <p className="text-sm font-medium">Dr. Martinez</p>
                <p className="text-xs text-gray-600">Excellent sports science project</p>
                <p className="text-xs text-gray-400">1 day ago</p>
              </div>
              <Button size="sm" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const AdminDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-red-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg opacity-90">Manage Go4It Sports Academy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold">28</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">NCAA Eligible</p>
                <p className="text-2xl font-bold">89%</p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg GAR Score</p>
                <p className="text-2xl font-bold">84</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Marcus Johnson', sport: 'Basketball', date: '2 hours ago' },
                { name: 'Sarah Williams', sport: 'Soccer', date: '5 hours ago' },
                { name: 'David Chen', sport: 'Tennis', date: '1 day ago' },
                { name: 'Emma Davis', sport: 'Volleyball', date: '2 days ago' }
              ].map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.sport}</p>
                  </div>
                  <span className="text-xs text-gray-400">{student.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Learning Management System</span>
                <Badge variant="default" className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Coaching Engine</span>
                <Badge variant="default" className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Video Analysis</span>
                <Badge variant="default" className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">NCAA Compliance</span>
                <Badge variant="default" className="bg-green-500">Online</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white p-1 rounded-lg border">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'student'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4" />
              Student Dashboard
            </button>
            <button
              onClick={() => setActiveTab('parent')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'parent'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4" />
              Parent Portal
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'admin'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              Admin Dashboard
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'student' && <StudentDashboard />}
        {activeTab === 'parent' && <ParentPortal />}
        {activeTab === 'admin' && <AdminDashboard />}
      </div>
    </div>
  )
}