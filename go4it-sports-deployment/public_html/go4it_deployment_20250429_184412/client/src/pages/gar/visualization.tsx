import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BarChart2, Upload, Info } from 'lucide-react';
import { Link, useLocation, useRoute } from 'wouter';
import { EnhancedGarVisualization } from '@/components/gar/enhanced-gar-visualization';

export function GarVisualizationPage() {
  const { toast } = useToast();
  const [, params] = useRoute<{ id?: string }>('/gar/visualization/:id');
  const [, setLocation] = useLocation();
  const userId = params?.id ? parseInt(params.id) : undefined;
  
  // Fetch user details (assuming we're viewing another user's data)
  const { data: userData, isLoading: userLoading, isError: userError } = useQuery({
    queryKey: userId ? ['/api/users', userId] : ['/api/auth/me'],
    enabled: true,
  });
  
  // Redirect to own profile if no ID is provided
  useEffect(() => {
    if (!userId && userData?.id) {
      setLocation(`/gar/visualization/${userData.id}`);
    }
  }, [userId, userData?.id]);
  
  if (userLoading) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (userError || !userData) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            We couldn't load the user profile. Please try again or contact support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 px-4 space-y-8">
      <Helmet>
        <title>Enhanced GAR Visualization | Go4It Sports</title>
      </Helmet>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => window.history.back()} className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-blue-500" />
            Enhanced Performance Analytics
          </h1>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/video-upload`}>
            <Button className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              Upload Performance
            </Button>
          </Link>
        </div>
      </div>
      
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full bg-cover bg-center" 
              style={{ backgroundImage: `url(${userData.profilePicture || '/assets/default-avatar.png'})` }}
            ></div>
            <div>
              <CardTitle>{userData.firstName} {userData.lastName}'s Performance Analysis</CardTitle>
              <CardDescription>Advanced visualization of athletic performance data</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="enhanced" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="enhanced">Enhanced Analytics</TabsTrigger>
              <TabsTrigger value="info">About GAR Scores</TabsTrigger>
            </TabsList>
            
            <TabsContent value="enhanced" className="pt-4">
              <EnhancedGarVisualization userId={userData.id} />
            </TabsContent>
            
            <TabsContent value="info" className="py-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold">GAR Score Explained</h3>
                    <p className="text-gray-400">
                      Go4It Sports Athletic Rating (GAR) is our proprietary system that analyzes various aspects of athletic 
                      performance to provide a comprehensive score of your abilities. This advanced visualization 
                      shows your progress over time and breaks down your performance by category.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="bg-blue-900/10 border-blue-800/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-blue-400">Physical Ability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Measures speed, agility, strength, endurance, and physical attributes specific to your sport.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-900/10 border-purple-800/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-purple-400">Mental Sharpness</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Evaluates decision-making, focus, game intelligence, and cognitive processing under pressure.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-900/10 border-green-800/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-green-400">Technical Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Analyzes sport-specific techniques, skills, and execution quality demonstrated in performance videos.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Alert className="mt-6 bg-blue-900/10 border-blue-800/30">
                  <AlertTitle className="text-blue-400">How to Improve Your GAR Score</AlertTitle>
                  <AlertDescription className="text-gray-300">
                    <ol className="list-decimal pl-5 space-y-1 mt-2">
                      <li>Upload more performance videos to get additional analyses</li>
                      <li>Focus on areas identified as needing improvement</li>
                      <li>Complete the recommended drills and exercises</li>
                      <li>Track your progress over time using the enhanced visualization tools</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default GarVisualizationPage;