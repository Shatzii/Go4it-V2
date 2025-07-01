import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Zap, 
  Eye, 
  Users, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  BarChart3,
  Lock,
  Globe,
  Settings
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DemoRequestModal from "@/components/modals/demo-request-modal";

export default function SentinelPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const keyMetrics = [
    { label: "Threat Detection Accuracy", value: "98.7%", icon: Eye },
    { label: "Mean Time to Detection", value: "4.2 min", icon: Clock },
    { label: "False Positive Rate", value: "<2%", icon: CheckCircle },
    { label: "Response Time Improvement", value: "75%", icon: TrendingUp }
  ];

  const competitiveAdvantages = [
    {
      competitor: "Splunk SOAR",
      advantages: [
        "85% faster deployment (24 hours vs 6 months)",
        "60% lower total cost of ownership", 
        "Built-in compliance management"
      ]
    },
    {
      competitor: "Microsoft Sentinel",
      advantages: [
        "Advanced AI threat correlation",
        "Executive-focused dashboards",
        "Automated incident workflows"
      ]
    },
    {
      competitor: "CrowdStrike",
      advantages: [
        "Integrated compliance automation",
        "Complete security orchestration", 
        "Business-focused reporting"
      ]
    }
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "$299",
      endpoints: "100",
      features: ["Basic threat detection", "Incident response", "Email support"]
    },
    {
      name: "Professional", 
      price: "$899",
      endpoints: "1,000",
      popular: true,
      features: ["Advanced AI analytics", "Automated workflows", "24/7 phone support", "Compliance reporting"]
    },
    {
      name: "Enterprise",
      price: "$2,499", 
      endpoints: "Unlimited",
      features: ["Custom integrations", "Dedicated CSM", "On-premises deployment", "SLA guarantees"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-800 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Enterprise Cybersecurity Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Sentinel <span className="gradient-text">AI</span>
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Transform your cybersecurity operations with AI-powered intelligence. 
              Deploy in 24 hours, achieve 98.7% threat detection accuracy, and reduce security costs by 60%.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setIsDemoModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg"
              >
                <Eye className="w-5 h-5 mr-2" />
                Live Security Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg"
              >
                Download Datasheet
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {keyMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="glass-morphism-advanced p-6 rounded-xl text-center">
                  <Icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-blue-200 text-sm">{metric.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="detection" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12 bg-white/10 backdrop-blur-sm">
              <TabsTrigger value="detection" className="text-white">
                <Eye className="w-4 h-4 mr-2" />
                Threat Detection
              </TabsTrigger>
              <TabsTrigger value="response" className="text-white">
                <Zap className="w-4 h-4 mr-2" />
                Incident Response
              </TabsTrigger>
              <TabsTrigger value="compliance" className="text-white">
                <Lock className="w-4 h-4 mr-2" />
                Compliance
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="detection" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-morphism-advanced p-8 rounded-xl">
                  <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Threat Detection</h3>
                  <ul className="space-y-3 text-blue-100">
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-400 mr-3" />98.7% detection accuracy with behavioral analytics</li>
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-400 mr-3" />Real-time threat correlation across all endpoints</li>
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-400 mr-3" />Advanced persistent threat (APT) identification</li>
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-400 mr-3" />Zero-day exploit detection capabilities</li>
                  </ul>
                </div>
                <div className="glass-morphism-advanced p-8 rounded-xl">
                  <h3 className="text-2xl font-bold text-white mb-4">Network Security Monitoring</h3>
                  <ul className="space-y-3 text-blue-100">
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-400 mr-3" />Topology visualization and traffic analysis</li>
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-400 mr-3" />Intrusion detection and prevention</li>
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-400 mr-3" />DNS security and domain reputation</li>
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-400 mr-3" />SSL/TLS certificate monitoring</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="response" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-morphism-advanced p-8 rounded-xl">
                  <h3 className="text-2xl font-bold text-white mb-4">Automated Incident Response</h3>
                  <ul className="space-y-3 text-blue-100">
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-400 mr-3" />Workflow orchestration with team coordination</li>
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-400 mr-3" />Threat containment and isolation</li>
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-400 mr-3" />Evidence collection and forensic analysis</li>
                    <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-400 mr-3" />Communication and stakeholder updates</li>
                  </ul>
                </div>
                <div className="glass-morphism-advanced p-8 rounded-xl">
                  <h3 className="text-2xl font-bold text-white mb-4">Response Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Mean Time to Detection</span>
                      <span className="text-white font-bold">4.2 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Mean Time to Response</span>
                      <span className="text-white font-bold">18 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Containment Success Rate</span>
                      <span className="text-white font-bold">99.3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                {["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA", "PCI DSS", "NIST"].map((framework) => (
                  <div key={framework} className="glass-morphism-advanced p-6 rounded-xl text-center">
                    <Lock className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                    <h4 className="text-white font-bold mb-2">{framework}</h4>
                    <p className="text-blue-200 text-sm">Automated compliance tracking and reporting</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-8">
              <div className="glass-morphism-advanced p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-white mb-6">Executive Security Dashboard</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">$2.4M</div>
                    <div className="text-blue-200 text-sm">Average Annual Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">89%</div>
                    <div className="text-blue-200 text-sm">Tool Consolidation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">90%</div>
                    <div className="text-blue-200 text-sm">Compliance Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">99.9%</div>
                    <div className="text-blue-200 text-sm">Uptime SLA</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Competitive Advantages</h2>
            <p className="text-xl text-blue-100">See how Sentinel AI outperforms industry leaders</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {competitiveAdvantages.map((comp, index) => (
              <div key={index} className="glass-morphism-advanced p-8 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6 text-center">vs. {comp.competitor}</h3>
                <ul className="space-y-3">
                  {comp.advantages.map((advantage, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-100">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Enterprise Pricing</h2>
            <p className="text-xl text-blue-100">Transparent pricing that scales with your organization</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div key={index} className={`glass-morphism-advanced p-8 rounded-xl relative ${tier.popular ? 'ring-2 ring-blue-400' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                    Most Popular
                  </Badge>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="text-4xl font-bold text-blue-400 mb-2">{tier.price}<span className="text-lg text-blue-200">/month</span></div>
                  <p className="text-blue-200">{tier.endpoints} endpoints</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                      <span className="text-blue-100">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsDemoModalOpen(true)}
                >
                  Request Demo
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Security Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of organizations protecting their digital assets with Sentinel AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setIsDemoModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg"
            >
              Schedule Live Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg"
            >
              Contact Sales Team
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      <DemoRequestModal
        open={isDemoModalOpen}
        onOpenChange={setIsDemoModalOpen}
        defaultProduct="Sentinel AI"
      />
    </div>
  );
}