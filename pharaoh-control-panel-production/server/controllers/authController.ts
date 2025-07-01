import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { storage } from '../storage';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authController = {
  // Register new user
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.upsertUser({
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
        firstName,
        lastName,
        plan: 'free'
      });

      res.json({ message: 'User created successfully', userId: user.id });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  },

  // Login user
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Set session
      (req.session as any).userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  },

  // Logout user
  logout: (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  },

  // Get current user
  getCurrentUser: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  }
};