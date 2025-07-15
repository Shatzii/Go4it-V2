import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  description: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  duration: z.string().optional(),
  maxStudents: z.number().min(1).max(50),
  difficulty: z.string().min(1, 'Difficulty level is required'),
  schedule: z.string().optional(),
  learningObjectives: z.string().optional(),
  prerequisites: z.string().optional(),
  schoolId: z.string().min(1, 'School ID is required'),
  createdBy: z.string().min(1, 'Creator ID is required'),
  createdAt: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createClassSchema.parse(body)
    
    // Generate a unique class ID
    const classId = `class_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create the class object
    const newClass = {
      id: classId,
      ...validatedData,
      status: 'active',
      enrollmentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // In a real implementation, you would save to database
    // For now, we'll simulate success
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Class created successfully',
        class: newClass
      }, 
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error creating class:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid input data',
          errors: error.errors 
        }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create class' 
      }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const userId = searchParams.get('userId')
    
    // Mock classes data - in real implementation, fetch from database
    const mockClasses = [
      {
        id: 'class_1',
        name: 'Advanced Mathematics',
        subject: 'Mathematics',
        gradeLevel: '10th Grade',
        difficulty: 'Advanced',
        maxStudents: 25,
        enrollmentCount: 18,
        schedule: 'Mon/Wed/Fri 10:00 AM',
        duration: '50 minutes',
        schoolId: schoolId || 'secondary',
        createdBy: 'teacher_1',
        status: 'active'
      },
      {
        id: 'class_2',
        name: 'Creative Writing',
        subject: 'English Language Arts',
        gradeLevel: '9th Grade',
        difficulty: 'Intermediate',
        maxStudents: 20,
        enrollmentCount: 15,
        schedule: 'Tue/Thu 2:00 PM',
        duration: '45 minutes',
        schoolId: schoolId || 'secondary',
        createdBy: 'teacher_2',
        status: 'active'
      }
    ]
    
    return NextResponse.json({ 
      success: true, 
      classes: mockClasses 
    })
    
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch classes' 
      }, 
      { status: 500 }
    )
  }
}