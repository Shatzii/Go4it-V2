'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Clock, 
  Star, 
  Trophy, 
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  Activity,
  Target,
  Timer,
  Award
} from 'lucide-react'
import Link from 'next/link'

export default function SportsAssignments() {
  const assignments = [
    {
      id: 1,
      title: 'Basketball Training - Shooting Drills',
      subject: 'Basketball',
      coach: 'Coach Thompson',
      dueDate: '2025-07-16',
      status: 'pending',
      difficulty: 'medium',
      points: 50,
      description: 'Complete 100 free throws and 50 three-pointers, record accuracy',
      sport: '🏀'
    },
    {
      id: 2,
      title: 'Swimming - Stroke Technique Analysis',
      subject: 'Swimming',
      coach: 'Coach Martinez',
      dueDate: '2025-07-19',
      status: 'in_progress',
      difficulty: 'hard',
      points: 60,
      description: 'Video analysis of freestyle stroke technique improvements',
      sport: '🏊‍♂️'
    },
    {
      id: 3,
      title: 'Track & Field - Speed Training Log',
      subject: 'Track & Field',
      coach: 'Coach Williams',
      dueDate: '2025-07-22',
      status: 'completed',
      difficulty: 'medium',
      points: 45,
      description: 'Complete 2-week sprint training program and log times',
      sport: '🏃‍♂️'
    }
  ]

  const performanceStats = [
    { sport: 'Basketball', current: '85%', goal: '90%', icon: '🏀' },
    { sport: 'Swimming', current: '78%', goal: '85%', icon: '🏊‍♂️' },
    { sport: 'Track', current: '92%', goal: '95%', icon: '🏃‍♂️' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold">Athletic Training Assignments 🏆</h1>
          <p className="text-yellow-100 mt-1">Go4it Sports Academy - Elite Performance Training</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">18</div>
              <div className="text-sm text-green-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700">6</div>
              <div className="text-sm text-yellow-600">In Progress</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">3</div>
              <div className="text-sm text-blue-600">Due Soon</div>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700">1,240</div>
              <div className="text-sm text-orange-600">Total Points</div>
            </CardContent>
          </Card>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{assignment.sport}</div>
                    <div>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <p className="text-sm text-gray-600">{assignment.subject} • {assignment.coach}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      assignment.status === 'completed' ? 'default' :
                      assignment.status === 'in_progress' ? 'secondary' : 'outline'
                    }>
                      {assignment.status === 'completed' ? 'Completed' :
                       assignment.status === 'in_progress' ? 'Training' : 'Pending'}
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {assignment.points} points
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{assignment.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Due: {assignment.dueDate}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {assignment.difficulty === 'easy' ? 'Easy' :
                       assignment.difficulty === 'medium' ? 'Medium' : 'Hard'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Timer className="h-4 w-4 mr-1" />
                      Track Progress
                    </Button>
                    <Button size="sm" disabled={assignment.status === 'completed'}>
                      {assignment.status === 'completed' ? 'Completed' :
                       assignment.status === 'in_progress' ? 'Continue Training' : 'Start Training'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Overview */}
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {performanceStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="font-medium">{stat.sport}</p>
                  <p className="text-sm text-gray-600">Current: {stat.current}</p>
                  <p className="text-sm text-gray-600">Goal: {stat.goal}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{
                      width: stat.current
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-6 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-medium text-yellow-800 mb-4">Need Athletic Performance Help?</h3>
              <div className="flex justify-center gap-4">
                <Link href="/ai-teachers">
                  <Button className="bg-yellow-600 hover:bg-yellow-700">
                    Chat with AI Sports Coach
                  </Button>
                </Link>
                <Link href="/schools/go4it-sports-academy/virtual-classroom">
                  <Button variant="outline">
                    Join Training Session
                  </Button>
                </Link>
                <Link href="/schools/go4it-sports-academy/student-dashboard">
                  <Button variant="outline">
                    Back to Sports Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}