'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { QuickLinks } from '@/components/dashboard/quick-links';
import { ClassCreator } from '@/components/dashboard/class-creator';
import {
  BookOpen,
  Users,
  Brain,
  Calendar,
  MessageCircle,
  TrendingUp,
  Trophy,
  Star,
  GraduationCap,
  FileText,
  Clock,
  Target,
} from 'lucide-react';

export default function SecondaryTeacherDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-white/30">
                <AvatarFallback className="bg-indigo-500 text-white font-bold text-xl">
                  DR
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">Dr. Rodriguez</h1>
                <p className="text-indigo-200">AP Mathematics Teacher</p>
                <p className="text-purple-200">S.T.A.G.E Prep Global Academy (7-12)</p>
                <Badge className="mt-2 bg-white/20">Department Head</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">86 Students</div>
              <div className="text-indigo-200">5 Classes</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <QuickLinks userType="teacher" schoolId="secondary" />

        {/* Class Creator */}
        <ClassCreator userType="teacher" schoolId="secondary" userId="teacher-demo" />

        {/* Classes Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'AP Calculus BC', students: 18, level: 'Advanced', progress: 85 },
            { name: 'Algebra II Honors', students: 22, level: 'Honors', progress: 92 },
            { name: 'Pre-Calculus', students: 24, level: 'Standard', progress: 78 },
            { name: 'Statistics AP', students: 16, level: 'AP', progress: 88 },
            { name: 'Geometry', students: 20, level: 'Standard', progress: 83 },
          ].map((classData, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-400">
                  <BookOpen className="w-5 h-5" />
                  {classData.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{classData.level}</span>
                    <span className="text-purple-300">{classData.students} students</span>
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

        {/* Advanced Teaching Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-400">
                <Target className="w-5 h-5" />
                College Prep Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>AP Pass Rate</span>
                  <Badge className="bg-pink-500">95%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>College Acceptance</span>
                  <span className="text-pink-300">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>SAT Avg Improvement</span>
                  <Badge className="bg-green-500">+180 pts</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border-teal-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-400">
                <Brain className="w-5 h-5" />
                AI Teaching Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Lesson Plans Ready</span>
                  <Badge className="bg-teal-500">12</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Student Assessments</span>
                  <span className="text-teal-300">45 pending</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Grade Predictions</span>
                  <Badge className="bg-green-500">Ready</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
