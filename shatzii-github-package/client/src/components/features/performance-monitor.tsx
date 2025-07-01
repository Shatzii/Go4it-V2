import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Clock, Database } from "lucide-react";

interface PerformanceMetrics {
  loadTime: number;
  ttfb: number;
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  memoryUsage: number;
  score: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        calculateMetrics(entries);
      });

      observer.observe({ entryTypes: ['navigation', 'paint'] });

      // Monitor memory usage if available
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => prev ? { ...prev, memoryUsage: memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100 } : null);
      }

      return () => observer.disconnect();
    } catch (error) {
      console.debug('Performance monitoring not available');
    }
  }, []);

  const calculateMetrics = (entries: PerformanceEntry[]) => {
    const navigationEntry = entries.find(entry => entry.entryType === 'navigation') as PerformanceNavigationTiming;
    const paintEntries = entries.filter(entry => entry.entryType === 'paint');
    const lcpEntry = entries.find(entry => entry.entryType === 'largest-contentful-paint') as any;

    if (navigationEntry) {
      const loadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      const lcp = lcpEntry?.startTime || 0;

      const newMetrics: PerformanceMetrics = {
        loadTime: Math.round(loadTime),
        ttfb: Math.round(ttfb),
        fcp: Math.round(fcp),
        lcp: Math.round(lcp),
        cls: 0, // Would need to implement CLS measurement
        fid: 0, // Would need to implement FID measurement
        memoryUsage: 0,
        score: calculateScore(loadTime, ttfb, fcp, lcp)
      };

      setMetrics(newMetrics);
    }
  };

  const calculateScore = (loadTime: number, ttfb: number, fcp: number, lcp: number): number => {
    let score = 100;
    
    if (loadTime > 3000) score -= 20;
    if (ttfb > 600) score -= 15;
    if (fcp > 1800) score -= 15;
    if (lcp > 2500) score -= 20;
    
    return Math.max(0, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: "Excellent", variant: "default" as const };
    if (score >= 70) return { text: "Good", variant: "secondary" as const };
    return { text: "Needs Work", variant: "destructive" as const };
  };

  if (!metrics || !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm border border-cyan-500/20 text-cyan-400 p-2 rounded-lg hover:bg-slate-700/90 transition-colors z-50"
        title="Show Performance Metrics"
      >
        <Activity className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-slate-900/95 backdrop-blur-xl border-cyan-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-cyan-400 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Performance
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${getScoreColor(metrics.score)}`}>
                {metrics.score}
              </span>
              <Badge variant={getScoreBadge(metrics.score).variant} className="text-xs">
                {getScoreBadge(metrics.score).text}
              </Badge>
              <button
                onClick={() => setIsVisible(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ×
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="h-3 w-3" />
                Load Time
              </div>
              <div className="text-slate-200 font-mono">
                {(metrics.loadTime / 1000).toFixed(2)}s
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-slate-400">
                <Zap className="h-3 w-3" />
                TTFB
              </div>
              <div className="text-slate-200 font-mono">
                {metrics.ttfb}ms
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-slate-400">
                <Activity className="h-3 w-3" />
                FCP
              </div>
              <div className="text-slate-200 font-mono">
                {(metrics.fcp / 1000).toFixed(2)}s
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-slate-400">
                <Database className="h-3 w-3" />
                LCP
              </div>
              <div className="text-slate-200 font-mono">
                {(metrics.lcp / 1000).toFixed(2)}s
              </div>
            </div>
          </div>
          
          {metrics.memoryUsage > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Memory Usage</span>
                <span className="text-slate-200">{metrics.memoryUsage.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.memoryUsage} className="h-1" />
            </div>
          )}
          
          <div className="text-xs text-slate-400 border-t border-slate-700 pt-2">
            Real-time performance monitoring
          </div>
        </CardContent>
      </Card>
    </div>
  );
}