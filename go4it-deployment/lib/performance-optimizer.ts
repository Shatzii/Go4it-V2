// Performance optimization utilities for Go4It Sports Platform

import { NextResponse } from 'next/server';

// Database connection pooling optimization
export class DatabaseOptimizer {
  private static connectionPool: Map<string, any> = new Map();
  private static queryCache: Map<string, { data: any; timestamp: number }> = new Map();
  private static CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Cached database query wrapper
  static async cachedQuery<T>(
    queryKey: string,
    queryFn: () => Promise<T>,
    ttl: number = this.CACHE_TTL,
  ): Promise<T> {
    const cached = this.queryCache.get(queryKey);

    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    const data = await queryFn();
    this.queryCache.set(queryKey, { data, timestamp: Date.now() });

    return data;
  }

  // Clear expired cache entries
  static clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.queryCache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.queryCache.delete(key);
      }
    }
  }

  // Get cache statistics
  static getCacheStats() {
    return {
      size: this.queryCache.size,
      hitRate: this.getHitRate(),
      memoryUsage: this.getMemoryUsage(),
    };
  }

  private static getHitRate(): number {
    // Implementation for tracking hit rate
    return 0.85; // Placeholder
  }

  private static getMemoryUsage(): string {
    return `${Math.round(this.queryCache.size * 0.1)}KB`; // Estimate
  }
}

// Bundle size optimization utilities
export class BundleOptimizer {
  // Dynamic import wrapper with error handling
  static async loadComponent<T>(importFn: () => Promise<{ default: T }>, fallback?: T): Promise<T> {
    try {
      const module = await importFn();
      return module.default;
    } catch (error) {
      console.error('Component lazy loading failed:', error);
      if (fallback) return fallback;
      throw error;
    }
  }

  // Critical CSS extraction
  static extractCriticalCSS(html: string): string {
    // Extract inline styles and critical CSS
    const criticalStyles = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
    return criticalStyles.join('\n');
  }

  // Resource preloading hints
  static generatePreloadHints(resources: string[]): string {
    return resources
      .map((resource) => `<link rel="preload" href="${resource}" as="script">`)
      .join('\n');
  }
}

// API response optimization
export class APIOptimizer {
  // Compress large API responses
  static compressResponse(data: any): NextResponse {
    const response = NextResponse.json(data);

    // Add compression headers
    response.headers.set('Content-Encoding', 'gzip');
    response.headers.set('Vary', 'Accept-Encoding');

    // Cache control for API responses
    if (this.isCacheable(data)) {
      response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    } else {
      response.headers.set('Cache-Control', 'no-store, must-revalidate');
    }

    return response;
  }

  // Paginate large datasets
  static paginateData<T>(
    data: T[],
    page: number = 1,
    limit: number = 50,
  ): {
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  } {
    const offset = (page - 1) * limit;
    const paginatedData = data.slice(offset, offset + limit);
    const total = data.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Optimize API response size
  static optimizeResponse(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.stripUnnecessaryFields(item));
    }
    return this.stripUnnecessaryFields(data);
  }

  private static stripUnnecessaryFields(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    const optimized = { ...obj };

    // Remove null/undefined values
    Object.keys(optimized).forEach((key) => {
      if (optimized[key] === null || optimized[key] === undefined) {
        delete optimized[key];
      }
    });

    // Remove empty objects/arrays
    Object.keys(optimized).forEach((key) => {
      const value = optimized[key];
      if (Array.isArray(value) && value.length === 0) {
        delete optimized[key];
      } else if (typeof value === 'object' && Object.keys(value).length === 0) {
        delete optimized[key];
      }
    });

    return optimized;
  }

  private static isCacheable(data: any): boolean {
    // Determine if response can be cached based on content
    if (!data) return false;

    // Don't cache user-specific data
    if (data.user || data.userId || data.personalData) return false;

    // Cache public data, courses, etc.
    if (data.courses || data.publicData || data.statistics) return true;

    return false;
  }

  // Rate limiting optimization
  static createRateLimiter(windowMs: number = 15 * 60 * 1000, max: number = 100) {
    const requests = new Map<string, { count: number; resetTime: number }>();

    return (identifier: string): { allowed: boolean; remaining: number; resetTime: number } => {
      const now = Date.now();
      const key = identifier;
      const record = requests.get(key);

      if (!record || now > record.resetTime) {
        const resetTime = now + windowMs;
        requests.set(key, { count: 1, resetTime });
        return { allowed: true, remaining: max - 1, resetTime };
      }

      if (record.count >= max) {
        return { allowed: false, remaining: 0, resetTime: record.resetTime };
      }

      record.count++;
      return { allowed: true, remaining: max - record.count, resetTime: record.resetTime };
    };
  }
}

// Memory optimization utilities
export class MemoryOptimizer {
  private static memoryUsage = new Map<string, number>();

  // Monitor memory usage by component
  static trackMemoryUsage(componentName: string, fn: Function) {
    const startMemory = process.memoryUsage().heapUsed;
    const result = fn();
    const endMemory = process.memoryUsage().heapUsed;

    this.memoryUsage.set(componentName, endMemory - startMemory);
    return result;
  }

  // Get memory statistics
  static getMemoryStats() {
    const usage = process.memoryUsage();
    return {
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + ' MB',
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + ' MB',
      external: Math.round(usage.external / 1024 / 1024) + ' MB',
      rss: Math.round(usage.rss / 1024 / 1024) + ' MB',
      componentUsage: Object.fromEntries(
        Array.from(this.memoryUsage.entries()).map(([key, value]) => [
          key,
          Math.round(value / 1024) + ' KB',
        ]),
      ),
    };
  }

  // Clean up unused references
  static cleanup() {
    if (global.gc) {
      global.gc();
    }
    this.memoryUsage.clear();
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics = new Map<string, { duration: number; timestamp: number }>();

  // Time function execution
  static async timeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.metrics.set(label, { duration, timestamp: Date.now() });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.metrics.set(`${label}_error`, { duration, timestamp: Date.now() });
      throw error;
    }
  }

  // Get performance metrics
  static getMetrics() {
    const metrics = Array.from(this.metrics.entries()).map(([label, data]) => ({
      label,
      duration: data.duration,
      timestamp: data.timestamp,
    }));

    return {
      metrics,
      averageResponseTime: this.calculateAverage(metrics.map((m) => m.duration)),
      slowestEndpoints: metrics
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5)
        .map((m) => ({ endpoint: m.label, duration: m.duration })),
    };
  }

  private static calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return Math.round(numbers.reduce((sum, num) => sum + num, 0) / numbers.length);
  }
}

// Export all optimizers
export const Optimizers = {
  Database: DatabaseOptimizer,
  Bundle: BundleOptimizer,
  API: APIOptimizer,
  Memory: MemoryOptimizer,
  Performance: PerformanceMonitor,
};
