import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Calendar,
  Target,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Zap,
  Heart,
  Activity,
  Trophy,
  BookOpen,
  Video,
  Timer,
  BarChart3,
  Lightbulb,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainingGoal {
  id: string;
  skill: string;
  currentLevel: number;
  targetLevel: number;
  priority: 'high' | 'medium' | 'low';
  timeframe: number; // weeks
  garImpact: number;
}

interface Exercise {
  id: string;
  name: string;
  type: 'drill' | 'conditioning' | 'technical' | 'tactical' | 'recovery';
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  equipment: string[];
  instructions: string[];
  videoUrl?: string;
  targetSkills: string[];
  difficulty: number;
  garBoost: number;
}

interface TrainingSession {
  id: string;
  date: string;
  type: 'skill_focus' | 'conditioning' | 'game_prep' | 'recovery' | 'assessment';
  duration: number;
  exercises: Exercise[];
  warmUp: Exercise[];
  coolDown: Exercise[];
  intensity: number;
  focusAreas: string[];
  expectedGarGain: number;
  completed: boolean;
  actualDuration?: number;
  actualIntensity?: number;
  feedback?: string;
}

interface WeeklyPlan {
  week: number;
  startDate: string;
  sessions: TrainingSession[];
  goals: string[];
  recoveryDays: number;
  totalDuration: number;
  expectedGarGrowth: number;
}

interface AITrainingPlannerProps {
  userProfile: {
    currentGarScore: number;
    sport: string;
    level: string;
    availableTime: number; // minutes per day
    preferredDays: string[];
    weakAreas: string[];
    strengthAreas: string[];
  };
  onPlanGenerated: (plan: WeeklyPlan[]) => void;
}

