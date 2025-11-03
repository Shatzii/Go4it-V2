import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../server/db';
import { studentGrades, students } from '../../../../shared/comprehensive-schema';
import { eq, desc } from 'drizzle-orm';

/**
 * GET /api/students/grades?studentId=xxx
 * Get all grades for a student
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Fetch all grades for the student
    const grades = await db
      .select()
      .from(studentGrades)
      .where(eq(studentGrades.studentId, studentId))
      .orderBy(desc(studentGrades.academicYear), desc(studentGrades.semester));

    return NextResponse.json({
      success: true,
      grades,
      count: grades.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch grades', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/students/grades
 * Create a new grade entry (student self-reported)
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      studentId,
      courseName,
      courseCode,
      school,
      semester,
      academicYear,
      gradeLevel,
      letterGrade,
      numericGrade,
      credits,
      isNcaaCore,
      courseType,
      notes
    } = data;

    // Validate required fields
    if (!studentId || !courseName || !semester || !academicYear || !letterGrade) {
      return NextResponse.json(
        { error: 'Missing required fields: studentId, courseName, semester, academicYear, letterGrade' },
        { status: 400 }
      );
    }

    // Verify student exists
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Create grade entry
    const [newGrade] = await db
      .insert(studentGrades)
      .values({
        studentId,
        courseName,
        courseCode: courseCode || null,
        school: school || null,
        semester,
        academicYear,
        gradeLevel: gradeLevel || null,
        letterGrade,
        numericGrade: numericGrade || null,
        credits: credits || '1.00',
        isNcaaCore: isNcaaCore || false,
        courseType: courseType || 'regular',
        verified: false,
        notes: notes || null
      })
      .returning();

    return NextResponse.json({
      success: true,
      grade: newGrade,
      message: 'Grade added successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create grade entry', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/students/grades/:id
 * Update a grade entry
 */
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gradeId = searchParams.get('id');
    const data = await req.json();

    if (!gradeId) {
      return NextResponse.json(
        { error: 'Grade ID is required' },
        { status: 400 }
      );
    }

    // Check if grade exists
    const [existingGrade] = await db
      .select()
      .from(studentGrades)
      .where(eq(studentGrades.id, gradeId))
      .limit(1);

    if (!existingGrade) {
      return NextResponse.json(
        { error: 'Grade not found' },
        { status: 404 }
      );
    }

    // Don't allow updating verified grades without admin permission
    if (existingGrade.verified) {
      return NextResponse.json(
        { error: 'Cannot update verified grades. Contact an administrator.' },
        { status: 403 }
      );
    }

    // Update grade
    const [updatedGrade] = await db
      .update(studentGrades)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(studentGrades.id, gradeId))
      .returning();

    return NextResponse.json({
      success: true,
      grade: updatedGrade,
      message: 'Grade updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update grade', details: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/students/grades/:id
 * Delete a grade entry (only unverified grades)
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gradeId = searchParams.get('id');

    if (!gradeId) {
      return NextResponse.json(
        { error: 'Grade ID is required' },
        { status: 400 }
      );
    }

    // Check if grade exists
    const [existingGrade] = await db
      .select()
      .from(studentGrades)
      .where(eq(studentGrades.id, gradeId))
      .limit(1);

    if (!existingGrade) {
      return NextResponse.json(
        { error: 'Grade not found' },
        { status: 404 }
      );
    }

    // Don't allow deleting verified grades
    if (existingGrade.verified) {
      return NextResponse.json(
        { error: 'Cannot delete verified grades. Contact an administrator.' },
        { status: 403 }
      );
    }

    // Delete grade
    await db
      .delete(studentGrades)
      .where(eq(studentGrades.id, gradeId));

    return NextResponse.json({
      success: true,
      message: 'Grade deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete grade', details: (error as Error).message },
      { status: 500 }
    );
  }
}
