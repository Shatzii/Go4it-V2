import React from "react";
import { ProfileWizardState } from "../ProfileCompletionWizard";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Props type
interface SportsInterestStepProps {
  formState: ProfileWizardState;
  updateFormState: (data: Partial<ProfileWizardState>) => void;
}

// Available sports options with appropriate positions
const SPORTS_OPTIONS = [
  {
    id: "basketball",
    name: "Basketball",
    positions: [
      "Point Guard",
      "Shooting Guard",
      "Small Forward",
      "Power Forward",
      "Center",
    ],
  },
  {
    id: "football",
    name: "Football",
    positions: [
      "Quarterback",
      "Wide Receiver",
      "Running Back",
      "Tight End",
      "Offensive Lineman",
      "Defensive Lineman",
      "Linebacker",
      "Cornerback",
      "Safety",
      "Kicker",
      "Punter",
    ],
  },
  {
    id: "soccer",
    name: "Soccer",
    positions: [
      "Goalkeeper",
      "Defender",
      "Midfielder",
      "Forward",
      "Striker",
      "Winger",
    ],
  },
  {
    id: "baseball",
    name: "Baseball",
    positions: [
      "Pitcher",
      "Catcher",
      "First Base",
      "Second Base",
      "Third Base",
      "Shortstop",
      "Left Field",
      "Center Field",
      "Right Field",
      "Designated Hitter",
    ],
  },
  {
    id: "volleyball",
    name: "Volleyball",
    positions: ["Setter", "Middle Blocker", "Outside Hitter", "Opposite Hitter", "Libero"],
  },
  {
    id: "track",
    name: "Track & Field",
    positions: [
      "Sprinter",
      "Distance Runner",
      "Hurdler",
      "High Jump",
      "Long Jump",
      "Triple Jump",
      "Pole Vault",
      "Shot Put",
      "Discus",
      "Javelin",
    ],
  },
  {
    id: "swimming",
    name: "Swimming",
    positions: [
      "Freestyle",
      "Backstroke",
      "Breaststroke",
      "Butterfly",
      "Individual Medley",
    ],
  },
  {
    id: "tennis",
    name: "Tennis",
    positions: ["Singles Player", "Doubles Player"],
  },
  {
    id: "golf",
    name: "Golf",
    positions: ["Golfer"],
  },
  {
    id: "wrestling",
    name: "Wrestling",
    positions: [
      "106 lbs",
      "113 lbs",
      "120 lbs",
      "126 lbs",
      "132 lbs",
      "138 lbs",
      "145 lbs",
      "152 lbs",
      "160 lbs",
      "170 lbs",
      "182 lbs",
      "195 lbs",
      "220 lbs",
      "Heavyweight",
    ],
  },
];

// Form schema
const sportsInterestSchema = z.object({
  sportsInterest: z.array(z.string()).min(1, "Please select at least one sport"),
  position: z.string().optional(),
});

type SportsInterestValues = z.infer<typeof sportsInterestSchema>;

/**
 * Sports Interest Step
 * 
 * Second step in the profile completion wizard that collects sports preferences.
 */
export default function SportsInterestStep({ formState, updateFormState }: SportsInterestStepProps) {
  // Find positions for primary sport
  const [primarySport, setPrimarySport] = React.useState(
    formState.sportsInterest && formState.sportsInterest.length > 0
      ? formState.sportsInterest[0]
      : ""
  );

  const [availablePositions, setAvailablePositions] = React.useState<string[]>([]);

  // Update available positions when primary sport changes
  React.useEffect(() => {
    if (primarySport) {
      const sport = SPORTS_OPTIONS.find((s) => s.id === primarySport);
      if (sport) {
        setAvailablePositions(sport.positions);
      } else {
        setAvailablePositions([]);
      }
    } else {
      setAvailablePositions([]);
    }
  }, [primarySport]);

  const form = useForm<SportsInterestValues>({
    resolver: zodResolver(sportsInterestSchema),
    defaultValues: {
      sportsInterest: formState.sportsInterest || [],
      position: formState.position || "",
    },
  });

  // Handle form submission
  const onSubmit = (data: SportsInterestValues) => {
    updateFormState(data);
  };

  // Watch sports interest changes to determine primary sport
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "sportsInterest" && value.sportsInterest) {
        // Set primary sport to first selected sport if available
        if (value.sportsInterest.length > 0 && value.sportsInterest[0] !== primarySport) {
          setPrimarySport(value.sportsInterest[0]);
          
          // Reset position if primary sport changes
          form.setValue("position", "");
        } else if (value.sportsInterest.length === 0) {
          setPrimarySport("");
          form.setValue("position", "");
        }
      }
      
      // Update parent state
      updateFormState(value as Partial<ProfileWizardState>);
    });
    
    return () => subscription.unsubscribe();
  }, [form, updateFormState, primarySport]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Select Sports</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Choose sports you're interested in or currently play. Your first selection will be considered your primary sport.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Sports Selection */}
          <FormField
            control={form.control}
            name="sportsInterest"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Sports</FormLabel>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {SPORTS_OPTIONS.map((sport) => (
                    <FormField
                      key={sport.id}
                      control={form.control}
                      name="sportsInterest"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={sport.id}
                            className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(sport.id)}
                                onCheckedChange={(checked) => {
                                  const updatedSports = checked
                                    ? [...field.value, sport.id]
                                    : field.value?.filter((s) => s !== sport.id);
                                  field.onChange(updatedSports);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {sport.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Primary Sport Badge */}
          {primarySport && (
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">Your Primary Sport:</p>
              <Badge variant="outline" className="w-fit px-4 py-1 border-primary/30 bg-primary/5">
                {SPORTS_OPTIONS.find((s) => s.id === primarySport)?.name || primarySport}
              </Badge>
            </div>
          )}

          {/* Position Selection - Only shown if primary sport is selected */}
          {primarySport && availablePositions.length > 0 && (
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availablePositions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </form>
      </Form>
    </div>
  );
}