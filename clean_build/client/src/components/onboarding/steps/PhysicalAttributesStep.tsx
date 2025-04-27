import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

// Form schema with validation
const formSchema = z.object({
  height: z.number().nullable().optional(),
  weight: z.number().nullable().optional(),
  wingspan: z.number().nullable().optional(),
  handedness: z.enum(["left", "right", "ambidextrous"]).nullable().optional(),
  verticalJump: z.number().nullable().optional(),
  measurementSystem: z.enum(["imperial", "metric"]).default("imperial"),
});

type FormValues = z.infer<typeof formSchema>;

interface PhysicalAttributesStepProps {
  data: {
    height: number | null;
    weight: number | null; 
    wingspan: number | null;
    handedness: "left" | "right" | "ambidextrous" | null;
    verticalJump: number | null;
    measurementSystem: "imperial" | "metric";
  };
  updateData: (data: Partial<FormValues>) => void;
}

export default function PhysicalAttributesStep({ 
  data, 
  updateData 
}: PhysicalAttributesStepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: data.height,
      weight: data.weight,
      wingspan: data.wingspan,
      handedness: data.handedness,
      verticalJump: data.verticalJump,
      measurementSystem: data.measurementSystem || "imperial",
    },
  });

  // When form values change, update parent component's state
  const onValuesChange = (values: Partial<FormValues>) => {
    updateData(values);
  };

  // Helper to format height display based on measurement system
  const formatHeight = (height: number | null): string => {
    if (height === null) return "Not set";
    
    if (form.getValues("measurementSystem") === "imperial") {
      const feet = Math.floor(height / 12);
      const inches = height % 12;
      return `${feet}'${inches}"`;
    } else {
      return `${height} cm`;
    }
  };

  // Helper to format weight display based on measurement system
  const formatWeight = (weight: number | null): string => {
    if (weight === null) return "Not set";
    
    if (form.getValues("measurementSystem") === "imperial") {
      return `${weight} lbs`;
    } else {
      return `${weight} kg`;
    }
  };
  
  // Helper to convert height when measurement system changes
  const convertHeight = (height: number | null, from: string, to: string): number | null => {
    if (height === null) return null;
    
    if (from === "imperial" && to === "metric") {
      // Convert inches to centimeters
      return Math.round(height * 2.54);
    } else if (from === "metric" && to === "imperial") {
      // Convert centimeters to inches
      return Math.round(height / 2.54);
    }
    
    return height;
  };
  
  // Helper to convert weight when measurement system changes
  const convertWeight = (weight: number | null, from: string, to: string): number | null => {
    if (weight === null) return null;
    
    if (from === "imperial" && to === "metric") {
      // Convert pounds to kilograms
      return Math.round(weight * 0.45359237);
    } else if (from === "metric" && to === "imperial") {
      // Convert kilograms to pounds
      return Math.round(weight / 0.45359237);
    }
    
    return weight;
  };

  // Handle measurement system change
  const handleMeasurementSystemChange = (value: "imperial" | "metric") => {
    const prevSystem = form.getValues("measurementSystem");
    
    if (value !== prevSystem) {
      const currentHeight = form.getValues("height");
      const currentWeight = form.getValues("weight");
      const currentWingspan = form.getValues("wingspan");
      const currentVerticalJump = form.getValues("verticalJump");
      
      // Update values based on new measurement system
      const updatedValues = {
        measurementSystem: value,
        height: convertHeight(currentHeight, prevSystem, value),
        weight: convertWeight(currentWeight, prevSystem, value),
        wingspan: convertHeight(currentWingspan, prevSystem, value),
        verticalJump: convertHeight(currentVerticalJump, prevSystem, value),
      };
      
      // Update form values
      form.setValue("measurementSystem", value);
      form.setValue("height", updatedValues.height);
      form.setValue("weight", updatedValues.weight);
      form.setValue("wingspan", updatedValues.wingspan);
      form.setValue("verticalJump", updatedValues.verticalJump);
      
      // Update parent state
      onValuesChange(updatedValues);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Physical Attributes</h2>
      <p className="text-muted-foreground">
        Tell us about your physical attributes to help coaches better understand
        your capabilities.
      </p>

      <Form {...form}>
        <form
          onChange={() => onValuesChange(form.getValues())}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="measurementSystem"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Measurement System</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value: "imperial" | "metric") => {
                      field.onChange(value);
                      handleMeasurementSystemChange(value);
                    }}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="imperial" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Imperial (ft/in, lbs)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="metric" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Metric (cm, kg)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Height {form.getValues("measurementSystem") === "imperial" ? "(inches)" : "(cm)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={
                        form.getValues("measurementSystem") === "imperial"
                          ? "Enter height in inches"
                          : "Enter height in cm"
                      }
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? null : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  {field.value !== null && (
                    <p className="text-xs text-muted-foreground">
                      {formatHeight(field.value)}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Weight {form.getValues("measurementSystem") === "imperial" ? "(lbs)" : "(kg)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={
                        form.getValues("measurementSystem") === "imperial"
                          ? "Enter weight in pounds"
                          : "Enter weight in kilograms"
                      }
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? null : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  {field.value !== null && (
                    <p className="text-xs text-muted-foreground">
                      {formatWeight(field.value)}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wingspan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Wingspan {form.getValues("measurementSystem") === "imperial" ? "(inches)" : "(cm)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={
                        form.getValues("measurementSystem") === "imperial"
                          ? "Enter wingspan in inches"
                          : "Enter wingspan in cm"
                      }
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? null : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="verticalJump"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Vertical Jump {form.getValues("measurementSystem") === "imperial" ? "(inches)" : "(cm)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={
                        form.getValues("measurementSystem") === "imperial"
                          ? "Enter vertical jump in inches"
                          : "Enter vertical jump in cm"
                      }
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? null : parseInt(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="handedness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Handedness</FormLabel>
                <Select
                  onValueChange={(value: "left" | "right" | "ambidextrous") => field.onChange(value)}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select handedness" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="right">Right-handed</SelectItem>
                    <SelectItem value="left">Left-handed</SelectItem>
                    <SelectItem value="ambidextrous">Ambidextrous</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Which hand do you primarily use in sports?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}