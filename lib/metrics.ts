// Enterprise Metrics Module
// Production-ready metrics collection and monitoring

import { createClient } from '@supabase/supabase-js';

// Enterprise metrics configuration
const config = {
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  enableMetrics: process.env.ENABLE_METRICS !== 'false',
  metricsRetention: process.env.METRICS_RETENTION_DAYS || '90',
  batchSize: parseInt(process.env.METRICS_BATCH_SIZE || '100'),
  flushInterval: parseInt(process.env.METRICS_FLUSH_INTERVAL || '30000'), // 30 seconds
};

interface MetricData {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
}

interface CounterMetric {
  name: string;
  count: number;
  lastUpdated: Date;
  tags: Record<string, string>;
}

interface GaugeMetric {
  name: string;
  value: number;
  lastUpdated: Date;
  tags: Record<string, string>;
}

interface HistogramMetric {
  name: string;
  values: number[];
  count: number;
  sum: number;
  min: number;
  max: number;
  lastUpdated: Date;
  tags: Record<string, string>;
}

export class EnterpriseMetrics {
  private supabase: any;
  private counters: Map<string, CounterMetric> = new Map();
  private gauges: Map<string, GaugeMetric> = new Map();
  private histograms: Map<string, HistogramMetric> = new Map();
  private pendingMetrics: MetricData[] = [];
  private flushTimer?: NodeJS.Timeout;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeMetrics();
  }

  private async initializeMetrics(): Promise<void> {
    try {
      if (!config.enableMetrics) {
        console.log('Metrics collection disabled');
        return;
      }

      this.supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

      // Start periodic flush
      this.flushTimer = setInterval(() => {
        this.flushMetrics();
      }, config.flushInterval);

      this.isInitialized = true;
      console.log('Enterprise Metrics initialized successfully');

    } catch (error) {
      console.error('Failed to initialize Enterprise Metrics:', error);
    }
  }

  // Record a counter metric
  counter(name: string, value: number = 1, tags?: Record<string, string>): void {
    if (!this.isInitialized) return;

    const key = this.getMetricKey(name, tags);
    const existing = this.counters.get(key);

    if (existing) {
      existing.count += value;
      existing.lastUpdated = new Date();
    } else {
      this.counters.set(key, {
        name,
        count: value,
        lastUpdated: new Date(),
        tags: tags || {},
      });
    }

    this.addPendingMetric({
      name: `${name}_counter`,
      value,
      timestamp: new Date(),
      tags,
      metadata: { type: 'counter' },
    });
  }

  // Record a gauge metric
  gauge(name: string, value: number, tags?: Record<string, string>): void {
    if (!this.isInitialized) return;

    const key = this.getMetricKey(name, tags);

    this.gauges.set(key, {
      name,
      value,
      lastUpdated: new Date(),
      tags: tags || {},
    });

    this.addPendingMetric({
      name: `${name}_gauge`,
      value,
      timestamp: new Date(),
      tags,
      metadata: { type: 'gauge' },
    });
  }

  // Record a histogram metric
  histogram(name: string, value: number, tags?: Record<string, string>): void {
    if (!this.isInitialized) return;

    const key = this.getMetricKey(name, tags);
    const existing = this.histograms.get(key);

    if (existing) {
      existing.values.push(value);
      existing.count++;
      existing.sum += value;
      existing.min = Math.min(existing.min, value);
      existing.max = Math.max(existing.max, value);
      existing.lastUpdated = new Date();
    } else {
      this.histograms.set(key, {
        name,
        values: [value],
        count: 1,
        sum: value,
        min: value,
        max: value,
        lastUpdated: new Date(),
        tags: tags || {},
      });
    }

    this.addPendingMetric({
      name: `${name}_histogram`,
      value,
      timestamp: new Date(),
      tags,
      metadata: { type: 'histogram' },
    });
  }

  // Record a timing metric
  timing(name: string, duration: number, tags?: Record<string, string>): void {
    if (!this.isInitialized) return;

    this.histogram(`${name}_duration`, duration, tags);
  }

  // Record a success/failure metric
  record(name: string, success: boolean, tags?: Record<string, string>): void {
    if (!this.isInitialized) return;

    const statusTags = { ...tags, status: success ? 'success' : 'failure' };
    this.counter(`${name}_total`, 1, statusTags);

    if (!success) {
      this.counter(`${name}_failure`, 1, tags);
    }
  }

  // Get metrics data
  getMetrics(): any {
    if (!this.isInitialized) return {};

    return {
      counters: Array.from(this.counters.values()),
      gauges: Array.from(this.gauges.values()),
      histograms: Array.from(this.histograms.values()),
      pendingCount: this.pendingMetrics.length,
    };
  }

  // Get specific metric
  getMetric(name: string, tags?: Record<string, string>): any {
    if (!this.isInitialized) return null;

    const key = this.getMetricKey(name, tags);

    return (
      this.counters.get(key) ||
      this.gauges.get(key) ||
      this.histograms.get(key) ||
      null
    );
  }

  // Get metrics summary with time range
  async getMetricsSummary(timeRange?: { start: Date; end: Date }): Promise<any> {
    if (!this.isInitialized) return {};

    try {
      let query = this.supabase
        .from('metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1000);

      if (timeRange) {
        query = query
          .gte('timestamp', timeRange.start.toISOString())
          .lte('timestamp', timeRange.end.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch metrics summary:', error);
        return {};
      }

      const summary = {
        counters: {},
        gauges: {},
        histograms: {},
        totalMetrics: data?.length || 0,
      };

      data?.forEach((metric: any) => {
        const name = metric.name;
        const value = metric.value;

        if (name.includes('_counter')) {
          const baseName = name.replace('_counter', '');
          if (!summary.counters[baseName]) {
            summary.counters[baseName] = { count: 0, values: [] };
          }
          summary.counters[baseName].count += value;
          summary.counters[baseName].values.push(value);
        } else if (name.includes('_gauge')) {
          const baseName = name.replace('_gauge', '');
          if (!summary.gauges[baseName]) {
            summary.gauges[baseName] = { current: value, history: [] };
          }
          summary.gauges[baseName].current = value;
          summary.gauges[baseName].history.push(value);
        } else if (name.includes('_histogram')) {
          const baseName = name.replace('_histogram', '');
          if (!summary.histograms[baseName]) {
            summary.histograms[baseName] = { values: [] };
          }
          summary.histograms[baseName].values.push(value);
        }
      });

      // Calculate statistics for histograms
      Object.keys(summary.histograms).forEach(key => {
        const values = summary.histograms[key].values;
        if (values.length > 0) {
          summary.histograms[key].count = values.length;
          summary.histograms[key].sum = values.reduce((a, b) => a + b, 0);
          summary.histograms[key].avg = summary.histograms[key].sum / values.length;
          summary.histograms[key].min = Math.min(...values);
          summary.histograms[key].max = Math.max(...values);
        }
      });

      return summary;

    } catch (error) {
      console.error('Error fetching metrics summary:', error);
      return {};
    }
  }

  // Clean up old metrics
  async cleanupOldMetrics(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(config.metricsRetention));

      const { error } = await this.supabase
        .from('metrics')
        .delete()
        .lt('timestamp', cutoffDate.toISOString());

      if (error) {
        console.error('Failed to cleanup old metrics:', error);
      } else {
        console.log(`Cleaned up metrics older than ${config.metricsRetention} days`);
      }

    } catch (error) {
      console.error('Error cleaning up old metrics:', error);
    }
  }

  // Shutdown gracefully
  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    // Final flush
    await this.flushMetrics();

    console.log('Enterprise Metrics shut down gracefully');
  }

  // Add metric to pending queue
  private addPendingMetric(metric: MetricData): void {
    this.pendingMetrics.push(metric);

    if (this.pendingMetrics.length >= config.batchSize) {
      this.flushMetrics();
    }
  }

  // Flush pending metrics to database
  private async flushMetrics(): Promise<void> {
    if (!this.isInitialized || this.pendingMetrics.length === 0) return;

    try {
      const metricsToFlush = [...this.pendingMetrics];
      this.pendingMetrics = [];

      const metricsRecords = metricsToFlush.map(metric => ({
        name: metric.name,
        value: metric.value,
        timestamp: metric.timestamp.toISOString(),
        tags: metric.tags || {},
        metadata: metric.metadata || {},
      }));

      const { error } = await this.supabase
        .from('metrics')
        .insert(metricsRecords);

      if (error) {
        console.error('Failed to flush metrics:', error);
        // Re-queue failed metrics
        this.pendingMetrics.unshift(...metricsToFlush);
      } else {
        console.log(`Flushed ${metricsToFlush.length} metrics to database`);
      }

    } catch (error) {
      console.error('Error flushing metrics:', error);
    }
  }

  // Generate metric key
  private getMetricKey(name: string, tags?: Record<string, string>): string {
    if (!tags || Object.keys(tags).length === 0) {
      return name;
    }

    const sortedTags = Object.keys(tags)
      .sort()
      .map(key => `${key}=${tags[key]}`)
      .join(',');

    return `${name}{${sortedTags}}`;
  }
}

// Export singleton instance
export const metrics = new EnterpriseMetrics();

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await metrics.shutdown();
});

process.on('SIGTERM', async () => {
  await metrics.shutdown();
});

export default metrics;
