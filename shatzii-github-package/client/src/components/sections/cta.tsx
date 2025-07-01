import { useState } from "react";
import { Button } from "@/components/ui/button";
import DemoRequestModal from "@/components/modals/demo-request-modal";
import AuthModal from "@/components/modals/auth-modal";
import { useAuth } from "@/hooks/use-auth";

export default function CTA() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const handleStartTrial = () => {
    if (user) {
      // Redirect to dashboard or trial setup
      console.log("Redirect to trial setup");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stop Paying for AI APIs - Switch to Local AI
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Save $50k+ annually with AI that works offline, provides better insights, and gets smarter over time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleStartTrial}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg"
            >
              Start Free Trial
            </Button>
            <Button
              onClick={() => setIsDemoModalOpen(true)}
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      <DemoRequestModal
        open={isDemoModalOpen}
        onOpenChange={setIsDemoModalOpen}
      />
      
      <AuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        mode="register"
        onModeChange={() => {}}
      />
    </>
  );
}
