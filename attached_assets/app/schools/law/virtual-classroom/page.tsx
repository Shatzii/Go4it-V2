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
  Scale,
  Gavel,
  Book
} from 'lucide-react'
import Link from 'next/link'

export default function LawVirtualClassroom() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [activeTab, setActiveTab] = useState('classroom')

  const currentClasses = [
    {
      title: 'Constitutional Law - Supreme Court Cases',
      professor: 'Professor Justice',
      time: 'Now - 4:30 PM',
      participants: 24,
      status: 'live'
    },
    {
      title: 'Contract Law - Case Study Analysis',
      professor: 'Professor Legal',
      time: '5:00 PM - 6:30 PM',
      participants: 18,
      status: 'upcoming'
    },
    {
      title: 'Criminal Law - Evidence & Procedure',
      professor: 'Professor Evidence',
      time: '2:00 PM - 3:30 PM',
      participants: 22,
      status: 'completed'
    }
  ]

  const participants = [
    { name: 'Alexandra Thompson', year: '3L', status: 'online', speaking: false },
    { name: 'Michael Rodriguez', year: '2L', status: 'online', speaking: true },
    { name: 'Sarah Chen', year: '3L', status: 'online', speaking: false },
    { name: 'David Johnson', year: '1L', status: 'away', speaking: false },
    { name: 'Professor Justice', year: 'Faculty', status: 'online', speaking: false }
  ]

  const chatMessages = [
    { user: 'Professor Justice', message: 'Welcome to Constitutional Law. Today we\'re analyzing landmark cases.', time: '3:15 PM' },
    { user: 'Alexandra Thompson', message: 'Looking forward to discussing Marbury v. Madison', time: '3:16 PM' },
    { user: 'Michael Rodriguez', message: 'I have questions about judicial review principles', time: '3:17 PM' },
    { user: 'Professor Justice', message: 'Excellent question, Michael. Let\'s explore that together.', time: '3:18 PM' }
  ]

  const classResources = [
    { name: 'Supreme Court Cases Compilation', type: 'PDF', size: '5.2 MB' },
    { name: 'Constitutional Analysis Framework', type: 'DOC', size: '1.8 MB' },
    { name: 'Case Brief Template', type: 'PDF', size: '856 KB' },
    { name: 'Legal Research Guidelines', type: 'PDF', size: '2.1 MB' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-gray-800 text-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Virtual Law Classroom ⚖️</h1>
              <p className="text-blue-100 mt-1">Future Legal Professionals - Interactive Legal Education</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                Live Session
              </Badge>
              <Badge variant="outline" className="text-white border-white">
                24 Students
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="classroom">Live Classroom</TabsTrigger>
            <TabsTrigger value="schedule">Class Schedule</TabsTrigger>
            <TabsTrigger value="resources">Legal Resources</TabsTrigger>
            <TabsTrigger value="recordings">Case Studies</TabsTrigger>
          </TabsList>

          <TabsContent value="classroom" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Video Area */}
              <div className="lg:col-span-2">
                <Card className="border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Scale className="h-5 w-5" />
                        Constitutional Law - Supreme Court Cases
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Live</Badge>
                        <span className="text-sm text-gray-600">3:15 PM - 4:30 PM</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Video Display Area */}
                    <div className="aspect-video bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center text-white">
                        <Gavel className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">Professor Justice</h3>
                        <p className="text-blue-200">Constitutional Law & Supreme Court Analysis</p>
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
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        Raise Hand
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="destructive" size="sm">
                        Leave Session
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
                      Students ({participants.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {participants.map((participant, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded">
                          <div className={`w-2 h-2 rounded-full ${
                            participant.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                          <div className="flex-1">
                            <span className="text-sm font-medium">{participant.name}</span>
                            <div className="text-xs text-gray-600">{participant.year}</div>
                          </div>
                          {participant.speaking && (
                            <Volume2 className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Chat */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4" />
                      Class Discussion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 h-48 overflow-y-auto">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className="text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-blue-700">{msg.user}</span>
                            <span className="text-gray-500">{msg.time}</span>
                          </div>
                          <p className="text-gray-700">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Type your legal analysis..." 
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
                  Today's Law Classes
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
                        <h3 className="font-medium">{classItem.title}</h3>
                        <Badge variant={
                          classItem.status === 'live' ? 'default' :
                          classItem.status === 'upcoming' ? 'secondary' : 'outline'
                        }>
                          {classItem.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Professor: {classItem.professor}</span>
                        <span>{classItem.participants} students</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-medium">{classItem.time}</span>
                        <Button size="sm" disabled={classItem.status === 'completed'}>
                          {classItem.status === 'live' ? 'Join Session' : 
                           classItem.status === 'upcoming' ? 'Set Reminder' : 'View Recording'}
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
                  Legal Resources & Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {classResources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Book className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{resource.name}</p>
                          <p className="text-sm text-gray-600">{resource.type} • {resource.size}</p>
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
                  <p className="text-sm text-gray-600">Submit your legal briefs and assignments</p>
                  <Button size="sm" className="mt-2">
                    Upload Documents
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
                  Recorded Case Studies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Scale className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Case Study Library</h3>
                  <p className="text-gray-600 mb-4">Access recorded constitutional law cases and analysis sessions</p>
                  <Link href="/schools/law/assignments">
                    <Button variant="outline">
                      View Case Assignments
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
                <Link href="/schools/law/student-dashboard">
                  <Button variant="outline">
                    Return to Law Dashboard
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