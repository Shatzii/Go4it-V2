'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Heart,
  Brain,
  Utensils,
  Activity,
  Droplet,
  Moon,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  Zap,
  Shield,
  Users,
  BookOpen,
} from 'lucide-react';

interface WellnessMetrics {
  id: string;
  date: string;
  sleep: number;
  hydration: number;
  stress: number;
  energy: number;
  mood: number;
  recovery: number;
}

interface NutritionPlan {
  id: string;
  sport: string;
  phase: 'training' | 'competition' | 'recovery';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meals: NutritionMeal[];
}

interface NutritionMeal {
  name: string;
  time: string;
  calories: number;
  description: string;
  benefits: string;
}

interface MentalHealthModule {
  id: string;
  title: string;
  type: 'breathing' | 'meditation' | 'visualization' | 'focus';
  duration: number;
  description: string;
  benefits: string[];
  completed: boolean;
}

export default function WellnessHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSport, setSelectedSport] = useState('football');
  const [selectedPhase, setSelectedPhase] = useState('training');
  const [wellnessData, setWellnessData] = useState<WellnessMetrics[]>([]);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [mentalModules, setMentalModules] = useState<MentalHealthModule[]>([]);

  useEffect(() => {
    loadWellnessData();
    loadNutritionPlan();
    loadMentalHealthModules();
  }, [selectedSport, selectedPhase]);

  const loadWellnessData = async () => {
    try {
      const response = await fetch(`/api/wellness/tracking?userId=demo-user&days=7`);
      const result = await response.json();
      if (result.success) {
        const formattedData = result.data.map((item: any) => ({
          id: item.id,
          date: new Date(item.date).toISOString().split('T')[0],
          sleep: item.sleep || 0,
          hydration: item.hydration || 0,
          stress: item.stress || 0,
          energy: item.energy || 0,
          mood: item.mood || 0,
          recovery: item.recovery || 0,
        }));
        setWellnessData(formattedData);
      }
    } catch (error) {
      console.error('Failed to load wellness data:', error);
    }
  };

  const loadNutritionPlan = async () => {
    try {
      const response = await fetch(
        `/api/wellness/nutrition?userId=demo-user&sport=${selectedSport}&phase=${selectedPhase}`,
      );
      const result = await response.json();
      if (result.success) {
        const plan = result.nutritionPlan;
        setNutritionPlan({
          id: plan.id,
          sport: plan.sport,
          phase: plan.phase,
          calories: plan.calories,
          protein: plan.protein,
          carbs: plan.carbs,
          fats: plan.fats,
          meals: plan.meals || [],
        });
      }
    } catch (error) {
      console.error('Failed to load nutrition plan:', error);
    }
  };

  const loadMentalHealthModules = async () => {
    try {
      const response = await fetch('/api/wellness/mental-health');
      const result = await response.json();
      if (result.success) {
        const modules = result.modules.map((module: any) => ({
          id: module.id,
          title: module.title,
          type: module.type,
          duration: module.duration,
          description: module.description,
          benefits: module.benefits || [],
          completed: Math.random() > 0.7, // Random completion status for demo
        }));
        setMentalModules(modules);
      }
    } catch (error) {
      console.error('Failed to load mental health modules:', error);
    }
  };

  const getWellnessAverage = (metric: keyof WellnessMetrics) => {
    if (wellnessData.length === 0) return 0;
    const sum = wellnessData.reduce((acc, data) => acc + (data[metric] as number), 0);
    return sum / wellnessData.length;
  };

  const getWellnessStatus = (value: number, metric: string) => {
    const thresholds = {
      sleep: { good: 8, warning: 7 },
      hydration: { good: 80, warning: 65 },
      stress: { good: 4, warning: 6 },
      energy: { good: 8, warning: 6 },
      mood: { good: 8, warning: 6 },
      recovery: { good: 85, warning: 75 },
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (metric === 'stress') {
      return value <= threshold.good ? 'good' : value <= threshold.warning ? 'warning' : 'danger';
    } else {
      return value >= threshold.good ? 'good' : value >= threshold.warning ? 'warning' : 'danger';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'danger':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'danger':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 text-red-400" />
            Wellness Hub
          </h1>
          <p className="text-slate-300 text-lg">
            Comprehensive health, nutrition, and mental wellness for peak athletic performance
          </p>
        </div>

        {/* Sport and Phase Selection */}
        <div className="flex gap-4 mb-6 justify-center">
          <div>
            <Label className="text-slate-300">Sport</Label>
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger className="bg-slate-800 border-slate-700 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="basketball">Basketball</SelectItem>
                <SelectItem value="soccer">Soccer</SelectItem>
                <SelectItem value="baseball">Baseball</SelectItem>
                <SelectItem value="track">Track & Field</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-slate-300">Training Phase</Label>
            <Select value={selectedPhase} onValueChange={setSelectedPhase}>
              <SelectTrigger className="bg-slate-800 border-slate-700 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="competition">Competition</SelectItem>
                <SelectItem value="recovery">Recovery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Nutrition
            </TabsTrigger>
            <TabsTrigger value="mental" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Mental Health
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Wellness Metrics */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Moon className="w-5 h-5 text-blue-400" />
                    Sleep Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Average</span>
                    <span
                      className={`font-bold ${getStatusColor(getWellnessStatus(getWellnessAverage('sleep'), 'sleep'))}`}
                    >
                      {getWellnessAverage('sleep').toFixed(1)}h
                    </span>
                  </div>
                  <Progress value={(getWellnessAverage('sleep') / 10) * 100} className="mb-2" />
                  <div className="flex items-center gap-2 text-sm">
                    {getStatusIcon(getWellnessStatus(getWellnessAverage('sleep'), 'sleep'))}
                    <span className="text-slate-400">
                      {getWellnessStatus(getWellnessAverage('sleep'), 'sleep') === 'good'
                        ? 'Excellent sleep habits'
                        : getWellnessStatus(getWellnessAverage('sleep'), 'sleep') === 'warning'
                          ? 'Consider more sleep'
                          : 'Sleep improvement needed'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-blue-400" />
                    Hydration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Daily Average</span>
                    <span
                      className={`font-bold ${getStatusColor(getWellnessStatus(getWellnessAverage('hydration'), 'hydration'))}`}
                    >
                      {getWellnessAverage('hydration').toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={getWellnessAverage('hydration')} className="mb-2" />
                  <div className="flex items-center gap-2 text-sm">
                    {getStatusIcon(getWellnessStatus(getWellnessAverage('hydration'), 'hydration'))}
                    <span className="text-slate-400">Target: 100% daily intake</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Energy Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Current</span>
                    <span
                      className={`font-bold ${getStatusColor(getWellnessStatus(getWellnessAverage('energy'), 'energy'))}`}
                    >
                      {getWellnessAverage('energy').toFixed(1)}/10
                    </span>
                  </div>
                  <Progress value={(getWellnessAverage('energy') / 10) * 100} className="mb-2" />
                  <div className="flex items-center gap-2 text-sm">
                    {getStatusIcon(getWellnessStatus(getWellnessAverage('energy'), 'energy'))}
                    <span className="text-slate-400">
                      {getWellnessAverage('energy') >= 8
                        ? 'Optimal energy levels'
                        : 'Consider recovery strategies'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                className="bg-green-600 hover:bg-green-700 h-auto p-4 flex-col gap-2"
                onClick={() => setActiveTab('nutrition')}
              >
                <Utensils className="w-6 h-6" />
                <span>View Meal Plan</span>
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 h-auto p-4 flex-col gap-2"
                onClick={() => setActiveTab('mental')}
              >
                <Brain className="w-6 h-6" />
                <span>Mental Training</span>
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 h-auto p-4 flex-col gap-2"
                onClick={() => setActiveTab('analytics')}
              >
                <TrendingUp className="w-6 h-6" />
                <span>View Analytics</span>
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 h-auto p-4 flex-col gap-2">
                <Shield className="w-6 h-6" />
                <span>Emergency Support</span>
              </Button>
            </div>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6">
            {nutritionPlan && (
              <>
                {/* Nutrition Overview */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {nutritionPlan.sport} -{' '}
                      {nutritionPlan.phase.charAt(0).toUpperCase() + nutritionPlan.phase.slice(1)}{' '}
                      Phase
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center bg-slate-700 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-400">
                          {nutritionPlan.calories}
                        </div>
                        <div className="text-sm text-slate-400">Daily Calories</div>
                      </div>
                      <div className="text-center bg-slate-700 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-400">
                          {nutritionPlan.protein}g
                        </div>
                        <div className="text-sm text-slate-400">Protein</div>
                      </div>
                      <div className="text-center bg-slate-700 rounded-lg p-4">
                        <div className="text-2xl font-bold text-yellow-400">
                          {nutritionPlan.carbs}g
                        </div>
                        <div className="text-sm text-slate-400">Carbohydrates</div>
                      </div>
                      <div className="text-center bg-slate-700 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-400">
                          {nutritionPlan.fats}g
                        </div>
                        <div className="text-sm text-slate-400">Healthy Fats</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Daily Meal Plan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {nutritionPlan.meals.map((meal, index) => (
                    <Card key={index} className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center justify-between">
                          <span>{meal.name}</span>
                          <Badge variant="outline" className="text-slate-300">
                            {meal.time}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-slate-300">{meal.description}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Calories</span>
                            <span className="font-semibold text-blue-400">{meal.calories}</span>
                          </div>
                          <div className="bg-slate-700 rounded-lg p-3">
                            <div className="text-sm text-green-400 font-medium mb-1">Benefits:</div>
                            <div className="text-sm text-slate-300">{meal.benefits}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Mental Health Tab */}
          <TabsContent value="mental" className="space-y-6">
            <Alert className="bg-slate-800 border-slate-700">
              <Brain className="w-4 h-4" />
              <AlertDescription className="text-slate-300">
                Mental wellness is crucial for athletic performance. These evidence-based techniques
                can help manage stress, improve focus, and enhance overall well-being.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentalModules.map((module) => (
                <Card key={module.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>{module.title}</span>
                      <Badge
                        variant={module.completed ? 'default' : 'outline'}
                        className={module.completed ? 'bg-green-600' : 'text-slate-300'}
                      >
                        {module.duration} min
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-slate-300">{module.description}</p>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-green-400">Benefits:</div>
                        <ul className="space-y-1">
                          {module.benefits.map((benefit, index) => (
                            <li
                              key={index}
                              className="text-sm text-slate-400 flex items-center gap-2"
                            >
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        className={`w-full ${
                          module.completed
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        onClick={() => {
                          const updatedModules = mentalModules.map((m) =>
                            m.id === module.id ? { ...m, completed: !m.completed } : m,
                          );
                          setMentalModules(updatedModules);
                        }}
                      >
                        {module.completed ? 'Practice Again' : 'Start Session'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Emergency Support */}
            <Card className="bg-red-900/20 border-red-700">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Crisis Support Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">National Suicide Prevention Lifeline</span>
                    <span className="font-mono text-red-400">988</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Crisis Text Line</span>
                    <span className="font-mono text-red-400">Text HOME to 741741</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Student Athlete Mental Health</span>
                    <Button variant="outline" size="sm" className="text-red-400 border-red-700">
                      Get Help
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Wellness Trends */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">7-Day Wellness Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {wellnessData.slice(-7).map((data, index) => (
                      <div key={data.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">
                            {new Date(data.date).toLocaleDateString()}
                          </span>
                          <div className="flex gap-4 text-sm">
                            <span
                              className={getStatusColor(getWellnessStatus(data.sleep, 'sleep'))}
                            >
                              Sleep: {data.sleep.toFixed(1)}h
                            </span>
                            <span
                              className={getStatusColor(getWellnessStatus(data.energy, 'energy'))}
                            >
                              Energy: {data.energy.toFixed(1)}/10
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-slate-700 rounded p-2 text-center">
                            <div className="text-xs text-slate-400">Recovery</div>
                            <div className="text-sm font-semibold">{data.recovery.toFixed(0)}%</div>
                          </div>
                          <div className="bg-slate-700 rounded p-2 text-center">
                            <div className="text-xs text-slate-400">Hydration</div>
                            <div className="text-sm font-semibold">
                              {data.hydration.toFixed(0)}%
                            </div>
                          </div>
                          <div className="bg-slate-700 rounded p-2 text-center">
                            <div className="text-xs text-slate-400">Stress</div>
                            <div className="text-sm font-semibold">{data.stress.toFixed(1)}/10</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Insights */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert className="bg-green-900/20 border-green-700">
                      <TrendingUp className="w-4 h-4" />
                      <AlertDescription className="text-green-400">
                        Your sleep quality has improved 15% this week! Keep up the consistent
                        bedtime routine.
                      </AlertDescription>
                    </Alert>

                    <Alert className="bg-yellow-900/20 border-yellow-700">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription className="text-yellow-400">
                        Hydration levels below optimal. Consider increasing water intake during
                        training days.
                      </AlertDescription>
                    </Alert>

                    <Alert className="bg-blue-900/20 border-blue-700">
                      <Target className="w-4 h-4" />
                      <AlertDescription className="text-blue-400">
                        Your mental health sessions correlate with improved energy levels. Continue
                        regular practice.
                      </AlertDescription>
                    </Alert>

                    <div className="bg-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">Weekly Goals Progress</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-300">Sleep (8+ hours)</span>
                            <span className="text-green-400">5/7 days</span>
                          </div>
                          <Progress value={71} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-300">Mental Training</span>
                            <span className="text-yellow-400">3/5 sessions</span>
                          </div>
                          <Progress value={60} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-300">Nutrition Plan</span>
                            <span className="text-green-400">6/7 days</span>
                          </div>
                          <Progress value={86} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
