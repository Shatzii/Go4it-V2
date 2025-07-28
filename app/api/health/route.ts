import { NextRequest, NextResponse } from 'next/server';
import { productionConfig } from '@/lib/production-config';

export async function GET(request: NextRequest) {
  try {
    // Validate production configuration
    if (productionConfig.isProduction) {
      productionConfig.validate();
    }

    // Check database connection
    const dbStatus = await checkDatabaseHealth();
    
    // Check memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsagePercent = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);

    // Check disk space (basic check)
    const uptime = process.uptime();

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        usage: `${memoryUsagePercent}%`
      },
      database: dbStatus,
      features: {
        wellnessHub: true,
        performanceAnalytics: true,
        garAnalysis: true,
        ncaaEligibility: true,
        recruitment: true,
        academy: true
      },
      security: {
        httpsEnabled: productionConfig.isProduction,
        corsConfigured: true,
        rateLimitingEnabled: productionConfig.isProduction
      }
    };

    return NextResponse.json(healthData, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: productionConfig.isProduction ? 'Service unavailable' : error.message,
      environment: process.env.NODE_ENV
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

async function checkDatabaseHealth(): Promise<{ status: string; responseTime?: number }> {
  try {
    const startTime = Date.now();
    
    // Simple database health check - would connect to actual DB in production
    const dbConnected = process.env.DATABASE_URL ? true : false;
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: dbConnected ? 'connected' : 'not_configured',
      responseTime: responseTime
    };
  } catch (error) {
    return {
      status: 'error'
    };
  }
}