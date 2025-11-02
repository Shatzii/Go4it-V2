import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/ai-engine/lib/db';
import { recruitingCommunications } from '@/ai-engine/lib/schema';
import { eq, desc } from 'drizzle-orm';

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

    let query = db
      .select()
      .from(recruitingCommunications)
      .where(eq(recruitingCommunications.userId, parseInt(userId)));

    if (contactId) {
      query = query.where(eq(recruitingCommunications.contactId, parseInt(contactId)));
    }

    const communications = await query.orderBy(desc(recruitingCommunications.communicationDate));

    return NextResponse.json({
      success: true,
      communications,
      count: communications.length,
    });
  } catch (error) {
    console.error('Error fetching communications:', error);
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
  } catch (error) {
    console.error('Error creating communication:', error);
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
  } catch (error) {
    console.error('Error deleting communication:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete communication' },
      { status: 500 }
    );
  }
}
