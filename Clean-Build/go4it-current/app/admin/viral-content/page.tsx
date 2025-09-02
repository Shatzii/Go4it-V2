'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Zap,
  TrendingUp,
  Eye,
  Heart,
  Share,
  Download,
  Play,
  Image,
  Video,
  Instagram,
  Twitter,
  Flame,
  Target,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';

export default function ViralContentGenerator() {
  const [activeTab, setActiveTab] = useState('generator');
  const [selectedSport, setSelectedSport] = useState('Basketball');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [selectedContentType, setSelectedContentType] = useState('transformation');
  const [customHook, setCustomHook] = useState('');
  const [generateImages, setGenerateImages] = useState(true);
  const [generateCarousel, setGenerateCarousel] = useState(false);
  const [generateTikTokScript, setGenerateTikTokScript] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  // Fetch viral templates
  const { data: templates } = useQuery({
    queryKey: ['/api/social-media/viral?type=templates'],
  });

  // Fetch viral analytics
  const { data: analytics } = useQuery({
    queryKey: ['/api/social-media/viral?type=analytics'],
  });

  // Generate viral content
  const generateViralContent = useMutation({
    mutationFn: async (config: any) => {
      setGenerating(true);
      const response = await fetch('/api/social-media/viral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Viral content generation failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Viral Content Generated! 🔥',
        description: `Created ${data.data.image ? 'image + ' : ''}content for ${selectedPlatform}`,
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

  const viralData = templates?.data?.viralStrategies || {};
  const performanceData = analytics?.data?.viralPerformance || {};
  const trendingTopics = analytics?.data?.trendingTopics || [];

  const handleQuickGenerate = () => {
    generateViralContent.mutate({
      contentType: selectedContentType,
      sport: selectedSport,
      platform: selectedPlatform,
      generateImages,
      generateCarousel: generateCarousel && selectedPlatform === 'instagram',
      generateTikTokScript: generateTikTokScript && selectedPlatform === 'tiktok',
      customHook,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Flame className="h-10 w-10 text-red-400" />
            Viral Content Generator
          </h1>
          <p className="text-red-200">
            Create viral social media content using proven psychology and engagement patterns
          </p>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-200 text-sm">Viral Posts</p>
                  <p className="text-2xl font-bold text-white">
                    {performanceData.viralHits || '8'}
                  </p>
                </div>
                <Flame className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-pink-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-200 text-sm">Avg Engagement</p>
                  <p className="text-2xl font-bold text-white">
                    {performanceData.avgEngagementRate || '13.7'}%
                  </p>
                </div>
                <Heart className="h-8 w-8 text-pink-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm">Viral Threshold</p>
                  <p className="text-2xl font-bold text-white">
                    {(performanceData.viralThreshold || 10000).toLocaleString()}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm">Best Platform</p>
                  <p className="text-lg font-bold text-white">
                    {performanceData.bestPlatform || 'TikTok'}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Top Content</p>
                  <p className="text-lg font-bold text-white">Transform</p>
                </div>
                <Target className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800/50 p-1 grid grid-cols-4 w-full">
            <TabsTrigger value="generator" className="data-[state=active]:bg-red-600">
              Generator
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-red-600">
              Viral Templates
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-red-600">
              Trending Topics
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-red-600">
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Settings */}
              <Card className="bg-gray-800/50 border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-red-400" />
                    Viral Content Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Sport</Label>
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

                    <div className="space-y-2">
                      <Label className="text-white">Platform</Label>
                      <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Content Type</Label>
                    <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="transformation">Before/After Transformation</SelectItem>
                        <SelectItem value="secret_revealed">Industry Secret Revealed</SelectItem>
                        <SelectItem value="day_in_life">Day in Life POV</SelectItem>
                        <SelectItem value="mistake_warning">Common Mistakes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Custom Hook (Optional)</Label>
                    <Input
                      value={customHook}
                      onChange={(e) => setCustomHook(e.target.value)}
                      placeholder="e.g., This changed everything..."
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="generateImages"
                        checked={generateImages}
                        onCheckedChange={setGenerateImages}
                      />
                      <Label htmlFor="generateImages" className="text-white">
                        Generate viral images
                      </Label>
                    </div>

                    {selectedPlatform === 'instagram' && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="generateCarousel"
                          checked={generateCarousel}
                          onCheckedChange={setGenerateCarousel}
                        />
                        <Label htmlFor="generateCarousel" className="text-white">
                          Create Instagram carousel (5 slides)
                        </Label>
                      </div>
                    )}

                    {selectedPlatform === 'tiktok' && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="generateTikTokScript"
                          checked={generateTikTokScript}
                          onCheckedChange={setGenerateTikTokScript}
                        />
                        <Label htmlFor="generateTikTokScript" className="text-white">
                          Generate TikTok video script
                        </Label>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Generation Actions */}
              <Card className="bg-gray-800/50 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-400" />
                    Generate Viral Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleQuickGenerate}
                    disabled={generating}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3"
                    size="lg"
                  >
                    {generating ? (
                      <>
                        <Clock className="h-5 w-5 mr-2 animate-spin" />
                        Generating Viral Content...
                      </>
                    ) : (
                      <>
                        <Flame className="h-5 w-5 mr-2" />
                        Generate Viral Content
                      </>
                    )}
                  </Button>

                  <div className="bg-red-900/30 p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">What You'll Get:</h4>
                    <ul className="text-red-200 text-sm space-y-1">
                      <li>✅ AI-generated viral caption with proven hooks</li>
                      <li>✅ Optimized hashtags for maximum reach</li>
                      {generateImages && <li>✅ Eye-catching branded images</li>}
                      {generateCarousel && selectedPlatform === 'instagram' && (
                        <li>✅ 5-slide Instagram carousel</li>
                      )}
                      {generateTikTokScript && selectedPlatform === 'tiktok' && (
                        <li>✅ Complete TikTok video script</li>
                      )}
                      <li>✅ Engagement rate predictions</li>
                      <li>✅ Multiple content variations</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-700/50 p-2 rounded">
                      <div className="text-white font-bold">15.3%</div>
                      <div className="text-gray-400 text-xs">Avg Engagement</div>
                    </div>
                    <div className="bg-gray-700/50 p-2 rounded">
                      <div className="text-white font-bold">2.5x</div>
                      <div className="text-gray-400 text-xs">Higher Shares</div>
                    </div>
                    <div className="bg-gray-700/50 p-2 rounded">
                      <div className="text-white font-bold">10K+</div>
                      <div className="text-gray-400 text-xs">Viral Potential</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Templates */}
            <Card className="bg-gray-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400">Quick Viral Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {viralData.contentTypes?.map((template: any) => (
                    <div
                      key={template.id}
                      className="bg-gray-700/50 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => setSelectedContentType(template.id)}
                    >
                      <h4 className="text-white font-medium mb-2">{template.name}</h4>
                      <div className="flex justify-between items-center mb-2">
                        <Badge className="bg-green-600 text-white">{template.avgEngagement}</Badge>
                        <div className="flex gap-1">
                          {template.bestPlatforms.includes('instagram') && (
                            <Instagram className="h-4 w-4 text-pink-400" />
                          )}
                          {template.bestPlatforms.includes('tiktok') && (
                            <Video className="h-4 w-4 text-red-400" />
                          )}
                          {template.bestPlatforms.includes('twitter') && (
                            <Twitter className="h-4 w-4 text-blue-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates?.data?.templates?.map((template: any) => (
                <Card key={template.id} className="bg-gray-800/50 border-gray-600/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      {template.name}
                      <Badge className="bg-green-600">{template.engagement_rate}% avg</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-300 text-sm">{template.description}</p>

                    <div className="bg-gray-700/50 p-3 rounded font-mono text-sm text-blue-200">
                      {template.template}
                    </div>

                    <div className="space-y-2">
                      <p className="text-white font-medium text-sm">Sample Hooks:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.hooks.map((hook: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-yellow-400 border-yellow-400 text-xs"
                          >
                            {hook}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="space-y-6">
            <Card className="bg-gray-800/50 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-orange-400">Trending Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg"
                    >
                      <span className="text-white">{topic.topic}</span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-orange-600">{topic.engagement}% engagement</Badge>
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-blue-400">Platform Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics?.data?.platformInsights || {}).map(
                      ([platform, data]: [string, any]) => (
                        <div key={platform} className="bg-gray-700/50 p-3 rounded-lg">
                          <h4 className="text-white font-medium capitalize mb-2">{platform}</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-400">Best Content:</span>
                              <span className="text-white ml-2">{data.bestContentType}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Engagement:</span>
                              <span className="text-green-400 ml-2">{data.avgEngagement}%</span>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-400">Success Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-400 mb-1">
                        {performanceData.viralHits || 8}
                      </div>
                      <div className="text-gray-400">Posts Gone Viral</div>
                    </div>

                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-400 mb-1">
                        {performanceData.avgEngagementRate || 13.7}%
                      </div>
                      <div className="text-gray-400">Average Engagement Rate</div>
                    </div>

                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-400 mb-1">2.5x</div>
                      <div className="text-gray-400">Higher Than Industry Average</div>
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
