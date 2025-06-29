import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { AlertCircle, Check, Award, Brain, ChevronRight, BookOpen, Puzzle, Zap, Star, TrendingUp, Lightbulb } from 'lucide-react';

// Types for Academic Progress Data
type SubjectScore = {
  name: string;
  score: number; // GPA for the subject (0-4.0 scale)
  grade: string; // Letter grade
  comments: string;
  strengths: string[];
  improvements: string[];
};

type AcademicTimeframe = {
  label: string; // e.g., "Q1", "Q2", "Semester 1", etc.
  gpa: number;
  subjects: Record<string, number>; // Subject name to GPA mapping for the chart
};

type AcademicCategory = {
  category: string; // "Core", "Electives", "AP/Honors"
  subjects: SubjectScore[];
  overallGPA: number;
};

type ADHDInsights = {
  learningStyle: string;
  focusScore: number;
  focusStrategies: string[];
  organizationTips: string[];
  studyEnvironmentSuggestions: string[];
  recommendedTools: string[];
};

type AcademicProgressData = {
  categories: AcademicCategory[];
  overallGPA: number;
  historicalData: AcademicTimeframe[];
  strengths: string[];
  improvementAreas: string[];
  adhd: ADHDInsights;
  ncaaEligibilityStatus: {
    eligible: boolean;
    coreCoursesCompleted: number;
    coreCoursesRequired: number;
    minimumGPAMet: boolean;
    notes: string;
  };
};

// Helper functions
const getGradeColor = (gpa: number): string => {
  if (gpa >= 3.7) return 'text-emerald-500';
  if (gpa >= 3.0) return 'text-green-500';
  if (gpa >= 2.0) return 'text-amber-500';
  if (gpa >= 1.0) return 'text-orange-500';
  return 'text-red-500';
};

const getProgressColor = (gpa: number): string => {
  if (gpa >= 3.7) return 'bg-emerald-500';
  if (gpa >= 3.0) return 'bg-green-500';
  if (gpa >= 2.0) return 'bg-amber-500';
  if (gpa >= 1.0) return 'bg-orange-500';
  return 'bg-red-500';
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'core':
      return <BookOpen className="w-5 h-5 mr-2" />;
    case 'electives':
      return <Puzzle className="w-5 h-5 mr-2" />;
    case 'ap/honors':
      return <Star className="w-5 h-5 mr-2" />;
    default:
      return <Award className="w-5 h-5 mr-2" />;
  }
};

const getLetterGrade = (gpa: number): string => {
  if (gpa >= 4.0) return 'A+';
  if (gpa >= 3.7) return 'A';
  if (gpa >= 3.3) return 'A-';
  if (gpa >= 3.0) return 'B+';
  if (gpa >= 2.7) return 'B';
  if (gpa >= 2.3) return 'B-';
  if (gpa >= 2.0) return 'C+';
  if (gpa >= 1.7) return 'C';
  if (gpa >= 1.3) return 'C-';
  if (gpa >= 1.0) return 'D+';
  if (gpa >= 0.7) return 'D';
  return 'F';
};

