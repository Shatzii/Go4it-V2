import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { workflowTemplates, tasks, projects, notifications, activityLog } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const triggerType = searchParams.get('triggerType');
    const isActive = searchParams.get('isActive');

    // Build where conditions
    const whereConditions = [eq(workflowTemplates.createdBy, userId)];

    if (triggerType) {
      whereConditions.push(eq(workflowTemplates.triggerType, triggerType));
    }

    if (isActive !== null) {
      whereConditions.push(eq(workflowTemplates.isActive, isActive === 'true'));
    }

    // Get workflow templates
    const workflows = await db
      .select()
      .from(workflowTemplates)
      .where(and(...whereConditions))
      .orderBy(workflowTemplates.createdAt);

    return NextResponse.json(workflows);
  } catch (error) {
    console.error('[WORKFLOWS_GET]', error);
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
      triggerType,
      triggerConditions,
      actions,
      isActive,
    } = body;

    // Create the workflow template
    const newWorkflow = await db.insert(workflowTemplates).values({
      name,
      description,
      triggerType,
      triggerConditions: JSON.stringify(triggerConditions || {}),
      actions: JSON.stringify(actions || []),
      isActive: isActive !== undefined ? isActive : true,
      createdBy: userId,
    }).returning();

    // Log activity
    await db.insert(activityLog).values({
      userId,
      action: 'workflow.created',
      entityType: 'workflow',
      entityId: newWorkflow[0].id,
      newValues: JSON.stringify({
        name,
        triggerType,
        isActive: isActive !== undefined ? isActive : true,
      }),
      metadata: JSON.stringify({ source: 'api' }),
    });

    return NextResponse.json(newWorkflow[0]);
  } catch (error) {
    console.error('[WORKFLOWS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Execute workflow based on trigger
export async function PUT(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workflowId = searchParams.get('id');

    if (!workflowId) {
      return new NextResponse('Workflow ID is required', { status: 400 });
    }

    const body = await req.json();
    const { triggerData } = body;

    // Get the workflow
    const workflow = await db
      .select()
      .from(workflowTemplates)
      .where(and(eq(workflowTemplates.id, workflowId), eq(workflowTemplates.isActive, true)))
      .limit(1);

    if (workflow.length === 0) {
      return new NextResponse('Workflow not found or inactive', { status: 404 });
    }

    const workflowTemplate = workflow[0];
    const actions = JSON.parse(workflowTemplate.actions);
    const triggerConditions = JSON.parse(workflowTemplate.triggerConditions);

    // Check if trigger conditions are met
    const conditionsMet = evaluateTriggerConditions(triggerConditions, triggerData);

    if (!conditionsMet) {
      return NextResponse.json({ executed: false, reason: 'Trigger conditions not met' });
    }

    // Execute actions
    const results = [];
    for (const action of actions) {
      const result = await executeWorkflowAction(action, triggerData, userId);
      results.push(result);
    }

    // Log workflow execution
    await db.insert(activityLog).values({
      userId,
      action: 'workflow.executed',
      entityType: 'workflow',
      entityId: workflowId,
      metadata: JSON.stringify({
        triggerData,
        actionsExecuted: results.length,
        source: 'api',
      }),
    });

    return NextResponse.json({
      executed: true,
      workflowId,
      actionsExecuted: results.length,
      results,
    });
  } catch (error) {
    console.error('[WORKFLOWS_EXECUTE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Helper function to evaluate trigger conditions
function evaluateTriggerConditions(conditions: any, triggerData: any): boolean {
  if (!conditions || Object.keys(conditions).length === 0) {
    return true; // No conditions means always trigger
  }

  for (const [key, value] of Object.entries(conditions)) {
    if (triggerData[key] !== value) {
      return false;
    }
  }

  return true;
}

// Helper function to execute workflow actions
async function executeWorkflowAction(action: any, triggerData: any, userId: string) {
  try {
    switch (action.type) {
      case 'create_task':
        const newTask = await db.insert(tasks).values({
          title: action.title,
          description: action.description,
          status: action.status || 'backlog',
          priority: action.priority || 'medium',
          projectId: action.projectId || triggerData.projectId,
          assignedTo: action.assignedTo || triggerData.assignedTo,
          createdBy: userId,
          tags: action.tags || [],
        }).returning();

        return { action: 'create_task', success: true, taskId: newTask[0].id };

      case 'update_task':
        await db
          .update(tasks)
          .set(action.updates)
          .where(eq(tasks.id, action.taskId || triggerData.taskId));

        return { action: 'update_task', success: true, taskId: action.taskId || triggerData.taskId };

      case 'send_notification':
        const notification = await db.insert(notifications).values({
          userId: action.userId || triggerData.userId || userId,
          type: action.notificationType || 'in_app',
          title: action.title,
          message: action.message,
          priority: action.priority || 'normal',
          actionUrl: action.actionUrl,
          metadata: JSON.stringify(action.metadata || {}),
        }).returning();

        return { action: 'send_notification', success: true, notificationId: notification[0].id };

      case 'update_project':
        await db
          .update(projects)
          .set(action.updates)
          .where(eq(projects.id, action.projectId || triggerData.projectId));

        return { action: 'update_project', success: true, projectId: action.projectId || triggerData.projectId };

      default:
        return { action: action.type, success: false, error: 'Unknown action type' };
    }
  } catch (error) {
    console.error(`Error executing workflow action ${action.type}:`, error);
    return { action: action.type, success: false, error: error.message };
  }
}
