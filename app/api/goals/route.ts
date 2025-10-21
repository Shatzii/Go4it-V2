import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { goals } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch goals created by the user
    const userGoals = await db
      .select()
      .from(goals)
      .where(eq(goals.createdBy, userId))
      .orderBy(goals.createdAt);

    return NextResponse.json(userGoals);
  } catch (error) {
    console.error('[GOALS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, description, type, targetValue, startDate, endDate, parentGoalId } = body;

    const newGoal = await db.insert(goals).values({
      title,
      description,
      type,
      targetValue,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      parentGoalId,
      createdBy: userId,
    }).returning();

    return NextResponse.json(newGoal[0]);
  } catch (error) {
    console.error('[GOALS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
