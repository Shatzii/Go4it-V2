import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/lib/socketClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
//import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Cpu,
  Database,
  HardDrive,
  Network,
  RefreshCw,
  Server,
  Shield,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';

// Placeholder ServerMetric type
interface ServerMetric {
  name: string;
  value: number;
  change: number;
  status: 'healthy' | 'attention' | 'critical';
}

// Placeholder Performance data
interface PerformanceData {
  timestamps: string[];
  cpu: number[];
  memory: number[];
  network: number[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { subscribe, isConnected } = useSocket(user?.id);
  const [metrics, setMetrics] = useState<ServerMetric[]>([]);
  const [performance, setPerformance] = useState<PerformanceData>({
    timestamps: [],
    cpu: [],
    memory: [],
    network: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch metrics
        const metricsResponse = await fetch('/api/monitoring/metrics');
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          setMetrics(metricsData);
        }
        
        // Fetch performance data
        const performanceResponse = await fetch('/api/monitoring/performance');
        if (performanceResponse.ok) {
          const performanceData = await performanceResponse.json();
          setPerformance(performanceData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Subscribe to real-time metric updates
  useEffect(() => {
    if (!user?.id) return;
    
    const unsubscribe = subscribe('metric-update', (data) => {
      if (data.metrics && Array.isArray(data.metrics)) {
        setMetrics(data.metrics);
      }
    });
    
    return unsubscribe;
  }, [user?.id, subscribe]);
  
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
              {isConnected ? 'Connected' : 'Disconnected'}
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
        <div className="flex flex-col gap-6">
          {/* Welcome message */}
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white">
              Welcome back, {user?.firstName || user?.email?.split('@')[0] || 'User'}
            </h2>
            <p className="mt-2 text-slate-400">
              Your server is being monitored by the Pharaoh AI system. Here's the latest status and metrics.
            </p>
          </div>
          
          {/* Server metrics */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {metrics.slice(0, 8).map((metric, index) => (
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
          
          {/* Server management tabs */}
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="border-b border-slate-800 bg-transparent pb-0">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                Performance
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                Security
              </TabsTrigger>
              <TabsTrigger value="ai-analysis" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                AI Analysis
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-slate-800 bg-slate-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Server className="h-5 w-5 text-blue-500" />
                      Server Status
                    </CardTitle>
                    <CardDescription>
                      Current server health and status
                    </CardDescription>
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
                
                <Card className="border-slate-800 bg-slate-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="h-5 w-5 text-blue-500" />
                      System Load
                    </CardTitle>
                    <CardDescription>
                      Current resource utilization
                    </CardDescription>
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
                
                <Card className="border-slate-800 bg-slate-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="h-5 w-5 text-blue-500" />
                      Self-Healing
                    </CardTitle>
                    <CardDescription>
                      Recent automated fixes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-500 hover:bg-emerald-600">Fixed</Badge>
                          <span className="text-white">High memory usage in process</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-400">
                          Automatically detected and fixed excessive memory usage in database process.
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {format(new Date(Date.now() - 45 * 60000), 'MMM d, h:mm a')}
                        </p>
                      </div>
                      
                      <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-500 hover:bg-emerald-600">Fixed</Badge>
                          <span className="text-white">Disk space cleanup</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-400">
                          Performed automated log rotation and temporary file cleanup.
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {format(new Date(Date.now() - 3 * 3600000), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="mt-6">
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Cpu className="h-5 w-5 text-blue-500" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>
                    Detailed performance analysis over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-slate-400">Performance charts would render here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-6">
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Security Status
                  </CardTitle>
                  <CardDescription>
                    Current security posture and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-emerald-500/10 p-2">
                          <Shield className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Firewall Status</h4>
                          <p className="text-sm text-slate-400">All essential ports protected</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500 hover:bg-emerald-600">Secure</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-amber-500/10 p-2">
                          <Shield className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">SSL Certificate</h4>
                          <p className="text-sm text-slate-400">Certificate expires in 15 days</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-500 hover:bg-amber-600">Warning</Badge>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
                      Run Security Scan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ai-analysis" className="mt-6">
              <Card className="border-slate-800 bg-slate-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-blue-500" />
                    AI Recommendations
                  </CardTitle>
                  <CardDescription>
                    Intelligent suggestions to optimize your server
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <h4 className="font-medium text-white">Optimize Database Performance</h4>
                      <p className="mt-2 text-sm text-slate-400">
                        The database is experiencing high query times during peak hours. 
                        Consider adding indexes for the following queries:
                      </p>
                      <div className="mt-3 rounded-md bg-slate-900 p-3">
                        <code className="text-xs text-blue-400">
                          CREATE INDEX idx_user_created_at ON users(created_at);
                        </code>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-blue-600 text-blue-400 hover:bg-blue-950/20">
                          Implement
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-800/50">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <h4 className="font-medium text-white">Enable Content Caching</h4>
                      <p className="mt-2 text-sm text-slate-400">
                        Implement content caching to reduce server load and improve response times 
                        by up to 30% for static content.
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-blue-600 text-blue-400 hover:bg-blue-950/20">
                          Implement
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-800/50">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;