import React from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Trophy, FileBarChart2, Video, MessageSquare } from "lucide-react";
import AthleteProfileCard from '../components/AthleteProfileCard';
import AthleteStats from '../components/AthleteStats';

export default function AthleteProfile() {
  // Get athlete ID from URL
  const [match, params] = useRoute('/athletes/:id');
  const athleteId = match ? parseInt(params.id) : 0;

  // Fetch athlete data
  const { data: athlete, isLoading } = useQuery({
    queryKey: [`/api/athletes/${athleteId}`],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/athletes/${athleteId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch athlete');
        }
        return response.json();
      } catch (err) {
        console.error("Error fetching athlete:", err);
        return null;
      }
    },
    enabled: !!athleteId
  });

  if (!match || athleteId === 0) {
    return (
      <div className="container max-w-screen-xl mx-auto p-4 md:p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Athlete Not Found</h1>
        <p className="mb-4">The athlete profile you're looking for doesn't exist.</p>
        <Button onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-screen-xl mx-auto p-4 md:p-6 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded max-w-md mx-auto mt-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto p-4 md:p-6">
      <Button variant="ghost" className="mb-6" onClick={() => window.history.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Athletes
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with profile card */}
        <div className="md:col-span-1">
          <AthleteProfileCard athleteId={athleteId} />
        </div>

        {/* Main content area */}
        <div className="md:col-span-3">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <FileBarChart2 className="h-4 w-4" />
                Stats
              </TabsTrigger>
              <TabsTrigger value="highlights" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Highlights
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Coach Feedback
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats" className="mt-6">
              <AthleteStats athleteId={athleteId} />
            </TabsContent>
            
            <TabsContent value="highlights" className="mt-6">
              <div className="text-center py-12 border rounded-md">
                <h3 className="text-xl font-semibold mb-2">Highlight Videos</h3>
                <p className="text-muted-foreground mb-4">
                  This athlete doesn't have any highlight videos yet.
                </p>
                <Button>Upload Highlight Video</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-6">
              <div className="text-center py-12 border rounded-md">
                <h3 className="text-xl font-semibold mb-2">Achievements</h3>
                <p className="text-muted-foreground mb-4">
                  No achievements recorded yet for this athlete.
                </p>
                <Button>Add Achievement</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="feedback" className="mt-6">
              <div className="text-center py-12 border rounded-md">
                <h3 className="text-xl font-semibold mb-2">Coach Feedback</h3>
                <p className="text-muted-foreground mb-4">
                  No feedback has been provided for this athlete yet.
                </p>
                <Button>Add Feedback</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}