import { CacheContainer } from 'node-ts-cache';
import { MemoryStorage } from 'node-ts-cache-storage-memory';
import { log } from '../vite';

// Create different cache containers with varying TTLs (Time To Live)
// Short-lived cache (30 seconds) - For frequently changing data
export const shortCache = new CacheContainer(new MemoryStorage());

// Medium-lived cache (5 minutes) - For semi-static data
export const mediumCache = new CacheContainer(new MemoryStorage());

// Long-lived cache (1 hour) - For mostly static data
export const longCache = new CacheContainer(new MemoryStorage());

/**
 * Generic function to cache the result of any async function
 * @param cacheKey A unique key for the cache entry
 * @param fn The async function to execute and cache
 * @param ttl Time to live in seconds
 * @param cacheName Which cache to use (short, medium, long)
 * @returns The cached or freshly computed result
 */
export async function cachedFetch<T>(
  cacheKey: string, 
  fn: () => Promise<T>, 
  ttl: number = 300, // Default 5 minutes
  cacheName: 'short' | 'medium' | 'long' = 'medium'
): Promise<T> {
  const cacheContainer = 
    cacheName === 'short' ? shortCache : 
    cacheName === 'long' ? longCache : 
    mediumCache;
  
  // Try to get from cache first
  const cachedResult = await cacheContainer.getItem<T>(cacheKey);
  
  if (cachedResult !== undefined && cachedResult !== null) {
    log(`Cache hit for key: ${cacheKey}`, 'cache');
    return cachedResult;
  }
  
  // Cache miss, execute function
  log(`Cache miss for key: ${cacheKey}`, 'cache');
  const result = await fn();
  
  // Store in cache
  await cacheContainer.setItem(cacheKey, result, { ttl });
  
  return result;
}

/**
 * Clear a specific cache entry
 * @param cacheKey The key to clear
 * @param cacheName Which cache to clear from
 */
export async function clearCacheItem(
  cacheKey: string,
  cacheName: 'short' | 'medium' | 'long' = 'medium'
): Promise<void> {
  const cacheContainer = 
    cacheName === 'short' ? shortCache : 
    cacheName === 'long' ? longCache : 
    mediumCache;
    
  await cacheContainer.removeItem(cacheKey);
  log(`Cleared cache for key: ${cacheKey}`, 'cache');
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<void> {
  await shortCache.clear();
  await mediumCache.clear();
  await longCache.clear();
  log('All caches cleared', 'cache');
}

/**
 * Clear cache by key pattern
 * @param pattern A string that cache keys should include to be cleared
 */
export async function clearCacheByPattern(pattern: string): Promise<void> {
  // Since memory storage doesn't support pattern matching directly,
  // we need to implement this functionality manually
  const clearByPattern = async (cache: CacheContainer) => {
    const keys = await cache.getKeys();
    const matchingKeys = keys.filter(key => key.includes(pattern));
    
    for (const key of matchingKeys) {
      await cache.removeItem(key);
    }
    
    return matchingKeys.length;
  };
  
  const shortCleared = await clearByPattern(shortCache);
  const mediumCleared = await clearByPattern(mediumCache);
  const longCleared = await clearByPattern(longCache);
  
  log(`Cleared ${shortCleared + mediumCleared + longCleared} cache entries matching pattern: ${pattern}`, 'cache');
}