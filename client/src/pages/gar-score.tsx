import { useState } from 'react';
import { useAuth } from "@/contexts/auth-context";
import { GarVisualization } from '@/components/gar/gar-visualization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronUp, ChevronDown, Info, Clock, LineChart } from "lucide-react";

export default function GarScorePage() {
  const { user } = useAuth();
  const [showHelp, setShowHelp] = useState(false);
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <h1 className="text-2xl font-bold mb-4">GAR Score Dashboard</h1>
        <p className="text-gray-600 mb-6">Please log in to view your GAR score and performance data.</p>
        <Button>Log In</Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold mb-2">GAR Score Dashboard</h1>
          <p className="text-gray-400">
            Track your athletic performance with our proprietary rating system
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-2"
        >
          <Info className="h-4 w-4" />
          {showHelp ? "Hide" : "Show"} GAR Explanation
          {showHelp ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {showHelp && (
        <Card className="mb-8 bg-blue-900/20 border-blue-800">
          <CardHeader>
            <CardTitle>Understanding Your GAR Score</CardTitle>
            <CardDescription>
              The Go4It Sports Athletic Rating is our proprietary system for evaluating athletic performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The Go4It Sports Athletic Rating (GAR) is a dynamic scientifically backed multi-dimensional wholistic system that scores more than physical stats. Our system captures mental, emotional and learning traits to provide the most complete rating known to date.
            </p>
            <h3 className="font-semibold mb-2">How it works:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Upload performance videos for AI-powered analysis</li>
              <li>Get scored across physical, mental, and technical dimensions</li>
              <li>Receive personalized feedback on strengths and areas for improvement</li>
              <li>Track your progress over time with detailed visualizations</li>
              <li>Share your GAR Score with coaches and recruiters</li>
            </ul>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current" className="flex items-center justify-center gap-2">
            <LineChart className="h-4 w-4" />
            Current Performance
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            Performance History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="pt-6">
          <GarVisualization userId={user.id} />
        </TabsContent>
        
        <TabsContent value="history" className="pt-6">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <h3 className="text-xl font-semibold mb-4">Performance History Coming Soon</h3>
              <p className="text-gray-400 max-w-md mb-6">
                Track your progress over time with our comprehensive performance history visualization. Upload multiple videos to start building your performance timeline.
              </p>
              <Button>Upload Performance Video</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}