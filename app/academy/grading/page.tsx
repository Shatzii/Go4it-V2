'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, BarChart3, TrendingUp, Users, Calendar } from 'lucide-react'

interface GradingData {
  success: boolean
  gradeCategories: any[]
  studentGrades: any
  competencyTracking: any
  accessLog: any
  generatedAt: string
}

export default function GradingSystemPage() {
  const [gradingData, setGradingData] = useState<GradingData | null>(null)
  const [selectedCourse, setSelectedCourse] = useState('sports-science')

  useEffect(() => {
    const fetchGradingData = async () => {
      try {
        const response = await fetch('/api/academy/grading')
        const data = await response.json()
        setGradingData(data)
      } catch (error) {
        console.error('Error fetching grading data:', error)
      }
    }

    fetchGradingData()
  }, [])

  if (!gradingData) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-white">Loading advanced grading system...</p>
          </div>
        </div>
      </div>
    )
  }

  const currentCourse = gradingData.studentGrades.courses[0]
  const competencies = gradingData.competencyTracking['sports-science']?.competencies || []

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-white p-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Advanced Grading & Assessment Platform
          </h1>
          <p className="text-lg text-slate-300">Weighted categories, competency tracking, and real-time parent access</p>
        </div>

        {/* GPA Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Overall GPA</p>
                  <p className="text-2xl font-bold text-white">{gradingData.studentGrades.gpa}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Semester GPA</p>
                  <p className="text-2xl font-bold text-white">{gradingData.studentGrades.semesterGpa}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Credit Hours</p>
                  <p className="text-2xl font-bold text-white">{gradingData.studentGrades.creditHours}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Course Grade</p>
                  <p className="text-2xl font-bold text-white">{currentCourse.letterGrade}</p>
                </div>
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grade Categories */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Weighted Grade Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gradingData.gradeCategories.map((category: any, index: number) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{category.name}</h4>
                    <Badge className="bg-blue-500 text-white">{category.weight}%</Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">{category.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Weight</span>
                      <span className="text-sm text-white">{category.weight}%</span>
                    </div>
                    <Progress value={category.weight} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Course Performance */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Current Course Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">{currentCourse.courseName}</h3>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 text-white">{currentCourse.letterGrade}</Badge>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {currentCourse.trend}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Current Grade</span>
                <span className="text-lg font-bold text-white">{currentCourse.currentGrade}%</span>
              </div>
              <Progress value={currentCourse.currentGrade} className="h-3" />
            </div>

            <div className="space-y-4">
              {currentCourse.categories.map((category: any, index: number) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-white">{category.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500 text-white">{category.weight}%</Badge>
                      <span className="text-sm text-white">Avg: {category.average}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {category.grades.map((grade: any, gradeIndex: number) => (
                      <div key={gradeIndex} className="flex items-center justify-between p-2 bg-slate-600 rounded">
                        <div>
                          <p className="text-sm font-medium text-white">{grade.assignment}</p>
                          <p className="text-xs text-slate-400">{grade.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{grade.points}/{grade.total}</p>
                          <p className="text-xs text-slate-400">{Math.round((grade.points / grade.total) * 100)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Competency Tracking */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Standards-Based Competency Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {competencies.map((competency: any, index: number) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{competency.name}</h4>
                    <Badge 
                      className={`${
                        competency.level === 'Advanced' ? 'bg-green-500' :
                        competency.level === 'Proficient' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      } text-white`}
                    >
                      {competency.level}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-slate-400">Mastery Level</span>
                      <span className="text-sm text-white">{competency.score}/{competency.maxScore}</span>
                    </div>
                    <Progress value={(competency.score / competency.maxScore) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Evidence</p>
                      <div className="flex flex-wrap gap-1">
                        {competency.evidence.map((item: string, evidenceIndex: number) => (
                          <Badge key={evidenceIndex} variant="outline" className="text-xs text-slate-300 border-slate-500">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">Last assessed: {competency.lastAssessed}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Access Statistics */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Real-time Access & Parent Portal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Student Access Log
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Last Login</span>
                    <span className="text-sm text-white">{new Date(gradingData.accessLog.studentAccess.lastLogin).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Total Logins</span>
                    <span className="text-sm text-white">{gradingData.accessLog.studentAccess.loginCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Avg Session</span>
                    <span className="text-sm text-white">{gradingData.accessLog.studentAccess.averageSessionTime} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Most Viewed</span>
                    <span className="text-sm text-white">{gradingData.accessLog.studentAccess.mostViewedSection}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-400" />
                  Parent Access Log
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Last Login</span>
                    <span className="text-sm text-white">{new Date(gradingData.accessLog.parentAccess.lastLogin).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Total Logins</span>
                    <span className="text-sm text-white">{gradingData.accessLog.parentAccess.loginCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Avg Session</span>
                    <span className="text-sm text-white">{gradingData.accessLog.parentAccess.averageSessionTime} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Most Viewed</span>
                    <span className="text-sm text-white">{gradingData.accessLog.parentAccess.mostViewedSection}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Grade Assignment
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Trophy className="w-4 h-4 mr-2" />
            Update Categories
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  )
}