import { Router, Request, Response } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import { generateTokens, verifyAccessToken } from "../services/auth-token-service";
import { validateRequest } from "../middleware/validation-middleware";
import { isAuthenticatedMiddleware } from "../middleware/auth-middleware";

const scryptAsync = promisify(scrypt);

// User validation schema for registration
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  name: z.string().min(1, "Full name is required"),
  role: z.enum(["athlete", "coach", "parent", "admin"], {
    errorMap: () => ({ message: "Invalid role" }),
  }),
});

// Login validation schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  deviceFingerprint: z.string().optional(),
});

// Helper function to hash a password
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Helper function to compare passwords
async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

const router = Router();

/**
 * Register a new user
 * 
 * @route POST /api/auth/register
 * @param {Object} req.body - Registration information
 * @returns {Object} User information and token
 */
router.post("/register", 
  validateRequest(registerSchema),
  async (req: Request, res: Response) => {
    try {
      const { username, email, password, name, role } = req.body;

      // Check if username already exists
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Check if email already exists
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user in database
      const newUser = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        name,
        role
      });

      if (!newUser) {
        return res.status(500).json({ message: "Failed to create user" });
      }

      // Generate authentication tokens
      const deviceFingerprint = req.body.deviceFingerprint || `web-${Math.random().toString(36).substring(2)}`;
      const tokens = generateTokens(newUser.id, newUser.role || 'user', deviceFingerprint);

      // Return user info and token
      return res.status(201).json({
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          createdAt: newUser.createdAt,
          profileImage: newUser.profileImage,
          bio: newUser.bio,
          measurementSystem: newUser.measurementSystem,
          phoneNumber: newUser.phoneNumber
        },
        ...tokens
      });
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).json({ message: "Registration failed" });
    }
});

/**
 * Login user
 * 
 * @route POST /api/auth/login
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Object} User information and token
 */
router.post("/login", 
  validateRequest(loginSchema),
  async (req: Request, res: Response) => {
    try {
      const { username, password, deviceFingerprint } = req.body;

      // Find user
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Verify password
      const isPasswordValid = await comparePasswords(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Generate authentication tokens
      const device = deviceFingerprint || `web-${Math.random().toString(36).substring(2)}`;
      const tokens = generateTokens(user.id, user.role || 'user', device);
      
      // Return user info and token
      return res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          profileImage: user.profileImage,
          bio: user.bio,
          measurementSystem: user.measurementSystem,
          phoneNumber: user.phoneNumber
        },
        ...tokens
      });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ message: "Login failed" });
    }
});

/**
 * Get current user information
 * 
 * @route GET /api/auth/me
 * @returns {Object} User information
 */
router.get("/me", isAuthenticatedMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Get fresh user data
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data (excluding password)
    return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      profileImage: user.profileImage,
      bio: user.bio,
      measurementSystem: user.measurementSystem,
      phoneNumber: user.phoneNumber
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Failed to fetch user information" });
  }
});

/**
 * Refresh access token
 * 
 * @route POST /api/auth/refresh
 * @param {string} refreshToken - Refresh token
 * @returns {Object} New access token
 */
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Call the refresh token service
    const tokens = await storage.refreshToken(refreshToken);
    
    if (!tokens) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    return res.status(200).json(tokens);
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ message: "Failed to refresh token" });
  }
});

/**
 * Logout user
 * 
 * @route POST /api/auth/logout
 * @returns {Object} Success message
 */
router.post("/logout", isAuthenticatedMiddleware, async (req: Request, res: Response) => {
  try {
    // Get the sessionId from the token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ message: "Invalid authorization header" });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    
    if (!payload || !payload.sessionId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Invalidate this session
    const success = await storage.invalidateSession(payload.sessionId);

    return res.status(200).json({ 
      message: "Logout successful", 
      success 
    });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
});

export default router;