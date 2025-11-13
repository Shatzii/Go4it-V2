/**
 * Accessibility Voice Guidance
 * 
 * This module provides voice guidance for navigation and accessibility features.
 * It uses the Web Speech API to provide audible guidance for users who need
 * assistive technology, particularly helpful for:
 * - Visual impairments
 * - Dyslexia
 * - Motor impairments
 * - Cognitive disabilities
 * - Learning disabilities
 */

// Create a VoiceGuidance class
class VoiceGuidance {
  constructor(options = {}) {
    // Default options
    this.options = {
      enabled: true,
      volume: 1.0,
      rate: 1.0,
      pitch: 1.0,
      voice: null,
      welcomeMessage: "Welcome to ShotziOS. Voice guidance is now active.",
      elementSelectors: [
        'a', 'button', 'input', 'select', 'textarea', 
        '[role="button"]', '[role="link"]', '[role="tab"]',
        '.nav-link', '.tab', '.card', '.neurotype-card'
      ],
      ...options
    };

    // Initialize state
    this.synth = window.speechSynthesis;
    this.speaking = false;
    this.paused = false;
    this.voices = [];
    this.currentUtterance = null;
    this.hoveredElement = null;
    this.focusedElement = null;
    
    // Bind methods to this instance
    this.speak = this.speak.bind(this);
    this.stop = this.stop.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onVoicesChanged = this.onVoicesChanged.bind(this);
    this.onHover = this.onHover.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.attachEventListeners = this.attachEventListeners.bind(this);
    this.detachEventListeners = this.detachEventListeners.bind(this);
    this.getElementDescription = this.getElementDescription.bind(this);
    
    // Initialize the voice guidance
    this.init();
  }
  
  /**
   * Initialize the voice guidance
   */
  init() {
    // Load available voices
    this.synth.addEventListener('voiceschanged', this.onVoicesChanged);
    this.voices = this.synth.getVoices();
    
    // If voices are already loaded
    if (this.voices.length > 0) {
      this.selectVoice();
    }
    
    // Attach event listeners
    if (this.options.enabled) {
      this.attachEventListeners();
      
      // Speak welcome message
      setTimeout(() => {
        this.speak(this.options.welcomeMessage);
      }, 1000);
    }
    
    // Add to window for debugging
    window.voiceGuidance = this;
  }
  
  /**
   * Load available voices when they change
   */
  onVoicesChanged() {
    this.voices = this.synth.getVoices();
    this.selectVoice();
  }
  
  /**
   * Select a voice based on options or defaults
   */
  selectVoice() {
    if (this.options.voice) {
      // If a specific voice name is requested
      this.selectedVoice = this.voices.find(voice => 
        voice.name.toLowerCase().includes(this.options.voice.toLowerCase())
      );
    }
    
    if (!this.selectedVoice) {
      // Try to find a good default voice
      const preferredVoices = ['Daniel', 'Samantha', 'Karen', 'Alex', 'Google UK English Female'];
      
      for (const voiceName of preferredVoices) {
        const voice = this.voices.find(v => v.name.includes(voiceName));
        if (voice) {
          this.selectedVoice = voice;
          break;
        }
      }
      
      // If no preferred voice found, use the first English voice
      if (!this.selectedVoice) {
        this.selectedVoice = this.voices.find(voice => 
          voice.lang.startsWith('en-')
        );
      }
      
      // If still no voice, use the first available
      if (!this.selectedVoice && this.voices.length > 0) {
        this.selectedVoice = this.voices[0];
      }
    }
  }
  
  /**
   * Speak a message
   * @param {string} text - The text to speak
   * @param {Object} options - Override default options
   */
  speak(text, options = {}) {
    if (!this.options.enabled) return;
    
    // Don't speak empty text
    if (!text || text.trim() === '') return;
    
    // Stop any current speech
    this.stop();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure the utterance
    utterance.volume = options.volume || this.options.volume;
    utterance.rate = options.rate || this.options.rate;
    utterance.pitch = options.pitch || this.options.pitch;
    
    // Set the voice if available
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    
    // Add event listeners
    utterance.onstart = () => {
      this.speaking = true;
      console.log('Speaking:', text);
    };
    
    utterance.onend = () => {
      this.speaking = false;
      this.currentUtterance = null;
      console.log('Finished speaking');
    };
    
    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      this.speaking = false;
      this.currentUtterance = null;
    };
    
    // Store the current utterance
    this.currentUtterance = utterance;
    
