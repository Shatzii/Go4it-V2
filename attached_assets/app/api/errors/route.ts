import { NextRequest, NextResponse } from 'next/server'
import { ErrorLogSchema } from '@/lib/error-tracking'
import { z } from 'zod'

// In a real application, you would store these in a database
let errorLogs: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const severity = searchParams.get('severity')
    const category = searchParams.get('category')
    const resolved = searchParams.get('resolved')
    
    let filteredLogs = errorLogs

    if (severity) {
      filteredLogs = filteredLogs.filter(log => log.severity === severity)
    }
    
    if (category) {
      filteredLogs = filteredLogs.filter(log => log.category === category)
    }
    
    if (resolved !== null) {
      filteredLogs = filteredLogs.filter(log => log.resolved === (resolved === 'true'))
    }

    return NextResponse.json({
      success: true,
      data: filteredLogs,
      total: filteredLogs.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch error logs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the error log
    const errorLog = ErrorLogSchema.parse({
      ...body,
      timestamp: new Date(body.timestamp),
      id: body.id || `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    })

    errorLogs.push(errorLog)
    
    // Keep only last 10000 errors to prevent memory issues
    if (errorLogs.length > 10000) {
      errorLogs = errorLogs.slice(-10000)
    }

    return NextResponse.json({
      success: true,
      data: errorLog
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to log error' },
      { status: 400 }
    )
  }
}