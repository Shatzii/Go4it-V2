import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CustomProgress } from "@/components/ui/custom-progress";
import { Loader2, Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface VideoAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: number | null;
}

export function VideoAnalysisDialog({ open, onOpenChange, videoId }: VideoAnalysisDialogProps) {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTab, setActiveTab] = useState("physical");
  
  // Fetch video details
  const { data: videoDetails, isLoading: isLoadingVideoDetails } = useQuery({
    queryKey: ["/api/athlete/video", videoId],
    queryFn: () => fetch(`/api/athlete/video/${videoId}`).then(res => res.json()),
    enabled: !!videoId && open,
  });
  
  // Fetch GAR scores for this video
  const { data: videoGarScores, isLoading: isLoadingGarScores } = useQuery({
    queryKey: ["/api/athlete/video-gar-scores", videoId],
    queryFn: () => fetch(`/api/athlete/video-gar-scores/${videoId}`).then(res => res.json()),
    enabled: !!videoId && open,
  });
  
  // Handle video playback
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    const videoElement = document.getElementById("analysis-video") as HTMLVideoElement;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    }
  };
  
  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };
  
  const handleVideoDurationChange = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    const videoElement = document.getElementById("analysis-video") as HTMLVideoElement;
    if (videoElement) {
      videoElement.currentTime = newTime;
    }
  };
  
  const skipForward = () => {
    const videoElement = document.getElementById("analysis-video") as HTMLVideoElement;
    if (videoElement) {
      videoElement.currentTime = Math.min(videoElement.currentTime + 10, videoElement.duration);
    }
  };
  
  const skipBackward = () => {
    const videoElement = document.getElementById("analysis-video") as HTMLVideoElement;
    if (videoElement) {
      videoElement.currentTime = Math.max(videoElement.currentTime - 10, 0);
    }
  };
  
  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Mock data for now
  const mockGarScores = {
    overall: 78,
    categories: {
      physical: {
        score: 82,
        subcategories: [
          { name: "Speed", score: 85, description: "Ability to move quickly on court/field" },
          { name: "Strength", score: 78, description: "Power in contact situations" },
          { name: "Endurance", score: 83, description: "Ability to maintain energy throughout play" },
        ]
      },
      technical: {
        score: 75,
        subcategories: [
          { name: "Ball Control", score: 79, description: "Ability to maintain possession" },
          { name: "Shooting/Striking", score: 68, description: "Accuracy and power when shooting" },
          { name: "Positioning", score: 78, description: "Movement and awareness on court/field" },
        ]
      },
      mental: {
        score: 77,
        subcategories: [
          { name: "Decision Making", score: 74, description: "Making the right choices under pressure" },
          { name: "Focus", score: 80, description: "Maintaining concentration throughout play" },
          { name: "Composure", score: 77, description: "Staying calm under pressure" },
        ]
      }
    },
    insights: [
      "Shows excellent acceleration off the mark, reaching top speed quickly",
      "Decision making slows when under defensive pressure",
      "Shooting form breaks down in late-game situations"
    ],
    keyMoments: [
      { time: 45, description: "Great defensive recovery showing speed", category: "physical" },
      { time: 127, description: "Excellent ball handling in traffic", category: "technical" },
      { time: 203, description: "Made key decision under pressure", category: "mental" }
    ]
  };
  
  // If loading, show loading state
  if (isLoadingVideoDetails || isLoadingGarScores) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2">Loading video analysis...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Video Analysis</DialogTitle>
          <DialogDescription>
            {videoDetails?.title || "Performance Analysis"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Video Player */}
          <div className="md:col-span-7">
            <div className="rounded-lg overflow-hidden bg-black">
              <video
                id="analysis-video"
                src={videoDetails?.videoUrl || ""}
                poster={videoDetails?.thumbnailUrl || ""}
                className="w-full aspect-video"
                onTimeUpdate={handleVideoTimeUpdate}
                onDurationChange={handleVideoDurationChange}
                onEnded={() => setIsPlaying(false)}
              />
            </div>
            
            <div className="mt-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <div className="flex space-x-2">
                  <button onClick={skipBackward} className="p-1 rounded-full hover:bg-secondary">
                    <SkipBack className="h-5 w-5" />
                  </button>
                  <button onClick={togglePlayPause} className="p-1 rounded-full hover:bg-secondary">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <button onClick={skipForward} className="p-1 rounded-full hover:bg-secondary">
                    <SkipForward className="h-5 w-5" />
                  </button>
                </div>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-medium">Key Moments</h3>
              <div className="space-y-2 mt-2">
                {mockGarScores.keyMoments.map((moment, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 rounded-md hover:bg-secondary cursor-pointer"
                    onClick={() => {
                      const videoElement = document.getElementById("analysis-video") as HTMLVideoElement;
                      if (videoElement) {
                        videoElement.currentTime = moment.time;
                        if (!isPlaying) togglePlayPause();
                      }
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    <div>
                      <p className="text-sm">{moment.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(moment.time)} • {moment.category.charAt(0).toUpperCase() + moment.category.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Analysis & Scores */}
          <div className="md:col-span-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>GAR Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold">{mockGarScores.overall}</div>
                  <p className="text-sm text-muted-foreground">Overall Rating</p>
                </div>
                
                <Tabs defaultValue="physical" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="physical">Physical</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="mental">Mental</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="physical" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Physical</h3>
                      <span className="font-bold">{mockGarScores.categories.physical.score}</span>
                    </div>
                    <CustomProgress 
                      value={mockGarScores.categories.physical.score} 
                      className="h-2" 
                      indicatorClassName="bg-blue-500"
                    />
                    
                    <div className="space-y-3 mt-4">
                      {mockGarScores.categories.physical.subcategories.map((sub, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between">
                            <p className="text-sm">{sub.name}</p>
                            <p className="text-sm font-medium">{sub.score}</p>
                          </div>
                          <CustomProgress 
                            value={sub.score} 
                            className="h-1.5 mt-1" 
                            indicatorClassName="bg-blue-500"
                          />
                          <p className="text-xs text-muted-foreground mt-1">{sub.description}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="technical" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Technical</h3>
                      <span className="font-bold">{mockGarScores.categories.technical.score}</span>
                    </div>
                    <CustomProgress 
                      value={mockGarScores.categories.technical.score} 
                      className="h-2" 
                      indicatorClassName="bg-green-500"
                    />
                    
                    <div className="space-y-3 mt-4">
                      {mockGarScores.categories.technical.subcategories.map((sub, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between">
                            <p className="text-sm">{sub.name}</p>
                            <p className="text-sm font-medium">{sub.score}</p>
                          </div>
                          <CustomProgress 
                            value={sub.score} 
                            className="h-1.5 mt-1" 
                            indicatorClassName="bg-green-500"
                          />
                          <p className="text-xs text-muted-foreground mt-1">{sub.description}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="mental" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Mental</h3>
                      <span className="font-bold">{mockGarScores.categories.mental.score}</span>
                    </div>
                    <CustomProgress 
                      value={mockGarScores.categories.mental.score} 
                      className="h-2" 
                      indicatorClassName="bg-purple-500"
                    />
                    
                    <div className="space-y-3 mt-4">
                      {mockGarScores.categories.mental.subcategories.map((sub, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between">
                            <p className="text-sm">{sub.name}</p>
                            <p className="text-sm font-medium">{sub.score}</p>
                          </div>
                          <CustomProgress 
                            value={sub.score} 
                            className="h-1.5 mt-1" 
                            indicatorClassName="bg-purple-500"
                          />
                          <p className="text-xs text-muted-foreground mt-1">{sub.description}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Performance Insights</h3>
                  <ul className="space-y-1">
                    {mockGarScores.insights.map((insight, index) => (
                      <li key={index} className="text-sm">• {insight}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}