'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Send, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff,
  Users,
  MessageCircle,
  Bot,
  User
} from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    role: 'student' | 'teacher' | 'parent' | 'admin' | 'ai'
    avatar?: string
  }
  timestamp: Date
  type: 'text' | 'image' | 'file' | 'system'
}

interface ChatParticipant {
  id: string
  name: string
  role: 'student' | 'teacher' | 'parent' | 'admin' | 'ai'
  status: 'online' | 'offline' | 'away'
  avatar?: string
}

export default function RealTimeChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [participants, setParticipants] = useState<ChatParticipant[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sample data - in production, this would come from WebSocket
  useEffect(() => {
    const sampleMessages: Message[] = [
      {
        id: '1',
        content: 'Welcome to the Universal One School chat! How can I help you today?',
        sender: { id: 'ai-1', name: 'Professor Newton', role: 'ai' },
        timestamp: new Date(Date.now() - 10000),
        type: 'text'
      },
      {
        id: '2',
        content: 'I need help with my algebra homework',
        sender: { id: 'student-1', name: 'Sarah Johnson', role: 'student' },
        timestamp: new Date(Date.now() - 8000),
        type: 'text'
      },
      {
        id: '3',
        content: 'Of course! What specific algebra problem are you working on?',
        sender: { id: 'ai-1', name: 'Professor Newton', role: 'ai' },
        timestamp: new Date(Date.now() - 6000),
        type: 'text'
      }
    ]

    const sampleParticipants: ChatParticipant[] = [
      { id: 'student-1', name: 'Sarah Johnson', role: 'student', status: 'online' },
      { id: 'teacher-1', name: 'Ms. Smith', role: 'teacher', status: 'online' },
      { id: 'parent-1', name: 'John Johnson', role: 'parent', status: 'away' },
      { id: 'ai-1', name: 'Professor Newton', role: 'ai', status: 'online' }
    ]

    setMessages(sampleMessages)
    setParticipants(sampleParticipants)
    setIsConnected(true)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Simulate typing indicator
  useEffect(() => {
    if (newMessage.length > 0) {
      setIsTyping(true)
      const timer = setTimeout(() => setIsTyping(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [newMessage])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: { id: 'current-user', name: 'You', role: 'student' },
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I understand your question. Let me help you work through this step by step.',
        sender: { id: 'ai-1', name: 'Professor Newton', role: 'ai' },
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-700'
      case 'teacher': return 'bg-green-100 text-green-700'
      case 'parent': return 'bg-purple-100 text-purple-700'
      case 'admin': return 'bg-red-100 text-red-700'
      case 'ai': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="flex h-96 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Participants Sidebar */}
      <div className="w-64 bg-gray-50 border-r">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Participants ({participants.length})
          </h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {participants.map(participant => (
              <div key={participant.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {participant.role === 'ai' ? <Bot className="h-4 w-4" /> : participant.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(participant.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{participant.name}</p>
                  <Badge variant="secondary" className={`text-xs ${getRoleColor(participant.role)}`}>
                    {participant.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold">Study Group Chat</h2>
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className={isMuted ? 'bg-red-100 text-red-600' : ''}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={isVideoEnabled ? 'bg-blue-100 text-blue-600' : ''}
              >
                {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map(message => (
              <div key={message.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="text-xs">
                    {message.sender.role === 'ai' ? <Bot className="h-4 w-4" /> : message.sender.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{message.sender.name}</span>
                    <Badge variant="secondary" className={`text-xs ${getRoleColor(message.sender.role)}`}>
                      {message.sender.role}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>Someone is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}