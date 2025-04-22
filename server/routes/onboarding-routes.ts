import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { isAuthenticatedMiddleware } from "../auth";
import { z } from "zod";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";

// Onboarding progress schema
const onboardingStepSchema = z.object({
  step: z.number().min(1).max(5)
});

// Save step data schema
const saveStepSchema = z.object({
  step: z.number().min(1).max(5),
  data: z.record(z.any())
});

// Parent verification schema
const parentVerificationSchema = z.object({
  parentEmail: z.string().email()
});

// Setup router
const router = Router();

// Middleware to ensure authentication
router.use(isAuthenticatedMiddleware);

/**
 * Get onboarding progress
 */
router.get("/progress", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const progress = await storage.getOnboardingProgress(userId);
    
    res.json(progress || {
      isCompleted: false,
      currentStep: 1,
      totalSteps: 5,
      completedSections: [],
      skippedSections: []
    });
  } catch (error) {
    console.error("Error fetching onboarding progress:", error);
    res.status(500).json({ error: "Failed to fetch onboarding progress" });
  }
});

/**
 * Update current step
 */
router.post("/update-step", async (req: Request, res: Response) => {
  try {
    const { step } = onboardingStepSchema.parse(req.body);
    const userId = req.user!.id;
    
    await storage.updateOnboardingStep(userId, step);
    
    res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    
    console.error("Error updating onboarding step:", error);
    res.status(500).json({ error: "Failed to update onboarding step" });
  }
});

/**
 * Skip a step
 */
router.post("/skip-step", async (req: Request, res: Response) => {
  try {
    const { step } = onboardingStepSchema.parse(req.body);
    const userId = req.user!.id;
    
    await storage.skipOnboardingStep(userId, step);
    
    res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    
    console.error("Error skipping onboarding step:", error);
    res.status(500).json({ error: "Failed to skip onboarding step" });
  }
});

/**
 * Save step data
 */
router.post("/save-step", async (req: Request, res: Response) => {
  try {
    const { step, data } = saveStepSchema.parse(req.body);
    const userId = req.user!.id;
    
    // Save step data based on the step number
    switch (step) {
      case 1: // Basic Info
        if (data.name) await storage.updateUserName(userId, data.name);
        if (data.username) await storage.updateUsername(userId, data.username);
        if (data.email) await storage.updateUserEmail(userId, data.email);
        if (data.bio) await storage.updateUserBio(userId, data.bio);
        if (data.profileImage) await storage.updateUserProfileImage(userId, data.profileImage);
        break;
        
      case 2: // Sports Interest
        await storage.updateUserSportsInterest(userId, data);
        break;
        
      case 3: // Physical Attributes
        await storage.updateUserPhysicalAttributes(userId, data);
        break;
        
      case 4: // Accessibility Preferences
        await storage.updateUserAccessibilityPreferences(userId, data);
        break;
        
      case 5: // Parent Contact
        if (data.parentEmail) {
          await storage.updateUserParentContact(userId, data.parentEmail);
        }
        break;
    }
    
    // Mark step as completed
    await storage.completeOnboardingStep(userId, step);
    
    res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    
    console.error("Error saving onboarding step data:", error);
    res.status(500).json({ error: "Failed to save onboarding step data" });
  }
});

/**
 * Complete onboarding process
 */
router.post("/complete", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Mark onboarding as completed
    await storage.completeOnboarding(userId);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    res.status(500).json({ error: "Failed to complete onboarding" });
  }
});

/**
 * Send parent verification email
 */
router.post("/send-parent-verification", async (req: Request, res: Response) => {
  try {
    const { parentEmail } = parentVerificationSchema.parse(req.body);
    const userId = req.user!.id;
    const userName = req.user!.name;
    
    // Generate a verification token
    const token = randomBytes(32).toString("hex");
    
    // Store token in database
    await storage.createParentVerificationToken(userId, parentEmail, token);
    
    // Send verification email
    // Note: In a production environment, this would use a configured email service
    // This is a placeholder implementation
    try {
      // Check if SMTP is configured
      if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        
        const verificationUrl = `${process.env.APP_URL || "https://go4it.replit.app"}/verify-parent?token=${token}`;
        
        await transporter.sendMail({
          from: process.env.SMTP_FROM || "noreply@go4itsports.com",
          to: parentEmail,
          subject: "Parent Verification for Go4It Sports",
          html: `
            <h1>Go4It Sports Parent Verification</h1>
            <p>Hello,</p>
            <p>${userName} has listed you as their parent/guardian on Go4It Sports, a platform for student athletes.</p>
            <p>Please click the link below to verify your email address and confirm your relationship:</p>
            <p><a href="${verificationUrl}" style="padding: 10px 15px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
            <p>Or copy and paste this URL into your browser: ${verificationUrl}</p>
            <p>If you did not expect this email, please disregard it.</p>
            <p>Thank you,<br>The Go4It Sports Team</p>
          `
        });
      } else {
        // Log the verification request when SMTP is not configured
        console.log(`PARENT VERIFICATION REQUEST: User ID ${userId} sent verification to ${parentEmail} with token ${token}`);
      }
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue without failing the request since this is development/testing
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    
    console.error("Error sending parent verification:", error);
    res.status(500).json({ error: "Failed to send parent verification" });
  }
});

/**
 * Verify parent email
 */
router.get("/verify-parent/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    
    // Verify token and mark as verified
    const verificationResult = await storage.verifyParentToken(token);
    
    if (verificationResult) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid or expired verification token" });
    }
  } catch (error) {
    console.error("Error verifying parent token:", error);
    res.status(500).json({ error: "Failed to verify parent token" });
  }
});

/**
 * Get athlete profile
 */
router.get("/athlete-profile", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Get athlete profile data
    const profile = await storage.getAthleteProfile(userId);
    
    res.json(profile || {});
  } catch (error) {
    console.error("Error fetching athlete profile:", error);
    res.status(500).json({ error: "Failed to fetch athlete profile" });
  }
});

/**
 * Get user preferences
 */
router.get("/user/preferences", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Get user accessibility preferences
    const preferences = await storage.getUserAccessibilityPreferences(userId);
    
    res.json(preferences || {});
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    res.status(500).json({ error: "Failed to fetch user preferences" });
  }
});

export default router;