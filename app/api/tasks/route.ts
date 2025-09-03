import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { tasks, taskDependencies, timeEntries, activityLog, users, projects } from '@/lib/db/schema';
import { and, eq, gte, lte, isNull, or, like, inArray, desc, asc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const projectId = searchParams.get('projectId');
    const assignedTo = searchParams.get('assignedTo');
    const location = searchParams.get('location');
    const department = searchParams.get('department');
    const tags = searchParams.get('tags');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where conditions
    const whereConditions = [eq(tasks.createdBy, userId)];

    if (status) {
      whereConditions.push(eq(tasks.status, status));
    }

    if (priority) {
      whereConditions.push(eq(tasks.priority, priority));
    }

    if (projectId) {
      whereConditions.push(eq(tasks.projectId, projectId));
    }

    if (assignedTo) {
      whereConditions.push(eq(tasks.assignedTo, assignedTo));
    }

    if (location) {
      whereConditions.push(eq(tasks.location, location));
    }

    if (department) {
      whereConditions.push(eq(tasks.department, department));
    }

    if (tags) {
      const tagArray = tags.split(',');
      whereConditions.push(or(...tagArray.map(tag => like(tasks.tags, `%${tag}%`))));
    }

    if (search) {
      whereConditions.push(
        or(
          like(tasks.title, `%${search}%`),
          like(tasks.description, `%${search}%`)
        )
      );
    }

    // Build order by
    const orderBy = sortOrder === 'asc' ? asc(tasks[sortBy]) : desc(tasks[sortBy]);

    // Fetch tasks with related data
    const userTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        priority: tasks.priority,
        dueDate: tasks.dueDate,
        projectId: tasks.projectId,
        assignedTo: tasks.assignedTo,
        createdBy: tasks.createdBy,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        estimatedHours: tasks.estimatedHours,
        actualHours: tasks.actualHours,
        tags: tasks.tags,
        blockedBy: tasks.blockedBy,
        progress: tasks.progress,
        outcome: tasks.outcome,
        location: tasks.location,
        department: tasks.department,
        // Include project info
        project: {
          id: projects.id,
          title: projects.title,
          status: projects.status,
          type: projects.type,
          location: projects.location,
          department: projects.department,
        },
        // Include assignee info
        assignee: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .leftJoin(users, eq(tasks.assignedTo, users.id))
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: tasks.id })
      .from(tasks)
      .where(and(...whereConditions));

    return NextResponse.json({
      tasks: userTasks,
      total: totalCount.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[TASKS_GET]', error);
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
      title,
      description,
      status,
      priority,
      dueDate,
      projectId,
      assignedTo,
      estimatedHours,
      tags,
      blockedBy,
      location,
      department,
    } = body;

    // Create the task
    const newTask = await db.insert(tasks).values({
      title,
      description,
      status: status || 'backlog',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
      assignedTo,
      createdBy: userId,
      estimatedHours,
      tags: tags || [],
      blockedBy,
      location,
      department,
    }).returning();

    // Log activity
    await db.insert(activityLog).values({
      userId,
      action: 'task.created',
      entityType: 'task',
      entityId: newTask[0].id,
      newValues: JSON.stringify({
        title,
        description,
        status: status || 'backlog',
        priority: priority || 'medium',
      }),
      metadata: JSON.stringify({ source: 'api' }),
    });

    return NextResponse.json(newTask[0]);
  } catch (error) {
    console.error('[TASKS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
