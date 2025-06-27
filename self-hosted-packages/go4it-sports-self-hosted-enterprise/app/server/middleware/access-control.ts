import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/auth-token-service';
import { storage } from '../storage';

// Extend Express Request type to include token and resource permissions
declare global {
  namespace Express {
    interface Request {
      token?: {
        userId: number;
        role: string;
        sessionId: string;
        permissions?: string[];
      };
      resourcePermissions?: {
        canView: boolean;
        canEdit: boolean;
        canDelete: boolean;
        isOwner: boolean;
        ownerType?: string;
      };
    }
  }
}

// Define standard roles and their hierarchy
export const ROLES = {
  GUEST: 'guest',
  ATHLETE: 'athlete',
  PARENT: 'parent',
  COACH: 'coach',
  SCOUT: 'scout',
  ADMIN: 'admin',
  SYSTEM: 'system'
};

// Define role hierarchy (higher index = more privileges)
const ROLE_HIERARCHY = [
  ROLES.GUEST,
  ROLES.ATHLETE,
  ROLES.PARENT, 
  ROLES.COACH,
  ROLES.SCOUT,
  ROLES.ADMIN,
  ROLES.SYSTEM
];

// Resource types for permissions checking
export const RESOURCES = {
  USER_PROFILE: 'user_profile',
  VIDEO: 'video',
  HIGHLIGHT: 'highlight',
  GAR_RATING: 'gar_rating',
  TRAINING_PLAN: 'training_plan',
  SKILL_TREE: 'skill_tree',
  COMBINE_EVENT: 'combine_event',
  BLOG_POST: 'blog_post',
  CONTENT_BLOCK: 'content_block'
};

/**
 * Enhanced Authentication Middleware
 * 
 * This middleware integrates both JWT and session-based authentication.
 * It first checks for a JWT token, then falls back to session authentication.
 * Upon successful authentication, it populates the request.user object.
 */
export const enhancedAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId: number | undefined = undefined;
    let userRole: string | undefined = undefined;
    
    // Step 1: Check for JWT token first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = verifyAccessToken(token);
      
      if (payload) {
        userId = payload.userId;
        userRole = payload.role;
        
        // Attach token data to request
        req.token = {
          userId: payload.userId,
          role: payload.role,
          sessionId: payload.sessionId
        };
      }
    }
    
    // Step 2: If no JWT token, check session authentication
    if (!userId && req.isAuthenticated()) {
      const sessionUser = req.user as any;
      if (sessionUser && sessionUser.id) {
        userId = sessionUser.id;
        userRole = sessionUser.role || ROLES.ATHLETE;
      }
    }
    
    // Step 3: If we found a user ID, fetch the complete user
    if (userId) {
      const user = await storage.getUser(userId);
      
      if (user) {
        // Create sanitized user object and attach it to request
        req.user = {
          id: user.id,
          username: user.username,
          role: userRole || user.role || ROLES.ATHLETE
        };
        
        // If we didn't have a token before, create one from session
        if (!req.token) {
          req.token = {
            userId: user.id,
            role: userRole || user.role || ROLES.ATHLETE,
            sessionId: req.sessionID || 'session-auth'
          };
        }
        
        return next();
      }
    }
    
    // No authentication found
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required' 
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal authentication error' 
    });
  }
};

/**
 * Role-based Access Control
 * 
 * Ensures user has one of the required roles to access the resource.
 * Support role hierarchy - if a user has a higher role than required, access is granted.
 */
export const requireRole = (roles: string | string[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const userRole = req.user.role;
    const userRoleLevel = ROLE_HIERARCHY.indexOf(userRole);
    
    // Check if user's role is directly in the allowed roles
    if (allowedRoles.includes(userRole)) {
      return next();
    }
    
    // Check if user's role is higher in hierarchy than any allowed role
    const highestAllowedLevel = Math.max(
      ...allowedRoles.map(role => ROLE_HIERARCHY.indexOf(role))
    );
    
    if (userRoleLevel >= highestAllowedLevel) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: 'Access denied: insufficient permissions'
    });
  };
};

/**
 * Resource Ownership Check
 * 
 * Verifies if the authenticated user owns the requested resource.
 * Attaches resource permissions to the request for fine-grained access control.
 */
