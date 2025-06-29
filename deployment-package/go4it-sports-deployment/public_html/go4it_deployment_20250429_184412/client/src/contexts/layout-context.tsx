import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LayoutContextType {
  // Focus mode
  focusMode: boolean;
  toggleFocusMode: () => void;
  
  // Color contrast
  highContrast: boolean;
  toggleHighContrast: () => void;
  
  // Text size
  textSize: 'normal' | 'large' | 'x-large';
  increaseTextSize: () => void;
  decreaseTextSize: () => void;
  resetTextSize: () => void;
  
  // Speech settings
  speechSettings: {
    enabled: boolean;
    rate: number;
    pitch: number;
    voice: string;
    volume: number;
  };
  toggleSpeech: () => void;
  updateSpeechSettings: (newSettings: Partial<typeof defaultSpeechSettings>) => void;
}

// Default values
const defaultSpeechSettings = {
  enabled: true,
  rate: 1.0,
  pitch: 1.0,
  voice: '',
  volume: 1.0,
};

// Create context with default values
const LayoutContext = createContext<LayoutContextType>({
  focusMode: false,
  toggleFocusMode: () => {},
  
  highContrast: false,
  toggleHighContrast: () => {},
  
  textSize: 'normal',
  increaseTextSize: () => {},
  decreaseTextSize: () => {},
  resetTextSize: () => {},
  
  speechSettings: defaultSpeechSettings,
  toggleSpeech: () => {},
  updateSpeechSettings: () => {},
});

export const useLayout = () => useContext(LayoutContext);

interface LayoutProviderProps {
  children: ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  // Initialize state, try to load from localStorage if available
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'x-large'>('normal');
  const [speechSettings, setSpeechSettings] = useState(defaultSpeechSettings);
  
  // Load saved settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Focus mode
      const savedFocusMode = localStorage.getItem('go4it-focus-mode');
      if (savedFocusMode) {
        setFocusMode(JSON.parse(savedFocusMode));
      }
      
      // High contrast
      const savedHighContrast = localStorage.getItem('go4it-high-contrast');
      if (savedHighContrast) {
        setHighContrast(JSON.parse(savedHighContrast));
      }
      
      // Text size
      const savedTextSize = localStorage.getItem('go4it-text-size');
      if (savedTextSize && ['normal', 'large', 'x-large'].includes(savedTextSize)) {
        setTextSize(savedTextSize as 'normal' | 'large' | 'x-large');
      }
      
      // Speech settings
      const savedSpeechSettings = localStorage.getItem('go4it-speech-settings');
      if (savedSpeechSettings) {
        try {
          const parsedSettings = JSON.parse(savedSpeechSettings);
          setSpeechSettings(prev => ({
            ...prev,
            ...parsedSettings,
          }));
        } catch (error) {
          console.error('Failed to parse saved speech settings:', error);
        }
      }
    }
  }, []);
  
  // Apply focus mode class to body
  useEffect(() => {
    if (focusMode) {
      document.body.classList.add('focus-mode');
    } else {
      document.body.classList.remove('focus-mode');
    }
    
    // Save to localStorage
    localStorage.setItem('go4it-focus-mode', JSON.stringify(focusMode));
  }, [focusMode]);
  
  // Apply high contrast class to body
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    // Save to localStorage
    localStorage.setItem('go4it-high-contrast', JSON.stringify(highContrast));
  }, [highContrast]);
  
  // Apply text size class to body
  useEffect(() => {
    // First remove all text size classes
    document.body.classList.remove('text-normal', 'text-large', 'text-x-large');
    
    // Then add the current text size class
    document.body.classList.add(`text-${textSize}`);
    
    // Save to localStorage
    localStorage.setItem('go4it-text-size', textSize);
  }, [textSize]);
  
  // Save speech settings to localStorage
  useEffect(() => {
    localStorage.setItem('go4it-speech-settings', JSON.stringify(speechSettings));
  }, [speechSettings]);
  
  // Toggle focus mode
  const toggleFocusMode = () => {
    setFocusMode(prev => !prev);
  };
  
  // Toggle high contrast
  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };
  
  // Text size controls
  const increaseTextSize = () => {
    setTextSize(prev => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'x-large';
      return prev;
    });
  };
  
  const decreaseTextSize = () => {
    setTextSize(prev => {
      if (prev === 'x-large') return 'large';
      if (prev === 'large') return 'normal';
      return prev;
    });
  };
  
  const resetTextSize = () => {
    setTextSize('normal');
  };
  
  // Toggle speech
  const toggleSpeech = () => {
    setSpeechSettings(prev => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  };
  
  // Update speech settings
  const updateSpeechSettings = (newSettings: Partial<typeof defaultSpeechSettings>) => {
    setSpeechSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };
  
  return (
    <LayoutContext.Provider
      value={{
        focusMode,
        toggleFocusMode,
        
        highContrast,
        toggleHighContrast,
        
        textSize,
        increaseTextSize,
        decreaseTextSize,
        resetTextSize,
        
        speechSettings,
        toggleSpeech,
        updateSpeechSettings,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}