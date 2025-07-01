import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Brain, 
  Users, 
  GraduationCap, 
  Eye,
  Headphones,
  BookOpen,
  Trophy,
  Target,
  Activity,
  Star,
  CheckCircle,
  TrendingUp,
  Calendar,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import StarRating from "./star-rating";

interface PlatformFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: 'available' | 'coming_soon' | 'beta';
  category: 'ai' | 'training' | 'social' | 'education';
  route: string;
  progress?: number;
  benefits: string[];
}

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  route: string;
  color: string;
  urgent?: boolean;
}

interface UpcomingEvent {
  id: string;
  title: string;
  type: 'live_session' | 'vr_training' | 'mentor_meeting' | 'deadline';
  time: string;
  participants?: number;
  isJoined?: boolean;
}

export default function PlatformHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const platformFeatures: PlatformFeature[] = [
    {
      id: 'computer-vision',
      title: 'AI Computer Vision',
      description: 'Advanced biomechanical analysis and real-time technique scoring',
      icon: Eye,
      status: 'available',
      category: 'ai',
      route: '/gar-analysis',
      progress: 94,
      benefits: [
        'Real-time form analysis',
        'Injury prevention insights',
        'Performance optimization'
      ]
    },
    {
      id: 'vr-training',
      title: 'VR Training System',
      description: 'Immersive virtual reality training scenarios and mental preparation',
      icon: Headphones,
      status: 'available',
      category: 'training',
      route: '/vr-training',
      progress: 87,
      benefits: [
        'Game situation practice',
        'Pressure training',
        'Mental conditioning'
      ]
    },
    {
      id: 'peer-network',
      title: 'Peer Learning Network',
      description: 'Connect with mentors, join study groups, and participate in challenges',
      icon: Users,
      status: 'available',
      category: 'social',
      route: '/peer-network',
      progress: 76,
      benefits: [
        'Expert mentorship',
        'Study groups',
        'Team challenges'
      ]
    },
    {
      id: 'scholarship-center',
      title: 'Scholarship Center',
      description: 'AI-powered college matching and recruitment assistance',
      icon: GraduationCap,
      status: 'available',
      category: 'education',
      route: '/scholarship',
      progress: 82,
      benefits: [
        'College matching',
        'Application tracking',
        'Scout connections'
      ]
    },
    {
      id: 'ai-coach',
      title: 'AI Coaching Assistant',
      description: 'Personalized coaching insights and training recommendations',
      icon: Brain,
      status: 'available',
      category: 'ai',
      route: '/ai-coach',
      progress: 91,
      benefits: [
        'Personalized insights',
        'Training plans',
        '24/7 availability'
      ]
    },
    {
      id: 'education-platform',
      title: 'Sports Education Hub',
      description: 'Comprehensive courses in sports science and athlete development',
      icon: BookOpen,
      status: 'available',
      category: 'education',
      route: '/education',
      progress: 89,
      benefits: [
        'Expert courses',
        'Adaptive learning',
        'Certifications'
      ]
    }
  ];

  const quickActions: QuickAction[] = [
    {
      title: 'Start VR Session',
      description: 'Jump into immersive training',
      icon: Headphones,
      route: '/vr-training',
      color: 'from-purple-500 to-cyan-500'
    },
    {
      title: 'Upload Video',
      description: 'Get AI analysis instantly',
      icon: Eye,
      route: '/gar-analysis',
      color: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Find Study Group',
      description: 'Join peers for learning',
      icon: Users,
      route: '/peer-network',
      color: 'from-green-500 to-blue-500'
    },
    {
      title: 'Check Applications',
      description: 'Track college progress',
      icon: GraduationCap,
      route: '/scholarship',
      color: 'from-yellow-500 to-green-500',
      urgent: true
    }
  ];

  const upcomingEvents: UpcomingEvent[] = [
    {
      id: '1',
      title: 'Elite Basketball Q&A Session',
      type: 'live_session',
      time: 'Today 7:00 PM',
      participants: 234,
      isJoined: true
    },
    {
      id: '2',
      title: 'VR Pressure Training',
      type: 'vr_training',
      time: 'Tomorrow 4:00 PM',
      isJoined: false
    },
    {
      id: '3',
      title: 'Mentor Meeting - Coach Martinez',
      type: 'mentor_meeting',
      time: 'Friday 3:30 PM',
      isJoined: true
    },
    {
      id: '4',
      title: 'Stanford Application Deadline',
      type: 'deadline',
      time: 'Dec 20, 2024',
      isJoined: false
    }
  ];

  const categories = [
    { id: 'all', label: 'All Features', icon: Zap },
    { id: 'ai', label: 'AI Powered', icon: Brain },
    { id: 'training', label: 'Training', icon: Target },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'education', label: 'Education', icon: BookOpen }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'beta': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'coming_soon': return 'text-slate-400 bg-slate-400/20 border-slate-400/30';
      default: return 'text-slate-400 bg-slate-400/20 border-slate-400/30';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'live_session': return Users;
      case 'vr_training': return Headphones;
      case 'mentor_meeting': return MessageSquare;
      case 'deadline': return Calendar;
      default: return Calendar;
    }
  };

  const filteredFeatures = selectedCategory === 'all' 
    ? platformFeatures 
    : platformFeatures.filter(f => f.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Platform Overview */}
      <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400 neon-glow" />
            Go4It Sports Platform Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">6</div>
              <p className="text-slate-400 text-sm">AI-Powered Features</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">89%</div>
              <p className="text-slate-400 text-sm">Platform Utilization</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">1,247</div>
              <p className="text-slate-400 text-sm">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">94</div>
              <p className="text-slate-400 text-sm">Avg GAR Score</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.route}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-4 rounded-lg bg-gradient-to-br ${action.color} bg-opacity-20 border border-white/10 cursor-pointer achievement-glow`}
                >
                  {action.urgent && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                  <action.icon className="w-6 h-6 text-white mb-2" />
                  <h4 className="font-semibold text-white text-sm mb-1">{action.title}</h4>
                  <p className="text-xs text-slate-300">{action.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="features" className="data-[state=active]:bg-cyan-500">
            Platform Features
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-purple-500">
            Upcoming Events
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-green-500">
            Performance Analytics
          </TabsTrigger>
        </TabsList>

        {/* Platform Features Tab */}
        <TabsContent value="features">
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "neon-glow" : "border-slate-600"}
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatures.map((feature) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 achievement-glow h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-cyan-400/20 rounded-lg p-3">
                          <feature.icon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <Badge className={getStatusColor(feature.status)}>
                          {feature.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>

                      <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                      <p className="text-sm text-slate-400 mb-4">{feature.description}</p>

                      {feature.progress && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Your Progress</span>
                            <span className="text-cyan-400">{feature.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${feature.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <h5 className="font-medium text-white mb-2">Key Benefits</h5>
                        <ul className="space-y-1">
                          {feature.benefits.map((benefit, index) => (
                            <li key={index} className="text-xs text-slate-400 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Link href={feature.route}>
                        <Button className="w-full neon-glow" disabled={feature.status === 'coming_soon'}>
                          {feature.status === 'coming_soon' ? 'Coming Soon' : 'Launch Feature'}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Upcoming Events Tab */}
        <TabsContent value="events">
          <div className="space-y-4">
            {upcomingEvents.map((event) => {
              const IconComponent = getEventIcon(event.type);
              return (
                <Card key={event.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-400/20 rounded-lg p-2">
                          <IconComponent className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{event.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span>{event.time}</span>
                            {event.participants && (
                              <>
                                <span>•</span>
                                <span>{event.participants} participants</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className={event.isJoined ? 'border-green-400 text-green-400 hover:bg-green-400/10' : 'neon-glow'}
                        variant={event.isJoined ? 'outline' : 'default'}
                      >
                        {event.isJoined ? 'Joined' : 'Join'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Performance Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-400 mb-1">+15.2%</div>
                  <p className="text-sm text-slate-400">Improvement this month</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">GAR Score</span>
                    <span className="text-green-400">94 (+5)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Training Hours</span>
                    <span className="text-cyan-400">47.5 hrs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Features Used</span>
                    <span className="text-purple-400">6/6</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Platform Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">AI Analysis</span>
                      <span className="text-cyan-400">23 sessions</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-cyan-400 h-2 rounded-full w-[85%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">VR Training</span>
                      <span className="text-purple-400">18 sessions</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-purple-400 h-2 rounded-full w-[70%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Peer Learning</span>
                      <span className="text-green-400">12 activities</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full w-[60%]"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">47</div>
                  <p className="text-sm text-slate-400">Total unlocked</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-yellow-400/10 rounded">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-white">VR Master</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-400/10 rounded">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white">Analysis Expert</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-purple-400/10 rounded">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white">Community Leader</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}