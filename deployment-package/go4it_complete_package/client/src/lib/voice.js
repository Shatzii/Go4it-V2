/**
 * Voice.js - Go4It Sports Voice Processing Module
 * Production build for https://go4itsports.org
 * 
 * This module provides voice recognition and speech synthesis
 * for the application's voice interaction features.
 */

// Configuration that will be set during initialization
let config = {
  apiBase: '/api',
  debug: false
};

// Voice module state
const state = {
  initialized: false,
  recognition: null,
  synthesis: null,
  listening: false,
  speaking: false,
  supported: {
    recognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    synthesis: 'speechSynthesis' in window
  }
};

/**
 * Initialize the voice module
 * @param {Object} options - Configuration options
 */
function init(options = {}) {
  // Merge provided options with defaults
  config = { ...config, ...options };
  
  if (config.debug) {
    console.log('Voice module initialized with config:', config);
    console.log('Voice capabilities:', state.supported);
  }
  
  // Initialize speech recognition if supported
  if (state.supported.recognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    state.recognition = new SpeechRecognition();
    state.recognition.continuous = false;
    state.recognition.interimResults = true;
    state.recognition.lang = 'en-US';
    
    // Set up recognition event handlers
    state.recognition.onstart = () => {
      state.listening = true;
      notifyStatus('listening', { active: true });
    };
    
    state.recognition.onend = () => {
      state.listening = false;
      notifyStatus('listening', { active: false });
    };
    
    state.recognition.onresult = (event) => {
      const result = event.results[0];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;
      
      notifyRecognition({
        transcript,
        isFinal,
        confidence: result[0].confidence
      });
      
      if (isFinal) {
        state.recognition.stop();
      }
    };
    
    state.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      state.listening = false;
      notifyError('recognition', event.error);
    };
  }
  
  // Initialize speech synthesis if supported
  if (state.supported.synthesis) {
    state.synthesis = window.speechSynthesis;
    
    // Pre-load voices
    if (state.synthesis.onvoiceschanged !== undefined) {
      state.synthesis.onvoiceschanged = loadVoices;
    }
    
    loadVoices();
  }
  
  // Register event listeners
  document.addEventListener('voice:listen', handleListenRequest);
  document.addEventListener('voice:speak', handleSpeakRequest);
  
  state.initialized = true;
  
  // Notify ready status
  notifyStatus('ready', {
    recognition: state.supported.recognition,
    synthesis: state.supported.synthesis
  });
  
  return true;
}

/**
 * Load available voices for speech synthesis
 */
