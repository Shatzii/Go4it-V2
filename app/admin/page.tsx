'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Activity, 
  Users, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Award, 
  Settings, 
  Database, 
  Shield, 
  Globe, 
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Eye,
  UserCheck,
  FileText,
  Video,
  BookOpen,
  MessageSquare,
  Star,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Lock,
  Unlock,
  AlertTriangle,
  Info
} from 'lucide-react'

interface SystemMetrics {
  platformStatus: string
  totalUsers: number
  activeUsers: number
  totalContent: number
  totalVideos: number
  totalAchievements: number
  serverUptime: string
  cpuUsage: number
  memoryUsage: number
  storageUsage: number
  networkLatency: number
  dailyActiveUsers: number
  weeklyActiveUsers: number
  monthlyActiveUsers: number
  contentViews: number
  trainingHours: number
  successRate: number
}

interface PlatformAlert {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  title: string
  message: string
  timestamp: string
  resolved: boolean
}

const logoImage = '/attached_assets/Go4it Logo_1752616197577.jpeg'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [platformStatus, setPlatformStatus] = useState('loading')
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    platformStatus: 'ready',
    totalUsers: 12485,
    activeUsers: 3247,
    totalContent: 1856,
    totalVideos: 542,
    totalAchievements: 89,
    serverUptime: '99.7%',
    cpuUsage: 68,
    memoryUsage: 72,
    storageUsage: 45,
    networkLatency: 42,
    dailyActiveUsers: 1247,
    weeklyActiveUsers: 5683,
    monthlyActiveUsers: 18947,
    contentViews: 89453,
    trainingHours: 15672,
    successRate: 94
  })

  const [platformAlerts, setPlatformAlerts] = useState<PlatformAlert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'High Memory Usage',
      message: 'Server memory usage is at 72%. Consider optimizing queries or scaling resources.',
      timestamp: '2025-01-15T10:30:00Z',
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'Platform maintenance scheduled for tonight at 2:00 AM EST.',
      timestamp: '2025-01-15T09:00:00Z',
      resolved: false
    },
    {
      id: '3',
      type: 'success',
      title: 'Performance Optimization',
      message: 'Database queries optimized. 15% improvement in response time.',
      timestamp: '2025-01-15T08:15:00Z',
      resolved: true
    }
  ])

  useEffect(() => {
    // Simulate fetching platform status
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health')
        if (response.ok) {
          setPlatformStatus('ready')
        } else {
          setPlatformStatus('degraded')
        }
      } catch (error) {
        setPlatformStatus('offline')
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800'
      case 'degraded': return 'bg-yellow-100 text-yellow-800'
      case 'offline': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4" />
      case 'degraded': return <AlertTriangle className="w-4 h-4" />
      case 'offline': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'info': return <Info className="w-4 h-4 text-blue-500" />
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatUptime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`
    }
    return `${minutes}m ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src={logoImage}
                alt="Go4It Sports Logo"
                className="w-10 h-10 rounded-lg"
              />
              <div className="text-xl font-bold text-white">Go4It Sports Admin</div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getStatusColor(platformStatus)}>
                {getStatusIcon(platformStatus)}
                {platformStatus.charAt(0).toUpperCase() + platformStatus.slice(1)}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
                Back to Site
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-lg text-slate-300">Comprehensive platform management and analytics</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Key Metrics Cards */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{systemMetrics.totalUsers.toLocaleString()}</div>
                  <div className="flex items-center text-sm text-green-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12.5% from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{systemMetrics.activeUsers.toLocaleString()}</div>
                  <div className="flex items-center text-sm text-green-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +8.3% from last week
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300">Content Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{systemMetrics.totalContent.toLocaleString()}</div>
                  <div className="flex items-center text-sm text-green-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +15.2% from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-300">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{systemMetrics.successRate}%</div>
                  <div className="flex items-center text-sm text-green-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +2.1% from last month
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Overview */}
            <Card className="bg-slate-800/50 border-slate-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Performance Overview</CardTitle>
                <CardDescription className="text-slate-300">
                  Real-time platform performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-white">Athletic Performance</span>
                      <span className="text-sm text-primary font-semibold">92%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-[92%] transition-all duration-1000"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-white">Academic Progress</span>
                      <span className="text-sm text-primary font-semibold">87%</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-[87%] transition-all duration-1000 delay-300"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-white">StarPath Level</span>
                      <span className="text-sm text-primary font-semibold">Elite</span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-[95%] transition-all duration-1000 delay-500"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-700/50 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{systemMetrics.trainingHours.toLocaleString()}</div>
                    <div className="text-sm text-slate-300">Training Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{systemMetrics.successRate}%</div>
                    <div className="text-sm text-slate-300">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-slate-300">
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary border-primary/30">
                    <Users className="w-6 h-6" />
                    Manage Users
                  </Button>
                  <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary border-primary/30">
                    <FileText className="w-6 h-6" />
                    Content CMS
                  </Button>
                  <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary border-primary/30">
                    <BarChart3 className="w-6 h-6" />
                    Analytics
                  </Button>
                  <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary border-primary/30">
                    <Settings className="w-6 h-6" />
                    System Config
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-slate-300">
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-slate-900/50 rounded-lg">
                      <div className="text-3xl font-bold text-white mb-2">{systemMetrics.dailyActiveUsers.toLocaleString()}</div>
                      <div className="text-sm text-slate-300">Daily Active Users</div>
                    </div>
                    <div className="text-center p-6 bg-slate-900/50 rounded-lg">
                      <div className="text-3xl font-bold text-white mb-2">{systemMetrics.weeklyActiveUsers.toLocaleString()}</div>
                      <div className="text-sm text-slate-300">Weekly Active Users</div>
                    </div>
                    <div className="text-center p-6 bg-slate-900/50 rounded-lg">
                      <div className="text-3xl font-bold text-white mb-2">{systemMetrics.monthlyActiveUsers.toLocaleString()}</div>
                      <div className="text-sm text-slate-300">Monthly Active Users</div>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-300">Advanced user management tools coming soon</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Content Management</CardTitle>
                <CardDescription className="text-slate-300">
                  Content statistics and management tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-6 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-2">{systemMetrics.totalContent}</div>
                    <div className="text-sm text-slate-300">Total Articles</div>
                  </div>
                  <div className="text-center p-6 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-2">{systemMetrics.totalVideos}</div>
                    <div className="text-sm text-slate-300">Video Content</div>
                  </div>
                  <div className="text-center p-6 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-2">{systemMetrics.contentViews.toLocaleString()}</div>
                    <div className="text-sm text-slate-300">Total Views</div>
                  </div>
                  <div className="text-center p-6 bg-slate-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-2">{systemMetrics.totalAchievements}</div>
                    <div className="text-sm text-slate-300">Achievements</div>
                  </div>
                </div>
                
                <div className="text-center py-8">
                  <Button onClick={() => window.location.href = '/cms'} className="bg-primary hover:bg-primary/90">
                    <FileText className="w-4 h-4 mr-2" />
                    Open Content Management System
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Health</CardTitle>
                <CardDescription className="text-slate-300">
                  Server performance and system metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-primary" />
                        <span className="text-white">CPU Usage</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{systemMetrics.cpuUsage}%</div>
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${systemMetrics.cpuUsage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <HardDrive className="w-5 h-5 text-primary" />
                        <span className="text-white">Memory Usage</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{systemMetrics.memoryUsage}%</div>
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${systemMetrics.memoryUsage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-primary" />
                        <span className="text-white">Storage Usage</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{systemMetrics.storageUsage}%</div>
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${systemMetrics.storageUsage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wifi className="w-5 h-5 text-primary" />
                        <span className="text-white">Network Latency</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{systemMetrics.networkLatency}ms</div>
                        <div className="text-sm text-slate-300">Average response time</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Server className="w-5 h-5 text-primary" />
                        <span className="text-white font-medium">Server Uptime</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{systemMetrics.serverUptime}</div>
                      <div className="text-sm text-slate-300">Last 30 days</div>
                    </div>
                    
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-5 h-5 text-primary" />
                        <span className="text-white font-medium">Platform Status</span>
                      </div>
                      <Badge className={getStatusColor(platformStatus)}>
                        {getStatusIcon(platformStatus)}
                        {platformStatus.charAt(0).toUpperCase() + platformStatus.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-5 h-5 text-primary" />
                        <span className="text-white font-medium">Performance Score</span>
                      </div>
                      <div className="text-2xl font-bold text-white">A+</div>
                      <div className="text-sm text-slate-300">Excellent performance</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Alerts</CardTitle>
                <CardDescription className="text-slate-300">
                  Platform notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border ${
                      alert.resolved 
                        ? 'bg-slate-900/30 border-slate-700 opacity-60' 
                        : 'bg-slate-900/50 border-slate-600'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.type)}
                          <div>
                            <div className="font-medium text-white">{alert.title}</div>
                            <div className="text-sm text-slate-300 mt-1">{alert.message}</div>
                            <div className="text-xs text-slate-400 mt-2">
                              {formatUptime(alert.timestamp)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {alert.resolved && (
                            <Badge variant="secondary" className="text-xs">
                              Resolved
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Platform Settings</CardTitle>
                <CardDescription className="text-slate-300">
                  Configure platform preferences and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300">Advanced settings panel coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}