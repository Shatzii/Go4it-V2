import { useMeasurement } from "@/contexts/measurement-context";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Ruler, Weight, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function MeasurementToggle() {
  const { system, toggleSystem } = useMeasurement();
  
  return (
    <div className="flex items-center space-x-2 bg-card p-2 rounded-md">
      <div className="flex items-center mr-1">
        {system === 'metric' ? <Ruler className="h-4 w-4" /> : <Weight className="h-4 w-4" />}
      </div>
      
      <Switch 
        id="measurement-mode" 
        checked={system === 'imperial'} 
        onCheckedChange={toggleSystem}
      />
      
      <Label htmlFor="measurement-mode" className="text-sm cursor-pointer">
        {system === 'metric' ? 'Metric (cm/kg)' : 'Imperial (ft/lbs)'}
      </Label>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle between metric and imperial measurement systems</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}