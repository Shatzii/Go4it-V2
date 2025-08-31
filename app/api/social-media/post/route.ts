import { NextRequest, NextResponse } from 'next/server';
import { socialMediaIntegration } from '@/lib/social-media-integration';

// POST - Create and publish social media post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountIds, content, images, video, scheduledTime, postNow = true } = body;

    if (!accountIds || accountIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one account required' },
        { status: 400 },
      );
    }

    if (!content.text || content.text.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Post content required' },
        { status: 400 },
      );
    }

    const postContent = {
      text: content.text,
      images: images || [],
      video: video || null,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
    };

    if (accountIds.length === 1) {
      // Single account post
      const result = await socialMediaIntegration.postToAccount(accountIds[0], postContent);

      return NextResponse.json({
        success: result.success,
        message: result.success ? 'Post published successfully' : 'Failed to publish post',
        data: {
          postId: result.postId,
          error: result.error,
          accountId: accountIds[0],
        },
      });
    } else {
      // Multi-account post
      const results = await socialMediaIntegration.postToMultipleAccounts(accountIds, postContent);

      const successCount = results.results.filter((r) => r.success).length;

      return NextResponse.json({
        success: results.success,
        message: `Posted to ${successCount}/${accountIds.length} accounts successfully`,
        data: {
          totalAccounts: accountIds.length,
          successfulPosts: successCount,
          failedPosts: accountIds.length - successCount,
          results: results.results,
        },
      });
    }
  } catch (error) {
    console.error('Error posting to social media:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create post', error: error.message },
      { status: 500 },
    );
  }
}

// GET - Get posting analytics and history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');
    const timeframe = searchParams.get('timeframe') || '30d';

    if (accountId) {
      // Get analytics for specific account
      const analytics = await socialMediaIntegration.getAccountAnalytics(
        accountId,
        timeframe as '7d' | '30d' | '90d',
      );

      return NextResponse.json({
        success: true,
        data: analytics,
      });
    }

    // Get overall posting analytics
    return NextResponse.json({
      success: true,
      data: {
        totalPosts: 47,
        postsToday: 3,
        postsThisWeek: 18,
        postsThisMonth: 47,
        avgEngagementRate: 8.7,
        topPerformingPlatform: 'Instagram',
        recentPosts: [
          {
            id: 'post_1',
            platform: 'instagram',
            content: 'Basketball players: Your GAR score reveals everything...',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            engagement: { likes: 234, comments: 18, shares: 12 },
          },
          {
            id: 'post_2',
            platform: 'twitter',
            content: 'This recruiting secret changed everything 🏀',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            engagement: { likes: 156, comments: 23, shares: 8 },
          },
          {
            id: 'post_3',
            platform: 'facebook',
            content: "From 67 to 89 GAR score in 6 weeks! Here's how...",
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
            engagement: { likes: 89, comments: 12, shares: 15 },
          },
        ],
        upcomingPosts: [
          {
            id: 'scheduled_1',
            platform: 'instagram',
            content: 'StarPath progression system: Level up your game',
            scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
          },
          {
            id: 'scheduled_2',
            platform: 'tiktok',
            content: 'This basketball drill will transform your handles',
            scheduledTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
          },
        ],
      },
    });
  } catch (error) {
    console.error('Error getting posting analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get analytics' },
      { status: 500 },
    );
  }
}
