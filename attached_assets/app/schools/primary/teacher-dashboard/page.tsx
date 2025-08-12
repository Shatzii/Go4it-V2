
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { QuickLinks } from '@/components/dashboard/quick-links'
import { ClassCreator } from '@/components/dashboard/class-creator'
import { 
  BookOpen, Users, Brain, Calendar, 
  MessageCircle, TrendingUp, Trophy, Star,
  GraduationCap, FileText, Clock
} from 'lucide-react'

export default function PrimaryTeacherDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-32 bg-blue-600 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-blue-500/20 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-white/30">
                <AvatarFallback className="bg-blue-500 text-white font-bold text-xl">
                  MS
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">Ms. Smith</h1>
                <p className="text-blue-200">3rd Grade Teacher</p>
                <p className="text-indigo-200">SuperHero School (K-6)</p>
                <Badge className="mt-2 bg-white/20">Certified Teacher</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">24 Students</div>
              <div className="text-blue-200">Active Classes: 3</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <QuickLinks userType="teacher" schoolId="primary" />

        {/* Class Creator */}
        <ClassCreator userType="teacher" schoolId="primary" userId="teacher-demo" />

        {/* Classes Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Math Heroes', students: 24, subject: 'Mathematics', progress: 85 },
            { name: 'Reading Rangers', students: 20, subject: 'Reading', progress: 92 },
            { name: 'Science Explorers', students: 18, subject: 'Science', progress: 78 }
          ].map((classData, index) => (
            <Card key={index} className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <BookOpen className="w-5 h-5" />
                  {classData.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{classData.subject}</span>
                    <span className="text-indigo-300">{classData.students} students</span>
                  </div>
                  <Progress value={classData.progress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Class Progress</span>
                    <span className="text-green-300">{classData.progress}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Teaching Tools & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Brain className="w-5 h-5" />
                AI Teaching Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Lesson Plans Ready</span>
                  <Badge className="bg-purple-500">5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Student Assessments</span>
                  <span className="text-purple-300">12 pending</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Curriculum Progress</span>
                  <Badge className="bg-green-500">On Track</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-5 h-5" />
                Class Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Average Grade</span>
                  <Badge className="bg-green-500">B+</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Attendance Rate</span>
                  <span className="text-green-300">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Engagement Score</span>
                  <Badge className="bg-green-500">High</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
