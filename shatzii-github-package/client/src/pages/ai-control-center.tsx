import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import LiveDemoPanel from "@/components/features/live-demo-panel";
import EnterpriseShowcase from "@/components/features/enterprise-showcase";
import { PharaohIcon, SentinelIcon, NeuralIcon, QuantumIcon, ApolloIcon } from "@/components/icons/ai-agent-icons";
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Activity, 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Mail, 
  Phone, 
  MessageSquare, 
  Bot,
  Monitor,
  Code,
  Database,
  Globe,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Cpu,
  MemoryStick,
  Network,
  Eye,
  BarChart3,
  LineChart,
  PieChart
} from "lucide-react";

interface AIAgent {
  id: string;
  name: string;
  type: 'marketing' | 'sales' | 'support' | 'analytics' | 'operations';
  status: 'active' | 'idle' | 'paused' | 'error';
  performance: number;
  tasksCompleted: number;
  revenue: number;
  uptime: string;
  lastActivity: string;
  metrics: {
    efficiency: number;
    accuracy: number;
    speed: number;
    cost: number;
  };
  tasks: Array<{
    id: string;
    name: string;
    status: 'running' | 'completed' | 'pending';
    progress: number;
    startTime: string;
  }>;
}

interface SystemMetrics {
  totalAgents: number;
  activeAgents: number;
  totalRevenue: number;
  todayRevenue: number;
  totalLeads: number;
  todayLeads: number;
  conversionRate: number;
  systemUptime: number;
  cpuUsage: number;
  memoryUsage: number;
  networkTraffic: number;
}

