import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { tasks, projects, timeEntries } from '@/lib/db/schema';
import { eq, sql, and, gte, lte } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get date range for current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get task statistics
    const taskStats = await db
      .select({
        total: sql<number>`count(*)`,
        completed: sql<number>`count(case when ${tasks.status} = 'completed' then 1 end)`,
        inProgress: sql<number>`count(case when ${tasks.status} = 'in_progress' then 1 end)`,
        backlog: sql<number>`count(case when ${tasks.status} = 'backlog' then 1 end)`,
        overdue: sql<number>`count(case when ${tasks.dueDate} < now() and ${tasks.status} != 'completed' then 1 end)`,
      })
      .from(tasks)
      .where(eq(tasks.createdBy, userId));

    // Get project statistics
    const projectStats = await db
      .select({
        total: sql<number>`count(*)`,
        active: sql<number>`count(case when ${projects.status} = 'active' then 1 end)`,
        completed: sql<number>`count(case when ${projects.status} = 'completed' then 1 end)`,
      })
      .from(projects)
      .where(eq(projects.leadId, userId));

    // Get time tracking statistics for current month
    const timeStats = await db
      .select({
        totalHours: sql<number>`coalesce(sum(${timeEntries.duration}), 0)`,
        billableHours: sql<number>`coalesce(sum(case when ${timeEntries.isBillable} then ${timeEntries.duration} else 0 end), 0)`,
        entriesCount: sql<number>`count(*)`,
      })
      .from(timeEntries)
      .where(
        and(
          eq(timeEntries.userId, userId),
          gte(timeEntries.startTime, startOfMonth),
          lte(timeEntries.startTime, endOfMonth)
        )
      );

    // Calculate completion rate
    const totalTasks = taskStats[0].total;
    const completedTasks = taskStats[0].completed;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate average task completion time (simplified)
    const avgTaskTime = totalTasks > 0 ? Math.round(timeStats[0].totalHours / totalTasks) : 0;

    const stats = {
      totalTasks,
      completedTasks,
      inProgressTasks: taskStats[0].inProgress,
      overdueTasks: taskStats[0].overdue,
      totalProjects: projectStats[0].total,
      activeProjects: projectStats[0].active,
      completionRate,
      averageTaskTime: avgTaskTime,
      totalHoursThisMonth: Math.round(timeStats[0].totalHours / 60), // Convert to hours
      billableHoursThisMonth: Math.round(timeStats[0].billableHours / 60),
      timeEntriesCount: timeStats[0].entriesCount,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('[DASHBOARD_STATS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
