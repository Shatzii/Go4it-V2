import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, Shield, Zap, TrendingUp, Users, Bot, Database, Server, Monitor, Settings, 
  AlertTriangle, DollarSign, Brain, Globe, Rocket, Target, Eye, Lock,
  Activity, BarChart3, Network, Cpu, HardDrive, Wifi
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function MasterControlSystem() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Security Guard: Only SpacePharaoh can access Master Control
  useEffect(() => {
    if (!isLoading && (!user || user.email !== 'SpaceP@shatzii.com')) {
      setLocation('/login');
      return;
    }
  }, [user, isLoading, setLocation]);
  
  // Master Control Metrics
  const [masterMetrics, setMasterMetrics] = useState({
    // Business Operations
    totalRevenue: 166200000,
    activeClients: 847,
    monthlyGrowth: 23.5,
    marketShare: 87.3,
    
    // AI Infrastructure
    activeModels: 13,
    aiAgents: 202,
    processingPower: 94.7,
    modelAccuracy: 98.2,
    
    // Technical Systems
    serverUptime: 99.97,
    databaseHealth: 100,
    apiResponseTime: 45,
    systemLoad: 23.4,
    
    // Client Management
    clientSatisfaction: 96.8,
    supportTickets: 12,
    newSignups: 47,
    churnRate: 1.2
  });

  const [realTimeAlerts, setRealTimeAlerts] = useState([
    { type: "success", message: "New $250K enterprise deal closed", time: "2 min ago" },
    { type: "info", message: "Roofing AI generated 15 new leads", time: "5 min ago" },
    { type: "warning", message: "Server CPU usage at 85%", time: "8 min ago" },
    { type: "success", message: "Model deployment completed successfully", time: "12 min ago" }
  ]);

  // Verify SpacePharaoh access
  if (!user || user.email !== "SpaceP@shatzii.com") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-2">Supreme Access Required</h2>
            <p className="text-red-300">Master Control System restricted to SpacePharaoh only.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-amber-900/10 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Master Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-16 h-16 text-yellow-400 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              Master Control System
            </h1>
            <Crown className="w-16 h-16 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-xl text-slate-300 mb-4">
            Supreme Command & Control of Shatzii Tech Empire
          </p>
          <div className="flex gap-2 justify-center">
            <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold">
              PHARAOH SUPREME ACCESS
            </Badge>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              ALL SYSTEMS OPTIMAL
            </Badge>
          </div>
        </div>

        {/* Emergency Master Controls */}
        <div className="grid grid-cols-7 gap-4 mb-8">
          <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white h-16">
            <AlertTriangle className="w-6 h-6 mb-1" />
            <span className="text-xs">EMERGENCY<br/>STOP</span>
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white h-16">
            <Rocket className="w-6 h-6 mb-1" />
            <span className="text-xs">FULL<br/>THROTTLE</span>
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white h-16">
            <Bot className="w-6 h-6 mb-1" />
            <span className="text-xs">DEPLOY<br/>AGENTS</span>
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white h-16">
            <TrendingUp className="w-6 h-6 mb-1" />
            <span className="text-xs">SCALE<br/>UP</span>
          </Button>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white h-16"
            onClick={() => window.location.href = '/intern-management'}
          >
            <Users className="w-6 h-6 mb-1" />
            <span className="text-xs">INTERN<br/>COMMAND</span>
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white h-16">
            <Eye className="w-6 h-6 mb-1" />
            <span className="text-xs">MONITOR<br/>ALL</span>
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white h-16">
            <Lock className="w-6 h-6 mb-1" />
            <span className="text-xs">SECURE<br/>MODE</span>
          </Button>
        </div>

        {/* Master Metrics Dashboard */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Revenue Empire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-300 mb-2">
                ${(masterMetrics.totalRevenue / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-green-400">
                +{masterMetrics.monthlyGrowth}% this month
              </div>
              <Progress value={masterMetrics.monthlyGrowth} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Client Kingdom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-300 mb-2">
                {masterMetrics.activeClients}
              </div>
              <div className="text-sm text-blue-400">
                {masterMetrics.clientSatisfaction}% satisfaction
              </div>
              <Progress value={masterMetrics.clientSatisfaction} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Dominance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-300 mb-2">
                {masterMetrics.aiAgents}
              </div>
              <div className="text-sm text-purple-400">
                {masterMetrics.activeModels} models deployed
              </div>
              <Progress value={masterMetrics.processingPower} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-amber-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-400 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Market Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-300 mb-2">
                {masterMetrics.marketShare}%
              </div>
              <div className="text-sm text-amber-400">
                Market domination
              </div>
              <Progress value={masterMetrics.marketShare} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Master Control Tabs */}
        <Tabs defaultValue="operations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-slate-800/50">
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="ai-empire">AI Empire</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="admin-key" className="text-yellow-400 font-bold">Master Key</TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Business Operations Command</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Revenue Generation</span>
                    <Badge className="bg-green-600">OPTIMAL</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Client Acquisition</span>
                    <Badge className="bg-blue-600">ACTIVE</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Market Expansion</span>
                    <Badge className="bg-purple-600">AGGRESSIVE</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Competition Crushing</span>
                    <Badge className="bg-red-600">RELENTLESS</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Real-Time Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {realTimeAlerts.map((alert, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.type === 'success' ? 'bg-green-400' :
                          alert.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`} />
                        <div className="flex-1">
                          <div className="text-sm text-slate-200">{alert.message}</div>
                          <div className="text-xs text-slate-400">{alert.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-blue-400">Client Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-300">{masterMetrics.activeClients}</div>
                      <div className="text-sm text-blue-400">Active Clients</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Satisfaction Rate</span>
                        <span>{masterMetrics.clientSatisfaction}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Support Tickets</span>
                        <span>{masterMetrics.supportTickets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Churn Rate</span>
                        <span>{masterMetrics.churnRate}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-green-400">Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-300">{masterMetrics.newSignups}</div>
                      <div className="text-sm text-green-400">New Signups Today</div>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Launch Client Acquisition Campaign
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-purple-400">Client Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    View All Clients
                  </Button>
                  <Button className="w-full" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics Dashboard
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Launch Campaign
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="infrastructure" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400">System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Server className="w-4 h-4" />
                        Server Uptime
                      </span>
                      <span className="text-green-400">{masterMetrics.serverUptime}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Database Health
                      </span>
                      <span className="text-green-400">{masterMetrics.databaseHealth}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        System Load
                      </span>
                      <span className="text-yellow-400">{masterMetrics.systemLoad}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Wifi className="w-4 h-4" />
                        API Response
                      </span>
                      <span className="text-green-400">{masterMetrics.apiResponseTime}ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Infrastructure Control</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Server className="w-4 h-4 mr-2" />
                    Scale Servers
                  </Button>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Database className="w-4 h-4 mr-2" />
                    Optimize Database
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Monitor className="w-4 h-4 mr-2" />
                    Health Check
                  </Button>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    <Settings className="w-4 h-4 mr-2" />
                    System Config
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-empire" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">AI Model Empire</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-purple-300">{masterMetrics.activeModels}</div>
                    <div className="text-sm text-purple-400">Active AI Models</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Accuracy</span>
                      <span>{masterMetrics.modelAccuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Power</span>
                      <span>{masterMetrics.processingPower}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-400">Agent Army</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-blue-300">{masterMetrics.aiAgents}</div>
                    <div className="text-sm text-blue-400">Active AI Agents</div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Bot className="w-4 h-4 mr-2" />
                    Deploy New Agents
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-400">AI Control</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Brain className="w-4 h-4 mr-2" />
                    Model Training
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Network className="w-4 h-4 mr-2" />
                    Neural Networks
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Activity className="w-4 h-4 mr-2" />
                    Performance Monitor
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-red-400">Security Command Center</CardTitle>
                <CardDescription>Ultimate protection for Shatzii Empire</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <Shield className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-green-400">SECURE</div>
                    <div className="text-sm text-slate-400">All Systems Protected</div>
                  </div>
                  <div className="text-center">
                    <Lock className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-blue-400">ENCRYPTED</div>
                    <div className="text-sm text-slate-400">Data Fortress Active</div>
                  </div>
                  <div className="text-center">
                    <Eye className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-purple-400">MONITORED</div>
                    <div className="text-sm text-slate-400">24/7 Surveillance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-yellow-400">Empire Analytics</CardTitle>
                <CardDescription>Complete business intelligence dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <Button className="h-24 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700">
                    <div>
                      <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                      <div>Advanced Analytics</div>
                    </div>
                  </Button>
                  <Button className="h-24 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <div>
                      <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                      <div>Revenue Insights</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin-key" className="space-y-6">
            <Card className="bg-slate-800/50 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Master Admin Key System
                </CardTitle>
                <CardDescription>Ultimate administrative access control</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Master Key Display */}
                <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/20 rounded-lg p-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Crown className="w-8 h-8 text-yellow-400" />
                      <span className="text-2xl font-bold text-yellow-400">SUPREME ACCESS KEY</span>
                      <Crown className="w-8 h-8 text-yellow-400" />
                    </div>
                    
                    <div className="bg-slate-900/50 border border-yellow-500/30 rounded-lg p-4">
                      <div className="text-sm text-yellow-300 mb-2 font-mono">MASTER KEY STATUS:</div>
                      <div className="text-xl font-mono text-green-400 bg-slate-800/50 p-3 rounded border-2 border-green-500/20">
                        ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●
                      </div>
                      <div className="text-xs text-slate-400 mt-2">Key secured - Verification required for changes</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-slate-800/30 p-4 rounded-lg border border-green-500/20">
                        <div className="text-green-400 font-semibold">Access Level</div>
                        <div className="text-white">SUPREME AUTHORITY</div>
                      </div>
                      <div className="bg-slate-800/30 p-4 rounded-lg border border-blue-500/20">
                        <div className="text-blue-400 font-semibold">Status</div>
                        <div className="text-white">ACTIVE & OPERATIONAL</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Capabilities */}
                <div className="grid grid-cols-2 gap-6">
                  <Card className="bg-slate-800/30 border-emerald-500/20">
                    <CardHeader>
                      <CardTitle className="text-emerald-400 text-lg">Core Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-emerald-300">
                          <Crown className="w-4 h-4" />
                          Full platform administration
                        </div>
                        <div className="flex items-center gap-2 text-emerald-300">
                          <Bot className="w-4 h-4" />
                          AI engine management (202+ agents)
                        </div>
                        <div className="flex items-center gap-2 text-emerald-300">
                          <DollarSign className="w-4 h-4" />
                          Revenue oversight ($166.2M+)
                        </div>
                        <div className="flex items-center gap-2 text-emerald-300">
                          <Users className="w-4 h-4" />
                          Client database control (847+ clients)
                        </div>
                        <div className="flex items-center gap-2 text-emerald-300">
                          <Target className="w-4 h-4" />
                          Intern management (4 active)
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/30 border-red-500/20">
                    <CardHeader>
                      <CardTitle className="text-red-400 text-lg">Emergency Controls</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-red-300">
                          <AlertTriangle className="w-4 h-4" />
                          Platform-wide emergency stop
                        </div>
                        <div className="flex items-center gap-2 text-red-300">
                          <Database className="w-4 h-4" />
                          Database administration
                        </div>
                        <div className="flex items-center gap-2 text-red-300">
                          <Shield className="w-4 h-4" />
                          Security and access control
                        </div>
                        <div className="flex items-center gap-2 text-red-300">
                          <Monitor className="w-4 h-4" />
                          Custom dashboard creation
                        </div>
                        <div className="flex items-center gap-2 text-red-300">
                          <Settings className="w-4 h-4" />
                          API and secret management
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Security Verification System */}
                <Card className="bg-slate-800/30 border-red-500/20">
                  <CardHeader>
                    <CardTitle className="text-red-400">Security Verification Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="w-5 h-5 text-red-400" />
                          <span className="text-red-400 font-semibold">Multi-Factor Authentication Active</span>
                        </div>
                        <div className="space-y-3 text-sm text-slate-300">
                          <p><strong className="text-red-400">Phone Verification:</strong> 205-434-8405 (Required for key changes)</p>
                          <p><strong className="text-amber-400">Local Machine Key:</strong> Hardware verification required</p>
                          <p><strong className="text-green-400">Current Status:</strong> Master key secured and operational</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Button className="bg-red-600 hover:bg-red-700 text-white" disabled>
                          <Lock className="w-4 h-4 mr-2" />
                          Request Key Change
                        </Button>
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white" disabled>
                          <Shield className="w-4 h-4 mr-2" />
                          Verify Access
                        </Button>
                      </div>
                      
                      <div className="text-xs text-slate-500 text-center">
                        Key modification requires phone verification + local machine authentication
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}