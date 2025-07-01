import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  Target, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Zap,
  Brain,
  Shield,
  Timer,
  BarChart3
} from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import StarRating from "../enhanced/star-rating";

interface BiomechanicsData {
  jointAngles: { [key: string]: number };
  velocity: number;
  acceleration: number;
  balance: number;
  coordination: number;
}

interface TechniqueAnalysis {
  sport: string;
  movement: string;
  score: number;
  improvements: string[];
  strengths: string[];
  keyFrames: number[];
}

interface InjuryRisk {
  level: 'low' | 'medium' | 'high';
  areas: string[];
  recommendations: string[];
  preventionPlan: string[];
}

export default function ComputerVisionAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const biomechanicsData: BiomechanicsData = {
    jointAngles: {
      knee: 142,
      ankle: 78,
      hip: 156,
      shoulder: 165,
      elbow: 89
    },
    velocity: 8.5,
    acceleration: 12.3,
    balance: 87,
    coordination: 92
  };

  const techniqueAnalysis: TechniqueAnalysis = {
    sport: "Basketball",
    movement: "Jump Shot",
    score: 94,
    improvements: [
      "Increase follow-through duration by 0.2 seconds",
      "Maintain elbow alignment under ball",
      "Consistent leg positioning on takeoff"
    ],
    strengths: [
      "Excellent arc trajectory (45-50 degrees)",
      "Consistent shooting pocket placement",
      "Strong base and balance"
    ],
    keyFrames: [15, 42, 67, 89, 112]
  };

  const injuryRisk: InjuryRisk = {
    level: 'low',
    areas: ['Right knee', 'Lower back'],
    recommendations: [
      "Strengthen hip flexors",
      "Improve ankle mobility",
      "Add glute activation exercises"
    ],
    preventionPlan: [
      "Dynamic warm-up before training",
      "Post-workout stretching routine",
      "Strength training 2x per week"
    ]
  };

  const performanceMetrics = [
    { label: "Release Point Consistency", value: 94, color: "text-green-400" },
    { label: "Arc Trajectory", value: 89, color: "text-cyan-400" },
    { label: "Follow Through", value: 82, color: "text-yellow-400" },
    { label: "Balance & Stability", value: 96, color: "text-green-400" },
    { label: "Shooting Speed", value: 78, color: "text-orange-400" }
  ];

  const startAnalysis = async () => {
    setAnalyzing(true);
    setProgress(0);
    
    const stages = [
      { name: "Loading video frames", duration: 1000 },
      { name: "Detecting pose landmarks", duration: 2000 },
      { name: "Analyzing biomechanics", duration: 1500 },
      { name: "Evaluating technique", duration: 1000 },
      { name: "Generating insights", duration: 500 }
    ];

    let currentProgress = 0;
    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, stage.duration));
      currentProgress += 100 / stages.length;
      setProgress(currentProgress);
    }

    setAnalyzing(false);
    setAnalysisComplete(true);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'high': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-slate-400 bg-slate-400/20 border-slate-400/30';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-purple-400" />
            AI Computer Vision Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                <video 
                  ref={videoRef}
                  className="w-full h-full rounded-lg object-cover"
                  controls
                  poster="/api/placeholder/640/360"
                >
                  <source src="/sample-basketball-shot.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={startAnalysis}
                  disabled={analyzing}
                  className="flex-1 neon-glow"
                >
                  {analyzing ? 'Analyzing...' : 'Start AI Analysis'}
                </Button>
                <Button variant="outline" className="border-purple-400 text-purple-400">
                  Upload New Video
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {analyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-800/50 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-white mb-3">Processing Video...</h4>
                  <Progress value={progress} className="mb-3" />
                  <div className="space-y-2 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      Detecting pose landmarks
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      Analyzing biomechanics
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Evaluating technique
                    </div>
                  </div>
                </motion.div>
              )}

              {analysisComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-white mb-3">Analysis Complete!</h4>
                  <div className="flex items-center gap-3 mb-3">
                    <StarRating garScore={techniqueAnalysis.score} size="sm" showScore={false} />
                    <Badge className="verified-badge">
                      {techniqueAnalysis.score} Technique Score
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400">
                    Advanced biomechanical analysis identified key areas for improvement 
                    and highlighted your technical strengths.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {analysisComplete && (
        <Tabs defaultValue="technique" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="technique" className="data-[state=active]:bg-purple-500">
              Technique Analysis
            </TabsTrigger>
            <TabsTrigger value="biomechanics" className="data-[state=active]:bg-cyan-500">
              Biomechanics
            </TabsTrigger>
            <TabsTrigger value="injury" className="data-[state=active]:bg-orange-500">
              Injury Prevention
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-green-500">
              Performance Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="technique">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    Technique Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-purple-400 mb-2">
                      {techniqueAnalysis.score}
                    </div>
                    <p className="text-slate-400">{techniqueAnalysis.movement} Score</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {techniqueAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      Improvements
                    </h4>
                    <ul className="space-y-2">
                      {techniqueAnalysis.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    Performance Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceMetrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-300">{metric.label}</span>
                          <span className={`font-semibold ${metric.color}`}>{metric.value}%</span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="biomechanics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Joint Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(biomechanicsData.jointAngles).map(([joint, angle]) => (
                      <div key={joint} className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                        <span className="text-white capitalize">{joint} Angle</span>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 font-semibold">{angle}°</span>
                          <Badge variant="outline" className="text-xs text-green-400 border-green-400/30">
                            Optimal
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    Movement Dynamics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          {biomechanicsData.velocity} m/s
                        </div>
                        <p className="text-xs text-slate-400">Peak Velocity</p>
                      </div>
                      <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                        <div className="text-2xl font-bold text-cyan-400 mb-1">
                          {biomechanicsData.acceleration} m/s²
                        </div>
                        <p className="text-xs text-slate-400">Max Acceleration</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Balance Score</span>
                        <span className="text-green-400 font-semibold">{biomechanicsData.balance}%</span>
                      </div>
                      <Progress value={biomechanicsData.balance} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Coordination Score</span>
                        <span className="text-cyan-400 font-semibold">{biomechanicsData.coordination}%</span>
                      </div>
                      <Progress value={biomechanicsData.coordination} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="injury">
            <Card className="bg-slate-800/50 border-orange-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-400" />
                  Injury Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Badge className={`mb-4 ${getRiskColor(injuryRisk.level)}`}>
                      {injuryRisk.level.toUpperCase()} RISK
                    </Badge>
                    <h4 className="font-semibold text-white mb-2">Overall Assessment</h4>
                    <p className="text-sm text-slate-400">
                      Your movement patterns show low injury risk with excellent biomechanics.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      Watch Areas
                    </h4>
                    <ul className="space-y-2">
                      {injuryRisk.areas.map((area, index) => (
                        <li key={index} className="text-sm text-slate-300 flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-green-400" />
                      Prevention Plan
                    </h4>
                    <ul className="space-y-2">
                      {injuryRisk.preventionPlan.map((plan, index) => (
                        <li key={index} className="text-sm text-slate-300 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          {plan}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-green-400" />
                    Real-time Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">Live Coaching Cues</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="text-green-400">✓ Maintain shooting pocket position</li>
                        <li className="text-yellow-400">⚠ Increase follow-through hold time</li>
                        <li className="text-cyan-400">→ Focus on consistent leg spacing</li>
                      </ul>
                    </div>
                    
                    <Button className="w-full neon-glow">
                      Start Live Training Session
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Progress Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-1">+5.2</div>
                      <p className="text-sm text-slate-400">Points improved this week</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">This Week</span>
                        <span className="text-green-400">94.2</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Last Week</span>
                        <span className="text-slate-400">89.0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Monthly Avg</span>
                        <span className="text-slate-400">91.5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}