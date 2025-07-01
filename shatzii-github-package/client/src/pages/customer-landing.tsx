import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp, Users, Award } from "lucide-react";
import { Link } from "wouter";
import DemoRequestModal from "@/components/modals/demo-request-modal";
import CustomerHeader from "@/components/layout/customer-header";

export default function CustomerLanding() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const solutions = [
    {
      title: "TruckFlow AI",
      description: "Revolutionary trucking operations that increase driver earnings by $875+ daily",
      icon: "🚛",
      benefits: ["Higher daily earnings", "Smart route optimization", "Reduced fuel costs", "Safety monitoring"],
      roi: "23% profit increase",
      category: "Transportation"
    },
    {
      title: "Education AI",
      description: "Transform learning outcomes with personalized AI tutoring systems",
      icon: "🎓",
      benefits: ["Personalized learning", "Progress tracking", "Parent engagement", "Academic excellence"],
      roi: "35% improvement",
      category: "Education"
    },
    {
      title: "Roofing AI",
      description: "Complete roofing business automation from leads to project completion",
      icon: "🏠",
      benefits: ["Weather-driven leads", "Automated estimates", "Project management", "Insurance integration"],
      roi: "312% lead increase",
      category: "Construction"
    }
  ];

  const testimonials = [
    {
      quote: "Our revenue increased from $125K to $260K in just 6 months with their AI automation.",
      author: "Tom Martinez",
      company: "Elite Roofing Solutions",
      result: "108% revenue growth"
    },
    {
      quote: "Driver earnings went from $650 to $875+ daily. Our entire fleet is happier and more profitable.",
      author: "Sarah Chen",
      company: "Pacific Freight",
      result: "$225+ daily increase"
    },
    {
      quote: "Student success rates improved by 35% across all our institutions with their AI system.",
      author: "Dr. Maria Santos",
      company: "Neurodivergent Learning Network",
      result: "35% better outcomes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Business Solutions
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-6">
            Transform Your Business with 
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> AI Automation</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12">
            Experience proven results with our industry-specific AI solutions. From increasing driver earnings to boosting student success rates, we deliver measurable outcomes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={() => setIsDemoModalOpen(true)}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-4 text-lg h-auto"
            >
              Get Your Free AI Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 px-8 py-4 text-lg h-auto"
            >
              View Success Stories
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">$2.1M+</div>
              <div className="text-sm text-slate-400">Monthly Revenue Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">312%</div>
              <div className="text-sm text-slate-400">Average Lead Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">$875+</div>
              <div className="text-sm text-slate-400">Daily Driver Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">35%</div>
              <div className="text-sm text-slate-400">Student Success Improvement</div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-100 mb-6">
              Industry-Specific <span className="text-cyan-400">AI Solutions</span>
            </h2>
            <p className="text-xl text-slate-300">
              Tailored automation that delivers real results in your industry
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
                <CardHeader>
                  <div className="text-4xl mb-4">{solution.icon}</div>
                  <CardTitle className="text-slate-100">{solution.title}</CardTitle>
                  <CardDescription className="text-slate-300">
                    {solution.description}
                  </CardDescription>
                  <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 w-fit">
                    {solution.roi}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {solution.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-slate-300">
                        <Zap className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-slate-100"
                    onClick={() => setIsDemoModalOpen(true)}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-100 mb-6">
              Proven <span className="text-purple-400">Results</span>
            </h2>
            <p className="text-xl text-slate-300">
              Real businesses achieving extraordinary outcomes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <Badge className="bg-green-500/20 text-green-400">
                      {testimonial.result}
                    </Badge>
                  </div>
                  <blockquote className="text-slate-300 mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="text-sm text-slate-400">
                    <div className="font-medium text-slate-300">{testimonial.author}</div>
                    <div>{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-100 mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join hundreds of businesses already using our AI solutions to drive growth and increase profitability.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setIsDemoModalOpen(true)}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-4 text-lg h-auto"
            >
              Schedule Free Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <div className="mt-12 flex justify-center items-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>Proven Results</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      <DemoRequestModal 
        open={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </div>
  );
}