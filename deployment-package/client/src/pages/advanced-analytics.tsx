import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RealTimeBiomechanics } from '@/components/real-time-biomechanics';
import { EmotionalCoachingDashboard } from '@/components/emotional-coaching-dashboard';
import { CollegeMatchOptimizer } from '@/components/college-match-optimizer';
import { 
  Brain,
  Activity,
  GraduationCap,
  Star,
  Zap,
  Target,
  TrendingUp,
  Eye,
  Heart,
  BarChart3,
  Users,
  Award,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AdvancedAnalyticsPage() {
  const [activeFeature, setActiveFeature] = useState<string>('overview');
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Mock athlete profile data
  const athleteProfile = {
    id: 'athlete-1',
    name: 'Alex Rodriguez',
    age: 16,
    sport: 'flag-football',
    position: 'Quarterback',
    adhdType: 'combined' as const,
    coachingPreferences: ['visual-cues', 'short-bursts', 'positive-reinforcement'],
    academicProfile: {
      gpa: 3.4,
      satScore: 1180,
      coursework: ['Honors Math', 'AP English', 'Biology', 'History'],
      academicStrengths: ['Problem-solving', 'Verbal communication'],
      learningStyle: 'kinesthetic' as const,
      adhdAccommodations: ['Extended time', 'Quiet environment']
    },
    athleticProfile: {
      garScore: 85,
      keyMetrics: { speed: 88, agility: 82, accuracy: 91 },
      achievements: ['Regional Champion 2024', 'MVP State Tournament'],
      playingExperience: 4,
      leadershipRoles: ['Team Captain', 'Youth Mentor']
    },
    personalProfile: {
      location: { state: 'CA', preferredDistance: 500 },
      socialPreferences: {
        campusSize: 'medium' as const,
        settingType: 'suburban' as const,
        diversityImportance: 8
      },
      adhdProfile: {
        type: 'combined' as const,
        supportNeeds: ['Academic coaching', 'Time management', 'Study groups'],
        accommodationPreferences: ['Extended time', 'Note-taking assistance']
      },
      careerInterests: ['Sports Management', 'Communications', 'Physical Therapy'],
      extracurriculars: ['Student Government', 'Volunteer Coaching']
    }
  };

  const features = [
    {
      id: 'biomechanical',
      title: 'Real-Time Biomechanical Analysis',
      description: 'Advanced computer vision for live movement analysis',
      icon: <Activity className="h-6 w-6" />,
      status: 'active',
      category: 'Performance'
    },
    {
      id: 'emotional',
      title: 'Emotional Intelligence Coaching',
      description: 'ADHD-aware emotional coaching adaptations',
      icon: <Brain className="h-6 w-6" />,
      status: 'active',
      category: 'Psychology'
    },
    {
      id: 'college-match',
      title: 'AI College Match Optimizer',
      description: 'Perfect school-athlete fit with scholarship alerts',
      icon: <GraduationCap className="h-6 w-6" />,
      status: 'active',
      category: 'Recruitment'
    }
  ];

  const metrics = {
    biomechanical: {
      sessionsToday: 3,
      averageFormScore: 82,
      improvementTrend: '+12%',
      focusLevel: 7.5
    },
    emotional: {
      confidenceLevel: 85,
      frustrationAlerts: 0,
      adaptationsMade: 7,
      wellbeingScore: 'excellent'
    },
    collegeMatch: {
      totalMatches: 15,
      scholarshipOpportunities: 4,
      deadlineAlerts: 1,
      averageMatch: 87
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
            <p className="text-gray-600 mt-1">
              Cutting-edge AI-powered performance analysis for neurodivergent athletes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-blue-600">
              Phase 1 Features
            </Badge>
            <Badge variant="outline">
              Industry Leading
            </Badge>
          </div>
        </div>

        {/* Feature Cards Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card 
              key={feature.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                activeFeature === feature.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="text-lg">{feature.title}</div>
                    <div className="text-sm text-gray-500 font-normal">{feature.category}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={feature.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {feature.status}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFeature(feature.id);
                    }}
                  >
                    Open
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Metrics Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Real-Time Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Biomechanical Metrics */}
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-700 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Biomechanical Analysis
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{metrics.biomechanical.sessionsToday}</div>
                    <div className="text-xs text-gray-600">Sessions Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{metrics.biomechanical.averageFormScore}%</div>
                    <div className="text-xs text-gray-600">Form Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{metrics.biomechanical.improvementTrend}</div>
                    <div className="text-xs text-gray-600">Weekly Trend</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{metrics.biomechanical.focusLevel}/10</div>
                    <div className="text-xs text-gray-600">Focus Level</div>
                  </div>
                </div>
              </div>

              {/* Emotional Intelligence Metrics */}
              <div className="space-y-3">
                <h3 className="font-semibold text-purple-700 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Emotional Intelligence
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{metrics.emotional.confidenceLevel}%</div>
                    <div className="text-xs text-gray-600">Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{metrics.emotional.frustrationAlerts}</div>
                    <div className="text-xs text-gray-600">Alerts Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{metrics.emotional.adaptationsMade}</div>
                    <div className="text-xs text-gray-600">Adaptations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-green-600 capitalize">{metrics.emotional.wellbeingScore}</div>
                    <div className="text-xs text-gray-600">Wellbeing</div>
                  </div>
                </div>
              </div>

              {/* College Match Metrics */}
              <div className="space-y-3">
                <h3 className="font-semibold text-green-700 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  College Matching
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{metrics.collegeMatch.totalMatches}</div>
                    <div className="text-xs text-gray-600">Matches Found</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{metrics.collegeMatch.scholarshipOpportunities}</div>
                    <div className="text-xs text-gray-600">Scholarships</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{metrics.collegeMatch.deadlineAlerts}</div>
                    <div className="text-xs text-gray-600">Urgent Deadlines</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{metrics.collegeMatch.averageMatch}%</div>
                    <div className="text-xs text-gray-600">Match Score</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Feature Interface */}
        <Tabs value={activeFeature} onValueChange={setActiveFeature} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="biomechanical">Biomechanical</TabsTrigger>
            <TabsTrigger value="emotional">Emotional AI</TabsTrigger>
            <TabsTrigger value="college-match">College Match</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Go4It Sports - Industry Leading Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Phase 1 Complete:</strong> Revolutionary AI-powered analytics for neurodivergent student athletes
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">✅ Implemented Features</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Real-time biomechanical analysis with computer vision
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        ADHD-specialized emotional intelligence coaching
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        AI-powered college matching with scholarship alerts
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Frustration detection and intervention system
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Adaptive coaching based on emotional state
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Personalized recruitment timeline generation
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">🚀 Coming Next (Phase 2)</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Virtual Reality training scenarios
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Augmented Reality performance overlays
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Professional scout network integration
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        AI-powered rival competition system
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Voice-activated coaching assistant
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Team chemistry analytics
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">ADHD-Optimized Design Principles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Attention Management:</strong>
                      <ul className="list-disc ml-4 mt-1">
                        <li>Real-time focus tracking</li>
                        <li>Attention span optimization</li>
                        <li>Break recommendations</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Emotional Support:</strong>
                      <ul className="list-disc ml-4 mt-1">
                        <li>Frustration pattern detection</li>
                        <li>Adaptive communication styles</li>
                        <li>Confidence building strategies</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Learning Optimization:</strong>
                      <ul className="list-disc ml-4 mt-1">
                        <li>Multi-sensory instruction</li>
                        <li>Bite-sized skill development</li>
                        <li>Immediate feedback loops</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="biomechanical">
            <RealTimeBiomechanics 
              athleteId={athleteProfile.id} 
              sport={athleteProfile.sport}
            />
          </TabsContent>

          <TabsContent value="emotional">
            <EmotionalCoachingDashboard 
              athleteId={athleteProfile.id}
              athleteProfile={athleteProfile}
              isActive={activeFeature === 'emotional'}
            />
          </TabsContent>

          <TabsContent value="college-match">
            <CollegeMatchOptimizer 
              athleteId={athleteProfile.id}
              athleteProfile={athleteProfile}
            />
          </TabsContent>
        </Tabs>

        {/* Action Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => setIsMonitoring(!isMonitoring)}
                className="flex items-center gap-2"
                variant={isMonitoring ? "destructive" : "default"}
              >
                <Eye className="h-4 w-4" />
                {isMonitoring ? 'Stop All Monitoring' : 'Start Full Monitoring'}
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Generate Report
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Share with Coach
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                View Achievements
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}