// Advanced Social Media & Athlete Discovery Dashboard
// Administrative interface for managing automated systems

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import PersonalDailyDigest from '../../dashboard/components/PersonalDailyDigest';
import {
  BarChart3,
  TrendingUp,
  Users,
  Share2,
  Calendar,
  Clock,
  Play,
  Pause,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Zap,
  Target,
  Eye,
  ThumbsUp,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Twitter
} from 'lucide-react';

// Mock dashboard data - in production, this would come from your database
const dashboardData = {
  systemStatus: {
    socialMediaEngine: { status: 'active', uptime: '99.9%', lastUpdate: '2025-01-15T10:30:00Z' },
    athleteDiscovery: { status: 'active', uptime: '98.5%', lastUpdate: '2025-01-15T10:25:00Z' },
    journalismEngine: { status: 'active', uptime: '97.8%', lastUpdate: '2025-01-15T10:20:00Z' },
    contentScheduler: { status: 'active', uptime: '99.2%', lastUpdate: '2025-01-15T10:15:00Z' }
  },
  performance: {
    totalPosts: 1247,
    engagementRate: 8.5,
    reachGrowth: 15.2,
    newAthletes: 89,
    articlesGenerated: 234,
    qualityScore: 92
  },
  recentActivity: [
    {
      id: '1',
      type: 'post',
      platform: 'Instagram',
      athlete: 'Cooper Flagg',
      content: 'New highlight video posted',
      timestamp: '2025-01-15T10:30:00Z',
      status: 'success',
      engagement: { likes: 1247, shares: 89, comments: 34 }
    },
    {
      id: '2',
      type: 'discovery',
      athlete: 'Ace Bailey',
      content: 'New athlete discovered with 96 quality score',
      timestamp: '2025-01-15T10:25:00Z',
      status: 'success'
    },
    {
      id: '3',
      type: 'article',
      athlete: 'Dylan Harper',
      content: 'AI-generated article published',
      timestamp: '2025-01-15T10:20:00Z',
      status: 'success',
      engagement: { likes: 892, shares: 67, comments: 28 }
    },
    {
      id: '4',
      type: 'post',
      platform: 'TikTok',
      athlete: 'Cooper Flagg',
      content: 'Recruitment update posted',
      timestamp: '2025-01-15T10:15:00Z',
      status: 'success',
      engagement: { likes: 2156, shares: 145, comments: 67 }
    }
  ],
  scheduledPosts: [
    {
      id: '1',
      athlete: 'Cooper Flagg',
      platform: 'Facebook',
      content: 'Duke commitment announcement',
      scheduledTime: '2025-01-15T14:00:00Z',
      status: 'scheduled'
    },
    {
      id: '2',
      athlete: 'Ace Bailey',
      platform: 'Instagram',
      content: 'Season highlights reel',
      scheduledTime: '2025-01-15T16:30:00Z',
      status: 'scheduled'
    },
    {
      id: '3',
      athlete: 'Dylan Harper',
      platform: 'TikTok',
      content: 'Skills showcase video',
      scheduledTime: '2025-01-15T18:00:00Z',
      status: 'scheduled'
    }
  ],
  platformStats: {
    instagram: {
      followers: 45600,
      engagement: 8.2,
      postsToday: 3,
      growth: 12.5
    },
    facebook: {
      followers: 32100,
      engagement: 6.8,
      postsToday: 2,
      growth: 8.9
    },
    tiktok: {
      followers: 89200,
      engagement: 15.3,
      postsToday: 5,
      growth: 25.7
    },
    twitter: {
      followers: 15400,
      engagement: 4.5,
      postsToday: 1,
      growth: 5.2
    }
  },
  alerts: [
    {
      id: '1',
      type: 'warning',
      message: 'Instagram API rate limit approaching (85% used)',
      timestamp: '2025-01-15T10:00:00Z'
    },
    {
      id: '2',
      type: 'info',
      message: 'New athlete discovery source added: MaxPreps API',
      timestamp: '2025-01-15T09:30:00Z'
    },
    {
      id: '3',
      type: 'success',
      message: 'Content quality score improved by 3.2% this week',
      timestamp: '2025-01-15T08:45:00Z'
    }
  ]
};

