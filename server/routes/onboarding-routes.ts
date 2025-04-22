import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { isAuthenticatedMiddleware } from "../auth";
import { z } from "zod";

const router = Router();

// Validation schema for step data
const stepDataSchema = z.object({
  step: z.number().min(1).max(5),
  data: z.record(z.any()).optional(),
});

// Validation schema for skipping a step
const skipStepSchema = z.object({
  step: z.number().min(1).max(5),
});

// Validation schema for updating current step
const updateStepSchema = z.object({
  step: z.number().min(1).max(5),
});

// Get onboarding progress
router.get("/progress", isAuthenticatedMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    
    // Get onboarding progress from DB
    const onboardingProgress = await storage.getOnboardingProgress(userId);
    
    if (!onboardingProgress) {
      // If no progress record exists, create one and return it
      const newProgress = await storage.createOnboardingProgress({
        userId,
        isCompleted: false,
        currentStep: 1,
        totalSteps: 5,
        completedSections: [],
        skippedSections: [],
      });
      
      return res.status(200).json(newProgress);
    }
    
    return res.status(200).json(onboardingProgress);
  } catch (error) {
    console.error("Error fetching onboarding progress:", error);
    return res.status(500).json({ error: "Failed to fetch onboarding progress" });
  }
});

// Save step progress
router.post("/save-step", isAuthenticatedMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    
    // Validate request body
    const validationResult = stepDataSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: "Invalid request data", 
        details: validationResult.error.format() 
      });
    }
    
    const { step, data } = validationResult.data;
    
    // Get current progress
    let onboardingProgress = await storage.getOnboardingProgress(userId);
    
    if (!onboardingProgress) {
      // Create new progress record if it doesn't exist
      onboardingProgress = await storage.createOnboardingProgress({
        userId,
        isCompleted: false,
        currentStep: step,
        totalSteps: 5,
        completedSections: [],
        skippedSections: [],
      });
    }
    
    // Update user attributes if they exist in data
    if (data) {
      if (step === 1 && (data.name || data.bio)) {
        // Update basic user information
        await storage.updateUserProfile(userId, {
          ...(data.name && { name: data.name }),
          ...(data.bio && { bio: data.bio }),
          ...(data.profileImage && { profileImage: data.profileImage })
        });
      }
      
      // For other steps, update athlete profile
      if ([2, 3, 5].includes(step)) {
        // Check if athlete profile exists
        const athleteProfile = await storage.getAthleteProfile(userId);
        
        if (athleteProfile) {
          // Update existing profile
          await storage.updateAthleteProfile(userId, {
            ...(step === 2 && {
              sportsInterest: data.sportsInterest,
              position: data.position,
            }),
            ...(step === 3 && {
              age: data.age,
              height: data.height,
              weight: data.weight,
              school: data.school,
              graduationYear: data.graduationYear,
            }),
            ...(step === 5 && {
              parentEmail: data.parentEmail,
            }),
          });
        } else {
          // Create new athlete profile
          await storage.createAthleteProfile({
            userId,
            ...(step === 2 && {
              sportsInterest: data.sportsInterest,
              position: data.position,
            }),
            ...(step === 3 && {
              age: data.age,
              height: data.height,
              weight: data.weight,
              school: data.school,
              graduationYear: data.graduationYear,
            }),
            ...(step === 5 && {
              parentEmail: data.parentEmail,
            }),
          });
        }
      }
      
      // For accessibility preferences (step 4)
      if (step === 4) {
        // Update accessibility preferences
        await storage.updateUserPreferences(userId, {
          adhd: data.adhd,
          focusMode: data.focusMode,
          uiAnimationLevel: data.uiAnimationLevel,
          colorSchemePreference: data.colorSchemePreference,
          textSizePreference: data.textSizePreference,
        });
      }
    }
    
    // Add to completed sections if not already there
    const sectionName = getSectionNameForStep(step);
    let completedSections = onboardingProgress.completedSections || [];
    
    if (!completedSections.includes(sectionName)) {
      completedSections = [...completedSections, sectionName];
    }
    
    // Update onboarding progress
    const updatedProgress = await storage.updateOnboardingProgress(userId, {
      currentStep: step,
      completedSections,
      lastUpdated: new Date(),
    });
    
    return res.status(200).json(updatedProgress);
  } catch (error) {
    console.error("Error saving step progress:", error);
    return res.status(500).json({ error: "Failed to save step progress" });
  }
});

