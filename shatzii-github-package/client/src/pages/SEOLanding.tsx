import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { 
  Bot, 
  Brain, 
  Zap, 
  Shield, 
  Code, 
  Rocket,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  Play,
  Download,
  Calendar
} from 'lucide-react';

const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name is required'),
  phone: z.string().optional(),
  projectDetails: z.string().min(10, 'Please provide project details (minimum 10 characters)'),
  budget: z.string(),
  timeline: z.string(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

export default function SEOLanding() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      projectDetails: '',
      budget: '',
      timeline: '',
    },
  });

  const leadMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          source: 'SEO Landing Page',
          type: 'AI Development Inquiry'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit lead');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Thank you for your inquiry!",
        description: "Our AI development team will contact you within 24 hours.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LeadFormData) => {
    leadMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* SEO-Optimized Hero Section */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-6xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-2 bg-blue-500/20 text-blue-400 border-blue-500/30">
            #1 AI Development Company 2024
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Custom AI Development
            </span>
            <br />
            <span className="text-white">That Transforms Businesses</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Build cutting-edge AI solutions with our expert development team. From machine learning models to autonomous AI agents, 
            we deliver enterprise-grade AI software that drives real ROI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4">
              <Calendar className="mr-2 h-5 w-5" />
              Get Free AI Consultation
            </Button>
            <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 text-lg px-8 py-4">
              <Play className="mr-2 h-5 w-5" />
              Watch AI Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">500+</div>
              <div className="text-sm text-gray-400">AI Projects Delivered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">98%</div>
              <div className="text-sm text-gray-400">Client Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">$50M+</div>
              <div className="text-sm text-gray-400">Revenue Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">24/7</div>
              <div className="text-sm text-gray-400">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Services Section */}
      <section className="px-6 py-20 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Enterprise AI Development Services
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From concept to deployment, we build AI solutions that solve real business problems and drive measurable results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <Bot className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-xl text-white">Custom AI Agents</CardTitle>
                <CardDescription className="text-gray-300">
                  Autonomous AI agents that handle complex business processes, customer interactions, and decision-making.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400 mb-4">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Conversational AI Chatbots</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Process Automation Agents</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Intelligent Decision Systems</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Multi-platform Integration</li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <Brain className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-xl text-white">Machine Learning Models</CardTitle>
                <CardDescription className="text-gray-300">
                  Custom ML models for prediction, classification, and pattern recognition tailored to your data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400 mb-4">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Predictive Analytics</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Computer Vision</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Natural Language Processing</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Deep Learning Networks</li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <Zap className="h-12 w-12 text-emerald-400 mb-4" />
                <CardTitle className="text-xl text-white">AI Integration Solutions</CardTitle>
                <CardDescription className="text-gray-300">
                  Seamlessly integrate AI capabilities into your existing systems and workflows.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400 mb-4">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />API Development</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Cloud Deployment</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Performance Optimization</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Monitoring & Analytics</li>
                </ul>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <Shield className="h-12 w-12 text-orange-400 mb-4" />
                <CardTitle className="text-xl text-white">AI Security & Compliance</CardTitle>
                <CardDescription className="text-gray-300">
                  Enterprise-grade security and regulatory compliance for AI systems.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400 mb-4">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Data Privacy Protection</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />GDPR Compliance</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Model Explainability</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Audit Trails</li>
                </ul>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <Code className="h-12 w-12 text-cyan-400 mb-4" />
                <CardTitle className="text-xl text-white">AI Software Development</CardTitle>
                <CardDescription className="text-gray-300">
                  Full-stack AI applications with modern frameworks and scalable architecture.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400 mb-4">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />React + TypeScript</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Python + FastAPI</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Microservices Architecture</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />DevOps & CI/CD</li>
                </ul>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-rose-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <Rocket className="h-12 w-12 text-rose-400 mb-4" />
                <CardTitle className="text-xl text-white">AI Strategy Consulting</CardTitle>
                <CardDescription className="text-gray-300">
                  Strategic planning and roadmap development for AI transformation initiatives.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-400 mb-4">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />AI Readiness Assessment</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Use Case Identification</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />ROI Analysis</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Implementation Planning</li>
                </ul>
                <Button className="w-full bg-rose-600 hover:bg-rose-700">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Lead Generation Form */}
      <section className="px-6 py-20" id="contact">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Your Free AI Development Consultation
            </h2>
            <p className="text-xl text-gray-300">
              Tell us about your project and receive a detailed proposal within 24 hours.
            </p>
          </div>

          {!isSubmitted ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Full Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Smith"
                                {...field}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Work Email *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@company.com"
                                {...field}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Company Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Acme Corp"
                                {...field}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
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
                            <FormLabel className="text-white">Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+1 (555) 123-4567"
                                {...field}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Project Budget</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                              >
                                <option value="">Select budget range</option>
                                <option value="$10K-$25K">$10,000 - $25,000</option>
                                <option value="$25K-$50K">$25,000 - $50,000</option>
                                <option value="$50K-$100K">$50,000 - $100,000</option>
                                <option value="$100K+">$100,000+</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Project Timeline</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                              >
                                <option value="">Select timeline</option>
                                <option value="ASAP">ASAP (Rush project)</option>
                                <option value="1-3 months">1-3 months</option>
                                <option value="3-6 months">3-6 months</option>
                                <option value="6+ months">6+ months</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="projectDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Project Details *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your AI project requirements, goals, and any specific challenges you're facing..."
                              rows={4}
                              {...field}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={leadMutation.isPending}
                    >
                      {leadMutation.isPending ? (
                        <>Processing...</>
                      ) : (
                        <>
                          Get Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-emerald-900/50 border-emerald-700 text-center">
              <CardContent className="p-8">
                <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-emerald-400 mb-4">Thank You!</h3>
                <p className="text-gray-300 mb-6">
                  Your inquiry has been received. Our AI development team will contact you within 24 hours 
                  with a detailed proposal and next steps.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="border-emerald-600 text-emerald-400 hover:bg-emerald-900"
                >
                  Submit Another Inquiry
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-6 py-20 bg-gray-900/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Trusted by Industry Leaders
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Shatzii delivered an incredible AI solution that increased our lead conversion by 340%. 
                  Their team's expertise is unmatched."
                </p>
                <div className="font-semibold text-white">Sarah Chen</div>
                <div className="text-sm text-gray-400">CTO, TechFlow Solutions</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "The autonomous AI agents have transformed our sales process. We're closing 60% more deals 
                  with the same team size."
                </p>
                <div className="font-semibold text-white">Michael Rodriguez</div>
                <div className="text-sm text-gray-400">VP Sales, GrowthTech</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Outstanding AI development work. The machine learning models they built have saved us 
                  millions in operational costs."
                </p>
                <div className="font-semibold text-white">Lisa Wang</div>
                <div className="text-sm text-gray-400">Head of Operations, DataCorp</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Download className="mr-2 h-5 w-5" />
              Download Case Studies
            </Button>
            <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Award className="mr-2 h-5 w-5" />
              View Certifications
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}