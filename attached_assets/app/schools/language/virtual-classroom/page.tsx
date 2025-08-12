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
  Globe,
  Languages,
  Headphones
} from 'lucide-react'
import Link from 'next/link'

export default function LanguageVirtualClassroom() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [activeTab, setActiveTab] = useState('classroom')
  const [currentLanguage, setCurrentLanguage] = useState('Spanish')

  const currentClasses = [
    {
      title: 'Conversational Spanish - Intermediate',
      instructor: 'Profesora María',
      time: 'Now - 3:30 PM',
      participants: 16,
      status: 'live',
      language: 'Spanish'
    },
    {
      title: 'French Cultural Immersion',
      instructor: 'Madame Claire',
      time: '4:00 PM - 5:00 PM',
      participants: 12,
      status: 'upcoming',
      language: 'French'
    },
    {
      title: 'Mandarin Writing Practice',
      instructor: '李老师 (Teacher Li)',
      time: '2:00 PM - 3:00 PM',
      participants: 14,
      status: 'completed',
      language: 'Mandarin'
    }
  ]

  const participants = [
    { name: 'Ana Rodriguez', level: 'Intermediate', status: 'online', speaking: false, flag: '🇪🇸' },
    { name: 'Pierre Dubois', level: 'Advanced', status: 'online', speaking: true, flag: '🇫🇷' },
    { name: 'Yuki Tanaka', level: 'Beginner', status: 'online', speaking: false, flag: '🇯🇵' },
    { name: 'Marco Silva', level: 'Intermediate', status: 'away', speaking: false, flag: '🇧🇷' },
    { name: 'Profesora María', level: 'Native', status: 'online', speaking: false, flag: '🇪🇸' }
  ]

  const chatMessages = [
    { user: 'Profesora María', message: '¡Hola clase! Today we practice conversational Spanish.', time: '2:15 PM', flag: '🇪🇸' },
    { user: 'Ana Rodriguez', message: 'Estoy muy emocionada para practicar hoy', time: '2:16 PM', flag: '🇪🇸' },
    { user: 'Pierre Dubois', message: 'Can we practice ordering food in restaurants?', time: '2:17 PM', flag: '🇫🇷' },
    { user: 'Profesora María', message: '¡Excelente idea! Vamos a crear un diálogo.', time: '2:18 PM', flag: '🇪🇸' }
  ]

  const classResources = [
    { name: 'Spanish Conversation Guide', type: 'PDF', size: '2.1 MB', language: 'Spanish' },
    { name: 'Audio Pronunciation Practice', type: 'MP3', size: '15.3 MB', language: 'Spanish' },
    { name: 'Cultural Context Worksheet', type: 'DOC', size: '1.2 MB', language: 'Spanish' },
    { name: 'Vocabulary Flash Cards', type: 'Interactive', size: '3.4 MB', language: 'Spanish' }
  ]

  const languages = ['Spanish', 'French', 'Mandarin', 'Japanese', 'German', 'Italian', 'Portuguese', 'Arabic']

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Global Language Immersion 🌍</h1>
              <p className="text-green-100 mt-1">Multilingual Virtual Classroom - {currentLanguage} Session</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                Live Class
              </Badge>
              <Badge variant="outline" className="text-white border-white">
                16 Students
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                🇪🇸 {currentLanguage}
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="classroom">Live Classroom</TabsTrigger>
            <TabsTrigger value="schedule">Class Schedule</TabsTrigger>
            <TabsTrigger value="resources">Language Resources</TabsTrigger>
            <TabsTrigger value="recordings">Practice Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="classroom" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Video Area */}
              <div className="lg:col-span-2">
                <Card className="border-2 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Languages className="h-5 w-5" />
                        Conversational Spanish - Intermediate 🇪🇸
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Live</Badge>
                        <span className="text-sm text-gray-600">2:15 PM - 3:30 PM</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Video Display Area */}
                    <div className="aspect-video bg-gradient-to-br from-green-900 to-teal-900 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center text-white">
                        <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">Profesora María</h3>
                        <p className="text-green-200">Spanish Language & Culture</p>
                        <div className="mt-4 text-4xl">🇪🇸</div>
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
                        <Headphones className="h-4 w-4" />
                        Audio
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <ScreenShare className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        🗣️ Speak
                      </Button>
                      
                      <Button variant="destructive" size="sm">
                        Exit Class
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Language Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4" />
                      Active Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {languages.slice(0, 6).map((lang, index) => (
                        <Button
                          key={lang}
                          variant={lang === currentLanguage ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                          onClick={() => setCurrentLanguage(lang)}
                        >
                          {lang}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Participants */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      Language Partners ({participants.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {participants.map((participant, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded">
                          <span className="text-lg">{participant.flag}</span>
                          <div className="flex-1">
                            <span className="text-sm font-medium">{participant.name}</span>
                            <div className="text-xs text-gray-600">{participant.level}</div>
                          </div>
                          {participant.speaking && (
                            <Volume2 className="h-3 w-3 text-green-500" />
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <MessageSquare className="h-4 w-4" />
                      Multilingual Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 h-48 overflow-y-auto">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className="text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{msg.flag}</span>
                            <span className="font-medium text-green-700">{msg.user}</span>
                            <span className="text-gray-500">{msg.time}</span>
                          </div>
                          <p className="text-gray-700">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <input 
                        type="text" 
                        placeholder="¡Escribe en español!" 
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                      />
                      <Button size="sm">Enviar</Button>
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
                  Today's Language Classes
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
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800">{classItem.language}</Badge>
                          <Badge variant={
                            classItem.status === 'live' ? 'default' :
                            classItem.status === 'upcoming' ? 'secondary' : 'outline'
                          }>
                            {classItem.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Instructor: {classItem.instructor}</span>
                        <span>{classItem.participants} students</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-medium">{classItem.time}</span>
                        <Button size="sm" disabled={classItem.status === 'completed'}>
                          {classItem.status === 'live' ? 'Join Class' : 
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
                  Language Learning Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {classResources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Languages className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">{resource.name}</p>
                          <p className="text-sm text-gray-600">{resource.type} • {resource.size} • {resource.language}</p>
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
                  <p className="text-sm text-gray-600">Submit your language practice assignments</p>
                  <Button size="sm" className="mt-2">
                    Upload Practice Work
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
                  Practice Session Recordings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Headphones className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Pronunciation Practice Library</h3>
                  <p className="text-gray-600 mb-4">Access recorded pronunciation guides and conversation practice sessions</p>
                  <Link href="/schools/language/assignments">
                    <Button variant="outline">
                      View Language Assignments
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
                <Link href="/schools/language/student-dashboard">
                  <Button variant="outline">
                    Back to Language Dashboard
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