// Skip a step
router.post("/skip-step", isAuthenticatedMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    
    // Validate request body
    const validationResult = skipStepSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: "Invalid request data", 
        details: validationResult.error.format() 
      });
    }
    
    const { step } = validationResult.data;
    
    // Get section name for the current step
    const sectionName = getSectionNameForStep(step);
    
    // Skip the current section
    const updatedProgress = await storage.skipOnboardingSection(userId, sectionName);
    
    if (!updatedProgress) {
      return res.status(404).json({ error: "Onboarding progress not found" });
    }
    
    // Move to next step
    await storage.updateOnboardingProgress(userId, {
      currentStep: step < 5 ? step + 1 : step,
      lastUpdated: new Date(),
    });
    
    return res.status(200).json(updatedProgress);
  } catch (error) {
    console.error("Error skipping step:", error);
    return res.status(500).json({ error: "Failed to skip step" });
  }
});

// Update current step
router.post("/update-step", isAuthenticatedMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    
    // Validate request body
    const validationResult = updateStepSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: "Invalid request data", 
        details: validationResult.error.format() 
      });
    }
    
    const { step } = validationResult.data;
    
    // Update current step
    const updatedProgress = await storage.updateOnboardingProgress(userId, {
      currentStep: step,
      lastUpdated: new Date(),
    });
    
    if (!updatedProgress) {
      return res.status(404).json({ error: "Onboarding progress not found" });
    }
    
    return res.status(200).json(updatedProgress);
  } catch (error) {
    console.error("Error updating step:", error);
    return res.status(500).json({ error: "Failed to update step" });
  }
});

// Complete onboarding
router.post("/complete", isAuthenticatedMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    
    // Save all profile data from request body
    const profileData = req.body;
    
    // Update user profile with basic info
    await storage.updateUserProfile(userId, {
      name: profileData.name,
      bio: profileData.bio,
      ...(profileData.profileImage && { profileImage: profileData.profileImage }),
    });
    
    // Update or create athlete profile
    const athleteProfile = await storage.getAthleteProfile(userId);
    
    if (athleteProfile) {
      // Update existing profile
      await storage.updateAthleteProfile(userId, {
        sportsInterest: profileData.sportsInterest,
        position: profileData.position,
        age: profileData.age,
        height: profileData.height,
        weight: profileData.weight,
        school: profileData.school,
        graduationYear: profileData.graduationYear,
        parentEmail: profileData.parentEmail,
      });
    } else {
      // Create new athlete profile
      await storage.createAthleteProfile({
        userId,
        sportsInterest: profileData.sportsInterest,
        position: profileData.position,
        age: profileData.age,
        height: profileData.height,
        weight: profileData.weight,
        school: profileData.school,
        graduationYear: profileData.graduationYear,
        parentEmail: profileData.parentEmail,
      });
    }
    
    // Update accessibility preferences
    await storage.updateUserPreferences(userId, {
      adhd: profileData.adhd,
      focusMode: profileData.focusMode,
      uiAnimationLevel: profileData.uiAnimationLevel,
      colorSchemePreference: profileData.colorSchemePreference,
      textSizePreference: profileData.textSizePreference,
    });
    
    // Mark onboarding as completed
    const updatedProgress = await storage.updateOnboardingProgress(userId, {
      isCompleted: true,
      currentStep: 5,
      lastUpdated: new Date(),
    });
    
    return res.status(200).json({
      success: true,
      message: "Profile completion successful",
      onboardingProgress: updatedProgress,
    });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return res.status(500).json({ error: "Failed to complete onboarding" });
  }
});

// Helper function to get section name for a step
function getSectionNameForStep(step: number): string {
  switch (step) {
    case 1:
      return "basic-info";
    case 2:
      return "sports-interest";
    case 3:
      return "physical-attributes";
    case 4:
      return "accessibility-preferences";
    case 5:
      return "parent-contact";
    default:
      return `step-${step}`;
  }
}

export default router;