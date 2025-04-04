import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertNcaaEligibilitySchema } from "@shared/schema";

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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import {
  BookOpen,
  GraduationCap,
  Award,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Download
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Extend the NCAA eligibility schema with validation rules
const ncaaEligibilityFormSchema = insertNcaaEligibilitySchema.extend({
  coreCoursesCompleted: z.number().min(0, "Must be 0 or greater").max(20, "Must be 20 or less"),
  coreCoursesRequired: z.number().default(16),
  gpa: z.number().min(0, "Must be 0 or greater").max(4.0, "Must be 4.0 or less").step(0.1),
  testScores: z.string().optional(),
  amateurismStatus: z.enum(["incomplete", "pending", "verified"]),
  overallEligibilityStatus: z.enum(["incomplete", "partial", "complete"]),
});

export default function NcaaClearinghouse() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch NCAA eligibility data
  const { data: ncaaEligibility, isLoading } = useQuery({
    queryKey: ["/api/athletes", user?.id, "/ncaa-eligibility"],
    enabled: !!user && user.role === "athlete",
  });

  // Create form with default values from NCAA eligibility data
  const form = useForm({
    resolver: zodResolver(ncaaEligibilityFormSchema),
    defaultValues: {
      userId: user?.id || 0,
      coreCoursesCompleted: ncaaEligibility?.coreCoursesCompleted || 0,
      coreCoursesRequired: ncaaEligibility?.coreCoursesRequired || 16,
      gpa: ncaaEligibility?.gpa || 0,
      gpaMeetsRequirement: ncaaEligibility?.gpaMeetsRequirement || false,
      testScores: ncaaEligibility?.testScores || "",
      testScoresMeetRequirement: ncaaEligibility?.testScoresMeetRequirement || false,
      amateurismStatus: ncaaEligibility?.amateurismStatus || "incomplete",
      overallEligibilityStatus: ncaaEligibility?.overallEligibilityStatus || "incomplete",
    },
  });

  // Update form when data is loaded
  useState(() => {
    if (ncaaEligibility) {
      form.reset({
        userId: user?.id || 0,
        coreCoursesCompleted: ncaaEligibility.coreCoursesCompleted,
        coreCoursesRequired: ncaaEligibility.coreCoursesRequired,
        gpa: ncaaEligibility.gpa,
        gpaMeetsRequirement: ncaaEligibility.gpaMeetsRequirement,
        testScores: ncaaEligibility.testScores,
        testScoresMeetRequirement: ncaaEligibility.testScoresMeetRequirement,
        amateurismStatus: ncaaEligibility.amateurismStatus,
        overallEligibilityStatus: ncaaEligibility.overallEligibilityStatus,
      });
    }
  });

  // Update NCAA eligibility mutation
  const updateEligibilityMutation = useMutation({
    mutationFn: async (data: z.infer<typeof ncaaEligibilityFormSchema>) => {
      return await apiRequest("PUT", `/api/athletes/${user?.id}/ncaa-eligibility`, data);
    },
    onSuccess: () => {
      toast({
        title: "Eligibility updated",
        description: "Your NCAA eligibility information has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/athletes", user?.id, "/ncaa-eligibility"] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your eligibility information.",
        variant: "destructive",
      });
    },
  });

  // Submit handler
  const onSubmit = (data: z.infer<typeof ncaaEligibilityFormSchema>) => {
    // Calculate overall eligibility status
    let overallStatus = "incomplete";
    const meetsGpa = data.gpaMeetsRequirement;
    const meetsTestScores = data.testScoresMeetRequirement;
    const courseProgress = data.coreCoursesCompleted / data.coreCoursesRequired;
    const amateurismComplete = data.amateurismStatus === "verified";

    if (meetsGpa && meetsTestScores && courseProgress >= 1 && amateurismComplete) {
      overallStatus = "complete";
    } else if (meetsGpa || meetsTestScores || courseProgress > 0 || data.amateurismStatus !== "incomplete") {
      overallStatus = "partial";
    }

    updateEligibilityMutation.mutate({
      ...data,
      overallEligibilityStatus: overallStatus as "incomplete" | "partial" | "complete",
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h1 className="text-2xl font-bold mb-4">NCAA Clearinghouse</h1>
        <p className="text-gray-600 mb-6">
          Please log in to track your NCAA eligibility
        </p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  if (user.role !== "athlete") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h1 className="text-2xl font-bold mb-4">NCAA Clearinghouse</h1>
        <p className="text-gray-600 mb-6">
          NCAA eligibility tracking is only available for athlete accounts.
        </p>
      </div>
    );
  }

  // Calculate completion percentage
  const calculateCompletionPercentage = () => {
    if (!ncaaEligibility) return 0;
    
    let completedItems = 0;
    let totalItems = 4;

    // Core courses
    if (ncaaEligibility.coreCoursesCompleted / ncaaEligibility.coreCoursesRequired >= 1) completedItems++;
    
    // GPA
    if (ncaaEligibility.gpaMeetsRequirement) completedItems++;
    
    // Test scores
    if (ncaaEligibility.testScoresMeetRequirement) completedItems++;
    
    // Amateurism
    if (ncaaEligibility.amateurismStatus === "verified") completedItems++;

    return Math.round((completedItems / totalItems) * 100);
  };

  // Get status display information
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "complete":
        return {
          label: "Complete",
          color: "#36B37E",
          icon: <CheckCircle className="h-5 w-5 text-accent" />,
        };
      case "partial":
        return {
          label: "On Track",
          color: "#0052CC",
          icon: <Info className="h-5 w-5 text-primary" />,
        };
      case "incomplete":
      default:
        return {
          label: "Incomplete",
          color: "#FF5630",
          icon: <AlertCircle className="h-5 w-5 text-secondary" />,
        };
    }
  };

  const statusInfo = getStatusInfo(ncaaEligibility?.overallEligibilityStatus || "incomplete");

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-neutral mb-2">
            NCAA Clearinghouse
          </h1>
          <p className="text-gray-600">
            Track and manage your NCAA eligibility requirements
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
            className="mr-2"
          >
            {isEditing ? "Cancel" : "Update Eligibility"}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading eligibility information...</p>
        </div>
      ) : ncaaEligibility ? (
        <>
          {/* Eligibility Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                NCAA Eligibility Overview
              </CardTitle>
              <CardDescription>
                Your current status and progress towards NCAA eligibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-neutral-light bg-opacity-30 rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center">
                      {statusInfo.icon}
                      <h3 className="font-medium text-neutral ml-2">
                        Eligibility Status: <span className="text-accent">{statusInfo.label}</span>
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {ncaaEligibility.overallEligibilityStatus === "complete"
                        ? "Congratulations! You have met all NCAA eligibility requirements."
                        : ncaaEligibility.overallEligibilityStatus === "partial"
                        ? "Keep up the good work with your academic and athletic development!"
                        : "Start working on meeting your NCAA eligibility requirements."}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center">
                    <div className="relative w-16 h-16 mr-4">
                      <ProgressRing
                        percentage={calculateCompletionPercentage()}
                        color={statusInfo.color}
                      >
                        <div className="text-lg font-bold" style={{ color: statusInfo.color }}>
                          {calculateCompletionPercentage()}%
                        </div>
                      </ProgressRing>
                    </div>
                    <div>
                      <p className="font-medium text-neutral">Overall Completion</p>
                      <p className="text-sm text-gray-600">
                        {calculateCompletionPercentage() === 100
                          ? "All requirements met"
                          : `${4 - Math.round((calculateCompletionPercentage() / 100) * 4)} items remaining`}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-neutral mb-2">Core Courses</h4>
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 mr-3">
                        <ProgressRing 
                          percentage={Math.round((ncaaEligibility.coreCoursesCompleted / ncaaEligibility.coreCoursesRequired) * 100)} 
                          size={48}
                          color="#36B37E"
                        >
                          <div className="text-sm font-bold text-accent">
                            {Math.round((ncaaEligibility.coreCoursesCompleted / ncaaEligibility.coreCoursesRequired) * 100)}%
                          </div>
                        </ProgressRing>
                      </div>
                      <div>
                        <p className="text-sm">{ncaaEligibility.coreCoursesCompleted} of {ncaaEligibility.coreCoursesRequired}</p>
                        <p className="text-xs text-gray-500">Courses Completed</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-neutral mb-2">GPA Requirement</h4>
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 mr-3">
                        <ProgressRing 
                          percentage={ncaaEligibility.gpaMeetsRequirement ? 100 : 0} 
                          size={48}
                          color={ncaaEligibility.gpaMeetsRequirement ? "#36B37E" : "#FF5630"}
                        >
                          <div className="text-sm font-bold" style={{ color: ncaaEligibility.gpaMeetsRequirement ? "#36B37E" : "#FF5630" }}>
                            {ncaaEligibility.gpaMeetsRequirement ? "✓" : "✗"}
                          </div>
                        </ProgressRing>
                      </div>
                      <div>
                        <p className="text-sm">{ncaaEligibility.gpa.toFixed(1)} GPA</p>
                        <p className="text-xs text-gray-500">
                          {ncaaEligibility.gpaMeetsRequirement ? "Requirement Met" : "Below Requirement"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-neutral mb-2">Test Scores</h4>
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 mr-3">
                        <ProgressRing 
                          percentage={ncaaEligibility.testScoresMeetRequirement ? 100 : 0} 
                          size={48}
                          color={ncaaEligibility.testScoresMeetRequirement ? "#36B37E" : "#FF5630"}
                        >
                          <div className="text-sm font-bold" style={{ color: ncaaEligibility.testScoresMeetRequirement ? "#36B37E" : "#FF5630" }}>
                            {ncaaEligibility.testScoresMeetRequirement ? "✓" : "✗"}
                          </div>
                        </ProgressRing>
                      </div>
                      <div>
                        <p className="text-sm">{ncaaEligibility.testScores || "No scores"}</p>
                        <p className="text-xs text-gray-500">
                          {ncaaEligibility.testScoresMeetRequirement ? "Requirement Met" : "Testing Needed"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-neutral mb-2">Amateurism</h4>
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 mr-3">
                        <ProgressRing 
                          percentage={ncaaEligibility.amateurismStatus === "verified" ? 100 : ncaaEligibility.amateurismStatus === "pending" ? 50 : 0} 
                          size={48}
                          color={ncaaEligibility.amateurismStatus === "verified" ? "#36B37E" : "#FF5630"}
                        >
                          <div className="text-sm font-bold" style={{ color: ncaaEligibility.amateurismStatus === "verified" ? "#36B37E" : "#FF5630" }}>
                            {ncaaEligibility.amateurismStatus === "verified" ? "✓" : "!"}
                          </div>
                        </ProgressRing>
                      </div>
                      <div>
                        <p className="text-sm capitalize">{ncaaEligibility.amateurismStatus}</p>
                        <p className="text-xs text-gray-500">Form Submission</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Details / Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardCheck className="h-5 w-5 mr-2" />
                {isEditing ? "Update Eligibility Information" : "Eligibility Details"}
              </CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update your NCAA eligibility information to track your progress"
                  : "Detailed information about your NCAA eligibility requirements"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="coreCoursesCompleted"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Core Courses Completed</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>
                                Number of NCAA approved core courses you have completed
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="coreCoursesRequired"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Core Courses Required</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  disabled
                                />
                              </FormControl>
                              <FormDescription>Standard NCAA requirement</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="gpa"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current GPA</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="4.0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormDescription>Your current GPA on a 4.0 scale</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="gpaMeetsRequirement"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">GPA Meets Requirement</FormLabel>
                                <FormDescription>
                                  Your GPA meets the NCAA minimum requirement (2.3 for D1, 2.2 for D2)
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
                      </div>

                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="testScores"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Test Scores (SAT/ACT)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>Enter your SAT or ACT score (e.g., "1200 SAT" or "26 ACT")</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="testScoresMeetRequirement"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Test Scores Meet Requirement</FormLabel>
                                <FormDescription>
                                  Your test scores meet the NCAA sliding scale requirement
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

                        <FormField
                          control={form.control}
                          name="amateurismStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amateurism Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select amateurism status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="incomplete">Incomplete</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="verified">Verified</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Your amateurism certification status with the NCAA
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateEligibilityMutation.isPending}
                      >
                        {updateEligibilityMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-8">
                  {/* Academic Requirements */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" />
                      Academic Requirements
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-md font-medium mb-3">Core Course Requirements</h4>
                        <ul className="space-y-3">
                          <li className="flex justify-between items-center">
                            <span className="text-gray-600">English</span>
                            <span className="font-semibold">4 years</span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="text-gray-600">Math (Algebra 1 or higher)</span>
                            <span className="font-semibold">3 years</span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="text-gray-600">Natural/Physical Science</span>
                            <span className="font-semibold">2 years</span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="text-gray-600">Additional English/Math/Science</span>
                            <span className="font-semibold">1 year</span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="text-gray-600">Social Science</span>
                            <span className="font-semibold">2 years</span>
                          </li>
                          <li className="flex justify-between items-center">
                            <span className="text-gray-600">Additional Courses</span>
                            <span className="font-semibold">4 years</span>
                          </li>
                          <li className="flex justify-between items-center font-medium pt-2 border-t">
                            <span>Total Required</span>
                            <span>{ncaaEligibility.coreCoursesRequired} courses</span>
                          </li>
                          <li className="flex justify-between items-center font-medium">
                            <span>Your Progress</span>
                            <span className={ncaaEligibility.coreCoursesCompleted >= ncaaEligibility.coreCoursesRequired ? "text-accent" : "text-secondary"}>
                              {ncaaEligibility.coreCoursesCompleted} courses
                            </span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-md font-medium mb-3">Test Score & GPA Requirements</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          NCAA uses a sliding scale combining test scores and GPA. Higher GPA allows for 
                          lower test scores and vice versa.
                        </p>
                        
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium">Your Current GPA</h5>
                            <p className={`text-lg font-bold ${ncaaEligibility.gpaMeetsRequirement ? "text-accent" : "text-secondary"}`}>
                              {ncaaEligibility.gpa.toFixed(1)}
                            </p>
                            <div className="flex items-center text-xs mt-1">
                              {ncaaEligibility.gpaMeetsRequirement ? (
                                <CheckCircle className="h-3 w-3 text-accent mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 text-secondary mr-1" />
                              )}
                              <span>Minimum required: 2.3 for Division I, 2.2 for Division II</span>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium">Your Test Scores</h5>
                            <p className={`text-lg font-bold ${ncaaEligibility.testScoresMeetRequirement ? "text-accent" : "text-secondary"}`}>
                              {ncaaEligibility.testScores || "Not submitted"}
                            </p>
                            <div className="flex items-center text-xs mt-1">
                              {ncaaEligibility.testScoresMeetRequirement ? (
                                <CheckCircle className="h-3 w-3 text-accent mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 text-secondary mr-1" />
                              )}
                              <span>
                                {ncaaEligibility.testScores 
                                  ? "Your scores meet the requirement for your GPA" 
                                  : "Submit SAT or ACT scores to check eligibility"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Amateurism Certification */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-primary" />
                      Amateurism Certification
                    </h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          ncaaEligibility.amateurismStatus === "verified"
                            ? "bg-accent"
                            : ncaaEligibility.amateurismStatus === "pending"
                            ? "bg-amber-500" 
                            : "bg-secondary"
                        }`}></div>
                        <h4 className="text-md font-medium">
                          Status: <span className="capitalize">{ncaaEligibility.amateurismStatus}</span>
                        </h4>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        All student-athletes must complete the amateurism certification process to be eligible for NCAA competition.
                        This process ensures you have not engaged in activities that would compromise your amateur status.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          {ncaaEligibility.amateurismStatus === "verified" ? (
                            <CheckCircle className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                          ) : (
                            <Info className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                          )}
                          <span>Registration with NCAA Eligibility Center</span>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          {ncaaEligibility.amateurismStatus === "verified" ? (
                            <CheckCircle className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                          ) : (
                            <Info className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                          )}
                          <span>Completion of amateurism questionnaire</span>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          {ncaaEligibility.amateurismStatus === "verified" ? (
                            <CheckCircle className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                          )}
                          <span>Final amateurism certification</span>
                        </div>
                      </div>
                      
                      {ncaaEligibility.amateurismStatus !== "verified" && (
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open("https://web3.ncaa.org/ecwr3/", "_blank")}
                          >
                            Visit NCAA Eligibility Center
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Next Steps */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <ClipboardCheck className="h-5 w-5 mr-2 text-primary" />
                      Next Steps
                    </h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <ul className="space-y-3">
                        {ncaaEligibility.coreCoursesCompleted < ncaaEligibility.coreCoursesRequired && (
                          <li className="flex items-start">
                            <div className="bg-secondary bg-opacity-10 text-secondary p-1 rounded-full mr-3 mt-0.5">
                              <Award className="h-4 w-4" />
                            </div>
                            <span>Complete {ncaaEligibility.coreCoursesRequired - ncaaEligibility.coreCoursesCompleted} more core courses to meet NCAA requirements</span>
                          </li>
                        )}
                        
                        {!ncaaEligibility.gpaMeetsRequirement && (
                          <li className="flex items-start">
                            <div className="bg-secondary bg-opacity-10 text-secondary p-1 rounded-full mr-3 mt-0.5">
                              <Award className="h-4 w-4" />
                            </div>
                            <span>Improve your GPA to meet the NCAA minimum requirement</span>
                          </li>
                        )}
                        
                        {!ncaaEligibility.testScoresMeetRequirement && (
                          <li className="flex items-start">
                            <div className="bg-secondary bg-opacity-10 text-secondary p-1 rounded-full mr-3 mt-0.5">
                              <Award className="h-4 w-4" />
                            </div>
                            <span>{!ncaaEligibility.testScores ? "Take the SAT or ACT and submit your scores" : "Improve your test scores to meet NCAA requirements"}</span>
                          </li>
                        )}
                        
                        {ncaaEligibility.amateurismStatus !== "verified" && (
                          <li className="flex items-start">
                            <div className="bg-secondary bg-opacity-10 text-secondary p-1 rounded-full mr-3 mt-0.5">
                              <Award className="h-4 w-4" />
                            </div>
                            <span>Complete your amateurism certification through the NCAA Eligibility Center</span>
                          </li>
                        )}
                        
                        {ncaaEligibility.overallEligibilityStatus === "complete" && (
                          <li className="flex items-start">
                            <div className="bg-accent bg-opacity-10 text-accent p-1 rounded-full mr-3 mt-0.5">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                            <span>Congratulations! You have met all NCAA eligibility requirements. Continue to maintain your academic performance.</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <GraduationCap className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Eligibility Data Found</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Let's start tracking your NCAA eligibility to help you meet requirements for college athletics.
          </p>
          <Button onClick={() => setIsEditing(true)}>Set Up NCAA Tracking</Button>
        </div>
      )}
    </div>
  );
}
