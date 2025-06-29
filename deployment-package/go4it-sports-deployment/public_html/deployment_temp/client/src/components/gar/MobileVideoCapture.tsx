import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  Camera, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Video, 
  Loader2,
  AlertTriangle,
  UploadCloud,
  ChevronDown,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CustomProgress } from "@/components/ui/custom-progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MobileVideoCaptureProps {
  onClose: () => void;
  onCaptureComplete: (videoId: number) => void;
  sportType?: string;
}

export function MobileVideoCapture({ onClose, onCaptureComplete, sportType = "basketball" }: MobileVideoCaptureProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("environment");
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [selectedSport, setSelectedSport] = useState(sportType);
  const [showGuide, setShowGuide] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [stage, setStage] = useState<"setup" | "recording" | "review" | "upload" | "analysis" | "complete" | "error">("setup");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [quickCapture, setQuickCapture] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(true);
  
  // Timer formatting
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Initialize camera
  const initializeCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        audio: true,
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraPermissionDenied(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraPermissionDenied(true);
      toast({
        title: "Camera Access Error",
        description: "Please allow camera access to record your performance.",
        variant: "destructive",
      });
    }
  };
  
  // Toggle camera facing mode
  const toggleCamera = () => {
    setCameraFacing(prev => prev === "user" ? "environment" : "user");
  };
  
  // Start recording
  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    
    try {
      const options = { mimeType: "video/webm;codecs=vp9,opus" };
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordedVideo(blob);
        setStage("review");
      };
      
      mediaRecorderRef.current.start(1000); // Collect data every second for more granular control
      setIsRecording(true);
      setStage("recording");
      
      // Start timer
      const interval = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
      
      setTimerInterval(interval);
    } catch (err) {
      console.error("Error starting recording:", err);
      toast({
        title: "Recording Error",
        description: "Could not start recording. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        
        // Resume timer
        const interval = setInterval(() => {
          setRecordingTime(prevTime => prevTime + 1);
        }, 1000);
        
        setTimerInterval(interval);
      } else {
        mediaRecorderRef.current.pause();
        
        // Pause timer
        if (timerInterval) {
          clearInterval(timerInterval);
          setTimerInterval(null);
        }
      }
      
      setIsPaused(!isPaused);
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      // Stop timer
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  // Discard recording and restart
  const discardRecording = () => {
    setRecordedVideo(null);
    setRecordingTime(0);
    setStage("setup");
    initializeCamera();
  };
  
  // Move to upload stage
  const moveToUpload = () => {
    if (!recordedVideo) {
      toast({
        title: "No Video",
        description: "No recorded video found. Please record a video first.",
        variant: "destructive",
      });
      return;
    }
    
    // If quick capture, generate a title
    if (quickCapture && !videoTitle) {
      const date = new Date();
      const formattedDate = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
      setVideoTitle(`${selectedSport} Performance - ${formattedDate}`);
    }
    
    setStage("upload");
  };
  
  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // Simulate upload progress
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }
          setUploadProgress(progress);
        }, 400);
      };
      simulateProgress();
      
      const response = await apiRequest("POST", "/api/athlete/upload-video", formData, {
        headers: {
          // Don't set Content-Type, let the browser set it with the boundary
        },
      });
      
      return response.data;
    },
    onSuccess: (data) => {
      // Begin GAR analysis
      setStage("analysis");
      analyzeVideoMutation.mutate(data.videoId);
    },
    onError: (error: Error) => {
      setStage("error");
      setErrorMessage(error.message || "Failed to upload video");
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video",
        variant: "destructive",
      });
    },
  });
  
  // GAR analysis mutation
  const analyzeVideoMutation = useMutation({
    mutationFn: async (videoId: number) => {
      // Simulate analysis progress
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 10;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }
          setAnalysisProgress(progress);
        }, 500);
      };
      simulateProgress();
      
      const response = await apiRequest("POST", "/api/athlete/generate-gar-score", { videoId });
      return { ...response.data, videoId };
    },
    onSuccess: (data) => {
      setStage("complete");
      // Invalidate queries to refresh GAR data
      queryClient.invalidateQueries({ queryKey: ["/api/athlete/gar-scores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/athlete/gar-history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/athlete/videos"] });
      
      toast({
        title: "Analysis complete",
        description: "Your video has been analyzed and GAR scores updated",
      });
      
      onCaptureComplete(data.videoId);
    },
    onError: (error: Error) => {
      setStage("error");
      setErrorMessage(error.message || "Failed to analyze video");
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze video",
        variant: "destructive",
      });
    },
  });
  
  // Handle video upload
  const handleUpload = () => {
    if (!recordedVideo) {
      toast({
        title: "No Video",
        description: "No recorded video found. Please record a video first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!videoTitle.trim() && !quickCapture) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your video.",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("video", recordedVideo, "performance.webm");
    formData.append("title", videoTitle);
    formData.append("description", videoDescription);
    formData.append("userId", user?.id.toString() || "");
    formData.append("sportType", selectedSport);
    formData.append("source", "mobile-capture");
    
    uploadMutation.mutate(formData);
  };
  
  // Effects
  
  // Initialize camera on mount and when facing mode changes
  useEffect(() => {
    initializeCamera();
    
    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [cameraFacing]);
  
  // Sport-specific recording tips
  const getRecordingTips = () => {
    const tips: Record<string, string[]> = {
      basketball: [
        "Position the camera at court level for better shot analysis",
        "Capture full-body movements to analyze form and technique",
        "Try to show both offensive and defensive plays",
        "Include free throw attempts for shooting form analysis"
      ],
      football: [
        "Record from an elevated position when possible for better play visibility",
        "Focus on your specific position responsibilities",
        "For QBs: show your throwing mechanics from multiple angles",
        "For skill positions: highlight route running and ball handling"
      ],
      soccer: [
        "Capture both on-ball and off-ball movements",
        "Position the camera to show field positioning and spacing",
        "Include set pieces and free kicks for specialized analysis",
        "Try to show both offensive and defensive transitions"
      ],
      baseball: [
        "For batting: position camera from front and side views",
        "For pitching: capture full wind-up and release motion",
        "For fielding: show footwork and throwing mechanics",
        "Record from behind home plate for pitch movement analysis"
      ],
      default: [
        "Position camera to capture your full body during movements",
        "Try to show a variety of skills relevant to your sport",
        "Include both practice drills and game situations if possible",
        "Keep recording steady to improve AI analysis accuracy"
      ]
    };
    
    return tips[selectedSport] || tips.default;
  };
  
  // Render different stages of the mobile capture experience
  const renderStage = () => {
    switch (stage) {
      case "setup":
        return (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="Sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="soccer">Soccer</SelectItem>
                    <SelectItem value="baseball">Baseball</SelectItem>
                    <SelectItem value="volleyball">Volleyball</SelectItem>
                    <SelectItem value="track">Track</SelectItem>
                    <SelectItem value="swimming">Swimming</SelectItem>
                  </SelectContent>
                </Select>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={toggleCamera}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Switch camera</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={focusMode ? "default" : "outline"} 
                        size="sm" 
                        className="h-8" 
                        onClick={() => setFocusMode(!focusMode)}
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Focus Mode
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Focus mode reduces distractions and simplifies the interface for easier concentration</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setShowGuide(!showGuide)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Show recording guide</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden bg-black flex-grow">
              {cameraPermissionDenied ? (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mb-2" />
                  <h3 className="text-lg font-medium mb-1">Camera Access Required</h3>
                  <p className="text-sm text-center text-muted-foreground mb-4">
                    Please allow camera access in your browser settings to record your performance.
                  </p>
                  <Button onClick={initializeCamera}>
                    Try Again
                  </Button>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {showGuide && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="relative max-w-sm p-4 bg-card rounded-lg shadow-lg">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => setShowGuide(false)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        
                        <h3 className="text-lg font-medium mb-2">Recording Tips</h3>
                        <ul className="space-y-2 mb-4">
                          {getRecordingTips().map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <span className="text-sm">{tip}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex justify-end">
                          <Button onClick={() => setShowGuide(false)}>
                            Got it
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="pt-4 flex justify-between items-center">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              
              <Button 
                variant="default" 
                size="lg" 
                className="rounded-full h-14 w-14 p-0"
                onClick={startRecording}
                disabled={cameraPermissionDenied}
              >
                <Camera className="h-6 w-6" />
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => setQuickCapture(!quickCapture)}
                className={quickCapture ? "border-primary" : ""}
              >
                Quick Capture
              </Button>
            </div>
            
            {!focusMode && (
              <div className="text-xs text-muted-foreground mt-4">
                <p className="font-medium mb-1">Quick Capture {quickCapture ? "Enabled" : "Disabled"}</p>
                <p>
                  {quickCapture 
                    ? "Recording will be automatically titled and uploaded for GAR analysis immediately without review." 
                    : "After recording, you'll be able to review and add details before uploading."}
                </p>
              </div>
            )}
          </div>
        );
      
      case "recording":
        return (
          <div className="flex flex-col h-full">
            <div className="relative rounded-lg overflow-hidden bg-black flex-grow">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-4 left-0 right-0 flex justify-center">
                <div className="bg-black/70 text-white px-4 py-1 rounded-full flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${isRecording && !isPaused ? "bg-red-500 animate-pulse" : "bg-gray-500"}`}></div>
                  <span>{formatTime(recordingTime)}</span>
                </div>
              </div>
              
              {!focusMode && showTips && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 p-2 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-xs font-medium">Recording Tips</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setShowTips(false)}
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-white/80">{getRecordingTips()[0]}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 flex justify-between items-center">
              <Button 
                variant="destructive" 
                onClick={stopRecording}
                className="rounded-full flex-none"
              >
                <XCircle className="h-5 w-5 mr-1" />
                Stop
              </Button>
              
              <Button 
                variant={isPaused ? "default" : "secondary"}
                onClick={pauseRecording}
                className="rounded-full mx-2 flex-1"
              >
                {isPaused ? "Resume" : "Pause"}
              </Button>
              
              {realTimeAnalysis && !focusMode && (
                <div className="text-xs text-right text-muted-foreground">
                  <span>Real-time analysis: <span className="font-medium text-primary">ON</span></span>
                </div>
              )}
            </div>
          </div>
        );
      
      case "review":
        return (
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-medium mb-2">Review Recording</h3>
            
            <div className="rounded-lg overflow-hidden bg-black flex-grow">
              {recordedVideo && (
                <video 
                  src={URL.createObjectURL(recordedVideo)} 
                  controls
                  className="w-full h-full object-contain"
                  autoPlay
                />
              )}
            </div>
            
            {!quickCapture && (
              <div className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Game performance vs. Wildcats"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add details about this performance..."
                    rows={2}
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div className="pt-4 flex justify-between items-center">
              <Button variant="outline" onClick={discardRecording}>
                Discard
              </Button>
              
              <Button onClick={quickCapture ? handleUpload : moveToUpload}>
                {quickCapture ? "Upload & Analyze" : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      
      case "upload":
        return (
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-medium mb-2">Upload for Analysis</h3>
            
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{videoTitle}</CardTitle>
                {videoDescription && (
                  <CardDescription>{videoDescription}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Length:</span>
                    <span>{formatTime(recordingTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sport:</span>
                    <span>{selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex-grow">
              <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-48">
                <UploadCloud className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-center text-sm text-muted-foreground mb-2">
                  Ready to upload your performance video for GAR analysis
                </p>
                <p className="text-xs text-muted-foreground">
                  The AI will analyze your technique, form, and movements
                </p>
              </div>
              
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="details">
                  <AccordionTrigger className="text-sm">
                    What happens during analysis?
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <p>Our AI system will analyze your video to evaluate:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Physical attributes (speed, strength, agility)</li>
                        <li>Technical skills (form, technique, execution)</li>
                        <li>Mental aspects (decision making, positioning)</li>
                      </ul>
                      <p>The results will update your GAR score and provide improvement recommendations.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="pt-4 flex justify-between items-center">
              <Button variant="outline" onClick={() => setStage("review")}>
                Back
              </Button>
              <Button onClick={handleUpload} className="gap-2">
                <Video className="h-4 w-4" />
                Upload & Analyze
              </Button>
            </div>
          </div>
        );
      
      case "upload":
        return (
          <div className="space-y-4 py-4 flex flex-col h-full">
            <div className="text-center">
              <h3 className="text-lg font-medium">Uploading video...</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while your video uploads
              </p>
            </div>
            <CustomProgress value={uploadProgress} className="h-2" indicatorClassName="bg-blue-500" />
            <p className="text-xs text-right text-muted-foreground">{Math.round(uploadProgress)}%</p>
            <div className="flex-grow"></div>
          </div>
        );
      
      case "analysis":
        return (
          <div className="space-y-4 py-4 flex flex-col h-full">
            <div className="text-center">
              <h3 className="text-lg font-medium">Analyzing performance...</h3>
              <p className="text-sm text-muted-foreground">
                Our AI is analyzing your performance to generate GAR scores
              </p>
            </div>
            <CustomProgress value={analysisProgress} className="h-2" indicatorClassName="bg-purple-500" />
            <p className="text-xs text-right text-muted-foreground">{Math.round(analysisProgress)}%</p>
            <div className="flex-grow"></div>
          </div>
        );
      
      case "complete":
        return (
          <div className="space-y-4 py-4 flex flex-col h-full">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
              <h3 className="text-lg font-medium mt-2">Analysis Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your GAR scores have been updated based on this video
              </p>
            </div>
            <div className="flex-grow"></div>
            <DialogFooter>
              <Button onClick={onClose}>
                View Updated Scores
              </Button>
            </DialogFooter>
          </div>
        );
      
      case "error":
        return (
          <div className="space-y-4 py-4 flex flex-col h-full">
            <div className="text-center">
              <XCircle className="w-12 h-12 mx-auto text-red-500" />
              <h3 className="text-lg font-medium mt-2">Something went wrong</h3>
              <p className="text-sm text-muted-foreground">
                {errorMessage || "There was an error processing your video"}
              </p>
            </div>
            <div className="flex-grow"></div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStage("setup")}>
                Try Again
              </Button>
              <Button variant="destructive" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className={`mobile-video-capture w-full max-w-md mx-auto ${focusMode ? 'focus-mode' : ''}`}>
      {renderStage()}
    </div>
  );
}