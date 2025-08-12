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
  Scale,
  Gavel,
  Building
} from 'lucide-react'
import Link from 'next/link'

export default function LawAssignments() {
  const assignments = [
    {
      id: 1,
      title: 'Constitutional Law - Case Brief Analysis',
      subject: 'Constitutional Law',
      professor: 'Professor Justice',
      dueDate: '2025-07-17',
      status: 'pending',
      difficulty: 'hard',
      points: 75,
      description: 'Analyze Marbury v. Madison and its impact on judicial review'
    },
    {
      id: 2,
      title: 'Contract Law - Breach of Contract Memo',
      subject: 'Contract Law',
      professor: 'Professor Legal',
      dueDate: '2025-07-20',
      status: 'in_progress',
      difficulty: 'medium',
      points: 60,
      description: 'Draft legal memo on breach of contract remedies'
    },
    {
      id: 3,
      title: 'Criminal Law - Evidence Analysis',
      subject: 'Criminal Law',
      professor: 'Professor Evidence',
      dueDate: '2025-07-25',
      status: 'completed',
      difficulty: 'hard',
      points: 80,
      description: 'Evaluate admissibility of evidence in criminal proceedings'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-gray-800 text-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold">Legal Case Assignments ⚖️</h1>
          <p className="text-blue-100 mt-1">Future Legal Professionals - Case Analysis & Legal Writing</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">12</div>
              <div className="text-sm text-green-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700">4</div>
              <div className="text-sm text-yellow-600">In Progress</div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-700">1</div>
              <div className="text-sm text-red-600">Due Soon</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">920</div>
              <div className="text-sm text-blue-600">Total Points</div>
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
                      {assignment.subject === 'Constitutional Law' ? '📜' :
                       assignment.subject === 'Contract Law' ? '📋' :
                       assignment.subject === 'Criminal Law' ? '⚖️' : '📚'}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <p className="text-sm text-gray-600">{assignment.subject} • {assignment.professor}</p>
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
                      View Case Files
                    </Button>
                    <Button size="sm" disabled={assignment.status === 'completed'}>
                      {assignment.status === 'completed' ? 'Completed' :
                       assignment.status === 'in_progress' ? 'Continue Research' : 'Start Analysis'}
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
              <h3 className="font-medium text-blue-800 mb-4">Need Legal Research Assistance?</h3>
              <div className="flex justify-center gap-4">
                <Link href="/ai-teachers">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Consult AI Legal Scholar
                  </Button>
                </Link>
                <Link href="/schools/law/virtual-classroom">
                  <Button variant="outline">
                    Join Virtual Classroom
                  </Button>
                </Link>
                <Link href="/schools/law/student-dashboard">
                  <Button variant="outline">
                    Back to Law Dashboard
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