import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  try {
    const { studentId, courseId } = await req.json();
    if (!studentId || !courseId)
      return NextResponse.json({ error: 'studentId and courseId required' }, { status: 400 });
    const enrollment = await storage.enrollStudentInCourse(String(studentId), String(courseId));
    return NextResponse.json({ success: true, enrollment });
  } catch (e) {
    logger.error('academy.enroll.error', { err: (e as Error).message });
    return NextResponse.json({ error: 'Enrollment failed' }, { status: 500 });
  } finally {
    logger.info('academy.enroll.done', { durationMs: Date.now() - t0 });
  }
}
