import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";

// Form schema with validation
const formSchema = z.object({
  adhd: z.boolean().default(false),
  focusMode: z.boolean().default(false),
  animationReduction: z.enum(["none", "reduced", "minimal"]).default("none"),
  colorScheme: z.enum(["default", "high-contrast", "dark", "light"]).default("default"),
  textSize: z.enum(["default", "large", "x-large"]).default("default"),
  contrastLevel: z.enum(["default", "high", "very-high"]).default("default"),
  soundEffects: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface AccessibilityPreferencesStepProps {
  data: {
    adhd: boolean;
    focusMode: boolean;
    animationReduction: "none" | "reduced" | "minimal";
    colorScheme: "default" | "high-contrast" | "dark" | "light";
    textSize: "default" | "large" | "x-large";
    contrastLevel: "default" | "high" | "very-high";
    soundEffects: boolean;
  };
  updateData: (data: Partial<FormValues>) => void;
}

export default function AccessibilityPreferencesStep({
  data,
  updateData,
}: AccessibilityPreferencesStepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adhd: data.adhd ?? false,
      focusMode: data.focusMode ?? false,
      animationReduction: data.animationReduction || "none",
      colorScheme: data.colorScheme || "default",
      textSize: data.textSize || "default",
      contrastLevel: data.contrastLevel || "default",
      soundEffects: data.soundEffects ?? true,
    },
  });

  // When form values change, update parent component's state
  const onValuesChange = (values: Partial<FormValues>) => {
    updateData(values);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Accessibility Preferences</h2>
      <p className="text-muted-foreground">
        Customize your experience to best suit your needs and preferences.
      </p>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="neurodivergent">ADHD Support</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Form {...form}>
            <form
              onChange={() => onValuesChange(form.getValues())}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Display Preferences</h3>
                <Separator />

                <FormField
                  control={form.control}
                  name="colorScheme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color Scheme</FormLabel>
                      <Select
                        onValueChange={(value: "default" | "high-contrast" | "dark" | "light") => field.onChange(value)}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color scheme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="dark">Dark Mode</SelectItem>
                          <SelectItem value="light">Light Mode</SelectItem>
                          <SelectItem value="high-contrast">High Contrast</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the color scheme that works best for you.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="textSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text Size</FormLabel>
                      <Select
                        onValueChange={(value: "default" | "large" | "x-large") => field.onChange(value)}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select text size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="x-large">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Adjust text size for better readability.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contrastLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contrast Level</FormLabel>
                      <Select
                        onValueChange={(value: "default" | "high" | "very-high") => field.onChange(value)}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select contrast level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="very-high">Very High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Higher contrast can improve readability.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <h3 className="text-lg font-medium pt-6">Audio & Visual</h3>
                <Separator />

                <FormField
                  control={form.control}
                  name="animationReduction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Animation Reduction</FormLabel>
                      <Select
                        onValueChange={(value: "none" | "reduced" | "minimal") => field.onChange(value)}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select animation level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Standard Animations</SelectItem>
                          <SelectItem value="reduced">Reduced Animations</SelectItem>
                          <SelectItem value="minimal">Minimal Animations</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Reduce motion for a calmer experience.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="soundEffects"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Sound Effects</FormLabel>
                        <FormDescription>
                          Enable sound effects and audio feedback
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
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="neurodivergent" className="mt-4">
          <div className="rounded-md bg-blue-50 dark:bg-blue-950 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  ADHD Support Features
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                  <p>
                    These settings are designed to help neurodivergent athletes focus better
                    and maintain attention during training sessions and skill development.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form
              onChange={() => onValuesChange(form.getValues())}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="adhd"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">ADHD Support Features</FormLabel>
                      <FormDescription>
                        Enables specialized features for athletes with ADHD
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

              {form.watch("adhd") && (
                <FormField
                  control={form.control}
                  name="focusMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Focus Mode</FormLabel>
                        <FormDescription>
                          Reduces distractions and highlights important content
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
              )}

              {form.watch("adhd") && (
                <div className="rounded-md bg-amber-50 dark:bg-amber-950 p-4 mt-6">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Additional ADHD-Friendly Features
                      </h3>
                      <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                        <ul className="list-disc space-y-1 pl-5">
                          <li>Interactive progress visualizations</li>
                          <li>Short, achievable training segments</li>
                          <li>Dopamine-boosting reward system</li>
                          <li>Visual timers for activities</li>
                          <li>Personalized reminder notifications</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}