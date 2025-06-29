import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Film, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "wouter";
import { z } from "zod";

// Form schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().optional(),
  comparisonType: z.enum(["self", "pro", "teammate"]),
  tags: z.string().optional(),
  isPublic: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

export default function FilmComparisonCreate() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      comparisonType: "self",
      tags: "",
      isPublic: false
    }
  });
  
  // Create comparison mutation
  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // Process tags from comma-separated string to array
      const tags = values.tags 
        ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
        
      const data = {
        ...values,
        tags,
        status: "in_progress"
      };
      
      const res = await apiRequest("POST", "/api/film-comparisons", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create comparison");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Comparison created",
        description: "Your film comparison has been created successfully.",
      });
      
      // Navigate to the detail view or edit view to add videos
      navigate(`/film-comparison/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create comparison.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  });
  
  // Form submission handler
  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    createMutation.mutate(values);
  };
  
  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/film-comparison">
              <ArrowLeft className="w-4 h-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create Film Comparison</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Comparison Details</CardTitle>
              <CardDescription>
                Create a new film comparison to analyze technique
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
                        <FormDescription>
                          Give your comparison a descriptive title
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
                            placeholder="Describe what you're comparing and what you hope to learn..."
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
                    name="comparisonType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Comparison Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                      disabled={isSubmitting || createMutation.isPending}
                    >
                      {isSubmitting || createMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Create Comparison
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
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
                <h3 className="font-medium">1. Create a Comparison</h3>
                <p className="text-sm text-muted-foreground">
                  Start by providing a title and details about what you're comparing
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">2. Upload Videos</h3>
                <p className="text-sm text-muted-foreground">
                  Add videos of your technique and reference videos for comparison
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">3. Analyze</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI will analyze the videos and provide detailed feedback and insights
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">4. Improve</h3>
                <p className="text-sm text-muted-foreground">
                  Use the feedback to make specific improvements to your technique
                </p>
              </div>
              
              <div className="p-4 mt-6 bg-muted rounded-lg">
                <h3 className="flex items-center gap-2 mb-2 font-medium">
                  <Film className="w-4 h-4 text-primary" />
                  Tips for better results
                </h3>
                <ul className="pl-5 space-y-1 text-sm list-disc text-muted-foreground">
                  <li>Record videos from the same angle</li>
                  <li>Ensure good lighting conditions</li>
                  <li>Capture the full motion from start to finish</li>
                  <li>For pro comparisons, find videos with similar angles</li>
                  <li>Focus on one specific technique at a time</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}