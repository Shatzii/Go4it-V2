import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { campaigns, prospects, type InsertCampaign } from '@/shared/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

// GET - Fetch campaigns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let query = db.select().from(campaigns);

    const conditions = [];
    if (status) conditions.push(eq(campaigns.status, status));
    if (type) conditions.push(eq(campaigns.type, type));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const data = await query.orderBy(desc(campaigns.createdAt));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch campaigns' },
      { status: 500 },
    );
  }
}

// POST - Create new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const [result] = await db.insert(campaigns).values(body).returning();

    return NextResponse.json({
      success: true,
      message: 'Campaign created successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create campaign' },
      { status: 500 },
    );
  }
}

// PUT - Update campaign
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const [result] = await db
      .update(campaigns)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Campaign updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update campaign' },
      { status: 500 },
    );
  }
}
