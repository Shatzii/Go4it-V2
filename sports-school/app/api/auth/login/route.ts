import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth'
import { db } from '@/lib/database'
import { logAuditEvent, getClientIP } from '@/lib/security'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = loginSchema.parse(body)
    
    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''

    // Find user by email
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email)
    })

    if (!user) {
      logAuditEvent({
        action: 'login_failed',
        resource: 'auth',
        ip,
        userAgent,
        success: false,
        details: { email, reason: 'user_not_found' }
      })
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    
    if (!isValidPassword) {
      logAuditEvent({
        userId: user.id,
        action: 'login_failed',
        resource: 'auth',
        ip,
        userAgent,
        success: false,
        details: { email, reason: 'invalid_password' }
      })
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId
    })

    // Log successful login
    logAuditEvent({
      userId: user.id,
      action: 'login_success',
      resource: 'auth',
      ip,
      userAgent,
      success: true,
      details: { email, role: user.role }
    })

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
      path: '/'
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        profile: user.profile
      }
    })

    // Set auth cookie
    response.cookies.set('auth-token', token, cookieOptions)

    return response

  } catch (error) {
    console.error('Login error:', error)
    
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