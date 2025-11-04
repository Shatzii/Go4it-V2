import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/ai-engine/lib/db';
import { recruitingCommunications } from '@/ai-engine/lib/schema';
import { eq, desc, and } from 'drizzle-orm';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const contactId = searchParams.get('contactId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const conditions = [eq(recruitingCommunications.userId, parseInt(userId))];
    
    if (contactId) {
      conditions.push(eq(recruitingCommunications.contactId, parseInt(contactId)));
    }

    const communications = await db
      .select()
      .from(recruitingCommunications)
      .where(and(...conditions))
      .orderBy(desc(recruitingCommunications.communicationDate));

    return NextResponse.json({
      success: true,
      communications,
      count: communications.length,
    });
  } catch (error: unknown) {
    logger.error('Error fetching communications', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { success: false, error: 'Failed to fetch communications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, contactId, type, subject, content, direction, communicationDate } = body;

    if (!userId || !type || !direction) {
      return NextResponse.json(
        { success: false, error: 'userId, type, and direction are required' },
        { status: 400 }
      );
    }

    const [newCommunication] = await db
      .insert(recruitingCommunications)
      .values({
        userId: parseInt(userId),
        contactId: contactId ? parseInt(contactId) : null,
        type,
        subject,
        content,
        direction,
        communicationDate: communicationDate ? new Date(communicationDate) : new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      communication: newCommunication,
    });
  } catch (error: unknown) {
    logger.error('Error creating communication', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { success: false, error: 'Failed to create communication' },
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
        { success: false, error: 'Communication id is required' },
        { status: 400 }
      );
    }

    await db.delete(recruitingCommunications).where(eq(recruitingCommunications.id, parseInt(id)));

    return NextResponse.json({
      success: true,
      message: 'Communication deleted successfully',
    });
  } catch (error: unknown) {
    logger.error('Error deleting communication', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { success: false, error: 'Failed to delete communication' },
      { status: 500 }
    );
  }
}
