import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';
const dbPath = path.join(process.cwd(), 'go4it-os.db');
const db = new Database(dbPath);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    const certificates = db.prepare(`
      SELECT
        c.id,
        s.name as studentName,
        SUBSTR(s.name, 1, 2) as studentInitials,
        co.title as courseName,
        c.title,
        c.description,
        c.issued_date as issuedDate,
        c.certificate_number as certificateNumber,
        c.status,
        c.type
      FROM certificates c
      JOIN academy_students s ON c.student_id = s.id
      LEFT JOIN academy_courses co ON c.course_id = co.id
      WHERE c.issued_by = ?
      ORDER BY c.issued_date DESC
    `).all(teacherId);

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, courseId, templateId, title, description, type, teacherId } = await request.json();

    if (!studentId || !title || !teacherId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique certificate number and verification code
    const certificateNumber = `CERT-${Date.now()}-${randomBytes(4).toString('hex').toUpperCase()}`;
    const verificationCode = randomBytes(16).toString('hex');

    const insertCertificate = db.prepare(`
      INSERT INTO certificates (
        student_id, template_id, course_id, title, description,
        certificate_number, verification_code, issued_by, type
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertCertificate.run(
      studentId,
      templateId || 1,
      courseId || null,
      title,
      description,
      certificateNumber,
      verificationCode,
      teacherId,
      type
    );

    return NextResponse.json({
      success: true,
      certificateId: result.lastInsertRowid,
      certificateNumber,
      verificationCode,
    });
  } catch (error) {
    console.error('Error issuing certificate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}