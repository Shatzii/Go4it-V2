import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StarDisplay, getStarRatingFromGAR } from "@/components/gar/star-rating-system";
import {
  Trophy,
  Star,
  TrendingUp,
  Users,
  Target,
  Award,
  ArrowRight,
  Play,
  BarChart3,
  Brain,
  Zap
} from "lucide-react";

const sampleProfiles = [
  {
    id: "1",
    name: "Alex Johnson",
    sport: "Basketball",
    garScore: 87.5,
    level: "Elite",
    achievements: ["State Championship MVP", "All-Conference First Team"],
    avatar: "AJ",
    gradientFrom: "from-cyan-400",
    gradientTo: "to-blue-500",
    improvement: "+12.3 points"
  },
  {
    id: "2", 
    name: "Maria Rodriguez",
    sport: "Soccer",
    garScore: 72.3,
    level: "Advanced",
    achievements: ["Regional Tournament MVP", "Team Captain"],
    avatar: "MR",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-cyan-400",
    improvement: "+8.7 points"
  },
  {
    id: "3",
    name: "David Chen",
    sport: "Tennis", 
    garScore: 58.7,
    level: "Skilled",
    achievements: ["District Doubles Champion", "Most Improved"],
    avatar: "DC",
    gradientFrom: "from-cyan-600",
    gradientTo: "to-blue-600",
    improvement: "+15.2 points"
  }
];

export default function Landing() {
  const [selectedProfile, setSelectedProfile] = useState(sampleProfiles[0]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/50 to-slate-900"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-400/50">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white">
                  Go4It Sports
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                AI-Powered Sports Analytics Platform for Neurodivergent Student Athletes
              </p>
              
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Transform your athletic performance with advanced GAR scoring, personalized training, 
                and NCAA eligibility tracking across 12+ sports
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-slate-600 text-slate-300 hover:bg-slate-800">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Athlete Profiles */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Real Athletes, Real Results
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              See how our GAR star rating system transforms athletic development
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Profile Cards */}
            <div className="space-y-6">
              {sampleProfiles.map((profile, index) => {
                const starRating = getStarRatingFromGAR(profile.garScore);
                const isSelected = selectedProfile.id === profile.id;
                
                return (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedProfile(profile)}
                    className={`cursor-pointer transition-all duration-300 ${
                      isSelected ? 'transform scale-105' : ''
                    }`}
                  >
                    <Card className={`border-2 transition-all duration-300 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 shadow-xl' 
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 bg-gradient-to-br ${profile.gradientFrom} ${profile.gradientTo} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                              {profile.avatar}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                              <p className="text-gray-600">{profile.sport} Athlete</p>
                              <div className="flex items-center gap-2 mt-1">
                                <StarDisplay rating={profile.garScore} size="sm" />
                                <span className="text-sm text-gray-500">{starRating.title}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-3xl font-bold text-cyan-500">{profile.garScore}</div>
                            <div className="text-sm text-gray-500">GAR Score</div>
                            <Badge className="mt-1 bg-green-100 text-green-700">
                              {profile.improvement}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Performance Level</span>
                            <span>{Math.round((profile.garScore / 100) * 100)}%</span>
                          </div>
                          <Progress value={profile.garScore} className="h-2" />
                        </div>
                        
                        <div className="mt-4">
                          <div className="text-sm text-gray-600 mb-2">Recent Achievements</div>
                          <div className="space-y-1">
                            {profile.achievements.map((achievement, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <Award className="w-4 h-4 text-yellow-500" />
                                {achievement}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Detailed Profile View */}
            <motion.div
              key={selectedProfile.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className={`w-24 h-24 bg-gradient-to-br ${selectedProfile.gradientFrom} ${selectedProfile.gradientTo} rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4`}>
                  {selectedProfile.avatar}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedProfile.name}</h3>
                <p className="text-gray-600">{selectedProfile.sport} Specialist</p>
              </div>

              <div className="space-y-6">
                {/* GAR Score & Stars */}
                <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-0">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-cyan-500 mb-2">
                      {selectedProfile.garScore}
                    </div>
                    <div className="mb-3">
                      <StarDisplay rating={selectedProfile.garScore} size="lg" />
                    </div>
                    <div className="text-lg font-medium text-gray-800">
                      {getStarRatingFromGAR(selectedProfile.garScore).title}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      {getStarRatingFromGAR(selectedProfile.garScore).description}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <div className="text-lg font-bold text-green-600">{selectedProfile.improvement}</div>
                    <div className="text-xs text-gray-600">Growth</div>
                  </div>
                  <div className="text-center p-4 bg-cyan-50 rounded-lg">
                    <Target className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                    <div className="text-lg font-bold text-cyan-600">{getStarRatingFromGAR(selectedProfile.garScore).stars}</div>
                    <div className="text-xs text-gray-600">Star Level</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Trophy className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                    <div className="text-lg font-bold text-purple-600">{selectedProfile.achievements.length}</div>
                    <div className="text-xs text-gray-600">Awards</div>
                  </div>
                </div>

                {/* Progress Visualization */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress to Next Star Level</span>
                    <span>{Math.round(((selectedProfile.garScore % 20) / 20) * 100)}%</span>
                  </div>
                  <Progress value={(selectedProfile.garScore % 20) / 20 * 100} className="h-3" />
                  <div className="text-xs text-gray-500 mt-1">
                    Next milestone: {Math.ceil(selectedProfile.garScore / 20) * 20} GAR points
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Complete Athletic Development Platform
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to track, analyze, and improve athletic performance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BarChart3,
                title: "GAR Analytics",
                description: "AI-powered performance scoring across 12+ sports",
                color: "text-cyan-400"
              },
              {
                icon: Star,
                title: "Star Rating System", 
                description: "Clear progression tracking with 5-star athlete levels",
                color: "text-cyan-500"
              },
              {
                icon: Brain,
                title: "AI Training Plans",
                description: "Personalized workouts adapted to your goals",
                color: "text-cyan-600"
              },
              {
                icon: Trophy,
                title: "NCAA Eligibility",
                description: "Track academic progress for college recruitment",
                color: "text-cyan-400"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-colors duration-300">
                  <CardContent className="p-6 text-center">
                    <feature.icon className={`w-12 h-12 ${feature.color} mx-auto mb-4`} />
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-300 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Unlock Your Athletic Potential?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of student athletes using Go4It Sports to achieve their goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 shadow-lg shadow-cyan-400/30">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900">
                  <Users className="w-5 h-5 mr-2" />
                  Join Community
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}