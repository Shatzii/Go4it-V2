import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { events, eventAttendees } from '@/lib/db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch events the user is attending today
    const userEvents = await db
      .select({
        id: events.id,
        title: events.title,
        startTime: events.startTime,
        endTime: events.endTime,
        type: events.type,
      })
      .from(events)
      .innerJoin(eventAttendees, eq(events.id, eventAttendees.eventId))
      .where(
        and(
          eq(eventAttendees.userId, userId),
          eq(eventAttendees.status, 'accepted'), // Only show accepted events
          gte(events.startTime, today),
          lte(events.startTime, tomorrow)
        )
      )
      .orderBy(events.startTime);

    return NextResponse.json(userEvents);
  } catch (error) {
    console.error('[EVENTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
