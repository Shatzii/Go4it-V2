/**
 * Contextual Help Bubbles with Playful Character Interactions
 *
 * This script adds interactive help bubbles that provide contextual assistance
 * with playful animations and character interactions. It's designed for
 * neurodivergent learners who benefit from visual cues and engaging explanations.
 */

class ContextualHelpSystem {
  constructor(options = {}) {
    // Configuration
    this.character = options.character || 'stella'; // stella, max, nova
    this.animationLevel = options.animationLevel || 'medium'; // minimal, medium, playful
    this.autoShowFirstTime = options.autoShowFirstTime !== false;
    this.persistState = options.persistState !== false;
    this.debug = options.debug || false;

    // State
    this.currentContext = null;
    this.helpPoints = [];
    this.activeHelpBubble = null;
    this.characters = this.defineCharacters();
    this.helpBubbleTemplate = this.createHelpBubbleTemplate();
    this.helpContexts = this.defineHelpContexts();

    // Initialize the system
    this.initialize();
  }

  /**
   * Define character personalities, appearances, and animations
   */
  defineCharacters() {
    return {
      stella: {
        name: 'Stella',
        emoji: '⭐',
        color: '#8A2BE2', // Blueviolet
        secondaryColor: '#FF69B4', // Hot Pink
        entryAnimation: 'bounce-in',
        idleAnimation: 'gentle-float',
        exitAnimation: 'fade-out',
        bubblePosition: 'right',
        personality: 'encouraging',
        voice: 'supportive',
        greetings: [
          'Hi there! Need some help?',
          "I'm Stella! What can I explain for you?",
          "Have a question? I'm here to help!",
          "Could use some guidance? That's what I'm here for!",
        ],
      },
      max: {
        name: 'Max',
        emoji: '🚀',
        color: '#FF5733', // Bright Orange
        secondaryColor: '#33FF57', // Lime Green
        entryAnimation: 'zoom-in',
        idleAnimation: 'pulse',
        exitAnimation: 'zoom-out',
        bubblePosition: 'top',
        personality: 'enthusiastic',
        voice: 'energetic',
        greetings: [
          'HEY THERE! Ready to learn something AWESOME?',
          "MAX HERE! Let's tackle this together!",
          "Need a boost? I've got all the ENERGY you need!",
          "Got questions? I've got SUPER answers!",
        ],
      },
      nova: {
        name: 'Nova',
        emoji: '🌟',
        color: '#4682B4', // Steel Blue
        secondaryColor: '#B4A746', // Khaki
        entryAnimation: 'fade-in',
        idleAnimation: 'slow-pulse',
        exitAnimation: 'fade-out',
        bubblePosition: 'left',
        personality: 'calm',
        voice: 'measured',
        greetings: [
          "Hello. I'm Nova. How may I assist you?",
          'Need a moment to understand this concept?',
          "I'm here to provide clear, calm guidance.",
          'Sometimes a gentle explanation helps. May I offer one?',
        ],
      },
    };
  }

