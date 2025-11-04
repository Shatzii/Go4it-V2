'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Instagram,
  Facebook,
  Twitter,
  Video,
  Calendar,
  Sparkles,
  TrendingUp,
  Send,
  Clock,
  Loader2,
} from 'lucide-react';

interface GeneratedContent {
  platform: string;
  contentType: string;
  caption: string;
  hashtags: string[];
  imageUrl?: string;
  scheduled?: Date;
  status: 'draft' | 'scheduled' | 'published';
}

export default function SocialMediaAutomationPage() {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    instagram: true,
    facebook: true,
    twitter: true,
    tiktok: false,
  });
  const [contentSettings, setContentSettings] = useState({
    features: ['gar-analysis', 'starpath', 'recruiting'],
    contentType: 'mixed',
    count: 5,
    autoCaption: true,
    includeHashtags: true,
    includeScreenshots: true,
  });

  const generateContent = async () => {
    setLoading(true);
    try {
      const platforms = Object.entries(selectedPlatforms)
        .filter(([_, enabled]) => enabled)
        .map(([platform]) => platform);

      const response = await fetch('/api/social-media/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms,
          features: contentSettings.features,
          contentType: contentSettings.contentType,
          count: contentSettings.count,
          autoCaption: contentSettings.autoCaption,
          hashtags: contentSettings.includeHashtags,
          includeScreenshots: contentSettings.includeScreenshots,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedContent(data.content || []);
      }
    } catch (error) {
      // Failed to generate content
    } finally {
      setLoading(false);
    }
  };

  const scheduleContent = async (content: GeneratedContent, scheduledTime: Date) => {
    try {
      const response = await fetch('/api/social-media/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...content,
          scheduledTime: scheduledTime.toISOString(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update content status
        setGeneratedContent(prev =>
          prev.map(c =>
            c === content ? { ...c, status: 'scheduled', scheduled: scheduledTime } : c
          )
        );
      }
    } catch (error) {
      // Failed to schedule content
    }
  };

  const publishNow = async (content: GeneratedContent) => {
    try {
      const response = await fetch('/api/social-media/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedContent(prev =>
          prev.map(c => (c === content ? { ...c, status: 'published' } : c))
        );
      }
    } catch (error) {
      // Failed to publish content
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              Social Media <span className="text-[#00D4FF]">Automation</span>
            </h1>
            <p className="text-slate-400">
              AI-powered content generation for Instagram, Facebook, Twitter, and TikTok
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-green-500/30 text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
              Active
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Posts Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">1,247</div>
              <p className="text-xs text-green-400 mt-1">+18% this week</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Engagement Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">8.4%</div>
              <p className="text-xs text-green-400 mt-1">+2.3% vs last month</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">43</div>
              <p className="text-xs text-[#00D4FF] mt-1">Next 7 days</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">Time Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-white">42hrs</div>
              <p className="text-xs text-slate-400 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="generate">Generate Content</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Posts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Generate Content Tab */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Configuration Panel */}
              <Card className="lg:col-span-1 bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Content Settings</CardTitle>
                  <CardDescription>Configure AI generation parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Platform Selection */}
                  <div className="space-y-3">
                    <Label className="text-white">Platforms</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Instagram className="w-4 h-4 text-pink-400" />
                          <span className="text-sm text-white">Instagram</span>
                        </div>
                        <Switch
                          checked={selectedPlatforms.instagram}
                          onCheckedChange={(checked) =>
                            setSelectedPlatforms({ ...selectedPlatforms, instagram: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Facebook className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-white">Facebook</span>
                        </div>
                        <Switch
                          checked={selectedPlatforms.facebook}
                          onCheckedChange={(checked) =>
                            setSelectedPlatforms({ ...selectedPlatforms, facebook: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Twitter className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm text-white">Twitter</span>
                        </div>
                        <Switch
                          checked={selectedPlatforms.twitter}
                          onCheckedChange={(checked) =>
                            setSelectedPlatforms({ ...selectedPlatforms, twitter: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-white">TikTok</span>
                        </div>
                        <Switch
                          checked={selectedPlatforms.tiktok}
                          onCheckedChange={(checked) =>
                            setSelectedPlatforms({ ...selectedPlatforms, tiktok: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Type */}
                  <div className="space-y-2">
                    <Label className="text-white">Content Type</Label>
                    <select
                      className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-2"
                      value={contentSettings.contentType}
                      onChange={(e) =>
                        setContentSettings({ ...contentSettings, contentType: e.target.value })
                      }
                    >
                      <option value="mixed">Mixed (Images & Videos)</option>
                      <option value="image">Images Only</option>
                      <option value="video">Videos Only</option>
                      <option value="carousel">Carousel Posts</option>
                    </select>
                  </div>

                  {/* Post Count */}
                  <div className="space-y-2">
                    <Label className="text-white">Number of Posts</Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={contentSettings.count}
                      onChange={(e) =>
                        setContentSettings({ ...contentSettings, count: parseInt(e.target.value) })
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  {/* Advanced Options */}
                  <div className="space-y-3">
                    <Label className="text-white">Advanced Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Auto-generate captions</span>
                        <Switch
                          checked={contentSettings.autoCaption}
                          onCheckedChange={(checked) =>
                            setContentSettings({ ...contentSettings, autoCaption: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Include hashtags</span>
                        <Switch
                          checked={contentSettings.includeHashtags}
                          onCheckedChange={(checked) =>
                            setContentSettings({ ...contentSettings, includeHashtags: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Include screenshots</span>
                        <Switch
                          checked={contentSettings.includeScreenshots}
                          onCheckedChange={(checked) =>
                            setContentSettings({ ...contentSettings, includeScreenshots: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={generateContent}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#00D4FF] to-[#36E4FF] hover:from-[#00D4FF]/90 hover:to-[#36E4FF]/90 text-slate-900 font-black"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated Content Preview */}
              <div className="lg:col-span-2 space-y-4">
                {generatedContent.length === 0 ? (
                  <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
                    <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Content Generated Yet</h3>
                    <p className="text-slate-400">
                      Configure your settings and click Generate Content to create AI-powered social media posts
                    </p>
                  </Card>
                ) : (
                  generatedContent.map((content, index) => (
                    <Card key={index} className="bg-slate-900/50 border-slate-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {content.platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-400" />}
                            {content.platform === 'facebook' && <Facebook className="w-5 h-5 text-blue-400" />}
                            {content.platform === 'twitter' && <Twitter className="w-5 h-5 text-cyan-400" />}
                            {content.platform === 'tiktok' && <Video className="w-5 h-5 text-purple-400" />}
                            <CardTitle className="text-white capitalize">{content.platform}</CardTitle>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              content.status === 'published'
                                ? 'border-green-500/30 text-green-400'
                                : content.status === 'scheduled'
                                ? 'border-blue-500/30 text-blue-400'
                                : 'border-slate-500/30 text-slate-400'
                            }
                          >
                            {content.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm text-slate-400">Caption</Label>
                          <p className="text-white mt-1">{content.caption}</p>
                        </div>
                        {content.hashtags && content.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {content.hashtags.map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-[#00D4FF] border-[#00D4FF]/30">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => publishNow(content)}
                            disabled={content.status === 'published'}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Publish Now
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const tomorrow = new Date();
                              tomorrow.setDate(tomorrow.getDate() + 1);
                              scheduleContent(content, tomorrow);
                            }}
                            disabled={content.status !== 'draft'}
                            className="border-[#00D4FF]/30 text-[#00D4FF] hover:bg-[#00D4FF]/10"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Schedule
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Scheduled Posts Tab */}
          <TabsContent value="scheduled">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Scheduled Posts</CardTitle>
                <CardDescription>Manage your upcoming social media posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Scheduled Posts</h3>
                  <p className="text-slate-400">
                    Generate content and schedule it to see your upcoming posts here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Performance Analytics</CardTitle>
                <CardDescription>Track engagement and reach across all platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Analytics Coming Soon</h3>
                  <p className="text-slate-400">
                    Detailed performance metrics and insights will be available here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Platform Connections</CardTitle>
                <CardDescription>Connect your social media accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Instagram className="w-6 h-6 text-pink-400" />
                    <div>
                      <div className="font-semibold text-white">Instagram</div>
                      <div className="text-sm text-slate-400">Not connected</div>
                    </div>
                  </div>
                  <Button variant="outline" className="border-[#00D4FF]/30 text-[#00D4FF]">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Facebook className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="font-semibold text-white">Facebook</div>
                      <div className="text-sm text-slate-400">Not connected</div>
                    </div>
                  </div>
                  <Button variant="outline" className="border-[#00D4FF]/30 text-[#00D4FF]">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Twitter className="w-6 h-6 text-cyan-400" />
                    <div>
                      <div className="font-semibold text-white">Twitter</div>
                      <div className="text-sm text-slate-400">Not connected</div>
                    </div>
                  </div>
                  <Button variant="outline" className="border-[#00D4FF]/30 text-[#00D4FF]">
                    Connect
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
