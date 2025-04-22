import React, { useState } from "react";
import { ProfileWizardState } from "../ProfileCompletionWizard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BasicInfoStepProps {
  formState: ProfileWizardState;
  updateFormState: (data: Partial<ProfileWizardState>) => void;
}

export default function BasicInfoStep({ formState, updateFormState }: BasicInfoStepProps) {
  const [uploadingImage, setUploadingImage] = useState(false);

  // Handle profile image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("profileImage", file);
      
      // Send the file to the server
      const response = await fetch("/api/user/upload-profile-image", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload profile image");
      }
      
      const { imageUrl } = await response.json();
      
      // Update form state with the image URL
      updateFormState({ profileImage: imageUrl });
      
    } catch (error) {
      console.error("Error uploading profile image:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Let's start with your basic information</h3>
        <p className="text-muted-foreground">
          Tell us about yourself so we can personalize your experience
        </p>
      </div>
      
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage 
            src={formState.profileImage || ""} 
            alt={formState.name || "Profile"} 
          />
          <AvatarFallback className="bg-muted">
            <User className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex items-center space-x-2">
          <Input
            id="profile-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploadingImage}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("profile-image")?.click()}
            disabled={uploadingImage}
          >
            {uploadingImage ? "Uploading..." : "Upload Photo"}
            {!uploadingImage && <Upload className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Basic Information Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              placeholder="Your full name"
              value={formState.name}
              onChange={(e) => updateFormState({ name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username <span className="text-destructive">*</span></Label>
            <Input
              id="username"
              placeholder="Your username"
              value={formState.username}
              onChange={(e) => updateFormState({ username: e.target.value })}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={formState.email}
            onChange={(e) => updateFormState({ email: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us a bit about yourself..."
            value={formState.bio || ""}
            onChange={(e) => updateFormState({ bio: e.target.value })}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Share something interesting about yourself, your sports journey, or your goals.
          </p>
        </div>
      </div>
      
      {/* Helpful Tips Card */}
      <Card className="p-4 bg-muted/50 border-dashed">
        <h4 className="font-medium mb-2">Tips:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Your username will be visible to coaches and other athletes</li>
          <li>• A good profile photo helps coaches identify you</li>
          <li>• Your bio can highlight your sports interests and achievements</li>
        </ul>
      </Card>
    </div>
  );
}