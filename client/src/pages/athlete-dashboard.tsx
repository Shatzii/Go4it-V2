import React from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, BarChart2, Award, Video, Clock, TrendingUp, CalendarDays, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function AthleteDashboard() {
  const { user } = useAuth();

  const { data: athleteProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["/api/athlete/profile", user?.id],
    queryFn: () => fetch(`/api/athlete/profile/${user?.id}`).then(res => res.json()),
    enabled: !!user?.id,
  });

  const { data: garScores, isLoading: isLoadingGarScores } = useQuery({
    queryKey: ["/api/athlete/gar-scores", user?.id],
    queryFn: () => fetch(`/api/athlete/gar-scores/${user?.id}`).then(res => res.json()),
    enabled: !!user?.id,
  });

  const { data: recentActivities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ["/api/athlete/activities", user?.id],
    queryFn: () => fetch(`/api/athlete/activities/${user?.id}`).then(res => res.json()),
    enabled: !!user?.id,
  });

  const { data: upcomingEvents, isLoading: isLoadingEvents } = useQuery({
    queryKey: ["/api/athlete/events", user?.id],
    queryFn: () => fetch(`/api/athlete/events/${user?.id}`).then(res => res.json()),
    enabled: !!user?.id,
  });

  if (isLoadingProfile || isLoadingGarScores || isLoadingActivities || isLoadingEvents) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your dashboard...</span>
      </div>
    );
  }

  // Mock data for development - will be replaced with actual data
  const totalGarScore = garScores?.overallScore || 78;
  const categoryScores = garScores?.categoryScores || {
    physical: 82,
    technical: 75,
    mental: 77,
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with Profile Overview */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-shrink-0">
          <div className="relative">
            <img 
              src={user?.profileImage || "https://via.placeholder.com/150"} 
              alt="Profile" 
              className="rounded-full w-28 h-28 border-4 border-primary/20"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary text-white text-sm font-bold rounded-full w-12 h-12 flex items-center justify-center">
              {totalGarScore}
            </div>
          </div>
        </div>
        
        <div className="flex-grow">
          <h1 className="text-3xl font-bold">{user?.name || "Athlete"}</h1>
          <p className="text-muted-foreground">{athleteProfile?.position || "Position"} | {athleteProfile?.school || "School"}</p>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Award className="h-10 w-10 text-primary p-2" />
                  <div className="ml-2">
                    <p className="text-xs text-muted-foreground">Level</p>
                    <p className="text-lg font-bold">{athleteProfile?.level || "Rising Star"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Video className="h-10 w-10 text-primary p-2" />
                  <div className="ml-2">
                    <p className="text-xs text-muted-foreground">Videos</p>
                    <p className="text-lg font-bold">{athleteProfile?.videoCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="h-10 w-10 text-primary p-2" />
                  <div className="ml-2">
                    <p className="text-xs text-muted-foreground">Training Streak</p>
                    <p className="text-lg font-bold">{athleteProfile?.trainingStreak || 0} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gar">GAR Analysis</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GAR Score Card */}
            <Card>
              <CardHeader>
                <CardTitle>GAR Score</CardTitle>
                <CardDescription>Growth and Ability Rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall</span>
                    <span className="font-bold">{totalGarScore}/100</span>
                  </div>
                  <Progress value={totalGarScore} className="h-3" />
                  
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span>Physical</span>
                        <span className="font-bold">{categoryScores.physical}/100</span>
                      </div>
                      <Progress value={categoryScores.physical} className="h-2 bg-slate-200" indicatorClassName="bg-blue-500" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between">
                        <span>Technical</span>
                        <span className="font-bold">{categoryScores.technical}/100</span>
                      </div>
                      <Progress value={categoryScores.technical} className="h-2 bg-slate-200" indicatorClassName="bg-green-500" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between">
                        <span>Mental</span>
                        <span className="font-bold">{categoryScores.mental}/100</span>
                      </div>
                      <Progress value={categoryScores.mental} className="h-2 bg-slate-200" indicatorClassName="bg-purple-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/gar-analysis">View Full GAR Analysis</a>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Recent Activity Card */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest training and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(recentActivities || []).length > 0 ? (
                    recentActivities.slice(0, 4).map((activity: any, index: number) => (
                      <div key={index} className="flex items-start pb-3 border-b last:border-0">
                        <div className={`p-2 rounded-full mr-3 flex-shrink-0 ${
                          activity.type === 'video' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'training' ? 'bg-green-100 text-green-600' :
                          activity.type === 'achievement' ? 'bg-amber-100 text-amber-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {activity.type === 'video' ? <Video className="h-5 w-5" /> :
                           activity.type === 'training' ? <Activity className="h-5 w-5" /> :
                           activity.type === 'achievement' ? <Award className="h-5 w-5" /> :
                           <TrendingUp className="h-5 w-5" />
                          }
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No recent activities</p>
                      <Button variant="outline" className="mt-2">Start Training</Button>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">View All Activities</Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Upcoming Events Row */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Training sessions and combines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(upcomingEvents || []).length > 0 ? (
                  upcomingEvents.slice(0, 3).map((event: any, index: number) => (
                    <div key={index} className="flex items-start pb-3 border-b last:border-0">
                      <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0 text-center min-w-16">
                        <p className="text-xs font-medium text-primary">{event.month}</p>
                        <p className="text-xl font-bold text-primary">{event.day}</p>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                        <div className="flex items-center mt-1">
                          <CalendarDays className="h-4 w-4 text-muted-foreground mr-1" />
                          <p className="text-xs text-muted-foreground">{event.time}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Details</Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No upcoming events</p>
                    <Button variant="outline" className="mt-2">Find Events</Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">View All Events</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* GAR Analysis Tab */}
        <TabsContent value="gar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Full GAR Score breakdown component will go here */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>GAR Score Analysis</CardTitle>
                <CardDescription>Detailed breakdown of your Growth and Ability Rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20 text-muted-foreground">
                  <BarChart2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Detailed GAR analysis will be displayed here</p>
                  <p className="text-sm">Coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Video collection will go here */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Your Videos</CardTitle>
                <CardDescription>Performance videos and highlights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20 text-muted-foreground">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Your videos will be displayed here</p>
                  <Button className="mt-4">Upload New Video</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Training Tab */}
        <TabsContent value="training" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Training plan and skill tree will go here */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Training Plans</CardTitle>
                <CardDescription>Your personalized skill development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20 text-muted-foreground">
                  <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Your training plans will be displayed here</p>
                  <Button className="mt-4">Begin Training</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}