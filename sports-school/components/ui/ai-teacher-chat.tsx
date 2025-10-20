'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Send,
  Bot,
  User,
  Brain,
  BookOpen,
  Calculator,
  Beaker,
  Globe,
  Palette,
  Heart,
  Lightbulb,
  MessageSquare,
} from 'lucide-react';

interface AITeacher {
  id: string;
  name: string;
  subject: string;
  personality: string;
  expertise: string[];
  supportedNeeds: string[];
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  teacherId: string;
}

const AI_TEACHERS: AITeacher[] = [
  {
    id: 'newton',
    name: 'Professor Newton',
    subject: 'Mathematics',
    personality: 'Patient, methodical, encouraging',
    expertise: ['Algebra', 'Geometry', 'Calculus', 'Statistics'],
    supportedNeeds: ['Dyscalculia', 'ADHD', 'Visual Learning'],
  },
  {
    id: 'curie',
    name: 'Dr. Curie',
    subject: 'Science',
    personality: 'Curious, experimental, hands-on',
    expertise: ['Physics', 'Chemistry', 'Biology', 'Earth Science'],
    supportedNeeds: ['Autism', 'Kinesthetic Learning', 'ADHD'],
  },
  {
    id: 'shakespeare',
    name: 'Ms. Shakespeare',
    subject: 'English Language Arts',
    personality: 'Creative, expressive, supportive',
    expertise: ['Literature', 'Writing', 'Grammar', 'Poetry'],
    supportedNeeds: ['Dyslexia', 'Autism', 'Anxiety'],
  },
  {
    id: 'timeline',
    name: 'Professor Timeline',
    subject: 'Social Studies',
    personality: 'Storytelling, contextual, engaging',
    expertise: ['History', 'Geography', 'Civics', 'Economics'],
    supportedNeeds: ['Visual Learning', 'ADHD', 'Memory Support'],
  },
  {
    id: 'picasso',
    name: 'Maestro Picasso',
    subject: 'Arts',
    personality: 'Creative, inspiring, multi-sensory',
    expertise: ['Visual Arts', 'Music', 'Drama', 'Digital Arts'],
    supportedNeeds: ['Autism', 'ADHD', 'Sensory Processing'],
  },
  {
    id: 'inclusive',
    name: 'Dr. Inclusive',
    subject: 'Special Education',
    personality: 'Adaptive, patient, individualized',
    expertise: ['IEP Development', 'Accommodations', 'Behavioral Support'],
    supportedNeeds: ['All Learning Differences', 'Emotional Support'],
  },
];

