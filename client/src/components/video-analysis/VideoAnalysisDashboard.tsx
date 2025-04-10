import React, { useState, useEffect } from 'react';
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

import { AlertCircle, Check, Award, Brain, ChevronRight, Activity, Dumbbell, Zap } from 'lucide-react';

type GARAttribute = {
  name: string;
  score: number;
  comments: string;
};

type GARCategory = {
  category: string;
  attributes: GARAttribute[];
  overallScore: number;
};

type GARScoreResult = {
  categories: GARCategory[];
  overallScore: number;
  improvementAreas: string[];
  strengths: string[];
  adhd: {
    focusScore: number;
    focusStrategies: string[];
    attentionInsights: string;
    learningPatterns: string;
  };
};

// Define the color mapping based on score ranges
const getScoreColor = (score: number): string => {
  if (score >= 8.5) return 'text-emerald-500';
  if (score >= 7) return 'text-green-500';
  if (score >= 5.5) return 'text-amber-500';
  if (score >= 4) return 'text-orange-500';
  return 'text-red-500';
};

// Get background color for progress bar
const getProgressColor = (score: number): string => {
  if (score >= 8.5) return 'bg-emerald-500';
  if (score >= 7) return 'bg-green-500';
  if (score >= 5.5) return 'bg-amber-500';
  if (score >= 4) return 'bg-orange-500';
  return 'bg-red-500';
};

// Get category icon based on category name
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'physical':
      return <Dumbbell className="w-5 h-5 mr-2" />;
    case 'psychological':
      return <Brain className="w-5 h-5 mr-2" />;
    case 'technical':
      return <Activity className="w-5 h-5 mr-2" />;
    default:
      return <Award className="w-5 h-5 mr-2" />;
  }
};

