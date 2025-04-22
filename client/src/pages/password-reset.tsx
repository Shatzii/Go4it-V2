import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

// Schema for requesting password reset
const requestResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Schema for setting a new password
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RequestResetFormValues = z.infer<typeof requestResetSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function PasswordReset() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Extract token from URL if present
  const params = new URLSearchParams(location.split("?")[1]);
  const token = params.get("token");
  const email = params.get("email");

  // Form for requesting a password reset
  const requestResetForm = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: email || "",
    },
  });

  // Form for setting a new password
  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Handle requesting a password reset
  const onRequestReset = async (values: RequestResetFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Call API to request password reset
      await apiRequest("POST", "/api/auth/request-reset", { email: values.email });
      
      setEmailSent(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for a link to reset your password.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle setting a new password
  const onResetPassword = async (values: ResetPasswordFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (!token || !email) {
        throw new Error("Invalid reset link. Please request a new password reset.");
      }
      
      // Call API to reset password
      await apiRequest("POST", "/api/auth/reset-password", {
        token,
        email,
        password: values.password,
      });
      
      setResetSuccess(true);
      toast({
        title: "Password Reset Successfully",
        description: "Your password has been updated. You can now log in with your new password.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form to request a password reset
  const renderRequestResetForm = () => (
    <Form {...requestResetForm}>
      <form onSubmit={requestResetForm.handleSubmit(onRequestReset)} className="space-y-6">
        <FormField
          control={requestResetForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormDescription>
                We'll send a password reset link to this email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
    </Form>
  );

  // Render form to set a new password
  const renderResetPasswordForm = () => (
    <Form {...resetPasswordForm}>
      <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)} className="space-y-6">
        <FormField
          control={resetPasswordForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter new password" {...field} />
              </FormControl>
              <FormDescription>
                Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={resetPasswordForm.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </Form>
  );

  // Render success message after email is sent
  const renderEmailSentMessage = () => (
    <div className="text-center space-y-4">
      <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6">
        <p className="font-medium">Reset link sent!</p>
        <p className="text-sm mt-1">
          We've sent an email to <span className="font-medium">{requestResetForm.getValues().email}</span> with instructions to reset your password.
        </p>
      </div>
      <p className="text-sm text-gray-500">
        Please check your email and click on the link to reset your password. The link will expire in 1 hour.
      </p>
      <Button variant="outline" className="mt-4" onClick={() => setEmailSent(false)}>
        Send Another Link
      </Button>
    </div>
  );

  // Render success message after password is reset
  const renderResetSuccessMessage = () => (
    <div className="text-center space-y-4">
      <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6">
        <p className="font-medium">Password reset successful!</p>
        <p className="text-sm mt-1">
          Your password has been updated successfully.
        </p>
      </div>
      <p className="text-sm text-gray-500">
        You can now log in to your account with your new password.
      </p>
      <Button className="mt-4 w-full" asChild>
        <Link href="/login">Go to Login</Link>
      </Button>
    </div>
  );

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 mb-6">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Login
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {token 
                ? "Reset Your Password" 
                : (emailSent 
                  ? "Check Your Email" 
                  : "Forgot Your Password?")}
            </CardTitle>
            <CardDescription>
              {token 
                ? "Enter your new password below" 
                : (emailSent 
                  ? "We've sent you instructions to reset your password" 
                  : "Enter your email and we'll send you a reset link")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {token ? (
              resetSuccess ? renderResetSuccessMessage() : renderResetPasswordForm()
            ) : (
              emailSent ? renderEmailSentMessage() : renderRequestResetForm()
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-xs text-gray-500 text-center mt-2">
              Remember your password?{" "}
              <Link href="/login" className="text-primary underline hover:text-primary/80">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}