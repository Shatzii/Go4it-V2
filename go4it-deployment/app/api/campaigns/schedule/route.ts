import { NextRequest, NextResponse } from 'next/server';
import { campaignScheduler } from '@/lib/campaign-scheduler';

// POST - Create scheduled campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      type = 'weekly',
      platforms = ['instagram', 'twitter'],
      contentTypes = ['transformation', 'secret_revealed'],
      sports = ['Basketball'],
      startDate = new Date(),
      endDate,
      customSchedule,
      createMultiple = false,
      bulkCampaigns = [],
    } = body;

    if (createMultiple && bulkCampaigns.length > 0) {
      // Create multiple campaigns
      const campaigns = await campaignScheduler.createBulkCampaigns(bulkCampaigns);

      return NextResponse.json({
        success: true,
        message: `${campaigns.length} campaigns created successfully`,
        data: {
          campaignsCreated: campaigns.length,
          campaigns: campaigns.map((c) => ({
            id: c.id,
            name: c.name,
            type: c.type,
            platforms: c.platforms,
            nextRun: c.nextRun,
          })),
        },
      });
    } else {
      // Create single campaign
      const campaign = await campaignScheduler.createScheduledCampaign({
        name,
        type,
        platforms,
        contentTypes,
        sports,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        customSchedule,
      });

      return NextResponse.json({
        success: true,
        message: 'Campaign scheduled successfully',
        data: {
          campaignId: campaign.id,
          name: campaign.name,
          type: campaign.type,
          platforms: campaign.platforms,
          frequency: campaign.frequency,
          nextRun: campaign.nextRun,
          estimatedPostsPerWeek: calculatePostsPerWeek(campaign),
        },
      });
    }
  } catch (error) {
    console.error('Error creating scheduled campaign:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create campaign', error: error.message },
      { status: 500 },
    );
  }
}

function calculatePostsPerWeek(campaign: any): number {
  const postsPerRun =
    campaign.platforms.length * campaign.contentTypes.length * campaign.sports.length;

  switch (campaign.type) {
    case 'daily':
      return postsPerRun * 7;
    case 'weekly':
      return postsPerRun * 3; // Monday, Wednesday, Friday
    case 'monthly':
      return postsPerRun * 2; // 1st and 15th
    default:
      return postsPerRun;
  }
}

