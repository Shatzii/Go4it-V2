import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  // Build-time safety: skip during static generation
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
  }

  const t0 = Date.now();
  try {
    const url = new URL(req.url);
    const studentId = url.searchParams.get('studentId');
    const courseId = url.searchParams.get('courseId');

    let assignments;
    if (studentId) {
      assignments = await storage.getStudentAssignments(studentId);
    } else if (courseId) {
      assignments = await storage.getAssignmentsByCourse(courseId);
    } else {
      return NextResponse.json({ error: 'studentId or courseId required' }, { status: 400 });
    }

    return NextResponse.json({ assignments });
  } catch (error) {
    logger.error('academy.assignments.error', { err: (error as Error).message });
    return NextResponse.json({ error: 'Failed to load assignments' }, { status: 500 });
  } finally {
    logger.info('academy.assignments.done', { durationMs: Date.now() - t0 });
  }
}

export async function POST(req: NextRequest) {
  // Build-time safety: skip during static generation
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ error: 'Service temporarily unavailable during build' }, { status: 503 });
  }

  const t0 = Date.now();
  try {
    const assignmentData = await req.json();
    const assignment = await storage.createAssignment(assignmentData);
    return NextResponse.json({ assignment });
  } catch (error) {
    logger.error('academy.assignments.create.error', { err: (error as Error).message });
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
  } finally {
    logger.info('academy.assignments.create.done', { durationMs: Date.now() - t0 });
  }
}
