'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  MessageCircle, 
  Send, 
  Phone, 
  Video, 
  Calendar, 
  Clock,
  User,
  Bell,
  Search,
  Filter,
  MoreVertical,
  Paperclip,
  Smile
} from 'lucide-react'

interface Message {
  id: string
  sender: 'parent' | 'teacher' | 'admin'
  senderName: string
  content: string
  timestamp: string
  read: boolean
  type: 'message' | 'announcement' | 'alert'
  attachments?: string[]
}

interface Teacher {
  id: string
  name: string
  subject: string
  avatar: string
  online: boolean
  lastSeen: string
}

export default function ParentCommunication() {
  const [selectedConversation, setSelectedConversation] = useState<string>('teacher-1')
  const [newMessage, setNewMessage] = useState('')
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'urgent'>('all')

  const teachers: Teacher[] = [
    {
      id: 'teacher-1',
      name: 'Ms. Sarah Johnson',
      subject: 'Mathematics',
      avatar: '👩‍🏫',
      online: true,
      lastSeen: 'Online now'
    },
    {
      id: 'teacher-2',
      name: 'Mr. David Chen',
      subject: 'Science',
      avatar: '👨‍🏫',
      online: false,
      lastSeen: '2 hours ago'
    },
    {
      id: 'teacher-3',
      name: 'Ms. Emily Rodriguez',
      subject: 'English Language Arts',
      avatar: '👩‍🏫',
      online: true,
      lastSeen: 'Online now'
    }
  ]

  const messages: Message[] = [
    {
      id: '1',
      sender: 'teacher',
      senderName: 'Ms. Sarah Johnson',
      content: 'Emma did excellent work on her math assignment today! She showed great understanding of addition concepts.',
      timestamp: '2024-07-14T14:30:00Z',
      read: true,
      type: 'message'
    },
    {
      id: '2',
      sender: 'parent',
      senderName: 'You',
      content: 'Thank you for the update! We\'ve been practicing at home and I\'m glad to see it\'s helping.',
      timestamp: '2024-07-14T14:45:00Z',
      read: true,
      type: 'message'
    },
    {
      id: '3',
      sender: 'teacher',
      senderName: 'Ms. Sarah Johnson',
      content: 'I wanted to let you know that Emma will need to bring her calculator for tomorrow\'s lesson on counting by tens.',
      timestamp: '2024-07-14T15:15:00Z',
      read: false,
      type: 'message'
    },
    {
      id: '4',
      sender: 'admin',
      senderName: 'School Administration',
      content: 'Reminder: Parent-Teacher conferences are scheduled for next Friday. Please confirm your appointment time.',
      timestamp: '2024-07-14T16:00:00Z',
      read: false,
      type: 'announcement'
    }
  ]

  const conversations = [
    {
      id: 'teacher-1',
      name: 'Ms. Sarah Johnson',
      lastMessage: 'I wanted to let you know that Emma will need...',
      timestamp: '15:15',
      unreadCount: 1,
      type: 'teacher'
    },
    {
      id: 'teacher-2',
      name: 'Mr. David Chen',
      lastMessage: 'Great job on the science project!',
      timestamp: '12:30',
      unreadCount: 0,
      type: 'teacher'
    },
    {
      id: 'admin',
      name: 'School Administration',
      lastMessage: 'Reminder: Parent-Teacher conferences...',
      timestamp: '16:00',
      unreadCount: 1,
      type: 'admin'
    }
  ]

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage('')
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    })
  }

  const selectedTeacher = teachers.find(t => t.id === selectedConversation)
  const conversationMessages = messages.filter(m => 
    selectedConversation === 'teacher-1' ? m.senderName === 'Ms. Sarah Johnson' || m.senderName === 'You' :
    selectedConversation === 'admin' ? m.senderName === 'School Administration' || m.senderName === 'You' :
    false
  )

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 shadow-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/parent-dashboard" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-semibold text-white">Communication Center</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-white">Messages</h2>
                  <button className="text-gray-500 hover:text-gray-700">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="relative mb-4">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  {(['all', 'unread', 'urgent'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setMessageFilter(filter)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        messageFilter === filter
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-slate-900 ${
                      selectedConversation === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {conversation.type === 'admin' ? '🏫' : '👩‍🏫'}
                        </div>
                        {conversation.type === 'teacher' && selectedTeacher?.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-white truncate">{conversation.name}</h3>
                          <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">{conversation.lastMessage}</p>
                        {conversation.unreadCount > 0 && (
                          <div className="mt-2 flex justify-end">
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                              {conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {selectedConversation === 'admin' ? '🏫' : selectedTeacher?.avatar}
                    </div>
                    {selectedTeacher?.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {selectedConversation === 'admin' ? 'School Administration' : selectedTeacher?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedConversation === 'admin' ? 'Official School Communications' : 
                       `${selectedTeacher?.subject} • ${selectedTeacher?.lastSeen}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-white hover:bg-gray-100 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-white hover:bg-gray-100 rounded-lg">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-white hover:bg-gray-100 rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'parent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'parent'
                          ? 'bg-blue-500 text-white'
                          : message.type === 'announcement'
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : 'bg-gray-100 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'parent' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-end gap-3">
                  <button className="p-2 text-gray-600 hover:text-white hover:bg-gray-100 rounded-lg">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none text-sm"
                      rows={2}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                  </div>
                  <button className="p-2 text-gray-600 hover:text-white hover:bg-gray-100 rounded-lg">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}