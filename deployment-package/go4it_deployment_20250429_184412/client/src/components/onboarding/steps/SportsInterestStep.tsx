import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, PlusCircle } from "lucide-react";

// Sports options
const SPORTS = [
  { id: "basketball", name: "Basketball", positions: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"] },
  { id: "football", name: "Football", positions: ["Quarterback", "Running Back", "Wide Receiver", "Tight End", "Offensive Line", "Defensive Line", "Linebacker", "Cornerback", "Safety", "Kicker", "Punter"] },
  { id: "soccer", name: "Soccer", positions: ["Goalkeeper", "Defender", "Midfielder", "Forward", "Striker", "Sweeper", "Winger"] },
  { id: "baseball", name: "Baseball", positions: ["Pitcher", "Catcher", "First Base", "Second Base", "Third Base", "Shortstop", "Left Field", "Center Field", "Right Field", "Designated Hitter"] },
  { id: "volleyball", name: "Volleyball", positions: ["Setter", "Outside Hitter", "Middle Blocker", "Opposite", "Libero", "Defensive Specialist"] },
  { id: "track", name: "Track & Field", positions: ["Sprinter", "Middle Distance", "Long Distance", "Hurdler", "Jumper", "Thrower", "Pole Vaulter", "Multi-Event"] },
  { id: "swimming", name: "Swimming", positions: ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Individual Medley"] },
  { id: "tennis", name: "Tennis", positions: ["Singles", "Doubles"] },
  { id: "golf", name: "Golf", positions: [] },
  { id: "wrestling", name: "Wrestling", positions: [] },
];

// Skill levels
const SKILL_LEVELS = [
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced" },
  { id: "elite", name: "Elite" },
];

// Form schema with validation
const formSchema = z.object({
  sports: z.array(z.string()).min(1, {
    message: "Please select at least one sport",
  }),
  positions: z.array(z.string()),
  level: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface SportsInterestStepProps {
  data: {
    sports: string[];
    positions: string[];
    level: string;
  };
  updateData: (data: Partial<FormValues>) => void;
}

export default function SportsInterestStep({
  data,
  updateData,
}: SportsInterestStepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sports: data.sports,
      positions: data.positions,
      level: data.level || "beginner",
    },
  });

  const [selectedSportId, setSelectedSportId] = useState<string>("");
  const [availablePositions, setAvailablePositions] = useState<string[]>([]);

  // When form values change, update parent component's state
  const onValuesChange = (values: Partial<FormValues>) => {
    updateData(values);
  };

  // Function to handle sport selection
  const handleSportSelect = (sportId: string) => {
    // Check if already selected
    if (form.getValues("sports").includes(sportId)) {
      return;
    }

    // Add sport to selected list
    const updatedSports = [...form.getValues("sports"), sportId];
    form.setValue("sports", updatedSports);
    onValuesChange({ sports: updatedSports });
    setSelectedSportId("");
  };

  // Function to remove a sport
  const handleRemoveSport = (sportId: string) => {
    const updatedSports = form.getValues("sports").filter(
      (id) => id !== sportId
    );
    
    // Also remove any positions for the removed sport
    const sportPositions = SPORTS.find(sport => sport.id === sportId)?.positions || [];
    const updatedPositions = form.getValues("positions").filter(
      position => !sportPositions.includes(position)
    );
    
    form.setValue("sports", updatedSports);
    form.setValue("positions", updatedPositions);
    
    onValuesChange({ 
      sports: updatedSports,
      positions: updatedPositions
    });
  };

  // Function to get the name of a sport by ID
  const getSportName = (sportId: string) => {
    const sport = SPORTS.find((s) => s.id === sportId);
    return sport ? sport.name : sportId;
  };

  // Get positions for selected sports
  const getAvailablePositions = () => {
    const selectedSports = form.getValues("sports");
    
    const positions: string[] = [];
    
    selectedSports.forEach(sportId => {
      const sport = SPORTS.find(s => s.id === sportId);
      if (sport && sport.positions.length > 0) {
        positions.push(...sport.positions);
      }
    });
    
    return positions;
  };

  // Toggle position selection
  const togglePosition = (position: string) => {
    const currentPositions = form.getValues("positions");
    let updatedPositions: string[];
    
    if (currentPositions.includes(position)) {
      updatedPositions = currentPositions.filter(p => p !== position);
    } else {
      updatedPositions = [...currentPositions, position];
    }
    
    form.setValue("positions", updatedPositions);
    onValuesChange({ positions: updatedPositions });
  };

  // Check if any selected sport has positions
  const hasPositions = () => {
    const selectedSports = form.getValues("sports");
    return selectedSports.some(sportId => {
      const sport = SPORTS.find(s => s.id === sportId);
      return sport && sport.positions.length > 0;
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Sports Interest</h2>
      <p className="text-muted-foreground">
        Tell us about the sports you play to receive personalized training recommendations.
      </p>

      <Form {...form}>
        <form
          onChange={() => onValuesChange(form.getValues())}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="sports"
            render={() => (
              <FormItem>
                <FormLabel>Your Sports</FormLabel>
                <FormDescription>
                  Select the sports you play or are interested in.
                </FormDescription>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {form.getValues("sports").length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                      No sports selected yet
                    </p>
                  ) : (
                    form.getValues("sports").map((sportId) => (
                      <Badge key={sportId} className="py-1 px-3">
                        {getSportName(sportId)}
                        <button
                          type="button"
                          className="ml-2 text-muted hover:text-foreground"
                          onClick={() => handleRemoveSport(sportId)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <Select
                    value={selectedSportId}
                    onValueChange={(value) => setSelectedSportId(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a sport to add" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPORTS.map((sport) => (
                        <SelectItem key={sport.id} value={sport.id}>
                          {sport.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={!selectedSportId}
                    onClick={() => handleSportSelect(selectedSportId)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {hasPositions() && (
            <FormField
              control={form.control}
              name="positions"
              render={() => (
                <FormItem>
                  <FormLabel>Positions</FormLabel>
                  <FormDescription>
                    Select the positions you play in your selected sports.
                  </FormDescription>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {getAvailablePositions().map((position) => (
                      <FormItem
                        key={position}
                        className="flex items-center space-x-2 space-y-0"
                      >
                        <FormControl>
                          <Checkbox 
                            checked={form.getValues("positions").includes(position)} 
                            onCheckedChange={() => togglePosition(position)}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {position}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Level</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    onValuesChange({ level: value });
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your skill level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SKILL_LEVELS.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  This helps us recommend appropriate drills and training.
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