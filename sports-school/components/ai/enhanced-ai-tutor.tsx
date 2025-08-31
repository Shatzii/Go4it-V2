'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  BookOpen,
  Brain,
  Target,
  TrendingUp,
  Lightbulb,
  MessageCircle,
  Zap,
  Clock,
  Award,
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  followUp?: string[];
}

interface LearningProgress {
  subject: string;
  progress: number;
  level: string;
  streakDays: number;
  totalHours: number;
  achievements: string[];
}

interface AITutorPersonality {
  id: string;
  name: string;
  subject: string;
  personality: string;
  icon: React.ComponentType<any>;
  color: string;
  specialties: string[];
}

const tutorPersonalities: AITutorPersonality[] = [
  {
    id: 'newton',
    name: 'Professor Newton',
    subject: 'Mathematics',
    personality: 'Encouraging and methodical, breaks down complex problems step by step',
    icon: Brain,
    color: 'blue',
    specialties: ['Algebra', 'Calculus', 'Geometry', 'Statistics'],
  },
  {
    id: 'curie',
    name: 'Dr. Curie',
    subject: 'Science',
    personality: 'Curious and experimental, loves hands-on learning',
    icon: Lightbulb,
    color: 'green',
    specialties: ['Chemistry', 'Physics', 'Biology', 'Earth Science'],
  },
  {
    id: 'shakespeare',
    name: 'Ms. Shakespeare',
    subject: 'English Language Arts',
    personality: 'Creative and inspiring, focuses on expression and comprehension',
    icon: BookOpen,
    color: 'purple',
    specialties: ['Reading', 'Writing', 'Literature', 'Grammar'],
  },
  {
    id: 'timeline',
    name: 'Professor Timeline',
    subject: 'Social Studies',
    personality: 'Storytelling historian who makes the past come alive',
    icon: Clock,
    color: 'orange',
    specialties: ['History', 'Geography', 'Civics', 'Economics'],
  },
];

