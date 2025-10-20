'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Clock,
  Send,
  Image,
  Calendar,
  Hash,
  Users,
  BarChart3,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface SocialMediaPosterProps {
  className?: string;
}

const platformIcons = {
  instagram: { icon: Instagram, color: 'text-purple-500' },
  twitter: { icon: Twitter, color: 'text-blue-500' },
  facebook: { icon: Facebook, color: 'text-blue-600' },
  linkedin: { icon: Linkedin, color: 'text-blue-700' },
  youtube: { icon: Youtube, color: 'text-red-600' },
};

export default function SocialMediaPoster({ className }: SocialMediaPosterProps) {
  const [postContent, setPostContent] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState('');
  const [activeTab, setActiveTab] = useState('compose');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get connected accounts
  const { data: accountsData } = useQuery({
    queryKey: ['/api/social-media/connect?userId=demo_user'],
  });

  // Get posting analytics
  const { data: analyticsData } = useQuery({
    queryKey: ['/api/social-media/post'],
  });

  // Post to social media
  const createPost = useMutation({
    mutationFn: async (postData: any) => {
      const response = await fetch('/api/social-media/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      if (!response.ok) throw new Error('Post failed');
      return response.json();
    },
    onSuccess: (data) => {
      if (selectedAccounts.length === 1) {
        toast({
          title: 'Post Published!',
          description: `Successfully posted to ${selectedAccounts.length} account`,
        });
      } else {
        toast({
          title: 'Multi-Post Complete!',
          description: `Posted to ${data.data.successfulPosts}/${data.data.totalAccounts} accounts`,
        });
      }

      // Reset form
      setPostContent('');
      setSelectedAccounts([]);
      setScheduledTime('');

      // Refresh analytics
      queryClient.invalidateQueries({ queryKey: ['/api/social-media/post'] });
    },
    onError: (error) => {
      toast({
        title: 'Post Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const connectedAccounts = accountsData?.data?.accounts || [];
  const analytics = analyticsData?.data || {};

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId],
    );
  };

  const handlePost = () => {
    if (!postContent.trim()) {
      toast({
        title: 'Content Required',
        description: 'Please enter post content',
        variant: 'destructive',
      });
      return;
    }

    if (selectedAccounts.length === 0) {
      toast({
        title: 'Select Accounts',
        description: 'Please select at least one account to post to',
        variant: 'destructive',
      });
      return;
    }

    createPost.mutate({
      accountIds: selectedAccounts,
      content: { text: postContent },
      scheduledTime: scheduledTime || null,
      postNow: !scheduledTime,
    });
  };

  const getCharacterCount = (platform: string) => {
    const limits = {
      instagram: 2200,
      twitter: 280,
      facebook: 63206,
      linkedin: 3000,
      youtube: 5000,
    };
    return limits[platform as keyof typeof limits] || 2200;
  };

  const isContentTooLong = (platform: string) => {
    return postContent.length > getCharacterCount(platform);
  };

  return (
    <div className={className}>
      <Card className="bg-gray-800/50 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-400" />
            Social Media Poster
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-700/50 mb-6">
              <TabsTrigger value="compose" className="data-[state=active]:bg-blue-600">
                Compose Post
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
                Recent Posts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="space-y-6">
              {/* Account Selection */}
              <div className="space-y-3">
                <Label className="text-white">Select Accounts to Post To</Label>

                {connectedAccounts.length === 0 ? (
                  <div className="text-center py-6 bg-gray-700/50 rounded-lg">
                    <Users className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">No social media accounts connected</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => window.open('/admin/social-accounts', '_blank')}
                    >
                      Connect Accounts
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {connectedAccounts.map((account: any) => {
                      const platformInfo =
                        platformIcons[account.platform as keyof typeof platformIcons];
                      const IconComponent = platformInfo?.icon;
                      const isSelected = selectedAccounts.includes(account.id);
                      const isTooLong = isContentTooLong(account.platform);

                      return (
                        <div
                          key={account.id}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-900/20'
                              : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                          } ${isTooLong ? 'border-red-500/50' : ''}`}
                          onClick={() => handleAccountToggle(account.id)}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleAccountToggle(account.id)}
                              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                            />
                            {IconComponent && (
                              <IconComponent className={`h-5 w-5 ${platformInfo.color}`} />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate capitalize">
                                {account.platform}
                              </p>
                              <p className="text-gray-400 text-sm truncate">@{account.username}</p>
                            </div>
                            {account.followers > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {account.followers.toLocaleString()}
                              </Badge>
                            )}
                          </div>

                          {isSelected && (
                            <div className="mt-2 text-xs">
                              <div className="flex justify-between text-gray-400">
                                <span>Character limit:</span>
                                <span className={isTooLong ? 'text-red-400' : 'text-gray-400'}>
                                  {postContent.length}/{getCharacterCount(account.platform)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="space-y-2">
                <Label className="text-white">Post Content</Label>
                <Textarea
                  placeholder="What's happening? Share your thoughts, insights, or updates..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white min-h-[120px] resize-none"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>
                    {selectedAccounts.length > 0 &&
                      `Posting to ${selectedAccounts.length} account${selectedAccounts.length > 1 ? 's' : ''}`}
                  </span>
                  <span>{postContent.length} characters</span>
                </div>
              </div>

              {/* Scheduling */}
              <div className="space-y-2">
                <Label className="text-white">Schedule Post (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  {scheduledTime && (
                    <Button variant="outline" onClick={() => setScheduledTime('')} className="px-3">
                      Clear
                    </Button>
                  )}
                </div>
                {scheduledTime && (
                  <p className="text-sm text-blue-400">
                    <Clock className="inline h-3 w-3 mr-1" />
                    Scheduled for {new Date(scheduledTime).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handlePost}
                  disabled={
                    createPost.isPending || !postContent.trim() || selectedAccounts.length === 0
                  }
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {createPost.isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      {scheduledTime ? 'Scheduling...' : 'Posting...'}
                    </>
                  ) : (
                    <>
                      {scheduledTime ? (
                        <>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Post
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Post Now
                        </>
                      )}
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    // Generate AI content
                    setPostContent(
                      "🏀 This basketball player's GAR score went from 67 to 89 in just 6 weeks!\n\n• Improved shooting accuracy by 23%\n• Increased vertical jump 4 inches  \n• Landed 3 D1 scholarship offers\n\nReady to unlock YOUR potential? Try GAR Analysis free! 👆\n\n#Basketball #AthleteGrowth #GAR #Go4ItSports #Recruiting",
                    );
                  }}
                  className="px-4"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  AI Generate
                </Button>
              </div>

              {/* Quick Tips */}
              <div className="bg-blue-900/20 p-4 rounded-lg">
                <h4 className="text-blue-400 font-medium mb-2">💡 Posting Tips</h4>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• Use emojis and hashtags to increase engagement</li>
                  <li>• Post when your audience is most active (6-8 PM)</li>
                  <li>• Include a clear call-to-action</li>
                  <li>• Keep Twitter posts under 280 characters for best reach</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">{analytics.totalPosts || 0}</div>
                  <div className="text-gray-400 text-sm">Total Posts</div>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {analytics.postsToday || 0}
                  </div>
                  <div className="text-gray-400 text-sm">Posts Today</div>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">
                    {analytics.avgEngagementRate || 0}%
                  </div>
                  <div className="text-gray-400 text-sm">Avg Engagement</div>
                </div>
                <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">
                    {analytics.postsThisWeek || 0}
                  </div>
                  <div className="text-gray-400 text-sm">This Week</div>
                </div>
              </div>

              {/* Recent Posts */}
              <div className="space-y-3">
                <h4 className="text-white font-medium">Recent Posts</h4>
                {analytics.recentPosts?.map((post: any) => {
                  const platformInfo = platformIcons[post.platform as keyof typeof platformIcons];
                  const IconComponent = platformInfo?.icon;

                  return (
                    <div key={post.id} className="p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {IconComponent && (
                            <IconComponent className={`h-4 w-4 ${platformInfo.color}`} />
                          )}
                          <span className="text-white capitalize">{post.platform}</span>
                        </div>
                        <span className="text-gray-400 text-sm">
                          {new Date(post.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{post.content}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-400">❤️ {post.engagement.likes}</span>
                        <span className="text-gray-400">💬 {post.engagement.comments}</span>
                        <span className="text-gray-400">🔄 {post.engagement.shares}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upcoming Posts */}
              {analytics.upcomingPosts?.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Upcoming Scheduled Posts</h4>
                  {analytics.upcomingPosts.map((post: any) => (
                    <div
                      key={post.id}
                      className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-400" />
                          <span className="text-white capitalize">{post.platform}</span>
                        </div>
                        <span className="text-yellow-400 text-sm">
                          {new Date(post.scheduledTime).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{post.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
