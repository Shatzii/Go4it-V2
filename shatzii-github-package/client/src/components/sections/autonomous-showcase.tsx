import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, TrendingUp, Users, DollarSign, Clock, Target } from "lucide-react";
import { Link } from "wouter";

export default function AutonomousShowcase() {
  const [activeAgent, setActiveAgent] = useState(0);
  const [metrics, setMetrics] = useState({
    leadsGenerated: 142,
    dealsWon: 23,
    revenue: 485000,
    activeAgents: 11
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        leadsGenerated: prev.leadsGenerated + Math.floor(Math.random() * 3),
        dealsWon: prev.dealsWon + (Math.random() > 0.8 ? 1 : 0),
        revenue: prev.revenue + Math.floor(Math.random() * 5000),
        activeAgents: 11
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const agents = [
    {
      name: "LeadHunter Pro",
      role: "Lead Generation",
      status: "Actively prospecting Fortune 500 companies",
      activity: "Generated 12 qualified leads in the last hour",
      efficiency: "94%"
    },
    {
      name: "ContentGenius AI",
      role: "Content Creation",
      status: "Creating personalized sales materials",
      activity: "Produced 8 custom proposals and 15 follow-up emails",
      efficiency: "98%"
    },
    {
      name: "SalesBot Elite",
      role: "Deal Management",
      status: "Managing 47 active opportunities",
      activity: "Closed 3 deals worth $125K in the last 2 hours",
      efficiency: "91%"
    },
    {
      name: "CampaignMaster",
      role: "Marketing Automation",
      status: "Executing multi-channel campaigns",
      activity: "Launched 5 targeted campaigns reaching 10K prospects",
      efficiency: "96%"
    }
  ];

  useEffect(() => {
    const agentInterval = setInterval(() => {
      setActiveAgent(prev => (prev + 1) % agents.length);
    }, 4000);

    return () => clearInterval(agentInterval);
  }, [agents.length]);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-800/30 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Bot className="w-4 h-4" />
            Live AI Operations
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Watch AI Agents <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Work Live</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            These metrics are live from our autonomous AI agents currently running business operations. 
            Every number updates in real-time as deals close and campaigns execute.
          </p>
        </div>

        {/* Live Metrics Dashboard */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Leads Generated Today</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics.leadsGenerated.toLocaleString()}</div>
              <div className="text-sm text-green-400 mt-1">+12 in last hour</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Deals Won</CardTitle>
                <Target className="h-4 w-4 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics.dealsWon}</div>
              <div className="text-sm text-cyan-400 mt-1">85% win rate</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Revenue Generated</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${metrics.revenue.toLocaleString()}</div>
              <div className="text-sm text-purple-400 mt-1">This month</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Active Agents</CardTitle>
                <Clock className="h-4 w-4 text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics.activeAgents}</div>
              <div className="text-sm text-orange-400 mt-1">24/7 operation</div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Activity Feed */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Agent Status */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-6">Agent Activity Feed</h3>
            {agents.map((agent, index) => (
              <Card 
                key={index} 
                className={`bg-slate-800/50 border transition-all duration-300 backdrop-blur-sm ${
                  index === activeAgent ? 'border-purple-500 bg-purple-900/20' : 'border-slate-700'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-white">{agent.name}</h4>
                        <Badge variant="secondary" className="bg-purple-600/30 text-purple-300">
                          {agent.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{agent.status}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-400">{agent.efficiency}</div>
                      <div className="text-xs text-gray-500">Efficiency</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">{agent.activity}</div>
                  {index === activeAgent && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400">Currently active</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Highlights */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Live Performance</h3>
            
            <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Autonomous Operations Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Lead Generation Rate</span>
                  <span className="text-cyan-400 font-semibold">300% increase</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Sales Cycle Time</span>
                  <span className="text-green-400 font-semibold">60% reduction</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Conversion Rate</span>
                  <span className="text-purple-400 font-semibold">85% success</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Operational Costs</span>
                  <span className="text-orange-400 font-semibold">70% reduction</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Self-Hosted Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">100% data privacy and control</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">Zero external API dependencies</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Local AI models (4 specialized models)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-300">24/7 autonomous operation</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Link href="/autonomous-marketing">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                  View Live Marketing Dashboard
                </Button>
              </Link>
              <Link href="/autonomous-sales">
                <Button variant="outline" className="w-full border-purple-500 text-purple-300 hover:bg-purple-600/20">
                  Monitor Sales Operations
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Deploy Your Own Autonomous AI Team</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get the same AI agents running your business operations. Complete self-hosted deployment 
              with local models, full data control, and 24/7 autonomous performance.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                Start Your AI Deployment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}