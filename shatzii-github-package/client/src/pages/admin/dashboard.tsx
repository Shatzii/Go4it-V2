import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Users, 
  Activity, 
  Brain, 
  Settings, 
  Database, 
  Server, 
  Play, 
  Pause, 
  RotateCcw,
  Code,
  Eye,
  Terminal
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  systemHealth: number;
  aiAgentsRunning: number;
  totalAiAgents: number;
}

interface AIAgentStatus {
  id: string;
  name: string;
  type: 'marketing' | 'sales' | 'analysis' | 'support';
  status: 'running' | 'stopped' | 'error';
  uptime: number;
  tasksCompleted: number;
  performance: number;
  lastActivity: string;
}

export default function AdminDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const { data: systemMetrics } = useQuery<SystemMetrics>({
    queryKey: ['/api/admin/metrics'],
    refetchInterval: 30000
  });

  const { data: aiAgents } = useQuery<AIAgentStatus[]>({
    queryKey: ['/api/admin/ai-agents'],
    refetchInterval: 5000
  });

  const { data: systemLogs } = useQuery<any[]>({
    queryKey: ['/api/admin/logs'],
    refetchInterval: 10000
  });

  const handleAgentAction = async (agentId: string, action: 'start' | 'stop' | 'restart') => {
    try {
      await fetch(`/api/admin/ai-agents/${agentId}/${action}`, {
        method: 'POST'
      });
    } catch (error) {
      console.error(`Failed to ${action} agent:`, error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'stopped': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400 flex items-center gap-3">
              <Shield className="h-8 w-8" />
              Admin Control Center
            </h1>
            <p className="text-slate-400 mt-2">Full system and AI agent management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-cyan-500/20 text-cyan-400">
              <Terminal className="h-4 w-4 mr-2" />
              System Console
            </Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/30 backdrop-blur-xl border-cyan-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-400">
                {systemMetrics?.totalUsers || 0}
              </div>
              <p className="text-xs text-slate-500">
                {systemMetrics?.activeUsers || 0} active now
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 backdrop-blur-xl border-cyan-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                ${systemMetrics?.totalRevenue?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-slate-500">Total generated</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 backdrop-blur-xl border-cyan-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-400">
                {systemMetrics?.aiAgentsRunning || 0}/{systemMetrics?.totalAiAgents || 0}
              </div>
              <p className="text-xs text-slate-500">Running/Total</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 backdrop-blur-xl border-cyan-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                <Server className="h-4 w-4" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400 mb-2">
                {systemMetrics?.systemHealth || 0}%
              </div>
              <Progress 
                value={systemMetrics?.systemHealth || 0} 
                className="h-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-cyan-500/20">
            <TabsTrigger value="agents" className="data-[state=active]:bg-cyan-600">
              AI Agents Control
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-cyan-600">
              User Management
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-cyan-600">
              System Monitoring
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-cyan-600">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* AI Agents Control */}
          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent List */}
              <Card className="bg-slate-800/30 backdrop-blur-xl border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Agent Control Panel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiAgents?.map((agent) => (
                    <div 
                      key={agent.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedAgent === agent.id 
                          ? 'border-cyan-500 bg-cyan-500/10' 
                          : 'border-slate-600 hover:border-cyan-500/50'
                      }`}
                      onClick={() => setSelectedAgent(agent.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${getStatusColor(agent.status)}`} />
                          <h3 className="font-semibold text-slate-200">{agent.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {agent.type}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          {agent.status === 'running' ? (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAgentAction(agent.id, 'stop');
                              }}
                            >
                              <Pause className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAgentAction(agent.id, 'start');
                              }}
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAgentAction(agent.id, 'restart');
                            }}
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-xs text-slate-400">
                        <div>
                          <div>Uptime</div>
                          <div className="text-slate-200">{formatUptime(agent.uptime)}</div>
                        </div>
                        <div>
                          <div>Tasks</div>
                          <div className="text-slate-200">{agent.tasksCompleted}</div>
                        </div>
                        <div>
                          <div>Performance</div>
                          <div className="text-green-400">{agent.performance}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Agent Details & Programming */}
              <Card className="bg-slate-800/30 backdrop-blur-xl border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Agent Programming & Testing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedAgent ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Button className="bg-cyan-600 hover:bg-cyan-700">
                          <Code className="h-4 w-4 mr-2" />
                          Edit Logic
                        </Button>
                        <Button variant="outline" className="border-cyan-500/20">
                          <Eye className="h-4 w-4 mr-2" />
                          Live Monitor
                        </Button>
                        <Button variant="outline" className="border-cyan-500/20">
                          <Terminal className="h-4 w-4 mr-2" />
                          Debug Console
                        </Button>
                      </div>
                      
                      {/* Live Activity Monitor */}
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Live Activity Stream</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {/* Real-time activity logs would go here */}
                          <div className="text-xs text-slate-400 border-l-2 border-cyan-500 pl-3">
                            <div className="text-cyan-400">12:34:56</div>
                            <div>Analyzing new lead prospects...</div>
                          </div>
                          <div className="text-xs text-slate-400 border-l-2 border-green-500 pl-3">
                            <div className="text-green-400">12:34:45</div>
                            <div>Generated 3 qualified leads</div>
                          </div>
                          <div className="text-xs text-slate-400 border-l-2 border-yellow-500 pl-3">
                            <div className="text-yellow-400">12:34:30</div>
                            <div>Processing email campaign...</div>
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 rounded-lg p-3">
                          <div className="text-xs text-slate-400">CPU Usage</div>
                          <div className="text-lg font-bold text-cyan-400">23%</div>
                          <Progress value={23} className="h-1 mt-1" />
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                          <div className="text-xs text-slate-400">Memory</div>
                          <div className="text-lg font-bold text-cyan-400">156MB</div>
                          <Progress value={45} className="h-1 mt-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 py-8">
                      Select an AI agent to view details and programming options
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card className="bg-slate-800/30 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-400">User management interface will be implemented here</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Monitoring */}
          <TabsContent value="system">
            <Card className="bg-slate-800/30 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">System Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-400">System monitoring dashboard will be implemented here</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <Card className="bg-slate-800/30 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-400">Analytics dashboard will be implemented here</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}