import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface LayoutContextType {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  colorContrast: string;
  setColorContrast: (mode: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Get saved settings from localStorage
const getSavedSettings = () => {
  if (typeof window !== 'undefined') {
    return {
      isFullscreen: localStorage.getItem('isFullscreen') === 'true',
      isFocusMode: localStorage.getItem('isFocusMode') === 'true',
      colorContrast: localStorage.getItem('colorContrast') || 'default'
    };
  }
  return {
    isFullscreen: false,
    isFocusMode: false,
    colorContrast: 'default'
  };
};

export function LayoutProvider({ children }: { children: ReactNode }) {
  const savedSettings = getSavedSettings();
  const [isFullscreen, setIsFullscreen] = useState(savedSettings.isFullscreen);
  const [isFocusMode, setIsFocusMode] = useState(savedSettings.isFocusMode);
  const [colorContrast, setColorContrastState] = useState(savedSettings.colorContrast);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('isFullscreen', String(isFullscreen));
    localStorage.setItem('isFocusMode', String(isFocusMode));
    localStorage.setItem('colorContrast', colorContrast);
    
    // Apply focus mode and color contrast classes to the document body
    if (isFocusMode) {
      document.body.classList.add('focus-mode');
    } else {
      document.body.classList.remove('focus-mode');
    }
    
    // Remove all contrast classes
    document.body.classList.remove('high-contrast', 'adhd-friendly', 'dyslexia-friendly');
    
    // Apply the selected contrast class
    if (colorContrast !== 'default') {
      document.body.classList.add(colorContrast);
    }
  }, [isFullscreen, isFocusMode, colorContrast]);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  const toggleFocusMode = () => {
    setIsFocusMode(prev => !prev);
  };

  const setColorContrast = (mode: string) => {
    setColorContrastState(mode);
  };

  return (
    <LayoutContext.Provider value={{ 
      isFullscreen, 
      toggleFullscreen,
      isFocusMode,
      toggleFocusMode,
      colorContrast,
      setColorContrast
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}