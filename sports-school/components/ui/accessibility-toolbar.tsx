'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { 
  Accessibility, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Type, 
  Palette, 
  MousePointer,
  Keyboard,
  Settings,
  X
} from 'lucide-react'

interface AccessibilitySettings {
  fontSize: number
  highContrast: boolean
  reducedMotion: boolean
  screenReader: boolean
  colorBlind: boolean
  keyboardNav: boolean
  focusVisible: boolean
  audioDescriptions: boolean
}

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    colorBlind: false,
    keyboardNav: false,
    focusVisible: false,
    audioDescriptions: false
  })

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save settings to localStorage and apply
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
    applySettings()
  }, [settings])

  const applySettings = () => {
    const root = document.documentElement

    // Font size
    root.style.fontSize = `${settings.fontSize}%`

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }

    // Color blind support
    if (settings.colorBlind) {
      root.classList.add('color-blind-support')
    } else {
      root.classList.remove('color-blind-support')
    }

    // Focus visible
    if (settings.focusVisible) {
      root.classList.add('focus-visible')
    } else {
      root.classList.remove('focus-visible')
    }

    // Keyboard navigation
    if (settings.keyboardNav) {
      root.classList.add('keyboard-nav')
    } else {
      root.classList.remove('keyboard-nav')
    }
  }

  const resetSettings = () => {
    setSettings({
      fontSize: 100,
      highContrast: false,
      reducedMotion: false,
      screenReader: false,
      colorBlind: false,
      keyboardNav: false,
      focusVisible: false,
      audioDescriptions: false
    })
  }

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const updateFontSize = (value: number[]) => {
    setSettings(prev => ({
      ...prev,
      fontSize: value[0]
    }))
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Accessibility Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        aria-label="Open accessibility settings"
      >
        <Accessibility className="h-6 w-6" />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <Card className="absolute bottom-14 right-0 w-80 shadow-xl border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibility
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                aria-label="Close accessibility settings"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Font Size */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Type className="h-4 w-4" />
                  Font Size: {settings.fontSize}%
                </label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={updateFontSize}
                  min={75}
                  max={200}
                  step={25}
                  className="w-full"
                />
              </div>

              {/* Visual Settings */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={settings.highContrast ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSetting('highContrast')}
                  className="flex items-center gap-2 text-xs"
                >
                  <Palette className="h-3 w-3" />
                  High Contrast
                </Button>

                <Button
                  variant={settings.colorBlind ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSetting('colorBlind')}
                  className="flex items-center gap-2 text-xs"
                >
                  <Eye className="h-3 w-3" />
                  Color Blind
                </Button>

                <Button
                  variant={settings.reducedMotion ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSetting('reducedMotion')}
                  className="flex items-center gap-2 text-xs"
                >
                  <MousePointer className="h-3 w-3" />
                  Reduced Motion
                </Button>

                <Button
                  variant={settings.focusVisible ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSetting('focusVisible')}
                  className="flex items-center gap-2 text-xs"
                >
                  <Eye className="h-3 w-3" />
                  Focus Visible
                </Button>
              </div>

              {/* Navigation Settings */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={settings.keyboardNav ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSetting('keyboardNav')}
                  className="flex items-center gap-2 text-xs"
                >
                  <Keyboard className="h-3 w-3" />
                  Keyboard Nav
                </Button>

                <Button
                  variant={settings.screenReader ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSetting('screenReader')}
                  className="flex items-center gap-2 text-xs"
                >
                  <Volume2 className="h-3 w-3" />
                  Screen Reader
                </Button>
              </div>

              {/* Audio Settings */}
              <Button
                variant={settings.audioDescriptions ? "default" : "outline"}
                size="sm"
                onClick={() => toggleSetting('audioDescriptions')}
                className="flex items-center gap-2 text-xs w-full"
              >
                {settings.audioDescriptions ? (
                  <Volume2 className="h-3 w-3" />
                ) : (
                  <VolumeX className="h-3 w-3" />
                )}
                Audio Descriptions
              </Button>

              {/* Reset Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={resetSettings}
                className="w-full text-xs"
              >
                <Settings className="h-3 w-3 mr-2" />
                Reset to Default
              </Button>

              {/* Active Features */}
              <div className="border-t pt-3">
                <p className="text-xs text-gray-600 mb-2">Active Features:</p>
                <div className="flex flex-wrap gap-1">
                  {settings.highContrast && (
                    <Badge variant="secondary" className="text-xs">High Contrast</Badge>
                  )}
                  {settings.reducedMotion && (
                    <Badge variant="secondary" className="text-xs">Reduced Motion</Badge>
                  )}
                  {settings.colorBlind && (
                    <Badge variant="secondary" className="text-xs">Color Blind</Badge>
                  )}
                  {settings.keyboardNav && (
                    <Badge variant="secondary" className="text-xs">Keyboard Nav</Badge>
                  )}
                  {settings.screenReader && (
                    <Badge variant="secondary" className="text-xs">Screen Reader</Badge>
                  )}
                  {settings.fontSize !== 100 && (
                    <Badge variant="secondary" className="text-xs">Font: {settings.fontSize}%</Badge>
                  )}
                  {Object.values(settings).every(v => v === false || v === 100) && (
                    <Badge variant="outline" className="text-xs">None Active</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}