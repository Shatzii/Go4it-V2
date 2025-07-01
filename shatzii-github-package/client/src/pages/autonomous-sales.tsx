import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, Calendar, DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle, Users } from "lucide-react";
import { ProfessionalBrain, ProfessionalChart, ProfessionalUsers, ProfessionalShield } from "@/components/ui/professional-icons";

interface SalesAgent {
  id: string;
  name: string;
  specialty: "prospecting" | "qualification" | "demo" | "negotiation" | "closing" | "account-management";
  status: "active" | "on-call" | "in-meeting" | "following-up";
  performance: {
    dealsWon: number;
    revenue: number;
    conversionRate: number;
    avgDealSize: number;
    callsToday: number;
    meetingsScheduled: number;
  };
  currentActivity: string;
  efficiency: number;
  quota: number;
  quotaProgress: number;
}

interface Deal {
  id: string;
  company: string;
  contact: string;
  value: number;
  stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closing" | "won" | "lost";
  probability: number;
  nextAction: string;
  assignedAgent: string;
  lastActivity: string;
  daysInStage: number;
  industry: string;
  source: string;
}

interface SalesActivity {
  id: string;
  type: "call" | "email" | "meeting" | "proposal" | "follow-up";
  agentId: string;
  dealId: string;
  company: string;
  outcome: "completed" | "scheduled" | "no-response" | "interested" | "not-qualified";
  timestamp: string;
  notes: string;
}

