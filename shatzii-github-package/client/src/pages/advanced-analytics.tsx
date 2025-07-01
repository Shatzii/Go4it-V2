import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Activity, Users, DollarSign, Target, 
  Zap, Globe, BarChart3, PieChart as PieChartIcon, Brain, Cpu,
  Calendar, Filter, Download, RefreshCw, Eye, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Date picker component not available - using Select for time range

interface AnalyticsData {
  revenue: RevenueData[];
  verticals: VerticalData[];
  agents: AgentData[];
  performance: PerformanceData[];
  leads: LeadData[];
  conversion: ConversionData[];
  geographic: GeographicData[];
  trends: TrendData[];
}

interface RevenueData {
  date: string;
  total: number;
  recurring: number;
  oneTime: number;
  projection: number;
}

interface VerticalData {
  name: string;
  revenue: number;
  growth: number;
  agents: number;
  conversion: number;
  leads: number;
  color: string;
}

interface AgentData {
  id: string;
  name: string;
  vertical: string;
  performance: number;
  revenue: number;
  tasksCompleted: number;
  uptime: number;
  efficiency: number;
}

interface PerformanceData {
  metric: string;
  current: number;
  target: number;
  trend: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

interface LeadData {
  source: string;
  count: number;
  quality: number;
  conversion: number;
  revenue: number;
}

interface ConversionData {
  stage: string;
  count: number;
  rate: number;
  revenue: number;
}

interface GeographicData {
  region: string;
  revenue: number;
  leads: number;
  agents: number;
}

interface TrendData {
  date: string;
  metric: string;
  value: number;
  category: string;
}

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedVertical, setSelectedVertical] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ['/api/analytics/advanced', timeRange, selectedVertical],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const mockAnalytics: AnalyticsData = {
    revenue: [
      { date: '2025-01', total: 2840000, recurring: 2100000, oneTime: 740000, projection: 3200000 },
      { date: '2025-02', total: 3450000, recurring: 2680000, oneTime: 770000, projection: 3800000 },
      { date: '2025-03', total: 4120000, recurring: 3200000, oneTime: 920000, projection: 4600000 },
      { date: '2025-04', total: 4850000, recurring: 3780000, oneTime: 1070000, projection: 5400000 },
      { date: '2025-05', total: 5680000, recurring: 4450000, oneTime: 1230000, projection: 6300000 },
      { date: '2025-06', total: 6420000, recurring: 5100000, oneTime: 1320000, projection: 7200000 }
    ],
    verticals: [
      { name: 'Transportation', revenue: 45000000, growth: 34.5, agents: 28, conversion: 89.2, leads: 1247, color: '#3B82F6' },
      { name: 'Education', revenue: 32000000, growth: 28.7, agents: 22, conversion: 92.1, leads: 987, color: '#10B981' },
      { name: 'Healthcare', revenue: 28000000, growth: 42.1, agents: 25, conversion: 87.5, leads: 1156, color: '#F59E0B' },
      { name: 'Financial', revenue: 25000000, growth: 31.2, agents: 20, conversion: 94.3, leads: 834, color: '#EF4444' },
      { name: 'Legal', revenue: 22000000, growth: 26.8, agents: 18, conversion: 91.7, leads: 712, color: '#8B5CF6' },
      { name: 'Manufacturing', revenue: 18000000, growth: 38.9, agents: 24, conversion: 85.2, leads: 945, color: '#06B6D4' },
      { name: 'Retail', revenue: 15000000, growth: 29.4, agents: 16, conversion: 88.9, leads: 678, color: '#84CC16' },
      { name: 'Energy', revenue: 12000000, growth: 35.7, agents: 14, conversion: 86.1, leads: 523, color: '#F97316' },
      { name: 'Insurance', revenue: 10000000, growth: 27.3, agents: 12, conversion: 90.5, leads: 456, color: '#EC4899' },
      { name: 'Real Estate', revenue: 8000000, growth: 33.1, agents: 10, conversion: 87.8, leads: 389, color: '#6366F1' },
      { name: 'Government', revenue: 6000000, growth: 24.9, agents: 8, conversion: 85.7, leads: 234, color: '#14B8A6' },
      { name: 'Agriculture', revenue: 4000000, growth: 41.2, agents: 6, conversion: 83.4, leads: 167, color: '#F59E0B' },
      { name: 'Roofing', revenue: 4500000, growth: 45.8, agents: 5, conversion: 96.2, leads: 298, color: '#DC2626' }
    ],
    agents: [
      { id: 'lead-gen-001', name: 'Lead Generation AI', vertical: 'Marketing', performance: 94.2, revenue: 387500, tasksCompleted: 2847, uptime: 99.8, efficiency: 92.1 },
      { id: 'sales-qual-001', name: 'Lead Qualifier AI', vertical: 'Sales', performance: 96.8, revenue: 445000, tasksCompleted: 1789, uptime: 99.9, efficiency: 94.5 },
      { id: 'truck-opt-001', name: 'Route Optimizer', vertical: 'Transportation', performance: 98.1, revenue: 678000, tasksCompleted: 3456, uptime: 99.7, efficiency: 96.8 },
      { id: 'edu-admin-001', name: 'Student Analytics AI', vertical: 'Education', performance: 93.4, revenue: 234000, tasksCompleted: 1234, uptime: 99.5, efficiency: 91.2 },
      { id: 'health-diag-001', name: 'Diagnostic Assistant', vertical: 'Healthcare', performance: 97.2, revenue: 567000, tasksCompleted: 2145, uptime: 99.9, efficiency: 95.7 }
    ],
    performance: [
      { metric: 'System Uptime', current: 99.8, target: 99.9, trend: 0.2, status: 'excellent' },
      { metric: 'Response Time', current: 187, target: 200, trend: -5.2, status: 'excellent' },
      { metric: 'Lead Conversion', current: 89.4, target: 85.0, trend: 4.1, status: 'excellent' },
      { metric: 'Agent Efficiency', current: 94.2, target: 90.0, trend: 2.8, status: 'excellent' },
      { metric: 'Revenue Growth', current: 34.7, target: 25.0, trend: 12.3, status: 'excellent' },
      { metric: 'Customer Satisfaction', current: 92.1, target: 90.0, trend: 1.8, status: 'excellent' }
    ],
    leads: [
      { source: 'Autonomous Marketing', count: 2847, quality: 94.2, conversion: 89.4, revenue: 1247000 },
      { source: 'LinkedIn Prospecting', count: 1789, quality: 91.7, conversion: 87.2, revenue: 987000 },
      { source: 'Google Ads', count: 1456, quality: 87.3, conversion: 84.1, revenue: 756000 },
      { source: 'Referral Program', count: 987, quality: 96.1, conversion: 92.8, revenue: 534000 },
      { source: 'Industry Events', count: 654, quality: 89.5, conversion: 86.7, revenue: 423000 },
      { source: 'Content Marketing', count: 432, quality: 85.2, conversion: 81.3, revenue: 234000 }
    ],
    conversion: [
      { stage: 'Lead Generated', count: 8165, rate: 100, revenue: 0 },
      { stage: 'Qualified', count: 7348, rate: 90.0, revenue: 0 },
      { stage: 'Demo Scheduled', count: 5878, rate: 80.0, revenue: 0 },
      { stage: 'Proposal Sent', count: 4114, rate: 70.0, revenue: 0 },
      { stage: 'Negotiation', count: 2939, rate: 50.0, revenue: 0 },
      { stage: 'Closed Won', count: 1959, rate: 33.3, revenue: 4181000 }
    ],
    geographic: [
      { region: 'North America', revenue: 85000000, leads: 4532, agents: 89 },
      { region: 'Europe', revenue: 45000000, leads: 2876, agents: 67 },
      { region: 'Asia Pacific', revenue: 28000000, leads: 1945, agents: 34 },
      { region: 'Latin America', revenue: 8200000, leads: 567, agents: 12 }
    ],
    trends: [
      { date: '2025-01', metric: 'Revenue', value: 2840000, category: 'Financial' },
      { date: '2025-02', metric: 'Revenue', value: 3450000, category: 'Financial' },
      { date: '2025-03', metric: 'Revenue', value: 4120000, category: 'Financial' },
      { date: '2025-04', metric: 'Revenue', value: 4850000, category: 'Financial' },
      { date: '2025-05', metric: 'Revenue', value: 5680000, category: 'Financial' },
      { date: '2025-06', metric: 'Revenue', value: 6420000, category: 'Financial' }
    ]
  };

  const data = analytics || mockAnalytics;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive insights across all 13 AI verticals</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedVertical} onValueChange={setSelectedVertical}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verticals</SelectItem>
                {data.verticals?.map((vertical: any) => (
                  <SelectItem key={vertical.name} value={vertical.name.toLowerCase()}>
                    {vertical.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleRefresh} disabled={refreshing} size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">$166.2M</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +34.7% from last month
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Agents</p>
                  <p className="text-2xl font-bold text-blue-600">202</p>
                  <p className="text-xs text-blue-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15% this week
                  </p>
                </div>
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lead Conversion</p>
                  <p className="text-2xl font-bold text-purple-600">89.4%</p>
                  <p className="text-xs text-purple-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +4.1% improvement
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Uptime</p>
                  <p className="text-2xl font-bold text-orange-600">99.8%</p>
                  <p className="text-xs text-orange-600 flex items-center">
                    <Activity className="h-3 w-3 mr-1" />
                    Excellent performance
                  </p>
                </div>
                <Cpu className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="verticals">Verticals</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="geographic">Geographic</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Growth Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data.revenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${(value as number).toLocaleString()}`} />
                      <Area type="monotone" dataKey="total" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="projection" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vertical Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.verticals.slice(0, 6)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: $${(value / 1000000).toFixed(1)}M`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {data.verticals.slice(0, 6).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${(value as number).toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.performance.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <Badge variant={
                          metric.status === 'excellent' ? 'default' :
                          metric.status === 'good' ? 'secondary' :
                          metric.status === 'warning' ? 'destructive' : 'outline'
                        }>
                          {metric.status}
                        </Badge>
                      </div>
                      <Progress value={(metric.current / metric.target) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{metric.current}{metric.metric.includes('Time') ? 'ms' : '%'}</span>
                        <span className={metric.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                          {metric.trend > 0 ? '+' : ''}{metric.trend}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={data.revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${(value as number).toLocaleString()}`} />
                    <Bar dataKey="recurring" fill="#3B82F6" name="Recurring Revenue" />
                    <Bar dataKey="oneTime" fill="#10B981" name="One-time Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verticals Tab */}
          <TabsContent value="verticals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vertical Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart data={data.verticals} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => `$${(value as number).toLocaleString()}`} />
                    <Bar dataKey="revenue" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Agent Name</th>
                        <th className="text-left p-3">Vertical</th>
                        <th className="text-left p-3">Performance</th>
                        <th className="text-left p-3">Revenue</th>
                        <th className="text-left p-3">Tasks</th>
                        <th className="text-left p-3">Uptime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.agents.map((agent, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-3 font-medium">{agent.name}</td>
                          <td className="p-3">{agent.vertical}</td>
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <Progress value={agent.performance} className="h-2 w-16" />
                              <span>{agent.performance}%</span>
                            </div>
                          </td>
                          <td className="p-3">${agent.revenue.toLocaleString()}</td>
                          <td className="p-3">{agent.tasksCompleted.toLocaleString()}</td>
                          <td className="p-3">{agent.uptime}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.leads}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="source" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.conversion}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={data.performance}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis />
                    <Radar name="Current" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Geographic Tab */}
          <TabsContent value="geographic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={data.geographic}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${(value as number).toLocaleString()}`} />
                    <Bar dataKey="revenue" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}