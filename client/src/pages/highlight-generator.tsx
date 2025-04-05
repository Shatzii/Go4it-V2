import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Loader2, Play, Pause, Scissors } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

export default function HighlightGenerator() {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [playerTab, setPlayerTab] = useState<string>('original');

  // Fetch video data
  const { data: video, isLoading: videoLoading, error: videoError } = useQuery({
    queryKey: ['/api/videos', parseInt(id)],
    queryFn: async () => await apiRequest(`/api/videos/${id}`),
    enabled: !!id,
  });

  // Fetch video highlights
  const { data: highlights, isLoading: highlightsLoading, error: highlightsError } = useQuery({
    queryKey: ['/api/videos', parseInt(id), 'highlights'],
    queryFn: async () => await apiRequest(`/api/videos/${id}/highlights`),
    enabled: !!id,
  });

  // Create highlight mutation
  const { mutate: createHighlight, isPending: isCreatingHighlight } = useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      startTime: number;
      endTime: number;
    }) => {
      return await apiRequest(`/api/videos/${id}/generate-highlight`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Highlight created',
        description: 'Your highlight has been successfully created.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/videos', parseInt(id), 'highlights'] });
      setPlayerTab('highlights');
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating highlight',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Handle video loaded metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
      setEndTime(videoDuration);
    }
  };

  // Handle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Set playback position when slider is adjusted
  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  // Handle range slider updates for highlight selection
  const handleRangeChange = (values: number[]) => {
    setStartTime(values[0]);
    setEndTime(values[1]);
  };

  // Generate highlight
  const handleGenerateHighlight = () => {
    if (!title) {
      toast({
        title: 'Title required',
        description: 'Please provide a title for your highlight.',
        variant: 'destructive',
      });
      return;
    }

    if (endTime <= startTime) {
      toast({
        title: 'Invalid time range',
        description: 'End time must be greater than start time.',
        variant: 'destructive',
      });
      return;
    }

    createHighlight({
      title,
      description,
      startTime,
      endTime,
    });
  };

  // Play selection
  const playSelection = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.play();
      setIsPlaying(true);

      // Create a timeout to pause at end time
      const timeoutId = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }, (endTime - startTime) * 1000);

      return () => clearTimeout(timeoutId);
    }
  };

  // If video is playing and current time exceeds end time, pause
  useEffect(() => {
    if (isPlaying && currentTime >= endTime) {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [currentTime, endTime, isPlaying]);

  if (videoLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (videoError) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-bold">Error loading video</h2>
        <p className="text-muted-foreground">Unable to load the video. Please try again later.</p>
        <Button onClick={() => navigate('/videos')} className="mt-4">Back to Videos</Button>
      </div>
    );
  }

  // Define a type for the data returned from the API
  type VideoData = {
    id: number;
    title: string;
    description: string | null;
    filePath: string;
    // Add other properties as needed
  };

  // Define a type for video highlights
  type VideoHighlight = {
    id: number;
    title: string;
    description: string | null;
    startTime: number;
    endTime: number;
    highlightPath: string;
    thumbnailPath: string | null;
    aiGenerated: boolean;
    // Add other properties as needed
  };

  // Cast the data to the appropriate types
  const videoData = video as VideoData | undefined;
  const highlightsData = highlights as VideoHighlight[] | undefined;

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Highlight Generator</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{videoData?.title || 'Video'}</CardTitle>
          <CardDescription>{videoData?.description || 'No description available'}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={playerTab} onValueChange={setPlayerTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="original">Original Video</TabsTrigger>
              <TabsTrigger value="highlights">Highlights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="original" className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoData?.filePath}
                  className="w-full h-full object-contain"
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <div className="flex-1 mx-4">
                  <Slider
                    value={[currentTime]}
                    min={0}
                    max={duration}
                    step={0.01}
                    onValueChange={handleSeek}
                  />
                </div>
                
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatDuration(currentTime)} / {formatDuration(duration)}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="text-md font-medium">Select Highlight Range</h3>
                
                <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                  <span>{formatDuration(startTime)}</span>
                  <span>{formatDuration(endTime)}</span>
                </div>
                
                <Slider
                  value={[startTime, endTime]}
                  min={0}
                  max={duration}
                  step={0.01}
                  onValueChange={handleRangeChange}
                />
                
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={playSelection}
                    disabled={startTime >= endTime}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Preview Selection
                  </Button>
                  
                  <div className="flex-1"></div>
                  
                  <div className="text-sm text-muted-foreground">
                    Duration: {formatDuration(endTime - startTime)}
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Highlight Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for your highlight"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a description"
                    rows={3}
                  />
                </div>
                
                <Button 
                  className="w-full"
                  onClick={handleGenerateHighlight}
                  disabled={isCreatingHighlight || !title || startTime >= endTime}
                >
                  {isCreatingHighlight ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Scissors className="mr-2 h-4 w-4" />
                      Generate Highlight
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="highlights">
              {highlightsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : highlightsData && highlightsData.length > 0 ? (
                <div className="space-y-4">
                  {highlightsData.map((highlight) => (
                    <Card key={highlight.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{highlight.title}</CardTitle>
                        {highlight.description && (
                          <CardDescription>{highlight.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video bg-muted rounded-md overflow-hidden">
                          <video
                            src={highlight.highlightPath}
                            className="w-full h-full object-contain"
                            controls
                            poster={highlight.thumbnailPath || undefined}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between text-sm text-muted-foreground">
                        <span>Duration: {formatDuration(highlight.endTime - highlight.startTime)}</span>
                        {highlight.aiGenerated && <span>AI Generated</span>}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <h3 className="text-lg font-medium mb-2">No highlights yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first highlight by selecting a portion of the video.
                  </p>
                  <Button onClick={() => setPlayerTab('original')}>
                    Create Highlight
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}