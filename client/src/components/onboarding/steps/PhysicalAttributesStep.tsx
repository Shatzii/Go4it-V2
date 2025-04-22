import React, { useState, useEffect } from "react";
import { ProfileWizardState } from "../ProfileCompletionWizard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Ruler, Weight, GraduationCap, School } from "lucide-react";

interface PhysicalAttributesStepProps {
  formState: ProfileWizardState;
  updateFormState: (data: Partial<ProfileWizardState>) => void;
}

export default function PhysicalAttributesStep({ formState, updateFormState }: PhysicalAttributesStepProps) {
  // Derived state from formState
  const [feet, setFeet] = useState<string>("");
  const [inches, setInches] = useState<string>("");
  const [cm, setCm] = useState<string>("");
  const [lbs, setLbs] = useState<string>("");
  const [kg, setKg] = useState<string>("");
  
  // Graduation Year options (current year + 6 years)
  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 7 }, (_, i) => currentYear + i);
  
  // Parse height from formState on initial load
  useEffect(() => {
    if (formState.measurementSystem === "imperial" && formState.height) {
      // Parse height in imperial (feet and inches)
      if (formState.height.includes("'")) {
        const [feetStr, inchesStr] = formState.height.split("'");
        setFeet(feetStr.trim());
        setInches(inchesStr.replace('"', '').trim());
      }
    } else if (formState.measurementSystem === "metric" && formState.height) {
      // Parse height in metric (cm)
      setCm(formState.height.replace('cm', '').trim());
    }
  }, [formState.height, formState.measurementSystem]);
  
  // Parse weight from formState on initial load
  useEffect(() => {
    if (formState.measurementSystem === "imperial" && formState.weight) {
      // Parse weight in imperial (lbs)
      setLbs(formState.weight.replace('lbs', '').trim());
    } else if (formState.measurementSystem === "metric" && formState.weight) {
      // Parse weight in metric (kg)
      setKg(formState.weight.replace('kg', '').trim());
    }
  }, [formState.weight, formState.measurementSystem]);
  
  // Handle measurement system change
  const handleMeasurementSystemChange = (value: string) => {
    updateFormState({ measurementSystem: value });
    
    // Convert height and weight if changing systems
    if (value === "imperial" && formState.height && formState.height.includes('cm')) {
      // Convert cm to feet/inches
      const heightCm = parseFloat(formState.height.replace('cm', '').trim());
      if (!isNaN(heightCm)) {
        const heightInches = heightCm / 2.54;
        const feet = Math.floor(heightInches / 12);
        const inches = Math.round(heightInches % 12);
        updateFormState({ height: `${feet}'${inches}"` });
      }
    } else if (value === "metric" && formState.height && formState.height.includes("'")) {
      // Convert feet/inches to cm
      const [feetStr, inchesStr] = formState.height.split("'");
      const feet = parseInt(feetStr.trim());
      const inches = parseInt(inchesStr.replace('"', '').trim());
      if (!isNaN(feet) && !isNaN(inches)) {
        const heightCm = Math.round((feet * 12 + inches) * 2.54);
        updateFormState({ height: `${heightCm}cm` });
      }
    }
    
    // Convert weight
    if (value === "imperial" && formState.weight && formState.weight.includes('kg')) {
      // Convert kg to lbs
      const weightKg = parseFloat(formState.weight.replace('kg', '').trim());
      if (!isNaN(weightKg)) {
        const weightLbs = Math.round(weightKg * 2.20462);
        updateFormState({ weight: `${weightLbs}lbs` });
      }
    } else if (value === "metric" && formState.weight && formState.weight.includes('lbs')) {
      // Convert lbs to kg
      const weightLbs = parseFloat(formState.weight.replace('lbs', '').trim());
      if (!isNaN(weightLbs)) {
        const weightKg = Math.round(weightLbs / 2.20462);
        updateFormState({ weight: `${weightKg}kg` });
      }
    }
  };
  
  // Update height in imperial
  const updateImperialHeight = () => {
    if (feet || inches) {
      const feetVal = feet ? parseInt(feet) : 0;
      const inchesVal = inches ? parseInt(inches) : 0;
      if (!isNaN(feetVal) && !isNaN(inchesVal)) {
        updateFormState({ height: `${feetVal}'${inchesVal}"` });
      }
    }
  };
  
  // Update height in metric
  const updateMetricHeight = () => {
    if (cm) {
      const cmVal = parseInt(cm);
      if (!isNaN(cmVal)) {
        updateFormState({ height: `${cmVal}cm` });
      }
    }
  };
  
  // Update weight in imperial
  const updateImperialWeight = () => {
    if (lbs) {
      const lbsVal = parseInt(lbs);
      if (!isNaN(lbsVal)) {
        updateFormState({ weight: `${lbsVal}lbs` });
      }
    }
  };
  
  // Update weight in metric
  const updateMetricWeight = () => {
    if (kg) {
      const kgVal = parseInt(kg);
      if (!isNaN(kgVal)) {
        updateFormState({ weight: `${kgVal}kg` });
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Your Physical Attributes</h3>
        <p className="text-muted-foreground">
          This helps us tailor training plans to your physical capabilities
        </p>
      </div>
      
      {/* Measurement System Selection */}
      <div className="space-y-2">
        <Label>Measurement System</Label>
        <RadioGroup
          value={formState.measurementSystem}
          onValueChange={handleMeasurementSystemChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="imperial" id="imperial" />
            <Label htmlFor="imperial">Imperial (ft/in, lbs)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="metric" id="metric" />
            <Label htmlFor="metric">Metric (cm, kg)</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Physical Attributes */}
      <div className="space-y-4">
        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <div className="relative">
            <Input
              id="age"
              type="number"
              placeholder="Your age"
              min={8}
              max={22}
              value={formState.age || ""}
              onChange={(e) => updateFormState({ age: parseInt(e.target.value) || null })}
              className="pl-10"
            />
            <span className="absolute left-3 top-2.5 text-muted-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            We focus on student athletes between 12-18 years old
          </p>
        </div>
        
        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          {formState.measurementSystem === "imperial" ? (
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="height-feet"
                  type="number"
                  placeholder="Feet"
                  min={3}
                  max={8}
                  value={feet}
                  onChange={(e) => {
                    setFeet(e.target.value);
                    // Update after a short delay
                    setTimeout(updateImperialHeight, 300);
                  }}
                  className="pl-10"
                />
                <span className="absolute left-3 top-2.5 text-muted-foreground">
                  <Ruler className="h-5 w-5" />
                </span>
              </div>
              <div className="relative flex-1">
                <Input
                  id="height-inches"
                  type="number"
                  placeholder="Inches"
                  min={0}
                  max={11}
                  value={inches}
                  onChange={(e) => {
                    setInches(e.target.value);
                    // Update after a short delay
                    setTimeout(updateImperialHeight, 300);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="relative">
              <Input
                id="height-cm"
                type="number"
                placeholder="Centimeters"
                min={90}
                max={220}
                value={cm}
                onChange={(e) => {
                  setCm(e.target.value);
                  // Update after a short delay
                  setTimeout(updateMetricHeight, 300);
                }}
                className="pl-10"
              />
              <span className="absolute left-3 top-2.5 text-muted-foreground">
                <Ruler className="h-5 w-5" />
              </span>
            </div>
          )}
        </div>
        
        {/* Weight */}
        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          {formState.measurementSystem === "imperial" ? (
            <div className="relative">
              <Input
                id="weight-lbs"
                type="number"
                placeholder="Pounds"
                min={50}
                max={350}
                value={lbs}
                onChange={(e) => {
                  setLbs(e.target.value);
                  // Update after a short delay
                  setTimeout(updateImperialWeight, 300);
                }}
                className="pl-10"
              />
              <span className="absolute left-3 top-2.5 text-muted-foreground">
                <Weight className="h-5 w-5" />
              </span>
            </div>
          ) : (
            <div className="relative">
              <Input
                id="weight-kg"
                type="number"
                placeholder="Kilograms"
                min={23}
                max={160}
                value={kg}
                onChange={(e) => {
                  setKg(e.target.value);
                  // Update after a short delay
                  setTimeout(updateMetricWeight, 300);
                }}
                className="pl-10"
              />
              <span className="absolute left-3 top-2.5 text-muted-foreground">
                <Weight className="h-5 w-5" />
              </span>
            </div>
          )}
        </div>
        
        {/* School Information */}
        <div className="space-y-2">
          <Label htmlFor="school">School</Label>
          <div className="relative">
            <Input
              id="school"
              placeholder="Your school name"
              value={formState.school || ""}
              onChange={(e) => updateFormState({ school: e.target.value })}
              className="pl-10"
            />
            <span className="absolute left-3 top-2.5 text-muted-foreground">
              <School className="h-5 w-5" />
            </span>
          </div>
        </div>
        
        {/* Graduation Year */}
        <div className="space-y-2">
          <Label htmlFor="graduation-year">Expected Graduation Year</Label>
          <select
            id="graduation-year"
            className="w-full p-2 border rounded-md bg-background"
            value={formState.graduationYear || ""}
            onChange={(e) => updateFormState({ 
              graduationYear: e.target.value ? parseInt(e.target.value) : null 
            })}
          >
            <option value="">Select graduation year</option>
            {graduationYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Helpful Tips Card */}
      <Card className="p-4 bg-muted/50 border-dashed">
        <h4 className="font-medium mb-2">Tips:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Your physical attributes help coaches find athletes that fit their team needs</li>
          <li>• This information also helps us personalize your training recommendations</li>
          <li>• All information is kept private and only shared with coaches you approve</li>
        </ul>
      </Card>
    </div>
  );
}