    // Speak
    this.synth.speak(utterance);
  }
  
  /**
   * Stop speaking
   */
  stop() {
    if (this.speaking) {
      this.synth.cancel();
      this.speaking = false;
      this.paused = false;
      this.currentUtterance = null;
    }
  }
  
  /**
   * Pause speaking
   */
  pause() {
    if (this.speaking && !this.paused) {
      this.synth.pause();
      this.paused = true;
    }
  }
  
  /**
   * Resume speaking
   */
  resume() {
    if (this.paused) {
      this.synth.resume();
      this.paused = false;
    }
  }
  
  /**
   * Toggle voice guidance on/off
   */
  toggle() {
    this.options.enabled = !this.options.enabled;
    
    if (this.options.enabled) {
      this.attachEventListeners();
      this.speak("Voice guidance enabled");
      localStorage.setItem('voiceGuidanceEnabled', 'true');
    } else {
      this.detachEventListeners();
      this.stop();
      this.speak("Voice guidance disabled");
      localStorage.setItem('voiceGuidanceEnabled', 'false');
    }
    
    return this.options.enabled;
  }
  
  /**
   * Attach event listeners to elements
   */
  attachEventListeners() {
    // Get all elements that should have voice guidance
    const elements = document.querySelectorAll(this.options.elementSelectors.join(', '));
    
    // Add event listeners to each element
    elements.forEach(element => {
      element.addEventListener('mouseenter', this.onHover);
      element.addEventListener('focus', this.onFocus);
      element.addEventListener('mouseleave', this.onLeave);
    });
    
    // Also attach to document for dynamically added elements
    document.addEventListener('mouseover', (event) => {
      const element = event.target.closest(this.options.elementSelectors.join(', '));
      if (element && !this.hoveredElement) {
        this.onHover({ target: element });
      }
    });
    
    document.addEventListener('focusin', (event) => {
      const element = event.target.closest(this.options.elementSelectors.join(', '));
      if (element && !this.focusedElement) {
        this.onFocus({ target: element });
      }
    });
    
    // Add keyboard shortcut for toggling voice guidance (Alt+V)
    document.addEventListener('keydown', (event) => {
      if (event.altKey && event.key.toLowerCase() === 'v') {
        this.toggle();
        event.preventDefault();
      }
    });
  }
  
  /**
   * Detach event listeners
   */
  detachEventListeners() {
    const elements = document.querySelectorAll(this.options.elementSelectors.join(', '));
    
    elements.forEach(element => {
      element.removeEventListener('mouseenter', this.onHover);
      element.removeEventListener('focus', this.onFocus);
      element.removeEventListener('mouseleave', this.onLeave);
    });
  }
  
  /**
   * Handle element hover
   * @param {Event} event - The mouseover event
   */
  onHover(event) {
    if (!this.options.enabled) return;
    
    const element = event.target;
    this.hoveredElement = element;
    
    // Get the element description
    const description = this.getElementDescription(element);
    
    // Only speak if a valid description is available
    if (description) {
      this.speak(description, { rate: 1.2 }); // Slightly faster for hover guidance
    }
  }
  
  /**
   * Handle element focus
   * @param {Event} event - The focus event
   */
  onFocus(event) {
    if (!this.options.enabled) return;
    
    const element = event.target;
    this.focusedElement = element;
    
    // Get the element description
    const description = this.getElementDescription(element);
    
    // Only speak if a valid description is available
    if (description) {
      this.speak(description);
    }
  }
  
  /**
   * Handle element leave
   * @param {Event} event - The mouseout event
   */
  onLeave(event) {
    if (this.hoveredElement === event.target) {
      this.hoveredElement = null;
    }
  }
  
  /**
   * Get a description of the element for voice guidance
   * @param {HTMLElement} element - The element to describe
   * @returns {string} The description
   */
  getElementDescription(element) {
    // Check for aria-label first
    const description = element.getAttribute('aria-label');
    if (description) return description;
    
    // Check for neurodivergent cards which have specific structure
    if (element.classList.contains('neurotype-card')) {
      const titleElement = element.querySelector('.neurotype-title');
      if (titleElement) {
        return `${titleElement.textContent} profile. Click to select this neurodivergent type.`;
      }
    }
    
    // Check for alt text if it's an image
    if (element.tagName === 'IMG' && element.alt) {
      return `Image: ${element.alt}`;
    }
    
    // Check for buttons
    if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
      return `Button: ${element.textContent || element.value || 'Unlabeled button'}`;
    }
    
    // Check for links
    if (element.tagName === 'A' || element.getAttribute('role') === 'link') {
      return `Link: ${element.textContent || element.title || 'Unlabeled link'}`;
    }
    
    // Check for form elements
    if (element.tagName === 'INPUT') {
      const inputType = element.type;
      const labelElement = document.querySelector(`label[for="${element.id}"]`);
      const labelText = labelElement ? labelElement.textContent : '';
      
      switch (inputType) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
          return `${labelText || 'Text'} input field. ${element.placeholder ? 'Placeholder: ' + element.placeholder : ''}`;
        case 'checkbox':
          return `${labelText} checkbox. ${element.checked ? 'Checked' : 'Unchecked'}.`;
        case 'radio':
          return `${labelText} radio button. ${element.checked ? 'Selected' : 'Not selected'}.`;
        case 'submit':
          return `Submit button: ${element.value || 'Submit'}`;
        default:
          return `${labelText} ${inputType} input`;
      }
    }
    
    if (element.tagName === 'SELECT') {
      const labelElement = document.querySelector(`label[for="${element.id}"]`);
      const labelText = labelElement ? labelElement.textContent : '';
      return `${labelText || 'Select'} dropdown. ${element.options.length} options available.`;
    }
    
    if (element.tagName === 'TEXTAREA') {
      const labelElement = document.querySelector(`label[for="${element.id}"]`);
      const labelText = labelElement ? labelElement.textContent : '';
      return `${labelText || 'Text'} area. ${element.placeholder ? 'Placeholder: ' + element.placeholder : ''}`;
    }
    
    // Cards and tabs
    if (element.classList.contains('card')) {
      const cardHeader = element.querySelector('.card-header');
      if (cardHeader) {
        return `Card: ${cardHeader.textContent}`;
      }
    }
    
    if (element.classList.contains('tab') || element.getAttribute('role') === 'tab') {
      return `Tab: ${element.textContent}`;
    }
    
    // Otherwise just use the text content if available
    if (element.textContent && element.textContent.trim()) {
      // For longer text, truncate it
      const text = element.textContent.trim();
      if (text.length > 100) {
        return text.substring(0, 100) + '...';
      }
      return text;
    }
    
    // If no useful description is found
    return '';
  }
  
  /**
   * Announce a custom message
   * @param {string} message - The message to announce
   */
  announce(message) {
    if (!this.options.enabled) return;
    this.speak(message);
  }
  
  /**
   * Update voice guidance options
   * @param {Object} newOptions - The new options
   */
  updateOptions(newOptions) {
    this.options = {
      ...this.options,
      ...newOptions
    };
    
    // If the voice changed, reselect
    if (newOptions.voice) {
      this.selectVoice();
    }
  }
  
  /**
   * Enable page navigation announcements
   */
  enablePageNavigation() {
    // Announce page loads
    window.addEventListener('load', () => {
      const pageTitle = document.title;
      this.speak(`Page loaded: ${pageTitle}`);
    });
    
    // Announce navigation within SPA if applicable
    const originalPushState = history.pushState;
    history.pushState = function() {
      const result = originalPushState.apply(this, arguments);
      window.dispatchEvent(new Event('navigationchange'));
      return result;
    };
    
    window.addEventListener('navigationchange', () => {
      setTimeout(() => {
        const pageTitle = document.title;
        this.speak(`Navigated to: ${pageTitle}`);
      }, 500);
    });
    
    // Also listen for popstate for back/forward navigation
    window.addEventListener('popstate', () => {
      setTimeout(() => {
        const pageTitle = document.title;
        this.speak(`Navigated to: ${pageTitle}`);
      }, 500);
    });
  }
}