  /**
   * Define all the help contexts and their helpful tips
   */
  defineHelpContexts() {
    return {
      // Dashboard contexts
      'dashboard-overview': {
        title: 'Dashboard Overview',
        tips: [
          'Your dashboard shows your progress, upcoming assignments, and learning resources.',
          'The colored cards show different metrics about your learning progress.',
          'You can click on any card to get more detailed information.',
          'The sidebar menu helps you navigate to different parts of the platform.',
        ],
        relatedContexts: ['navigation', 'learning-progress'],
      },
      navigation: {
        title: 'Navigation Help',
        tips: [
          'Use the sidebar menu to navigate between different sections.',
          'The home icon will always bring you back to your dashboard.',
          'Breadcrumbs at the top show your current location.',
          'Colored icons help you identify different types of content.',
        ],
        relatedContexts: ['dashboard-overview', 'accessibility-options'],
      },

      // Learning companion contexts
      'learning-companion': {
        title: 'Learning Companion Help',
        tips: [
          'Your learning companion is here to provide encouragement and assistance.',
          "You can change your companion's personality type to match your preferences.",
          'Try different animation speeds to find what works best for you.',
          'Use the AI features to get personalized learning strategies.',
        ],
        relatedContexts: ['character-selection', 'accessibility-options'],
      },
      'character-selection': {
        title: 'Choosing Your Companion',
        tips: [
          'Stella offers gentle encouragement and supportive guidance.',
          'Max brings high energy and excitement to learning tasks.',
          'Nova provides calm, measured assistance for those who prefer a more peaceful helper.',
          'You can switch between companions anytime to match your current mood.',
        ],
        relatedContexts: ['learning-companion', 'animation-settings'],
      },

      // Curriculum contexts
      'curriculum-generator': {
        title: 'Curriculum Generator',
        tips: [
          'Select your subject, grade level, and desired format before generating materials.',
          'The AI will create dyslexia-friendly content based on your specifications.',
          'Visual formats include more diagrams and spatial relationships.',
          'Audio formats focus on clear explanations with proper pacing.',
        ],
        relatedContexts: ['file-upload', 'output-formats'],
      },
      'file-upload': {
        title: 'File Upload Help',
        tips: [
          'You can upload .txt, .doc, .docx, and .pdf files for conversion.',
          'Maximum file size is 10MB to ensure quick processing.',
          'Include as much detail as possible in the subject and grade fields.',
          'Click the preview button to see a sample of your file before uploading.',
        ],
        relatedContexts: ['curriculum-generator', 'output-formats'],
      },
      'output-formats': {
        title: 'Output Format Options',
        tips: [
          'Text format uses dyslexia-friendly spacing, fonts, and layout.',
          'Visual format adds diagrams, mind maps, and color coding.',
          'Audio format creates a script optimized for text-to-speech or recording.',
          'Game format transforms content into interactive learning activities.',
        ],
        relatedContexts: ['curriculum-generator', 'file-upload'],
      },

      // Study tools contexts
      'study-tools': {
        title: 'Study Tools',
        tips: [
          'The Pomodoro Timer helps you work in focused intervals with breaks.',
          'Text-to-Speech can read any content aloud for auditory learning.',
          'The Mind Map tool helps visualize connections between concepts.',
          'Flashcards are great for spaced repetition practice.',
        ],
        relatedContexts: ['focus-techniques', 'learning-styles'],
      },
      'focus-techniques': {
        title: 'Focus Techniques',
        tips: [
          'Try the 25/5 Pomodoro technique: 25 minutes of work, 5 minutes of break.',
          'The background noise generator can help mask distracting sounds.',
          'Use the focus mode to hide distracting elements on the page.',
          'Try different color filters to reduce visual stress when reading.',
        ],
        relatedContexts: ['study-tools', 'accessibility-options'],
      },

      // Accessibility contexts
      'accessibility-options': {
        title: 'Accessibility Options',
        tips: [
          'You can adjust text size, spacing, and font in the settings.',
          'Color filters help reduce visual stress for some readers.',
          'Enable keyboard navigation for mouse-free operation.',
          'Adjust animation speeds or turn them off completely in settings.',
        ],
        relatedContexts: ['learning-styles', 'focus-techniques'],
      },
      'learning-styles': {
        title: 'Learning Styles',
        tips: [
          'Visual learners benefit from diagrams, charts, and visual organization.',
          'Auditory learners may prefer listening to content with Text-to-Speech.',
          'Kinesthetic learners should try the interactive and hands-on activities.',
          'Most people learn best with a mix of approaches and multiple modalities.',
        ],
        relatedContexts: ['study-tools', 'accessibility-options'],
      },

      // General help
      'general-help': {
        title: 'General Help',
        tips: [
          'These help bubbles provide context-specific guidance throughout the platform.',
          'Click the question mark icon in any section for relevant assistance.',
          'The search function can help you find specific features or content.',
          'You can disable automated help in your profile settings if preferred.',
        ],
        relatedContexts: ['accessibility-options', 'navigation'],
      },
    };
  }

