import { NextRequest, NextResponse } from 'next/server'
import { storage } from './storage'
import { getUserFromRequest } from '@/lib/auth'
import { logAuditEvent, getClientIP } from '@/lib/security'
import { insertUserSchema, insertCourseSchema, insertAssignmentSchema, insertSubmissionSchema, insertProgressSchema } from '@/shared/schema'
import { z } from 'zod'

// Health check endpoint
export async function handleHealthCheck(request: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Universal One School API',
    version: '8.0.0'
  })
}

// User routes
export async function handleGetUser(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const targetUser = await storage.getUserById(params.id)
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove sensitive data
    const { password, ...safeUser } = targetUser
    return NextResponse.json(safeUser)

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function handleUpdateUser(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Only allow users to update their own profile or admins to update any
    if (user.userId !== params.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = insertUserSchema.partial().parse(body)

    const updatedUser = await storage.updateUser(params.id, validatedData)
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { password, ...safeUser } = updatedUser
    return NextResponse.json(safeUser)

  } catch (error) {
    console.error('Update user error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Course routes
export async function handleCreateCourse(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || !['teacher', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Teacher or admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = insertCourseSchema.parse(body)

    const course = await storage.createCourse({
      ...validatedData,
      teacherId: user.userId
    })

    logAuditEvent({
      userId: user.userId,
      action: 'course_created',
      resource: 'course',
      ip: getClientIP(request),
      userAgent: request.headers.get('user-agent') || '',
      success: true,
      details: { courseId: course.id, title: course.title }
    })

    return NextResponse.json(course)

  } catch (error) {
    console.error('Create course error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function handleGetCourses(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const url = new URL(request.url)
    const schoolId = url.searchParams.get('schoolId')
    const teacherId = url.searchParams.get('teacherId')

    let courses
    if (schoolId) {
      courses = await storage.getCoursesBySchool(schoolId)
    } else if (teacherId) {
      courses = await storage.getCoursesByTeacher(teacherId)
    } else if (user.role === 'teacher') {
      courses = await storage.getCoursesByTeacher(user.userId)
    } else {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    return NextResponse.json(courses)

  } catch (error) {
    console.error('Get courses error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Assignment routes
export async function handleCreateAssignment(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || !['teacher', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Teacher or admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = insertAssignmentSchema.parse(body)

    const assignment = await storage.createAssignment(validatedData)

    logAuditEvent({
      userId: user.userId,
      action: 'assignment_created',
      resource: 'assignment',
      ip: getClientIP(request),
      userAgent: request.headers.get('user-agent') || '',
      success: true,
      details: { assignmentId: assignment.id, title: assignment.title }
    })

    return NextResponse.json(assignment)

  } catch (error) {
    console.error('Create assignment error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function handleGetAssignments(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const url = new URL(request.url)
    const courseId = url.searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID required' }, { status: 400 })
    }

    const assignments = await storage.getAssignmentsByCourse(courseId)
    return NextResponse.json(assignments)

  } catch (error) {
    console.error('Get assignments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Submission routes
export async function handleCreateSubmission(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Student access required' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = insertSubmissionSchema.parse(body)

    const submission = await storage.createSubmission({
      ...validatedData,
      studentId: user.userId,
      submittedAt: new Date()
    })

    logAuditEvent({
      userId: user.userId,
      action: 'submission_created',
      resource: 'submission',
      ip: getClientIP(request),
      userAgent: request.headers.get('user-agent') || '',
      success: true,
      details: { submissionId: submission.id, assignmentId: submission.assignmentId }
    })

    return NextResponse.json(submission)

  } catch (error) {
    console.error('Create submission error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function handleGetSubmissions(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const url = new URL(request.url)
    const assignmentId = url.searchParams.get('assignmentId')
    const studentId = url.searchParams.get('studentId')

    let submissions
    if (assignmentId && (user.role === 'teacher' || user.role === 'admin')) {
      submissions = await storage.getSubmissionsByAssignment(assignmentId)
    } else if (studentId === user.userId || user.role === 'student') {
      submissions = await storage.getSubmissionsByStudent(user.userId)
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(submissions)

  } catch (error) {
    console.error('Get submissions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Progress routes
export async function handleCreateProgress(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = insertProgressSchema.parse(body)

    const progressData = await storage.createProgress({
      ...validatedData,
      userId: user.userId,
      lastAccessed: new Date()
    })

    return NextResponse.json(progressData)

  } catch (error) {
    console.error('Create progress error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function handleGetProgress(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const courseId = url.searchParams.get('courseId')

    let progressData
    if (userId && (user.userId === userId || ['teacher', 'admin'].includes(user.role))) {
      progressData = await storage.getProgressByUser(userId)
    } else if (courseId && ['teacher', 'admin'].includes(user.role)) {
      progressData = await storage.getProgressByCourse(courseId)
    } else {
      progressData = await storage.getProgressByUser(user.userId)
    }

    return NextResponse.json(progressData)

  } catch (error) {
    console.error('Get progress error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}