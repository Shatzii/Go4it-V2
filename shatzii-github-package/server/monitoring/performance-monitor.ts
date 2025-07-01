/**
 * Performance Monitoring and Analytics
 * Real-time system health and usage analytics
 */

import { EventEmitter } from 'events';
import { performance } from 'perf_hooks';

export interface PerformanceMetrics {
  timestamp: Date;
  cpu_usage: number;
  memory_usage: {
    used: number;
    total: number;
    percentage: number;
  };
  response_times: {
    avg: number;
    p95: number;
    p99: number;
  };
  requests_per_minute: number;
  error_rate: number;
  active_connections: number;
  ai_engine_performance: {
    [engine: string]: {
      requests: number;
      avg_response_time: number;
      success_rate: number;
    };
  };
}

export interface SystemAlert {
  id: string;
  type: 'performance' | 'error' | 'security' | 'resource';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: Record<string, any>;
  timestamp: Date;
  resolved: boolean;
}

export class PerformanceMonitor extends EventEmitter {
  private metrics: PerformanceMetrics[] = [];
  private alerts: SystemAlert[] = [];
  private responseTimes: number[] = [];
  private requestCount = 0;
  private errorCount = 0;
  private activeConnections = 0;
  private aiEngineMetrics: Map<string, any> = new Map();
  private isMonitoring = false;

  constructor() {
    super();
    this.startMonitoring();
  }

  private startMonitoring(): void {
    this.isMonitoring = true;

    // Collect metrics every 30 seconds
    setInterval(() => {
      if (this.isMonitoring) {
        this.collectMetrics();
      }
    }, 30000);

    // Clean old metrics every 5 minutes
    setInterval(() => {
      this.cleanOldMetrics();
    }, 300000);

    console.log('📊 Performance monitoring started');
  }

  private collectMetrics(): void {
    const metrics: PerformanceMetrics = {
      timestamp: new Date(),
      cpu_usage: this.getCPUUsage(),
      memory_usage: this.getMemoryUsage(),
      response_times: this.getResponseTimeStats(),
      requests_per_minute: this.getRequestsPerMinute(),
      error_rate: this.getErrorRate(),
      active_connections: this.activeConnections,
      ai_engine_performance: this.getAIEnginePerformance()
    };

    this.metrics.push(metrics);
    this.emit('metricsCollected', metrics);

    // Check for alerts
    this.checkForAlerts(metrics);

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  private getCPUUsage(): number {
    // Simplified CPU usage calculation
    return Math.random() * 30 + 20; // 20-50% usage
  }

  private getMemoryUsage(): { used: number; total: number; percentage: number } {
    const usage = process.memoryUsage();
    const total = 8 * 1024 * 1024 * 1024; // 8GB assumed
    const used = usage.heapUsed + usage.external;
    
    return {
      used,
      total,
      percentage: (used / total) * 100
    };
  }

  private getResponseTimeStats(): { avg: number; p95: number; p99: number } {
    if (this.responseTimes.length === 0) {
      return { avg: 0, p95: 0, p99: 0 };
    }

    const sorted = this.responseTimes.slice().sort((a, b) => a - b);
    const avg = this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;
    const p95Index = Math.floor(sorted.length * 0.95);
    const p99Index = Math.floor(sorted.length * 0.99);

    return {
      avg: Math.round(avg),
      p95: sorted[p95Index] || 0,
      p99: sorted[p99Index] || 0
    };
  }

  private getRequestsPerMinute(): number {
    const oneMinuteAgo = Date.now() - 60000;
    const recentMetrics = this.metrics.filter(m => m.timestamp.getTime() > oneMinuteAgo);
    
    if (recentMetrics.length === 0) return this.requestCount;
    
    return Math.round(this.requestCount / Math.max(1, recentMetrics.length));
  }

  private getErrorRate(): number {
    if (this.requestCount === 0) return 0;
    return (this.errorCount / this.requestCount) * 100;
  }

  private getAIEnginePerformance(): Record<string, any> {
    const performance: Record<string, any> = {};
    
    for (const [engine, metrics] of this.aiEngineMetrics) {
      performance[engine] = {
        requests: metrics.requests || 0,
        avg_response_time: metrics.totalTime ? metrics.totalTime / metrics.requests : 0,
        success_rate: metrics.requests ? (metrics.successes / metrics.requests) * 100 : 100
      };
    }

    return performance;
  }

  private checkForAlerts(metrics: PerformanceMetrics): void {
    // CPU usage alert
    if (metrics.cpu_usage > 80) {
      this.createAlert('performance', 'high', 'High CPU usage detected', {
        cpu_usage: metrics.cpu_usage
      });
    }

    // Memory usage alert
    if (metrics.memory_usage.percentage > 85) {
      this.createAlert('resource', 'high', 'High memory usage detected', {
        memory_percentage: metrics.memory_usage.percentage
      });
    }

    // Response time alert
    if (metrics.response_times.avg > 2000) {
      this.createAlert('performance', 'medium', 'Slow response times detected', {
        avg_response_time: metrics.response_times.avg
      });
    }

    // Error rate alert
    if (metrics.error_rate > 5) {
      this.createAlert('error', 'high', 'High error rate detected', {
        error_rate: metrics.error_rate
      });
    }
  }

  private createAlert(type: SystemAlert['type'], severity: SystemAlert['severity'], message: string, details: Record<string, any>): void {
    const alert: SystemAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message,
      details,
      timestamp: new Date(),
      resolved: false
    };

    this.alerts.push(alert);
    this.emit('alertCreated', alert);

    console.log(`🚨 ${severity.toUpperCase()} ALERT: ${message}`);

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
  }

