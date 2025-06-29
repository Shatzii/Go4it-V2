import React, { useState, useRef } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  endpoint: string;
  children: React.ReactNode;
  onUploadComplete: (url: string) => void;
  maxSize?: number; // in bytes
  allowedFileTypes?: string[];
}

export function FileUpload({
  endpoint,
  children,
  onUploadComplete,
  maxSize = 5 * 1024 * 1024, // Default 5MB
  allowedFileTypes = ["image/jpeg", "image/png", "image/webp"],
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${formatFileSize(maxSize)}`,
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!allowedFileTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Allowed file types: ${allowedFileTypes
          .map((type) => type.split("/")[1])
          .join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setIsDialogOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("endpoint", endpoint);

      // Simulate progress for demo purposes
      // In a real application, you would use XHR or fetch with upload progress tracking
      const simulateProgress = () => {
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 95) {
              clearInterval(interval);
              return prev;
            }
            return prev + 5;
          });
        }, 100);
        return interval;
      };

      const progressInterval = simulateProgress();

      // Upload file to server
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      setUploadProgress(100);

      // Get the URL from the response
      const data = await response.json();
      onUploadComplete(data.url);

      // Close dialog after a short delay to show 100% progress
      setTimeout(() => {
        setIsDialogOpen(false);
        setIsUploading(false);
        setUploadProgress(0);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 500);

      toast({
        title: "Upload complete",
        description: "Your file has been uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={allowedFileTypes.join(",")}
        className="hidden"
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer"
      >
        {children}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              {selectedFile
                ? `File: ${selectedFile.name} (${formatFileSize(
                    selectedFile.size
                  )})`
                : "Select a file to upload"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-4 py-4">
            {selectedFile && (
              <>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                </div>

                {isUploading && (
                  <div className="w-full space-y-2">
                    <Progress value={uploadProgress} />
                    <p className="text-center text-sm text-muted-foreground">
                      {uploadProgress}% uploaded
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter className="flex flex-row items-center justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}