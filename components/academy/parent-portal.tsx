'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  MessageCircle, 
  Calendar,
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  Star,
  FileText,
  Brain,
  Map,
  Target,
  GraduationCap,
  CreditCard,
  Bell,
  Shield,
  Video,
  Upload,
  Download,
  DollarSign,
  Package
} from 'lucide-react'

interface ParentData {
  parent: {
    id: string
    name: string
    email: string
    preferredLanguage: string
  }
  children: Array<{
    id: string
    name: string
    grade: string
    school: string
    schoolName: string
    neurotype: string
    enrollmentType: string
    status: string
    currentGPA: number | string
    attendance: number
    recentProgress: {
      lessonsCompleted: number
      averageScore: number
      streak: number
      lastActivity: string
    }
  }>
  overview: {
    totalChildren: number
    activeEnrollments: number
    upcomingEvents: number
    pendingApprovals: number
    unreadMessages: number
    pendingPayments: number
    nextPaymentDue: string
    totalSpent: number
    safetyAlerts: number
  }
  quickActions: string[]
  recentActivity: Array<{
    type: string
    message: string
    timestamp: string
    child: string
  }>
}

export default function ParentPortal() {
  const [parentData, setParentData] = useState<ParentData | null>(null)
  const [selectedChild, setSelectedChild] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchParentData()
  }, [])

  const fetchParentData = async () => {
    try {
      // In real implementation, get parentId from auth context
      // Use self-hosted mock data - no external APIs needed
      setParentData(getMockParentData())
      setSelectedChild('child1')
    } catch (error) {
      console.error('Failed to fetch parent data:', error)
      // Use fallback data on error
      setParentData(getMockParentData())
      setSelectedChild('child1')
    } finally {
      setLoading(false)
    }
  }

  const getMockParentData = (): ParentData => ({
    parent: {
      id: 'parent1',
      name: 'John & Sarah Smith',
      email: 'parents@example.com',
      preferredLanguage: 'English'
    },
    children: [
      {
        id: 'child1',
        name: 'Emma Smith',
        grade: '5',
        school: 'primary-school',
        schoolName: 'Primary School',
        neurotype: 'ADHD Support',
        enrollmentType: 'Full-Time',
        status: 'Active',
        currentGPA: 3.8,
        attendance: 96,
        recentProgress: {
          lessonsCompleted: 24,
          averageScore: 87,
          streak: 12,
          lastActivity: '2 hours ago'
        }
      },
      {
        id: 'child2',
        name: 'Alex Smith',
        grade: '8',
        school: 'secondary-school',
        schoolName: 'Secondary School',
        neurotype: 'Dyslexia Support',
        enrollmentType: 'Full-Time',
        status: 'Active',
        currentGPA: 3.6,
        attendance: 94,
        recentProgress: {
          lessonsCompleted: 18,
          averageScore: 82,
          streak: 8,
          lastActivity: '1 hour ago'
        }
      }
    ],
    overview: {
      totalChildren: 2,
      activeEnrollments: 2,
      upcomingEvents: 3,
      pendingApprovals: 1,
      unreadMessages: 2,
      pendingPayments: 0,
      nextPaymentDue: 'Feb 15, 2025',
      totalSpent: 299,
      safetyAlerts: 0
    },
    quickActions: [
      'Schedule Conference',
      'Request Transcript',
      'Update Information',
      'Message Teacher',
      'View Calendar'
    ],
    recentActivity: [
      {
        type: 'achievement',
        message: 'Emma completed Math Level 5',
        timestamp: '2 hours ago',
        child: 'Emma'
      },
      {
        type: 'assignment',
        message: 'Alex submitted Science Project',
        timestamp: '4 hours ago',
        child: 'Alex'
      }
    ]
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!parentData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold">Unable to load parent portal</h3>
        <p className="text-gray-600">Please try again later</p>
      </div>
    )
  }

  const selectedChildData = parentData.children.find(child => child.id === selectedChild)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Parent Portal</h1>
          <p className="text-gray-600">Welcome back, {parentData.parent.name}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Messages ({parentData.overview.unreadMessages})
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Conference
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Children Enrolled</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parentData.overview.totalChildren}</div>
            <p className="text-xs text-muted-foreground">Active students</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parentData.overview.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parentData.overview.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">From teachers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parentData.overview.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Require action</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Average completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Child Selection */}
      {parentData.children.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Child</CardTitle>
            <CardDescription>View individual progress and details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parentData.children.map((child) => (
                <Button
                  key={child.id}
                  variant={selectedChild === child.id ? 'default' : 'outline'}
                  onClick={() => setSelectedChild(child.id)}
                  className="h-20 flex flex-col justify-center"
                >
                  <span className="font-semibold">{child.name}</span>
                  <span className="text-xs">{child.schoolName} - Grade {child.grade}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard */}
      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="progress">Progress & Grades</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="schedule">Schedule & Events</TabsTrigger>
          <TabsTrigger value="payments">Billing & Payments</TabsTrigger>
          <TabsTrigger value="safety">Safety & Monitoring</TabsTrigger>
          <TabsTrigger value="reports">Reports & Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          {selectedChildData && (
            <>
              {/* Child Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedChildData.name} - Progress Overview</span>
                    <Badge variant="outline">{selectedChildData.schoolName}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Grade {selectedChildData.grade} • {selectedChildData.neurotype} • {selectedChildData.enrollmentType}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {typeof selectedChildData.currentGPA === 'number' 
                          ? selectedChildData.currentGPA.toFixed(1) 
                          : selectedChildData.currentGPA}
                      </div>
                      <div className="text-sm text-gray-600">Current GPA</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {selectedChildData.attendance}%
                      </div>
                      <div className="text-sm text-gray-600">Attendance Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {selectedChildData.recentProgress.streak}
                      </div>
                      <div className="text-sm text-gray-600">Day Learning Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Progress */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Academic Progress</CardTitle>
                    <CardDescription>Last 30 days of learning activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Lessons Completed</span>
                        <span className="font-bold">{selectedChildData.recentProgress.lessonsCompleted}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Score</span>
                        <span className="font-bold">{selectedChildData.recentProgress.averageScore}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Learning Streak</span>
                        <span className="font-bold">{selectedChildData.recentProgress.streak} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Last Activity</span>
                        <span className="font-bold">
                          {new Date(selectedChildData.recentProgress.lastActivity).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Neurodivergent Support</CardTitle>
                    <CardDescription>Specialized accommodations and progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">Accommodations active</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm">Specialized curriculum materials</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">Support team coordination</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <span className="text-sm">Progress tracking optimized</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="curriculum" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Curriculum Generator for Parents */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-green-600" />
                  Family Curriculum Planning
                </CardTitle>
                <CardDescription>
                  Create personalized learning plans for your children with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4 text-green-500" />
                    <span>State Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span>Child-Specific</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span>Flexible Schedule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>Family Friendly</span>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <a href="/curriculum-planning?userType=parent" target="_blank" rel="noopener noreferrer">
                    Create Family Curriculum
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Homeschool Schedule Builder */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  Homeschool Schedule Builder
                </CardTitle>
                <CardDescription>
                  Build comprehensive schedules for homeschooling your children
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Semester Planning</span>
                    <Badge variant="outline">18 weeks</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Year Planning</span>
                    <Badge variant="outline">36 weeks</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Multi-Child Support</span>
                    <Badge variant="outline">All grades</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/curriculum-planning?tab=generator&userType=parent" target="_blank" rel="noopener noreferrer">
                    Build Schedule
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* State Requirements Checker */}
            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-6 w-6 text-orange-600" />
                  State Requirements
                </CardTitle>
                <CardDescription>
                  Ensure your homeschool curriculum meets legal requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <p>• All 50 states supported</p>
                  <p>• Graduation requirements</p>
                  <p>• Testing schedules</p>
                  <p>• Record keeping guidance</p>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/curriculum-planning?tab=features&focus=compliance" target="_blank" rel="noopener noreferrer">
                    Check Requirements
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Special Needs Planning */}
            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                  Special Needs Planning
                </CardTitle>
                <CardDescription>
                  Specialized curriculum planning for children with learning differences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  {selectedChildData?.neurotype && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{selectedChildData.neurotype} support available</span>
                    </div>
                  )}
                  <p>• IEP and 504 plan integration</p>
                  <p>• Sensory break scheduling</p>
                  <p>• Accommodation strategies</p>
                  <p>• Progress tracking tools</p>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/curriculum-planning?accommodations=ADHD,Dyslexia,Autism&userType=parent" target="_blank" rel="noopener noreferrer">
                    Special Needs Tools
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Child-Specific Curriculum Links */}
          {selectedChildData && (
            <Card>
              <CardHeader>
                <CardTitle>Curriculum for {selectedChildData.name}</CardTitle>
                <CardDescription>
                  Quick access to grade-specific and interest-based curriculum options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/curriculum-planning?grade=${selectedChildData.grade}&subjects=Mathematics&userType=parent`} target="_blank">
                      Math for Grade {selectedChildData.grade}
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/curriculum-planning?grade=${selectedChildData.grade}&subjects=English&userType=parent`} target="_blank">
                      English for Grade {selectedChildData.grade}
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/curriculum-planning?grade=${selectedChildData.grade}&subjects=Science&userType=parent`} target="_blank">
                      Science for Grade {selectedChildData.grade}
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/curriculum-planning?grade=${selectedChildData.grade}&accommodations=${selectedChildData.neurotype}&userType=parent`} target="_blank">
                      {selectedChildData.neurotype} Support
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Parent Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Parent Education Resources</CardTitle>
              <CardDescription>
                Tools and guides to support your curriculum planning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Getting Started</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Homeschool basics guide</li>
                    <li>• State law overview</li>
                    <li>• Record keeping templates</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Teaching Methods</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Learning style assessment</li>
                    <li>• Multi-sensory techniques</li>
                    <li>• Project-based learning</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Support Network</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Parent community forum</li>
                    <li>• Expert consultations</li>
                    <li>• Local support groups</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <a href="/curriculum-planning?tab=resources&userType=parent" target="_blank" rel="noopener noreferrer">
                    Access All Parent Resources
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Communications from teachers and school staff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parentData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">{activity.child}</Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events & Schedule</CardTitle>
              <CardDescription>Important dates and scheduled activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Parent-Teacher Conference</p>
                    <p className="text-sm text-gray-600">January 15, 2025 at 3:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Science Fair Presentation</p>
                    <p className="text-sm text-gray-600">January 22, 2025 at 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Theater Performance</p>
                    <p className="text-sm text-gray-600">February 5, 2025 at 7:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Reports & Documents</CardTitle>
              <CardDescription>Progress reports, transcripts, and important documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 flex flex-col">
                  <FileText className="h-6 w-6 mb-1" />
                  <span className="text-sm">Progress Report</span>
                  <span className="text-xs text-gray-500">Q2 2025</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col">
                  <Award className="h-6 w-6 mb-1" />
                  <span className="text-sm">Achievement Record</span>
                  <span className="text-xs text-gray-500">Current Year</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col">
                  <BookOpen className="h-6 w-6 mb-1" />
                  <span className="text-sm">Attendance Report</span>
                  <span className="text-xs text-gray-500">Monthly</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col">
                  <Users className="h-6 w-6 mb-1" />
                  <span className="text-sm">IEP Documentation</span>
                  <span className="text-xs text-gray-500">If applicable</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Management Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                  Payment Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Monthly Subscription</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Next Payment Due</span>
                    <span className="font-semibold">{parentData.overview.nextPaymentDue || 'Feb 15, 2025'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Spent (2025)</span>
                    <span className="font-semibold">${parentData.overview.totalSpent || 299}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <Button className="w-full">
                      <Package className="h-4 w-4 mr-2" />
                      Manage Subscription
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-blue-600" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">January Payment</p>
                      <p className="text-sm text-gray-600">Jan 15, 2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$49.99</p>
                      <Badge variant="outline" className="text-xs">Paid</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">December Payment</p>
                      <p className="text-sm text-gray-600">Dec 15, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$49.99</p>
                      <Badge variant="outline" className="text-xs">Paid</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Safety & Monitoring Tab */}
        <TabsContent value="safety" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Safety Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span>All children safe</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Good</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-blue-600 mr-2" />
                      <span>Online activity monitored</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                      <span>Security alerts</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">{parentData.overview.safetyAlerts || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2 text-purple-600" />
                  Virtual Classroom Safety
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800">Live Session Monitoring</h4>
                    <p className="text-sm text-purple-600">All virtual classes are recorded and monitored for safety</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Parental oversight</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Teacher verification</span>
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Safe communication</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Video className="h-4 w-4 mr-2" />
                    View Classroom Guidelines
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {selectedChildData && (
            <Card>
              <CardHeader>
                <CardTitle>Digital Wellness for {selectedChildData.name}</CardTitle>
                <CardDescription>Monitor and manage your child's digital learning environment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Screen Time Today</h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">2h 15m</div>
                      <div className="text-sm text-gray-600">Learning time</div>
                    </div>
                    <Progress value={45} className="mt-2" />
                    <p className="text-xs text-gray-600">Recommended: 3-5 hours for Grade {selectedChildData.grade}</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Break Reminders</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Every 30 minutes</span>
                        <Badge className="bg-green-100 text-green-800">On</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Movement breaks</span>
                        <Badge className="bg-green-100 text-green-800">On</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Eye rest reminders</span>
                        <Badge className="bg-green-100 text-green-800">On</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Communication Safety</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Message filtering</span>
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Adult supervision</span>
                        <Badge className="bg-green-100 text-green-800">Required</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Blocked content</span>
                        <Badge className="bg-red-100 text-red-800">0 today</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <div className="flex space-x-3">
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Safety Settings
                    </Button>
                    <Button variant="outline">
                      <Clock className="h-4 w-4 mr-2" />
                      Screen Time Controls
                    </Button>
                    <Button variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Communication Rules
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {parentData.quickActions.map((action, index) => (
              <Button key={index} variant="outline" size="sm">
                {action}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}