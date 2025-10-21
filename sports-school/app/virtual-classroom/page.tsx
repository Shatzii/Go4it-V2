'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  Users,
  MessageSquare,
  Settings,
  Phone,
  Calendar,
  BookOpen,
  Calculator,
  Microscope,
  Palette,
  Globe,
  Heart,
} from 'lucide-react';
import Link from 'next/link';

export default function VirtualClassroom() {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);

  const aiTeachers = [
    {
      id: 1,
      name: 'Professor Newton',
      subject: 'Mathematics',
      icon: <Calculator className="h-5 w-5" />,
      color: 'blue',
    },
    {
      id: 2,
      name: 'Dr. Curie',
      subject: 'Science',
      icon: <Microscope className="h-5 w-5" />,
      color: 'green',
    },
    {
      id: 3,
      name: 'Ms. Shakespeare',
      subject: 'English',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'purple',
    },
    {
      id: 4,
      name: 'Professor Timeline',
      subject: 'Social Studies',
      icon: <Globe className="h-5 w-5" />,
      color: 'orange',
    },
    {
      id: 5,
      name: 'Maestro Picasso',
      subject: 'Arts',
      icon: <Palette className="h-5 w-5" />,
      color: 'pink',
    },
    {
      id: 6,
      name: 'Dr. Inclusive',
      subject: 'Special Education',
      icon: <Heart className="h-5 w-5" />,
      color: 'red',
    },
  ];

  const currentSession = {
    title: 'Advanced Mathematics Tutorial',
    teacher: 'Professor Newton',
    participants: 12,
    duration: '45 minutes',
    topic: 'Quadratic Equations',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold">Virtual Classroom</h1>
          <p className="text-blue-100 mt-2">Interactive video sessions with AI teachers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    {currentSession.title}
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Live
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  with {currentSession.teacher} • {currentSession.participants} participants
                </p>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-900 rounded-lg mb-4 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Video Session Active</p>
                      <p className="text-sm opacity-75">Teaching: {currentSession.topic}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">PN</span>
                        </div>
                        <div className="text-white">
                          <p className="font-medium">{currentSession.teacher}</p>
                          <p className="text-sm opacity-75">{currentSession.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-black/50 text-white">
                          <Users className="h-3 w-3 mr-1" />
                          {currentSession.participants}
                        </Badge>
                        <Badge className="bg-black/50 text-white">{currentSession.duration}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant={isMicOn ? 'default' : 'destructive'}
                    size="sm"
                    onClick={() => setIsMicOn(!isMicOn)}
                  >
                    {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={isVideoOn ? 'default' : 'destructive'}
                    size="sm"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={isScreenSharing ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Session Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Session Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Topic:</span>
                    <span className="font-medium">{currentSession.topic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{currentSession.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-medium">{currentSession.participants} students</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recording:</span>
                    <Badge variant="outline">Available after session</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Teacher Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Available AI Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiTeachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedTeacher === teacher.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTeacher(teacher.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-${teacher.color}-100`}>
                          <div className={`text-${teacher.color}-600`}>{teacher.icon}</div>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{teacher.name}</p>
                          <p className="text-xs text-gray-600">{teacher.subject}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/ai-tutor">
                    <Button className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Switch to Text Chat
                    </Button>
                  </Link>
                  <Link href="/ai-teachers">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Browse All Teachers
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">Chemistry Lab</p>
                    <p className="text-xs text-gray-600">with Dr. Curie</p>
                    <p className="text-xs text-blue-600">Tomorrow 2:00 PM</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">Literature Analysis</p>
                    <p className="text-xs text-gray-600">with Ms. Shakespeare</p>
                    <p className="text-xs text-blue-600">Friday 3:30 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