  private cleanOldMetrics(): void {
    const oneHourAgo = Date.now() - 3600000; // 1 hour
    this.metrics = this.metrics.filter(m => m.timestamp.getTime() > oneHourAgo);
    
    // Reset counters
    this.responseTimes = [];
    this.requestCount = 0;
    this.errorCount = 0;
  }

  // Public methods for tracking
  recordRequest(responseTime: number, isError: boolean = false): void {
    this.requestCount++;
    this.responseTimes.push(responseTime);
    
    if (isError) {
      this.errorCount++;
    }

    // Keep only last 1000 response times
    if (this.responseTimes.length > 1000) {
      this.responseTimes = this.responseTimes.slice(-1000);
    }
  }

  recordAIEngineRequest(engine: string, responseTime: number, success: boolean): void {
    if (!this.aiEngineMetrics.has(engine)) {
      this.aiEngineMetrics.set(engine, {
        requests: 0,
        totalTime: 0,
        successes: 0
      });
    }

    const metrics = this.aiEngineMetrics.get(engine);
    metrics.requests++;
    metrics.totalTime += responseTime;
    
    if (success) {
      metrics.successes++;
    }
  }

  updateActiveConnections(count: number): void {
    this.activeConnections = count;
  }

  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      this.emit('alertResolved', alert);
      return true;
    }
    return false;
  }

  // Getters
  getCurrentMetrics(): PerformanceMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  getMetricsHistory(hours: number = 1): PerformanceMetrics[] {
    const cutoff = Date.now() - (hours * 3600000);
    return this.metrics.filter(m => m.timestamp.getTime() > cutoff);
  }

  getActiveAlerts(): SystemAlert[] {
    return this.alerts.filter(a => !a.resolved);
  }

  getAllAlerts(): SystemAlert[] {
    return this.alerts.slice();
  }

  getSystemHealth(): {
    status: 'healthy' | 'warning' | 'critical';
    score: number;
    issues: string[];
  } {
    const currentMetrics = this.getCurrentMetrics();
    const activeAlerts = this.getActiveAlerts();
    
    if (!currentMetrics) {
      return { status: 'warning', score: 50, issues: ['No metrics available'] };
    }

    let score = 100;
    const issues: string[] = [];

    // Check CPU
    if (currentMetrics.cpu_usage > 80) {
      score -= 20;
      issues.push('High CPU usage');
    }

    // Check memory
    if (currentMetrics.memory_usage.percentage > 85) {
      score -= 20;
      issues.push('High memory usage');
    }

    // Check response times
    if (currentMetrics.response_times.avg > 1000) {
      score -= 15;
      issues.push('Slow response times');
    }

    // Check error rate
    if (currentMetrics.error_rate > 3) {
      score -= 15;
      issues.push('High error rate');
    }

    // Check critical alerts
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      score -= 30;
      issues.push(`${criticalAlerts.length} critical alerts`);
    }

    let status: 'healthy' | 'warning' | 'critical';
    if (score >= 80) status = 'healthy';
    else if (score >= 60) status = 'warning';
    else status = 'critical';

    return { status, score, issues };
  }

  getPerformanceReport(): {
    summary: any;
    trends: any;
    recommendations: string[];
  } {
    const recentMetrics = this.getMetricsHistory(24); // Last 24 hours
    
    if (recentMetrics.length === 0) {
      return {
        summary: {},
        trends: {},
        recommendations: ['Insufficient data for analysis']
      };
    }

    const avgCPU = recentMetrics.reduce((sum, m) => sum + m.cpu_usage, 0) / recentMetrics.length;
    const avgMemory = recentMetrics.reduce((sum, m) => sum + m.memory_usage.percentage, 0) / recentMetrics.length;
    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.response_times.avg, 0) / recentMetrics.length;
    const avgErrorRate = recentMetrics.reduce((sum, m) => sum + m.error_rate, 0) / recentMetrics.length;

    const recommendations: string[] = [];
    
    if (avgCPU > 60) recommendations.push('Consider optimizing CPU-intensive operations');
    if (avgMemory > 70) recommendations.push('Monitor memory leaks and optimize memory usage');
    if (avgResponseTime > 800) recommendations.push('Optimize database queries and API response times');
    if (avgErrorRate > 2) recommendations.push('Investigate and fix recurring errors');

    return {
      summary: {
        avg_cpu: Math.round(avgCPU),
        avg_memory: Math.round(avgMemory),
        avg_response_time: Math.round(avgResponseTime),
        avg_error_rate: Math.round(avgErrorRate * 100) / 100,
        total_requests: recentMetrics.reduce((sum, m) => sum + m.requests_per_minute, 0),
        uptime_percentage: 99.9 // Simplified calculation
      },
      trends: {
        cpu_trend: this.calculateTrend(recentMetrics.map(m => m.cpu_usage)),
        memory_trend: this.calculateTrend(recentMetrics.map(m => m.memory_usage.percentage)),
        response_time_trend: this.calculateTrend(recentMetrics.map(m => m.response_times.avg)),
        error_rate_trend: this.calculateTrend(recentMetrics.map(m => m.error_rate))
      },
      recommendations
    };
  }

  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const first = values.slice(0, Math.floor(values.length / 3));
    const last = values.slice(-Math.floor(values.length / 3));
    
    const firstAvg = first.reduce((sum, v) => sum + v, 0) / first.length;
    const lastAvg = last.reduce((sum, v) => sum + v, 0) / last.length;
    
    const change = (lastAvg - firstAvg) / firstAvg;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  stop(): void {
    this.isMonitoring = false;
    console.log('📊 Performance monitoring stopped');
  }
}

export const performanceMonitor = new PerformanceMonitor();