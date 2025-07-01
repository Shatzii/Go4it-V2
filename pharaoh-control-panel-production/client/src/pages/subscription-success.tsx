import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

export default function SubscriptionSuccess() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, navigate] = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    document.title = "Subscription Successful | Pharaoh Control Panel 2.0";
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-dark-1000 text-white">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-dark-1000">
        <TopNav toggleSidebar={toggleSidebar} />
        
        <div className="p-6 flex items-center justify-center min-h-[80vh]">
          <Card className="bg-dark-900 border-dark-700 max-w-md w-full text-center">
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 bg-secondary-900 rounded-full flex items-center justify-center">
                <span className="material-icons text-secondary-300 text-3xl">check_circle</span>
              </div>
              <CardTitle className="text-2xl">Subscription Successful!</CardTitle>
              <CardDescription>Your Pro plan is now active</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-gray-400">
                Thank you for subscribing to the Pro plan. You now have access to all premium features including unlimited AI models, advanced self-healing, and priority support.
              </p>
              <div className="space-y-2 text-sm text-gray-400 mb-6">
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
              <Button 
                className="w-full bg-primary-600 hover:bg-primary-700"
                onClick={() => navigate("/")}
              >
                Return to Dashboard
              </Button>
            </CardContent>
            <CardFooter className="text-xs text-gray-500 flex justify-center border-t border-dark-700 pt-4">
              Your subscription will renew automatically on the same day next month.
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}