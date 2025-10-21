'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Activity, Database, Cpu, HardDrive, Wifi, RefreshCw } from 'lucide-react';

interface PerformanceMetrics {
  responseTime: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  databaseConnections: number;
  activeUsers: number;
  systemUptime: number;
  lastUpdate: Date;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    responseTime: 250,
    cpuUsage: 45,
    memoryUsage: 67,
    diskUsage: 23,
    networkLatency: 89,
    databaseConnections: 12,
    activeUsers: 342,
    systemUptime: 99.8,
    lastUpdate: new Date(),
  });

  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        responseTime: Math.max(50, prev.responseTime + (Math.random() - 0.5) * 100),
        cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() - 0.5) * 20)),
        memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 15)),
        diskUsage: Math.max(0, Math.min(100, prev.diskUsage + (Math.random() - 0.5) * 5)),
        networkLatency: Math.max(10, prev.networkLatency + (Math.random() - 0.5) * 30),
        databaseConnections: Math.max(
          0,
          prev.databaseConnections + Math.floor((Math.random() - 0.5) * 6),
        ),
        activeUsers: Math.max(0, prev.activeUsers + Math.floor((Math.random() - 0.5) * 50)),
        lastUpdate: new Date(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const refreshMetrics = async () => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMetrics((prev) => ({
        ...prev,
        lastUpdate: new Date(),
      }));
    } catch (error) {
      console.error('Failed to refresh metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'bg-green-100 text-green-700';
    if (value <= thresholds.warning) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Monitor</h2>
          <p className="text-gray-600">Real-time system performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Last updated: {metrics.lastUpdate.toLocaleTimeString()}
          </span>
          <Button variant="outline" size="sm" onClick={refreshMetrics} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Response Time */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Activity className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics.responseTime)}ms</div>
            <Badge className={getStatusBadge(metrics.responseTime, { good: 200, warning: 500 })}>
              {metrics.responseTime <= 200
                ? 'Excellent'
                : metrics.responseTime <= 500
                  ? 'Good'
                  : 'Slow'}
            </Badge>
          </CardContent>
        </Card>

        {/* CPU Usage */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics.cpuUsage)}%</div>
            <Progress value={metrics.cpuUsage} className="mt-2" />
            <Badge className={getStatusBadge(metrics.cpuUsage, { good: 50, warning: 80 })}>
              {metrics.cpuUsage <= 50 ? 'Normal' : metrics.cpuUsage <= 80 ? 'High' : 'Critical'}
            </Badge>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              <HardDrive className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics.memoryUsage)}%</div>
            <Progress value={metrics.memoryUsage} className="mt-2" />
            <Badge className={getStatusBadge(metrics.memoryUsage, { good: 60, warning: 85 })}>
              {metrics.memoryUsage <= 60
                ? 'Normal'
                : metrics.memoryUsage <= 85
                  ? 'High'
                  : 'Critical'}
            </Badge>
          </CardContent>
        </Card>

        {/* Network Latency */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Network Latency</CardTitle>
              <Wifi className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics.networkLatency)}ms</div>
            <Badge className={getStatusBadge(metrics.networkLatency, { good: 50, warning: 150 })}>
              {metrics.networkLatency <= 50
                ? 'Fast'
                : metrics.networkLatency <= 150
                  ? 'Normal'
                  : 'Slow'}
            </Badge>
          </CardContent>
        </Card>

        {/* Database Connections */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Database Connections</CardTitle>
              <Database className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.databaseConnections}</div>
            <div className="text-sm text-gray-500">Active connections</div>
            <Badge
              className={getStatusBadge(metrics.databaseConnections, { good: 20, warning: 40 })}
            >
              {metrics.databaseConnections <= 20
                ? 'Normal'
                : metrics.databaseConnections <= 40
                  ? 'High'
                  : 'Critical'}
            </Badge>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <div className="text-sm text-gray-500">Currently online</div>
            <Badge className="bg-blue-100 text-blue-700">
              {metrics.activeUsers > 300 ? 'High Activity' : 'Normal Activity'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Overall system health and uptime</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{metrics.systemUptime}%</div>
              <div className="text-sm text-gray-500">System Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">6,950+</div>
              <div className="text-sm text-gray-500">Total Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">5</div>
              <div className="text-sm text-gray-500">Schools Online</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>Recent system notifications and warnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.cpuUsage > 80 && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-red-700">
                  High CPU usage detected ({Math.round(metrics.cpuUsage)}%)
                </span>
              </div>
            )}
            {metrics.memoryUsage > 85 && (
              <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-yellow-700">
                  High memory usage detected ({Math.round(metrics.memoryUsage)}%)
                </span>
              </div>
            )}
            {metrics.responseTime > 500 && (
              <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-orange-700">
                  Slow response time detected ({Math.round(metrics.responseTime)}ms)
                </span>
              </div>
            )}
            {metrics.cpuUsage <= 50 && metrics.memoryUsage <= 60 && metrics.responseTime <= 200 && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700">All systems operating normally</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
