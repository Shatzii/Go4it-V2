'use client'

import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Eye, EyeOff, Palette, Type, MousePointer, Settings, Contrast, Zap } from 'lucide-react'

interface AccessibilitySettings {
  voiceNavigation: boolean
  highContrast: boolean
  largeText: boolean
  colorBlindFriendly: boolean
  reducedMotion: boolean
  keyboardNavigation: boolean
  screenReader: boolean
  focusIndicators: boolean
  complexityLevel: 'simple' | 'standard' | 'advanced'
  fontSize: number
  lineHeight: number
  letterSpacing: number
}

export function AccessibilityEnhancements() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    voiceNavigation: false,
    highContrast: false,
    largeText: false,
    colorBlindFriendly: false,
    reducedMotion: false,
    keyboardNavigation: true,
    screenReader: false,
    focusIndicators: true,
    complexityLevel: 'standard',
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0
  })
  const [isListening, setIsListening] = useState(false)
  const [voiceCommands, setVoiceCommands] = useState<string[]>([])

  useEffect(() => {
    // Load accessibility settings from localStorage
    const savedSettings = localStorage.getItem('accessibilitySettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
    
    // Apply accessibility settings to document
    applyAccessibilitySettings()
  }, [])

  useEffect(() => {
    // Save settings to localStorage whenever they change
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings))
    applyAccessibilitySettings()
  }, [settings])

  const applyAccessibilitySettings = () => {
    const root = document.documentElement
    
    // High contrast mode
    if (settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Large text
    if (settings.largeText) {
      root.style.fontSize = `${settings.fontSize}px`
    } else {
      root.style.fontSize = '16px'
    }
    
    // Color blind friendly
    if (settings.colorBlindFriendly) {
      root.classList.add('color-blind-friendly')
    } else {
      root.classList.remove('color-blind-friendly')
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }
    
    // Focus indicators
    if (settings.focusIndicators) {
      root.classList.add('enhanced-focus')
    } else {
      root.classList.remove('enhanced-focus')
    }
    
    // Typography adjustments
    root.style.setProperty('--line-height', settings.lineHeight.toString())
    root.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`)
    
    // Complexity level
    root.setAttribute('data-complexity', settings.complexityLevel)
  }

  const startVoiceNavigation = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      
      recognition.onstart = () => {
        setIsListening(true)
      }
      
      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase()
        handleVoiceCommand(transcript)
      }
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      recognition.onend = () => {
        setIsListening(false)
      }
      
      recognition.start()
    }
  }

  const handleVoiceCommand = (command: string) => {
    setVoiceCommands(prev => [...prev, command])
    
    // Navigation commands
    if (command.includes('go to dashboard')) {
      window.location.href = '/dashboard'
    } else if (command.includes('go to academy')) {
      window.location.href = '/academy'
    } else if (command.includes('go to upload')) {
      window.location.href = '/upload'
    } else if (command.includes('open search')) {
      // Trigger global search
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    } else if (command.includes('increase text size')) {
      updateSetting('fontSize', Math.min(settings.fontSize + 2, 24))
    } else if (command.includes('decrease text size')) {
      updateSetting('fontSize', Math.max(settings.fontSize - 2, 12))
    } else if (command.includes('high contrast on')) {
      updateSetting('highContrast', true)
    } else if (command.includes('high contrast off')) {
      updateSetting('highContrast', false)
    } else if (command.includes('read this')) {
      readPageContent()
    }
  }

  const readPageContent = () => {
    if ('speechSynthesis' in window) {
      const text = document.body.innerText
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings({
      voiceNavigation: false,
      highContrast: false,
      largeText: false,
      colorBlindFriendly: false,
      reducedMotion: false,
      keyboardNavigation: true,
      screenReader: false,
      focusIndicators: true,
      complexityLevel: 'standard',
      fontSize: 16,
      lineHeight: 1.5,
      letterSpacing: 0
    })
  }

  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        aria-label="Open accessibility settings"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Accessibility Settings</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <p className="text-slate-400 mt-2">
                Customize your experience for better accessibility
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Voice Navigation */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Voice Navigation
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Enable voice commands</span>
                  <button
                    onClick={() => updateSetting('voiceNavigation', !settings.voiceNavigation)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.voiceNavigation ? 'bg-blue-600' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.voiceNavigation ? 'transform translate-x-6' : ''
                    }`} />
                  </button>
                </div>
                {settings.voiceNavigation && (
                  <div className="space-y-2">
                    <button
                      onClick={startVoiceNavigation}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isListening 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isListening ? 'Stop Listening' : 'Start Voice Commands'}
                    </button>
                    <div className="text-sm text-slate-400">
                      Try: "go to dashboard", "increase text size", "high contrast on", "read this"
                    </div>
                  </div>
                )}
              </div>

              {/* Visual Settings */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Visual Settings
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">High contrast mode</span>
                    <button
                      onClick={() => updateSetting('highContrast', !settings.highContrast)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.highContrast ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.highContrast ? 'transform translate-x-6' : ''
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Color blind friendly</span>
                    <button
                      onClick={() => updateSetting('colorBlindFriendly', !settings.colorBlindFriendly)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.colorBlindFriendly ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.colorBlindFriendly ? 'transform translate-x-6' : ''
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Reduced motion</span>
                    <button
                      onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.reducedMotion ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.reducedMotion ? 'transform translate-x-6' : ''
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Typography
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Font Size: {settings.fontSize}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={settings.fontSize}
                      onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Line Height: {settings.lineHeight}
                    </label>
                    <input
                      type="range"
                      min="1.2"
                      max="2.0"
                      step="0.1"
                      value={settings.lineHeight}
                      onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      Letter Spacing: {settings.letterSpacing}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      value={settings.letterSpacing}
                      onChange={(e) => updateSetting('letterSpacing', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Interface Complexity */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Interface Complexity
                </h3>
                
                <div className="grid grid-cols-3 gap-2">
                  {(['simple', 'standard', 'advanced'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => updateSetting('complexityLevel', level)}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        settings.complexityLevel === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
                
                <div className="text-sm text-slate-400">
                  {settings.complexityLevel === 'simple' && 'Simplified interface with fewer options'}
                  {settings.complexityLevel === 'standard' && 'Balanced interface with essential features'}
                  {settings.complexityLevel === 'advanced' && 'Full interface with all features visible'}
                </div>
              </div>

              {/* Screen Reader */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Screen Reader
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Enhanced screen reader support</span>
                  <button
                    onClick={() => updateSetting('screenReader', !settings.screenReader)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings.screenReader ? 'bg-blue-600' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.screenReader ? 'transform translate-x-6' : ''
                    }`} />
                  </button>
                </div>
                
                <button
                  onClick={readPageContent}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Read Current Page
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-slate-700">
                <button
                  onClick={resetSettings}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Reset to Default
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Apply Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}