  /**
   * Create the HTML template for help bubbles
   */
  createHelpBubbleTemplate() {
    const template = document.createElement('div');
    template.className = 'contextual-help-bubble';
    template.innerHTML = `
      <div class="help-bubble-header">
        <span class="help-character-emoji"></span>
        <span class="help-bubble-title"></span>
        <button class="help-bubble-close">&times;</button>
      </div>
      <div class="help-bubble-content">
        <p class="help-bubble-message"></p>
        <div class="help-bubble-tips"></div>
        <div class="help-bubble-navigation">
          <button class="help-bubble-prev" disabled>Previous Tip</button>
          <span class="help-bubble-counter">1/4</span>
          <button class="help-bubble-next">Next Tip</button>
        </div>
      </div>
      <div class="help-bubble-related">
        <span>Related help:</span>
        <div class="related-contexts"></div>
      </div>
    `;
    return template;
  }

  /**
   * Initialize the contextual help system
   */
  initialize() {
    // Add styles to the document
    this.addStyles();

    // Scan the page for help points
    this.scanForHelpPoints();

    // Add help icons to the page
    this.createHelpIcons();

    // Initialize event listeners
    this.initializeEvents();

    // Check if there are any URL parameters specifying help context
    this.checkURLForContext();

    // Log initialization
    if (this.debug) {
      console.log('Contextual Help System initialized:', {
        character: this.character,
        animationLevel: this.animationLevel,
        helpPoints: this.helpPoints.length,
      });
    }

    // Auto-show first-time help if enabled
    if (this.autoShowFirstTime && !this.hasSeenHelp()) {
      this.showFirstTimeHelp();
    }
  }

  /**
   * Add required CSS styles to the page
   */
  addStyles() {
    if (document.getElementById('contextual-help-styles')) return;

    const style = document.createElement('style');
    style.id = 'contextual-help-styles';

    // Define animation intensities
    let animationDuration = '0.5s';
    let animationIntensity = '20px';

    if (this.animationLevel === 'minimal') {
      animationDuration = '0.3s';
      animationIntensity = '10px';
    } else if (this.animationLevel === 'playful') {
      animationDuration = '0.7s';
      animationIntensity = '30px';
    }

    // Get character colors
    const charData = this.characters[this.character];

    style.textContent = `
      /* Help Icon Styles */
      .contextual-help-icon {
        position: absolute;
        width: 24px;
        height: 24px;
        background-color: ${charData.color};
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease, background-color 0.3s ease;
        z-index: 999;
      }
      
      .contextual-help-icon:hover {
        transform: scale(1.15);
        background-color: ${charData.secondaryColor};
      }
      
      /* Help Bubble Styles */
      .contextual-help-bubble {
        position: absolute;
        width: 300px;
        background-color: rgba(30, 30, 45, 0.95);
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-size: 14px;
        opacity: 0;
        border-left: 4px solid ${charData.color};
        overflow: hidden;
        display: none;
      }
      
      .contextual-help-bubble.visible {
        display: block;
      }
      
      .help-bubble-header {
        display: flex;
        align-items: center;
        background-color: rgba(20, 20, 35, 0.8);
        padding: 8px 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .help-character-emoji {
        font-size: 18px;
        margin-right: 8px;
      }
      
      .help-bubble-title {
        flex-grow: 1;
        font-weight: bold;
        font-size: 16px;
      }
      
      .help-bubble-close {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
      }
      
      .help-bubble-close:hover {
        color: white;
      }
      
      .help-bubble-content {
        padding: 12px;
      }
      
      .help-bubble-message {
        margin-top: 0;
        margin-bottom: 12px;
        font-style: italic;
        color: rgba(255, 255, 255, 0.9);
      }
      
      .help-bubble-tips {
        margin-bottom: 15px;
      }
      
      .help-tip {
        background-color: rgba(255, 255, 255, 0.1);
        padding: 10px;
        border-radius: 6px;
        margin-bottom: 8px;
        display: none; /* Hidden by default, shown one at a time */
      }
      
      .help-tip.active {
        display: block;
      }
      
      .help-bubble-navigation {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;
      }
      
      .help-bubble-prev, .help-bubble-next {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      }
      
      .help-bubble-prev:hover, .help-bubble-next:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
      
      .help-bubble-prev:disabled, .help-bubble-next:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .help-bubble-counter {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }
      
      .help-bubble-related {
        background-color: rgba(20, 20, 35, 0.8);
        padding: 8px 12px;
        font-size: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .help-bubble-related span {
        color: rgba(255, 255, 255, 0.7);
        margin-right: 8px;
      }
      
      .related-contexts {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 6px;
      }
      
      .related-context {
        background-color: ${charData.color};
        color: white;
        font-size: 11px;
        padding: 3px 8px;
        border-radius: 12px;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }
      
      .related-context:hover {
        background-color: ${charData.secondaryColor};
      }
      
      /* Animation Keyframes */
      @keyframes bounce-in {
        0% { transform: scale(0.5); opacity: 0; }
        50% { transform: scale(1.05); opacity: 1; }
        70% { transform: scale(0.95); }
        100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes fade-in {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      
      @keyframes zoom-in {
        0% { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes fade-out {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }
      
      @keyframes zoom-out {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(0.8); opacity: 0; }
      }
      
      @keyframes gentle-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-${animationIntensity}); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      @keyframes slow-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.02); opacity: 0.95; }
      }
      
      /* Animation Classes */
      .anim-bounce-in { animation: bounce-in ${animationDuration} ease-out forwards; }
      .anim-fade-in { animation: fade-in ${animationDuration} ease-out forwards; }
      .anim-zoom-in { animation: zoom-in ${animationDuration} ease-out forwards; }
      .anim-fade-out { animation: fade-out ${animationDuration} ease-in forwards; }
      .anim-zoom-out { animation: zoom-out ${animationDuration} ease-in forwards; }
      .anim-gentle-float { animation: gentle-float 3s ease-in-out infinite; }
      .anim-pulse { animation: pulse 2s ease-in-out infinite; }
      .anim-slow-pulse { animation: slow-pulse 4s ease-in-out infinite; }
    `;

    document.head.appendChild(style);
  }

