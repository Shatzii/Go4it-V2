import { Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { storage } from '../storage';
import { isAuthenticatedMiddleware as isAuthenticated } from '../auth';
import { z } from 'zod';
import { sendEmailNotification } from '../services/notification-service';
import { validateRequest } from '../middleware/validation-middleware';

const router = Router();

/**
 * Email service configuration
 * This would connect to an email service like SendGrid
 */
const emailDefaults = {
  from: 'no-reply@go4itsports.com',
  resetSubject: 'Go4It Sports Password Reset Request',
  resetTemplate: (token: string, username: string) => `
    <h2>Password Reset Request</h2>
    <p>Hi ${username},</p>
    <p>We received a request to reset your password for your Go4It Sports account.</p>
    <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
    <a href="${process.env.PUBLIC_URL || 'http://localhost:3000'}/password-reset?token=${token}" style="background-color: #065fd4; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; margin: 10px 0;">Reset Password</a>
    <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
    <p>Thanks,<br>The Go4It Sports Team</p>
  `
};

// In-memory token storage (would be replaced with database storage in production)
const resetTokens = new Map<string, { email: string, expires: Date }>();

// Validation schemas
const requestResetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" })
});

const resetPasswordSchema = z.object({
  token: z.string().uuid({ message: "Invalid reset token" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
      message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    })
});

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
      message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    })
});

/**
 * Request a password reset
 * 
 * @route POST /api/auth/request-reset
 * @param {string} email - User's email address
 * @returns {Object} Success message
 */
router.post('/request-reset', 
  validateRequest(requestResetSchema), 
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Don't reveal that the email doesn't exist for security
        return res.status(200).json({ 
          message: "If your email is in our system, you will receive a password reset link shortly" 
        });
      }
      
      // Generate a unique token
      const token = uuidv4();
      
      // Set token expiration (1 hour)
      const expires = new Date();
      expires.setHours(expires.getHours() + 1);
      
      // Store token in memory map (would store in database in production)
      resetTokens.set(token, { email, expires });
      
      // Send email with reset link
      try {
        await sendEmailNotification({
          to: email,
          from: emailDefaults.from,
          subject: emailDefaults.resetSubject,
          html: emailDefaults.resetTemplate(token, user.username || user.name)
        });
        
        console.log(`Password reset email sent to ${email}`);
      } catch (emailError) {
        console.error('Error sending password reset email:', emailError);
        // Even if email fails, don't reveal this to the user for security
      }
      
      // Return success response
      return res.status(200).json({ 
        message: "If your email is in our system, you will receive a password reset link shortly" 
      });
      
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return res.status(500).json({ message: "An error occurred while processing your request" });
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
router.post('/reset-password', 
  validateRequest(resetPasswordSchema),
  async (req: Request, res: Response) => {
    try {
      const { token, email, password } = req.body;
      
      // Check if token exists and is valid
      const tokenInfo = resetTokens.get(token);
      
      if (!tokenInfo) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      
      // Check if token is for the correct email
      if (tokenInfo.email !== email) {
        return res.status(400).json({ message: "Invalid email for this token" });
      }
      
      // Check if token is expired
      if (new Date() > tokenInfo.expires) {
        resetTokens.delete(token);
        return res.status(400).json({ message: "Token has expired. Please request a new password reset" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update user's password
      await storage.updateUserPassword(user.id, hashedPassword);
      
      // Delete the used token
      resetTokens.delete(token);
      
      // Return success response
      return res.status(200).json({ message: "Password has been reset successfully" });
      
    } catch (error) {
      console.error('Error resetting password:', error);
      return res.status(500).json({ message: "An error occurred while processing your request" });
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
router.post('/change-password', isAuthenticated, 
  validateRequest(changePasswordSchema),
  async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = (req.user as any).id;
      
      // Get user from database
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if current password is correct
      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      // Make sure new password is different from current
      if (currentPassword === newPassword) {
        return res.status(400).json({ message: "New password must be different from current password" });
      }
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update user's password
      await storage.updateUserPassword(userId, hashedPassword);
      
      // Return success response
      return res.status(200).json({ message: "Password changed successfully" });
      
    } catch (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({ message: "An error occurred while processing your request" });
    }
});

export default router;