function loadVoices() {
  if (!state.synthesis) return;
  
  const voices = state.synthesis.getVoices();
  
  if (config.debug && voices.length > 0) {
    console.log(`Loaded ${voices.length} voices for speech synthesis`);
  }
  
  // Find a good default voice (prefer natural sounding voices)
  let defaultVoice = voices.find(v => 
    v.lang.startsWith('en') && 
    (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Premium'))
  );
  
  // Fallback to any English voice
  if (!defaultVoice) {
    defaultVoice = voices.find(v => v.lang.startsWith('en'));
  }
  
  // Store available voices
  state.voices = voices;
  state.defaultVoice = defaultVoice || voices[0];
  
  notifyStatus('voices', { 
    count: voices.length,
    default: state.defaultVoice ? state.defaultVoice.name : null
  });
}

/**
 * Handle a request to start listening
 * @param {CustomEvent} event - The listen request event
 */
function handleListenRequest(event) {
  if (!state.initialized || !state.supported.recognition) {
    notifyError('recognition', 'Speech recognition not supported or initialized');
    return;
  }
  
  if (state.listening) {
    state.recognition.stop();
  }
  
  // Get options from event
  const options = event.detail || {};
  
  // Configure recognition
  if (options.language) {
    state.recognition.lang = options.language;
  }
  
  state.recognition.continuous = !!options.continuous;
  
  // Start listening
  try {
    state.recognition.start();
  } catch (error) {
    console.error('Error starting speech recognition:', error);
    notifyError('recognition', error.message);
  }
}

/**
 * Handle a request to speak text
 * @param {CustomEvent} event - The speak request event
 */
function handleSpeakRequest(event) {
  if (!state.initialized || !state.supported.synthesis) {
    notifyError('synthesis', 'Speech synthesis not supported or initialized');
    return;
  }
  
  const { text, options = {} } = event.detail || {};
  
  if (!text) {
    notifyError('synthesis', 'No text provided for speech');
    return;
  }
  
  // Cancel any ongoing speech
  if (state.speaking) {
    state.synthesis.cancel();
  }
  
  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set voice
  if (options.voice) {
    const requestedVoice = state.voices.find(v => v.name === options.voice);
    if (requestedVoice) {
      utterance.voice = requestedVoice;
    }
  } else if (state.defaultVoice) {
    utterance.voice = state.defaultVoice;
  }
  
  // Set options
  utterance.rate = options.rate || 1.0;
  utterance.pitch = options.pitch || 1.0;
  utterance.volume = options.volume || 1.0;
  
  // Set events
  utterance.onstart = () => {
    state.speaking = true;
    notifyStatus('speaking', { active: true, text });
  };
  
  utterance.onend = () => {
    state.speaking = false;
    notifyStatus('speaking', { active: false });
  };
  
  utterance.onerror = (event) => {
    state.speaking = false;
    notifyError('synthesis', event.error);
  };
  
  // Speak the text
  state.synthesis.speak(utterance);
}

/**
 * Notify about voice recognition results
 * @param {Object} recognitionInfo - Recognition information
 */
function notifyRecognition(recognitionInfo) {
  document.dispatchEvent(new CustomEvent('voice:recognition', {
    detail: {
      ...recognitionInfo,
      timestamp: new Date().toISOString()
    }
  }));
}

/**
 * Notify about voice module status
 * @param {string} type - Type of status update
 * @param {Object} statusInfo - Status information
 */
function notifyStatus(type, statusInfo) {
  document.dispatchEvent(new CustomEvent('voice:status', {
    detail: {
      type,
      ...statusInfo,
      timestamp: new Date().toISOString()
    }
  }));
}

/**
 * Notify about errors in the voice module
 * @param {string} component - Component where error occurred
 * @param {string} message - Error message
 */
function notifyError(component, message) {
  document.dispatchEvent(new CustomEvent('voice:error', {
    detail: {
      component,
      message,
      timestamp: new Date().toISOString()
    }
  }));
}

/**
 * Start listening for voice input
 * @param {Object} options - Recognition options
 * @returns {Promise} Promise resolving with recognition result
 */
function listen(options = {}) {
  return new Promise((resolve, reject) => {
    if (!state.initialized || !state.supported.recognition) {
      reject(new Error('Speech recognition not supported or initialized'));
      return;
    }
    
    // Set up a one-time listener for the final result
    const resultHandler = (event) => {
      if (event.detail.isFinal) {
        document.removeEventListener('voice:recognition', resultHandler);
        document.removeEventListener('voice:error', errorHandler);
        resolve(event.detail);
      }
    };
    
    const errorHandler = (event) => {
      if (event.detail.component === 'recognition') {
        document.removeEventListener('voice:recognition', resultHandler);
        document.removeEventListener('voice:error', errorHandler);
        reject(new Error(event.detail.message));
      }
    };
    
    // Register listeners
    document.addEventListener('voice:recognition', resultHandler);
    document.addEventListener('voice:error', errorHandler);
    
    // Start listening
    document.dispatchEvent(new CustomEvent('voice:listen', {
      detail: options
    }));
    
    // Set a timeout
    setTimeout(() => {
      document.removeEventListener('voice:recognition', resultHandler);
      document.removeEventListener('voice:error', errorHandler);
      reject(new Error('Voice recognition timed out'));
    }, 10000); // 10 second timeout
  });
}

/**
 * Speak text using speech synthesis
 * @param {string} text - Text to speak
 * @param {Object} options - Synthesis options
 * @returns {Promise} Promise resolving when speech completes
 */
function speak(text, options = {}) {
  return new Promise((resolve, reject) => {
    if (!state.initialized || !state.supported.synthesis) {
      reject(new Error('Speech synthesis not supported or initialized'));
      return;
    }
    
    // Set up listeners for completion
    const statusHandler = (event) => {
      if (event.detail.type === 'speaking' && !event.detail.active) {
        document.removeEventListener('voice:status', statusHandler);
        document.removeEventListener('voice:error', errorHandler);
        resolve();
      }
    };
    
    const errorHandler = (event) => {
      if (event.detail.component === 'synthesis') {
        document.removeEventListener('voice:status', statusHandler);
        document.removeEventListener('voice:error', errorHandler);
        reject(new Error(event.detail.message));
      }
    };
    
    // Register listeners
    document.addEventListener('voice:status', statusHandler);
    document.addEventListener('voice:error', errorHandler);
    
    // Start speaking
    document.dispatchEvent(new CustomEvent('voice:speak', {
      detail: { text, options }
    }));
  });
}

// Public API
export default {
  init,
  listen,
  speak,
};