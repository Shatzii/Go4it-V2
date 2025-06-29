import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Password reset form validation schema
const resetPasswordSchema = z
  .object({
    token: z.string().uuid({ message: "Invalid reset token" }).optional(),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
        message:
          "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Request reset form validation schema
const requestResetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
type RequestResetFormValues = z.infer<typeof requestResetSchema>;

// States the reset form can be in
type FormState = "request" | "reset" | "success" | "error";

/**
 * Password reset page component
 */
export default function PasswordReset() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [formState, setFormState] = useState<FormState>("request");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Get token from URL if present
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const email = params.get("email");

  // Form for password reset request (enter email)
  const requestForm = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: email || "",
    },
  });

  // Form for password reset (enter new password)
  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      email: email || "",
      password: "",
      confirmPassword: "",
    },
  });

  // Effect to set the proper form state based on URL parameters
  useEffect(() => {
    if (token) {
      setFormState("reset");
    } else {
      setFormState("request");
    }
  }, [token]);

  // Handler for password reset request submission
  const onRequestSubmit = async (data: RequestResetFormValues) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Password Reset Email Sent",
          description: "If your email is in our system, you will receive a link to reset your password.",
          duration: 5000,
        });
        
        setFormState("success");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to send password reset email. Please try again.");
        setFormState("error");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again later.");
      setFormState("error");
    } finally {
      setLoading(false);
    }
  };

  // Handler for password reset form submission
  const onResetSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const resetData = {
        token: data.token,
        email: data.email,
        password: data.password,
      };

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
      });

      if (response.ok) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been reset. You can now log in with your new password.",
          duration: 5000,
        });
        
        // Redirect to login after successful reset
        setTimeout(() => {
          navigate("/auth");
        }, 2000);
        
        setFormState("success");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to reset password. The link may be invalid or expired.");
        setFormState("error");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again later.");
      setFormState("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {formState === "request" && (
          <Card className="shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center">
                Reset Your Password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email address and we'll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...requestForm}>
                <form
                  onSubmit={requestForm.handleSubmit(onRequestSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={requestForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : null}
                    Send Reset Link
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center pt-2">
              <Button
                variant="link"
                onClick={() => navigate("/auth")}
                className="text-sm"
              >
                Return to Login
              </Button>
            </CardFooter>
          </Card>
        )}

        {formState === "reset" && (
          <Card className="shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center">
                Create New Password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your new password below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...resetForm}>
                <form
                  onSubmit={resetForm.handleSubmit(onResetSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={resetForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                            readOnly={!!email}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={resetForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={resetForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : null}
                    Reset Password
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center pt-2">
              <Button
                variant="link"
                onClick={() => navigate("/auth")}
                className="text-sm"
              >
                Return to Login
              </Button>
            </CardFooter>
          </Card>
        )}

        {formState === "success" && (
          <Card className="shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center">
                Success
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">
                  {token ? "Password Reset Successful" : "Reset Link Sent"}
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  {token
                    ? "Your password has been reset successfully. You can now log in with your new password."
                    : "If your email is in our system, you will receive a link to reset your password shortly."}
                </AlertDescription>
              </Alert>
              <div className="flex justify-center">
                <Button
                  variant="default"
                  onClick={() => navigate("/auth")}
                  className="mt-4"
                >
                  Return to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {formState === "error" && (
          <Card className="shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center">
                Error
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">
                  Something went wrong
                </AlertTitle>
                <AlertDescription className="text-red-700">
                  {errorMessage || "An error occurred. Please try again."}
                </AlertDescription>
              </Alert>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (token) {
                      setFormState("reset");
                    } else {
                      setFormState("request");
                    }
                  }}
                  className="mt-4 mr-2"
                >
                  Try Again
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigate("/auth")}
                  className="mt-4"
                >
                  Return to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}