import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { ChevronLeft, Upload, Save, ImageIcon, Video } from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sport: z.string().min(1, "Please select a sport"),
  position: z.string().min(1, "Please enter your position"),
  school: z.string().min(1, "Please enter your school name"),
  graduationYear: z.string().min(1, "Please select your graduation year"),
  location: z.string().min(1, "Please enter your location"),
  height: z.string().min(1, "Please enter your height"),
  weight: z.string().min(1, "Please enter your weight"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  highlights: z.string().min(10, "Please enter a brief highlights summary"),
  academicGpa: z.string().min(1, "Please enter your GPA"),
});

type FormValues = z.infer<typeof formSchema>;

export default function SpotlightCreate() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [highlightVideo, setHighlightVideo] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      sport: "",
      position: "",
      school: "",
      graduationYear: "",
      location: "",
      height: "",
      weight: "",
      email: user?.email || "",
      phone: "",
      bio: "",
      highlights: "",
      academicGpa: "",
    },
  });

  function onSubmit(data: FormValues) {
    // In a real implementation, this would submit the form data and uploaded files to the API
    toast({
      title: "Spotlight profile created!",
      description: "Your profile is now live for recruiters to discover",
    });
    
    // Navigate to the spotlight listing page
    navigate("/nextup-spotlight");
  }

  function handleProfileImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    if (file) {
      setProfileImage(file);
    }
  }

  function handleCoverImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    if (file) {
      setCoverImage(file);
    }
  }

  function handleVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    if (file) {
      setHighlightVideo(file);
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/nextup-spotlight")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Spotlight
      </Button>

      <div className="flex flex-col items-center justify-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create Your Spotlight Profile</h1>
        <p className="text-muted-foreground mt-1">
          Showcase your talents and get discovered by recruiters
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            <div className="col-span-12 lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Media</CardTitle>
                  <CardDescription>
                    Upload photos and videos to showcase your talent
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <FormLabel>Profile Photo</FormLabel>
                    <div className="flex flex-col items-center mt-2">
                      <Avatar className="w-24 h-24 mb-4">
                        {profileImage ? (
                          <AvatarImage src={URL.createObjectURL(profileImage)} alt="Profile" />
                        ) : (
                          <AvatarFallback><ImageIcon className="h-10 w-10 text-muted-foreground" /></AvatarFallback>
                        )}
                      </Avatar>
                      <Input
                        id="profile-photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageChange}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById("profile-photo")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" /> Upload Photo
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <FormLabel>Cover Image</FormLabel>
                    <div className="border-2 border-dashed rounded-lg p-4 mt-2">
                      {coverImage ? (
                        <div className="relative">
                          <img 
                            src={URL.createObjectURL(coverImage)} 
                            alt="Cover" 
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <p className="text-xs mt-1 text-muted-foreground">{coverImage.name}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-xs text-muted-foreground mb-2">
                            Recommended size: 1200 x 400px
                          </p>
                          <Input
                            id="cover-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverImageChange}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => document.getElementById("cover-image")?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" /> Choose File
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <FormLabel>Highlight Video</FormLabel>
                    <div className="border-2 border-dashed rounded-lg p-4 mt-2">
                      {highlightVideo ? (
                        <div>
                          <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                            <Video className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-xs mt-1 text-muted-foreground">{highlightVideo.name}</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => setHighlightVideo(null)}
                          >
                            Change Video
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32">
                          <Video className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-xs text-muted-foreground mb-2">
                            Upload your best plays (MP4, MOV, max 500MB)
                          </p>
                          <Input
                            id="highlight-video"
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleVideoChange}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => document.getElementById("highlight-video")?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" /> Choose File
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Tell recruiters about yourself and your athletic journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Sport</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your sport" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="basketball">Basketball</SelectItem>
                              <SelectItem value="football">Football</SelectItem>
                              <SelectItem value="baseball">Baseball</SelectItem>
                              <SelectItem value="soccer">Soccer</SelectItem>
                              <SelectItem value="tennis">Tennis</SelectItem>
                              <SelectItem value="track">Track & Field</SelectItem>
                              <SelectItem value="volleyball">Volleyball</SelectItem>
                              <SelectItem value="swimming">Swimming</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Point Guard, Quarterback" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="school"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School</FormLabel>
                          <FormControl>
                            <Input placeholder="Your current school" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="graduationYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Graduation Year</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2024">2024</SelectItem>
                              <SelectItem value="2025">2025</SelectItem>
                              <SelectItem value="2026">2026</SelectItem>
                              <SelectItem value="2027">2027</SelectItem>
                              <SelectItem value="2028">2028</SelectItem>
                            </SelectContent>
                          </Select>
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
                            <Input placeholder="City, State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 6'2&quot;" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 185 lbs" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="academicGpa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GPA</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 3.8" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-4" />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell recruiters about your athletic journey, achievements, and goals..." 
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include your sports background, key achievements, and what makes you stand out
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="highlights"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highlights Summary</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. 3-time all-state point guard with elite court vision"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief one-liner that captures your best qualities as an athlete
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              type="button"
              variant="outline"
              onClick={() => navigate("/nextup-spotlight")}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Create Spotlight Profile
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}