import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Target, TrendingUp, Users, DollarSign } from "lucide-react";

interface AIAgentStatus {
  id: string;
  name: string;
  type: 'marketing' | 'sales' | 'education' | 'operations';
  status: 'active' | 'processing' | 'idle';
  tasksCompleted: number;
  successRate: number;
  revenue: number;
  lastActivity: string;
}

export default function LiveAIStatus() {
  const { data: agents, isLoading } = useQuery<AIAgentStatus[]>({
    queryKey: ['/api/ai/agents/status'],
    refetchInterval: 5000, // Update every 5 seconds
  });

  const { data: metrics } = useQuery({
    queryKey: ['/api/ai/metrics/live'],
    refetchInterval: 3000,
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-100">AI Agents Working Live</h2>
            <div className="animate-pulse mt-4">
              <div className="h-4 bg-slate-700 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const activeAgents = agents?.filter(agent => agent.status === 'active') || [];
  const totalRevenue = agents?.reduce((sum, agent) => sum + agent.revenue, 0) || 0;
  const totalTasks = agents?.reduce((sum, agent) => sum + agent.tasksCompleted, 0) || 0;

  return (
    <section className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">
            AI Agents Working Live
          </h2>
          <p className="text-slate-400 text-lg">
            Watch our autonomous AI workforce generate revenue in real-time
          </p>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-900/50 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Agents</p>
                  <p className="text-2xl font-bold text-green-400">{activeAgents.length}</p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-cyan-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Tasks Completed</p>
                  <p className="text-2xl font-bold text-cyan-400">{totalTasks.toLocaleString()}</p>
                </div>
                <Target className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Revenue Generated</p>
                  <p className="text-2xl font-bold text-purple-400">${totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Success Rate</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {agents ? Math.round(agents.reduce((sum, agent) => sum + agent.successRate, 0) / agents.length) : 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents?.map((agent) => (
            <Card key={agent.id} className="bg-slate-900/50 border-slate-700/50 hover:border-cyan-500/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-100 text-lg">{agent.name}</CardTitle>
                  <Badge 
                    variant={agent.status === 'active' ? 'default' : 'secondary'}
                    className={
                      agent.status === 'active' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : agent.status === 'processing'
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                    }
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      agent.status === 'active' ? 'bg-green-400 animate-pulse' : 
                      agent.status === 'processing' ? 'bg-yellow-400 animate-spin' : 'bg-slate-400'
                    }`}></div>
                    {agent.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-slate-300 capitalize">{agent.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tasks:</span>
                    <span className="text-cyan-400 font-medium">{agent.tasksCompleted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Success Rate:</span>
                    <span className="text-green-400 font-medium">{agent.successRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Revenue:</span>
                    <span className="text-purple-400 font-medium">${agent.revenue.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700">
                    <p className="text-xs text-slate-500">Last activity: {agent.lastActivity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}