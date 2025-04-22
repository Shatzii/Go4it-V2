import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "wouter";
import { Steps, Step } from "@/components/ui/steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import BasicInfoStep from "./steps/BasicInfoStep";
import PhysicalAttributesStep from "./steps/PhysicalAttributesStep";
import SportsInterestStep from "./steps/SportsInterestStep";
import AccessibilityPreferencesStep from "./steps/AccessibilityPreferencesStep";
import ParentContactStep from "./steps/ParentContactStep";
import axios from "axios";

// Define the steps of the onboarding process
const STEPS = [
  { id: 1, title: "Basic Info", description: "Your profile details" },
  { id: 2, title: "Sports Interest", description: "What sports do you play?" },
  { id: 3, title: "Physical Attributes", description: "Height, weight, etc." },
  { id: 4, title: "Accessibility", description: "Customize your experience" },
  { id: 5, title: "Parent Contact", description: "For athletes under 18" },
];

interface FormData {
  // Basic Info
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  profileImage: string | null;
  dateOfBirth: Date | null;
  
  // Sports Interest
  sports: string[];
  positions: string[];
  level: string;
  
  // Physical Attributes
  height: number | null;
  weight: number | null;
  wingspan: number | null;
  handedness: "left" | "right" | "ambidextrous" | null;
  verticalJump: number | null;
  
  // Accessibility Preferences
  adhd: boolean;
  focusMode: boolean;
  animationReduction: "none" | "reduced" | "minimal";
  colorScheme: "default" | "high-contrast" | "dark" | "light";
  textSize: "default" | "large" | "x-large";
  contrastLevel: "default" | "high" | "very-high";
  soundEffects: boolean;
  
  // Parent Contact
  parentName: string;
  parentEmail: string;
  parentVerified: boolean;
}

export default function ProfileCompletionWizard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useNavigate();
  
  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    // Basic Info
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    profileImage: user?.profileImage || null,
    dateOfBirth: null,
    
    // Sports Interest
    sports: [],
    positions: [],
    level: "beginner",
    
    // Physical Attributes
    height: null,
    weight: null,
    wingspan: null,
    handedness: null,
    verticalJump: null,
    
    // Accessibility Preferences
    adhd: false,
    focusMode: false,
    animationReduction: "none",
    colorScheme: "default",
    textSize: "default",
    contrastLevel: "default",
    soundEffects: true,
    
    // Parent Contact
    parentName: "",
    parentEmail: "",
    parentVerified: false,
  });
  
  // Function to update form data
  const updateFormData = (stepData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };
  
  // Functions to handle step navigation
  const goToNextStep = async () => {
    try {
      await saveCurrentStep();
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      } else {
        await completeOnboarding();
      }
    } catch (error) {
      console.error("Error saving step data:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your information. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const goToStep = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };
  
  // Function to save current step data
  const saveCurrentStep = async () => {
    // Extract relevant data based on current step
    let stepData: any = {};
    let endpoint = "";
    
    switch (currentStep) {
      case 1: // Basic Info
        stepData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          bio: formData.bio,
          profileImage: formData.profileImage,
          dateOfBirth: formData.dateOfBirth,
        };
        endpoint = "/api/onboarding/update-profile";
        break;
      
      case 2: // Sports Interest
        stepData = {
          sports: formData.sports,
          positions: formData.positions,
          level: formData.level,
        };
        endpoint = "/api/onboarding/sports-interest";
        break;
      
      case 3: // Physical Attributes
        stepData = {
          height: formData.height,
          weight: formData.weight,
          wingspan: formData.wingspan,
          handedness: formData.handedness,
          verticalJump: formData.verticalJump,
        };
        endpoint = "/api/onboarding/physical-attributes";
        break;
      
      case 4: // Accessibility Preferences
        stepData = {
          adhd: formData.adhd,
          focusMode: formData.focusMode,
          animationReduction: formData.animationReduction,
          colorScheme: formData.colorScheme,
          textSize: formData.textSize,
          contrastLevel: formData.contrastLevel,
          soundEffects: formData.soundEffects,
        };
        endpoint = "/api/onboarding/accessibility-preferences";
        break;
      
      case 5: // Parent Contact
        stepData = {
          parentName: formData.parentName,
          parentEmail: formData.parentEmail,
        };
        endpoint = "/api/onboarding/parent-verification";
        break;
      
      default:
        break;
    }
    
    // Save step data to API
    await axios.post(endpoint, stepData);
    
    // Mark step as completed
    await axios.post(`/api/onboarding/complete-step/${currentStep}`);
  };
  
  // Function to complete the onboarding process
  const completeOnboarding = async () => {
    setIsSubmitting(true);
    
    try {
      await axios.post("/api/onboarding/complete");
      
      toast({
        title: "Onboarding Complete!",
        description: "Your profile has been created successfully.",
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error",
        description: "There was a problem completing your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to skip the current step
  const skipStep = async () => {
    try {
      await axios.post(`/api/onboarding/skip-step/${currentStep}`);
      
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      } else {
        await completeOnboarding();
      }
    } catch (error) {
      console.error("Error skipping step:", error);
      toast({
        title: "Error",
        description: "There was a problem skipping this step. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Determine if step can be skipped
  const canSkip = (step: number) => {
    return step === 3 || step === 4 || step === 5;
  };
  
  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Complete Your Profile</h1>
      
      <div className="mb-8">
        <Steps currentStep={currentStep} onStepClick={goToStep}>
          {STEPS.map(step => (
            <Step 
              key={step.id} 
              id={step.id} 
              title={step.title} 
              description={step.description}
            />
          ))}
        </Steps>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {currentStep === 1 && (
            <BasicInfoStep 
              data={formData} 
              updateData={updateFormData} 
            />
          )}
          
          {currentStep === 2 && (
            <SportsInterestStep 
              data={formData} 
              updateData={updateFormData} 
            />
          )}
          
          {currentStep === 3 && (
            <PhysicalAttributesStep 
              data={formData} 
              updateData={updateFormData} 
            />
          )}
          
          {currentStep === 4 && (
            <AccessibilityPreferencesStep 
              data={formData} 
              updateData={updateFormData} 
            />
          )}
          
          {currentStep === 5 && (
            <ParentContactStep 
              data={formData} 
              updateData={updateFormData} 
            />
          )}
          
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={isSubmitting}
              >
                Back
              </Button>
            ) : (
              <div></div>
            )}
            
            <div className="space-x-2">
              {canSkip(currentStep) && (
                <Button
                  variant="ghost"
                  onClick={skipStep}
                  disabled={isSubmitting}
                >
                  Skip
                </Button>
              )}
              
              <Button
                onClick={goToNextStep}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : currentStep === STEPS.length ? (
                  "Complete"
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}