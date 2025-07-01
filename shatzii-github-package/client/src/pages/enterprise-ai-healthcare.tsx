import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Heart,
  Shield,
  Database,
  FileText,
  Users,
  Calendar,
  TrendingUp,
  Award,
  Lock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Stethoscope,
  Brain,
  Clock
} from 'lucide-react';

export default function EnterpriseAIHealthcare() {
  const { toast } = useToast();
  const [selectedDemo, setSelectedDemo] = useState('patient-flow');

  const healthcareMetrics = {
    totalPatients: 125847,
    processingTime: 73,
    complianceScore: 99.8,
    costSavings: 2400000,
    automatedWorkflows: 47,
    aiAccuracy: 97.3,
    monthlyProcessed: 45923,
    errorReduction: 89
  };

  const complianceFeatures = [
    {
      name: 'HIPAA Compliance',
      status: 'certified',
      description: 'End-to-end patient data protection and privacy controls',
      percentage: 100
    },
    {
      name: 'SOC 2 Type II',
      status: 'certified',
      description: 'Enterprise security and availability controls',
      percentage: 100
    },
    {
      name: 'FDA 21 CFR Part 11',
      status: 'compliant',
      description: 'Electronic records and signatures validation',
      percentage: 98
    },
    {
      name: 'HL7 FHIR',
      status: 'integrated',
      description: 'Healthcare data exchange standards',
      percentage: 95
    }
  ];

  const useCases = [
    {
      id: 'patient-flow',
      title: 'Patient Workflow Automation',
      description: 'Automated patient intake, scheduling, and care coordination',
      roi: '340%',
      timeSaved: '45 hours/week',
      accuracy: '97.8%',
      features: [
        'Automated patient registration and verification',
        'AI-powered appointment scheduling optimization',
        'Real-time insurance verification and authorization',
        'Care team coordination and handoff automation',
        'Patient communication and reminder systems'
      ]
    },
    {
      id: 'clinical-docs',
      title: 'Clinical Documentation',
      description: 'AI-powered medical record processing and clinical note generation',
      roi: '280%',
      timeSaved: '32 hours/week',
      accuracy: '96.5%',
      features: [
        'Automated clinical note transcription and coding',
        'Medical terminology standardization',
        'ICD-10 and CPT code auto-assignment',
        'Clinical decision support integration',
        'Quality measure extraction and reporting'
      ]
    },
    {
      id: 'billing-revenue',
      title: 'Revenue Cycle Management',
      description: 'Automated billing, coding, and revenue optimization',
      roi: '420%',
      timeSaved: '60 hours/week',
      accuracy: '98.2%',
      features: [
        'Automated medical coding and billing',
        'Claims processing and submission',
        'Denial management and appeals',
        'Payment posting and reconciliation',
        'Revenue analytics and optimization'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <Heart className="h-12 w-12 text-cyan-400 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Shatzii Healthcare AI
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            HIPAA-compliant autonomous AI platform transforming healthcare operations with 
            proven ROI and regulatory compliance
          </p>
          
          <div className="flex justify-center items-center mt-6 space-x-6">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-green-400 font-medium">HIPAA Certified</span>
            </div>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-blue-400 font-medium">SOC 2 Type II</span>
            </div>
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-purple-400 mr-2" />
              <span className="text-purple-400 font-medium">Self-Hosted</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Patients Processed</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {healthcareMetrics.totalPatients.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-400">+23% this month</p>
                </div>
                <Users className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Processing Time Reduction</p>
                  <p className="text-2xl font-bold text-green-400">
                    {healthcareMetrics.processingTime}%
                  </p>
                  <p className="text-xs text-green-400">Faster workflows</p>
                </div>
                <Clock className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Compliance Score</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {healthcareMetrics.complianceScore}%
                  </p>
                  <p className="text-xs text-purple-400">Audit ready</p>
                </div>
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Annual Cost Savings</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    ${(healthcareMetrics.costSavings / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-yellow-400">Verified ROI</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Framework */}
        <Card className="bg-slate-800 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Healthcare Compliance Framework
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complianceFeatures.map((feature, index) => (
                <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">{feature.name}</h3>
                    <Badge 
                      variant="secondary" 
                      className={`${
                        feature.status === 'certified' ? 'bg-green-600 text-white' :
                        feature.status === 'compliant' ? 'bg-blue-600 text-white' :
                        'bg-purple-600 text-white'
                      } border-0`}
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{feature.description}</p>
                  <div className="flex items-center space-x-3">
                    <Progress value={feature.percentage} className="flex-1" />
                    <span className="text-sm font-medium text-white">{feature.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Use Cases and Demos */}
        <Card className="bg-slate-800 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Healthcare AI Solutions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedDemo} onValueChange={setSelectedDemo} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger value="patient-flow">Patient Workflow</TabsTrigger>
                <TabsTrigger value="clinical-docs">Clinical Documentation</TabsTrigger>
                <TabsTrigger value="billing-revenue">Revenue Cycle</TabsTrigger>
              </TabsList>
              
              {useCases.map((useCase) => (
                <TabsContent key={useCase.id} value={useCase.id} className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Use Case Details */}
                    <div className="lg:col-span-2">
                      <div className="p-6 bg-slate-700/30 rounded-lg">
                        <h3 className="text-xl font-bold text-white mb-4">{useCase.title}</h3>
                        <p className="text-slate-300 mb-6">{useCase.description}</p>
                        
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-3 bg-slate-800 rounded-lg">
                            <p className="text-2xl font-bold text-green-400">{useCase.roi}</p>
                            <p className="text-xs text-slate-400">ROI</p>
                          </div>
                          <div className="text-center p-3 bg-slate-800 rounded-lg">
                            <p className="text-2xl font-bold text-blue-400">{useCase.timeSaved}</p>
                            <p className="text-xs text-slate-400">Time Saved</p>
                          </div>
                          <div className="text-center p-3 bg-slate-800 rounded-lg">
                            <p className="text-2xl font-bold text-purple-400">{useCase.accuracy}</p>
                            <p className="text-xs text-slate-400">Accuracy</p>
                          </div>
                        </div>
                        
                        <h4 className="font-medium text-cyan-400 mb-3">Key Features:</h4>
                        <ul className="space-y-2">
                          {useCase.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-slate-300">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Interactive Demo */}
                    <div className="lg:col-span-1">
                      <div className="p-6 bg-slate-700/30 rounded-lg">
                        <h4 className="font-medium text-cyan-400 mb-4">Live Demo</h4>
                        <div className="space-y-4">
                          <div className="p-4 bg-slate-800 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Activity className="h-4 w-4 text-green-400 mr-2" />
                              <span className="text-sm font-medium text-white">AI Processing</span>
                            </div>
                            <Progress value={87} className="mb-2" />
                            <p className="text-xs text-slate-400">Processing medical records...</p>
                          </div>
                          
                          <div className="p-4 bg-slate-800 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Stethoscope className="h-4 w-4 text-blue-400 mr-2" />
                              <span className="text-sm font-medium text-white">Clinical Analysis</span>
                            </div>
                            <Progress value={93} className="mb-2" />
                            <p className="text-xs text-slate-400">Analyzing clinical data...</p>
                          </div>
                          
                          <div className="p-4 bg-slate-800 rounded-lg">
                            <div className="flex items-center mb-2">
                              <FileText className="h-4 w-4 text-purple-400 mr-2" />
                              <span className="text-sm font-medium text-white">Documentation</span>
                            </div>
                            <Progress value={76} className="mb-2" />
                            <p className="text-xs text-slate-400">Generating reports...</p>
                          </div>
                          
                          <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                            Request Full Demo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Implementation Process */}
        <Card className="bg-slate-800 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Implementation Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-medium text-white mb-2">Assessment</h3>
                <p className="text-sm text-slate-400">
                  HIPAA compliance audit and workflow analysis
                </p>
                <p className="text-xs text-cyan-400 mt-2">Week 1-2</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-medium text-white mb-2">Configuration</h3>
                <p className="text-sm text-slate-400">
                  AI model training and system integration
                </p>
                <p className="text-xs text-blue-400 mt-2">Week 3-4</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-medium text-white mb-2">Pilot Testing</h3>
                <p className="text-sm text-slate-400">
                  Limited deployment with key workflows
                </p>
                <p className="text-xs text-purple-400 mt-2">Week 5-6</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="font-medium text-white mb-2">Full Deployment</h3>
                <p className="text-sm text-slate-400">
                  Organization-wide rollout and optimization
                </p>
                <p className="text-xs text-green-400 mt-2">Week 7-8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-cyan-600 to-blue-700 border-0">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Transform Your Healthcare Operations Today
              </h2>
              <p className="text-xl text-cyan-100 mb-6">
                Join leading healthcare organizations using Shatzii AI for autonomous operations
              </p>
              <div className="flex justify-center space-x-4">
                <Button size="lg" className="bg-white text-cyan-700 hover:bg-gray-100">
                  Schedule Enterprise Demo
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cyan-700">
                  Download Compliance Guide
                </Button>
              </div>
              <p className="text-sm text-cyan-200 mt-4">
                HIPAA-compliant • SOC 2 certified • Self-hosted deployment
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}