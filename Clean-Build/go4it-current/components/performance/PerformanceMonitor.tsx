'use client';

import { useEffect, useState } from 'react';
import { Activity, Zap, Clock, AlertTriangle } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage: number;
  networkLatency: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const measurePerformance = () => {
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      const memory = (performance as any).memory;

      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      const renderTime =
        navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      const interactionTime = navigation.domInteractive - navigation.domLoading;
      const memoryUsage = memory ? memory.usedJSHeapSize / (1024 * 1024) : 0;
      const networkLatency = navigation.responseStart - navigation.requestStart;

      setMetrics({
        loadTime,
        renderTime,
        interactionTime,
        memoryUsage,
        networkLatency,
      });
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Show monitor on Ctrl+Shift+P
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('load', measurePerformance);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  if (!isVisible || !metrics) return null;

  const getMetricColor = (value: number, type: string) => {
    switch (type) {
      case 'time':
        return value > 1000 ? 'text-red-400' : value > 500 ? 'text-yellow-400' : 'text-green-400';
      case 'memory':
        return value > 50 ? 'text-red-400' : value > 25 ? 'text-yellow-400' : 'text-green-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-xl max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white flex items-center">
          <Activity className="h-4 w-4 mr-2" />
          Performance Monitor
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-white text-xs"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Load Time
          </span>
          <span className={getMetricColor(metrics.loadTime, 'time')}>
            {metrics.loadTime.toFixed(0)}ms
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center">
            <Zap className="h-3 w-3 mr-1" />
            Render Time
          </span>
          <span className={getMetricColor(metrics.renderTime, 'time')}>
            {metrics.renderTime.toFixed(0)}ms
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center">
            <Activity className="h-3 w-3 mr-1" />
            Interaction
          </span>
          <span className={getMetricColor(metrics.interactionTime, 'time')}>
            {metrics.interactionTime.toFixed(0)}ms
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Memory Usage
          </span>
          <span className={getMetricColor(metrics.memoryUsage, 'memory')}>
            {metrics.memoryUsage.toFixed(1)}MB
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Network Latency</span>
          <span className={getMetricColor(metrics.networkLatency, 'time')}>
            {metrics.networkLatency.toFixed(0)}ms
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-700">
        <p className="text-xs text-slate-500">Press Ctrl+Shift+P to toggle</p>
      </div>
    </div>
  );
}
