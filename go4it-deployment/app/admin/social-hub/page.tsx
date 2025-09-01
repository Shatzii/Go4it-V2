'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Megaphone,
  TrendingUp,
  Users,
  Calendar,
  Zap,
  BarChart3,
  Settings,
  Plus,
  Instagram,
  Twitter,
  Facebook,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Share2,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import SocialMediaPoster from '@/components/social-media-poster';

export default function SocialMediaHub() {
  const [activeTab, setActiveTab] = useState('hub');

  // Get social media data
  const { data: accountsData } = useQuery({
    queryKey: ['/api/social-media/connect?userId=demo_user'],
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['/api/social-media/post'],
  });

  const { data: campaignsData } = useQuery({
    queryKey: ['/api/campaigns/schedule'],
  });

  const connectedAccounts = accountsData?.data?.accounts || [];
  const analytics = analyticsData?.data || {};
  const campaignStats = campaignsData?.data || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Megaphone className="h-10 w-10 text-purple-400" />
            Social Media Hub
          </h1>
          <p className="text-purple-200">
            Complete social media management, automation, and analytics center
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Connected</p>
                  <p className="text-2xl font-bold text-white">{connectedAccounts.length}</p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Total Posts</p>
                  <p className="text-2xl font-bold text-white">{analytics.totalPosts || 47}</p>
                </div>
                <Share2 className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Engagement</p>
                  <p className="text-2xl font-bold text-white">
                    {analytics.avgEngagementRate || 8.7}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm">Active Campaigns</p>
                  <p className="text-2xl font-bold text-white">
                    {campaignStats.totalActiveCampaigns || 3}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm">Followers</p>
                  <p className="text-2xl font-bold text-white">
                    {connectedAccounts
                      .reduce((sum: number, acc: any) => sum + (acc.followers || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 p-1 grid grid-cols-4 w-full">
            <TabsTrigger value="hub" className="data-[state=active]:bg-purple-600">
              Hub Overview
            </TabsTrigger>
            <TabsTrigger value="post" className="data-[state=active]:bg-purple-600">
              Create Post
            </TabsTrigger>
            <TabsTrigger value="automation" className="data-[state=active]:bg-purple-600">
              Automation
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Hub Overview Tab */}
          <TabsContent value="hub" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Connected Accounts */}
              <Card className="bg-gray-800/50 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-400" />
                      Connected Accounts
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('/admin/social-accounts', '_blank')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add More
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {connectedAccounts.length === 0 ? (
                    <div className="text-center py-6">
                      <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No accounts connected yet</p>
                      <Button
                        onClick={() => window.open('/admin/social-accounts', '_blank')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Connect Your First Account
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {connectedAccounts.map((account: any) => (
                        <div
                          key={account.id}
                          className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {account.platform === 'instagram' && (
                              <Instagram className="h-5 w-5 text-purple-500" />
                            )}
                            {account.platform === 'twitter' && (
                              <Twitter className="h-5 w-5 text-blue-500" />
                            )}
                            {account.platform === 'facebook' && (
                              <Facebook className="h-5 w-5 text-blue-600" />
                            )}
                            <div>
                              <p className="text-white font-medium capitalize">
                                {account.platform}
                              </p>
                              <p className="text-gray-400 text-sm">@{account.username}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={
                                account.connectionStatus === 'connected'
                                  ? 'bg-green-600'
                                  : account.connectionStatus === 'expired'
                                    ? 'bg-yellow-600'
                                    : 'bg-red-600'
                              }
                            >
                              {account.connectionStatus}
                            </Badge>
                            <p className="text-gray-400 text-sm mt-1">
                              {account.followers?.toLocaleString() || '0'} followers
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setActiveTab('post')}
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Create New Post
                  </Button>

                  <Button
                    onClick={() => window.open('/admin/viral-content', '_blank')}
                    className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Generate Viral Content
                  </Button>

                  <Button
                    onClick={() => window.open('/admin/social-media', '_blank')}
                    className="w-full justify-start bg-green-600 hover:bg-green-700"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Campaign
                  </Button>

                  <Button
                    onClick={() => window.open('/admin/advanced-automation', '_blank')}
                    className="w-full justify-start bg-orange-600 hover:bg-orange-700"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    AI Automation
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-gray-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.recentPosts?.slice(0, 3).map((post: any, index: number) => (
                    <div
                      key={post.id || index}
                      className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg"
                    >
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium capitalize">{post.platform}</span>
                          <Badge variant="outline" className="text-xs">
                            {new Date(post.timestamp).toLocaleTimeString()}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2">{post.content}</p>
                        <div className="flex gap-3 mt-2 text-xs text-gray-400">
                          <span>❤️ {post.engagement?.likes || 0}</span>
                          <span>💬 {post.engagement?.comments || 0}</span>
                          <span>🔄 {post.engagement?.shares || 0}</span>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-6">
                      <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No recent posts</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Post Tab */}
          <TabsContent value="post" className="space-y-6">
            <SocialMediaPoster />
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Campaign Status */}
              <Card className="bg-gray-800/50 border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-orange-400">Active Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">
                      {campaignStats.totalActiveCampaigns || 3}
                    </div>
                    <p className="text-gray-400 mb-4">Campaigns Running</p>
                    <Button
                      onClick={() => window.open('/admin/social-media', '_blank')}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      Manage Campaigns
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* AI Features */}
              <Card className="bg-gray-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-400">AI Automation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white">Prospect Analysis</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Content Generation</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Viral Optimization</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <Button
                      onClick={() => window.open('/admin/advanced-automation', '_blank')}
                      className="w-full bg-purple-600 hover:bg-purple-700 mt-4"
                    >
                      Advanced Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Screenshot Generator */}
              <Card className="bg-gray-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-blue-400">Content Generator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-300 text-sm">
                      Automatically capture screenshots of platform features and generate
                      promotional content.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <Badge variant="outline">GAR Analysis</Badge>
                      <Badge variant="outline">StarPath</Badge>
                      <Badge variant="outline">Academy</Badge>
                      <Badge variant="outline">AI Coach</Badge>
                    </div>
                    <Button
                      onClick={() => window.open('/admin/viral-content', '_blank')}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Generate Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-400">Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {analytics.totalPosts || 47}
                        </div>
                        <div className="text-gray-400 text-sm">Total Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {analytics.avgEngagementRate || 8.7}%
                        </div>
                        <div className="text-gray-400 text-sm">Avg Engagement</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <span className="text-white">Best Platform</span>
                      <Badge className="bg-purple-600">
                        {analytics.topPerformingPlatform || 'Instagram'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <span className="text-white">Posts This Week</span>
                      <span className="text-white font-bold">{analytics.postsThisWeek || 18}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-blue-400">Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-1">+23.5%</div>
                      <div className="text-gray-400">Engagement Growth</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Instagram</span>
                        <span className="text-white">+156 followers</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Twitter</span>
                        <span className="text-white">+89 followers</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Facebook</span>
                        <span className="text-white">+45 followers</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-green-400">
                      <ArrowUpRight className="h-4 w-4" />
                      <span className="text-sm">Overall growth trending up</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
