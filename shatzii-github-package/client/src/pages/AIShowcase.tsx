import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Brain, Zap, TrendingUp, Users, DollarSign, Target, Activity } from 'lucide-react';

interface LiveMetrics {
  marketing: {
    totalLeads: number;
    activeCampaigns: number;
    conversionRate: number;
    revenue: number;
    leadsToday: number;
  };
  sales: {
    totalPipeline: number;
    dealsWon: number;
    revenue: number;
    avgDealSize: number;
    conversionRate: number;
    activitiesLastWeek: number;
  };
  combined: {
    totalRevenue: number;
    totalLeads: number;
    overallConversionRate: number;
    monthlyGrowth: number;
  };
}

export default function AIShowcase() {
  const [metrics, setMetrics] = useState<LiveMetrics | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket for real-time AI metrics
    const ws = new WebSocket(`wss://${window.location.host}/ws`);
    
    ws.onopen = () => {
      setIsConnected(true);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'metrics') {
        setMetrics(data.metrics);
      }
    };
    
    ws.onclose = () => {
      setIsConnected(false);
    };

    // Fallback: Fetch metrics via API
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/ai/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative px-6 py-24 text-center">
        <div className="absolute inset-0 bg-[url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=)] opacity-20"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Badge variant="secondary" className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
              {isConnected ? 'Live AI Operations' : 'AI Systems Active'}
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Autonomous AI Business Engine
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Watch our AI agents generate leads, create campaigns, and close deals in real-time. 
            This is the future of business automation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Bot className="mr-2 h-5 w-5" />
              Deploy Your AI Agents
            </Button>
            <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Brain className="mr-2 h-5 w-5" />
              View Live Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Live Metrics Dashboard */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Live AI Performance</h2>
            <p className="text-gray-400 text-lg">Real-time metrics from our autonomous business operations</p>
          </div>

          {metrics && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="marketing">Marketing AI</TabsTrigger>
                <TabsTrigger value="sales">Sales AI</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-emerald-400">
                        ${metrics.combined.totalRevenue.toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-500">
                        +{metrics.combined.monthlyGrowth.toFixed(1)}% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">Total Leads</CardTitle>
                      <Users className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-400">
                        {metrics.combined.totalLeads.toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-500">
                        {metrics.marketing.leadsToday} generated today
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">Conversion Rate</CardTitle>
                      <Target className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-400">
                        {(metrics.combined.overallConversionRate * 100).toFixed(1)}%
                      </div>
                      <Progress 
                        value={metrics.combined.overallConversionRate * 100} 
                        className="mt-2"
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">Active Campaigns</CardTitle>
                      <Activity className="h-4 w-4 text-orange-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-400">
                        {metrics.marketing.activeCampaigns}
                      </div>
                      <p className="text-xs text-gray-500">
                        Running autonomously
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="marketing" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-400">
                        <Bot className="h-5 w-5" />
                        Lead Generation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">{metrics.marketing.totalLeads}</div>
                      <p className="text-sm text-gray-400">Total leads generated</p>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Today's Progress</span>
                          <span>{metrics.marketing.leadsToday}</span>
                        </div>
                        <Progress value={(metrics.marketing.leadsToday / 50) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-400">
                        <Zap className="h-5 w-5" />
                        Campaign Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">{metrics.marketing.activeCampaigns}</div>
                      <p className="text-sm text-gray-400">Active campaigns</p>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Conversion Rate</span>
                          <span>{(metrics.marketing.conversionRate * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={metrics.marketing.conversionRate * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 border-emerald-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-400">
                        <DollarSign className="h-5 w-5" />
                        Revenue Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">${metrics.marketing.revenue.toLocaleString()}</div>
                      <p className="text-sm text-gray-400">Generated this month</p>
                      <div className="mt-4">
                        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                          ROI: 340%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="sales" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 border-orange-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-400">
                        <TrendingUp className="h-5 w-5" />
                        Pipeline Value
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">${metrics.sales.totalPipeline.toLocaleString()}</div>
                      <p className="text-sm text-gray-400">Total pipeline</p>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Avg Deal Size</span>
                          <span>${metrics.sales.avgDealSize.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/50 border-cyan-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-cyan-400">
                        <Target className="h-5 w-5" />
                        Deals Closed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">{metrics.sales.dealsWon}</div>
                      <p className="text-sm text-gray-400">Won this month</p>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Win Rate</span>
                          <span>{(metrics.sales.conversionRate * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={metrics.sales.conversionRate * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-rose-900/50 to-rose-800/50 border-rose-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-rose-400">
                        <Activity className="h-5 w-5" />
                        Agent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">{metrics.sales.activitiesLastWeek}</div>
                      <p className="text-sm text-gray-400">Activities this week</p>
                      <div className="mt-4">
                        <Badge variant="secondary" className="bg-rose-500/20 text-rose-400">
                          3 Agents Active
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      {/* AI Capabilities Showcase */}
      <section className="px-6 py-16 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise AI Capabilities</h2>
            <p className="text-gray-400 text-lg">Cutting-edge AI solutions that scale your business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <Bot className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-xl">Autonomous Lead Generation</CardTitle>
                <CardDescription>
                  AI agents scan multiple data sources, qualify prospects, and build targeted lead lists automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Multi-platform prospecting</li>
                  <li>• Real-time lead scoring</li>
                  <li>• Automated enrichment</li>
                  <li>• CRM integration</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-colors">
              <CardHeader>
                <Brain className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-xl">Intelligent Campaign Management</CardTitle>
                <CardDescription>
                  Dynamic campaign optimization using machine learning to maximize conversion rates.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• A/B testing automation</li>
                  <li>• Personalized messaging</li>
                  <li>• Optimal timing prediction</li>
                  <li>• Performance analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-emerald-500/50 transition-colors">
              <CardHeader>
                <Zap className="h-12 w-12 text-emerald-400 mb-4" />
                <CardTitle className="text-xl">Predictive Sales Analytics</CardTitle>
                <CardDescription>
                  Advanced forecasting and deal progression analysis to optimize sales performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Deal probability scoring</li>
                  <li>• Revenue forecasting</li>
                  <li>• Risk analysis</li>
                  <li>• Pipeline optimization</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Deploy Your AI Business Engine?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the companies using autonomous AI to scale their operations and drive growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Schedule AI Strategy Session
            </Button>
            <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Download Case Studies
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}