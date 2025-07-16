import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if user has permission to view students (admin, coach, teacher)
    if (!['admin', 'coach', 'teacher'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Get students based on user role
    let students;
    if (user.role === 'admin') {
      // Admin can see all students
      students = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          sport: users.sport,
          position: users.position,
          graduationYear: users.graduationYear,
          gpa: users.gpa,
          isActive: users.isActive,
          createdAt: users.createdAt,
          lastLoginAt: users.lastLoginAt
        })
        .from(users)
        .where(eq(users.role, 'athlete'));
    } else {
      // Coaches and teachers see limited student data
      students = await db
        .select({
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          sport: users.sport,
          position: users.position,
          graduationYear: users.graduationYear,
          isActive: users.isActive
        })
        .from(users)
        .where(eq(users.role, 'athlete'));
    }

    return NextResponse.json({
      success: true,
      students,
      total: students.length,
      user_role: user.role
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Only admins can create students
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const studentData = await request.json();
    
    // Validate required fields
    if (!studentData.username || !studentData.email) {
      return NextResponse.json(
        { error: 'Username and email are required' },
        { status: 400 }
      );
    }

    // Create new student
    const [newStudent] = await db
      .insert(users)
      .values({
        username: studentData.username,
        email: studentData.email,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        sport: studentData.sport,
        position: studentData.position,
        graduationYear: studentData.graduationYear,
        gpa: studentData.gpa,
        role: 'athlete',
        password: 'temporary_password', // Should be hashed and user should reset
        isActive: true
      })
      .returning();

    return NextResponse.json({
      success: true,
      student: {
        id: newStudent.id,
        username: newStudent.username,
        email: newStudent.email,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        sport: newStudent.sport,
        position: newStudent.position,
        graduationYear: newStudent.graduationYear,
        gpa: newStudent.gpa
      }
    });

  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}