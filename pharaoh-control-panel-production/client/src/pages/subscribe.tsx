import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/subscription-success`,
      },
    });

    if (error) {
      toast({
        title: "Subscription Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Subscription Successful",
        description: "You are now subscribed to the Pro plan!",
      });
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <PaymentElement />
        <Button 
          type="submit" 
          className="w-full bg-primary-600 hover:bg-primary-700"
          disabled={isLoading || !stripe || !elements}
        >
          {isLoading ? "Processing..." : "Subscribe Now"}
        </Button>
      </div>
    </form>
  );
};

export default function Subscribe() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    document.title = "Subscribe | Pharaoh Control Panel 2.0";
    
    // Create subscription intent as soon as the page loads
    setIsLoading(true);
    apiRequest("POST", "/api/get-or-create-subscription")
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      })
      .catch(error => {
        toast({
          title: "Error",
          description: "Could not initialize subscription. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      });
  }, [toast]);

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#7c3aed', // primary-600
      colorBackground: '#0f1117', // dark-900
      colorText: '#ffffff',
      colorDanger: '#dc2626',
    },
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-dark-1000 text-white">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-dark-1000">
        <TopNav toggleSidebar={toggleSidebar} />
        
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-white">Subscribe to Pro</h1>
            <p className="text-gray-400 mt-1">Get unlimited access to premium features</p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <Card className="bg-dark-900 border-dark-700">
              <CardHeader>
                <CardTitle>Pro Plan Subscription</CardTitle>
                <CardDescription>Monthly subscription with access to all premium features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold mb-2">$15.00 <span className="text-sm text-gray-400 font-normal">/month</span></div>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center">
                      <span className="material-icons text-secondary-500 mr-2 text-sm">check_circle</span>
                      <span>Unlimited AI Models</span>
                    </div>
                    <div className="flex items-center">
                      <span className="material-icons text-secondary-500 mr-2 text-sm">check_circle</span>
                      <span>Advanced Self-Healing</span>
                    </div>
                    <div className="flex items-center">
                      <span className="material-icons text-secondary-500 mr-2 text-sm">check_circle</span>
                      <span>Priority Support</span>
                    </div>
                    <div className="flex items-center">
                      <span className="material-icons text-secondary-500 mr-2 text-sm">check_circle</span>
                      <span>Exclusive AI Marketplace Models</span>
                    </div>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
                  </div>
                ) : clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                    <SubscribeForm />
                  </Elements>
                ) : (
                  <div className="text-center p-4 text-gray-400">
                    Unable to initialize subscription system. Please try again later.
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-xs text-gray-500 flex justify-center border-t border-dark-700 pt-4">
                Cancel anytime. No long-term commitment required.
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}