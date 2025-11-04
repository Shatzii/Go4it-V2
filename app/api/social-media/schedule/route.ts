import { NextResponse } from 'next/server';
import { db } from '@/ai-engine/lib/db';
import { socialMediaSchedule } from '@/ai-engine/lib/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let schedules;
    
    if (status) {
      schedules = await db
        .select()
        .from(socialMediaSchedule)
        .where(eq(socialMediaSchedule.status, status));
    } else {
      schedules = await db.select().from(socialMediaSchedule);
    }

    return NextResponse.json({
      success: true,
      data: schedules,
      count: schedules.length,
    });
  } catch (error: any) {
    logger.error('Error fetching schedules:', error);
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
      campaignId,
      platform,
      content,
      media = [],
      scheduledFor,
      status = 'scheduled',
    } = body;

    if (!campaignId || !platform || !content || !scheduledFor) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create scheduled post
    const scheduled = await db.insert(socialMediaSchedule).values({
      campaignId,
      platform,
      content,
      media: JSON.stringify(media),
      scheduledFor: new Date(scheduledFor),
      status,
      retries: 0,
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Post scheduled successfully',
      data: scheduled[0],
    });
  } catch (error: any) {
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
        { success: false, error: 'Schedule ID required' },
        { status: 400 }
      );
    }

    const updated = await db
      .update(socialMediaSchedule)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(socialMediaSchedule.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Schedule updated successfully',
      data: updated[0],
    });
  } catch (error: any) {
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
        { success: false, error: 'Schedule ID required' },
        { status: 400 }
      );
    }

    await db.delete(socialMediaSchedule).where(eq(socialMediaSchedule.id, parseInt(id)));

    return NextResponse.json({
      success: true,
      message: 'Scheduled post deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
