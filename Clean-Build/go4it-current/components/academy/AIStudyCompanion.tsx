'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Bot,
  Brain,
  BookOpen,
  Target,
  TrendingUp,
  MessageCircle,
  Send,
  Lightbulb,
  Clock,
  Award,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface StudySession {
  id: string;
  subject: string;
  topic: string;
  duration: number;
  score: number;
  date: string;
  learningGoals: string[];
  masteryLevel: number;
  questionsAnswered: number;
  correctAnswers: number;
  weakPoints: string[];
  recommendations: string[];
}

interface StudyRecommendation {
  id: string;
  type: 'review' | 'practice' | 'concept' | 'preparation' | 'challenge' | 'quiz';
  title: string;
  description: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
  adaptiveReason: string;
  prerequisites: string[];
  learningObjectives: string[];
  masteryRequired: number;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  subject?: string;
  attachments?: {
    type: 'problem' | 'explanation' | 'quiz' | 'resource';
    data: any;
  }[];
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  subjects: string[];
  totalSteps: number;
  completedSteps: number;
  estimatedCompletionTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  adaptiveLevel: number;
}

interface StudentProfile {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  strengths: string[];
  challenges: string[];
  preferences: {
    sessionLength: number;
    timeOfDay: 'morning' | 'afternoon' | 'evening';
    breakFrequency: number;
  };
  academicGoals: string[];
}

