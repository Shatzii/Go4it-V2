import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Target, Users, DollarSign, Mail, Phone, Calendar, Zap, Brain, Eye, MessageSquare } from "lucide-react";
import { ProfessionalBrain, ProfessionalChart, ProfessionalUsers, ProfessionalShield } from "@/components/ui/professional-icons";

interface MarketingAgent {
  id: string;
  name: string;
  type: "lead-generation" | "content-creation" | "campaign-management" | "sales-automation" | "social-media" | "analytics";
  status: "active" | "processing" | "idle";
  performance: {
    leadsGenerated?: number;
    conversionRate?: number;
    contentCreated?: number;
    campaignsManaged?: number;
    revenue?: number;
  };
  currentTask: string;
  efficiency: number;
}

interface Lead {
  id: string;
  company: string;
  contact: string;
  industry: string;
  score: number;
  status: "new" | "contacted" | "qualified" | "converted";
  value: number;
  source: string;
  lastActivity: string;
}

interface Campaign {
  id: string;
  name: string;
  type: "email" | "social" | "content" | "webinar" | "cold-outreach";
  status: "running" | "scheduled" | "completed" | "paused";
  reach: number;
  engagement: number;
  conversions: number;
  roi: number;
  budget: number;
}

export default function AutonomousMarketing() {
  const [marketingAgents, setMarketingAgents] = useState<MarketingAgent[]>([
    {
      id: "lead-hunter",
      name: "LeadHunter Pro",
      type: "lead-generation",
      status: "active",
      performance: { leadsGenerated: 1247, conversionRate: 23.4 },
      currentTask: "Scanning LinkedIn for AI decision makers in Fortune 500",
      efficiency: 94
    },
    {
      id: "content-creator",
      name: "ContentGenius AI",
      type: "content-creation",
      status: "processing",
      performance: { contentCreated: 89 },
      currentTask: "Creating personalized demo videos for enterprise prospects",
      efficiency: 87
    },
    {
      id: "campaign-master",
      name: "CampaignMaster",
      type: "campaign-management",
      status: "active",
      performance: { campaignsManaged: 23, revenue: 450000 },
      currentTask: "Optimizing email sequences for cybersecurity sector",
      efficiency: 91
    },
    {
      id: "sales-automator",
      name: "SalesBot Elite",
      type: "sales-automation",
      status: "active",
      performance: { conversionRate: 31.2, revenue: 890000 },
      currentTask: "Following up with 47 qualified leads via personalized outreach",
      efficiency: 96
    },
    {
      id: "social-master",
      name: "SocialSync Pro",
      type: "social-media",
      status: "processing",
      performance: { reach: 2400000, engagement: 8.7 },
      currentTask: "Publishing thought leadership content across 12 platforms",
      efficiency: 89
    },
    {
      id: "analytics-brain",
      name: "InsightEngine",
      type: "analytics",
      status: "active",
      performance: { campaignsManaged: 15, conversionRate: 28.1 },
      currentTask: "Analyzing competitor pricing strategies and market positioning",
      efficiency: 98
    }
  ]);

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "lead-001",
      company: "TechCorp Industries",
      contact: "Sarah Chen, CTO",
      industry: "Enterprise Software",
      score: 95,
      status: "qualified",
      value: 250000,
      source: "LinkedIn Automation",
      lastActivity: "2 hours ago"
    },
    {
      id: "lead-002",
      company: "Global Manufacturing Ltd",
      contact: "Mike Rodriguez, VP IT",
      industry: "Manufacturing",
      score: 87,
      status: "contacted",
      value: 180000,
      source: "Cold Email Campaign",
      lastActivity: "5 hours ago"
    },
    {
      id: "lead-003",
      company: "FinanceFirst Bank",
      contact: "Alex Thompson, CISO",
      industry: "Financial Services",
      score: 92,
      status: "new",
      value: 320000,
      source: "Website Form",
      lastActivity: "1 hour ago"
    },
    {
      id: "lead-004",
      company: "HealthTech Solutions",
      contact: "Dr. Emma Wilson, CEO",
      industry: "Healthcare",
      score: 89,
      status: "contacted",
      value: 150000,
      source: "Webinar Registration",
      lastActivity: "3 hours ago"
    }
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "camp-001",
      name: "Enterprise AI Transformation Series",
      type: "email",
      status: "running",
      reach: 15420,
      engagement: 34.2,
      conversions: 187,
      roi: 340,
      budget: 25000
    },
    {
      id: "camp-002",
      name: "Cybersecurity Thought Leadership",
      type: "content",
      status: "running",
      reach: 89500,
      engagement: 12.7,
      conversions: 234,
      roi: 280,
      budget: 18000
    },
    {
      id: "camp-003",
      name: "Fortune 500 Direct Outreach",
      type: "cold-outreach",
      status: "running",
      reach: 2340,
      engagement: 28.9,
      conversions: 45,
      roi: 520,
      budget: 35000
    }
  ]);

  const [realTimeMetrics, setRealTimeMetrics] = useState({
    totalLeads: 1247,
    qualifiedLeads: 312,
    activeDeals: 89,
    monthlyRevenue: 1450000,
    conversionRate: 24.8,
    avgDealSize: 185000
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update real-time metrics
      setRealTimeMetrics(prev => ({
        ...prev,
        totalLeads: prev.totalLeads + Math.floor(Math.random() * 3),
        qualifiedLeads: prev.qualifiedLeads + Math.floor(Math.random() * 2),
        monthlyRevenue: prev.monthlyRevenue + Math.floor(Math.random() * 50000),
        conversionRate: Math.max(20, Math.min(30, prev.conversionRate + (Math.random() - 0.5) * 2))
      }));

      // Update agent statuses and performance
      setMarketingAgents(prev => prev.map(agent => ({
        ...agent,
        efficiency: Math.max(80, Math.min(100, agent.efficiency + (Math.random() - 0.5) * 3)),
        performance: {
          ...agent.performance,
          leadsGenerated: agent.performance.leadsGenerated ? agent.performance.leadsGenerated + Math.floor(Math.random() * 2) : undefined,
          revenue: agent.performance.revenue ? agent.performance.revenue + Math.floor(Math.random() * 10000) : undefined
        }
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getAgentIcon = (type: string) => {
    switch (type) {
      case "lead-generation": return <Target className="w-5 h-5" />;
      case "content-creation": return <MessageSquare className="w-5 h-5" />;
      case "campaign-management": return <ProfessionalChart className="w-5 h-5" />;
      case "sales-automation": return <DollarSign className="w-5 h-5" />;
      case "social-media": return <Users className="w-5 h-5" />;
      case "analytics": return <ProfessionalBrain className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "running":
      case "qualified":
        return "text-green-400 border-green-400/30 bg-green-400/10";
      case "processing":
      case "contacted":
      case "scheduled":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      case "idle":
      case "paused":
        return "text-slate-400 border-slate-400/30 bg-slate-400/10";
      case "new":
        return "text-cyan-400 border-cyan-400/30 bg-cyan-400/10";
      default:
        return "text-slate-400 border-slate-400/30 bg-slate-400/10";
    }
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-yellow-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      {/* Header */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-mono uppercase tracking-wide mb-6">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></span>
              Autonomous Marketing Division
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 leading-tight mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">AI Agents</span> Running Our Marketing
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Watch our AI marketing team work 24/7 to find prospects, create campaigns, 
              and drive revenue. This is how Shatzii markets itself using its own technology.
            </p>
          </div>

          {/* Real-time Metrics Dashboard */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-mono uppercase">Total Leads</div>
                  <Target className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-mono text-cyan-400">{realTimeMetrics.totalLeads.toLocaleString()}</div>
                <div className="text-xs text-green-400 font-mono">+{Math.floor(Math.random() * 10 + 5)} today</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-mono uppercase">Qualified</div>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-mono text-blue-400">{realTimeMetrics.qualifiedLeads.toLocaleString()}</div>
                <div className="text-xs text-green-400 font-mono">+{Math.floor(Math.random() * 5 + 2)} today</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-mono uppercase">Active Deals</div>
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-mono text-green-400">{realTimeMetrics.activeDeals}</div>
                <div className="text-xs text-green-400 font-mono">+{Math.floor(Math.random() * 3 + 1)} today</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-mono uppercase">Monthly Revenue</div>
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-mono text-purple-400">${(realTimeMetrics.monthlyRevenue / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-green-400 font-mono">+12.5% this month</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-mono uppercase">Conversion Rate</div>
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-2xl font-mono text-yellow-400">{realTimeMetrics.conversionRate.toFixed(1)}%</div>
                <div className="text-xs text-green-400 font-mono">+2.3% vs last month</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-mono uppercase">Avg Deal Size</div>
                  <DollarSign className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-mono text-orange-400">${(realTimeMetrics.avgDealSize / 1000).toFixed(0)}K</div>
                <div className="text-xs text-green-400 font-mono">+8.7% vs last month</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="agents" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-800/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-1">
              <TabsTrigger value="agents" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
                <ProfessionalBrain className="w-4 h-4 mr-2" />
                Marketing Agents
              </TabsTrigger>
              <TabsTrigger value="leads" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
                <Target className="w-4 h-4 mr-2" />
                Live Leads
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
                <ProfessionalChart className="w-4 h-4 mr-2" />
                Active Campaigns
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
                <Eye className="w-4 h-4 mr-2" />
                Performance Analytics
              </TabsTrigger>
            </TabsList>

            {/* Marketing Agents */}
            <TabsContent value="agents" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketingAgents.map((agent) => (
                  <Card key={agent.id} className="group relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <CardHeader className="relative z-10 pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl flex items-center justify-center border border-cyan-500/30">
                            {getAgentIcon(agent.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg text-slate-100 group-hover:text-cyan-400 transition-colors">
                              {agent.name}
                            </CardTitle>
                            <div className="text-xs text-slate-400 font-mono uppercase">{agent.type.replace("-", " ")}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-xs font-mono ${getStatusColor(agent.status)}`}>
                          {agent.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/20">
                        <div className="text-xs text-slate-400 font-mono mb-1">CURRENT TASK</div>
                        <div className="text-sm text-slate-300">{agent.currentTask}</div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative z-10 pt-0">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Efficiency</span>
                            <span>{agent.efficiency}%</span>
                          </div>
                          <Progress value={agent.efficiency} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {agent.performance.leadsGenerated && (
                            <div className="text-center">
                              <div className="text-xs text-slate-400 font-mono">LEADS</div>
                              <div className="text-lg text-cyan-400 font-mono">{agent.performance.leadsGenerated.toLocaleString()}</div>
                            </div>
                          )}
                          {agent.performance.conversionRate && (
                            <div className="text-center">
                              <div className="text-xs text-slate-400 font-mono">CONVERSION</div>
                              <div className="text-lg text-green-400 font-mono">{agent.performance.conversionRate}%</div>
                            </div>
                          )}
                          {agent.performance.revenue && (
                            <div className="text-center">
                              <div className="text-xs text-slate-400 font-mono">REVENUE</div>
                              <div className="text-lg text-purple-400 font-mono">${(agent.performance.revenue / 1000).toFixed(0)}K</div>
                            </div>
                          )}
                          {agent.performance.contentCreated && (
                            <div className="text-center">
                              <div className="text-xs text-slate-400 font-mono">CONTENT</div>
                              <div className="text-lg text-blue-400 font-mono">{agent.performance.contentCreated}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Live Leads */}
            <TabsContent value="leads" className="space-y-6">
              <div className="grid gap-4">
                {leads.map((lead) => (
                  <Card key={lead.id} className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={`/api/placeholder/48/48`} />
                            <AvatarFallback className="bg-slate-700 text-cyan-400">
                              {lead.contact.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-100">{lead.company}</h3>
                            <div className="text-slate-300">{lead.contact}</div>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                                {lead.industry}
                              </Badge>
                              <Badge variant="outline" className={`text-xs font-mono ${getStatusColor(lead.status)}`}>
                                {lead.status.toUpperCase()}
                              </Badge>
                              <div className={`text-sm font-mono ${getLeadScoreColor(lead.score)}`}>
                                Score: {lead.score}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <div className="text-center">
                            <div className="text-xs text-slate-400 font-mono">DEAL VALUE</div>
                            <div className="text-lg text-green-400 font-mono">${(lead.value / 1000).toFixed(0)}K</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-400 font-mono">SOURCE</div>
                            <div className="text-sm text-cyan-400 font-mono">{lead.source}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-400 font-mono">LAST ACTIVITY</div>
                            <div className="text-sm text-blue-400 font-mono">{lead.lastActivity}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-slate-900">
                              <Mail className="w-3 h-3 mr-1" />
                              Contact
                            </Button>
                            <Button size="sm" variant="outline" className="border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-cyan-400">
                              <Calendar className="w-3 h-3 mr-1" />
                              Schedule
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Active Campaigns */}
            <TabsContent value="campaigns" className="space-y-6">
              <div className="grid gap-6">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl text-slate-100">{campaign.name}</CardTitle>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                              {campaign.type.replace("-", " ").toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className={`text-xs font-mono ${getStatusColor(campaign.status)}`}>
                              {campaign.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-400 font-mono">BUDGET</div>
                          <div className="text-lg text-purple-400 font-mono">${(campaign.budget / 1000).toFixed(0)}K</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="text-xs text-slate-400 font-mono">REACH</div>
                          <div className="text-2xl text-cyan-400 font-mono">{campaign.reach.toLocaleString()}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-slate-400 font-mono">ENGAGEMENT</div>
                          <div className="text-2xl text-blue-400 font-mono">{campaign.engagement}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-slate-400 font-mono">CONVERSIONS</div>
                          <div className="text-2xl text-green-400 font-mono">{campaign.conversions}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-slate-400 font-mono">ROI</div>
                          <div className="text-2xl text-yellow-400 font-mono">{campaign.roi}%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Performance Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <ProfessionalChart className="w-5 h-5 text-cyan-400" />
                      Revenue Attribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">AI Lead Generation</span>
                        <span className="text-cyan-400 font-mono">$450K (31%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Automated Campaigns</span>
                        <span className="text-blue-400 font-mono">$380K (26%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Social Media Automation</span>
                        <span className="text-green-400 font-mono">$290K (20%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Content Marketing AI</span>
                        <span className="text-purple-400 font-mono">$330K (23%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      Growth Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Monthly Growth Rate</span>
                        <span className="text-green-400 font-mono">+34.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Customer Acquisition Cost</span>
                        <span className="text-blue-400 font-mono">$1,240</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Customer Lifetime Value</span>
                        <span className="text-purple-400 font-mono">$47,500</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Marketing ROI</span>
                        <span className="text-cyan-400 font-mono">3,730%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-12">
            <h2 className="text-4xl font-bold text-slate-100 mb-6">
              Ready for <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Your Own</span> Marketing Army?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Deploy the same AI agents that run our marketing department. 
              Watch them find prospects, create campaigns, and drive revenue 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-900 px-8 py-4 text-lg font-semibold shadow-lg shadow-cyan-500/25"
              >
                Deploy Marketing AI
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 px-8 py-4 text-lg bg-slate-800/50 backdrop-blur-sm"
              >
                Watch Live Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}