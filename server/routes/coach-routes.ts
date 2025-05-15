import { Router, Request } from "express";
import { storage } from "../storage";
import { isAuthenticatedMiddleware, isAdminMiddleware } from '../middleware/auth-middleware';
import * as accessControl from '../middleware/access-control';
import { z } from "zod";
import { insertCoachConnectionSchema } from "@shared/schema";

// Extended request type to ensure authenticated user
interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    role: string;
    [key: string]: any;
  };
}

// Create middleware object for consistent access patterns
const middleware = {
  auth: { 
    isAuthenticated: isAuthenticatedMiddleware, 
    isAdmin: isAdminMiddleware 
  },
  accessControl
};

const router = Router();
const { isAuthenticated, isAdmin } = middleware.auth;
const { requireRole, ROLES } = middleware.accessControl;
const { COACH, ADMIN } = ROLES;

/**
 * @route GET /api/coach/connections
 * @desc Get all connections for the logged in coach
 * @access Private (Coach, Admin)
 */
router.get(
  "/connections",
  isAuthenticated,
  requireRole([COACH, ADMIN]),
  async (req, res) => {
    try {
      const connections = await storage.getCoachConnections(req.user.id);
      
      // Fetch athlete details for each connection
      const connectionDetails = await Promise.all(
        connections.map(async (c) => {
          const athlete = await storage.getUser(c.athleteId);
          
          return {
            ...c,
            athlete: athlete ? {
              id: athlete.id,
              username: athlete.username,
              name: athlete.name,
              email: athlete.email,
              profileImage: athlete.profileImage,
              role: athlete.role
            } : null
          };
        })
      );
      
      return res.status(200).json(connectionDetails);
    } catch (error) {
      console.error("Error fetching coach connections:", error);
      return res.status(500).json({ 
        message: "Failed to fetch coach connections" 
      });
    }
  }
);

/**
 * @route GET /api/coach/connections/:athleteId
 * @desc Check if a connection exists between coach and athlete
 * @access Private (Coach, Admin)
 */
router.get(
  "/connections/:athleteId",
  isAuthenticated,
  requireRole([COACH, ADMIN]),
  async (req, res) => {
    try {
      const athleteId = parseInt(req.params.athleteId);
      if (isNaN(athleteId)) {
        return res.status(400).json({ message: "Invalid athlete ID" });
      }
      
      const connection = await storage.getCoachConnectionByIds(req.user.id, athleteId);
      
      if (!connection) {
        return res.status(404).json({ 
          message: "No connection found between coach and athlete",
          exists: false
        });
      }
      
      // Get athlete details
      const athlete = await storage.getUser(athleteId);
      
      return res.status(200).json({ 
        connection,
        athlete: athlete ? {
          id: athlete.id,
          username: athlete.username,
          name: athlete.name,
          email: athlete.email,
          profileImage: athlete.profileImage,
          role: athlete.role
        } : null,
        exists: true
      });
    } catch (error) {
      console.error("Error checking coach-athlete connection:", error);
      return res.status(500).json({ 
        message: "Failed to check coach-athlete connection" 
      });
    }
  }
);

/**
 * @route POST /api/coach/connections
 * @desc Create a new coach-athlete connection
 * @access Private (Coach, Admin)
 */
router.post(
  "/connections",
  isAuthenticated,
  requireRole([COACH, ADMIN]),
  async (req, res) => {
    try {
      // Validate request body using Zod schema
      const validationResult = insertCoachConnectionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid connection data",
          errors: validationResult.error.format()
        });
      }
      
      const { athleteId } = validationResult.data;
      
      // Check if athlete exists
      const athlete = await storage.getUser(athleteId);
      if (!athlete) {
        return res.status(404).json({ message: "Athlete not found" });
      }
      
      // Check if the user is actually an athlete
      if (athlete.role !== 'athlete') {
        return res.status(400).json({ 
          message: "The specified user is not an athlete" 
        });
      }
      
      // Check if connection already exists
      const existingConnection = await storage.getCoachConnectionByIds(req.user.id, athleteId);
      if (existingConnection) {
        return res.status(409).json({ 
          message: "Connection already exists",
          connection: existingConnection
        });
      }
      
      // Create new connection
      const connection = await storage.createCoachConnection({
        coachId: req.user.id,
        athleteId,
        connectionStatus: req.body.connectionStatus || 'pending',
        notes: req.body.notes || null,
        lastContact: new Date()
      });
      
      return res.status(201).json(connection);
    } catch (error) {
      console.error("Error creating coach-athlete connection:", error);
      return res.status(500).json({ 
        message: "Failed to create coach-athlete connection" 
      });
    }
  }
);

/**
 * @route PUT /api/coach/connections/:id
 * @desc Update a coach-athlete connection
 * @access Private (Coach, Admin)
 */
router.put(
  "/connections/:id",
  isAuthenticated,
  requireRole([COACH, ADMIN]),
  async (req, res) => {
    try {
      const connectionId = parseInt(req.params.id);
      if (isNaN(connectionId)) {
        return res.status(400).json({ message: "Invalid connection ID" });
      }
      
      // Get existing connection 
      const connections = await storage.getCoachConnections(req.user.id);
      const connection = connections.find(c => c.id === connectionId);
      
      if (!connection) {
        return res.status(404).json({ 
          message: "Connection not found or you don't have permission to update it" 
        });
      }
      
      // Update connection
      const updatedConnection = await storage.updateCoachConnection(
        connectionId, 
        {
          connectionStatus: req.body.connectionStatus,
          notes: req.body.notes,
          lastContact: new Date()
        }
      );
      
      return res.status(200).json(updatedConnection);
    } catch (error) {
      console.error("Error updating coach-athlete connection:", error);
      return res.status(500).json({ 
        message: "Failed to update coach-athlete connection" 
      });
    }
  }
);

/**
 * @route DELETE /api/coach/connections/:id
 * @desc Delete a coach-athlete connection
 * @access Private (Coach, Admin)
 */
router.delete(
  "/connections/:id",
  isAuthenticated,
  requireRole([COACH, ADMIN]),
  async (req, res) => {
    try {
      const connectionId = parseInt(req.params.id);
      if (isNaN(connectionId)) {
        return res.status(400).json({ message: "Invalid connection ID" });
      }
      
      // Get existing connection to verify ownership
      const connections = await storage.getCoachConnections(req.user.id);
      const connection = connections.find(c => c.id === connectionId);
      
      if (!connection) {
        return res.status(404).json({ 
          message: "Connection not found or you don't have permission to delete it" 
        });
      }
      
      // Delete connection
      const success = await storage.deleteCoachConnection(connectionId);
      
      if (success) {
        return res.status(200).json({ message: "Connection deleted successfully" });
      } else {
        return res.status(500).json({ message: "Failed to delete connection" });
      }
    } catch (error) {
      console.error("Error deleting coach-athlete connection:", error);
      return res.status(500).json({ 
        message: "Failed to delete coach-athlete connection" 
      });
    }
  }
);

export default router;