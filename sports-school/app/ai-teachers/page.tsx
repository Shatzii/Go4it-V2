'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  BookOpen,
  Calculator,
  Microscope,
  Palette,
  Globe,
  Heart,
  Star,
  Video,
  Clock,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export default function AITeachers() {
  const aiTeachers = [
    {
      id: 1,
      name: 'Professor Newton',
      subject: 'Mathematics',
      personality: 'Patient & Methodical',
      specialization: 'Problem-solving, logical thinking',
      icon: <Calculator className="h-8 w-8" />,
      color: 'blue',
      status: 'online',
      studentsHelped: 1240,
      description: 'Makes complex math concepts simple and fun through step-by-step guidance',
    },
    {
      id: 2,
      name: 'Dr. Curie',
      subject: 'Science',
      personality: 'Curious & Experimental',
      specialization: 'Scientific inquiry, experiments',
      icon: <Microscope className="h-8 w-8" />,
      color: 'green',
      status: 'online',
      studentsHelped: 980,
      description: 'Encourages discovery through hands-on experiments and real-world applications',
    },
    {
      id: 3,
      name: 'Ms. Shakespeare',
      subject: 'English Language Arts',
      personality: 'Creative & Expressive',
      specialization: 'Writing, reading comprehension',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'purple',
      status: 'online',
      studentsHelped: 1580,
      description: 'Inspires creativity in writing and deep understanding of literature',
    },
    {
      id: 4,
      name: 'Professor Timeline',
      subject: 'Social Studies',
      personality: 'Storytelling & Engaging',
      specialization: 'History, geography, civics',
      icon: <Globe className="h-8 w-8" />,
      color: 'orange',
      status: 'online',
      studentsHelped: 750,
      description: 'Brings history to life through engaging stories and connections to today',
    },
    {
      id: 5,
      name: 'Maestro Picasso',
      subject: 'Arts & Creativity',
      personality: 'Multi-sensory & Expressive',
      specialization: 'Art, music, creative expression',
      icon: <Palette className="h-8 w-8" />,
      color: 'pink',
      status: 'online',
      studentsHelped: 620,
      description: 'Nurtures artistic expression through various mediums and creative techniques',
    },
    {
      id: 6,
      name: 'Dr. Inclusive',
      subject: 'Special Education',
      personality: 'Adaptive & Individualized',
      specialization: 'Neurodivergent support, accessibility',
      icon: <Heart className="h-8 w-8" />,
      color: 'red',
      status: 'online',
      studentsHelped: 450,
      description: 'Provides personalized support for diverse learning needs and styles',
    },
  ];

  const recentSessions = [
    {
      student: 'Alex',
      teacher: 'Professor Newton',
      topic: 'Algebra Word Problems',
      duration: '25 min',
      rating: 5,
    },
    {
      student: 'Emma',
      teacher: 'Dr. Curie',
      topic: 'Plant Biology',
      duration: '30 min',
      rating: 5,
    },
    {
      student: 'James',
      teacher: 'Ms. Shakespeare',
      topic: 'Creative Writing',
      duration: '35 min',
      rating: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold">AI Teachers - Your Personal Learning Assistants 🤖</h1>
          <p className="text-blue-100 mt-1">
            Chat with our specialized AI teachers anytime, anywhere
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">6,950+</div>
              <div className="text-sm text-green-600">Students Helped</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">24/7</div>
              <div className="text-sm text-blue-600">Available</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700">4.9/5</div>
              <div className="text-sm text-yellow-600">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* AI Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {aiTeachers.map((teacher) => (
            <Card key={teacher.id} className="border-2 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className={`mx-auto mb-3 p-3 rounded-full bg-${teacher.color}-100`}>
                  <div className={`text-${teacher.color}-600`}>{teacher.icon}</div>
                </div>
                <CardTitle className="text-lg">{teacher.name}</CardTitle>
                <p className="text-sm text-gray-600">{teacher.subject}</p>
                <Badge className={`bg-${teacher.color}-100 text-${teacher.color}-800`}>
                  {teacher.personality}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">{teacher.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span>Specialization:</span>
                    <span className="font-medium">{teacher.specialization}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Students Helped:</span>
                    <span className="font-medium">{teacher.studentsHelped.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Status:</span>
                    <Badge variant="outline" className="text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      {teacher.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/ai-tutor?teacher=${teacher.id}`}>
                    <Button size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat Now
                    </Button>
                  </Link>
                  <Link href={`/virtual-classroom?teacher=${teacher.id}`}>
                    <Button size="sm" variant="outline">
                      <Video className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Sessions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent AI Teacher Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{session.student[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {session.student} with {session.teacher}
                      </p>
                      <p className="text-xs text-gray-600">{session.topic}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{session.duration}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < session.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-medium text-blue-800 mb-4">Ready to Start Learning?</h3>
              <div className="flex justify-center gap-4">
                <Link href="/ai-tutor">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start AI Chat
                  </Button>
                </Link>
                <Link href="/virtual-classroom">
                  <Button variant="outline">
                    <Video className="h-4 w-4 mr-2" />
                    Video Session
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