// GET - Get campaign schedules and analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const campaignId = searchParams.get('campaignId');

    if (type === 'analytics') {
      const analytics = await campaignScheduler.getCampaignAnalytics(campaignId || undefined);

      return NextResponse.json({
        success: true,
        data: analytics,
      });
    }

    if (type === 'calendar') {
      const days = parseInt(searchParams.get('days') || '30');
      const platforms = searchParams.get('platforms')?.split(',') || ['instagram', 'twitter'];
      const sports = searchParams.get('sports')?.split(',') || ['Basketball', 'Football'];

      const calendar = await campaignScheduler.generateContentCalendar(days, platforms, sports);

      return NextResponse.json({
        success: true,
        message: `Generated ${days}-day content calendar`,
        data: {
          totalScheduledPosts: calendar.length,
          dateRange: {
            start: calendar[0]?.date,
            end: calendar[calendar.length - 1]?.date,
          },
          platformDistribution: calculatePlatformDistribution(calendar),
          calendar: calendar,
        },
      });
    }

    if (type === 'optimize' && campaignId) {
      const optimization = await campaignScheduler.optimizeSchedulingWithAI(campaignId);

      return NextResponse.json({
        success: true,
        data: optimization,
      });
    }

    if (type === 'templates') {
      return NextResponse.json({
        success: true,
        data: {
          campaignTypes: [
            {
              id: 'daily-engagement',
              name: 'Daily Engagement Campaign',
              description: 'Post viral content daily to maximize reach',
              frequency: 'daily',
              platforms: ['instagram', 'twitter', 'tiktok'],
              contentTypes: ['transformation', 'secret_revealed'],
              estimatedReach: '5,000-12,000/day',
              recommendedSports: ['Basketball', 'Football'],
            },
            {
              id: 'weekly-showcase',
              name: 'Weekly Feature Showcase',
              description: 'Highlight platform features 3x per week',
              frequency: 'weekly',
              platforms: ['instagram', 'facebook', 'linkedin'],
              contentTypes: ['day_in_life', 'transformation'],
              estimatedReach: '8,000-20,000/week',
              recommendedSports: ['All Sports'],
            },
            {
              id: 'viral-blitz',
              name: 'Viral Content Blitz',
              description: 'High-frequency posting for maximum viral potential',
              frequency: 'daily',
              platforms: ['tiktok', 'instagram'],
              contentTypes: ['transformation', 'secret_revealed', 'mistake_warning'],
              estimatedReach: '15,000-50,000/week',
              recommendedSports: ['Basketball', 'Football', 'Soccer'],
            },
            {
              id: 'educational-series',
              name: 'Educational Content Series',
              description: 'Weekly educational posts for long-term engagement',
              frequency: 'weekly',
              platforms: ['linkedin', 'twitter', 'facebook'],
              contentTypes: ['mistake_warning', 'day_in_life'],
              estimatedReach: '3,000-8,000/week',
              recommendedSports: ['All Sports'],
            },
          ],
          quickSetup: {
            beginner: {
              name: 'Starter Campaign',
              type: 'weekly',
              platforms: ['instagram', 'twitter'],
              contentTypes: ['transformation'],
              sports: ['Basketball'],
              description: 'Perfect for getting started with social media automation',
            },
            intermediate: {
              name: 'Growth Campaign',
              type: 'daily',
              platforms: ['instagram', 'twitter', 'facebook'],
              contentTypes: ['transformation', 'secret_revealed'],
              sports: ['Basketball', 'Football'],
              description: 'Balanced approach for steady growth',
            },
            advanced: {
              name: 'Viral Campaign',
              type: 'daily',
              platforms: ['instagram', 'tiktok', 'twitter', 'facebook'],
              contentTypes: ['transformation', 'secret_revealed', 'day_in_life'],
              sports: ['Basketball', 'Football', 'Soccer', 'Baseball'],
              description: 'Maximum reach and engagement potential',
            },
          },
        },
      });
    }

    // Default: return current schedule status
    const analytics = await campaignScheduler.getCampaignAnalytics();

    return NextResponse.json({
      success: true,
      data: {
        schedulingStatus: 'active',
        ...analytics,
        systemHealth: {
          scheduler: 'running',
          contentGenerator: 'ready',
          socialMediaEngine: 'connected',
          viralGenerator: 'active',
        },
      },
    });
  } catch (error) {
    console.error('Error getting campaign schedules:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get campaign schedules' },
      { status: 500 },
    );
  }
}

function calculatePlatformDistribution(calendar: any[]): any {
  const distribution: any = {};

  calendar.forEach((post) => {
    distribution[post.platform] = (distribution[post.platform] || 0) + 1;
  });

  return distribution;
}

// PUT - Update campaign schedule
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, action } = body;

    if (!campaignId) {
      return NextResponse.json(
        { success: false, message: 'Campaign ID required' },
        { status: 400 },
      );
    }

    let result = false;
    let message = '';

    switch (action) {
      case 'pause':
        result = campaignScheduler.pauseCampaign(campaignId);
        message = result ? 'Campaign paused successfully' : 'Failed to pause campaign';
        break;

      case 'resume':
        result = campaignScheduler.resumeCampaign(campaignId);
        message = result ? 'Campaign resumed successfully' : 'Failed to resume campaign';
        break;

      case 'delete':
        result = campaignScheduler.deleteCampaign(campaignId);
        message = result ? 'Campaign deleted successfully' : 'Failed to delete campaign';
        break;

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action. Use: pause, resume, delete' },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: result,
      message,
      data: { campaignId, action, completed: result },
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update campaign' },
      { status: 500 },
    );
  }
}
