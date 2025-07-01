import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import TrustedBy from "@/components/sections/trusted-by";
import InteractiveVerticalDashboard from "@/components/sections/interactive-vertical-dashboard";
import LiveRevenueCounter from "@/components/sections/live-revenue-counter";
import AIAgentHeatmap from "@/components/sections/ai-agent-heatmap";
import ProgressTracker from "@/components/optimization/progress-tracker";
import Products from "@/components/sections/products";
import AIAdvantages from "@/components/sections/ai-advantages";
import AutonomousShowcase from "@/components/sections/autonomous-showcase";
import SelfHostedFeatures from "@/components/sections/self-hosted-features";
import LiveAIStatus from "@/components/sections/live-ai-status";
import Demo from "@/components/sections/demo";
import Pricing from "@/components/sections/pricing";
import Testimonials from "@/components/sections/testimonials";
import About from "@/components/sections/about";
import CTA from "@/components/sections/cta";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <TrustedBy />
      <LiveRevenueCounter />
      <InteractiveVerticalDashboard />
      <AIAgentHeatmap />
      <LiveAIStatus />
      <Products />
      <AIAdvantages />
      <AutonomousShowcase />
      <SelfHostedFeatures />
      <Demo />
      <Pricing />
      <Testimonials />
      <About />
      <CTA />
      <Footer />
      <ProgressTracker />
    </div>
  );
}
