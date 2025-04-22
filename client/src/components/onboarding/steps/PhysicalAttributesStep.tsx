import React, { useState, useEffect } from "react";
import { ProfileWizardState } from "../ProfileCompletionWizard";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Info, Ruler } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PhysicalAttributesStepProps {
  formState: ProfileWizardState;
  updateFormState: (data: Partial<ProfileWizardState>) => void;
}

// Generate graduation years (current year + 6 years)
const generateGraduationYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 7; i++) {
    years.push(currentYear + i);
  }
  return years;
};

const GRADUATION_YEARS = generateGraduationYears();

export default function PhysicalAttributesStep({ 
  formState, 
  updateFormState 
}: PhysicalAttributesStepProps) {
  const [heightFeet, setHeightFeet] = useState<string>("");
  const [heightInches, setHeightInches] = useState<string>("");
  const [heightCm, setHeightCm] = useState<string>("");
  const [weightLbs, setWeightLbs] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>("");
  
  // Initialize height and weight fields based on measurement system and existing data
  useEffect(() => {
    if (formState.height) {
      if (formState.measurementSystem === "imperial") {
        // Parse imperial height format (e.g., "5'11\"")
        const match = formState.height.match(/(\d+)'(\d+)"/);
        if (match) {
          setHeightFeet(match[1]);
          setHeightInches(match[2]);
        }
      } else {
        // Parse metric height format (e.g., "180 cm")
        const match = formState.height.match(/(\d+)\s*cm/);
        if (match) {
          setHeightCm(match[1]);
        }
      }
    }
    
    if (formState.weight) {
      if (formState.measurementSystem === "imperial") {
        // Parse imperial weight format (e.g., "185 lbs")
        const match = formState.weight.match(/(\d+)\s*lbs/);
        if (match) {
          setWeightLbs(match[1]);
        }
      } else {
        // Parse metric weight format (e.g., "84 kg")
        const match = formState.weight.match(/(\d+)\s*kg/);
        if (match) {
          setWeightKg(match[1]);
        }
      }
    }
  }, [formState.measurementSystem, formState.height, formState.weight]);
  
  // Update height when feet or inches change (imperial)
  useEffect(() => {
    if (formState.measurementSystem === "imperial" && (heightFeet || heightInches)) {
      const feet = heightFeet || "0";
      const inches = heightInches || "0";
      updateFormState({ height: `${feet}'${inches}"` });
    }
  }, [heightFeet, heightInches, formState.measurementSystem, updateFormState]);
  
  // Update height when cm changes (metric)
  useEffect(() => {
    if (formState.measurementSystem === "metric" && heightCm) {
      updateFormState({ height: `${heightCm} cm` });
    }
  }, [heightCm, formState.measurementSystem, updateFormState]);
  
  // Update weight when lbs changes (imperial)
  useEffect(() => {
    if (formState.measurementSystem === "imperial" && weightLbs) {
      updateFormState({ weight: `${weightLbs} lbs` });
    }
  }, [weightLbs, formState.measurementSystem, updateFormState]);
  
  // Update weight when kg changes (metric)
  useEffect(() => {
    if (formState.measurementSystem === "metric" && weightKg) {
      updateFormState({ weight: `${weightKg} kg` });
    }
  }, [weightKg, formState.measurementSystem, updateFormState]);
  
  // Toggle measurement system
  const toggleMeasurementSystem = () => {
    const newSystem = formState.measurementSystem === "imperial" ? "metric" : "imperial";
    
    // Convert values when switching systems
    if (newSystem === "metric" && heightFeet && heightInches) {
      // Convert feet/inches to cm
      const totalInches = parseInt(heightFeet) * 12 + parseInt(heightInches || "0");
      const cm = Math.round(totalInches * 2.54);
      setHeightCm(cm.toString());
    } else if (newSystem === "imperial" && heightCm) {
      // Convert cm to feet/inches
      const totalInches = Math.round(parseInt(heightCm) / 2.54);
      const feet = Math.floor(totalInches / 12);
      const inches = totalInches % 12;
      setHeightFeet(feet.toString());
      setHeightInches(inches.toString());
    }
    
    if (newSystem === "metric" && weightLbs) {
      // Convert lbs to kg
      const kg = Math.round(parseInt(weightLbs) * 0.453592);
      setWeightKg(kg.toString());
    } else if (newSystem === "imperial" && weightKg) {
      // Convert kg to lbs
      const lbs = Math.round(parseInt(weightKg) * 2.20462);
      setWeightLbs(lbs.toString());
    }
    
    updateFormState({ measurementSystem: newSystem });
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Physical Attributes</h3>
        <p className="text-muted-foreground">
          Tell us about your physical attributes to help personalize your experience
        </p>
      </div>
      
      {/* Measurement System Toggle */}
      <div className="flex items-center justify-end space-x-2 mb-4">
        <Label htmlFor="measurement-system" className="text-sm">Imperial</Label>
        <Switch
          id="measurement-system"
          checked={formState.measurementSystem === "metric"}
          onCheckedChange={toggleMeasurementSystem}
        />
        <Label htmlFor="measurement-system" className="text-sm">Metric</Label>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Age Input */}
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min="12"
              max="18"
              placeholder="Your age"
              value={formState.age || ""}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : null;
                updateFormState({ age: value });
              }}
            />
          </div>

          {/* Height Input - Imperial */}
          {formState.measurementSystem === "imperial" && (
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="height-feet">Height</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Enter your height in feet and inches</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Select 
                    value={heightFeet} 
                    onValueChange={setHeightFeet}
                  >
                    <SelectTrigger id="height-feet">
                      <SelectValue placeholder="ft" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 8 }, (_, i) => i + 3).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} ft
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select 
                    value={heightInches} 
                    onValueChange={setHeightInches}
                  >
                    <SelectTrigger id="height-inches">
                      <SelectValue placeholder="in" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} in
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Height Input - Metric */}
          {formState.measurementSystem === "metric" && (
            <div className="space-y-2">
              <Label htmlFor="height-cm">Height (cm)</Label>
              <div className="relative">
                <Input
                  id="height-cm"
                  type="number"
                  min="100"
                  max="250"
                  placeholder="Height in centimeters"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-muted-foreground">cm</span>
                </div>
              </div>
            </div>
          )}

          {/* Weight Input - Imperial */}
          {formState.measurementSystem === "imperial" && (
            <div className="space-y-2">
              <Label htmlFor="weight-lbs">Weight (lbs)</Label>
              <div className="relative">
                <Input
                  id="weight-lbs"
                  type="number"
                  min="50"
                  max="350"
                  placeholder="Weight in pounds"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                  className="pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-muted-foreground">lbs</span>
                </div>
              </div>
            </div>
          )}

          {/* Weight Input - Metric */}
          {formState.measurementSystem === "metric" && (
            <div className="space-y-2">
              <Label htmlFor="weight-kg">Weight (kg)</Label>
              <div className="relative">
                <Input
                  id="weight-kg"
                  type="number"
                  min="30"
                  max="160"
                  placeholder="Weight in kilograms"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-muted-foreground">kg</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {/* School */}
          <div className="space-y-2">
            <Label htmlFor="school">School Name</Label>
            <Input
              id="school"
              placeholder="Your current school"
              value={formState.school}
              onChange={(e) => updateFormState({ school: e.target.value })}
            />
          </div>
          
          {/* Graduation Year */}
          <div className="space-y-2">
            <Label htmlFor="graduation-year">Expected Graduation Year</Label>
            <Select 
              value={formState.graduationYear?.toString() || ""}
              onValueChange={(value) => 
                updateFormState({ graduationYear: parseInt(value) })
              }
            >
              <SelectTrigger id="graduation-year">
                <SelectValue placeholder="Select graduation year" />
              </SelectTrigger>
              <SelectContent>
                {GRADUATION_YEARS.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Measurement Tips */}
          <Card className="p-4 bg-muted/50 border-dashed mt-6">
            <div className="flex items-start space-x-3">
              <Ruler className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <h4 className="font-medium text-sm">Measurement Tips:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground mt-1">
                  <li>• For accurate height, measure without shoes</li>
                  <li>• For weight, measure in the morning for consistency</li>
                  <li>• Use recent measurements for best results</li>
                  <li>• You can switch between imperial and metric systems anytime</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}