export default function AITrainingPlanner({ userProfile, onPlanGenerated }: AITrainingPlannerProps) {
  const [trainingGoals, setTrainingGoals] = useState<TrainingGoal[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<WeeklyPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [planProgress, setPlanProgress] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState<WeeklyPlan | null>(null);
  const [activeSession, setActiveSession] = useState<TrainingSession | null>(null);
  const [planSettings, setPlanSettings] = useState({
    duration: 8, // weeks
    intensity: 75,
    focusBalance: 60, // skill vs conditioning split
    adaptiveMode: true,
    includeRecovery: true
  });

  // Initialize training goals based on user profile
  useEffect(() => {
    const initialGoals: TrainingGoal[] = userProfile.weakAreas.map((area, index) => ({
      id: `goal-${index}`,
      skill: area,
      currentLevel: Math.floor(Math.random() * 5) + 3,
      targetLevel: Math.floor(Math.random() * 3) + 8,
      priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
      timeframe: 6 + Math.floor(Math.random() * 6),
      garImpact: 5 + Math.floor(Math.random() * 10)
    }));
    setTrainingGoals(initialGoals);
  }, [userProfile]);

  const generateTrainingPlan = async () => {
    setIsGenerating(true);
    setPlanProgress(0);

    // Simulate AI analysis phases
    const phases = [
      'Analyzing current performance data',
      'Identifying skill gaps and priorities',
      'Generating exercise database match',
      'Creating adaptive progression timeline',
      'Optimizing session scheduling',
      'Finalizing personalized plan'
    ];

    for (let i = 0; i < phases.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPlanProgress((i + 1) / phases.length * 100);
    }

    // Generate sample training plan
    const samplePlan: WeeklyPlan[] = Array.from({ length: planSettings.duration }, (_, weekIndex) => ({
      week: weekIndex + 1,
      startDate: new Date(Date.now() + weekIndex * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sessions: generateWeekSessions(weekIndex + 1),
      goals: [`Improve ${trainingGoals[weekIndex % trainingGoals.length]?.skill || 'technique'}`, 'Build endurance', 'Enhance game awareness'],
      recoveryDays: 2,
      totalDuration: userProfile.availableTime * 5,
      expectedGarGrowth: 2 + Math.random() * 3
    }));

    setGeneratedPlan(samplePlan);
    setIsGenerating(false);
    onPlanGenerated(samplePlan);
  };

  const generateWeekSessions = (weekNumber: number): TrainingSession[] => {
    const sessionTypes = ['skill_focus', 'conditioning', 'game_prep', 'recovery'] as const;
    return Array.from({ length: 5 }, (_, dayIndex) => ({
      id: `session-${weekNumber}-${dayIndex}`,
      date: new Date(Date.now() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000 + dayIndex * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: sessionTypes[dayIndex % sessionTypes.length],
      duration: userProfile.availableTime,
      exercises: generateExercises(sessionTypes[dayIndex % sessionTypes.length]),
      warmUp: generateWarmUp(),
      coolDown: generateCoolDown(),
      intensity: 60 + Math.floor(Math.random() * 30),
      focusAreas: [trainingGoals[dayIndex % trainingGoals.length]?.skill || 'general'],
      expectedGarGain: 1 + Math.random() * 2,
      completed: Math.random() > 0.7
    }));
  };

  const generateExercises = (sessionType: string): Exercise[] => {
    const exerciseTemplates = {
      skill_focus: [
        { name: 'Ball Handling Drills', type: 'technical', duration: 15, targetSkills: ['dribbling', 'control'] },
        { name: 'Shooting Form Practice', type: 'technical', duration: 20, targetSkills: ['accuracy', 'technique'] },
        { name: 'Decision Making Scenarios', type: 'tactical', duration: 25, targetSkills: ['decision', 'awareness'] }
      ],
      conditioning: [
        { name: 'Sprint Intervals', type: 'conditioning', duration: 20, targetSkills: ['speed', 'endurance'] },
        { name: 'Agility Ladder Work', type: 'conditioning', duration: 15, targetSkills: ['agility', 'coordination'] },
        { name: 'Plyometric Training', type: 'conditioning', duration: 25, targetSkills: ['power', 'explosiveness'] }
      ],
      game_prep: [
        { name: 'Scrimmage Simulation', type: 'tactical', duration: 30, targetSkills: ['game_sense', 'application'] },
        { name: 'Pressure Situations', type: 'tactical', duration: 20, targetSkills: ['composure', 'decision'] },
        { name: 'Team Movement Patterns', type: 'tactical', duration: 15, targetSkills: ['positioning', 'timing'] }
      ],
      recovery: [
        { name: 'Active Recovery Movements', type: 'recovery', duration: 20, targetSkills: ['flexibility', 'recovery'] },
        { name: 'Mobility Routine', type: 'recovery', duration: 15, targetSkills: ['range_of_motion', 'injury_prevention'] },
        { name: 'Mental Visualization', type: 'tactical', duration: 10, targetSkills: ['focus', 'preparation'] }
      ]
    };

    const templates = exerciseTemplates[sessionType as keyof typeof exerciseTemplates] || exerciseTemplates.skill_focus;
    
    return templates.map((template, index) => ({
      id: `exercise-${sessionType}-${index}`,
      name: template.name,
      type: template.type as Exercise['type'],
      duration: template.duration,
      intensity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as Exercise['intensity'],
      equipment: ['Cone', 'Ball', 'Ladder', 'Markers'].slice(0, Math.floor(Math.random() * 3) + 1),
      instructions: [
        'Set up equipment as shown in demonstration',
        'Perform movement with proper form',
        'Focus on quality over speed',
        'Take breaks as needed between sets'
      ],
      targetSkills: template.targetSkills,
      difficulty: Math.floor(Math.random() * 5) + 3,
      garBoost: Math.random() * 2 + 0.5
    }));
  };

  const generateWarmUp = (): Exercise[] => [
    {
      id: 'warmup-1',
      name: 'Dynamic Warm-up',
      type: 'conditioning',
      duration: 10,
      intensity: 'low',
      equipment: [],
      instructions: ['Light jogging', 'Arm circles', 'Leg swings', 'Joint mobility'],
      targetSkills: ['preparation', 'injury_prevention'],
      difficulty: 1,
      garBoost: 0.1
    }
  ];

  const generateCoolDown = (): Exercise[] => [
    {
      id: 'cooldown-1',
      name: 'Cool Down Stretching',
      type: 'recovery',
      duration: 10,
      intensity: 'low',
      equipment: [],
      instructions: ['Static stretching', 'Deep breathing', 'Gentle movements'],
      targetSkills: ['recovery', 'flexibility'],
      difficulty: 1,
      garBoost: 0.1
    }
  ];

  const startSession = (session: TrainingSession) => {
    setActiveSession(session);
  };

  const completeSession = () => {
    if (activeSession) {
      setGeneratedPlan(prev => prev.map(week => ({
        ...week,
        sessions: week.sessions.map(session => 
          session.id === activeSession.id 
            ? { ...session, completed: true, actualDuration: session.duration }
            : session
        )
      })));
      setActiveSession(null);
    }
  };

  const renderPlanSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Plan Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium">Plan Duration: {planSettings.duration} weeks</label>
            <Slider
              value={[planSettings.duration]}
              onValueChange={([value]) => setPlanSettings(prev => ({ ...prev, duration: value }))}
              max={16}
              min={4}
              step={2}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Training Intensity: {planSettings.intensity}%</label>
            <Slider
              value={[planSettings.intensity]}
              onValueChange={([value]) => setPlanSettings(prev => ({ ...prev, intensity: value }))}
              max={100}
              min={30}
              step={5}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Skill vs Conditioning Balance: {planSettings.focusBalance}% Skills</label>
            <Slider
              value={[planSettings.focusBalance]}
              onValueChange={([value]) => setPlanSettings(prev => ({ ...prev, focusBalance: value }))}
              max={90}
              min={30}
              step={10}
              className="mt-2"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Adaptive Progression</label>
              <Switch
                checked={planSettings.adaptiveMode}
                onCheckedChange={(value) => setPlanSettings(prev => ({ ...prev, adaptiveMode: value }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Include Recovery Sessions</label>
              <Switch
                checked={planSettings.includeRecovery}
                onCheckedChange={(value) => setPlanSettings(prev => ({ ...prev, includeRecovery: value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Training Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trainingGoals.map((goal) => (
              <div key={goal.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{goal.skill}</span>
                  <Badge variant={
                    goal.priority === 'high' ? 'destructive' :
                    goal.priority === 'medium' ? 'default' : 'secondary'
                  }>
                    {goal.priority}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Level {goal.currentLevel} → {goal.targetLevel}</span>
                    <span>{goal.timeframe} weeks</span>
                  </div>
                  <Progress value={(goal.currentLevel / goal.targetLevel) * 100} className="h-2" />
                  <div className="text-xs text-gray-500">
                    Expected GAR impact: +{goal.garImpact} points
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={generateTrainingPlan}
        disabled={isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Brain className="w-5 h-5 mr-2 animate-pulse" />
            Generating Plan... {Math.round(planProgress)}%
          </>
        ) : (
          <>
            <Lightbulb className="w-5 h-5 mr-2" />
            Generate AI Training Plan
          </>
        )}
      </Button>

      {isGenerating && (
        <div className="space-y-2">
          <Progress value={planProgress} className="h-2" />
          <div className="text-center text-sm text-gray-600">
            Creating your personalized training program...
          </div>
        </div>
      )}
    </div>
  );

  const renderWeeklyPlan = () => (
    <div className="space-y-6">
      {generatedPlan.length === 0 ? (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Training Plan Generated</h3>
          <p className="text-gray-600 mb-6">Configure your settings and generate a personalized training plan</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {generatedPlan.slice(0, 4).map((week) => (
              <motion.div
                key={week.week}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: week.week * 0.1 }}
              >
                <Card 
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg",
                    selectedWeek?.week === week.week && "border-blue-500 bg-blue-50"
                  )}
                  onClick={() => setSelectedWeek(week)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Week {week.week}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        {new Date(week.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Sessions:</span>
                        <span>{week.sessions.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Time:</span>
                        <span>{Math.round(week.totalDuration / 60)}h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Expected GAR:</span>
                        <span className="text-green-600">+{week.expectedGarGrowth.toFixed(1)}</span>
                      </div>
                      <Progress 
                        value={(week.sessions.filter(s => s.completed).length / week.sessions.length) * 100} 
                        className="h-2 mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {selectedWeek && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Week {selectedWeek.week} - Detailed Schedule</span>
                  <Badge variant="outline">
                    {selectedWeek.sessions.filter(s => s.completed).length}/{selectedWeek.sessions.length} completed
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedWeek.sessions.length}</div>
                      <div className="text-sm text-gray-600">Training Sessions</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{Math.round(selectedWeek.totalDuration / 60)}h</div>
                      <div className="text-sm text-gray-600">Total Duration</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">+{selectedWeek.expectedGarGrowth.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Expected GAR Growth</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Week Goals</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedWeek.goals.map((goal, index) => (
                        <Badge key={index} variant="outline">{goal}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Training Sessions</h4>
                    {selectedWeek.sessions.map((session) => (
                      <div 
                        key={session.id} 
                        className={cn(
                          "p-4 border rounded-lg",
                          session.completed && "bg-green-50 border-green-200"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long' })}
                            </span>
                            <Badge variant="outline">{session.type.replace('_', ' ')}</Badge>
                            {session.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{session.duration} min</span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          Focus: {session.focusAreas.join(', ')}
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          {session.exercises.slice(0, 2).map((exercise) => (
                            <div key={exercise.id} className="text-sm">
                              • {exercise.name} ({exercise.duration} min)
                            </div>
                          ))}
                          {session.exercises.length > 2 && (
                            <div className="text-sm text-gray-500">
                              +{session.exercises.length - 2} more exercises
                            </div>
                          )}
                        </div>

                        {!session.completed && (
                          <Button 
                            size="sm" 
                            onClick={() => startSession(session)}
                            className="w-full"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Session
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );

  const renderActiveSession = () => (
    <AnimatePresence>
      {activeSession && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Active Session: {activeSession.type.replace('_', ' ')}</span>
                <Button variant="outline" size="sm" onClick={() => setActiveSession(null)}>
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{activeSession.duration}</div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{activeSession.exercises.length}</div>
                    <div className="text-sm text-gray-600">Exercises</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">+{activeSession.expectedGarGain.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Expected GAR</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Session Plan</h4>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-green-600">Warm-up</div>
                    {activeSession.warmUp.map((exercise) => (
                      <div key={exercise.id} className="text-sm pl-4 border-l-2 border-green-200">
                        {exercise.name} - {exercise.duration} min
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-blue-600">Main Exercises</div>
                    {activeSession.exercises.map((exercise) => (
                      <div key={exercise.id} className="text-sm pl-4 border-l-2 border-blue-200">
                        <div className="font-medium">{exercise.name} - {exercise.duration} min</div>
                        <div className="text-gray-600">
                          Intensity: {exercise.intensity} | Difficulty: {exercise.difficulty}/10
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {exercise.instructions.slice(0, 2).join('. ')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-purple-600">Cool-down</div>
                    {activeSession.coolDown.map((exercise) => (
                      <div key={exercise.id} className="text-sm pl-4 border-l-2 border-purple-200">
                        {exercise.name} - {exercise.duration} min
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={completeSession} className="w-full" size="lg">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-6">
      <Card className="go4it-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6" />
            AI Training Plan Generator
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
          <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Settings className="w-4 h-4" />
            Plan Settings
          </TabsTrigger>
          <TabsTrigger value="plan" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Calendar className="w-4 h-4" />
            Weekly Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            {renderPlanSettings()}
          </div>
        </TabsContent>

        <TabsContent value="plan" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            {renderWeeklyPlan()}
          </div>
        </TabsContent>
      </Tabs>

      {renderActiveSession()}
    </div>
  );
}