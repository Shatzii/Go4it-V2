import React, { useState } from "react";
import { ProfileWizardState } from "../ProfileCompletionWizard";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Award,
  PenTool, 
  Sparkles,
  Star,
  Trophy,
  X,
  Plus
} from "lucide-react";

interface SportOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  positions: string[];
}

interface SportsInterestStepProps {
  formState: ProfileWizardState;
  updateFormState: (data: Partial<ProfileWizardState>) => void;
}

// List of available sports
const SPORTS: SportOption[] = [
  { 
    id: "basketball", 
    name: "Basketball",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dribbble"><circle cx="12" cy="12" r="10"/><path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"/><path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"/><path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"/></svg>,
    positions: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"] 
  },
  { 
    id: "football", 
    name: "Football",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shirt"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>,
    positions: ["Quarterback", "Running Back", "Wide Receiver", "Tight End", "Offensive Line", "Defensive Line", "Linebacker", "Cornerback", "Safety", "Kicker", "Punter"]
  },
  { 
    id: "soccer", 
    name: "Soccer",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-dot"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>,
    positions: ["Goalkeeper", "Defender", "Midfielder", "Forward", "Striker", "Winger"]
  },
  { 
    id: "baseball", 
    name: "Baseball",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-ellipsis"><circle cx="12" cy="12" r="10"/><path d="M17 12h.01"/><path d="M12 12h.01"/><path d="M7 12h.01"/></svg>,
    positions: ["Pitcher", "Catcher", "First Base", "Second Base", "Third Base", "Shortstop", "Left Field", "Center Field", "Right Field"]
  },
  { 
    id: "volleyball", 
    name: "Volleyball",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dot"><circle cx="12.1" cy="12.1" r="1"/></svg>,
    positions: ["Setter", "Outside Hitter", "Middle Blocker", "Opposite", "Libero"]
  },
  { 
    id: "track", 
    name: "Track & Field",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>,
    positions: ["Sprinter", "Distance Runner", "Hurdler", "Jumper", "Thrower", "Pole Vaulter"]
  },
  { 
    id: "swimming", 
    name: "Swimming",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wave"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>,
    positions: ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Individual Medley", "Distance"]
  },
  { 
    id: "tennis", 
    name: "Tennis",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8c0 2-2 3-4 4.5-2 1.5-4 2.5-4 4.5 0 1.5 1 3 3 3 1.4 0 2.8-1 3-2"/><path d="M8 9.5c0 1.5 1 3 3 3 1.5 0 3-1 3-3 0-1.5-1-3-3-3s-3 1.25-3 3z"/></svg>,
    positions: ["Singles Player", "Doubles Player"]
  },
  { 
    id: "golf", 
    name: "Golf",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 14c3.31 0 6-1.34 6-3s-2.69-3-6-3-6 1.34-6 3 2.69 3 6 3"/><path d="M12 14v7"/><path d="M10 19h4"/><path d="M12 3v4.5"/><path d="m14 5-4 2.5"/></svg>,
    positions: ["Golfer"]
  },
  { 
    id: "wrestling", 
    name: "Wrestling",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4a2 2 0 1 1 4 0v9.5a5.5 5.5 0 0 1-5.5 5.5H13"/><path d="M12 4a2 2 0 1 0-4 0v9.5a5.5 5.5 0 0 0 5.5 5.5H11"/><path d="M6 10h12"/></svg>, 
    positions: ["Lightweight", "Middleweight", "Heavyweight"]
  }
];

