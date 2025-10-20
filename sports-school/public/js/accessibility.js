/**
 * ShatziiOS Accessibility System
 *
 * This script manages accessibility features for neurodivergent users,
 * including dyslexia-friendly fonts, high contrast mode, and more.
 */

// Initialize the global accessibility object
window.ShatziiAccessibility = (function () {
  // Available accessibility modes
  const ACCESSIBILITY_MODES = {
    STANDARD: 'standard',
    DYSLEXIA: 'dyslexia-friendly',
    HIGH_CONTRAST: 'high-contrast',
    ADHD: 'adhd-friendly',
    AUTISM: 'autism-friendly',
  };

  // Font options
  const FONT_OPTIONS = {
    STANDARD: 'standard',
    DYSLEXIC: 'dyslexic',
    SERIF: 'serif',
    SANS: 'sans-serif',
    MONO: 'monospace',
  };

  // Current settings
  let currentSettings = {
    mode: ACCESSIBILITY_MODES.STANDARD,
    fontSize: 16, // Base font size in pixels
    lineHeight: 1.5,
    letterSpacing: 'normal',
    wordSpacing: 'normal',
    useReadingRuler: false,
    font: FONT_OPTIONS.STANDARD,
    reducedMotion: false,
  };

  // Default settings for quick switching
  const PRESET_SETTINGS = {
    [ACCESSIBILITY_MODES.STANDARD]: {
      mode: ACCESSIBILITY_MODES.STANDARD,
      fontSize: 16,
      lineHeight: 1.5,
      letterSpacing: 'normal',
      wordSpacing: 'normal',
      useReadingRuler: false,
      font: FONT_OPTIONS.STANDARD,
      reducedMotion: false,
    },
    [ACCESSIBILITY_MODES.DYSLEXIA]: {
      mode: ACCESSIBILITY_MODES.DYSLEXIA,
      fontSize: 18,
      lineHeight: 1.8,
      letterSpacing: '0.05em',
      wordSpacing: '0.1em',
      useReadingRuler: true,
      font: FONT_OPTIONS.DYSLEXIC,
      reducedMotion: true,
    },
    [ACCESSIBILITY_MODES.HIGH_CONTRAST]: {
      mode: ACCESSIBILITY_MODES.HIGH_CONTRAST,
      fontSize: 16,
      lineHeight: 1.6,
      letterSpacing: 'normal',
      wordSpacing: 'normal',
      useReadingRuler: false,
      font: FONT_OPTIONS.SANS,
      reducedMotion: false,
    },
    [ACCESSIBILITY_MODES.ADHD]: {
      mode: ACCESSIBILITY_MODES.ADHD,
      fontSize: 16,
      lineHeight: 1.7,
      letterSpacing: 'normal',
      wordSpacing: '0.05em',
      useReadingRuler: true,
      font: FONT_OPTIONS.SANS,
      reducedMotion: true,
    },
    [ACCESSIBILITY_MODES.AUTISM]: {
      mode: ACCESSIBILITY_MODES.AUTISM,
      fontSize: 16,
      lineHeight: 1.6,
      letterSpacing: 'normal',
      wordSpacing: 'normal',
      useReadingRuler: false,
      font: FONT_OPTIONS.SANS,
      reducedMotion: true,
    },
  };

  /**
   * Get system preference for reduced motion
   * @returns {boolean} Whether the system prefers reduced motion
   */
  function getSystemReducedMotionPreference() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Load saved accessibility settings from localStorage
   */
  function loadSavedSettings() {
    try {
      const savedSettings = localStorage.getItem('shatziiAccessibilitySettings');
      if (savedSettings) {
        currentSettings = JSON.parse(savedSettings);
        applySettings(currentSettings);
      } else {
        // Apply default settings based on user's system preferences
        if (getSystemReducedMotionPreference()) {
          currentSettings.reducedMotion = true;
        }
        applySettings(currentSettings);
      }
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
      applySettings(currentSettings); // Apply default settings on error
    }
  }

  /**
   * Save current accessibility settings to localStorage
   */
  function saveSettings() {
    try {
      localStorage.setItem('shatziiAccessibilitySettings', JSON.stringify(currentSettings));
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
    }
  }

  /**
   * Apply the current accessibility settings to the page
   * @param {Object} settings - The settings to apply
   */
  function applySettings(settings) {
    // Remove all accessibility classes from body
    document.body.classList.remove(
      ACCESSIBILITY_MODES.STANDARD,
      ACCESSIBILITY_MODES.DYSLEXIA,
      ACCESSIBILITY_MODES.HIGH_CONTRAST,
      ACCESSIBILITY_MODES.ADHD,
      ACCESSIBILITY_MODES.AUTISM,
      'use-reading-ruler',
    );

    // Add the selected mode class
    document.body.classList.add(settings.mode);

    // Apply font size
    document.documentElement.style.setProperty('--base-font-size', `${settings.fontSize}px`);

    // Apply line height
    document.documentElement.style.setProperty('--line-height', settings.lineHeight);

    // Apply letter spacing
    document.documentElement.style.setProperty('--letter-spacing', settings.letterSpacing);

    // Apply word spacing
    document.documentElement.style.setProperty('--word-spacing', settings.wordSpacing);

    // Apply reading ruler if needed
    if (settings.useReadingRuler) {
      document.body.classList.add('use-reading-ruler');
      initReadingRuler();
    }

    // Apply reduced motion if needed
    if (settings.reducedMotion) {
      document.documentElement.style.setProperty('--reduced-motion', 'none');
    } else {
      document.documentElement.style.setProperty('--reduced-motion', 'all');
    }

    // Apply the selected font
    switch (settings.font) {
      case FONT_OPTIONS.DYSLEXIC:
        document.documentElement.style.setProperty('--primary-font', 'var(--font-dyslexic)');
        break;
      case FONT_OPTIONS.SERIF:
        document.documentElement.style.setProperty('--primary-font', 'var(--font-serif)');
        break;
      case FONT_OPTIONS.SANS:
        document.documentElement.style.setProperty('--primary-font', 'var(--font-standard)');
        break;
      case FONT_OPTIONS.MONO:
        document.documentElement.style.setProperty('--primary-font', 'var(--font-mono)');
        break;
      default:
        document.documentElement.style.setProperty('--primary-font', 'var(--font-standard)');
    }
  }

  /**
   * Initialize the reading ruler (for dyslexia and ADHD)
   */
  function initReadingRuler() {
    // Create reading ruler element if it doesn't exist
    let ruler = document.querySelector('.reading-ruler');
    if (!ruler) {
      ruler = document.createElement('div');
      ruler.className = 'reading-ruler';
      document.body.appendChild(ruler);
    }

    // Update ruler position on mouse movement
    document.addEventListener('mousemove', function (e) {
      if (currentSettings.useReadingRuler) {
        ruler.style.top = e.clientY - ruler.offsetHeight / 2 + 'px';
      }
    });
  }

  /**
   * Set accessibility mode
   * @param {string} mode - One of the ACCESSIBILITY_MODES values
   */
  function setMode(mode) {
    if (ACCESSIBILITY_MODES[mode.toUpperCase()]) {
      // Apply preset settings for this mode
      currentSettings = { ...PRESET_SETTINGS[mode] };
      applySettings(currentSettings);
      saveSettings();

      // Dispatch event for other components to react
      document.dispatchEvent(
        new CustomEvent('accessibility-changed', {
          detail: { mode, settings: currentSettings },
        }),
      );

      return true;
    }
    return false;
  }

  /**
   * Update individual accessibility settings
   * @param {Object} newSettings - Object with settings to update
   */
  function updateSettings(newSettings) {
    // Update only the provided settings
    currentSettings = { ...currentSettings, ...newSettings };
    applySettings(currentSettings);
    saveSettings();

    // Dispatch event for other components to react
    document.dispatchEvent(
      new CustomEvent('accessibility-changed', {
        detail: { settings: currentSettings },
      }),
    );
  }

  /**
   * Get current accessibility settings
   * @returns {Object} Current settings
   */
  function getSettings() {
    return { ...currentSettings };
  }

  /**
   * Increase font size
   * @param {number} amount - The amount to increase (default: 1)
   */
  function increaseFontSize(amount = 1) {
    updateSettings({ fontSize: currentSettings.fontSize + amount });
  }

  /**
   * Decrease font size
   * @param {number} amount - The amount to decrease (default: 1)
   */
  function decreaseFontSize(amount = 1) {
    // Don't go below minimum readable size
    const newSize = Math.max(12, currentSettings.fontSize - amount);
    updateSettings({ fontSize: newSize });
  }

  /**
   * Reset settings to default
   */
  function resetSettings() {
    currentSettings = { ...PRESET_SETTINGS[ACCESSIBILITY_MODES.STANDARD] };
    applySettings(currentSettings);
    saveSettings();

    // Dispatch event for other components to react
    document.dispatchEvent(
      new CustomEvent('accessibility-changed', {
        detail: { settings: currentSettings },
      }),
    );
  }

  /**
   * Toggle the reading ruler
   */
  function toggleReadingRuler() {
    updateSettings({ useReadingRuler: !currentSettings.useReadingRuler });
  }

  /**
   * Toggle reduced motion
   */
  function toggleReducedMotion() {
    updateSettings({ reducedMotion: !currentSettings.reducedMotion });
  }

  /**
   * Initialize the accessibility system
   */
  function init() {
    // Setup the font links if needed
    loadRequiredFonts();

    // Load saved settings or apply defaults
    loadSavedSettings();

    // Setup keyboard shortcuts (if needed)
    setupKeyboardShortcuts();

    // Initialize the reading ruler (even if not visible)
    initReadingRuler();

    // Listen for system preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) {
      if (!localStorage.getItem('shatziiAccessibilitySettings')) {
        // Only auto-update if the user hasn't explicitly set preferences
        updateSettings({ reducedMotion: e.matches });
      }
    });

    console.log('ShatziiOS Accessibility System initialized');
  }

  /**
   * Load the required accessibility fonts
   */
  function loadRequiredFonts() {
    // Check if OpenDyslexic is already loaded
    if (!document.querySelector('link[href*="OpenDyslexic"]')) {
      // Dynamically add OpenDyslexic font if not present
      // This would typically point to a CDN or local font file
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.otf';
      document.head.appendChild(fontLink);

      // Alternative approach: Use Google Fonts Lexend which is also dyslexia-friendly
      const lexendLink = document.createElement('link');
      lexendLink.rel = 'stylesheet';
      lexendLink.href =
        'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap';
      document.head.appendChild(lexendLink);

      // Update CSS variable
      document.documentElement.style.setProperty(
        '--font-dyslexic',
        '"Lexend", "OpenDyslexic", "Comic Sans MS", sans-serif',
      );
    }
  }

  /**
   * Setup keyboard shortcuts for accessibility features
   */
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
      // Only trigger if Alt key is pressed
      if (e.altKey) {
        switch (e.key) {
          case 'd': // Alt+D: Toggle dyslexia mode
            setMode(
              currentSettings.mode === ACCESSIBILITY_MODES.DYSLEXIA
                ? ACCESSIBILITY_MODES.STANDARD
                : ACCESSIBILITY_MODES.DYSLEXIA,
            );
            e.preventDefault();
            break;
          case 'c': // Alt+C: Toggle high contrast
            setMode(
              currentSettings.mode === ACCESSIBILITY_MODES.HIGH_CONTRAST
                ? ACCESSIBILITY_MODES.STANDARD
                : ACCESSIBILITY_MODES.HIGH_CONTRAST,
            );
            e.preventDefault();
            break;
          case 'a': // Alt+A: Toggle ADHD mode
            setMode(
              currentSettings.mode === ACCESSIBILITY_MODES.ADHD
                ? ACCESSIBILITY_MODES.STANDARD
                : ACCESSIBILITY_MODES.ADHD,
            );
            e.preventDefault();
            break;
          case 'u': // Alt+U: Toggle autism-friendly mode
            setMode(
              currentSettings.mode === ACCESSIBILITY_MODES.AUTISM
                ? ACCESSIBILITY_MODES.STANDARD
                : ACCESSIBILITY_MODES.AUTISM,
            );
            e.preventDefault();
            break;
          case '+': // Alt++: Increase font size
          case '=': // Alt+=: Increase font size (same key)
            increaseFontSize();
            e.preventDefault();
            break;
          case '-': // Alt+-: Decrease font size
            decreaseFontSize();
            e.preventDefault();
            break;
          case 'r': // Alt+R: Toggle reading ruler
            toggleReadingRuler();
            e.preventDefault();
            break;
          case 'm': // Alt+M: Toggle reduced motion
            toggleReducedMotion();
            e.preventDefault();
            break;
          case '0': // Alt+0: Reset to default
            resetSettings();
            e.preventDefault();
            break;
        }
      }
    });
  }

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', init);

  // Also initialize if the script is loaded after DOMContentLoaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  }

  // Return the public API
  return {
    MODES: ACCESSIBILITY_MODES,
    FONTS: FONT_OPTIONS,
    setMode,
    updateSettings,
    getSettings,
    increaseFontSize,
    decreaseFontSize,
    toggleReadingRuler,
    toggleReducedMotion,
    resetSettings,
  };
})();
