import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, PlayCircle, Settings, Target, TrendingUp, Users, Code, Zap, Brain, Globe, DollarSign, Calendar, Clock, ArrowRight } from "lucide-react";
import { PharaohIcon, SentinelIcon, NeuralIcon, QuantumIcon, ApolloIcon } from "@/components/icons/ai-agent-icons";

interface AgentDeployment {
  id: string;
  name: string;
  role: string;
  primaryFunctions: string[];
  immediateActions: {
    action: string;
    timeline: string;
    impact: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  kpis: {
    metric: string;
    target: string;
    current: string;
  }[];
  tools: string[];
  integrations: string[];
}

export default function ShatziiDeploymentPlan() {
  const [activeAgent, setActiveAgent] = useState("pharaoh");
  const [deploymentPhase, setDeploymentPhase] = useState(1);

  const agentDeployments: AgentDeployment[] = [
    {
      id: "pharaoh",
      name: "Pharaoh Marketing Master",
      role: "Chief Marketing AI",
      primaryFunctions: [
        "Lead Generation & Qualification",
        "Content Marketing Automation",
        "SEO & Traffic Optimization", 
        "Social Media Management",
        "Competitive Intelligence",
        "Brand Positioning"
      ],
      immediateActions: [
        {
          action: "Launch LinkedIn lead generation campaigns targeting CTOs and dev managers",
          timeline: "24 hours",
          impact: "50-75 qualified leads weekly",
          priority: "high"
        },
        {
          action: "Create and publish 5 technical blog posts showcasing Shatzii capabilities",
          timeline: "72 hours", 
          impact: "Establish thought leadership, improve SEO",
          priority: "high"
        },
        {
          action: "Set up automated email nurture sequences for developer prospects",
          timeline: "48 hours",
          impact: "35% higher conversion rates",
          priority: "medium"
        },
        {
          action: "Optimize website for 'AI software development' and related keywords",
          timeline: "24 hours",
          impact: "3x organic traffic within 30 days",
          priority: "high"
        }
      ],
      kpis: [
        { metric: "Monthly Qualified Leads", target: "300+", current: "0" },
        { metric: "Website Traffic", target: "50K/month", current: "0" },
        { metric: "Conversion Rate", target: "15%", current: "0%" },
        { metric: "Brand Mentions", target: "500/month", current: "0" }
      ],
      tools: ["HubSpot", "LinkedIn Sales Navigator", "SEMrush", "Buffer", "Google Analytics"],
      integrations: ["CRM", "Email Platform", "Social Media", "Analytics", "Content Management"]
    },
    {
      id: "sentinel",
      name: "Sentinel Sales Commander",
      role: "Chief Sales AI",
      primaryFunctions: [
        "Pipeline Management",
        "Deal Negotiation",
        "Client Relationship Management",
        "Proposal Generation",
        "Revenue Forecasting",
        "Upselling & Cross-selling"
      ],
      immediateActions: [
        {
          action: "Contact and qualify all inbound leads within 5 minutes",
          timeline: "Immediate",
          impact: "80% faster response time",
          priority: "high"
        },
        {
          action: "Create custom proposals for enterprise clients using AI templates",
          timeline: "2 hours per proposal",
          impact: "50% higher close rates",
          priority: "high"
        },
        {
          action: "Set up automated follow-up sequences for all prospects",
          timeline: "24 hours",
          impact: "40% more meetings booked",
          priority: "medium"
        },
        {
          action: "Implement dynamic pricing strategy based on client size and needs",
          timeline: "48 hours",
          impact: "25% higher average deal size",
          priority: "medium"
        }
      ],
      kpis: [
        { metric: "Monthly Revenue", target: "$500K+", current: "$0" },
        { metric: "Deal Close Rate", target: "45%", current: "0%" },
        { metric: "Average Deal Size", target: "$75K", current: "$0" },
        { metric: "Sales Cycle", target: "30 days", current: "N/A" }
      ],
      tools: ["Salesforce", "PipeDrive", "Calendly", "DocuSign", "Zoom"],
      integrations: ["CRM", "Email", "Calendar", "Contract Management", "Video Conferencing"]
    },
    {
      id: "neural",
      name: "Neural Support Specialist", 
      role: "Chief Customer Success AI",
      primaryFunctions: [
        "24/7 Technical Support",
        "Client Onboarding",
        "Issue Resolution",
        "Product Training",
        "Customer Health Monitoring",
        "Retention Management"
      ],
      immediateActions: [
        {
          action: "Deploy intelligent chatbot for instant technical support",
          timeline: "12 hours",
          impact: "95% issues resolved without human intervention",
          priority: "high"
        },
        {
          action: "Create automated onboarding workflows for new clients",
          timeline: "24 hours",
          impact: "70% faster client activation",
          priority: "high"
        },
        {
          action: "Monitor client usage patterns and proactively prevent churn",
          timeline: "Ongoing",
          impact: "90%+ retention rate",
          priority: "medium"
        },
        {
          action: "Generate detailed client health reports and expansion opportunities",
          timeline: "Weekly",
          impact: "40% upsell conversion",
          priority: "medium"
        }
      ],
      kpis: [
        { metric: "Customer Satisfaction", target: "98%", current: "0%" },
        { metric: "First Response Time", target: "<30 seconds", current: "N/A" },
        { metric: "Issue Resolution", target: "95% automated", current: "0%" },
        { metric: "Client Retention", target: "95%+", current: "0%" }
      ],
      tools: ["Zendesk", "Intercom", "Slack", "Notion", "Mixpanel"],
      integrations: ["Support Platform", "Knowledge Base", "Analytics", "Communication Tools"]
    },
    {
      id: "quantum",
      name: "Quantum Analytics Engine",
      role: "Chief Intelligence AI",
      primaryFunctions: [
        "Performance Analytics",
        "Predictive Modeling",
        "Market Intelligence",
        "Competitive Analysis",
        "Business Intelligence",
        "Strategic Planning"
      ],
      immediateActions: [
        {
          action: "Analyze competitor pricing and positioning strategies",
          timeline: "24 hours",
          impact: "Optimal pricing strategy",
          priority: "high"
        },
        {
          action: "Track and predict market trends in AI software development",
          timeline: "Ongoing",
          impact: "First-mover advantage on trends",
          priority: "high"
        },
        {
          action: "Generate weekly performance dashboards for all business metrics",
          timeline: "Weekly",
          impact: "Data-driven decision making",
          priority: "medium"
        },
        {
          action: "Identify and analyze potential acquisition targets or partnerships",
          timeline: "Monthly",
          impact: "Strategic growth opportunities",
          priority: "low"
        }
      ],
      kpis: [
        { metric: "Prediction Accuracy", target: "95%+", current: "0%" },
        { metric: "Report Generation", target: "Daily", current: "Manual" },
        { metric: "Market Coverage", target: "100%", current: "0%" },
        { metric: "Strategic Insights", target: "Weekly", current: "None" }
      ],
      tools: ["Tableau", "Power BI", "Google Analytics", "Mixpanel", "Amplitude"],
      integrations: ["Analytics Platforms", "Data Warehouses", "Business Intelligence", "CRM"]
    },
    {
      id: "apollo",
      name: "Apollo Operations Director",
      role: "Chief Operations AI",
      primaryFunctions: [
        "Project Management",
        "Resource Optimization",
        "Quality Assurance", 
        "Process Automation",
        "Team Coordination",
        "Delivery Management"
      ],
      immediateActions: [
        {
          action: "Automate client project setup and resource allocation",
          timeline: "48 hours",
          impact: "50% faster project starts",
          priority: "high"
        },
        {
          action: "Implement automated code review and quality checks",
          timeline: "24 hours",
          impact: "99% bug-free deliveries",
          priority: "high"
        },
        {
          action: "Optimize team workload distribution and prevent burnout",
          timeline: "Ongoing",
          impact: "30% higher productivity",
          priority: "medium"
        },
        {
          action: "Create automated client reporting and project updates",
          timeline: "24 hours",
          impact: "100% transparency, higher satisfaction",
          priority: "medium"
        }
      ],
      kpis: [
        { metric: "Project Delivery", target: "On-time 98%", current: "N/A" },
        { metric: "Resource Utilization", target: "90%+", current: "Unknown" },
        { metric: "Quality Score", target: "99%+", current: "Manual" },
        { metric: "Client Satisfaction", target: "98%+", current: "0%" }
      ],
      tools: ["Jira", "Asana", "GitHub", "Slack", "Monday.com"],
      integrations: ["Project Management", "Version Control", "Communication", "Time Tracking"]
    }
  ];

  const deploymentPhases = [
    {
      phase: 1,
      title: "Immediate Activation (0-7 days)",
      description: "Deploy core agents for immediate business impact",
      agents: ["pharaoh", "sentinel"],
      objectives: ["Start lead generation", "Begin sales process", "Establish market presence"]
    },
    {
      phase: 2, 
      title: "Scale & Support (7-30 days)",
      description: "Add customer success and analytics capabilities",
      agents: ["neural", "quantum"],
      objectives: ["Support existing clients", "Analyze performance", "Optimize operations"]
    },
    {
      phase: 3,
      title: "Full Automation (30+ days)", 
      description: "Complete operational AI integration",
      agents: ["apollo"],
      objectives: ["Automate all processes", "Scale to enterprise", "Maximize efficiency"]
    }
  ];

  const currentAgent = agentDeployments.find(agent => agent.id === activeAgent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-cyan-400 mb-4 flex items-center justify-center gap-3">
            <Brain className="h-10 w-10" />
            Shatzii AI Agent Deployment Plan
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Transform your software development company into an AI-powered enterprise that operates autonomously 24/7
          </p>
        </div>

        {/* Deployment Phases */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Deployment Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deploymentPhases.map((phase) => (
              <Card 
                key={phase.phase}
                className={`bg-slate-900/80 border-cyan-500/20 cursor-pointer transition-all ${
                  deploymentPhase === phase.phase ? 'ring-2 ring-cyan-500' : ''
                }`}
                onClick={() => setDeploymentPhase(phase.phase)}
              >
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      deploymentPhase === phase.phase ? 'bg-cyan-600' : 'bg-slate-700'
                    }`}>
                      {phase.phase}
                    </div>
                    {phase.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm mb-3">{phase.description}</p>
                  <div className="space-y-2">
                    {phase.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span className="text-slate-400 text-xs">{objective}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Agent Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">AI Agent Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {agentDeployments.map((agent) => (
              <Card
                key={agent.id}
                className={`bg-slate-900/80 border-cyan-500/20 cursor-pointer transition-all ${
                  activeAgent === agent.id ? 'ring-2 ring-cyan-500' : ''
                }`}
                onClick={() => setActiveAgent(agent.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="mb-3 flex justify-center">
                    {agent.id === 'pharaoh' && <PharaohIcon size={32} className="text-cyan-400" />}
                    {agent.id === 'sentinel' && <SentinelIcon size={32} className="text-green-400" />}
                    {agent.id === 'neural' && <NeuralIcon size={32} className="text-purple-400" />}
                    {agent.id === 'quantum' && <QuantumIcon size={32} className="text-orange-400" />}
                    {agent.id === 'apollo' && <ApolloIcon size={32} className="text-red-400" />}
                  </div>
                  <h3 className="text-cyan-400 font-semibold text-sm">{agent.name}</h3>
                  <p className="text-slate-400 text-xs mt-1">{agent.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Agent Details */}
        {currentAgent && (
          <Tabs defaultValue="deployment" className="space-y-6">
            <TabsList className="bg-slate-800/50 border border-cyan-500/20">
              <TabsTrigger value="deployment" className="data-[state=active]:bg-cyan-600">Deployment Plan</TabsTrigger>
              <TabsTrigger value="actions" className="data-[state=active]:bg-cyan-600">Immediate Actions</TabsTrigger>
              <TabsTrigger value="metrics" className="data-[state=active]:bg-cyan-600">Success Metrics</TabsTrigger>
              <TabsTrigger value="integration" className="data-[state=active]:bg-cyan-600">Integration</TabsTrigger>
            </TabsList>

            <TabsContent value="deployment">
              <Card className="bg-slate-900/80 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {currentAgent.name} - Strategic Deployment
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                      {currentAgent.role}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-200 mb-3">Primary Functions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentAgent.primaryFunctions.map((func, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                          <span className="text-slate-300">{func}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
                    <h4 className="text-lg font-semibold text-cyan-400 mb-3">Business Impact Projection</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-400">300%+</div>
                        <div className="text-slate-400 text-sm">Efficiency Increase</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">$500K+</div>
                        <div className="text-slate-400 text-sm">Annual Value</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">24/7</div>
                        <div className="text-slate-400 text-sm">Operation</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions">
              <Card className="bg-slate-900/80 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <PlayCircle className="h-5 w-5" />
                    Immediate Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentAgent.immediateActions.map((action, index) => (
                      <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h5 className="text-slate-200 font-medium mb-2">{action.action}</h5>
                            <p className="text-slate-400 text-sm">{action.impact}</p>
                          </div>
                          <Badge className={`ml-4 ${
                            action.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/20' :
                            action.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' :
                            'bg-green-500/20 text-green-400 border-green-500/20'
                          }`}>
                            {action.priority} priority
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-cyan-400" />
                            <span className="text-cyan-400 text-sm">{action.timeline}</span>
                          </div>
                          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                            Deploy Now
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics">
              <Card className="bg-slate-900/80 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Key Performance Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentAgent.kpis.map((kpi, index) => (
                      <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-300 font-medium">{kpi.metric}</span>
                          <div className="text-right">
                            <div className="text-lg font-bold text-cyan-400">{kpi.target}</div>
                            <div className="text-xs text-slate-500">Target</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400">Current: {kpi.current}</span>
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/20">
                            Needs Setup
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integration">
              <Card className="bg-slate-900/80 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Tools & Integration Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-200 mb-3">Required Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentAgent.tools.map((tool, index) => (
                        <Badge key={index} variant="outline" className="border-cyan-500/20 text-cyan-400">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-200 mb-3">System Integrations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentAgent.integrations.map((integration, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                          <Globe className="h-5 w-5 text-green-400" />
                          <span className="text-slate-300">{integration}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                      <h4 className="text-lg font-semibold text-green-400">Ready for Deployment</h4>
                    </div>
                    <p className="text-slate-300 mb-4">
                      All systems are configured and ready for immediate deployment. Agent can be activated within 24 hours.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Activate {currentAgent.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Implementation Roadmap */}
        <Card className="bg-slate-900/80 border-cyan-500/20 mt-8">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              30-Day Implementation Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <h4 className="text-red-400 font-semibold mb-2">Week 1: Foundation</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Deploy Pharaoh Marketing</li>
                    <li>• Activate Sentinel Sales</li>
                    <li>• Set up lead generation</li>
                    <li>• Begin prospect outreach</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <h4 className="text-yellow-400 font-semibold mb-2">Week 2-3: Scale</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Add Neural Support</li>
                    <li>• Implement Quantum Analytics</li>
                    <li>• Optimize existing agents</li>
                    <li>• Scale operations</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <h4 className="text-green-400 font-semibold mb-2">Week 4: Optimize</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Deploy Apollo Operations</li>
                    <li>• Full automation active</li>
                    <li>• Performance optimization</li>
                    <li>• Enterprise scaling</li>
                  </ul>
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
                <h3 className="text-2xl font-bold text-cyan-400 mb-2">Projected 30-Day Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">$250K+</div>
                    <div className="text-slate-400 text-sm">Revenue Pipeline</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">500+</div>
                    <div className="text-slate-400 text-sm">Qualified Leads</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">95%</div>
                    <div className="text-slate-400 text-sm">Process Automation</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">24/7</div>
                    <div className="text-slate-400 text-sm">Operation</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}