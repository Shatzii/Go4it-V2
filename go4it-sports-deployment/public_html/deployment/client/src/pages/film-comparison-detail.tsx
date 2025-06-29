import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Loader2, 
  Share2,
  Edit,
  Trash2,
  Award
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "wouter";

export default function FilmComparisonDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("videos");
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  
  // Fetch comparison details
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/film-comparisons', id],
    enabled: !!id,
  });
  
  // Mutation for running analysis
  const runAnalysisMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/film-comparisons/${id}/analyze`);
      return res.data; // Axios response already contains data property
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/film-comparisons', id] });
      toast({
        title: "Analysis complete",
        description: "The video comparison analysis has been completed successfully.",
      });
      setActiveTab("analysis");
    },
    onError: (error) => {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze videos. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle video playback
  useEffect(() => {
    if (data?.videos && data.videos.length > 0 && videoRefs.current.length > 0) {
      const currentVideo = videoRefs.current[currentVideoIndex];
      
      if (currentVideo) {
        if (isPlaying) {
          currentVideo.play().catch(err => {
            console.error("Error playing video:", err);
            setIsPlaying(false);
          });
        } else {
          currentVideo.pause();
        }
      }
    }
  }, [currentVideoIndex, isPlaying, data?.videos]);
  
  // Handle video end
  const handleVideoEnd = () => {
    if (data?.videos && currentVideoIndex < data.videos.length - 1) {
      setCurrentVideoIndex(prevIndex => prevIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };
  
  // Handle playing next video
  const handleNextVideo = () => {
    if (data?.videos && currentVideoIndex < data.videos.length - 1) {
      setCurrentVideoIndex(prevIndex => prevIndex + 1);
    }
  };
  
  // Handle playing previous video
  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(prevIndex => prevIndex - 1);
    }
  };
  
  // Delete comparison mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/film-comparisons/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Comparison deleted",
        description: "The film comparison has been deleted successfully.",
      });
      window.location.href = "/film-comparison";
    },
    onError: (error) => {
      toast({
        title: "Deletion failed",
        description: error instanceof Error ? error.message : "Failed to delete comparison. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this comparison? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-center">Error Loading Comparison</h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
        <Button asChild>
          <Link href="/film-comparison">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Comparisons
          </Link>
        </Button>
      </div>
    );
  }
  
  const { comparison, videos = [], analysis } = data;
  
  return (
    <div className="container py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/film-comparison">
              <ArrowLeft className="w-4 h-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{comparison.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/film-comparison-edit/${id}`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Film Comparison</CardTitle>
              <CardDescription>
                {comparison.comparisonType.charAt(0).toUpperCase() + comparison.comparisonType.slice(1)} Comparison
                {comparison.tags && comparison.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {comparison.tags.map((tag: string, i: number) => (
                      <span 
                        key={i} 
                        className="px-2 py-1 text-xs bg-muted rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                {comparison.description || "No description provided"}
              </p>
              
              <Tabs defaultValue="videos" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
                  <TabsTrigger 
                    value="analysis" 
                    className="flex-1"
                    disabled={!analysis}
                  >
                    Analysis
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="videos" className="space-y-4">
                  {videos.length > 0 ? (
                    <>
                      <div className="relative overflow-hidden bg-black aspect-video rounded-md">
                        {videos.map((video, index) => (
                          <video 
                            key={video.id}
                            ref={el => videoRefs.current[index] = el}
                            src={video.filePath}
                            className={`absolute inset-0 w-full h-full ${index === currentVideoIndex ? 'opacity-100' : 'opacity-0'}`}
                            onEnded={handleVideoEnd}
                            controls={false}
                          />
                        ))}
                        
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={handlePrevVideo} disabled={currentVideoIndex === 0}>
                              <SkipBack className="w-5 h-5" />
                              <span className="sr-only">Previous</span>
                            </Button>
                            <Button 
                              variant="ghost"
                              size="icon" 
                              onClick={() => setIsPlaying(!isPlaying)}
                            >
                              {isPlaying ? (
                                <Pause className="w-6 h-6" />
                              ) : (
                                <Play className="w-6 h-6" />
                              )}
                              <span className="sr-only">
                                {isPlaying ? "Pause" : "Play"}
                              </span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={handleNextVideo}
                              disabled={currentVideoIndex === videos.length - 1}
                            >
                              <SkipForward className="w-5 h-5" />
                              <span className="sr-only">Next</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                        {videos.map((video, index) => (
                          <div 
                            key={video.id}
                            className={`relative overflow-hidden cursor-pointer aspect-video rounded-md ${
                              index === currentVideoIndex ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setCurrentVideoIndex(index)}
                          >
                            <video 
                              src={video.filePath}
                              className="object-cover w-full h-full"
                              preload="metadata"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <span className="text-xs font-medium text-white">
                                {video.title || `Video ${index + 1}`}
                              </span>
                            </div>
                            <div className="absolute bottom-0 left-0 px-2 py-1 text-xs text-white bg-black/60 rounded-tr-md">
                              {video.videoType === "reference" ? "Reference" : "Practice"}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {comparison.status !== "completed" && videos.length >= 2 && (
                        <div className="flex justify-center mt-6">
                          <Button 
                            onClick={() => runAnalysisMutation.mutate()}
                            disabled={runAnalysisMutation.isPending}
                          >
                            {runAnalysisMutation.isPending ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Award className="w-4 h-4 mr-2" />
                            )}
                            Analyze Comparison
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 border rounded-lg border-dashed">
                      <p className="mb-4 text-center text-muted-foreground">
                        No videos have been added to this comparison yet
                      </p>
                      <Button asChild>
                        <Link href={`/film-comparison-edit/${id}`}>
                          Add Videos
                        </Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="analysis">
                  {analysis ? (
                    <div className="space-y-6">
                      <div className="p-4 border rounded-lg">
                        <h3 className="mb-2 text-lg font-semibold">Analysis Findings</h3>
                        <p className="text-sm text-muted-foreground">{analysis.aiGeneratedNotes || analysis.findings}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="p-4 border rounded-lg">
                          <h3 className="mb-2 text-lg font-semibold">Similarity Score</h3>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${(analysis.similarityScore || analysis.techniqueSimilarity || 0) * 100}%` }}
                              ></div>
                            </div>
                            <span className="font-semibold">
                              {Math.round((analysis.similarityScore || analysis.techniqueSimilarity || 0) * 100)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h3 className="mb-2 text-lg font-semibold">Overall Score</h3>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${(analysis.overallScore || 0)}%` }}
                              ></div>
                            </div>
                            <span className="font-semibold">{analysis.overallScore || 0}/100</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="mb-2 text-lg font-semibold">Areas for Improvement</h3>
                        <ul className="pl-5 space-y-1 text-sm list-disc text-muted-foreground">
                          {(analysis.improvementAreas || analysis.recommendations || [])
                            .map((area: string, index: number) => (
                              <li key={index}>{area}</li>
                            ))}
                        </ul>
                      </div>
                      
                      {analysis.techniqueBreakdown && (
                        <div className="p-4 border rounded-lg">
                          <h3 className="mb-2 text-lg font-semibold">Technique Breakdown</h3>
                          <div className="space-y-2">
                            {Object.entries(analysis.techniqueBreakdown).map(([key, value]) => (
                              <div key={key} className="grid grid-cols-[1fr,auto] gap-2">
                                <div>
                                  <p className="font-medium">{key}</p>
                                </div>
                                <div className="text-right">
                                  <span 
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      typeof value === 'number' && value > 0.7 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                        : typeof value === 'number' && value > 0.4
                                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}
                                  >
                                    {typeof value === 'number' ? `${Math.round(value * 100)}%` : String(value)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 border rounded-lg border-dashed">
                      <p className="mb-4 text-center text-muted-foreground">
                        No analysis has been generated for this comparison yet
                      </p>
                      {videos.length >= 2 && (
                        <Button 
                          onClick={() => runAnalysisMutation.mutate()}
                          disabled={runAnalysisMutation.isPending}
                        >
                          {runAnalysisMutation.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Award className="w-4 h-4 mr-2" />
                          )}
                          Generate Analysis
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium">Status</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs ${
                  comparison.status === "completed" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                    : comparison.status === "shared"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                }`}>
                  {comparison.status.charAt(0).toUpperCase() + comparison.status.slice(1)}
                </span>
              </div>
              
              <div>
                <h3 className="mb-1 text-sm font-medium">Created</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(comparison.createdAt).toLocaleDateString()} at {new Date(comparison.createdAt).toLocaleTimeString()}
                </p>
              </div>
              
              {comparison.updatedAt && (
                <div>
                  <h3 className="mb-1 text-sm font-medium">Last Updated</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(comparison.updatedAt).toLocaleDateString()} at {new Date(comparison.updatedAt).toLocaleTimeString()}
                  </p>
                </div>
              )}
              
              {comparison.tags && comparison.tags.length > 0 && (
                <div>
                  <h3 className="mb-1 text-sm font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {comparison.tags.map((tag: string, i: number) => (
                      <span 
                        key={i} 
                        className="px-2 py-1 text-xs bg-muted rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div>
                <h3 className="mb-2 text-sm font-medium">Video Summary</h3>
                <div className="space-y-2">
                  {videos.map((video) => (
                    <div key={video.id} className="flex gap-3">
                      <div 
                        className="relative flex-shrink-0 overflow-hidden w-14 h-10 rounded-md bg-muted"
                        onClick={() => {
                          const index = videos.findIndex(v => v.id === video.id);
                          if (index !== -1) setCurrentVideoIndex(index);
                        }}
                      >
                        <video 
                          src={video.filePath}
                          className="object-cover w-full h-full"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{video.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded-sm ${
                            video.videoType === "reference" 
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" 
                              : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          }`}>
                            {video.videoType}
                          </span>
                          {video.athleteName && <span>{video.athleteName}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {videos.length === 0 && (
                    <p className="text-sm text-muted-foreground">No videos added yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}