/**
 * Onboarding Wizard for ShotziOS
 *
 * This script provides a gentle, step-by-step onboarding experience for new users of the ShotziOS
 * educational platform, with character introductions and interactive guidance.
 */

class OnboardingWizard {
  constructor(options = {}) {
    // Configuration options
    this.container = options.container || document.body;
    this.steps = options.steps || this.getDefaultSteps();
    this.currentStep = 0;
    this.isActive = false;
    this.characterPreference = options.characterPreference || 'random';
    this.userProfile = {
      name: '',
      preferredCharacter: null,
      neurotype: '',
      gradeLevel: '',
      interests: [],
      learningPreferences: {},
    };

    // Character definitions
    this.characters = {
      stella: {
        name: 'Stella',
        emoji: '⭐',
        color: '#3498db', // blue
        accentColor: '#5dade2',
        personality: 'encouraging',
        introduction:
          "Hi there! I'm Stella, your personal learning assistant. I'm here to support you every step of the way with gentle guidance and encouragement. I can help you find resources, organize your learning, and celebrate your achievements!",
        welcomeMessage:
          "Let's get to know each other! I'm excited to help you on your learning journey. What should I call you?",
        style: 'supportive and nurturing',
      },

      max: {
        name: 'Max',
        emoji: '🚀',
        color: '#e67e22', // orange
        accentColor: '#f39c12',
        personality: 'enthusiastic',
        introduction:
          "Hey there, future superstar! I'm Max, your energetic learning companion! I'm all about making learning exciting and fun. I'll help you blast through challenges and celebrate your awesome victories!",
        welcomeMessage:
          "Ready for an amazing learning adventure? Let's go! First things first - what's your name, champion?",
        style: 'high-energy and motivating',
      },

      nova: {
        name: 'Nova',
        emoji: '🌟',
        color: '#9b59b6', // purple
        accentColor: '#8e44ad',
        personality: 'calm',
        introduction:
          "Hello there. I'm Nova, your analytical learning guide. I take a methodical approach to help you understand complex topics with clarity. I'll help you organize information and develop structured learning strategies.",
        welcomeMessage:
          'Welcome to your personalized learning environment. To begin our work together, please share your name.',
        style: 'logical and structured',
      },
    };

    // DOM elements
    this.wizardElement = null;
    this.backdropElement = null;
    this.stepContentElement = null;

    // Initialize if autostart is enabled
    if (options.autoStart === true) {
      this.initialize();
    }
  }

  /**
   * Initialize the wizard
   */
  initialize() {
    // Create wizard elements
    this.createWizardElements();

    // Setup event handlers
    this.setupEventHandlers();

    // Check if user has completed onboarding before
    if (this.hasCompletedOnboarding()) {
      // Don't auto-start if already completed
      return;
    }

    // Start the wizard
    this.start();
  }

  /**
   * Create the wizard DOM elements
   */
  createWizardElements() {
    // Create backdrop
    this.backdropElement = document.createElement('div');
    this.backdropElement.className = 'onboarding-backdrop';
    this.backdropElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    `;

    // Create wizard container
    this.wizardElement = document.createElement('div');
    this.wizardElement.className = 'onboarding-wizard';
    this.wizardElement.setAttribute('role', 'dialog');
    this.wizardElement.setAttribute('aria-labelledby', 'wizard-title');
    this.wizardElement.style.cssText = `
      background-color: #121212;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 0;
      transform: translateY(20px);
      transition: transform 0.3s ease;
      position: relative;
      color: #fff;
      border: 2px solid #1e90ff;
    `;

    // Create header
    const header = document.createElement('div');
    header.className = 'wizard-header';
    header.style.cssText = `
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    `;

    // Create title
    const title = document.createElement('h2');
    title.id = 'wizard-title';
    title.textContent = 'Welcome to ShotziOS';
    title.style.cssText = `
      margin: 0;
      font-size: 1.5rem;
      color: #1e90ff;
    `;

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'wizard-close';
    closeButton.setAttribute('aria-label', 'Close wizard');
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.5);
      transition: color 0.2s ease;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    `;
    closeButton.addEventListener('mouseover', () => {
      closeButton.style.color = 'rgba(255, 255, 255, 0.8)';
    });
    closeButton.addEventListener('mouseout', () => {
      closeButton.style.color = 'rgba(255, 255, 255, 0.5)';
    });

    // Add title and close button to header
    header.appendChild(title);
    header.appendChild(closeButton);

    // Create content area
    this.stepContentElement = document.createElement('div');
    this.stepContentElement.className = 'wizard-content';
    this.stepContentElement.style.cssText = `
      padding: 24px;
      min-height: 200px;
    `;

    // Create footer
    const footer = document.createElement('div');
    footer.className = 'wizard-footer';
    footer.style.cssText = `
      padding: 16px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
    `;

    // Create navigation buttons
    this.prevButton = document.createElement('button');
    this.prevButton.className = 'wizard-prev btn';
    this.prevButton.textContent = 'Back';
    this.prevButton.disabled = true;
    this.prevButton.style.cssText = `
      background-color: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    `;

    this.nextButton = document.createElement('button');
    this.nextButton.className = 'wizard-next btn btn-primary';
    this.nextButton.textContent = 'Next';
    this.nextButton.style.cssText = `
      background-color: #1e90ff;
      border: none;
      color: #fff;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s ease;
    `;

    // Add buttons to footer
    footer.appendChild(this.prevButton);
    footer.appendChild(this.nextButton);

    // Assemble wizard
    this.wizardElement.appendChild(header);
    this.wizardElement.appendChild(this.stepContentElement);
    this.wizardElement.appendChild(footer);

    // Add wizard to backdrop
    this.backdropElement.appendChild(this.wizardElement);

    // Add to DOM
    document.body.appendChild(this.backdropElement);

    // Accessibility enhancements
    this.setupAccessibility();
  }

