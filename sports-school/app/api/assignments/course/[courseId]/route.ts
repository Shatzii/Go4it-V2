import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';

export async function GET(request: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const assignments = await storage.getAssignmentsByCourse(params.courseId);
    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments by course:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}
