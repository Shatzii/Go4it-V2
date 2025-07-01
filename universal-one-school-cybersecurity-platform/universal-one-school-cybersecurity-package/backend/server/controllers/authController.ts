import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { storage } from '../storage';
import { insertUserSchema, User } from '@shared/schema';

/**
 * Authentication Controller
 * 
 * Handles user authentication, registration and session management
 */
export const authController = {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response) {
    try {
      // Validate request body
      const validation = insertUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid user data',
          errors: validation.error.errors
        });
      }
      
      const { username, email, password, role, clientId } = req.body;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create new user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        role: role || 'user',
        clientId,
        isActive: true
      });
      
      // Don't return the password hash
      const { password: pwd, ...userWithoutPassword } = user;
      
      res.status(201).json({
        message: 'User registered successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Failed to register user' });
    }
  },
  
  /**
   * User login
   */
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is inactive' });
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      // Set session data
      req.session.userId = user.id;
      req.session.clientId = user.clientId;
      req.session.role = user.role;
      
      // Don't return the password
      const { password: pwd, ...userWithoutPassword } = user;
      
      res.json({
        message: 'Login successful',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  },
  
  /**
   * User logout
   */
  async logout(req: Request, res: Response) {
    try {
      // Destroy session
      req.session.destroy((err) => {
        if (err) {
          throw err;
        }
        
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
      });
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).json({ message: 'Logout failed' });
    }
  },
  
  /**
   * Get current user info
   */
  async me(req: Request, res: Response) {
    try {
      const userId = req.session.userId;
      
      // Check if user is authenticated
      if (!userId) {
        console.log('User not authenticated - no userId in session');
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      // Find user by ID
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      
      res.json({
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      res.status(500).json({ message: 'Failed to get user info' });
    }
  },
  
  /**
   * Refresh session
   */
  async refresh(req: Request, res: Response) {
    try {
      const userId = req.session.userId;
      
      // Check if user is authenticated
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      // Session refreshed automatically by touching it
      req.session.touch();
      
      res.json({ message: 'Session refreshed' });
    } catch (error) {
      console.error('Error refreshing session:', error);
      res.status(500).json({ message: 'Failed to refresh session' });
    }
  },
  
  /**
   * Request password reset
   */
  async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      // In a real application, we would:
      // 1. Generate a password reset token
      // 2. Store it with an expiration time
      // 3. Send a reset link to the user's email
      
      // For demo purposes, we'll just acknowledge the request
      res.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.',
        // Don't confirm if the email exists in the system for security reasons
      });
    } catch (error) {
      console.error('Error requesting password reset:', error);
      res.status(500).json({ message: 'Failed to process password reset request' });
    }
  },
  
  /**
   * Reset password
   */
  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ message: 'Token and new password are required' });
      }
      
      // In a real application, we would:
      // 1. Verify the reset token
      // 2. Check if it's still valid (not expired)
      // 3. Update the user's password
      
      // For demo purposes, we'll just acknowledge the request
      res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Failed to reset password' });
    }
  },
  
  /**
   * Change password (for authenticated users)
   */
  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.session.userId;
      
      // Check if user is authenticated
      if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' });
      }
      
      // Find user by ID
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update user's password
      // In a real application, we would have a method to update the user's password
      // For now, we'll just acknowledge the request
      
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Failed to change password' });
    }
  }
};