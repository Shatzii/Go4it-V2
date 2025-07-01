import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Accessibility, 
  Volume2, 
  Eye, 
  Timer, 
  Focus, 
  Palette, 
  Type,
  Brain,
  Heart,
  Headphones
} from "lucide-react";
import { useState } from "react";

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  audioFeedback: boolean;
  focusMode: boolean;
  breakReminders: boolean;
  textSize: number;
  volumeLevel: number;
  colorTheme: string;
}

export default function AccessibilityPanel() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    audioFeedback: true,
    focusMode: false,
    breakReminders: true,
    textSize: 16,
    volumeLevel: 75,
    colorTheme: 'default'
  });

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify({
      ...settings,
      [key]: value
    }));
  };

  const neurodivergentSupport = [
    {
      icon: Brain,
      title: "ADHD Support",
      description: "Break timers, focus modes, and progress tracking",
      enabled: settings.breakReminders
    },
    {
      icon: Eye,
      title: "Visual Processing",
      description: "High contrast, reduced motion, clear layouts",
      enabled: settings.highContrast
    },
    {
      icon: Headphones,
      title: "Audio Cues",
      description: "Sound feedback for actions and achievements",
      enabled: settings.audioFeedback
    },
    {
      icon: Heart,
      title: "Stress Reduction",
      description: "Calm colors, gentle animations, positive reinforcement",
      enabled: true
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-primary" />
            Accessibility & Neurodivergent Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visual Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Visual Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <label className="font-medium">High Contrast</label>
                  <p className="text-sm text-muted-foreground">Enhanced visibility</p>
                </div>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <label className="font-medium">Reduced Motion</label>
                  <p className="text-sm text-muted-foreground">Minimal animations</p>
                </div>
                <Switch
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-medium flex items-center gap-2">
                <Type className="w-4 h-4" />
                Text Size: {settings.textSize}px
              </label>
              <Slider
                value={[settings.textSize]}
                onValueChange={([value]) => updateSetting('textSize', value)}
                min={12}
                max={24}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Audio Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Audio Settings
            </h3>
            
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <label className="font-medium">Audio Feedback</label>
                <p className="text-sm text-muted-foreground">Sound cues for actions</p>
              </div>
              <Switch
                checked={settings.audioFeedback}
                onCheckedChange={(checked) => updateSetting('audioFeedback', checked)}
              />
            </div>

            <div className="space-y-3">
              <label className="font-medium">Volume Level: {settings.volumeLevel}%</label>
              <Slider
                value={[settings.volumeLevel]}
                onValueChange={([value]) => updateSetting('volumeLevel', value)}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Focus & Concentration */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Focus className="w-4 h-4" />
              Focus & Concentration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <label className="font-medium">Focus Mode</label>
                  <p className="text-sm text-muted-foreground">Minimal distractions</p>
                </div>
                <Switch
                  checked={settings.focusMode}
                  onCheckedChange={(checked) => updateSetting('focusMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <label className="font-medium">Break Reminders</label>
                  <p className="text-sm text-muted-foreground">Regular rest alerts</p>
                </div>
                <Switch
                  checked={settings.breakReminders}
                  onCheckedChange={(checked) => updateSetting('breakReminders', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Neurodivergent Support Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Neurodivergent Support Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {neurodivergentSupport.map((feature, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <feature.icon className="w-5 h-5 text-primary mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{feature.title}</h4>
                      <Badge variant={feature.enabled ? "default" : "secondary"}>
                        {feature.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm">
          <Timer className="w-4 h-4 mr-2" />
          Start Focus Session
        </Button>
        <Button variant="outline" size="sm">
          <Palette className="w-4 h-4 mr-2" />
          Color Themes
        </Button>
        <Button variant="outline" size="sm">
          <Heart className="w-4 h-4 mr-2" />
          Wellness Check
        </Button>
      </div>
    </div>
  );
}