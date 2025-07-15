import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { createRealTimeAnalyzer } from '@/lib/real-time-analysis';
import { createMultiAngleSynchronizer } from '@/lib/multi-angle-sync';

// Real-time video analysis endpoint
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, sport, quality, cameraConfig } = await request.json();

    switch (action) {
      case 'start':
        return await startRealTimeAnalysis(sport, quality, user.id);
      case 'stop':
        return await stopRealTimeAnalysis(user.id);
      case 'status':
        return await getRealTimeStatus(user.id);
      case 'setup_multi_angle':
        return await setupMultiAngle(cameraConfig, sport, user.id);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Real-time analysis error:', error);
    return NextResponse.json(
      { error: 'Real-time analysis failed' },
      { status: 500 }
    );
  }
}

// WebSocket endpoint for real-time streaming
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // This would typically establish a WebSocket connection
    // For now, return configuration for client-side WebSocket
    const config = {
      websocket_url: `ws://localhost:5000/ws/analysis/${user.id}`,
      supported_formats: ['webm', 'mp4', 'mov'],
      max_resolution: '4K',
      max_fps: 60,
      buffer_size: 10
    };

    return NextResponse.json({
      success: true,
      config,
      message: 'Real-time analysis WebSocket configuration'
    });
  } catch (error) {
    console.error('WebSocket setup error:', error);
    return NextResponse.json(
      { error: 'WebSocket setup failed' },
      { status: 500 }
    );
  }
}

async function startRealTimeAnalysis(sport: string, quality: string, userId: number) {
  // Create real-time analyzer
  const analyzer = createRealTimeAnalyzer(sport, quality as any);
  
  // Store analyzer instance (in production, use proper session management)
  globalThis.realTimeAnalyzers = globalThis.realTimeAnalyzers || new Map();
  globalThis.realTimeAnalyzers.set(userId, analyzer);
  
  // Start analysis
  await analyzer.startRealTimeAnalysis();
  
  return NextResponse.json({
    success: true,
    message: 'Real-time analysis started',
    config: {
      sport,
      quality,
      fps: quality === 'performance' ? 60 : quality === 'balanced' ? 30 : 24,
      latency_target: quality === 'performance' ? 50 : quality === 'balanced' ? 100 : 200
    }
  });
}

async function stopRealTimeAnalysis(userId: number) {
  const analyzer = globalThis.realTimeAnalyzers?.get(userId);
  if (!analyzer) {
    return NextResponse.json({ error: 'No active analysis session' }, { status: 404 });
  }
  
  await analyzer.stopRealTimeAnalysis();
  globalThis.realTimeAnalyzers.delete(userId);
  
  return NextResponse.json({
    success: true,
    message: 'Real-time analysis stopped'
  });
}

async function getRealTimeStatus(userId: number) {
  const analyzer = globalThis.realTimeAnalyzers?.get(userId);
  if (!analyzer) {
    return NextResponse.json({
      active: false,
      message: 'No active analysis session'
    });
  }
  
  const metrics = analyzer.getMetrics();
  const currentAnalysis = analyzer.getCurrentAnalysis();
  
  return NextResponse.json({
    active: true,
    metrics,
    current_analysis: currentAnalysis,
    is_analyzing: analyzer.isAnalyzing()
  });
}

async function setupMultiAngle(cameraConfig: any, sport: string, userId: number) {
  // Create multi-angle synchronizer
  const synchronizer = createMultiAngleSynchronizer(sport);
  
  // Add cameras from configuration
  for (const camera of cameraConfig.cameras) {
    await synchronizer.addCamera(camera);
  }
  
  // Store synchronizer instance
  globalThis.multiAngleSynchronizers = globalThis.multiAngleSynchronizers || new Map();
  globalThis.multiAngleSynchronizers.set(userId, synchronizer);
  
  // Start synchronization
  await synchronizer.startSynchronization();
  
  return NextResponse.json({
    success: true,
    message: 'Multi-angle synchronization started',
    cameras: cameraConfig.cameras.length,
    sync_tolerance: 50
  });
}