/**
 * Help Bubble Component
 * 
 * This script implements a friendly character that provides contextual help
 * for neurodivergent users. It appears in the corner of the screen and 
 * provides assistance based on the current page and context.
 */

// Character options with different personalities
const characters = {
  stella: {
    name: 'Stella',
    emoji: '👩‍🚀',
    color: '#6d28d9',
    personality: 'encouraging and supportive',
    welcomeMessage: 'Hi there! I\'m Stella, your learning guide. Need any help navigating the platform?',
    idleMessages: [
      'Remember, your learning journey is unique - just like you!',
      'Need a moment? Take breaks when you need them.',
      'I\'m here to support you every step of the way!',
      'Have a question? Just click on me anytime!'
    ],
    reactions: {
      success: 'That\'s amazing! Great work! 🎉',
      challenge: 'You\'ve got this! I believe in you. Need any guidance?',
      error: 'That\'s okay! Learning involves some bumps along the way.'
    }
  },
  max: {
    name: 'Max',
    emoji: '🦊',
    color: '#f59e0b',
    personality: 'enthusiastic and energetic',
    welcomeMessage: 'Hey! Max here, ready to help you on your learning adventure! What can I help with?',
    idleMessages: [
      'Adventure awaits! Let\'s explore and learn together!',
      'Feeling energized? Let\'s tackle a new challenge!',
      'Remember - mistakes are just opportunities to learn something new!',
      'Click on me if you want to try something fun!'
    ],
    reactions: {
      success: 'WOOHOO! You totally crushed that! 🔥',
      challenge: 'This looks tricky - but that\'s what makes it exciting! Let\'s figure it out!',
      error: 'Oops! No worries - that\'s how we learn. Let\'s try a different approach!'
    }
  },
  nova: {
    name: 'Nova',
    emoji: '🐱',
    color: '#10b981',
    personality: 'calm and patient',
    welcomeMessage: 'Hello, I\'m Nova. I\'m here to help you navigate through your learning journey. Take your time.',
    idleMessages: [
      'Remember to breathe. Learning happens at your own pace.',
      'It\'s perfectly fine to take things one step at a time.',
      'If you need a quiet moment, that\'s completely okay.',
      'I\'m here whenever you\'re ready. No rush.'
    ],
    reactions: {
      success: 'Wonderful job. You should be proud of yourself. 💫',
      challenge: 'This might seem difficult, but we can approach it calmly, step by step.',
      error: 'That\'s alright. Every error is simply information that helps us learn.'
    }
  }
};

// Default character
let currentCharacter = characters.stella;

