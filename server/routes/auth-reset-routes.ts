import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { isAuthenticatedMiddleware } from '../middleware/auth-middleware';

/**
 * Email service configuration
 * This would connect to an email service like SendGrid
 */
const emailService = {
  sendPasswordResetEmail: async (to: string, resetLink: string) => {
    // In a real implementation, this would use SendGrid or similar
    console.log(`Sending password reset email to ${to}`);
    console.log(`Reset link: ${resetLink}`);
    
    // Check if SendGrid API key is available
    if (process.env.SENDGRID_API_KEY) {
      try {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const msg = {
          to,
          from: process.env.EMAIL_FROM || 'noreply@go4itsports.com',
          subject: 'Reset Your Go4It Sports Password',
          text: `Click the following link to reset your password: ${resetLink}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #1E40AF; padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">Go4It Sports</h1>
              </div>
              <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
                <h2>Reset Your Password</h2>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetLink}" style="background-color: #1E40AF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
                </div>
                <p>If you didn't request a password reset, you can ignore this email. Your password will not be changed.</p>
                <p>This link will expire in 1 hour for security reasons.</p>
                <p style="margin-top: 30px; font-size: 12px; color: #666;">
                  If the button above doesn't work, copy and paste this URL into your browser:<br>
                  <a href="${resetLink}" style="word-break: break-all;">${resetLink}</a>
                </p>
              </div>
              <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                <p>&copy; ${new Date().getFullYear()} Go4It Sports. All rights reserved.</p>
              </div>
            </div>
          `,
        };
        
        await sgMail.send(msg);
        return true;
      } catch (error) {
        console.error('Error sending email:', error);
        return false;
      }
    } else {
      // Development mode - just log the reset link
      console.log(`Development mode: Password reset link would be sent to ${to}`);
      return true;
    }
  }
};

// In-memory store for reset tokens (would use database in production)
const resetTokens = new Map<string, { email: string, expires: Date }>();

// Create router
const router = Router();

// Schema for request reset
const requestResetSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

// Schema for password reset
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

/**
 * Request a password reset
 * 
 * @route POST /api/auth/request-reset
 * @param {string} email - User's email address
 * @returns {Object} Success message
 */
router.post('/request-reset', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const result = requestResetSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: result.error.errors 
      });
    }
    
    const { email } = result.data;
    
    // Find user by email
    const user = await storage.getUserByEmail(email);
    
    // Don't reveal if user exists or not for security
    if (!user) {
      return res.status(200).json({ 
        message: "If your email is registered, you will receive a password reset link" 
      });
    }
    
    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour
    
    // Store token (in production, this would be in a database)
    resetTokens.set(token, { email, expires });
    
    // Generate reset link
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const resetLink = `${baseUrl}/password-reset?token=${token}&email=${encodeURIComponent(email)}`;
    
    // Send reset email
    const emailSent = await emailService.sendPasswordResetEmail(email, resetLink);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send reset email" });
    }
    
    return res.status(200).json({ 
      message: "If your email is registered, you will receive a password reset link" 
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Reset password with token
 * 
 * @route POST /api/auth/reset-password
 * @param {string} token - Reset token
 * @param {string} email - User's email
 * @param {string} password - New password
 * @returns {Object} Success message
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const result = resetPasswordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: result.error.errors 
      });
    }
    
    const { token, email, password } = result.data;
    
    // Verify token
    const tokenData = resetTokens.get(token);
    if (!tokenData || tokenData.email !== email) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    
    // Check if token is expired
    if (tokenData.expires < new Date()) {
      resetTokens.delete(token);
      return res.status(400).json({ message: "Token has expired" });
    }
    
    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update user password
    await storage.updateUserPassword(user.id, hashedPassword);
    
    // Delete used token
    resetTokens.delete(token);
    
    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Change password (for authenticated users)
 * 
 * @route POST /api/auth/change-password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Object} Success message
 */
router.post('/change-password', isAuthenticatedMiddleware, async (req: Request, res: Response) => {
  try {
    // Validate request body
    const changePasswordSchema = z.object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    });
    
    const result = changePasswordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: result.error.errors 
      });
    }
    
    const { currentPassword, newPassword } = result.data;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Get user
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password
    await storage.updateUserPassword(userId, hashedPassword);
    
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;