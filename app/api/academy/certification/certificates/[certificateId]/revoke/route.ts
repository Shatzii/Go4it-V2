import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

export async function POST(
  request: NextRequest,
  { params }: { params: { certificateId: string } }
) {
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