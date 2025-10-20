import { NextRequest, NextResponse } from 'next/server';

// Mock student data for testing
const mockStudents = [
  {
    id: 1,
    name: 'Emma Rodriguez',
    grade: 'K',
    school: 'primary',
    accommodations: ['ADHD Support', 'Visual Learning'],
    progress: 85,
    status: 'active',
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    grade: '3rd',
    school: 'primary',
    accommodations: ['Dyslexia Support'],
    progress: 92,
    status: 'active',
  },
  {
    id: 3,
    name: 'Sophia Chen',
    grade: '6th',
    school: 'secondary',
    accommodations: ['Gifted Program'],
    progress: 96,
    status: 'active',
  },
  {
    id: 4,
    name: 'Diego Hernandez',
    grade: '9th',
    school: 'language',
    accommodations: ['ELL Support'],
    progress: 88,
    status: 'active',
  },
  {
    id: 5,
    name: 'Tyler Johnson',
    grade: '10th',
    school: 'sports',
    accommodations: ['Athletic Schedule'],
    progress: 91,
    status: 'active',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const school = searchParams.get('school');
    const grade = searchParams.get('grade');

    let filteredStudents = mockStudents;

    if (school) {
      filteredStudents = filteredStudents.filter((student) => student.school === school);
    }

    if (grade) {
      filteredStudents = filteredStudents.filter((student) => student.grade === grade);
    }

    return NextResponse.json({
      success: true,
      students: filteredStudents,
      total: filteredStudents.length,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, grade, school, accommodations } = body;

    // Validate required fields
    if (!name || !grade || !school) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Create new student
    const newStudent = {
      id: mockStudents.length + 1,
      name,
      grade,
      school,
      accommodations: accommodations || [],
      progress: 0,
      status: 'active',
    };

    mockStudents.push(newStudent);

    return NextResponse.json({
      success: true,
      student: newStudent,
      message: 'Student created successfully',
    });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create student' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, grade, school, accommodations, progress, status } = body;

    // Find student by ID
    const studentIndex = mockStudents.findIndex((student) => student.id === id);

    if (studentIndex === -1) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    // Update student
    mockStudents[studentIndex] = {
      ...mockStudents[studentIndex],
      name: name || mockStudents[studentIndex].name,
      grade: grade || mockStudents[studentIndex].grade,
      school: school || mockStudents[studentIndex].school,
      accommodations: accommodations || mockStudents[studentIndex].accommodations,
      progress: progress !== undefined ? progress : mockStudents[studentIndex].progress,
      status: status || mockStudents[studentIndex].status,
    };

    return NextResponse.json({
      success: true,
      student: mockStudents[studentIndex],
      message: 'Student updated successfully',
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update student' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    // Find student by ID
    const studentIndex = mockStudents.findIndex((student) => student.id === id);

    if (studentIndex === -1) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    // Remove student
    const deletedStudent = mockStudents.splice(studentIndex, 1)[0];

    return NextResponse.json({
      success: true,
      student: deletedStudent,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete student' },
      { status: 500 },
    );
  }
}
