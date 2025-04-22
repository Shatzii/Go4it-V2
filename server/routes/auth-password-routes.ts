import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { comparePasswords, hashPassword } from '../auth';
import { isAuthenticatedMiddleware } from '../middleware/auth-middleware';

const router = Router();

// Validation schema for password change
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
      message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});

/**
 * Change password endpoint
 * Requires user to be authenticated and provide current password
 */
router.post('/change-password', isAuthenticatedMiddleware, async (req, res) => {
  try {
    // Validate request body
    const validationResult = changePasswordSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: "Invalid input", 
        errors: validationResult.error.errors 
      });
    }

    const { currentPassword, newPassword } = validationResult.data;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Get user from storage
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await comparePasswords(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Ensure new password is different from current
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password in storage
    await storage.updateUserPassword(userId, hashedPassword);

    // Log the password change (for security auditing)
    console.log(`User ${userId} changed their password`);

    // Return success
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "Failed to change password" });
  }
});

export default router;