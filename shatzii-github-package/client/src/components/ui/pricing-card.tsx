import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AuthModal from "@/components/modals/auth-modal";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Plan } from "@shared/schema";

interface PricingCardProps {
  plan: Plan;
}

export default function PricingCard({ plan }: PricingCardProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const selectPlanMutation = useMutation({
    mutationFn: async (planId: number) => {
      return apiRequest("POST", "/api/subscriptions", {
        planId,
        status: "active", // In real app, this would be "pending" until payment confirms
      });
    },
    onSuccess: () => {
      toast({
        title: "Plan Selected",
        description: `You've successfully selected the ${plan.name} plan!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSelectPlan = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (plan.name === "Enterprise") {
      // Handle contact sales for enterprise
      toast({
        title: "Contact Sales",
        description: "Our sales team will contact you shortly for Enterprise pricing.",
      });
      return;
    }

    selectPlanMutation.mutate(plan.id);
  };

  const buttonText = plan.name === "Starter" 
    ? "Get Started" 
    : plan.name === "Professional" 
    ? "Start Free Trial" 
    : "Contact Sales";

  const buttonVariant = plan.popular ? "default" : "outline";

  return (
    <>
      <Card className={`relative ${plan.popular ? "border-2 border-blue-600" : ""}`}>
        {plan.popular && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
          </div>
        )}
        <CardContent className="p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <p className="text-gray-600 mb-6">{plan.description}</p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
              <span className="text-gray-600">/month</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="text-green-500 mr-3 h-4 w-4" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            onClick={handleSelectPlan}
            variant={buttonVariant}
            className={`w-full ${
              plan.popular 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            }`}
            disabled={selectPlanMutation.isPending}
          >
            {selectPlanMutation.isPending ? "Processing..." : buttonText}
          </Button>
        </CardContent>
      </Card>

      <AuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        mode="register"
        onModeChange={() => {}}
      />
    </>
  );
}
