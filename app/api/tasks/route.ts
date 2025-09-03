import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { tasks, users } from '@/lib/db/schema';
import { and, eq, gte, lte, isNull } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get start and end of current day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch tasks assigned to the user that are due today
    const userTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        status: tasks.status,
        priority: tasks.priority,
        dueDate: tasks.dueDate,
      })
      .from(tasks)
      .where(
        and(
          eq(tasks.assignedTo, userId), // Assuming you've linked Clerk userId to your DB user id
          gte(tasks.dueDate, today),
          lte(tasks.dueDate, tomorrow)
        )
      )
      .orderBy(tasks.priority);

    return NextResponse.json(userTasks);
  } catch (error) {
    console.error('[TASKS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