// Create a global accessible voice guidance control
window.addEventListener('DOMContentLoaded', () => {
  // Check if voice guidance was previously enabled/disabled
  const voiceGuidanceEnabled = localStorage.getItem('voiceGuidanceEnabled');
  const enabled = voiceGuidanceEnabled !== 'false'; // Enable by default unless explicitly disabled
  
  // Initialize the voice guidance
  window.accessibilityVoice = new VoiceGuidance({
    enabled,
    rate: 1.0,
    welcomeMessage: "Welcome to ShotziOS. Voice guidance is active. Hover over elements to hear descriptions. Press Alt+V to toggle voice guidance on or off."
  });
  
  // Enable page navigation announcements
  window.accessibilityVoice.enablePageNavigation();
  
  // Create accessibility controls
  createAccessibilityControls();
});

/**
 * Create accessibility controls in the page
 */
function createAccessibilityControls() {
  // Create the accessibility panel
  const accessPanel = document.createElement('div');
  accessPanel.className = 'accessibility-panel';
  accessPanel.innerHTML = `
    <button class="accessibility-toggle" aria-label="Toggle accessibility panel">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
        <path d="M12 16h.01"></path>
        <path d="M12 8v4"></path>
      </svg>
    </button>
    <div class="accessibility-controls">
      <h3>Accessibility Options</h3>
      <div class="control-group">
        <button class="voice-toggle" aria-pressed="${window.accessibilityVoice.options.enabled}">
          <span class="icon">🔊</span> 
          <span class="label">Voice Guidance</span>
          <span class="status">${window.accessibilityVoice.options.enabled ? 'On' : 'Off'}</span>
        </button>
        <div class="voice-options ${window.accessibilityVoice.options.enabled ? '' : 'hidden'}">
          <div class="slider-control">
            <label for="voice-rate">Speaking Rate:</label>
            <input type="range" id="voice-rate" min="0.5" max="2" step="0.1" value="${window.accessibilityVoice.options.rate}">
            <span class="value">${window.accessibilityVoice.options.rate}x</span>
          </div>
          <div class="slider-control">
            <label for="voice-volume">Volume:</label>
            <input type="range" id="voice-volume" min="0" max="1" step="0.1" value="${window.accessibilityVoice.options.volume}">
            <span class="value">${window.accessibilityVoice.options.volume * 100}%</span>
          </div>
        </div>
      </div>
      <div class="control-group">
        <button class="font-size-increase" aria-label="Increase font size">
          <span class="icon">A+</span> 
          <span class="label">Larger Text</span>
        </button>
        <button class="font-size-decrease" aria-label="Decrease font size">
          <span class="icon">A-</span> 
          <span class="label">Smaller Text</span>
        </button>
      </div>
      <div class="control-group">
        <button class="high-contrast" aria-pressed="false">
          <span class="icon">◐</span> 
          <span class="label">High Contrast</span>
          <span class="status">Off</span>
        </button>
      </div>
      <p class="keyboard-shortcut">Press <kbd>Alt + V</kbd> to toggle voice guidance</p>
    </div>
  `;
  
  // Add styles for the accessibility panel
  const style = document.createElement('style');
  style.textContent = `
    .accessibility-panel {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: Arial, sans-serif;
    }
    
    .accessibility-toggle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #3498db;
      color: white;
      border: none;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s ease;
    }
    
    .accessibility-toggle:hover {
      background-color: #2980b9;
      transform: scale(1.05);
    }
    
    .accessibility-controls {
      display: none;
      position: absolute;
      bottom: 60px;
      right: 0;
      width: 300px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      padding: 15px;
      color: #333;
    }
    
    .accessibility-panel.open .accessibility-controls {
      display: block;
    }
    
    .accessibility-controls h3 {
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 16px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    
    .control-group {
      margin-bottom: 15px;
    }
    
    .control-group button {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f9f9f9;
      cursor: pointer;
      font-size: 14px;
      margin-bottom: 5px;
      transition: all 0.2s ease;
    }
    
    .control-group button:hover {
      background-color: #f0f0f0;
    }
    
    .control-group button[aria-pressed="true"] {
      background-color: #e6f7ff;
      border-color: #91d5ff;
    }
    
    .control-group button .icon {
      margin-right: 10px;
      font-size: 16px;
      min-width: 20px;
      text-align: center;
    }
    
    .control-group button .status {
      margin-left: auto;
      font-size: 12px;
      color: #666;
    }
    
    .slider-control {
      margin: 10px 0;
      padding: 5px 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    
    .slider-control label {
      display: block;
      font-size: 12px;
      margin-bottom: 5px;
    }
    
    .slider-control input[type="range"] {
      width: 100%;
    }
    
    .slider-control .value {
      font-size: 12px;
      color: #666;
      display: block;
      text-align: right;
    }
    
    .voice-options.hidden {
      display: none;
    }
    
    .keyboard-shortcut {
      font-size: 12px;
      color: #666;
      margin: 10px 0 0;
    }
    
    .keyboard-shortcut kbd {
      background-color: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 3px;
      padding: 2px 4px;
      font-family: monospace;
    }
    
    /* Dark theme adjustments */
    body.dark-theme .accessibility-controls {
      background-color: #222;
      color: #eee;
    }
    
    body.dark-theme .accessibility-controls h3 {
      border-bottom-color: #444;
    }
    
    body.dark-theme .control-group button {
      background-color: #333;
      border-color: #555;
      color: #eee;
    }
    
    body.dark-theme .control-group button:hover {
      background-color: #444;
    }
    
    body.dark-theme .control-group button[aria-pressed="true"] {
      background-color: #1a365d;
      border-color: #2a4365;
    }
    
    body.dark-theme .slider-control {
      background-color: #333;
    }
    
    body.dark-theme .slider-control .value,
    body.dark-theme .control-group button .status,
    body.dark-theme .keyboard-shortcut {
      color: #aaa;
    }
    
    body.dark-theme .keyboard-shortcut kbd {
      background-color: #333;
      border-color: #555;
      color: #eee;
    }
    
    /* High contrast mode */
    body.high-contrast {
      filter: contrast(1.5);
    }
    
    /* Font size adjustment */
    body.font-larger {
      font-size: 110% !important;
    }
    
    body.font-largest {
      font-size: 120% !important;
    }
  `;
  
  // Append the accessibility panel and styles to the document
  document.head.appendChild(style);
  document.body.appendChild(accessPanel);
  
  // Handle the toggle button click
  const toggleButton = accessPanel.querySelector('.accessibility-toggle');
  toggleButton.addEventListener('click', () => {
    accessPanel.classList.toggle('open');
    
    if (accessPanel.classList.contains('open')) {
      window.accessibilityVoice.announce("Accessibility panel opened");
    } else {
      window.accessibilityVoice.announce("Accessibility panel closed");
    }
  });
  
  // Handle voice guidance toggle
  const voiceToggle = accessPanel.querySelector('.voice-toggle');
  voiceToggle.addEventListener('click', () => {
    const enabled = window.accessibilityVoice.toggle();
    voiceToggle.setAttribute('aria-pressed', enabled.toString());
    voiceToggle.querySelector('.status').textContent = enabled ? 'On' : 'Off';
    
    // Show/hide voice options
    const voiceOptions = accessPanel.querySelector('.voice-options');
    if (enabled) {
      voiceOptions.classList.remove('hidden');
    } else {
      voiceOptions.classList.add('hidden');
    }
  });
  
  // Handle voice rate change
  const rateInput = accessPanel.querySelector('#voice-rate');
  rateInput.addEventListener('input', (e) => {
    const rate = parseFloat(e.target.value);
    window.accessibilityVoice.updateOptions({ rate });
    accessPanel.querySelector('#voice-rate + .value').textContent = `${rate.toFixed(1)}x`;
  });
  
  // Handle volume change
  const volumeInput = accessPanel.querySelector('#voice-volume');
  volumeInput.addEventListener('input', (e) => {
    const volume = parseFloat(e.target.value);
    window.accessibilityVoice.updateOptions({ volume });
    accessPanel.querySelector('#voice-volume + .value').textContent = `${Math.round(volume * 100)}%`;
  });
  
  // Handle font size increase
  const fontIncreaseBtn = accessPanel.querySelector('.font-size-increase');
  fontIncreaseBtn.addEventListener('click', () => {
    if (document.body.classList.contains('font-largest')) {
      return; // Already at maximum
    } else if (document.body.classList.contains('font-larger')) {
      document.body.classList.remove('font-larger');
      document.body.classList.add('font-largest');
      window.accessibilityVoice.announce("Font size set to largest");
    } else {
      document.body.classList.add('font-larger');
      window.accessibilityVoice.announce("Font size increased");
    }
  });
  
  // Handle font size decrease
  const fontDecreaseBtn = accessPanel.querySelector('.font-size-decrease');
  fontDecreaseBtn.addEventListener('click', () => {
    if (!document.body.classList.contains('font-larger') && !document.body.classList.contains('font-largest')) {
      return; // Already at minimum
    } else if (document.body.classList.contains('font-largest')) {
      document.body.classList.remove('font-largest');
      document.body.classList.add('font-larger');
      window.accessibilityVoice.announce("Font size decreased");
    } else {
      document.body.classList.remove('font-larger');
      window.accessibilityVoice.announce("Font size set to normal");
    }
  });
  
  // Handle high contrast toggle
  const contrastToggle = accessPanel.querySelector('.high-contrast');
  contrastToggle.addEventListener('click', () => {
    const highContrast = document.body.classList.toggle('high-contrast');
    contrastToggle.setAttribute('aria-pressed', highContrast.toString());
    contrastToggle.querySelector('.status').textContent = highContrast ? 'On' : 'Off';
    
    window.accessibilityVoice.announce(`High contrast mode ${highContrast ? 'enabled' : 'disabled'}`);
  });
}