// Define context-specific help messages
const contextualHelp = {
  'index': {
    title: 'Main Dashboard',
    description: 'This is the main dashboard where you can navigate to any of the three schools.',
    tips: [
      'Click on any school card to enter that school',
      'The Features section shows what you can do on the platform',
      'The Quick Access section lets you jump to important pages'
    ]
  },
  'law-school': {
    title: 'Law School',
    description: 'Welcome to the Shatzii School of Law. Here you can study legal subjects and prepare for the UAE Bar Exam.',
    tips: [
      'The Stats section shows your overall progress',
      'Your courses are shown in the My Courses section',
      'Click on a course card to continue your learning',
      'Resources for bar exam preparation are at the bottom of the page'
    ]
  },
  'law-school-admin': {
    title: 'Law School Admin Dashboard',
    description: 'This is the administrator dashboard for the Shatzii School of Law where you can manage all school operations.',
    tips: [
      'Check enrollment statistics and performance metrics',
      'Monitor curriculum effectiveness and student progress',
      'Manage staff resources and allocations',
      'Review compliance reports and certification status'
    ]
  },
  'law-school-compliance': {
    title: 'Law School Compliance Dashboard',
    description: 'This dashboard helps ensure the law school meets all legal and accreditation requirements.',
    tips: [
      'Monitor bar exam pass rates and accreditation metrics',
      'Track curriculum alignment with UAE legal standards',
      'Review faculty qualifications and certifications',
      'Check for any compliance alerts or required actions'
    ]
  },
  'law-school-student': {
    title: 'Law School Student Dashboard',
    description: 'Your personal student dashboard for tracking progress through law school.',
    tips: [
      'Track your overall progress and grades',
      'Access your current courses and upcoming assignments',
      'Review bar exam preparation materials',
      'Connect with tutors and study groups'
    ]
  },
  'law-school-staff': {
    title: 'Law School Staff Management',
    description: 'Manage the staff and AI instructors for the law school here.',
    tips: [
      'Create specialized AI instructors with legal expertise',
      'Assign instructors to specific courses or programs',
      'Monitor instructor performance and student feedback',
      'Adjust teaching parameters for different learning needs'
    ]
  },
  'law-school-curriculum': {
    title: 'Law School Curriculum Creator',
    description: 'Create and customize curriculum for law school courses using AI assistance.',
    tips: [
      'Generate curriculum materials aligned with UAE legal standards',
      'Customize course content for different learning styles',
      'Create adaptive assessment materials',
      'Review and edit AI-generated content before publishing'
    ]
  },
  'superhero-school': {
    title: 'Superhero School',
    description: 'Welcome to the Neurodivergent Superhero School. This is where your unique abilities become superpowers!',
    tips: [
      'Your superpowers represent your unique strengths',
      'Learning missions are personalized subjects designed for your learning style',
      'The Sensory Break Room is available when you need a moment to decompress',
      'Track your achievements and unlock new superpowers as you learn'
    ]
  },
  'superhero-school-budget': {
    title: 'Superhero School Budget Management',
    description: 'Manage and track the budget for the Neurodivergent Superhero School.',
    tips: [
      'Track department allocations and expenditures',
      'Manage resource costs and plan for future needs',
      'Generate budget reports and visualizations',
      'Allocate funds for specialized learning tools and environments'
    ]
  },
  'superhero-school-staff': {
    title: 'Superhero School Staff Management',
    description: 'Manage the staff and create specialized instructors for the Neurodivergent Superhero School.',
    tips: [
      'Create customized AI instructors with neurotype-specific expertise',
      'Assign staff to specialized learning tracks',
      'Monitor instructor performance with diverse neurotypes',
      'Set sensory accommodation parameters for each instructor'
    ]
  },
  'superhero-school-curriculum': {
    title: 'Superhero School Curriculum Creator',
    description: 'Create adaptive curriculum for the Neurodivergent Superhero School.',
    tips: [
      'Generate neurodivergent-friendly learning materials',
      'Create multi-sensory curriculum modules',
      'Design adaptive assessments with variable time limits',
      'Implement special interest integration into standard curriculum'
    ]
  },
  'language-school': {
    title: 'Language School',
    description: 'Welcome to the Language Learning School. Here you can learn multiple languages through immersive experiences.',
    tips: [
      'Choose a language to start or continue learning',
      'Try different activity types to practice various language skills',
      'The language soundtrack feature helps with concentration and memory',
      'Connect with language tutors or the language community for conversation practice'
    ]
  },
  'language-school-curriculum': {
    title: 'Language School Curriculum Creator',
    description: 'Create custom language learning curriculum with AI assistance.',
    tips: [
      'Generate vocabulary lists for different topics and proficiency levels',
      'Create culturally relevant language exercises and dialogues',
      'Design immersive learning scenarios for practical language use',
      'Adapt materials for different learning styles and neurodivergent needs'
    ]
  },
  'language-school-staff': {
    title: 'Language School Staff Management',
    description: 'Manage the staff and create specialized language instructors.',
    tips: [
      'Create AI instructors with native language expertise',
      'Set language proficiency parameters for instructors',
      'Configure cultural context knowledge for authentic learning',
      'Specify teaching methodologies appropriate for different learning styles'
    ]
  }
};

