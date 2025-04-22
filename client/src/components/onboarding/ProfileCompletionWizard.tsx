import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Steps, Step } from "@/components/ui/steps";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, ArrowRight, CheckCircle, Save } from "lucide-react";

// Step components
import BasicInfoStep from "./steps/BasicInfoStep";
import SportsInterestStep from "./steps/SportsInterestStep";
import PhysicalAttributesStep from "./steps/PhysicalAttributesStep";
import AccessibilityPreferencesStep from "./steps/AccessibilityPreferencesStep";
import ParentContactStep from "./steps/ParentContactStep";

// Define the type for a sport
export interface SportInfo {
  id: string;
  name: string;
  position: string;
  isPrimary: boolean;
  skillLevel: string;
}

// Define the form state
export interface ProfileWizardState {
  // Step 1: Basic Info
  name: string;
  username: string;
  email: string;
  bio: string;
  profileImage: string;
  
  // Step 2: Sports Interest
  selectedSports: SportInfo[];
  lookingForScholarship: boolean;
  
  // Step 3: Physical Attributes
  age: number | null;
  height: string;
  weight: string;
  measurementSystem: "imperial" | "metric";
  school: string;
  graduationYear: number | null;
  
  // Step 4: Accessibility Preferences
  adhd: boolean;
  focusMode: boolean;
  uiAnimationLevel: string;
  colorSchemePreference: string;
  textSizePreference: string;
  
  // Step 5: Parent Contact
  parentEmail: string;
  parentVerified: boolean;
}

// Define step titles
const STEPS = [
  { id: 1, title: "Basic Info", description: "Personal information" },
  { id: 2, title: "Sports", description: "Athletic interests" },
  { id: 3, title: "Physical", description: "Physical attributes" },
  { id: 4, title: "Accessibility", description: "Preferences" },
  { id: 5, title: "Parent Info", description: "Guardian contact" }
];