export const checkResourceOwnership = (resourceType: string, resourceIdParam: string = 'id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const resourceId = parseInt(req.params[resourceIdParam]);
    if (isNaN(resourceId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID'
      });
    }
    
    try {
      // Set default permissions (no access)
      req.resourcePermissions = {
        canView: false,
        canEdit: false,
        canDelete: false,
        isOwner: false
      };
      
      // Admin and system roles always have full access
      if (req.user.role === ROLES.ADMIN || req.user.role === ROLES.SYSTEM) {
        req.resourcePermissions = {
          canView: true,
          canEdit: true,
          canDelete: true,
          isOwner: true,
          ownerType: 'admin'
        };
        return next();
      }
      
      // Check resource ownership based on type
      switch (resourceType) {
        case RESOURCES.USER_PROFILE:
          // User profiles - user can only access their own profile or coaches/admins can access
          if (resourceId === req.user.id) {
            req.resourcePermissions = {
              canView: true,
              canEdit: true,
              canDelete: true,
              isOwner: true,
              ownerType: 'self'
            };
          } else if (req.user.role === ROLES.COACH || req.user.role === ROLES.PARENT) {
            // Coaches and parents can view but not edit other profiles
            req.resourcePermissions = {
              canView: true,
              canEdit: false,
              canDelete: false,
              isOwner: false
            };
          }
          break;
          
        case RESOURCES.VIDEO:
          // Get video from storage
          const video = await storage.getVideo(resourceId);
          if (video) {
            if (video.userId === req.user.id) {
              // User owns the video
              req.resourcePermissions = {
                canView: true,
                canEdit: true,
                canDelete: true,
                isOwner: true,
                ownerType: 'creator'
              };
            } else if (req.user.role === ROLES.COACH) {
              // Coaches can view/comment on videos but not delete
              req.resourcePermissions = {
                canView: true,
                canEdit: true,
                canDelete: false,
                isOwner: false,
                ownerType: 'coach'
              };
            } else if (video.public) { // Using the correct field name from schema
              // Public videos are viewable by authenticated users
              req.resourcePermissions = {
                canView: true,
                canEdit: false,
                canDelete: false,
                isOwner: false
              };
            }
          }
          break;
          
        case RESOURCES.HIGHLIGHT:
          // We'll use getAllVideoHighlights and filter to get a specific one
          const highlights = await storage.getAllVideoHighlights();
          const highlight = highlights.find(h => h.id === resourceId);
          
          if (highlight) {
            const associatedVideo = highlight.videoId ? 
              await storage.getVideo(highlight.videoId) : null;
              
            if (associatedVideo && associatedVideo.userId === req.user.id) {
              // Ownership through the parent video
              req.resourcePermissions = {
                canView: true,
                canEdit: true,
                canDelete: true,
                isOwner: true,
                ownerType: 'video_owner'
              };
            } else if (highlight.userId === req.user.id) { // Using userId instead of createdBy
              // User created the highlight
              req.resourcePermissions = {
                canView: true,
                canEdit: true,
                canDelete: true,
                isOwner: true,
                ownerType: 'creator'
              };
            } else if (req.user.role === ROLES.COACH) {
              // Coaches have limited access to highlights
              req.resourcePermissions = {
                canView: true,
                canEdit: true,
                canDelete: false,
                isOwner: false,
                ownerType: 'coach'
              };
            } else if (highlight.includeOnHomePage) { // This indicates it's public
              // Public highlights are viewable by all
              req.resourcePermissions = {
                canView: true,
                canEdit: false,
                canDelete: false,
                isOwner: false
              };
            }
          }
          break;
        
        case RESOURCES.TRAINING_PLAN:
          // Training plans might be assigned to a user or created by coaches
          const trainingPlan = await storage.getAnthropicTrainingPlan(resourceId);
          if (trainingPlan) {
            if (trainingPlan.userId === req.user.id) {
              // User owns the training plan
              req.resourcePermissions = {
                canView: true,
                canEdit: true,
                canDelete: true,
                isOwner: true,
                ownerType: 'assigned'
              };
            } else if (req.user.role === ROLES.COACH) {
              // Coaches can view and edit training plans
              req.resourcePermissions = {
                canView: true,
                canEdit: true,
                canDelete: true,
                isOwner: false,
                ownerType: 'coach'
              };
            }
          }
          break;
          
        case RESOURCES.COMBINE_EVENT:
          // Public events are viewable by all
          req.resourcePermissions = {
            canView: true,
            canEdit: req.user.role === ROLES.COACH,
            canDelete: req.user.role === ROLES.COACH,
            isOwner: false
          };
          break;
          
        // Add other resource types as needed
        default:
          // Default case - no permissions
          break;
      }
      
      // Determine if access should be allowed based on request type and permissions
      const method = req.method.toUpperCase();
      
      if (method === 'GET' && req.resourcePermissions.canView) {
        return next();
      } else if ((method === 'PUT' || method === 'PATCH') && req.resourcePermissions.canEdit) {
        return next();
      } else if (method === 'DELETE' && req.resourcePermissions.canDelete) {
        return next();
      } else if (method === 'POST') {
        // POST generally means creating something new, which should be allowed
        // for authenticated users unless specific restrictions are needed
        return next();
      }
      
      // If we got here, user doesn't have sufficient permissions
      return res.status(403).json({
        success: false,
        message: 'Access denied: you do not have permission to perform this action'
      });
      
    } catch (error) {
      console.error('Resource permission error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking resource permissions'
      });
    }
  };
};