export const metadata: Metadata = {
  title: 'Advanced Social Media Dashboard - Go4it Sports',
  description: 'Administrative dashboard for managing automated social media posting, athlete discovery, and content generation systems.',
};

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Social Media Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor and control your automated athlete discovery and content systems</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Zap className="w-4 h-4 mr-1" />
                All Systems Active
              </Badge>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="social-media">Social Media</TabsTrigger>
            <TabsTrigger value="discovery">Athlete Discovery</TabsTrigger>
            <TabsTrigger value="content">Content Generation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Go4It OS Personal Daily Digest */}
          <div className="mb-8">
            <PersonalDailyDigest />
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(dashboardData.systemStatus).map(([system, status]) => (
                <Card key={system}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {status.status === 'active' ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mr-2" />
                        )}
                        <span className="font-semibold capitalize">
                          {system.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <Badge variant={status.status === 'active' ? 'default' : 'destructive'}>
                        {status.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uptime</span>
                        <span className="font-semibold">{status.uptime}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Last update: {new Date(status.lastUpdate).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{dashboardData.performance.totalPosts}</div>
                  <div className="text-sm text-gray-600">Total Posts</div>
                  <div className="text-xs text-green-600 mt-1">+12% this week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{dashboardData.performance.engagementRate}%</div>
                  <div className="text-sm text-gray-600">Engagement Rate</div>
                  <div className="text-xs text-green-600 mt-1">+2.1% this week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">+{dashboardData.performance.reachGrowth}%</div>
                  <div className="text-sm text-gray-600">Reach Growth</div>
                  <div className="text-xs text-green-600 mt-1">Monthly</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{dashboardData.performance.newAthletes}</div>
                  <div className="text-sm text-gray-600">New Athletes</div>
                  <div className="text-xs text-green-600 mt-1">This month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{dashboardData.performance.articlesGenerated}</div>
                  <div className="text-sm text-gray-600">Articles Generated</div>
                  <div className="text-xs text-green-600 mt-1">This week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600">{dashboardData.performance.qualityScore}</div>
                  <div className="text-sm text-gray-600">Quality Score</div>
                  <div className="text-xs text-green-600 mt-1">+3.2% this week</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.type === 'post' && <Share2 className="w-5 h-5 text-blue-500" />}
                        {activity.type === 'discovery' && <Users className="w-5 h-5 text-green-500" />}
                        {activity.type === 'article' && <BarChart3 className="w-5 h-5 text-purple-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.athlete && `${activity.athlete}: `}{activity.content}
                          </p>
                          <Badge variant={activity.status === 'success' ? 'default' : 'secondary'}>
                            {activity.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                          {activity.engagement && (
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span className="flex items-center">
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                {activity.engagement.likes}
                              </span>
                              <span className="flex items-center">
                                <Share2 className="w-3 h-3 mr-1" />
                                {activity.engagement.shares}
                              </span>
                              <span className="flex items-center">
                                <MessageCircle className="w-3 h-3 mr-1" />
                                {activity.engagement.comments}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                        {alert.type === 'info' && <CheckCircle className="w-5 h-5 text-blue-500" />}
                        {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social-media" className="space-y-6">
            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(dashboardData.platformStats).map(([platform, stats]) => (
                <Card key={platform}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-500 mr-2" />}
                        {platform === 'facebook' && <Facebook className="w-5 h-5 text-blue-600 mr-2" />}
                        {platform === 'tiktok' && <Youtube className="w-5 h-5 text-black mr-2" />}
                        {platform === 'twitter' && <Twitter className="w-5 h-5 text-blue-400 mr-2" />}
                        <span className="font-semibold capitalize">{platform}</span>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Followers</span>
                        <span className="font-semibold">{stats.followers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Engagement</span>
                        <span className="font-semibold">{stats.engagement}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Posts Today</span>
                        <span className="font-semibold">{stats.postsToday}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Growth</span>
                        <span className="font-semibold text-green-600">+{stats.growth}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Scheduled Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Scheduled Posts</span>
                  <Button size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule New Post
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.scheduledPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {post.platform === 'Instagram' && <Instagram className="w-5 h-5 text-pink-500" />}
                          {post.platform === 'Facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
                          {post.platform === 'TikTok' && <Youtube className="w-5 h-5 text-black" />}
                        </div>
                        <div>
                          <div className="font-semibold">{post.athlete}</div>
                          <div className="text-sm text-gray-600">{post.content}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            {new Date(post.scheduledTime).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(post.scheduledTime).toLocaleTimeString()}
                          </div>
                        </div>
                        <Badge variant="outline">{post.status}</Badge>
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Auto-Posting Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Auto-Posting Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Instagram Auto-Posting</div>
                      <div className="text-sm text-gray-600">Automatically post athlete highlights and updates</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Facebook Auto-Posting</div>
                      <div className="text-sm text-gray-600">Post recruitment news and athlete profiles</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">TikTok Auto-Posting</div>
                      <div className="text-sm text-gray-600">Share viral athlete content and highlights</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Twitter Auto-Posting</div>
                      <div className="text-sm text-gray-600">Share breaking news and quick updates</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Athlete Discovery Tab */}
          <TabsContent value="discovery" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Discovery Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>ESPN Scraper</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>MaxPreps API</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Rivals.com</span>
                      <Badge variant="secondary">Inactive</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>247Sports</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quality Thresholds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Minimum Quality Score</span>
                        <span>75/100</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Auto-Approval Threshold</span>
                        <span>85/100</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Featured Athlete Threshold</span>
                        <span>90/100</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Discoveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold">Cooper Flagg</div>
                        <div className="text-sm text-gray-600">SF • Montverde Academy</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-yellow-500 text-white">98</Badge>
                      <Button size="sm">Review</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold">Ace Bailey</div>
                        <div className="text-sm text-gray-600">SF • McEachern High School</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-yellow-500 text-white">96</Badge>
                      <Button size="sm">Review</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Generation Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Athlete Profiles</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Recruitment News</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Highlight Articles</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Season Previews</span>
                      <Badge variant="secondary">Inactive</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Model Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Creativity Level</span>
                        <span>High</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Fact-Checking</span>
                        <span>Enabled</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>SEO Optimization</span>
                        <span>Enabled</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Generated Content Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-semibold">Cooper Flagg Profile Article</div>
                      <div className="text-sm text-gray-600">AI-generated athlete profile with stats and analysis</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">In Progress</Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-semibold">Recruitment Roundup</div>
                      <div className="text-sm text-gray-600">Weekly summary of college commitments</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Ready</Badge>
                      <Button size="sm">
                        <Upload className="w-4 h-4 mr-1" />
                        Publish
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Daily Average Likes</span>
                      <span className="font-bold">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Daily Average Shares</span>
                      <span className="font-bold">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Daily Average Comments</span>
                      <span className="font-bold">34</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Engagement Rate</span>
                      <span className="font-bold text-green-600">8.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Best Performing Platform</span>
                      <span className="font-bold">TikTok</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Most Engaging Content Type</span>
                      <span className="font-bold">Highlight Videos</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Article Read Time</span>
                      <span className="font-bold">6.2 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Content Quality Score</span>
                      <span className="font-bold text-green-600">92/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Export Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Performance Report
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Engagement Data
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Athlete Discovery Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
