import { useState, useRef, ChangeEvent } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertVideoSchema } from "@shared/schema";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle,
  FileVideo,
  Upload,
  Video,
  Info,
  UploadCloud,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Extend the video schema with validation
const uploadVideoSchema = insertVideoSchema.extend({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  sportType: z.string().min(1, "Please select a sport type"),
});

// Sport options
const sportOptions = [
  { value: "basketball", label: "Basketball" },
  { value: "volleyball", label: "Volleyball" },
  { value: "soccer", label: "Soccer" },
  { value: "baseball", label: "Baseball" },
  { value: "football", label: "Football" },
  { value: "track", label: "Track & Field" },
  { value: "swimming", label: "Swimming" },
  { value: "tennis", label: "Tennis" },
  { value: "golf", label: "Golf" },
  { value: "other", label: "Other" },
];

export default function UploadVideo() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadCompleted, setUploadCompleted] = useState<boolean>(false);

  // Create form
  const form = useForm<z.infer<typeof uploadVideoSchema>>({
    resolver: zodResolver(uploadVideoSchema),
    defaultValues: {
      userId: user?.id || 0,
      title: "",
      description: "",
      sportType: "",
      filePath: "",
    },
  });

  // Handle file selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["video/mp4", "video/quicktime", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an MP4, MOV, or WebM video file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a video file smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Auto-fill title if empty
    if (!form.getValues("title")) {
      // Remove file extension and replace hyphens and underscores with spaces
      const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      form.setValue("title", fileName);
    }
  };

  // Upload video mutation
  const uploadVideoMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);
      
      try {
        const response = await fetch("/api/videos/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        
        clearInterval(progressInterval);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Upload failed");
        }
        
        setUploadProgress(100);
        setUploadCompleted(true);
        return await response.json();
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      } finally {
        setTimeout(() => setIsUploading(false), 1000);
      }
    },
    onSuccess: () => {
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded and is being processed for analysis.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      
      // Navigate to video analysis page after a short delay
      setTimeout(() => {
        navigate("/video-analysis");
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your video.",
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  // Submit handler
  const onSubmit = async (data: z.infer<typeof uploadVideoSchema>) => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a video file to upload.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("sportType", data.sportType);

    uploadVideoMutation.mutate(formData);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
        <p className="text-gray-600 mb-6">
          Please log in to upload videos for analysis
        </p>
        <Button>Log In</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-neutral mb-2">
            Upload Video
          </h1>
          <p className="text-gray-600">
            Upload a video for AI-powered motion analysis
          </p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileVideo className="h-5 w-5 mr-2" />
            Video Upload
          </CardTitle>
          <CardDescription>
            Upload a video of yourself playing sports to get AI motion analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedFile ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a video file</h3>
              <p className="text-gray-600 mb-4">
                Click to browse or drag and drop your video file here
              </p>
              <p className="text-xs text-gray-400">
                MP4, MOV, or WebM format. Maximum 50MB.
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-200 rounded-md p-2 flex-shrink-0">
                  <Video className="h-8 w-8 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium truncate">{selectedFile.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-gray-400">{selectedFile.type}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Change
                </Button>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a title for your video" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive title for your video
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add details about your video"
                        className="resize-none h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide additional context for better analysis
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sport Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sportOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the sport shown in your video
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Alert variant="default" className="bg-blue-50 border-blue-200">
                <Info className="h-5 w-5 text-blue-500" />
                <AlertTitle>Tips for better analysis</AlertTitle>
                <AlertDescription className="text-sm text-gray-600">
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Ensure the athlete is fully visible in the frame</li>
                    <li>Record in good lighting conditions</li>
                    <li>Capture the complete motion from start to finish</li>
                    <li>Film from a stable position to minimize camera shake</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {isUploading && (
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {uploadCompleted && (
            <Alert variant="default" className="bg-green-50 border-green-200 w-full">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <AlertTitle>Upload Complete!</AlertTitle>
              <AlertDescription>
                Your video has been uploaded and is being processed for analysis.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-3 w-full">
            <Button
              variant="outline"
              onClick={() => navigate("/video-analysis")}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={!selectedFile || isUploading || uploadCompleted}
              className="min-w-[120px]"
            >
              {isUploading ? "Uploading..." : uploadCompleted ? "Uploaded!" : "Upload Video"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="h-5 w-5 mr-2" />
            What happens next?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-primary bg-opacity-10 text-primary p-1 rounded-full flex-shrink-0">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-neutral">AI Motion Analysis</h3>
                <p className="text-sm text-gray-600">
                  Our AI will analyze your form, technique, and movement patterns
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary bg-opacity-10 text-primary p-1 rounded-full flex-shrink-0">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-neutral">Personalized Feedback</h3>
                <p className="text-sm text-gray-600">
                  You'll receive detailed insights and improvement tips based on your performance
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary bg-opacity-10 text-primary p-1 rounded-full flex-shrink-0">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-neutral">Sport Recommendations</h3>
                <p className="text-sm text-gray-600">
                  We'll update your sport recommendations based on your motion analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary bg-opacity-10 text-primary p-1 rounded-full flex-shrink-0">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-neutral">Coach Visibility</h3>
                <p className="text-sm text-gray-600">
                  Coaches can view your videos and analyses when you connect with them
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
