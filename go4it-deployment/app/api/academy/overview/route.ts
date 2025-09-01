import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { logger } from '@/lib/logger';

export const revalidate = 60; // cache snapshot for a minute

export async function GET() {
  const t0 = Date.now();
  try {
    const meRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/auth/me`, {
      cache: 'no-store',
    });
    let userId: string | undefined;
    if (meRes.ok) {
      const me = await meRes.json();
      userId = me?.user?.id;
    }
    await storage.ensureSeedCourses();
    const [courses, enrollments] = await Promise.all([
      storage.listCourses(),
      userId ? storage.listEnrollmentsByStudent(userId) : Promise.resolve([]),
    ]);
    const enrolledIds = new Set((enrollments || []).map((r: any) => r.enrollment?.courseId));
    const display = courses.map((c: any) => ({
      id: c.id,
      title: c.title,
      description: c.description || '',
      difficulty: c.difficulty || 'Intermediate',
      subjects: c.subjects || [],
      progress: 0,
      nextLesson: 'Introduction',
      estimatedTime: '45 mins',
      enrolled: enrolledIds.has(c.id),
      instructor: c.instructor || 'Staff',
    }));
    return NextResponse.json({ userId, courses: display, enrolledIds: Array.from(enrolledIds) });
  } catch (e) {
    logger.error('academy.overview.error', { err: (e as Error).message });
    return NextResponse.json({ error: 'Failed to load overview' }, { status: 500 });
  } finally {
    logger.info('academy.overview.done', { durationMs: Date.now() - t0 });
  }
}
