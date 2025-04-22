import React, { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import ProfileCompletionWizard from "@/components/onboarding/ProfileCompletionWizard";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function ProfileCompletionPage() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  
  // Redirect to dashboard if user profile is completed
  // Note: The exact property might differ in your actual user object
  // but this handles it safely
  useEffect(() => {
    if (!loading && user && user.onboardingCompleted) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);
  
  // Handle login redirect for unauthenticated users
  const handleLoginRedirect = () => {
    navigate("/auth?redirect=/profile-completion");
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  // Not authenticated view
  if (!user) {
    return (
      <div className="container max-w-md mx-auto py-12 px-4">
        <Card>
          <CardContent className="pt-6">
            <Alert className="mb-6">
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                You need to sign in or create an account to complete your profile.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-center">
              <Button onClick={handleLoginRedirect}>
                Sign In or Register
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // User is authenticated but hasn't completed profile yet
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <ProfileCompletionWizard />
    </div>
  );
}