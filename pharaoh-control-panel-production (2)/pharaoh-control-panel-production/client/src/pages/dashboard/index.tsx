import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useSocketStore } from '@/lib/socketClient';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Database,
  Download,
  FileText,
  HardDrive,
  Layers,
  LayoutDashboard,
  LineChart,
  Network,
  RefreshCw,
  Server,
  Shield,
  ShieldAlert,
  Terminal,
  Zap
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { format, formatDistanceToNow } from 'date-fns';

// Server metric type
interface ServerMetric {
  name: string;
  value: number;
  change: number;
  status: 'healthy' | 'attention' | 'critical';
}

// Performance data type
interface PerformanceData {
  timestamps: string[];
  cpu: number[];
  memory: number[];
  network: number[];
  disk: number[];
}

// Server health score type
interface ServerHealthScore {
  overall: number;
  components: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    security: number;
  };
  trend: 'up' | 'down' | 'stable';
  history: {
    date: string;
    score: number;
  }[];
}

// Healing event type
interface HealingEvent {
  id: number;
  title: string;
  description: string;
  type: 'warning' | 'error' | 'success';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  timestamp: string;
}

// Activity log type
interface ActivityLog {
  id: number;
  title: string;
  description: string;
  type: string;
  timestamp: string;
  source: string;
}

