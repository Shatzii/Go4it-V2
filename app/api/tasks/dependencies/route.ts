import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { taskDependencies, tasks, activityLog } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');

    let whereConditions = [];

    if (taskId) {
      whereConditions.push(eq(taskDependencies.taskId, taskId));
    }

    // Get dependencies with task details
    const dependencies = await db
      .select({
        id: taskDependencies.id,
        taskId: taskDependencies.taskId,
        dependsOnTaskId: taskDependencies.dependsOnTaskId,
        dependencyType: taskDependencies.dependencyType,
        createdAt: taskDependencies.createdAt,
        // Include dependent task info
        dependentTask: {
          id: tasks.id,
          title: tasks.title,
          status: tasks.status,
          priority: tasks.priority,
        },
      })
      .from(taskDependencies)
      .leftJoin(tasks, eq(taskDependencies.dependsOnTaskId, tasks.id))
      .where(and(...whereConditions))
      .orderBy(taskDependencies.createdAt);

    return NextResponse.json(dependencies);
  } catch (error) {
    console.error('[TASK_DEPENDENCIES_GET]', error);
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
    const { taskId, dependsOnTaskId, dependencyType } = body;

    if (!taskId || !dependsOnTaskId) {
      return new NextResponse('Task ID and dependency task ID are required', { status: 400 });
    }

    // Check if dependency would create a cycle
    const checkCycle = async (currentTaskId: string, targetTaskId: string): Promise<boolean> => {
      if (currentTaskId === targetTaskId) return true;

      const deps = await db
        .select({ dependsOnTaskId: taskDependencies.dependsOnTaskId })
        .from(taskDependencies)
        .where(eq(taskDependencies.taskId, currentTaskId));

      for (const dep of deps) {
        if (await checkCycle(dep.dependsOnTaskId, targetTaskId)) {
          return true;
        }
      }
      return false;
    };

    if (await checkCycle(dependsOnTaskId, taskId)) {
      return new NextResponse('Dependency would create a cycle', { status: 400 });
    }

    // Create the dependency
    const newDependency = await db.insert(taskDependencies).values({
      taskId,
      dependsOnTaskId,
      dependencyType: dependencyType || 'finish_to_start',
    }).returning();

    // Log activity
    await db.insert(activityLog).values({
      userId,
      action: 'task.dependency.created',
      entityType: 'task',
      entityId: taskId,
      newValues: JSON.stringify({
        dependsOnTaskId,
        dependencyType: dependencyType || 'finish_to_start',
      }),
      metadata: JSON.stringify({ source: 'api' }),
    });

    return NextResponse.json(newDependency[0]);
  } catch (error) {
    console.error('[TASK_DEPENDENCIES_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dependencyId = searchParams.get('id');

    if (!dependencyId) {
      return new NextResponse('Dependency ID is required', { status: 400 });
    }

    // Get the dependency before deleting for logging
    const dependency = await db
      .select()
      .from(taskDependencies)
      .where(eq(taskDependencies.id, dependencyId))
      .limit(1);

    if (dependency.length === 0) {
      return new NextResponse('Dependency not found', { status: 404 });
    }

    // Delete the dependency
    await db.delete(taskDependencies).where(eq(taskDependencies.id, dependencyId));

    // Log activity
    await db.insert(activityLog).values({
      userId,
      action: 'task.dependency.deleted',
      entityType: 'task',
      entityId: dependency[0].taskId,
      oldValues: JSON.stringify({
        dependsOnTaskId: dependency[0].dependsOnTaskId,
        dependencyType: dependency[0].dependencyType,
      }),
      metadata: JSON.stringify({ source: 'api' }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[TASK_DEPENDENCIES_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
