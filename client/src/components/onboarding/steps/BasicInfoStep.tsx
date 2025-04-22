import React, { useState } from "react";
import { ProfileWizardState } from "../ProfileCompletionWizard";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, User, Mail, PencilLine, ImageIcon } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Props type
interface BasicInfoStepProps {
  formState: ProfileWizardState;
  updateFormState: (data: Partial<ProfileWizardState>) => void;
}

// Form schema
const basicInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  bio: z.string().optional(),
});

type BasicInfoValues = z.infer<typeof basicInfoSchema>;

/**
 * Basic Info Step
 * 
 * First step in the profile completion wizard that collects basic user information.
 */
export default function BasicInfoStep({ formState, updateFormState }: BasicInfoStepProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<BasicInfoValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: formState.name,
      username: formState.username,
      email: formState.email,
      bio: formState.bio || "",
    },
  });
  
  // Handle form submission
  const onSubmit = (data: BasicInfoValues) => {
    updateFormState(data);
  };
  
  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Check file type and size
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image.",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append("image", file);
      
      // Upload image to server
      const response = await fetch("/api/uploads/profile-image", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      
      const data = await response.json();
      
      // Update form state with new image path
      updateFormState({
        profileImage: data.imagePath,
      });
      
      toast({
        title: "Image uploaded",
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Watch form changes and update parent state
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormState(value as Partial<ProfileWizardState>);
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormState]);
  
  return (
    <div className="space-y-6">
      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center justify-center gap-4">
        <Avatar className="h-24 w-24">
          {formState.profileImage ? (
            <AvatarImage src={formState.profileImage} alt={formState.name} />
          ) : (
            <AvatarFallback className="text-xl bg-primary/10">
              {formState.name ? formState.name.charAt(0).toUpperCase() : <User />}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex items-center gap-2">
          <Input
            type="file"
            id="profile-image"
            className="hidden"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("profile-image")?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              "Uploading..."
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                {formState.profileImage ? "Change Picture" : "Upload Picture"}
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Basic Info Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    autoComplete="name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Choose a username"
                    {...field}
                    autoComplete="username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email address"
                    type="email"
                    {...field}
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little about yourself"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}