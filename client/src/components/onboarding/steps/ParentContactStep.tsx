import React, { useState } from "react";
import { ProfileWizardState } from "../ProfileCompletionWizard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ParentContactStepProps {
  formState: ProfileWizardState;
  updateFormState: (data: Partial<ProfileWizardState>) => void;
}

export default function ParentContactStep({
  formState,
  updateFormState,
}: ParentContactStepProps) {
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Handle email verification
  const handleVerifyEmail = async () => {
    // Reset states
    setIsSending(true);
    setSendSuccess(false);
    setErrorMessage("");
    
    // Validate email
    if (!formState.parentEmail || !isValidEmail(formState.parentEmail)) {
      setErrorMessage("Please enter a valid email address.");
      setIsSending(false);
      return;
    }
    
    try {
      // Send verification email (mock for now)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success
      setSendSuccess(true);
      setErrorMessage("");
    } catch (error) {
      // Handle error
      setErrorMessage("Failed to send verification email. Please try again.");
      setSendSuccess(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Parent Contact Information</h3>
        <p className="text-muted-foreground">
          For athletes under 18, we require a parent or guardian's email
        </p>
      </div>
      
      {/* Parent Information Section */}
      <Card className="p-6 border-primary/50">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="parent-email">
              Parent/Guardian Email <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="parent-email"
                type="email"
                placeholder="parent@example.com"
                value={formState.parentEmail}
                onChange={(e) => updateFormState({ parentEmail: e.target.value })}
                className="pl-10"
              />
              <span className="absolute left-3 top-2.5 text-muted-foreground">
                <Mail className="h-5 w-5" />
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              We'll send your parent/guardian information about your account and require their consent
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleVerifyEmail}
              disabled={!formState.parentEmail || isSending}
              className="mt-2"
            >
              {isSending ? "Sending..." : sendSuccess ? "Email Sent" : "Send Verification Email"}
              {sendSuccess && <CheckCircle2 className="ml-2 h-4 w-4 text-green-500" />}
            </Button>
          </div>
          
          {/* Error message */}
          {errorMessage && (
            <Alert variant="destructive" className="mt-2">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          {/* Success message */}
          {sendSuccess && (
            <Alert className="mt-2 bg-green-50 border-green-200 text-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Verification Email Sent</AlertTitle>
              <AlertDescription>
                A verification email has been sent to your parent/guardian. They'll need to confirm 
                to complete your registration.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>
      
      {/* Information on Parental Consent */}
      <Card className="p-6 bg-muted/40">
        <h4 className="font-medium mb-2">Why do we need parental consent?</h4>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            For athletes under 18, we require parental consent for:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Account creation and participation on the platform</li>
            <li>Communication with coaches and other athletes</li>
            <li>Collection of athletic performance data</li>
            <li>Sharing your profile with approved scouts or coaches</li>
          </ul>
          <p>
            Your parent/guardian will receive important updates about your account and activities,
            and can help manage privacy settings.
          </p>
        </div>
      </Card>
      
      {/* Helpful Tips */}
      <Card className="p-4 bg-muted/50 border-dashed">
        <h4 className="font-medium mb-2">Tips:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Make sure to use an email address your parent/guardian checks regularly</li>
          <li>• Let them know to expect the verification email shortly</li>
          <li>• You can proceed to the next step even if verification isn't complete yet</li>
        </ul>
      </Card>
    </div>
  );
}