  /**
   * Scan the page for elements with help-context attributes
   */
  scanForHelpPoints() {
    const helpElements = document.querySelectorAll('[data-help-context]');

    helpElements.forEach((element) => {
      const context = element.getAttribute('data-help-context');
      const position = element.getAttribute('data-help-position') || 'right';

      // Skip if we already have this element
      if (this.helpPoints.some((p) => p.element === element)) {
        return;
      }

      this.helpPoints.push({
        element,
        context,
        position,
        added: false,
      });
    });

    // Also scan the page for common elements that might need help
    this.autoDetectHelpPoints();
  }

  /**
   * Auto-detect elements that might need help based on their type or class
   */
  autoDetectHelpPoints() {
    // Form elements and complex interfaces that might need help
    const formElements = document.querySelectorAll('form:not([data-help-context])');
    formElements.forEach((element) => {
      // Try to determine what kind of form it is
      const formId = element.id.toLowerCase();
      const formClass = Array.from(element.classList).join(' ').toLowerCase();

      let context = 'general-help';

      if (formId.includes('upload') || formClass.includes('upload')) {
        context = 'file-upload';
      } else if (formId.includes('curriculum') || formClass.includes('curriculum')) {
        context = 'curriculum-generator';
      }

      this.helpPoints.push({
        element,
        context,
        position: 'right',
        added: false,
      });
    });

    // Navigation elements
    const navElements = document.querySelectorAll(
      'nav:not([data-help-context]), .sidebar:not([data-help-context])',
    );
    navElements.forEach((element) => {
      this.helpPoints.push({
        element,
        context: 'navigation',
        position: 'right',
        added: false,
      });
    });

    // Learning companion elements
    const companionElements = document.querySelectorAll(
      '#companion-container:not([data-help-context])',
    );
    companionElements.forEach((element) => {
      this.helpPoints.push({
        element,
        context: 'learning-companion',
        position: 'left',
        added: false,
      });
    });
  }

