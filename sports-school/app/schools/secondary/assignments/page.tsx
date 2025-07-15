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
  Theater,
  Drama,
  Music
} from 'lucide-react'
import Link from 'next/link'

export default function SecondaryAssignments() {
  const assignments = [
    {
      id: 1,
      title: 'Romeo and Juliet - Character Analysis',
      subject: 'English Literature',
      teacher: 'Ms. Shakespeare',
      dueDate: '2025-07-16',
      status: 'pending',
      difficulty: 'medium',
      points: 45,
      description: 'Analyze the character development of Romeo throughout Acts 1-3'
    },
    {
      id: 2,
      title: 'Stage Performance - Monologue Practice',
      subject: 'Drama',
      teacher: 'Mr. Stanislavski',
      dueDate: '2025-07-19',
      status: 'in_progress',
      difficulty: 'hard',
      points: 60,
      description: 'Prepare and perform a 3-minute monologue from any classical play'
    },
    {
      id: 3,
      title: 'Music Theory - Harmony Composition',
      subject: 'Music',
      teacher: 'Maestro Picasso',
      dueDate: '2025-07-22',
      status: 'completed',
      difficulty: 'medium',
      points: 40,
      description: 'Compose a 16-bar piece demonstrating proper harmonic progression'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold">S.T.A.G.E Prep Assignments 🎭</h1>
          <p className="text-purple-100 mt-1">Showcase your theatrical and academic talents</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">8</div>
              <div className="text-sm text-green-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700">3</div>
              <div className="text-sm text-yellow-600">In Progress</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">2</div>
              <div className="text-sm text-blue-600">Due Soon</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">340</div>
              <div className="text-sm text-purple-600">Total Points</div>
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
                      {assignment.subject === 'English Literature' ? '📚' :
                       assignment.subject === 'Drama' ? '🎭' :
                       assignment.subject === 'Music' ? '🎵' : '🎨'}
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
                    }>
                      {assignment.status === 'completed' ? 'Completed' :
                       assignment.status === 'in_progress' ? 'In Progress' : 'Pending'}
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
                      <FileText className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" disabled={assignment.status === 'completed'}>
                      {assignment.status === 'completed' ? 'Completed' :
                       assignment.status === 'in_progress' ? 'Continue' : 'Start'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-medium text-purple-800 mb-4">Need Assignment Help?</h3>
              <div className="flex justify-center gap-4">
                <Link href="/ai-teachers">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Ask AI Teacher
                  </Button>
                </Link>
                <Link href="/schools/secondary/virtual-classroom">
                  <Button variant="outline">
                    Join Virtual Class
                  </Button>
                </Link>
                <Link href="/schools/secondary/student-dashboard">
                  <Button variant="outline">
                    Back to Dashboard
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