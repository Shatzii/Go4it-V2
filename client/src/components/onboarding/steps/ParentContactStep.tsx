import React, { useEffect } from "react";
import { ProfileWizardState } from "../ProfileCompletionWizard";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Shield } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

// Props type
interface ParentContactStepProps {
  formState: ProfileWizardState;
  updateFormState: (data: Partial<ProfileWizardState>) => void;
}

// Form schema
const parentContactSchema = z.object({
  parentEmail: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  notifyParent: z.boolean().default(false),
});

type ParentContactValues = z.infer<typeof parentContactSchema>;

/**
 * Parent Contact Step
 * 
 * Fifth and final step in the profile completion wizard that collects parent/guardian contact information.
 * This step is particularly important for minor athletes.
 */
export default function ParentContactStep({ 
  formState, 
  updateFormState 
}: ParentContactStepProps) {
  const form = useForm<ParentContactValues>({
    resolver: zodResolver(parentContactSchema),
    defaultValues: {
      parentEmail: formState.parentEmail || "",
      notifyParent: false,
    },
  });
  
  // Handle form submission
  const onSubmit = (data: ParentContactValues) => {
    updateFormState({
      parentEmail: data.parentEmail,
    });
  };
  
  // Watch form changes and update parent state
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.parentEmail !== undefined) {
        updateFormState({
          parentEmail: value.parentEmail,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormState]);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Parent/Guardian Information</h3>
        <p className="text-sm text-muted-foreground mt-1">
          As an athlete under 18, we recommend adding your parent or guardian's contact information 
          for account safety and verification purposes.
        </p>
      </div>
      
      <Card className="bg-primary/5 border-primary/10">
        <CardContent className="p-4 flex gap-3 items-start">
          <Shield className="h-5 w-5 text-primary mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Athlete Protection</p>
            <p className="text-sm text-muted-foreground">
              Adding a parent or guardian's email enhances your account security and helps meet 
              safety guidelines for student athletes. This information is optional but recommended.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Parent Email */}
          <FormField
            control={form.control}
            name="parentEmail"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Parent/Guardian Email</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground ml-2 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Your parent/guardian email is used for account verification, important notifications,
                          and permission requests. It helps ensure platform safety for student athletes.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Input
                    placeholder="parent@example.com"
                    type="email"
                    {...field}
                    autoComplete="email"
                  />
                </FormControl>
                <FormDescription>
                  This email will only be used for important notifications and verification purposes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Notify Parent Checkbox */}
          <FormField
            control={form.control}
            name="notifyParent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Send parent/guardian a verification email
                  </FormLabel>
                  <FormDescription>
                    Your parent/guardian will receive an email with account verification information
                    and parental controls for the platform.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
      
      <div className="text-sm text-muted-foreground pt-2 border-t">
        <p>
          Note: This information is optional but recommended for athletes under 18. 
          You can update or add parent contact information later in your account settings.
        </p>
      </div>
    </div>
  );
}