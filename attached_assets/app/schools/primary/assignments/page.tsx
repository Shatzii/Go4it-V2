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
  Target
} from 'lucide-react'
import Link from 'next/link'

export default function PrimaryAssignments() {
  const assignments = [
    {
      id: 1,
      title: 'Math Heroes - Multiplication Adventure',
      subject: 'Mathematics',
      teacher: 'Professor Newton',
      dueDate: '2025-07-15',
      status: 'pending',
      difficulty: 'medium',
      points: 25,
      description: 'Complete 20 multiplication problems using superhero themes'
    },
    {
      id: 2,
      title: 'Science Quest - Plant Growth Experiment',
      subject: 'Science',
      teacher: 'Dr. Curie',
      dueDate: '2025-07-18',
      status: 'in_progress',
      difficulty: 'easy',
      points: 30,
      description: 'Observe and record plant growth over 7 days'
    },
    {
      id: 3,
      title: 'Reading Heroes - Story Writing',
      subject: 'English',
      teacher: 'Ms. Shakespeare',
      dueDate: '2025-07-20',
      status: 'completed',
      difficulty: 'medium',
      points: 35,
      description: 'Write a superhero story with beginning, middle, and end'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold">My SuperHero Assignments! 🦸‍♂️🦸‍♀️</h1>
          <p className="text-blue-100 mt-1">Complete your hero missions and earn points!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">3</div>
              <div className="text-sm text-green-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700">2</div>
              <div className="text-sm text-yellow-600">In Progress</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">1</div>
              <div className="text-sm text-blue-600">Due Soon</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">90</div>
              <div className="text-sm text-purple-600">Hero Points</div>
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
                    <div className="text-4xl">
                      {assignment.subject === 'Mathematics' ? '🔢' :
                       assignment.subject === 'Science' ? '🔬' :
                       assignment.subject === 'English' ? '📚' : '📖'}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <p className="text-sm text-gray-600">{assignment.subject} • {assignment.teacher}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      assignment.status === 'completed' ? 'default' :
                      assignment.status === 'in_progress' ? 'secondary' : 'outline'
                    } className="text-sm">
                      {assignment.status === 'completed' ? '✅ Done!' :
                       assignment.status === 'in_progress' ? '⏳ Working' : '📋 To Do'}
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      ⭐ {assignment.points} points
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
                      {assignment.difficulty === 'easy' ? '🟢 Easy' :
                       assignment.difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      📖 View Details
                    </Button>
                    <Button size="sm" disabled={assignment.status === 'completed'}>
                      {assignment.status === 'completed' ? '✅ Completed' :
                       assignment.status === 'in_progress' ? '▶️ Continue' : '🚀 Start'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-medium text-blue-800 mb-4">Need Help with Your Assignments? 🤔</h3>
              <div className="flex justify-center gap-4">
                <Link href="/ai-teachers">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    🤖 Ask AI Teacher
                  </Button>
                </Link>
                <Link href="/schools/primary/virtual-classroom">
                  <Button variant="outline">
                    🎓 Join Virtual Class
                  </Button>
                </Link>
                <Link href="/schools/primary/student-dashboard">
                  <Button variant="outline">
                    🏠 Back to Dashboard
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