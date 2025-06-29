import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/use-speech';
import { Volume, VolumeX, Play } from 'lucide-react';

export function SpeechSettings() {
  const { 
    voices, 
    settings, 
    updateSettings, 
    speak, 
    isSpeaking 
  } = useSpeech();
  
  const handleRateChange = (value: number[]) => {
    updateSettings({ rate: value[0] });
  };
  
  const handlePitchChange = (value: number[]) => {
    updateSettings({ pitch: value[0] });
  };
  
  const handleVolumeChange = (value: number[]) => {
    updateSettings({ volume: value[0] });
  };
  
  const handleVoiceChange = (value: string) => {
    updateSettings({ voice: value });
  };
  
  const testVoice = () => {
    speak("Hello! This is a test of the text-to-speech feature. You can adjust the settings to customize how I sound.");
  };
  
  return (
    <div className="space-y-4">
      {/* Voice Selection */}
      <div>
        <Label htmlFor="voice-select" className="mb-1 block">Voice</Label>
        <Select value={settings.voice} onValueChange={handleVoiceChange}>
          <SelectTrigger id="voice-select">
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {voices.map((voice) => (
              <SelectItem key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Rate Slider */}
      <div>
        <div className="flex justify-between items-center">
          <Label htmlFor="rate-slider">Speed</Label>
          <span className="text-xs text-muted-foreground">{settings.rate.toFixed(1)}x</span>
        </div>
        <Slider
          id="rate-slider"
          value={[settings.rate]}
          min={0.5}
          max={2}
          step={0.1}
          onValueChange={handleRateChange}
          className="mt-2"
        />
      </div>
      
      {/* Pitch Slider */}
      <div>
        <div className="flex justify-between items-center">
          <Label htmlFor="pitch-slider">Pitch</Label>
          <span className="text-xs text-muted-foreground">{settings.pitch.toFixed(1)}</span>
        </div>
        <Slider
          id="pitch-slider"
          value={[settings.pitch]}
          min={0.5}
          max={2}
          step={0.1}
          onValueChange={handlePitchChange}
          className="mt-2"
        />
      </div>
      
      {/* Volume Slider */}
      <div>
        <div className="flex justify-between items-center">
          <Label htmlFor="volume-slider">
            <div className="flex items-center gap-1">
              {settings.volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume className="h-4 w-4" />
              )}
              <span>Volume</span>
            </div>
          </Label>
          <span className="text-xs text-muted-foreground">{Math.round(settings.volume * 100)}%</span>
        </div>
        <Slider
          id="volume-slider"
          value={[settings.volume]}
          min={0}
          max={1}
          step={0.1}
          onValueChange={handleVolumeChange}
          className="mt-2"
        />
      </div>
      
      {/* Test Button */}
      <div className="pt-2">
        <Button
          onClick={testVoice}
          disabled={isSpeaking}
          variant="outline"
          className="w-full"
        >
          <Play className="h-4 w-4 mr-2" />
          Test Voice Settings
        </Button>
      </div>
    </div>
  );
}