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
  { params }: { params: { certificateId: string } }
) {
// Build-time safety: skip during static generation
if (process.env.NEXT_PHASE === 'phase-production-build') {
  return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
}

    try {
    const { teacherId } = await request.json();
    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    // Verify certificate belongs to teacher
    const certificate = db.prepare(`
      SELECT id FROM certificates
      WHERE id = ? AND issued_by = ?
    `).get(params.certificateId, teacherId);

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found or access denied' }, { status: 404 });
    }

    // Revoke certificate
    db.prepare(`
      UPDATE certificates
      SET status = 'revoked'
      WHERE id = ?
    `).run(params.certificateId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error revoking certificate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
 */