export function AcademicProgressScorecard({ data }: { data: AcademicProgressData }) {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl flex items-center">
            <Award className="w-6 h-6 mr-2 text-primary" />
            Academic Progress
          </CardTitle>
          <CardDescription>
            Academic performance tracking with NCAA eligibility insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div className="text-4xl font-bold flex items-baseline">
              <span className={getGradeColor(data.overallGPA)}>
                {data.overallGPA.toFixed(1)}
              </span>
              <span className="text-lg text-muted-foreground ml-1">GPA</span>
              <span className={`ml-2 text-2xl ${getGradeColor(data.overallGPA)}`}>
                {getLetterGrade(data.overallGPA)}
              </span>
            </div>
            <div className="flex space-x-2">
              {data.categories.map((category) => (
                <Badge key={category.category} variant="outline" className="flex items-center gap-1 py-1.5">
                  {getCategoryIcon(category.category)}
                  {category.category}: <span className={getGradeColor(category.overallGPA)}>{category.overallGPA.toFixed(1)}</span>
                </Badge>
              ))}
            </div>
          </div>
          <Progress 
            value={data.overallGPA * 25} // Convert 4.0 scale to percentage (4.0 = 100%)
            className="h-2" 
            indicatorClassName={getProgressColor(data.overallGPA)} 
          />
          
          {/* NCAA Eligibility Status */}
          <div className="mt-4 p-3 rounded-md bg-background/50 border">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Star className={`w-5 h-5 mr-2 ${data.ncaaEligibilityStatus.eligible ? 'text-green-500' : 'text-amber-500'}`} />
                <span className="font-medium">NCAA Eligibility Status:</span>
              </div>
              <Badge 
                variant={data.ncaaEligibilityStatus.eligible ? "default" : "outline"}
                className={data.ncaaEligibilityStatus.eligible ? "bg-green-500/90" : "text-amber-500 border-amber-500"}
              >
                {data.ncaaEligibilityStatus.eligible ? "Eligible" : "In Progress"}
              </Badge>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Core Courses:</span>{' '}
                <span className="font-medium">
                  {data.ncaaEligibilityStatus.coreCoursesCompleted}/{data.ncaaEligibilityStatus.coreCoursesRequired}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Min GPA:</span>{' '}
                <span className={`font-medium ${data.ncaaEligibilityStatus.minimumGPAMet ? 'text-green-500' : 'text-amber-500'}`}>
                  {data.ncaaEligibilityStatus.minimumGPAMet ? 'Met' : 'In Progress'}
                </span>
              </div>
            </div>
            {data.ncaaEligibilityStatus.notes && (
              <p className="text-sm text-muted-foreground mt-2">
                {data.ncaaEligibilityStatus.notes}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="subjects">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="adhd">ADHD Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="pt-4">
          <Accordion type="single" collapsible className="w-full">
            {data.categories.map((category, idx) => (
              <AccordionItem key={idx} value={category.category}>
                <AccordionTrigger className="py-4">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center">
                      {getCategoryIcon(category.category)}
                      <span>{category.category}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className={`${getGradeColor(category.overallGPA)} ml-auto`}>
                        {category.overallGPA.toFixed(1)} / {getLetterGrade(category.overallGPA)}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {category.subjects.map((subject, subjectIdx) => (
                      <div key={subjectIdx} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{subject.name}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getGradeColor(subject.score)}>
                              {subject.score.toFixed(1)}
                            </Badge>
                            <Badge className={getProgressColor(subject.score)}>
                              {subject.grade}
                            </Badge>
                          </div>
                        </div>
                        <Progress 
                          value={subject.score * 25} 
                          className="h-1.5 mb-2" 
                          indicatorClassName={getProgressColor(subject.score)} 
                        />
                        <p className="text-sm text-muted-foreground mb-2">{subject.comments}</p>
                        
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div>
                            <h4 className="text-xs uppercase text-muted-foreground mb-1">Strengths</h4>
                            <ul className="text-xs space-y-1">
                              {subject.strengths.map((strength, i) => (
                                <li key={i} className="flex items-start">
                                  <Check className="w-3 h-3 text-green-500 mr-1 shrink-0 mt-0.5" />
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs uppercase text-muted-foreground mb-1">Improvements</h4>
                            <ul className="text-xs space-y-1">
                              {subject.improvements.map((improvement, i) => (
                                <li key={i} className="flex items-start">
                                  <ChevronRight className="w-3 h-3 text-amber-500 mr-1 shrink-0 mt-0.5" />
                                  <span>{improvement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="strengths" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-500">
                <Check className="w-5 h-5 mr-2" /> Academic Strengths
              </CardTitle>
              <CardDescription>Areas where the student excels academically</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start">
                    <ChevronRight className="w-5 h-5 mr-2 text-primary shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvements" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-amber-500">
                <AlertCircle className="w-5 h-5 mr-2" /> Areas for Improvement
              </CardTitle>
              <CardDescription>Focus points for academic development</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.improvementAreas.map((area, idx) => (
                  <li key={idx} className="flex items-start">
                    <ChevronRight className="w-5 h-5 mr-2 text-primary shrink-0 mt-0.5" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-500">
                <TrendingUp className="w-5 h-5 mr-2" /> Academic Performance Trends
              </CardTitle>
              <CardDescription>GPA progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.historicalData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis domain={[0, 4]} />
                    <Tooltip 
                      formatter={(value: number) => [value.toFixed(2), 'GPA']}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="gpa"
                      name="Overall GPA"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                    {Object.keys(data.historicalData[0]?.subjects || {}).map((subject, index) => (
                      <Line
                        key={subject}
                        type="monotone"
                        dataKey={`subjects.${subject}`}
                        name={subject}
                        stroke={[
                          '#82ca9d', '#ffc658', '#ff8042', '#0088fe', 
                          '#00C49F', '#FFBB28', '#FF8042', '#8884d8'
                        ][index % 8]}
                        strokeWidth={1.5}
                        dot={{ r: 3 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adhd" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-cyan-500">
                <Zap className="w-5 h-5 mr-2" /> ADHD-Specific Learning Insights
              </CardTitle>
              <CardDescription>Personalized academic strategies for neurodivergent students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Focus Score: <span className={getGradeColor(data.adhd.focusScore)}>{data.adhd.focusScore.toFixed(1)}/4.0</span></h3>
                <Progress value={data.adhd.focusScore * 25} className="h-2 mb-3" indicatorClassName={getProgressColor(data.adhd.focusScore)} />
              </div>
              
              <div>
                <h3 className="font-medium mb-1 flex items-center"><Brain className="w-4 h-4 mr-2" /> Learning Style:</h3>
                <p className="text-muted-foreground">{data.adhd.learningStyle}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-1 flex items-center"><Zap className="w-4 h-4 mr-2" /> Focus Strategies:</h3>
                <ul className="space-y-2">
                  {data.adhd.focusStrategies.map((strategy, idx) => (
                    <li key={idx} className="flex items-start">
                      <ChevronRight className="w-5 h-5 mr-2 text-primary shrink-0 mt-0.5" />
                      <span>{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1 flex items-center"><BookOpen className="w-4 h-4 mr-2" /> Organization Tips:</h3>
                <ul className="space-y-2">
                  {data.adhd.organizationTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <ChevronRight className="w-5 h-5 mr-2 text-primary shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-1 flex items-center"><Lightbulb className="w-4 h-4 mr-2" /> Recommended Tools:</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {data.adhd.recommendedTools.map((tool, idx) => (
                    <Badge key={idx} variant="outline" className="py-1 px-3">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function AcademicProgressDashboard() {
  const { studentId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch academic data
  const { 
    data, 
    isLoading: isDataLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['/api/academics', studentId],
    queryFn: async () => {
      const response = await fetch(`/api/academics/${studentId || 'current'}`);
      if (!response.ok) {
        throw new Error('Failed to fetch academic data');
      }
      return response.json();
    },
    retry: 1,
    enabled: true,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  // Generate academic progress report
  const generateAcademicReport = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/academics/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentId: studentId || 'current' })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate academic report');
      }
      
      toast({
        title: 'Academic Report Generated',
        description: 'The academic progress report has been updated with the latest data.'
      });
      
      // Refetch data
      refetch();
      
    } catch (error) {
      console.error('Error generating academic report:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'There was an error generating the academic report. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Spinner size="lg" />
        <p className="text-muted-foreground mt-4">Loading academic data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="font-bold text-xl mb-2">Data Not Available</h3>
        <p className="text-muted-foreground mb-6">
          There was an error loading the academic progress data.
        </p>
        <Button 
          onClick={() => refetch()}
          className="flex items-center"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
        <h3 className="font-bold text-xl mb-2">No Academic Data</h3>
        <p className="text-muted-foreground mb-6">
          This student doesn't have academic records yet. Generate a report to see detailed performance analysis.
        </p>
        <Button 
          onClick={generateAcademicReport}
          disabled={isLoading}
          className="flex items-center"
        >
          {isLoading ? <Spinner className="mr-2" size="sm" /> : <BookOpen className="w-4 h-4 mr-2" />}
          {isLoading ? 'Generating...' : 'Generate Academic Report'}
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Academic Progress Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive academic performance tracking with NCAA eligibility insights
        </p>
      </div>

      <div className="grid gap-6">
        <AcademicProgressScorecard data={data} />
        
        <div className="flex justify-end">
          <Button 
            onClick={generateAcademicReport}
            disabled={isLoading}
            variant="outline"
            className="flex items-center"
          >
            {isLoading ? <Spinner className="mr-2" size="sm" /> : <BookOpen className="w-4 h-4 mr-2" />}
            {isLoading ? 'Refreshing Data...' : 'Refresh Academic Data'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AcademicProgressDashboard;