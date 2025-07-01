import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Star, Trophy, Zap, Shield, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function VerificationHero() {
  const topAthletes = [
    { name: "Marcus Johnson", gar: 94, sport: "Basketball", verified: true },
    { name: "Emma Rodriguez", gar: 96, sport: "Soccer", verified: true },
    { name: "Alex Chen", gar: 98, sport: "Baseball", verified: true },
    { name: "Sophia Williams", gar: 95, sport: "Volleyball", verified: true },
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Analytics",
      description: "Scientifically-backed GAR scoring system"
    },
    {
      icon: Target,
      title: "Precision Tracking",
      description: "Track physical, cognitive, and psychological metrics"
    },
    {
      icon: Zap,
      title: "Real-time Feedback",
      description: "Instant analysis and improvement suggestions"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Gamified progress with rewards and recognition"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <CheckCircle className="w-12 h-12 text-cyan-400 neon-glow" />
                <h1 className="text-6xl md:text-8xl font-bold neon-text">
                  GET <span className="text-cyan-400">VERIFIED</span>
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                The future of athlete evaluation & placement. Our AI-enhanced GAR system provides 
                comprehensive analysis for neurodivergent student athletes aged 12-18.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link href="/login">
                <Button size="lg" className="neon-glow text-lg px-8 py-4">
                  Start Your Journey
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
                Watch Demo
              </Button>
            </motion.div>

            {/* Top Verified Athletes */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-cyan-400 mb-8">TOP VERIFIED ATHLETES</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {topAthletes.map((athlete, index) => (
                  <Card key={index} className="bg-slate-800/50 border-cyan-400/30 achievement-glow">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-slate-900 font-bold text-lg">{athlete.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <h3 className="font-semibold text-white mb-2">{athlete.name}</h3>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="gar-score-display text-2xl">{athlete.gar}</span>
                        <span className="text-slate-400">GAR</span>
                      </div>
                      <Badge className="verified-badge mb-2">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                      <p className="text-sm text-slate-400">{athlete.sport}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-cyan-400">Get Verified</span>?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Our comprehensive GAR system evaluates more than just physical stats - 
              we capture mental, emotional, and learning traits for complete athlete profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.8, duration: 0.6 }}
              >
                <Card className="bg-slate-800/30 border-cyan-400/20 h-full achievement-glow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-slate-900" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* GAR System Breakdown */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              The <span className="text-cyan-400">GAR Rating System</span>
            </h2>
            <p className="text-xl text-slate-400">
              A 3-part holistic evaluation system designed for neurodivergent athletes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-blue-400/30">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-blue-400 mb-2">60%</div>
                  <h3 className="text-2xl font-bold text-white">PHYSICAL</h3>
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li>• Sprint & Agility</li>
                  <li>• Strength & Power</li>
                  <li>• Balance & Coordination</li>
                  <li>• Reaction Time</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-cyan-400/30">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-cyan-400 mb-2">20%</div>
                  <h3 className="text-2xl font-bold text-white">COGNITIVE</h3>
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li>• Processing Speed</li>
                  <li>• Decision Making</li>
                  <li>• Learning Style</li>
                  <li>• Memory & Focus</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-400/30">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-purple-400 mb-2">20%</div>
                  <h3 className="text-2xl font-bold text-white">PSYCHOLOGICAL</h3>
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li>• Confidence & Resilience</li>
                  <li>• Emotional Regulation</li>
                  <li>• Team Dynamics</li>
                  <li>• Motivation & Drive</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get <span className="text-cyan-400 neon-text">Verified</span>?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of neurodivergent student athletes who have unlocked their potential 
            through our comprehensive GAR analysis and StarPath skill development system.
          </p>
          <Link href="/login">
            <Button size="lg" className="neon-glow text-lg px-8 py-4">
              <Star className="w-5 h-5 mr-2" />
              Start Your Verification Journey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}