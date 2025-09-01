'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Zap,
  Database,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { SmoothTransition, FadeInUp } from './smooth-transitions';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

interface PerformanceMonitorProps {
  userId?: number;
  showDetails?: boolean;
}

export function PerformanceMonitor({ userId, showDetails = false }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [cacheStats, setCacheStats] = useState({
    hitRate: 0,
    totalEntries: 0,
    memoryUsage: 0,
  });

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      // Simulate performance monitoring
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockMetrics: PerformanceMetric[] = [
        {
          name: 'Page Load Time',
          value: Math.random() * 500 + 200,
          unit: 'ms',
          trend: 'down',
          status: 'good',
        },
        {
          name: 'Database Query Time',
          value: Math.random() * 100 + 50,
          unit: 'ms',
          trend: 'stable',
          status: 'good',
        },
        {
          name: 'Cache Hit Rate',
          value: Math.random() * 20 + 80,
          unit: '%',
          trend: 'up',
          status: 'good',
        },
        {
          name: 'Memory Usage',
          value: Math.random() * 30 + 40,
          unit: '%',
          trend: 'stable',
          status: 'good',
        },
        {
          name: 'API Response Time',
          value: Math.random() * 200 + 100,
          unit: 'ms',
          trend: 'down',
          status: 'good',
        },
      ];

      setMetrics(mockMetrics);
      setCacheStats({
        hitRate: mockMetrics.find((m) => m.name === 'Cache Hit Rate')?.value || 0,
        totalEntries: Math.floor(Math.random() * 1000) + 500,
        memoryUsage: mockMetrics.find((m) => m.name === 'Memory Usage')?.value || 0,
      });
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      await fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear-cache' }),
      });
      await fetchPerformanceData();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const preloadResources = async () => {
    try {
      await fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'preload-resources' }),
      });
    } catch (error) {
      console.error('Failed to preload resources:', error);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  if (!showDetails) {
    return (
      <SmoothTransition>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <Activity className="w-4 h-4" />
          <span>Performance: {metrics.length > 0 ? 'Optimal' : 'Monitoring...'}</span>
          {loading && <RefreshCw className="w-3 h-3 animate-spin" />}
        </div>
      </SmoothTransition>
    );
  }

  return (
    <SmoothTransition>
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span>Performance Monitor</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCache}
                className="text-slate-300 border-slate-600"
              >
                Clear Cache
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={preloadResources}
                className="text-slate-300 border-slate-600"
              >
                Preload
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPerformanceData}
                disabled={loading}
                className="text-slate-300 border-slate-600"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Refresh'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Cache Statistics */}
            <FadeInUp>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Cache Hit Rate</p>
                      <p className="text-2xl font-bold text-green-400">
                        {cacheStats.hitRate.toFixed(1)}%
                      </p>
                    </div>
                    <Database className="w-8 h-8 text-green-500" />
                  </div>
                  <Progress value={cacheStats.hitRate} className="mt-2" />
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Cache Entries</p>
                      <p className="text-2xl font-bold text-blue-400">{cacheStats.totalEntries}</p>
                    </div>
                    <Database className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Memory Usage</p>
                      <p className="text-2xl font-bold text-purple-400">
                        {cacheStats.memoryUsage.toFixed(1)}%
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-purple-500" />
                  </div>
                  <Progress value={cacheStats.memoryUsage} className="mt-2" />
                </div>
              </div>
            </FadeInUp>

            {/* Performance Metrics */}
            <FadeInUp delay={0.1}>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
                <div className="space-y-2">
                  {metrics.map((metric, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(metric.status)}
                        <span className="text-white">{metric.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${getStatusColor(metric.status)}`}>
                          {metric.value.toFixed(metric.unit === '%' ? 1 : 0)}
                          {metric.unit}
                        </span>
                        {getTrendIcon(metric.trend)}
                        <Badge
                          variant={metric.status === 'good' ? 'default' : 'destructive'}
                          className="ml-2"
                        >
                          {metric.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInUp>

            {/* Performance Tips */}
            <FadeInUp delay={0.2}>
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Optimization Tips</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li>• Cache hit rate above 80% indicates good performance</li>
                  <li>• Page load times under 300ms provide optimal user experience</li>
                  <li>• Regular cache cleanup helps maintain system performance</li>
                  <li>• Preloading critical resources improves perceived performance</li>
                </ul>
              </div>
            </FadeInUp>
          </div>
        </CardContent>
      </Card>
    </SmoothTransition>
  );
}
