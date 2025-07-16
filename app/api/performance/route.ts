import { NextRequest, NextResponse } from 'next/server'
import { performanceOptimizer } from '@/lib/performance-optimizer'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const sport = searchParams.get('sport')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const dateRange = startDate && endDate ? {
      start: new Date(startDate),
      end: new Date(endDate)
    } : undefined

    const { result: performanceData, duration } = await performanceOptimizer.measurePerformance(
      () => performanceOptimizer.getPerformanceMetrics(
        parseInt(userId),
        sport || undefined,
        dateRange
      ),
      'Performance Metrics Fetch'
    )

    return NextResponse.json({
      success: true,
      data: performanceData,
      metadata: {
        fetchTime: duration,
        cached: duration < 100, // If very fast, likely cached
        dataPoints: performanceData?.rawData?.length || 0
      }
    })

  } catch (error) {
    console.error('Performance API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch performance data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'clear-cache':
        const pattern = data?.pattern
        performanceOptimizer.clearCache(pattern)
        return NextResponse.json({ success: true, message: 'Cache cleared' })

      case 'preload-resources':
        await performanceOptimizer.preloadCriticalResources()
        return NextResponse.json({ success: true, message: 'Resources preloaded' })

      case 'compress-image':
        if (!data?.file) {
          return NextResponse.json({ error: 'File is required' }, { status: 400 })
        }
        // Note: This would need to be handled differently in a real API
        // as File objects can't be passed directly in JSON
        return NextResponse.json({ 
          success: true, 
          message: 'Image compression endpoint ready' 
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Performance API POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process performance request' },
      { status: 500 }
    )
  }
}