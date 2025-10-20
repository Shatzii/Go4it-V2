import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');

    if (schoolId) {
      const courses = await storage.getCoursesBySchool(schoolId);
      return NextResponse.json(courses);
    }

    const courses = await storage.getCourses();
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
