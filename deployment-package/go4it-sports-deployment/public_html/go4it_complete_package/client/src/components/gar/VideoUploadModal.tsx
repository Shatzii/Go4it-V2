import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, Loader2, Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CustomProgress } from "@/components/ui/custom-progress";

interface VideoUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ACCEPTED_FILE_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export function VideoUploadModal({ open, onOpenChange }: VideoUploadModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [stage, setStage] = useState<"upload" | "analyzing" | "complete" | "error">("upload");
  const [errorMessage, setErrorMessage] = useState("");
  
  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid video file (MP4, MOV, AVI, WEBM)",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 500MB",
        variant: "destructive",
      });
      return;
    }
    
    setVideoFile(file);
  };
  
  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // Simulate upload progress for now
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 10;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }
          setUploadProgress(progress);
        }, 300);
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
      setStage("analyzing");
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
          progress += Math.random() * 5;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }
          setAnalysisProgress(progress);
        }, 500);
      };
      simulateProgress();
      
      const response = await apiRequest("POST", "/api/athlete/generate-gar-score", { videoId });
      return response.data;
    },
    onSuccess: () => {
      setStage("complete");
      // Invalidate queries to refresh GAR data
      queryClient.invalidateQueries({ queryKey: ["/api/athlete/gar-scores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/athlete/gar-history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/athlete/videos"] });
      
      toast({
        title: "Analysis complete",
        description: "Your video has been analyzed and GAR scores updated",
      });
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
  
  // Handle submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast({
        title: "No video selected",
        description: "Please select a video to upload",
        variant: "destructive",
      });
      return;
    }
    
    if (!videoTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your video",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", videoTitle);
    formData.append("description", videoDescription);
    formData.append("userId", user?.id.toString() || "");
    
    setStage("upload");
    uploadMutation.mutate(formData);
  };
  
  // Reset form
  const resetForm = () => {
    setVideoFile(null);
    setVideoTitle("");
    setVideoDescription("");
    setUploadProgress(0);
    setAnalysisProgress(0);
    setStage("upload");
    setErrorMessage("");
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    // Only if not in middle of operations
    if (stage !== "upload" && stage !== "analyzing") {
      resetForm();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) handleCloseDialog();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Video for GAR Analysis</DialogTitle>
          <DialogDescription>
            Upload a performance video to generate your Growth and Ability Rating
          </DialogDescription>
        </DialogHeader>
        
        {stage === "upload" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="video">Video</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="video-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                >
                  {videoFile ? (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Check className="w-8 h-8 mb-2 text-green-500" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {videoFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round(videoFile.size / (1024 * 1024))} MB
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        MP4, MOV, AVI or WEBM (Max 500MB)
                      </p>
                    </div>
                  )}
                  <Input
                    id="video-upload"
                    type="file"
                    accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Game footage vs. Wildcats"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe the video content, date, location, etc."
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
              />
            </div>
            
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!videoFile || !videoTitle.trim()}>
                Upload and Analyze
              </Button>
            </DialogFooter>
          </form>
        )}
        
        {stage === "upload" && uploadMutation.isPending && (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">Uploading video...</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while your video uploads
              </p>
            </div>
            <CustomProgress value={uploadProgress} className="h-2" indicatorClassName="bg-blue-500" />
            <p className="text-xs text-right text-muted-foreground">{Math.round(uploadProgress)}%</p>
          </div>
        )}
        
        {stage === "analyzing" && (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">Analyzing performance...</h3>
              <p className="text-sm text-muted-foreground">
                Our AI is analyzing your performance to generate GAR scores
              </p>
            </div>
            <CustomProgress value={analysisProgress} className="h-2" indicatorClassName="bg-purple-500" />
            <p className="text-xs text-right text-muted-foreground">{Math.round(analysisProgress)}%</p>
          </div>
        )}
        
        {stage === "complete" && (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <Check className="w-12 h-12 mx-auto text-green-500" />
              <h3 className="text-lg font-medium mt-2">Analysis Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your GAR scores have been updated based on this video
              </p>
            </div>
            
            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>
                View Updated Scores
              </Button>
            </DialogFooter>
          </div>
        )}
        
        {stage === "error" && (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <X className="w-12 h-12 mx-auto text-red-500" />
              <h3 className="text-lg font-medium mt-2">Something went wrong</h3>
              <p className="text-sm text-muted-foreground">
                {errorMessage || "There was an error processing your video"}
              </p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Try Again
              </Button>
              <Button variant="destructive" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}