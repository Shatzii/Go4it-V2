import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";
import {
  TrendingUp,
  Calendar,
  Target,
  Clock,
  Brain,
  Zap,
  Award,
  ChevronUp,
  ChevronDown,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillAnalytics {
  skillId: string;
  skillName: string;
  currentLevel: number;
  weeklyProgress: { week: string; level: number; xp: number }[];
  timeSpent: { date: string; minutes: number }[];
  strengthAreas: string[];
  improvementAreas: string[];
  predictedMastery: string;
  learningVelocity: number;
  consistencyScore: number;
}

interface LearningInsights {
  totalXP: number;
  weeklyXPGain: number;
  averageSessionTime: number;
  skillsImproved: number;
  learningStreak: number;
  preferredLearningTime: string;
  mostEffectiveSkillType: string;
  weakestSkillCategory: string;
}

interface SkillProgressionAnalyticsProps {
  userProgress: any[];
  timeFrame: '7d' | '30d' | '90d' | '1y';
  onTimeFrameChange: (timeFrame: string) => void;
}

const skillCategories = {
  physical: '#ef4444',
  mental: '#3b82f6',
  technical: '#10b981',
  tactical: '#f59e0b'
};

export default function SkillProgressionAnalytics({
  userProgress,
  timeFrame,
  onTimeFrameChange
}: SkillProgressionAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState<'xp' | 'time' | 'level'>('xp');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Sample analytics data
  const skillAnalytics: SkillAnalytics[] = [
    {
      skillId: 'speed',
      skillName: 'Speed Development',
      currentLevel: 8,
      weeklyProgress: [
        { week: 'Week 1', level: 6, xp: 1800 },
        { week: 'Week 2', level: 6.5, xp: 1950 },
        { week: 'Week 3', level: 7, xp: 2100 },
        { week: 'Week 4', level: 7.5, xp: 2250 },
        { week: 'Week 5', level: 8, xp: 2400 }
      ],
      timeSpent: [
        { date: '2025-06-01', minutes: 45 },
        { date: '2025-06-02', minutes: 30 },
        { date: '2025-06-03', minutes: 60 },
        { date: '2025-06-04', minutes: 0 },
        { date: '2025-06-05', minutes: 40 },
        { date: '2025-06-06', minutes: 55 },
        { date: '2025-06-07', minutes: 35 }
      ],
      strengthAreas: ['Acceleration', 'Form'],
      improvementAreas: ['Top Speed', 'Endurance'],
      predictedMastery: '6 weeks',
      learningVelocity: 85,
      consistencyScore: 78
    },
    {
      skillId: 'accuracy',
      skillName: 'Precision Training',
      currentLevel: 12,
      weeklyProgress: [
        { week: 'Week 1', level: 10, xp: 3000 },
        { week: 'Week 2', level: 10.5, xp: 3150 },
        { week: 'Week 3', level: 11, xp: 3300 },
        { week: 'Week 4', level: 11.5, xp: 3450 },
        { week: 'Week 5', level: 12, xp: 3600 }
      ],
      timeSpent: [
        { date: '2025-06-01', minutes: 35 },
        { date: '2025-06-02', minutes: 40 },
        { date: '2025-06-03', minutes: 45 },
        { date: '2025-06-04', minutes: 30 },
        { date: '2025-06-05', minutes: 50 },
        { date: '2025-06-06', minutes: 25 },
        { date: '2025-06-07', minutes: 40 }
      ],
      strengthAreas: ['Targeting', 'Consistency'],
      improvementAreas: ['Under Pressure', 'Long Range'],
      predictedMastery: '3 weeks',
      learningVelocity: 92,
      consistencyScore: 88
    }
  ];

  const learningInsights: LearningInsights = {
    totalXP: 6000,
    weeklyXPGain: 450,
    averageSessionTime: 42,
    skillsImproved: 6,
    learningStreak: 12,
    preferredLearningTime: 'Evening',
    mostEffectiveSkillType: 'Practice Drills',
    weakestSkillCategory: 'Mental Skills'
  };

  // Radar chart data for skill comparison
  const radarData = [
    { skill: 'Speed', current: 8, target: 15, category: 'Physical' },
    { skill: 'Accuracy', current: 12, target: 15, category: 'Technical' },
    { skill: 'Decision', current: 6, target: 15, category: 'Mental' },
    { skill: 'Agility', current: 4, target: 15, category: 'Physical' },
    { skill: 'Endurance', current: 10, target: 15, category: 'Physical' },
    { skill: 'Vision', current: 3, target: 15, category: 'Mental' }
  ];

  // Learning pattern data
  const learningPatternData = [
    { time: '6 AM', sessions: 2, effectiveness: 65 },
    { time: '9 AM', sessions: 5, effectiveness: 78 },
    { time: '12 PM', sessions: 8, effectiveness: 72 },
    { time: '3 PM', sessions: 12, effectiveness: 85 },
    { time: '6 PM', sessions: 15, effectiveness: 92 },
    { time: '9 PM', sessions: 10, effectiveness: 76 }
  ];

  // XP gain distribution
  const xpDistribution = [
    { category: 'Physical', value: 2400, color: skillCategories.physical },
    { category: 'Mental', value: 1200, color: skillCategories.mental },
    { category: 'Technical', value: 1800, color: skillCategories.technical },
    { category: 'Tactical', value: 600, color: skillCategories.tactical }
  ];

  const renderProgressChart = () => {
    const data = skillAnalytics.find(s => s.skillId === 'speed')?.weeklyProgress || [];
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="week" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area
            type="monotone"
            dataKey={selectedMetric === 'xp' ? 'xp' : 'level'}
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.2}
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderRadarChart = () => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 15]}
            tick={{ fontSize: 10, fill: '#6b7280' }}
          />
          <Radar
            name="Current Level"
            dataKey="current"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Target Level"
            dataKey="target"
            stroke="#e5e7eb"
            fill="none"
            strokeWidth={1}
            strokeDasharray="5 5"
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  const renderLearningPatterns = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={learningPatternData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Bar dataKey="sessions" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="effectiveness" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderXPDistribution = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={xpDistribution}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {xpDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} XP`, 'Experience']}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <Card className="go4it-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white">
              Skill Progression Analytics
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setComparisonMode(!comparisonMode)}
                className={comparisonMode ? 'bg-blue-100 border-blue-300' : ''}
              >
                <Filter className="w-4 h-4 mr-2" />
                Compare Skills
              </Button>
              <select
                value={timeFrame}
                onChange={(e) => onTimeFrameChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key insights cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-6 h-6" />
            <div className="flex items-center gap-1">
              <ChevronUp className="w-4 h-4 text-green-300" />
              <span className="text-sm">+12%</span>
            </div>
          </div>
          <div className="text-2xl font-bold">{learningInsights.totalXP.toLocaleString()}</div>
          <div className="text-sm opacity-90">Total XP Earned</div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6" />
            <div className="flex items-center gap-1">
              <ChevronUp className="w-4 h-4 text-green-300" />
              <span className="text-sm">+8%</span>
            </div>
          </div>
          <div className="text-2xl font-bold">{learningInsights.skillsImproved}</div>
          <div className="text-sm opacity-90">Skills Improved</div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6" />
            <div className="flex items-center gap-1">
              <ChevronDown className="w-4 h-4 text-red-300" />
              <span className="text-sm">-3%</span>
            </div>
          </div>
          <div className="text-2xl font-bold">{learningInsights.averageSessionTime}m</div>
          <div className="text-sm opacity-90">Avg Session Time</div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-6 h-6" />
            <Badge variant="secondary" className="bg-white text-orange-600 text-xs">
              New Record!
            </Badge>
          </div>
          <div className="text-2xl font-bold">{learningInsights.learningStreak}</div>
          <div className="text-sm opacity-90">Day Streak</div>
        </motion.div>
      </div>

      {/* Main analytics tabs */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Progress
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Skills Map
              </TabsTrigger>
              <TabsTrigger value="patterns" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Learning Patterns
              </TabsTrigger>
              <TabsTrigger value="distribution" className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4" />
                XP Distribution
              </TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Metric:</span>
                  <div className="flex gap-1">
                    {['xp', 'time', 'level'].map((metric) => (
                      <Button
                        key={metric}
                        size="sm"
                        variant={selectedMetric === metric ? 'default' : 'outline'}
                        onClick={() => setSelectedMetric(metric as any)}
                        className="text-xs"
                      >
                        {metric.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
                {renderProgressChart()}
                
                {/* Individual skill progress cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {skillAnalytics.map((skill) => (
                    <motion.div
                      key={skill.skillId}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{skill.skillName}</h3>
                        <Badge variant="outline">Level {skill.currentLevel}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Learning Velocity</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded">
                              <div 
                                className="h-2 bg-green-500 rounded"
                                style={{ width: `${skill.learningVelocity}%` }}
                              />
                            </div>
                            <span className="font-medium">{skill.learningVelocity}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Consistency</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded">
                              <div 
                                className="h-2 bg-blue-500 rounded"
                                style={{ width: `${skill.consistencyScore}%` }}
                              />
                            </div>
                            <span className="font-medium">{skill.consistencyScore}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-xs text-gray-600 mb-1">Predicted Mastery</div>
                        <div className="font-medium text-green-600">{skill.predictedMastery}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="mt-6">
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Current vs Target Skills</h3>
                  <p className="text-sm text-gray-600">Compare your current skill levels with your targets</p>
                </div>
                {renderRadarChart()}
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {radarData.map((skill) => (
                    <div key={skill.skill} className="p-3 border rounded-lg text-center">
                      <div className="font-medium">{skill.skill}</div>
                      <div className="text-2xl font-bold text-blue-600">{skill.current}</div>
                      <div className="text-xs text-gray-500">of {skill.target}</div>
                      <Badge 
                        variant="outline" 
                        className="text-xs mt-1"
                        style={{ 
                          borderColor: skillCategories[skill.category.toLowerCase() as keyof typeof skillCategories],
                          color: skillCategories[skill.category.toLowerCase() as keyof typeof skillCategories]
                        }}
                      >
                        {skill.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="patterns" className="mt-6">
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Learning Time Effectiveness</h3>
                  <p className="text-sm text-gray-600">Session count vs effectiveness by time of day</p>
                </div>
                {renderLearningPatterns()}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm text-gray-600">Most Active Time</div>
                    <div className="font-semibold">{learningInsights.preferredLearningTime}</div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <div className="text-sm text-gray-600">Best Learning Type</div>
                    <div className="font-semibold">{learningInsights.mostEffectiveSkillType}</div>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg text-center">
                    <Brain className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <div className="text-sm text-gray-600">Focus Area</div>
                    <div className="font-semibold">{learningInsights.weakestSkillCategory}</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="distribution" className="mt-6">
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">XP Distribution by Category</h3>
                  <p className="text-sm text-gray-600">See how your experience is distributed across skill categories</p>
                </div>
                
                <div className="flex justify-center">
                  {renderXPDistribution()}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {xpDistribution.map((category) => (
                    <div key={category.category} className="text-center p-3 border rounded-lg">
                      <div 
                        className="w-4 h-4 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: category.color }}
                      />
                      <div className="font-medium">{category.category}</div>
                      <div className="text-xl font-bold" style={{ color: category.color }}>
                        {category.value.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">XP</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}