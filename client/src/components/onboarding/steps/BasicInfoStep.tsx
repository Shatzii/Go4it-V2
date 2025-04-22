import React, { useState, useRef } from "react";
import { ProfileWizardState } from "../ProfileCompletionWizard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface BasicInfoStepProps {
  formState: ProfileWizardState;
  updateFormState: (data: Partial<ProfileWizardState>) => void;
}

export default function BasicInfoStep({ formState, updateFormState }: BasicInfoStepProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get initials from name for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "?";
    const nameParts = name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  // Handle file selection
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadError("Image size should be less than 5MB");
      return;
    }
    
    // Reset error state
    setUploadError("");
    setUploadingImage(true);
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append("profileImage", file);
      
      // Upload the image
      const response = await fetch("/api/upload/profile-image", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Failed to upload image");
      
      const data = await response.json();
      
      // Update form state with the new image URL
      updateFormState({ profileImage: data.imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <p className="text-muted-foreground">
          Let's start with some basic details about you
        </p>
      </div>
      
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center">
        <Label htmlFor="profile-image" className="mb-2">Profile Picture</Label>
        <div className="relative group">
          <Avatar className="h-24 w-24 border-2 border-border group-hover:border-primary transition-colors">
            {formState.profileImage ? (
              <AvatarImage src={formState.profileImage} alt={formState.name} />
            ) : (
              <AvatarFallback className="text-xl bg-muted">
                {getInitials(formState.name)}
              </AvatarFallback>
            )}
            
            {/* Upload overlay */}
            <div 
              className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={triggerFileInput}
            >
              {uploadingImage ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Camera className="h-6 w-6 text-white" />
              )}
            </div>
          </Avatar>
          
          <input
            ref={fileInputRef}
            type="file"
            id="profile-image"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelected}
            disabled={uploadingImage}
          />
        </div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="mt-2"
          onClick={triggerFileInput}
          disabled={uploadingImage}
        >
          {formState.profileImage ? "Change Photo" : "Upload Photo"}
        </Button>
        
        {uploadError && (
          <p className="text-xs text-destructive mt-1">{uploadError}</p>
        )}
      </div>
      
      {/* Basic Info Form */}
      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Your full name"
            value={formState.name}
            onChange={(e) => updateFormState({ name: e.target.value })}
          />
        </div>
        
        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Choose a unique username"
            value={formState.username}
            onChange={(e) => updateFormState({ username: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            This will be your public handle (@{formState.username || 'username'})
          </p>
        </div>
        
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Your email address"
            value={formState.email}
            onChange={(e) => updateFormState({ email: e.target.value })}
          />
        </div>
        
        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us a bit about yourself, your sports journey, and your goals"
            className="min-h-[100px] resize-y"
            value={formState.bio}
            onChange={(e) => updateFormState({ bio: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            {formState.bio.length}/250 characters
          </p>
        </div>
      </div>
      
      {/* Helpful Tips Card */}
      <Card className="p-4 bg-muted/50 border-dashed">
        <h4 className="font-medium mb-2">Tips:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Add a clear profile photo to help coaches recognize you</li>
          <li>• Use your real name to build credibility with coaches and scouts</li>
          <li>• In your bio, mention sports achievements, goals, and what motivates you</li>
          <li>• All information can be updated later from your profile settings</li>
        </ul>
      </Card>
    </div>
  );
}