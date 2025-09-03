import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { timeEntries, tasks, projects, activityLog } from '@/lib/db/schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');
    const projectId = searchParams.get('projectId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const isBillable = searchParams.get('isBillable');

    // Build where conditions
    const whereConditions = [eq(timeEntries.userId, userId)];

    if (taskId) {
      whereConditions.push(eq(timeEntries.taskId, taskId));
    }

    if (projectId) {
      whereConditions.push(eq(timeEntries.projectId, projectId));
    }

    if (startDate) {
      whereConditions.push(gte(timeEntries.startTime, new Date(startDate)));
    }

    if (endDate) {
      whereConditions.push(lte(timeEntries.startTime, new Date(endDate)));
    }

    if (isBillable !== null) {
      whereConditions.push(eq(timeEntries.isBillable, isBillable === 'true'));
    }

    // Get time entries with related data
    const entries = await db
      .select({
        id: timeEntries.id,
        userId: timeEntries.userId,
        taskId: timeEntries.taskId,
        projectId: timeEntries.projectId,
        startTime: timeEntries.startTime,
        endTime: timeEntries.endTime,
        duration: timeEntries.duration,
        description: timeEntries.description,
        isBillable: timeEntries.isBillable,
        createdAt: timeEntries.createdAt,
        // Include task info
        task: {
          id: tasks.id,
          title: tasks.title,
          status: tasks.status,
        },
        // Include project info
        project: {
          id: projects.id,
          title: projects.title,
          type: projects.type,
        },
      })
      .from(timeEntries)
      .leftJoin(tasks, eq(timeEntries.taskId, tasks.id))
      .leftJoin(projects, eq(timeEntries.projectId, projects.id))
      .where(and(...whereConditions))
      .orderBy(desc(timeEntries.startTime));

    // Calculate totals
    const totals = await db
      .select({
        totalDuration: sql<number>`sum(${timeEntries.duration})`,
        totalBillable: sql<number>`sum(case when ${timeEntries.isBillable} then ${timeEntries.duration} else 0 end)`,
        entryCount: sql<number>`count(*)`,
      })
      .from(timeEntries)
      .where(and(...whereConditions));

    return NextResponse.json({
      entries,
      totals: totals[0],
    });
  } catch (error) {
    console.error('[TIME_ENTRIES_GET]', error);
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
    const {
      taskId,
      projectId,
      startTime,
      endTime,
      duration,
      description,
      isBillable,
    } = body;

    // Calculate duration if not provided
    let calculatedDuration = duration;
    if (!calculatedDuration && startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      calculatedDuration = Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // minutes
    }

    // Create the time entry
    const newEntry = await db.insert(timeEntries).values({
      userId,
      taskId,
      projectId,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      duration: calculatedDuration,
      description,
      isBillable: isBillable || false,
    }).returning();

    // Log activity
    await db.insert(activityLog).values({
      userId,
      action: 'time_entry.created',
      entityType: 'time_entry',
      entityId: newEntry[0].id,
      newValues: JSON.stringify({
        taskId,
        projectId,
        duration: calculatedDuration,
        isBillable: isBillable || false,
      }),
      metadata: JSON.stringify({ source: 'api' }),
    });

    return NextResponse.json(newEntry[0]);
  } catch (error) {
    console.error('[TIME_ENTRIES_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const entryId = searchParams.get('id');

    if (!entryId) {
      return new NextResponse('Entry ID is required', { status: 400 });
    }

    const body = await req.json();
    const {
      taskId,
      projectId,
      startTime,
      endTime,
      duration,
      description,
      isBillable,
    } = body;

    // Get the current entry for logging
    const currentEntry = await db
      .select()
      .from(timeEntries)
      .where(and(eq(timeEntries.id, entryId), eq(timeEntries.userId, userId)))
      .limit(1);

    if (currentEntry.length === 0) {
      return new NextResponse('Time entry not found', { status: 404 });
    }

    // Calculate duration if not provided
    let calculatedDuration = duration;
    if (!calculatedDuration && startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      calculatedDuration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    }

    // Update the entry
    const updatedEntry = await db
      .update(timeEntries)
      .set({
        taskId,
        projectId,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : null,
        duration: calculatedDuration,
        description,
        isBillable,
      })
      .where(and(eq(timeEntries.id, entryId), eq(timeEntries.userId, userId)))
      .returning();

    // Log activity
    await db.insert(activityLog).values({
      userId,
      action: 'time_entry.updated',
      entityType: 'time_entry',
      entityId: entryId,
      oldValues: JSON.stringify({
        taskId: currentEntry[0].taskId,
        projectId: currentEntry[0].projectId,
        duration: currentEntry[0].duration,
        isBillable: currentEntry[0].isBillable,
      }),
      newValues: JSON.stringify({
        taskId,
        projectId,
        duration: calculatedDuration,
        isBillable,
      }),
      metadata: JSON.stringify({ source: 'api' }),
    });

    return NextResponse.json(updatedEntry[0]);
  } catch (error) {
    console.error('[TIME_ENTRIES_PUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
