import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Users,
  Watch,
  Calendar,
  GraduationCap,
  Video,
  TrendingUp,
  Zap,
  Target,
  Award,
  Activity,
  Heart,
  BookOpen,
  Trophy,
  ChevronRight,
  Play,
  Settings
} from "lucide-react";

// Import the new components
import AIVideoAnalyzer from "@/components/video-analysis/ai-video-analyzer";
import PeerLearningHub from "@/components/social/peer-learning-hub";
import SelfHostedVideoAnalysis from "@/components/ai/self-hosted-video-analysis";
import DeviceIntegration from "@/components/wearables/device-integration";
import AITrainingPlanner from "@/components/training/ai-training-planner";
import RecruitmentMatcher from "@/components/scholarship/recruitment-matcher";

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  isNew: boolean;
  isActive: boolean;
  metrics?: {
    label: string;
    value: string;
  }[];
}

export default function AdvancedFeatures() {
  const { user } = useAuth();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [featureData, setFeatureData] = useState({
    videoAnalysis: { completedAnalyses: 12, avgGarImprovement: 8.5 },
    socialLearning: { studyGroups: 3, mentorSessions: 8, achievements: 15 },
    wearableData: { connectedDevices: 2, workoutsSynced: 45, avgHeartRate: 72 },
    trainingPlans: { activePlans: 2, completedSessions: 23, weeklyGoals: 4 },
    scholarshipMatch: { matches: 18, applications: 3, scoutingReports: 2 }
  });

  // Sample user profile data
  const userProfile = {
    currentGarScore: 87.5,
    garScore: 87.5,
    sport: 'Basketball',
    level: 'Advanced',
    availableTime: 90, // minutes per day
    preferredDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    weakAreas: ['Speed', 'Decision Making', 'Accuracy'],
    strengthAreas: ['Agility', 'Endurance', 'Technique'],
    gpa: 3.8,
    satScore: 1320,
    graduationYear: 2026,
    preferredStates: ['California', 'Florida', 'Texas'],
    divisionPreferences: ['D1', 'D2']
  };

  const currentUser = {
    id: (user as any)?.id || '1',
    name: (user as any)?.firstName && (user as any)?.lastName 
      ? `${(user as any).firstName} ${(user as any).lastName}` 
      : (user as any)?.username || 'Student Athlete',
    garScore: 87.5,
    sport: 'Basketball',
    level: 'Advanced'
  };

  const features: FeatureCard[] = [
    {
      id: 'video-analysis',
      title: 'AI Video Analysis',
      description: 'Real-time biomechanics analysis with form correction and performance insights',
      icon: Video,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      isNew: true,
      isActive: true,
      metrics: [
        { label: 'Analyses', value: featureData.videoAnalysis.completedAnalyses.toString() },
        { label: 'Avg GAR Boost', value: `+${featureData.videoAnalysis.avgGarImprovement}` }
      ]
    },
    {
      id: 'social-learning',
      title: 'Social Learning Hub',
      description: 'Connect with peers, join study groups, find mentors, and participate in challenges',
      icon: Users,
      color: '#10b981',
      bgColor: '#f0fdf4',
      isNew: true,
      isActive: true,
      metrics: [
        { label: 'Study Groups', value: featureData.socialLearning.studyGroups.toString() },
        { label: 'Mentor Sessions', value: featureData.socialLearning.mentorSessions.toString() }
      ]
    },
    {
      id: 'wearable-integration',
      title: 'Wearable Integration',
      description: 'Connect fitness trackers and smart devices for real-time biometric monitoring',
      icon: Watch,
      color: '#8b5cf6',
      bgColor: '#faf5ff',
      isNew: true,
      isActive: true,
      metrics: [
        { label: 'Devices', value: featureData.wearableData.connectedDevices.toString() },
        { label: 'Workouts Synced', value: featureData.wearableData.workoutsSynced.toString() }
      ]
    },
    {
      id: 'training-planner',
      title: 'AI Training Planner',
      description: 'Personalized training programs that adapt based on your performance and goals',
      icon: Calendar,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      isNew: true,
      isActive: true,
      metrics: [
        { label: 'Active Plans', value: featureData.trainingPlans.activePlans.toString() },
        { label: 'Sessions Done', value: featureData.trainingPlans.completedSessions.toString() }
      ]
    },
    {
      id: 'scholarship-matching',
      title: 'Scholarship Matching',
      description: 'AI-powered college recruitment matching with application tracking and scouting reports',
      icon: GraduationCap,
      color: '#ef4444',
      bgColor: '#fef2f2',
      isNew: true,
      isActive: true,
      metrics: [
        { label: 'College Matches', value: featureData.scholarshipMatch.matches.toString() },
        { label: 'Applications', value: featureData.scholarshipMatch.applications.toString() }
      ]
    },
    {
      id: 'self-hosted-ai',
      title: 'Self-Hosted AI Models',
      description: 'Advanced video analysis using locally deployed AI models for enhanced privacy and performance',
      icon: Brain,
      color: '#06b6d4',
      bgColor: '#cffafe',
      isNew: true,
      isActive: true,
      metrics: [
        { label: 'AI Models', value: '4' },
        { label: 'Processing Speed', value: '85ms' }
      ]
    }
  ];

  const handleVideoAnalysisComplete = (result: any) => {
    console.log('Video analysis completed:', result);
    setFeatureData(prev => ({
      ...prev,
      videoAnalysis: {
        ...prev.videoAnalysis,
        completedAnalyses: prev.videoAnalysis.completedAnalyses + 1,
        avgGarImprovement: (prev.videoAnalysis.avgGarImprovement + result.overallGarScore) / 2
      }
    }));
  };

  const handleBiometricData = (data: any) => {
    console.log('Biometric data received:', data);
  };

  const handleWorkoutComplete = (session: any) => {
    console.log('Workout completed:', session);
    setFeatureData(prev => ({
      ...prev,
      wearableData: {
        ...prev.wearableData,
        workoutsSynced: prev.wearableData.workoutsSynced + 1
      }
    }));
  };

  const handleTrainingPlanGenerated = (plan: any) => {
    console.log('Training plan generated:', plan);
    setFeatureData(prev => ({
      ...prev,
      trainingPlans: {
        ...prev.trainingPlans,
        activePlans: prev.trainingPlans.activePlans + 1
      }
    }));
  };

  const renderFeatureOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Brain className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Advanced AI Features</h1>
          <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
            Unlock the full potential of your athletic development with cutting-edge AI technology, 
            social learning, and personalized insights.
          </p>
        </motion.div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative"
            >
              <Card 
                className="h-full cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300"
                onClick={() => setActiveFeature(feature.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: feature.bgColor }}
                    >
                      <IconComponent 
                        className="w-6 h-6" 
                        style={{ color: feature.color }}
                      />
                    </div>
                    <div className="flex gap-1">
                      {feature.isNew && <Badge className="bg-green-100 text-green-700 text-xs">New</Badge>}
                      {feature.isActive && <Badge className="bg-blue-100 text-blue-700 text-xs">Active</Badge>}
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-3">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {feature.metrics && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {feature.metrics.map((metric, i) => (
                        <div key={i} className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold" style={{ color: feature.color }}>
                            {metric.value}
                          </div>
                          <div className="text-xs text-gray-600">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: feature.color }}
                  >
                    Launch Feature
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center p-4">
          <Activity className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold">127</div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </Card>
        <Card className="text-center p-4">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold">+12.3</div>
          <div className="text-sm text-gray-600">GAR Improvement</div>
        </Card>
        <Card className="text-center p-4">
          <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold">47</div>
          <div className="text-sm text-gray-600">Peer Connections</div>
        </Card>
        <Card className="text-center p-4">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          <div className="text-2xl font-bold">23</div>
          <div className="text-sm text-gray-600">Achievements</div>
        </Card>
        <Card className="text-center p-4">
          <Target className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <div className="text-2xl font-bold">89%</div>
          <div className="text-sm text-gray-600">Goal Success</div>
        </Card>
      </div>

      {/* Getting Started Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Getting Started with Advanced Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Upload Training Video</h3>
              <p className="text-sm text-gray-600">
                Start with AI Video Analysis to get instant biomechanics feedback and performance insights.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Join the Community</h3>
              <p className="text-sm text-gray-600">
                Connect with peers in study groups, find mentors, and participate in challenges.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Optimize Performance</h3>
              <p className="text-sm text-gray-600">
                Use AI training plans and wearable integration to maximize your development potential.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'video-analysis':
        return (
          <AIVideoAnalyzer
            onAnalysisComplete={handleVideoAnalysisComplete}
          />
        );
      case 'social-learning':
        return (
          <PeerLearningHub
            currentUser={currentUser}
          />
        );
      case 'wearable-integration':
        return (
          <DeviceIntegration
            onDataReceived={handleBiometricData}
            onWorkoutComplete={handleWorkoutComplete}
          />
        );
      case 'training-planner':
        return (
          <AITrainingPlanner
            userProfile={userProfile}
            onPlanGenerated={handleTrainingPlanGenerated}
          />
        );
      case 'scholarship-matching':
        return (
          <RecruitmentMatcher
            userProfile={userProfile}
          />
        );
      case 'self-hosted-ai':
        return <SelfHostedVideoAnalysis />;
      default:
        return renderFeatureOverview();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      {activeFeature && (
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setActiveFeature(null)}
            className="mb-4"
          >
            ← Back to Features Overview
          </Button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFeature || 'overview'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveFeature()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}