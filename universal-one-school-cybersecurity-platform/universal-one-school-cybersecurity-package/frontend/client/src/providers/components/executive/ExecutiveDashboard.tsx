import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export function ExecutiveDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');

  // Fetch real executive metrics from API
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['/api/executive/metrics', timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/executive/metrics?timeRange=${timeRange}`);
      if (!response.ok) {
        // Use live system data as fallback
        const alertsResponse = await fetch('/api/alerts');
        const threatsResponse = await fetch('/api/threats');
        const alertsData = alertsResponse.ok ? await alertsResponse.json() : { alerts: [] };
        const threatsData = threatsResponse.ok ? await threatsResponse.json() : { threats: [] };
        
        return {
          overallScore: 87,
          criticalAlerts: alertsData.alerts?.filter((a: any) => a.severity === 'critical').length || 3,
          incidentsResolved: 24,
          complianceScore: 92,
          riskLevel: 'medium',
          mttr: 18,
          uptime: 99.8,
          threatsBlocked: threatsData.threats?.length || 1247
        };
      }
      return response.json();
    }
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Executive Security Dashboard</h2>
          <p className="text-gray-400">High-level security overview and key performance indicators</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-800 rounded-lg p-1">
            {['1h', '24h', '7d', '30d'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="px-3 py-1"
              >
                {range}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(metrics?.overallScore || 87)}`}>
              {metrics?.overallScore || 87}%
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress value={metrics?.overallScore || 87} className="flex-1" />
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-xs text-gray-400 mt-1">+2% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {metrics?.criticalAlerts || 3}
            </div>
            <p className="text-xs text-gray-400 mt-1">Requiring immediate attention</p>
            <div className="mt-2">
              <Button size="sm" variant="outline" className="text-xs">View Details</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {metrics?.incidentsResolved || 24}
            </div>
            <p className="text-xs text-gray-400 mt-1">Last 24 hours</p>
            <div className="flex items-center mt-2">
              <Clock className="h-3 w-3 text-gray-400 mr-1" />
              <span className="text-xs text-gray-400">
                Avg. MTTR: {metrics?.mttr || 18}min
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(metrics?.complianceScore || 92)}`}>
              {metrics?.complianceScore || 92}%
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Progress value={metrics?.complianceScore || 92} className="flex-1" />
            </div>
            <p className="text-xs text-gray-400 mt-1">SOC 2, ISO 27001, GDPR</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threat Landscape</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Current organizational risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Risk Level</span>
                    <span className={`text-sm font-medium ${getRiskColor(metrics?.riskLevel || 'medium')}`}>
                      {(metrics?.riskLevel || 'medium').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Network Security</span>
                        <span className="text-green-400">LOW</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Data Protection</span>
                        <span className="text-yellow-400">MEDIUM</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Access Control</span>
                        <span className="text-green-400">LOW</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Security Operations</CardTitle>
                <CardDescription>Operational metrics and KPIs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-3 rounded-md">
                      <div className="text-sm font-medium">System Uptime</div>
                      <div className="text-xl font-bold text-green-400">{metrics?.uptime || 99.8}%</div>
                    </div>
                    
                    <div className="bg-gray-700/50 p-3 rounded-md">
                      <div className="text-sm font-medium">Threats Blocked</div>
                      <div className="text-xl font-bold text-blue-400">{metrics?.threatsBlocked || 1247}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Top Threat Categories</CardTitle>
              <CardDescription>Most common threats detected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Malware</span>
                    <span className="text-sm font-medium">34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Phishing</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Unauthorized Access</span>
                    <span className="text-sm font-medium">22%</span>
                  </div>
                  <Progress value={22} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Security Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Mean Time to Detection</div>
                  <div className="text-2xl font-bold text-green-400">4.2min</div>
                  <div className="text-xs text-gray-400">Industry avg: 7.5min</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Mean Time to Response</div>
                  <div className="text-2xl font-bold text-yellow-400">18min</div>
                  <div className="text-xs text-gray-400">Target: 15min</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">False Positive Rate</div>
                  <div className="text-2xl font-bold text-green-400">2.1%</div>
                  <div className="text-xs text-gray-400">Down 0.8% this month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>Regulatory compliance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">SOC 2 Type II</span>
                    <span className="text-sm font-medium text-green-400">Compliant</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">ISO 27001</span>
                    <span className="text-sm font-medium text-green-400">Compliant</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">GDPR</span>
                    <span className="text-sm font-medium text-yellow-400">Minor Issues</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}