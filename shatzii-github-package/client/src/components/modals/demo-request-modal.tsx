import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDemoRequestSchema, type InsertDemoRequest } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DemoRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProduct?: string;
}

export default function DemoRequestModal({ open, onOpenChange, defaultProduct }: DemoRequestModalProps) {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InsertDemoRequest>({
    resolver: zodResolver(insertDemoRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
      productInterest: defaultProduct || "",
    },
  });

  const submitDemoRequest = useMutation({
    mutationFn: async (data: InsertDemoRequest) => {
      return apiRequest("POST", "/api/demo-requests", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Demo Request Submitted",
        description: "We'll contact you soon to schedule your demo!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertDemoRequest) => {
    submitDemoRequest.mutate(data);
  };

  const handleClose = () => {
    onOpenChange(false);
    setIsSubmitted(false);
    form.reset();
  };

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demo Request Submitted!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-lg mb-4">Thank you for your interest!</p>
            <p className="text-gray-600 mb-8">
              Our team will contact you within 24 hours to schedule your personalized demo.
            </p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request a Demo</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Enter your full name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              placeholder="Enter your email"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              {...form.register("company")}
              placeholder="Enter your company name"
            />
            {form.formState.errors.company && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.company.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="productInterest">Product Interest</Label>
            <Select
              value={form.watch("productInterest")}
              onValueChange={(value) => form.setValue("productInterest", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pharaoh">Pharaoh Control Panel</SelectItem>
                <SelectItem value="ai-deployment">AI-Enhanced Deployment</SelectItem>
                <SelectItem value="ai-monitoring">Smart Monitoring</SelectItem>
                <SelectItem value="ai-cms">AI-Powered CMS</SelectItem>
                <SelectItem value="ai-security">AI Security Suite</SelectItem>
                <SelectItem value="ai-automation">Workflow Automation</SelectItem>
                <SelectItem value="sentinel-ai">Sentinel AI Cybersecurity</SelectItem>
                <SelectItem value="shatzii-ceo">ShatziiOS CEO Dashboard</SelectItem>
                <SelectItem value="truckflow-ai">TruckFlow AI</SelectItem>
                <SelectItem value="all">All AI Solutions</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.productInterest && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.productInterest.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              {...form.register("message")}
              placeholder="Tell us about your project or specific questions"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitDemoRequest.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {submitDemoRequest.isPending ? "Submitting..." : "Request Demo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
