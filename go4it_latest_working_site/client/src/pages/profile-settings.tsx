import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, Lock, Shield, Bell } from "lucide-react";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

/**
 * Profile Settings Page
 * Allows users to update their account settings, change password, etc.
 */
export default function ProfileSettings() {
  const { user, loading } = useAuth();

  // If not logged in, redirect to auth page
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  return (
    <div className="container max-w-6xl py-8 px-4 md:px-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and security preferences
          </p>
        </div>

        <Tabs defaultValue="security" className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-4 h-auto">
            <TabsTrigger value="profile" className="flex items-center gap-2 py-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 py-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2 py-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 py-2 hidden lg:flex">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <p className="text-muted-foreground">
                This information will be displayed on your public profile. 
                You can edit your detailed athlete profile from the profile page.
              </p>
              
              {/* Profile editing form would go here */}
              <div className="p-6 border border-border rounded-lg bg-card">
                <p className="text-center text-muted-foreground">
                  Profile editing coming soon...
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-6">
              <h2 className="text-xl font-semibold">Security Settings</h2>
              <p className="text-muted-foreground">
                Manage your password and account security settings.
              </p>
              
              <ChangePasswordForm />
              
              <div className="p-6 border border-border rounded-lg bg-card">
                <h3 className="text-md font-medium mb-4">Two-Factor Authentication</h3>
                <p className="text-muted-foreground mb-4">
                  Add an extra layer of security to your account with two-factor authentication.
                  Coming soon...
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <div className="grid gap-6">
              <h2 className="text-xl font-semibold">Privacy Settings</h2>
              <p className="text-muted-foreground">
                Control how your information is displayed and shared with others.
              </p>
              
              <div className="p-6 border border-border rounded-lg bg-card">
                <p className="text-center text-muted-foreground">
                  Privacy settings coming soon...
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="grid gap-6">
              <h2 className="text-xl font-semibold">Notification Preferences</h2>
              <p className="text-muted-foreground">
                Control which notifications you receive via email, push notifications, and within the app.
              </p>
              
              <div className="p-6 border border-border rounded-lg bg-card">
                <p className="text-center text-muted-foreground">
                  Notification settings coming soon...
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}