import React, { useState } from "react";
import { ProfileWizardState } from "../ProfileCompletionWizard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Check } from "lucide-react";

interface SportsInterestStepProps {
  formState: ProfileWizardState;
  updateFormState: (data: Partial<ProfileWizardState>) => void;
}

// List of sports supported by the platform
const SUPPORTED_SPORTS = [
  { id: "basketball", name: "Basketball", positions: ["Guard", "Forward", "Center"] },
  { id: "football", name: "Football", positions: ["Quarterback", "Running Back", "Wide Receiver", "Tight End", "Offensive Line", "Defensive Line", "Linebacker", "Cornerback", "Safety", "Special Teams"] },
  { id: "soccer", name: "Soccer", positions: ["Goalkeeper", "Defender", "Midfielder", "Forward"] },
  { id: "baseball", name: "Baseball", positions: ["Pitcher", "Catcher", "Infielder", "Outfielder"] },
  { id: "volleyball", name: "Volleyball", positions: ["Setter", "Outside Hitter", "Middle Blocker", "Opposite Hitter", "Libero"] },
  { id: "track", name: "Track & Field", positions: ["Sprinter", "Distance Runner", "Jumper", "Thrower", "Hurdler"] },
  { id: "swimming", name: "Swimming", positions: ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Individual Medley"] },
  { id: "tennis", name: "Tennis", positions: ["Singles Player", "Doubles Player"] },
  { id: "golf", name: "Golf", positions: [""] },
  { id: "wrestling", name: "Wrestling", positions: [""] },
];

export default function SportsInterestStep({ formState, updateFormState }: SportsInterestStepProps) {
  const [newSport, setNewSport] = useState<string>("");
  
  // Get positions for the primary sport (first in the list)
  const primarySport = formState.sportsInterest?.[0];
  const primarySportInfo = SUPPORTED_SPORTS.find(sport => sport.id === primarySport);
  const positions = primarySportInfo?.positions || [];
  
  // Handle adding a new sport
  const handleAddSport = () => {
    if (!newSport) return;
    
    // Don't add duplicate sports
    if (formState.sportsInterest?.includes(newSport)) {
      setNewSport("");
      return;
    }
    
    const updatedSports = [...(formState.sportsInterest || []), newSport];
    updateFormState({ sportsInterest: updatedSports });
    setNewSport("");
  };
  
  // Handle removing a sport
  const handleRemoveSport = (sportToRemove: string) => {
    const updatedSports = formState.sportsInterest?.filter(
      sport => sport !== sportToRemove
    ) || [];
    
    // If the primary sport is removed, also reset the position
    if (sportToRemove === primarySport) {
      updateFormState({ 
        sportsInterest: updatedSports,
        position: "" 
      });
    } else {
      updateFormState({ sportsInterest: updatedSports });
    }
  };
  
  // Handle sport selection
  const handleSportSelection = (sportId: string) => {
    // If sport is already selected, remove it
    if (formState.sportsInterest?.includes(sportId)) {
      handleRemoveSport(sportId);
      return;
    }
    
    // Otherwise add it
    const updatedSports = [...(formState.sportsInterest || []), sportId];
    updateFormState({ sportsInterest: updatedSports });
    
    // If this is the first sport, reset position
    if (formState.sportsInterest?.length === 0) {
      updateFormState({ position: "" });
    }
  };
  
  // Handle position selection
  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormState({ position: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">What sports are you interested in?</h3>
        <p className="text-muted-foreground">
          Select all the sports you play or want to explore
        </p>
      </div>
      
      {/* Sports Selection */}
      <div className="space-y-4">
        <Label htmlFor="sports">Select your sports <span className="text-destructive">*</span></Label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {SUPPORTED_SPORTS.map(sport => (
            <Card 
              key={sport.id}
              className={`p-3 cursor-pointer transition-all hover:shadow-md flex flex-col items-center justify-center text-center ${
                formState.sportsInterest?.includes(sport.id) 
                  ? "border-primary bg-primary/10" 
                  : "border-border"
              }`}
              onClick={() => handleSportSelection(sport.id)}
            >
              <div className="mb-2">
                {formState.sportsInterest?.includes(sport.id) ? (
                  <div className="rounded-full bg-primary text-primary-foreground p-1 h-6 w-6 flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="rounded-full bg-muted p-1 h-6 w-6"></div>
                )}
              </div>
              <span className="text-sm font-medium">{sport.name}</span>
            </Card>
          ))}
        </div>
        
        {/* Selected Sports Summary */}
        <div className="pt-4">
          <Label>Your selected sports:</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {formState.sportsInterest?.length ? (
              formState.sportsInterest.map(sportId => {
                const sport = SUPPORTED_SPORTS.find(s => s.id === sportId);
                return (
                  <Badge key={sportId} variant="secondary" className="px-3 py-1">
                    {sport?.name || sportId}
                    <button 
                      type="button" 
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSport(sportId);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No sports selected yet</p>
            )}
          </div>
        </div>
        
        {/* Position Selection - Only show if at least one sport is selected */}
        {formState.sportsInterest?.length > 0 && (
          <div className="pt-4">
            <Label htmlFor="position">What's your primary position?</Label>
            <select
              id="position"
              className="w-full p-2 mt-1 border rounded-md bg-background"
              value={formState.position}
              onChange={handlePositionChange}
            >
              <option value="">Select your primary position</option>
              {positions.map(position => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Based on your primary sport: {primarySportInfo?.name || primarySport}
            </p>
          </div>
        )}
        
        {/* Custom Sport Entry */}
        <div className="pt-4">
          <Label htmlFor="custom-sport">Don't see your sport? Add it here:</Label>
          <div className="flex mt-1">
            <Input
              id="custom-sport"
              value={newSport}
              onChange={(e) => setNewSport(e.target.value)}
              placeholder="E.g., Lacrosse, Hockey, etc."
              className="flex-1"
            />
            <button
              type="button"
              onClick={handleAddSport}
              disabled={!newSport}
              className="ml-2 px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      
      {/* Helpful Tips Card */}
      <Card className="p-4 bg-muted/50 border-dashed">
        <h4 className="font-medium mb-2">Tips:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• You can select multiple sports that you're interested in</li>
          <li>• Your primary sport will be used to match you with suitable coaches</li>
          <li>• Adding your position helps with personalized training plans</li>
        </ul>
      </Card>
    </div>
  );
}