// Create the help bubble component
function createHelpBubble() {
  // Create container for the help bubble
  const helpBubble = document.createElement('div');
  helpBubble.id = 'helpBubble';
  helpBubble.style.position = 'fixed';
  helpBubble.style.bottom = '20px';
  helpBubble.style.right = '20px';
  helpBubble.style.zIndex = '1000';
  
  // Create the character button
  const characterButton = document.createElement('button');
  characterButton.id = 'characterButton';
  characterButton.innerHTML = currentCharacter.emoji;
  characterButton.style.width = '60px';
  characterButton.style.height = '60px';
  characterButton.style.borderRadius = '50%';
  characterButton.style.backgroundColor = currentCharacter.color;
  characterButton.style.color = 'white';
  characterButton.style.border = 'none';
  characterButton.style.fontSize = '30px';
  characterButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  characterButton.style.cursor = 'pointer';
  characterButton.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
  characterButton.setAttribute('aria-label', 'Open help menu');
  
  // Add hover effect
  characterButton.addEventListener('mouseover', () => {
    characterButton.style.transform = 'scale(1.1)';
    characterButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.25)';
  });
  
  characterButton.addEventListener('mouseout', () => {
    characterButton.style.transform = 'scale(1)';
    characterButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  });
  
  // Create the help panel (initially hidden)
  const helpPanel = document.createElement('div');
  helpPanel.id = 'helpPanel';
  helpPanel.style.position = 'fixed';
  helpPanel.style.bottom = '90px';
  helpPanel.style.right = '20px';
  helpPanel.style.width = '320px';
  helpPanel.style.maxHeight = '400px';
  helpPanel.style.backgroundColor = '#121212'; // Dark background
  helpPanel.style.color = '#ffffff'; // White text
  helpPanel.style.borderRadius = '12px';
  helpPanel.style.boxShadow = '0 6px 16px rgba(0, 112, 243, 0.4)'; // Blue glow
  helpPanel.style.border = '1px solid #0070f3'; // Blue border
  helpPanel.style.padding = '16px';
  helpPanel.style.display = 'none';
  helpPanel.style.overflow = 'auto';
  helpPanel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  helpPanel.style.opacity = '0';
  helpPanel.style.transform = 'translateY(20px)';
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';
  closeButton.style.backgroundColor = '#0070f3';
  closeButton.style.border = 'none';
  closeButton.style.borderRadius = '50%';
  closeButton.style.width = '24px';
  closeButton.style.height = '24px';
  closeButton.style.fontSize = '18px';
  closeButton.style.color = 'white';
  closeButton.style.cursor = 'pointer';
  closeButton.style.display = 'flex';
  closeButton.style.alignItems = 'center';
  closeButton.style.justifyContent = 'center';
  closeButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
  closeButton.setAttribute('aria-label', 'Close help panel');
  
  // Add header with character info
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.marginBottom = '16px';
  
  const characterEmoji = document.createElement('div');
  characterEmoji.innerHTML = currentCharacter.emoji;
  characterEmoji.style.fontSize = '24px';
  characterEmoji.style.marginRight = '8px';
  
  const characterInfo = document.createElement('div');
  const characterName = document.createElement('h3');
  characterName.textContent = currentCharacter.name;
  characterName.style.margin = '0';
  characterName.style.fontSize = '16px';
  characterName.style.fontWeight = 'bold';
  
  characterInfo.appendChild(characterName);
  header.appendChild(characterEmoji);
  header.appendChild(characterInfo);
  
  // Create content container
  const content = document.createElement('div');
  
  // Get the current page context
  const currentPath = window.location.pathname;
  let contextKey = 'index';
  
  // More specific paths need to be checked first, then general paths
  if (currentPath.includes('law-school-admin')) {
    contextKey = 'law-school-admin';
  } else if (currentPath.includes('law-school-compliance')) {
    contextKey = 'law-school-compliance';
  } else if (currentPath.includes('law-school-student')) {
    contextKey = 'law-school-student';
  } else if (currentPath.includes('law-school-staff')) {
    contextKey = 'law-school-staff';
  } else if (currentPath.includes('law-school-curriculum')) {
    contextKey = 'law-school-curriculum';
  } else if (currentPath.includes('law-school')) {
    contextKey = 'law-school';
  } else if (currentPath.includes('superhero-school-budget')) {
    contextKey = 'superhero-school-budget';
  } else if (currentPath.includes('superhero-school-staff')) {
    contextKey = 'superhero-school-staff';  
  } else if (currentPath.includes('superhero-school-curriculum')) {
    contextKey = 'superhero-school-curriculum';
  } else if (currentPath.includes('superhero-school')) {
    contextKey = 'superhero-school';
  } else if (currentPath.includes('language-school-curriculum')) {
    contextKey = 'language-school-curriculum';
  } else if (currentPath.includes('language-school-staff')) {
    contextKey = 'language-school-staff';
  } else if (currentPath.includes('language-school')) {
    contextKey = 'language-school';
  }
  
  const context = contextualHelp[contextKey];
  
  // Create welcome message
  const welcomeMessage = document.createElement('p');
  welcomeMessage.textContent = currentCharacter.welcomeMessage;
  welcomeMessage.style.marginBottom = '16px';
  content.appendChild(welcomeMessage);
  
  // Add context-specific help
  const contextTitle = document.createElement('h4');
  contextTitle.textContent = context.title;
  contextTitle.style.margin = '16px 0 8px 0';
  contextTitle.style.fontWeight = 'bold';
  content.appendChild(contextTitle);
  
  const contextDesc = document.createElement('p');
  contextDesc.textContent = context.description;
  contextDesc.style.marginBottom = '8px';
  content.appendChild(contextDesc);
  
  // Add tips
  if (context.tips && context.tips.length > 0) {
    const tipsTitle = document.createElement('h4');
    tipsTitle.textContent = 'Helpful Tips:';
    tipsTitle.style.margin = '16px 0 8px 0';
    tipsTitle.style.fontWeight = 'bold';
    content.appendChild(tipsTitle);
    
    const tipsList = document.createElement('ul');
    tipsList.style.paddingLeft = '20px';
    tipsList.style.margin = '8px 0';
    
    context.tips.forEach(tip => {
      const tipItem = document.createElement('li');
      tipItem.textContent = tip;
      tipItem.style.marginBottom = '6px';
      tipsList.appendChild(tipItem);
    });
    
    content.appendChild(tipsList);
  }
  
  // Add character selector
  const characterSelector = document.createElement('div');
  characterSelector.style.marginTop = '20px';
  characterSelector.style.padding = '12px';
  characterSelector.style.backgroundColor = '#1a1a1a'; // Darker background
  characterSelector.style.borderRadius = '8px';
  characterSelector.style.border = '1px solid #0070f3'; // Blue border
  
  const selectorTitle = document.createElement('p');
  selectorTitle.textContent = 'Change your helper:';
  selectorTitle.style.marginBottom = '8px';
  selectorTitle.style.fontWeight = 'bold';
  characterSelector.appendChild(selectorTitle);
  
  const characterButtons = document.createElement('div');
  characterButtons.style.display = 'flex';
  characterButtons.style.justifyContent = 'space-around';
  
  // Create a button for each character
  Object.keys(characters).forEach(charKey => {
    const char = characters[charKey];
    const charButton = document.createElement('button');
    charButton.innerHTML = char.emoji;
    charButton.title = char.name;
    charButton.style.width = '40px';
    charButton.style.height = '40px';
    charButton.style.borderRadius = '50%';
    charButton.style.backgroundColor = char.color;
    charButton.style.color = 'white';
    charButton.style.border = 'none';
    charButton.style.fontSize = '20px';
    charButton.style.cursor = 'pointer';
    
    // Highlight the current character
    if (charKey === Object.keys(characters).find(k => characters[k].name === currentCharacter.name)) {
      charButton.style.boxShadow = '0 0 0 3px white, 0 0 0 6px ' + char.color;
    }
    
    // Add click event to change character
    charButton.addEventListener('click', () => {
      currentCharacter = char;
      localStorage.setItem('preferredCharacter', charKey);
      
      // Update UI
      characterButton.innerHTML = currentCharacter.emoji;
      characterButton.style.backgroundColor = currentCharacter.color;
      
      // Refresh the help panel
      helpPanel.style.display = 'none';
      document.body.removeChild(helpBubble);
      createHelpBubble();
    });
    
    characterButtons.appendChild(charButton);
  });
  
  characterSelector.appendChild(characterButtons);
  content.appendChild(characterSelector);
  
  // Add accessibility settings
  const accessibilitySettings = document.createElement('div');
  accessibilitySettings.style.marginTop = '20px';
  accessibilitySettings.style.padding = '12px';
  accessibilitySettings.style.backgroundColor = '#1a1a1a';
  accessibilitySettings.style.borderRadius = '8px';
  accessibilitySettings.style.border = '1px solid #0070f3';
  
  const settingsTitle = document.createElement('h4');
  settingsTitle.textContent = 'Accessibility Settings:';
  settingsTitle.style.margin = '16px 0 8px 0';
  settingsTitle.style.fontWeight = 'bold';
  accessibilitySettings.appendChild(settingsTitle);
  
  // Font size adjuster
  const fontSizeAdjuster = document.createElement('div');
  fontSizeAdjuster.style.marginBottom = '12px';
  
  const fontSizeLabel = document.createElement('label');
  fontSizeLabel.textContent = 'Text Size:';
  fontSizeLabel.style.display = 'block';
  fontSizeLabel.style.marginBottom = '4px';
  
  const fontSizeControls = document.createElement('div');
  fontSizeControls.style.display = 'flex';
  fontSizeControls.style.alignItems = 'center';
  
  const decreaseButton = document.createElement('button');
  decreaseButton.textContent = 'A-';
  decreaseButton.style.padding = '4px 8px';
  decreaseButton.style.borderRadius = '4px';
  decreaseButton.style.border = '1px solid #0070f3';
  decreaseButton.style.backgroundColor = '#121212';
  decreaseButton.style.color = '#ffffff';
  decreaseButton.style.marginRight = '8px';
  decreaseButton.addEventListener('click', () => {
    const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
    document.body.style.fontSize = (currentSize - 2) + 'px';
    localStorage.setItem('preferredFontSize', (currentSize - 2) + 'px');
  });
  
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset';
  resetButton.style.padding = '4px 8px';
  resetButton.style.borderRadius = '4px';
  resetButton.style.border = '1px solid #0070f3';
  resetButton.style.backgroundColor = '#121212';
  resetButton.style.color = '#ffffff';
  resetButton.style.marginRight = '8px';
  resetButton.addEventListener('click', () => {
    document.body.style.fontSize = '';
    localStorage.removeItem('preferredFontSize');
  });
  
  const increaseButton = document.createElement('button');
  increaseButton.textContent = 'A+';
  increaseButton.style.padding = '4px 8px';
  increaseButton.style.borderRadius = '4px';
  increaseButton.style.border = '1px solid #0070f3';
  increaseButton.style.backgroundColor = '#121212';
  increaseButton.style.color = '#ffffff';
  increaseButton.addEventListener('click', () => {
    const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
    document.body.style.fontSize = (currentSize + 2) + 'px';
    localStorage.setItem('preferredFontSize', (currentSize + 2) + 'px');
  });
  
  fontSizeControls.appendChild(decreaseButton);
  fontSizeControls.appendChild(resetButton);
  fontSizeControls.appendChild(increaseButton);
  
  fontSizeAdjuster.appendChild(fontSizeLabel);
  fontSizeAdjuster.appendChild(fontSizeControls);
  
  // High contrast mode
  const contrastToggle = document.createElement('div');
  contrastToggle.style.marginBottom = '12px';
  
  const contrastLabel = document.createElement('label');
  contrastLabel.htmlFor = 'contrastToggle';
  contrastLabel.textContent = 'High Contrast Mode:';
  contrastLabel.style.display = 'block';
  contrastLabel.style.marginBottom = '4px';
  
  const contrastCheckbox = document.createElement('input');
  contrastCheckbox.type = 'checkbox';
  contrastCheckbox.id = 'contrastToggle';
  contrastCheckbox.style.marginRight = '8px';
  
  // Check if high contrast was previously enabled
  if (localStorage.getItem('highContrast') === 'true') {
    contrastCheckbox.checked = true;
    applyHighContrast();
  }
  
  contrastCheckbox.addEventListener('change', () => {
    if (contrastCheckbox.checked) {
      applyHighContrast();
      localStorage.setItem('highContrast', 'true');
    } else {
      removeHighContrast();
      localStorage.setItem('highContrast', 'false');
    }
  });
  
  contrastToggle.appendChild(contrastLabel);
  contrastToggle.appendChild(contrastCheckbox);
  contrastToggle.appendChild(document.createTextNode('Enable'));
  
  accessibilitySettings.appendChild(fontSizeAdjuster);
  accessibilitySettings.appendChild(contrastToggle);
  
  content.appendChild(accessibilitySettings);
  
  // Add all elements to their parent containers
  helpPanel.appendChild(closeButton);
  helpPanel.appendChild(header);
  helpPanel.appendChild(content);
  
  helpBubble.appendChild(characterButton);
  helpBubble.appendChild(helpPanel);
  
  document.body.appendChild(helpBubble);
  
  // Toggle help panel visibility when character button is clicked
  characterButton.addEventListener('click', () => {
    if (helpPanel.style.display === 'none') {
      helpPanel.style.display = 'block';
      // Trigger reflow
      void helpPanel.offsetWidth;
      helpPanel.style.opacity = '1';
      helpPanel.style.transform = 'translateY(0)';
    } else {
      helpPanel.style.opacity = '0';
      helpPanel.style.transform = 'translateY(20px)';
      setTimeout(() => {
        helpPanel.style.display = 'none';
      }, 300);
    }
  });
  
  // Close panel when close button is clicked
  closeButton.addEventListener('click', () => {
    helpPanel.style.opacity = '0';
    helpPanel.style.transform = 'translateY(20px)';
    setTimeout(() => {
      helpPanel.style.display = 'none';
    }, 300);
  });
  
  // Load previously saved preferences
  const preferredCharacter = localStorage.getItem('preferredCharacter');
  if (preferredCharacter && characters[preferredCharacter]) {
    currentCharacter = characters[preferredCharacter];
    characterButton.innerHTML = currentCharacter.emoji;
    characterButton.style.backgroundColor = currentCharacter.color;
  }
  
  const preferredFontSize = localStorage.getItem('preferredFontSize');
  if (preferredFontSize) {
    document.body.style.fontSize = preferredFontSize;
  }
}

