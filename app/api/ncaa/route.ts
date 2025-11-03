import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../server/db';
import { ncaaChecklist, students } from '../../../shared/comprehensive-schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema
const ChecklistItemSchema = z.object({
  studentId: z.string().uuid(),
  key: z.string().max(50),
  label: z.string().max(200),
  status: z.enum(['todo', 'in_progress', 'done', 'blocked']).default('todo'),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  priority: z.number().int().min(0).max(2).default(0)
});

const UpdateItemSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'done', 'blocked']).optional(),
  notes: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.number().int().min(0).max(2).optional()
});

// Default NCAA checklist items
const DEFAULT_CHECKLIST_ITEMS = [
  {
    key: 'ecid',
    label: 'Register with NCAA Eligibility Center',
    priority: 2,
    notes: 'Create account at eligibilitycenter.org'
  },
  {
    key: 'transcripts',
    label: 'Submit official transcripts',
    priority: 2,
    notes: 'Request transcripts from all high schools attended'
  },
  {
    key: 'translations',
    label: 'Get foreign transcripts translated',
    priority: 1,
    notes: 'Use NCAA-approved translation service for non-US credits'
  },
  {
    key: 'gpa',
    label: 'Calculate core-course GPA',
    priority: 2,
    notes: 'Only NCAA-approved core courses count'
  },
  {
    key: 'tests',
    label: 'Take SAT/ACT and submit scores',
    priority: 2,
    notes: 'NCAA Eligibility Center code: 9999'
  },
  {
    key: 'amateur',
    label: 'Complete amateurism questionnaire',
    priority: 1,
    notes: 'Declare all benefits received'
  },
  {
    key: 'courses',
    label: 'Verify 16 core courses completed',
    priority: 2,
    notes: 'Must include required distribution (4 English, 3 Math, etc.)'
  },
  {
    key: 'certification',
    label: 'Request final certification',
    priority: 1,
    notes: 'After graduation, request final amateurism certification'
  }
];

/**
 * GET /api/ncaa
 * Get NCAA checklist for a student
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Verify student exists
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Fetch checklist items
    const items = await db
      .select()
      .from(ncaaChecklist)
      .where(eq(ncaaChecklist.studentId, studentId))
      .orderBy(desc(ncaaChecklist.priority), ncaaChecklist.createdAt);

    // If no items exist, initialize with defaults
    if (items.length === 0) {
      const defaultItems = await db
        .insert(ncaaChecklist)
        .values(
          DEFAULT_CHECKLIST_ITEMS.map(item => ({
            studentId,
            ...item,
            status: 'todo' as const
          }))
        )
        .returning();

      return NextResponse.json({
        success: true,
        checklist: defaultItems,
        stats: {
          total: defaultItems.length,
          done: 0,
          in_progress: 0,
          todo: defaultItems.length,
          blocked: 0,
          completionRate: 0
        }
      });
    }

    // Calculate stats
    const stats = {
      total: items.length,
      done: items.filter(i => i.status === 'done').length,
      in_progress: items.filter(i => i.status === 'in_progress').length,
      todo: items.filter(i => i.status === 'todo').length,
      blocked: items.filter(i => i.status === 'blocked').length,
      completionRate: items.length > 0 
        ? Math.round((items.filter(i => i.status === 'done').length / items.length) * 100) 
        : 0
    };

    return NextResponse.json({
      success: true,
      checklist: items,
      stats
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch NCAA checklist', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ncaa
 * Create a new checklist item
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const parsed = ChecklistItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Verify student exists
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, data.studentId))
      .limit(1);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Create checklist item
    const [newItem] = await db
      .insert(ncaaChecklist)
      .values({
        studentId: data.studentId,
        key: data.key,
        label: data.label,
        status: data.status,
        dueDate: data.dueDate || null,
        notes: data.notes || null,
        priority: data.priority
      })
      .returning();

    return NextResponse.json({
      success: true,
      item: newItem,
      message: 'Checklist item created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create checklist item', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ncaa?id=xxx
 * Update a checklist item
 */
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('id');
    
    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    
    // Validate input
    const parsed = UpdateItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const updates: any = {
      ...parsed.data,
      updatedAt: new Date()
    };

    // If marking as done, set completed date
    if (parsed.data.status === 'done') {
      updates.completedDate = new Date().toISOString().split('T')[0];
    }

    // Update item
    const [updatedItem] = await db
      .update(ncaaChecklist)
      .set(updates)
      .where(eq(ncaaChecklist.id, itemId))
      .returning();

    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Checklist item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      item: updatedItem,
      message: 'Checklist item updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update checklist item', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ncaa?id=xxx
 * Delete a checklist item
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('id');

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    await db
      .delete(ncaaChecklist)
      .where(eq(ncaaChecklist.id, itemId));

    return NextResponse.json({
      success: true,
      message: 'Checklist item deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete checklist item', details: (error as Error).message },
      { status: 500 }
    );
  }
}
