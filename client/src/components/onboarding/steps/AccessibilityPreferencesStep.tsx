import React from "react";
import { ProfileWizardState } from "../ProfileCompletionWizard";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Lightbulb } from "lucide-react";

interface AccessibilityPreferencesStepProps {
  formState: ProfileWizardState;
  updateFormState: (data: Partial<ProfileWizardState>) => void;
}

// Animation level options
const ANIMATION_LEVELS = [
  { value: "minimal", label: "Minimal", description: "Almost no animations or visual effects" },
  { value: "reduced", label: "Reduced", description: "Limited animations for important actions only" },
  { value: "medium", label: "Medium", description: "Standard animations for a balanced experience" },
  { value: "full", label: "Full", description: "All animations and visual effects enabled" },
];

// Color scheme options
const COLOR_SCHEMES = [
  { value: "standard", label: "Standard", description: "Default color scheme" },
  { value: "high-contrast", label: "High Contrast", description: "Enhanced contrast for better readability" },
  { value: "reduced-blue", label: "Reduced Blue", description: "Minimizes blue light for eye comfort" },
  { value: "dark-focused", label: "Dark Focused", description: "Optimized dark mode with focus highlights" },
];

// Text size options
const TEXT_SIZES = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium (Default)" },
  { value: "large", label: "Large" },
  { value: "extra-large", label: "Extra Large" },
];

export default function AccessibilityPreferencesStep({ 
  formState, 
  updateFormState 
}: AccessibilityPreferencesStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Accessibility Preferences</h3>
        <p className="text-muted-foreground">
          Configure your experience to best support your learning style
        </p>
      </div>
      
      <Card className="p-4 mb-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-start space-x-3">
          <Lightbulb className="h-5 w-5 mt-0.5 text-amber-500" />
          <div>
            <h4 className="font-medium text-sm">Why we ask about ADHD:</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Go4It Sports is designed to support neurodivergent athletes. Your preferences help us 
              provide you with a personalized experience that accommodates your unique learning style. 
              This information stays private and is only used to enhance your experience.
            </p>
          </div>
        </div>
      </Card>
      
      <div className="space-y-8">
        {/* ADHD Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="adhd-switch" className="text-base">ADHD / Neurodivergent</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Do you have ADHD or other neurodivergent traits?
            </p>
          </div>
          <Switch
            id="adhd-switch"
            checked={formState.adhd}
            onCheckedChange={(checked) => updateFormState({ adhd: checked })}
          />
        </div>
        
        {/* Focus Mode Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="focus-switch" className="text-base">Focus Mode</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Simplifies the interface and reduces distractions
            </p>
          </div>
          <Switch
            id="focus-switch"
            checked={formState.focusMode}
            onCheckedChange={(checked) => updateFormState({ focusMode: checked })}
          />
        </div>
        
        {/* UI Animation Level */}
        <div className="space-y-3">
          <Label className="text-base">UI Animation Level</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Control the amount of animations in the user interface
          </p>
          
          <RadioGroup 
            value={formState.uiAnimationLevel} 
            onValueChange={(value) => updateFormState({ uiAnimationLevel: value })}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2"
          >
            {ANIMATION_LEVELS.map(level => (
              <div key={level.value} className="flex items-start space-x-2">
                <RadioGroupItem value={level.value} id={`animation-${level.value}`} className="mt-1" />
                <div className="grid gap-1">
                  <Label 
                    htmlFor={`animation-${level.value}`} 
                    className="font-medium"
                  >
                    {level.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {level.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Color Scheme */}
        <div className="space-y-3">
          <Label className="text-base" htmlFor="color-scheme">Color Scheme</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Select a color scheme that works best for you
          </p>
          
          <RadioGroup 
            value={formState.colorSchemePreference} 
            onValueChange={(value) => updateFormState({ colorSchemePreference: value })}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2"
          >
            {COLOR_SCHEMES.map(scheme => (
              <div key={scheme.value} className="flex items-start space-x-2">
                <RadioGroupItem value={scheme.value} id={`scheme-${scheme.value}`} className="mt-1" />
                <div className="grid gap-1">
                  <Label 
                    htmlFor={`scheme-${scheme.value}`} 
                    className="font-medium"
                  >
                    {scheme.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {scheme.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Text Size */}
        <div className="space-y-3">
          <Label className="text-base" htmlFor="text-size">Text Size</Label>
          <Select 
            value={formState.textSizePreference} 
            onValueChange={(value) => updateFormState({ textSizePreference: value })}
          >
            <SelectTrigger id="text-size">
              <SelectValue placeholder="Select text size" />
            </SelectTrigger>
            <SelectContent>
              {TEXT_SIZES.map(size => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Text Size Preview */}
          <div className="mt-4 p-3 border rounded-md bg-background">
            <p className="text-muted-foreground mb-2">Preview:</p>
            <p className={`
              ${formState.textSizePreference === "small" && "text-sm"}
              ${formState.textSizePreference === "medium" && "text-base"}
              ${formState.textSizePreference === "large" && "text-lg"}
              ${formState.textSizePreference === "extra-large" && "text-xl"}
            `}>
              This is how your text will appear throughout the application.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mt-6 italic">
        Note: You can always adjust these preferences later in your account settings.
      </div>
    </div>
  );
}