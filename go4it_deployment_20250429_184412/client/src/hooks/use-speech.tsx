import { useState, useEffect, useRef, useCallback } from 'react';
import { useLayout } from '@/contexts/layout-context';

interface SpeechSettings {
  rate: number;
  pitch: number;
  voice: string;
  volume: number;
}

interface UseSpeechReturn {
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  voices: SpeechSynthesisVoice[];
  settings: SpeechSettings;
  updateSettings: (newSettings: Partial<SpeechSettings>) => void;
  speaking: boolean; // Alias for isSpeaking for backwards compatibility
}

export function useSpeech(): UseSpeechReturn {
  const { speechSettings, updateSpeechSettings } = useLayout();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Load available voices
  useEffect(() => {
    if (!speechSynthesis) return;
    
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        
        // Set default voice if not already set
        if (!speechSettings.voice && availableVoices.length > 0) {
          // Prefer English voice if available
          const englishVoice = availableVoices.find(voice => 
            voice.lang.includes('en-') && !voice.name.includes('Microsoft')
          );
          const defaultVoice = englishVoice || availableVoices[0];
          updateSpeechSettings({ voice: defaultVoice.name });
        }
      }
    };
    
    loadVoices();
    
    // Chrome loads voices asynchronously, so we need to listen for the voiceschanged event
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [speechSynthesis]);
  
  // Speak method
  const speak = useCallback((text: string) => {
    if (!speechSynthesis) return;
    
    // Cancel any ongoing speech
    if (isSpeaking) {
      speechSynthesis.cancel();
    }
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply settings
    utterance.rate = speechSettings.rate;
    utterance.pitch = speechSettings.pitch;
    utterance.volume = speechSettings.volume;
    
    // Set voice if specified
    if (speechSettings.voice) {
      const selectedVoice = voices.find(v => v.name === speechSettings.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    
    // Set event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };
    
    // Store reference to current utterance
    utteranceRef.current = utterance;
    
    // Start speaking
    speechSynthesis.speak(utterance);
  }, [speechSynthesis, voices, speechSettings, isSpeaking]);
  
  // Pause speech
  const pause = useCallback(() => {
    if (speechSynthesis && isSpeaking && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [speechSynthesis, isSpeaking, isPaused]);
  
  // Resume speech
  const resume = useCallback(() => {
    if (speechSynthesis && isSpeaking && isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [speechSynthesis, isSpeaking, isPaused]);
  
  // Cancel speech
  const cancel = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  }, [speechSynthesis]);
  
  // Update speech settings
  const updateSettings = useCallback((newSettings: Partial<SpeechSettings>) => {
    updateSpeechSettings(newSettings);
  }, [updateSpeechSettings]);

  // Alias speaking to isSpeaking to keep the API compatibility
  const speaking = isSpeaking;
  
  return {
    speak,
    pause,
    resume,
    cancel,
    isSpeaking,
    isPaused,
    voices,
    settings: speechSettings,
    updateSettings,
    speaking
  };
}