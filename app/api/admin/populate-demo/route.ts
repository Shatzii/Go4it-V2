import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { populateDemoUsers } from '@/scripts/populate-demo-users'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const result = await populateDemoUsers()
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Demo population error:', error)
    return NextResponse.json(
      { error: 'Failed to populate demo users' },
      { status: 500 }
    )
  }
}