export function GARScorecard({ data }: { data: GARScoreResult }) {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl flex items-center">
            <Award className="w-6 h-6 mr-2 text-primary" />
            Overall GAR Score
          </CardTitle>
          <CardDescription>
            Growth and Ability Rating based on video analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div className="text-4xl font-bold flex items-baseline">
              <span className={getScoreColor(data.overallScore)}>
                {data.overallScore.toFixed(1)}
              </span>
              <span className="text-lg text-muted-foreground ml-1">/10</span>
            </div>
            <div className="flex space-x-2">
              {data.categories.map((category) => (
                <Badge key={category.category} variant="outline" className="flex items-center gap-1 py-1.5">
                  {getCategoryIcon(category.category)}
                  {category.category}: <span className={getScoreColor(category.overallScore)}>{category.overallScore.toFixed(1)}</span>
                </Badge>
              ))}
            </div>
          </div>
          <Progress value={data.overallScore * 10} className="h-2" indicatorClassName={getProgressColor(data.overallScore)} />
        </CardContent>
      </Card>

      <Tabs defaultValue="categories">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="categories">GAR Categories</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
          <TabsTrigger value="adhd">ADHD Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="pt-4">
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
                      <Badge variant="outline" className={`${getScoreColor(category.overallScore)} ml-auto`}>
                        {category.overallScore.toFixed(1)}/10
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {category.attributes.map((attr, attrIdx) => (
                      <div key={attrIdx} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{attr.name}</span>
                          <Badge variant="outline" className={getScoreColor(attr.score)}>
                            {attr.score.toFixed(1)}/10
                          </Badge>
                        </div>
                        <Progress value={attr.score * 10} className="h-1.5 mb-2" indicatorClassName={getProgressColor(attr.score)} />
                        <p className="text-sm text-muted-foreground">{attr.comments}</p>
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
                <Check className="w-5 h-5 mr-2" /> Key Strengths
              </CardTitle>
              <CardDescription>Areas where the athlete excels</CardDescription>
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
              <CardDescription>Focus points for development</CardDescription>
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

        <TabsContent value="adhd" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-cyan-500">
                <Zap className="w-5 h-5 mr-2" /> ADHD-Specific Insights
              </CardTitle>
              <CardDescription>Personalized analysis for neurodivergent athletes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Focus Score: <span className={getScoreColor(data.adhd.focusScore)}>{data.adhd.focusScore.toFixed(1)}/10</span></h3>
                <Progress value={data.adhd.focusScore * 10} className="h-2 mb-3" indicatorClassName={getProgressColor(data.adhd.focusScore)} />
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Focus Strategies:</h3>
                <ul className="space-y-2">
                  {data.adhd.focusStrategies.map((strategy, idx) => (
                    <li key={idx} className="flex items-start">
                      <ChevronRight className="w-5 h-5 mr-2 text-primary shrink-0 mt-0.5" />
                      <span>{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-1">Attention Insights:</h3>
                <p className="text-muted-foreground">{data.adhd.attentionInsights}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Learning Patterns:</h3>
                <p className="text-muted-foreground">{data.adhd.learningPatterns}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function VideoAnalysisDashboard() {
  const { videoId } = useParams();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['/api/videos', videoId, 'gar'],
    queryFn: async () => {
      const response = await fetch(`/api/videos/${videoId}/gar`);
      if (!response.ok) {
        throw new Error('Failed to fetch GAR scores');
      }
      return response.json();
    },
    retry: 1,
    enabled: !!videoId
  });
  
  const { data: videoData, isLoading: isVideoLoading } = useQuery({
    queryKey: ['/api/videos', videoId],
    queryFn: async () => {
      const response = await fetch(`/api/videos/${videoId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch video data');
      }
      return response.json();
    },
    retry: 1,
    enabled: !!videoId
  });
  
  const generateGARScores = async () => {
    if (!videoId || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const sportType = videoData?.sportType || 'basketball';
      
      const response = await fetch(`/api/videos/${videoId}/generate-gar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sportType })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate GAR scores');
      }
      
      const data = await response.json();
      toast({
        title: 'GAR Scores Generated',
        description: 'The analysis has been completed successfully.'
      });
      
      // Refetch scores
      refetch();
      
    } catch (error) {
      console.error('Error generating GAR scores:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'There was an error generating the GAR scores. Please try again.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading || isVideoLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Spinner size="lg" />
        <p className="text-muted-foreground mt-4">Loading analysis data...</p>
      </div>
    );
  }

  if (error || !videoId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="font-bold text-xl mb-2">Analysis Not Found</h3>
        <p className="text-muted-foreground mb-6">
          There is no GAR analysis available for this video yet.
        </p>
        <Button 
          onClick={generateGARScores} 
          disabled={isGenerating}
          className="flex items-center"
        >
          {isGenerating ? <Spinner className="mr-2" size="sm" /> : <Activity className="w-4 h-4 mr-2" />}
          {isGenerating ? 'Generating...' : 'Generate GAR Scores'}
        </Button>
      </div>
    );
  }

  if (!data?.garScores) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
        <h3 className="font-bold text-xl mb-2">No Analysis Data</h3>
        <p className="text-muted-foreground mb-6">
          This video doesn't have GAR scores yet. Generate them to see detailed performance analysis.
        </p>
        <Button 
          onClick={generateGARScores} 
          disabled={isGenerating}
          className="flex items-center"
        >
          {isGenerating ? <Spinner className="mr-2" size="sm" /> : <Activity className="w-4 h-4 mr-2" />}
          {isGenerating ? 'Generating...' : 'Generate GAR Scores'}
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Video Analysis Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive GAR scoring for {videoData?.title || 'your video'}
        </p>
      </div>

      <div className="grid gap-6">
        <GARScorecard data={data.garScores} />
        
        <div className="flex justify-end">
          <Button 
            onClick={generateGARScores} 
            disabled={isGenerating}
            variant="outline"
            className="flex items-center"
          >
            {isGenerating ? <Spinner className="mr-2" size="sm" /> : <Activity className="w-4 h-4 mr-2" />}
            {isGenerating ? 'Regenerating...' : 'Regenerate Analysis'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default VideoAnalysisDashboard;