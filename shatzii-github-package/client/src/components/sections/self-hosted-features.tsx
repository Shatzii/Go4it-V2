import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Shield, Database, Cpu, Network, Zap, Clock, Lock } from "lucide-react";
import { Link } from "wouter";

export default function SelfHostedFeatures() {
  const features = [
    {
      icon: Server,
      title: "Complete Self-Hosting",
      description: "Deploy on your own infrastructure with full control. No external dependencies or vendor lock-in.",
      benefits: ["100% data sovereignty", "Custom deployment options", "Infrastructure independence"],
      highlight: "Zero External APIs"
    },
    {
      icon: Cpu,
      title: "Local AI Models",
      description: "Mistral, Llama, Phi3, and Qwen models running entirely on your hardware.",
      benefits: ["No API costs", "Unlimited usage", "Custom fine-tuning"],
      highlight: "4 Specialized Models"
    },
    {
      icon: Database,
      title: "Private Data Processing",
      description: "All AI processing happens locally. Your business data never leaves your servers.",
      benefits: ["GDPR compliant", "Enterprise security", "Audit trail control"],
      highlight: "Local Processing"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Military-grade encryption with role-based access control and comprehensive audit logging.",
      benefits: ["End-to-end encryption", "Multi-factor authentication", "Security monitoring"],
      highlight: "Bank-Level Security"
    }
  ];

  const deploymentOptions = [
    {
      name: "Docker Compose",
      description: "Single-command deployment with all services",
      command: "docker-compose up -d",
      time: "15 minutes"
    },
    {
      name: "Kubernetes",
      description: "Production-ready orchestration with auto-scaling",
      command: "kubectl apply -f shatzii-k8s.yaml",
      time: "30 minutes"
    },
    {
      name: "Bare Metal",
      description: "Direct installation on your servers",
      command: "./setup-production.sh",
      time: "45 minutes"
    }
  ];

  const aiModels = [
    {
      name: "Mistral 7B Instruct",
      purpose: "Content Generation",
      size: "4.1GB",
      performance: "98% accuracy"
    },
    {
      name: "Llama 3.2 3B",
      purpose: "Fast Responses",
      size: "1.9GB",
      performance: "Sub-100ms"
    },
    {
      name: "Phi3 Mini",
      purpose: "Classification",
      size: "2.2GB",
      performance: "95% precision"
    },
    {
      name: "Qwen 2.5 7B",
      purpose: "Business Logic",
      size: "4.3GB",
      performance: "92% context"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Self-Hosted Infrastructure
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Data, <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Your Infrastructure</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Complete AI business automation that runs entirely on your servers. 
            No external APIs, no data sharing, no vendor dependencies - just pure autonomous performance.
          </p>
        </div>

        {/* Core Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-all backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-green-600/30 text-green-300">
                    {feature.highlight}
                  </Badge>
                </div>
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Models Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Local AI Models</h3>
            <p className="text-gray-300 mb-6">
              Four specialized AI models optimized for business operations, running entirely on your infrastructure.
            </p>
            <div className="space-y-4">
              {aiModels.map((model, index) => (
                <Card key={index} className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{model.name}</h4>
                      <Badge variant="outline" className="border-cyan-500 text-cyan-300">
                        {model.size}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{model.purpose}</span>
                      <span className="text-green-400">{model.performance}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Deployment Options</h3>
            <p className="text-gray-300 mb-6">
              Choose your preferred deployment method. All options include complete automation and monitoring.
            </p>
            <div className="space-y-4">
              {deploymentOptions.map((option, index) => (
                <Card key={index} className="bg-slate-800/30 border-slate-700 hover:border-cyan-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">{option.name}</h4>
                      <Badge variant="secondary" className="bg-cyan-600/30 text-cyan-300">
                        {option.time}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{option.description}</p>
                    <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-sm text-green-400">
                      {option.command}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700 mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Self-Hosted Performance</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">&lt;50ms</div>
              <div className="text-gray-300">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">0</div>
              <div className="text-gray-300">External Dependencies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-300">Autonomous Operation</div>
            </div>
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="w-5 h-5 mr-2 text-green-400" />
                Security Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">End-to-end encryption</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-gray-300">Role-based access control</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Comprehensive audit logging</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-gray-300">Multi-factor authentication</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-cyan-400" />
                Compliance Ready
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">GDPR compliant by design</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-gray-300">SOC 2 Type II ready</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">ISO 27001 framework</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-gray-300">Industry-specific compliance</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-2xl p-8 border border-green-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Deploy Your Private AI Infrastructure</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get complete business automation with full data control. One-command deployment 
              sets up everything you need for autonomous AI operations.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/products">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600">
                  View Deployment Guide
                </Button>
              </Link>
              <Link href="/autonomous-marketing">
                <Button size="lg" variant="outline" className="border-cyan-500 text-cyan-300 hover:bg-cyan-600/20">
                  See Live Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}