import { useState, useEffect } from 'react';
import { AccessibilityIcon, ZoomIn, ZoomOut, Eye, SunMoon, Volume2, VolumeX } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLayout } from '@/contexts/layout-context';
import { SpeechSettings } from './speech-settings';
import { CSSTransition } from 'react-transition-group';

export function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { 
    focusMode, 
    toggleFocusMode,
    highContrast, 
    toggleHighContrast,
    textSize, 
    increaseTextSize, 
    decreaseTextSize, 
    resetTextSize,
    speechSettings,
    toggleSpeech
  } = useLayout();
  
  // Close the panel when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);
  
  // Function to toggle the panel
  const togglePanel = () => {
    setIsOpen(prev => !prev);
  };
  
  // Handle text size changes with feedback
  const handleIncreaseTextSize = () => {
    if (textSize === 'x-large') {
      toast({
        title: 'Maximum text size reached',
        description: 'The text is already at its maximum size',
      });
      return;
    }
    
    increaseTextSize();
    toast({
      title: 'Text size increased',
      description: `Text size is now ${textSize === 'normal' ? 'large' : 'extra large'}`,
    });
  };
  
  const handleDecreaseTextSize = () => {
    if (textSize === 'normal') {
      toast({
        title: 'Minimum text size reached',
        description: 'The text is already at its default size',
      });
      return;
    }
    
    decreaseTextSize();
    toast({
      title: 'Text size decreased',
      description: `Text size is now ${textSize === 'x-large' ? 'large' : 'normal'}`,
    });
  };
  
  const handleResetTextSize = () => {
    if (textSize === 'normal') {
      toast({
        title: 'Text size is already default',
        description: 'No changes were made',
      });
      return;
    }
    
    resetTextSize();
    toast({
      title: 'Text size reset',
      description: 'Text size has been reset to default',
    });
  };
  
  return (
    <div className="accessibility-controls">
      {/* Toggle button */}
      <div
        className="accessibility-toggle"
        onClick={togglePanel}
        aria-label="Accessibility settings"
        role="button"
        tabIndex={0}
      >
        <AccessibilityIcon color="white" />
      </div>
      
      {/* Settings panel with animation */}
      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="accessibility-panel"
        unmountOnExit
      >
        <div className="accessibility-panel">
          <h3 className="text-lg font-semibold mb-4">Accessibility Settings</h3>
          
          <Tabs defaultValue="display">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="speech">Speech</TabsTrigger>
            </TabsList>
            
            {/* Display Settings */}
            <TabsContent value="display" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="focus-mode">Focus Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Reduces distractions on the page
                  </p>
                </div>
                <Switch
                  id="focus-mode"
                  checked={focusMode}
                  onCheckedChange={toggleFocusMode}
                  aria-label="Toggle focus mode"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast">High Contrast</Label>
                  <p className="text-xs text-muted-foreground">
                    Increases contrast for better readability
                  </p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={toggleHighContrast}
                  aria-label="Toggle high contrast mode"
                />
              </div>
            </TabsContent>
            
            {/* Text Settings */}
            <TabsContent value="text" className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label>Text Size</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Adjust the size of text throughout the application
                </p>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDecreaseTextSize}
                    disabled={textSize === 'normal'}
                    className="flex-1"
                  >
                    <ZoomOut className="h-4 w-4 mr-2" />
                    Smaller
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetTextSize}
                    disabled={textSize === 'normal'}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleIncreaseTextSize}
                    disabled={textSize === 'x-large'}
                    className="flex-1"
                  >
                    <ZoomIn className="h-4 w-4 mr-2" />
                    Larger
                  </Button>
                </div>
                
                <div className="text-center text-sm mt-2">
                  Current: <span className="font-medium">{textSize === 'normal' ? 'Default' : textSize === 'large' ? 'Large' : 'Extra Large'}</span>
                </div>
              </div>
            </TabsContent>
            
            {/* Speech Settings */}
            <TabsContent value="speech" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-0.5">
                  <Label htmlFor="text-to-speech">Text-to-Speech</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable spoken content throughout the app
                  </p>
                </div>
                <Switch
                  id="text-to-speech"
                  checked={speechSettings.enabled}
                  onCheckedChange={toggleSpeech}
                  aria-label="Toggle text-to-speech"
                />
              </div>
              
              {speechSettings.enabled && (
                <SpeechSettings />
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-xs text-center text-muted-foreground">
            Press Escape to close this panel
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}