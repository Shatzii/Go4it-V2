import React from "react";
import { ProfileWizardState } from "../ProfileCompletionWizard";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface AccessibilityPreferencesStepProps {
  formState: ProfileWizardState;
  updateFormState: (data: Partial<ProfileWizardState>) => void;
}

export default function AccessibilityPreferencesStep({
  formState,
  updateFormState,
}: AccessibilityPreferencesStepProps) {
  // Handle ADHD toggle
  const handleAdhdToggle = (checked: boolean) => {
    updateFormState({ adhd: checked });
    
    // If ADHD is enabled, set some recommended defaults
    if (checked) {
      updateFormState({
        focusMode: true,
        uiAnimationLevel: "low",
        colorSchemePreference: "high-contrast",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Accessibility Preferences</h3>
        <p className="text-muted-foreground">
          Customize the app to match your needs and preferences
        </p>
      </div>
      
      {/* ADHD Support */}
      <Card className="p-5 border-primary/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">ADHD Support</h3>
            <p className="text-sm text-muted-foreground">
              Enable features designed for athletes with ADHD
            </p>
          </div>
          <Switch
            checked={formState.adhd}
            onCheckedChange={handleAdhdToggle}
            aria-label="Enable ADHD support"
          />
        </div>
        
        {formState.adhd && (
          <div className="mt-4 text-sm bg-muted p-3 rounded-md">
            <p>
              Our ADHD-friendly features include focus mode, reduced animations, 
              high-contrast colors, and simplified workflow - all designed to help
              you stay focused and achieve your best.
            </p>
          </div>
        )}
      </Card>
      
      {/* Focus Mode */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="focus-mode" className="flex flex-col">
            <span>Focus Mode</span>
            <span className="font-normal text-sm text-muted-foreground">
              Reduces distractions during important tasks
            </span>
          </Label>
          <Switch
            id="focus-mode"
            checked={formState.focusMode}
            onCheckedChange={(checked) => updateFormState({ focusMode: checked })}
            aria-label="Enable focus mode"
          />
        </div>
      </div>
      
      {/* UI Animation Level */}
      <div className="space-y-2">
        <Label>UI Animation Level</Label>
        <RadioGroup
          value={formState.uiAnimationLevel}
          onValueChange={(value) => updateFormState({ uiAnimationLevel: value })}
        >
          <div className="grid grid-cols-3 gap-2">
            <Label
              htmlFor="animation-low"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                formState.uiAnimationLevel === "low" && "border-primary"
              )}
            >
              <RadioGroupItem
                value="low"
                id="animation-low"
                className="sr-only"
              />
              <span className="mt-1 font-medium">Minimal</span>
              <span className="text-xs text-muted-foreground text-center">
                Reduced motion and effects
              </span>
            </Label>
            <Label
              htmlFor="animation-medium"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                formState.uiAnimationLevel === "medium" && "border-primary"
              )}
            >
              <RadioGroupItem
                value="medium"
                id="animation-medium"
                className="sr-only"
              />
              <span className="mt-1 font-medium">Moderate</span>
              <span className="text-xs text-muted-foreground text-center">
                Balanced animations
              </span>
            </Label>
            <Label
              htmlFor="animation-high"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                formState.uiAnimationLevel === "high" && "border-primary"
              )}
            >
              <RadioGroupItem
                value="high"
                id="animation-high"
                className="sr-only"
              />
              <span className="mt-1 font-medium">Dynamic</span>
              <span className="text-xs text-muted-foreground text-center">
                Full motion and effects
              </span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Color Scheme Preference */}
      <div className="space-y-2">
        <Label>Color Scheme</Label>
        <Tabs
          value={formState.colorSchemePreference}
          onValueChange={(value) => updateFormState({ colorSchemePreference: value })}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="high-contrast">High Contrast</TabsTrigger>
            <TabsTrigger value="muted">Muted</TabsTrigger>
          </TabsList>
          <TabsContent value="standard" className="p-4 border rounded-md mt-2">
            <div className="h-20 bg-gradient-to-r from-primary to-primary/60 rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-medium">Standard Colors</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Our default color scheme with balanced contrast and vibrant accents
            </p>
          </TabsContent>
          <TabsContent value="high-contrast" className="p-4 border rounded-md mt-2">
            <div className="h-20 bg-gradient-to-r from-black to-primary-foreground rounded-md flex items-center justify-center">
              <span className="text-white font-medium">High Contrast</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Enhanced contrast for better readability and focus
            </p>
          </TabsContent>
          <TabsContent value="muted" className="p-4 border rounded-md mt-2">
            <div className="h-20 bg-gradient-to-r from-muted to-muted-foreground/30 rounded-md flex items-center justify-center">
              <span className="text-foreground font-medium">Muted Colors</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Gentler, softer colors for reduced visual stimulation
            </p>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Text Size Preference */}
      <div className="space-y-2">
        <Label>Text Size</Label>
        <RadioGroup
          value={formState.textSizePreference}
          onValueChange={(value) => updateFormState({ textSizePreference: value })}
        >
          <div className="grid grid-cols-3 gap-2">
            <Label
              htmlFor="text-small"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                formState.textSizePreference === "small" && "border-primary"
              )}
            >
              <RadioGroupItem
                value="small"
                id="text-small"
                className="sr-only"
              />
              <span className="text-sm font-medium">Small</span>
              <span className="text-xs text-muted-foreground">Compact</span>
            </Label>
            <Label
              htmlFor="text-medium"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                formState.textSizePreference === "medium" && "border-primary"
              )}
            >
              <RadioGroupItem
                value="medium"
                id="text-medium"
                className="sr-only"
              />
              <span className="text-base font-medium">Medium</span>
              <span className="text-xs text-muted-foreground">Standard</span>
            </Label>
            <Label
              htmlFor="text-large"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                formState.textSizePreference === "large" && "border-primary"
              )}
            >
              <RadioGroupItem
                value="large"
                id="text-large"
                className="sr-only"
              />
              <span className="text-lg font-medium">Large</span>
              <span className="text-xs text-muted-foreground">Enhanced</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Tips Card */}
      <Card className="p-4 bg-muted/50 border-dashed">
        <h4 className="font-medium mb-2">Tips for neurodivergent athletes:</h4>
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li>• Focus Mode helps reduce distractions during important training sessions</li>
          <li>• Reduced animations can help if you're sensitive to motion</li>
          <li>• High contrast colors make important information stand out</li>
          <li>• These settings can be changed later in your profile settings</li>
        </ul>
      </Card>
    </div>
  );
}