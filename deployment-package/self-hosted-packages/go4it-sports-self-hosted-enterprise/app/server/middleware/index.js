/**
 * Go4It Sports - Middleware Index
 * 
 * This file exports all middleware components for easy importing
 */

const { cacheMiddleware, clearCache, generateCacheKey } = require('./cache-middleware');
const { configureCompression } = require('./compression-middleware');
const { cdnMiddleware } = require('./cdn-middleware');

// Import TypeScript modules with require syntax to maintain compatibility
const accessControl = require('./access-control');
const authMiddleware = require('./auth-middleware');
const authSentinel = require('./auth-sentinel');

// Export all middleware components
module.exports = {
  // Cache middleware
  cacheMiddleware,
  clearCache,
  generateCacheKey,
  
  // General middleware
  configureCompression,
  cdnMiddleware,
  
  // Authorization and access control (legacy)
  isAuthenticated: authMiddleware.isAuthenticatedMiddleware,
  hasRole: authMiddleware.hasRoleMiddleware,
  isAdmin: authMiddleware.isAdminMiddleware,
  
  // Security sentinel middleware
  authSentinel: authSentinel.authSentinel,
  requireAuth: authSentinel.requireAuth,
  requireRole: authSentinel.requireRole,
  requireOwnerOrAdmin: authSentinel.requireOwnerOrAdmin,
  
  // Enhanced Access Control System
  accessControl: {
    // Main authentication middleware
    enhancedAuth: accessControl.enhancedAuth,
    
    // Role-based access
    requireRole: accessControl.requireRole,
    
    // Resource permissions
    checkResourceOwnership: accessControl.checkResourceOwnership,
    requireViewPermission: accessControl.requireViewPermission,
    requireEditPermission: accessControl.requireEditPermission,
    requireDeletePermission: accessControl.requireDeletePermission,
    requireOwnership: accessControl.requireOwnership,
    
    // Relationship checks
    checkCoachAthleteRelationship: accessControl.checkCoachAthleteRelationship,
    
    // Constants
    ROLES: accessControl.ROLES,
    RESOURCES: accessControl.RESOURCES,
    
    // Helper functions
    hasRoleLevel: accessControl.hasRoleLevel,
    createPermission: accessControl.createPermission
  }
};