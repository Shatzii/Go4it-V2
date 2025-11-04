import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { networkingEvents, eventAttendees } from '@/lib/db/alumni-network-schema';
import { gte, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const upcoming = searchParams.get('upcoming') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    const now = new Date();

    const events = await db
      .select({
        id: networkingEvents.id,
        title: networkingEvents.title,
        description: networkingEvents.description,
        eventType: networkingEvents.eventType,
        locationType: networkingEvents.locationType,
        venue: networkingEvents.venue,
        startTime: networkingEvents.startTime,
        endTime: networkingEvents.endTime,
        maxAttendees: networkingEvents.maxAttendees,
        registrationFee: networkingEvents.registrationFee,
        targetAudience: networkingEvents.targetAudience,
        speakers: networkingEvents.speakers,
        currentAttendees: sql<number>`(
          SELECT COUNT(*)
          FROM ${eventAttendees}
          WHERE ${eventAttendees.eventId} = ${networkingEvents.id}
          AND ${eventAttendees.status} IN ('registered', 'attended')
        )`,
      })
      .from(networkingEvents)
      .where(
        upcoming
          ? gte(networkingEvents.startTime, now)
          : undefined
      )
      .orderBy(networkingEvents.startTime)
      .limit(limit);

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
