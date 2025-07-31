'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Trophy, Clock, CheckCircle, Play, FileText, Video, Calculator, Beaker, Globe, BookMarked } from 'lucide-react'

export default function AcademyPlusPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [availableCourses, setAvailableCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading curriculum data
    const loadCurriculum = async () => {
      // Mock data for demonstration - in real implementation this would come from API
      const mockEnrolledCourses = [
        {
          courseId: 'ck12-algebra-1',
          title: 'CK-12 Algebra I',
          subject: 'mathematics',
          gradeLevel: '9',
          progress: 45,
          currentUnit: 3,
          totalUnits: 7,
          source: 'CK-12 Foundation',
          nextLesson: 'Systems of Linear Equations - Lesson 2'
        },
        {
          courseId: 'ck12-biology',
          title: 'CK-12 Biology',
          subject: 'science',
          gradeLevel: '9',
          progress: 28,
          currentUnit: 2,
          totalUnits: 8,
          source: 'CK-12 Foundation',
          nextLesson: 'Cell Structure and Function - Lesson 8'
        },
        {
          courseId: 'oer-english-9',
          title: 'Grade 9 English Language Arts',
          subject: 'english',
          gradeLevel: '9',
          progress: 67,
          currentUnit: 4,
          totalUnits: 6,
          source: 'OER Commons',
          nextLesson: 'Narrative Writing - Lesson 12'
        }
      ]

      const mockAvailableCourses = [
        {
          courseId: 'ck12-geometry',
          title: 'CK-12 Geometry',
          subject: 'mathematics',
          gradeLevel: '10',
          estimatedHours: 160,
          source: 'CK-12 Foundation',
          description: 'Comprehensive geometry course covering shapes, proofs, and spatial reasoning'
        },
        {
          courseId: 'ck12-chemistry',
          title: 'CK-12 Chemistry',
          subject: 'science',
          gradeLevel: '10',
          estimatedHours: 180,
          source: 'CK-12 Foundation',
          description: 'Complete chemistry curriculum covering atomic structure, chemical bonds, and reactions'
        },
        {
          courseId: 'oer-world-history',
          title: 'World History',
          subject: 'history',
          gradeLevel: '9',
          estimatedHours: 140,
          source: 'OER Commons',
          description: 'Survey of world civilizations from ancient times to the modern era'
        },
        {
          courseId: 'oer-us-history',
          title: 'United States History',
          subject: 'history',
          gradeLevel: '11',
          estimatedHours: 150,
          source: 'OER Commons',
          description: 'Comprehensive study of American history from colonial times to present'
        }
      ]

      setEnrolledCourses(mockEnrolledCourses)
      setAvailableCourses(mockAvailableCourses)
      setLoading(false)
    }

    loadCurriculum()
  }, [])

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'mathematics': return Calculator
      case 'science': return Beaker
      case 'english': return BookMarked
      case 'history': return Globe
      default: return BookOpen
    }
  }

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'mathematics': return 'bg-blue-500'
      case 'science': return 'bg-green-500'
      case 'english': return 'bg-purple-500'
      case 'history': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading Academy curriculum...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Go4It Sports Academy</h1>
              <p className="text-xl text-blue-200">Premium Academic Platform • Grades 7-12</p>
            </div>
            <div className="text-right">
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold">Overall Progress</h3>
                <div className="text-3xl font-bold text-green-400">
                  {Math.round(enrolledCourses.reduce((acc, course) => acc + course.progress, 0) / enrolledCourses.length) || 0}%
                </div>
                <p className="text-sm text-blue-200">{enrolledCourses.length} Active Courses</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600">Dashboard</TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-blue-600">My Courses</TabsTrigger>
            <TabsTrigger value="catalog" className="data-[state=active]:bg-blue-600">Course Catalog</TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-blue-600">Progress & Grades</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Enrolled Courses</p>
                      <p className="text-2xl font-bold text-white">{enrolledCourses.length}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Completed Units</p>
                      <p className="text-2xl font-bold text-white">
                        {enrolledCourses.reduce((acc, course) => acc + course.currentUnit - 1, 0)}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Study Time</p>
                      <p className="text-2xl font-bold text-white">124h</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Current GPA</p>
                      <p className="text-2xl font-bold text-white">3.7</p>
                    </div>
                    <Trophy className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Courses */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Continue Learning</CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((course) => {
                    const SubjectIcon = getSubjectIcon(course.subject)
                    return (
                      <Card key={course.courseId} className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-2 rounded-lg ${getSubjectColor(course.subject)}`}>
                              <SubjectIcon className="h-6 w-6 text-white" />
                            </div>
                            <Badge variant="secondary" className="bg-slate-600 text-slate-200">
                              {course.source}
                            </Badge>
                          </div>
                          
                          <h3 className="font-semibold text-white mb-2">{course.title}</h3>
                          <p className="text-sm text-slate-400 mb-4">
                            Next: {course.nextLesson}
                          </p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Progress</span>
                              <span className="text-white">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-slate-400">
                              <span>Unit {course.currentUnit} of {course.totalUnits}</span>
                              <span>Grade {course.gradeLevel}</span>
                            </div>
                          </div>
                          
                          <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                            <Play className="h-4 w-4 mr-2" />
                            Continue Learning
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">My Enrolled Courses</CardTitle>
                <CardDescription>Track your progress across all subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrolledCourses.map((course) => {
                    const SubjectIcon = getSubjectIcon(course.subject)
                    return (
                      <div key={course.courseId} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${getSubjectColor(course.subject)}`}>
                            <SubjectIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{course.title}</h3>
                            <p className="text-sm text-slate-400">
                              Grade {course.gradeLevel} • {course.source}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-sm text-slate-400">Progress</p>
                            <p className="font-semibold text-white">{course.progress}%</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-400">Current Unit</p>
                            <p className="font-semibold text-white">{course.currentUnit}/{course.totalUnits}</p>
                          </div>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Enter Course
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Course Catalog Tab */}
          <TabsContent value="catalog" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Available Courses</CardTitle>
                <CardDescription>Enroll in new courses to expand your education</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableCourses.map((course) => {
                    const SubjectIcon = getSubjectIcon(course.subject)
                    return (
                      <Card key={course.courseId} className="bg-slate-700 border-slate-600">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-2 rounded-lg ${getSubjectColor(course.subject)}`}>
                              <SubjectIcon className="h-6 w-6 text-white" />
                            </div>
                            <Badge variant="secondary" className="bg-slate-600 text-slate-200">
                              {course.source}
                            </Badge>
                          </div>
                          
                          <h3 className="font-semibold text-white mb-2">{course.title}</h3>
                          <p className="text-sm text-slate-400 mb-4">{course.description}</p>
                          
                          <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                            <span>Grade {course.gradeLevel}</span>
                            <span>{course.estimatedHours} hours</span>
                          </div>
                          
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            Enroll Now
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Academic Standing */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Academic Standing</CardTitle>
                  <CardDescription>Overall academic performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Current GPA</span>
                      <span className="text-2xl font-bold text-green-400">3.7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Credits Earned</span>
                      <span className="text-xl font-semibold text-white">12.5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">NCAA Eligible</span>
                      <Badge className="bg-green-600 text-white">Yes</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Grades */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Current Grades</CardTitle>
                  <CardDescription>Individual course performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {enrolledCourses.map((course) => (
                      <div key={course.courseId} className="flex justify-between items-center">
                        <span className="text-slate-300">{course.title.split(' ').slice(0, 2).join(' ')}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold">
                            {course.progress > 60 ? 'A-' : course.progress > 40 ? 'B+' : 'B'}
                          </span>
                          <span className="text-slate-400">
                            ({Math.round(85 + course.progress * 0.15)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}