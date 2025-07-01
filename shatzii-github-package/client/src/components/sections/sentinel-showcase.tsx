import { Shield, Clock, DollarSign, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DemoRequestModal from "@/components/modals/demo-request-modal";

export default function SentinelShowcase() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const competitorComparison = [
    {
      feature: "AI-Powered Detection",
      sentinel: "✅ Advanced ML",
      competitors: ["⚠️ Limited", "⚠️ Basic", "✅ Good", "⚠️ Limited"]
    },
    {
      feature: "Automated Response",
      sentinel: "✅ Full Workflow",
      competitors: ["✅ Good", "⚠️ Limited", "⚠️ Basic", "⚠️ Limited"]
    },
    {
      feature: "Compliance Management",
      sentinel: "✅ Built-in",
      competitors: ["❌ Add-on", "❌ Separate", "❌ Manual", "❌ Third-party"]
    },
    {
      feature: "Implementation Time",
      sentinel: "24-48 hours",
      competitors: ["3-6 months", "6-12 months", "2-4 weeks", "4-8 weeks"]
    },
    {
      feature: "False Positive Rate",
      sentinel: "<2%",
      competitors: ["15-25%", "20-30%", "8-12%", "12-18%"]
    }
  ];

  const roiMetrics = [
    {
      icon: DollarSign,
      label: "Annual Savings",
      value: "$684,212",
      description: "vs traditional security approach"
    },
    {
      icon: TrendingUp,
      label: "3-Year ROI",
      value: "1,247%",
      description: "Return on investment"
    },
    {
      icon: Shield,
      label: "Breach Prevention",
      value: "99.3%",
      description: "Success rate"
    },
    {
      icon: Clock,
      label: "Response Time",
      value: "18 min",
      description: "Average incident response"
    }
  ];

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4 mr-2" />
              Enterprise Cybersecurity Platform
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Sentinel AI: Next-Generation Security Operations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Deploy enterprise-grade AI-powered cybersecurity in 24 hours. Achieve 98.7% threat detection 
              accuracy while reducing security costs by 60% and response times by 75%.
            </p>
            <Button 
              size="lg" 
              onClick={() => setIsDemoModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Request Sentinel AI Demo
            </Button>
          </div>

          {/* ROI Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {roiMetrics.map((metric, index) => (
              <Card key={index} className="text-center bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <metric.icon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
                  <div className="text-sm font-medium text-gray-700 mb-1">{metric.label}</div>
                  <div className="text-xs text-gray-500">{metric.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Competitive Comparison */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              How Sentinel AI Compares to Enterprise Security Solutions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold text-blue-600">Sentinel AI</th>
                    <th className="text-center p-4 font-medium text-gray-500">Splunk</th>
                    <th className="text-center p-4 font-medium text-gray-500">IBM QRadar</th>
                    <th className="text-center p-4 font-medium text-gray-500">CrowdStrike</th>
                    <th className="text-center p-4 font-medium text-gray-500">Microsoft</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorComparison.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className="p-4 text-center font-semibold text-blue-600">{row.sentinel}</td>
                      {row.competitors.map((comp, i) => (
                        <td key={i} className="p-4 text-center text-sm">{comp}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                The True Cost of Enterprise Security
              </h3>
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-bold text-red-800 mb-4">Traditional Security Approach (Annual)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-red-700">Security analysts (3 FTE)</span>
                      <span className="font-semibold text-red-800">$390,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Security tools licensing</span>
                      <span className="font-semibold text-red-800">$180,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Compliance consulting</span>
                      <span className="font-semibold text-red-800">$150,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Incident response services</span>
                      <span className="font-semibold text-red-800">$120,000</span>
                    </div>
                    <div className="border-t border-red-300 pt-3 flex justify-between">
                      <span className="font-bold text-red-800">Total Annual Cost</span>
                      <span className="font-bold text-red-800 text-xl">$840,000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-bold text-green-800 mb-4">Sentinel AI Approach (Annual)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-green-700">Platform subscription</span>
                      <span className="font-semibold text-green-800">$10,788</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Reduced analyst needs (1 FTE)</span>
                      <span className="font-semibold text-green-800">$130,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Automated compliance</span>
                      <span className="font-semibold text-green-800">$15,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Included incident response</span>
                      <span className="font-semibold text-green-800">$0</span>
                    </div>
                    <div className="border-t border-green-300 pt-3 flex justify-between">
                      <span className="font-bold text-green-800">Total Annual Cost</span>
                      <span className="font-bold text-green-800 text-xl">$155,788</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-800 mb-2">$684,212</div>
                  <div className="text-blue-700 font-medium">Net Annual Savings</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-6">Customer Success Story</h4>
              <blockquote className="text-lg italic mb-6">
                "Sentinel AI transformed our security operations overnight. We went from managing 15 different 
                security tools to one unified platform. The AI-powered threat detection caught a sophisticated 
                attack that our previous $2M SIEM completely missed."
              </blockquote>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-full mr-4 flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-blue-200">CISO, Fortune 500 Financial Services</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold">89%</div>
                  <div className="text-blue-200">Tool Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">$1.8M</div>
                  <div className="text-blue-200">Annual Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">Zero</div>
                  <div className="text-blue-200">Successful Attacks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">18 mo</div>
                  <div className="text-blue-200">Track Record</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DemoRequestModal
        open={isDemoModalOpen}
        onOpenChange={setIsDemoModalOpen}
        defaultProduct="sentinel-ai"
      />
    </>
  );
}