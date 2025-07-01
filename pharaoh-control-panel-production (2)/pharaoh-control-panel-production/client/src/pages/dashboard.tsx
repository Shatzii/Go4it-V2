import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { 
  Activity, 
  Cpu, 
  Database, 
  HardDrive, 
  Network, 
  Shield, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Server, 
  TrendingUp, 
  Clock, 
  Bell,
  Eye,
  RefreshCw
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ServerMetric {
  name: string;
  value: number;
  change: number;
  status: 'healthy' | 'attention' | 'critical';
  unit: string;
}

interface ServerPerformanceData {
  cpu: number[];
  memory: number[];
  network: number[];
  timestamps: string[];
}

interface DashboardStats {
  totalServers: number;
  activeServers: number;
  totalUsers: number;
  healingEvents: number;
  avgResponseTime: number;
  uptime: string;
}

interface AlertItem {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  serverId?: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('24h');

  // Generate sample performance data for charts
  const generateSampleData = () => {
    const now = new Date();
    const data = [];
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        cpu: Math.floor(Math.random() * 30) + 40 + Math.sin(i / 4) * 15,
        memory: Math.floor(Math.random() * 20) + 60 + Math.cos(i / 3) * 10,
        network: Math.floor(Math.random() * 40) + 20,
        disk: Math.floor(Math.random() * 15) + 75,
      });
    }
    return data;
  };

  const performanceData = generateSampleData();

  // Sample metrics data
  const sampleMetrics: ServerMetric[] = [
    { name: 'CPU Usage', value: 68, change: -5.2, status: 'healthy', unit: '%' },
    { name: 'Memory Usage', value: 72, change: 2.1, status: 'attention', unit: '%' },
    { name: 'Disk Usage', value: 84, change: 1.8, status: 'attention', unit: '%' },
    { name: 'Network I/O', value: 45, change: -12.3, status: 'healthy', unit: 'MB/s' },
    { name: 'Active Connections', value: 1247, change: 15.7, status: 'healthy', unit: '' },
    { name: 'Response Time', value: 156, change: -8.4, status: 'healthy', unit: 'ms' },
  ];

  // Sample dashboard stats
  const sampleStats: DashboardStats = {
    totalServers: 12,
    activeServers: 11,
    totalUsers: 156,
    healingEvents: 23,
    avgResponseTime: 156,
    uptime: '99.97%'
  };

  // Sample alerts
  const sampleAlerts: AlertItem[] = [
    {
      id: 'alert-1',
      type: 'warning',
      title: 'High Memory Usage',
      message: 'Memory usage on Server-01 has exceeded 85% threshold',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      serverId: 'server-01'
    },
    {
      id: 'alert-2',
      type: 'info',
      title: 'Backup Completed',
      message: 'Scheduled backup for Database-Primary completed successfully',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
      id: 'alert-3',
      type: 'error',
      title: 'Service Restart',
      message: 'Nginx service was automatically restarted due to failure',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      serverId: 'server-02'
    }
  ];

  // Sample server distribution data
  const serverDistribution = [
    { name: 'Production', value: 8, color: '#3b82f6' },
    { name: 'Staging', value: 2, color: '#f59e0b' },
    { name: 'Development', value: 2, color: '#10b981' },
  ];

  // Fetch dashboard data
  const { data: metrics = sampleMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/dashboard/metrics');
      if (!response.ok) return sampleMetrics;
      return response.json();
    },
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: stats = sampleStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/dashboard/stats');
      if (!response.ok) return sampleStats;
      return response.json();
    },
    enabled: !!user,
  });

  const { data: alerts = sampleAlerts, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['/api/dashboard/alerts'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/dashboard/alerts');
      if (!response.ok) return sampleAlerts;
      return response.json();
    },
    enabled: !!user,
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-emerald-500';
      case 'attention': return 'text-amber-500';
      case 'critical': return 'text-rose-500';
      default: return 'text-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'attention': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-rose-500" />;
      default: return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-rose-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-slate-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Advanced</span> Dashboard
              </h1>
              <p className="mt-2 text-slate-400">
                Real-time server monitoring and performance analytics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <Button variant="outline" size="sm" className="border-slate-700">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Servers</p>
                  <p className="text-2xl font-bold text-white">{stats.totalServers}</p>
                </div>
                <Server className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Servers</p>
                  <p className="text-2xl font-bold text-emerald-500">{stats.activeServers}</p>
                </div>
                <Activity className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Healing Events</p>
                  <p className="text-2xl font-bold text-white">{stats.healingEvents}</p>
                </div>
                <Shield className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Avg Response</p>
                  <p className="text-2xl font-bold text-white">{stats.avgResponseTime}ms</p>
                </div>
                <Clock className="h-8 w-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Uptime</p>
                  <p className="text-2xl font-bold text-emerald-500">{stats.uptime}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-slate-800 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Server Metrics */}
              <div className="lg:col-span-2">
                <Card className="border-slate-800 bg-slate-900">
                  <CardHeader>
                    <CardTitle className="text-white">System Metrics</CardTitle>
                    <CardDescription className="text-slate-400">
                      Real-time server performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {metrics.map((metric, index) => (
                        <div key={index} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(metric.status)}
                              <span className="text-sm font-medium text-slate-300">{metric.name}</span>
                            </div>
                            <Badge 
                              className={`${metric.change >= 0 ? 'bg-emerald-500' : 'bg-rose-500'} text-white text-xs`}
                            >
                              {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="flex items-baseline space-x-2">
                            <span className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                              {metric.value}{metric.unit}
                            </span>
                          </div>
                          <Progress 
                            value={metric.name.includes('Usage') ? metric.value : (metric.value / 2000) * 100} 
                            className="mt-2 h-2" 
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Server Distribution */}
              <div>
                <Card className="border-slate-800 bg-slate-900">
                  <CardHeader>
                    <CardTitle className="text-white">Server Distribution</CardTitle>
                    <CardDescription className="text-slate-400">
                      Servers by environment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={serverDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {serverDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: '1px solid #334155',
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      {serverDistribution.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="h-3 w-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-slate-300">{item.name}</span>
                          </div>
                          <span className="text-sm text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* CPU & Memory Chart */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white">CPU & Memory Usage</CardTitle>
                  <CardDescription className="text-slate-400">
                    Last 24 hours performance trend
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis 
                          dataKey="time" 
                          stroke="#64748b"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#64748b"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="cpu" 
                          stackId="1"
                          stroke="#3b82f6" 
                          fill="#3b82f6"
                          fillOpacity={0.3}
                          name="CPU %"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="memory" 
                          stackId="2"
                          stroke="#f59e0b" 
                          fill="#f59e0b"
                          fillOpacity={0.3}
                          name="Memory %"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Network & Disk Chart */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white">Network & Disk I/O</CardTitle>
                  <CardDescription className="text-slate-400">
                    Data transfer and storage activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis 
                          dataKey="time" 
                          stroke="#64748b"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#64748b"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="network" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={false}
                          name="Network MB/s"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="disk" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          dot={false}
                          name="Disk %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Recent Alerts</CardTitle>
                <CardDescription className="text-slate-400">
                  System notifications and important events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-start space-x-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-white">{alert.title}</h4>
                            <span className="text-xs text-slate-400">{formatTimestamp(alert.timestamp)}</span>
                          </div>
                          <p className="text-sm text-slate-300 mt-1">{alert.message}</p>
                          {alert.serverId && (
                            <Badge variant="outline" className="border-slate-700 text-slate-400 mt-2 text-xs">
                              {alert.serverId}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Performance Trends */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white">Performance Trends</CardTitle>
                  <CardDescription className="text-slate-400">
                    Weekly performance comparison
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData.slice(0, 7)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis 
                          dataKey="time" 
                          stroke="#64748b"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#64748b"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                        <Bar dataKey="cpu" fill="#3b82f6" name="CPU %" />
                        <Bar dataKey="memory" fill="#f59e0b" name="Memory %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* System Health Score */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-white">System Health Score</CardTitle>
                  <CardDescription className="text-slate-400">
                    Overall system performance rating
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-6xl font-bold text-emerald-500 mb-4">92</div>
                    <div className="text-xl text-white mb-2">Excellent</div>
                    <Progress value={92} className="h-3 mb-4" />
                    <p className="text-sm text-slate-400">
                      Your system is performing exceptionally well with minimal issues detected.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;