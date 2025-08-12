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
  Trophy,
  Target,
  Activity,
  Play
} from 'lucide-react'
import Link from 'next/link'

export default function SportsVirtualClassroom() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [activeTab, setActiveTab] = useState('classroom')

  const currentSessions = [
    {
      title: 'Basketball Strategy - Advanced Plays',
      coach: 'Coach Thompson',
      time: 'Now - 4:00 PM',
      participants: 18,
      status: 'live',
      sport: 'Basketball'
    },
    {
      title: 'Swimming Technique - Stroke Analysis',
      coach: 'Coach Martinez',
      time: '4:30 PM - 5:30 PM',
      participants: 12,
      status: 'upcoming',
      sport: 'Swimming'
    },
    {
      title: 'Track & Field - Speed Training',
      coach: 'Coach Williams',
      time: '2:30 PM - 3:30 PM',
      participants: 15,
      status: 'completed',
      sport: 'Track'
    }
  ]

  const participants = [
    { name: 'Alex Johnson', sport: 'Basketball', status: 'online', speaking: false, level: 'Varsity' },
    { name: 'Maya Chen', sport: 'Basketball', status: 'online', speaking: true, level: 'JV' },
    { name: 'Carlos Rodriguez', sport: 'Basketball', status: 'online', speaking: false, level: 'Varsity' },
    { name: 'Emma Davis', sport: 'Basketball', status: 'away', speaking: false, level: 'Varsity' },
    { name: 'Coach Thompson', sport: 'Head Coach', status: 'online', speaking: false, level: 'Staff' }
  ]

  const chatMessages = [
    { user: 'Coach Thompson', message: '🏀 Welcome to basketball strategy session! Today we focus on fast breaks.', time: '3:15 PM' },
    { user: 'Alex Johnson', message: '🚀 Ready to learn new plays, Coach!', time: '3:16 PM' },
    { user: 'Maya Chen', message: '💪 Can we practice the pick and roll?', time: '3:17 PM' },
    { user: 'Coach Thompson', message: '⭐ Great question Maya! We\'ll cover that in detail.', time: '3:18 PM' }
  ]

  const trainingResources = [
    { name: 'Basketball Playbook - Advanced Strategies', type: 'PDF', size: '3.2 MB', sport: 'Basketball' },
    { name: 'Video Analysis - Game Footage', type: 'MP4', size: '125 MB', sport: 'Basketball' },
    { name: 'Training Drill Instructions', type: 'PDF', size: '1.8 MB', sport: 'Basketball' },
    { name: 'Fitness Assessment Form', type: 'PDF', size: '956 KB', sport: 'General' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Virtual Training Center 🏆</h1>
              <p className="text-yellow-100 mt-1">Go4it Sports Academy - Elite Athletic Training</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                Live Training
              </Badge>
              <Badge variant="outline" className="text-white border-white">
                18 Athletes
              </Badge>
              <Badge className="bg-orange-100 text-orange-800">
                🏀 Basketball
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="classroom">Live Training</TabsTrigger>
            <TabsTrigger value="schedule">Training Schedule</TabsTrigger>
            <TabsTrigger value="resources">Sports Resources</TabsTrigger>
            <TabsTrigger value="recordings">Game Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="classroom" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Video Area */}
              <div className="lg:col-span-2">
                <Card className="border-2 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Basketball Strategy - Advanced Plays 🏀
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Live</Badge>
                        <span className="text-sm text-gray-600">3:15 PM - 4:00 PM</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Video Display Area */}
                    <div className="aspect-video bg-gradient-to-br from-yellow-900 to-orange-900 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center text-white">
                        <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">Coach Thompson</h3>
                        <p className="text-yellow-200">Basketball Strategy & Team Plays</p>
                        <div className="mt-4 text-4xl">🏀</div>
                      </div>
                    </div>

                    {/* Video Controls */}
                    <div className="flex items-center justify-center gap-4 p-4 bg-gray-100 rounded-lg">
                      <Button
                        variant={isMuted ? "destructive" : "default"}
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        variant={isVideoOff ? "destructive" : "default"}
                        size="sm"
                        onClick={() => setIsVideoOff(!isVideoOff)}
                      >
                        {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <ScreenShare className="h-4 w-4" />
                        Share Screen
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Target className="h-4 w-4" />
                        Ask Question
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="destructive" size="sm">
                        Leave Training
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Participants */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      Training Squad ({participants.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {participants.map((participant, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded bg-yellow-50">
                          <div className={`w-2 h-2 rounded-full ${
                            participant.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                          <div className="flex-1">
                            <span className="text-sm font-medium">{participant.name}</span>
                            <div className="text-xs text-gray-600">{participant.level} • {participant.sport}</div>
                          </div>
                          {participant.speaking && (
                            <Volume2 className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4" />
                      Live Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Session Duration</span>
                        <Badge variant="outline">45 min</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Plays Reviewed</span>
                        <Badge variant="outline">8</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Engagement Score</span>
                        <Badge className="bg-green-100 text-green-800">95%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Chat */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4" />
                      Team Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 h-48 overflow-y-auto">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className="text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-yellow-700">{msg.user}</span>
                            <span className="text-gray-500">{msg.time}</span>
                          </div>
                          <p className="text-gray-700">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Ask about the play..." 
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                      />
                      <Button size="sm">Send</Button>
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
                  Today's Training Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentSessions.map((session, index) => (
                    <div key={index} className={`border-2 rounded-lg p-4 ${
                      session.status === 'live' ? 'border-green-200 bg-green-50' :
                      session.status === 'upcoming' ? 'border-blue-200 bg-blue-50' :
                      'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{session.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-orange-100 text-orange-800">{session.sport}</Badge>
                          <Badge variant={
                            session.status === 'live' ? 'default' :
                            session.status === 'upcoming' ? 'secondary' : 'outline'
                          }>
                            {session.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Coach: {session.coach}</span>
                        <span>{session.participants} athletes</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-medium">{session.time}</span>
                        <Button size="sm" disabled={session.status === 'completed'}>
                          {session.status === 'live' ? 'Join Training' : 
                           session.status === 'upcoming' ? 'Set Reminder' : 'View Recording'}
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
                  Training Resources & Playbooks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trainingResources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium">{resource.name}</p>
                          <p className="text-sm text-gray-600">{resource.type} • {resource.size} • {resource.sport}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Upload your training videos and performance data</p>
                  <Button size="sm" className="mt-2">
                    Upload Performance Files
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
                  Game Analysis & Replays
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Play className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Video Analysis Center</h3>
                  <p className="text-gray-600 mb-4">Access game footage, training replays, and performance analysis videos</p>
                  <Link href="/schools/go4it-sports-academy/assignments">
                    <Button variant="outline">
                      View Training Assignments
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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