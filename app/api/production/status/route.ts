import { NextRequest, NextResponse } from 'next/server';
import { productionConfig } from '@/lib/production-config';
import { rateLimit } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = rateLimit(clientIp, 60, 60000); // 60 requests per minute
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '60',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
          }
        }
      );
    }

    // Production status information
    const statusData = {
      production: {
        environment: productionConfig.isProduction ? 'production' : 'development',
        ready: productionConfig.isProduction,
        buildOptimized: productionConfig.performance.compression,
        securityEnabled: productionConfig.isProduction,
        cacheEnabled: productionConfig.isProduction,
        monitoringEnabled: productionConfig.monitoring.enablePerformanceMonitoring
      },
      features: {
        wellnessHub: {
          enabled: true,
          modules: ['mental-health', 'nutrition', 'health-tracking', 'crisis-support']
        },
        performanceAnalytics: {
          enabled: true,
          modules: ['gar-integration', 'training-load', 'skill-progression', 'competitive-analysis']
        },
        security: {
          rateLimiting: productionConfig.isProduction,
          cors: productionConfig.isProduction,
          headers: productionConfig.isProduction,
          authentication: true
        },
        payments: {
          stripe: !!productionConfig.api.stripeSecretKey,
          subscriptions: true,
          oneTimePayments: true
        },
        ai: {
          openai: !!productionConfig.api.openaiApiKey,
          anthropic: !!productionConfig.api.anthropicApiKey,
          garAnalysis: true,
          coaching: true
        }
      },
      infrastructure: {
        database: !!process.env.DATABASE_URL,
        redis: !!process.env.REDIS_URL,
        storage: productionConfig.storage.provider,
        email: !!productionConfig.email.smtp.auth.user,
        monitoring: !!productionConfig.monitoring.sentryDsn
      },
      performance: {
        compression: productionConfig.performance.compression,
        imageOptimization: productionConfig.performance.optimizeImages,
        bundleOptimization: true,
        caching: productionConfig.isProduction,
        cdn: !!productionConfig.urls.cdnUrl
      },
      deployment: {
        standalone: true,
        systemdService: 'available',
        healthChecks: true,
        logging: true,
        backups: 'configured'
      }
    };

    return NextResponse.json(statusData, {
      headers: {
        'X-RateLimit-Limit': '60',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
      }
    });

  } catch (error) {
    console.error('Production status check failed:', error);
    
    return NextResponse.json({
      error: 'Status check failed',
      production: {
        environment: process.env.NODE_ENV,
        ready: false
      }
    }, { status: 500 });
  }
}