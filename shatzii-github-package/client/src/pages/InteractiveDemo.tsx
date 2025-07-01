import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Brain, 
  Users, 
  TrendingUp, 
  Target,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Activity,
  DollarSign,
  Mail,
  Phone,
  MessageSquare,
  BarChart3,
  Zap,
  Eye,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Clock
} from 'lucide-react';

interface SimulationMetrics {
  leadsGenerated: number;
  campaignsActive: number;
  dealsInProgress: number;
  conversionRate: number;
  revenue: number;
  activities: number;
}

interface LiveActivity {
  id: string;
  type: 'lead' | 'campaign' | 'deal' | 'activity';
  description: string;
  timestamp: Date;
  impact: 'positive' | 'neutral' | 'negative';
}

export default function InteractiveDemo() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    leadsGenerated: 847,
    campaignsActive: 12,
    dealsInProgress: 34,
    conversionRate: 23.4,
    revenue: 425000,
    activities: 156
  });
  const [activities, setActivities] = useState<LiveActivity[]>([]);
  const [simulationSpeed, setSimulationSpeed] = useState(1);

  const generateActivity = (): LiveActivity => {
    const activityTypes = [
      { type: 'lead' as const, descriptions: [
        'New qualified lead from Oracle Corporation',
        'High-value prospect identified in healthcare sector',
        'Enterprise lead generated via LinkedIn outreach',
        'Inbound lead from Microsoft Azure division'
      ]},
      { type: 'campaign' as const, descriptions: [
        'Email campaign achieved 34% open rate',
        'LinkedIn campaign generated 12 new connections',
        'Content marketing piece gained 2.3K views',
        'Automated follow-up sequence initiated'
      ]},
      { type: 'deal' as const, descriptions: [
        'Deal moved to negotiation stage - $85K value',
        'Proposal sent to TechFlow Solutions',
        'Contract signed with DataCorp - $120K',
        'Demo scheduled for Innovation Labs'
      ]},
      { type: 'activity' as const, descriptions: [
        'AI agent scheduled 5 discovery calls',
        'Automated competitor analysis completed',
        'Price optimization algorithm updated',
        'Customer sentiment analysis processed'
      ]}
    ];

    const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const randomDesc = randomType.descriptions[Math.floor(Math.random() * randomType.descriptions.length)];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      type: randomType.type,
      description: randomDesc,
      timestamp: new Date(),
      impact: Math.random() > 0.8 ? 'negative' : (Math.random() > 0.3 ? 'positive' : 'neutral')
    };
  };

  const updateMetrics = () => {
    setMetrics(prev => ({
      leadsGenerated: prev.leadsGenerated + Math.floor(Math.random() * 3),
      campaignsActive: Math.max(8, prev.campaignsActive + (Math.random() > 0.7 ? 1 : 0)),
      dealsInProgress: Math.max(20, prev.dealsInProgress + (Math.random() > 0.8 ? 1 : -1)),
      conversionRate: Math.max(15, Math.min(35, prev.conversionRate + (Math.random() - 0.5) * 2)),
      revenue: prev.revenue + Math.floor(Math.random() * 15000),
      activities: prev.activities + Math.floor(Math.random() * 5) + 1
    }));
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        const newActivity = generateActivity();
        setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
        updateMetrics();
      }, 2000 / simulationSpeed);

      return () => clearInterval(interval);
    }
  }, [isRunning, simulationSpeed]);

  const startSimulation = () => {
    setIsRunning(true);
    toast({
      title: "AI Simulation Started",
      description: "Watch real-time business automation in action",
    });
  };

  const stopSimulation = () => {
    setIsRunning(false);
    toast({
      title: "Simulation Paused",
      description: "AI engines are on standby",
    });
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setMetrics({
      leadsGenerated: 847,
      campaignsActive: 12,
      dealsInProgress: 34,
      conversionRate: 23.4,
      revenue: 425000,
      activities: 156
    });
    setActivities([]);
    toast({
      title: "Simulation Reset",
      description: "All metrics returned to baseline",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <Eye className="w-4 h-4 mr-2" />
            Live AI Business Simulation
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Watch AI Engines in Action
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            Experience how our autonomous AI agents generate leads, manage campaigns, and close deals in real-time. 
            This interactive demo shows actual AI business automation processes.
          </p>

          {/* Control Panel */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex gap-3">
              {!isRunning ? (
                <Button 
                  onClick={startSimulation}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start AI Simulation
                </Button>
              ) : (
                <Button 
                  onClick={stopSimulation}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Simulation
                </Button>
              )}
              <Button variant="outline" onClick={resetSimulation} className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Speed:</span>
              <div className="flex gap-1">
                {[0.5, 1, 2, 3].map(speed => (
                  <Button
                    key={speed}
                    size="sm"
                    variant={simulationSpeed === speed ? "default" : "outline"}
                    onClick={() => setSimulationSpeed(speed)}
                    className={simulationSpeed === speed ? "bg-blue-600" : "border-gray-600 text-gray-300"}
                  >
                    {speed}x
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Leads Generated</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{metrics.leadsGenerated.toLocaleString()}</div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <ArrowUp className="h-3 w-3 text-emerald-400 mr-1" />
                +{Math.floor(Math.random() * 5) + 1} in last hour
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Campaigns</CardTitle>
              <Target className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{metrics.campaignsActive}</div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Activity className="h-3 w-3 text-purple-400 mr-1" />
                Running autonomously
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Deals in Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{metrics.dealsInProgress}</div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <DollarSign className="h-3 w-3 text-emerald-400 mr-1" />
                Avg. ${Math.floor(metrics.revenue / metrics.dealsInProgress).toLocaleString()} value
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{metrics.conversionRate.toFixed(1)}%</div>
              <Progress value={metrics.conversionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Revenue Generated</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">${metrics.revenue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <ArrowUp className="h-3 w-3 text-emerald-400 mr-1" />
                +{((metrics.revenue / 425000 - 1) * 100).toFixed(1)}% growth
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">AI Activities</CardTitle>
              <Bot className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-400">{metrics.activities}</div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Zap className="h-3 w-3 text-cyan-400 mr-1" />
                Automated processes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-400" />
                    Live AI Activity Feed
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={isRunning ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`} />
                    {isRunning ? 'Live' : 'Paused'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Real-time stream of AI agent activities and business events
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[480px] overflow-y-auto px-6 pb-6">
                  {activities.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Start the simulation to see live AI activities</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activities.map((activity) => (
                        <div
                          key={activity.id}
                          className={`p-4 rounded-lg border-l-4 ${
                            activity.impact === 'positive' 
                              ? 'border-emerald-400 bg-emerald-500/10' 
                              : activity.impact === 'negative'
                              ? 'border-red-400 bg-red-500/10'
                              : 'border-blue-400 bg-blue-500/10'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {activity.type === 'lead' && <Users className="h-4 w-4 text-blue-400" />}
                              {activity.type === 'campaign' && <Target className="h-4 w-4 text-purple-400" />}
                              {activity.type === 'deal' && <TrendingUp className="h-4 w-4 text-emerald-400" />}
                              {activity.type === 'activity' && <Bot className="h-4 w-4 text-cyan-400" />}
                              <div>
                                <p className="text-sm text-white font-medium">{activity.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${
                                      activity.type === 'lead' ? 'bg-blue-500/20 text-blue-400' :
                                      activity.type === 'campaign' ? 'bg-purple-500/20 text-purple-400' :
                                      activity.type === 'deal' ? 'bg-emerald-500/20 text-emerald-400' :
                                      'bg-cyan-500/20 text-cyan-400'
                                    }`}
                                  >
                                    {activity.type}
                                  </Badge>
                                  <span className="text-xs text-gray-400">
                                    {activity.timestamp.toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {activity.impact === 'positive' && <ArrowUp className="h-4 w-4 text-emerald-400" />}
                            {activity.impact === 'negative' && <ArrowDown className="h-4 w-4 text-red-400" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Agent Status */}
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Agent Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Marketing AI</p>
                    <p className="text-xs text-gray-400">Lead generation & campaigns</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Sales AI</p>
                    <p className="text-xs text-gray-400">Deal management & closing</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Analytics AI</p>
                    <p className="text-xs text-gray-400">Performance optimization</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Communication AI</p>
                    <p className="text-xs text-gray-400">Email & messaging automation</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-400" />
                  Simulation Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">AI Aggression Level</label>
                  <Progress value={75} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Conservative</span>
                    <span>Aggressive</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Industries</label>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Technology</Badge>
                    <Badge variant="secondary" className="text-xs">Healthcare</Badge>
                    <Badge variant="secondary" className="text-xs">Finance</Badge>
                    <Badge variant="secondary" className="text-xs">Manufacturing</Badge>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Campaign Types</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Email Campaigns</span>
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">LinkedIn Outreach</span>
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Cold Calling</span>
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Content Marketing</span>
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
              <CardContent className="p-6 text-center">
                <Bot className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">Deploy Your AI Engines</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Ready to implement this level of automation in your business?
                </p>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Schedule Demo Call
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}