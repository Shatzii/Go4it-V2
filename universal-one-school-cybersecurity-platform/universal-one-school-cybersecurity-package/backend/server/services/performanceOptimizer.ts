/**
 * Performance optimization service for the Sentinel AI platform
 * Handles caching, performance monitoring, and resource optimization
 */

import { storage } from "../storage";

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

interface PerformanceMetrics {
  requestCount: number;
  averageResponseTime: number;
  cacheHitRate: number;
  dbQueryCount: number;
}

class PerformanceOptimizer {
  private cache: Map<string, CacheEntry> = new Map();
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private startTime: number = Date.now();
  
  // Maximum cache size (number of entries)
  private readonly MAX_CACHE_SIZE = 1000;
  
  // Default TTL for cache entries (in milliseconds)
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  
  constructor() {
    console.log('Performance optimizer initialized');
    
    // Initialize metrics collection
    this.initializeMetrics();
    
    // Start periodic cache cleanup
    setInterval(() => this.cleanupCache(), 60 * 1000); // Run every minute
    
    // Start periodic metrics logging
    setInterval(() => this.logPerformanceMetrics(), 5 * 60 * 1000); // Log every 5 minutes
  }
  
  /**
   * Initialize performance metrics
   */
  private initializeMetrics() {
    const metricTypes = ['api', 'database', 'websocket', 'notifications'];
    
    metricTypes.forEach(type => {
      this.metrics.set(type, {
        requestCount: 0,
        averageResponseTime: 0,
        cacheHitRate: 0,
        dbQueryCount: 0
      });
    });
  }
  
  /**
   * Get data from cache or execute function to retrieve it
   */
  async getCachedData<T>(key: string, fetchFn: () => Promise<T>, ttl = this.DEFAULT_TTL): Promise<T> {
    // Check if data exists in cache and is not expired
    const cachedEntry = this.cache.get(key);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < cachedEntry.ttl) {
      // Cache hit
      this.recordMetric('database', 'cacheHit');
      return cachedEntry.data as T;
    }
    
    // Cache miss - fetch data
    this.recordMetric('database', 'cacheMiss');
    const startTime = Date.now();
    const data = await fetchFn();
    const duration = Date.now() - startTime;
    
    // Record database query time
    this.recordMetric('database', 'query', duration);
    
    // Store in cache
    this.setCache(key, data, ttl);
    
    return data;
  }
  
  /**
   * Store data in cache
   */
  setCache(key: string, data: any, ttl = this.DEFAULT_TTL): void {
    // If cache is at max size, remove oldest entries
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const keysIterator = this.cache.keys();
      const oldestKey = keysIterator.next().value;
      this.cache.delete(oldestKey);
    }
    
    // Add to cache
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  /**
   * Clear specific cache entry
   */
  invalidateCache(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Clear all cache entries matching a pattern
   */
  invalidateCachePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Remove expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Record performance metric
   */
  recordMetric(type: string, metricName: string, value: number = 1): void {
    const metrics = this.metrics.get(type);
    if (!metrics) return;
    
    switch (metricName) {
      case 'request':
        metrics.requestCount += 1;
        if (value > 0) {
          // Update rolling average response time
          metrics.averageResponseTime = 
            (metrics.averageResponseTime * (metrics.requestCount - 1) + value) / metrics.requestCount;
        }
        break;
      case 'query':
        metrics.dbQueryCount += 1;
        break;
      case 'cacheHit':
        metrics.cacheHitRate = 
          (metrics.cacheHitRate * (metrics.requestCount) + 1) / (metrics.requestCount + 1);
        break;
      case 'cacheMiss':
        metrics.cacheHitRate = 
          (metrics.cacheHitRate * (metrics.requestCount)) / (metrics.requestCount + 1);
        break;
    }
  }
  
  /**
   * Log current performance metrics
   */
  private async logPerformanceMetrics(): Promise<void> {
    try {
      const uptime = Math.floor((Date.now() - this.startTime) / 1000);
      
      // Log overall system metrics
      console.log(`=== Performance Metrics (Uptime: ${uptime}s) ===`);
      for (const [type, metrics] of this.metrics.entries()) {
        console.log(`${type}: ${metrics.requestCount} requests, ${metrics.dbQueryCount} db queries, ${Math.round(metrics.averageResponseTime)}ms avg, ${Math.round(metrics.cacheHitRate * 100)}% cache hit`);
      }
      
      // Log cache stats
      console.log(`Cache: ${this.cache.size} entries`);
      
      // Log to database for historical tracking
      await storage.createLog({
        clientId: 1, // System metrics
        level: "info",
        source: "performance_optimizer",
        message: "System performance metrics",
        metadata: {
          uptime,
          cache: {
            size: this.cache.size,
          },
          metrics: Object.fromEntries(this.metrics)
        }
      });
    } catch (error) {
      console.error("Error logging performance metrics:", error);
    }
  }
  
  /**
   * Get optimized query options based on client and request type
   */
  getOptimizedQueryOptions(clientId: number, queryType: string): any {
    // These settings will help optimize database queries based on the client's data size
    // and the type of query being performed
    const baseOptions = {
      limit: 100,
      orderBy: 'desc',
      includeRelations: false
    };
    
    // For smaller datasets, we can include more data
    if (clientId < 10) { // Assuming lower IDs have less data
      return {
        ...baseOptions,
        limit: 250,
        includeRelations: true
      };
    }
    
    // For log queries, we typically need more entries but fewer relations
    if (queryType === 'logs') {
      return {
        ...baseOptions,
        limit: 500,
        includeRelations: false
      };
    }
    
    // For dashboard queries, we need fewer entries but more complete data
    if (queryType === 'dashboard') {
      return {
        ...baseOptions,
        limit: 50,
        includeRelations: true
      };
    }
    
    return baseOptions;
  }
  
  /**
   * Get system performance summary
   */
  getPerformanceSummary(): any {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    
    return {
      uptime,
      cacheSize: this.cache.size,
      metrics: Object.fromEntries(this.metrics),
      status: 'optimal' // Can be 'optimal', 'warning', or 'critical'
    };
  }
}

export const performanceOptimizer = new PerformanceOptimizer();