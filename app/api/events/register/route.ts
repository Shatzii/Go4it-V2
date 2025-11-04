import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eventRegistrations, liveEvents } from '@/lib/db/live-events-schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      eventId,
      firstName,
      lastName,
      email,
      phone,
      relationship,
      athleteName,
      athleteAge,
      athleteSport,
      athleteGrade,
      primaryGoals,
      hearAboutUs,
      additionalQuestions,
    } = body;

    // Get the next available parent night event if no eventId provided
    let targetEventId = eventId;
    
    if (!targetEventId) {
      const upcomingEvents = await db
        .select()
        .from(liveEvents)
        .where(eq(liveEvents.eventType, 'parent_night'))
        .orderBy(liveEvents.startTime)
        .limit(1);

      if (upcomingEvents.length === 0) {
        return NextResponse.json(
          { error: 'No upcoming parent night events available' },
          { status: 404 }
        );
      }

      targetEventId = upcomingEvents[0].id;
    }

    // Check if already registered
    const existing = await db
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.email, email))
      .limit(1);

    if (existing.length > 0 && existing[0].eventId === targetEventId) {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      );
    }

    // Create registration
    const [registration] = await db.insert(eventRegistrations).values({
      eventId: targetEventId,
      email,
      firstName,
      lastName,
      phone: phone || null,
      relationship,
      athleteName,
      athleteAge: athleteAge ? parseInt(athleteAge) : null,
      athleteSport,
      status: 'registered',
      questions: {
        athleteGrade,
        primaryGoals,
        hearAboutUs,
        additionalQuestions,
      },
    }).returning();

    // Get event details for email
    const [event] = await db
      .select()
      .from(liveEvents)
      .where(eq(liveEvents.id, targetEventId));

    // Send confirmation email
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/events/send-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registration,
        event,
      }),
    });

    return NextResponse.json({
      success: true,
      registrationId: registration.id,
      message: 'Registration successful! Check your email for details.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
