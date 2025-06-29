import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Film, Save, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "wouter";
import { z } from "zod";

// Form schema for edit
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().optional(),
  comparisonType: z.enum(["self", "pro", "teammate"]),
  tags: z.string().optional(),
  isPublic: z.boolean().default(false),
  status: z.string()
});

type FormValues = z.infer<typeof formSchema>;

// Video form schema
const videoFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  videoType: z.enum(["base", "comparison"]),
  athleteName: z.string().optional(),
  externalVideoUrl: z.string().url("Please enter a valid URL").optional(),
  notes: z.string().optional(),
});

type VideoFormValues = z.infer<typeof videoFormSchema>;

export default function FilmComparisonEdit() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [videoFormData, setVideoFormData] = useState<VideoFormValues>({
    title: "",
    videoType: "base",
    athleteName: "",
    externalVideoUrl: "",
    notes: ""
  });
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  
  // Fetch comparison details
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/film-comparisons', id],
    enabled: !!id,
  });
  
  // Form setup for main comparison data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      comparisonType: "self",
      tags: "",
      isPublic: false,
      status: "draft"
    }
  });
  
  // Populate form when data is loaded
  useEffect(() => {
    if (data?.comparison) {
      const comparison = data.comparison;
      form.reset({
        title: comparison.title,
        description: comparison.description || "",
        comparisonType: comparison.comparisonType as "self" | "pro" | "teammate",
        tags: comparison.tags ? comparison.tags.join(',') : "",
        isPublic: comparison.isPublic,
        status: comparison.status
      });
    }
  }, [data, form]);
  
  // Update comparison mutation
  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // Process tags from comma-separated string to array
      const tags = values.tags 
        ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
        
      const data = {
        ...values,
        tags
      };
      
      const res = await apiRequest("PUT", `/api/film-comparisons/${id}`, data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update comparison");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Comparison updated",
        description: "Your film comparison has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/film-comparisons', id] });
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update comparison.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  });
  
  // Add video mutation
  const addVideoMutation = useMutation({
    mutationFn: async (videoData: VideoFormValues) => {
      if (!selectedVideoFile && !videoData.externalVideoUrl) {
        throw new Error("Please provide either a video file or an external URL");
      }
      
      // If a file is selected, upload it first
      let filePath = videoData.externalVideoUrl;
      
      if (selectedVideoFile) {
        const formData = new FormData();
        formData.append('video', selectedVideoFile);
        
        const uploadRes = await fetch('/api/videos/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadRes.ok) {
          throw new Error("Failed to upload video file");
        }
        
        const uploadData = await uploadRes.json();
        filePath = uploadData.filePath;
      }
      
      // Now add the video to the comparison
      const payload = {
        ...videoData,
        filePath
      };
      
      const res = await apiRequest("POST", `/api/film-comparisons/${id}/videos`, payload);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add video");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Video added",
        description: "Your video has been added to the comparison.",
      });
      
      // Reset form and state
      setVideoFormData({
        title: "",
        videoType: "base",
        athleteName: "",
        externalVideoUrl: "",
        notes: ""
      });
      setSelectedVideoFile(null);
      setShowVideoForm(false);
      
      // Refresh the comparison data
      queryClient.invalidateQueries({ queryKey: ['/api/film-comparisons', id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add video.",
        variant: "destructive",
      });
    }
  });
  
  // Delete video mutation
  const deleteVideoMutation = useMutation({
    mutationFn: async (videoId: number) => {
      const res = await apiRequest("DELETE", `/api/comparison-videos/${videoId}`);
      
      if (!res.ok) {
        throw new Error("Failed to delete video");
      }
      
      return videoId;
    },
    onSuccess: () => {
      toast({
        title: "Video removed",
        description: "The video has been removed from the comparison.",
      });
      
      // Refresh the comparison data
      queryClient.invalidateQueries({ queryKey: ['/api/film-comparisons', id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete video.",
        variant: "destructive",
      });
    }
  });
  
  // Form submission handler
  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    updateMutation.mutate(values);
  };
  
  // Video form submission
  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVideoMutation.mutate(videoFormData);
  };
  
  // Handle video form field changes
  const handleVideoFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVideoFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle video type selection
  const handleVideoTypeChange = (value: string) => {
    setVideoFormData(prev => ({ ...prev, videoType: value as "base" | "comparison" }));
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedVideoFile(e.target.files[0]);
    }
  };
  
  // Handle video deletion
  const handleDeleteVideo = (videoId: number) => {
    if (confirm("Are you sure you want to remove this video?")) {
      deleteVideoMutation.mutate(videoId);
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
  
  const { comparison, videos = [] } = data;
  
  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/film-comparison/${id}`}>
              <ArrowLeft className="w-4 h-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Film Comparison</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Comparison Details</CardTitle>
              <CardDescription>
                Edit your film comparison information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Basketball Jump Shot Comparison" {...field} />
                        </FormControl>
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
                            placeholder="Describe what you're comparing and what you hope to learn..."
                            className="min-h-[100px]"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="comparisonType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Comparison Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="self" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Self Comparison (Your progress over time)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="pro" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Pro Comparison (Compare with professional athletes)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="teammate" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Teammate Comparison (Compare with teammates)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="basketball, shooting, form" {...field} />
                        </FormControl>
                        <FormDescription>
                          Comma-separated tags to categorize your comparison
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <option value="draft">Draft</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="shared">Shared</option>
                          </select>
                        </FormControl>
                        <FormDescription>
                          Current status of your comparison
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Public Comparison
                          </FormLabel>
                          <FormDescription>
                            Make this comparison visible to coaches and teammates
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || updateMutation.isPending}
                    >
                      {isSubmitting || updateMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Videos Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Videos</CardTitle>
                  <CardDescription>
                    Manage the videos in your comparison
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowVideoForm(!showVideoForm)}
                >
                  {showVideoForm ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Video
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showVideoForm && (
                <div className="mb-6 p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Add New Video</h3>
                  <form onSubmit={handleVideoSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input 
                        name="title"
                        value={videoFormData.title}
                        onChange={handleVideoFormChange}
                        placeholder="Video title"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Video Type</label>
                      <RadioGroup 
                        value={videoFormData.videoType} 
                        onValueChange={handleVideoTypeChange}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="base" id="base" />
                          <label htmlFor="base">Base (Your technique)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="comparison" id="comparison" />
                          <label htmlFor="comparison">Comparison (Reference technique)</label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Athlete Name (Optional)</label>
                      <Input 
                        name="athleteName"
                        value={videoFormData.athleteName}
                        onChange={handleVideoFormChange}
                        placeholder="Name of the athlete in the video"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Upload Video</label>
                      <Input 
                        type="file" 
                        accept="video/*"
                        onChange={handleFileChange}
                      />
                      <p className="text-xs text-muted-foreground">Or provide a URL below</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">External Video URL (Optional)</label>
                      <Input 
                        name="externalVideoUrl"
                        value={videoFormData.externalVideoUrl}
                        onChange={handleVideoFormChange}
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Notes (Optional)</label>
                      <Textarea 
                        name="notes"
                        value={videoFormData.notes || ""}
                        onChange={handleVideoFormChange}
                        placeholder="Additional notes about this video"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={addVideoMutation.isPending}
                      >
                        {addVideoMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Video
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {videos.length > 0 ? (
                <div className="space-y-4">
                  {videos.map((video) => (
                    <div key={video.id} className="flex items-start p-3 border rounded-lg gap-4">
                      <div className="relative overflow-hidden bg-black aspect-video rounded-md w-32 h-18 flex-shrink-0">
                        <video 
                          src={video.filePath || video.externalVideoUrl}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Film className="w-8 h-8 text-white opacity-50" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{video.title}</h4>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                              video.videoType === "base" 
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" 
                                : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            }`}>
                              {video.videoType === "base" ? "Base Video" : "Comparison Video"}
                            </span>
                            {video.athleteName && (
                              <p className="text-sm text-muted-foreground mt-1">Athlete: {video.athleteName}</p>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            <X className="w-4 h-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                        {video.notes && (
                          <p className="text-sm mt-2">{video.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border rounded-lg border-dashed">
                  <Film className="w-12 h-12 mb-4 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">No Videos Added Yet</h2>
                  <p className="mb-4 text-center text-muted-foreground">
                    Add at least two videos to compare techniques
                  </p>
                  <Button onClick={() => setShowVideoForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Video
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">1. Update Basic Info</h3>
                <p className="text-sm text-muted-foreground">
                  Edit the title, description, and other details of your comparison
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">2. Manage Videos</h3>
                <p className="text-sm text-muted-foreground">
                  Add or remove videos from your comparison
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">3. Analyze</h3>
                <p className="text-sm text-muted-foreground">
                  Once you have at least two videos, you can analyze the comparison
                </p>
              </div>
              
              <Separator className="my-4" />
              
              <div className="p-4 mt-6 bg-muted rounded-lg">
                <h3 className="flex items-center gap-2 mb-2 font-medium">
                  <Film className="w-4 h-4 text-primary" />
                  Tips for better results
                </h3>
                <ul className="pl-5 space-y-1 text-sm list-disc text-muted-foreground">
                  <li>Include at least one base video of your technique</li>
                  <li>Add comparison videos from similar angles</li>
                  <li>Make videos are clear and well-lit</li>
                  <li>Focus on the specific movement you want to compare</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}