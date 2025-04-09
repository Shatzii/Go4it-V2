import { useState } from 'react';
import { Eye, Zap, Type, Settings, Info } from 'lucide-react';
import { useLayout } from '@/contexts/layout-context';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AccessibilityControls() {
  const { isFocusMode, toggleFocusMode, colorContrast, setColorContrast } = useLayout();
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Settings className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Accessibility settings</span>
                {isFocusMode && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Accessibility Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none mb-4 flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Accessibility Settings
          </h4>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <Label htmlFor="focus-mode">Focus Mode</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Reduces distractions by simplifying the interface
              </p>
            </div>
            <Switch
              id="focus-mode"
              checked={isFocusMode}
              onCheckedChange={toggleFocusMode}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Type className="h-4 w-4 mr-2" />
              <Label htmlFor="color-contrast">Color Contrast</Label>
            </div>
            <Select
              value={colorContrast}
              onValueChange={setColorContrast}
            >
              <SelectTrigger id="color-contrast" className="w-full">
                <SelectValue placeholder="Select contrast mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="high-contrast">High Contrast</SelectItem>
                <SelectItem value="adhd-friendly">ADHD Friendly</SelectItem>
                <SelectItem value="dyslexia-friendly">Dyslexia Friendly</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Adjusts colors to improve readability
            </p>
          </div>
          
          <div className="rounded-md bg-muted p-3 mt-2">
            <div className="flex items-start gap-3">
              <Info className="h-4 w-4 mt-1 shrink-0 text-primary" />
              <div className="text-xs text-muted-foreground">
                <p>These settings help improve your experience based on your needs.</p>
                <p className="mt-1">Your preferences will be saved for your next visit.</p>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}