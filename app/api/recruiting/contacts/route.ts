import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/ai-engine/lib/db';
import { recruitingContacts } from '@/ai-engine/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const contacts = await db
      .select()
      .from(recruitingContacts)
      .where(eq(recruitingContacts.userId, parseInt(userId)))
      .orderBy(desc(recruitingContacts.lastContactDate));

    return NextResponse.json({
      success: true,
      contacts,
      count: contacts.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, schoolId, name, title, email, phone, sport, notes, interestLevel } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { success: false, error: 'userId and name are required' },
        { status: 400 }
      );
    }

    const [newContact] = await db
      .insert(recruitingContacts)
      .values({
        userId: parseInt(userId),
        schoolId: schoolId ? parseInt(schoolId) : null,
        name,
        title,
        email,
        phone,
        sport,
        notes,
        interestLevel,
      })
      .returning();

    return NextResponse.json({
      success: true,
      contact: newContact,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create contact' },
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
        { success: false, error: 'Contact id is required' },
        { status: 400 }
      );
    }

    const [updatedContact] = await db
      .update(recruitingContacts)
      .set({ ...updates, lastContactDate: new Date() })
      .where(eq(recruitingContacts.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      success: true,
      contact: updatedContact,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update contact' },
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
        { success: false, error: 'Contact id is required' },
        { status: 400 }
      );
    }

    await db.delete(recruitingContacts).where(eq(recruitingContacts.id, parseInt(id)));

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
