import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../server/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, event } = body;

    switch (action) {
      case 'create-event':
        if (!userId || !event) {
          return NextResponse.json({ error: 'User ID and event data required' }, { status: 400 });
        }

        const newEvent = {
          id: `event_${Date.now()}`,
          userId,
          title: event.title,
          description: event.description || '',
          startDate: event.startDate,
          endDate: event.endDate,
          startTime: event.startTime,
          endTime: event.endTime,
          type: event.type || 'general', // assignment, class, meeting, event
          schoolId: event.schoolId,
          courseId: event.courseId,
          attendees: event.attendees || [],
          location: event.location || '',
          recurring: event.recurring || false,
          recurrencePattern: event.recurrencePattern || null,
          reminders: event.reminders || [],
          status: 'scheduled',
          createdAt: new Date().toISOString(),
        };

        await storage.createCalendarEvent(newEvent);
        return NextResponse.json({ success: true, event: newEvent });

      case 'update-event':
        const { eventId, updates } = body;
        if (!eventId || !updates) {
          return NextResponse.json({ error: 'Event ID and updates required' }, { status: 400 });
        }

        await storage.updateCalendarEvent(eventId, updates);
        return NextResponse.json({ success: true });

      case 'delete-event':
        const { eventId: deleteEventId } = body;
        if (!deleteEventId) {
          return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
        }

        await storage.deleteCalendarEvent(deleteEventId);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Calendar error:', error);
    return NextResponse.json({ error: 'Calendar operation failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const schoolId = searchParams.get('schoolId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const events = await storage.getCalendarEvents(userId, {
      schoolId,
      startDate,
      endDate,
      type,
    });

    // Generate upcoming events summary
    const now = new Date();
    const upcomingEvents = events
      .filter((event) => new Date(event.startDate) >= now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 10);

    return NextResponse.json({
      events,
      upcomingEvents,
      summary: {
        totalEvents: events.length,
        upcomingCount: upcomingEvents.length,
        todayEvents: events.filter(
          (event) => new Date(event.startDate).toDateString() === now.toDateString(),
        ).length,
      },
    });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
  }
}
