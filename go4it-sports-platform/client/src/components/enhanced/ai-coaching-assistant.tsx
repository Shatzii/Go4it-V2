import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Brain, 
  Target, 
  TrendingUp,
  Lightbulb,
  Clock,
  Star,
  Zap
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarRating from "./star-rating";

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  attachments?: string[];
  suggestions?: string[];
}

interface CoachingInsight {
  type: 'performance' | 'mental' | 'physical' | 'academic';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface AICoachingAssistantProps {
  user: any;
  garScores: any[];
  recentActivity: string[];
}

export default function AICoachingAssistant({ user, garScores, recentActivity }: AICoachingAssistantProps) {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hello ${user?.firstName || 'Champion'}! I'm your AI coaching assistant. I've analyzed your recent GAR scores and training data. What would you like to work on today?`,
      timestamp: new Date(),
      suggestions: [
        "Analyze my recent performance",
        "Help me prepare for my next game", 
        "Create a mental training plan",
        "Review my academic progress"
      ]
    }
  ]);

  const latestGarScore = garScores[0]?.overallScore || 0;

  const insights: CoachingInsight[] = [
    {
      type: 'performance',
      title: 'Shooting Accuracy Improvement',
      description: `Your GAR score shows strong potential at ${latestGarScore}. Focus on consistency in your shooting mechanics.`,
      actionable: true,
      priority: 'high'
    },
    {
      type: 'mental',
      title: 'Pre-Game Routine',
      description: 'Developing a consistent pre-game mental routine could boost your confidence by 15-20%.',
      actionable: true,
      priority: 'medium'
    },
    {
      type: 'physical',
      title: 'Recovery Optimization',
      description: 'Your training intensity is excellent. Consider adding more recovery-focused sessions.',
      actionable: true,
      priority: 'medium'
    },
    {
      type: 'academic',
      title: 'NCAA Readiness',
      description: 'Your academic progress is on track for NCAA eligibility. Maintain current GPA standards.',
      actionable: false,
      priority: 'low'
    }
  ];

  const quickActions = [
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set SMART goals for your next training phase",
      action: "Let's set some specific goals for this month"
    },
    {
      icon: Brain,
      title: "Mental Training",
      description: "Work on visualization and focus techniques",
      action: "I need help with mental preparation"
    },
    {
      icon: TrendingUp,
      title: "Performance Analysis",
      description: "Deep dive into your recent statistics",
      action: "Analyze my performance trends"
    },
    {
      icon: Lightbulb,
      title: "Training Tips",
      description: "Get personalized training recommendations",
      action: "Give me training recommendations"
    }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    // Simulate AI response
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: generateAIResponse(message),
      timestamp: new Date(),
      suggestions: getFollowUpSuggestions(message)
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setMessage('');
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = {
      performance: `Based on your GAR score of ${latestGarScore}, I can see you're performing well. Here are specific areas to focus on for improvement...`,
      mental: "Mental preparation is crucial for peak performance. Let me guide you through some proven techniques used by elite athletes...",
      training: "I've analyzed your training patterns and here's a personalized plan that aligns with your current GAR metrics...",
      academic: "Your academic progress is important for your athletic career. Let's review your current status and create an action plan..."
    };

    if (userInput.toLowerCase().includes('performance')) return responses.performance;
    if (userInput.toLowerCase().includes('mental')) return responses.mental;
    if (userInput.toLowerCase().includes('training')) return responses.training;
    if (userInput.toLowerCase().includes('academic')) return responses.academic;
    
    return "I understand your question. Let me provide you with personalized insights based on your profile and recent activity...";
  };

  const getFollowUpSuggestions = (userInput: string): string[] => {
    return [
      "Tell me more about this",
      "Create a specific plan",
      "Show me examples",
      "Set a reminder for this"
    ];
  };

  const handleQuickAction = (action: string) => {
    setMessage(action);
    handleSendMessage();
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'performance': return Target;
      case 'mental': return Brain;
      case 'physical': return Zap;
      case 'academic': return Star;
      default: return Lightbulb;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* AI Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="bg-slate-800/50 border-cyan-400/30 h-[600px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-cyan-400 neon-glow" />
              AI Coaching Assistant
              <Badge className="verified-badge ml-auto">
                <Star className="w-3 h-3 mr-1" />
                Elite Coach
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 pb-4">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-4 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-cyan-500/20 border border-cyan-500/30' 
                          : 'bg-slate-700/50 border border-slate-600/50'
                      }`}>
                        <p className="text-white text-sm">{msg.content}</p>
                        <p className="text-xs text-slate-400 mt-2">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                        
                        {msg.suggestions && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {msg.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                                onClick={() => setMessage(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
            
            <div className="p-6 border-t border-slate-700">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything about your training, performance, or goals..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleVoiceInput}
                  className={isListening ? 'border-red-500 text-red-500' : 'border-slate-600'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button onClick={handleSendMessage} className="neon-glow">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights and Quick Actions */}
      <div className="space-y-6">
        {/* Current Insights */}
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-purple-400" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => {
              const IconComponent = getInsightIcon(insight.type);
              return (
                <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600/50">
                  <div className="flex items-start gap-3 mb-3">
                    <IconComponent className="w-5 h-5 text-purple-400 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm mb-1">{insight.title}</h4>
                      <p className="text-xs text-slate-400 mb-2">{insight.description}</p>
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(insight.priority)}`}>
                        {insight.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  {insight.actionable && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs border-purple-400/50 text-purple-400 hover:bg-purple-400/10"
                      onClick={() => handleQuickAction(`Tell me more about ${insight.title.toLowerCase()}`)}
                    >
                      Get Action Plan
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto p-4 border-slate-600 hover:border-green-400/50 hover:bg-green-400/10"
                onClick={() => handleQuickAction(action.action)}
              >
                <action.icon className="w-5 h-5 text-green-400 mr-3" />
                <div className="text-left">
                  <div className="font-medium text-white text-sm">{action.title}</div>
                  <div className="text-xs text-slate-400">{action.description}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card className="bg-slate-800/50 border-cyan-400/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <StarRating garScore={latestGarScore} size="lg" />
              <p className="text-xs text-slate-400 mt-2">Current GAR Rating</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">This Week</span>
                <span className="text-green-400">+3 points</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Training Sessions</span>
                <span className="text-white">5/5 completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Goal Progress</span>
                <span className="text-yellow-400">75%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}