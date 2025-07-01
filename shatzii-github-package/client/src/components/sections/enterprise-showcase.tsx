import { useState } from "react";
import { Shield, Brain, BarChart3, Truck, CheckCircle, TrendingUp, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import DemoRequestModal from "@/components/modals/demo-request-modal";

export default function EnterpriseShowcase() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const enterpriseMetrics = [
    {
      value: "$24.1B",
      label: "Total Addressable Market",
      description: "AI cybersecurity and automation"
    },
    {
      value: "98.7%",
      label: "Threat Detection Accuracy",
      description: "Sentinel AI platform"
    },
    {
      value: "$2.4M",
      label: "Average Annual Savings",
      description: "Per enterprise customer"
    },
    {
      value: "24 hours",
      label: "Deployment Time",
      description: "vs 6 months for competitors"
    }
  ];

  const businessImpact = [
    {
      icon: Shield,
      title: "Enterprise Security",
      metric: "60% Cost Reduction",
      description: "Sentinel AI delivers comprehensive cybersecurity with automated compliance for SOC 2, ISO 27001, and GDPR frameworks."
    },
    {
      icon: Brain,
      title: "Server Intelligence",
      metric: "Zero API Costs",
      description: "Pharaoh Control Panel provides offline AI-powered server management with predictive analytics and automated optimization."
    },
    {
      icon: BarChart3,
      title: "Education Analytics",
      metric: "92.8% Success Rate",
      description: "ShatziiOS CEO Dashboard manages 24,586+ students across neurodivergent education institutions with executive insights."
    },
    {
      icon: Truck,
      title: "Logistics Optimization",
      metric: "20% Higher Profits",
      description: "TruckFlow AI revolutionizes dispatch operations with autonomous vehicle integration and blockchain smart contracts."
    }
  ];

  const industryVerticals = [
    { name: "Financial Services", percentage: 25, focus: "Regulatory compliance & fraud detection" },
    { name: "Healthcare", percentage: 20, focus: "HIPAA compliance & patient data protection" },
    { name: "Technology", percentage: 30, focus: "Cloud-first security operations" },
    { name: "Manufacturing", percentage: 15, focus: "IoT/OT security requirements" },
    { name: "Professional Services", percentage: 10, focus: "Multi-client data protection" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100/10 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Enterprise AI Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powering <span className="gradient-text">Fortune 500</span> Innovation
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Our enterprise AI solutions serve industries from financial services to healthcare, 
            delivering measurable ROI through offline intelligence and automated operations.
          </p>
        </div>

        {/* Enterprise Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {enterpriseMetrics.map((metric, index) => (
            <div key={index} className="glass-morphism-advanced p-6 rounded-xl text-center modern-card-hover">
              <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
              <div className="text-blue-300 font-medium mb-1">{metric.label}</div>
              <div className="text-blue-200 text-sm">{metric.description}</div>
            </div>
          ))}
        </div>

        {/* Business Impact Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {businessImpact.map((impact, index) => {
            const Icon = impact.icon;
            return (
              <div key={index} className="glass-morphism-advanced p-8 rounded-xl modern-card-hover">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{impact.title}</h3>
                    <div className="text-blue-300 font-medium">{impact.metric}</div>
                  </div>
                </div>
                <p className="text-blue-100 leading-relaxed">{impact.description}</p>
              </div>
            );
          })}
        </div>

        {/* Industry Verticals */}
        <div className="glass-morphism-advanced p-8 rounded-xl mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Industry Coverage</h3>
          <div className="space-y-6">
            {industryVerticals.map((industry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{industry.name}</span>
                    <span className="text-blue-300 font-bold">{industry.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${industry.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-blue-200 text-sm">{industry.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Model */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="glass-morphism-advanced p-6 rounded-xl text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">$47,000</div>
            <div className="text-white font-medium mb-1">Customer Lifetime Value</div>
            <div className="text-blue-200 text-sm">Average enterprise contract</div>
          </div>
          <div className="glass-morphism-advanced p-6 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">14.7:1</div>
            <div className="text-white font-medium mb-1">LTV/CAC Ratio</div>
            <div className="text-blue-200 text-sm">Industry-leading efficiency</div>
          </div>
          <div className="glass-morphism-advanced p-6 rounded-xl text-center">
            <div className="text-2xl font-bold text-purple-400 mb-2">8 months</div>
            <div className="text-white font-medium mb-1">Payback Period</div>
            <div className="text-blue-200 text-sm">Customer acquisition investment</div>
          </div>
        </div>

        {/* Platform Reliability */}
        <div className="glass-morphism-advanced p-8 rounded-xl mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Enterprise-Grade Reliability</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-200 text-sm">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1M+</div>
              <div className="text-blue-200 text-sm">Events/Day Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">47</div>
              <div className="text-blue-200 text-sm">Global Edge Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">SOC 2</div>
              <div className="text-blue-200 text-sm">Type II Compliant</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready for Enterprise-Scale AI Transformation?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join industry leaders leveraging our AI platform for competitive advantage and operational excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setIsDemoModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Executive Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg"
            >
              <Globe className="w-5 h-5 mr-2" />
              Enterprise Consultation
            </Button>
          </div>
        </div>
      </div>

      <DemoRequestModal
        open={isDemoModalOpen}
        onOpenChange={setIsDemoModalOpen}
      />
    </section>
  );
}