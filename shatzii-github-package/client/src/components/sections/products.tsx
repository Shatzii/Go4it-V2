import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ProfessionalBrain, ProfessionalShield, ProfessionalChart, ProfessionalTruck } from "@/components/ui/professional-icons";
import { Home } from "lucide-react";

export default function Products() {
  const verticalEngines = [
    {
      id: "trucking",
      icon: ProfessionalTruck,
      title: "TruckFlow AI",
      description: "Load optimization and driver earnings maximization. Proven $875+ daily earnings with 23% fuel savings through AI route planning.",
      revenue: "$99K monthly potential",
      category: "Transportation & Logistics",
      highlight: "$875+ Daily Earnings",
      link: "/driver-earnings"
    },
    {
      id: "education",
      icon: ProfessionalBrain,
      title: "Schools.Shatzii.com",
      description: "6 AI teachers for K-12 curriculum with personalized learning paths. 34% improvement in student engagement rates.",
      revenue: "$50K monthly potential",
      category: "Education Technology",
      highlight: "6 AI Teachers",
      link: "/schools"
    },
    {
      id: "roofing",
      icon: Home,
      title: "Roofing AI Engine",
      description: "Complete roofing automation from lead generation to project completion. Weather-driven lead detection with 67% conversion rates.",
      revenue: "$260K monthly potential",
      category: "Construction & Real Estate",
      highlight: "Weather Intelligence",
      link: "/roofing-ai"
    },
    {
      id: "financial",
      icon: ProfessionalChart,
      title: "Financial AI Engine",
      description: "SEC-compliant financial analysis, risk assessment, and algorithmic trading strategies with 97% regulatory compliance.",
      revenue: "$6.5M annual potential",
      category: "Financial Services",
      highlight: "SEC Compliant",
      link: "/financial-ai"
    },
    {
      id: "legal",
      icon: ProfessionalShield,
      title: "Legal AI Engine",
      description: "Contract analysis, legal research automation, and case outcome prediction with 95% accuracy rate.",
      revenue: "$1.2M annual potential",
      category: "Legal Technology",
      highlight: "95% Accuracy",
      link: "/legal-ai"
    },
    {
      id: "healthcare",
      icon: ProfessionalBrain,
      title: "Healthcare AI Engine",
      description: "Medical diagnosis assistance, treatment optimization, and drug discovery acceleration with 96% diagnostic accuracy.",
      revenue: "$6.5M annual potential",
      category: "Healthcare Technology",
      highlight: "96% Diagnostic Accuracy",
      link: "/healthcare-ai"
    },
    {
      id: "manufacturing",
      icon: ProfessionalChart,
      title: "Manufacturing AI Engine",
      description: "Production optimization, predictive maintenance, and quality control with 34% efficiency gains.",
      revenue: "$45.4M annual potential",
      category: "Manufacturing & Industrial",
      highlight: "34% Efficiency Gains",
      link: "/manufacturing-ai"
    },
    {
      id: "retail",
      icon: ProfessionalBrain,
      title: "Retail AI Engine",
      description: "Customer behavior analytics, inventory optimization, and personalized recommendations with demand forecasting.",
      revenue: "$102M annual potential",
      category: "Retail & E-commerce",
      highlight: "Demand Forecasting",
      link: "/retail-ai"
    },
    {
      id: "energy",
      icon: ProfessionalChart,
      title: "Energy AI Engine",
      description: "Grid optimization, renewable energy forecasting, and carbon footprint optimization for utilities.",
      revenue: "$2.4M annual potential",
      category: "Energy & Utilities",
      highlight: "Grid Optimization",
      link: "/energy-ai"
    }
  ];

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            13 Industry-Specific AI Engines
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
            Complete Vertical <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">AI Domination</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Specialized AI engines for every major industry with proven revenue generation. From $875+ daily driver earnings to $161.7M annual revenue potential across all verticals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {verticalEngines.map((engine) => (
            <Link key={engine.id} href={engine.link}>
              <div className="group relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20 p-6 rounded-2xl hover:border-cyan-400/50 transition-all duration-500 cursor-pointer">
                {/* Animated background grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Glowing corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Scanning line effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300">
                          <engine.icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        {/* Pulsing glow effect */}
                        <div className="absolute inset-0 bg-cyan-400/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
                      </div>
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider text-cyan-400/80 mb-2 group-hover:text-cyan-300 transition-colors">
                          {engine.category}
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors duration-300">
                          {engine.title}
                        </h3>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wide group-hover:border-cyan-400/60 group-hover:shadow-lg group-hover:shadow-cyan-400/20 transition-all duration-300">
                        {engine.highlight}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-300/90 mb-3 text-sm leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                    {engine.description}
                  </p>
                  
                  <div className="mb-4 p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                    <div className="text-green-400 text-sm font-semibold">
                      Revenue Potential: {engine.revenue}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-cyan-400 font-medium group-hover:translate-x-2 transition-all duration-300">
                      <span className="text-sm font-mono uppercase tracking-wide">Deploy Engine</span>
                      <ArrowRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">9 AI Solutions</span> • 
              <span className="font-semibold text-gray-900">Zero API Costs</span> • 
              <span className="font-semibold text-gray-900">Offline Capable</span>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              View All Solutions
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}