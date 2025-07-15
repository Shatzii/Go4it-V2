'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Users, 
  MessageSquare, 
  Settings, 
  Monitor, 
  Camera,
  Volume2,
  ScreenShare,
  FileText,
  Download,
  Upload,
  Clock,
  Star,
  Trophy,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function PrimaryVirtualClassroom() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [activeTab, setActiveTab] = useState('classroom')

  const currentClasses = [
    {
      title: 'Math Adventure - Multiplication Heroes',
      teacher: 'Professor Newton',
      time: 'Now - 3:00 PM',
      participants: 12,
      status: 'live',
      theme: 'superhero'
    },
    {
      title: 'Science Quest - Plant Experiments',
      teacher: 'Dr. Curie',
      time: '3:30 PM - 4:15 PM',
      participants: 15,
      status: 'upcoming',
      theme: 'science'
    },
    {
      title: 'Reading Heroes - Story Time',
      teacher: 'Ms. Shakespeare',
      time: '1:30 PM - 2:15 PM',
      participants: 18,
      status: 'completed',
      theme: 'reading'
    }
  ]

  const participants = [
    { name: 'Tommy Super Student', grade: '3rd', status: 'online', speaking: false, avatar: '🦸‍♂️' },
    { name: 'Emma Wonder Kid', grade: '3rd', status: 'online', speaking: true, avatar: '🦸‍♀️' },
    { name: 'Alex Lightning', grade: '3rd', status: 'online', speaking: false, avatar: '⚡' },
    { name: 'Sofia Star Bright', grade: '3rd', status: 'away', speaking: false, avatar: '⭐' },
    { name: 'Professor Newton', grade: 'Teacher', status: 'online', speaking: false, avatar: '👨‍🏫' }
  ]

  const chatMessages = [
    { user: 'Professor Newton', message: '🦸‍♂️ Welcome to our Math Adventure!', time: '2:15 PM', avatar: '👨‍🏫' },
    { user: 'Tommy Super Student', message: '🚀 Ready to solve multiplication problems!', time: '2:16 PM', avatar: '🦸‍♂️' },
    { user: 'Emma Wonder Kid', message: '⭐ This is so cool!', time: '2:17 PM', avatar: '🦸‍♀️' },
    { user: 'Professor Newton', message: '🎯 Let\'s start with our superhero math powers!', time: '2:18 PM', avatar: '👨‍🏫' }
  ]

  const classResources = [
    { name: 'Superhero Math Worksheet', type: 'PDF', size: '1.2 MB', icon: '🦸‍♂️' },
    { name: 'Multiplication Games', type: 'Interactive', size: '2.1 MB', icon: '🎮' },
    { name: 'Hero Point Tracker', type: 'PDF', size: '856 KB', icon: '⭐' },
    { name: 'Math Power-Up Cards', type: 'PDF', size: '1.8 MB', icon: '⚡' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">SuperHero Virtual Classroom! 🦸‍♂️🦸‍♀️</h1>
              <p className="text-blue-100 mt-1">Primary School - Where Learning is an Adventure!</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                🔴 Live Class
              </Badge>
              <Badge variant="outline" className="text-white border-white">
                👥 12 Heroes Online
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="classroom">🎓 Live Classroom</TabsTrigger>
            <TabsTrigger value="schedule">📅 My Schedule</TabsTrigger>
            <TabsTrigger value="resources">📚 Fun Resources</TabsTrigger>
            <TabsTrigger value="recordings">📹 Watch Again</TabsTrigger>
          </TabsList>

          <TabsContent value="classroom" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Video Area */}
              <div className="lg:col-span-2">
                <Card className="border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        Math Adventure - Multiplication Heroes 🦸‍♂️
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">🔴 Live</Badge>
                        <span className="text-sm text-gray-600">2:15 PM - 3:00 PM</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Video Display Area */}
                    <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-stars opacity-20"></div>
                      <div className="text-center text-white relative z-10">
                        <div className="text-6xl mb-4">👨‍🏫</div>
                        <h3 className="text-xl font-semibold mb-2">Professor Newton</h3>
                        <p className="text-blue-200">Teaching Multiplication Superpowers!</p>
                        <div className="mt-4 flex justify-center gap-2">
                          <span className="text-2xl">⚡</span>
                          <span className="text-2xl">🦸‍♂️</span>
                          <span className="text-2xl">🎯</span>
                        </div>
                      </div>
                    </div>

                    {/* Video Controls */}
                    <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                      <Button
                        variant={isMuted ? "destructive" : "default"}
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-lg"
                      >
                        {isMuted ? '🔇' : '🎤'}
                      </Button>
                      
                      <Button
                        variant={isVideoOff ? "destructive" : "default"}
                        size="sm"
                        onClick={() => setIsVideoOff(!isVideoOff)}
                        className="text-lg"
                      >
                        {isVideoOff ? '📷❌' : '📹'}
                      </Button>
                      
                      <Button variant="outline" size="sm" className="text-lg">
                        🔧 Settings
                      </Button>
                      
                      <Button variant="outline" size="sm" className="text-lg">
                        ✋ Raise Hand
                      </Button>
                      
                      <Button variant="destructive" size="sm" className="text-lg">
                        👋 Leave Class
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Participants */}
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm text-blue-800">
                      <Users className="h-4 w-4" />
                      SuperHero Students ({participants.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {participants.map((participant, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded bg-blue-50">
                          <span className="text-lg">{participant.avatar}</span>
                          <div className="flex-1">
                            <span className="text-sm font-medium">{participant.name}</span>
                            <div className="text-xs text-gray-600">{participant.grade}</div>
                          </div>
                          {participant.speaking && (
                            <span className="text-sm">🗣️</span>
                          )}
                          <div className={`w-2 h-2 rounded-full ${
                            participant.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Chat */}
                <Card className="border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm text-purple-800">
                      <MessageSquare className="h-4 w-4" />
                      Class Chat 💬
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 h-48 overflow-y-auto">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className="text-xs bg-white p-2 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">{msg.avatar}</span>
                            <span className="font-medium text-purple-700">{msg.user}</span>
                            <span className="text-gray-500">{msg.time}</span>
                          </div>
                          <p className="text-gray-700">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Type a fun message! 😊" 
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                      />
                      <Button size="sm" className="text-sm">📤 Send</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Learning Adventures 📅
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentClasses.map((classItem, index) => (
                    <div key={index} className={`border-2 rounded-lg p-4 ${
                      classItem.status === 'live' ? 'border-green-200 bg-green-50' :
                      classItem.status === 'upcoming' ? 'border-blue-200 bg-blue-50' :
                      'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-lg">{classItem.title}</h3>
                        <Badge variant={
                          classItem.status === 'live' ? 'default' :
                          classItem.status === 'upcoming' ? 'secondary' : 'outline'
                        } className="text-sm">
                          {classItem.status === 'live' ? '🔴 Live Now!' :
                           classItem.status === 'upcoming' ? '⏰ Coming Up' : '✅ Finished'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span>👨‍🏫 Teacher: {classItem.teacher}</span>
                        <span>👥 {classItem.participants} heroes joining</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">⏰ {classItem.time}</span>
                        <Button size="sm" disabled={classItem.status === 'completed'}>
                          {classItem.status === 'live' ? '🚀 Join Adventure!' : 
                           classItem.status === 'upcoming' ? '⏰ Set Reminder' : '📹 Watch Recording'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Fun Learning Resources 📚
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {classResources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{resource.icon}</span>
                        <div>
                          <p className="font-medium">{resource.name}</p>
                          <p className="text-sm text-gray-600">{resource.type} • {resource.size}</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                        📥 Get It!
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 border-2 border-dashed border-purple-300 rounded-lg text-center bg-purple-50">
                  <span className="text-4xl block mb-2">📤</span>
                  <p className="text-sm text-purple-700 font-medium">Share Your Amazing Work!</p>
                  <p className="text-xs text-purple-600 mb-3">Upload your assignments and projects</p>
                  <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                    🎒 Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recordings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Watch Previous Adventures 📹
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <span className="text-6xl block mb-4">📺</span>
                  <h3 className="text-lg font-medium mb-2">No Recordings Yet!</h3>
                  <p className="text-gray-600 mb-4">Your amazing class adventures will appear here so you can watch them again! 🎬</p>
                  <Link href="/schools/primary/assignments">
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      📝 Check My Assignments Instead
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-6 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-medium text-blue-800 mb-4">Need Help with Your Virtual Classroom? 🤔</h3>
              <div className="flex justify-center gap-4">
                <Link href="/ai-teachers">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    🤖 Ask AI Teacher
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