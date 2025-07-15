import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { insertGradeSchema } from '@/shared/schema';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');
    
    if (userId && courseId) {
      const userGrades = await storage.getGradesByUser(userId);
      const courseGrades = userGrades.filter(g => g.courseId === courseId);
      return NextResponse.json(courseGrades);
    }
    
    if (userId) {
      const grades = await storage.getGradesByUser(userId);
      return NextResponse.json(grades);
    }
    
    if (courseId) {
      const grades = await storage.getGradesByCourse(courseId);
      return NextResponse.json(grades);
    }
    
    const grades = await storage.getGrades();
    return NextResponse.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json({ error: 'Failed to fetch grades' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = insertGradeSchema.parse(body);
    const grade = await storage.createGrade(validatedData);
    return NextResponse.json(grade, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid grade data', details: error.errors }, { status: 400 });
    }
    console.error('Error creating grade:', error);
    return NextResponse.json({ error: 'Failed to create grade' }, { status: 500 });
  }
}