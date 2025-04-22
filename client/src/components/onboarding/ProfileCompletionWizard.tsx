import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronRight, ChevronLeft, CheckCircle, Save } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import individual step components
import BasicInfoStep from "./steps/BasicInfoStep";
import SportsInterestStep from "./steps/SportsInterestStep";
import PhysicalAttributesStep from "./steps/PhysicalAttributesStep";
import AccessibilityPreferencesStep from "./steps/AccessibilityPreferencesStep";
import ParentContactStep from "./steps/ParentContactStep";

// Types for onboarding progress
interface OnboardingProgress {
  isCompleted: boolean;
  currentStep: number;
  totalSteps: number;
  completedSections: string[];
  skippedSections: string[];
}

// Types for profile wizard context/state
export interface ProfileWizardState {
  // Basic Info
  name: string;
  username: string;
  email: string;
  bio: string;
  profileImage?: string | null;
  
  // Sports Interest
  sportsInterest: string[];
  position: string;
  
  // Physical Attributes
  age: number | null;
  height: string;
  weight: string;
  school: string;
  graduationYear: number | null;
  
  // Accessibility Preferences
  adhd: boolean;
  focusMode: boolean;
  uiAnimationLevel: string;
  colorSchemePreference: string;
  textSizePreference: string;
  
  // Parent Contact
  parentEmail: string;
  
  // Metadata
  measurementSystem: string;
}

/**
 * Profile Completion Wizard Component
 * 
 * A multi-step form wizard that guides users through completing their profile
 * after registration. The wizard is designed to be accessible and accommodate
 * neurodivergent users with ADHD by breaking down the process into manageable steps.
 */
