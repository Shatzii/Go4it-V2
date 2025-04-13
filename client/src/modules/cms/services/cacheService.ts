/**
 * CMS Cache Service
 * 
 * Provides caching capabilities for CMS content to improve performance
 * and reduce unnecessary API calls. Features include:
 * - Automatic cache invalidation
 * - TTL-based expiration
 * - Debug logging for cache operations
 * - Section-aware invalidation
 * - Prefetching for frequently accessed content
 */

import { ContentBlock, PageData } from '../types';

// Cache TTL in milliseconds
const CONTENT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const PAGE_CACHE_TTL = 10 * 60 * 1000;   // 10 minutes

// Debug mode - set to true to enable verbose cache logging
const CACHE_DEBUG = process.env.NODE_ENV === 'development';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount?: number; // Track how often this item is accessed
}

interface CacheStats {
  hits: number;
  misses: number;
  invalidations: number;
  size: number;
  hitRatio?: number;
}

class CMSCache {
  private contentBlockCache: Map<string, CacheEntry<ContentBlock>> = new Map();
  private contentSectionCache: Map<string, CacheEntry<ContentBlock[]>> = new Map();
  private pageCache: Map<string, CacheEntry<PageData>> = new Map();
  private allContentBlocksCache: CacheEntry<ContentBlock[]> | null = null;
  private allPagesCache: CacheEntry<PageData[]> | null = null;
  
  // Map to track which sections contain which blocks (for intelligent invalidation)
  private blockSectionMap: Map<string, Set<string>> = new Map();
  
