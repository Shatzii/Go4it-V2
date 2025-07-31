import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../server/db';
import { curriculum } from '../../../../shared/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const gradeLevel = searchParams.get('gradeLevel');

    let query = db.select().from(curriculum);
    
    if (subject) {
      query = query.where(eq(curriculum.subject, subject));
    }
    
    const courses = await query;
    
    // Filter by grade level if provided
    let filteredCourses = courses;
    if (gradeLevel) {
      filteredCourses = courses.filter(course => course.gradeLevel === gradeLevel);
    }

    return NextResponse.json({ 
      success: true,
      courses: filteredCourses
    });
    
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}