'use client';

import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Instagram,
  Twitter,
  Facebook,
  Camera,
  Image,
  Video,
  Calendar,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Download,
  Play,
  Settings,
  Zap,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export default function SocialMediaDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFeatures, setSelectedFeatures] = useState(['gar-analysis', 'starpath']);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'twitter']);
  const [generating, setGenerating] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch social media stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/social-media/campaigns?type=stats'],
    refetchInterval: 30000,
  });

  // Fetch campaign templates
  const { data: templates } = useQuery({
    queryKey: ['/api/social-media/campaigns?type=templates'],
  });

  // Fetch campaigns list
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['/api/social-media/campaigns'],
    refetchInterval: 30000,
  });

  // Generate content
  const generateContent = useMutation({
    mutationFn: async (config: any) => {
      setGenerating(true);
      const response = await fetch('/api/social-media/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Generation failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Content Generated Successfully!',
        description: `Created ${data.data.screenshots?.length || 0} screenshots and ${data.data.content?.length || 0} posts`,
      });
      setGenerating(false);
    },
    onError: (error) => {
      toast({
        title: 'Generation Failed',
        description: error.message,
        variant: 'destructive',
      });
      setGenerating(false);
    },
  });

  // Create campaign
  const createCampaign = useMutation({
    mutationFn: async (config: any) => {
      const response = await fetch('/api/social-media/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Campaign creation failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Campaign Created!',
        description: `${data.data.postsCreated || 0} posts generated and scheduled`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/social-media/campaigns'] });
    },
    onError: (error) => {
      toast({
        title: 'Campaign Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const socialStats = stats?.data || {};
  const platformTemplates = templates?.data?.platforms || {};

  const handleQuickGenerate = async (type: string) => {
    setGenerating(true);
    
    try {
      if (type === 'screenshots') {
        // Generate screenshots for all selected features
        const features = selectedFeatures.length > 0 
          ? selectedFeatures 
          : ['gar-analysis', 'starpath', 'recruiting-hub'];
        
        for (const feature of features) {
          await fetch('/api/screenshots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              feature, 
              width: 1080, 
              height: 1920 
            })
          });
        }
        
        toast({ 
          title: 'Screenshots Generated!', 
          description: `Created ${features.length} feature screenshots` 
        });
      } 
      else if (type === 'promotional') {
        // Generate promotional content for selected platforms
        const platforms = selectedPlatforms.length > 0 
          ? selectedPlatforms 
          : ['instagram', 'facebook'];
        
        for (const platform of platforms) {
          await generateContent.mutateAsync({
            platform,
            feature: selectedFeatures[0] || 'gar-analysis',
            customPrompt: 'Create engaging promotional content',
          });
        }
        
        toast({ 
          title: 'Promotional Content Created!', 
          description: `Generated content for ${platforms.length} platforms` 
        });
      }
      else if (type === 'complete-campaign') {
        // Create full campaign workflow
        const campaignResponse = await fetch('/api/social-media/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: campaignName || `Auto Campaign ${new Date().toLocaleDateString()}`,
            description: 'Auto-generated campaign',
            platforms: JSON.stringify(selectedPlatforms.length > 0 ? selectedPlatforms : ['instagram', 'facebook']),
            features: JSON.stringify(selectedFeatures.length > 0 ? selectedFeatures : ['gar-analysis', 'starpath']),
            contentType: 'promotional',
          })
        });
        
        if (!campaignResponse.ok) throw new Error('Campaign creation failed');
        
        const campaign = await campaignResponse.json();
        const platforms = selectedPlatforms.length > 0 ? selectedPlatforms : ['instagram', 'facebook'];
        
        // Generate and schedule content for each platform
        for (const platform of platforms) {
          const contentResponse = await fetch('/api/social-media/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              platform, 
              feature: selectedFeatures[0] || 'gar-analysis'
            })
          });
          
          if (contentResponse.ok) {
            const content = await contentResponse.json();
            
            // Schedule for tomorrow at 10 AM
            const scheduledDate = new Date();
            scheduledDate.setDate(scheduledDate.getDate() + 1);
            scheduledDate.setHours(10, 0, 0, 0);
            
            await fetch('/api/social-media/schedule', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                campaignId: campaign.data.id,
                postId: `post_${Date.now()}_${platform}`,
                platform,
                content: JSON.stringify({
                  caption: content.caption,
                  hashtags: content.hashtags,
                  media: content.media,
                }),
                scheduledFor: scheduledDate.toISOString(),
              })
            });
          }
        }
        
        toast({ 
          title: 'Campaign Created!', 
          description: `Generated and scheduled content for ${platforms.length} platforms` 
        });
        
        // Refresh campaign stats
        queryClient.invalidateQueries({ queryKey: ['/api/social-media/campaigns'] });
      }
      else {
        // Default: use existing generateContent mutation
        generateContent.mutate({
          type,
          features: selectedFeatures,
          platforms: selectedPlatforms,
          generateImages: true,
          generateContent: true,
        });
      }
    } catch (error) {
      toast({ 
        title: 'Generation Failed', 
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Camera className="h-10 w-10 text-purple-400" />
            Social Media Automation
          </h1>
          <p className="text-purple-200">
            Automated content creation, scheduling, and campaign management across all platforms
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-pink-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-200 text-sm">Total Reach</p>
                  <p className="text-2xl font-bold text-white">
                    {socialStats.totalReach?.toLocaleString() || '15,420'}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-pink-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Engagement</p>
                  <p className="text-2xl font-bold text-white">
                    {socialStats.totalEngagement?.toLocaleString() || '1,834'}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Conversion Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {socialStats.conversionTracking?.conversionRate || '8.0'}%
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm">Posts Created</p>
                  <p className="text-2xl font-bold text-white">{socialStats.totalPosts || '47'}</p>
                </div>
                <Camera className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm">Scheduled</p>
                  <p className="text-2xl font-bold text-white">12</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 p-1 grid grid-cols-4 w-full">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="generate" className="data-[state=active]:bg-purple-600">
              Content Generator
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-purple-600">
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="bg-gray-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Quick Content Generation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleQuickGenerate('screenshots')}
                      disabled={generating}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Generate Feature Screenshots
                    </Button>

                    <Button
                      onClick={() => handleQuickGenerate('promotional')}
                      disabled={generating}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Create Promotional Images
                    </Button>

                    <Button
                      onClick={() => handleQuickGenerate('complete-campaign')}
                      disabled={generating}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Full Campaign Package
                    </Button>
                  </div>

                  {generating && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">Generating content...</span>
                        <span className="text-purple-400">Processing</span>
                      </div>
                      <Progress value={65} className="w-full" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Platform Status */}
              <Card className="bg-gray-800/50 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5 text-green-400" />
                    Platform Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white flex items-center gap-2">
                        <Instagram className="h-4 w-4" /> Instagram
                      </span>
                      <Badge className="bg-green-600">Ready</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white flex items-center gap-2">
                        <Twitter className="h-4 w-4" /> Twitter/X
                      </span>
                      <Badge className="bg-green-600">Ready</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white flex items-center gap-2">
                        <Facebook className="h-4 w-4" /> Facebook
                      </span>
                      <Badge className="bg-green-600">Ready</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white flex items-center gap-2">
                        <Video className="h-4 w-4" /> TikTok
                      </span>
                      <Badge className="bg-orange-600">Setup Required</Badge>
                    </div>
                  </div>

                  <div className="bg-green-900/30 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Automation Features:</h4>
                    <ul className="text-green-200 text-sm space-y-1">
                      <li>✅ Screenshot generation from live features</li>
                      <li>✅ AI-powered content creation</li>
                      <li>✅ Branded promotional image generation</li>
                      <li>✅ Optimal timing scheduling</li>
                      <li>✅ Cross-platform posting</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Performance */}
            <Card className="bg-gray-800/50 border-pink-500/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-400 mb-1">47</div>
                    <div className="text-gray-100">Posts Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">15.4K</div>
                    <div className="text-gray-100">Total Reach</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">11.9%</div>
                    <div className="text-gray-100">Engagement Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-1">287</div>
                    <div className="text-gray-100">Link Clicks</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Generator Tab */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Generation Settings */}
              <Card className="bg-gray-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-blue-400">Content Generation Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Features to Showcase</Label>
                    <div className="space-y-2">
                      {['gar-analysis', 'starpath', 'academy', 'ai-coach', 'recruitment'].map(
                        (feature) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <Checkbox
                              id={feature}
                              checked={selectedFeatures.includes(feature)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedFeatures([...selectedFeatures, feature]);
                                } else {
                                  setSelectedFeatures(
                                    selectedFeatures.filter((f) => f !== feature),
                                  );
                                }
                              }}
                            />
                            <Label htmlFor={feature} className="text-gray-100 capitalize">
                              {feature.replace('-', ' ')}
                            </Label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Target Platforms</Label>
                    <div className="space-y-2">
                      {['instagram', 'twitter', 'facebook', 'tiktok', 'linkedin'].map(
                        (platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <Checkbox
                              id={platform}
                              checked={selectedPlatforms.includes(platform)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedPlatforms([...selectedPlatforms, platform]);
                                } else {
                                  setSelectedPlatforms(
                                    selectedPlatforms.filter((p) => p !== platform),
                                  );
                                }
                              }}
                            />
                            <Label htmlFor={platform} className="text-gray-100 capitalize">
                              {platform}
                            </Label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generation Actions */}
              <Card className="bg-gray-800/50 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-400">Generate Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      onClick={() => handleQuickGenerate('screenshots')}
                      disabled={generating}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Screenshots Only
                      <Badge className="ml-auto">30s</Badge>
                    </Button>

                    <Button
                      onClick={() => handleQuickGenerate('content')}
                      disabled={generating}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      AI Content Only
                      <Badge className="ml-auto">10s</Badge>
                    </Button>

                    <Button
                      onClick={() => handleQuickGenerate('promotional')}
                      disabled={generating}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Branded Images
                      <Badge className="ml-auto">1m</Badge>
                    </Button>

                    <Button
                      onClick={() => handleQuickGenerate('video')}
                      disabled={generating}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Video Content
                      <Badge className="ml-auto">2m</Badge>
                    </Button>

                    <Button
                      onClick={() => handleQuickGenerate('complete-campaign')}
                      disabled={generating}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Complete Package
                      <Badge className="ml-auto bg-purple-800">3m</Badge>
                    </Button>
                  </div>

                  {generating && (
                    <div className="bg-purple-900/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-purple-400 animate-spin" />
                        <span className="text-purple-200">Generating content...</span>
                      </div>
                      <Progress value={65} className="w-full" />
                      <p className="text-purple-300 text-sm mt-2">
                        Capturing screenshots and generating AI content for{' '}
                        {selectedFeatures.length} features across {selectedPlatforms.length}{' '}
                        platforms
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            {/* Existing Campaigns List */}
            <Card className="bg-gray-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400">Active Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                {campaignsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  </div>
                ) : campaigns?.data?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {campaigns.data.map((campaign: any) => (
                      <Card key={campaign.id} className="bg-gray-700/50 border-gray-600">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm text-white">{campaign.name}</CardTitle>
                            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                              {campaign.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="text-xs text-gray-100 space-y-1">
                            <div>Type: {campaign.type}</div>
                            <div>Posts: {campaign.postsCount || 0}</div>
                            <div className="flex gap-1 flex-wrap">
                              {campaign.platforms?.map((platform: string) => (
                                <Badge key={platform} variant="outline" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                              onClick={() => {
                                toast({
                                  title: 'Edit Campaign',
                                  description: 'Campaign editing coming soon',
                                });
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1 text-xs"
                              onClick={async () => {
                                try {
                                  await fetch(`/api/social-media/campaigns?id=${campaign.id}`, {
                                    method: 'DELETE',
                                  });
                                  toast({
                                    title: 'Campaign Deleted',
                                    description: `${campaign.name} has been removed`,
                                  });
                                  queryClient.invalidateQueries({ queryKey: ['/api/social-media/campaigns'] });
                                } catch (error) {
                                  toast({
                                    title: 'Delete Failed',
                                    description: 'Could not delete campaign',
                                    variant: 'destructive',
                                  });
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-100">
                    No campaigns yet. Create your first campaign below!
                  </div>
                )}
              </CardContent>
            </Card>
          
            {/* Create New Campaign */}
            <Card className="bg-gray-800/50 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-yellow-400">Create New Campaign</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Campaign Name</Label>
                    <Input
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="e.g., January Feature Showcase"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Campaign Type</Label>
                    <Select defaultValue="feature-showcase">
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="feature-showcase">Feature Showcase</SelectItem>
                        <SelectItem value="athlete-spotlight">Athlete Spotlight</SelectItem>
                        <SelectItem value="educational">Educational Content</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() =>
                      createCampaign.mutate({
                        campaignName,
                        campaignType: 'feature-showcase',
                        platforms: selectedPlatforms,
                        generateContent: true,
                        scheduleImmediately: true,
                      })
                    }
                    disabled={!campaignName}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Post Now
                  </Button>

                  <Button
                    onClick={() =>
                      createCampaign.mutate({
                        campaignName,
                        campaignType: 'feature-showcase',
                        platforms: selectedPlatforms,
                        generateContent: true,
                        scheduleImmediately: false,
                      })
                    }
                    disabled={!campaignName}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
