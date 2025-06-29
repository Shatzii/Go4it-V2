/**
 * Go4It Sports - API Routes with Performance Optimization Integration
 * 
 * This file demonstrates how to integrate the performance optimizations
 * with existing Express API routes.
 */

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { cacheMiddleware, clearCache } = require('../middleware');
const { cacheManager } = require('../cache-manager');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://Go4it:Shatzii$$@localhost:5432/go4it'
});

// Function to execute a query with resilience
async function executeQuery(query, params = []) {
  const cacheKey = `sql:${query}:${JSON.stringify(params)}`;
  
  return await cacheManager.getOrSet(cacheKey, async () => {
    // Only runs on cache miss
    const result = await pool.query(query, params);
    return result.rows;
  }, 300); // Cache for 5 minutes
}

// Define routes with caching

// Blog posts API with caching
router.get('/blog-posts', cacheMiddleware({ ttl: 600 }), async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const result = await executeQuery(
      'SELECT * FROM blog_posts ORDER BY publish_date DESC LIMIT $1',
      [limit]
    );
    res.json(result);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Featured blog posts with caching
router.get('/blog-posts/featured', cacheMiddleware({ ttl: 1800 }), async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const result = await executeQuery(
      'SELECT * FROM blog_posts WHERE is_featured = true ORDER BY publish_date DESC LIMIT $1',
      [limit]
    );
    res.json(result);
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch featured blog posts' });
  }
});

// Create blog post and clear cache
router.post('/blog-posts', clearCache('blog-posts'), async (req, res) => {
  try {
    const { title, content, author, is_featured } = req.body;
    
    const result = await pool.query(
      `INSERT INTO blog_posts (title, content, author, is_featured, publish_date) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING *`,
      [title, content, author, is_featured || false]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Featured athletes with caching
router.get('/featured-athletes', cacheMiddleware({ ttl: 300 }), async (req, res) => {
  try {
    const limit = req.query.limit || 8;
    const result = await executeQuery(
      'SELECT * FROM featured_athletes ORDER BY featured_date DESC LIMIT $1',
      [limit]
    );
    res.json(result);
  } catch (error) {
    console.error('Error fetching featured athletes:', error);
    res.status(500).json({ error: 'Failed to fetch featured athletes' });
  }
});

// Content blocks with longer caching (changes less frequently)
router.get('/content-blocks/section/:sectionKey', cacheMiddleware({ ttl: 3600 }), async (req, res) => {
  try {
    const { sectionKey } = req.params;
    const result = await executeQuery(
      'SELECT * FROM content_blocks WHERE section_key = $1 ORDER BY position',
      [sectionKey]
    );
    res.json(result);
  } catch (error) {
    console.error('Error fetching content blocks:', error);
    res.status(500).json({ error: 'Failed to fetch content blocks' });
  }
});

// Scout Vision feed with caching
router.get('/scout-vision', cacheMiddleware({ ttl: 300 }), async (req, res) => {
  try {
    const result = await executeQuery(
      'SELECT * FROM scout_vision_feed ORDER BY created_at DESC LIMIT 10'
    );
    res.json(result);
  } catch (error) {
    console.error('Error fetching scout vision feed:', error);
    res.status(500).json({ error: 'Failed to fetch scout vision feed' });
  }
});

// Combine events with caching
router.get('/combine-tour/events', cacheMiddleware({ ttl: 1800 }), async (req, res) => {
  try {
    const result = await executeQuery(
      'SELECT * FROM combine_events ORDER BY event_date DESC LIMIT 10'
    );
    res.json(result);
  } catch (error) {
    console.error('Error fetching combine events:', error);
    res.status(500).json({ error: 'Failed to fetch combine events' });
  }
});

// Example for user-specific caching (authenticated routes)
router.get('/user/dashboard', cacheMiddleware({
  // Generate a unique cache key for each user
  keyGenerator: (req) => `dashboard:${req.user?.id || 'anonymous'}`,
  ttl: 60 // Short TTL for user data (1 minute)
}), async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  try {
    // Get user's dashboard data
    const userData = await executeQuery(
      'SELECT * FROM user_dashboard WHERE user_id = $1',
      [req.user.id]
    );
    
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;