import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/ai-engine/lib/db';
import { recruitingOffers } from '@/ai-engine/lib/schema';
import { eq, desc, and } from 'drizzle-orm';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const conditions = [eq(recruitingOffers.userId, parseInt(userId))];
    
    if (status) {
      conditions.push(eq(recruitingOffers.status, status));
    }

    const offers = await db
      .select()
      .from(recruitingOffers)
      .where(and(...conditions))
      .orderBy(desc(recruitingOffers.updatedAt));

    return NextResponse.json({
      success: true,
      offers,
      count: offers.length,
    });
  } catch (error) {
    logger.error('Error fetching offers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch offers' },
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
      status,
      offerType,
      scholarshipAmount,
      scholarshipType,
      notes,
      visitDate,
      offerDate,
      commitmentDate,
    } = body;

    if (!userId || !schoolId) {
      return NextResponse.json(
        { success: false, error: 'userId and schoolId are required' },
        { status: 400 }
      );
    }

    const [newOffer] = await db
      .insert(recruitingOffers)
      .values({
        userId: parseInt(userId),
        schoolId: parseInt(schoolId),
        contactId: contactId ? parseInt(contactId) : null,
        status: status || 'interested',
        offerType,
        scholarshipAmount,
        scholarshipType,
        notes,
        visitDate: visitDate ? new Date(visitDate) : null,
        offerDate: offerDate ? new Date(offerDate) : null,
        commitmentDate: commitmentDate ? new Date(commitmentDate) : null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      offer: newOffer,
    });
  } catch (error) {
    logger.error('Error creating offer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create offer' },
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
        { success: false, error: 'Offer id is required' },
        { status: 400 }
      );
    }

    // Convert date strings to Date objects
    const dateFields = ['visitDate', 'offerDate', 'commitmentDate'];
    dateFields.forEach(field => {
      if (updates[field]) {
        updates[field] = new Date(updates[field]);
      }
    });

    const [updatedOffer] = await db
      .update(recruitingOffers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(recruitingOffers.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      success: true,
      offer: updatedOffer,
    });
  } catch (error) {
    logger.error('Error updating offer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update offer' },
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
        { success: false, error: 'Offer id is required' },
        { status: 400 }
      );
    }

    await db.delete(recruitingOffers).where(eq(recruitingOffers.id, parseInt(id)));

    return NextResponse.json({
      success: true,
      message: 'Offer deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting offer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete offer' },
      { status: 500 }
    );
  }
}
