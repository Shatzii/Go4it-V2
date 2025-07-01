import { useState } from "react";
import { Button } from "@/components/ui/button";
import DemoRequestModal from "@/components/modals/demo-request-modal";
import AuthModal from "@/components/modals/auth-modal";
import { useAuth } from "@/hooks/use-auth";
import { ProfessionalActivity } from "@/components/ui/professional-icons";
import { Link } from "wouter";

export default function Hero() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      // Redirect to dashboard or product selection
      console.log("Redirect to dashboard");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-100 leading-tight">
                World's First Complete
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Autonomous AI Operations</span>
                {" "}Platform
              </h1>
              <p className="mt-6 text-xl text-slate-300 leading-relaxed">
                Deploy specialized AI engines across 12 industries with proven revenue generation. 
                From TruckFlow's $875+ daily driver earnings to Schools.Shatzii.com's AI teachers - experience true autonomous business operations.
              </p>
              <div className="mt-6 flex items-center space-x-6 text-sm text-slate-400">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span>12 Industry AI Engines</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-2"></div>
                  <span>$161.7M Annual Revenue Potential</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-2"></div>
                  <span>47 Autonomous Agents Active</span>
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-900 px-8 py-4 text-lg font-semibold shadow-lg shadow-cyan-500/25"
                >
                  Get Started Free
                </Button>
                <Button
                  onClick={() => setIsDemoModalOpen(true)}
                  variant="outline"
                  size="lg"
                  className="border-slate-600 hover:border-purple-400 text-slate-300 hover:text-purple-400 px-8 py-4 text-lg bg-slate-800/50 backdrop-blur-sm"
                >
                  <ProfessionalActivity className="mr-2 h-4 w-4" />
                  Watch Demo
                </Button>
              </div>
              
              <div className="mt-6">
                <Link href="/wizard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold shadow-lg shadow-purple-500/25 border border-purple-400/30"
                  >
                    🚀 Launch Optimization Wizard
                  </Button>
                </Link>
                <p className="text-slate-400 text-sm mt-2 text-center">
                  Interactive setup to optimize our 12-vertical AI empire
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Software development team collaborating"
                  className="rounded-xl shadow-2xl w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 rounded-xl"></div>
              </div>
            </div>
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
