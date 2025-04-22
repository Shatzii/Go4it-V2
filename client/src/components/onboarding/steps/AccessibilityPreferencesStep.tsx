import React, { useEffect } from "react";
import { ProfileWizardState } from "../ProfileCompletionWizard";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

// Props type
interface AccessibilityPreferencesStepProps {
  formState: ProfileWizardState;
  updateFormState: (data: Partial<ProfileWizardState>) => void;
}

// Form schema
const accessibilityPreferencesSchema = z.object({
  adhd: z.boolean().default(false),
  focusMode: z.boolean().default(false),
  uiAnimationLevel: z.enum(["low", "medium", "high"]).default("medium"),
  colorSchemePreference: z.enum(["standard", "high-contrast", "muted"]).default("standard"),
  textSizePreference: z.enum(["small", "medium", "large"]).default("medium"),
});

type AccessibilityPreferencesValues = z.infer<typeof accessibilityPreferencesSchema>;

/**
 * Accessibility Preferences Step
 * 
 * Fourth step in the profile completion wizard that collects accessibility preferences.
 * This step is particularly important for neurodivergent users with ADHD.
 */
export default function AccessibilityPreferencesStep({ 
  formState, 
  updateFormState 
}: AccessibilityPreferencesStepProps) {
  
  const form = useForm<AccessibilityPreferencesValues>({
    resolver: zodResolver(accessibilityPreferencesSchema),
    defaultValues: {
      adhd: formState.adhd || false,
      focusMode: formState.focusMode || false,
      uiAnimationLevel: (formState.uiAnimationLevel as "low" | "medium" | "high") || "medium",
      colorSchemePreference: (formState.colorSchemePreference as "standard" | "high-contrast" | "muted") || "standard",
      textSizePreference: (formState.textSizePreference as "small" | "medium" | "large") || "medium",
    },
  });
  
  // Handle form submission
  const onSubmit = (data: AccessibilityPreferencesValues) => {
    updateFormState(data);
  };
  
  // Watch form changes and update parent state
  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormState(value as Partial<ProfileWizardState>);
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormState]);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Accessibility Preferences</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your experience to match your needs. These settings help us provide 
          a more accessible and comfortable platform for you.
        </p>
      </div>
      
      <Card className="bg-muted/40 border-muted">
        <CardContent className="p-4">
          <p className="text-sm">
            At Go4It Sports, we're committed to supporting neurodivergent athletes. 
            These preferences help us tailor your experience for optimal focus, 
            engagement, and success.
          </p>
        </CardContent>
      </Card>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ADHD Toggle */}
          <FormField
            control={form.control}
            name="adhd"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <FormLabel className="font-medium">ADHD Support</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Enabling ADHD support customizes the platform with neurodivergent-friendly 
                            features like task chunking, reward systems, and optimized visual layouts.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormDescription>
                    Optimize the platform experience for neurodivergent athletes
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
          
          {/* Focus Mode Toggle */}
          <FormField
            control={form.control}
            name="focusMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <FormLabel className="font-medium">Focus Mode</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Focus mode reduces visual distractions, simplifies UI elements, 
                            and uses calm visual cues to help maintain concentration.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormDescription>
                    Reduce distractions and help maintain concentration
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
          
          {/* UI Animation Level */}
          <FormField
            control={form.control}
            name="uiAnimationLevel"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Animation Level</FormLabel>
                <FormDescription>
                  Control the amount of motion and animations in the interface
                </FormDescription>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-3 gap-4"
                  >
                    <FormItem className="flex flex-col items-center space-y-2">
                      <FormControl>
                        <RadioGroupItem value="low" className="sr-only" />
                      </FormControl>
                      <div className={`
                        p-4 w-full rounded-lg border-2 flex flex-col items-center justify-center 
                        ${field.value === 'low' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted'}
                      `}>
                        <Label
                          htmlFor="low"
                          className={`font-medium ${field.value === 'low' ? 'text-primary' : ''}`}
                        >
                          Low
                        </Label>
                        <span className="text-xs text-muted-foreground">Minimal</span>
                      </div>
                    </FormItem>
                    
                    <FormItem className="flex flex-col items-center space-y-2">
                      <FormControl>
                        <RadioGroupItem value="medium" className="sr-only" />
                      </FormControl>
                      <div className={`
                        p-4 w-full rounded-lg border-2 flex flex-col items-center justify-center
                        ${field.value === 'medium' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted'}
                      `}>
                        <Label
                          htmlFor="medium"
                          className={`font-medium ${field.value === 'medium' ? 'text-primary' : ''}`}
                        >
                          Medium
                        </Label>
                        <span className="text-xs text-muted-foreground">Balanced</span>
                      </div>
                    </FormItem>
                    
                    <FormItem className="flex flex-col items-center space-y-2">
                      <FormControl>
                        <RadioGroupItem value="high" className="sr-only" />
                      </FormControl>
                      <div className={`
                        p-4 w-full rounded-lg border-2 flex flex-col items-center justify-center
                        ${field.value === 'high' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted'}
                      `}>
                        <Label
                          htmlFor="high"
                          className={`font-medium ${field.value === 'high' ? 'text-primary' : ''}`}
                        >
                          High
                        </Label>
                        <span className="text-xs text-muted-foreground">Dynamic</span>
                      </div>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Color Scheme Preference */}
          <FormField
            control={form.control}
            name="colorSchemePreference"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Color Scheme</FormLabel>
                <FormDescription>
                  Choose a color scheme that works best for your visual preferences
                </FormDescription>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-3 gap-4"
                  >
                    <FormItem className="flex flex-col items-center space-y-2">
                      <FormControl>
                        <RadioGroupItem value="standard" className="sr-only" />
                      </FormControl>
                      <div className={`
                        p-4 w-full rounded-lg border-2 flex flex-col items-center justify-center
                        ${field.value === 'standard' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted'}
                      `}>
                        <Label
                          htmlFor="standard"
                          className={`font-medium ${field.value === 'standard' ? 'text-primary' : ''}`}
                        >
                          Standard
                        </Label>
                        <span className="text-xs text-muted-foreground">Default</span>
                      </div>
                    </FormItem>
                    
                    <FormItem className="flex flex-col items-center space-y-2">
                      <FormControl>
                        <RadioGroupItem value="high-contrast" className="sr-only" />
                      </FormControl>
                      <div className={`
                        p-4 w-full rounded-lg border-2 flex flex-col items-center justify-center
                        ${field.value === 'high-contrast' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted'}
                      `}>
                        <Label
                          htmlFor="high-contrast"
                          className={`font-medium ${field.value === 'high-contrast' ? 'text-primary' : ''}`}
                        >
                          High Contrast
                        </Label>
                        <span className="text-xs text-muted-foreground">Bold</span>
                      </div>
                    </FormItem>
                    
                    <FormItem className="flex flex-col items-center space-y-2">
                      <FormControl>
                        <RadioGroupItem value="muted" className="sr-only" />
                      </FormControl>
                      <div className={`
                        p-4 w-full rounded-lg border-2 flex flex-col items-center justify-center
                        ${field.value === 'muted' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted'}
                      `}>
                        <Label
                          htmlFor="muted"
                          className={`font-medium ${field.value === 'muted' ? 'text-primary' : ''}`}
                        >
                          Muted
                        </Label>
                        <span className="text-xs text-muted-foreground">Softer</span>
                      </div>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Text Size Preference */}
          <FormField
            control={form.control}
            name="textSizePreference"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Text Size</FormLabel>
                <FormDescription>
                  Adjust text size for better readability
                </FormDescription>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-3 gap-4"
                  >
                    <FormItem className="flex flex-col items-center space-y-2">
                      <FormControl>
                        <RadioGroupItem value="small" className="sr-only" />
                      </FormControl>
                      <div className={`
                        p-4 w-full rounded-lg border-2 flex flex-col items-center justify-center
                        ${field.value === 'small' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted'}
                      `}>
                        <Label
                          htmlFor="small"
                          className={`text-sm ${field.value === 'small' ? 'text-primary' : ''}`}
                        >
                          Small
                        </Label>
                        <span className="text-xs text-muted-foreground">Compact</span>
                      </div>
                    </FormItem>
                    
                    <FormItem className="flex flex-col items-center space-y-2">
                      <FormControl>
                        <RadioGroupItem value="medium" className="sr-only" />
                      </FormControl>
                      <div className={`
                        p-4 w-full rounded-lg border-2 flex flex-col items-center justify-center
                        ${field.value === 'medium' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted'}
                      `}>
                        <Label
                          htmlFor="medium"
                          className={`font-medium ${field.value === 'medium' ? 'text-primary' : ''}`}
                        >
                          Medium
                        </Label>
                        <span className="text-xs text-muted-foreground">Default</span>
                      </div>
                    </FormItem>
                    
                    <FormItem className="flex flex-col items-center space-y-2">
                      <FormControl>
                        <RadioGroupItem value="large" className="sr-only" />
                      </FormControl>
                      <div className={`
                        p-4 w-full rounded-lg border-2 flex flex-col items-center justify-center
                        ${field.value === 'large' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted'}
                      `}>
                        <Label
                          htmlFor="large"
                          className={`text-lg font-medium ${field.value === 'large' ? 'text-primary' : ''}`}
                        >
                          Large
                        </Label>
                        <span className="text-xs text-muted-foreground">Enhanced</span>
                      </div>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}