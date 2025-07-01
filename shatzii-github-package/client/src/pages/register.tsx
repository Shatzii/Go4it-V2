import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Brain, 
  Building, 
  Zap, 
  Shield, 
  Sparkles, 
  CheckCircle,
  ArrowRight,
  Truck,
  GraduationCap,
  Home,
  Briefcase,
  DollarSign,
  Factory,
  Car
} from 'lucide-react';

const registrationSchema = z.object({
  // Company Information
  companyName: z.string().min(2, 'Company name required'),
  industry: z.string().min(1, 'Please select your industry'),
  companySize: z.string().min(1, 'Please select company size'),
  
  // Contact Information
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  title: z.string().min(2, 'Job title required'),
  
  // AI Engine Requirements
  primaryGoals: z.array(z.string()).min(1, 'Select at least one goal'),
  monthlyRevenue: z.string().min(1, 'Please select revenue range'),
  currentChallenges: z.string().min(10, 'Please describe your challenges'),
  
  // Technical Requirements
  deploymentType: z.string().min(1, 'Select deployment preference'),
  integrationNeeds: z.array(z.string()),
  
  // Legal
  agreeToTerms: z.boolean().refine(val => val, 'You must agree to terms'),
  subscribeUpdates: z.boolean(),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

const industries = [
  { value: 'trucking', label: 'Trucking & Logistics', icon: Truck, aiEngines: ['TruckFlow AI', 'Route Optimization', 'Fleet Management'] },
  { value: 'education', label: 'Education & Schools', icon: GraduationCap, aiEngines: ['ShatziiOS', 'Student Analytics', 'Admin Automation'] },
  { value: 'roofing', label: 'Roofing & Construction', icon: Home, aiEngines: ['Roofing AI', 'Project Management', 'Lead Generation'] },
  { value: 'professional', label: 'Professional Services', icon: Briefcase, aiEngines: ['Client Management', 'Document AI', 'Billing Automation'] },
  { value: 'finance', label: 'Finance & Banking', icon: DollarSign, aiEngines: ['Risk Assessment', 'Fraud Detection', 'Portfolio Management'] },
  { value: 'manufacturing', label: 'Manufacturing', icon: Factory, aiEngines: ['Production Optimization', 'Quality Control', 'Supply Chain'] },
  { value: 'automotive', label: 'Automotive', icon: Car, aiEngines: ['Inventory Management', 'Customer Service', 'Parts Optimization'] },
];

const deploymentOptions = [
  { value: 'cloud', label: 'Cloud Hosted', description: 'Fully managed cloud deployment', pricing: '$25K-50K setup' },
  { value: 'onpremise', label: 'On-Premise', description: 'Self-hosted with full control', pricing: '$15K/GB + hardware' },
  { value: 'edge', label: 'Edge Computing', description: 'Distributed edge deployment', pricing: '$35K + infrastructure' },
  { value: 'hybrid', label: 'Hybrid Solution', description: 'Best of cloud and on-premise', pricing: 'Custom pricing' },
];

export default function Register() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      primaryGoals: [],
      integrationNeeds: [],
      agreeToTerms: false,
      subscribeUpdates: true,
    },
  });

  const watchedIndustry = form.watch('industry');
  const watchedRevenue = form.watch('monthlyRevenue');
  const watchedGoals = form.watch('primaryGoals');

  // AI Recommendation System
  const generateRecommendations = async (data: Partial<RegistrationForm>) => {
    if (!data.industry || !data.monthlyRevenue || !data.primaryGoals?.length) return;

    const industry = industries.find(i => i.value === data.industry);
    const revenueValue = parseFloat(data.monthlyRevenue.split('-')[0].replace(/[^0-9]/g, '')) || 0;
    
    // AI-powered recommendations based on industry and goals
    const recommendations = {
      recommendedEngines: industry?.aiEngines || [],
      estimatedROI: revenueValue * 0.25, // 25% revenue increase
      deploymentTime: data.deploymentType === 'cloud' ? '2-4 weeks' : '4-8 weeks',
      agentCount: Math.min(Math.max(Math.floor(revenueValue / 50000) * 5, 10), 50),
      pricing: calculatePricing(data),
    };

    setAiRecommendations(recommendations);
  };

  const calculatePricing = (data: Partial<RegistrationForm>) => {
    const basePrice = data.deploymentType === 'cloud' ? 35000 : 
                     data.deploymentType === 'onpremise' ? 25000 :
                     data.deploymentType === 'edge' ? 45000 : 40000;
    
    const revenueMultiplier = data.monthlyRevenue?.includes('10M+') ? 2.5 :
                             data.monthlyRevenue?.includes('5M') ? 2.0 :
                             data.monthlyRevenue?.includes('1M') ? 1.5 : 1.0;
    
    return Math.floor(basePrice * revenueMultiplier);
  };

  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationForm) => {
      const response = await apiRequest('POST', '/api/customers/register', {
        ...data,
        aiRecommendations,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "🎉 Welcome to Shatzii AI Empire!",
        description: `Registration successful! Your AI engines are being prepared. Setup ID: ${data.setupId}`,
      });
      setLocation(`/onboarding/${data.setupId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const nextStep = () => {
    if (currentStep === 2) {
      generateRecommendations(form.getValues());
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const onSubmit = (data: RegistrationForm) => {
    registrationMutation.mutate(data);
  };

  const toggleGoal = (goal: string) => {
    const current = form.getValues('primaryGoals');
    const updated = current.includes(goal)
      ? current.filter(g => g !== goal)
      : [...current, goal];
    form.setValue('primaryGoals', updated);
  };

  const toggleIntegration = (integration: string) => {
    const current = form.getValues('integrationNeeds');
    const updated = current.includes(integration)
      ? current.filter(i => i !== integration)
      : [...current, integration];
    form.setValue('integrationNeeds', updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-2">
            <Brain className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Shatzii AI Empire</h1>
          </div>
          <p className="text-slate-300">Build Your Autonomous AI Operations</p>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                </div>
                {step < 4 && <div className={`w-12 h-1 ${
                  step < currentStep ? 'bg-purple-600' : 'bg-slate-700'
                }`} />}
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Step 1: Company Information */}
            {currentStep === 1 && (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Company Information
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Tell us about your organization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-700 border-slate-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {industries.map((industry) => (
                                <SelectItem key={industry.value} value={industry.value} className="text-white">
                                  <div className="flex items-center">
                                    <industry.icon className="h-4 w-4 mr-2" />
                                    {industry.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">Company Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="startup" className="text-white">Startup (1-10 employees)</SelectItem>
                            <SelectItem value="small" className="text-white">Small Business (11-50 employees)</SelectItem>
                            <SelectItem value="medium" className="text-white">Medium Business (51-200 employees)</SelectItem>
                            <SelectItem value="large" className="text-white">Large Enterprise (200+ employees)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-700 border-slate-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Job Title</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-slate-700 border-slate-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" className="bg-slate-700 border-slate-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Phone</FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" className="bg-slate-700 border-slate-600 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Next Step <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: AI Requirements */}
            {currentStep === 2 && (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    AI Engine Requirements
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Define your automation goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="primaryGoals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">Primary Goals (Select all that apply)</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            'Lead Generation',
                            'Customer Service',
                            'Operations Automation',
                            'Sales Pipeline',
                            'Marketing Automation',
                            'Data Analytics',
                            'Cost Reduction',
                            'Revenue Growth',
                            'Process Optimization'
                          ].map((goal) => (
                            <div key={goal} className="flex items-center space-x-2">
                              <Checkbox
                                id={goal}
                                checked={watchedGoals?.includes(goal)}
                                onCheckedChange={() => toggleGoal(goal)}
                                className="border-slate-600"
                              />
                              <label htmlFor={goal} className="text-sm text-slate-200 cursor-pointer">
                                {goal}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="monthlyRevenue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">Monthly Revenue Range</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Select revenue range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="0-50k" className="text-white">$0 - $50K</SelectItem>
                            <SelectItem value="50k-250k" className="text-white">$50K - $250K</SelectItem>
                            <SelectItem value="250k-1M" className="text-white">$250K - $1M</SelectItem>
                            <SelectItem value="1M-5M" className="text-white">$1M - $5M</SelectItem>
                            <SelectItem value="5M-10M" className="text-white">$5M - $10M</SelectItem>
                            <SelectItem value="10M+" className="text-white">$10M+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentChallenges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">Current Business Challenges</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe your main operational challenges, pain points, and areas where AI could help..."
                            className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button type="button" onClick={prevStep} variant="outline" className="border-slate-600 text-slate-200">
                      Previous
                    </Button>
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Generate AI Recommendations <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: AI Recommendations & Technical Setup */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* AI Recommendations */}
                {aiRecommendations && (
                  <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Sparkles className="h-5 w-5 mr-2" />
                        AI-Powered Recommendations
                      </CardTitle>
                      <CardDescription className="text-purple-200">
                        Customized for {form.getValues('companyName')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                          <h4 className="text-white font-semibold mb-2">Recommended AI Engines</h4>
                          <ul className="space-y-1">
                            {aiRecommendations.recommendedEngines.map((engine: string, index: number) => (
                              <li key={index} className="text-slate-300 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                                {engine}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                          <h4 className="text-white font-semibold mb-2">Projected Impact</h4>
                          <div className="space-y-2">
                            <p className="text-slate-300">
                              <span className="text-green-400 font-semibold">
                                ${aiRecommendations.estimatedROI.toLocaleString()}/month
                              </span> revenue increase
                            </p>
                            <p className="text-slate-300">
                              <span className="text-blue-400 font-semibold">
                                {aiRecommendations.agentCount}
                              </span> autonomous agents
                            </p>
                            <p className="text-slate-300">
                              <span className="text-purple-400 font-semibold">
                                {aiRecommendations.deploymentTime}
                              </span> deployment time
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Deployment Options */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Deployment Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="deploymentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Deployment Type</FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {deploymentOptions.map((option) => (
                              <div key={option.value}>
                                <input
                                  type="radio"
                                  id={option.value}
                                  value={option.value}
                                  checked={field.value === option.value}
                                  onChange={() => field.onChange(option.value)}
                                  className="sr-only"
                                />
                                <label
                                  htmlFor={option.value}
                                  className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                                    field.value === option.value
                                      ? 'border-purple-500 bg-purple-500/20'
                                      : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                                  }`}
                                >
                                  <div className="text-white font-medium">{option.label}</div>
                                  <div className="text-slate-300 text-sm mt-1">{option.description}</div>
                                  <div className="text-purple-400 text-sm font-medium mt-2">{option.pricing}</div>
                                </label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="integrationNeeds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">Integration Requirements</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                              'CRM Systems',
                              'ERP Software',
                              'Email Platforms',
                              'Accounting Software',
                              'E-commerce',
                              'Marketing Tools',
                              'Database Systems',
                              'API Integrations',
                              'Custom Software'
                            ].map((integration) => (
                              <div key={integration} className="flex items-center space-x-2">
                                <Checkbox
                                  id={integration}
                                  checked={form.getValues('integrationNeeds')?.includes(integration)}
                                  onCheckedChange={() => toggleIntegration(integration)}
                                  className="border-slate-600"
                                />
                                <label htmlFor={integration} className="text-sm text-slate-200 cursor-pointer">
                                  {integration}
                                </label>
                              </div>
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button type="button" onClick={prevStep} variant="outline" className="border-slate-600 text-slate-200">
                        Previous
                      </Button>
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Review & Complete <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Final Review & Agreement */}
            {currentStep === 4 && (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Final Review & Agreement
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Review your AI empire configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary */}
                  <div className="bg-slate-700/50 p-6 rounded-lg space-y-4">
                    <h3 className="text-white font-semibold text-lg">Configuration Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Company:</p>
                        <p className="text-white">{form.getValues('companyName')}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Industry:</p>
                        <p className="text-white">{industries.find(i => i.value === watchedIndustry)?.label}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Deployment:</p>
                        <p className="text-white">{deploymentOptions.find(d => d.value === form.getValues('deploymentType'))?.label}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Estimated Investment:</p>
                        <p className="text-green-400 font-semibold">
                          ${aiRecommendations?.pricing.toLocaleString() || 'Custom Quote'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Legal Agreement */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-slate-600"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-slate-200">
                              I agree to the{' '}
                              <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                                Terms of Service
                              </Link>{' '}
                              and{' '}
                              <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                                Privacy Policy
                              </Link>
                            </FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subscribeUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-slate-600"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-slate-200">
                              Subscribe to AI development updates and exclusive insights
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" onClick={prevStep} variant="outline" className="border-slate-600 text-slate-200">
                      Previous
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      disabled={registrationMutation.isPending}
                    >
                      {registrationMutation.isPending ? 'Creating Your AI Empire...' : 'Launch AI Empire'}
                      <Sparkles className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

          </form>
        </Form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}