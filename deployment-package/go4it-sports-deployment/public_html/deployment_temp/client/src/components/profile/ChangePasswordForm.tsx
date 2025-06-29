import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import { Loader2, CheckCircle2, ShieldCheck, ShieldAlert, Shield } from "lucide-react";

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
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

// Password validation schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

/**
 * Form for authenticated users to change their password
 */
export default function ChangePasswordForm() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("");
  const [strengthColor, setStrengthColor] = useState("");

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Watch for changes to password field
  const password = useWatch({
    control: form.control,
    name: "newPassword",
    defaultValue: "",
  });
  
  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setStrengthLabel("");
      setStrengthColor("");
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 20;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    setPasswordStrength(strength);
    
    // Set strength label and color
    if (strength < 40) {
      setStrengthLabel("Weak");
      setStrengthColor("bg-red-500");
    } else if (strength < 80) {
      setStrengthLabel("Moderate");
      setStrengthColor("bg-yellow-500");
    } else {
      setStrengthLabel("Strong");
      setStrengthColor("bg-green-500");
    }
  }, [password]);

  // Mutation for changing password
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ChangePasswordFormValues) => {
      try {
        return await apiRequest<{ success: boolean }>("/api/auth/change-password", {
          method: "POST",
          data
        });
      } catch (error: any) {
        throw new Error(error.message || "Failed to change password");
      }
    },
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });
      form.reset();
      setIsSuccess(true);
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsSuccess(false);
    },
  });

  // Form submission handler
  const onSubmit = async (data: ChangePasswordFormValues) => {
    mutate(data);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {isSuccess ? (
          <Alert className="bg-green-50 border-green-200 mb-4">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Password Updated</AlertTitle>
            <AlertDescription className="text-green-700">
              Your password has been changed successfully. Your account is now secure with your new password.
            </AlertDescription>
          </Alert>
        ) : null}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your current password"
                      autoComplete="current-password"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      autoComplete="new-password"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <Progress value={passwordStrength} className={`h-2 ${strengthColor}`} />
                        <span className="text-xs font-medium">{strengthLabel}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <div className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
                          {/[A-Z]/.test(password) ? <CheckCircle2 className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                          <span>Uppercase</span>
                        </div>
                        <div className={`flex items-center gap-1 ${/[a-z]/.test(password) ? 'text-green-600' : ''}`}>
                          {/[a-z]/.test(password) ? <CheckCircle2 className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                          <span>Lowercase</span>
                        </div>
                        <div className={`flex items-center gap-1 ${/[0-9]/.test(password) ? 'text-green-600' : ''}`}>
                          {/[0-9]/.test(password) ? <CheckCircle2 className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                          <span>Number</span>
                        </div>
                        <div className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}`}>
                          {/[^A-Za-z0-9]/.test(password) ? <CheckCircle2 className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                          <span>Special</span>
                        </div>
                        <div className={`flex items-center gap-1 ${password.length >= 8 ? 'text-green-600' : ''}`}>
                          {password.length >= 8 ? <CheckCircle2 className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                          <span>8+ chars</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    Password must be at least 8 characters, include uppercase and lowercase letters, 
                    a number, and a special character.
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}