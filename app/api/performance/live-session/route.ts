import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { liveSessions, performanceMetrics } from '@/shared/enhanced-schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { sessionType, coachId } = await request.json();

    // Create new live session
    const [session] = await db
      .insert(liveSessions)
      .values({
        userId: user.id,
        sessionType,
        coachId: coachId || null,
        isActive: true,
        realTimeData: {},
      })
      .returning();

    return NextResponse.json(session);
  } catch (error) {
    console.error('Live session creation error:', error);
    return NextResponse.json({ error: 'Failed to create live session' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { sessionId, heartRate, movement, attention, performanceZone, notes } =
      await request.json();

    // Update session with real-time data
    const [updatedSession] = await db
      .update(liveSessions)
      .set({
        realTimeData: {
          heartRate,
          movement,
          attention,
          performanceZone,
          lastUpdate: new Date().toISOString(),
        },
      })
      .where(
        and(
          eq(liveSessions.id, sessionId),
          eq(liveSessions.userId, user.id),
          eq(liveSessions.isActive, true),
        ),
      )
      .returning();

    // Store performance metrics
    await db.insert(performanceMetrics).values({
      userId: user.id,
      sessionId,
      heartRate,
      movement,
      attention,
      performanceZone,
      notes,
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Live session update error:', error);
    return NextResponse.json({ error: 'Failed to update live session' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // End the session
    const [endedSession] = await db
      .update(liveSessions)
      .set({
        endTime: new Date(),
        isActive: false,
      })
      .where(and(eq(liveSessions.id, sessionId), eq(liveSessions.userId, user.id)))
      .returning();

    return NextResponse.json(endedSession);
  } catch (error) {
    console.error('Live session end error:', error);
    return NextResponse.json({ error: 'Failed to end live session' }, { status: 500 });
  }
}
