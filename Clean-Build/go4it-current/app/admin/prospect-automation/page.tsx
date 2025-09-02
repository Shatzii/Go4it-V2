'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Users,
  Mail,
  Instagram,
  Twitter,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Settings,
  Download,
  Eye,
  Send,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Prospect {
  id: string;
  name: string;
  email?: string;
  sport: string;
  position?: string;
  classYear?: string;
  state?: string;
  school?: string;
  followers?: number;
  nationalRanking?: number;
  recruitingStatus?: string;
  source: string;
  contactAttempts: number;
  responseReceived: boolean;
  registeredUser: boolean;
  emailStatus?: string;
  createdAt: string;
}

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  sport?: string;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalRegistrations: number;
  createdAt: string;
}

interface ScrapingJob {
  id: string;
  name: string;
  type: string;
  status: string;
  recordsFound: number;
  recordsProcessed: number;
  lastRun?: string;
  createdAt: string;
}

export default function ProspectAutomationDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSport, setSelectedSport] = useState<string>('Basketball');
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch prospects
  const { data: prospects = [], isLoading: prospectsLoading } = useQuery({
    queryKey: ['/api/prospects'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch campaigns
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ['/api/campaigns'],
  });

  // Fetch scraping jobs
  const { data: scrapingJobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/scraping/automated'],
  });

  // Run automated scraping
  const runScrapingMutation = useMutation({
    mutationFn: async (config: any) => {
      const response = await fetch('/api/scraping/automated', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Failed to run scraping');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Scraping Started',
        description: `Found ${data.data.prospects.length} new prospects`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/prospects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/scraping/automated'] });
    },
    onError: (error) => {
      toast({
        title: 'Scraping Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Create campaign
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: any) => {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData),
      });
      if (!response.ok) throw new Error('Failed to create campaign');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Campaign Created',
        description: 'Your outreach campaign is ready to launch',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
    },
  });

  // Launch campaign
  const launchCampaignMutation = useMutation({
    mutationFn: async ({ campaignId, testMode }: { campaignId: string; testMode: boolean }) => {
      const response = await fetch('/api/campaigns/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, testMode }),
      });
      if (!response.ok) throw new Error('Failed to launch campaign');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Campaign Launched',
        description: `Successfully contacted ${data.data.successful} prospects`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['/api/prospects'] });
    },
  });

  // Quick stats calculations
  const stats = {
    totalProspects: prospects.length,
    newThisWeek: prospects.filter(
      (p) => new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    ).length,
    contacted: prospects.filter((p) => p.contactAttempts > 0).length,
    responded: prospects.filter((p) => p.responseReceived).length,
    registered: prospects.filter((p) => p.registeredUser).length,
    activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
    completedJobs: scrapingJobs.filter((j) => j.status === 'completed').length,
  };

  const conversionRate =
    stats.contacted > 0 ? ((stats.registered / stats.contacted) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Prospect Automation Center</h1>
          <p className="text-blue-200">
            Automated athlete discovery, outreach campaigns, and conversion tracking
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Total Prospects</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalProspects.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">New This Week</p>
                  <p className="text-2xl font-bold text-white">+{stats.newThisWeek}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm">Contacted</p>
                  <p className="text-2xl font-bold text-white">{stats.contacted}</p>
                </div>
                <Mail className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Responded</p>
                  <p className="text-2xl font-bold text-white">{stats.responded}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Registered</p>
                  <p className="text-2xl font-bold text-white">{stats.registered}</p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Conversion</p>
                  <p className="text-2xl font-bold text-white">{conversionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm">Active Campaigns</p>
                  <p className="text-2xl font-bold text-white">{stats.activeCampaigns}</p>
                </div>
                <Settings className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="scraping" className="data-[state=active]:bg-blue-600">
              Auto Scraping
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-blue-600">
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="prospects" className="data-[state=active]:bg-blue-600">
              Prospect Database
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="bg-gray-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() =>
                      runScrapingMutation.mutate({
                        jobName: `Quick Scrape ${new Date().toLocaleDateString()}`,
                        sports: [selectedSport],
                        locations: ['TX', 'CA', 'FL', 'NY', 'GA'],
                        maxResults: 100,
                      })
                    }
                    disabled={runScrapingMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {runScrapingMutation.isPending ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Running Scrape...
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        Run Quick Prospect Discovery
                      </>
                    )}
                  </Button>

                  <div className="space-y-2">
                    <Label className="text-white">Target Sport</Label>
                    <Select value={selectedSport} onValueChange={setSelectedSport}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="Basketball">Basketball</SelectItem>
                        <SelectItem value="Football">Football</SelectItem>
                        <SelectItem value="Soccer">Soccer</SelectItem>
                        <SelectItem value="Baseball">Baseball</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() =>
                      createCampaignMutation.mutate({
                        name: `${selectedSport} Outreach ${new Date().toLocaleDateString()}`,
                        type: 'email',
                        sport: selectedSport,
                        subject: 'Unlock Your Athletic Potential with Go4It Sports',
                        emailTemplate: `Hi {name},\n\nI noticed your impressive {sport} performance at {school}. Have you calculated your GAR (Growth & Ability Rating) score yet?\n\nTop college coaches are using GAR scores to discover hidden talent like yours. Athletes with strong {position} skills often score higher than they expect.\n\nGet your free GAR analysis here: https://go4itsports.com/gar-analysis?ref=recruit\n\nBest regards,\nGo4It Sports Team`,
                        states: ['TX', 'CA', 'FL', 'NY', 'GA'],
                        minFollowers: 500,
                        maxFollowers: 50000,
                      })
                    }
                    disabled={createCampaignMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Create Email Campaign
                  </Button>
                </CardContent>
              </Card>

              {/* Automation Settings */}
              <Card className="bg-gray-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Automation Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Daily Auto-Scraping</p>
                      <p className="text-gray-400 text-sm">
                        Automatically discover new prospects daily
                      </p>
                    </div>
                    <Switch
                      checked={automationEnabled}
                      onCheckedChange={setAutomationEnabled}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Daily Target</Label>
                    <Input
                      type="number"
                      defaultValue="500"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Auto-Email Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="manual">Manual Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-gray-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scrapingJobs.slice(0, 5).map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">{job.name}</p>
                        <p className="text-gray-400 text-sm">
                          Found {job.recordsFound} prospects •{' '}
                          {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={job.status === 'completed' ? 'default' : 'secondary'}
                        className={job.status === 'completed' ? 'bg-green-600' : 'bg-orange-600'}
                      >
                        {job.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs content would go here... */}
          <TabsContent value="scraping" className="space-y-6">
            <Card className="bg-gray-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Automated Prospect Scraping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Configure and monitor automated athlete discovery from ESPN, MaxPreps, and social
                  media platforms.
                </p>
                {/* Scraping controls would go here */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card className="bg-gray-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Outreach Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Create and manage automated email and social media outreach campaigns.
                </p>
                {/* Campaign management would go here */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prospects" className="space-y-6">
            <Card className="bg-gray-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Prospect Database</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Browse and manage your discovered athlete prospects.
                </p>
                {/* Prospect table would go here */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-gray-800/50 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Campaign Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Track conversion rates, email performance, and ROI metrics.
                </p>
                {/* Analytics charts would go here */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
