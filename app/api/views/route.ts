import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { savedViews, tasks, projects, activityLog } from '@/lib/db/schema';
import { eq, and, or, like, asc, desc, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const viewType = searchParams.get('viewType');
    const isPublic = searchParams.get('isPublic');

    // Build where conditions
    const whereConditions = [
      or(
        eq(savedViews.userId, userId), // User's own views
        eq(savedViews.isPublic, true)  // Public views from others
      )
    ];

    if (viewType) {
      whereConditions.push(eq(savedViews.viewType, viewType));
    }

    if (isPublic !== null) {
      whereConditions.push(eq(savedViews.isPublic, isPublic === 'true'));
    }

    // Get saved views
    const views = await db
      .select()
      .from(savedViews)
      .where(and(...whereConditions))
      .orderBy(savedViews.createdAt);

    return NextResponse.json(views);
  } catch (error) {
    console.error('[SAVED_VIEWS_GET]', error);
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
      name,
      description,
      viewType,
      filters,
      sortBy,
      sortOrder,
      isDefault,
      isPublic,
    } = body;

    // Create the saved view
    const newView = await db.insert(savedViews).values({
      userId,
      name,
      description,
      viewType,
      filters: JSON.stringify(filters || {}),
      sortBy,
      sortOrder: sortOrder || 'desc',
      isDefault: isDefault || false,
      isPublic: isPublic || false,
    }).returning();

    // Log activity
    await db.insert(activityLog).values({
      userId,
      action: 'view.created',
      entityType: 'view',
      entityId: newView[0].id,
      newValues: JSON.stringify({
        name,
        viewType,
        isPublic: isPublic || false,
      }),
      metadata: JSON.stringify({ source: 'api' }),
    });

    return NextResponse.json(newView[0]);
  } catch (error) {
    console.error('[SAVED_VIEWS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Apply a saved view to get filtered results
export async function PUT(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const viewId = searchParams.get('id');

    if (!viewId) {
      return new NextResponse('View ID is required', { status: 400 });
    }

    // Get the saved view
    const view = await db
      .select()
      .from(savedViews)
      .where(
        and(
          eq(savedViews.id, viewId),
          or(
            eq(savedViews.userId, userId),
            eq(savedViews.isPublic, true)
          )
        )
      )
      .limit(1);

    if (view.length === 0) {
      return new NextResponse('View not found or access denied', { status: 404 });
    }

    const savedView = view[0];
    const filters = JSON.parse(savedView.filters);

    // Apply the view based on its type
    let results;
    switch (savedView.viewType) {
      case 'tasks':
        results = await applyTaskFilters(filters, savedView.sortBy, savedView.sortOrder, userId);
        break;
      case 'projects':
        results = await applyProjectFilters(filters, savedView.sortBy, savedView.sortOrder, userId);
        break;
      case 'dashboard':
        results = await applyDashboardFilters(filters, userId);
        break;
      default:
        return new NextResponse('Unsupported view type', { status: 400 });
    }

    return NextResponse.json({
      view: savedView,
      results,
      appliedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[SAVED_VIEWS_APPLY]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Helper function to apply task filters
async function applyTaskFilters(filters: any, sortBy: string, sortOrder: string, userId: string) {
  const whereConditions = [eq(tasks.createdBy, userId)];

  // Apply filters
  if (filters.status) {
    whereConditions.push(eq(tasks.status, filters.status));
  }

  if (filters.priority) {
    whereConditions.push(eq(tasks.priority, filters.priority));
  }

  if (filters.assignedTo) {
    whereConditions.push(eq(tasks.assignedTo, filters.assignedTo));
  }

  if (filters.tags && filters.tags.length > 0) {
    // Note: This is a simplified tag filtering - in production you'd want more sophisticated tag matching
    whereConditions.push(or(...filters.tags.map((tag: string) => like(tasks.tags, `%${tag}%`))));
  }

  if (filters.location) {
    whereConditions.push(eq(tasks.location, filters.location));
  }

  if (filters.department) {
    whereConditions.push(eq(tasks.department, filters.department));
  }

  // Apply sorting
  const orderBy = sortOrder === 'asc' ? asc(tasks[sortBy]) : desc(tasks[sortBy]);

  return await db
    .select()
    .from(tasks)
    .where(and(...whereConditions))
    .orderBy(orderBy)
    .limit(100);
}

// Helper function to apply project filters
async function applyProjectFilters(filters: any, sortBy: string, sortOrder: string, userId: string) {
  const whereConditions = [eq(projects.leadId, userId)];

  // Apply filters
  if (filters.status) {
    whereConditions.push(eq(projects.status, filters.status));
  }

  if (filters.type) {
    whereConditions.push(eq(projects.type, filters.type));
  }

  if (filters.location) {
    whereConditions.push(eq(projects.location, filters.location));
  }

  if (filters.department) {
    whereConditions.push(eq(projects.department, filters.department));
  }

  if (filters.priority) {
    whereConditions.push(eq(projects.priority, filters.priority));
  }

  // Apply sorting
  const orderBy = sortOrder === 'asc' ? asc(projects[sortBy]) : desc(projects[sortBy]);

  return await db
    .select()
    .from(projects)
    .where(and(...whereConditions))
    .orderBy(orderBy)
    .limit(50);
}

// Helper function to apply dashboard filters
async function applyDashboardFilters(filters: any, userId: string) {
  // Get summary statistics based on filters
  const taskStats = await db
    .select({
      total: sql<number>`count(${tasks.id})`,
      completed: sql<number>`count(case when ${tasks.status} = 'completed' then 1 end)`,
      inProgress: sql<number>`count(case when ${tasks.status} = 'in_progress' then 1 end)`,
      backlog: sql<number>`count(case when ${tasks.status} = 'backlog' then 1 end)`,
    })
    .from(tasks)
    .where(eq(tasks.createdBy, userId));

  const projectStats = await db
    .select({
      total: sql<number>`count(${projects.id})`,
      active: sql<number>`count(case when ${projects.status} = 'active' then 1 end)`,
      completed: sql<number>`count(case when ${projects.status} = 'completed' then 1 end)`,
    })
    .from(projects)
    .where(eq(projects.leadId, userId));

  return {
    tasks: taskStats[0],
    projects: projectStats[0],
    filters: filters,
  };
}
