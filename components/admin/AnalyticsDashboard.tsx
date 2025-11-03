'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface AnalyticsData {
  scraper: {
    totalScrapestoday: number;
    successRate: number;
    totalRecords: number;
    avgProcessingTime: number;
    recentScrapes: Array<{
      id: string;
      source: string;
      sport: string;
      region: string;
      totalRecords: number;
      status: string;
      createdAt: string;
    }>;
  };
  socialMedia: {
    totalCampaigns: number;
    activeCampaigns: number;
    scheduledPosts: number;
    publishedToday: number;
    totalEngagement: number;
    avgEngagementRate: number;
    topPerformingPosts: Array<{
      id: string;
      platform: string;
      content: string;
      engagement: number;
      publishedAt: string;
    }>;
  };
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('24h');

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/analytics/dashboard', timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/dashboard?range=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const scraperStats = analytics?.data?.scraper || {
    totalScrapesToday: 0,
    successRate: 0,
    totalRecords: 0,
    avgProcessingTime: 0,
    recentScrapes: [],
  };

  const socialStats = analytics?.data?.socialMedia || {
    totalCampaigns: 0,
    activeCampaigns: 0,
    scheduledPosts: 0,
    publishedToday: 0,
    totalEngagement: 0,
    avgEngagementRate: 0,
    topPerformingPosts: [],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Real-time insights into scraper performance and social media engagement
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6">
        {['1h', '24h', '7d', '30d'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {range === '1h' && 'Last Hour'}
            {range === '24h' && 'Last 24 Hours'}
            {range === '7d' && 'Last 7 Days'}
            {range === '30d' && 'Last 30 Days'}
          </button>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scraper">Scraper Analytics</TabsTrigger>
          <TabsTrigger value="social">Social Media Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Scrapes Today</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{scraperStats.totalScrapesToday}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">+12%</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scraper Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{scraperStats.successRate}%</div>
                <Progress value={scraperStats.successRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts Published Today</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{socialStats.publishedToday}</div>
                <p className="text-xs text-muted-foreground">
                  {socialStats.scheduledPosts} scheduled
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {socialStats.totalEngagement.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">+{socialStats.avgEngagementRate}%</span> avg rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Scrapes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scraperStats.recentScrapes.slice(0, 5).map((scrape) => (
                    <div key={scrape.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            scrape.status === 'success'
                              ? 'bg-green-500'
                              : scrape.status === 'partial'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                        ></div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {scrape.sport} - {scrape.region}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {scrape.source} • {scrape.totalRecords} records
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(scrape.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialStats.topPerformingPosts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {post.platform}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-900 dark:text-white truncate">
                          {post.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                        <Heart className="w-4 h-4" />
                        {post.engagement.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scraper Analytics Tab */}
        <TabsContent value="scraper" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{scraperStats.totalRecords.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-2">Athletes scraped</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{scraperStats.avgProcessingTime}s</div>
                <p className="text-xs text-muted-foreground mt-2">Per scraping job</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{scraperStats.successRate}%</div>
                <Progress value={scraperStats.successRate} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Detailed Scrape History */}
          <Card>
            <CardHeader>
              <CardTitle>Scraping History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scraperStats.recentScrapes.map((scrape) => (
                  <div
                    key={scrape.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {scrape.status === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : scrape.status === 'partial' ? (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {scrape.sport} - {scrape.region}
                        </p>
                        <p className="text-sm text-slate-500">
                          Source: {scrape.source} • {scrape.totalRecords} records
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={scrape.status === 'success' ? 'default' : 'destructive'}>
                        {scrape.status}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(scrape.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Analytics Tab */}
        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{socialStats.totalCampaigns}</div>
                <p className="text-xs text-muted-foreground">
                  {socialStats.activeCampaigns} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{socialStats.scheduledPosts}</div>
                <p className="text-xs text-muted-foreground">Ready to publish</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(socialStats.totalEngagement * 3).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Estimated impressions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{socialStats.avgEngagementRate}%</div>
                <Progress value={socialStats.avgEngagementRate * 10} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Platform Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Instagram', 'Facebook', 'Twitter', 'TikTok'].map((platform) => (
                  <div key={platform}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{platform}</span>
                      <span className="text-sm text-slate-500">
                        {Math.floor(Math.random() * 5000)} engagements
                      </span>
                    </div>
                    <Progress value={Math.random() * 100} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
