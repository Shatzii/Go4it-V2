import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cache, cachedFetch, generateETag } from '../lib/cache';

describe('Cache System', () => {
  beforeEach(() => {
    cache.clear();
  });

  describe('Basic Operations', () => {
    it('should store and retrieve data', () => {
      cache.set('test-key', { value: 'test-data' });
      const result = cache.get('test-key');
      expect(result).toEqual({ value: 'test-data' });
    });

    it('should return null for non-existent keys', () => {
      const result = cache.get('non-existent');
      expect(result).toBeNull();
    });

    it('should delete cached data', () => {
      cache.set('test-key', 'data');
      cache.delete('test-key');
      const result = cache.get('test-key');
      expect(result).toBeNull();
    });

    it('should clear all cache', () => {
      cache.set('key1', 'data1');
      cache.set('key2', 'data2');
      cache.clear();
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should expire data after TTL', async () => {
      cache.set('test-key', 'data', 100); // 100ms TTL
      expect(cache.get('test-key')).toBe('data');
      
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(cache.get('test-key')).toBeNull();
    });

    it('should not expire data before TTL', async () => {
      cache.set('test-key', 'data', 1000); // 1 second TTL
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(cache.get('test-key')).toBe('data');
    });
  });

  describe('cachedFetch', () => {
    it('should fetch and cache data', async () => {
      const fetcher = vi.fn().mockResolvedValue({ data: 'fetched' });
      
      const result = await cachedFetch('fetch-key', fetcher);
      expect(result).toEqual({ data: 'fetched' });
      expect(fetcher).toHaveBeenCalledTimes(1);
      
      // Second call should use cache
      const result2 = await cachedFetch('fetch-key', fetcher);
      expect(result2).toEqual({ data: 'fetched' });
      expect(fetcher).toHaveBeenCalledTimes(1);
    });
  });

  describe('ETag Generation', () => {
    it('should generate consistent ETags for same data', () => {
      const data = { test: 'data' };
      const etag1 = generateETag(data);
      const etag2 = generateETag(data);
      expect(etag1).toBe(etag2);
    });

    it('should generate different ETags for different data', () => {
      const data1 = { test: 'data1' };
      const data2 = { test: 'data2' };
      const etag1 = generateETag(data1);
      const etag2 = generateETag(data2);
      expect(etag1).not.toBe(etag2);
    });
  });

  describe('Cache Stats', () => {
    it('should return cache statistics', () => {
      cache.set('key1', 'data1');
      cache.set('key2', 'data2');
      
      const stats = cache.getStats();
      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('key1');
      expect(stats.keys).toContain('key2');
    });
  });
});