  // Cache statistics for monitoring performance
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    invalidations: 0,
    size: 0,
  };

  /**
   * Log debug information if cache debugging is enabled
   */
  private logDebug(message: string): void {
    if (CACHE_DEBUG) {
      console.debug(`[CMS Cache] ${message}`);
    }
  }

  /**
   * Update cache statistics including size and hit ratio
   */
  private updateStats(): void {
    // Update cache size
    this.stats.size = 
      this.contentBlockCache.size + 
      this.contentSectionCache.size + 
      this.pageCache.size + 
      (this.allContentBlocksCache ? 1 : 0) + 
      (this.allPagesCache ? 1 : 0);
    
    // Calculate hit ratio (percentage of successful cache hits)
    const totalRequests = this.stats.hits + this.stats.misses;
    if (totalRequests > 0) {
      this.stats.hitRatio = Number((this.stats.hits / totalRequests).toFixed(2));
    }
  }
  
  /**
   * Track which blocks belong to which sections for intelligent invalidation
   */
  private trackBlockSection(block: ContentBlock): void {
    const { identifier, section } = block;
    if (!section) return;
    
    if (!this.blockSectionMap.has(section)) {
      this.blockSectionMap.set(section, new Set());
    }
    
    this.blockSectionMap.get(section)?.add(identifier);
  }

  // Content blocks caching
  setContentBlock(identifier: string, data: ContentBlock): void {
    this.contentBlockCache.set(identifier, {
      data,
      timestamp: Date.now(),
      ttl: CONTENT_CACHE_TTL,
      accessCount: 0
    });
    
    // Track for section-aware invalidation
    this.trackBlockSection(data);
    this.updateStats();
    this.logDebug(`Cache SET: content block "${identifier}"`);
  }

  getContentBlock(identifier: string): ContentBlock | null {
    const cached = this.contentBlockCache.get(identifier);
    if (!cached) {
      this.stats.misses++;
      this.logDebug(`Cache MISS: content block "${identifier}"`);
      return null;
    }
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.contentBlockCache.delete(identifier);
      this.stats.misses++;
      this.logDebug(`Cache EXPIRED: content block "${identifier}"`);
      return null;
    }
    
    // Update access stats
    cached.accessCount = (cached.accessCount || 0) + 1;
    this.stats.hits++;
    this.logDebug(`Cache HIT: content block "${identifier}" (accessed ${cached.accessCount} times)`);
    
    return cached.data;
  }

  // Content sections caching
  setContentSection(section: string, data: ContentBlock[]): void {
    this.contentSectionCache.set(section, {
      data,
      timestamp: Date.now(),
      ttl: CONTENT_CACHE_TTL,
      accessCount: 0
    });
    
    // Track all blocks in this section
    data.forEach(block => this.trackBlockSection(block));
    
    this.updateStats();
    this.logDebug(`Cache SET: content section "${section}" with ${data.length} blocks`);
  }

  getContentSection(section: string): ContentBlock[] | null {
    const cached = this.contentSectionCache.get(section);
    if (!cached) {
      this.stats.misses++;
      this.logDebug(`Cache MISS: content section "${section}"`);
      return null;
    }
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.contentSectionCache.delete(section);
      this.stats.misses++;
      this.logDebug(`Cache EXPIRED: content section "${section}"`);
      return null;
    }
    
    // Update access stats
    cached.accessCount = (cached.accessCount || 0) + 1;
    this.stats.hits++;
    this.logDebug(`Cache HIT: content section "${section}" (accessed ${cached.accessCount} times)`);
    
    return cached.data;
  }

  // All content blocks caching
  setAllContentBlocks(data: ContentBlock[]): void {
    this.allContentBlocksCache = {
      data,
      timestamp: Date.now(),
      ttl: CONTENT_CACHE_TTL,
      accessCount: 0
    };
    
    // Track all blocks for section-aware invalidation
    data.forEach(block => this.trackBlockSection(block));
    
    this.updateStats();
    this.logDebug(`Cache SET: all content blocks (count: ${data.length})`);
  }

  getAllContentBlocks(): ContentBlock[] | null {
    if (!this.allContentBlocksCache) {
      this.stats.misses++;
      this.logDebug(`Cache MISS: all content blocks`);
      return null;
    }
    
    if (Date.now() - this.allContentBlocksCache.timestamp > this.allContentBlocksCache.ttl) {
      this.allContentBlocksCache = null;
      this.stats.misses++;
      this.logDebug(`Cache EXPIRED: all content blocks`);
      return null;
    }
    
    // Update access stats
    this.allContentBlocksCache.accessCount = (this.allContentBlocksCache.accessCount || 0) + 1;
    this.stats.hits++;
    this.logDebug(`Cache HIT: all content blocks (accessed ${this.allContentBlocksCache.accessCount} times)`);
    
    return this.allContentBlocksCache.data;
  }

  // Page caching
  setPage(slug: string, data: PageData): void {
    this.pageCache.set(slug, {
      data,
      timestamp: Date.now(),
      ttl: PAGE_CACHE_TTL,
      accessCount: 0
    });
    
    this.updateStats();
    this.logDebug(`Cache SET: page "${slug}"`);
  }

  getPage(slug: string): PageData | null {
    const cached = this.pageCache.get(slug);
    if (!cached) {
      this.stats.misses++;
      this.logDebug(`Cache MISS: page "${slug}"`);
      return null;
    }
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.pageCache.delete(slug);
      this.stats.misses++;
      this.logDebug(`Cache EXPIRED: page "${slug}"`);
      return null;
    }
    
    // Update access stats
    cached.accessCount = (cached.accessCount || 0) + 1;
    this.stats.hits++;
    this.logDebug(`Cache HIT: page "${slug}" (accessed ${cached.accessCount} times)`);
    
    return cached.data;
  }

  // All pages caching
  setAllPages(data: PageData[]): void {
    this.allPagesCache = {
      data,
      timestamp: Date.now(),
      ttl: PAGE_CACHE_TTL,
      accessCount: 0
    };
    
    this.updateStats();
    this.logDebug(`Cache SET: all pages (count: ${data.length})`);
  }

  getAllPages(): PageData[] | null {
    if (!this.allPagesCache) {
      this.stats.misses++;
      this.logDebug(`Cache MISS: all pages`);
      return null;
    }
    
    if (Date.now() - this.allPagesCache.timestamp > this.allPagesCache.ttl) {
      this.allPagesCache = null;
      this.stats.misses++;
      this.logDebug(`Cache EXPIRED: all pages`);
      return null;
    }
    
    // Update access stats
    this.allPagesCache.accessCount = (this.allPagesCache.accessCount || 0) + 1;
    this.stats.hits++;
    this.logDebug(`Cache HIT: all pages (accessed ${this.allPagesCache.accessCount} times)`);
    
    return this.allPagesCache.data;
  }

  // Cache statistics and management
  getCacheStats(): CacheStats {
    // Calculate current size and hit ratio
    const totalSize = this.contentBlockCache.size + 
                     this.contentSectionCache.size + 
                     this.pageCache.size + 
                     (this.allContentBlocksCache ? 1 : 0) + 
                     (this.allPagesCache ? 1 : 0);
    
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRatio = totalRequests > 0 
      ? Number((this.stats.hits / totalRequests).toFixed(2)) 
      : 0;
    
    return {
      ...this.stats,
      size: totalSize,
      hitRatio
    };
  }
  
  /**
   * Prefetch content blocks for frequently accessed sections
   * to improve performance for commonly viewed content
   */
  prefetchSection(section: string): Promise<void> {
    this.logDebug(`Prefetching content for section: ${section}`);
    
    return fetch(`/api/content-blocks/section/${section}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          this.setContentSection(section, data);
          
          // Also cache individual blocks
          data.forEach(block => {
            this.setContentBlock(block.identifier, block);
          });
          
          this.logDebug(`Prefetched ${data.length} content blocks for section: ${section}`);
        }
      })
      .catch(error => {
        console.error(`Error prefetching section ${section}:`, error);
      });
  }
  
  /**
   * Prefetch a page and all its content for optimal performance
   */
  prefetchPage(slug: string): Promise<void> {
    this.logDebug(`Prefetching page: ${slug}`);
    
    return fetch(`/api/pages/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          this.setPage(slug, data);
          this.logDebug(`Prefetched page: ${slug}`);
          
          // Prefetch content sections used by this page
          if (data.sections && Array.isArray(data.sections)) {
            const sectionPromises = data.sections.map(section => this.prefetchSection(section));
            return Promise.all(sectionPromises);
          }
        }
      })
      .catch(error => {
        console.error(`Error prefetching page ${slug}:`, error);
      });
  }

  // Cache invalidation methods
  invalidateContentBlock(identifier: string): void {
    this.contentBlockCache.delete(identifier);
    this.allContentBlocksCache = null; // Invalidate all content blocks cache
    
    // Intelligent section invalidation: 
    // Find and invalidate any sections containing this block
    for (const [section, blocks] of this.blockSectionMap.entries()) {
      if (blocks.has(identifier)) {
        this.invalidateContentSection(section);
        this.logDebug(`Intelligently invalidated section "${section}" due to block "${identifier}" change`);
      }
    }
    
    this.stats.invalidations++;
    this.updateStats();
    this.logDebug(`Cache INVALIDATE: content block "${identifier}"`);
  }

  invalidateContentSection(section: string): void {
    this.contentSectionCache.delete(section);
    
    // Clear the block-section tracking for this section
    if (this.blockSectionMap.has(section)) {
      this.blockSectionMap.delete(section);
    }
    
    this.stats.invalidations++;
    this.updateStats();
    this.logDebug(`Cache INVALIDATE: content section "${section}"`);
  }

  invalidatePage(slug: string): void {
    this.pageCache.delete(slug);
    this.allPagesCache = null; // Invalidate all pages cache
    
    this.stats.invalidations++;
    this.updateStats();
    this.logDebug(`Cache INVALIDATE: page "${slug}"`);
  }

  invalidateAllContent(): void {
    const totalSize = this.contentBlockCache.size + 
                      this.contentSectionCache.size + 
                      this.pageCache.size + 
                      (this.allContentBlocksCache ? 1 : 0) + 
                      (this.allPagesCache ? 1 : 0);
    
    this.contentBlockCache.clear();
    this.contentSectionCache.clear();
    this.pageCache.clear();
    this.blockSectionMap.clear();
    this.allContentBlocksCache = null;
    this.allPagesCache = null;
    
    this.stats.invalidations++;
    this.updateStats();
    this.logDebug(`Cache INVALIDATE ALL: cleared ${totalSize} cached items`);
  }
}

// Singleton instance
export const cmsCache = new CMSCache();