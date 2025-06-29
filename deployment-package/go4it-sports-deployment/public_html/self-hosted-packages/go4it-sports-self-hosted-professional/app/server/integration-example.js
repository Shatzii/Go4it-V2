/**
 * Go4It Sports - Performance Optimization
 * 
 * This file demonstrates how to integrate the new caching system with
 * existing Go4It services for improved performance and reliability.
 */

// Import the caching system
const { cacheManager } = require('./cache-manager');
const { cacheMiddleware, clearCache } = require('./middleware/cache-middleware');
const { configureCompression } = require('./middleware/compression-middleware');
const { cdnMiddleware } = require('./middleware/cdn-middleware');

/**
 * PART 1: Example of integrating the middleware with Express
 */

// Import Express
const express = require('express');
const app = express();

// Apply compression middleware globally
app.use(configureCompression());

// Apply CDN middleware for static assets
app.use('/assets', cdnMiddleware({
  directory: '../client/dist/assets',
  maxAge: 2592000 // 30 days
}));

// Apply cache middleware to API routes that benefit from caching
app.use('/api/blog-posts', cacheMiddleware({ ttl: 600 })); // Cache for 10 minutes
app.use('/api/featured-athletes', cacheMiddleware({ ttl: 300 })); // Cache for 5 minutes
app.use('/api/content-blocks', cacheMiddleware({ ttl: 3600 })); // Cache for 1 hour
app.use('/api/scout-vision', cacheMiddleware({ ttl: 300 })); // Cache for 5 minutes
app.use('/api/combine-tour/events', cacheMiddleware({ ttl: 1800 })); // Cache for 30 minutes

// Example of clearing cache when data changes
app.post('/api/blog-posts', clearCache('blog-posts'), (req, res) => {
  // Your blog post creation logic here
  res.json({ success: true });
});

/**
 * PART 2: Example of using caching in existing services (Transfer Portal)
 */

// This demonstrates how to modify the Transfer Portal service to use caching
// Apply this pattern to the actual service code at server/services/transfer-portal-service.ts

/**
 * Modified version of getActivePortalEntries method with caching
 */
async function getActivePortalEntriesWithCache(sportType, status) {
  const cacheKey = `transfer-portal:${sportType}:${status || 'all'}`;
  
  try {
    // Try to get results from cache first
    return await cacheManager.getOrSet(cacheKey, async () => {
      // This is only called if cache misses
      console.log(`Cache miss for ${cacheKey}, fetching from database`);
      
      // Original database query
      const result = await db.query(`
        SELECT * FROM transfer_portal_entries
        WHERE sport_type = $1
        ${status ? 'AND status = $2' : ''}
        ORDER BY created_at DESC
        LIMIT 100
      `, status ? [sportType, status] : [sportType]);
      
      return result.rows;
    }, 300); // Cache for 5 minutes
  } catch (error) {
    console.error(`Error fetching transfer portal entries: ${error.message}`);
    
    // Important: In case of error, try to return cached data even if expired
    const cachedData = await cacheManager.get(cacheKey);
    if (cachedData) {
      console.log(`Returning stale cache data for ${cacheKey} after error`);
      return cachedData;
    }
    
    // If no cached data available, throw the error
    throw error;
  }
}

/**
 * PART 3: Example of error resilience and circuit breaking
 */

// This demonstrates using the cache as a backup for unreliable services
// Such as external APIs or database operations that sometimes fail

/**
 * Function that demonstrates using a cache as a backup for unreliable operations
 */