// Alert type
interface Alert {
  id: number;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'acknowledged' | 'resolved';
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const socketEvents = useSocketStore(state => state.socketEvents);
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch server metrics
  const { data: metrics = [], isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['/api/monitoring/metrics'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/monitoring/metrics');
      if (!response.ok) {
        throw new Error('Failed to fetch server metrics');
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch performance data
  const { data: performance, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ['/api/monitoring/performance', timeRange],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/monitoring/performance?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch performance data');
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch server health score
  const { data: healthScore, isLoading: isLoadingHealthScore } = useQuery({
    queryKey: ['/api/monitoring/health-score', timeRange],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/monitoring/health-score?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch server health score');
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch recent healing events
  const { data: healingEvents = [], isLoading: isLoadingHealingEvents } = useQuery({
    queryKey: ['/api/healing/events/recent'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/healing/events/recent');
      if (!response.ok) {
        throw new Error('Failed to fetch recent healing events');
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch activity logs
  const { data: activityLogs = [], isLoading: isLoadingActivityLogs } = useQuery({
    queryKey: ['/api/activity/logs'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/activity/logs');
      if (!response.ok) {
        throw new Error('Failed to fetch activity logs');
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch alerts
  const { data: alerts = [], isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['/api/monitoring/alerts'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/monitoring/alerts');
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Listen for real-time metric updates
  useEffect(() => {
    const metricUpdates = socketEvents['metric-update'] || [];
    if (metricUpdates.length > 0) {
      // Real-time updates handled by the socket store
    }
  }, [socketEvents]);

  // Set loading state
  useEffect(() => {
    setIsLoading(
      isLoadingMetrics || 
      isLoadingPerformance || 
      isLoadingHealthScore || 
      isLoadingHealingEvents || 
      isLoadingActivityLogs || 
      isLoadingAlerts
    );
  }, [
    isLoadingMetrics, 
    isLoadingPerformance, 
    isLoadingHealthScore, 
    isLoadingHealingEvents, 
    isLoadingActivityLogs, 
    isLoadingAlerts
  ]);

  // Placeholder data for demo
  const placeholderMetrics: ServerMetric[] = [
    {
      name: 'CPU Usage',
      value: 42,
      change: -2.5,
      status: 'healthy'
    },
    {
      name: 'Memory Usage',
      value: 63,
      change: 5.1,
      status: 'attention'
    },
    {
      name: 'Disk Usage',
      value: 78,
      change: 1.2,
      status: 'attention'
    },
    {
      name: 'Network Load',
      value: 36,
      change: -4.3,
      status: 'healthy'
    },
    {
      name: 'SSL Certificate',
      value: 15,
      change: 0,
      status: 'attention'
    },
    {
      name: 'Response Time',
      value: 142,
      change: -12.5,
      status: 'healthy'
    },
    {
      name: 'Security Score',
      value: 92,
      change: 4.0,
      status: 'healthy'
    },
    {
      name: 'Error Rate',
      value: 1.2,
      change: -0.5,
      status: 'healthy'
    }
  ];

  const placeholderPerformance: PerformanceData = {
    timestamps: Array.from({ length: 24 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - 24 + i);
      return date.toISOString();
    }),
    cpu: Array.from({ length: 24 }, () => Math.floor(Math.random() * 40) + 20),
    memory: Array.from({ length: 24 }, () => Math.floor(Math.random() * 30) + 50),
    network: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50) + 10),
    disk: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10) + 70)
  };

  const placeholderHealthScore: ServerHealthScore = {
    overall: 87,
    components: {
      cpu: 92,
      memory: 84,
      disk: 75,
      network: 95,
      security: 90
    },
    trend: 'up',
    history: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 7 + i);
      return {
        date: date.toISOString(),
        score: Math.floor(Math.random() * 15) + 75
      };
    })
  };

  const placeholderHealingEvents: HealingEvent[] = [
    {
      id: 1,
      title: 'High CPU Usage Detected',
      description: 'Automatically optimized process priorities',
      type: 'warning',
      status: 'completed',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString()
    },
    {
      id: 2,
      title: 'Database Connection Issue',
      description: 'Connection pool exhaustion detected and fixed',
      type: 'error',
      status: 'in-progress',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString()
    }
  ];

  const placeholderActivityLogs: ActivityLog[] = [
    {
      id: 1,
      title: 'System Update',
      description: 'Applied security patches to kernel',
      type: 'system',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      source: 'system-updater'
    },
    {
      id: 2,
      title: 'Database Optimization',
      description: 'Optimized indexes for improved query performance',
      type: 'database',
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
      source: 'db-optimizer'
    },
    {
      id: 3,
      title: 'User Login',
      description: 'Admin user logged in from 192.168.1.105',
      type: 'security',
      timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
      source: 'auth-service'
    }
  ];

  const placeholderAlerts: Alert[] = [
    {
      id: 1,
      title: 'SSL Certificate Expiring',
      description: 'Your SSL certificate will expire in 15 days',
      severity: 'medium',
      status: 'new',
      timestamp: new Date(Date.now() - 12 * 3600000).toISOString()
    },
    {
      id: 2,
      title: 'Disk Space Warning',
      description: 'Server disk usage is at 78%, consider cleanup',
      severity: 'low',
      status: 'acknowledged',
      timestamp: new Date(Date.now() - 8 * 3600000).toISOString()
    }
  ];

  // Use placeholder data for demo
  const serverMetrics = metrics.length > 0 ? metrics : placeholderMetrics;
  const performanceData = performance || placeholderPerformance;
  const serverHealthScore = healthScore || placeholderHealthScore;
  const recentHealingEvents = healingEvents.length > 0 ? healingEvents : placeholderHealingEvents;
  const recentActivityLogs = activityLogs.length > 0 ? activityLogs : placeholderActivityLogs;
  const currentAlerts = alerts.length > 0 ? alerts : placeholderAlerts;

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-500';
      case 'attention':
        return 'bg-amber-500';
      case 'critical':
        return 'bg-rose-500';
      default:
        return 'bg-slate-500';
    }
  };

  // Helper function to get change indicator
  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return <span className="text-emerald-500">↑ {change.toFixed(1)}%</span>;
    } else if (change < 0) {
      return <span className="text-rose-500">↓ {Math.abs(change).toFixed(1)}%</span>;
    } else {
      return <span className="text-slate-500">―</span>;
    }
  };

  // Helper function to get alert severity badge
  const getAlertSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-rose-500 hover:bg-rose-600">Critical</Badge>;
      case 'high':
        return <Badge className="bg-red-500 hover:bg-red-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Low</Badge>;
      default:
        return <Badge className="bg-slate-500 hover:bg-slate-600">{severity}</Badge>;
    }
  };

  // Helper function to get event type icon
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-rose-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      default:
        return <Activity className="h-5 w-5 text-blue-500" />;
    }
  };

