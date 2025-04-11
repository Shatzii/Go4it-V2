import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Video, Award } from "lucide-react";
import { AgreementDialog } from "@/components/agreement-dialog";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["athlete", "coach"]),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions to register",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loading, login, register } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState<RegisterFormValues | null>(null);
  const { toast } = useToast();

  // Redirect if already logged in and scroll to top on mount
  useEffect(() => {
    // Scroll to top of page when component mounts
    window.scrollTo(0, 0);
    
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      role: "athlete",
      agreedToTerms: false,
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      // Disable form while submitting to prevent double clicks
      loginForm.reset(data);
      
      // Add a small delay before login to ensure UI is ready
      // This can help prevent the flash of error state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Attempt to login with credentials
      await login(data.username, data.password);
      
      // Login is handled by auth context, which will redirect on success
    } catch (error) {
      console.error("Login error:", error);
      // Error toasts are already handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!data.username || !data.password || !data.email || !data.name || !data.role) {
        throw new Error("Please fill in all required fields");
      }

      // Show the NDA agreement dialog
      setPendingRegistration(data);
      setShowAgreement(true);
      
      // Clear any previous form errors
      registerForm.clearErrors();
      
      console.log("Attempting registration with data:", data);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Error",
        description: error.message || "There was a problem with registration. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      setPendingRegistration(null);
    }
  };
  
  const handleAgreementAccepted = async () => {
    try {
      if (pendingRegistration) {
        console.log("Processing registration after agreement acceptance");
        
        // Update the registration data with agreement acceptance
        const registrationData = {
          ...pendingRegistration,
          agreedToTerms: true
        };
        
        // Complete the registration process
        const result = await register(registrationData);
        
        if (!result) {
          throw new Error("Registration failed");
        }
        
        // Reset state and forms
        setPendingRegistration(null);
        setShowAgreement(false);
        registerForm.reset();
        
        toast({
          title: "Registration Successful",
          description: "Welcome to Get Verified! You can now log in.",
          variant: "default"
        });
        
        // Switch to login tab
        setActiveTab("login");
      }
    } catch (error) {
      console.error("Registration error after agreement:", error);
      toast({
        title: "Registration Failed",
        description: "There was a problem completing your registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAgreementClosed = () => {
    setShowAgreement(false);
    setIsSubmitting(false);
  };
  
  // Duplicate function removed

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:px-0">
        <div className="flex flex-col justify-center text-center md:text-left">
          <h1 className="mb-4 text-4xl font-bold tracking-tight neon-text md:text-5xl lg:text-6xl">
            GET VERIFIED
          </h1>
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Combine Tour
          </h2>
          <p className="mb-6 text-lg text-gray-300 md:text-xl">
            AI-powered sports analysis to help student athletes reach their potential and connect with coaches.
          </p>
          <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-4 md:flex-row">
            <div className="flex items-center p-4 bg-gray-900/80 rounded-lg shadow-sm card-glow">
              <div className="p-3 mr-4 bg-primary/10 rounded-full">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-white">Video Analysis</h3>
                <p className="text-sm text-gray-400">AI motion analysis for your sports videos</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-900/80 rounded-lg shadow-sm card-glow">
              <div className="p-3 mr-4 bg-primary/10 rounded-full">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-white">Sport Matching</h3>
                <p className="text-sm text-gray-400">Find your perfect sport match</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md bg-gray-900 border-gray-800 card-glow">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Welcome</CardTitle>
              <CardDescription className="text-gray-400">Sign in to your account or create a new one</CardDescription>
            </CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800 p-1">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-primary data-[state=active]:neon-text data-[state=active]:shadow-sm"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-primary data-[state=active]:neon-text data-[state=active]:shadow-sm"
                >
                  Register
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your username" 
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your password" 
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full verified-button" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          "Sign in"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Choose a username" 
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Create a password" 
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">I am a</FormLabel>
                            <FormControl>
                              <select
                                className="w-full p-2 rounded-md bg-gray-800 border-gray-700 text-white"
                                {...field}
                              >
                                <option value="athlete">Student Athlete</option>
                                <option value="coach">Coach</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full verified-button" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create account"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
      
      {/* Non-Disclosure Agreement Modal */}
      <AgreementDialog 
        open={showAgreement} 
        onClose={handleAgreementClosed}
        onAccept={handleAgreementAccepted}
        agreementType="nda"
      />
    </div>
  );
}