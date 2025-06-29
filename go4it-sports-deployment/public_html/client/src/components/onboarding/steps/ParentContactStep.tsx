import React, { useState } from "react";
import { ProfileWizardState } from "../ProfileCompletionWizard";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Mail, AlertTriangle } from "lucide-react";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ParentContactStepProps {
  formState: ProfileWizardState;
  updateFormState: (data: Partial<ProfileWizardState>) => void;
}

export default function ParentContactStep({ 
  formState, 
  updateFormState 
}: ParentContactStepProps) {
  const { toast } = useToast();
  const [verificationSent, setVerificationSent] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [emailError, setEmailError] = useState("");
  
  // Email validation schema
  const emailSchema = z.string().email("Please enter a valid email address");
  
  // Handle email validation and change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    updateFormState({ parentEmail: email });
    
    // Clear previous errors when typing
    if (emailError) setEmailError("");
  };
  
  // Validate email with schema
  const validateEmail = () => {
    try {
      emailSchema.parse(formState.parentEmail);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      }
      return false;
    }
  };
  
  // Send verification email to parent
  const sendVerificationEmail = async () => {
    // Validate email first
    if (!validateEmail()) return;
    
    setSendingVerification(true);
    
    try {
      // Send verification email
      await apiRequest("POST", "/api/onboarding/send-parent-verification", { 
        parentEmail: formState.parentEmail 
      });
      
      // Update state and show success message
      setVerificationSent(true);
      toast({
        title: "Verification email sent",
        description: `A verification email has been sent to ${formState.parentEmail}`,
      });
    } catch (error) {
      toast({
        title: "Error sending verification",
        description: "There was an error sending the verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingVerification(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Parent/Guardian Contact</h3>
        <p className="text-muted-foreground">
          For athletes under 18, we require parent or guardian contact information
        </p>
      </div>
      
      {/* Safety Notice */}
      <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 mt-0.5 text-blue-500" />
          <div>
            <h4 className="font-medium text-sm">Safety First:</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Go4It Sports is committed to athlete safety. Parent/guardian information helps 
              us provide a secure environment and keeps them informed about your activities and progress.
              This is especially important for athletes under 18 years old.
            </p>
          </div>
        </div>
      </Card>
      
      {/* Parent Email Input */}
      <div className="space-y-3">
        <Label htmlFor="parent-email" className="text-base">Parent/Guardian Email</Label>
        <div className="space-y-2">
          <Input
            id="parent-email"
            type="email"
            placeholder="Enter parent or guardian email"
            value={formState.parentEmail}
            onChange={handleEmailChange}
            className={emailError ? "border-destructive" : ""}
          />
          
          {emailError && (
            <p className="text-xs text-destructive">{emailError}</p>
          )}
          
          <p className="text-xs text-muted-foreground">
            We'll send a verification email to this address to confirm parental consent
          </p>
        </div>
        
        {/* Send Verification Email Button */}
        <Button
          type="button"
          onClick={sendVerificationEmail}
          disabled={!formState.parentEmail || sendingVerification || verificationSent}
          className="mt-2"
        >
          {sendingVerification ? (
            <>Sending...</>
          ) : verificationSent ? (
            <>Verification Sent <Mail className="ml-2 h-4 w-4" /></>
          ) : (
            <>Send Verification Email</>
          )}
        </Button>
        
        {verificationSent && (
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800 mt-2">
            Verification email sent
          </Badge>
        )}
      </div>
      
      {/* Optional: Verification Status */}
      <Card className="p-4 mt-4 bg-muted/50 border-dashed">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 mt-0.5 text-muted-foreground" />
          <div>
            <h4 className="font-medium text-sm">Important:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground mt-1">
              <li>• Your parent/guardian needs to confirm this email before you can access all features</li>
              <li>• The verification process usually takes just a few minutes</li>
              <li>• You can still complete your profile while waiting for verification</li>
              <li>• Be sure to use a valid email address your parent or guardian can access</li>
            </ul>
          </div>
        </div>
      </Card>
      
      {/* Skip Notice */}
      <div className="text-center mt-6">
        <p className="text-xs text-muted-foreground">
          This step can be skipped if you're 18 or older, but is required for all minors.
        </p>
      </div>
    </div>
  );
}