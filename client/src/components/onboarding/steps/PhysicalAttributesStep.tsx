import React, { useEffect } from "react";
import { ProfileWizardState } from "../ProfileCompletionWizard";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Props type
interface PhysicalAttributesStepProps {
  formState: ProfileWizardState;
  updateFormState: (data: Partial<ProfileWizardState>) => void;
}

// Form schema
const physicalAttributesSchema = z.object({
  age: z.number().min(12, "Age must be at least 12").max(18, "Age must be 18 or under").optional().nullable(),
  height: z.string().optional(),
  weight: z.string().optional(),
  school: z.string().min(2, "School name must be at least 2 characters").optional(),
  graduationYear: z.number().min(2024, "Graduation year must be 2024 or later").optional().nullable(),
  measurementSystem: z.enum(["imperial", "metric"]),
});

type PhysicalAttributesValues = z.infer<typeof physicalAttributesSchema>;

// Generate graduation year options (current year + 6 years)
const currentYear = new Date().getFullYear();
const graduationYearOptions = Array.from({ length: 7 }, (_, i) => currentYear + i);

/**
 * Physical Attributes Step
 * 
 * Third step in the profile completion wizard that collects physical attributes.
 */
export default function PhysicalAttributesStep({ formState, updateFormState }: PhysicalAttributesStepProps) {
  const form = useForm<PhysicalAttributesValues>({
    resolver: zodResolver(physicalAttributesSchema),
    defaultValues: {
      age: formState.age,
      height: formState.height || "",
      weight: formState.weight || "",
      school: formState.school || "",
      graduationYear: formState.graduationYear,
      measurementSystem: formState.measurementSystem as "imperial" | "metric" || "imperial",
    },
  });
  
  // Handle form submission
  const onSubmit = (data: PhysicalAttributesValues) => {
    updateFormState(data);
  };
  
  // Watch form changes and update parent state
  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormState(value as Partial<ProfileWizardState>);
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormState]);
  
  // Handle measurement system change
  const handleMeasurementSystemChange = (value: "imperial" | "metric") => {
    form.setValue("measurementSystem", value);
    
    // Convert height and weight if there are values
    if (form.getValues("height") && form.getValues("weight")) {
      const height = form.getValues("height");
      const weight = form.getValues("weight");
      
      // If switching to metric from imperial
      if (value === "metric" && formState.measurementSystem === "imperial") {
        // Convert height (assuming format like "6'2")
        try {
          const heightMatch = height.match(/(\d+)'(\d+)/);
          if (heightMatch) {
            const feet = parseInt(heightMatch[1]);
            const inches = parseInt(heightMatch[2]);
            const totalCm = Math.round((feet * 30.48) + (inches * 2.54));
            form.setValue("height", `${totalCm} cm`);
          }
          
          // Convert weight (assuming lbs)
          const weightLbs = parseFloat(weight.replace(" lbs", ""));
          if (!isNaN(weightLbs)) {
            const weightKg = Math.round(weightLbs * 0.453592);
            form.setValue("weight", `${weightKg} kg`);
          }
        } catch (e) {
          // If conversion fails, leave as is
          console.error("Error converting measurements:", e);
        }
      }
      
      // If switching to imperial from metric
      else if (value === "imperial" && formState.measurementSystem === "metric") {
        // Convert height (assuming format like "180 cm")
        try {
          const heightCm = parseFloat(height.replace(" cm", ""));
          if (!isNaN(heightCm)) {
            const totalInches = heightCm / 2.54;
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12);
            form.setValue("height", `${feet}'${inches}`);
          }
          
          // Convert weight (assuming kg)
          const weightKg = parseFloat(weight.replace(" kg", ""));
          if (!isNaN(weightKg)) {
            const weightLbs = Math.round(weightKg * 2.20462);
            form.setValue("weight", `${weightLbs} lbs`);
          }
        } catch (e) {
          // If conversion fails, leave as is
          console.error("Error converting measurements:", e);
        }
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Physical Information</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your physical attributes and school information to help us 
          provide personalized recommendations.
        </p>
      </div>
      
      {/* Measurement System Selection */}
      <div className="space-y-2">
        <Label>Measurement System</Label>
        <RadioGroup
          value={form.getValues("measurementSystem")}
          onValueChange={(value) => handleMeasurementSystemChange(value as "imperial" | "metric")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="imperial" id="imperial" />
            <Label htmlFor="imperial" className="cursor-pointer">Imperial (ft/in, lbs)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="metric" id="metric" />
            <Label htmlFor="metric" className="cursor-pointer">Metric (cm, kg)</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Age */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter your age"
                    min={12}
                    max={18}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : null;
                      field.onChange(value);
                    }}
                    value={field.value === null ? "" : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Height */}
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input
                    placeholder={form.getValues("measurementSystem") === "imperial" ? "e.g. 6'2" : "e.g. 188 cm"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Weight */}
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input
                    placeholder={form.getValues("measurementSystem") === "imperial" ? "e.g. 175 lbs" : "e.g. 79 kg"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* School */}
          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your school name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Graduation Year */}
          <FormField
            control={form.control}
            name="graduationYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Graduation Year</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString() || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your graduation year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {graduationYearOptions.map((year) => (
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
        </form>
      </Form>
    </div>
  );
}