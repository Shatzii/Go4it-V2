import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Play,
  Pause,
  Square,
  Settings,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Brain,
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  BarChart3,
  Zap,
  Activity,
  Bot,
  Cog,
  Monitor,
  AlertTriangle
} from 'lucide-react';

interface AIAgent {
  id: string;
  name: string;
  type: 'marketing' | 'sales' | 'support' | 'analytics';
  status: 'active' | 'paused' | 'idle' | 'error';
  description: string;
  capabilities: string[];
  performance: {
    efficiency: number;
    tasksCompleted: number;
    successRate: number;
    revenue?: number;
  };
  configuration: {
    priority: 'high' | 'medium' | 'low';
    schedule: string;
    targets: string[];
    parameters: Record<string, any>;
  };
  lastActivity: string;
  createdAt: string;
}

interface AgentTask {
  id: string;
  agentId: string;
  type: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  createdAt: string;
  completedAt?: string;
}

export default function AgentManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newAgent, setNewAgent] = useState(false);

  // Fetch agents data
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['/api/ai/agents'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['/api/ai/tasks'],
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  const { data: metrics } = useQuery({
    queryKey: ['/api/ai/metrics'],
    refetchInterval: 30000
  });

  // Agent control mutations
  const startAgentMutation = useMutation({
    mutationFn: (agentId: string) => apiRequest(`/api/ai/agents/${agentId}/start`, { method: 'POST' }),
    onSuccess: () => {
      toast({ title: 'Agent started successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/agents'] });
    }
  });

  const stopAgentMutation = useMutation({
    mutationFn: (agentId: string) => apiRequest(`/api/ai/agents/${agentId}/stop`, { method: 'POST' }),
    onSuccess: () => {
      toast({ title: 'Agent stopped successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/agents'] });
    }
  });

  const updateAgentMutation = useMutation({
    mutationFn: (agent: AIAgent) => apiRequest(`/api/ai/agents/${agent.id}`, { 
      method: 'PUT', 
      body: JSON.stringify(agent) 
    }),
    onSuccess: () => {
      toast({ title: 'Agent updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/agents'] });
      setEditMode(false);
    }
  });

  const createAgentMutation = useMutation({
    mutationFn: (agent: Omit<AIAgent, 'id'>) => apiRequest('/api/ai/agents', { 
      method: 'POST', 
      body: JSON.stringify(agent) 
    }),
    onSuccess: () => {
      toast({ title: 'Agent created successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/agents'] });
      setNewAgent(false);
    }
  });

  const deleteAgentMutation = useMutation({
    mutationFn: (agentId: string) => apiRequest(`/api/ai/agents/${agentId}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast({ title: 'Agent deleted successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/agents'] });
      setSelectedAgent(null);
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4 text-green-500" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'idle': return <Square className="h-4 w-4 text-gray-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'marketing': return <Target className="h-4 w-4" />;
      case 'sales': return <TrendingUp className="h-4 w-4" />;
      case 'support': return <MessageSquare className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-cyan-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-300">Loading AI Agent Management System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Agent Management System
            </h1>
            <p className="text-slate-400 mt-2">
              Full control over your autonomous AI workforce
            </p>
          </div>
          <Button
            onClick={() => setNewAgent(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Agent
          </Button>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Agents</p>
                  <p className="text-2xl font-bold text-cyan-400">{agents.length}</p>
                </div>
                <Bot className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Agents</p>
                  <p className="text-2xl font-bold text-green-400">
                    {agents.filter(a => a.status === 'active').length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Tasks Today</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {tasks.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">System Health</p>
                  <p className="text-2xl font-bold text-green-400">98.5%</p>
                </div>
                <Monitor className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent List */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-cyan-400">Active Agents</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 p-6">
                  {agents.map((agent: AIAgent) => (
                    <div
                      key={agent.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedAgent?.id === agent.id
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-slate-600 bg-slate-700/50 hover:bg-slate-700'
                      }`}
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(agent.type)}
                          <span className="font-medium">{agent.name}</span>
                        </div>
                        {getStatusIcon(agent.status)}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="outline" className="text-slate-300 border-slate-600">
                          {agent.type}
                        </Badge>
                        <span className="text-slate-400">
                          {agent.performance.efficiency}% efficiency
                        </span>
                      </div>
                      
                      <Progress 
                        value={agent.performance.efficiency} 
                        className="mt-2 h-1"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agent Details & Configuration */}
          <div className="lg:col-span-2">
            {selectedAgent ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-cyan-400 flex items-center space-x-2">
                      {getTypeIcon(selectedAgent.type)}
                      <span>{selectedAgent.name}</span>
                      <Badge variant="outline" className="text-slate-300 border-slate-600">
                        {selectedAgent.status}
                      </Badge>
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditMode(!editMode)}
                        className="border-slate-600"
                      >
                        {editMode ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                      </Button>
                      {selectedAgent.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => stopAgentMutation.mutate(selectedAgent.id)}
                          className="border-red-600 text-red-400 hover:bg-red-600/10"
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startAgentMutation.mutate(selectedAgent.id)}
                          className="border-green-600 text-green-400 hover:bg-green-600/10"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="config">Configuration</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                      <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                      <div>
                        <label className="text-sm text-slate-400 mb-2 block">Description</label>
                        {editMode ? (
                          <Textarea
                            value={selectedAgent.description}
                            onChange={(e) => setSelectedAgent({...selectedAgent, description: e.target.value})}
                            className="bg-slate-700 border-slate-600"
                          />
                        ) : (
                          <p className="text-slate-300">{selectedAgent.description}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm text-slate-400 mb-2 block">Capabilities</label>
                        <div className="flex flex-wrap gap-2">
                          {selectedAgent.capabilities.map((capability, index) => (
                            <Badge key={index} variant="secondary" className="bg-slate-700 text-slate-300">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-slate-400 mb-2 block">Last Activity</label>
                        <p className="text-slate-300">{selectedAgent.lastActivity}</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="config" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-slate-400 mb-2 block">Priority</label>
                          {editMode ? (
                            <Select
                              value={selectedAgent.configuration.priority}
                              onValueChange={(value) => setSelectedAgent({
                                ...selectedAgent, 
                                configuration: {...selectedAgent.configuration, priority: value as any}
                              })}
                            >
                              <SelectTrigger className="bg-slate-700 border-slate-600">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant={selectedAgent.configuration.priority === 'high' ? 'destructive' : 'secondary'}>
                              {selectedAgent.configuration.priority}
                            </Badge>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm text-slate-400 mb-2 block">Schedule</label>
                          {editMode ? (
                            <Input
                              value={selectedAgent.configuration.schedule}
                              onChange={(e) => setSelectedAgent({
                                ...selectedAgent, 
                                configuration: {...selectedAgent.configuration, schedule: e.target.value}
                              })}
                              className="bg-slate-700 border-slate-600"
                            />
                          ) : (
                            <p className="text-slate-300">{selectedAgent.configuration.schedule}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-slate-400 mb-2 block">Targets</label>
                        <div className="flex flex-wrap gap-2">
                          {selectedAgent.configuration.targets.map((target, index) => (
                            <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                              {target}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {editMode && (
                        <div className="flex space-x-2 pt-4">
                          <Button
                            onClick={() => updateAgentMutation.mutate(selectedAgent)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => deleteAgentMutation.mutate(selectedAgent.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Agent
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="performance" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-slate-700 border-slate-600">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-cyan-400">
                                {selectedAgent.performance.efficiency}%
                              </p>
                              <p className="text-sm text-slate-400">Efficiency</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-slate-700 border-slate-600">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-400">
                                {selectedAgent.performance.tasksCompleted}
                              </p>
                              <p className="text-sm text-slate-400">Tasks Completed</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-slate-700 border-slate-600">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-400">
                                {selectedAgent.performance.successRate}%
                              </p>
                              <p className="text-sm text-slate-400">Success Rate</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {selectedAgent.performance.revenue && (
                          <Card className="bg-slate-700 border-slate-600">
                            <CardContent className="p-4">
                              <div className="text-center">
                                <p className="text-2xl font-bold text-yellow-400">
                                  ${selectedAgent.performance.revenue.toLocaleString()}
                                </p>
                                <p className="text-sm text-slate-400">Revenue Generated</p>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="tasks" className="space-y-4">
                      <div className="space-y-2">
                        {tasks.filter((task: AgentTask) => task.agentId === selectedAgent.id).map((task: AgentTask) => (
                          <div key={task.id} className="p-3 bg-slate-700 rounded-lg border border-slate-600">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-slate-200">{task.type}</span>
                              <Badge variant={task.status === 'completed' ? 'default' : task.status === 'failed' ? 'destructive' : 'secondary'}>
                                {task.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-400">{task.description}</p>
                            {task.result && (
                              <p className="text-sm text-slate-300 mt-1">{task.result}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Bot className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Select an agent to view details and configuration</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}