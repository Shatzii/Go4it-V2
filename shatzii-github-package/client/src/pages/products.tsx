import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, GraduationCap, Brain, Zap, Shield, BarChart3, Cpu, Network, Bot, Cloud, Database, Cog, Home } from "lucide-react";

const products = [
  {
    id: 'truckflow-ai',
    name: 'TruckFlow AI',
    category: 'Logistics',
    icon: Truck,
    tagline: 'The Future of Trucking Dispatch',
    description: 'Enterprise-grade AI-powered trucking dispatch platform revolutionizing freight operations through cutting-edge technology.',
    features: [
      'AI-Powered Rate Optimization',
      'Autonomous Vehicle Integration',
      'Blockchain Smart Contracts',
      'IoT & Real-Time Monitoring',
      'Weather Intelligence',
      'Voice Command Integration',
      'Sustainability Tracking',
      'Multi-Modal Transport'
    ],
    pricing: {
      starter: { price: 299, features: ['Basic dispatch', 'AI rate suggestions', 'Real-time tracking', 'Mobile app'] },
      professional: { price: 499, features: ['Advanced analytics', 'IoT integration', 'Voice commands', 'Priority support'] },
      enterprise: { price: 799, features: ['Autonomous vehicles', 'Blockchain contracts', 'Custom integrations', 'Account manager'] }
    },
    benefits: {
      'Fleet Owners': ['20% higher profit margins', '30% cost reduction', '40% faster dispatch', '50% accident reduction'],
      'Drivers': ['Higher-paying loads', 'Advanced safety monitoring', 'Voice commands', 'Better work-life balance'],
      'Shippers': ['Real-time tracking', 'Cost transparency', 'Sustainability options', 'Multi-modal flexibility']
    },
    certifications: ['SOC 2 Type II', 'FMCSA Compliant', 'DOT Approved', 'GDPR Compliant', 'ISO 27001'],
    testimonials: [
      { quote: "TruckFlow AI increased our profit margins by 22% in the first quarter.", author: "Mike Rodriguez, CEO, Rodriguez Transport" },
      { quote: "The autonomous vehicle integration saved us 6 hours per day in driver coordination.", author: "Sarah Chen, Operations Manager, Pacific Freight" }
    ]
  },
  {
    id: 'shatzii-os',
    name: 'ShatziiOS CEO Dashboard',
    category: 'Education',
    icon: GraduationCap,
    tagline: 'Executive Analytics for Neurodivergent Education',
    description: 'Comprehensive executive management platform designed specifically for educational institutions serving neurodivergent learners.',
    features: [
      'Executive Analytics',
      'School Performance Management',
      'Student Success Tracking',
      'AI Teacher Integration',
      'Multi-School Overview',
      'Real-time Performance Metrics',
      'Comparative Analytics',
      'Progress Visualization'
    ],
    pricing: {
      basic: { price: 199, features: ['Single school monitoring', 'Basic analytics', 'Student tracking', 'Mobile access'] },
      professional: { price: 399, features: ['Multi-school overview', 'AI teacher analytics', 'Advanced reporting', 'Custom dashboards'] },
      enterprise: { price: 699, features: ['Unlimited schools', 'Predictive analytics', 'White-label options', 'Dedicated support'] }
    },
    benefits: {
      'CEOs': ['Strategic oversight', 'Performance monitoring', 'Data-driven decisions', 'Organizational growth'],
      'Administrators': ['School performance analysis', 'Resource allocation', 'Efficiency monitoring', 'Comparative insights'],
      'Academic Directors': ['Success rate tracking', 'Curriculum analysis', 'Faculty performance', 'AI optimization']
    },
    certifications: ['FERPA Compliant', 'COPPA Compliant', 'SOC 2 Certified', 'Data Privacy Certified'],
    testimonials: [
      { quote: "The dashboard helped us increase student success rates by 35% across all our institutions.", author: "Dr. Maria Santos, CEO, Neurodivergent Learning Network" },
      { quote: "Finally, a platform that understands the unique needs of neurodivergent education.", author: "James Wilson, Academic Director, Spectrum Academy" }
    ]
  },
  {
    id: 'roofing-ai',
    name: 'Roofing AI Engine',
    category: 'Construction',
    icon: Home,
    tagline: 'Complete Roofing Business Automation',
    description: 'Comprehensive AI-powered roofing operations platform that automates every aspect from weather-driven lead generation to project completion.',
    features: [
      'Weather-Driven Lead Detection',
      'Drone Inspection Integration',
      'AI-Powered Estimation (95% Accuracy)',
      'Insurance Claim Automation',
      'Project Management & Scheduling',
      'Real-time Analytics Dashboard',
      'Customer Communication Automation',
      'Quality Control & Compliance'
    ],
    pricing: {
      starter: { price: 399, features: ['Lead generation', 'Basic estimation', 'Project tracking', 'Mobile app'] },
      professional: { price: 699, features: ['Drone integration', 'Insurance claims', 'Advanced analytics', 'Weather alerts'] },
      enterprise: { price: 1199, features: ['Multi-crew management', 'Custom integrations', 'White-label options', 'Dedicated support'] }
    },
    benefits: {
      'Roofing Contractors': ['312% lead increase', '67% conversion rate', '78% time savings', '23.5% profit margin'],
      'Property Managers': ['Automated inspections', 'Cost transparency', 'Quality assurance', 'Compliance tracking'],
      'Insurance Companies': ['Accurate assessments', 'Fraud detection', 'Streamlined claims', 'Risk analysis']
    },
    certifications: ['Industry Compliant', 'Insurance Approved', 'Drone Certified', 'Safety Certified'],
    testimonials: [
      { quote: "Roofing AI increased our monthly revenue from $125K to $260K in just 6 months.", author: "Tom Martinez, Owner, Elite Roofing Solutions" },
      { quote: "The weather alert system generated 150 high-quality leads after the last storm.", author: "Jennifer Clark, Operations Manager, Storm Guard Roofing" }
    ]
  },
  {
    id: 'ai-engine-platform',
    name: 'AI Engine Platform',
    category: 'AI Infrastructure',
    icon: Brain,
    tagline: 'Self-Hosted AI Operations',
    description: 'Complete autonomous AI agent infrastructure for marketing, sales, and business operations with self-hosted models.',
    features: [
      'Autonomous Marketing Agents',
      'AI Sales Automation',
      'Self-Hosted AI Models',
      'Real-time Lead Generation',
      'Content Creation Engine',
      'Campaign Management',
      'Sales Pipeline Automation',
      'Performance Analytics'
    ],
    pricing: {
      startup: { price: 999, features: ['Basic AI agents', 'Self-hosted models', 'Lead generation', '24/7 support'] },
      business: { price: 2499, features: ['Advanced agents', 'Custom models', 'Multi-channel campaigns', 'Priority support'] },
      enterprise: { price: 4999, features: ['Full automation', 'Custom training', 'White-label deployment', 'Dedicated team'] }
    },
    benefits: {
      'Marketing Teams': ['50+ leads daily', 'AI content creation', 'Multi-channel automation', '80% time savings'],
      'Sales Teams': ['Automated prospecting', 'AI-powered demos', 'Contract negotiation', '300% conversion rates'],
      'Executives': ['Complete autonomy', 'Real-time metrics', 'Scalable operations', '24/7 performance']
    },
    certifications: ['SOC 2 Compliant', 'GDPR Ready', 'Self-Hosted Security', 'Enterprise Grade'],
    testimonials: [
      { quote: "Our AI agents generated $2M in revenue while we slept. Completely autonomous.", author: "Alex Thompson, CEO, TechFlow Solutions" },
      { quote: "The self-hosted deployment gave us complete control over our data and AI operations.", author: "Lisa Chen, CTO, DataSecure Inc" }
    ]
  }
];

