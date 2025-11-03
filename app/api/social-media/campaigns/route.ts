import { NextResponse } from 'next/server';
import { db } from '@/ai-engine/lib/db';
import { socialMediaCampaigns } from '@/ai-engine/lib/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'stats') {
      // Return aggregated stats
      const campaigns = await db.select().from(socialMediaCampaigns);
      
      const stats = {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c.status === 'active').length,
        scheduledPosts: campaigns.reduce((sum, c) => sum + (c.postsScheduled || 0), 0),
        publishedPosts: campaigns.reduce((sum, c) => sum + (c.postsPublished || 0), 0),
        totalEngagement: campaigns.reduce((sum, c) => sum + (c.totalEngagement || 0), 0),
        avgEngagementRate: campaigns.length > 0 
          ? campaigns.reduce((sum, c) => sum + Number(c.engagementRate || 0), 0) / campaigns.length
          : 0,
      };

      return NextResponse.json({ success: true, data: stats });
    }

    if (type === 'templates') {
      const templates = [
        {
          id: 'athlete-spotlight',
          name: 'Athlete Spotlight',
          description: 'Showcase athlete achievements and highlights',
          platforms: ['instagram', 'facebook', 'twitter'],
          contentTypes: ['image', 'carousel', 'video'],
        },
        {
          id: 'training-tips',
          name: 'Training Tips',
          description: 'Share training advice and techniques',
          platforms: ['instagram', 'tiktok', 'youtube'],
          contentTypes: ['video', 'story', 'reel'],
        },
        {
          id: 'recruitment-success',
          name: 'Recruitment Success Stories',
          description: 'Celebrate athlete commitments and offers',
          platforms: ['twitter', 'facebook', 'linkedin'],
          contentTypes: ['image', 'text', 'link'],
        },
        {
          id: 'gar-showcase',
          name: 'GAR Score Showcase',
          description: 'Highlight athletes with top GAR scores',
          platforms: ['instagram', 'twitter'],
          contentTypes: ['image', 'carousel'],
        },
        {
          id: 'starpath-milestone',
          name: 'StarPath Milestone',
          description: 'Celebrate student progress milestones',
          platforms: ['facebook', 'instagram'],
          contentTypes: ['image', 'video'],
        },
      ];

      return NextResponse.json({ success: true, data: templates });
    }

    // Get all campaigns
    const campaigns = await db.select().from(socialMediaCampaigns);
    return NextResponse.json({ success: true, data: campaigns });
  } catch (error: any) {
    logger.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      platforms = [],
      features = [],
      contentType = 'mixed',
      schedule,
      targetAudience,
    } = body;

    // Create campaign
    const campaign = await db.insert(socialMediaCampaigns).values({
      name,
      description,
      platforms: JSON.stringify(platforms),
      features: JSON.stringify(features),
      contentType,
      schedule: schedule ? JSON.stringify(schedule) : null,
      targetAudience: targetAudience ? JSON.stringify(targetAudience) : null,
      status: 'draft',
      postsScheduled: 0,
      postsPublished: 0,
      totalEngagement: 0,
      engagementRate: '0',
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign[0],
    });
  } catch (error: any) {
    logger.error('Error creating campaign:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Campaign ID required' },
        { status: 400 }
      );
    }

    // Update campaign
    const updated = await db
      .update(socialMediaCampaigns)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(socialMediaCampaigns.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign updated successfully',
      data: updated[0],
    });
  } catch (error: any) {
    logger.error('Error updating campaign:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Campaign ID required' },
        { status: 400 }
      );
    }

    await db.delete(socialMediaCampaigns).where(eq(socialMediaCampaigns.id, parseInt(id)));

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully',
    });
  } catch (error: any) {
    logger.error('Error deleting campaign:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
