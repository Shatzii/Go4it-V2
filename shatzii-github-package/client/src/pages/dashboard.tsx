import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Clock,
  CheckCircle,
  DollarSign,
  Users,
  Zap,
  Calendar,
  Award,
  Activity,
  Plus,
  Home,
  Bot
} from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";

interface UserMetrics {
  id: number;
  userId: number;
  date: string;
  tasksCompleted: number;
  timeSpent: number;
  leadsGenerated: number;
  dealsCreated: number;
  revenue: string;
  efficiency: string;
}

interface UserGoals {
  id: number;
  userId: number;
  type: string;
  category: string;
  target: string;
  current: string;
  period: string;
  achieved: boolean;
}

interface UserActivities {
  id: number;
  userId: number;
  type: string;
  description: string;
  metadata?: string;
  timestamp: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Fetch user metrics
  const { data: metrics = [], isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/user/metrics', user?.id],
    enabled: !!user?.id
  });

  // Fetch user goals
  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ['/api/user/goals', user?.id],
    enabled: !!user?.id
  });

  // Fetch user activities
  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/user/activities', user?.id],
    enabled: !!user?.id
  });

  // Calculate summary statistics
  const todayMetrics = metrics.find((m: UserMetrics) => m.date === new Date().toISOString().split('T')[0]);
  const weekMetrics = metrics.filter((m: UserMetrics) => {
    const metricDate = new Date(m.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return metricDate >= weekAgo;
  });

  const totalRevenue = weekMetrics.reduce((sum, m) => sum + parseFloat(m.revenue || '0'), 0);
  const totalTasks = weekMetrics.reduce((sum, m) => sum + (m.tasksCompleted || 0), 0);
  const totalLeads = weekMetrics.reduce((sum, m) => sum + (m.leadsGenerated || 0), 0);
  const avgEfficiency = weekMetrics.length > 0 
    ? weekMetrics.reduce((sum, m) => sum + parseFloat(m.efficiency || '0'), 0) / weekMetrics.length 
    : 0;

  // Active goals by type
  const dailyGoals = goals.filter((g: UserGoals) => g.type === 'daily' && !g.achieved);
  const weeklyGoals = goals.filter((g: UserGoals) => g.type === 'weekly' && !g.achieved);
  const monthlyGoals = goals.filter((g: UserGoals) => g.type === 'monthly' && !g.achieved);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Please log in to view your dashboard</h1>
            <p className="text-gray-400">Access your personalized productivity metrics and goals</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-gray-400">
              Track your productivity and achieve your goals with AI-powered insights
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-400">Today's Tasks</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{todayMetrics?.tasksCompleted || 0}</div>
                <div className="text-xs text-gray-400">
                  {todayMetrics?.timeSpent || 0} minutes focused
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-400">Weekly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
                <div className="text-xs text-green-400">
                  +{totalLeads} leads generated
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-400">Efficiency</CardTitle>
                  <Zap className="h-4 w-4 text-yellow-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{avgEfficiency.toFixed(1)}%</div>
                <div className="text-xs text-yellow-400">
                  Average this week
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-400">Active Goals</CardTitle>
                  <Target className="h-4 w-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {dailyGoals.length + weeklyGoals.length + monthlyGoals.length}
                </div>
                <div className="text-xs text-blue-400">
                  In progress
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-slate-800 border-slate-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
                Overview
              </TabsTrigger>
              <TabsTrigger value="goals" className="data-[state=active]:bg-slate-700">
                Goals
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-slate-700">
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Performance Chart */}
                <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Weekly Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {weekMetrics.slice(0, 7).map((metric: UserMetrics, index) => (
                        <div key={metric.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">
                              {new Date(metric.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-white">{metric.tasksCompleted} tasks</span>
                          </div>
                          <Progress 
                            value={Math.min((metric.tasksCompleted / 10) * 100, 100)} 
                            className="h-2" 
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Log Task Completion
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Target className="h-4 w-4 mr-2" />
                      Set New Goal
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      AI Insights
                    </Button>
                    <Link href="/roofing-ai">
                      <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                        <Home className="h-4 w-4 mr-2" />
                        Roofing AI Engine
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Daily Goals */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Daily Goals</CardTitle>
                    <Badge variant="secondary">{dailyGoals.length} active</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {dailyGoals.length === 0 ? (
                      <p className="text-gray-400 text-sm">No active daily goals</p>
                    ) : (
                      dailyGoals.map((goal: UserGoals) => (
                        <div key={goal.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300 capitalize">{goal.category}</span>
                            <span className="text-white">{goal.current}/{goal.target}</span>
                          </div>
                          <Progress 
                            value={Math.min((parseFloat(goal.current) / parseFloat(goal.target)) * 100, 100)} 
                            className="h-2" 
                          />
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Weekly Goals */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Weekly Goals</CardTitle>
                    <Badge variant="secondary">{weeklyGoals.length} active</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {weeklyGoals.length === 0 ? (
                      <p className="text-gray-400 text-sm">No active weekly goals</p>
                    ) : (
                      weeklyGoals.map((goal: UserGoals) => (
                        <div key={goal.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300 capitalize">{goal.category}</span>
                            <span className="text-white">{goal.current}/{goal.target}</span>
                          </div>
                          <Progress 
                            value={Math.min((parseFloat(goal.current) / parseFloat(goal.target)) * 100, 100)} 
                            className="h-2" 
                          />
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Monthly Goals */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Monthly Goals</CardTitle>
                    <Badge variant="secondary">{monthlyGoals.length} active</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {monthlyGoals.length === 0 ? (
                      <p className="text-gray-400 text-sm">No active monthly goals</p>
                    ) : (
                      monthlyGoals.map((goal: UserGoals) => (
                        <div key={goal.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300 capitalize">{goal.category}</span>
                            <span className="text-white">{goal.current}/{goal.target}</span>
                          </div>
                          <Progress 
                            value={Math.min((parseFloat(goal.current) / parseFloat(goal.target)) * 100, 100)} 
                            className="h-2" 
                          />
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Productivity Trends */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Productivity Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Tasks Completed</span>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-400" />
                          <span className="text-green-400">+15% vs last week</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Time Efficiency</span>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-400" />
                          <span className="text-green-400">+8% vs last week</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Revenue Generated</span>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-400" />
                          <span className="text-green-400">+22% vs last week</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Insights */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">AI Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Award className="h-5 w-5 text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-blue-400 font-medium">Peak Performance</p>
                            <p className="text-gray-300 text-sm">
                              You're most productive between 9-11 AM. Consider scheduling important tasks during this window.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-purple-400 mt-0.5" />
                          <div>
                            <p className="text-purple-400 font-medium">Goal Optimization</p>
                            <p className="text-gray-300 text-sm">
                              Based on your patterns, breaking larger goals into 2-hour focused sessions increases completion by 34%.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No recent activity</p>
                    ) : (
                      activities.slice(0, 10).map((activity: UserActivities) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-gray-300">{activity.description}</p>
                            <p className="text-gray-500 text-xs">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}