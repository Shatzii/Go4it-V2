import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Shield, Zap, TrendingUp, Users, Bot, Database, Server, Monitor, Settings, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function SpacePharaohCommand() {
  const { user } = useAuth();
  const [systemMetrics, setSystemMetrics] = useState({
    activeAgents: 202,
    totalRevenue: 166200000,
    activeCampaigns: 47,
    databaseConnections: 12,
    cpuUsage: 34,
    memoryUsage: 67,
    networkTraffic: 2.3,
    uptime: "99.97%",
    activeClients: 847,
    deployedModels: 13,
    apiCalls: 245000,
    serverHealth: "Excellent"
  });

  const [masterControls, setMasterControls] = useState({
    aiEnginesStatus: "All Online",
    clientManagement: "Active",
    revenueGeneration: "Optimized",
    marketDomination: "87%",
    competitiveAdvantage: "Unprecedented"
  });

  // Verify SpacePharaoh access
  if (!user || user.email !== "SpaceP@shatzii.com") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="bg-red-900/20 border-red-500/50">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h2>
            <p className="text-red-300">This command center is restricted to SpacePharaoh only.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const agentCategories = [
    {
      name: "Marketing Agents",
      count: 67,
      status: "Active",
      revenue: "$45.2M",
      agents: [
        "Lead Generation Engine", "Content Creation AI", "Social Media Automation", 
        "Email Campaign Manager", "SEO Optimization Bot", "Ad Campaign Optimizer"
      ]
    },
    {
      name: "Sales Agents",
      count: 43,
      status: "Active", 
      revenue: "$78.5M",
      agents: [
        "Prospect Qualifier", "Demo Scheduler", "Negotiation AI", 
        "Contract Generator", "Follow-up Automation", "Deal Closer"
      ]
    },
    {
      name: "Roofing AI Agents",
      count: 35,
      status: "Active",
      revenue: "$20.8M", 
      agents: [
        "Weather Alert System", "Lead Detection AI", "Estimation Engine",
        "Project Manager", "Insurance Claim Bot", "Quality Inspector"
      ]
    },
    {
      name: "TruckFlow Agents",
      count: 28,
      status: "Active",
      revenue: "$15.4M",
      agents: [
        "Route Optimizer", "Load Matcher", "Fuel Efficiency AI",
        "Safety Monitor", "Dispatch Coordinator", "Driver Assistant"
      ]
    },
    {
      name: "Education Agents", 
      count: 19,
      status: "Active",
      revenue: "$4.8M",
      agents: [
        "AI Math Tutor", "Reading Comprehension AI", "Progress Tracker",
        "Parent Communication Bot", "Curriculum Optimizer", "Assessment AI"
      ]
    },
    {
      name: "Financial Agents",
      count: 10,
      status: "Development",
      revenue: "$1.5M",
      agents: [
        "Risk Assessment AI", "Portfolio Optimizer", "Compliance Monitor",
        "Market Analyzer", "Trading Assistant", "Report Generator"
      ]
    }
  ];

  const systemAlerts = [
    { type: "info", message: "Roofing AI generated 157 high-priority leads in last hour", time: "2 min ago" },
    { type: "success", message: "TruckFlow AI achieved $875+ daily earnings for 23 drivers", time: "5 min ago" },
    { type: "warning", message: "Marketing campaign #47 approaching budget limit", time: "12 min ago" },
    { type: "info", message: "New enterprise prospect detected: Fortune 500 construction company", time: "18 min ago" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900/20 via-slate-900 to-purple-900/20">
      {/* Header */}
      <div className="border-b border-amber-500/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Crown className="w-8 h-8 text-amber-400" />
              <div>
                <h1 className="text-2xl font-bold text-amber-400">SpacePharaoh Command Center</h1>
                <p className="text-amber-200/70">Supreme AI Empire Control</p>
              </div>
            </div>
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
              Emperor Access Level
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-400 text-sm font-medium">Active Agents</p>
                  <p className="text-3xl font-bold text-white">{systemMetrics.activeAgents}</p>
                </div>
                <Bot className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-white">${(systemMetrics.totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-400 text-sm font-medium">System Uptime</p>
                  <p className="text-3xl font-bold text-white">{systemMetrics.uptime}</p>
                </div>
                <Server className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Active Campaigns</p>
                  <p className="text-3xl font-bold text-white">{systemMetrics.activeCampaigns}</p>
                </div>
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-amber-500/30">
            <TabsTrigger value="agents" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              AI Agent Army
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              System Control
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              Empire Analytics
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              Intelligence Feed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {agentCategories.map((category, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-600 hover:border-amber-500/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-amber-400">{category.name}</CardTitle>
                      <Badge className={`${category.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {category.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-300">
                      {category.count} Active Agents • Revenue: {category.revenue}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.agents.map((agent, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{agent}</span>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/50">
                      Manage Category
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-amber-400 flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    System Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">CPU Usage</span>
                      <span className="text-cyan-400">{systemMetrics.cpuUsage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-cyan-400 h-2 rounded-full" style={{ width: `${systemMetrics.cpuUsage}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Memory Usage</span>
                      <span className="text-amber-400">{systemMetrics.memoryUsage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${systemMetrics.memoryUsage}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">Network Traffic</span>
                      <span className="text-green-400">{systemMetrics.networkTraffic} GB/s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-amber-400 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Active Connections</span>
                    <Badge className="bg-green-500/20 text-green-400">{systemMetrics.databaseConnections}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Query Performance</span>
                    <Badge className="bg-green-500/20 text-green-400">Optimal</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Backup Status</span>
                    <Badge className="bg-green-500/20 text-green-400">Current</Badge>
                  </div>
                  <Button className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/50">
                    Database Controls
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-green-400">Revenue Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-300">This Month</span>
                      <span className="text-green-400 font-bold">$13.8M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Growth Rate</span>
                      <span className="text-green-400 font-bold">+47%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Projected Annual</span>
                      <span className="text-green-400 font-bold">$166.2M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-purple-400">Agent Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Success Rate</span>
                      <span className="text-purple-400 font-bold">94.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Response Time</span>
                      <span className="text-purple-400 font-bold">0.3s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Accuracy</span>
                      <span className="text-purple-400 font-bold">97.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Market Dominance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Roofing Market</span>
                      <span className="text-cyan-400 font-bold">23.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Trucking AI</span>
                      <span className="text-cyan-400 font-bold">18.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Education Tech</span>
                      <span className="text-cyan-400 font-bold">15.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Real-Time Intelligence Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/50">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === 'success' ? 'bg-green-400' :
                        alert.type === 'warning' ? 'bg-yellow-400' :
                        'bg-cyan-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-slate-200">{alert.message}</p>
                        <p className="text-slate-400 text-sm">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}