'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, BarChart3, Target, Zap, Timer, 
  Activity, Award, Users, Calendar, ArrowUp, 
  ArrowDown, AlertCircle, CheckCircle, Star,
  PlayCircle, PauseCircle, RotateCcw
} from 'lucide-react';

interface PerformanceMetrics {
  id: string;
  date: string;
  sport: string;
  category: string;
  value: number;
  unit: string;
  previous: number;
  target: number;
  garScore?: number;
}

interface TrainingLoad {
  week: string;
  acute: number;
  chronic: number;
  ratio: number;
  injuryRisk: 'low' | 'moderate' | 'high';
}

interface SkillProgression {
  skill: string;
  current: number;
  target: number;
  improvement: number;
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
}

interface CompetitorComparison {
  athlete: string;
  sport: string;
  position: string;
  garScore: number;
  ranking: number;
  strengths: string[];
  improvements: string[];
}

export default function PerformanceAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSport, setSelectedSport] = useState('football');
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [performanceData, setPerformanceData] = useState<PerformanceMetrics[]>([]);
  const [trainingLoad, setTrainingLoad] = useState<TrainingLoad[]>([]);
  const [skillProgression, setSkillProgression] = useState<SkillProgression[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorComparison[]>([]);

  useEffect(() => {
    loadPerformanceData();
    loadTrainingLoad();
    loadSkillProgression();
    loadCompetitorData();
  }, [selectedSport, selectedTimeframe]);

  const loadPerformanceData = () => {
    const mockMetrics: PerformanceMetrics[] = [
      {
        id: 'speed-1',
        date: '2025-01-15',
        sport: selectedSport,
        category: 'Speed',
        value: 4.42,
        unit: 'seconds',
        previous: 4.48,
        target: 4.35,
        garScore: 8.7
      },
      {
        id: 'strength-1',
        date: '2025-01-15',
        sport: selectedSport,
        category: 'Strength',
        value: 315,
        unit: 'lbs',
        previous: 305,
        target: 335,
        garScore: 8.4
      },
      {
        id: 'agility-1',
        date: '2025-01-15',
        sport: selectedSport,
        category: 'Agility',
        value: 6.85,
        unit: 'seconds',
        previous: 6.92,
        target: 6.75,
        garScore: 8.1
      },
      {
        id: 'endurance-1',
        date: '2025-01-15',
        sport: selectedSport,
        category: 'Endurance',
        value: 12.5,
        unit: 'minutes',
        previous: 12.8,
        target: 12.0,
        garScore: 7.9
      },
      {
        id: 'power-1',
        date: '2025-01-15',
        sport: selectedSport,
        category: 'Power',
        value: 38.5,
        unit: 'inches',
        previous: 37.2,
        target: 40.0,
        garScore: 8.6
      }
    ];
    setPerformanceData(mockMetrics);
  };

  const loadTrainingLoad = () => {
    const mockLoad: TrainingLoad[] = [
      { week: 'Week 1', acute: 850, chronic: 800, ratio: 1.06, injuryRisk: 'low' },
      { week: 'Week 2', acute: 920, chronic: 820, ratio: 1.12, injuryRisk: 'low' },
      { week: 'Week 3', acute: 1050, chronic: 860, ratio: 1.22, injuryRisk: 'moderate' },
      { week: 'Week 4', acute: 980, chronic: 890, ratio: 1.10, injuryRisk: 'low' },
      { week: 'Week 5', acute: 1150, chronic: 920, ratio: 1.25, injuryRisk: 'moderate' },
      { week: 'Week 6', acute: 1280, chronic: 950, ratio: 1.35, injuryRisk: 'high' },
    ];
    setTrainingLoad(mockLoad);
  };

  const loadSkillProgression = () => {
    const skills: SkillProgression[] = [
      { skill: 'Sprint Technique', current: 85, target: 92, improvement: 7, timeframe: '8 weeks', priority: 'high' },
      { skill: 'Route Running', current: 78, target: 88, improvement: 10, timeframe: '12 weeks', priority: 'high' },
      { skill: 'Ball Security', current: 91, target: 95, improvement: 4, timeframe: '6 weeks', priority: 'medium' },
      { skill: 'Blocking Technique', current: 72, target: 82, improvement: 10, timeframe: '10 weeks', priority: 'medium' },
      { skill: 'Footwork', current: 88, target: 93, improvement: 5, timeframe: '8 weeks', priority: 'low' }
    ];
    setSkillProgression(skills);
  };

  const loadCompetitorData = () => {
    const mockCompetitors: CompetitorComparison[] = [
      {
        athlete: 'Marcus Johnson',
        sport: 'Football',
        position: 'Wide Receiver',
        garScore: 9.1,
        ranking: 15,
        strengths: ['Speed', 'Route Running', 'Hands'],
        improvements: ['Blocking', 'Physical Play']
      },
      {
        athlete: 'Tyler Williams',
        sport: 'Football', 
        position: 'Wide Receiver',
        garScore: 8.9,
        ranking: 22,
        strengths: ['Size', 'Contested Catches', 'Red Zone'],
        improvements: ['Speed', 'Separation']
      },
      {
        athlete: 'Devon Smith',
        sport: 'Football',
        position: 'Wide Receiver', 
        garScore: 8.7,
        ranking: 28,
        strengths: ['Agility', 'YAC', 'Slot Play'],
        improvements: ['Deep Ball', 'Consistency']
      }
    ];
    setCompetitors(mockCompetitors);
  };

  const getChangeIndicator = (current: number, previous: number, isLowerBetter = false) => {
    const improved = isLowerBetter ? current < previous : current > previous;
    const change = ((Math.abs(current - previous) / previous) * 100).toFixed(1);
    
    return {
      improved,
      change: parseFloat(change),
      icon: improved ? <ArrowUp className="w-4 h-4 text-green-400" /> : <ArrowDown className="w-4 h-4 text-red-400" />,
      color: improved ? 'text-green-400' : 'text-red-400'
    };
  };

  const getProgressToTarget = (current: number, target: number, previous: number) => {
    const totalProgress = Math.abs(target - previous);
    const currentProgress = Math.abs(current - previous);
    return Math.min((currentProgress / totalProgress) * 100, 100);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            Performance Analytics
          </h1>
          <p className="text-slate-300 text-lg">
            Advanced performance tracking and competitive analysis for elite athletic development
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6 justify-center">
          <div>
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
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="bg-slate-800 border-slate-700 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="season">This Season</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Training Load
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="competition" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Competition
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    Overall GAR Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">8.54</div>
                    <div className="text-sm text-slate-400 mb-3">Elite Level</div>
                    <Progress value={85.4} className="mb-2" />
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <ArrowUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">+0.3 this month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    Goals Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">Sprint Time</span>
                        <span className="text-blue-400">82%</span>
                      </div>
                      <Progress value={82} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">Strength</span>
                        <span className="text-yellow-400">67%</span>
                      </div>
                      <Progress value={67} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">Technique</span>
                        <span className="text-green-400">91%</span>
                      </div>
                      <Progress value={91} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-400" />
                    Training Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400 mb-2">Moderate</div>
                    <div className="text-sm text-slate-400 mb-3">Injury Risk</div>
                    <Alert className="bg-yellow-900/20 border-yellow-700 mb-3">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription className="text-yellow-400 text-xs">
                        Consider recovery day
                      </AlertDescription>
                    </Alert>
                    <div className="text-sm text-slate-400">Load Ratio: 1.25</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">#24</div>
                    <div className="text-sm text-slate-400 mb-3">National Position</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Region:</span>
                        <span className="text-purple-400">#8</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">State:</span>
                        <span className="text-purple-400">#3</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Performance Highlights */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Performance Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Alert className="bg-green-900/20 border-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <AlertDescription className="text-green-400">
                      <strong>New Personal Best!</strong><br />
                      40-yard dash: 4.42s (-0.06s improvement)
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="bg-blue-900/20 border-blue-700">
                    <Star className="w-4 h-4" />
                    <AlertDescription className="text-blue-400">
                      <strong>Skill Milestone</strong><br />
                      Route running technique reached 85%
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="bg-purple-900/20 border-purple-700">
                    <TrendingUp className="w-4 h-4" />
                    <AlertDescription className="text-purple-400">
                      <strong>Consistency Streak</strong><br />
                      14 days of performance gains
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {performanceData.map((metric) => {
                const isLowerBetter = metric.category === 'Speed' || metric.category === 'Agility';
                const change = getChangeIndicator(metric.value, metric.previous, isLowerBetter);
                const progress = getProgressToTarget(metric.value, metric.target, metric.previous);

                return (
                  <Card key={metric.id} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span>{metric.category}</span>
                        <Badge variant="outline" className="text-slate-300">
                          GAR: {metric.garScore}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-400 mb-1">
                            {metric.value} {metric.unit}
                          </div>
                          <div className="flex items-center justify-center gap-2 text-sm">
                            {change.icon}
                            <span className={change.color}>
                              {change.change}% change
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-300">Progress to Target</span>
                            <span className="text-blue-400">{progress.toFixed(0)}%</span>
                          </div>
                          <Progress value={progress} className="mb-2" />
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Previous: {metric.previous} {metric.unit}</span>
                            <span>Target: {metric.target} {metric.unit}</span>
                          </div>
                        </div>

                        <Button 
                          size="sm" 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          View Detailed Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Training Load Tab */}
          <TabsContent value="training" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Training Load Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingLoad.map((load, index) => (
                    <div key={index} className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">{load.week}</h4>
                        <Badge 
                          variant="outline" 
                          className={`${getRiskColor(load.injuryRisk)} border-current`}
                        >
                          {load.injuryRisk.toUpperCase()} RISK
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-sm text-slate-400">Acute Load</div>
                          <div className="text-lg font-semibold text-blue-400">{load.acute}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-slate-400">Chronic Load</div>
                          <div className="text-lg font-semibold text-green-400">{load.chronic}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-slate-400">AC Ratio</div>
                          <div className={`text-lg font-semibold ${getRiskColor(load.injuryRisk)}`}>
                            {load.ratio.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <Progress 
                        value={Math.min((load.ratio / 1.5) * 100, 100)} 
                        className="mb-2"
                      />
                      <div className="text-xs text-slate-400">
                        Optimal ratio: 0.8-1.3 | Current: {load.ratio.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-blue-900/20 border-blue-700">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-blue-400">
                <strong>Training Load Insights:</strong> Your acute load has increased significantly this week. 
                Consider implementing a recovery day to prevent overreaching and reduce injury risk.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillProgression.map((skill, index) => (
                <Card key={index} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>{skill.skill}</span>
                      <Badge 
                        className={getPriorityColor(skill.priority)}
                      >
                        {skill.priority.toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300">Current Level</span>
                        <span className="text-2xl font-bold text-blue-400">{skill.current}%</span>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-300">Progress to Target</span>
                          <span className="text-green-400">{skill.target}%</span>
                        </div>
                        <Progress value={skill.current} className="mb-2" />
                        <div className="text-xs text-slate-400">
                          Target improvement: +{skill.improvement}% in {skill.timeframe}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Practice
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Competition Tab */}
          <TabsContent value="competition" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Competitive Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitors.map((competitor, index) => (
                    <div key={index} className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-white">{competitor.athlete}</h4>
                          <p className="text-sm text-slate-400">{competitor.position}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-yellow-400">
                            GAR: {competitor.garScore}
                          </div>
                          <div className="text-sm text-slate-400">
                            Rank #{competitor.ranking}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-green-400 mb-2">Strengths</h5>
                          <div className="space-y-1">
                            {competitor.strengths.map((strength, i) => (
                              <Badge key={i} variant="outline" className="text-green-400 border-green-700 mr-2">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-red-400 mb-2">Areas to Improve</h5>
                          <div className="space-y-1">
                            {competitor.improvements.map((improvement, i) => (
                              <Badge key={i} variant="outline" className="text-red-400 border-red-700 mr-2">
                                {improvement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-purple-900/20 border-purple-700">
              <Target className="w-4 h-4" />
              <AlertDescription className="text-purple-400">
                <strong>Competitive Edge:</strong> Focus on route running and speed training to move ahead of 
                Marcus Johnson in rankings. Your blocking technique gives you an advantage over Tyler Williams.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}