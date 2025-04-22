import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { isAuthenticatedMiddleware } from "../middleware/auth-middleware";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { 
  onboardingProgress, 
  users,
  athleteProfiles,
  insertOnboardingProgressSchema,
  insertAthleteProfileSchema
} from "@shared/schema";
import { z } from "zod";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";

const router = Router();

// Default middleware for all routes in this file
router.use(isAuthenticatedMiddleware);

/**
 * @route GET /api/onboarding/status
 * @description Get onboarding status for the current user
 * @access Private
 */
router.get("/status", async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    
    // Get onboarding status
    const status = await storage.getUserOnboardingStatus(userId);
    
    if (!status) {
      // Create initial onboarding progress if not exists
      const newStatus = await storage.createOnboardingProgress({
        userId,
        isCompleted: false,
        currentStep: 1,
        totalSteps: 5,
        lastUpdated: new Date(),
      });
      
      return res.json(newStatus);
    }
    
    return res.json(status);
  } catch (error) {
    console.error("Error getting onboarding status:", error);
    return res.status(500).json({ message: "Error getting onboarding status" });
  }
});

/**
 * @route POST /api/onboarding/complete-step/:stepId
 * @description Mark a specific onboarding step as completed
 * @access Private
 */
router.post("/complete-step/:stepId", async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const stepId = parseInt(req.params.stepId);
    
    if (isNaN(stepId) || stepId < 1 || stepId > 5) {
      return res.status(400).json({ message: "Invalid step ID" });
    }
    
    // Get current onboarding progress
    const currentProgress = await storage.getOnboardingProgress(userId, stepId);
    
    // Complete the step and update progress
    await storage.completeOnboardingStep(userId, stepId);
    
    // If this was the last step in sequence, move to the next step
    if (currentProgress && stepId === currentProgress.currentStep && stepId < currentProgress.totalSteps) {
      await storage.updateOnboardingProgress(userId, {
        currentStep: stepId + 1,
        lastUpdated: new Date(),
      });
    }
    
    // Get updated progress
    const updatedProgress = await storage.getOnboardingProgress(userId, stepId);
    
    return res.json(updatedProgress);
  } catch (error) {
    console.error("Error completing onboarding step:", error);
    return res.status(500).json({ message: "Error completing onboarding step" });
  }
});

/**
 * @route POST /api/onboarding/skip-step/:stepId
 * @description Skip a specific onboarding step
 * @access Private
 */
router.post("/skip-step/:stepId", async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const stepId = parseInt(req.params.stepId);
    
    if (isNaN(stepId) || stepId < 1 || stepId > 5) {
      return res.status(400).json({ message: "Invalid step ID" });
    }
    
    // Get current onboarding progress
    const currentProgress = await storage.getOnboardingProgress(userId, stepId);
    
    if (!currentProgress) {
      return res.status(404).json({ message: "Onboarding progress not found" });
    }
    
    // Skip this step and move to the next one
    await storage.updateOnboardingProgress(userId, {
      currentStep: stepId < currentProgress.totalSteps ? stepId + 1 : stepId,
      lastUpdated: new Date(),
    });
    
    // Get updated progress
    const updatedProgress = await storage.getOnboardingProgress(userId, stepId);
    
    return res.json(updatedProgress);
  } catch (error) {
    console.error("Error skipping onboarding step:", error);
    return res.status(500).json({ message: "Error skipping onboarding step" });
  }
});

/**
 * @route POST /api/onboarding/update-profile
 * @description Update basic profile information (step 1)
 * @access Private
 */
router.post("/update-profile", async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    
    // Schema validation for profile update
    const profileSchema = z.object({
      firstName: z.string().min(2).optional(),
      lastName: z.string().min(2).optional(),
      username: z.string().min(3).optional(),
      email: z.string().email().optional(),
      bio: z.string().max(500).optional(),
      profileImage: z.string().nullable().optional(),
      dateOfBirth: z.string().optional().transform(val => val ? new Date(val) : null),
    });
    
    // Validate the request body
    const result = profileSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid profile data", errors: result.error.format() });
    }
    
    const { firstName, lastName, username, email, bio, profileImage, dateOfBirth } = result.data;
    
    // Prepare user data update
    const userData: any = {};
    
    if (firstName && lastName) {
      userData.name = `${firstName} ${lastName}`;
    }
    
    if (username) userData.username = username;
    if (email) userData.email = email;
    if (bio !== undefined) userData.bio = bio;
    if (profileImage !== undefined) userData.profileImageUrl = profileImage;
    
    // Update user data in the database
    await storage.updateUser(userId, userData);
    
    // Create or update athlete profile with additional data
    let athleteProfile = await storage.getAthleteProfile(userId);
    
    if (athleteProfile) {
      await storage.updateAthleteProfile(athleteProfile.id, {
        dateOfBirth: dateOfBirth || undefined,
      });
    } else {
      await storage.createAthleteProfile({
        userId,
        dateOfBirth: dateOfBirth || undefined,
      });
    }
    
    return res.json({ 
      message: "Profile updated successfully",
      updated: {
        user: userData,
        athleteProfile: { dateOfBirth }
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Error updating profile" });
  }
});

