import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Zap, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Users,
  Clock,
  DollarSign,
  Star,
  Play
} from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');

  const handleDemoRequest = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-500 mr-2" />
              <span className="text-xl font-bold text-white">Sentinel AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white">Pricing</a>
              <a href="#customers" className="text-gray-300 hover:text-white">Customers</a>
              <Button variant="outline" size="sm" onClick={handleDemoRequest}>
                Live Demo
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-indigo-600 text-white">
            Trusted by 500+ Enterprise Customers
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Next-Generation
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400"> Cybersecurity</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            AI-powered threat detection, automated incident response, and continuous compliance 
            monitoring in one unified platform. Deploy in 24 hours, not 6 months.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-4" onClick={handleDemoRequest}>
              <Play className="h-5 w-5 mr-2" />
              Watch Live Demo
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-gray-300 text-white hover:bg-gray-800">
              Start Free Trial
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-gray-300">98.7% Threat Detection Accuracy</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-gray-300">4.2 Min Mean Detection Time</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-gray-300">99.9% Platform Uptime SLA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Complete Security Operations Platform
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Replace 10+ security tools with one intelligent platform that learns, adapts, and protects your organization automatically.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Zap className="h-10 w-10 text-indigo-400 mb-4" />
                <CardTitle className="text-white">AI-Powered Detection</CardTitle>
                <CardDescription className="text-gray-300">
                  Advanced machine learning identifies threats that traditional security tools miss
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Zero-day threat detection</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Behavioral analytics</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />False positive reduction</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Shield className="h-10 w-10 text-indigo-400 mb-4" />
                <CardTitle className="text-white">Automated Response</CardTitle>
                <CardDescription className="text-gray-300">
                  Intelligent workflows orchestrate your entire security team response
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Custom playbooks</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Team coordination</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-indigo-400 mb-4" />
                <CardTitle className="text-white">Executive Dashboards</CardTitle>
                <CardDescription className="text-gray-300">
                  C-suite visibility into security posture and business risk metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Risk scoring</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />ROI metrics</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Board reporting</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-indigo-400 mb-4" />
                <CardTitle className="text-white">Compliance Automation</CardTitle>
                <CardDescription className="text-gray-300">
                  Continuous monitoring for SOC 2, ISO 27001, GDPR, HIPAA compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Evidence collection</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Audit preparation</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Gap analysis</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Users className="h-10 w-10 text-indigo-400 mb-4" />
                <CardTitle className="text-white">Team Collaboration</CardTitle>
                <CardDescription className="text-gray-300">
                  Seamless coordination across security, IT, and business teams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Role-based access</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Communication tools</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Knowledge sharing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Clock className="h-10 w-10 text-indigo-400 mb-4" />
                <CardTitle className="text-white">24/7 Monitoring</CardTitle>
                <CardDescription className="text-gray-300">
                  Continuous protection with global threat intelligence integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Real-time alerts</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Threat intelligence</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Global coverage</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Proven Business Impact
            </h2>
            <p className="text-xl text-gray-300">
              Our customers see immediate and measurable returns on their security investment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-400 mb-2">75%</div>
              <div className="text-gray-300">Faster Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-400 mb-2">$2.4M</div>
              <div className="text-gray-300">Average Annual Savings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-400 mb-2">99.3%</div>
              <div className="text-gray-300">Threat Detection Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-400 mb-2">24hrs</div>
              <div className="text-gray-300">Deployment Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300">
              Choose the plan that fits your organization's security needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Starter</CardTitle>
                <CardDescription className="text-gray-300">Perfect for growing businesses</CardDescription>
                <div className="text-4xl font-bold text-white mt-4">
                  $299<span className="text-lg text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Up to 100 endpoints</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Basic threat detection</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Standard compliance</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Email support</li>
                </ul>
                <Button className="w-full" variant="outline">Start Free Trial</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-indigo-600 to-blue-600 border-indigo-500 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-white text-2xl">Professional</CardTitle>
                <CardDescription className="text-blue-100">Complete security operations</CardDescription>
                <div className="text-4xl font-bold text-white mt-4">
                  $899<span className="text-lg text-blue-200">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-blue-100 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-300 mr-2" />Up to 1,000 endpoints</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-300 mr-2" />AI threat correlation</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-300 mr-2" />Automated workflows</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-300 mr-2" />Priority support</li>
                </ul>
                <Button className="w-full bg-white text-indigo-600 hover:bg-gray-100">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Enterprise</CardTitle>
                <CardDescription className="text-gray-300">Advanced security transformation</CardDescription>
                <div className="text-4xl font-bold text-white mt-4">
                  $2,499<span className="text-lg text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Unlimited endpoints</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Custom AI training</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Executive dashboards</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />24/7 phone support</li>
                </ul>
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section id="customers" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Industry Leaders
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Sentinel AI reduced our security incident response time from 6 hours to 18 minutes. The executive dashboard provides our board with clear visibility into our security posture."
                </p>
                <div className="text-sm">
                  <div className="font-semibold text-white">Sarah Chen</div>
                  <div className="text-gray-400">CISO, Fortune 500 Financial</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "The AI-powered threat detection identified a sophisticated APT attack that our previous solutions missed. Saved us from a potential $50M breach."
                </p>
                <div className="text-sm">
                  <div className="font-semibold text-white">Michael Rodriguez</div>
                  <div className="text-gray-400">VP Security, HealthTech Corp</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Implementing Sentinel AI across our 47 facilities worldwide gave us unified visibility. The compliance automation saved us 300 hours per audit cycle."
                </p>
                <div className="text-sm">
                  <div className="font-semibold text-white">Jennifer Park</div>
                  <div className="text-gray-400">CTO, Global Manufacturing</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Security Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 500+ enterprise customers protecting their organizations with Sentinel AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-4" onClick={handleDemoRequest}>
              <Play className="h-5 w-5 mr-2" />
              Watch Live Demo
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-indigo-600">
              Start 30-Day Free Trial
            </Button>
          </div>
          
          <p className="text-blue-200 text-sm">
            No credit card required • Deploy in 24 hours • 99.9% uptime SLA
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-indigo-500 mr-2" />
                <span className="text-xl font-bold text-white">Sentinel AI</span>
              </div>
              <p className="text-gray-400">
                Next-generation cybersecurity platform powered by artificial intelligence.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Sentinel AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}