const categories = ['All', 'Logistics', 'Education', 'Construction', 'AI Infrastructure'];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Shatzii Product Suite
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionary AI-powered solutions transforming industries through cutting-edge technology and autonomous operations
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-slate-800/50 p-2 rounded-lg backdrop-blur-sm">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                onClick={() => setSelectedCategory(category)}
                className="text-white hover:bg-purple-600/50"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {filteredProducts.map((product) => {
            const IconComponent = product.icon;
            return (
              <Card 
                key={product.id} 
                className={`bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer backdrop-blur-sm ${
                  selectedProduct.id === product.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white">{product.name}</CardTitle>
                      <Badge variant="secondary" className="bg-purple-600/30 text-purple-300">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-gray-300">
                    {product.tagline}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Starting at ${product.pricing.starter?.price || product.pricing.startup?.price || product.pricing.basic?.price}/month
                    </span>
                    <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Product View */}
        {selectedProduct && (
          <div className="bg-slate-800/30 rounded-xl p-8 backdrop-blur-sm border border-slate-700">
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg">
                  <selectedProduct.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{selectedProduct.name}</h2>
                  <p className="text-xl text-gray-300">{selectedProduct.tagline}</p>
                </div>
              </div>
              <p className="text-gray-300 text-lg">{selectedProduct.description}</p>
            </div>

            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-slate-700/50">
                <TabsTrigger value="features" className="text-white data-[state=active]:bg-purple-600">Features</TabsTrigger>
                <TabsTrigger value="pricing" className="text-white data-[state=active]:bg-purple-600">Pricing</TabsTrigger>
                <TabsTrigger value="benefits" className="text-white data-[state=active]:bg-purple-600">Benefits</TabsTrigger>
                <TabsTrigger value="security" className="text-white data-[state=active]:bg-purple-600">Security</TabsTrigger>
                <TabsTrigger value="testimonials" className="text-white data-[state=active]:bg-purple-600">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedProduct.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-lg">
                      <Zap className="h-5 w-5 text-cyan-400" />
                      <span className="text-white">{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="mt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(selectedProduct.pricing).map(([plan, details]) => (
                    <Card key={plan} className="bg-slate-700/30 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-white capitalize">{plan}</CardTitle>
                        <div className="text-3xl font-bold text-cyan-400">
                          ${details.price}<span className="text-lg text-gray-400">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {details.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2 text-gray-300">
                              <Zap className="h-4 w-4 text-green-400" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-purple-500">
                          Get Started
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="benefits" className="mt-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {Object.entries(selectedProduct.benefits).map(([userType, benefits]) => (
                    <Card key={userType} className="bg-slate-700/30 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-white">{userType}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start space-x-2 text-gray-300">
                              <BarChart3 className="h-4 w-4 text-green-400 mt-1 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {selectedProduct.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-lg">
                      <Shield className="h-5 w-5 text-green-400" />
                      <span className="text-white font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="testimonials" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {selectedProduct.testimonials.map((testimonial, index) => (
                    <Card key={index} className="bg-slate-700/30 border-slate-600">
                      <CardContent className="pt-6">
                        <blockquote className="text-gray-300 italic mb-4">
                          "{testimonial.quote}"
                        </blockquote>
                        <cite className="text-cyan-400 font-medium">
                          — {testimonial.author}
                        </cite>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Call to Action */}
            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg p-6 border border-purple-500/30">
                <h3 className="text-2xl font-bold text-white mb-2">Ready to Transform Your Operations?</h3>
                <p className="text-gray-300 mb-4">Join hundreds of companies already using {selectedProduct.name}</p>
                <div className="flex justify-center space-x-4">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                    Start Free Trial
                  </Button>
                  <Button size="lg" variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-600/20">
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}