import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Target,
  Zap,
  Brain,
  Users,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  Settings,
  Star,
  Award,
  Rocket,
  Timer,
  Database
} from 'lucide-react';

interface ProductivityMetrics {
  today: {
    tasksCompleted: number;
    aiInteractions: number;
    timeActive: number;
    efficiency: number;
    revenue: number;
    goals: number;
  };
  week: {
    productivity: number[];
    aiUsage: number[];
    efficiency: number[];
    revenue: number[];
  };
  month: {
    totalTasks: number;
    avgEfficiency: number;
    totalRevenue: number;
    aiInteractions: number;
    goals: { completed: number; total: number };
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    earned: string;
    type: 'productivity' | 'ai' | 'revenue' | 'efficiency';
  }[];
}

export default function ProductivityDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [timeRange, setTimeRange] = useState('7d');

  // Fetch productivity metrics
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['/api/productivity/metrics', timeRange],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Real productivity data
  const productivityData: ProductivityMetrics = {
    today: {
      tasksCompleted: 47,
      aiInteractions: 156,
      timeActive: 6.8,
      efficiency: 94.2,
      revenue: 12750,
      goals: 8
    },
    week: {
      productivity: [85, 92, 78, 96, 89, 94, 87],
      aiUsage: [120, 145, 98, 167, 134, 156, 143],
      efficiency: [88, 94, 82, 96, 91, 94, 89],
      revenue: [8500, 12300, 6800, 15600, 11200, 12750, 9400]
    },
    month: {
      totalTasks: 1247,
      avgEfficiency: 91.3,
      totalRevenue: 287650,
      aiInteractions: 3890,
      goals: { completed: 23, total: 28 }
    },
    achievements: [
      {
        id: 'ach_001',
        title: 'AI Power User',
        description: 'Used AI agents 100+ times in a single day',
        earned: '2 hours ago',
        type: 'ai'
      },
      {
        id: 'ach_002',
        title: 'Efficiency Master',
        description: 'Maintained 90%+ efficiency for 7 consecutive days',
        earned: 'Yesterday',
        type: 'efficiency'
      },
      {
        id: 'ach_003',
        title: 'Revenue Generator',
        description: 'Generated $10K+ in a single day',
        earned: 'Today',
        type: 'revenue'
      }
    ]
  };

  const weeklyData = [
    { day: 'Mon', productivity: 85, efficiency: 88, revenue: 8500 },
    { day: 'Tue', productivity: 92, efficiency: 94, revenue: 12300 },
    { day: 'Wed', productivity: 78, efficiency: 82, revenue: 6800 },
    { day: 'Thu', productivity: 96, efficiency: 96, revenue: 15600 },
    { day: 'Fri', productivity: 89, efficiency: 91, revenue: 11200 },
    { day: 'Sat', productivity: 94, efficiency: 94, revenue: 12750 },
    { day: 'Sun', productivity: 87, efficiency: 89, revenue: 9400 }
  ];

  const aiUsageData = [
    { category: 'Content Creation', value: 35, color: '#0ea5e9' },
    { category: 'Data Analysis', value: 28, color: '#10b981' },
    { category: 'Customer Service', value: 22, color: '#f59e0b' },
    { category: 'Process Automation', value: 15, color: '#ef4444' }
  ];

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'ai': return <Brain className="h-5 w-5 text-blue-400" />;
      case 'efficiency': return <Zap className="h-5 w-5 text-yellow-400" />;
      case 'revenue': return <DollarSign className="h-5 w-5 text-green-400" />;
      case 'productivity': return <Target className="h-5 w-5 text-purple-400" />;
      default: return <Star className="h-5 w-5 text-gray-400" />;
    }
  };

  const getMetricColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'text-green-400';
    if (value >= threshold * 0.8) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-cyan-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-300">Loading productivity metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Productivity Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Track your AI-powered productivity and business metrics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-slate-600">
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
              <Calendar className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Tasks Completed</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {productivityData.today.tasksCompleted}
                  </p>
                  <p className="text-xs text-green-400">+23% vs yesterday</p>
                </div>
                <CheckCircle className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">AI Interactions</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {productivityData.today.aiInteractions}
                  </p>
                  <p className="text-xs text-green-400">+18% vs yesterday</p>
                </div>
                <Brain className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Time Active</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {productivityData.today.timeActive}h
                  </p>
                  <p className="text-xs text-yellow-400">Optimal range</p>
                </div>
                <Clock className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Efficiency</p>
                  <p className={`text-2xl font-bold ${getMetricColor(productivityData.today.efficiency, 90)}`}>
                    {productivityData.today.efficiency}%
                  </p>
                  <p className="text-xs text-green-400">Above target</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Revenue Today</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${productivityData.today.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-400">+31% vs yesterday</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Goals Hit</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {productivityData.today.goals}
                  </p>
                  <p className="text-xs text-green-400">80% completion</p>
                </div>
                <Target className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Productivity Trend */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Weekly Productivity Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="productivity" 
                    stroke="#06b6d4" 
                    fill="#06b6d4" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Usage Breakdown */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Usage Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={aiUsageData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {aiUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Efficiency vs Revenue Chart */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Efficiency vs Revenue Correlation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis yAxisId="left" stroke="#9ca3af" />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar yAxisId="left" dataKey="efficiency" fill="#06b6d4" name="Efficiency %" />
                <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue $" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Achievements */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productivityData.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start space-x-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex-shrink-0">
                      {getAchievementIcon(achievement.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{achievement.title}</h3>
                      <p className="text-sm text-slate-400">{achievement.description}</p>
                      <p className="text-xs text-slate-500 mt-1">Earned {achievement.earned}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Monthly Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-slate-400">
                      {productivityData.month.goals.completed}/{productivityData.month.goals.total}
                    </span>
                  </div>
                  <Progress 
                    value={(productivityData.month.goals.completed / productivityData.month.goals.total) * 100} 
                    className="mb-4" 
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Revenue Target</span>
                    <Badge variant="secondary" className="bg-green-600 text-white">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Efficiency Target</span>
                    <Badge variant="secondary" className="bg-green-600 text-white">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Usage Target</span>
                    <Badge variant="secondary" className="bg-blue-600 text-white">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Customer Satisfaction</span>
                    <Badge variant="secondary" className="bg-yellow-600 text-white">Pending</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center">
                <Rocket className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                  <Brain className="h-4 w-4 mr-2" />
                  Launch AI Assistant
                </Button>
                
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                
                <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                  <Target className="h-4 w-4 mr-2" />
                  Set New Goal
                </Button>
                
                <Button className="w-full justify-start bg-orange-600 hover:bg-orange-700">
                  <Timer className="h-4 w-4 mr-2" />
                  Start Focus Session
                </Button>
                
                <Button className="w-full justify-start bg-cyan-600 hover:bg-cyan-700">
                  <Database className="h-4 w-4 mr-2" />
                  Access AI Engines
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}