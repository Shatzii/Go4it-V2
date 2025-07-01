import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Cpu, Shield, Zap, Server, Database, BarChart3 } from 'lucide-react';

const Landing: React.FC = () => {
  const { login } = useAuth();

  const features = [
    {
      icon: <Server className="h-6 w-6 text-blue-500" />,
      title: 'Smart Server Monitoring',
      description: 'Real-time tracking of server health with intelligent anomaly detection',
    },
    {
      icon: <Zap className="h-6 w-6 text-indigo-500" />,
      title: 'AI-Powered Self-Healing',
      description: 'Automated issue detection and resolution without human intervention',
    },
    {
      icon: <Shield className="h-6 w-6 text-teal-500" />,
      title: 'Enhanced Security',
      description: 'Continuous security scanning and automated vulnerability patching',
    },
    {
      icon: <Database className="h-6 w-6 text-blue-500" />,
      title: 'Performance Optimization',
      description: 'AI-driven recommendations to improve system performance',
    },
    {
      icon: <Cpu className="h-6 w-6 text-indigo-500" />,
      title: 'Local AI Processing',
      description: 'All AI processing happens locally, keeping your data secure',
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-teal-500" />,
      title: 'Detailed Analytics',
      description: 'Comprehensive insights into your server performance and health',
    },
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$9.99',
      period: 'per month',
      description: 'Perfect for small projects and personal servers',
      features: [
        'Single server monitoring',
        'Basic self-healing',
        'Email alerts',
        '3-day log retention',
        'Community support',
      ],
      cta: 'Start Free Trial',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$29.99',
      period: 'per month',
      description: 'Ideal for businesses with multiple servers',
      features: [
        'Up to 5 servers',
        'Advanced self-healing',
        'SMS & email alerts',
        '30-day log retention',
        'Priority support',
        'Performance optimization',
      ],
      cta: 'Start Free Trial',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: '$99.99',
      period: 'per month',
      description: 'For large-scale server deployments',
      features: [
        'Unlimited servers',
        'Custom AI models',
        'Advanced analytics',
        '90-day log retention',
        'Dedicated support',
        'Custom integrations',
      ],
      cta: 'Contact Sales',
      highlight: false,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">PHARAOH</span> Control Panel
          </h1>
          <Button
            onClick={login}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Log In
          </Button>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <Badge className="mb-4 w-fit bg-blue-500/10 text-blue-400">Version 2.0 Now Available</Badge>
              <h2 className="mb-6 text-5xl font-bold tracking-tight text-white">
                The <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">AI-Powered</span> Server Control Panel
              </h2>
              <p className="mb-8 text-xl text-slate-400">
                Monitor, optimize, and self-heal your servers with the power of AI - all while keeping your sensitive data local and secure.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button 
                  onClick={login} 
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 px-8 py-6"
                  size="lg"
                >
                  Get Started Free
                </Button>
                <Button 
                  variant="outline" 
                  className="border-blue-500 text-blue-400 hover:bg-blue-950/20 px-8 py-6"
                  size="lg"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="relative h-[400px] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-700/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    Dashboard Preview Image
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Background elements */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2">
          <div className="h-[400px] w-[800px] rounded-full bg-blue-500/10 blur-[100px]"></div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Powerful Features for Modern Servers</h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              PHARAOH Control Panel 2.0 combines powerful monitoring with AI-driven automation to keep your servers running at peak performance.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-slate-800 bg-slate-900 transition-all duration-200 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10">
                <CardContent className="p-6">
                  <div className="mb-4 rounded-full bg-slate-800/50 p-3 w-fit">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Simple, Transparent Pricing</h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              Choose the plan that works best for your needs. All plans include a 14-day free trial.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`border-slate-800 ${tier.highlight ? 'bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden border-blue-500/50 shadow-lg shadow-blue-500/10' : 'bg-slate-900'}`}
              >
                {tier.highlight && (
                  <div className="absolute -right-12 top-6 rotate-45 bg-blue-600 px-10 py-1 text-xs font-semibold text-white">
                    Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-4xl font-bold text-white">{tier.price}</span>
                      <span className="ml-1 text-slate-400">{tier.period}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{tier.description}</p>
                  </div>
                  <ul className="mb-6 space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-slate-300">
                        <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={login}
                    className={`w-full ${
                      tier.highlight
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-blue-900/20 to-indigo-900/20">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="mb-4 text-3xl font-bold text-white">Ready to transform your server management?</h2>
                <p className="mb-6 text-slate-400">
                  Get started with PHARAOH Control Panel 2.0 today and experience the power of AI-driven server management.
                </p>
                <Button 
                  onClick={login} 
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 px-8"
                  size="lg"
                >
                  Start Free Trial
                </Button>
              </div>
              <div className="relative hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-700/10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-bold text-white">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">PHARAOH</span> Control Panel
              </h3>
              <p className="mt-4 text-slate-400">
                The AI-powered server management solution that keeps your data local and secure.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase text-slate-500">Resources</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-slate-400 hover:text-blue-400">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-blue-400">API Reference</a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-blue-400">Blog</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase text-slate-500">Company</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-slate-400 hover:text-blue-400">About</a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-blue-400">Contact</a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-blue-400">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} PHARAOH Control Panel. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;