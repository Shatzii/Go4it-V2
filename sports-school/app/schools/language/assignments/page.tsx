'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Clock,
  Star,
  Trophy,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  Globe,
  Languages,
  Headphones,
  Mic,
} from 'lucide-react';
import Link from 'next/link';

export default function LanguageAssignments() {
  const assignments = [
    {
      id: 1,
      title: 'Spanish Conversation - Restaurant Dialogue',
      subject: 'Spanish',
      teacher: 'Profesora María',
      dueDate: '2025-07-16',
      status: 'pending',
      difficulty: 'medium',
      points: 40,
      description: 'Create and record a 5-minute restaurant conversation',
      flag: '🇪🇸',
    },
    {
      id: 2,
      title: 'French Cultural Essay - French Revolution',
      subject: 'French',
      teacher: 'Madame Claire',
      dueDate: '2025-07-19',
      status: 'in_progress',
      difficulty: 'hard',
      points: 50,
      description: 'Write a 1000-word essay about the French Revolution impact',
      flag: '🇫🇷',
    },
    {
      id: 3,
      title: 'Mandarin Characters - Writing Practice',
      subject: 'Mandarin',
      teacher: '李老师 (Teacher Li)',
      dueDate: '2025-07-22',
      status: 'completed',
      difficulty: 'medium',
      points: 45,
      description: 'Practice writing 50 new characters with proper stroke order',
      flag: '🇨🇳',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold">Language Learning Assignments 🌍</h1>
          <p className="text-green-100 mt-1">Multilingual Practice & Cultural Exploration</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">15</div>
              <div className="text-sm text-green-600">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700">5</div>
              <div className="text-sm text-yellow-600">In Progress</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">6</div>
              <div className="text-sm text-blue-600">Languages</div>
            </CardContent>
          </Card>
          <Card className="border-teal-200 bg-teal-50">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-teal-700">680</div>
              <div className="text-sm text-teal-600">Total Points</div>
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
                    <div className="text-4xl">{assignment.flag}</div>
                    <div>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {assignment.subject} • {assignment.teacher}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        assignment.status === 'completed'
                          ? 'default'
                          : assignment.status === 'in_progress'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {assignment.status === 'completed'
                        ? 'Completed'
                        : assignment.status === 'in_progress'
                          ? 'In Progress'
                          : 'Pending'}
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
                      {assignment.difficulty === 'easy'
                        ? 'Easy'
                        : assignment.difficulty === 'medium'
                          ? 'Medium'
                          : 'Hard'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Headphones className="h-4 w-4 mr-1" />
                      Audio Guide
                    </Button>
                    <Button size="sm" disabled={assignment.status === 'completed'}>
                      {assignment.status === 'completed'
                        ? 'Completed'
                        : assignment.status === 'in_progress'
                          ? 'Continue'
                          : 'Start Practice'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Language Progress */}
        <Card className="mt-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Language Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🇪🇸</div>
                <p className="font-medium">Spanish</p>
                <p className="text-sm text-gray-600">Intermediate</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🇫🇷</div>
                <p className="font-medium">French</p>
                <p className="text-sm text-gray-600">Beginner</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🇨🇳</div>
                <p className="font-medium">Mandarin</p>
                <p className="text-sm text-gray-600">Beginner</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-6 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-medium text-green-800 mb-4">Need Language Learning Help?</h3>
              <div className="flex justify-center gap-4">
                <Link href="/ai-teachers">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Chat with AI Language Tutor
                  </Button>
                </Link>
                <Link href="/schools/language/virtual-classroom">
                  <Button variant="outline">Join Virtual Class</Button>
                </Link>
                <Link href="/schools/language/student-dashboard">
                  <Button variant="outline">Back to Language Dashboard</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