/**
 * @route POST /api/onboarding/sports-interest
 * @description Update sports interests (step 2)
 * @access Private
 */
router.post("/sports-interest", async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    
    // Schema validation for sports interest
    const sportsSchema = z.object({
      sports: z.array(z.string()).min(1),
      positions: z.array(z.string()).optional(),
      level: z.string().optional(),
    });
    
    // Validate the request body
    const result = sportsSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid sports data", errors: result.error.format() });
    }
    
    const { sports, positions, level } = result.data;
    
    // Update user data with sports interest
    await storage.updateUser(userId, { 
      sportsInterest: sports.join(',') 
    });
    
    // Create or update athlete profile with positions and level
    let athleteProfile = await storage.getAthleteProfile(userId);
    
    if (athleteProfile) {
      await storage.updateAthleteProfile(athleteProfile.id, {
        positions: positions ? positions.join(',') : undefined,
        skillLevel: level,
      });
    } else {
      await storage.createAthleteProfile({
        userId,
        positions: positions ? positions.join(',') : undefined,
        skillLevel: level,
      });
    }
    
    return res.json({ 
      message: "Sports interests updated successfully",
      updated: {
        sports,
        positions,
        level
      }
    });
  } catch (error) {
    console.error("Error updating sports interests:", error);
    return res.status(500).json({ message: "Error updating sports interests" });
  }
});

/**
 * @route POST /api/onboarding/physical-attributes
 * @description Update physical attributes (step 3)
 * @access Private
 */
router.post("/physical-attributes", async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    
    // Schema validation for physical attributes
    const physicalSchema = z.object({
      height: z.number().nullable().optional(),
      weight: z.number().nullable().optional(),
      wingspan: z.number().nullable().optional(),
      handedness: z.enum(["left", "right", "ambidextrous"]).nullable().optional(),
      verticalJump: z.number().nullable().optional(),
    });
    
    // Validate the request body
    const result = physicalSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid physical data", errors: result.error.format() });
    }
    
    // Update physical attributes in athlete profile
    await storage.updateUserPhysicalAttributes(userId, result.data);
    
    return res.json({ 
      message: "Physical attributes updated successfully",
      updated: result.data
    });
  } catch (error) {
    console.error("Error updating physical attributes:", error);
    return res.status(500).json({ message: "Error updating physical attributes" });
  }
});

/**
 * @route POST /api/onboarding/accessibility-preferences
 * @description Update accessibility preferences (step 4)
 * @access Private
 */
router.post("/accessibility-preferences", async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    
    // Schema validation for accessibility preferences
    const accessibilitySchema = z.object({
      adhd: z.boolean().optional(),
      focusMode: z.boolean().optional(),
      animationReduction: z.enum(["none", "reduced", "minimal"]).optional(),
      colorScheme: z.enum(["default", "high-contrast", "dark", "light"]).optional(),
      textSize: z.enum(["default", "large", "x-large"]).optional(),
      contrastLevel: z.enum(["default", "high", "very-high"]).optional(),
      soundEffects: z.boolean().optional(),
    });
    
    // Validate the request body
    const result = accessibilitySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid accessibility data", errors: result.error.format() });
    }
    
    // Update accessibility preferences
    await storage.updateUserAccessibilityPreferences(userId, result.data);
    
    return res.json({ 
      message: "Accessibility preferences updated successfully",
      updated: result.data
    });
  } catch (error) {
    console.error("Error updating accessibility preferences:", error);
    return res.status(500).json({ message: "Error updating accessibility preferences" });
  }
});

/**
 * @route POST /api/onboarding/complete
 * @description Mark the onboarding process as completed
 * @access Private
 */
router.post("/complete", async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    
    // Mark onboarding as complete
    await storage.completeOnboarding(userId);
    
    // Update user status
    await storage.updateUser(userId, {
      onboardingCompleted: true
    });
    
    return res.json({ 
      message: "Onboarding completed successfully" 
    });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return res.status(500).json({ message: "Error completing onboarding" });
  }
});

/**
 * @route POST /api/onboarding/parent-verification
 * @description Send verification email to parent for athletes under 18
 * @access Private
 */
