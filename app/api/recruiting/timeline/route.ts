import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/ai-engine/lib/db';
import { recruitingTimeline } from '@/ai-engine/lib/schema';
import { eq, asc, and } from 'drizzle-orm';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const upcoming = searchParams.get('upcoming') === 'true';

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const conditions = [eq(recruitingTimeline.userId, parseInt(userId))];

    if (upcoming) {
      conditions.push(eq(recruitingTimeline.isCompleted, false));
    }

    const events = await db
      .select()
      .from(recruitingTimeline)
      .where(and(...conditions))
      .orderBy(asc(recruitingTimeline.eventDate));

    return NextResponse.json({
      success: true,
      events,
      count: events.length,
    });
  } catch (error) {
    logger.error('Error fetching timeline:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch timeline' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      schoolId,
      contactId,
      eventType,
      title,
      description,
      eventDate,
      location,
    } = body;

    if (!userId || !eventType || !title || !eventDate) {
      return NextResponse.json(
        { success: false, error: 'userId, eventType, title, and eventDate are required' },
        { status: 400 }
      );
    }

    const [newEvent] = await db
      .insert(recruitingTimeline)
      .values({
        userId: parseInt(userId),
        schoolId: schoolId ? parseInt(schoolId) : null,
        contactId: contactId ? parseInt(contactId) : null,
        eventType,
        title,
        description,
        eventDate: new Date(eventDate),
        location,
      })
      .returning();

    return NextResponse.json({
      success: true,
      event: newEvent,
    });
  } catch (error) {
    logger.error('Error creating timeline event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create timeline event' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event id is required' },
        { status: 400 }
      );
    }

    if (updates.eventDate) {
      updates.eventDate = new Date(updates.eventDate);
    }

    const [updatedEvent] = await db
      .update(recruitingTimeline)
      .set(updates)
      .where(eq(recruitingTimeline.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      success: true,
      event: updatedEvent,
    });
  } catch (error) {
    logger.error('Error updating timeline event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update timeline event' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event id is required' },
        { status: 400 }
      );
    }

    await db.delete(recruitingTimeline).where(eq(recruitingTimeline.id, parseInt(id)));

    return NextResponse.json({
      success: true,
      message: 'Timeline event deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting timeline event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete timeline event' },
      { status: 500 }
    );
  }
}