  /**
   * Create help icons next to elements that have help contexts
   */
  createHelpIcons() {
    this.helpPoints.forEach((point) => {
      if (point.added) return;

      // Create the help icon
      const helpIcon = document.createElement('div');
      helpIcon.className = 'contextual-help-icon';
      helpIcon.innerHTML = '?';
      helpIcon.setAttribute('data-context', point.context);
      helpIcon.setAttribute('title', `Get help with ${this.getContextTitle(point.context)}`);

      // Position the icon relative to its element
      const rect = point.element.getBoundingClientRect();
      const iconSize = 24;

      // Adjust position based on the point's position attribute
      let top, left;

      switch (point.position) {
        case 'top':
          top = -iconSize / 2;
          left = rect.width / 2 - iconSize / 2;
          break;
        case 'right':
          top = rect.height / 2 - iconSize / 2;
          left = rect.width - iconSize / 2;
          break;
        case 'bottom':
          top = rect.height - iconSize / 2;
          left = rect.width / 2 - iconSize / 2;
          break;
        case 'left':
          top = rect.height / 2 - iconSize / 2;
          left = -iconSize / 2;
          break;
        default:
          top = -iconSize / 2;
          left = -iconSize / 2;
      }

      // Set the position
      helpIcon.style.top = `${top}px`;
      helpIcon.style.left = `${left}px`;

      // Make sure the element has position relative to properly position the icon
      const computedStyle = window.getComputedStyle(point.element);
      if (computedStyle.position === 'static') {
        point.element.style.position = 'relative';
      }

      // Add event listener to show help bubble
      helpIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showHelpBubble(point.context, helpIcon);
      });

      // Add the icon to the element
      point.element.appendChild(helpIcon);
      point.added = true;
      point.icon = helpIcon;
    });
  }

  /**
   * Initialize global event listeners
   */
  initializeEvents() {
    // Close help bubble when clicking outside of it
    document.addEventListener('click', (e) => {
      if (
        this.activeHelpBubble &&
        !this.activeHelpBubble.contains(e.target) &&
        !e.target.closest('.contextual-help-icon')
      ) {
        this.hideHelpBubble();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.activeHelpBubble) return;

      if (e.key === 'Escape') {
        this.hideHelpBubble();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prevBtn = this.activeHelpBubble.querySelector('.help-bubble-prev');
        if (prevBtn && !prevBtn.disabled) {
          prevBtn.click();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const nextBtn = this.activeHelpBubble.querySelector('.help-bubble-next');
        if (nextBtn && !nextBtn.disabled) {
          nextBtn.click();
        }
      }
    });

    // Rescan for help points when the DOM changes significantly
    this.observeDOMChanges();
  }

  /**
   * Observe DOM changes to rescan for help points when new elements are added
   */
  observeDOMChanges() {
    // Create a mutation observer to watch for significant DOM changes
    const observer = new MutationObserver((mutations) => {
      let shouldRescan = false;

      for (const mutation of mutations) {
        // If nodes are added, check if we need to rescan
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // If a significant element was added, rescan
              if (
                node.tagName === 'DIV' ||
                node.tagName === 'SECTION' ||
                node.tagName === 'FORM' ||
                node.tagName === 'NAV'
              ) {
                shouldRescan = true;
                break;
              }
            }
          }
        }

        if (shouldRescan) break;
      }

      if (shouldRescan) {
        this.scanForHelpPoints();
        this.createHelpIcons();
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Check URL for help context parameters
   */
  checkURLForContext() {
    const urlParams = new URLSearchParams(window.location.search);
    const helpContext = urlParams.get('help');

    if (helpContext && this.helpContexts[helpContext]) {
      // Find an appropriate element to show the help on
      const helpPoint = this.helpPoints.find((p) => p.context === helpContext);

      if (helpPoint) {
        setTimeout(() => {
          this.showHelpBubble(helpContext, helpPoint.icon);
        }, 1000); // Delay to ensure page is loaded
      } else {
        // If no specific element found, show general help bubble
        setTimeout(() => {
          this.showHelpBubble(helpContext);
        }, 1000);
      }
    }
  }

  /**
   * Show a help bubble for the given context
   */
  showHelpBubble(context, anchorElement = null) {
    // Hide any existing help bubble
    if (this.activeHelpBubble) {
      this.hideHelpBubble();
    }

    // Get context data
    const contextData = this.helpContexts[context] || this.helpContexts['general-help'];
    const character = this.characters[this.character];

    // Create the help bubble
    const helpBubble = this.helpBubbleTemplate.cloneNode(true);
    helpBubble.classList.add('visible');

    // Set content
    helpBubble.querySelector('.help-character-emoji').textContent = character.emoji;
    helpBubble.querySelector('.help-bubble-title').textContent = contextData.title;

    // Set greeting message based on character personality
    const greetingIndex = Math.floor(Math.random() * character.greetings.length);
    helpBubble.querySelector('.help-bubble-message').textContent =
      character.greetings[greetingIndex];

    // Add tips
    const tipsContainer = helpBubble.querySelector('.help-bubble-tips');
    let currentTipIndex = 0;

    contextData.tips.forEach((tip, index) => {
      const tipElement = document.createElement('div');
      tipElement.className = `help-tip ${index === 0 ? 'active' : ''}`;
      tipElement.textContent = tip;
      tipsContainer.appendChild(tipElement);
    });

    // Set up navigation
    const prevBtn = helpBubble.querySelector('.help-bubble-prev');
    const nextBtn = helpBubble.querySelector('.help-bubble-next');
    const counter = helpBubble.querySelector('.help-bubble-counter');

    // Update counter
    counter.textContent = `1/${contextData.tips.length}`;

    // Set up related contexts
    const relatedContainer = helpBubble.querySelector('.related-contexts');

    (contextData.relatedContexts || []).forEach((relatedContext) => {
      if (this.helpContexts[relatedContext]) {
        const relatedElement = document.createElement('span');
        relatedElement.className = 'related-context';
        relatedElement.textContent = this.helpContexts[relatedContext].title;
        relatedElement.setAttribute('data-context', relatedContext);

        relatedElement.addEventListener('click', () => {
          this.hideHelpBubble();
          this.showHelpBubble(relatedContext);
        });

        relatedContainer.appendChild(relatedElement);
      }
    });

    // Set up navigation events
    prevBtn.addEventListener('click', () => {
      if (currentTipIndex > 0) {
        const tips = helpBubble.querySelectorAll('.help-tip');
        tips[currentTipIndex].classList.remove('active');
        currentTipIndex--;
        tips[currentTipIndex].classList.add('active');

        // Update buttons and counter
        nextBtn.disabled = false;
        prevBtn.disabled = currentTipIndex === 0;
        counter.textContent = `${currentTipIndex + 1}/${contextData.tips.length}`;
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentTipIndex < contextData.tips.length - 1) {
        const tips = helpBubble.querySelectorAll('.help-tip');
        tips[currentTipIndex].classList.remove('active');
        currentTipIndex++;
        tips[currentTipIndex].classList.add('active');

        // Update buttons and counter
        prevBtn.disabled = false;
        nextBtn.disabled = currentTipIndex === contextData.tips.length - 1;
        counter.textContent = `${currentTipIndex + 1}/${contextData.tips.length}`;
      }
    });

    // Close button
    helpBubble.querySelector('.help-bubble-close').addEventListener('click', () => {
      this.hideHelpBubble();
    });

    // Position the bubble
    if (anchorElement) {
      this.positionHelpBubble(helpBubble, anchorElement);
    } else {
      // Position in center if no anchor
      helpBubble.style.top = '50%';
      helpBubble.style.left = '50%';
      helpBubble.style.transform = 'translate(-50%, -50%)';
    }

    // Add to the DOM
    document.body.appendChild(helpBubble);

    // Add entry animation
    helpBubble.classList.add(`anim-${character.entryAnimation}`);

    // Add idle animation after entry animation completes
    setTimeout(() => {
      helpBubble.classList.remove(`anim-${character.entryAnimation}`);
      helpBubble.classList.add(`anim-${character.idleAnimation}`);
    }, 700);

    // Store active bubble reference
    this.activeHelpBubble = helpBubble;
    this.currentContext = context;

    // Record that the user has seen help
    this.markHelpAsSeen();
  }

  /**
   * Position the help bubble relative to an anchor element
   */
  positionHelpBubble(bubble, anchor) {
    const anchorRect = anchor.getBoundingClientRect();
    const bubbleWidth = 300; // Width of the bubble
    const bubbleHeight = 250; // Approximate height of the bubble
    const margin = 10; // Margin from the anchor

    // Get character's preferred position
    let position = this.characters[this.character].bubblePosition;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate positions for each side
    const positions = {
      right: {
        top: anchorRect.top + anchorRect.height / 2 - bubbleHeight / 2,
        left: anchorRect.right + margin,
      },
      left: {
        top: anchorRect.top + anchorRect.height / 2 - bubbleHeight / 2,
        left: anchorRect.left - bubbleWidth - margin,
      },
      top: {
        top: anchorRect.top - bubbleHeight - margin,
        left: anchorRect.left + anchorRect.width / 2 - bubbleWidth / 2,
      },
      bottom: {
        top: anchorRect.bottom + margin,
        left: anchorRect.left + anchorRect.width / 2 - bubbleWidth / 2,
      },
    };

    // Check if the preferred position would go off screen
    const pos = positions[position];

    // Check if the bubble would go off screen in preferred position
    let isOffScreen = false;

    if (position === 'right' && pos.left + bubbleWidth > viewportWidth) {
      isOffScreen = true;
    } else if (position === 'left' && pos.left < 0) {
      isOffScreen = true;
    } else if (position === 'top' && pos.top < 0) {
      isOffScreen = true;
    } else if (position === 'bottom' && pos.top + bubbleHeight > viewportHeight) {
      isOffScreen = true;
    }

    // If off screen, find a better position
    if (isOffScreen) {
      // Try each position and find the one that fits best
      const positionFits = Object.keys(positions).map((p) => {
        const pos = positions[p];
        const fits = !(
          pos.left < 0 ||
          pos.left + bubbleWidth > viewportWidth ||
          pos.top < 0 ||
          pos.top + bubbleHeight > viewportHeight
        );
        return { position: p, fits };
      });

      const fitPosition = positionFits.find((p) => p.fits);

      if (fitPosition) {
        position = fitPosition.position;
      } else {
        // If no position fits perfectly, try to position it in the center of the viewport
        position = 'center';
      }
    }

    // Set the final position
    if (position === 'center') {
      bubble.style.top = '50%';
      bubble.style.left = '50%';
      bubble.style.transform = 'translate(-50%, -50%)';
    } else {
      const finalPos = positions[position];
      bubble.style.top = `${finalPos.top}px`;
      bubble.style.left = `${finalPos.left}px`;
    }
  }

  /**
   * Hide the active help bubble
   */
  hideHelpBubble() {
    if (!this.activeHelpBubble) return;

    const bubble = this.activeHelpBubble;
    const character = this.characters[this.character];

    // Remove current animations
    bubble.className = 'contextual-help-bubble visible';

    // Add exit animation
    bubble.classList.add(`anim-${character.exitAnimation}`);

    // Remove from DOM after animation
    setTimeout(() => {
      if (bubble.parentNode) {
        bubble.parentNode.removeChild(bubble);
      }
      if (this.activeHelpBubble === bubble) {
        this.activeHelpBubble = null;
      }
    }, 500);
  }

  /**
   * Show help for first-time users
   */
  showFirstTimeHelp() {
    // Show general help for first-time users
    setTimeout(() => {
      this.showHelpBubble('general-help');
    }, 2000); // Delay to let the page load
  }

  /**
   * Get the title for a given context
   */
  getContextTitle(context) {
    return (this.helpContexts[context] || { title: 'Help' }).title;
  }

  /**
   * Check if the user has seen help before
   */
  hasSeenHelp() {
    if (!this.persistState) return false;
    return localStorage.getItem('contextualHelpSeen') === 'true';
  }

  /**
   * Mark that the user has seen help
   */
  markHelpAsSeen() {
    if (this.persistState) {
      localStorage.setItem('contextualHelpSeen', 'true');
    }
  }

  /**
   * Switch the character
   */
  switchCharacter(character) {
    if (this.characters[character]) {
      // Store the current character
      this.character = character;

      // Store preference
      if (this.persistState) {
        localStorage.setItem('contextualHelpCharacter', character);
      }

      // Hide active bubble
      if (this.activeHelpBubble) {
        const currentContext = this.currentContext;
        this.hideHelpBubble();

        // Show the same context with new character
        setTimeout(() => {
          this.showHelpBubble(currentContext);
        }, 600);
      }

      // Update styles
      document.getElementById('contextual-help-styles').remove();
      this.addStyles();

      // Update icons
      this.helpPoints.forEach((point) => {
        if (point.icon) {
          point.added = false;
          if (point.icon.parentNode) {
            point.icon.parentNode.removeChild(point.icon);
          }
          point.icon = null;
        }
      });

      // Re-create icons
      this.createHelpIcons();

      return true;
    }

    return false;
  }

  /**
   * Change animation level
   */
  setAnimationLevel(level) {
    if (['minimal', 'medium', 'playful'].includes(level)) {
      this.animationLevel = level;

      // Store preference
      if (this.persistState) {
        localStorage.setItem('contextualHelpAnimation', level);
      }

      // Update styles
      document.getElementById('contextual-help-styles').remove();
      this.addStyles();

      return true;
    }

    return false;
  }

  /**
   * Add a custom help context
   */
  addHelpContext(id, data) {
    if (id && data && data.title && Array.isArray(data.tips) && data.tips.length > 0) {
      this.helpContexts[id] = data;
      return true;
    }

    return false;
  }

  /**
   * Manually trigger help for a specific element or context
   */
  showHelpFor(contextOrElement) {
    if (typeof contextOrElement === 'string') {
      // Context ID provided
      const context = contextOrElement;

      if (this.helpContexts[context]) {
        // Look for an element with this context
        const helpPoint = this.helpPoints.find((p) => p.context === context);

        if (helpPoint && helpPoint.icon) {
          this.showHelpBubble(context, helpPoint.icon);
        } else {
          this.showHelpBubble(context);
        }

        return true;
      }
    } else if (contextOrElement instanceof HTMLElement) {
      // HTML Element provided
      const element = contextOrElement;

      // Look for this element in our help points
      const helpPoint = this.helpPoints.find((p) => p.element === element);

      if (helpPoint) {
        this.showHelpBubble(helpPoint.context, helpPoint.icon);
        return true;
      } else if (element.hasAttribute('data-help-context')) {
        // Element has help context but wasn't in our help points
        const context = element.getAttribute('data-help-context');
        this.showHelpBubble(context, element);
        return true;
      }
    }

    return false;
  }
}

// Export to window object
window.ContextualHelpSystem = ContextualHelpSystem;

// Initialize if auto-initialize attribute is present
document.addEventListener('DOMContentLoaded', () => {
  const autoInit = document.querySelector('[data-auto-init-contextual-help]');

  if (autoInit) {
    const options = {
      character: autoInit.getAttribute('data-help-character') || 'stella',
      animationLevel: autoInit.getAttribute('data-help-animation') || 'medium',
      autoShowFirstTime: autoInit.getAttribute('data-help-auto-show') !== 'false',
      persistState: autoInit.getAttribute('data-help-persist') !== 'false',
      debug: autoInit.getAttribute('data-help-debug') === 'true',
    };

    window.contextualHelp = new ContextualHelpSystem(options);
  }
});