  /**
   * Add accessibility features to the wizard
   */
  setupAccessibility() {
    // Add ARIA attributes
    this.wizardElement.setAttribute('role', 'dialog');
    this.wizardElement.setAttribute('aria-modal', 'true');

    // Add keyboard navigation
    this.wizardElement.addEventListener('keydown', (e) => {
      // Close on escape
      if (e.key === 'Escape') {
        this.close();
      }
      // Move forward with Tab
      if (e.key === 'Tab' && !e.shiftKey) {
        if (document.activeElement === this.nextButton) {
          this.prevButton.focus();
          e.preventDefault();
        }
      }
      // Move backward with Shift+Tab
      if (e.key === 'Tab' && e.shiftKey) {
        if (document.activeElement === this.prevButton) {
          this.nextButton.focus();
          e.preventDefault();
        }
      }
    });
  }

  /**
   * Setup event handlers for wizard buttons
   */
  setupEventHandlers() {
    // Close button event
    const closeBtn = this.wizardElement.querySelector('.wizard-close');
    closeBtn.addEventListener('click', () => this.close());

    // Previous button event
    this.prevButton.addEventListener('click', () => this.goToPrevStep());

    // Next button event
    this.nextButton.addEventListener('click', () => this.goToNextStep());
  }

  /**
   * Start the onboarding wizard
   */
  start() {
    if (this.isActive) return;

    // Make wizard visible
    this.backdropElement.style.opacity = '1';
    this.backdropElement.style.pointerEvents = 'auto';
    this.wizardElement.style.transform = 'translateY(0)';

    // Mark as active
    this.isActive = true;

    // Generate a semi-random initial character if not specified
    if (this.characterPreference === 'random') {
      const characterKeys = Object.keys(this.characters);
      const randomIndex = Math.floor(Math.random() * characterKeys.length);
      this.currentCharacter = this.characters[characterKeys[randomIndex]];
    } else if (this.characters[this.characterPreference]) {
      this.currentCharacter = this.characters[this.characterPreference];
    } else {
      this.currentCharacter = this.characters.stella; // Default to Stella
    }

    // Show first step
    this.showStep(0);

    // Announce for screen readers
    this.announceToScreenReader('Onboarding wizard opened. Welcome to ShotziOS!');

    // Focus the first focusable element
    setTimeout(() => {
      this.nextButton.focus();
    }, 100);
  }

  /**
   * Close the onboarding wizard
   */
  close() {
    if (!this.isActive) return;

    // Hide wizard
    this.backdropElement.style.opacity = '0';
    this.backdropElement.style.pointerEvents = 'none';
    this.wizardElement.style.transform = 'translateY(20px)';

    // Mark as inactive
    this.isActive = false;

    // Announce for screen readers
    this.announceToScreenReader('Onboarding wizard closed.');

    // Set a flag that the user has completed or skipped onboarding
    localStorage.setItem('shotziOS_onboarding_completed', 'true');

    // Save user preferences
    this.saveUserPreferences();
  }

  /**
   * Check if the user has completed onboarding before
   */
  hasCompletedOnboarding() {
    return localStorage.getItem('shotziOS_onboarding_completed') === 'true';
  }

