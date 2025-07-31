import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { populateRealUsers } from '@/scripts/populate-demo-users'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const result = await populateRealUsers()
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Demo population error:', error)
    return NextResponse.json(
      { error: 'Failed to create real users' },
      { status: 500 }
    )
  }
}