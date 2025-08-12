import { NextRequest, NextResponse } from 'next/server'
import { ErrorSeverity, ErrorCategory } from '@/lib/error-tracking'

// In a real application, you would fetch this from a database
const getErrorLogs = () => {
  // Mock data for demonstration
  return [
    {
      id: '1',
      timestamp: new Date('2024-01-15T10:00:00'),
      severity: ErrorSeverity.HIGH,
      category: ErrorCategory.DATABASE,
      message: 'Connection timeout',
      resolved: true
    },
    {
      id: '2',
      timestamp: new Date('2024-01-15T11:00:00'),
      severity: ErrorSeverity.CRITICAL,
      category: ErrorCategory.AUTHENTICATION,
      message: 'Login system failure',
      resolved: false
    },
    {
      id: '3',
      timestamp: new Date('2024-01-15T12:00:00'),
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.API,
      message: 'Slow response time',
      resolved: true
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '7d'
    
    const errorLogs = getErrorLogs()
    
    // Calculate analytics
    const total = errorLogs.length
    const resolved = errorLogs.filter(log => log.resolved).length
    const unresolved = total - resolved
    
    const bySeverity = {
      critical: errorLogs.filter(log => log.severity === ErrorSeverity.CRITICAL).length,
      high: errorLogs.filter(log => log.severity === ErrorSeverity.HIGH).length,
      medium: errorLogs.filter(log => log.severity === ErrorSeverity.MEDIUM).length,
      low: errorLogs.filter(log => log.severity === ErrorSeverity.LOW).length
    }
    
    const byCategory = Object.values(ErrorCategory).reduce((acc, category) => {
      acc[category] = errorLogs.filter(log => log.category === category).length
      return acc
    }, {} as Record<ErrorCategory, number>)
    
    // Calculate trends (mock data)
    const trends = {
      errorRate: {
        current: total,
        previous: Math.max(0, total - 2),
        change: total >= 2 ? ((total - (total - 2)) / (total - 2)) * 100 : 0
      },
      resolutionTime: {
        average: 2.5, // hours
        median: 2.0,
        fastest: 0.5,
        slowest: 8.0
      },
      topCategories: Object.entries(byCategory)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([category, count]) => ({ category, count }))
    }
    
    return NextResponse.json({
      success: true,
      data: {
        summary: {
          total,
          resolved,
          unresolved,
          resolutionRate: total > 0 ? (resolved / total) * 100 : 0
        },
        bySeverity,
        byCategory,
        trends,
        timeRange
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}