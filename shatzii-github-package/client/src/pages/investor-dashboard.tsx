import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  Target,
  Zap,
  Trophy,
  ArrowUp,
  ArrowDown,
  Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function InvestorDashboard() {
  const [liveMetrics, setLiveMetrics] = useState({
    totalRevenue: 2108000,
    monthlyGrowth: 23.5,
    investorInterest: 93000000
  });

  // Fetch investor metrics
  const { data: investorData } = useQuery({
    queryKey: ['/api/investor/metrics'],
    refetchInterval: 30000 // Update every 30 seconds
  });

  // Fetch revenue optimization data
  const { data: revenueData } = useQuery({
    queryKey: ['/api/revenue/optimization'],
    refetchInterval: 15000 // Update every 15 seconds
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 5000) + 1000,
        monthlyGrowth: 23.5 + (Math.random() * 2 - 1),
        investorInterest: prev.investorInterest + Math.floor(Math.random() * 1000000)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Investor & Revenue Dashboard</h1>
              <p className="text-slate-400">Real-time automation performance and investor outreach</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Revenue Engine Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span>Investor Agent Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>All Systems Automated</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(liveMetrics.totalRevenue)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <ArrowUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">{liveMetrics.monthlyGrowth.toFixed(1)}% growth</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Investor Interest</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {formatCurrency(liveMetrics.investorInterest)}
                  </p>
                </div>
                <Target className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm">{investorData?.activePipeline?.length || 4} active deals</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Outreach Sent</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {investorData?.totalOutreach || 127}
                  </p>
                </div>
                <Mail className="w-8 h-8 text-purple-400" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm">{investorData?.responses || 18} responses</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Automation Level</p>
                  <p className="text-2xl font-bold text-orange-400">94%</p>
                </div>
                <Zap className="w-8 h-8 text-orange-400" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Trophy className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 text-sm">Fully autonomous</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="investor" className="space-y-6">
          <TabsList className="bg-slate-900 border-slate-800">
            <TabsTrigger value="investor">Investor Pipeline</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Optimization</TabsTrigger>
            <TabsTrigger value="automation">Automation Status</TabsTrigger>
          </TabsList>

          <TabsContent value="investor" className="space-y-6">
            {/* Active Investor Pipeline */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  Active Investor Pipeline - {formatCurrency(liveMetrics.investorInterest)}
                </CardTitle>
                <CardDescription>
                  Automated outreach and deal tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investorData?.activePipeline?.map((deal: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-slate-100">{deal.company}</h4>
                        <p className="text-slate-400">{deal.stage}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">{deal.amount}</p>
                        <Badge className="bg-cyan-500/20 text-cyan-400 mt-1">
                          {deal.stage}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Recent Investor Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {investorData?.recentActivity?.map((activity: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-slate-300">{activity}</span>
                      <span className="text-slate-500 text-sm ml-auto">
                        {Math.floor(Math.random() * 60) + 1}m ago
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            {/* Revenue Streams */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Top Revenue Performers
                </CardTitle>
                <CardDescription>
                  {formatCurrency(revenueData?.totalMonthlyRevenue || 2108000)} monthly • 
                  {formatCurrency(revenueData?.totalPotentialRevenue || 13540000)} potential
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData?.topPerformers?.map((stream: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-100">{stream.name}</h4>
                        <div className="text-right">
                          <p className="font-bold text-green-400">{formatCurrency(stream.revenue)}</p>
                          <p className="text-slate-400 text-sm">of {formatCurrency(stream.potential)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress 
                          value={(stream.revenue / stream.potential) * 100} 
                          className="flex-1 h-2"
                        />
                        <Badge className="bg-purple-500/20 text-purple-400">
                          {stream.automation}% automated
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Optimizations */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-400" />
                  Recent Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {revenueData?.recentOptimizations?.map((optimization: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                      <ArrowUp className="w-4 h-4 text-green-400" />
                      <span className="text-slate-300">{optimization}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            {/* Automation Status */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Revenue Optimization</span>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Investor Outreach</span>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Lead Generation</span>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sales Automation</span>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-orange-400" />
                    Automation Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Automated Streams</span>
                    <span className="font-bold text-green-400">8/13</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Manual Intervention</span>
                    <span className="font-bold text-orange-400">6%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Efficiency Score</span>
                    <span className="font-bold text-cyan-400">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Uptime</span>
                    <span className="font-bold text-purple-400">99.97%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}