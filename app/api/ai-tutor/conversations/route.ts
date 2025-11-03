import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiTutorConversations, aiTutorSessions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { logger } from '@/lib/logger';

// GET /api/ai-tutor/conversations - Fetch conversation history
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const tutorId = searchParams.get('tutorId');
    const sessionId = searchParams.get('sessionId');

    let conversations;

    if (sessionId) {
      // Get specific session conversations
      conversations = await db
        .select()
        .from(aiTutorConversations)
        .where(eq(aiTutorConversations.sessionId, sessionId))
        .orderBy(aiTutorConversations.createdAt);
    } else if (userId && tutorId) {
      // Get all conversations for user with specific tutor
      conversations = await db
        .select()
        .from(aiTutorConversations)
        .where(eq(aiTutorConversations.userId, userId))
        .orderBy(desc(aiTutorConversations.createdAt))
        .limit(100);
    } else if (userId) {
      // Get all conversations for user
      conversations = await db
        .select()
        .from(aiTutorConversations)
        .where(eq(aiTutorConversations.userId, userId))
        .orderBy(desc(aiTutorConversations.createdAt))
        .limit(100);
    } else {
      return NextResponse.json(
        { success: false, error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: conversations,
      count: conversations.length,
    });
  } catch (error) {
    logger.error('Failed to fetch conversations', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch conversations',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/ai-tutor/conversations - Save conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      tutorId,
      subject,
      userMessage,
      aiResponse,
      sessionTime,
      difficulty,
      sessionId,
    } = body;

    if (!userId || !tutorId || !userMessage || !aiResponse) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create or update session
    let session;
    if (sessionId) {
      // Check if session exists
      const existingSession = await db
        .select()
        .from(aiTutorSessions)
        .where(eq(aiTutorSessions.sessionId, sessionId))
        .limit(1);

      if (existingSession.length > 0) {
        // Update existing session
        await db
          .update(aiTutorSessions)
          .set({
            totalMessages: existingSession[0].totalMessages + 2, // user + AI
            lastActivity: new Date(),
            totalTime: sessionTime || existingSession[0].totalTime,
          })
          .where(eq(aiTutorSessions.sessionId, sessionId));
        session = existingSession[0];
      }
    }

    if (!session) {
      // Create new session
      const newSession = await db
        .insert(aiTutorSessions)
        .values({
          sessionId: sessionId || `session-${userId}-${tutorId}-${Date.now()}`,
          userId,
          tutorId,
          subject: subject || 'General',
          totalMessages: 2,
          totalTime: sessionTime || 0,
          difficulty: difficulty || 'medium',
          startedAt: new Date(),
          lastActivity: new Date(),
        })
        .returning();
      session = newSession[0];
    }

    // Save conversation
    const conversation = await db
      .insert(aiTutorConversations)
      .values({
        sessionId: session.sessionId,
        userId,
        tutorId,
        subject: subject || 'General',
        userMessage: userMessage.content || userMessage,
        aiResponse: aiResponse.content || aiResponse,
        difficulty: difficulty || 'medium',
        createdAt: new Date(),
      })
      .returning();

    logger.info('Saved tutor conversation', {
      userId,
      tutorId,
      sessionId: session.sessionId,
    });

    return NextResponse.json({
      success: true,
      data: conversation[0],
      sessionId: session.sessionId,
    });
  } catch (error) {
    logger.error('Failed to save conversation', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save conversation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/ai-tutor/conversations - Delete conversation
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      // Delete entire session
      await db.delete(aiTutorConversations).where(eq(aiTutorConversations.sessionId, sessionId));
      await db.delete(aiTutorSessions).where(eq(aiTutorSessions.sessionId, sessionId));
      logger.info('Deleted tutor session', { sessionId });
    } else if (id) {
      // Delete specific conversation
      await db.delete(aiTutorConversations).where(eq(aiTutorConversations.id, parseInt(id)));
      logger.info('Deleted tutor conversation', { id });
    } else {
      return NextResponse.json(
        { success: false, error: 'Missing id or sessionId parameter' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    logger.error('Failed to delete conversation', { error });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete conversation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
