'use client';

import { memo, useMemo, useCallback, Suspense, lazy } from 'react';
import { Optimizers } from '@/lib/performance-optimizer';

// Lazy load heavy components (fallback to simple divs if components don't exist)
const AICoachDashboard = lazy(() =>
  import('../ai-coach/AICoachDashboard').catch(() => ({
    default: () => <div className="p-4 text-white">AI Coach Dashboard</div>,
  })),
);
const VideoAnalysis = lazy(() =>
  import('../video/VideoAnalysis').catch(() => ({
    default: () => <div className="p-4 text-white">Video Analysis</div>,
  })),
);
const PerformanceCharts = lazy(() =>
  import('../analytics/PerformanceCharts').catch(() => ({
    default: () => <div className="p-4 text-white">Performance Charts</div>,
  })),
);

// Loading fallback component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

// Optimized data processing hook
function useOptimizedData<T>(data: T[], dependencies: any[] = []) {
  return useMemo(() => {
    if (!data || data.length === 0) return [];

    // Apply performance optimizations
    return Optimizers.API.optimizeResponse(data);
  }, [data, ...dependencies]);
}

// Optimized component wrapper
export function withPerformanceOptimization<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
) {
  const OptimizedComponent = memo((props: P) => {
    return Optimizers.Memory.trackMemoryUsage(componentName, () => <Component {...props} />);
  });

  OptimizedComponent.displayName = `Optimized(${componentName})`;
  return OptimizedComponent;
}

// Main optimized component
interface OptimizedComponentProps {
  data?: any[];
  feature: 'academy' | 'ai-coach' | 'video-analysis' | 'performance';
  userId?: number;
}

export const OptimizedComponent = memo(function OptimizedComponent({
  data = [],
  feature,
  userId,
}: OptimizedComponentProps) {
  // Optimize data processing
  const optimizedData = useOptimizedData(data, [feature, userId]);

  // Memoized render functions
  const renderFeature = useCallback(() => {
    switch (feature) {
      case 'ai-coach':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AICoachDashboard data={optimizedData} />
          </Suspense>
        );

      case 'video-analysis':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <VideoAnalysis data={optimizedData} />
          </Suspense>
        );

      case 'performance':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <PerformanceCharts data={optimizedData} />
          </Suspense>
        );

      case 'academy':
      default:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Academy Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {optimizedData.map((item: any, index: number) => (
                <div key={item.id || index} className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
    }
  }, [feature, optimizedData]);

  return <div className="optimized-component">{renderFeature()}</div>;
});

// Performance monitoring component
export function PerformanceMonitor() {
  const performanceStats = useMemo(() => {
    return Optimizers.Performance.getMetrics();
  }, []);

  const memoryStats = useMemo(() => {
    return Optimizers.Memory.getMemoryStats();
  }, []);

  return (
    <div className="performance-monitor bg-slate-900 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 p-3 rounded">
          <h4 className="font-medium text-white">Response Times</h4>
          <p className="text-sm text-slate-300">
            Average: {performanceStats.averageResponseTime}ms
          </p>
        </div>

        <div className="bg-slate-800 p-3 rounded">
          <h4 className="font-medium text-white">Memory Usage</h4>
          <p className="text-sm text-slate-300">Heap: {memoryStats.heapUsed}</p>
        </div>
      </div>

      {performanceStats.slowestEndpoints.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-white mb-2">Slowest Endpoints</h4>
          <div className="space-y-1">
            {performanceStats.slowestEndpoints.map((endpoint, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-slate-300">{endpoint.endpoint}</span>
                <span className="text-red-400">{endpoint.duration}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Optimized data fetching hook
export function useOptimizedFetch<T>(url: string, options?: RequestInit) {
  return useMemo(() => {
    const cacheKey = `fetch_${url}_${JSON.stringify(options)}`;

    return Optimizers.Database.cachedQuery(cacheKey, async () => {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json() as Promise<T>;
    });
  }, [url, options]);
}

export default OptimizedComponent;
