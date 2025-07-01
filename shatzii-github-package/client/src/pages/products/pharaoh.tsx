import { useState } from "react";
import { ArrowLeft, Brain, CheckCircle, Shield, Zap, Monitor, Cloud, Database } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DemoRequestModal from "@/components/modals/demo-request-modal";

export default function PharaohPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "Local AI Engine",
      description: "Advanced machine learning models that run entirely on your infrastructure, eliminating API costs and ensuring data privacy."
    },
    {
      icon: Shield,
      title: "Automated Security",
      description: "AI-powered threat detection and response that learns from your environment and adapts to new security challenges."
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Real-time performance monitoring with intelligent resource allocation and predictive scaling."
    },
    {
      icon: Monitor,
      title: "Smart Monitoring",
      description: "Comprehensive system monitoring with AI-driven anomaly detection and proactive issue resolution."
    },
    {
      icon: Cloud,
      title: "Offline Capability",
      description: "Works completely offline with no internet dependency, ensuring continuous operation even during outages."
    },
    {
      icon: Database,
      title: "Intelligent Analytics",
      description: "Deep insights into system performance, user behavior, and resource utilization patterns."
    }
  ];

  const benefits = [
    "Eliminate $50k+ annual API costs",
    "99.9% uptime guarantee",
    "Zero data privacy concerns",
    "Instant response times",
    "Self-improving AI algorithms",
    "Enterprise-grade security"
  ];

  const useCases = [
    {
      title: "Enterprise Server Management",
      description: "Manage hundreds of servers with AI-powered automation and monitoring."
    },
    {
      title: "DevOps Optimization",
      description: "Streamline deployment pipelines and optimize resource allocation."
    },
    {
      title: "Security Operations",
      description: "Automated threat detection and incident response for enterprise environments."
    },
    {
      title: "Performance Monitoring",
      description: "Real-time performance insights with predictive analytics and optimization."
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Navigation */}
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <Button
                onClick={() => setIsDemoModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Request Demo
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Brain className="w-4 h-4" />
                AI-Powered Server Management
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Pharaoh <span className="gradient-text">Control Panel</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Revolutionary AI-powered server management platform that works completely offline. 
                Eliminate API costs while gaining superior insights and automation capabilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setIsDemoModalOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Start Free Trial
                </Button>
                <Button variant="outline" size="lg">
                  Watch Demo Video
                </Button>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {benefits.map((benefit, index) => (
                <div key={index} className="glass-morphism p-6 rounded-2xl text-center modern-card-hover">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-4" />
                  <p className="font-medium text-gray-900">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Powerful Features for Modern Infrastructure
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every feature is designed with AI-first principles to provide maximum automation with minimal complexity.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg modern-card-hover">
                  <CardContent className="p-8">
                    <feature.icon className="w-12 h-12 text-blue-600 mb-6" />
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Perfect for Every Use Case
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From small startups to enterprise corporations, Pharaoh adapts to your infrastructure needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {useCases.map((useCase, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg modern-card-hover">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{useCase.title}</h3>
                  <p className="text-gray-600 text-lg">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Specs */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Built for Enterprise Scale
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Local AI Processing</h3>
                      <p className="text-gray-600">Advanced machine learning models running entirely on your infrastructure</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Zero Latency</h3>
                      <p className="text-gray-600">Instant responses with no network delays or API rate limits</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Enterprise Security</h3>
                      <p className="text-gray-600">Your data never leaves your infrastructure, ensuring complete privacy</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Scalable Architecture</h3>
                      <p className="text-gray-600">Handles everything from single servers to global infrastructure</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-6">Technical Specifications</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span>Supported Servers:</span>
                    <span className="font-semibold">Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span className="font-semibold">&lt; 100ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uptime SLA:</span>
                    <span className="font-semibold">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Processing:</span>
                    <span className="font-semibold">Real-time</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Model Updates:</span>
                    <span className="font-semibold">Automatic</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Integration APIs:</span>
                    <span className="font-semibold">REST & GraphQL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Server Management?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of developers who have already made the switch to AI-powered infrastructure management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setIsDemoModalOpen(true)}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </div>

      <DemoRequestModal
        open={isDemoModalOpen}
        onOpenChange={setIsDemoModalOpen}
        defaultProduct="pharaoh"
      />
    </>
  );
}