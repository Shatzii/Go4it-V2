'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Calendar,
  Clock,
  Trash2,
  Edit,
  Instagram,
  Facebook,
  Twitter,
  RefreshCw,
} from 'lucide-react';

export default function SchedulePage() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch scheduled posts
  const { data: scheduledPosts, isLoading } = useQuery({
    queryKey: ['/api/social-media/schedule'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleCancelPost = async (postId: string) => {
    setDeletingId(postId);
    try {
      const response = await fetch(`/api/social-media/schedule?id=${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to cancel post');

      toast({
        title: 'Post Cancelled',
        description: 'Scheduled post has been removed',
      });

      queryClient.invalidateQueries({ queryKey: ['/api/social-media/schedule'] });
    } catch (error) {
      toast({
        title: 'Cancellation Failed',
        description: error instanceof Error ? error.message : 'Could not cancel post',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleReschedule = (postId: string) => {
    toast({
      title: 'Reschedule',
      description: 'Rescheduling functionality coming soon',
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return Instagram;
      case 'facebook':
        return Facebook;
      case 'twitter':
      case 'x':
        return Twitter;
      default:
        return Calendar;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'text-pink-500';
      case 'facebook':
        return 'text-blue-500';
      case 'twitter':
      case 'x':
        return 'text-sky-500';
      default:
        return 'text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPast: date < new Date(),
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Schedule Manager</h1>
            <p className="text-gray-100">Manage your scheduled social media posts</p>
          </div>
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/social-media/schedule'] })}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-purple-400 text-sm">Total Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {scheduledPosts?.data?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-400 text-sm">Upcoming Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {scheduledPosts?.data?.filter((post: any) => {
                  const postDate = new Date(post.scheduledFor);
                  const today = new Date();
                  return postDate.toDateString() === today.toDateString() && postDate > today;
                }).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-400 text-sm">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {scheduledPosts?.data?.filter((post: any) => {
                  const postDate = new Date(post.scheduledFor);
                  const today = new Date();
                  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return postDate > today && postDate <= weekFromNow;
                }).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scheduled Posts List */}
        <Card className="bg-gray-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Scheduled Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                <p className="text-gray-100 mt-4">Loading scheduled posts...</p>
              </div>
            ) : scheduledPosts?.data?.length > 0 ? (
              <div className="space-y-4">
                {scheduledPosts.data
                  .sort((a: any, b: any) => 
                    new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
                  )
                  .map((post: any) => {
                    const { date, time, isPast } = formatDate(post.scheduledFor);
                    const PlatformIcon = getPlatformIcon(post.platform);
                    const platformColor = getPlatformColor(post.platform);

                    return (
                      <div
                        key={post.id}
                        className={`p-4 rounded-lg border transition-all ${
                          isPast 
                            ? 'bg-red-900/20 border-red-500/30' 
                            : 'bg-gray-700/50 border-gray-600 hover:border-purple-500/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Platform Icon */}
                            <div className={`${platformColor} mt-1`}>
                              <PlatformIcon className="h-6 w-6" />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="capitalize">
                                  {post.platform}
                                </Badge>
                                {isPast && (
                                  <Badge variant="destructive" className="text-xs">
                                    Overdue
                                  </Badge>
                                )}
                                {post.status && (
                                  <Badge variant="secondary" className="text-xs capitalize">
                                    {post.status}
                                  </Badge>
                                )}
                              </div>

                              <p className="text-white text-sm line-clamp-2 mb-3">
                                {post.content?.caption || post.content?.title || 'No caption'}
                              </p>

                              <div className="flex items-center gap-4 text-xs text-gray-100">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {date}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {time}
                                </div>
                                {post.campaignId && (
                                  <div className="text-purple-400">
                                    Campaign #{post.campaignId}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleReschedule(post.id)}
                              disabled={isPast}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCancelPost(post.id)}
                              disabled={deletingId === post.id}
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-100 text-lg">No scheduled posts</p>
                <p className="text-gray-200 text-sm mt-2">
                  Schedule posts from the Social Media Dashboard or Content Creator
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
