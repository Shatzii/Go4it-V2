"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface LeadFormProps {
  className?: string;
}

export function LeadForm({ className }: LeadFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Welcome to Go4It! 🎯",
        description: "Check your email for next steps to unlock your athletic potential.",
      });
      
      setEmail("");
      setName("");
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-slate-200">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 bg-slate-800/50 border-slate-700 text-white"
            data-testid="input-name"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-slate-200">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="athlete@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 bg-slate-800/50 border-slate-700 text-white"
            data-testid="input-email"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-lime-400 to-emerald-500 text-slate-900 font-semibold hover:from-lime-500 hover:to-emerald-600"
          data-testid="button-submit-lead"
        >
          {loading ? "Signing Up..." : "Get Started Free"}
        </Button>
      </div>
    </form>
  );
}
