import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Headphones, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Target,
  Brain,
  Gamepad2,
  Trophy,
  Zap,
  Heart,
  Activity
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarRating from "../enhanced/star-rating";

interface VRScenario {
  id: string;
  title: string;
  sport: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  duration: number;
  objectives: string[];
  biometricTargets: {
    heartRate: { min: number; max: number };
    stressLevel: number;
    focusLevel: number;
  };
  completed: boolean;
  bestScore: number;
  averageScore: number;
}

interface BiometricData {
  heartRate: number;
  stressLevel: number;
  focusLevel: number;
  fatigue: number;
  recovery: number;
}

interface VRSession {
  isActive: boolean;
  currentScenario: string;
  timeElapsed: number;
  score: number;
  objectives: { [key: string]: boolean };
}

export default function VRTrainingSystem() {
  const [selectedScenario, setSelectedScenario] = useState<string>('basketball-freethrow');
  const [vrSession, setVrSession] = useState<VRSession>({
    isActive: false,
    currentScenario: '',
    timeElapsed: 0,
    score: 0,
    objectives: {}
  });
  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRate: 72,
    stressLevel: 25,
    focusLevel: 85,
    fatigue: 15,
    recovery: 92
  });

  const vrScenarios: VRScenario[] = [
    {
      id: 'basketball-freethrow',
      title: 'Pressure Free Throws',
      sport: 'Basketball',
      difficulty: 'intermediate',
      duration: 15,
      objectives: [
        'Make 8/10 free throws',
        'Maintain consistent form',
        'Control breathing under pressure'
      ],
      biometricTargets: {
        heartRate: { min: 80, max: 120 },
        stressLevel: 40,
        focusLevel: 90
      },
      completed: true,
      bestScore: 92,
      averageScore: 87
    },
    {
      id: 'soccer-penalty',
      title: 'Penalty Kick Mastery',
      sport: 'Soccer',
      difficulty: 'advanced',
      duration: 20,
      objectives: [
        'Score 9/10 penalties',
        'Vary shot placement',
        'Handle crowd pressure'
      ],
      biometricTargets: {
        heartRate: { min: 85, max: 130 },
        stressLevel: 50,
        focusLevel: 95
      },
      completed: false,
      bestScore: 0,
      averageScore: 0
    },
    {
      id: 'tennis-serve',
      title: 'Championship Point Serve',
      sport: 'Tennis',
      difficulty: 'elite',
      duration: 25,
      objectives: [
        'Land 85% first serves',
        'Maintain 110+ mph speed',
        'Handle match point pressure'
      ],
      biometricTargets: {
        heartRate: { min: 90, max: 140 },
        stressLevel: 60,
        focusLevel: 98
      },
      completed: false,
      bestScore: 0,
      averageScore: 0
    },
    {
      id: 'baseball-clutch',
      title: 'Bases Loaded Batting',
      sport: 'Baseball',
      difficulty: 'advanced',
      duration: 18,
      objectives: [
        'Get on base 7/10 at-bats',
        'Handle high-pressure situations',
        'Recognize pitch types quickly'
      ],
      biometricTargets: {
        heartRate: { min: 85, max: 125 },
        stressLevel: 45,
        focusLevel: 92
      },
      completed: true,
      bestScore: 88,
      averageScore: 82
    }
  ];

  const mentalTrainingPrograms = [
    {
      id: 'visualization',
      title: 'Visualization Mastery',
      description: 'Advanced mental imagery techniques for performance enhancement',
      duration: 12,
      sessions: 8,
      difficulty: 'intermediate'
    },
    {
      id: 'pressure-training',
      title: 'Pressure Inoculation',
      description: 'Build mental resilience in high-pressure game situations',
      duration: 20,
      sessions: 12,
      difficulty: 'advanced'
    },
    {
      id: 'focus-enhancement',
      title: 'Attention Control',
      description: 'Develop laser focus and concentration for peak performance',
      duration: 15,
      sessions: 10,
      difficulty: 'beginner'
    }
  ];

  const startVRSession = (scenarioId: string) => {
    const scenario = vrScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    setVrSession({
      isActive: true,
      currentScenario: scenarioId,
      timeElapsed: 0,
      score: 0,
      objectives: scenario.objectives.reduce((acc, obj, index) => ({
        ...acc,
        [index]: false
      }), {})
    });

    // Simulate real-time biometric changes
    const interval = setInterval(() => {
      setBiometrics(prev => ({
        heartRate: Math.min(140, prev.heartRate + Math.random() * 10 - 5),
        stressLevel: Math.max(0, Math.min(100, prev.stressLevel + Math.random() * 8 - 4)),
        focusLevel: Math.max(0, Math.min(100, prev.focusLevel + Math.random() * 6 - 3)),
        fatigue: Math.max(0, Math.min(100, prev.fatigue + Math.random() * 2)),
        recovery: Math.max(0, Math.min(100, prev.recovery - Math.random() * 1))
      }));

      setVrSession(prev => ({
        ...prev,
        timeElapsed: prev.timeElapsed + 1,
        score: Math.min(100, prev.score + Math.random() * 5)
      }));
    }, 1000);

    // Stop after scenario duration
    setTimeout(() => {
      clearInterval(interval);
      setVrSession(prev => ({ ...prev, isActive: false }));
    }, scenario.duration * 1000);
  };

  const stopVRSession = () => {
    setVrSession(prev => ({ ...prev, isActive: false }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'advanced': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'elite': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-slate-400 bg-slate-400/20 border-slate-400/30';
    }
  };

  const getBiometricColor = (value: number, type: string) => {
    if (type === 'heartRate') {
      if (value < 80) return 'text-blue-400';
      if (value < 120) return 'text-green-400';
      if (value < 140) return 'text-yellow-400';
      return 'text-red-400';
    }
    if (value < 30) return 'text-green-400';
    if (value < 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* VR System Status */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="w-6 h-6 text-purple-400" />
            Virtual Reality Training System
            {vrSession.isActive && (
              <Badge className="verified-badge ml-2 animate-pulse">
                LIVE SESSION
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {!vrSession.isActive ? (
                <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-600">
                  <div className="text-center">
                    <Headphones className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Ready for VR Training</h3>
                    <p className="text-slate-400 mb-4">Select a scenario below to begin immersive training</p>
                    <Button 
                      className="neon-glow"
                      onClick={() => startVRSession(selectedScenario)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start VR Session
                    </Button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="aspect-video bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg border-2 border-cyan-400/50 flex items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse"></div>
                  <div className="text-center z-10">
                    <div className="text-6xl font-bold text-cyan-400 mb-2 neon-text">
                      {Math.round(vrSession.score)}
                    </div>
                    <p className="text-white mb-4">Current Performance Score</p>
                    <div className="flex gap-3 justify-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={stopVRSession}
                        className="border-red-400 text-red-400 hover:bg-red-400/10"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Real-time Biometrics */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Live Biometrics
              </h4>
              
              <div className="space-y-3">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">Heart Rate</span>
                    <span className={`font-semibold ${getBiometricColor(biometrics.heartRate, 'heartRate')}`}>
                      {Math.round(biometrics.heartRate)} BPM
                    </span>
                  </div>
                  <Progress value={Math.min(100, (biometrics.heartRate / 140) * 100)} className="h-2" />
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">Stress Level</span>
                    <span className={`font-semibold ${getBiometricColor(biometrics.stressLevel, 'stress')}`}>
                      {Math.round(biometrics.stressLevel)}%
                    </span>
                  </div>
                  <Progress value={biometrics.stressLevel} className="h-2" />
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">Focus Level</span>
                    <span className="font-semibold text-green-400">
                      {Math.round(biometrics.focusLevel)}%
                    </span>
                  </div>
                  <Progress value={biometrics.focusLevel} className="h-2" />
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-400">Recovery</span>
                    <span className="font-semibold text-cyan-400">
                      {Math.round(biometrics.recovery)}%
                    </span>
                  </div>
                  <Progress value={biometrics.recovery} className="h-2" />
                </div>
              </div>

              {vrSession.isActive && (
                <div className="bg-slate-900/50 rounded-lg p-3 border border-cyan-400/30">
                  <h5 className="font-medium text-white mb-2">Session Progress</h5>
                  <div className="text-sm text-slate-400 mb-2">
                    Time: {Math.floor(vrSession.timeElapsed / 60)}:{(vrSession.timeElapsed % 60).toString().padStart(2, '0')}
                  </div>
                  <Progress value={(vrSession.timeElapsed / (vrScenarios.find(s => s.id === vrSession.currentScenario)?.duration || 1)) * 100} className="h-2" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scenarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="scenarios" className="data-[state=active]:bg-purple-500">
            VR Scenarios
          </TabsTrigger>
          <TabsTrigger value="mental" className="data-[state=active]:bg-cyan-500">
            Mental Training
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-green-500">
            Performance Analytics
          </TabsTrigger>
        </TabsList>

        {/* VR Scenarios Tab */}
        <TabsContent value="scenarios">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vrScenarios.map((scenario) => (
              <Card 
                key={scenario.id} 
                className={`bg-slate-800/50 border-slate-700 achievement-glow cursor-pointer transition-all ${
                  selectedScenario === scenario.id ? 'border-purple-500/50 bg-purple-500/10' : ''
                }`}
                onClick={() => setSelectedScenario(scenario.id)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-white mb-1">{scenario.title}</h4>
                      <p className="text-sm text-slate-400">{scenario.sport}</p>
                    </div>
                    <Badge className={getDifficultyColor(scenario.difficulty)}>
                      {scenario.difficulty.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Duration</span>
                      <span className="text-white">{scenario.duration} min</span>
                    </div>
                    {scenario.completed && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Best Score</span>
                          <StarRating garScore={scenario.bestScore} size="sm" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Average</span>
                          <span className="text-cyan-400">{scenario.averageScore}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-white mb-2">Objectives:</h5>
                    <ul className="space-y-1">
                      {scenario.objectives.map((objective, index) => (
                        <li key={index} className="text-xs text-slate-400 flex items-center gap-2">
                          <Target className="w-3 h-3 text-purple-400" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className="w-full neon-glow"
                    onClick={(e) => {
                      e.stopPropagation();
                      startVRSession(scenario.id);
                    }}
                    disabled={vrSession.isActive}
                  >
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    {scenario.completed ? 'Play Again' : 'Start Training'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Mental Training Tab */}
        <TabsContent value="mental">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mentalTrainingPrograms.map((program) => (
              <Card key={program.id} className="bg-slate-800/50 border-cyan-500/30 achievement-glow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-8 h-8 text-cyan-400" />
                    <div>
                      <h4 className="font-semibold text-white">{program.title}</h4>
                      <Badge className={getDifficultyColor(program.difficulty)}>
                        {program.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-4">{program.description}</p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration</span>
                      <span className="text-white">{program.duration} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sessions</span>
                      <span className="text-white">{program.sessions}</span>
                    </div>
                  </div>

                  <Button className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400/10" variant="outline">
                    Start Program
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-green-400" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">87.5</div>
                    <p className="text-sm text-slate-400">Average VR Score</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Improvement Rate</span>
                      <span className="text-green-400 font-semibold">+12.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Sessions Completed</span>
                      <span className="text-cyan-400 font-semibold">47</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Total Training Time</span>
                      <span className="text-purple-400 font-semibold">23.5 hrs</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-400" />
                  Biometric Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <h5 className="font-medium text-white mb-2">Recovery Recommendation</h5>
                    <p className="text-sm text-slate-400">
                      Your stress levels have been elevated. Consider a 24-hour recovery period before your next intense VR session.
                    </p>
                  </div>
                  
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <h5 className="font-medium text-white mb-2">Optimal Training Time</h5>
                    <p className="text-sm text-slate-400">
                      Your focus peaks between 3-5 PM. Schedule high-difficulty scenarios during this window for best results.
                    </p>
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