export default function ProfileCompletionWizard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState<ProfileWizardState>({
    // Step 1: Basic Info
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: "",
    profileImage: user?.profileImage || "",
    
    // Step 2: Sports Interest
    selectedSports: [],
    lookingForScholarship: false,
    
    // Step 3: Physical Attributes
    age: null,
    height: "",
    weight: "",
    measurementSystem: "imperial",
    school: "",
    graduationYear: null,
    
    // Step 4: Accessibility Preferences
    adhd: false,
    focusMode: false,
    uiAnimationLevel: "medium",
    colorSchemePreference: "standard",
    textSizePreference: "medium",
    
    // Step 5: Parent Contact
    parentEmail: "",
    parentVerified: false
  });
  
  // Update form state
  const updateFormState = (newState: Partial<ProfileWizardState>) => {
    setFormState(prevState => ({ ...prevState, ...newState }));
  };
  
  // Go to next step
  const handleNext = async () => {
    // Validate current step
    const isValid = validateStep(currentStep);
    if (!isValid) return;
    
    try {
      // Save current step data
      await apiRequest("POST", "/api/onboarding/save-step", {
        step: currentStep,
        data: getStepData(currentStep)
      });
      
      // If this is the last step, submit the form
      if (currentStep === STEPS.length) {
        await handleCompleteOnboarding();
        return;
      }
      
      // Otherwise, go to next step
      setCurrentStep(currentStep + 1);
      
      // Update onboarding step
      await apiRequest("POST", "/api/onboarding/update-step", {
        step: currentStep + 1
      });
    } catch (error) {
      console.error("Error saving step data:", error);
      toast({
        title: "Error",
        description: "There was an error saving your data. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Go to previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Jump to a specific step
  const jumpToStep = (step: number) => {
    setCurrentStep(step);
  };
  
  // Get data for current step
  const getStepData = (step: number) => {
    switch (step) {
      case 1: // Basic Info
        return {
          name: formState.name,
          username: formState.username,
          email: formState.email,
          bio: formState.bio,
          profileImage: formState.profileImage
        };
      case 2: // Sports Interest
        return {
          selectedSports: formState.selectedSports,
          lookingForScholarship: formState.lookingForScholarship
        };
      case 3: // Physical Attributes
        return {
          age: formState.age,
          height: formState.height,
          weight: formState.weight,
          measurementSystem: formState.measurementSystem,
          school: formState.school,
          graduationYear: formState.graduationYear
        };
      case 4: // Accessibility Preferences
        return {
          adhd: formState.adhd,
          focusMode: formState.focusMode,
          uiAnimationLevel: formState.uiAnimationLevel,
          colorSchemePreference: formState.colorSchemePreference,
          textSizePreference: formState.textSizePreference
        };
      case 5: // Parent Contact
        return {
          parentEmail: formState.parentEmail,
          parentVerified: formState.parentVerified
        };
      default:
        return {};
    }
  };
  
  // Validate current step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Basic Info
        if (!formState.name) {
          toast({
            title: "Missing Information",
            description: "Please enter your name",
            variant: "destructive",
          });
          return false;
        }
        if (!formState.username) {
          toast({
            title: "Missing Information",
            description: "Please enter a username",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      case 2: // Sports Interest
        if (formState.selectedSports.length === 0) {
          toast({
            title: "Missing Information",
            description: "Please select at least one sport",
            variant: "destructive",
          });
          return false;
        }
        
        // Check if all selected sports have positions
        const sportsWithoutPosition = formState.selectedSports.filter(
          sport => !sport.position
        );
        if (sportsWithoutPosition.length > 0) {
          toast({
            title: "Missing Information",
            description: `Please select a position for ${sportsWithoutPosition[0].name}`,
            variant: "destructive",
          });
          return false;
        }
        
        return true;
        
      case 3: // Physical Attributes
        // Age is optional but if provided should be between 12 and 18
        if (formState.age && (formState.age < 12 || formState.age > 18)) {
          toast({
            title: "Invalid Information",
            description: "Age should be between 12 and 18",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      case 4: // Accessibility Preferences
        // All fields have defaults, so no validation needed
        return true;
        
      case 5: // Parent Contact
        // Parent email is optional for 18+ but should be valid if provided
        if (formState.parentEmail && !formState.parentEmail.includes("@")) {
          toast({
            title: "Invalid Information",
            description: "Please enter a valid parent email address",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };
  
  // Complete onboarding
  const handleCompleteOnboarding = async () => {
    try {
      setIsSubmitting(true);
      
      // Save final step data
      await apiRequest("POST", "/api/onboarding/save-step", {
        step: currentStep,
        data: getStepData(currentStep)
      });
      
      // Mark onboarding as complete
      await apiRequest("POST", "/api/onboarding/complete", {});
      
      // Show success toast
      toast({
        title: "Profile Completed",
        description: "Your profile has been set up successfully!",
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error",
        description: "There was an error completing your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Skip current step
  const handleSkipStep = async () => {
    try {
      // Mark step as skipped
      await apiRequest("POST", "/api/onboarding/skip-step", {
        step: currentStep
      });
      
      // If this is the last step, submit the form
      if (currentStep === STEPS.length) {
        await handleCompleteOnboarding();
        return;
      }
      
      // Otherwise, go to next step
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Error skipping step:", error);
      toast({
        title: "Error",
        description: "There was an error skipping this step. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Render current step
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Complete Your Profile</CardTitle>
      </CardHeader>
      
      <Steps currentStep={currentStep} onStepClick={jumpToStep}>
        {STEPS.map(step => (
          <Step 
            key={step.id}
            id={step.id} 
            title={step.title}
            description={step.description}
          />
        ))}
      </Steps>
      
      <Separator className="my-0" />
      
      <CardContent className="pt-6 pb-0">
        {renderStep()}
      </CardContent>
      
      <CardFooter className="flex justify-between mt-8 pb-6">
        <div>
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          {/* Skip button for optional steps */}
          {(currentStep === 3 || currentStep === 4 || currentStep === 5) && (
            <Button 
              variant="ghost" 
              onClick={handleSkipStep}
              disabled={isSubmitting}
            >
              Skip
            </Button>
          )}
          
          <Button 
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {currentStep === STEPS.length ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}