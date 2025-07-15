import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword, generateToken } from '@/lib/auth'
import { db } from '@/lib/database'
import { logAuditEvent, getClientIP, validatePasswordStrength } from '@/lib/security'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  role: z.enum(['student', 'teacher', 'parent', 'admin']),
  schoolId: z.string().optional(),
  grade: z.string().optional(),
  parentEmail: z.string().email().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)
    
    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''

    // Validate password strength
    const passwordValidation = validatePasswordStrength(validatedData.password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Password does not meet security requirements', details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, validatedData.email)
    })

    if (existingUser) {
      logAuditEvent({
        action: 'registration_failed',
        resource: 'auth',
        ip,
        userAgent,
        success: false,
        details: { email: validatedData.email, reason: 'user_exists' }
      })
      
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user
    const newUser = await db.insert(users).values({
      id: crypto.randomUUID(),
      email: validatedData.email,
      password: hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      role: validatedData.role,
      schoolId: validatedData.schoolId,
      profile: {
        grade: validatedData.grade,
        parentEmail: validatedData.parentEmail
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning()

    // Generate JWT token
    const token = generateToken({
      id: newUser[0].id,
      email: newUser[0].email,
      role: newUser[0].role,
      schoolId: newUser[0].schoolId
    })

    // Log successful registration
    logAuditEvent({
      userId: newUser[0].id,
      action: 'registration_success',
      resource: 'auth',
      ip,
      userAgent,
      success: true,
      details: { email: validatedData.email, role: validatedData.role }
    })

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 24 * 60 * 60, // 1 day
      path: '/'
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        role: newUser[0].role,
        schoolId: newUser[0].schoolId,
        profile: newUser[0].profile
      }
    })

    // Set auth cookie
    response.cookies.set('auth-token', token, cookieOptions)

    return response

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}