import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, CloudUpload, FileVideo, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function VideoUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("video", file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      try {
        const res = await fetch("/api/videos/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`${res.status}: ${errorText}`);
        }

        return res.json();
      } catch (error) {
        clearInterval(progressInterval);
        setUploadProgress(0);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/gar-scores/${user?.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${user?.id}`] });
      
      toast({
        title: "Video Uploaded Successfully",
        description: "Your video is being analyzed. Results will be available shortly.",
      });

      // Reset upload state after a delay
      setTimeout(() => {
        setUploadedFile(null);
        setUploadProgress(0);
      }, 3000);
    },
    onError: (error) => {
      setUploadProgress(0);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const allowedTypes = ["video/mp4", "video/mov", "video/avi", "video/quicktime"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload MP4, MOV, or AVI video files only.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (500MB limit)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload videos smaller than 500MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setUploadProgress(0);
    uploadMutation.mutate(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (uploadMutation.isPending || uploadProgress > 0) {
    return (
      <div className="upload-area p-8 text-center">
        <div className="mb-4">
          <Loader2 className="text-primary h-12 w-12 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-white mb-2">
            {uploadProgress < 100 ? "Uploading Video..." : "Processing Video..."}
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            {uploadedFile?.name}
          </p>
          <div className="max-w-xs mx-auto">
            <Progress value={uploadProgress} className="h-3 mb-2" />
            <p className="text-slate-400 text-xs">
              {uploadProgress < 100 ? `${uploadProgress}% uploaded` : "Analyzing with AI..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (uploadMutation.isSuccess && uploadProgress === 100) {
    return (
      <div className="upload-area p-8 text-center">
        <div className="mb-4">
          <CheckCircle className="text-success h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Upload Complete!</h3>
          <p className="text-slate-400 text-sm mb-4">
            Your video has been uploaded and is being analyzed.
          </p>
          <Button
            onClick={() => {
              setUploadedFile(null);
              setUploadProgress(0);
              uploadMutation.reset();
            }}
            className="bg-primary hover:bg-blue-600"
          >
            Upload Another Video
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`upload-area p-8 text-center transition-colors neurodivergent-focus ${
        isDragOver ? "drag-over" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/mov,video/avi,video/quicktime"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="mb-4">
        <CloudUpload className="text-slate-400 h-12 w-12 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Upload Your Training Video</h3>
        <p className="text-slate-400 text-sm mb-2">
          Drag and drop your video file here, or click to browse
        </p>
        <p className="text-slate-500 text-xs">
          Supports MP4, MOV, AVI files up to 500MB
        </p>
      </div>
      
      <Button
        onClick={handleBrowseClick}
        className="bg-slate-700 hover:bg-slate-600 text-white mobile-touch-target neurodivergent-focus"
        disabled={uploadMutation.isPending}
      >
        <FileVideo className="mr-2 h-4 w-4" />
        Choose File
      </Button>

      {uploadMutation.isError && (
        <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
          <div className="flex items-center justify-center space-x-2">
            <AlertCircle className="text-destructive h-4 w-4" />
            <p className="text-destructive text-sm">Upload failed. Please try again.</p>
          </div>
        </div>
      )}
    </div>
  );
}