  // Helper function to get activity log icon
  const getActivityLogIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <Server className="h-5 w-5 text-blue-500" />;
      case 'database':
        return <Database className="h-5 w-5 text-indigo-500" />;
      case 'security':
        return <Shield className="h-5 w-5 text-emerald-500" />;
      case 'network':
        return <Network className="h-5 w-5 text-amber-500" />;
      case 'user':
        return <Terminal className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-slate-500" />;
    }
  };

  // Helper function to get health score color
  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-blue-600"></div>
          <p className="text-slate-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">PHARAOH</span> Control Panel
          </h1>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-blue-500 px-3 py-1">
              <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
              Connected
            </Badge>
            <Badge variant="outline" className="border-emerald-500 px-3 py-1">
              <div className="mr-2 h-2 w-2 rounded-full bg-emerald-500"></div>
              {user?.plan || 'Free'}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Welcome section */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              Welcome back, {user?.firstName || user?.email?.split('@')[0] || 'User'}
            </h2>
            <p className="text-slate-400">
              Here's what's happening with your server today
            </p>
          </div>
          
          {/* Time range selector */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-400">Time range:</p>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 border-slate-700 bg-slate-800">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800">
                <SelectItem value="1h">Last hour</SelectItem>
                <SelectItem value="6h">Last 6 hours</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-slate-700 bg-slate-800"
              onClick={() => {
                // Refresh data
              }}
            >
              <RefreshCw className="h-4 w-4 text-slate-400" />
            </Button>
          </div>
        </div>

        {/* Health score section */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Server Health Score</CardTitle>
              <CardDescription>Overall health assessment of your server</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <div className="relative flex h-32 w-32 items-center justify-center">
                  {/* Score indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`text-4xl font-bold ${getHealthScoreColor(serverHealthScore.overall)}`}>
                      {serverHealthScore.overall}
                    </div>
                  </div>
                  {/* Circular progress */}
                  <svg className="h-full w-full -rotate-90 transform">
                    <circle
                      className="text-slate-800"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className={`${
                        serverHealthScore.overall >= 90
                          ? 'text-emerald-500'
                          : serverHealthScore.overall >= 70
                          ? 'text-blue-500'
                          : serverHealthScore.overall >= 50
                          ? 'text-amber-500'
                          : 'text-rose-500'
                      }`}
                      strokeWidth="10"
                      strokeDasharray={360}
                      strokeDashoffset={360 - (360 * serverHealthScore.overall) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                  </svg>
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm text-slate-400">CPU Health</span>
                      <span className="text-sm font-medium text-white">{serverHealthScore.components.cpu}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${serverHealthScore.components.cpu}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm text-slate-400">Memory Health</span>
                      <span className="text-sm font-medium text-white">{serverHealthScore.components.memory}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full bg-indigo-500"
                        style={{ width: `${serverHealthScore.components.memory}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm text-slate-400">Disk Health</span>
                      <span className="text-sm font-medium text-white">{serverHealthScore.components.disk}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${serverHealthScore.components.disk}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge
                    className={`${
                      serverHealthScore.trend === 'up'
                        ? 'bg-emerald-500'
                        : serverHealthScore.trend === 'down'
                        ? 'bg-rose-500'
                        : 'bg-blue-500'
                    }`}
                  >
                    {serverHealthScore.trend === 'up' ? '↑ Improving' : serverHealthScore.trend === 'down' ? '↓ Declining' : '→ Stable'}
                  </Badge>
                  <span className="text-xs text-slate-400">Past 7 days</span>
                </div>
                <Link href="/health-report">
                  <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                    View detailed report <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Alerts section */}
          <Card className="border-slate-800 bg-slate-900 lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-white">Active Alerts</CardTitle>
                  <CardDescription>Issues requiring your attention</CardDescription>
                </div>
                <Badge className="bg-blue-500">{currentAlerts.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentAlerts.length === 0 ? (
                  <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-950 p-4">
                    <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-500" />
                    <p className="text-sm text-slate-400">No active alerts</p>
                    <p className="text-xs text-slate-500">Your server is running smoothly</p>
                  </div>
                ) : (
                  currentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start space-x-4 rounded-lg border border-slate-800 bg-slate-950 p-4"
                    >
                      <div>
                        <ShieldAlert className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <h4 className="font-medium text-white">{alert.title}</h4>
                          {getAlertSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-sm text-slate-400">{alert.description}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                          </span>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="h-7 border-slate-700 px-2 text-xs">
                              Ignore
                            </Button>
                            <Button size="sm" className="h-7 bg-blue-600 px-2 text-xs hover:bg-blue-700">
                              Resolve
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-800 pt-4">
              <Button variant="ghost" className="w-full text-slate-400 hover:text-white">
                View all alerts <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Server metrics */}
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Server Metrics</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {serverMetrics.map((metric, index) => (
              <Card key={index} className="border-slate-800 bg-slate-900">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-400">{metric.name}</CardTitle>
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(metric.status)}`}></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-bold text-white">
                      {metric.name.includes('SSL')
                        ? `${metric.value} days`
                        : metric.name.includes('Time')
                        ? `${metric.value} ms`
                        : metric.name.includes('Rate')
                        ? `${metric.value}%`
                        : `${metric.value}%`}
                    </div>
                    <div className="text-sm">{getChangeIndicator(metric.change)}</div>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full ${
                        metric.status === 'healthy'
                          ? 'bg-emerald-500'
                          : metric.status === 'attention'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main tabs */}
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="border-b border-slate-800 bg-transparent pb-0">
            <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Performance
            </TabsTrigger>
            <TabsTrigger value="healing" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Self-Healing
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Overview tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Server Status */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Server className="h-5 w-5 text-blue-500" />
                    Server Status
                  </CardTitle>
                  <CardDescription>Current server health and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-400">Status</span>
                      <Badge className="bg-emerald-500 hover:bg-emerald-600">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-400">Uptime</span>
                      <span className="text-white">99.98%</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-400">Last Restart</span>
                      <span className="text-white">3 days ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Active Services</span>
                      <span className="text-white">14/14</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Load */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-blue-500" />
                    System Load
                  </CardTitle>
                  <CardDescription>Current resource utilization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">CPU</span>
                        <span className="text-white">42%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full bg-blue-500" style={{ width: `42%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">Memory</span>
                        <span className="text-white">63%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full bg-indigo-500" style={{ width: `63%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">Disk</span>
                        <span className="text-white">78%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full bg-amber-500" style={{ width: `78%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">Network</span>
                        <span className="text-white">36%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full bg-emerald-500" style={{ width: `36%` }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Self-Healing */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-blue-500" />
                    Self-Healing
                  </CardTitle>
                  <CardDescription>Recent automated fixes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentHealingEvents.map((event) => (
                      <div key={event.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                        <div className="flex items-center gap-2">
                          {getEventTypeIcon(event.type)}
                          <span className="text-white">{event.title}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-400">{event.description}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-xs text-slate-500">
                            {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                          </p>
                          <Badge
                            className={
                              event.status === 'completed'
                                ? 'bg-emerald-500'
                                : event.status === 'in-progress'
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }
                          >
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full border-slate-700 text-slate-400 hover:border-blue-500 hover:text-white"
                      onClick={() => window.location.href = '/self-healing'}
                    >
                      View all healing events
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance tab */}
          <TabsContent value="performance" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Performance Charts */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>Detailed performance analysis over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <div className="flex h-full flex-col items-center justify-center">
                      <LineChart className="mb-4 h-12 w-12 text-slate-700" />
                      <p className="text-slate-400">Performance chart visualization would render here</p>
                      <p className="mt-2 text-sm text-slate-500">
                        Showing {performanceData.timestamps.length} data points over {timeRange}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Breakdown */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* CPU & Memory */}
                <Card className="border-slate-800 bg-slate-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Cpu className="h-5 w-5 text-blue-500" />
                      CPU & Memory Usage
                    </CardTitle>
                    <CardDescription>Detailed utilization breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-slate-300">Top CPU Processes</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 p-2">
                            <span className="text-sm text-slate-400">nginx</span>
                            <span className="text-sm text-white">12.4%</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 p-2">
                            <span className="text-sm text-slate-400">node</span>
                            <span className="text-sm text-white">8.7%</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 p-2">
                            <span className="text-sm text-slate-400">postgres</span>
                            <span className="text-sm text-white">6.2%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-slate-300">Memory Allocation</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 p-2">
                            <span className="text-sm text-slate-400">System</span>
                            <span className="text-sm text-white">1.2 GB</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 p-2">
                            <span className="text-sm text-slate-400">Applications</span>
                            <span className="text-sm text-white">2.8 GB</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 p-2">
                            <span className="text-sm text-slate-400">Cache</span>
                            <span className="text-sm text-white">1.6 GB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Storage & Network */}
                <Card className="border-slate-800 bg-slate-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <HardDrive className="h-5 w-5 text-blue-500" />
                      Storage & Network
                    </CardTitle>
                    <CardDescription>Disk and network utilization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-slate-300">Disk Usage</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 p-2">
                            <span className="text-sm text-slate-400">/dev/sda1</span>
                            <span className="text-sm text-white">78% (156 GB)</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 p-2">
                            <span className="text-sm text-slate-400">/dev/sdb1</span>
                            <span className="text-sm text-white">42% (420 GB)</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-slate-300">Network Traffic</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 p-2">
                            <span className="text-sm text-slate-400">Inbound</span>
                            <span className="text-sm text-white">2.4 MB/s</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 p-2">
                            <span className="text-sm text-slate-400">Outbound</span>
                            <span className="text-sm text-white">1.8 MB/s</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 p-2">
                            <span className="text-sm text-slate-400">Active Connections</span>
                            <span className="text-sm text-white">142</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Self-Healing tab */}
          <TabsContent value="healing" className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Healing Events */}
              <Card className="border-slate-800 bg-slate-900 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-blue-500" />
                    Self-Healing Events
                  </CardTitle>
                  <CardDescription>Recent automated remediation activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentHealingEvents.length === 0 ? (
                      <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-950 p-4">
                        <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-500" />
                        <p className="text-sm text-slate-400">No healing events</p>
                        <p className="text-xs text-slate-500">Your server is running smoothly</p>
                      </div>
                    ) : (
                      recentHealingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getEventTypeIcon(event.type)}
                              <h4 className="font-medium text-white">{event.title}</h4>
                            </div>
                            <Badge
                              className={
                                event.status === 'completed'
                                  ? 'bg-emerald-500'
                                  : event.status === 'in-progress'
                                  ? 'bg-blue-500'
                                  : 'bg-amber-500'
                              }
                            >
                              {event.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400">{event.description}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center text-xs text-slate-500">
                              <Clock className="mr-1 h-3 w-3" />
                              {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-blue-400 hover:text-blue-300"
                            >
                              View details
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-800 pt-4">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.location.href = '/self-healing'}
                  >
                    View all healing events
                  </Button>
                </CardFooter>
              </Card>

              {/* AI Models */}
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Layers className="h-5 w-5 text-blue-500" />
                    Active AI Models
                  </CardTitle>
                  <CardDescription>Models powering your server</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-blue-500/10 p-2">
                          <Shield className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">ServerGuard AI</h4>
                          <p className="text-xs text-slate-500">Security & Protection</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-indigo-500/10 p-2">
                          <Zap className="h-4 w-4 text-indigo-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">PerformanceBoost</h4>
                          <p className="text-xs text-slate-500">Optimization</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-emerald-500/10 p-2">
                          <Database className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">DatabaseWizard</h4>
                          <p className="text-xs text-slate-500">Database Optimization</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-800 pt-4">
                  <Button
                    variant="outline"
                    className="w-full border-blue-500 text-blue-400 hover:bg-blue-950/20"
                    onClick={() => window.location.href = '/marketplace'}
                  >
                    <Download className="mr-2 h-4 w-4" /> Get more AI models
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Activity tab */}
          <TabsContent value="activity" className="mt-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest events on your server</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivityLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-4 rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <div className="rounded-full bg-slate-800 p-2">
                        {getActivityLogIcon(log.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{log.title}</h4>
                        <p className="text-sm text-slate-400">{log.description}</p>
                        <div className="mt-2 flex items-center text-xs text-slate-500">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                          <Badge className="ml-2 bg-slate-700">{log.source}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-800 pt-4">
                <Button variant="ghost" className="w-full text-slate-400 hover:text-white">
                  View all activity <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;