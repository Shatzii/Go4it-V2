import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import ProfileCompletionWizard from "@/components/onboarding/ProfileCompletionWizard";
import { Loader2 } from "lucide-react";

/**
 * Profile Completion Page
 * 
 * This page hosts the profile completion wizard that guides users through setting up
 * their complete profile after registration. It's designed to be accessible and
 * accommodating for neurodivergent users with ADHD.
 */
export default function ProfileCompletionPage() {
  const { user, loading } = useAuth();
  
  // If loading, show loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If not logged in, redirect to auth page
  if (!user) {
    return <Redirect to="/auth" />;
  }
  
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        <ProfileCompletionWizard />
      </div>
    </div>
  );
}