export default function AIControlCenter() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [showEnterpriseView, setShowEnterpriseView] = useState(false);

  useEffect(() => {
    // Initialize with demo data showing full AI agent capabilities
    const demoAgents: AIAgent[] = [
      {
        id: "pharaoh-marketing",
        name: "Pharaoh Marketing Master",
        type: "marketing",
        status: "active",
        performance: 94,
        tasksCompleted: 2847,
        revenue: 385000,
        uptime: "23d 14h 32m",
        lastActivity: "2 minutes ago",
        metrics: { efficiency: 96, accuracy: 93, speed: 91, cost: 12 },
        tasks: [
          { id: "1", name: "Lead Generation Campaign", status: "running", progress: 67, startTime: "14:32" },
          { id: "2", name: "Content Creation", status: "running", progress: 82, startTime: "13:15" },
          { id: "3", name: "Social Media Analysis", status: "completed", progress: 100, startTime: "12:00" }
        ]
      },
      {
        id: "sentinel-sales",
        name: "Sentinel Sales Commander",
        type: "sales",
        status: "active",
        performance: 91,
        tasksCompleted: 1923,
        revenue: 524000,
        uptime: "18d 7h 45m",
        lastActivity: "1 minute ago",
        metrics: { efficiency: 93, accuracy: 89, speed: 95, cost: 15 },
        tasks: [
          { id: "4", name: "Deal Pipeline Analysis", status: "running", progress: 45, startTime: "15:00" },
          { id: "5", name: "Client Outreach", status: "running", progress: 73, startTime: "14:20" },
          { id: "6", name: "Proposal Generation", status: "pending", progress: 0, startTime: "16:00" }
        ]
      },
      {
        id: "neural-support",
        name: "Neural Support Specialist",
        type: "support",
        status: "active",
        performance: 88,
        tasksCompleted: 4521,
        revenue: 125000,
        uptime: "31d 2h 18m",
        lastActivity: "30 seconds ago",
        metrics: { efficiency: 91, accuracy: 95, speed: 87, cost: 8 },
        tasks: [
          { id: "7", name: "Ticket Resolution", status: "running", progress: 91, startTime: "15:30" },
          { id: "8", name: "Knowledge Base Update", status: "completed", progress: 100, startTime: "14:00" }
        ]
      },
      {
        id: "quantum-analytics",
        name: "Quantum Analytics Engine",
        type: "analytics",
        status: "active",
        performance: 97,
        tasksCompleted: 1247,
        revenue: 245000,
        uptime: "41d 11h 23m",
        lastActivity: "5 seconds ago",
        metrics: { efficiency: 98, accuracy: 97, speed: 94, cost: 18 },
        tasks: [
          { id: "9", name: "Performance Analysis", status: "running", progress: 78, startTime: "15:45" },
          { id: "10", name: "Predictive Modeling", status: "running", progress: 34, startTime: "15:20" }
        ]
      },
      {
        id: "apollo-operations",
        name: "Apollo Operations Director",
        type: "operations",
        status: "idle",
        performance: 85,
        tasksCompleted: 856,
        revenue: 95000,
        uptime: "12d 19h 7m",
        lastActivity: "15 minutes ago",
        metrics: { efficiency: 87, accuracy: 88, speed: 83, cost: 10 },
        tasks: [
          { id: "11", name: "System Optimization", status: "pending", progress: 0, startTime: "16:00" },
          { id: "12", name: "Resource Allocation", status: "completed", progress: 100, startTime: "14:30" }
        ]
      }
    ];

    const demoMetrics: SystemMetrics = {
      totalAgents: 5,
      activeAgents: 4,
      totalRevenue: 1374000,
      todayRevenue: 15420,
      totalLeads: 8923,
      todayLeads: 47,
      conversionRate: 34.7,
      systemUptime: 99.7,
      cpuUsage: 67,
      memoryUsage: 54,
      networkTraffic: 2.4
    };

    setAgents(demoAgents);
    setSystemMetrics(demoMetrics);
    setSelectedAgent(demoAgents[0]);
    setIsLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'paused': return 'bg-orange-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4" />;
      case 'idle': return <Pause className="h-4 w-4" />;
      case 'paused': return <Square className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string, agentId?: string) => {
    if (agentId) {
      switch (agentId) {
        case 'pharaoh-marketing': return <PharaohIcon className="h-5 w-5 text-cyan-400" />;
        case 'sentinel-sales': return <SentinelIcon className="h-5 w-5 text-green-400" />;
        case 'neural-support': return <NeuralIcon className="h-5 w-5 text-purple-400" />;
        case 'quantum-analytics': return <QuantumIcon className="h-5 w-5 text-orange-400" />;
        case 'apollo-operations': return <ApolloIcon className="h-5 w-5 text-red-400" />;
      }
    }
    switch (type) {
      case 'marketing': return <Target className="h-5 w-5" />;
      case 'sales': return <DollarSign className="h-5 w-5" />;
      case 'support': return <MessageSquare className="h-5 w-5" />;
      case 'analytics': return <BarChart3 className="h-5 w-5" />;
      case 'operations': return <Settings className="h-5 w-5" />;
      default: return <Bot className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg">Initializing AI Control Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-cyan-400 mb-2 flex items-center gap-3">
                <Brain className="h-10 w-10" />
                AI Control Center
              </h1>
              <p className="text-slate-300 text-lg">
                Command your autonomous AI workforce - Monitor, control, and optimize your digital agents
              </p>
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={() => setIsDemoActive(!isDemoActive)}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 text-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                {isDemoActive ? 'Hide Demo' : 'Start Live Demo'}
              </Button>
              <Button 
                onClick={() => setShowEnterpriseView(!showEnterpriseView)}
                variant="outline" 
                className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10 px-6 py-3 text-lg"
              >
                <Activity className="h-5 w-5 mr-2" />
                {showEnterpriseView ? 'Hide Enterprise' : 'Enterprise ROI'}
              </Button>
            </div>
          </div>
        </div>

        {/* System Overview */}
        {systemMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            <Card className="bg-slate-900/80 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Agents</p>
                    <p className="text-2xl font-bold text-cyan-400">{systemMetrics.totalAgents}</p>
                  </div>
                  <Bot className="h-8 w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Active</p>
                    <p className="text-2xl font-bold text-green-400">{systemMetrics.activeAgents}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-emerald-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-emerald-400">${systemMetrics.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Today Revenue</p>
                    <p className="text-2xl font-bold text-blue-400">${systemMetrics.todayRevenue.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Leads</p>
                    <p className="text-2xl font-bold text-purple-400">{systemMetrics.totalLeads.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-orange-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Conversion</p>
                    <p className="text-2xl font-bold text-orange-400">{systemMetrics.conversionRate}%</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Live Demo Panel */}
        {isDemoActive && (
          <div className="mb-8">
            <LiveDemoPanel isActive={isDemoActive} />
          </div>
        )}

        {/* Enterprise Showcase */}
        {showEnterpriseView && (
          <div className="mb-8">
            <EnterpriseShowcase />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent List */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/80 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Agents ({agents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {agents.map((agent) => (
                      <div
                        key={agent.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedAgent?.id === agent.id
                            ? 'bg-cyan-500/10 border-cyan-500/40'
                            : 'bg-slate-800/50 border-slate-700 hover:border-cyan-500/30'
                        }`}
                        onClick={() => setSelectedAgent(agent)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(agent.type, agent.id)}
                            <span className="text-slate-200 font-medium">{agent.name}</span>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Performance</span>
                            <span className="text-cyan-400">{agent.performance}%</span>
                          </div>
                          <Progress value={agent.performance} className="h-1" />
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Revenue</span>
                            <span className="text-emerald-400">${agent.revenue.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Tasks</span>
                            <span className="text-purple-400">{agent.tasksCompleted}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="border-green-500/20 text-green-400 hover:bg-green-500/10">
                            {getStatusIcon(agent.status)}
                          </Button>
                          <Button size="sm" variant="outline" className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Agent Details */}
          <div className="lg:col-span-2">
            {selectedAgent ? (
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-slate-800/50 border border-cyan-500/20">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600">Overview</TabsTrigger>
                  <TabsTrigger value="tasks" className="data-[state=active]:bg-cyan-600">Tasks</TabsTrigger>
                  <TabsTrigger value="performance" className="data-[state=active]:bg-cyan-600">Performance</TabsTrigger>
                  <TabsTrigger value="control" className="data-[state=active]:bg-cyan-600">Control</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <Card className="bg-slate-900/80 border-cyan-500/20">
                    <CardHeader>
                      <CardTitle className="text-cyan-400 flex items-center gap-2">
                        {getTypeIcon(selectedAgent.type)}
                        {selectedAgent.name}
                        <Badge variant="outline" className={`ml-2 ${getStatusColor(selectedAgent.status)} text-white border-none`}>
                          {selectedAgent.status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                          <p className="text-slate-400 text-sm">Efficiency</p>
                          <p className="text-2xl font-bold text-cyan-400">{selectedAgent.metrics.efficiency}%</p>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                          <p className="text-slate-400 text-sm">Accuracy</p>
                          <p className="text-2xl font-bold text-green-400">{selectedAgent.metrics.accuracy}%</p>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                          <p className="text-slate-400 text-sm">Speed</p>
                          <p className="text-2xl font-bold text-blue-400">{selectedAgent.metrics.speed}%</p>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                          <p className="text-slate-400 text-sm">Cost ($)</p>
                          <p className="text-2xl font-bold text-orange-400">{selectedAgent.metrics.cost}</p>
                        </div>
                      </div>

                      <Separator className="bg-slate-700" />

                      {/* Status Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-slate-200">Status Information</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Uptime</span>
                              <span className="text-cyan-400">{selectedAgent.uptime}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Last Activity</span>
                              <span className="text-green-400">{selectedAgent.lastActivity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Tasks Completed</span>
                              <span className="text-purple-400">{selectedAgent.tasksCompleted}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Revenue Generated</span>
                              <span className="text-emerald-400">${selectedAgent.revenue.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-slate-200">Performance Metrics</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-slate-400 text-sm">Overall Performance</span>
                                <span className="text-cyan-400 text-sm">{selectedAgent.performance}%</span>
                              </div>
                              <Progress value={selectedAgent.performance} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-slate-400 text-sm">Efficiency</span>
                                <span className="text-cyan-400 text-sm">{selectedAgent.metrics.efficiency}%</span>
                              </div>
                              <Progress value={selectedAgent.metrics.efficiency} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-slate-400 text-sm">Accuracy</span>
                                <span className="text-green-400 text-sm">{selectedAgent.metrics.accuracy}%</span>
                              </div>
                              <Progress value={selectedAgent.metrics.accuracy} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tasks">
                  <Card className="bg-slate-900/80 border-cyan-500/20">
                    <CardHeader>
                      <CardTitle className="text-cyan-400">Active Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedAgent.tasks.map((task) => (
                          <div key={task.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-slate-200 font-medium">{task.name}</h5>
                              <div className="flex items-center gap-2">
                                {task.status === 'running' && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
                                {task.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-400" />}
                                {task.status === 'pending' && <Clock className="h-4 w-4 text-yellow-400" />}
                                <Badge variant="outline" className={
                                  task.status === 'running' ? 'border-green-500/20 text-green-400' :
                                  task.status === 'completed' ? 'border-green-500/20 text-green-400' :
                                  'border-yellow-500/20 text-yellow-400'
                                }>
                                  {task.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-slate-400 text-sm">Progress</span>
                              <span className="text-cyan-400 text-sm">{task.progress}%</span>
                            </div>
                            <Progress value={task.progress} className="h-2 mb-2" />
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Started</span>
                              <span className="text-slate-300">{task.startTime}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance">
                  <Card className="bg-slate-900/80 border-cyan-500/20">
                    <CardHeader>
                      <CardTitle className="text-cyan-400">Performance Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-slate-200">Real-time Metrics</h4>
                          <div className="space-y-4">
                            <div className="p-4 bg-slate-800/50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-400">CPU Usage</span>
                                <span className="text-cyan-400">67%</span>
                              </div>
                              <Progress value={67} className="h-2" />
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-400">Memory Usage</span>
                                <span className="text-blue-400">54%</span>
                              </div>
                              <Progress value={54} className="h-2" />
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-400">Network I/O</span>
                                <span className="text-green-400">2.4 MB/s</span>
                              </div>
                              <Progress value={78} className="h-2" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-slate-200">Business Impact</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                              <LineChart className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                              <p className="text-slate-400 text-sm">Revenue/Hour</p>
                              <p className="text-2xl font-bold text-emerald-400">$642</p>
                            </div>
                            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                              <PieChart className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                              <p className="text-slate-400 text-sm">Leads/Hour</p>
                              <p className="text-2xl font-bold text-purple-400">23</p>
                            </div>
                            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                              <BarChart3 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                              <p className="text-slate-400 text-sm">Conversion</p>
                              <p className="text-2xl font-bold text-orange-400">34.7%</p>
                            </div>
                            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                              <TrendingUp className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                              <p className="text-slate-400 text-sm">ROI</p>
                              <p className="text-2xl font-bold text-cyan-400">847%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="control">
                  <Card className="bg-slate-900/80 border-cyan-500/20">
                    <CardHeader>
                      <CardTitle className="text-cyan-400">Agent Control Panel</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Control Buttons */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                        <Button variant="outline" className="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10">
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                        <Button variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                        <Button variant="outline" className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>

                      <Separator className="bg-slate-700" />

                      {/* Configuration */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-slate-200">Performance Settings</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-slate-400 text-sm block mb-1">Processing Intensity</label>
                              <Progress value={85} className="h-3" />
                              <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Conservative</span>
                                <span>Aggressive</span>
                              </div>
                            </div>
                            <div>
                              <label className="text-slate-400 text-sm block mb-1">Learning Rate</label>
                              <Progress value={72} className="h-3" />
                              <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Slow</span>
                                <span>Fast</span>
                              </div>
                            </div>
                            <div>
                              <label className="text-slate-400 text-sm block mb-1">Risk Tolerance</label>
                              <Progress value={60} className="h-3" />
                              <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Low Risk</span>
                                <span>High Risk</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-slate-200">Resource Allocation</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Cpu className="h-4 w-4 text-cyan-400" />
                                <span className="text-slate-300">CPU Cores</span>
                              </div>
                              <span className="text-cyan-400">4/8</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <MemoryStick className="h-4 w-4 text-blue-400" />
                                <span className="text-slate-300">Memory</span>
                              </div>
                              <span className="text-blue-400">8.2/16 GB</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Network className="h-4 w-4 text-green-400" />
                                <span className="text-slate-300">Bandwidth</span>
                              </div>
                              <span className="text-green-400">2.4/10 MB/s</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-slate-700" />

                      {/* Security & Monitoring */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-slate-200">Security & Monitoring</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-green-400" />
                              <span className="text-slate-300">Security</span>
                            </div>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/20">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Monitor className="h-4 w-4 text-cyan-400" />
                              <span className="text-slate-300">Monitoring</span>
                            </div>
                            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/20">Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4 text-blue-400" />
                              <span className="text-slate-300">Backup</span>
                            </div>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/20">Auto</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="bg-slate-900/80 border-cyan-500/20">
                <CardContent className="p-12 text-center">
                  <Bot className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2">Select an AI Agent</h3>
                  <p className="text-slate-500">Choose an agent from the list to view detailed information and controls</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}