/**
 * Resource Access Check - Utility middleware
 */
export const requireViewPermission = (req: Request, res: Response, next: NextFunction) => {
  if (!req.resourcePermissions || !req.resourcePermissions.canView) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: you do not have permission to view this resource'
    });
  }
  next();
};

export const requireEditPermission = (req: Request, res: Response, next: NextFunction) => {
  if (!req.resourcePermissions || !req.resourcePermissions.canEdit) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: you do not have permission to edit this resource'
    });
  }
  next();
};

export const requireDeletePermission = (req: Request, res: Response, next: NextFunction) => {
  if (!req.resourcePermissions || !req.resourcePermissions.canDelete) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: you do not have permission to delete this resource'
    });
  }
  next();
};

export const requireOwnership = (req: Request, res: Response, next: NextFunction) => {
  if (!req.resourcePermissions || !req.resourcePermissions.isOwner) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: you do not own this resource'
    });
  }
  next();
};

/**
 * Middleware to check coach-athlete relationship
 */
export const checkCoachAthleteRelationship = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  // Extract athlete ID from request parameters
  const athleteId = parseInt(req.params.athleteId || req.params.userId);
  if (isNaN(athleteId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid athlete ID'
    });
  }
  
  try {
    // Admins have automatic access
    if (req.user.role === ROLES.ADMIN || req.user.role === ROLES.SYSTEM) {
      return next();
    }
    
    // Athletes can only access their own data
    if (req.user.role === ROLES.ATHLETE) {
      if (req.user.id === athleteId) {
        return next();
      } else {
        return res.status(403).json({
          success: false,
          message: 'Access denied: you can only view your own data'
        });
      }
    }
    
    // Parents can only access their child's data
    if (req.user.role === ROLES.PARENT) {
      // Since getParentChildRelationships is not implemented yet,
      // we'll allow parent access for now and log that this needs to be implemented
      console.log("TODO: Implement getParentChildRelationships for parent-child relationship checks");
      return next();
      
      // Future implementation:
      // const relationships = await storage.getParentChildRelationships(req.user.id);
      // const isParentOf = relationships.some(rel => rel.childId === athleteId);
      // 
      // if (isParentOf) {
      //   return next();
      // } else {
      //   return res.status(403).json({
      //     success: false,
      //     message: 'Access denied: you can only view your child\'s data'
      //   });
      // }
    }
    
    // Coaches need to check coach-athlete relationship
    if (req.user.role === ROLES.COACH) {
      const connections = await storage.getCoachConnections(req.user.id);
      const isCoachOf = connections.some(conn => 
        conn.connectionStatus === 'active' && conn.athleteId === athleteId
      );
      
      if (isCoachOf) {
        return next();
      } else {
        return res.status(403).json({
          success: false,
          message: 'Access denied: you are not this athlete\'s coach'
        });
      }
    }
    
    // Default deny access
    return res.status(403).json({
      success: false,
      message: 'Access denied: insufficient permissions'
    });
  } catch (error) {
    console.error('Error checking coach-athlete relationship:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking permissions'
    });
  }
};

/**
 * Utility Functions
 */

// Function to check if user has required role level
export const hasRoleLevel = (userRole: string, requiredRole: string): boolean => {
  const userIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  
  return userIndex >= requiredIndex;
};

// Function to create a permission object
export const createPermission = (
  canView: boolean = false,
  canEdit: boolean = false,
  canDelete: boolean = false,
  isOwner: boolean = false,
  ownerType?: string
): Request['resourcePermissions'] => {
  return {
    canView,
    canEdit,
    canDelete,
    isOwner,
    ownerType
  };
};