export default function ProfileCompletionWizard() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // State for current step and form data
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savingStep, setSavingStep] = useState(false);
  const [completingWizard, setCompletingWizard] = useState(false);
  
  // Initialize state with user data when available
  const [formState, setFormState] = useState<ProfileWizardState>({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    profileImage: user?.profileImage || null,
    
    sportsInterest: [],
    position: "",
    
    age: null,
    height: "",
    weight: "",
    school: "",
    graduationYear: null,
    
    adhd: false,
    focusMode: false,
    uiAnimationLevel: "medium",
    colorSchemePreference: "standard",
    textSizePreference: "medium",
    
    parentEmail: "",
    
    measurementSystem: "imperial",
  });
  
  // Fetch onboarding progress data
  const { data: onboardingData, isLoading: onboardingLoading } = useQuery({
    queryKey: ["/api/onboarding/progress"],
    // Only fetch if user is logged in
    enabled: !!user,
    onSuccess: (data: OnboardingProgress) => {
      // Set current step from server data
      if (data && data.currentStep) {
        setCurrentStep(data.currentStep);
      }
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    }
  });
  
  // Fetch existing athlete profile data if available
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/athlete/profile"],
    // Only fetch if user is logged in
    enabled: !!user,
    onSuccess: (data) => {
      if (data) {
        // Update form state with existing profile data
        setFormState(prevState => ({
          ...prevState,
          // Only update fields that exist in the profile data
          ...(data.sportsInterest && { sportsInterest: data.sportsInterest }),
          ...(data.position && { position: data.position }),
          ...(data.age && { age: data.age }),
          ...(data.height && { height: data.height }),
          ...(data.weight && { weight: data.weight }),
          ...(data.school && { school: data.school }),
          ...(data.graduationYear && { graduationYear: data.graduationYear }),
          ...(data.parentEmail && { parentEmail: data.parentEmail }),
        }));
      }
    }
  });
  
  // Fetch accessibility preferences if available
  const { data: preferencesData, isLoading: preferencesLoading } = useQuery({
    queryKey: ["/api/user/preferences"],
    // Only fetch if user is logged in
    enabled: !!user,
    onSuccess: (data) => {
      if (data) {
        // Update form state with existing preferences
        setFormState(prevState => ({
          ...prevState,
          ...(data.adhd !== undefined && { adhd: data.adhd }),
          ...(data.focusMode !== undefined && { focusMode: data.focusMode }),
          ...(data.uiAnimationLevel && { uiAnimationLevel: data.uiAnimationLevel }),
          ...(data.colorSchemePreference && { colorSchemePreference: data.colorSchemePreference }),
          ...(data.textSizePreference && { textSizePreference: data.textSizePreference }),
          ...(data.measurementSystem && { measurementSystem: data.measurementSystem }),
        }));
      }
    }
  });
  
  // Update form state when user data changes
  useEffect(() => {
    if (user) {
      setFormState(prevState => ({
        ...prevState,
        name: user.name || prevState.name,
        username: user.username || prevState.username,
        email: user.email || prevState.email,
        bio: user.bio || prevState.bio,
        profileImage: user.profileImage || prevState.profileImage,
      }));
    }
  }, [user]);
  
  // Save step progress mutation
  const saveStepMutation = useMutation({
    mutationFn: async ({ step, data }: { step: number, data: Partial<ProfileWizardState> }) => {
      return await apiRequest("/api/onboarding/save-step", {
        method: "POST",
        data: { step, data }
      });
    },
    onSuccess: () => {
      // Show success toast for save
      toast({
        title: "Progress saved",
        description: "Your information has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving progress",
        description: error.message || "There was an error saving your progress. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setSavingStep(false);
    }
  });
  
  // Complete onboarding mutation
  const completeOnboardingMutation = useMutation({
    mutationFn: async (data: ProfileWizardState) => {
      return await apiRequest("/api/onboarding/complete", {
        method: "POST",
        data
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile completed!",
        description: "Your profile has been set up successfully.",
      });
      
      // Navigate to dashboard or profile page
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: "Error completing profile",
        description: error.message || "There was an error completing your profile. Please try again.",
        variant: "destructive",
      });
      setCompletingWizard(false);
    }
  });
  
  // Save current step progress
  const saveStepProgress = async () => {
    setSavingStep(true);
    
    let stepData: Partial<ProfileWizardState> = {};
    
    // Determine which data to save based on current step
    switch (currentStep) {
      case 1: // Basic Info
        stepData = {
          name: formState.name,
          username: formState.username,
          email: formState.email,
          bio: formState.bio,
          profileImage: formState.profileImage,
        };
        break;
      case 2: // Sports Interest
        stepData = {
          sportsInterest: formState.sportsInterest,
          position: formState.position,
        };
        break;
      case 3: // Physical Attributes
        stepData = {
          age: formState.age,
          height: formState.height,
          weight: formState.weight,
          school: formState.school,
          graduationYear: formState.graduationYear,
          measurementSystem: formState.measurementSystem,
        };
        break;
      case 4: // Accessibility Preferences
        stepData = {
          adhd: formState.adhd,
          focusMode: formState.focusMode,
          uiAnimationLevel: formState.uiAnimationLevel,
          colorSchemePreference: formState.colorSchemePreference,
          textSizePreference: formState.textSizePreference,
        };
        break;
      case 5: // Parent Contact
        stepData = {
          parentEmail: formState.parentEmail,
        };
        break;
    }
    
    await saveStepMutation.mutateAsync({ step: currentStep, data: stepData });
  };
  
  // Handle next step
  const handleNext = async () => {
    // Save current step first
    await saveStepProgress();
    
    // Move to next step if not on last step
    if (currentStep < 5) {
      setCurrentStep(prevStep => prevStep + 1);
      
      // Update onboarding progress on server
      try {
        await apiRequest("/api/onboarding/update-step", {
          method: "POST",
          data: { step: currentStep + 1 }
        });
      } catch (error) {
        console.error("Error updating step:", error);
      }
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };
  
  // Handle form completion
  const handleComplete = async () => {
    setCompletingWizard(true);
    
    // First save the current step
    await saveStepProgress();
    
    // Then complete the onboarding process
    await completeOnboardingMutation.mutateAsync(formState);
  };
  
  // Handle skip step
  const handleSkip = async () => {
    try {
      // Mark current step as skipped
      await apiRequest("/api/onboarding/skip-step", {
        method: "POST",
        data: { step: currentStep }
      });
      
      // Move to next step
      if (currentStep < 5) {
        setCurrentStep(prevStep => prevStep + 1);
      } else {
        // If skipping the last step, complete the wizard
        await handleComplete();
      }
    } catch (error) {
      console.error("Error skipping step:", error);
      toast({
        title: "Error",
        description: "Could not skip this step. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle form state updates
  const updateFormState = (data: Partial<ProfileWizardState>) => {
    setFormState(prevState => ({
      ...prevState,
      ...data
    }));
  };
  
  // Show loading state while fetching data
  if (loading || onboardingLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user is not logged in, show error
  if (!user) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertDescription>
            You must be logged in to complete your profile. Please login or register first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Calculate progress percentage
  const progressPercentage = Math.round((currentStep / 5) * 100);
  
  // Render current step content
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep 
            formState={formState} 
            updateFormState={updateFormState} 
          />
        );
      case 2:
        return (
          <SportsInterestStep 
            formState={formState} 
            updateFormState={updateFormState} 
          />
        );
      case 3:
        return (
          <PhysicalAttributesStep 
            formState={formState} 
            updateFormState={updateFormState} 
          />
        );
      case 4:
        return (
          <AccessibilityPreferencesStep 
            formState={formState} 
            updateFormState={updateFormState} 
          />
        );
      case 5:
        return (
          <ParentContactStep 
            formState={formState} 
            updateFormState={updateFormState} 
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Step {currentStep} of 5: {
              currentStep === 1 ? "Basic Information" :
              currentStep === 2 ? "Sports Interests" :
              currentStep === 3 ? "Physical Attributes" :
              currentStep === 4 ? "Accessibility Preferences" :
              "Parent Contact Information"
            }
          </CardDescription>
          <Progress value={progressPercentage} className="h-2 mt-2" />
        </CardHeader>
        
        <CardContent>
          {/* Render the current step */}
          {renderStep()}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-4">
          <div>
            {currentStep > 1 ? (
              <Button 
                onClick={handlePrevious} 
                variant="outline"
                disabled={savingStep || completingWizard}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <div /> {/* Empty div for spacing */}
            )}
          </div>
          
          <div className="flex gap-3">
            {/* Only show skip for optional steps (2, 4, and 5) */}
            {[2, 4, 5].includes(currentStep) && (
              <Button 
                onClick={handleSkip}
                variant="outline"
                disabled={savingStep || completingWizard}
              >
                Skip
              </Button>
            )}
            
            {/* Save progress button */}
            <Button 
              onClick={saveStepProgress}
              variant="outline"
              disabled={savingStep || completingWizard}
            >
              {savingStep ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
            
            {/* Next or Complete button */}
            {currentStep < 5 ? (
              <Button 
                onClick={handleNext}
                disabled={savingStep || completingWizard}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                disabled={savingStep || completingWizard}
              >
                {completingWizard ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Profile
                  </>
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}