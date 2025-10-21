'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Focus,
  Timer,
  Volume2,
  Eye,
  Palette,
  Move,
  HeartHandshake,
  Settings,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';

interface AccessibilitySettings {
  adhd: {
    focusTimer: boolean;
    breakReminders: boolean;
    chunkContent: boolean;
    timerDuration: number;
    breakDuration: number;
  };
  dyslexia: {
    dyslexicFont: boolean;
    textToSpeech: boolean;
    highlightReading: boolean;
    lineSpacing: number;
    fontSize: number;
  };
  autism: {
    reducedMotion: boolean;
    predictableLayout: boolean;
    sensoryBreaks: boolean;
    visualSupports: boolean;
  };
  general: {
    darkMode: boolean;
    highContrast: boolean;
    reducedAnimations: boolean;
    keyboardNavigation: boolean;
  };
}

export function NeurodivergenSupport() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    adhd: {
      focusTimer: false,
      breakReminders: false,
      chunkContent: false,
      timerDuration: 25,
      breakDuration: 5,
    },
    dyslexia: {
      dyslexicFont: false,
      textToSpeech: false,
      highlightReading: false,
      lineSpacing: 1.5,
      fontSize: 16,
    },
    autism: {
      reducedMotion: false,
      predictableLayout: false,
      sensoryBreaks: false,
      visualSupports: false,
    },
    general: {
      darkMode: false,
      highContrast: false,
      reducedAnimations: false,
      keyboardNavigation: false,
    },
  });

  const [focusTimer, setFocusTimer] = useState({
    isActive: false,
    timeLeft: 25 * 60,
    isBreak: false,
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    applySettings();
  }, [settings]);

  // Focus timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (focusTimer.isActive && focusTimer.timeLeft > 0) {
      interval = setInterval(() => {
        setFocusTimer((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (focusTimer.timeLeft === 0) {
      // Timer finished
      setFocusTimer((prev) => ({
        ...prev,
        isActive: false,
        isBreak: !prev.isBreak,
        timeLeft: prev.isBreak
          ? settings.adhd.timerDuration * 60
          : settings.adhd.breakDuration * 60,
      }));

      // Play notification sound
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(focusTimer.isBreak ? 'Break time!' : 'Focus time!', {
          body: focusTimer.isBreak ? 'Time to take a break' : 'Time to focus',
          icon: '/favicon.ico',
        });
      }
    }

    return () => clearInterval(interval);
  }, [focusTimer.isActive, focusTimer.timeLeft, focusTimer.isBreak, settings.adhd]);

  const applySettings = () => {
    const root = document.documentElement;

    // Apply dyslexia font
    if (settings.dyslexia.dyslexicFont) {
      root.style.setProperty('--font-family', 'OpenDyslexic, sans-serif');
    } else {
      root.style.removeProperty('--font-family');
    }

    // Apply line spacing
    root.style.setProperty('--line-height', settings.dyslexia.lineSpacing.toString());

    // Apply font size
    root.style.setProperty('--font-size-base', `${settings.dyslexia.fontSize}px`);

    // Apply dark mode
    if (settings.general.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply high contrast
    if (settings.general.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (settings.autism.reducedMotion || settings.general.reducedAnimations) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  };

  const updateSetting = (category: keyof AccessibilitySettings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const startFocusTimer = () => {
    setFocusTimer((prev) => ({
      ...prev,
      isActive: true,
      timeLeft: settings.adhd.timerDuration * 60,
      isBreak: false,
    }));
  };

  const pauseFocusTimer = () => {
    setFocusTimer((prev) => ({
      ...prev,
      isActive: false,
    }));
  };

  const resetFocusTimer = () => {
    setFocusTimer({
      isActive: false,
      timeLeft: settings.adhd.timerDuration * 60,
      isBreak: false,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Neurodivergent Support
        </CardTitle>
        <CardDescription>
          Customize your learning experience with specialized accommodations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="adhd" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="adhd" className="flex items-center gap-2">
              <Focus className="w-4 h-4" />
              ADHD
            </TabsTrigger>
            <TabsTrigger value="dyslexia" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Dyslexia
            </TabsTrigger>
            <TabsTrigger value="autism" className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4" />
              Autism
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="adhd" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">ADHD Accommodations</h3>

              {/* Focus Timer */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    Pomodoro Focus Timer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Enable Focus Timer</span>
                    <Switch
                      checked={settings.adhd.focusTimer}
                      onCheckedChange={(checked) => updateSetting('adhd', 'focusTimer', checked)}
                    />
                  </div>

                  {settings.adhd.focusTimer && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">
                          {formatTime(focusTimer.timeLeft)}
                        </div>
                        <Badge variant={focusTimer.isBreak ? 'secondary' : 'default'}>
                          {focusTimer.isBreak ? 'Break Time' : 'Focus Time'}
                        </Badge>
                      </div>

                      <div className="flex justify-center gap-2">
                        <Button
                          onClick={focusTimer.isActive ? pauseFocusTimer : startFocusTimer}
                          variant={focusTimer.isActive ? 'secondary' : 'default'}
                        >
                          {focusTimer.isActive ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button onClick={resetFocusTimer} variant="outline">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Focus Duration (minutes)</label>
                        <Slider
                          value={[settings.adhd.timerDuration]}
                          onValueChange={(value) =>
                            updateSetting('adhd', 'timerDuration', value[0])
                          }
                          max={60}
                          min={5}
                          step={5}
                          className="w-full"
                        />
                        <span className="text-sm text-gray-600">
                          {settings.adhd.timerDuration} minutes
                        </span>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Break Duration (minutes)</label>
                        <Slider
                          value={[settings.adhd.breakDuration]}
                          onValueChange={(value) =>
                            updateSetting('adhd', 'breakDuration', value[0])
                          }
                          max={30}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <span className="text-sm text-gray-600">
                          {settings.adhd.breakDuration} minutes
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Other ADHD settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Break Reminders</span>
                    <p className="text-sm text-gray-600">Get reminded to take breaks</p>
                  </div>
                  <Switch
                    checked={settings.adhd.breakReminders}
                    onCheckedChange={(checked) => updateSetting('adhd', 'breakReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Chunk Content</span>
                    <p className="text-sm text-gray-600">Break lessons into smaller sections</p>
                  </div>
                  <Switch
                    checked={settings.adhd.chunkContent}
                    onCheckedChange={(checked) => updateSetting('adhd', 'chunkContent', checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dyslexia" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dyslexia Support</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">OpenDyslexic Font</span>
                    <p className="text-sm text-gray-600">Use dyslexia-friendly font</p>
                  </div>
                  <Switch
                    checked={settings.dyslexia.dyslexicFont}
                    onCheckedChange={(checked) =>
                      updateSetting('dyslexia', 'dyslexicFont', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Text-to-Speech</span>
                    <p className="text-sm text-gray-600">Listen to text content</p>
                  </div>
                  <Switch
                    checked={settings.dyslexia.textToSpeech}
                    onCheckedChange={(checked) =>
                      updateSetting('dyslexia', 'textToSpeech', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Reading Highlights</span>
                    <p className="text-sm text-gray-600">Highlight text while reading</p>
                  </div>
                  <Switch
                    checked={settings.dyslexia.highlightReading}
                    onCheckedChange={(checked) =>
                      updateSetting('dyslexia', 'highlightReading', checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Line Spacing</label>
                  <Slider
                    value={[settings.dyslexia.lineSpacing]}
                    onValueChange={(value) => updateSetting('dyslexia', 'lineSpacing', value[0])}
                    max={3}
                    min={1}
                    step={0.1}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{settings.dyslexia.lineSpacing}x</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Size</label>
                  <Slider
                    value={[settings.dyslexia.fontSize]}
                    onValueChange={(value) => updateSetting('dyslexia', 'fontSize', value[0])}
                    max={24}
                    min={12}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{settings.dyslexia.fontSize}px</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="autism" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Autism Support</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Reduced Motion</span>
                    <p className="text-sm text-gray-600">Minimize animations and transitions</p>
                  </div>
                  <Switch
                    checked={settings.autism.reducedMotion}
                    onCheckedChange={(checked) => updateSetting('autism', 'reducedMotion', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Predictable Layout</span>
                    <p className="text-sm text-gray-600">Keep consistent page structure</p>
                  </div>
                  <Switch
                    checked={settings.autism.predictableLayout}
                    onCheckedChange={(checked) =>
                      updateSetting('autism', 'predictableLayout', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Sensory Breaks</span>
                    <p className="text-sm text-gray-600">Schedule regular sensory breaks</p>
                  </div>
                  <Switch
                    checked={settings.autism.sensoryBreaks}
                    onCheckedChange={(checked) => updateSetting('autism', 'sensoryBreaks', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Visual Supports</span>
                    <p className="text-sm text-gray-600">Enhanced visual cues and icons</p>
                  </div>
                  <Switch
                    checked={settings.autism.visualSupports}
                    onCheckedChange={(checked) =>
                      updateSetting('autism', 'visualSupports', checked)
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">General Accessibility</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Dark Mode</span>
                    <p className="text-sm text-gray-600">Use dark theme</p>
                  </div>
                  <Switch
                    checked={settings.general.darkMode}
                    onCheckedChange={(checked) => updateSetting('general', 'darkMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">High Contrast</span>
                    <p className="text-sm text-gray-600">Increase color contrast</p>
                  </div>
                  <Switch
                    checked={settings.general.highContrast}
                    onCheckedChange={(checked) => updateSetting('general', 'highContrast', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Reduced Animations</span>
                    <p className="text-sm text-gray-600">Minimize motion effects</p>
                  </div>
                  <Switch
                    checked={settings.general.reducedAnimations}
                    onCheckedChange={(checked) =>
                      updateSetting('general', 'reducedAnimations', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Enhanced Keyboard Navigation</span>
                    <p className="text-sm text-gray-600">Improve keyboard accessibility</p>
                  </div>
                  <Switch
                    checked={settings.general.keyboardNavigation}
                    onCheckedChange={(checked) =>
                      updateSetting('general', 'keyboardNavigation', checked)
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
