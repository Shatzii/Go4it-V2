'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

interface LiveEvent {
  id: string;
  title: string;
  description: string;
  roomId: string;
  status: string;
  startTime: Date;
  endTime: Date;
  allowChat: boolean;
  allowQA: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

interface Question {
  id: string;
  userId: string;
  userName: string;
  question: string;
  answer?: string;
  upvotes: number;
  isAnswered: boolean;
  timestamp: Date;
}

export default function LiveRoom({ event }: { event: LiveEvent }) {
  const { user } = useUser();
  const [isLive, setIsLive] = useState(event.status === 'live');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'qa'>('chat');
  const [attendeeCount, setAttendeeCount] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchEventStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${event.id}/status`);
      const data = await response.json();
      setIsLive(data.status === 'live');
      setAttendeeCount(data.attendeeCount || 0);
    } catch {
      // Error fetching status
    }
  }, [event.id]);

  const fetchChatMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${event.id}/chat`);
      const data = await response.json();
      setChatMessages(data.messages || []);
    } catch {
      // Error fetching messages
    }
  }, [event.id]);

  const fetchQuestions = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${event.id}/questions`);
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch {
      // Error fetching questions
    }
  }, [event.id]);

  // Poll for event status and messages
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEventStatus();
      if (event.allowChat) fetchChatMessages();
      if (event.allowQA) fetchQuestions();
    }, 3000);

    return () => clearInterval(interval);
  }, [event.roomId, event.allowChat, event.allowQA, fetchEventStatus, fetchChatMessages, fetchQuestions]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      await fetch(`/api/events/${event.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      });
      setNewMessage('');
      fetchChatMessages();
    } catch {
      // Error sending message
    }
  };

  const askQuestion = async () => {
    if (!newQuestion.trim() || !user) return;

    try {
      await fetch(`/api/events/${event.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newQuestion }),
      });
      setNewQuestion('');
      fetchQuestions();
    } catch {
      // Error asking question
    }
  };

  const upvoteQuestion = async (questionId: string) => {
    try {
      await fetch(`/api/events/${event.id}/questions/${questionId}/upvote`, {
        method: 'POST',
      });
      fetchQuestions();
    } catch {
      // Error upvoting
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isLive && (
              <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-white font-medium text-sm">LIVE</span>
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-white">{event.title}</h1>
              <p className="text-sm text-slate-400">{attendeeCount} watching</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 bg-black flex items-center justify-center relative">
          {!isLive ? (
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Event Hasn&apos;t Started Yet
              </h2>
              <p className="text-slate-400">
                The stream will begin at{' '}
                {new Date(event.startTime).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-slate-500 text-sm mt-4">
                Please stay on this page. The stream will start automatically.
              </p>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full"
              controls
              autoPlay
              playsInline
            >
              <source src={`/api/stream/${event.roomId}`} type="application/x-mpegURL" />
              Your browser does not support video playback.
            </video>
          )}

          {/* Video Controls Overlay */}
          {isLive && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                <span className="text-white font-medium">LIVE</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat/Q&A Sidebar */}
        <div className="w-96 bg-slate-900 border-l border-slate-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-white bg-slate-800 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('qa')}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeTab === 'qa'
                  ? 'text-white bg-slate-800 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Q&A
            </button>
          </div>

          {/* Chat Messages */}
          {activeTab === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">
                    No messages yet. Be the first to say hello!
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {msg.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm">
                            {msg.userName}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm break-words">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              {user && (
                <div className="p-4 border-t border-slate-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Send a message..."
                      className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Q&A Section */}
          {activeTab === 'qa' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {questions.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">
                    No questions yet. Ask the first question!
                  </div>
                ) : (
                  questions.map((q) => (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg border ${
                        q.isAnswered
                          ? 'bg-green-900/20 border-green-700'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <button
                          onClick={() => upvoteQuestion(q.id)}
                          className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          <span className="text-xs font-medium">{q.upvotes}</span>
                        </button>
                        <div className="flex-1">
                          <p className="font-medium text-white mb-1">{q.question}</p>
                          <p className="text-xs text-slate-500">
                            by {q.userName}
                          </p>
                        </div>
                      </div>
                      {q.answer && (
                        <div className="mt-3 pl-8 border-l-2 border-green-500 ml-8">
                          <p className="text-sm text-slate-300">{q.answer}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Q&A Input */}
              {user && (
                <div className="p-4 border-t border-slate-700">
                  <div className="space-y-2">
                    <textarea
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Ask a question..."
                      rows={3}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <button
                      onClick={askQuestion}
                      disabled={!newQuestion.trim()}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                    >
                      Ask Question
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Login Prompt */}
          {!user && (
            <div className="p-4 border-t border-slate-700 bg-slate-800">
              <p className="text-sm text-slate-400 text-center mb-3">
                Sign in to participate in chat and Q&A
              </p>
              <a
                href="/sign-in"
                className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Sign In
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
