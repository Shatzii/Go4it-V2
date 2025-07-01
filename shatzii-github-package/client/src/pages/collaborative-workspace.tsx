import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Bot, 
  MessageSquare, 
  Video,
  Share2,
  FileText,
  Lightbulb,
  Zap,
  Brain,
  Clock,
  Edit3,
  Send,
  Mic,
  MicOff,
  VideoOff,
  Settings,
  Plus,
  Target,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  isTyping?: boolean;
}

interface AIAssistant {
  id: string;
  name: string;
  type: 'analyst' | 'strategist' | 'creative' | 'technical';
  status: 'active' | 'processing' | 'idle';
  currentTask?: string;
  insights: number;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'ai-insight' | 'file' | 'system';
  aiGenerated?: boolean;
}

interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  progress: number;
  dueDate: string;
  participants: string[];
  aiAgents: string[];
  status: 'active' | 'planning' | 'review' | 'completed';
}

export default function CollaborativeWorkspace() {
  const [activeProject, setActiveProject] = useState<string>('proj-1');
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const teamMembers: TeamMember[] = [
    {
      id: 'user-1',
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      role: 'Product Manager',
      status: 'online'
    },
    {
      id: 'user-2',
      name: 'Mike Chen',
      avatar: '/api/placeholder/40/40',
      role: 'AI Engineer',
      status: 'online',
      isTyping: true
    },
    {
      id: 'user-3',
      name: 'Emma Rodriguez',
      avatar: '/api/placeholder/40/40',
      role: 'UX Designer',
      status: 'away'
    },
    {
      id: 'user-4',
      name: 'David Kim',
      avatar: '/api/placeholder/40/40',
      role: 'Data Scientist',
      status: 'busy'
    }
  ];

  const aiAssistants: AIAssistant[] = [
    {
      id: 'ai-1',
      name: 'Strategy AI',
      type: 'strategist',
      status: 'active',
      currentTask: 'Analyzing market trends',
      insights: 12
    },
    {
      id: 'ai-2',
      name: 'Data Analyst AI',
      type: 'analyst',
      status: 'processing',
      currentTask: 'Processing user behavior data',
      insights: 8
    },
    {
      id: 'ai-3',
      name: 'Creative AI',
      type: 'creative',
      status: 'idle',
      insights: 5
    },
    {
      id: 'ai-4',
      name: 'Technical AI',
      type: 'technical',
      status: 'active',
      currentTask: 'Code review and optimization',
      insights: 15
    }
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Sarah Johnson',
      content: 'Let\'s discuss the Q2 strategy for our healthcare AI vertical.',
      timestamp: '2025-06-29T10:30:00Z',
      type: 'text'
    },
    {
      id: '2',
      sender: 'Strategy AI',
      content: 'Based on market analysis, healthcare AI shows 60% growth potential. Key opportunities: telemedicine integration, diagnostic assistance, and compliance automation.',
      timestamp: '2025-06-29T10:31:00Z',
      type: 'ai-insight',
      aiGenerated: true
    },
    {
      id: '3',
      sender: 'Mike Chen',
      content: 'The technical infrastructure is ready. We can scale to 10x current capacity.',
      timestamp: '2025-06-29T10:32:00Z',
      type: 'text'
    },
    {
      id: '4',
      sender: 'Data Analyst AI',
      content: 'Customer segmentation analysis complete. High-value prospects identified in hospital systems (78% conversion) and medical device companies (65% conversion).',
      timestamp: '2025-06-29T10:33:00Z',
      type: 'ai-insight',
      aiGenerated: true
    }
  ]);

  const projects: WorkspaceProject[] = [
    {
      id: 'proj-1',
      name: 'Healthcare AI Expansion',
      description: 'Scale healthcare AI solutions to capture 60% market growth',
      progress: 65,
      dueDate: '2025-07-15',
      participants: ['user-1', 'user-2', 'user-3'],
      aiAgents: ['ai-1', 'ai-2'],
      status: 'active'
    },
    {
      id: 'proj-2',
      name: 'Financial Services Launch',
      description: 'Launch AI solutions for banking and fintech sectors',
      progress: 45,
      dueDate: '2025-08-01',
      participants: ['user-1', 'user-4'],
      aiAgents: ['ai-1', 'ai-4'],
      status: 'planning'
    },
    {
      id: 'proj-3',
      name: 'Agent Marketplace Beta',
      description: 'Release beta version of autonomous agent marketplace',
      progress: 80,
      dueDate: '2025-07-01',
      participants: ['user-2', 'user-3', 'user-4'],
      aiAgents: ['ai-3', 'ai-4'],
      status: 'review'
    }
  ];

  useEffect(() => {
    // Simulate real-time AI insights
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        generateAIInsight();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAIInsight = () => {
    const insights = [
      'Market opportunity identified: Manufacturing AI segment showing 45% growth potential in predictive maintenance.',
      'Customer behavior pattern detected: Enterprise clients using 3+ AI agents have 89% higher retention rates.',
      'Performance optimization suggestion: Implementing batch processing could reduce response time by 34%.',
      'Revenue projection update: Current trajectory suggests $2.8M ARR by Q4 2025.',
      'Competitive analysis: Two new entrants detected in financial AI space, recommend accelerated feature development.'
    ];

    const randomInsight = insights[Math.floor(Math.random() * insights.length)];
    const aiAssistant = aiAssistants[Math.floor(Math.random() * aiAssistants.length)];

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: aiAssistant.name,
      content: randomInsight,
      timestamp: new Date().toISOString(),
      type: 'ai-insight',
      aiGenerated: true
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: currentMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');

    // Simulate AI response
    setIsAIThinking(true);
    setTimeout(() => {
      setIsAIThinking(false);
      generateAIInsight();
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getAITypeIcon = (type: string) => {
    switch (type) {
      case 'strategist': return <Target className="w-4 h-4" />;
      case 'analyst': return <TrendingUp className="w-4 h-4" />;
      case 'creative': return <Lightbulb className="w-4 h-4" />;
      case 'technical': return <Zap className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const startVideoCall = () => {
    setIsVideoCall(true);
    toast({
      title: "Video Call Started",
      description: "All team members have been notified to join.",
    });
  };

  const endVideoCall = () => {
    setIsVideoCall(false);
    setIsMuted(false);
    setIsCameraOff(false);
    toast({
      title: "Video Call Ended",
      description: "Call summary will be generated by AI.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Users className="w-8 h-8 mr-3" />
              Collaborative AI Workspace
            </h1>
            <p className="text-gray-300 mt-2">
              Real-time collaboration with AI assistants and team members
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {!isVideoCall ? (
              <Button onClick={startVideoCall} className="bg-green-600 hover:bg-green-700">
                <Video className="w-4 h-4 mr-2" />
                Start Video Call
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  variant={isMuted ? "destructive" : "outline"}
                  size="sm"
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={() => setIsCameraOff(!isCameraOff)}
                  variant={isCameraOff ? "destructive" : "outline"}
                  size="sm"
                >
                  {isCameraOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </Button>
                <Button onClick={endVideoCall} variant="destructive" size="sm">
                  End Call
                </Button>
              </div>
            )}
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Team & AI Assistants */}
          <div className="space-y-6">
            {/* Active Project */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Active Project</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projects.filter(p => p.id === activeProject).map(project => (
                    <div key={project.id}>
                      <h3 className="font-medium text-white">{project.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{project.description}</p>
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Team Members ({teamMembers.filter(m => m.status === 'online').length} online)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${getStatusColor(member.status)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{member.name}</div>
                        <div className="text-xs text-gray-400">{member.role}</div>
                        {member.isTyping && (
                          <div className="text-xs text-purple-400 flex items-center">
                            <Edit3 className="w-3 h-3 mr-1" />
                            typing...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Assistants */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Assistants ({aiAssistants.filter(ai => ai.status === 'active').length} active)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiAssistants.map((ai) => (
                    <div key={ai.id} className="p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getAITypeIcon(ai.type)}
                          <span className="text-sm font-medium text-white">{ai.name}</span>
                        </div>
                        <Badge 
                          variant={ai.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {ai.status}
                        </Badge>
                      </div>
                      {ai.currentTask && (
                        <div className="text-xs text-gray-400 mb-2">{ai.currentTask}</div>
                      )}
                      <div className="text-xs text-purple-400">
                        {ai.insights} insights generated today
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Call Area */}
            {isVideoCall && (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-0">
                  <div className="h-64 bg-gradient-to-br from-blue-900 to-purple-900 rounded-t-lg flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-white mx-auto mb-4" />
                      <div className="text-white text-lg font-medium">Video Call Active</div>
                      <div className="text-gray-300 text-sm">4 participants connected</div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex -space-x-2">
                        {teamMembers.slice(0, 4).map((member, index) => (
                          <Avatar key={index} className="w-8 h-8 border-2 border-slate-800">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Real-time Chat */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Team Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto mb-4 space-y-3">
                  {messages.map((message) => (
                    <div key={message.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        {message.aiGenerated ? (
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{message.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-white">{message.sender}</span>
                          {message.aiGenerated && (
                            <Badge variant="outline" className="text-xs">
                              AI Insight
                            </Badge>
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className={`text-sm ${message.aiGenerated ? 'text-purple-300' : 'text-gray-300'}`}>
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isAIThinking && (
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white mb-1">AI Assistant</div>
                        <div className="text-sm text-purple-300 flex items-center">
                          <div className="animate-pulse">Generating insights...</div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex space-x-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Type your message or ask AI for insights..."
                    className="flex-1 bg-slate-700 border-slate-600"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} className="bg-purple-600 hover:bg-purple-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Project Management */}
          <div className="space-y-6">
            {/* Project Tasks */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Active Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">Market Analysis</span>
                      <Badge className="bg-green-600 text-xs">Complete</Badge>
                    </div>
                    <div className="text-xs text-gray-400">Assigned to Strategy AI</div>
                  </div>

                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">User Research</span>
                      <Badge variant="outline" className="text-xs">In Progress</Badge>
                    </div>
                    <div className="text-xs text-gray-400">Assigned to Emma Rodriguez</div>
                  </div>

                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">Technical Specs</span>
                      <Badge variant="secondary" className="text-xs">Pending</Badge>
                    </div>
                    <div className="text-xs text-gray-400">Assigned to Technical AI</div>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </CardContent>
            </Card>

            {/* AI Insights Summary */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Today's AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="text-xs text-purple-400 mb-1">Market Opportunity</div>
                    <div className="text-sm text-white">Healthcare AI showing 60% growth potential</div>
                  </div>

                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="text-xs text-green-400 mb-1">Performance</div>
                    <div className="text-sm text-white">Customer retention up 15% with multi-agent usage</div>
                  </div>

                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="text-xs text-blue-400 mb-1">Strategy</div>
                    <div className="text-sm text-white">Enterprise focus reducing competitive pressure</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full text-sm" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Workspace
                </Button>
                <Button variant="outline" className="w-full text-sm" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Summary
                </Button>
                <Button variant="outline" className="w-full text-sm" size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Follow-up
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}