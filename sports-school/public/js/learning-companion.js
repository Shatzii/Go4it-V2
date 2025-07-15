/**
 * Learning Companion Character
 * 
 * This file implements an expressive AI learning companion character that
 * provides guidance, encouragement, and assistance to neurodivergent learners.
 * The character has different emotions and animations to create an engaging
 * learning experience.
 */

class LearningCompanion {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('companion-container');
    this.name = options.name || 'Stella';
    this.type = options.type || 'encouraging'; // encouraging, enthusiastic, calm
    this.animationSpeed = options.animationSpeed || 'normal'; // slow, normal, fast
    this.speechBubble = null;
    this.characterEl = null;
    this.messageHistory = [];
    this.currentMood = 'neutral';
    this.isVisible = true;
    this.isSpeaking = false;
    this.characterData = this.getCharacterData();
    
    // Initialize the companion if container exists
    if (this.container) {
      this.initialize();
    }
  }
  
  /**
   * Get character data based on type
   */
  getCharacterData() {
    const characters = {
      encouraging: {
        name: 'Stella',
        colors: {
          primary: '#8A2BE2', // Blueviolet
          secondary: '#FF69B4', // Hot Pink
          accent: '#1E90FF' // Dodger Blue
        },
        moods: {
          neutral: {
            emoji: '🦸‍♀️',
            animation: 'float',
            phrase: "I'm here to help you learn!"
          },
          happy: {
            emoji: '😊',
            animation: 'bounce',
            phrase: "Great job! You're doing wonderfully!"
          },
          thinking: {
            emoji: '🤔',
            animation: 'pulse',
            phrase: "Let me think about that..."
          },
          excited: {
            emoji: '🎉',
            animation: 'tada',
            phrase: "That's amazing progress!"
          },
          supportive: {
            emoji: '👍',
            animation: 'nod',
            phrase: "You can do this. I believe in you!"
          }
        }
      },
      enthusiastic: {
        name: 'Max',
        colors: {
          primary: '#FF5733', // Bright Orange
          secondary: '#33FF57', // Lime Green
          accent: '#5733FF' // Purple
        },
        moods: {
          neutral: {
            emoji: '🦹‍♂️',
            animation: 'float',
            phrase: "Ready for an adventure in learning?"
          },
          happy: {
            emoji: '😄',
            animation: 'jump',
            phrase: "WOW! That's the way to do it!"
          },
          thinking: {
            emoji: '🧐',
            animation: 'scratch-head',
            phrase: "Hmm, let's figure this out together!"
          },
          excited: {
            emoji: '⚡',
            animation: 'spin',
            phrase: "You're absolutely CRUSHING this!"
          },
          supportive: {
            emoji: '💪',
            animation: 'flex',
            phrase: "You've got the power to succeed!"
          }
        }
      },
      calm: {
        name: 'Nova',
        colors: {
          primary: '#4682B4', // Steel Blue
          secondary: '#B4A746', // Khaki
          accent: '#46B47C' // Sea Green
        },
        moods: {
          neutral: {
            emoji: '🧙',
            animation: 'float',
            phrase: "Let's explore this material carefully."
          },
          happy: {
            emoji: '😌',
            animation: 'gentle-nod',
            phrase: "Excellent. You're making steady progress."
          },
          thinking: {
            emoji: '💭',
            animation: 'slow-pulse',
            phrase: "Let's consider this thoughtfully..."
          },
          excited: {
            emoji: '✨',
            animation: 'glow',
            phrase: "This is truly wonderful work."
          },
          supportive: {
            emoji: '🌟',
            animation: 'shine',
            phrase: "Remember, progress comes one step at a time."
          }
        }
      }
    };
    
    return characters[this.type] || characters.encouraging;
  }
  
  /**
   * Initialize the companion
   */
  initialize() {
    // Create character container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'companion-container';
      document.body.appendChild(this.container);
    }
    
    // Create character element
    this.characterEl = document.createElement('div');
    this.characterEl.className = 'learning-companion';
    this.characterEl.style.backgroundColor = this.characterData.colors.primary;
    
    // Create character face
    const face = document.createElement('div');
    face.className = 'companion-face';
    face.textContent = this.characterData.moods.neutral.emoji;
    this.characterEl.appendChild(face);
    
    // Create speech bubble
    this.speechBubble = document.createElement('div');
    this.speechBubble.className = 'speech-bubble';
    this.speechBubble.style.display = 'none';
    this.speechBubble.style.borderColor = this.characterData.colors.secondary;
    
    // Create close button for speech bubble
    const closeBtn = document.createElement('button');
    closeBtn.className = 'speech-close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => this.closeSpeechBubble());
    this.speechBubble.appendChild(closeBtn);
    
    // Create speech content container
    const speechContent = document.createElement('div');
    speechContent.className = 'speech-content';
    this.speechBubble.appendChild(speechContent);
    
    // Append elements to container
    this.container.appendChild(this.characterEl);
    this.container.appendChild(this.speechBubble);
    
    // Add event listeners
    this.characterEl.addEventListener('click', () => this.toggleSpeechBubble());
    
    // Add styles
    this.addStyles();
    
    // Show initial animation
    this.setMood('neutral');
    setTimeout(() => {
      this.speak(this.characterData.moods.neutral.phrase);
    }, 1000);
  }
  
  /**
   * Add companion styles
   */
  addStyles() {
    // Check if styles already exist
    if (document.getElementById('companion-styles')) {
      return;
    }
    
    const styleEl = document.createElement('style');
    styleEl.id = 'companion-styles';
    
    // Set animation speed
    let animDuration = '0.5s';
    if (this.animationSpeed === 'slow') animDuration = '1s';
    if (this.animationSpeed === 'fast') animDuration = '0.3s';
    
    styleEl.textContent = `
      #companion-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      
      .learning-companion {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease;
      }
      
      .learning-companion:hover {
        transform: scale(1.1);
      }
      
      .companion-face {
        font-size: 30px;
        line-height: 1;
      }
      
      .speech-bubble {
        position: relative;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 12px;
        padding: 15px;
        margin-bottom: 15px;
        max-width: 300px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        border-left: 4px solid ${this.characterData.colors.secondary};
      }
      
      .speech-bubble:after {
        content: '';
        position: absolute;
        bottom: -10px;
        right: 20px;
        border-width: 10px 10px 0;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.8) transparent transparent;
      }
      
      .speech-close {
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        opacity: 0.7;
      }
      
      .speech-close:hover {
        opacity: 1;
      }
      
      .speech-content {
        margin-top: 5px;
      }
      
      /* Animations */
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        40% { transform: translateY(-20px); }
        60% { transform: translateY(-15px); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      
      @keyframes tada {
        0% { transform: scale(1) rotate(0deg); }
        10%, 20% { transform: scale(0.9) rotate(-3deg); }
        30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
        40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
      
      @keyframes nod {
        0%, 100% { transform: rotate(0deg); }
        30% { transform: rotate(-10deg); }
        60% { transform: rotate(10deg); }
      }
      
      @keyframes jump {
        0%, 100% { transform: translateY(0) scale(1); }
        30% { transform: translateY(-30px) scale(1.1); }
        50% { transform: translateY(-20px) scale(1.1); }
        90% { transform: translateY(-5px) scale(1); }
      }
      
      @keyframes scratch-head {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: translateX(-5px) rotate(-5deg); }
        50% { transform: translateX(0) rotate(0deg); }
        75% { transform: translateX(5px) rotate(5deg); }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes flex {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
      
      @keyframes gentle-nod {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      
      @keyframes slow-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.9; }
      }
      
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
        50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }
      }
      
      @keyframes shine {
        0%, 100% { opacity: 1; }
        25% { opacity: 0.6; }
        50% { opacity: 1; }
        75% { opacity: 0.6; }
      }
      
      /* Animation classes */
      .anim-float { animation: float ${animDuration} ease-in-out infinite; }
      .anim-bounce { animation: bounce ${animDuration} ease-in-out; }
      .anim-pulse { animation: pulse ${animDuration} ease-in-out infinite; }
      .anim-tada { animation: tada ${animDuration} ease-in-out; }
      .anim-nod { animation: nod ${animDuration} ease-in-out; }
      .anim-jump { animation: jump ${animDuration} ease-in-out; }
      .anim-scratch-head { animation: scratch-head ${animDuration} ease-in-out infinite; }
      .anim-spin { animation: spin ${animDuration} ease-in-out; }
      .anim-flex { animation: flex ${animDuration} ease-in-out; }
      .anim-gentle-nod { animation: gentle-nod 1.5s ease-in-out infinite; }
      .anim-slow-pulse { animation: slow-pulse 2s ease-in-out infinite; }
      .anim-glow { animation: glow 2s ease-in-out infinite; }
      .anim-shine { animation: shine 2s ease-in-out infinite; }
    `;
    
    document.head.appendChild(styleEl);
  }
  
  /**
   * Set the companion's mood
   * @param {string} mood - The mood to set (neutral, happy, thinking, excited, supportive)
   * @param {boolean} animate - Whether to animate the mood change
   */
  setMood(mood, animate = true) {
    if (!this.characterEl) return;
    
    const moodData = this.characterData.moods[mood];
    if (!moodData) return;
    
    this.currentMood = mood;
    
    // Update emoji
    const face = this.characterEl.querySelector('.companion-face');
    if (face) {
      face.textContent = moodData.emoji;
    }
    
    // Clear existing animations
    this.characterEl.className = 'learning-companion';
    
    // Add new animation if animate is true
    if (animate) {
      this.characterEl.classList.add(`anim-${moodData.animation}`);
      
      // Reset animation after it completes (for non-infinite animations)
      const animations = ['bounce', 'tada', 'nod', 'jump', 'spin', 'flex'];
      if (animations.includes(moodData.animation)) {
        setTimeout(() => {
          this.characterEl.classList.remove(`anim-${moodData.animation}`);
          this.characterEl.classList.add('anim-float');
        }, this.animationSpeed === 'slow' ? 1000 : (this.animationSpeed === 'fast' ? 300 : 500));
      }
    }
  }
  
  /**
   * Make the companion speak
   * @param {string} message - The message to speak
   * @param {string} mood - Optional mood to set while speaking
   */
  speak(message, mood = null) {
    if (!this.speechBubble) return;
    
    // Set mood if provided
    if (mood && this.characterData.moods[mood]) {
      this.setMood(mood);
    }
    
    // Show speech bubble
    this.speechBubble.style.display = 'block';
    
    // Update speech content with typing animation
    const speechContent = this.speechBubble.querySelector('.speech-content');
    if (speechContent) {
      this.isSpeaking = true;
      speechContent.textContent = '';
      
      let i = 0;
      const typingSpeed = this.animationSpeed === 'slow' ? 50 : (this.animationSpeed === 'fast' ? 20 : 30);
      
      const typeWriter = () => {
        if (i < message.length) {
          speechContent.textContent += message.charAt(i);
          i++;
          setTimeout(typeWriter, typingSpeed);
        } else {
          this.isSpeaking = false;
          this.messageHistory.push({
            message,
            mood: this.currentMood,
            timestamp: new Date()
          });
        }
      };
      
      typeWriter();
    }
  }
  
  /**
   * Toggle the speech bubble
   */
  toggleSpeechBubble() {
    if (!this.speechBubble) return;
    
    if (this.speechBubble.style.display === 'none') {
      this.speechBubble.style.display = 'block';
      
      // If not currently speaking, show a default message
      if (!this.isSpeaking) {
        const speechContent = this.speechBubble.querySelector('.speech-content');
        if (speechContent) {
          const defaultMessage = this.characterData.moods[this.currentMood].phrase;
          speechContent.textContent = defaultMessage;
        }
      }
    } else {
      this.closeSpeechBubble();
    }
  }
  
  /**
   * Close the speech bubble
   */
  closeSpeechBubble() {
    if (!this.speechBubble) return;
    this.speechBubble.style.display = 'none';
  }
  
  /**
   * Show the companion
   */
  show() {
    if (this.container) {
      this.container.style.display = 'flex';
      this.isVisible = true;
    }
  }
  
  /**
   * Hide the companion
   */
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
      this.isVisible = false;
    }
  }
  
  /**
   * Set the character type
   * @param {string} type - The character type (encouraging, enthusiastic, calm)
   */
  setCharacterType(type) {
    if (['encouraging', 'enthusiastic', 'calm'].includes(type)) {
      this.type = type;
      this.characterData = this.getCharacterData();
      
      // Update character appearance
      if (this.characterEl) {
        this.characterEl.style.backgroundColor = this.characterData.colors.primary;
        this.speechBubble.style.borderColor = this.characterData.colors.secondary;
        
        // Update face
        const face = this.characterEl.querySelector('.companion-face');
        if (face) {
          face.textContent = this.characterData.moods.neutral.emoji;
        }
      }
      
      // Update mood to neutral
      this.setMood('neutral');
    }
  }
  
  /**
   * Provide contextual help based on the current page or element
   * @param {string} context - The context identifier
   */
  provideHelp(context) {
    const helpMessages = {
      'dyslexia-curriculum': "I can help you adapt standard curriculum for dyslexic learners. Would you like some tips?",
      'upload-file': "Remember to use clear, simple text in your materials. I can help convert complex paragraphs into bullet points.",
      'math-lesson': "For math concepts, try using more visual explanations and real-world examples that students can relate to.",
      'reading-exercise': "Breaking text into smaller chunks can help dyslexic readers. Would you like me to show you how?",
      'assessment': "Consider alternative assessment methods like oral presentations or project-based activities that showcase understanding.",
      'dashboard': "Welcome to your dashboard! I can help you navigate or find specific resources for neurodivergent learners."
    };
    
    if (helpMessages[context]) {
      this.speak(helpMessages[context], 'supportive');
    } else {
      this.speak("I'm here to help! What would you like assistance with?", 'neutral');
    }
  }
  
  /**
   * React to user input or action
   * @param {string} input - The user input or action description
   */
  reactTo(input) {
    // Simple keyword-based reactions
    if (input.match(/correct|right|good|great|excellent/i)) {
      this.setMood('happy');
      this.speak("That's fantastic! You're doing great!");
    } else if (input.match(/confused|difficult|hard|don't understand|struggling/i)) {
      this.setMood('thinking');
      this.speak("Let's break this down into smaller steps. Which part is challenging?");
    } else if (input.match(/completed|finished|done/i)) {
      this.setMood('excited');
      this.speak("Amazing job completing that! You should be proud of yourself!");
    } else if (input.match(/help|assist|guidance/i)) {
      this.setMood('supportive');
      this.speak("I'm right here with you. Let me know how I can help!");
    } else {
      this.setMood('neutral');
      this.speak("I'm listening. How can I assist you with your learning today?");
    }
  }
  
  /**
   * Schedule a timed encouragement or reminder
   * @param {number} minutes - Minutes until the encouragement
   * @param {string} message - The message to display
   * @param {string} mood - The mood to display with the message
   */
  scheduleEncouragement(minutes, message, mood = 'supportive') {
    setTimeout(() => {
      this.setMood(mood);
      this.speak(message);
    }, minutes * 60 * 1000);
  }
}

// Export for use in other files
window.LearningCompanion = LearningCompanion;