// Function to apply high contrast mode
function applyHighContrast() {
  const style = document.createElement('style');
  style.id = 'high-contrast-style';
  style.innerHTML = `
    body {
      background-color: #000 !important;
      color: #fff !important;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #fff !important;
    }
    .bg-white, .bg-gray-50, .bg-gray-100 {
      background-color: #000 !important;
    }
    p, span, div, li {
      color: #fff !important;
    }
    a {
      color: #3b82f6 !important;
    }
    button, .button, [role="button"] {
      border: 2px solid #fff !important;
    }
    input, textarea, select {
      background-color: #000 !important;
      color: #fff !important;
      border: 2px solid #fff !important;
    }
  `;
  document.head.appendChild(style);
}

// Function to remove high contrast mode
function removeHighContrast() {
  const style = document.getElementById('high-contrast-style');
  if (style) {
    document.head.removeChild(style);
  }
}

// Playful character interactions
let idleTimer;
let interactionCounter = 0;
let lastInteraction = Date.now();

// Shows a character message in a small bubble
function showCharacterMessage(message) {
  // Create or get message bubble
  let messageBubble = document.getElementById('characterMessageBubble');
  
  if (!messageBubble) {
    messageBubble = document.createElement('div');
    messageBubble.id = 'characterMessageBubble';
    messageBubble.style.position = 'fixed';
    messageBubble.style.bottom = '85px';
    messageBubble.style.right = '20px';
    messageBubble.style.backgroundColor = '#121212';
    messageBubble.style.color = '#ffffff';
    messageBubble.style.padding = '10px 14px';
    messageBubble.style.borderRadius = '12px';
    messageBubble.style.maxWidth = '220px';
    messageBubble.style.boxShadow = '0 4px 8px rgba(0, 112, 243, 0.4)';
    messageBubble.style.border = '1px solid #0070f3';
    messageBubble.style.transition = 'all 0.3s ease';
    messageBubble.style.opacity = '0';
    messageBubble.style.transform = 'translateY(10px) scale(0.95)';
    messageBubble.style.zIndex = '999';
    messageBubble.style.fontSize = '14px';
    messageBubble.style.fontFamily = 'inherit';
    document.body.appendChild(messageBubble);
  }
  
  // Update message text
  messageBubble.textContent = message;
  
  // Show message with animation
  messageBubble.style.opacity = '1';
  messageBubble.style.transform = 'translateY(0) scale(1)';
  
  // Hide after 5 seconds
  setTimeout(() => {
    messageBubble.style.opacity = '0';
    messageBubble.style.transform = 'translateY(10px) scale(0.95)';
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      if (messageBubble.parentNode) {
        messageBubble.parentNode.removeChild(messageBubble);
      }
    }, 300);
  }, 5000);
}

