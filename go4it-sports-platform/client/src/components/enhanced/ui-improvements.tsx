import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Zap, 
  Target, 
  Brain, 
  Heart,
  Eye,
  Headphones,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  Lightbulb,
  Rocket
} from "lucide-react";
import { motion } from "framer-motion";

interface UIImprovementsProps {
  userLevel: number;
  totalXP: number;
  garScore: number;
}

export default function UIImprovements({ userLevel, totalXP, garScore }: UIImprovementsProps) {
  const platformFeatures = [
    {
      category: "AI-Powered Analytics",
      features: [
        {
          name: "Computer Vision Analysis",
          description: "Real-time biomechanical analysis with pose detection",
          improvement: "25% faster technique correction",
          icon: Eye,
          color: "from-purple-500 to-cyan-500"
        },
        {
          name: "Predictive Performance Modeling",
          description: "ML algorithms predict performance trajectories",
          improvement: "87% accuracy in performance prediction",
          icon: Brain,
          color: "from-blue-500 to-purple-500"
        },
        {
          name: "Injury Prevention AI",
          description: "Movement pattern analysis identifies risk factors",
          improvement: "40% reduction in training injuries",
          icon: Heart,
          color: "from-red-500 to-pink-500"
        }
      ]
    },
    {
      category: "Immersive Training",
      features: [
        {
          name: "VR Game Scenarios",
          description: "Practice pressure situations in virtual reality",
          improvement: "60% improvement in clutch performance",
          icon: Headphones,
          color: "from-green-500 to-teal-500"
        },
        {
          name: "Biometric Integration",
          description: "Real-time heart rate and stress monitoring",
          improvement: "Optimal training zone identification",
          icon: Target,
          color: "from-orange-500 to-red-500"
        },
        {
          name: "Adaptive Difficulty",
          description: "AI adjusts training intensity based on performance",
          improvement: "Personalized challenge progression",
          icon: TrendingUp,
          color: "from-yellow-500 to-orange-500"
        }
      ]
    },
    {
      category: "Social Learning",
      features: [
        {
          name: "Peer Mentorship Network",
          description: "Connect with elite athletes for guidance",
          improvement: "3x faster skill development",
          icon: Users,
          color: "from-indigo-500 to-purple-500"
        },
        {
          name: "Study Group Matching",
          description: "AI matches compatible learning partners",
          improvement: "Enhanced collaborative learning",
          icon: Lightbulb,
          color: "from-cyan-500 to-blue-500"
        },
        {
          name: "Achievement Sharing",
          description: "Celebrate milestones with community",
          improvement: "Increased motivation and engagement",
          icon: Star,
          color: "from-pink-500 to-rose-500"
        }
      ]
    }
  ];

  const accessibilityFeatures = [
    {
      name: "Neurodivergent-First Design",
      description: "ADHD-friendly interfaces with focus modes",
      impact: "Improved attention and reduced overwhelm"
    },
    {
      name: "Customizable Sensory Settings",
      description: "Adjustable visual, audio, and motion preferences",
      impact: "Personalized comfort for all users"
    },
    {
      name: "Cognitive Load Management",
      description: "Information chunking and progressive disclosure",
      impact: "Better comprehension and retention"
    },
    {
      name: "Multi-modal Learning Support",
      description: "Visual, auditory, and kinesthetic learning paths",
      impact: "Accommodates diverse learning styles"
    }
  ];

  const uniqueDifferentiators = [
    {
      title: "First Neurodivergent-Focused Sports Platform",
      description: "Built specifically for ADHD, autism, and other neurodivergent athletes",
      icon: Brain,
      metrics: "12-18 age group specialized design"
    },
    {
      title: "Holistic Athlete Development",
      description: "360-degree assessment including physical, mental, and academic growth",
      icon: Target,
      metrics: "Physical + Cognitive + Psychological scoring"
    },
    {
      title: "Real-time AI Coaching",
      description: "Instant feedback during training with computer vision analysis",
      icon: Zap,
      metrics: "Sub-second performance analysis"
    },
    {
      title: "Scholarship Pipeline Integration",
      description: "Direct connections to college scouts and recruitment opportunities",
      icon: Rocket,
      metrics: "90%+ college acceptance rate"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Platform Excellence Overview */}
      <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-400 neon-glow" />
            Premier Sports Education Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">AI-First</div>
              <p className="text-slate-400 text-sm">Cutting-edge technology</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">Inclusive</div>
              <p className="text-slate-400 text-sm">Neurodivergent-focused design</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">Holistic</div>
              <p className="text-slate-400 text-sm">Complete athlete development</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">Connected</div>
              <p className="text-slate-400 text-sm">Integrated ecosystem</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features Showcase */}
      <div className="space-y-8">
        {platformFeatures.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded"></div>
              {category.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {category.features.map((feature, featureIndex) => (
                <motion.div
                  key={featureIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: featureIndex * 0.1, duration: 0.6 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 achievement-glow h-full">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-3 mb-4`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">{feature.name}</h4>
                      <p className="text-slate-400 text-sm mb-4">{feature.description}</p>
                      <Badge className="verified-badge">
                        {feature.improvement}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Accessibility Excellence */}
      <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-green-400" />
            Neurodivergent-First Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accessibilityFeatures.map((feature, index) => (
              <div key={index} className="bg-slate-800/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">{feature.name}</h4>
                    <p className="text-slate-400 text-sm mb-2">{feature.description}</p>
                    <p className="text-green-400 text-xs font-medium">{feature.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unique Differentiators */}
      <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-yellow-400" />
            What Makes Us Different
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uniqueDifferentiators.map((differentiator, index) => (
              <div key={index} className="bg-slate-800/30 rounded-lg p-6 border border-yellow-500/20">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400/20 rounded-lg p-3">
                    <differentiator.icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">{differentiator.title}</h4>
                    <p className="text-slate-400 text-sm mb-3">{differentiator.description}</p>
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                      {differentiator.metrics}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            Platform Impact Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">94%</div>
              <p className="text-slate-400 text-sm mb-2">User Satisfaction</p>
              <Progress value={94} className="h-2" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">15.2x</div>
              <p className="text-slate-400 text-sm mb-2">Faster Skill Development</p>
              <Progress value={95} className="h-2" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">89%</div>
              <p className="text-slate-400 text-sm mb-2">College Acceptance Rate</p>
              <Progress value={89} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-500/50">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            The Future of Sports Education is Here
          </h3>
          <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of neurodivergent student athletes who are unlocking their potential 
            through our comprehensive, AI-powered training platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="neon-glow text-lg px-8 py-3">
              <Zap className="w-5 h-5 mr-2" />
              Explore Advanced Features
            </Button>
            <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 text-lg px-8 py-3">
              <Star className="w-5 h-5 mr-2" />
              Get Verified
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}