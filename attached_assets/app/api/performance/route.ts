import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { checkDatabaseHealth } from '@/lib/database'
import { validateAIKey } from '@/lib/ai-integration'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const startTime = Date.now()
    
    // Check database health
    const dbHealth = await checkDatabaseHealth()
    
    // Check AI integration
    const aiHealth = await validateAIKey()
    
    // Calculate response time
    const responseTime = Date.now() - startTime
    
    // Get system metrics (simplified)
    const metrics = {
      system: {
        responseTime,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        nodeVersion: process.version,
        platform: process.platform
      },
      database: {
        healthy: dbHealth.healthy,
        error: dbHealth.error,
        connectionTime: Date.now() - startTime
      },
      ai: {
        healthy: aiHealth,
        provider: 'anthropic',
        model: 'claude-3-sonnet-20240229'
      },
      services: {
        total: 3,
        healthy: [dbHealth.healthy, aiHealth, true].filter(Boolean).length,
        degraded: 0,
        failed: [dbHealth.healthy, aiHealth, true].filter(h => !h).length
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      metrics,
      status: metrics.services.failed === 0 ? 'healthy' : 
              metrics.services.degraded > 0 ? 'degraded' : 'unhealthy'
    })

  } catch (error) {
    console.error('Performance check error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve performance metrics' },
      { status: 500 }
    )
  }
}