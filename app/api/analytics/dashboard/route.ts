import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { 
  scraperResults, 
  socialMediaCampaigns, 
  socialMediaSchedule, 
  socialMediaMetrics 
} from '@/shared/schema';
import { sql, desc, gte, eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '24h';

    // Calculate time window
    const now = new Date();
    const startTime = new Date();
    
    switch (range) {
      case '1h':
        startTime.setHours(now.getHours() - 1);
        break;
      case '24h':
        startTime.setHours(now.getHours() - 24);
        break;
      case '7d':
        startTime.setDate(now.getDate() - 7);
        break;
      case '30d':
        startTime.setDate(now.getDate() - 30);
        break;
      default:
        startTime.setHours(now.getHours() - 24);
    }

    // Fetch scraper analytics
    const recentScrapes = await db
      .select()
      .from(scraperResults)
      .where(gte(scraperResults.createdAt, startTime))
      .orderBy(desc(scraperResults.createdAt))
      .limit(20);

    const scraperStats = {
      totalScrapesToday: recentScrapes.length,
      successRate: recentScrapes.length > 0
        ? Math.round(
            (recentScrapes.filter((s) => s.status === 'success').length /
              recentScrapes.length) *
              100
          )
        : 0,
      totalRecords: recentScrapes.reduce((sum, s) => sum + (s.totalRecords || 0), 0),
      avgProcessingTime: recentScrapes.length > 0
        ? Math.round(
            recentScrapes.reduce((sum, s) => sum + (s.processingTime || 0), 0) /
              recentScrapes.length
          )
        : 0,
      recentScrapes: recentScrapes.map((scrape) => ({
        id: scrape.id,
        source: scrape.source,
        sport: scrape.sport || 'Unknown',
        region: scrape.region || 'N/A',
        totalRecords: scrape.totalRecords || 0,
        status: scrape.status,
        createdAt: scrape.createdAt,
      })),
    };

    // Fetch social media analytics
    const campaigns = await db
      .select()
      .from(socialMediaCampaigns)
      .where(gte(socialMediaCampaigns.createdAt, startTime));

    const scheduledPosts = await db
      .select()
      .from(socialMediaSchedule)
      .where(
        and(
          eq(socialMediaSchedule.status, 'scheduled'),
          gte(socialMediaSchedule.scheduledFor, now)
        )
      );

    const publishedPosts = await db
      .select()
      .from(socialMediaSchedule)
      .where(
        and(
          eq(socialMediaSchedule.status, 'published'),
          gte(socialMediaSchedule.publishedAt, startTime)
        )
      );

    const metrics = await db
      .select()
      .from(socialMediaMetrics)
      .where(gte(socialMediaMetrics.createdAt, startTime));

    const totalEngagement = metrics.reduce(
      (sum, m) => sum + (m.likes || 0) + (m.comments || 0) + (m.shares || 0),
      0
    );

    const avgEngagementRate =
      metrics.length > 0
        ? Math.round(
            metrics.reduce((sum, m) => sum + (parseFloat(m.engagementRate as string) || 0), 0) /
              metrics.length *
              10
          ) / 10
        : 0;

    // Get top performing posts
    const topPerformingPosts = await db
      .select({
        id: socialMediaSchedule.id,
        platform: socialMediaSchedule.platform,
        content: socialMediaSchedule.content,
        publishedAt: socialMediaSchedule.publishedAt,
        likes: socialMediaMetrics.likes,
        comments: socialMediaMetrics.comments,
        shares: socialMediaMetrics.shares,
      })
      .from(socialMediaSchedule)
      .leftJoin(
        socialMediaMetrics,
        eq(socialMediaSchedule.postId, socialMediaMetrics.postId)
      )
      .where(
        and(
          eq(socialMediaSchedule.status, 'published'),
          gte(socialMediaSchedule.publishedAt, startTime)
        )
      )
      .orderBy(desc(socialMediaMetrics.likes))
      .limit(10);

    const socialStats = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
      scheduledPosts: scheduledPosts.length,
      publishedToday: publishedPosts.length,
      totalEngagement,
      avgEngagementRate,
      topPerformingPosts: topPerformingPosts.map((post) => ({
        id: post.id,
        platform: post.platform,
        content: (post.content as any)?.caption || 'No caption',
        engagement: (post.likes || 0) + (post.comments || 0) + (post.shares || 0),
        publishedAt: post.publishedAt,
      })),
    };

    return NextResponse.json({
      success: true,
      data: {
        scraper: scraperStats,
        socialMedia: socialStats,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
