import { NextRequest, NextResponse } from 'next/server';
import { socialMediaEngine } from '@/lib/social-media-automation';
import { db } from '@/server/db';

// GET - Get all social media campaigns and stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'stats') {
      const stats = await socialMediaEngine.getAggregatedSocialStats();
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    if (type === 'templates') {
      return NextResponse.json({
        success: true,
        data: {
          campaignTypes: [
            {
              id: 'feature-showcase',
              name: 'Feature Showcase',
              description: 'Highlight platform features with screenshots and demos',
              frequency: 'daily',
              platforms: ['instagram', 'twitter', 'facebook'],
              expectedReach: '2,000-5,000',
            },
            {
              id: 'athlete-spotlight',
              name: 'Athlete Spotlight',
              description: 'Feature successful athletes using the platform',
              frequency: 'weekly',
              platforms: ['instagram', 'tiktok', 'facebook'],
              expectedReach: '3,000-8,000',
            },
            {
              id: 'educational',
              name: 'Educational Content',
              description: 'Tips, tutorials, and educational posts about recruiting',
              frequency: 'daily',
              platforms: ['instagram', 'twitter', 'linkedin'],
              expectedReach: '1,500-4,000',
            },
            {
              id: 'success-story',
              name: 'Success Stories',
              description: 'Testimonials and success stories from athletes',
              frequency: 'weekly',
              platforms: ['instagram', 'facebook', 'linkedin'],
              expectedReach: '4,000-10,000',
            },
            {
              id: 'promotional',
              name: 'Promotional Campaigns',
              description: 'Direct promotional content with clear CTAs',
              frequency: 'weekly',
              platforms: ['facebook', 'instagram', 'twitter'],
              expectedReach: '2,500-6,000',
            },
          ],
          platforms: {
            instagram: {
              name: 'Instagram',
              optimalTimes: ['12 PM', '6 PM', '8 PM'],
              contentTypes: ['carousel', 'stories', 'reels', 'posts'],
              characterLimit: 2200,
              hashtagLimit: 30,
            },
            twitter: {
              name: 'Twitter/X',
              optimalTimes: ['12 PM', '3 PM', '5 PM'],
              contentTypes: ['tweets', 'threads', 'polls'],
              characterLimit: 280,
              hashtagLimit: 5,
            },
            facebook: {
              name: 'Facebook',
              optimalTimes: ['1 PM', '3 PM', '7 PM'],
              contentTypes: ['posts', 'stories', 'videos'],
              characterLimit: 500,
              hashtagLimit: 10,
            },
            tiktok: {
              name: 'TikTok',
              optimalTimes: ['6 PM', '7 PM', '8 PM'],
              contentTypes: ['videos', 'effects'],
              characterLimit: 150,
              hashtagLimit: 20,
            },
            linkedin: {
              name: 'LinkedIn',
              optimalTimes: ['9 AM', '12 PM', '5 PM'],
              contentTypes: ['posts', 'articles', 'polls'],
              characterLimit: 3000,
              hashtagLimit: 5,
            },
          },
        },
      });
    }

    // Default: return active campaigns
    return NextResponse.json({
      success: true,
      data: {
        activeCampaigns: 3,
        scheduledPosts: 47,
        platforms: ['instagram', 'twitter', 'facebook', 'tiktok', 'linkedin'],
        lastPosted: '2 hours ago',
        nextScheduled: '6:00 PM today',
      },
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch campaigns' },
      { status: 500 },
    );
  }
}

// POST - Create and schedule new social media campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      campaignName,
      campaignType = 'feature-showcase',
      platforms = ['instagram', 'twitter', 'facebook'],
      frequency = 'daily',
      generateContent = true,
      scheduleImmediately = false,
      targetAudience = 'athletes_and_parents',
    } = body;

    console.log('Creating social media campaign:', campaignName);

    if (generateContent) {
      // Generate content for the campaign
      const posts = await socialMediaEngine.createCampaignContent(campaignType, platforms);

      if (scheduleImmediately) {
        // Post immediately
        let successCount = 0;
        for (const post of posts) {
          const posted = await socialMediaEngine.postToSocialMedia(post);
          if (posted) successCount++;

          // Delay between posts
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        return NextResponse.json({
          success: true,
          message: 'Campaign created and posted immediately',
          data: {
            campaignName,
            postsCreated: posts.length,
            postsPosted: successCount,
            platforms,
            posts: posts.map((p) => ({
              platform: p.platform,
              content: p.content,
              hashtags: p.hashtags,
              hasImage: !!p.image,
            })),
          },
        });
      } else {
        // Schedule campaign for optimal times
        const campaign = {
          id: `campaign_${Date.now()}`,
          name: campaignName,
          platforms,
          frequency,
          contentType: campaignType,
          targetDemographic: targetAudience,
          active: true,
        };

        await socialMediaEngine.scheduleCampaign(campaign);

        return NextResponse.json({
          success: true,
          message: 'Campaign scheduled successfully',
          data: {
            campaign,
            postsGenerated: posts.length,
            nextPostTime: posts[0]?.scheduledTime,
            estimatedReach: calculateEstimatedReach(platforms, posts.length),
          },
        });
      }
    } else {
      // Just create campaign structure without content
      return NextResponse.json({
        success: true,
        message: 'Campaign structure created',
        data: {
          campaignName,
          platforms,
          frequency,
          status: 'ready_for_content',
        },
      });
    }
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create campaign', error: error.message },
      { status: 500 },
    );
  }
}

// Helper function to calculate estimated reach
function calculateEstimatedReach(platforms: string[], postCount: number): string {
  const platformReach = {
    instagram: 2500,
    twitter: 1500,
    facebook: 2000,
    tiktok: 3500,
    linkedin: 800,
  };

  const totalReach = platforms.reduce((sum, platform) => {
    return sum + (platformReach[platform as keyof typeof platformReach] || 1000);
  }, 0);

  return `${Math.round(totalReach * postCount * 0.8)}-${Math.round(totalReach * postCount * 1.2)}`;
}
