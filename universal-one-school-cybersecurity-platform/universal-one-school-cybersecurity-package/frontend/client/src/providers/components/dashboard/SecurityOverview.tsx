import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, CheckCircle, Activity, Clock } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

interface SecurityOverviewProps {
  stats: {
    activeThreats: number;
    resolvedThreats: number;
    securityScore: number;
    criticalAlerts: number;
    endpointsProtected: number;
    lastScanTime?: string;
  };
}

export function SecurityOverview({ stats }: SecurityOverviewProps) {
  // Threat distribution data for pie chart
  const threatDistributionData = {
    labels: ['Malware', 'Phishing', 'Unauthorized Access', 'Data Leakage', 'Suspicious Activity'],
    datasets: [
      {
        data: [stats.activeThreats * 0.3, stats.activeThreats * 0.2, stats.activeThreats * 0.15, stats.activeThreats * 0.25, stats.activeThreats * 0.1],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Weekly security event data for line chart
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Threats Detected',
        data: [5, 12, 8, 15, 10, 6, stats.activeThreats],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Threats Resolved',
        data: [3, 10, 5, 11, 8, 5, stats.resolvedThreats],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Protection coverage data for bar chart
  const coverageData = {
    labels: ['Endpoints', 'Servers', 'Networks', 'Cloud Assets', 'Applications'],
    datasets: [
      {
        label: 'Protection Coverage (%)',
        data: [98, 95, 90, 85, 92],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 205, 86, 0.7)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'white',
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
  };

  // Get color based on security score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Security score and high-level metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <CardDescription>Overall security rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getScoreColor(stats.securityScore)}`}>
              {stats.securityScore}%
            </div>
            <Progress 
              value={stats.securityScore} 
              className="h-2 mt-2" 
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <CardDescription>Requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              <div className="text-3xl font-bold">{stats.activeThreats}</div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {stats.activeThreats > 5 ? 'High threat level' : 'Moderate threat level'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved Threats</CardTitle>
            <CardDescription>Successfully mitigated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <div className="text-3xl font-bold">{stats.resolvedThreats}</div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Last 7 days
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Protected Endpoints</CardTitle>
            <CardDescription>Actively monitored</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-500" />
              <div className="text-3xl font-bold">{stats.endpointsProtected}</div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              All endpoints secured
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical alerts */}
      {stats.criticalAlerts > 0 && (
        <Card className="border-red-900 bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center text-red-400">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Critical Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge variant="destructive" className="mr-2">Critical</Badge>
                <span>{stats.criticalAlerts} alerts require immediate attention</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                <span>Updated {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security visualizations */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threat Distribution</TabsTrigger>
          <TabsTrigger value="trends">Weekly Trends</TabsTrigger>
          <TabsTrigger value="coverage">Protection Coverage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Overview</CardTitle>
              <CardDescription>Summary of your security posture</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Threat Analysis</h3>
                <div className="h-60">
                  <Pie data={threatDistributionData} options={pieOptions} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Weekly Activity</h3>
                <div className="h-60">
                  <Line data={weeklyData} options={lineOptions} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Protection Coverage</h3>
                <div className="h-60">
                  <Bar data={coverageData} options={barOptions} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
                <CardDescription>Improve your security posture</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 bg-amber-900/40 p-1 rounded-full">
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                    </div>
                    <span>Enable multi-factor authentication for all admin accounts</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 bg-amber-900/40 p-1 rounded-full">
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                    </div>
                    <span>Update application firewall rules for improved protection</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 bg-blue-900/40 p-1 rounded-full">
                      <Activity className="h-3 w-3 text-blue-500" />
                    </div>
                    <span>Review user access policies every 30 days</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest security events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-2 bg-green-900/40 p-1 rounded-full">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    </div>
                    <div>
                      <div className="font-medium">Vulnerability patched</div>
                      <div className="text-sm text-gray-400">Today, {new Date().toLocaleTimeString()}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-2 bg-amber-900/40 p-1 rounded-full">
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                    </div>
                    <div>
                      <div className="font-medium">Suspicious login attempt blocked</div>
                      <div className="text-sm text-gray-400">Today, {new Date(Date.now() - 1000*60*30).toLocaleTimeString()}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="mr-2 bg-blue-900/40 p-1 rounded-full">
                      <Shield className="h-3 w-3 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium">Security scan completed</div>
                      <div className="text-sm text-gray-400">Today, {new Date(Date.now() - 1000*60*60*2).toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="threats">
          <Card>
            <CardHeader>
              <CardTitle>Threat Distribution</CardTitle>
              <CardDescription>Breakdown of current security threats</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <div style={{ height: '400px', width: '100%', maxWidth: '600px' }}>
                <Pie data={threatDistributionData} options={{
                  ...pieOptions,
                  maintainAspectRatio: false,
                }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Security Trends</CardTitle>
              <CardDescription>Threats detected and resolved over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: '400px', width: '100%' }}>
                <Line data={weeklyData} options={{
                  ...lineOptions,
                  maintainAspectRatio: false,
                }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="coverage">
          <Card>
            <CardHeader>
              <CardTitle>Protection Coverage</CardTitle>
              <CardDescription>Security coverage across organization assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: '400px', width: '100%' }}>
                <Bar data={coverageData} options={{
                  ...barOptions,
                  maintainAspectRatio: false,
                }} />
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Coverage Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Endpoints</span>
                      <Badge variant="outline" className="bg-teal-950">98% Protected</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Servers</span>
                      <Badge variant="outline" className="bg-blue-950">95% Protected</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Networks</span>
                      <Badge variant="outline" className="bg-purple-950">90% Protected</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cloud Assets</span>
                      <Badge variant="outline" className="bg-orange-950">85% Protected</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Applications</span>
                      <Badge variant="outline" className="bg-yellow-950">92% Protected</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Unprotected Assets</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <div className="font-medium">2 Virtual Machines</div>
                      <div className="text-gray-400">Awaiting agent installation</div>
                    </div>
                    <div>
                      <div className="font-medium">1 Development Server</div>
                      <div className="text-gray-400">Pending security scan</div>
                    </div>
                    <div>
                      <div className="font-medium">3 Test Applications</div>
                      <div className="text-gray-400">Code scanning not enabled</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}