'use client';

import { useState, useEffect } from 'react';
import {
  Instagram,
  Twitter,
  Share2,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Music,
} from 'lucide-react';

interface SocialProfile {
  platform: string;
  username: string;
  followersCount: number;
  engagement: number;
  isVerified: boolean;
  profileUrl: string;
  lastPost: string;
}

interface SocialMetrics {
  totalFollowers: number;
  totalEngagement: number;
  viralPotential: number;
  reachScore: number;
  platforms: SocialProfile[];
}

export function SocialIntegration() {
  const [metrics, setMetrics] = useState<SocialMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [generatedContent, setGeneratedContent] = useState('');
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    fetchSocialMetrics();
  }, []);

  const fetchSocialMetrics = async () => {
    try {
      const response = await fetch('/api/social/integration?userId=demo_user');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMetrics(data.metrics);
        }
      }
    } catch (error) {
      console.error('Failed to fetch social metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async (contentType = 'post_caption') => {
    setContentLoading(true);
    try {
      const response = await fetch('/api/social/integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo_user',
          action: 'generate_content',
          content: { type: contentType },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setGeneratedContent(data.generatedContent);
        }
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setContentLoading(false);
    }
  };

  const connectPlatform = async (platform: string) => {
    try {
      const response = await fetch('/api/social/integration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo_user',
          action: 'connect_platform',
          platform,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`${platform} connected successfully!`);
        fetchSocialMetrics(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to connect platform:', error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'twitter':
        return <Twitter className="w-5 h-5 text-blue-500" />;
      case 'tiktok':
        return <Music className="w-5 h-5 text-black" />;
      default:
        return <Share2 className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Social Media Integration</h1>
          <p className="text-muted-foreground">
            Manage your athletic brand across all social media platforms
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
          {['overview', 'content', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && metrics && (
          <div className="space-y-6">
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-muted-foreground">Total Followers</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {formatNumber(metrics.totalFollowers)}
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-muted-foreground">Engagement</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{metrics.totalEngagement}%</div>
              </div>

              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-muted-foreground">Viral Potential</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{metrics.viralPotential}</div>
              </div>

              <div className="bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-muted-foreground">Reach Score</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {formatNumber(metrics.reachScore)}
                </div>
              </div>
            </div>

            {/* Platform Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {metrics.platforms.map((platform) => (
                <div key={platform.platform} className="bg-card p-6 rounded-lg border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getPlatformIcon(platform.platform)}
                      <div>
                        <h3 className="font-semibold text-foreground">{platform.platform}</h3>
                        <p className="text-sm text-muted-foreground">{platform.username}</p>
                      </div>
                    </div>
                    {platform.isVerified && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Followers</span>
                      <span className="font-medium text-foreground">
                        {formatNumber(platform.followersCount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Engagement</span>
                      <span className="font-medium text-foreground">{platform.engagement}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Last Post</span>
                      <span className="font-medium text-foreground">{platform.lastPost}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(platform.profileUrl, '_blank')}
                    className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-foreground mb-4">AI Content Generator</h3>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => generateContent('post_caption')}
                    disabled={contentLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    Generate Post
                  </button>
                  <button
                    onClick={() => generateContent('story_text')}
                    disabled={contentLoading}
                    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    Generate Story
                  </button>
                  <button
                    onClick={() => generateContent('video_script')}
                    disabled={contentLoading}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    Video Script
                  </button>
                </div>

                {contentLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Generating content...
                  </div>
                )}

                {generatedContent && !contentLoading && (
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-foreground">Generated Content</h4>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedContent);
                          alert('Content copied to clipboard!');
                        }}
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-line">
                      {generatedContent}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 border border-dashed border-muted-foreground rounded-lg hover:bg-muted transition-colors">
                  <Share2 className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm text-foreground">Schedule Post</span>
                </button>
                <button className="p-4 border border-dashed border-muted-foreground rounded-lg hover:bg-muted transition-colors">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm text-foreground">Trending Analysis</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Performance Analytics</h3>
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Analytics dashboard coming soon!</p>
                <p className="text-sm mt-2">
                  Track your social media performance and growth metrics
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