export default function SportsInterestStep({
  formState,
  updateFormState
}: SportsInterestStepProps) {
  const [showSelectPosition, setShowSelectPosition] = useState<string | null>(null);
  
  // Find sport by ID
  const findSport = (sportId: string): SportOption | undefined => {
    return SPORTS.find(sport => sport.id === sportId);
  };
  
  // Add sport to selected sports
  const addSport = (sportId: string) => {
    // Check if sport is already added
    if (formState.selectedSports.some(sport => sport.id === sportId)) {
      return;
    }
    
    const sport = findSport(sportId);
    if (!sport) return;
    
    const newSport = {
      id: sport.id,
      name: sport.name,
      position: "",
      isPrimary: formState.selectedSports.length === 0, // First sport is primary by default
      skillLevel: "beginner"
    };
    
    updateFormState({
      selectedSports: [...formState.selectedSports, newSport]
    });
    
    // Show position selector
    setShowSelectPosition(sportId);
  };
  
  // Remove sport from selected sports
  const removeSport = (sportId: string) => {
    const updatedSports = formState.selectedSports.filter(
      sport => sport.id !== sportId
    );
    
    // If we removed the primary sport, set the first remaining sport as primary
    let updatedSportsWithPrimary = [...updatedSports];
    if (updatedSports.length > 0 && !updatedSports.some(sport => sport.isPrimary)) {
      updatedSportsWithPrimary = updatedSports.map((sport, index) => 
        index === 0 ? { ...sport, isPrimary: true } : sport
      );
    }
    
    updateFormState({
      selectedSports: updatedSportsWithPrimary
    });
    
    // If position selector is open for this sport, close it
    if (showSelectPosition === sportId) {
      setShowSelectPosition(null);
    }
  };
  
  // Update sport position
  const updateSportPosition = (sportId: string, position: string) => {
    const updatedSports = formState.selectedSports.map(sport => 
      sport.id === sportId ? { ...sport, position } : sport
    );
    
    updateFormState({
      selectedSports: updatedSports
    });
  };
  
  // Update sport skill level
  const updateSportSkillLevel = (sportId: string, skillLevel: string) => {
    const updatedSports = formState.selectedSports.map(sport => 
      sport.id === sportId ? { ...sport, skillLevel } : sport
    );
    
    updateFormState({
      selectedSports: updatedSports
    });
  };
  
  // Set sport as primary
  const setSportAsPrimary = (sportId: string) => {
    const updatedSports = formState.selectedSports.map(sport => ({
      ...sport,
      isPrimary: sport.id === sportId
    }));
    
    updateFormState({
      selectedSports: updatedSports
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Sports Interests</h3>
        <p className="text-muted-foreground">
          Select the sports you play and your position
        </p>
      </div>
      
      {/* Selected Sports */}
      <div className="space-y-4">
        {formState.selectedSports.length > 0 ? (
          formState.selectedSports.map(sport => {
            const sportDetails = findSport(sport.id);
            return (
              <Card key={sport.id} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      {sportDetails?.icon}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">{sport.name}</h4>
                        {sport.isPrimary && (
                          <Badge variant="secondary" className="ml-2 px-1.5 py-0">
                            <Star className="h-3 w-3 mr-1" />
                            Primary
                          </Badge>
                        )}
                      </div>
                      {sport.position && (
                        <p className="text-sm text-muted-foreground">
                          {sport.position} • {sport.skillLevel.charAt(0).toUpperCase() + sport.skillLevel.slice(1)} level
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!sport.isPrimary && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSportAsPrimary(sport.id)}
                      >
                        <Star className="h-3.5 w-3.5 mr-1" />
                        Make Primary
                      </Button>
                    )}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeSport(sport.id)}
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
                
                {/* Position and Skill Level Selection */}
                {showSelectPosition === sport.id || !sport.position ? (
                  <div className="mt-4 grid sm:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <Label htmlFor={`position-${sport.id}`}>Position</Label>
                      <Select 
                        value={sport.position} 
                        onValueChange={(value) => updateSportPosition(sport.id, value)}
                      >
                        <SelectTrigger id={`position-${sport.id}`}>
                          <SelectValue placeholder="Select your position" />
                        </SelectTrigger>
                        <SelectContent>
                          {sportDetails?.positions.map(position => (
                            <SelectItem key={position} value={position}>
                              {position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`skill-${sport.id}`}>Skill Level</Label>
                      <Select 
                        value={sport.skillLevel} 
                        onValueChange={(value) => updateSportSkillLevel(sport.id, value)}
                      >
                        <SelectTrigger id={`skill-${sport.id}`}>
                          <SelectValue placeholder="Select your skill level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="elite">Elite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="mt-2 pl-0"
                    onClick={() => setShowSelectPosition(sport.id)}
                  >
                    <PenTool className="h-3.5 w-3.5 mr-1" />
                    Edit position or skill level
                  </Button>
                )}
              </Card>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h4 className="font-medium mb-2">No sports selected yet</h4>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Select sports from the list below to add them to your profile. Your primary sport 
              will be featured more prominently on your profile.
            </p>
          </div>
        )}
      </div>
      
      {/* Available Sports to Add */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Add Sports</h4>
          {formState.selectedSports.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {formState.selectedSports.length} of {SPORTS.length} selected
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {SPORTS.map(sport => {
            const isSelected = formState.selectedSports.some(s => s.id === sport.id);
            return (
              <Button
                key={sport.id}
                variant={isSelected ? "secondary" : "outline"}
                className={`h-20 justify-start flex-col items-center ${
                  isSelected ? "opacity-60 cursor-default" : ""
                }`}
                onClick={() => !isSelected && addSport(sport.id)}
                disabled={isSelected}
              >
                <div className="flex items-center justify-center w-6 h-6 mb-1">
                  {sport.icon}
                </div>
                <span>{sport.name}</span>
                {!isSelected && <Plus className="absolute bottom-2 right-2 h-3.5 w-3.5 opacity-60" />}
              </Button>
            );
          })}
        </div>
      </div>
      
      {/* Important Note */}
      <div className="flex items-start mt-6">
        <Sparkles className="h-5 w-5 mr-2 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Your primary sport will be featured prominently in your profile and used for 
          sport-specific recommendations. You can change this selection at any time.
        </p>
      </div>
      
      {/* Looking for College Scholarship */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div>
          <Label htmlFor="scholarship-switch" className="text-base">Looking for College Scholarship</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Enable if you're interested in pursuing athletic scholarships
          </p>
        </div>
        <Switch
          id="scholarship-switch"
          checked={formState.lookingForScholarship}
          onCheckedChange={(checked) => updateFormState({ lookingForScholarship: checked })}
        />
      </div>
    </div>
  );
}