async function getPlayerStatisticsWithResilience(playerId) {
  const cacheKey = `player-statistics:${playerId}`;
  
  try {
    // Set a short timeout for the database operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 2000);
    });
    
    // Try to get fresh data with timeout
    const freshDataPromise = async () => {
      // Simulated database query or external API call
      const stats = await db.query('SELECT * FROM player_statistics WHERE player_id = $1', [playerId]);
      return stats.rows[0];
    };
    
    // Race between the query and the timeout
    return await cacheManager.getOrSet(cacheKey, async () => {
      return await Promise.race([freshDataPromise(), timeoutPromise]);
    }, 3600); // Cache for 1 hour
  } catch (error) {
    console.error(`Error fetching player statistics: ${error.message}`);
    
    // On error, try to return cached data
    const cachedData = await cacheManager.get(cacheKey);
    if (cachedData) {
      console.log(`Serving statistics for player ${playerId} from cache after error`);
      return {
        ...cachedData,
        _fromCache: true, // Add flag for client awareness
        _cacheTimestamp: new Date().toISOString()
      };
    }
    
    // If no cached data, return empty statistics with error flag
    return {
      playerId,
      error: true,
      errorMessage: 'Statistics temporarily unavailable',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * PART 4: Example of optimizing expensive computations
 */

// This demonstrates using the cache for expensive operations like GAR scoring

/**
 * Calculate GAR (Growth and Ability Rating) score with caching
 */
async function calculateGARScoreWithCache(sportType, videoId, metricsData) {
  // Generate a unique key based on input data
  const inputHash = require('crypto')
    .createHash('md5')
    .update(JSON.stringify({ sportType, videoId, metricsData }))
    .digest('hex');
  
  const cacheKey = `gar-score:${inputHash}`;
  
  // Cache the expensive GAR calculation for 24 hours
  return await cacheManager.getOrSet(cacheKey, async () => {
    console.log(`Cache miss for GAR calculation ${videoId}, computing score`);
    
    // Expensive calculation (original implementation)
    // This is just a placeholder - your actual GAR calculation goes here
    const baseScore = calculateBaseScore(sportType, metricsData);
    const potentialMultiplier = calculatePotentialMultiplier(metricsData);
    const consistencyFactor = calculateConsistencyFactor(metricsData);
    
    // Apply additional AI processing
    const aiEnhancements = await applyAIEnhancements(videoId, sportType, metricsData);
    
    // Calculate final score
    const finalScore = baseScore * potentialMultiplier * consistencyFactor * aiEnhancements.factor;
    
    // Return comprehensive result
    return {
      score: finalScore,
      breakdown: {
        baseScore,
        potentialMultiplier,
        consistencyFactor,
        aiEnhancements
      },
      timestamp: new Date().toISOString()
    };
  }, 86400); // 24 hours cache
}

// Placeholder functions for demonstration
function calculateBaseScore(sportType, metricsData) { return 0.75; }
function calculatePotentialMultiplier(metricsData) { return 1.2; }
function calculateConsistencyFactor(metricsData) { return 0.95; }
async function applyAIEnhancements(videoId, sportType, metricsData) { 
  return { factor: 1.05, insights: ["Good form", "Improving speed"] };
}

/**
 * PART 5: Cache Warm-up Strategy
 */

/**
 * Warm up critical caches during application startup
 */
async function warmupCaches() {
  console.log('Starting cache warm-up process...');
  
  try {
    // Warm up frequently accessed data
    const sportTypes = ['football', 'basketball', 'baseball', 'soccer'];
    
    // Pre-cache content blocks
    await cacheManager.getOrSet('content-blocks-all', async () => {
      return await db.query('SELECT * FROM content_blocks');
    }, 3600);
    
    // Pre-cache upcoming events
    await cacheManager.getOrSet('upcoming-events', async () => {
      return await db.query(`
        SELECT * FROM combine_events 
        WHERE event_date > NOW() 
        ORDER BY event_date ASC 
        LIMIT 10
      `);
    }, 1800);
    
    // Pre-cache featured athletes
    await cacheManager.getOrSet('featured-athletes-8', async () => {
      return await db.query(`
        SELECT * FROM featured_athletes
        ORDER BY featured_date DESC
        LIMIT 8
      `);
    }, 3600);
    
    // Pre-cache popular blog posts
    await cacheManager.getOrSet('blog-posts-popular', async () => {
      return await db.query(`
        SELECT * FROM blog_posts
        WHERE view_count > 100
        ORDER BY publish_date DESC
        LIMIT 10
      `);
    }, 3600);
    
    console.log('Cache warm-up completed successfully');
  } catch (error) {
    console.error(`Error during cache warm-up: ${error.message}`);
  }
}

// Export functions for use in the actual application
module.exports = {
  getActivePortalEntriesWithCache,
  getPlayerStatisticsWithResilience,
  calculateGARScoreWithCache,
  warmupCaches
};