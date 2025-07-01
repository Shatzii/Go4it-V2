import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Mail, 
  Phone, 
  MessageSquare,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Bot
} from "lucide-react";
import { PharaohIcon, SentinelIcon, NeuralIcon, QuantumIcon, ApolloIcon } from "@/components/icons/ai-agent-icons";

interface DemoActivity {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  result: string;
  impact: {
    revenue?: number;
    leads?: number;
    deals?: number;
  };
  status: 'success' | 'pending' | 'processing';
}

interface LiveMetrics {
  revenue: {
    current: number;
    target: number;
    growth: number;
  };
  leads: {
    generated: number;
    qualified: number;
    converted: number;
  };
  agents: {
    active: number;
    performance: number;
    efficiency: number;
  };
  sales: {
    pipeline: number;
    deals: number;
    conversion: number;
  };
}

export default function LiveDemoPanel({ isActive = false }: { isActive?: boolean }) {
  const [activities, setActivities] = useState<DemoActivity[]>([]);
  const [metrics, setMetrics] = useState<LiveMetrics | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);

  useEffect(() => {
    if (isActive) {
      startDemo();
    }
  }, [isActive]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        simulateAgentActivity();
        updateMetrics();
        setDemoProgress(prev => Math.min(prev + 2, 100));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const startDemo = () => {
    setIsRunning(true);
    setDemoProgress(0);
    setActivities([]);
    
    // Initialize demo metrics
    setMetrics({
      revenue: { current: 125000, target: 500000, growth: 12.5 },
      leads: { generated: 247, qualified: 89, converted: 23 },
      agents: { active: 5, performance: 94, efficiency: 87 },
      sales: { pipeline: 185000, deals: 12, conversion: 34.7 }
    });

    // Add initial activity
    addActivity({
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      agent: 'Pharaoh Marketing',
      action: 'Starting lead generation campaign',
      result: 'Campaign initialized successfully',
      impact: {},
      status: 'success'
    });
  };

  const stopDemo = () => {
    setIsRunning(false);
  };

  const resetDemo = () => {
    setIsRunning(false);
    setDemoProgress(0);
    setActivities([]);
    setMetrics(null);
  };

  const getAgentIcon = (agentName: string) => {
    if (agentName.includes('Pharaoh')) return <PharaohIcon className="h-4 w-4 text-cyan-400" />;
    if (agentName.includes('Sentinel')) return <SentinelIcon className="h-4 w-4 text-green-400" />;
    if (agentName.includes('Neural')) return <NeuralIcon className="h-4 w-4 text-purple-400" />;
    if (agentName.includes('Quantum')) return <QuantumIcon className="h-4 w-4 text-orange-400" />;
    if (agentName.includes('Apollo')) return <ApolloIcon className="h-4 w-4 text-red-400" />;
    return <Bot className="h-4 w-4 text-cyan-400" />;
  };

  const simulateAgentActivity = () => {
    const agentActions = [
      {
        agent: 'Pharaoh Marketing',
        actions: [
          { action: 'Generated 15 new leads from LinkedIn', result: 'High-quality prospects identified', impact: { leads: 15 } },
          { action: 'Created personalized email campaign', result: '89% open rate achieved', impact: { leads: 8 } },
          { action: 'Analyzed competitor strategies', result: 'Market opportunities discovered', impact: {} },
          { action: 'Optimized content for SEO', result: 'Traffic increased by 24%', impact: { leads: 12 } }
        ]
      },
      {
        agent: 'Sentinel Sales',
        actions: [
          { action: 'Contacted 12 qualified prospects', result: '8 meetings scheduled', impact: { deals: 8 } },
          { action: 'Closed deal with TechCorp Inc', result: '$45,000 contract signed', impact: { revenue: 45000, deals: 1 } },
          { action: 'Updated CRM with prospect data', result: 'Pipeline accuracy improved', impact: {} },
          { action: 'Generated proposal for MegaCorp', result: '$120,000 opportunity created', impact: { revenue: 120000 } }
        ]
      },
      {
        agent: 'Neural Support',
        actions: [
          { action: 'Resolved 23 customer tickets', result: '96% satisfaction score', impact: {} },
          { action: 'Updated knowledge base', result: 'Support efficiency +15%', impact: {} },
          { action: 'Identified upsell opportunity', result: '$15,000 expansion deal', impact: { revenue: 15000 } }
        ]
      },
      {
        agent: 'Quantum Analytics',
        actions: [
          { action: 'Analyzed customer behavior patterns', result: 'Conversion optimization identified', impact: {} },
          { action: 'Predicted high-value prospects', result: '87% accuracy achieved', impact: { leads: 6 } },
          { action: 'Generated performance report', result: 'ROI insights delivered', impact: {} }
        ]
      },
      {
        agent: 'Apollo Operations',
        actions: [
          { action: 'Optimized resource allocation', result: 'Efficiency increased 12%', impact: {} },
          { action: 'Automated workflow processes', result: 'Time savings: 4.5 hours/day', impact: {} },
          { action: 'Deployed system updates', result: 'Performance enhanced', impact: {} }
        ]
      }
    ];

    const randomAgent = agentActions[Math.floor(Math.random() * agentActions.length)];
    const randomAction = randomAgent.actions[Math.floor(Math.random() * randomAgent.actions.length)];

    const newActivity: DemoActivity = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      agent: randomAgent.agent,
      action: randomAction.action,
      result: randomAction.result,
      impact: randomAction.impact,
      status: Math.random() > 0.1 ? 'success' : 'processing'
    };

    addActivity(newActivity);
  };

  const updateMetrics = () => {
    setMetrics(prev => {
      if (!prev) return prev;
      
      return {
        revenue: {
          ...prev.revenue,
          current: prev.revenue.current + Math.floor(Math.random() * 5000),
          growth: prev.revenue.growth + (Math.random() - 0.5) * 2
        },
        leads: {
          generated: prev.leads.generated + Math.floor(Math.random() * 5),
          qualified: prev.leads.qualified + Math.floor(Math.random() * 3),
          converted: prev.leads.converted + Math.floor(Math.random() * 2)
        },
        agents: {
          ...prev.agents,
          performance: Math.min(99, prev.agents.performance + (Math.random() - 0.3)),
          efficiency: Math.min(99, prev.agents.efficiency + (Math.random() - 0.3))
        },
        sales: {
          pipeline: prev.sales.pipeline + Math.floor(Math.random() * 10000),
          deals: prev.sales.deals + Math.floor(Math.random() * 2),
          conversion: prev.sales.conversion + (Math.random() - 0.5) * 2
        }
      };
    });
  };

  const addActivity = (activity: DemoActivity) => {
    setActivities(prev => [activity, ...prev.slice(0, 19)]); // Keep last 20 activities
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-400" />;
      default: return <Bot className="h-4 w-4 text-cyan-400" />;
    }
  };

  const getImpactColor = (impact: any) => {
    if (impact.revenue) return 'text-emerald-400';
    if (impact.deals) return 'text-blue-400';
    if (impact.leads) return 'text-purple-400';
    return 'text-slate-400';
  };

  const formatImpact = (impact: any) => {
    if (impact.revenue) return `+$${impact.revenue.toLocaleString()}`;
    if (impact.deals) return `+${impact.deals} deals`;
    if (impact.leads) return `+${impact.leads} leads`;
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Demo Controls */}
      <Card className="bg-slate-900/80 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Live Enterprise Demo
            </div>
            <div className="flex gap-2">
              <Button
                onClick={startDemo}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
              <Button
                onClick={stopDemo}
                disabled={!isRunning}
                variant="outline"
                className="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
                size="sm"
              >
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
              <Button
                onClick={resetDemo}
                variant="outline"
                className="border-slate-500/20 text-slate-400 hover:bg-slate-500/10"
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Demo Progress</span>
                <span className="text-cyan-400">{demoProgress}%</span>
              </div>
              <Progress value={demoProgress} className="h-2" />
            </div>
            
            {isRunning && (
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">AI agents are actively working...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Live Metrics Dashboard */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900/80 border-emerald-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Revenue</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    ${metrics.revenue.current.toLocaleString()}
                  </p>
                  <p className="text-xs text-emerald-400">
                    +{metrics.revenue.growth.toFixed(1)}% growth
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Leads Generated</p>
                  <p className="text-2xl font-bold text-purple-400">{metrics.leads.generated}</p>
                  <p className="text-xs text-purple-400">
                    {metrics.leads.qualified} qualified
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Deals</p>
                  <p className="text-2xl font-bold text-blue-400">{metrics.sales.deals}</p>
                  <p className="text-xs text-blue-400">
                    ${metrics.sales.pipeline.toLocaleString()} pipeline
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-cyan-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">AI Performance</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {metrics.agents.performance.toFixed(1)}%
                  </p>
                  <p className="text-xs text-cyan-400">
                    {metrics.agents.efficiency.toFixed(1)}% efficiency
                  </p>
                </div>
                <Zap className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Live Activity Feed */}
      <Card className="bg-slate-900/80 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Live Agent Activities
            {isRunning && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/20 animate-pulse">
                LIVE
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {activities.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start the demo to see AI agents in action</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getAgentIcon(activity.agent)}
                        <span className="text-cyan-400 font-medium text-sm">
                          {activity.agent}
                        </span>
                        <span className="text-slate-500 text-xs">
                          {activity.timestamp}
                        </span>
                      </div>
                      {formatImpact(activity.impact) && (
                        <Badge
                          variant="outline"
                          className={`${getImpactColor(activity.impact)} border-current`}
                        >
                          {formatImpact(activity.impact)}
                        </Badge>
                      )}
                    </div>
                    <div className="text-slate-300 text-sm mb-1">
                      {activity.action}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {activity.result}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}