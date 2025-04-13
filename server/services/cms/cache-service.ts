/**
 * CMS Cache Service
 * 
 * Provides caching functionality for CMS content to improve performance.
 * Implements a memory cache with statistics tracking and methods for
 * invalidating specific parts of the cache.
 */

import { CacheStats } from '@shared/types';
import { db } from '../../db';
import { contentBlocks } from '@shared/schema';
import { eq, inArray } from 'drizzle-orm';
import { performance } from 'perf_hooks';

// Cache structure
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CmsCache {
  private contentBlockCache: Map<string, CacheItem<any>> = new Map();
  private contentSectionCache: Map<string, CacheItem<any>> = new Map();
  private pageCache: Map<string, CacheItem<any>> = new Map();
  
  // Cache statistics
  private hits: number = 0;
  private misses: number = 0;
  private totalRequests: number = 0;
  private cacheSize: number = 0;
  private lastPurge: number = Date.now();
  private averageResponseTime: number = 0;
  private responseTimeSamples: number = 0;

  // Default TTL of 5 minutes
  private DEFAULT_TTL: number = 5 * 60 * 1000;
  
  constructor() {
    // Schedule periodic cleanup
    setInterval(() => this.purgeExpiredItems(), 60 * 1000); // Run every minute
  }
  
  /**
   * Get an item from the content block cache
   */
  getContentBlock(identifier: string): any | null {
    this.totalRequests++;
    const startTime = performance.now();
    
    const cacheItem = this.contentBlockCache.get(identifier);
    if (cacheItem && Date.now() < cacheItem.timestamp + cacheItem.ttl) {
      this.hits++;
      this.updateResponseTime(performance.now() - startTime);
      return cacheItem.data;
    }
    
    this.misses++;
    this.updateResponseTime(performance.now() - startTime);
    return null;
  }
  
  /**
   * Set an item in the content block cache
   */
  setContentBlock(identifier: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.contentBlockCache.set(identifier, {
      data,
      timestamp: Date.now(),
      ttl
    });
    this.updateCacheSize();
  }
  
  /**
   * Get items from the section cache
   */
  getContentSection(section: string): any[] | null {
    this.totalRequests++;
    const startTime = performance.now();
    
    const cacheItem = this.contentSectionCache.get(section);
    if (cacheItem && Date.now() < cacheItem.timestamp + cacheItem.ttl) {
      this.hits++;
      this.updateResponseTime(performance.now() - startTime);
      return cacheItem.data;
    }
    
    this.misses++;
    this.updateResponseTime(performance.now() - startTime);
    return null;
  }
  
  /**
   * Set items in the section cache
   */
  setContentSection(section: string, data: any[], ttl: number = this.DEFAULT_TTL): void {
    this.contentSectionCache.set(section, {
      data,
      timestamp: Date.now(),
      ttl
    });
    this.updateCacheSize();
  }
  
  /**
   * Get a page from the cache
   */
  getPage(slug: string): any | null {
    this.totalRequests++;
    const startTime = performance.now();
    
    const cacheItem = this.pageCache.get(slug);
    if (cacheItem && Date.now() < cacheItem.timestamp + cacheItem.ttl) {
      this.hits++;
      this.updateResponseTime(performance.now() - startTime);
      return cacheItem.data;
    }
    
    this.misses++;
    this.updateResponseTime(performance.now() - startTime);
    return null;
  }
  
  /**
   * Set a page in the cache
   */
  setPage(slug: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.pageCache.set(slug, {
      data,
      timestamp: Date.now(),
      ttl
    });
    this.updateCacheSize();
  }
  
  /**
   * Invalidate specific content block
   */
  invalidateContentBlock(identifier: string): boolean {
    return this.contentBlockCache.delete(identifier);
  }
  
  /**
   * Invalidate all content blocks in a section
   */
  async invalidateContentSection(section: string): Promise<boolean> {
    // First remove the section cache
    this.contentSectionCache.delete(section);
    
    // Then find all content blocks in this section and invalidate them
    try {
      const blocks = await db.select({ identifier: contentBlocks.identifier })
        .from(contentBlocks)
        .where(eq(contentBlocks.section, section));
      
      blocks.forEach(block => {
        this.contentBlockCache.delete(block.identifier);
      });
      
      this.updateCacheSize();
      return true;
    } catch (error) {
      console.error('Error invalidating section cache:', error);
      return false;
    }
  }
  
  /**
   * Invalidate a page and its related content
   */
  invalidatePage(slug: string): boolean {
    return this.pageCache.delete(slug);
  }
  
  /**
   * Invalidate all cached content
   */
  invalidateAll(): void {
    this.contentBlockCache.clear();
    this.contentSectionCache.clear();
    this.pageCache.clear();
    this.updateCacheSize();
  }
  
  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return {
      hits: this.hits,
      misses: this.misses,
      totalRequests: this.totalRequests,
      hitRatio: this.totalRequests > 0 ? Math.round((this.hits / this.totalRequests) * 100) / 100 : 0,
      cacheSize: this.cacheSize,
      itemCount: {
        blocks: this.contentBlockCache.size,
        sections: this.contentSectionCache.size,
        pages: this.pageCache.size,
        total: this.contentBlockCache.size + this.contentSectionCache.size + this.pageCache.size
      },
      lastPurge: new Date(this.lastPurge).toISOString(),
      averageResponseTime: Math.round(this.averageResponseTime * 100) / 100
    };
  }
  
  /**
   * Reset cache statistics
   */
  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
    this.totalRequests = 0;
    this.lastPurge = Date.now();
    this.averageResponseTime = 0;
    this.responseTimeSamples = 0;
  }
  
  /**
   * Remove expired items from the cache
   */
  private purgeExpiredItems(): void {
    const now = Date.now();
    
    // Purge content blocks
    for (const [key, item] of this.contentBlockCache.entries()) {
      if (now >= item.timestamp + item.ttl) {
        this.contentBlockCache.delete(key);
      }
    }
    
    // Purge content sections
    for (const [key, item] of this.contentSectionCache.entries()) {
      if (now >= item.timestamp + item.ttl) {
        this.contentSectionCache.delete(key);
      }
    }
    
    // Purge pages
    for (const [key, item] of this.pageCache.entries()) {
      if (now >= item.timestamp + item.ttl) {
        this.pageCache.delete(key);
      }
    }
    
    this.lastPurge = now;
    this.updateCacheSize();
  }
  
  /**
   * Update the cache size metric (approximate memory usage)
   */
  private updateCacheSize(): void {
    // Rough estimate of memory usage based on item count and typical size
    const blockSize = this.contentBlockCache.size * 2048; // ~2KB per item
    const sectionSize = this.contentSectionCache.size * 10240; // ~10KB per section
    const pageSize = this.pageCache.size * 20480; // ~20KB per page
    
    this.cacheSize = blockSize + sectionSize + pageSize;
  }
  
  /**
   * Update average response time with a new sample
   */
  private updateResponseTime(time: number): void {
    this.responseTimeSamples++;
    // Exponential moving average
    this.averageResponseTime = this.averageResponseTime * 0.9 + time * 0.1;
  }
}

// Create a singleton instance
export const cmsCache = new CmsCache();