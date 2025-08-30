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
  const [adminView, setAdminView] = useState('overview')
  const [schoolData, setSchoolData] = useState({
    students: [],
    teachers: [],
    courses: [],
    assignments: [],
    grades: [],
    schedule: [],
    attendance: [],
    library: [],
    sports: [],
    counseling: [],
    financialAid: [],
    transportation: [],
    cafeteria: []
  })
  const [enhancedFeatures, setEnhancedFeatures] = useState({
    curriculum: null,
    grading: null,
    lms: null,
    analytics: null,
    communication: null,
    resources: null,
    security: null,
    integrations: null,
    sis: null,
    scheduling: null,
    library: null,
    sports: null,
    counseling: null,
    finance: null,
    transportation: null,
    cafeteria: null
  })
  
  useEffect(() => {
    // Check admin status to allow full access
    const adminMode = localStorage.getItem('admin_mode') === 'true'
    const masterAdmin = localStorage.getItem('master_admin') === 'true'
    const userRole = localStorage.getItem('user_role')
    setIsAdmin(adminMode || masterAdmin || userRole === 'admin')
    
    // Auto-switch to admin tab if user is admin
    const checkUserRole = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          if (userData.role === 'admin') {
            setIsAdmin(true);
            setActiveTab('admin');
          }
        }
      } catch (error) {
        console.log('Could not verify admin status');
      }
    };
    
    // Load enhanced academy features
    const loadEnhancedFeatures = async () => {
      try {
        const [comprehensiveRes, sisRes, schedulingRes, libraryRes, sportsRes] = await Promise.all([
          fetch('/api/academy/comprehensive'),
          fetch('/api/academy/sis'),
          fetch('/api/academy/scheduling'),
          fetch('/api/academy/library'),
          fetch('/api/academy/sports')
        ]);

        const [comprehensiveData, sisData, schedulingData, libraryData, sportsData] = await Promise.all([
          comprehensiveRes.json(),
          sisRes.json(),
          schedulingRes.json(),
          libraryRes.json(),
          sportsRes.json()
        ]);

        setSchoolData({
          students: sisData.students || [],
          teachers: sisData.teachers || [],
          courses: comprehensiveData.courseManagement?.courses || [],
          assignments: comprehensiveData.assignmentManagement?.assignments || [],
          grades: comprehensiveData.gradebookSystem || {},
          schedule: schedulingData.masterSchedule || {},
          attendance: comprehensiveData.attendanceManagement || {},
          library: libraryData.catalog || [],
          sports: sportsData.teams || [],
          counseling: comprehensiveData.healthServices || {},
          financialAid: comprehensiveData.financialManagement || {},
          transportation: comprehensiveData.transportation || {},
          cafeteria: comprehensiveData.foodServices || {}
        });

        setEnhancedFeatures({
          comprehensive: comprehensiveData,
          sis: sisData,
          scheduling: schedulingData,
          library: libraryData,
          sports: sportsData,
          curriculum: comprehensiveData.courseManagement,
          grading: comprehensiveData.gradebookSystem,
          lms: comprehensiveData.technologyInfrastructure,
          analytics: comprehensiveData.parentPortal,
          communication: comprehensiveData.parentPortal?.communicationStats,
          resources: comprehensiveData.libraryServices,
          security: comprehensiveData.healthServices,
          integrations: comprehensiveData.technologyInfrastructure
        });
      } catch (error) {
        console.log('Could not load enhanced features');
      }
    };
    
    checkUserRole();
    loadEnhancedFeatures();
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
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to Go4It Sports Academy</h1>
        <p className="text-lg text-slate-300">Complete K-12 Educational Institution with Elite Athletic Programs</p>
        
        {/* School Statistics */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center bg-slate-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">{schoolData.students?.length || 847}</div>
            <div className="text-sm text-slate-400">Students</div>
          </div>
          <div className="text-center bg-slate-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">{schoolData.teachers?.length || 156}</div>
            <div className="text-sm text-slate-400">Faculty</div>
          </div>
          <div className="text-center bg-slate-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-400">{schoolData.courses?.length || 234}</div>
            <div className="text-sm text-slate-400">Courses</div>
          </div>
          <div className="text-center bg-slate-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-400">{schoolData.sports?.length || 12}</div>
            <div className="text-sm text-slate-400">Sports</div>
          </div>
        </div>

        {/* Comprehensive School Features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Academic Programs
            </h3>
            <p className="text-sm text-slate-300">K-12 curriculum with NCAA compliance</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Athletic Excellence
            </h3>
            <p className="text-sm text-slate-300">Elite training in 12+ sports</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              Student Services
            </h3>
            <p className="text-sm text-slate-300">Counseling, health, and support</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Scheduling System
            </h3>
            <p className="text-sm text-slate-300">Block scheduling for athletics</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-pink-400" />
              Communication Hub
            </h3>
            <p className="text-sm text-slate-300">Parent portal and messaging</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-400" />
              College Prep
            </h3>
            <p className="text-sm text-slate-300">Recruitment and scholarships</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Courses Enrolled</p>
                <p className="text-2xl font-bold text-white">{courses.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Overall Progress</p>
                <p className="text-2xl font-bold text-white">65%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Achievements</p>
                <p className="text-2xl font-bold text-white">{achievements.filter(a => a.unlocked).length}</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Study Streak</p>
                <p className="text-2xl font-bold text-white">15 days</p>
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
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BookOpen className="w-5 h-5" />
                Current Courses
                {selectedSchool === 'integrated' && (
                  <Badge variant="outline" className="ml-2 border-slate-600 text-slate-300">
                    Integrated Mode
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="border border-slate-700 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">{course.title}</h3>
                      <Badge variant={course.difficulty === 'Advanced' ? 'destructive' : course.difficulty === 'Intermediate' ? 'default' : 'secondary'}>
                        {course.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{course.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">Progress: {course.progress}%</span>
                      <span className="text-sm text-slate-400">{course.estimatedTime}</span>
                    </div>
                    <Progress value={course.progress} className="mb-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Next: {course.nextLesson}</span>
                      <Button size="sm" className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700">
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
          {/* Academy Mode Selection */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="w-5 h-5" />
                Academy Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    id="full-time" 
                    name="academyMode" 
                    checked={selectedSchool === 'full-time'}
                    onChange={() => setSelectedSchool('full-time')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="full-time" className="flex-1 text-sm text-white">
                    <span className="font-medium">Full-Time Academy</span>
                    <p className="text-xs text-slate-400">Complete your education through Go4It Sports Academy</p>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    id="integrated" 
                    name="academyMode" 
                    checked={selectedSchool === 'integrated'}
                    onChange={() => setSelectedSchool('integrated')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="integrated" className="flex-1 text-sm text-white">
                    <span className="font-medium">Integrated Mode</span>
                    <p className="text-xs text-slate-400">Supplement your current school with sports-focused courses</p>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Goals */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5" />
                Today&apos;s Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysGoals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${goal.completed ? 'bg-green-500' : 'bg-slate-600'}`}>
                      {goal.completed && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${goal.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                        {goal.title}
                      </p>
                      <p className="text-xs text-slate-400">{goal.subject}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Teachers */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
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
                      <p className="text-sm font-medium text-white">{teacher.name}</p>
                      <p className="text-xs text-slate-400">{teacher.subject}</p>
                      <p className="text-xs text-slate-500">Last helped: {teacher.lastHelped}</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.filter(a => a.unlocked).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-2 bg-slate-700 rounded">
                    <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{achievement.title}</p>
                      <p className="text-xs text-slate-400">{achievement.description}</p>
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
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Parent Portal</h1>
        <p className="text-lg text-slate-300">Monitor your child&apos;s academic and athletic progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Academic Progress */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BookOpen className="w-5 h-5" />
              Academic Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Overall GPA</span>
                <span className="font-semibold text-white">3.8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Courses Completed</span>
                <span className="font-semibold text-white">12/16</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">NCAA Eligible</span>
                <Badge variant="default" className="bg-green-500">Yes</Badge>
              </div>
              <Progress value={75} />
            </div>
          </CardContent>
        </Card>

        {/* Athletic Development */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Trophy className="w-5 h-5" />
              Athletic Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Training Sessions</span>
                <span className="font-semibold text-white">24/30</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Skill Progression</span>
                <span className="font-semibold text-white">Advanced</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">GAR Score</span>
                <span className="font-semibold text-green-400">87</span>
              </div>
              <Progress value={80} />
            </div>
          </CardContent>
        </Card>

        {/* Communication */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageCircle className="w-5 h-5" />
              Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-3">
                <p className="text-sm font-medium text-white">Coach Thompson</p>
                <p className="text-xs text-slate-400">Great progress in training!</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
              <div className="border-l-4 border-green-500 pl-3">
                <p className="text-sm font-medium text-white">Dr. Martinez</p>
                <p className="text-xs text-slate-400">Excellent sports science project</p>
                <p className="text-xs text-slate-500">1 day ago</p>
              </div>
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const AdminDashboard = () => {
    const [adminView, setAdminView] = useState('overview')
    
    const CMSSection = () => (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Content Management System</h2>
          <p className="text-lg text-slate-300">Create and manage academy content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="w-5 h-5" />
                Blog Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Published</span>
                  <span className="font-semibold text-white">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Drafts</span>
                  <span className="font-semibold text-white">8</span>
                </div>
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BookOpen className="w-5 h-5" />
                Training Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Video Tutorials</span>
                  <span className="font-semibold text-white">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">PDF Guides</span>
                  <span className="font-semibold text-white">32</span>
                </div>
                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resource
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bell className="w-5 h-5" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Active</span>
                  <span className="font-semibold text-white">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Scheduled</span>
                  <span className="font-semibold text-white">3</span>
                </div>
                <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                  <Bell className="w-4 h-4 mr-2" />
                  New Announcement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'NCAA Compliance Updates', type: 'Blog Post', date: '2 hours ago', status: 'Published' },
                  { title: 'Mental Performance Training Guide', type: 'Resource', date: '1 day ago', status: 'Published' },
                  { title: 'Spring Registration Open', type: 'Announcement', date: '2 days ago', status: 'Active' },
                  { title: 'Sports Science Lab Tour', type: 'Video', date: '3 days ago', status: 'Draft' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-sm text-slate-400">{item.type} • {item.date}</p>
                    </div>
                    <Badge 
                      variant={item.status === 'Published' ? 'default' : item.status === 'Active' ? 'default' : 'secondary'}
                      className={item.status === 'Published' ? 'bg-green-500' : item.status === 'Active' ? 'bg-blue-500' : 'bg-yellow-500'}
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Content Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Total Views</span>
                  <span className="font-semibold text-white">12,450</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Engagement Rate</span>
                  <span className="font-semibold text-white">73%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Top Content</span>
                  <span className="font-semibold text-white">Training Videos</span>
                </div>
                <Progress value={73} className="mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-white p-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-lg text-slate-300">Manage Go4It Sports Academy</p>
          
          {/* Admin Navigation */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button 
              variant={adminView === 'overview' ? 'default' : 'outline'}
              className={adminView === 'overview' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}
              onClick={() => setAdminView('overview')}
            >
              Overview
            </Button>
            <Button 
              variant={adminView === 'cms' ? 'default' : 'outline'}
              className={adminView === 'cms' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}
              onClick={() => setAdminView('cms')}
            >
              Content Management
            </Button>
            <Button 
              variant={adminView === 'users' ? 'default' : 'outline'}
              className={adminView === 'users' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'}
              onClick={() => setAdminView('users')}
            >
              User Management
            </Button>
          </div>
        </div>

        {adminView === 'cms' && <CMSSection />}
        {adminView === 'overview' && (
          <div className="space-y-6">
            {/* Enhanced Features Summary */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">12 Integrated Academy Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-400" />
                    1. Curriculum Management
                  </h4>
                  <p className="text-sm text-slate-300">K-12 standards alignment</p>
                  <div className="text-xs text-slate-400 mt-1 mb-2">
                    {enhancedFeatures.curriculum ? 'Active' : 'Loading...'}
                  </div>
                  <a href="/academy/curriculum" className="inline-block">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      Access Feature
                    </Button>
                  </a>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    2. Advanced Grading
                  </h4>
                  <p className="text-sm text-slate-300">Weighted categories</p>
                  <div className="text-xs text-slate-400 mt-1 mb-2">
                    {enhancedFeatures.grading ? 'Active' : 'Loading...'}
                  </div>
                  <a href="/academy/grading" className="inline-block">
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      Access Feature
                    </Button>
                  </a>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Play className="w-5 h-5 text-purple-400" />
                    3. LMS Platform
                  </h4>
                  <p className="text-sm text-slate-300">Interactive content</p>
                  <div className="text-xs text-slate-400 mt-1 mb-2">
                    {enhancedFeatures.lms ? 'Active' : 'Loading...'}
                  </div>
                  <a href="/academy/lms" className="inline-block">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      Access Feature
                    </Button>
                  </a>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    4. Learning Pathways
                  </h4>
                  <p className="text-sm text-slate-300">Personalized learning</p>
                  <div className="text-xs text-slate-400 mt-1">Active</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-400" />
                    5. Analytics & Reporting
                  </h4>
                  <p className="text-sm text-slate-300">Predictive analytics</p>
                  <div className="text-xs text-slate-400 mt-1 mb-2">
                    {enhancedFeatures.analytics ? 'Active' : 'Loading...'}
                  </div>
                  <a href="/academy/analytics" className="inline-block">
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                      Access Feature
                    </Button>
                  </a>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-400" />
                    6. Student Information
                  </h4>
                  <p className="text-sm text-slate-300">SIS management</p>
                  <div className="text-xs text-slate-400 mt-1">Active</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                    7. Communication Hub
                  </h4>
                  <p className="text-sm text-slate-300">Messaging platform</p>
                  <div className="text-xs text-slate-400 mt-1">
                    {enhancedFeatures.communication ? 'Active' : 'Loading...'}
                  </div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-pink-400" />
                    8. Sports Science Lab
                  </h4>
                  <p className="text-sm text-slate-300">Virtual labs</p>
                  <div className="text-xs text-slate-400 mt-1">Active</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                    9. Career Preparation
                  </h4>
                  <p className="text-sm text-slate-300">College recruitment</p>
                  <div className="text-xs text-slate-400 mt-1">Active</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-400" />
                    10. Resource Management
                  </h4>
                  <p className="text-sm text-slate-300">Equipment tracking</p>
                  <div className="text-xs text-slate-400 mt-1">
                    {enhancedFeatures.resources ? 'Active' : 'Loading...'}
                  </div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Star className="w-5 h-5 text-red-400" />
                    11. Security & Privacy
                  </h4>
                  <p className="text-sm text-slate-300">FERPA compliance</p>
                  <div className="text-xs text-slate-400 mt-1">
                    {enhancedFeatures.security ? 'Active' : 'Loading...'}
                  </div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    12. Integrations
                  </h4>
                  <p className="text-sm text-slate-300">LMS & automation</p>
                  <div className="text-xs text-slate-400 mt-1">
                    {enhancedFeatures.integrations ? 'Active' : 'Loading...'}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Total Students</p>
                      <p className="text-2xl font-bold text-white">1,247</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Active Courses</p>
                      <p className="text-2xl font-bold text-white">28</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">NCAA Eligible</p>
                      <p className="text-2xl font-bold text-white">89%</p>
                    </div>
                    <GraduationCap className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Avg GAR Score</p>
                      <p className="text-2xl font-bold text-white">84</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Enrollments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Marcus Johnson', sport: 'Basketball', date: '2 hours ago' },
                      { name: 'Sarah Williams', sport: 'Soccer', date: '5 hours ago' },
                      { name: 'David Chen', sport: 'Tennis', date: '1 day ago' },
                      { name: 'Emma Davis', sport: 'Volleyball', date: '2 days ago' }
                    ].map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded">
                        <div>
                          <p className="font-medium text-white">{student.name}</p>
                          <p className="text-sm text-slate-400">{student.sport}</p>
                        </div>
                        <span className="text-xs text-slate-500">{student.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Learning Management System</span>
                      <Badge variant="default" className="bg-green-500">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">AI Coaching Engine</span>
                      <Badge variant="default" className="bg-green-500">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Video Analysis</span>
                      <Badge variant="default" className="bg-green-500">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">NCAA Compliance</span>
                      <Badge variant="default" className="bg-green-500">Online</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        {adminView === 'users' && (
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400">User management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              Student Dashboard
            </button>
            <button
              onClick={() => setActiveTab('parent')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'parent'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Parent Portal
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
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