export default function AITeacherChat() {
  const [selectedTeacher, setSelectedTeacher] = useState<AITeacher>(AI_TEACHERS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message when teacher changes
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: getWelcomeMessage(selectedTeacher),
      role: 'assistant',
      timestamp: new Date(),
      teacherId: selectedTeacher.id,
    };
    setMessages([welcomeMessage]);
  }, [selectedTeacher]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getWelcomeMessage = (teacher: AITeacher) => {
    const welcomes = {
      newton:
        "Hello! I'm Professor Newton, your mathematics tutor. I love helping students discover the beauty and logic in numbers. What mathematical concept would you like to explore today?",
      curie:
        "Greetings! I'm Dr. Curie, and I'm passionate about science! Let's explore the wonders of the natural world together. What scientific question has been sparking your curiosity?",
      shakespeare:
        "Welcome, dear student! I'm Ms. Shakespeare, and I believe every story matters. Whether it's reading, writing, or expressing yourself, I'm here to help you find your voice. What would you like to work on today?",
      timeline:
        "Hello there! I'm Professor Timeline, and I love bringing history and social studies to life through stories. The past has so much to teach us about the present. What historical period or topic interests you?",
      picasso:
        "¡Hola! I'm Maestro Picasso, and I believe art is everywhere! Whether you're drawing, painting, making music, or expressing creativity in any form, I'm here to inspire you. What artistic adventure shall we embark on?",
      inclusive:
        "Hello! I'm Dr. Inclusive, and I'm here to support your unique learning journey. Every student learns differently, and that's what makes education beautiful. How can I help you succeed today?",
    };
    return (
      welcomes[teacher.id as keyof typeof welcomes] || 'Hello! How can I help you learn today?'
    );
  };

  const getTeacherIcon = (teacherId: string) => {
    const icons = {
      newton: Calculator,
      curie: Beaker,
      shakespeare: BookOpen,
      timeline: Globe,
      picasso: Palette,
      inclusive: Heart,
    };
    const IconComponent = icons[teacherId as keyof typeof icons] || Brain;
    return <IconComponent className="h-4 w-4" />;
  };

  const getTeacherColor = (teacherId: string) => {
    const colors = {
      newton: 'text-blue-600',
      curie: 'text-green-600',
      shakespeare: 'text-purple-600',
      timeline: 'text-orange-600',
      picasso: 'text-pink-600',
      inclusive: 'text-red-600',
    };
    return colors[teacherId as keyof typeof colors] || 'text-gray-600';
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      role: 'user',
      timestamp: new Date(),
      teacherId: selectedTeacher.id,
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response (in production, this would call the actual API)
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          teacherId: selectedTeacher.id,
          context: {
            subject: selectedTeacher.subject,
            previousMessages: messages.slice(-5), // Last 5 messages for context
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date(),
          teacherId: selectedTeacher.id,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Fallback response
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: generateFallbackResponse(selectedTeacher, newMessage),
          role: 'assistant',
          timestamp: new Date(),
          teacherId: selectedTeacher.id,
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm sorry, I'm having trouble connecting right now. Let me try to help you in a different way!",
        role: 'assistant',
        timestamp: new Date(),
        teacherId: selectedTeacher.id,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (teacher: AITeacher, userMessage: string) => {
    const responses = {
      newton:
        "That's an excellent question about mathematics! Let me break this down step by step for you...",
      curie:
        "What a fascinating scientific inquiry! Let's investigate this together through observation and experimentation...",
      shakespeare:
        "What beautiful thinking! Let's explore this topic and find the perfect words to express your ideas...",
      timeline:
        "That's a wonderful question about our world! Let me tell you a story that helps explain this...",
      picasso:
        "¡Fantástico! I love your creative thinking! Let's express this idea through art and imagination...",
      inclusive:
        "Thank you for sharing that with me. Everyone learns differently, and I'm here to support your unique way of understanding...",
    };
    return (
      responses[teacher.id as keyof typeof responses] ||
      "That's a great question! Let me help you explore this topic."
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Teacher Chat
          </CardTitle>
          <Select
            value={selectedTeacher.id}
            onValueChange={(value) => {
              const teacher = AI_TEACHERS.find((t) => t.id === value);
              if (teacher) setSelectedTeacher(teacher);
            }}
          >
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AI_TEACHERS.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  <div className="flex items-center gap-2">
                    {getTeacherIcon(teacher.id)}
                    <span>{teacher.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {teacher.subject}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className={`flex items-center gap-1 ${getTeacherColor(selectedTeacher.id)}`}>
            {getTeacherIcon(selectedTeacher.id)}
            <span className="font-medium">{selectedTeacher.name}</span>
          </div>
          <span>•</span>
          <span>{selectedTeacher.personality}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {selectedTeacher.expertise.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {selectedTeacher.expertise.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{selectedTeacher.expertise.length - 3} more
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback
                    className={message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      getTeacherIcon(message.teacherId)
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex-1 min-w-0 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-100">
                    {getTeacherIcon(selectedTeacher.id)}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg p-3">
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
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${selectedTeacher.name} a question...`}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || isLoading}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Specialized in: {selectedTeacher.supportedNeeds.join(', ')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
