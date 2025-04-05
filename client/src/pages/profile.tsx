import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useMeasurement } from "@/contexts/measurement-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertAthleteProfileSchema } from "@shared/schema";
import { formatHeight, formatWeight } from "@/lib/unit-conversion";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiSelect } from "@/components/ui/multi-select";
import { MeasurementToggle } from "@/components/ui/measurement-toggle";

// Extend the athlete profile schema with more validation rules
const athleteProfileFormSchema = insertAthleteProfileSchema.extend({
  height: z.number().min(100, "Height must be at least 100 cm").max(250, "Height must be less than 250 cm"),
  weight: z.number().min(30, "Weight must be at least 30 kg").max(200, "Weight must be less than 200 kg"),
  age: z.number().min(10, "Age must be at least 10").max(25, "Age must be less than 25"),
  school: z.string().min(2, "School name must be at least 2 characters"),
  graduationYear: z.number().min(2022, "Graduation year must be 2022 or later").max(2030, "Graduation year must be 2030 or earlier"),
  sportsInterest: z.array(z.string()).min(1, "Select at least one sport of interest"),
});

// User profile form schema
const userProfileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
});

// Sport options for multi-select
const sportsOptions = [
  { value: "basketball", label: "Basketball" },
  { value: "volleyball", label: "Volleyball" },
  { value: "soccer", label: "Soccer" },
  { value: "baseball", label: "Baseball" },
  { value: "softball", label: "Softball" },
  { value: "football", label: "Football" },
  { value: "track", label: "Track & Field" },
  { value: "swimming", label: "Swimming" },
  { value: "tennis", label: "Tennis" },
  { value: "golf", label: "Golf" },
  { value: "wrestling", label: "Wrestling" },
  { value: "gymnastics", label: "Gymnastics" },
  { value: "lacrosse", label: "Lacrosse" },
];

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { system } = useMeasurement();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("personal");
  
  // Fetch athlete profile if user is an athlete
  const { data: athleteProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["/api/athletes", user?.id, "profile"],
    enabled: !!user && user.role === "athlete",
  });

  // Create forms
  const userForm = useForm({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      profileImage: user?.profileImage || "",
    },
  });

  const athleteForm = useForm({
    resolver: zodResolver(athleteProfileFormSchema),
    defaultValues: {
      height: athleteProfile?.height || 0,
      weight: athleteProfile?.weight || 0,
      age: athleteProfile?.age || 0,
      school: athleteProfile?.school || "",
      graduationYear: athleteProfile?.graduationYear || new Date().getFullYear() + 4,
      sportsInterest: athleteProfile?.sportsInterest || [],
    },
  });

  // Update athleteForm when data is loaded
  useEffect(() => {
    if (athleteProfile) {
      athleteForm.reset({
        height: athleteProfile.height || 0,
        weight: athleteProfile.weight || 0,
        age: athleteProfile.age || 0,
        school: athleteProfile.school || "",
        graduationYear: athleteProfile.graduationYear || new Date().getFullYear() + 4,
        sportsInterest: athleteProfile.sportsInterest || [],
      });
    }
  }, [athleteProfile]);

  // Update user profile mutation
  const updateUserMutation = useMutation({
    mutationFn: async (data: z.infer<typeof userProfileFormSchema>) => {
      return await apiRequest("PUT", `/api/users/${user.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your personal information has been updated successfully.",
      });
      // Invalidate cached user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive",
      });
    },
  });

  // Update athlete profile mutation
  const updateAthleteProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof athleteProfileFormSchema>) => {
      return await apiRequest("PUT", `/api/athletes/${user.id}/profile`, data);
    },
    onSuccess: () => {
      toast({
        title: "Athletic profile updated",
        description: "Your athletic information has been updated successfully.",
      });
      // Invalidate cached athlete profile data
      queryClient.invalidateQueries({ queryKey: ["/api/athletes", user.id, "profile"] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your athletic profile.",
        variant: "destructive",
      });
    },
  });

  // Submit handlers
  const onSubmitUserProfile = (data: z.infer<typeof userProfileFormSchema>) => {
    updateUserMutation.mutate(data);
  };

  const onSubmitAthleteProfile = (data: z.infer<typeof athleteProfileFormSchema>) => {
    updateAthleteProfileMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        <p className="text-gray-600 mb-6">Please log in to view and edit your profile.</p>
        <Button>Log In</Button>
      </div>
    );
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user.name) return "U";
    return user.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-3xl font-bold">My Profile</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Measurement Units:</span>
          <MeasurementToggle />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-gray-500 capitalize mb-2">{user.role}</p>
              <p className="text-gray-600 mb-4">{user.bio || "No bio provided yet. Add information about yourself in the personal tab below."}</p>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="text-sm"
                  onClick={() => setActiveTab("personal")}
                >
                  Edit Profile
                </Button>
                {user.role === "athlete" && (
                  <Button
                    variant="outline"
                    className="text-sm"
                    onClick={() => setActiveTab("athletic")}
                  >
                    Edit Athletic Info
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              {user.role === "athlete" && (
                <TabsTrigger value="athletic">Athletic Information</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and how others see you on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...userForm}>
                    <form onSubmit={userForm.handleSubmit(onSubmitUserProfile)} className="space-y-6">
                      <FormField
                        control={userForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={userForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={userForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us a bit about yourself" 
                                className="resize-none h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              This will be displayed on your profile.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full md:w-auto"
                        disabled={updateUserMutation.isPending}
                      >
                        {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {user.role === "athlete" && (
              <TabsContent value="athletic">
                <Card>
                  <CardHeader>
                    <CardTitle>Athletic Information</CardTitle>
                    <CardDescription>
                      Update your athletic details to improve sport recommendations and coach matching.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...athleteForm}>
                      <form onSubmit={athleteForm.handleSubmit(onSubmitAthleteProfile)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={athleteForm.control}
                            name="height"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Height {system === 'metric' ? '(cm)' : '(ft/in)'}</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder={system === 'metric' ? 'Height in cm' : 'Height in inches'} 
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  {system === 'metric' 
                                    ? 'Your height in centimeters' 
                                    : 'Your height in inches (or use the formatted value below)'}
                                </FormDescription>
                                {field.value > 0 && (
                                  <div className="text-sm text-gray-600 mt-1">
                                    {formatHeight(field.value, system)}
                                  </div>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={athleteForm.control}
                            name="weight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Weight {system === 'metric' ? '(kg)' : '(lbs)'}</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder={system === 'metric' ? 'Weight in kg' : 'Weight in lbs'} 
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  {system === 'metric' 
                                    ? 'Your weight in kilograms' 
                                    : 'Your weight in pounds'}
                                </FormDescription>
                                {field.value > 0 && (
                                  <div className="text-sm text-gray-600 mt-1">
                                    {formatWeight(field.value, system)}
                                  </div>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={athleteForm.control}
                            name="age"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="Your age" 
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={athleteForm.control}
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
                          control={athleteForm.control}
                          name="graduationYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Graduation Year</FormLabel>
                              <Select 
                                onValueChange={(value) => field.onChange(Number(value))}
                                defaultValue={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select graduation year" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.from({ length: 9 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={athleteForm.control}
                          name="sportsInterest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sports of Interest</FormLabel>
                              <FormControl>
                                <MultiSelect
                                  options={sportsOptions}
                                  selected={field.value || []}
                                  onChange={field.onChange}
                                  placeholder="Select sports you're interested in"
                                />
                              </FormControl>
                              <FormDescription>
                                Select all sports you're interested in pursuing
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full md:w-auto"
                          disabled={updateAthleteProfileMutation.isPending}
                        >
                          {updateAthleteProfileMutation.isPending ? "Saving..." : "Save Athletic Information"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
