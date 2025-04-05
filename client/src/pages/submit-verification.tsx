import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Upload, 
  Video, 
  CheckCircle, 
  Clock, 
  Save,
  X
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  workoutType: z.string().min(1, "Please select a workout type"),
  duration: z.string().min(1, "Please enter the duration"),
  location: z.string().min(1, "Please enter the location"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type CheckpointType = {
  id: number;
  timestamp: string;
  title: string;
  description: string;
  image: File | null;
};

export default function SubmitVerification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [videos, setVideos] = useState<File[]>([]);
  const [checkpoints, setCheckpoints] = useState<CheckpointType[]>([]);
  const [newTimestamp, setNewTimestamp] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      workoutType: "",
      duration: "",
      location: "",
      description: "",
      notes: "",
    },
  });

  function onSubmit(data: FormValues) {
    if (videos.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one video for verification",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would submit the data and files to the API
    toast({
      title: "Workout submitted!",
      description: "Your workout has been submitted for verification",
    });
    
    // Navigate to the verification listing page
    navigate("/workout-verification");
  }

  function handleVideoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files.length > 0) {
      setVideos((prev) => [...prev, ...Array.from(files)]);
    }
  }

  function removeVideo(index: number) {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files.length > 0) {
      setNewImage(files[0]);
    }
  }

  function addCheckpoint() {
    if (!newTimestamp || !newTitle) {
      toast({
        title: "Error",
        description: "Please fill in at least the timestamp and title",
        variant: "destructive",
      });
      return;
    }

    const newCheckpoint: CheckpointType = {
      id: Date.now(),
      timestamp: newTimestamp,
      title: newTitle,
      description: newDescription,
      image: newImage,
    };

    setCheckpoints((prev) => [...prev, newCheckpoint]);
    
    // Reset form fields
    setNewTimestamp("");
    setNewTitle("");
    setNewDescription("");
    setNewImage(null);
  }

  function removeCheckpoint(id: number) {
    setCheckpoints((prev) => prev.filter((checkpoint) => checkpoint.id !== id));
  }

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/workout-verification")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Verification
      </Button>

      <div className="flex flex-col items-center justify-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Submit Workout for Verification</h1>
        <p className="text-muted-foreground mt-1">
          Upload your workout evidence and earn XP
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            <div className="col-span-12 lg:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>Workout Details</CardTitle>
                  <CardDescription>
                    Provide information about your workout session
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workout Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Advanced Shooting Drills" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="workoutType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workout Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="shooting">Shooting</SelectItem>
                              <SelectItem value="ball_handling">Ball Handling</SelectItem>
                              <SelectItem value="conditioning">Conditioning</SelectItem>
                              <SelectItem value="strength">Strength Training</SelectItem>
                              <SelectItem value="cardio">Cardio</SelectItem>
                              <SelectItem value="plyometrics">Plyometrics</SelectItem>
                              <SelectItem value="agility">Agility</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" placeholder="e.g. 45" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. School Gym" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workout Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what you did in this workout session..." 
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional notes about how you felt, improvements noticed, etc." 
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          These notes will be visible to your coach but won't affect verification
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Video Evidence</CardTitle>
                  <CardDescription>
                    Upload video proof of your workout (required)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center mb-4">
                    <Video className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <p className="mb-2 font-medium">Drag and drop or click to upload</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      MP4, MOV or WebM file (max 500MB each)
                    </p>
                    <Input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      className="hidden"
                      multiple
                      onChange={handleVideoUpload}
                    />
                    <Button 
                      type="button"
                      onClick={() => document.getElementById("video-upload")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" /> Choose Videos
                    </Button>
                  </div>

                  {videos.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Uploaded Videos</h3>
                      {videos.map((video, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 border rounded-md"
                        >
                          <div className="flex items-center">
                            <Video className="h-5 w-5 mr-2 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium truncate max-w-xs">{video.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(video.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeVideo(index)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Workout Checkpoints</CardTitle>
                  <CardDescription>
                    Add key moments from your workout (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <FormLabel htmlFor="checkpoint-timestamp">Timestamp</FormLabel>
                        <Input
                          id="checkpoint-timestamp"
                          placeholder="e.g. 00:15:30"
                          value={newTimestamp}
                          onChange={(e) => setNewTimestamp(e.target.value)}
                        />
                      </div>
                      <div>
                        <FormLabel htmlFor="checkpoint-title">Title</FormLabel>
                        <Input
                          id="checkpoint-title"
                          placeholder="e.g. Warm-up complete"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <FormLabel htmlFor="checkpoint-description">Description (Optional)</FormLabel>
                      <Input
                        id="checkpoint-description"
                        placeholder="Brief description of this checkpoint"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <FormLabel>Image (Optional)</FormLabel>
                      <div className="flex items-center gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="w-full"
                          onClick={() => document.getElementById("checkpoint-image")?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" /> 
                          {newImage ? 'Change Image' : 'Add Image'}
                        </Button>
                        <Input
                          id="checkpoint-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                        {newImage && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setNewImage(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {newImage && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {newImage.name}
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="secondary"
                      className="w-full"
                      onClick={addCheckpoint}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Checkpoint
                    </Button>
                  </div>

                  <Separator className="my-4" />

                  {checkpoints.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Added Checkpoints</h3>
                      {checkpoints.map((checkpoint) => (
                        <div 
                          key={checkpoint.id} 
                          className="flex justify-between p-3 border rounded-md"
                        >
                          <div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <p className="text-sm font-medium">{checkpoint.timestamp}</p>
                            </div>
                            <p className="text-sm ml-6">{checkpoint.title}</p>
                            {checkpoint.description && (
                              <p className="text-xs text-muted-foreground ml-6">
                                {checkpoint.description}
                              </p>
                            )}
                            {checkpoint.image && (
                              <p className="text-xs text-blue-500 ml-6 flex items-center mt-1">
                                <CheckCircle className="h-3 w-3 mr-1" /> Image attached
                              </p>
                            )}
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeCheckpoint(checkpoint.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">No checkpoints added</p>
                      <p className="text-xs mt-1">
                        Checkpoints help verify key parts of your workout
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Submission Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      <span>Include at least one video showing your workout</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      <span>Ensure you are clearly visible in the videos</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      <span>Add timestamps for different parts of your workout</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                      <span>Include a detailed description of exercises performed</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full" type="submit">
                    <Save className="mr-2 h-4 w-4" /> Submit for Verification
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}