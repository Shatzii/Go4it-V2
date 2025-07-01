import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema, type LoginData, type RegisterData } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
}

export default function AuthModal({ open, onOpenChange, mode, onModeChange }: AuthModalProps) {
  const { toast } = useToast();
  const { login } = useAuth();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      company: "",
      role: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      onOpenChange(false);
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      onOpenChange(false);
      toast({
        title: "Account Created!",
        description: "Welcome to Shatzii! Your account has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onLoginSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  const handleClose = () => {
    onOpenChange(false);
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "login" ? "Sign In" : "Create Account"}</DialogTitle>
        </DialogHeader>

        {mode === "login" ? (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="login-email">Email Address</Label>
              <Input
                id="login-email"
                type="email"
                {...loginForm.register("email")}
                placeholder="Enter your email"
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-red-600 mt-1">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                {...loginForm.register("password")}
                placeholder="Enter your password"
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-red-600 mt-1">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => onModeChange("register")}
                className="text-blue-600"
              >
                Don't have an account? Sign up
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="register-name">Full Name</Label>
              <Input
                id="register-name"
                {...registerForm.register("name")}
                placeholder="Enter your full name"
              />
              {registerForm.formState.errors.name && (
                <p className="text-sm text-red-600 mt-1">{registerForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="register-email">Email Address</Label>
              <Input
                id="register-email"
                type="email"
                {...registerForm.register("email")}
                placeholder="Enter your email"
              />
              {registerForm.formState.errors.email && (
                <p className="text-sm text-red-600 mt-1">{registerForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="register-company">Company (Optional)</Label>
              <Input
                id="register-company"
                {...registerForm.register("company")}
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <Label htmlFor="register-role">Role (Optional)</Label>
              <Input
                id="register-role"
                {...registerForm.register("role")}
                placeholder="e.g., Developer, CTO, Founder"
              />
            </div>

            <div>
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                {...registerForm.register("password")}
                placeholder="Enter your password"
              />
              {registerForm.formState.errors.password && (
                <p className="text-sm text-red-600 mt-1">{registerForm.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="register-confirm-password">Confirm Password</Label>
              <Input
                id="register-confirm-password"
                type="password"
                {...registerForm.register("confirmPassword")}
                placeholder="Confirm your password"
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {registerMutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => onModeChange("login")}
                className="text-blue-600"
              >
                Already have an account? Sign in
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
