import { Card, CardContent } from "@/components/ui/card";
import { ProfessionalBrain, ProfessionalCpu, ProfessionalGlobe, ProfessionalActivity, ProfessionalShield, ProfessionalChart } from "@/components/ui/professional-icons";

export default function AIAdvantages() {
  const advantages = [
    {
      icon: ProfessionalBrain,
      title: "Local AI Engine",
      description: "No internet required, no API fees",
      benefit: "Zero ongoing costs for AI analysis",
    },
    {
      icon: ProfessionalCpu,
      title: "Cost Savings",
      description: "Save $50k+ annually on AI API costs",
      benefit: "AI that pays for itself",
    },
    {
      icon: ProfessionalGlobe,
      title: "Offline Capable",
      description: "Works without internet connection",
      benefit: "Reliable AI even during outages",
    },
    {
      icon: ProfessionalActivity,
      title: "Real-time Processing",
      description: "Instant AI insights and automation",
      benefit: "No latency or rate limits",
    },
    {
      icon: ProfessionalShield,
      title: "Private & Secure",
      description: "Your data never leaves your servers",
      benefit: "Complete privacy and compliance",
    },
    {
      icon: ProfessionalChart,
      title: "Self-improving",
      description: "AI learns from your patterns",
      benefit: "Gets smarter over time",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-mono uppercase tracking-wide mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></span>
            Neural Processing Core
          </div>
          <h2 className="text-4xl font-bold text-slate-100 mb-4">
            Why <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Quantum AI</span> Dominates Legacy Systems
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            While competitors drain budgets with cloud dependencies, our quantum-enhanced neural processors deliver 
            exponential performance gains with zero recurring costs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <div key={index} className="group relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl hover:border-cyan-400/50 transition-all duration-500">
              {/* Holographic effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Scanning line */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
              
              <div className="relative z-10 p-8 text-center">
                <div className="relative mx-auto mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300">
                    <advantage.icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  {/* Orbital rings */}
                  <div className="absolute inset-0 border border-cyan-400/20 rounded-xl opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-300" style={{ animationDuration: '8s' }}></div>
                  <div className="absolute inset-1 border border-cyan-400/10 rounded-xl opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-300" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                  {advantage.title}
                </h3>
                <p className="text-slate-300/90 mb-4 group-hover:text-slate-200 transition-colors duration-300">
                  {advantage.description}
                </p>
                
                <div className="relative">
                  <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-3 group-hover:border-cyan-400/60 group-hover:shadow-lg group-hover:shadow-cyan-400/20 transition-all duration-300">
                    <p className="text-cyan-400 font-medium text-sm font-mono uppercase tracking-wide">
                      {advantage.benefit}
                    </p>
                  </div>
                  {/* Data stream effect */}
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-gradient-to-b from-cyan-400/0 via-cyan-400/50 to-cyan-400/0 opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                The Financial Impact
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <span className="text-gray-700">Cloud AI APIs (Annual)</span>
                  <span className="text-red-600 font-bold text-xl">$50,000+</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Shatzii Local AI (Annual)</span>
                  <span className="text-green-600 font-bold text-xl">$1,188</span>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-bold text-2xl">Save $48,812/year</p>
                  <p className="text-blue-600">4,172% ROI in year one</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">Enterprise Case Study</h4>
              <blockquote className="text-lg italic mb-4">
                "We were spending $60k annually on OpenAI APIs. Shatzii's local AI eliminated that cost entirely while providing better insights."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-blue-200">CTO, TechCorp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}