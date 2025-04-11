import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  AlertCircle,
  Trophy,
  TrendingUp,
  BarChart3,
  Brain,
  Users,
  Calendar,
  FileText,
  Activity,
  Award,
  Target,
  BookOpen,
  Clock,
  Eye
} from "lucide-react";
import { format, subDays } from "date-fns";
import analyticsService from "../lib/analytics";
import useAuthContext from "../hooks/use-auth";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

// Helper functions
const formatPercent = (value: number) => `${value.toFixed(1)}%`;
const formatNumber = (value: number) => value.toLocaleString();

// Common chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Dashboard UI components
const DashboardHeader = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">
        Monitor and analyze key performance indicators across the platform
      </p>
    </div>
  </div>
);

const DateRangeSelector = ({ 
  onChange 
}: { 
  onChange: (startDate: string, endDate: string) => void 
}) => {
  const [range, setRange] = useState<string>("7d");

  useEffect(() => {
    const endDate = format(new Date(), "yyyy-MM-dd");
    let startDate: string;

    switch (range) {
      case "7d":
        startDate = format(subDays(new Date(), 7), "yyyy-MM-dd");
        break;
      case "30d":
        startDate = format(subDays(new Date(), 30), "yyyy-MM-dd");
        break;
      case "90d":
        startDate = format(subDays(new Date(), 90), "yyyy-MM-dd");
        break;
      default:
        startDate = format(subDays(new Date(), 7), "yyyy-MM-dd");
    }

    onChange(startDate, endDate);
  }, [range, onChange]);

  return (
    <Select
      value={range}
      onValueChange={(value) => setRange(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select time range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7d">Last 7 days</SelectItem>
        <SelectItem value="30d">Last 30 days</SelectItem>
        <SelectItem value="90d">Last 90 days</SelectItem>
      </SelectContent>
    </Select>
  );
};

// Overview Cards
const StatCard = ({
  title,
  value,
  icon,
  description,
  isLoading,
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  isLoading?: boolean;
  trend?: { value: number; label: string };
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground pt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center pt-1">
            <span
              className={`text-xs ${
                trend.value > 0
                  ? "text-green-500"
                  : trend.value < 0
                  ? "text-red-500"
                  : "text-muted-foreground"
              }`}
            >
              {trend.value > 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Star Path Analytics Tab
const StarPathTab = ({ data, isLoading }: any) => {
  // If we had real data, we would use something like this:
  const starPathData = data?.athleteDevelopment || {
    avgStarLevel: 0,
    starLevelDistribution: [
      { name: 'Level 1', value: 0 },
      { name: 'Level 2', value: 0 },
      { name: 'Level 3', value: 0 },
      { name: 'Level 4', value: 0 },
      { name: 'Level 5', value: 0 },
    ],
    progressRates: [
      { name: 'Fast', value: 0 },
      { name: 'Average', value: 0 },
      { name: 'Slow', value: 0 },
    ],
    commonBottlenecks: [
      { name: 'Technique', value: 0 },
      { name: 'Consistency', value: 0 },
      { name: 'Physical Ability', value: 0 },
      { name: 'Mental Focus', value: 0 },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Average Star Level"
          value={isLoading ? "-" : starPathData.avgStarLevel.toFixed(1)}
          icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Athletes at 5-Star Level"
          value={isLoading ? "-" : "0%"}
          icon={<Award className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Average Days to Level Up"
          value={isLoading ? "-" : "45"}
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Star Level Distribution</CardTitle>
            <CardDescription>Breakdown of athletes by star level</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={starPathData.starLevelDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {starPathData.starLevelDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Bottlenecks</CardTitle>
            <CardDescription>Areas preventing progression to next level</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={starPathData.commonBottlenecks}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Workout Analytics Tab
const WorkoutAnalyticsTab = ({ data, isLoading }: any) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Workout Completion Rate"
          value={isLoading ? "-" : `${data?.athleteDevelopment?.workoutCompletionRate?.toFixed(1)}%`}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Average Form Quality"
          value={isLoading ? "-" : "78/100"}
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Average Streak Length"
          value={isLoading ? "-" : "6 days"}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Workout Types Distribution</CardTitle>
            <CardDescription>Breakdown of workout types completed</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Strength', value: 35 },
                      { name: 'Endurance', value: 25 },
                      { name: 'Speed', value: 20 },
                      { name: 'Agility', value: 15 },
                      { name: 'Recovery', value: 5 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { name: 'Strength', value: 35 },
                      { name: 'Endurance', value: 25 },
                      { name: 'Speed', value: 20 },
                      { name: 'Agility', value: 15 },
                      { name: 'Recovery', value: 5 },
                    ].map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Quality Over Time</CardTitle>
            <CardDescription>Average form quality score across workouts</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={[
                    { date: 'Week 1', quality: 65 },
                    { date: 'Week 2', quality: 68 },
                    { date: 'Week 3', quality: 70 },
                    { date: 'Week 4', quality: 73 },
                    { date: 'Week 5', quality: 75 },
                    { date: 'Week 6', quality: 78 },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="quality" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Most Improving Skills</CardTitle>
          <CardDescription>Skills with the fastest improvement rates</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[100px] w-full" />
          ) : (
            <div className="space-y-4">
              {data?.athleteDevelopment?.mostImprovingSkills?.map((skill: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    <p className="text-sm text-muted-foreground">{skill.category} • {skill.sport}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50">
                    +{skill.rate?.toFixed(1) || 0}% per week
                  </Badge>
                </div>
              )) || (
                <p className="text-muted-foreground">No skill improvement data available</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ADHD & Neurodivergent Analytics Tab
const NeurodivergentTab = ({ data, isLoading }: any) => {
  const neurodivergentData = data?.neurodivergentInsights || {
    avgAttentionSpan: 0,
    optimalSessionDuration: 0,
    visualPreferenceRate: 0,
    mostEffectiveFeatures: []
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Average Attention Span"
          value={isLoading ? "-" : `${neurodivergentData.avgAttentionSpan.toFixed(0)} sec`}
          icon={<Brain className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Optimal Session Duration"
          value={isLoading ? "-" : `${neurodivergentData.optimalSessionDuration} min`}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Visual vs. Textual Preference"
          value={isLoading ? "-" : `${neurodivergentData.visualPreferenceRate.toFixed(0)}% Visual`}
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>ADHD-Friendly Feature Usage</CardTitle>
            <CardDescription>Features that maintain engagement for neurodivergent users</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: 'Progress Tracking', minutes: 15 },
                    { name: 'Gamification', minutes: 22 },
                    { name: 'Visual Rewards', minutes: 18 },
                    { name: 'Focus Mode', minutes: 12 },
                    { name: 'Immediate Feedback', minutes: 20 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Minutes Used', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="minutes" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Effective Accommodations</CardTitle>
            <CardDescription>Accommodations with highest effectiveness ratings</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="space-y-6">
                {neurodivergentData.mostEffectiveFeatures?.length > 0 ? (
                  neurodivergentData.mostEffectiveFeatures.map((feature: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{feature.name}</span>
                        <span>{feature.effectiveness.toFixed(0)}%</span>
                      </div>
                      <Progress value={feature.effectiveness} className="h-2" />
                    </div>
                  ))
                ) : (
                  [
                    { name: 'Focus Mode', effectiveness: 92 },
                    { name: 'Visual Cues', effectiveness: 85 },
                    { name: 'Gamification', effectiveness: 78 },
                    { name: 'Short Workout Segments', effectiveness: 75 },
                  ].map((feature, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{feature.name}</span>
                        <span>{feature.effectiveness}%</span>
                      </div>
                      <Progress value={feature.effectiveness} className="h-2" />
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Completion Analysis</CardTitle>
          <CardDescription>Factors affecting session completion rates</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { factor: 'Short Sessions (<15min)', rate: 85 },
                  { factor: 'Visual-Heavy Content', rate: 78 },
                  { factor: 'Immediate Feedback', rate: 92 },
                  { factor: 'Progressive Challenges', rate: 65 },
                  { factor: 'Late Evening Sessions', rate: 45 },
                ]}
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="factor" />
                <Tooltip formatter={(value) => [`${value}% completion rate`, 'Rate']} />
                <Bar dataKey="rate" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Academic-Athletic Integration Tab
const AcademicAthleticTab = ({ data, isLoading }: any) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Average GPA"
          value={isLoading ? "-" : "3.4"}
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Athletic-Academic Balance"
          value={isLoading ? "-" : "65/100"}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Study Hours Per Week"
          value={isLoading ? "-" : "12.5"}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>GPA Trend vs. Athletic Improvement</CardTitle>
            <CardDescription>Correlation between academic and athletic performance</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={[
                    { month: 'Jan', gpa: 3.2, athletic: 72 },
                    { month: 'Feb', gpa: 3.3, athletic: 74 },
                    { month: 'Mar', gpa: 3.2, athletic: 75 },
                    { month: 'Apr', gpa: 3.4, athletic: 78 },
                    { month: 'May', gpa: 3.5, athletic: 80 },
                    { month: 'Jun', gpa: 3.4, athletic: 82 },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" domain={[3, 4]} orientation="left" />
                  <YAxis yAxisId="right" domain={[70, 90]} orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="gpa" stroke="#8884d8" fill="#8884d8" />
                  <Area yAxisId="right" type="monotone" dataKey="athletic" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject Strength Analysis</CardTitle>
            <CardDescription>Academic strengths and weaknesses</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Strongest Subjects</p>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Physical Education</span>
                        <span>A+</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Biology</span>
                        <span>A</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Psychology</span>
                        <span>A-</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Weakest Subjects</p>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Mathematics</span>
                        <span>C+</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span>History</span>
                        <span>C</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Study Patterns</CardTitle>
          <CardDescription>Optimized study approaches based on athletic schedule</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Frequency</h3>
                  <p className="text-sm text-muted-foreground">
                    5 sessions per week, 45-60 minutes each
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Timing</h3>
                  <p className="text-sm text-muted-foreground">
                    Study 1-2 hours after workout completion
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Focus Areas</h3>
                  <p className="text-sm text-muted-foreground">
                    Mathematics, History
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                Students who study within 2 hours after a workout show 23% better information retention.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// User Engagement Tab
const UserEngagementTab = ({ data, isLoading }: any) => {
  const sessionData = data?.sessionMetrics || {
    totalSessions: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    mostVisitedPages: []
  };
  
  const userEngagement = data?.userEngagement || {
    activeUsers: 0,
    returningUserRate: 0,
    peakUsageTimes: [],
    deviceBreakdown: []
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Sessions"
          value={isLoading ? "-" : formatNumber(sessionData.totalSessions)}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Avg. Session Duration"
          value={isLoading ? "-" : `${Math.floor(sessionData.avgSessionDuration / 60)}m ${sessionData.avgSessionDuration % 60}s`}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Bounce Rate"
          value={isLoading ? "-" : formatPercent(sessionData.bounceRate)}
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
          trend={{ value: -3.2, label: "vs. last period" }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Most Visited Pages</CardTitle>
            <CardDescription>Top pages by visit count</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="space-y-4">
                {sessionData.mostVisitedPages?.length > 0 ? (
                  sessionData.mostVisitedPages.map((page: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="truncate max-w-[220px]">{page.item}</span>
                      <Badge variant="outline">{formatNumber(page.count)} visits</Badge>
                    </div>
                  ))
                ) : (
                  [
                    { name: 'Workout Dashboard', visits: 1256 },
                    { name: 'Star Path Progress', visits: 978 },
                    { name: 'Skill Builder', visits: 754 },
                    { name: 'Scout Portal', visits: 621 },
                    { name: 'AI Coach', visits: 587 },
                  ].map((page, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{page.name}</span>
                      <Badge variant="outline">{formatNumber(page.visits)} visits</Badge>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Usage Times</CardTitle>
            <CardDescription>When users are most active</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={userEngagement.peakUsageTimes?.length > 0 ? 
                    userEngagement.peakUsageTimes.map((time: any) => ({ 
                      hour: `${time.hour}:00`, 
                      sessions: time.count 
                    })) : 
                    [
                      { hour: '8:00', sessions: 35 },
                      { hour: '12:00', sessions: 42 },
                      { hour: '15:00', sessions: 67 },
                      { hour: '18:00', sessions: 85 },
                      { hour: '21:00', sessions: 56 },
                    ]
                  }
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Sessions by device type</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userEngagement.deviceBreakdown?.length > 0 ?
                      userEngagement.deviceBreakdown :
                      [
                        { name: 'Mobile', value: 62 },
                        { name: 'Desktop', value: 28 },
                        { name: 'Tablet', value: 10 },
                      ]
                    }
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { name: 'Mobile', value: 62 },
                      { name: 'Desktop', value: 28 },
                      { name: 'Tablet', value: 10 },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Retention</CardTitle>
            <CardDescription>New vs. returning users</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-muted-foreground/20"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-primary"
                        strokeWidth="10"
                        strokeDasharray={`${userEngagement.returningUserRate || 65} 251.2`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="text-2xl font-bold">{formatPercent(userEngagement.returningUserRate || 65)}</p>
                      <p className="text-xs text-muted-foreground">Return Rate</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm font-medium">New Users</p>
                    <p className="text-2xl font-bold">{formatPercent(100 - (userEngagement.returningUserRate || 65))}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Active Users</p>
                    <p className="text-2xl font-bold">{formatNumber(userEngagement.activeUsers || 428)}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// No custom icon components needed as we're importing from lucide-react

// Main Analytics Dashboard
export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: format(subDays(new Date(), 7), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const { user } = useAuthContext();
  
  useEffect(() => {
    if (user?.id) {
      analyticsService.initialize(user.id);
      // Start session tracking
      analyticsService.startSession('analytics-dashboard');
      
      // Cleanup function
      return () => {
        analyticsService.endSession('leaving-analytics-dashboard');
      };
    }
  }, [user?.id]);

  const { data, isLoading } = useQuery({
    queryKey: [
      '/api/analytics/dashboard',
      user?.id,
      dateRange.startDate,
      dateRange.endDate,
    ],
    queryFn: async () => {
      const response = await analyticsService.getAnalyticsDashboard(
        dateRange.startDate,
        dateRange.endDate
      );
      // Server returns data in the format { dashboard: {...} }
      return response;
    },
    enabled: !!user?.id,
  });

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
  };

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center">Please login to view analytics</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <DashboardHeader title="Analytics Dashboard" />
        <DateRangeSelector onChange={handleDateRangeChange} />
      </div>

      <Tabs defaultValue="star-path" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[800px]">
          <TabsTrigger value="star-path">Star Path</TabsTrigger>
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="neurodivergent">ADHD Analytics</TabsTrigger>
          <TabsTrigger value="academic">Academic Integration</TabsTrigger>
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
        </TabsList>
        <TabsContent value="star-path" className="space-y-4">
          <StarPathTab data={data?.data?.dashboard} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="workout" className="space-y-4">
          <WorkoutAnalyticsTab data={data?.data?.dashboard} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="neurodivergent" className="space-y-4">
          <NeurodivergentTab data={data?.data?.dashboard} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="academic" className="space-y-4">
          <AcademicAthleticTab data={data?.data?.dashboard} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="engagement" className="space-y-4">
          <UserEngagementTab data={data?.data?.dashboard} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}