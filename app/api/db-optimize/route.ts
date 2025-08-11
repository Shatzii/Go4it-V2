import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { recommendedIndexes, DatabasePerformanceMonitor } from '@/lib/database-optimizations';

// Database optimization API endpoint
export async function POST(req: NextRequest) {
  try {
    const { action, queryId } = await req.json();
    
    switch (action) {
      case 'create_indexes':
        return await createIndexes();
      case 'update_gar_scores':
        return await updateGARScores();
      case 'performance_stats':
        return await getPerformanceStats();
      case 'slow_queries':
        return await getSlowQueries();
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Database optimization error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function createIndexes() {
  const results = [];
  
  for (const index of recommendedIndexes) {
    try {
      const startTime = performance.now();
      await db.execute(index.query);
      const endTime = performance.now();
      
      results.push({
        description: index.description,
        performance: index.performance,
        status: 'created',
        duration: endTime - startTime
      });
    } catch (error) {
      results.push({
        description: index.description,
        status: 'error',
        error: error.message
      });
    }
  }
  
  return NextResponse.json({ results });
}

async function updateGARScores() {
  try {
    const startTime = performance.now();
    
    await db.execute(`
      WITH latest_analysis AS (
        SELECT 
          user_id,
          AVG(gar_score) as avg_gar_score,
          MAX(created_at) as last_analysis
        FROM video_analysis 
        WHERE created_at >= NOW() - INTERVAL '30 days'
          AND gar_score IS NOT NULL
        GROUP BY user_id
      )
      UPDATE users 
      SET 
        gar_score = latest_analysis.avg_gar_score,
        last_gar_analysis = latest_analysis.last_analysis
      FROM latest_analysis
      WHERE users.id = latest_analysis.user_id
    `);
    
    const endTime = performance.now();
    
    return NextResponse.json({
      success: true,
      duration: endTime - startTime,
      message: 'GAR scores updated successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

async function getPerformanceStats() {
  return NextResponse.json({
    slowQueries: DatabasePerformanceMonitor.getSlowQueries(),
    queryStats: {
      // Add basic query stats here
    }
  });
}

async function getSlowQueries() {
  const slowQueries = DatabasePerformanceMonitor.getSlowQueries(1000);
  return NextResponse.json({ slowQueries });
}

export async function GET(req: NextRequest) {
  try {
    // Return database health check
    const startTime = performance.now();
    await db.execute('SELECT 1');
    const endTime = performance.now();
    
    return NextResponse.json({
      status: 'healthy',
      responseTime: endTime - startTime,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error.message
    }, { status: 500 });
  }
}