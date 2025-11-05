import { NextRequest, NextResponse } from 'next/server';


// TODO: This route uses raw SQLite queries and needs migration to Drizzle ORM
// Temporarily disabled during PostgreSQL migration

const MIGRATION_MESSAGE = {
  error: 'Academy feature requires database migration',
  message: 'This endpoint uses legacy SQLite and is being migrated to PostgreSQL',
  status: 'under_maintenance'
};

export async function GET(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json(MIGRATION_MESSAGE, { status: 503 });
}

/* 
 * ORIGINAL CODE BELOW - NEEDS MIGRATION TO DRIZZLE ORM
 * ====================================================
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const { studentId } = await request.json();
    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Check if group exists and get member count
    const group = db.prepare(`
      SELECT sg.max_members, COUNT(sgm.student_id) as currentMembers, sg.is_private
      FROM study_groups sg
      LEFT JOIN study_group_members sgm ON sg.id = sgm.group_id
      WHERE sg.id = ?
      GROUP BY sg.id
    `).get(params.groupId);

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    if (group.currentMembers >= group.max_members) {
      return NextResponse.json({ error: 'Group is full' }, { status: 400 });
    }

    // Check if student is already a member
    const existingMember = db.prepare(`
      SELECT id FROM study_group_members
      WHERE group_id = ? AND student_id = ?
    `).get(params.groupId, studentId);

    if (existingMember) {
      return NextResponse.json({ error: 'Already a member of this group' }, { status: 400 });
    }

    // Add student to group
    const insertMember = db.prepare(`
      INSERT INTO study_group_members (group_id, student_id, role)
      VALUES (?, ?, 'member')
    `);

    insertMember.run(params.groupId, studentId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error joining group:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
 */