  /**
   * Display a specific step in the wizard
   * @param {number} stepIndex - The index of the step to show
   */
  showStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= this.steps.length) return;

    // Update current step
    this.currentStep = stepIndex;

    // Get step data
    const step = this.steps[this.currentStep];

    // Update content
    this.renderStepContent(step);

    // Update button states
    this.prevButton.disabled = this.currentStep === 0;

    if (this.currentStep === this.steps.length - 1) {
      this.nextButton.textContent = 'Get Started';
    } else {
      this.nextButton.textContent = 'Next';
    }

    // Update progress indicator if it exists
    this.updateProgressIndicator();

    // Announce step change for screen readers
    this.announceToScreenReader(
      `Step ${this.currentStep + 1} of ${this.steps.length}: ${step.title}`,
    );
  }

  /**
   * Render the content of the current step
   * @param {Object} step - The step data to render
   */
  renderStepContent(step) {
    // Clear previous content
    this.stepContentElement.innerHTML = '';

    // Create step title
    const title = document.createElement('h3');
    title.textContent = step.title;
    title.style.cssText = `
      margin-top: 0;
      margin-bottom: 16px;
      color: #32cd32;
      font-size: 1.2rem;
    `;

    // Create step content
    const content = document.createElement('div');

    // Handle special step types
    if (step.type === 'character-introduction') {
      content.appendChild(this.renderCharacterIntroduction());
    } else if (step.type === 'character-selection') {
      content.appendChild(this.renderCharacterSelection());
    } else if (step.type === 'user-profile') {
      content.appendChild(this.renderUserProfileForm());
    } else if (step.type === 'neurotype-selection') {
      content.appendChild(this.renderNeurotypeSelection());
    } else if (step.type === 'learning-preferences') {
      content.appendChild(this.renderLearningPreferences());
    } else if (step.type === 'curriculum-preview') {
      content.appendChild(this.renderCurriculumPreview());
    } else if (step.type === 'custom' && typeof step.render === 'function') {
      // Custom render function provided
      const customContent = step.render(this);
      if (customContent instanceof HTMLElement) {
        content.appendChild(customContent);
      } else {
        content.innerHTML = customContent;
      }
    } else {
      // Default content rendering
      content.innerHTML = step.content;
    }

    // Add progress indicator
    const progressContainer = document.createElement('div');
    progressContainer.className = 'wizard-progress';
    progressContainer.style.cssText = `
      display: flex;
      justify-content: center;
      margin-top: 24px;
      gap: 8px;
    `;

    for (let i = 0; i < this.steps.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      dot.style.cssText = `
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: ${i === this.currentStep ? '#1e90ff' : 'rgba(255, 255, 255, 0.2)'};
        transition: background-color 0.3s ease;
      `;
      progressContainer.appendChild(dot);
    }

    // Assemble the step content
    this.stepContentElement.appendChild(title);
    this.stepContentElement.appendChild(content);
    this.stepContentElement.appendChild(progressContainer);
  }

  /**
   * Render the character introduction content
   * @returns {HTMLElement} The character introduction element
   */
  renderCharacterIntroduction() {
    const container = document.createElement('div');
    container.className = 'character-introduction';
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    `;

    // Character avatar
    const avatar = document.createElement('div');
    avatar.className = 'character-avatar';
    avatar.style.cssText = `
      font-size: 4rem;
      width: 100px;
      height: 100px;
      background-color: ${this.currentCharacter.color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      animation: pulse 2s infinite;
    `;
    avatar.textContent = this.currentCharacter.emoji;

    // Character name
    const name = document.createElement('h3');
    name.className = 'character-name';
    name.textContent = this.currentCharacter.name;
    name.style.cssText = `
      margin: 0;
      font-size: 1.8rem;
      color: ${this.currentCharacter.color};
    `;

    // Character introduction
    const intro = document.createElement('p');
    intro.className = 'character-intro';
    intro.textContent = this.currentCharacter.introduction;
    intro.style.cssText = `
      text-align: center;
      line-height: 1.6;
      margin: 0;
    `;

    // Character welcome message
    const welcome = document.createElement('p');
    welcome.className = 'character-welcome';
    welcome.textContent = this.currentCharacter.welcomeMessage;
    welcome.style.cssText = `
      text-align: center;
      font-style: italic;
      margin-top: 16px;
      padding: 12px;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      border-left: 3px solid ${this.currentCharacter.color};
    `;

    // Name input
    const nameInput = document.createElement('div');
    nameInput.className = 'name-input-container';
    nameInput.style.cssText = `
      width: 100%;
      margin-top: 20px;
    `;

    const nameLabel = document.createElement('label');
    nameLabel.htmlFor = 'user-name-input';
    nameLabel.textContent = 'What should I call you?';
    nameLabel.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
    `;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'user-name-input';
    input.placeholder = 'Enter your name';
    input.style.cssText = `
      width: 100%;
      padding: 10px 12px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      background-color: rgba(255, 255, 255, 0.05);
      color: white;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    `;
    input.addEventListener('focus', () => {
      input.style.borderColor = this.currentCharacter.color;
    });
    input.addEventListener('blur', () => {
      input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    });
    input.addEventListener('input', (e) => {
      this.userProfile.name = e.target.value;
      // Enable/disable next button based on name input
      this.nextButton.disabled = !e.target.value.trim();
    });

    // Assemble the container
    nameInput.appendChild(nameLabel);
    nameInput.appendChild(input);

    container.appendChild(avatar);
    container.appendChild(name);
    container.appendChild(intro);
    container.appendChild(welcome);
    container.appendChild(nameInput);

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);

    // Focus the name input
    setTimeout(() => {
      input.focus();
    }, 300);

    return container;
  }

  /**
   * Render the character selection screen
   * @returns {HTMLElement} The character selection element
   */
  renderCharacterSelection() {
    const container = document.createElement('div');
    container.className = 'character-selection';
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 20px;
    `;

    // Introduction text
    const intro = document.createElement('p');
    intro.textContent = `Hi ${this.userProfile.name || 'there'}! Choose the learning companion that feels right for you. Each has their own personality and teaching style.`;
    intro.style.cssText = `
      margin: 0 0 10px 0;
    `;

    // Characters container
    const charactersContainer = document.createElement('div');
    charactersContainer.className = 'characters-container';
    charactersContainer.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    `;

    // Create card for each character
    Object.keys(this.characters).forEach((key) => {
      const character = this.characters[key];

      const card = document.createElement('div');
      card.className = 'character-card';
      card.dataset.character = key;
      card.style.cssText = `
        width: 160px;
        padding: 16px;
        background-color: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
      `;

      // Selected state styling
      if (this.userProfile.preferredCharacter === key) {
        card.style.borderColor = character.color;
        card.style.backgroundColor = `${character.color}22`;
        card.style.transform = 'translateY(-5px)';
      }

      // Avatar
      const avatar = document.createElement('div');
      avatar.className = 'character-avatar';
      avatar.style.cssText = `
        font-size: 2.5rem;
        width: 60px;
        height: 60px;
        background-color: ${character.color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
      `;
      avatar.textContent = character.emoji;

      // Name
      const name = document.createElement('h4');
      name.className = 'character-name';
      name.textContent = character.name;
      name.style.cssText = `
        margin: 0 0 8px 0;
        color: ${character.color};
      `;

      // Personality
      const personality = document.createElement('div');
      personality.className = 'character-personality';
      personality.textContent = character.style;
      personality.style.cssText = `
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        text-align: center;
      `;

      // Assemble card
      card.appendChild(avatar);
      card.appendChild(name);
      card.appendChild(personality);

      // Event listeners
      card.addEventListener('mouseover', () => {
        if (this.userProfile.preferredCharacter !== key) {
          card.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          card.style.borderColor = character.color;
        }
      });

      card.addEventListener('mouseout', () => {
        if (this.userProfile.preferredCharacter !== key) {
          card.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
      });

      card.addEventListener('click', () => {
        // Deselect all cards
        document.querySelectorAll('.character-card').forEach((c) => {
          const charKey = c.dataset.character;
          c.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          c.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          c.style.transform = 'translateY(0)';
        });

        // Select this card
        card.style.borderColor = character.color;
        card.style.backgroundColor = `${character.color}22`;
        card.style.transform = 'translateY(-5px)';

        // Set preferred character
        this.userProfile.preferredCharacter = key;
        this.currentCharacter = character;

        // Enable next button
        this.nextButton.disabled = false;
      });

      charactersContainer.appendChild(card);
    });

    // Description
    const description = document.createElement('p');
    description.className = 'selection-description';
    description.textContent =
      'Your companion will help guide you through the platform and provide assistance based on your preferences. You can change your companion later in settings.';
    description.style.cssText = `
      margin: 10px 0 0 0;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
    `;

    container.appendChild(intro);
    container.appendChild(charactersContainer);
    container.appendChild(description);

    return container;
  }

  /**
   * Render the user profile form
   * @returns {HTMLElement} The user profile form element
   */
  renderUserProfileForm() {
    const container = document.createElement('div');
    container.className = 'user-profile-form';
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 16px;
    `;

    // Introduction
    const intro = document.createElement('p');
    const characterName = this.currentCharacter ? this.currentCharacter.name : 'your companion';
    intro.textContent = `Tell ${characterName} a bit more about yourself so we can personalize your learning experience.`;
    intro.style.cssText = `
      margin: 0 0 10px 0;
    `;

    // Grade level selection
    const gradeLevelContainer = document.createElement('div');
    gradeLevelContainer.className = 'form-group';

    const gradeLevelLabel = document.createElement('label');
    gradeLevelLabel.htmlFor = 'grade-level';
    gradeLevelLabel.textContent = 'What grade level are you in?';
    gradeLevelLabel.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
    `;

    const gradeLevelSelect = document.createElement('select');
    gradeLevelSelect.id = 'grade-level';
    gradeLevelSelect.style.cssText = `
      width: 100%;
      padding: 10px 12px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      background-color: rgba(255, 255, 255, 0.05);
      color: white;
      font-size: 1rem;
    `;

    // Add grade level options
    const gradeLevels = [
      'Pre-K',
      'Kindergarten',
      '1st Grade',
      '2nd Grade',
      '3rd Grade',
      '4th Grade',
      '5th Grade',
      '6th Grade',
      '7th Grade',
      '8th Grade',
      '9th Grade',
      '10th Grade',
      '11th Grade',
      '12th Grade',
      'College',
      'Adult Learner',
    ];

    // Add placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Select grade level';
    placeholderOption.selected = true;
    placeholderOption.disabled = true;
    gradeLevelSelect.appendChild(placeholderOption);

    gradeLevels.forEach((level) => {
      const option = document.createElement('option');
      option.value = level;
      option.textContent = level;
      if (this.userProfile.gradeLevel === level) {
        option.selected = true;
      }
      gradeLevelSelect.appendChild(option);
    });

    gradeLevelSelect.addEventListener('change', (e) => {
      this.userProfile.gradeLevel = e.target.value;
    });

    gradeLevelContainer.appendChild(gradeLevelLabel);
    gradeLevelContainer.appendChild(gradeLevelSelect);

    // Interests selection
    const interestsContainer = document.createElement('div');
    interestsContainer.className = 'form-group';

    const interestsLabel = document.createElement('label');
    interestsLabel.textContent = 'What subjects or topics interest you? (Select all that apply)';
    interestsLabel.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
    `;

    const interestsOptions = document.createElement('div');
    interestsOptions.className = 'interests-options';
    interestsOptions.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 8px;
    `;

    // List of interests
    const interests = [
      'Math',
      'Science',
      'Reading',
      'Writing',
      'History',
      'Art',
      'Music',
      'Physical Education',
      'Technology',
      'Languages',
      'Social Studies',
      'Astronomy',
      'Animals',
    ];

    interests.forEach((interest) => {
      const interestContainer = document.createElement('div');
      interestContainer.className = 'interest-option';
      interestContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 6px;
      `;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `interest-${interest.toLowerCase().replace(' ', '-')}`;
      checkbox.value = interest;

      if (this.userProfile.interests && this.userProfile.interests.includes(interest)) {
        checkbox.checked = true;
      }

      checkbox.addEventListener('change', (e) => {
        if (!this.userProfile.interests) {
          this.userProfile.interests = [];
        }

        if (e.target.checked) {
          this.userProfile.interests.push(interest);
        } else {
          const index = this.userProfile.interests.indexOf(interest);
          if (index > -1) {
            this.userProfile.interests.splice(index, 1);
          }
        }
      });

      const label = document.createElement('label');
      label.htmlFor = `interest-${interest.toLowerCase().replace(' ', '-')}`;
      label.textContent = interest;

      interestContainer.appendChild(checkbox);
      interestContainer.appendChild(label);

      interestsOptions.appendChild(interestContainer);
    });

    interestsContainer.appendChild(interestsLabel);
    interestsContainer.appendChild(interestsOptions);

    // Assemble container
    container.appendChild(intro);
    container.appendChild(gradeLevelContainer);
    container.appendChild(interestsContainer);

    return container;
  }

  /**
   * Render the neurotype selection screen
   * @returns {HTMLElement} The neurotype selection element
   */
  renderNeurotypeSelection() {
    const container = document.createElement('div');
    container.className = 'neurotype-selection';
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 20px;
    `;

    // Introduction
    const intro = document.createElement('p');
    intro.textContent = `${this.userProfile.name || 'Our learners'} may have different ways of processing information. This helps us tailor your experience. Select any that apply to you:`;
    intro.style.cssText = `
      margin: 0 0 10px 0;
    `;

    // Description
    const description = document.createElement('p');
    description.innerHTML =
      '<em>This information is kept private and only used to adapt your learning environment.</em>';
    description.style.cssText = `
      margin: 0;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
    `;

    // Neurotype options
    const neurotypeList = document.createElement('div');
    neurotypeList.className = 'neurotype-list';
    neurotypeList.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
    `;

    // Define neurotypes
    const neurotypes = [
      {
        id: 'neurotypical',
        name: 'Neurotypical',
        description: "I learn in conventional ways and don't require specific adaptations.",
      },
      {
        id: 'adhd',
        name: 'ADHD',
        description:
          'I may benefit from structured content with frequent breaks and interactive elements.',
      },
      {
        id: 'autism',
        name: 'Autism Spectrum',
        description:
          'I may benefit from clear instructions, predictable patterns, and reduced sensory distractions.',
      },
      {
        id: 'dyslexia',
        name: 'Dyslexia',
        description:
          'I may benefit from alternative text presentations, audio support, and multisensory approaches.',
      },
      {
        id: 'dyscalculia',
        name: 'Dyscalculia',
        description:
          'I may benefit from visual aids for mathematical concepts and step-by-step instructions.',
      },
      {
        id: 'dyspraxia',
        name: 'Dyspraxia',
        description: 'I may benefit from additional time for tasks and alternative input methods.',
      },
      {
        id: 'sensory',
        name: 'Sensory Processing Differences',
        description:
          'I may benefit from customizable interface settings to reduce sensory overwhelm.',
      },
      {
        id: 'executive',
        name: 'Executive Function Challenges',
        description:
          'I may benefit from task breakdowns, visual schedules, and organization support.',
      },
    ];

    neurotypes.forEach((neurotype) => {
      const neurotypeOption = document.createElement('div');
      neurotypeOption.className = 'neurotype-option';
      neurotypeOption.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.05);
        cursor: pointer;
        transition: all 0.2s ease;
      `;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `neurotype-${neurotype.id}`;
      checkbox.className = 'neurotype-checkbox';
      checkbox.style.cssText = `
        width: 18px;
        height: 18px;
      `;

      if (this.userProfile.neurotype === neurotype.id) {
        checkbox.checked = true;
        neurotypeOption.style.backgroundColor = 'rgba(30, 144, 255, 0.2)';
        neurotypeOption.style.borderLeft = '3px solid #1e90ff';
      }

      const labelContainer = document.createElement('div');
      labelContainer.style.cssText = `
        flex: 1;
      `;

      const nameLabel = document.createElement('label');
      nameLabel.htmlFor = `neurotype-${neurotype.id}`;
      nameLabel.textContent = neurotype.name;
      nameLabel.style.cssText = `
        display: block;
        font-weight: bold;
        margin-bottom: 4px;
      `;

      const descriptionLabel = document.createElement('div');
      descriptionLabel.textContent = neurotype.description;
      descriptionLabel.style.cssText = `
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
      `;

      labelContainer.appendChild(nameLabel);
      labelContainer.appendChild(descriptionLabel);

      neurotypeOption.appendChild(checkbox);
      neurotypeOption.appendChild(labelContainer);

      // Click events
      neurotypeOption.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked;

        if (checkbox.checked) {
          this.userProfile.neurotype = neurotype.id;
          neurotypeOption.style.backgroundColor = 'rgba(30, 144, 255, 0.2)';
          neurotypeOption.style.borderLeft = '3px solid #1e90ff';
        } else {
          if (this.userProfile.neurotype === neurotype.id) {
            this.userProfile.neurotype = '';
          }
          neurotypeOption.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          neurotypeOption.style.borderLeft = 'none';
        }

        // Update other options if neurotypical is selected
        if (neurotype.id === 'neurotypical' && checkbox.checked) {
          document.querySelectorAll('.neurotype-checkbox').forEach((cb) => {
            if (cb.id !== 'neurotype-neurotypical') {
              cb.checked = false;
              cb.closest('.neurotype-option').style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              cb.closest('.neurotype-option').style.borderLeft = 'none';
            }
          });
        } else if (checkbox.checked) {
          // If any other option is selected, uncheck neurotypical
          const neurotypicalOption = document.getElementById('neurotype-neurotypical');
          if (neurotypicalOption && neurotypicalOption.checked) {
            neurotypicalOption.checked = false;
            neurotypicalOption.closest('.neurotype-option').style.backgroundColor =
              'rgba(255, 255, 255, 0.05)';
            neurotypicalOption.closest('.neurotype-option').style.borderLeft = 'none';
          }
        }
      });

      // Hover effects
      neurotypeOption.addEventListener('mouseover', () => {
        if (!checkbox.checked) {
          neurotypeOption.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
      });

      neurotypeOption.addEventListener('mouseout', () => {
        if (!checkbox.checked) {
          neurotypeOption.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }
      });

      neurotypeList.appendChild(neurotypeOption);
    });

    // Assemble container
    container.appendChild(intro);
    container.appendChild(description);
    container.appendChild(neurotypeList);

    return container;
  }

  /**
   * Render the learning preferences selection
   * @returns {HTMLElement} The learning preferences element
   */
  renderLearningPreferences() {
    const container = document.createElement('div');
    container.className = 'learning-preferences';
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 20px;
    `;

    // Introduction
    const intro = document.createElement('p');
    intro.textContent = `Almost done, ${this.userProfile.name || 'there'}! Let's customize how you prefer to learn.`;
    intro.style.cssText = `
      margin: 0 0 10px 0;
    `;

    // Create preferences form
    const preferencesForm = document.createElement('div');
    preferencesForm.className = 'preferences-form';
    preferencesForm.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 20px;
    `;

    // Learning style preference
    const learningStyleContainer = document.createElement('div');
    learningStyleContainer.className = 'form-group';

    const learningStyleLabel = document.createElement('label');
    learningStyleLabel.textContent = 'How do you prefer to learn new information?';
    learningStyleLabel.style.cssText = `
      display: block;
      margin-bottom: 12px;
      font-weight: bold;
    `;

    const learningStyleOptions = document.createElement('div');
    learningStyleOptions.className = 'learning-style-options';
    learningStyleOptions.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    `;

    const learningStyles = [
      { id: 'visual', name: 'Visual (images, diagrams, videos)' },
      { id: 'auditory', name: 'Auditory (listening, discussing)' },
      { id: 'reading', name: 'Reading/Writing (text-based)' },
      { id: 'kinesthetic', name: 'Hands-on (interactive activities)' },
    ];

    learningStyles.forEach((style) => {
      const styleOption = document.createElement('div');
      styleOption.className = 'style-option';
      styleOption.style.cssText = `
        flex: 1 0 45%;
        min-width: 200px;
      `;

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'learning-style';
      radio.id = `style-${style.id}`;
      radio.value = style.id;

      if (
        this.userProfile.learningPreferences &&
        this.userProfile.learningPreferences.style === style.id
      ) {
        radio.checked = true;
      }

      radio.addEventListener('change', () => {
        if (!this.userProfile.learningPreferences) {
          this.userProfile.learningPreferences = {};
        }
        this.userProfile.learningPreferences.style = style.id;
      });

      const label = document.createElement('label');
      label.htmlFor = `style-${style.id}`;
      label.textContent = style.name;
      label.style.cssText = `
        margin-left: 8px;
      `;

      styleOption.appendChild(radio);
      styleOption.appendChild(label);

      learningStyleOptions.appendChild(styleOption);
    });

    learningStyleContainer.appendChild(learningStyleLabel);
    learningStyleContainer.appendChild(learningStyleOptions);

    // Pace preference
    const paceContainer = document.createElement('div');
    paceContainer.className = 'form-group';

    const paceLabel = document.createElement('label');
    paceLabel.textContent = 'What learning pace works best for you?';
    paceLabel.style.cssText = `
      display: block;
      margin-bottom: 12px;
      font-weight: bold;
    `;

    const paceSlider = document.createElement('div');
    paceSlider.className = 'pace-slider';
    paceSlider.style.cssText = `
      width: 100%;
    `;

    const sliderContainer = document.createElement('div');
    sliderContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
    `;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '1';
    slider.max = '5';
    slider.value = this.userProfile.learningPreferences?.pace || '3';
    slider.style.cssText = `
      flex: 1;
      height: 6px;
    `;

    slider.addEventListener('input', (e) => {
      if (!this.userProfile.learningPreferences) {
        this.userProfile.learningPreferences = {};
      }
      this.userProfile.learningPreferences.pace = e.target.value;

      // Update labels
      const paceValue = parseInt(e.target.value);
      document.querySelectorAll('.pace-label').forEach((label) => {
        label.style.fontWeight = 'normal';
      });

      const activeLabel = document.querySelector(`.pace-label[data-value="${paceValue}"]`);
      if (activeLabel) {
        activeLabel.style.fontWeight = 'bold';
      }
    });

    sliderContainer.appendChild(slider);

    const paceLabels = document.createElement('div');
    paceLabels.style.cssText = `
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
    `;

    const paceOptions = [
      { value: 1, label: 'Very Gradual' },
      { value: 2, label: 'Methodical' },
      { value: 3, label: 'Balanced' },
      { value: 4, label: 'Quick' },
      { value: 5, label: 'Accelerated' },
    ];

    paceOptions.forEach((option) => {
      const label = document.createElement('span');
      label.className = 'pace-label';
      label.textContent = option.label;
      label.dataset.value = option.value;
      label.style.cssText = `
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        flex: 1;
        text-align: center;
      `;

      // Set initial active state
      if (parseInt(this.userProfile.learningPreferences?.pace || '3') === option.value) {
        label.style.fontWeight = 'bold';
      }

      // Click to set value
      label.addEventListener('click', () => {
        slider.value = option.value;

        // Trigger input event
        const event = new Event('input');
        slider.dispatchEvent(event);
      });

      paceLabels.appendChild(label);
    });

    paceSlider.appendChild(sliderContainer);
    paceSlider.appendChild(paceLabels);

    paceContainer.appendChild(paceLabel);
    paceContainer.appendChild(paceSlider);

    // Feedback preference
    const feedbackContainer = document.createElement('div');
    feedbackContainer.className = 'form-group';

    const feedbackLabel = document.createElement('label');
    feedbackLabel.textContent = 'How would you prefer to receive feedback?';
    feedbackLabel.style.cssText = `
      display: block;
      margin-bottom: 12px;
      font-weight: bold;
    `;

    const feedbackOptions = document.createElement('div');
    feedbackOptions.className = 'feedback-options';
    feedbackOptions.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    `;

    const feedbackTypes = [
      { id: 'immediate', name: 'Immediate feedback after each step' },
      { id: 'periodic', name: 'Periodic check-ins at natural breaks' },
      { id: 'end', name: 'Comprehensive feedback at the end' },
      { id: 'minimal', name: 'Minimal feedback, I prefer to self-assess' },
    ];

    feedbackTypes.forEach((type) => {
      const feedbackOption = document.createElement('div');
      feedbackOption.className = 'feedback-option';
      feedbackOption.style.cssText = `
        flex: 1 0 45%;
        min-width: 200px;
      `;

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'feedback-type';
      radio.id = `feedback-${type.id}`;
      radio.value = type.id;

      if (
        this.userProfile.learningPreferences &&
        this.userProfile.learningPreferences.feedback === type.id
      ) {
        radio.checked = true;
      }

      radio.addEventListener('change', () => {
        if (!this.userProfile.learningPreferences) {
          this.userProfile.learningPreferences = {};
        }
        this.userProfile.learningPreferences.feedback = type.id;
      });

      const label = document.createElement('label');
      label.htmlFor = `feedback-${type.id}`;
      label.textContent = type.name;
      label.style.cssText = `
        margin-left: 8px;
      `;

      feedbackOption.appendChild(radio);
      feedbackOption.appendChild(label);

      feedbackOptions.appendChild(feedbackOption);
    });

    feedbackContainer.appendChild(feedbackLabel);
    feedbackContainer.appendChild(feedbackOptions);

    // Assemble form
    preferencesForm.appendChild(learningStyleContainer);
    preferencesForm.appendChild(paceContainer);
    preferencesForm.appendChild(feedbackContainer);

    // Assemble container
    container.appendChild(intro);
    container.appendChild(preferencesForm);

    return container;
  }

  /**
   * Render the curriculum preview
   * @returns {HTMLElement} The curriculum preview element
   */
  renderCurriculumPreview() {
    const container = document.createElement('div');
    container.className = 'curriculum-preview';
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 20px;
    `;

    // Header with user name and companion
    const header = document.createElement('div');
    header.className = 'preview-header';
    header.style.cssText = `
      display: flex;
      align-items: center;
      gap: 16px;
    `;

    // Companion avatar
    const companionAvatar = document.createElement('div');
    companionAvatar.className = 'companion-avatar';
    companionAvatar.style.cssText = `
      font-size: 2rem;
      width: 50px;
      height: 50px;
      background-color: ${this.currentCharacter.color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    companionAvatar.textContent = this.currentCharacter.emoji;

    // Welcome message
    const welcomeContainer = document.createElement('div');
    welcomeContainer.style.cssText = `
      flex: 1;
    `;

    const welcome = document.createElement('h3');
    welcome.textContent = `Welcome to your personalized learning journey, ${this.userProfile.name || 'Super Learner'}!`;
    welcome.style.cssText = `
      margin: 0 0 6px 0;
      color: ${this.currentCharacter.color};
    `;

    const subtext = document.createElement('p');
    subtext.textContent = `${this.currentCharacter.name} will be your guide through the Neurodivergent Superhero School.`;
    subtext.style.cssText = `
      margin: 0;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
    `;

    welcomeContainer.appendChild(welcome);
    welcomeContainer.appendChild(subtext);

    header.appendChild(companionAvatar);
    header.appendChild(welcomeContainer);

    // Preview content
    const previewContent = document.createElement('div');
    previewContent.className = 'preview-content';
    previewContent.style.cssText = `
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 20px;
      border-left: 3px solid ${this.currentCharacter.color};
    `;

    // Create course preview
    let previewText = '';

    // Content based on user preferences
    if (this.userProfile) {
      const neurotype = this.userProfile.neurotype || 'neurotypical';
      const gradeLevel = this.userProfile.gradeLevel || '5th Grade';
      const interests =
        this.userProfile.interests && this.userProfile.interests.length > 0
          ? this.userProfile.interests.join(', ')
          : 'general subjects';

      previewText = `<p>Based on your profile, we've prepared a personalized curriculum tailored for ${neurotype === 'neurotypical' ? 'your learning style' : neurotype + ' learners'} at the ${gradeLevel} level.</p>
      
      <p>Your curriculum will feature courses in ${interests}, with adjustments to match your preferred learning style${this.userProfile.learningPreferences?.style ? ' (' + this.userProfile.learningPreferences.style + ')' : ''}.</p>
      
      <p>Your comprehensive curriculum follows Alabama education standards while incorporating superhero-themed elements to make learning engaging and memorable.</p>
      
      <p>You'll have access to:</p>
      <ul style="padding-left: 20px; margin: 10px 0;">
        <li>Interactive multi-modal lesson materials</li>
        <li>Personalized learning paths that adapt to your progress</li>
        <li>Strength-based assessments that showcase your unique abilities</li>
        <li>Specialized content that aligns with your neurodivergent profile</li>
        <li>Accessibility tools including voice guidance and visual aids</li>
      </ul>`;
    } else {
      previewText = `<p>We'll prepare a personalized curriculum based on Alabama education standards with superhero-themed elements to make learning engaging and memorable.</p>
      
      <p>You'll have access to:</p>
      <ul style="padding-left: 20px; margin: 10px 0;">
        <li>Interactive multi-modal lesson materials</li>
        <li>Personalized learning paths that adapt to your progress</li>
        <li>Strength-based assessments that showcase your unique abilities</li>
        <li>Specialized content for your specific learning needs</li>
        <li>Accessibility tools including voice guidance and visual aids</li>
      </ul>`;
    }

    previewContent.innerHTML = previewText;

    // Final message
    const finalMessage = document.createElement('div');
    finalMessage.className = 'final-message';
    finalMessage.style.cssText = `
      margin-top: 20px;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      border: 1px dashed rgba(255, 255, 255, 0.2);
    `;

    // Message from character
    const message = document.createElement('p');
    message.style.cssText = `
      margin: 0;
      font-style: italic;
    `;

    // Character-specific messages
    if (this.currentCharacter) {
      if (this.currentCharacter.personality === 'encouraging') {
        message.innerHTML = `"I'm here to support you every step of the way. Remember, learning is a journey, and we'll make progress together at your pace." <br>- ${this.currentCharacter.name}`;
      } else if (this.currentCharacter.personality === 'enthusiastic') {
        message.innerHTML = `"Let's rock this learning adventure! We're going to discover awesome new abilities and have a blast doing it!" <br>- ${this.currentCharacter.name}`;
      } else if (this.currentCharacter.personality === 'calm') {
        message.innerHTML = `"We'll approach your education methodically, focusing on clarity and building strong foundations for your knowledge." <br>- ${this.currentCharacter.name}`;
      } else {
        message.innerHTML = `"I'm excited to be your learning companion on this educational journey." <br>- ${this.currentCharacter.name}`;
      }
    } else {
      message.innerHTML = `"Welcome to your personalized learning experience. We're excited to begin this journey with you!"`;
    }

    finalMessage.appendChild(message);

    // Assemble container
    container.appendChild(header);
    container.appendChild(previewContent);
    container.appendChild(finalMessage);

    return container;
  }

  /**
   * Update the progress indicator
   */
  updateProgressIndicator() {
    const dots = this.wizardElement.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
      if (index === this.currentStep) {
        dot.style.backgroundColor = '#1e90ff';
        dot.style.transform = 'scale(1.2)';
      } else {
        dot.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        dot.style.transform = 'scale(1)';
      }
    });
  }

  /**
   * Go to the next step
   */
  goToNextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.showStep(this.currentStep + 1);
    } else {
      // Final step complete
      this.completeOnboarding();
    }
  }

  /**
   * Go to the previous step
   */
  goToPrevStep() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  }

  /**
   * Complete the onboarding process
   */
  completeOnboarding() {
    // Save user preferences
    this.saveUserPreferences();

    // Set onboarding as completed
    localStorage.setItem('shotziOS_onboarding_completed', 'true');

    // Add completion animation
    this.wizardElement.style.animation = 'wizard-completion 0.5s ease forwards';

    // Create the animation definition
    const style = document.createElement('style');
    style.textContent = `
      @keyframes wizard-completion {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-20px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    // Close wizard after animation
    setTimeout(() => {
      this.close();

      // Announce completion
      this.announceToScreenReader('Onboarding complete! Welcome to ShotziOS!');

      // Show welcome toast or notification if available
      this.showWelcomeNotification();
    }, 500);
  }

  /**
   * Save user preferences to local storage
   */
  saveUserPreferences() {
    localStorage.setItem('shotziOS_user_profile', JSON.stringify(this.userProfile));
  }

  /**
   * Load user preferences from local storage
   */
  loadUserPreferences() {
    const savedProfile = localStorage.getItem('shotziOS_user_profile');
    if (savedProfile) {
      try {
        this.userProfile = JSON.parse(savedProfile);

        // Set current character from saved preferences
        if (
          this.userProfile.preferredCharacter &&
          this.characters[this.userProfile.preferredCharacter]
        ) {
          this.currentCharacter = this.characters[this.userProfile.preferredCharacter];
        }
      } catch (e) {
        console.error('Error loading user profile:', e);
      }
    }
  }

  /**
   * Show a welcome notification
   */
  showWelcomeNotification() {
    // Check if there's a toast notification system
    if (window.showToast) {
      window.showToast({
        title: 'Welcome to ShotziOS!',
        message: `${this.currentCharacter ? this.currentCharacter.name : 'Your companion'} is ready to help you learn.`,
        type: 'success',
        duration: 5000,
      });
    } else {
      // Create a simple notification
      const notification = document.createElement('div');
      notification.className = 'welcome-notification';
      notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: ${this.currentCharacter ? this.currentCharacter.color : '#1e90ff'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slide-in 0.3s ease forwards;
        max-width: 300px;
      `;

      const notificationTitle = document.createElement('div');
      notificationTitle.textContent = 'Welcome to ShotziOS!';
      notificationTitle.style.cssText = `
        font-weight: bold;
        margin-bottom: 5px;
      `;

      const notificationMessage = document.createElement('div');
      notificationMessage.textContent = `${this.currentCharacter ? this.currentCharacter.name : 'Your companion'} is ready to help you learn.`;

      notification.appendChild(notificationTitle);
      notification.appendChild(notificationMessage);

      document.body.appendChild(notification);

      // Create animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slide-in {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-out {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);

      // Remove after 5 seconds
      setTimeout(() => {
        notification.style.animation = 'slide-out 0.3s ease forwards';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 5000);
    }
  }

  /**
   * Announce a message to screen readers
   * @param {string} message - The message to announce
   */
  announceToScreenReader(message) {
    // Check if we have the accessibility voice API
    if (window.accessibilityVoice && window.accessibilityVoice.announce) {
      window.accessibilityVoice.announce(message);
      return;
    }

    // Create or use an existing aria-live region
    let announcer = document.getElementById('wizard-announcer');

    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'wizard-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      `;
      document.body.appendChild(announcer);
    }

    // Announce the message
    announcer.textContent = message;

    // Clear after a short delay
    setTimeout(() => {
      announcer.textContent = '';
    }, 3000);
  }

  /**
   * Get default steps for the wizard
   * @returns {Array} Array of step objects
   */
  getDefaultSteps() {
    return [
      {
        title: 'Meet Your Learning Companion',
        type: 'character-introduction',
      },
      {
        title: 'Choose Your Companion',
        type: 'character-selection',
      },
      {
        title: 'Tell Us About Yourself',
        type: 'user-profile',
      },
      {
        title: 'Learning Preferences',
        type: 'neurotype-selection',
      },
      {
        title: 'Customize Your Learning Experience',
        type: 'learning-preferences',
      },
      {
        title: 'Your Learning Journey',
        type: 'curriculum-preview',
      },
    ];
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OnboardingWizard;
} else {
  window.OnboardingWizard = OnboardingWizard;
}
