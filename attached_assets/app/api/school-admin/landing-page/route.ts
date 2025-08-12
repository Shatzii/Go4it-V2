
import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/shared/auth/UnifiedAuth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const payload = authService.verifyAccessToken(token)
    
    if (!payload || payload.role !== 'school_admin') {
      return NextResponse.json({ error: 'School admin access required' }, { status: 403 })
    }

    // Get school-specific landing page content
    const schoolId = payload.schoolAccess[0] // First school in access list
    
    // Mock data - replace with actual database query
    const landingPageContent = {
      schoolId,
      heroTitle: `Welcome to ${getSchoolName(schoolId)}`,
      heroSubtitle: 'Excellence in Education',
      featuredPrograms: [],
      announcements: [],
      contactInfo: {}
    }

    return NextResponse.json({ success: true, content: landingPageContent })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch landing page content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const payload = authService.verifyAccessToken(token)
    
    if (!payload || payload.role !== 'school_admin') {
      return NextResponse.json({ error: 'School admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { content } = body

    const schoolId = payload.schoolAccess[0]
    
    // TODO: Save to database
    console.log(`Updating landing page for school: ${schoolId}`, content)

    return NextResponse.json({ success: true, message: 'Landing page updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update landing page' }, { status: 500 })
  }
}

function getSchoolName(schoolId: string): string {
  const schoolNames = {
    'superhero_school': 'SuperHero School',
    'stage_prep_school': 'Stage Prep School', 
    'lawyer_makers': 'The Lawyer Makers',
    'global_language_academy': 'Global Language Academy'
  }
  return schoolNames[schoolId] || 'School'
}
