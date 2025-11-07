import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { logger } from '@/lib/logger';

// GET /api/academy/enrollments?studentId=UUID
export async function GET(req: NextRequest) {
  // Build-time safety: skip during static generation
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
  }

  const t0 = Date.now();
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    if (!studentId) {
      return NextResponse.json({ error: 'studentId required' }, { status: 400 });
    }
    const rows = await storage.listEnrollmentsByStudent(studentId);
    const courseIds = rows.map((r) => r.enrollment?.courseId).filter(Boolean);
    return NextResponse.json({ enrollments: rows, courseIds });
  } catch (e) {
    logger.error('academy.enrollments.error', { err: (e as Error).message });
    return NextResponse.json({ error: 'Failed to load enrollments' }, { status: 500 });
  } finally {
    logger.info('academy.enrollments.done', { durationMs: Date.now() - t0 });
  }
}

export async function POST(req: NextRequest) {
  // Build-time safety: skip during static generation
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
  }

  const t0 = Date.now();
  try {
    const { studentId, courseId } = await req.json();

    if (!studentId || !courseId) {
      return NextResponse.json({ error: 'studentId and courseId required' }, { status: 400 });
    }

    const enrollment = await storage.enrollStudentInCourse(studentId, courseId);
    return NextResponse.json({ enrollment });
  } catch (error) {
    logger.error('academy.enrollments.create.error', { err: (error as Error).message });
    return NextResponse.json({ error: 'Failed to enroll student' }, { status: 500 });
  } finally {
    logger.info('academy.enrollments.create.done', { durationMs: Date.now() - t0 });
  }
}
