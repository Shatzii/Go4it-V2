import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { prospects, campaigns, scrapingJobs, type InsertProspect } from '@/shared/schema';
import { eq, desc, and, or, like, sql } from 'drizzle-orm';

// GET - Fetch prospects with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const sport = searchParams.get('sport');
    const state = searchParams.get('state');
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    let query = db.select().from(prospects);

    const conditions = [];
    if (sport) conditions.push(eq(prospects.sport, sport));
    if (state) conditions.push(eq(prospects.state, state));
    if (status) conditions.push(eq(prospects.recruitingStatus, status));
    if (source) conditions.push(eq(prospects.source, source));
    if (search) {
      conditions.push(
        or(
          like(prospects.name, `%${search}%`),
          like(prospects.school, `%${search}%`),
          like(prospects.email, `%${search}%`),
        ),
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const data = await query.orderBy(desc(prospects.lastScraped)).limit(limit).offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql`count(*)` })
      .from(prospects)
      .where(conditions.length > 0 ? and(...conditions) : sql`true`);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: Number(count),
        pages: Math.ceil(Number(count) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching prospects:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch prospects' },
      { status: 500 },
    );
  }
}

// POST - Add new prospect or bulk import
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (Array.isArray(body)) {
      // Bulk import
      const results = await db.insert(prospects).values(body).returning();
      return NextResponse.json({
        success: true,
        message: `Successfully imported ${results.length} prospects`,
        data: results,
      });
    } else {
      // Single prospect
      const [result] = await db.insert(prospects).values(body).returning();
      return NextResponse.json({
        success: true,
        message: 'Prospect added successfully',
        data: result,
      });
    }
  } catch (error) {
    console.error('Error adding prospects:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add prospects' },
      { status: 500 },
    );
  }
}

// PUT - Update prospect
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const [result] = await db
      .update(prospects)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(prospects.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Prospect updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error updating prospect:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update prospect' },
      { status: 500 },
    );
  }
}