export function EnhancedAITutor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<AITutorPersonality>(tutorPersonalities[0]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognition = useRef<SpeechRecognition | null>(null);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognition.current = new SpeechRecognition();
      speechRecognition.current.continuous = false;
      speechRecognition.current.interimResults = false;
      speechRecognition.current.lang = 'en-US';

      speechRecognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      speechRecognition.current.onerror = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    }

    // Load initial progress data
    loadLearningProgress();

    // Start session timer
    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 60000); // Update every minute

    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'ai',
      content: `Hello! I'm ${selectedTutor.name}, your ${selectedTutor.subject} tutor. I'm here to help you learn and grow. What would you like to explore today?`,
      timestamp: new Date(),
      subject: selectedTutor.subject,
    };
    setMessages([welcomeMessage]);

    return () => {
      clearInterval(timer);
      if (speechRecognition.current) {
        speechRecognition.current.abort();
      }
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
    };
  }, [selectedTutor]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadLearningProgress = () => {
    // Simulate loading progress data
    const mockProgress: LearningProgress[] = [
      {
        subject: 'Mathematics',
        progress: 75,
        level: 'Intermediate',
        streakDays: 12,
        totalHours: 45,
        achievements: ['Problem Solver', 'Algebra Master', 'Geometry Explorer'],
      },
      {
        subject: 'Science',
        progress: 60,
        level: 'Beginner',
        streakDays: 8,
        totalHours: 32,
        achievements: ['Curious Mind', 'Lab Explorer'],
      },
      {
        subject: 'English Language Arts',
        progress: 85,
        level: 'Advanced',
        streakDays: 20,
        totalHours: 67,
        achievements: ['Word Master', 'Story Teller', 'Grammar Guru'],
      },
      {
        subject: 'Social Studies',
        progress: 45,
        level: 'Beginner',
        streakDays: 5,
        totalHours: 23,
        achievements: ['Time Traveler'],
      },
    ];
    setLearningProgress(mockProgress);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      subject: selectedTutor.subject,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response
      const response = await generateAIResponse(userMessage.content, selectedTutor);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.content,
        timestamp: new Date(),
        subject: selectedTutor.subject,
        difficulty: currentDifficulty,
        followUp: response.followUp,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Text-to-speech for AI response
      if (speechSynthesis.current && !isSpeaking) {
        speakText(response.content);
      }

      // Update learning progress
      updateLearningProgress(selectedTutor.subject);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I'm having trouble right now. Can you please try again?",
        timestamp: new Date(),
        subject: selectedTutor.subject,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (message: string, tutor: AITutorPersonality) => {
    // Simulate API call to AI service
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const responses = {
      newton: {
        content:
          "Great question! Let me break this down step by step. In mathematics, it's important to understand the underlying concepts first. Would you like me to show you a visual representation or work through a similar example?",
        followUp: [
          'Show me a visual example',
          'Work through a similar problem',
          'Explain the concept differently',
        ],
      },
      curie: {
        content:
          "That's a fascinating scientific question! Let's explore this through experimentation. Science is all about curiosity and discovery. Have you observed this phenomenon in everyday life?",
        followUp: [
          'Tell me more about the experiment',
          'Show me real-world examples',
          'Explain the science behind it',
        ],
      },
      shakespeare: {
        content:
          "Excellent! Language is such a powerful tool for expression. Let's dive into the beauty of words and how they can paint pictures in our minds. What aspect would you like to explore further?",
        followUp: ['Help me with writing', 'Analyze this text', 'Improve my vocabulary'],
      },
      timeline: {
        content:
          'What an interesting historical question! History is full of amazing stories and connections. Let me tell you about this fascinating period and how it connects to our world today.',
        followUp: [
          'Tell me more about this period',
          'How does this connect to today?',
          'Show me a timeline',
        ],
      },
    };

    return responses[tutor.id as keyof typeof responses] || responses.newton;
  };

  const updateLearningProgress = (subject: string) => {
    setLearningProgress((prev) =>
      prev.map((progress) =>
        progress.subject === subject
          ? { ...progress, progress: Math.min(100, progress.progress + 2) }
          : progress,
      ),
    );
  };

  const startListening = () => {
    if (speechRecognition.current) {
      setIsListening(true);
      speechRecognition.current.start();
    }
  };

  const stopListening = () => {
    if (speechRecognition.current) {
      speechRecognition.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (speechSynthesis.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      speechSynthesis.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
      setIsSpeaking(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header with Tutor Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Tutoring Session
          </CardTitle>
          <CardDescription>Personalized learning with your AI tutor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {tutorPersonalities.map((tutor) => (
              <Button
                key={tutor.id}
                variant={selectedTutor.id === tutor.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTutor(tutor)}
                className="flex items-center gap-2"
              >
                <tutor.icon className="w-4 h-4" />
                {tutor.name}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Session Time</p>
              <p className="text-lg font-bold text-blue-700">{formatTime(sessionTime)}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Difficulty</p>
              <Badge
                variant={
                  currentDifficulty === 'easy'
                    ? 'secondary'
                    : currentDifficulty === 'medium'
                      ? 'default'
                      : 'destructive'
                }
              >
                {currentDifficulty}
              </Badge>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <MessageCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Messages</p>
              <p className="text-lg font-bold text-purple-700">{messages.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <selectedTutor.icon className="w-5 h-5" />
              {selectedTutor.name} - {selectedTutor.subject}
            </CardTitle>
            <CardDescription>{selectedTutor.personality}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <ScrollArea className="h-96 w-full border rounded-lg p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {message.type === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <selectedTutor.icon className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          {message.type === 'user' ? 'You' : selectedTutor.name}
                        </span>
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>

                      {message.followUp && (
                        <div className="mt-2 space-y-1">
                          {message.followUp.map((followUp, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => setInputMessage(followUp)}
                            >
                              {followUp}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <selectedTutor.icon className="w-4 h-4 animate-pulse" />
                        <span className="text-sm">Thinking...</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.1s' }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <div className="flex items-center gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask your tutor anything..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={isListening ? stopListening : startListening}
                disabled={!speechRecognition.current}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={isSpeaking ? stopSpeaking : () => {}}
                disabled={!speechSynthesis.current}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>

              <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {learningProgress.map((progress, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{progress.subject}</span>
                  <Badge variant="outline">{progress.level}</Badge>
                </div>
                <Progress value={progress.progress} className="h-2" />
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Progress: {progress.progress}%</span>
                    <span>Streak: {progress.streakDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total: {progress.totalHours}h</span>
                    <span>Achievements: {progress.achievements.length}</span>
                  </div>
                </div>

                {progress.achievements.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {progress.achievements.slice(0, 3).map((achievement, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        {achievement}
                      </Badge>
                    ))}
                    {progress.achievements.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{progress.achievements.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
