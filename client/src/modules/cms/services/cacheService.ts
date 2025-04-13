/**
 * CMS Cache Service
 * 
 * Provides caching capabilities for CMS content to improve performance
 * and reduce unnecessary API calls.
 */

import { ContentBlock, PageData } from '../types';

// Cache TTL in milliseconds
const CONTENT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const PAGE_CACHE_TTL = 10 * 60 * 1000;   // 10 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CMSCache {
  private contentBlockCache: Map<string, CacheEntry<ContentBlock>> = new Map();
  private contentSectionCache: Map<string, CacheEntry<ContentBlock[]>> = new Map();
  private pageCache: Map<string, CacheEntry<PageData>> = new Map();
  private allContentBlocksCache: CacheEntry<ContentBlock[]> | null = null;
  private allPagesCache: CacheEntry<PageData[]> | null = null;

  // Content blocks caching
  setContentBlock(identifier: string, data: ContentBlock): void {
    this.contentBlockCache.set(identifier, {
      data,
      timestamp: Date.now(),
      ttl: CONTENT_CACHE_TTL
    });
  }

  getContentBlock(identifier: string): ContentBlock | null {
    const cached = this.contentBlockCache.get(identifier);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.contentBlockCache.delete(identifier);
      return null;
    }
    
    return cached.data;
  }

  // Content sections caching
  setContentSection(section: string, data: ContentBlock[]): void {
    this.contentSectionCache.set(section, {
      data,
      timestamp: Date.now(),
      ttl: CONTENT_CACHE_TTL
    });
  }

  getContentSection(section: string): ContentBlock[] | null {
    const cached = this.contentSectionCache.get(section);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.contentSectionCache.delete(section);
      return null;
    }
    
    return cached.data;
  }

  // All content blocks caching
  setAllContentBlocks(data: ContentBlock[]): void {
    this.allContentBlocksCache = {
      data,
      timestamp: Date.now(),
      ttl: CONTENT_CACHE_TTL
    };
  }

  getAllContentBlocks(): ContentBlock[] | null {
    if (!this.allContentBlocksCache) return null;
    
    if (Date.now() - this.allContentBlocksCache.timestamp > this.allContentBlocksCache.ttl) {
      this.allContentBlocksCache = null;
      return null;
    }
    
    return this.allContentBlocksCache.data;
  }

  // Page caching
  setPage(slug: string, data: PageData): void {
    this.pageCache.set(slug, {
      data,
      timestamp: Date.now(),
      ttl: PAGE_CACHE_TTL
    });
  }

  getPage(slug: string): PageData | null {
    const cached = this.pageCache.get(slug);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.pageCache.delete(slug);
      return null;
    }
    
    return cached.data;
  }

  // All pages caching
  setAllPages(data: PageData[]): void {
    this.allPagesCache = {
      data,
      timestamp: Date.now(),
      ttl: PAGE_CACHE_TTL
    };
  }

  getAllPages(): PageData[] | null {
    if (!this.allPagesCache) return null;
    
    if (Date.now() - this.allPagesCache.timestamp > this.allPagesCache.ttl) {
      this.allPagesCache = null;
      return null;
    }
    
    return this.allPagesCache.data;
  }

  // Cache invalidation methods
  invalidateContentBlock(identifier: string): void {
    this.contentBlockCache.delete(identifier);
    this.allContentBlocksCache = null; // Invalidate all content blocks cache
  }

  invalidateContentSection(section: string): void {
    this.contentSectionCache.delete(section);
  }

  invalidatePage(slug: string): void {
    this.pageCache.delete(slug);
    this.allPagesCache = null; // Invalidate all pages cache
  }

  invalidateAllContent(): void {
    this.contentBlockCache.clear();
    this.contentSectionCache.clear();
    this.pageCache.clear();
    this.allContentBlocksCache = null;
    this.allPagesCache = null;
  }
}

// Singleton instance
export const cmsCache = new CMSCache();