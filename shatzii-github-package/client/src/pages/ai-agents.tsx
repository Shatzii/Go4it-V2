import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Zap } from "lucide-react";
import { ProfessionalBrain, ProfessionalShield, ProfessionalChart, ProfessionalUsers, ProfessionalCpu, ProfessionalDatabase } from "@/components/ui/professional-icons";
import { PharaohIcon, SentinelIcon, NeuralIcon, QuantumIcon, ApolloIcon, AIAgentIcon } from "@/components/icons/ai-agent-icons";
import DemoRequestModal from "@/components/modals/demo-request-modal";

export default function AIAgents() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const agentTypes = [
    {
      id: "customer-service",
      name: "Customer Service Agent",
      icon: ProfessionalUsers,
      description: "24/7 intelligent customer support with natural language processing",
      features: ["Multi-language support", "Sentiment analysis", "Escalation protocols", "CRM integration"],
      useCase: "Handle 80% of customer inquiries autonomously",
      pricing: "From $299/month",
      color: "cyan"
    },
    {
      id: "data-analyst",
      name: "Data Analysis Agent", 
      icon: ProfessionalChart,
      description: "Advanced analytics and reporting with predictive capabilities",
      features: ["Real-time dashboards", "Predictive modeling", "Automated reports", "Pattern recognition"],
      useCase: "Generate insights from complex datasets",
      pricing: "From $499/month",
      color: "blue"
    },
    {
      id: "security-monitoring",
      name: "Security Monitoring Agent",
      icon: ProfessionalShield, 
      description: "Continuous threat detection and response automation",
      features: ["Behavioral analysis", "Threat intelligence", "Automated response", "Compliance reporting"],
      useCase: "Monitor and protect enterprise systems 24/7",
      pricing: "From $799/month",
      color: "purple"
    },
    {
      id: "process-automation",
      name: "Process Automation Agent",
      icon: ProfessionalCpu,
      description: "Workflow optimization and task automation across systems",
      features: ["Workflow mapping", "Task scheduling", "System integration", "Performance optimization"],
      useCase: "Automate repetitive business processes",
      pricing: "From $399/month", 
      color: "green"
    },
    {
      id: "knowledge-management",
      name: "Knowledge Management Agent",
      icon: ProfessionalDatabase,
      description: "Intelligent document processing and knowledge extraction",
      features: ["Document analysis", "Knowledge graphs", "Search optimization", "Content categorization"],
      useCase: "Transform unstructured data into actionable insights",
      pricing: "From $599/month",
      color: "orange"
    },
    {
      id: "strategic-planning",
      name: "Strategic Planning Agent",
      icon: ProfessionalBrain,
      description: "AI-powered strategic analysis and decision support",
      features: ["Market analysis", "Risk assessment", "Scenario planning", "Decision trees"],
      useCase: "Support executive decision-making with data-driven insights",
      pricing: "From $999/month",
      color: "red"
    }
  ];

  const customizationOptions = [
    {
      category: "Training & Knowledge",
      options: [
        "Custom training on company data",
        "Industry-specific knowledge bases", 
        "Proprietary algorithm integration",
        "Historical data analysis"
      ]
    },
    {
      category: "Integration & Deployment",
      options: [
        "API and webhook connections",
        "Cloud or on-premise deployment",
        "Single sign-on (SSO) integration",
        "Custom user interfaces"
      ]
    },
    {
      category: "Monitoring & Analytics",
      options: [
        "Real-time performance dashboards",
        "Custom KPI tracking",
        "Automated reporting schedules",
        "A/B testing capabilities"
      ]
    },
    {
      category: "Security & Compliance",
      options: [
        "Enterprise-grade encryption",
        "GDPR/HIPAA compliance",
        "Audit trail logging",
        "Role-based access control"
      ]
    }
  ];

  const industries = [
    { name: "Healthcare", agents: ["Patient Care Agent", "Diagnosis Assistant", "Treatment Planner"] },
    { name: "Finance", agents: ["Risk Assessment Agent", "Fraud Detection", "Portfolio Manager"] },
    { name: "Manufacturing", agents: ["Quality Control Agent", "Predictive Maintenance", "Supply Chain Optimizer"] },
    { name: "Retail", agents: ["Inventory Manager", "Price Optimization", "Customer Insights"] },
    { name: "Education", agents: ["Learning Assistant", "Performance Tracker", "Content Curator"] },
    { name: "Legal", agents: ["Document Review Agent", "Contract Analyzer", "Compliance Monitor"] }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          {/* Matrix background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-mono uppercase tracking-wide mb-6">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></span>
                AI Agent Factory
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-100 leading-tight mb-6">
                Custom <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">AI Agents</span>
                <br />for Every Business Need
              </h1>
              
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                Build sophisticated AI agents tailored to your industry, processes, and data. 
                Our quantum-enhanced neural architecture adapts to any business requirement.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setIsDemoModalOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-900 px-8 py-4 text-lg font-semibold shadow-lg shadow-cyan-500/25"
                >
                  Start Custom Build
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 px-8 py-4 text-lg bg-slate-800/50 backdrop-blur-sm"
                >
                  View Live Demos
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Agent Types Grid */}
        <section className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-100 mb-6">
                Pre-Built <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Agent Templates</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Start with proven agent architectures designed for specific business functions, 
                then customize to your exact requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agentTypes.map((agent) => (
                <div key={agent.id} className="group relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20 rounded-2xl hover:border-cyan-400/50 transition-all duration-500">
                  {/* Scanning effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl flex items-center justify-center border border-cyan-500/30 mr-4">
                        <agent.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                          {agent.name}
                        </h3>
                        <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-400/30">
                          {agent.pricing}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                      {agent.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      {agent.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-slate-400">
                          <CheckCircle className="w-3 h-3 text-cyan-400 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-3 mb-4">
                      <p className="text-cyan-400 font-medium text-xs font-mono uppercase tracking-wide">
                        {agent.useCase}
                      </p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 bg-slate-800/50"
                    >
                      Customize Agent
                      <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customization Options */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-black to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-100 mb-6">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Infinite</span> Customization
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Every agent is built to your exact specifications with enterprise-grade security and performance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {customizationOptions.map((category, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-100 mb-4 text-center">
                    {category.category}
                  </h3>
                  <ul className="space-y-3">
                    {category.options.map((option, optionIndex) => (
                      <li key={optionIndex} className="flex items-start text-sm text-slate-300">
                        <Zap className="w-3 h-3 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry Solutions */}
        <section className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-100 mb-6">
                Industry-Specific <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Solutions</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Pre-configured agent blueprints optimized for your industry's unique challenges and regulations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry, index) => (
                <Card key={index} className="bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-100 mb-4">{industry.name}</h3>
                    <div className="space-y-2">
                      {industry.agents.map((agent, agentIndex) => (
                        <div key={agentIndex} className="flex items-center text-sm text-slate-300">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                          {agent}
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4 border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 bg-slate-800/50"
                    >
                      Explore {industry.name} Agents
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-black to-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-12">
              <h2 className="text-4xl font-bold text-slate-100 mb-6">
                Ready to Build Your <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Custom AI Agent</span>?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Get started with a free consultation and proof-of-concept development.
                Our AI architects will design the perfect agent for your business needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setIsDemoModalOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-900 px-8 py-4 text-lg font-semibold shadow-lg shadow-cyan-500/25"
                >
                  Schedule Free Consultation
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-600 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 px-8 py-4 text-lg bg-slate-800/50 backdrop-blur-sm"
                >
                  Download Agent Catalog
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <DemoRequestModal 
        open={isDemoModalOpen} 
        onOpenChange={setIsDemoModalOpen}
        defaultProduct="Custom AI Agent"
      />
    </>
  );
}