router.post("/parent-verification", async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    
    // Schema validation for parent contact
    const parentSchema = z.object({
      parentName: z.string().min(2),
      parentEmail: z.string().email(),
    });
    
    // Validate the request body
    const result = parentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid parent data", errors: result.error.format() });
    }
    
    const { parentName, parentEmail } = result.data;
    
    // Generate a verification token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // Token valid for 48 hours
    
    // Save the token to the database
    await storage.createParentVerificationToken({
      userId,
      token,
      parentEmail,
      expiresAt,
      isVerified: false,
    });
    
    // Send verification email
    // Note: In a real deployment, you would use a real SMTP service
    // For development, we'll just log the email content
    
    const verificationLink = `${req.protocol}://${req.get('host')}/api/onboarding/verify-parent/${token}`;
    
    console.log(`
    To: ${parentEmail}
    Subject: Parent Verification for Go4It Sports
    
    Hello ${parentName},
    
    Your child has registered for Go4It Sports and needs your verification.
    Please click the link below to verify your child's account:
    
    ${verificationLink}
    
    This link will expire in 48 hours.
    
    Thank you,
    The Go4It Sports Team
    `);
    
    // For development/testing purposes, you can use nodemailer with Ethereal
    // to get a preview URL for the email
    if (process.env.NODE_ENV === 'development') {
      // Note that we're checking for a dev environment - this would not run in production
      try {
        // Generate test SMTP service account
        const testAccount = await nodemailer.createTestAccount();
        
        // Create a transporter for Ethereal
        const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        
        // Send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Go4It Sports" <noreply@go4itsports.com>',
          to: parentEmail,
          subject: "Parent Verification for Go4It Sports",
          text: `
          Hello ${parentName},
          
          Your child has registered for Go4It Sports and needs your verification.
          Please click the link below to verify your child's account:
          
          ${verificationLink}
          
          This link will expire in 48 hours.
          
          Thank you,
          The Go4It Sports Team
          `,
          html: `
          <div>
            <h2>Parent Verification for Go4It Sports</h2>
            <p>Hello ${parentName},</p>
            <p>Your child has registered for Go4It Sports and needs your verification.</p>
            <p>Please click the link below to verify your child's account:</p>
            <p><a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #4a90e2; color: white; text-decoration: none; border-radius: 4px;">Verify Account</a></p>
            <p>This link will expire in 48 hours.</p>
            <p>Thank you,<br>The Go4It Sports Team</p>
          </div>
          `,
        });
        
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      } catch (emailError) {
        console.error("Error sending test email:", emailError);
      }
    }
    
    // Create or update athlete profile with parent info
    let athleteProfile = await storage.getAthleteProfile(userId);
    
    if (athleteProfile) {
      await storage.updateAthleteProfile(athleteProfile.id, {
        parentName,
        parentEmail,
        parentVerified: false,
      });
    } else {
      await storage.createAthleteProfile({
        userId,
        parentName,
        parentEmail,
        parentVerified: false,
      });
    }
    
    return res.json({ 
      message: "Parent verification email sent",
      verified: false,
      parentEmail
    });
  } catch (error) {
    console.error("Error sending parent verification:", error);
    return res.status(500).json({ message: "Error sending parent verification" });
  }
});

/**
 * @route GET /api/onboarding/verify-parent/:token
 * @description Verify parent email using token
 * @access Public (no authentication required for the link in the email)
 */
router.get("/verify-parent/:token", async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    
    if (!token) {
      return res.status(400).json({ message: "Invalid verification token" });
    }
    
    // Check if token exists and is valid
    const verification = await storage.verifyParentToken(token);
    
    if (!verification) {
      return res.status(404).json({ message: "Verification token not found or expired" });
    }
    
    if (verification.isVerified) {
      return res.send(`
        <h1>Already Verified</h1>
        <p>This account has already been verified. No further action is needed.</p>
      `);
    }
    
    // Update token as verified
    await storage.updateParentVerification(token, true);
    
    // Update athlete profile as parent verified
    let athleteProfile = await storage.getAthleteProfile(verification.userId);
    
    if (athleteProfile) {
      await storage.updateAthleteProfile(athleteProfile.id, {
        parentVerified: true,
      });
    }
    
    // Send a success page
    return res.send(`
      <h1>Verification Successful</h1>
      <p>Thank you for verifying your child's account. They can now fully access Go4It Sports.</p>
    `);
  } catch (error) {
    console.error("Error verifying parent token:", error);
    return res.status(500).send(`
      <h1>Verification Error</h1>
      <p>There was an error processing your verification. Please try again or contact support.</p>
    `);
  }
});

/**
 * @route GET /api/onboarding/preferences
 * @description Get user's accessibility preferences
 * @access Private
 */
router.get("/preferences", async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    
    // Get user accessibility preferences
    const preferences = await storage.getUserAccessibilityPreferences(userId);
    
    return res.json(preferences);
  } catch (error) {
    console.error("Error getting accessibility preferences:", error);
    return res.status(500).json({ message: "Error getting accessibility preferences" });
  }
});

export default router;