// Play character animation
function playCharacterAnimation() {
  const characterButton = document.getElementById('characterButton');
  if (!characterButton) return;
  
  // Simple bounce animation
  characterButton.style.transition = 'transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
  characterButton.style.transform = 'scale(1.2)';
  
  setTimeout(() => {
    characterButton.style.transform = 'scale(1)';
  }, 500);
}

// Check if user has been idle
function checkIdle() {
  const idleTime = 30000; // 30 seconds
  const now = Date.now();
  
  if (now - lastInteraction > idleTime) {
    // Show a random idle message
    const characterButton = document.getElementById('characterButton');
    if (characterButton && currentCharacter && currentCharacter.idleMessages) {
      const randomMessage = currentCharacter.idleMessages[
        Math.floor(Math.random() * currentCharacter.idleMessages.length)
      ];
      
      showCharacterMessage(randomMessage);
      playCharacterAnimation();
      
      // Reset the timer for the next idle check
      lastInteraction = now;
    }
  }
}

// Record user interactions with the page
function recordInteraction() {
  lastInteraction = Date.now();
  interactionCounter++;
  
  // Occasionally react to user activity
  if (interactionCounter % 10 === 0) {
    const characterButton = document.getElementById('characterButton');
    if (characterButton) {
      playCharacterAnimation();
    }
  }
}