export default function AIStudyCompanion() {
  const [activeTab, setActiveTab] = useState<
    'chat' | 'recommendations' | 'analytics' | 'learning-paths' | 'profile'
  >('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [adaptiveLearning, setAdaptiveLearning] = useState({
    currentLevel: 5,
    learningVelocity: 1.2,
    retentionRate: 0.85,
    preferredDifficulty: 'medium' as 'easy' | 'medium' | 'hard',
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message and load data
  useEffect(() => {
    const initializeCompanion = async () => {
      setLoading(true);

      // Initialize chat with welcome message
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'ai',
        content:
          "Hi! I'm your AI Study Companion. I can help you with homework, explain concepts, create study plans, and provide personalized learning recommendations. What would you like to work on today?",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);

      // Load all data components
      await Promise.all([
        loadRecommendations(),
        loadStudySessions(),
        loadLearningPaths(),
        loadStudentProfile(),
      ]);

      setLoading(false);
    };

    initializeCompanion();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadRecommendations = async () => {
    try {
      const response = await fetch('/api/academy/ai-recommendations');
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      // Use sample data as fallback
      setRecommendations([
        {
          id: '1',
          type: 'review',
          title: 'Review Quadratic Equations',
          description:
            "You struggled with this topic in your last quiz. Let's reinforce the concepts.",
          subject: 'Algebra I',
          difficulty: 'medium',
          estimatedTime: 25,
          priority: 'high',
          adaptiveReason: 'Based on your recent quiz performance',
          prerequisites: ['Basic algebra understanding'],
          learningObjectives: ['Master factoring', 'Apply quadratic formula'],
          masteryRequired: 80,
        },
        {
          id: '2',
          type: 'practice',
          title: 'Cell Division Practice Problems',
          description: 'Get extra practice with mitosis and meiosis before your upcoming test.',
          subject: 'Biology I',
          difficulty: 'medium',
          estimatedTime: 30,
          priority: 'high',
          adaptiveReason: 'Preparing for upcoming test',
          prerequisites: ['Understanding of basic cell structure'],
          learningObjectives: ['Distinguish mitosis vs meiosis', 'Identify cell division phases'],
          masteryRequired: 85,
        },
        {
          id: '3',
          type: 'preparation',
          title: 'Ancient Civilizations Essay Prep',
          description: 'Start outlining your essay on Mesopotamian societies.',
          subject: 'World History',
          difficulty: 'easy',
          estimatedTime: 20,
          priority: 'medium',
          adaptiveReason: 'Based on your visual learning preference',
          prerequisites: ['Basic understanding of ancient civilizations'],
          learningObjectives: ['Understand historical connections', 'Develop timeline skills'],
          masteryRequired: 75,
        },
      ]);
    }
  };

  const loadLearningPaths = async () => {
    try {
      // This would load from API in real implementation
      setLearningPaths([
        {
          id: '1',
          name: 'Algebra Mastery Path',
          description: 'Complete pathway from basic algebra to advanced functions',
          subjects: ['Algebra I', 'Pre-Calculus'],
          totalSteps: 15,
          completedSteps: 8,
          estimatedCompletionTime: 120,
          difficulty: 'intermediate',
          adaptiveLevel: 5,
        },
        {
          id: '2',
          name: 'Biology Foundations',
          description: 'Build strong understanding of biological principles',
          subjects: ['Biology I'],
          totalSteps: 12,
          completedSteps: 6,
          estimatedCompletionTime: 90,
          difficulty: 'beginner',
          adaptiveLevel: 4,
        },
      ]);
    } catch (error) {
      console.error('Error loading learning paths:', error);
    }
  };

  const loadStudentProfile = async () => {
    try {
      // This would load from API in real implementation
      setStudentProfile({
        learningStyle: 'visual',
        strengths: ['Problem-solving', 'Visual patterns', 'Logical reasoning'],
        challenges: ['Abstract concepts', 'Time management', 'Complex reading'],
        preferences: {
          sessionLength: 30,
          timeOfDay: 'afternoon',
          breakFrequency: 15,
        },
        academicGoals: [
          'Improve algebra grade to B+',
          'Master biology concepts',
          'Prepare for SATs',
        ],
      });
    } catch (error) {
      console.error('Error loading student profile:', error);
    }
  };

  const loadStudySessions = async () => {
    try {
      const response = await fetch('/api/academy/study-sessions');
      if (response.ok) {
        const data = await response.json();
        setStudySessions(data.sessions);
      }
    } catch (error) {
      console.error('Error loading study sessions:', error);
      // Use sample data as fallback
      setStudySessions([
        {
          id: '1',
          subject: 'Algebra I',
          topic: 'Linear Functions',
          duration: 45,
          score: 85,
          date: '2025-01-20',
          learningGoals: ['Understand slope', 'Graph linear functions'],
          masteryLevel: 85,
          questionsAnswered: 15,
          correctAnswers: 13,
          weakPoints: ['Y-intercept calculations'],
          recommendations: ['Practice more graphing'],
        },
        {
          id: '2',
          subject: 'Biology I',
          topic: 'Cell Structure',
          duration: 30,
          score: 92,
          date: '2025-01-19',
          learningGoals: ['Identify organelles', 'Understand cell functions'],
          masteryLevel: 92,
          questionsAnswered: 12,
          correctAnswers: 11,
          weakPoints: ['Endoplasmic reticulum'],
          recommendations: ['Review organelle functions'],
        },
        {
          id: '3',
          subject: 'World History',
          topic: 'Ancient Egypt',
          duration: 25,
          score: 78,
          date: '2025-01-18',
          learningGoals: ['Learn about pharaohs', 'Understand pyramid construction'],
          masteryLevel: 78,
          questionsAnswered: 10,
          correctAnswers: 8,
          weakPoints: ['Timeline of dynasties'],
          recommendations: ['Create timeline study aid'],
        },
        {
          id: '4',
          subject: 'Algebra I',
          topic: 'Quadratic Equations',
          duration: 35,
          score: 65,
          date: '2025-01-17',
          learningGoals: ['Master factoring', 'Apply quadratic formula'],
          masteryLevel: 65,
          questionsAnswered: 12,
          correctAnswers: 8,
          weakPoints: ['Complex factoring', 'Discriminant'],
          recommendations: ['Focus on factoring practice'],
        },
      ]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/academy/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          chatHistory: messages.slice(-5), // Send last 5 messages for context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.response,
          timestamp: new Date().toISOString(),
          subject: data.subject,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRecommendationClick = async (recommendation: StudyRecommendation) => {
    const message = `Help me with: ${recommendation.title}`;
    setInputMessage(message);
    setActiveTab('chat');

    // Auto-send the recommendation as a message
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <Zap className="w-4 h-4 text-green-400" />;
      case 'medium':
        return <Target className="w-4 h-4 text-yellow-400" />;
      case 'hard':
        return <Brain className="w-4 h-4 text-red-400" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const averageScore =
    studySessions.length > 0
      ? Math.round(
          studySessions.reduce((sum, session) => sum + session.score, 0) / studySessions.length,
        )
      : 0;

  const totalStudyTime = studySessions.reduce((sum, session) => sum + session.duration, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Initializing your AI Study Companion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            AI Study Companion
          </h1>
          <p className="text-slate-400">
            Your intelligent learning partner for personalized academic support
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700">
            <Button
              size="sm"
              variant={activeTab === 'chat' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('chat')}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'recommendations' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('recommendations')}
              className="flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              Recommendations
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'analytics' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('analytics')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Analytics
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'learning-paths' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('learning-paths')}
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Paths
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              Profile
            </Button>
          </div>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <Card className="bg-slate-800/50 border-slate-700 h-[600px] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-400" />
                Study Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-100 border border-slate-600'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.subject && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {message.subject}
                        </Badge>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 border border-slate-600 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about your studies..."
                  className="flex-1 bg-slate-700 border-slate-600 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={isTyping}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                Personalized Study Recommendations
              </h2>
              <Button
                onClick={loadRecommendations}
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <Card
                  key={rec.id}
                  className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800/70 transition-colors"
                  onClick={() => handleRecommendationClick(rec)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getDifficultyIcon(rec.difficulty)}
                        <CardTitle className="text-white text-lg">{rec.title}</CardTitle>
                      </div>
                      <Badge className={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-300 text-sm">{rec.description}</p>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {rec.subject}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rec.estimatedTime}m
                      </span>
                    </div>

                    <Badge variant="outline" className="text-xs">
                      {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Study Analytics</h2>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    Average Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">{averageScore}%</div>
                  <Progress value={averageScore} className="h-2" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Total Study Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">
                    {Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m
                  </div>
                  <p className="text-slate-400 text-sm">This week</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Study Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">{studySessions.length}</div>
                  <p className="text-slate-400 text-sm">This week</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sessions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Study Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studySessions.map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">{session.topic}</p>
                        <p className="text-slate-400 text-sm">{session.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{session.score}%</p>
                        <p className="text-slate-400 text-sm">{session.duration}m</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Learning Paths Tab */}
        {activeTab === 'learning-paths' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Personalized Learning Paths</h2>
              <p className="text-slate-400">
                AI-curated pathways adapted to your learning style and pace
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {learningPaths.map((path) => (
                <Card
                  key={path.id}
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{path.name}</CardTitle>
                        <p className="text-slate-400 text-sm mt-1">{path.description}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`
                        ${path.difficulty === 'beginner' ? 'border-green-500/50 text-green-400' : ''}
                        ${path.difficulty === 'intermediate' ? 'border-yellow-500/50 text-yellow-400' : ''}
                        ${path.difficulty === 'advanced' ? 'border-red-500/50 text-red-400' : ''}
                      `}
                      >
                        {path.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-300">Progress</span>
                          <span className="text-slate-400">
                            {path.completedSteps}/{path.totalSteps} steps
                          </span>
                        </div>
                        <Progress
                          value={(path.completedSteps / path.totalSteps) * 100}
                          className="h-2"
                        />
                      </div>

                      {/* Subjects */}
                      <div>
                        <p className="text-sm text-slate-400 mb-2">Subjects covered:</p>
                        <div className="flex gap-2 flex-wrap">
                          {path.subjects.map((subject, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-400">
                            {path.estimatedCompletionTime}h remaining
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400">Level {path.adaptiveLevel}</span>
                        </div>
                      </div>

                      <Button className="w-full mt-4" variant="outline">
                        Continue Path
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Create New Path */}
            <Card className="bg-slate-800/30 border-slate-700 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Target className="w-12 h-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Create Custom Learning Path
                </h3>
                <p className="text-slate-400 text-center mb-4">
                  Let AI design a personalized pathway based on your goals and learning style
                </p>
                <Button variant="outline" className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Generate New Path
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Student Profile Tab */}
        {activeTab === 'profile' && studentProfile && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Learning Profile</h2>
              <p className="text-slate-400">
                Your personalized learning insights and adaptive AI settings
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Learning Style */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Learning Style
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-white">
                        {studentProfile.learningStyle[0].toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white capitalize">
                      {studentProfile.learningStyle}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">Primary learning preference</p>
                  </div>
                </CardContent>
              </Card>

              {/* Adaptive Learning Stats */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Adaptive Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Learning Level</span>
                      <span className="text-green-400">{adaptiveLearning.currentLevel}/10</span>
                    </div>
                    <Progress value={adaptiveLearning.currentLevel * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Retention Rate</span>
                      <span className="text-blue-400">
                        {(adaptiveLearning.retentionRate * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={adaptiveLearning.retentionRate * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Learning Velocity</span>
                      <span className="text-purple-400">{adaptiveLearning.learningVelocity}x</span>
                    </div>
                    <Progress
                      value={(adaptiveLearning.learningVelocity / 2) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Study Preferences */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    Study Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Session Length</span>
                    <span className="text-white">
                      {studentProfile.preferences.sessionLength} min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Best Time</span>
                    <span className="text-white capitalize">
                      {studentProfile.preferences.timeOfDay}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Break Frequency</span>
                    <span className="text-white">
                      {studentProfile.preferences.breakFrequency} min
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strengths and Challenges */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-400" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {studentProfile.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-slate-300">{strength}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-400" />
                    Growth Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {studentProfile.challenges.map((challenge, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-slate-300">{challenge}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Academic Goals */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Academic Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {studentProfile.academicGoals.map((goal, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/50 rounded-lg p-3 border border-slate-600"
                    >
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300 text-sm">{goal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
