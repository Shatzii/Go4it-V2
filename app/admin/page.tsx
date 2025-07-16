'use client'

import { useState, useEffect } from 'react'
import { AuthClient } from '@/lib/auth-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  Database, 
  Shield, 
  Bell, 
  Upload, 
  Download,
  Activity,
  Server,
  Globe,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Video,
  GraduationCap,
  Target,
  Brain,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Plus,
  Save,
  Calendar,
  Clock,
  Star,
  Trophy,
  Zap,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Link,
  Copy,
  ExternalLink
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [adminUser, setAdminUser] = useState(null)

  useEffect(() => {
    // Check admin authentication
    const checkAdminAuth = async () => {
      try {
        // Add a small delay to ensure localStorage is available
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const token = AuthClient.getToken();
        console.log('Admin auth check - Token:', token ? 'Present' : 'Missing');
        
        if (!token) {
          console.log('No token found, redirecting to auth');
          alert('Please log in to access the admin dashboard');
          window.location.href = '/auth';
          return;
        }
        
        const userData = await AuthClient.checkAuthStatus();
        console.log('Admin auth check - User data:', userData);
        
        if (userData && userData.role === 'admin') {
          setAdminUser(userData);
          setIsLoading(false);
          AuthClient.clearTokenFresh(); // Clear the fresh token flag
        } else {
          console.log('User is not admin or auth failed, redirecting to auth');
          alert(userData ? 'Admin access required' : 'Authentication failed. Please log in again.');
          AuthClient.removeToken();
          window.location.href = '/auth';
        }
      } catch (error) {
        console.error('Admin auth check failed:', error);
        alert('Error accessing admin dashboard. Please try logging in again.');
        AuthClient.removeToken();
        window.location.href = '/auth';
      }
    };

    checkAdminAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Users</p>
                <p className="text-2xl font-bold text-white">2,847</p>
                <p className="text-xs text-green-400">+12% from last month</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Sessions</p>
                <p className="text-2xl font-bold text-white">1,234</p>
                <p className="text-xs text-green-400">+8% from yesterday</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Video Analyses</p>
                <p className="text-2xl font-bold text-white">15,678</p>
                <p className="text-xs text-green-400">+23% from last week</p>
              </div>
              <Video className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">System Health</p>
                <p className="text-2xl font-bold text-white">98.7%</p>
                <p className="text-xs text-green-400">All systems operational</p>
              </div>
              <Server className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: 'john.doe@email.com', action: 'Video Analysis Completed', time: '2 minutes ago', type: 'success' },
                { user: 'sarah.smith@email.com', action: 'Account Registration', time: '5 minutes ago', type: 'info' },
                { user: 'mike.johnson@email.com', action: 'Academy Enrollment', time: '12 minutes ago', type: 'success' },
                { user: 'admin@goforit.com', action: 'System Settings Updated', time: '1 hour ago', type: 'warning' },
                { user: 'emma.davis@email.com', action: 'GAR Score: 87/100', time: '2 hours ago', type: 'success' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' : 
                      activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-white">{activity.action}</p>
                      <p className="text-xs text-slate-400">{activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-white">Web Server</span>
                </div>
                <Badge className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-white">Database</span>
                </div>
                <Badge className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-white">AI Engine</span>
                </div>
                <Badge className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-white">Video Processing</span>
                </div>
                <Badge className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-white">Email Service</span>
                </div>
                <Badge className="bg-yellow-500">Maintenance</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const UsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">User Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">2,847</p>
              <p className="text-sm text-slate-400">Total Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">1,234</p>
              <p className="text-sm text-slate-400">Active Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">567</p>
              <p className="text-sm text-slate-400">Academy Students</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">89</p>
              <p className="text-sm text-slate-400">Coaches</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'John Doe', email: 'john.doe@email.com', role: 'athlete', status: 'active', joined: '2 hours ago' },
              { name: 'Sarah Smith', email: 'sarah.smith@email.com', role: 'coach', status: 'active', joined: '1 day ago' },
              { name: 'Mike Johnson', email: 'mike.johnson@email.com', role: 'athlete', status: 'active', joined: '3 days ago' },
              { name: 'Emma Davis', email: 'emma.davis@email.com', role: 'parent', status: 'active', joined: '1 week ago' }
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">{user.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-blue-500">{user.role}</Badge>
                  <span className="text-xs text-slate-500">{user.joined}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const ContentTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Content Management</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Content
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="w-5 h-5" />
              Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Published</span>
                <span className="font-semibold text-white">47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Drafts</span>
                <span className="font-semibold text-white">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Total Views</span>
                <span className="font-semibold text-white">23,456</span>
              </div>
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Manage Posts
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Video className="w-5 h-5" />
              Training Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Total Videos</span>
                <span className="font-semibold text-white">234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Hours Watched</span>
                <span className="font-semibold text-white">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">New This Week</span>
                <span className="font-semibold text-white">8</span>
              </div>
              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Video
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="w-5 h-5" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Active</span>
                <span className="font-semibold text-white">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Scheduled</span>
                <span className="font-semibold text-white">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Total Sent</span>
                <span className="font-semibold text-white">156</span>
              </div>
              <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                <Bell className="w-4 h-4 mr-2" />
                New Announcement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const SystemTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">System Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Platform Name</Label>
              <Input defaultValue="Go4It Sports Platform" className="bg-slate-700 border-slate-600 text-white" />
            </div>
            <div>
              <Label className="text-white">Support Email</Label>
              <Input defaultValue="support@go4itsports.com" className="bg-slate-700 border-slate-600 text-white" />
            </div>
            <div>
              <Label className="text-white">Maintenance Mode</Label>
              <Select defaultValue="disabled">
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">AI Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">AI Model Provider</Label>
              <Select defaultValue="self-hosted">
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self-hosted">Self-Hosted</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white">Video Analysis Quality</Label>
              <Select defaultValue="high">
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="high">High Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white">Max Upload Size (MB)</Label>
              <Input defaultValue="500" className="bg-slate-700 border-slate-600 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Go4It Sports Admin Dashboard</h1>
                <p className="text-lg text-slate-300">Complete platform administration</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-slate-400">Logged in as</p>
                  <p className="font-medium">{adminUser?.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {adminUser?.firstName?.[0]}{adminUser?.lastName?.[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-blue-600">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="text-white data-[state=active]:bg-blue-600">
              <FileText className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="system" className="text-white data-[state=active]:bg-blue-600">
              <Settings className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UsersTab />
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <ContentTab />
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <SystemTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}