// Show positive reaction
function showPositiveReaction() {
  if (currentCharacter && currentCharacter.reactions && currentCharacter.reactions.success) {
    showCharacterMessage(currentCharacter.reactions.success);
    playCharacterAnimation();
  }
}

// Show challenge reaction
function showChallengeReaction() {
  if (currentCharacter && currentCharacter.reactions && currentCharacter.reactions.challenge) {
    showCharacterMessage(currentCharacter.reactions.challenge);
    playCharacterAnimation();
  }
}

// Show error reaction
function showErrorReaction() {
  if (currentCharacter && currentCharacter.reactions && currentCharacter.reactions.error) {
    showCharacterMessage(currentCharacter.reactions.error);
    playCharacterAnimation();
  }
}

// Initialize the help bubble when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  createHelpBubble();
  
  // Apply high contrast mode if previously enabled
  if (localStorage.getItem('highContrast') === 'true') {
    applyHighContrast();
  }
  
  // Apply saved font size if it exists
  const preferredFontSize = localStorage.getItem('preferredFontSize');
  if (preferredFontSize) {
    document.body.style.fontSize = preferredFontSize;
  }
  
  // Set up idle timer to check every 10 seconds
  idleTimer = setInterval(checkIdle, 10000);
  
  // Add page interaction listeners
  document.addEventListener('click', recordInteraction);
  document.addEventListener('keydown', recordInteraction);
  document.addEventListener('scroll', recordInteraction);
  
  // Show welcome message after a delay
  setTimeout(() => {
    showCharacterMessage(currentCharacter.welcomeMessage);
    playCharacterAnimation();
  }, 2000);
  
  // Attach reaction triggers to common interactive elements
  document.querySelectorAll('button:not(#characterButton)').forEach(button => {
    button.addEventListener('click', () => {
      // For buttons with success-related text
      if (button.textContent.match(/save|submit|complete|success/i)) {
        setTimeout(showPositiveReaction, 1000);
      }
      // For buttons with challenge-related text
      else if (button.textContent.match(/generate|create|start|begin/i)) {
        setTimeout(showChallengeReaction, 1000);
      }
    });
  });
  
  // Listen for form submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      setTimeout(showPositiveReaction, 1000);
    });
  });
  
  // Listen for error events
  window.addEventListener('error', () => {
    showErrorReaction();
  });
});