export default function AutonomousSales() {
  const [salesAgents, setSalesAgents] = useState<SalesAgent[]>([
    {
      id: "prospect-hunter",
      name: "ProspectHunter AI",
      specialty: "prospecting",
      status: "active",
      performance: {
        dealsWon: 47,
        revenue: 2340000,
        conversionRate: 31.2,
        avgDealSize: 185000,
        callsToday: 23,
        meetingsScheduled: 8
      },
      currentActivity: "Cold calling Fortune 500 CTOs identified by LeadHunter",
      efficiency: 94,
      quota: 500000,
      quotaProgress: 73
    },
    {
      id: "qualifier-pro",
      name: "QualifierPro AI",
      specialty: "qualification",
      status: "in-meeting",
      performance: {
        dealsWon: 52,
        revenue: 1890000,
        conversionRate: 45.8,
        avgDealSize: 160000,
        callsToday: 15,
        meetingsScheduled: 12
      },
      currentActivity: "Discovery call with FinanceFirst Bank about cybersecurity needs",
      efficiency: 97,
      quota: 400000,
      quotaProgress: 89
    },
    {
      id: "demo-master",
      name: "DemoMaster AI",
      specialty: "demo",
      status: "active",
      performance: {
        dealsWon: 38,
        revenue: 2100000,
        conversionRate: 67.3,
        avgDealSize: 220000,
        callsToday: 6,
        meetingsScheduled: 4
      },
      currentActivity: "Preparing custom demo for TechCorp's AI implementation requirements",
      efficiency: 91,
      quota: 600000,
      quotaProgress: 85
    },
    {
      id: "negotiator-elite",
      name: "NegotiatorElite AI",
      specialty: "negotiation",
      status: "on-call",
      performance: {
        dealsWon: 29,
        revenue: 3200000,
        conversionRate: 78.4,
        avgDealSize: 340000,
        callsToday: 4,
        meetingsScheduled: 2
      },
      currentActivity: "Reviewing contract terms for Global Manufacturing Ltd deal",
      efficiency: 96,
      quota: 800000,
      quotaProgress: 91
    },
    {
      id: "closer-supreme",
      name: "CloserSupreme AI",
      specialty: "closing",
      status: "following-up",
      performance: {
        dealsWon: 41,
        revenue: 4100000,
        conversionRate: 89.2,
        avgDealSize: 420000,
        callsToday: 7,
        meetingsScheduled: 3
      },
      currentActivity: "Following up on signed contracts and implementation planning",
      efficiency: 98,
      quota: 1000000,
      quotaProgress: 94
    },
    {
      id: "account-guardian",
      name: "AccountGuardian AI",
      specialty: "account-management",
      status: "active",
      performance: {
        dealsWon: 63,
        revenue: 1560000,
        conversionRate: 92.1,
        avgDealSize: 95000,
        callsToday: 12,
        meetingsScheduled: 6
      },
      currentActivity: "Upselling AI expansion to existing enterprise clients",
      efficiency: 93,
      quota: 300000,
      quotaProgress: 88
    }
  ]);

  const [deals, setDeals] = useState<Deal[]>([
    {
      id: "deal-001",
      company: "TechCorp Industries",
      contact: "Sarah Chen, CTO",
      value: 450000,
      stage: "negotiation",
      probability: 85,
      nextAction: "Contract review and pricing finalization",
      assignedAgent: "NegotiatorElite AI",
      lastActivity: "30 minutes ago",
      daysInStage: 3,
      industry: "Enterprise Software",
      source: "LinkedIn Outreach"
    },
    {
      id: "deal-002",
      company: "Global Manufacturing Ltd",
      contact: "Mike Rodriguez, VP IT",
      value: 320000,
      stage: "proposal",
      probability: 70,
      nextAction: "Technical architecture presentation scheduled",
      assignedAgent: "DemoMaster AI",
      lastActivity: "2 hours ago",
      daysInStage: 5,
      industry: "Manufacturing",
      source: "Cold Email Campaign"
    },
    {
      id: "deal-003",
      company: "FinanceFirst Bank",
      contact: "Alex Thompson, CISO",
      value: 680000,
      stage: "qualification",
      probability: 60,
      nextAction: "Security compliance deep dive call",
      assignedAgent: "QualifierPro AI",
      lastActivity: "1 hour ago",
      daysInStage: 2,
      industry: "Financial Services",
      source: "Website Form"
    },
    {
      id: "deal-004",
      company: "HealthTech Solutions",
      contact: "Dr. Emma Wilson, CEO",
      value: 250000,
      stage: "closing",
      probability: 95,
      nextAction: "Final signature collection",
      assignedAgent: "CloserSupreme AI",
      lastActivity: "15 minutes ago",
      daysInStage: 1,
      industry: "Healthcare",
      source: "Webinar Registration"
    },
    {
      id: "deal-005",
      company: "RetailChain Corp",
      contact: "John Smith, CTO",
      value: 180000,
      stage: "prospecting",
      probability: 25,
      nextAction: "Initial discovery call scheduled",
      assignedAgent: "ProspectHunter AI",
      lastActivity: "4 hours ago",
      daysInStage: 1,
      industry: "Retail",
      source: "Cold Call"
    }
  ]);

  const [recentActivities, setRecentActivities] = useState<SalesActivity[]>([
    {
      id: "act-001",
      type: "call",
      agentId: "qualifier-pro",
      dealId: "deal-003",
      company: "FinanceFirst Bank",
      outcome: "interested",
      timestamp: "10 minutes ago",
      notes: "CISO confirmed budget and timeline. Scheduling technical review next week."
    },
    {
      id: "act-002",
      type: "email",
      agentId: "closer-supreme",
      dealId: "deal-004",
      company: "HealthTech Solutions",
      outcome: "completed",
      timestamp: "25 minutes ago",
      notes: "Sent final contract with negotiated terms. CEO reviewing for signature."
    },
    {
      id: "act-003",
      type: "meeting",
      agentId: "demo-master",
      dealId: "deal-002",
      company: "Global Manufacturing Ltd",
      outcome: "completed",
      timestamp: "2 hours ago",
      notes: "Technical demo completed. VP IT impressed with AI capabilities. Proposal requested."
    },
    {
      id: "act-004",
      type: "proposal",
      agentId: "negotiator-elite",
      dealId: "deal-001",
      company: "TechCorp Industries",
      outcome: "completed",
      timestamp: "3 hours ago",
      notes: "Custom pricing proposal delivered. CTO reviewing with procurement team."
    }
  ]);

  const [salesMetrics, setSalesMetrics] = useState({
    totalPipeline: 18950000,
    monthlyRevenue: 4200000,
    dealsWon: 73,
    avgDealSize: 285000,
    salesCycleLength: 45,
    winRate: 84.2
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update sales metrics
      setSalesMetrics(prev => ({
        ...prev,
        totalPipeline: prev.totalPipeline + Math.floor(Math.random() * 100000),
        monthlyRevenue: prev.monthlyRevenue + Math.floor(Math.random() * 50000),
        dealsWon: prev.dealsWon + (Math.random() > 0.95 ? 1 : 0),
        winRate: Math.max(80, Math.min(90, prev.winRate + (Math.random() - 0.5) * 2))
      }));

      // Update agent performance
      setSalesAgents(prev => prev.map(agent => ({
        ...agent,
        performance: {
          ...agent.performance,
          callsToday: agent.performance.callsToday + (Math.random() > 0.8 ? 1 : 0),
          revenue: agent.performance.revenue + Math.floor(Math.random() * 10000)
        },
        efficiency: Math.max(85, Math.min(100, agent.efficiency + (Math.random() - 0.5) * 2))
      })));
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const getAgentIcon = (specialty: string) => {
    switch (specialty) {
      case "prospecting": return <Users className="w-5 h-5" />;
      case "qualification": return <CheckCircle className="w-5 h-5" />;
      case "demo": return <ProfessionalChart className="w-5 h-5" />;
      case "negotiation": return <DollarSign className="w-5 h-5" />;
      case "closing": return <TrendingUp className="w-5 h-5" />;
      case "account-management": return <ProfessionalShield className="w-5 h-5" />;
      default: return <ProfessionalBrain className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "won":
        return "text-green-400 border-green-400/30 bg-green-400/10";
      case "in-meeting":
      case "negotiation":
      case "closing":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      case "on-call":
      case "proposal":
        return "text-blue-400 border-blue-400/30 bg-blue-400/10";
      case "following-up":
      case "qualification":
        return "text-cyan-400 border-cyan-400/30 bg-cyan-400/10";
      case "prospecting":
        return "text-purple-400 border-purple-400/30 bg-purple-400/10";
      case "lost":
        return "text-red-400 border-red-400/30 bg-red-400/10";
      default:
        return "text-slate-400 border-slate-400/30 bg-slate-400/10";
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "prospecting": return <Users className="w-4 h-4" />;
      case "qualification": return <CheckCircle className="w-4 h-4" />;
      case "proposal": return <Mail className="w-4 h-4" />;
      case "negotiation": return <DollarSign className="w-4 h-4" />;
      case "closing": return <TrendingUp className="w-4 h-4" />;
      case "won": return <CheckCircle className="w-4 h-4" />;
      case "lost": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "call": return <Phone className="w-4 h-4" />;
      case "email": return <Mail className="w-4 h-4" />;
      case "meeting": return <Calendar className="w-4 h-4" />;
      case "proposal": return <DollarSign className="w-4 h-4" />;
      case "follow-up": return <Clock className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
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
              Autonomous Sales Division
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-100 leading-tight mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">AI Sales Team</span> Closing Deals 24/7
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our AI sales agents handle the complete sales cycle from prospecting to closing. 
              Watch them qualify leads, run demos, negotiate contracts, and close million-dollar deals.
            </p>
          </div>

          {/* Sales Metrics Dashboard */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-mono uppercase">Pipeline</div>
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-mono text-cyan-400">${(salesMetrics.totalPipeline / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-green-400 font-mono">+{Math.floor(Math.random() * 500 + 200)}K today</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-mono uppercase">Monthly Revenue</div>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-mono text-green-400">${(salesMetrics.monthlyRevenue / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-green-400 font-mono">+23% vs last month</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-mono uppercase">Deals Won</div>
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-mono text-blue-400">{salesMetrics.dealsWon}</div>
                <div className="text-xs text-green-400 font-mono">+{Math.floor(Math.random() * 5 + 2)} this month</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-mono uppercase">Avg Deal Size</div>
                  <DollarSign className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-mono text-purple-400">${(salesMetrics.avgDealSize / 1000).toFixed(0)}K</div>
                <div className="text-xs text-green-400 font-mono">+12% vs last quarter</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-mono uppercase">Sales Cycle</div>
                  <Clock className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-2xl font-mono text-yellow-400">{salesMetrics.salesCycleLength} days</div>
                <div className="text-xs text-green-400 font-mono">-8 days vs industry avg</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400 font-mono uppercase">Win Rate</div>
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-mono text-orange-400">{salesMetrics.winRate.toFixed(1)}%</div>
                <div className="text-xs text-green-400 font-mono">Industry leading</div>
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
                Sales Agents
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
                <DollarSign className="w-4 h-4 mr-2" />
                Live Pipeline
              </TabsTrigger>
              <TabsTrigger value="activities" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
                <Clock className="w-4 h-4 mr-2" />
                Recent Activities
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:text-cyan-400 text-slate-300 hover:text-cyan-300 transition-all duration-300 rounded-lg font-mono text-xs uppercase tracking-wide">
                <ProfessionalChart className="w-4 h-4 mr-2" />
                Performance Analytics
              </TabsTrigger>
            </TabsList>

            {/* Sales Agents */}
            <TabsContent value="agents" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {salesAgents.map((agent) => (
                  <Card key={agent.id} className="group relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <CardHeader className="relative z-10 pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl flex items-center justify-center border border-cyan-500/30">
                            {getAgentIcon(agent.specialty)}
                          </div>
                          <div>
                            <CardTitle className="text-lg text-slate-100 group-hover:text-cyan-400 transition-colors">
                              {agent.name}
                            </CardTitle>
                            <div className="text-xs text-slate-400 font-mono uppercase">{agent.specialty.replace("-", " ")}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-xs font-mono ${getStatusColor(agent.status)}`}>
                          {agent.status.toUpperCase().replace("-", " ")}
                        </Badge>
                      </div>
                      
                      <div className="bg-slate-800/50 rounded-lg p-3 border border-cyan-500/20">
                        <div className="text-xs text-slate-400 font-mono mb-1">CURRENT ACTIVITY</div>
                        <div className="text-sm text-slate-300">{agent.currentActivity}</div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative z-10 pt-0">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Quota Progress</span>
                            <span>{agent.quotaProgress}%</span>
                          </div>
                          <Progress value={agent.quotaProgress} className="h-2" />
                          <div className="text-xs text-slate-400 mt-1">
                            ${(agent.performance.revenue / 1000).toFixed(0)}K / ${(agent.quota / 1000).toFixed(0)}K
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center">
                            <div className="text-xs text-slate-400 font-mono">DEALS WON</div>
                            <div className="text-lg text-cyan-400 font-mono">{agent.performance.dealsWon}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-400 font-mono">WIN RATE</div>
                            <div className="text-lg text-green-400 font-mono">{agent.performance.conversionRate}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-400 font-mono">CALLS TODAY</div>
                            <div className="text-lg text-blue-400 font-mono">{agent.performance.callsToday}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-400 font-mono">MEETINGS</div>
                            <div className="text-lg text-purple-400 font-mono">{agent.performance.meetingsScheduled}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Live Pipeline */}
            <TabsContent value="pipeline" className="space-y-6">
              <div className="grid gap-4">
                {deals.map((deal) => (
                  <Card key={deal.id} className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={`/api/placeholder/48/48`} />
                            <AvatarFallback className="bg-slate-700 text-cyan-400">
                              {deal.company.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-100">{deal.company}</h3>
                            <div className="text-slate-300">{deal.contact}</div>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                                {deal.industry}
                              </Badge>
                              <Badge variant="outline" className={`text-xs font-mono ${getStatusColor(deal.stage)}`}>
                                {getStageIcon(deal.stage)}
                                <span className="ml-1">{deal.stage.toUpperCase()}</span>
                              </Badge>
                              <div className="text-sm text-slate-400">
                                {deal.probability}% probability
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <div className="text-center">
                            <div className="text-xs text-slate-400 font-mono">DEAL VALUE</div>
                            <div className="text-lg text-green-400 font-mono">${(deal.value / 1000).toFixed(0)}K</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-400 font-mono">ASSIGNED TO</div>
                            <div className="text-sm text-cyan-400 font-mono">{deal.assignedAgent}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-400 font-mono">NEXT ACTION</div>
                            <div className="text-sm text-blue-400">{deal.nextAction}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-400 font-mono">LAST ACTIVITY</div>
                            <div className="text-sm text-purple-400 font-mono">{deal.lastActivity}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Recent Activities */}
            <TabsContent value="activities" className="space-y-6">
              <div className="grid gap-4">
                {recentActivities.map((activity) => (
                  <Card key={activity.id} className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl flex items-center justify-center border border-cyan-500/30">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-100">{activity.company}</h3>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                                  {activity.type.toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className={`text-xs font-mono ${getStatusColor(activity.outcome)}`}>
                                  {activity.outcome.toUpperCase().replace("-", " ")}
                                </Badge>
                                <div className="text-xs text-slate-400 font-mono">{activity.timestamp}</div>
                              </div>
                            </div>
                            <div className="text-sm text-cyan-400 font-mono">{activity.agentId.replace("-", " ")}</div>
                          </div>
                          <p className="text-slate-300">{activity.notes}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Performance Analytics */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <ProfessionalChart className="w-5 h-5 text-cyan-400" />
                      Revenue by Agent Specialty
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Closing Specialists</span>
                        <span className="text-cyan-400 font-mono">$4.1M (28%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Negotiation Experts</span>
                        <span className="text-blue-400 font-mono">$3.2M (22%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Prospecting Agents</span>
                        <span className="text-green-400 font-mono">$2.3M (16%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Demo Specialists</span>
                        <span className="text-purple-400 font-mono">$2.1M (14%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Qualification Agents</span>
                        <span className="text-yellow-400 font-mono">$1.9M (13%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Account Management</span>
                        <span className="text-orange-400 font-mono">$1.6M (11%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      Sales Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Sales Velocity</span>
                        <span className="text-green-400 font-mono">$1.2M/month</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Lead to Deal Conversion</span>
                        <span className="text-blue-400 font-mono">24.8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Average Response Time</span>
                        <span className="text-purple-400 font-mono">3.2 minutes</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Customer Satisfaction</span>
                        <span className="text-cyan-400 font-mono">9.4/10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Contract Accuracy</span>
                        <span className="text-yellow-400 font-mono">99.7%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Upsell Success Rate</span>
                        <span className="text-orange-400 font-mono">67.3%</span>
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
              Ready for <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Your Own</span> Sales Army?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Deploy the same AI sales agents that close millions in deals for Shatzii. 
              Watch them handle your entire sales cycle with superhuman efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-900 px-8 py-4 text-lg font-semibold shadow-lg shadow-cyan-500/25"
              >
                Deploy Sales AI
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