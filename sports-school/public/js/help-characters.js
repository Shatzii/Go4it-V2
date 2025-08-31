/**
 * ShotziOS Help Characters System
 *
 * This file contains the definitions and functionality for the contextual help
 * characters that provide playful and supportive guidance throughout the platform.
 */

// Define the help characters with their personalities and visual styles
const helpCharacters = {
  // Stella: Encouraging and reassuring
  stella: {
    name: 'Stella',
    emoji: '⭐',
    color: '#3498db', // blue
    accentColor: '#5dade2',
    personality: 'encouraging',
    greeting:
      "Hi {name}! I'm Stella, your personal learning assistant. What can I help you with today?",
    farewell:
      "You're welcome, {name}! Remember, I'm here anytime you need assistance. Just click on the star icon to chat with me. Have a productive day!",
    animation: 'bounce',
    traits: ['supportive', 'patient', 'gentle'],
  },

  // Max: Enthusiastic and energetic
  max: {
    name: 'Max',
    emoji: '🚀',
    color: '#e67e22', // orange
    accentColor: '#f39c12',
    personality: 'enthusiastic',
    greeting:
      'Hey {name}! Max here, ready to blast off on your learning adventure! What awesome stuff are we working on today?',
    farewell:
      "Rock on, {name}! You're crushing it! Hit me up anytime you need a boost. I'm just a click away!",
    animation: 'pulse',
    traits: ['energetic', 'motivating', 'playful'],
  },

  // Nova: Calm and analytical
  nova: {
    name: 'Nova',
    emoji: '🌟',
    color: '#9b59b6', // purple
    accentColor: '#8e44ad',
    personality: 'calm',
    greeting:
      "Hello {name}, I'm Nova. I'm here to provide clarity and guidance for your learning journey. How may I assist you today?",
    farewell:
      "Glad I could be of assistance, {name}. Remember that learning is a process, and I'm here to support you every step of the way.",
    animation: 'glow',
    traits: ['analytical', 'thoughtful', 'organized'],
  },
};

// Contextual help topics by page and section
const contextualHelpTopics = {
  'superhero-school/student-dashboard': {
    default: [
      { text: 'How do I use the Curriculum Generator?', context: 'curriculum' },
      { text: "I'm having trouble focusing today", context: 'focus' },
      { text: 'Remind me of my learning strengths', context: 'strengths' },
      { text: 'Show me my medication schedule', context: 'medication' },
    ],
    'curriculum-section': [
      { text: 'How do I create a new custom curriculum?', context: 'curriculum-create' },
      { text: 'Can I share my curriculum with others?', context: 'curriculum-share' },
      { text: 'What makes these materials dyslexia-friendly?', context: 'dyslexia-features' },
    ],
    'tools-section': [
      { text: 'Which tool is best for visual learners?', context: 'visual-learning' },
      { text: 'How do I track my progress with these tools?', context: 'progress-tracking' },
      { text: 'Can I customize the AI tutor?', context: 'ai-customization' },
    ],
  },
  'law-school/student-dashboard': {
    default: [
      { text: 'How do I prepare for the bar exam?', context: 'bar-exam' },
      { text: 'Where can I find case briefs?', context: 'case-briefs' },
      { text: 'Show me my study schedule', context: 'study-schedule' },
      { text: 'I need help with legal terminology', context: 'legal-terms' },
    ],
  },
  'language-school/student-dashboard': {
    default: [
      { text: 'How do I use the AI Conversation Partner?', context: 'conversation-partner' },
      { text: "I'm having trouble remembering vocabulary", context: 'vocabulary' },
      { text: 'Show me my language learning strengths', context: 'language-strengths' },
      { text: 'I need help with pronunciation', context: 'pronunciation' },
    ],
  },
};

// Responses for each context
const helpResponses = {
  // Superhero School responses
  curriculum: {
    stella:
      'The Curriculum Generator helps you create dyslexia-friendly learning materials. Just select your subject, grade level, and learning format, then let our AI generate custom materials designed specifically for your learning style. You can access it directly from your Study Tools section!',
    max: 'The Curriculum Generator is AWESOME! Pick your subject, grade, and how you like to learn, and BAM! Custom materials made just for you! Look for it in your Study Tools and get ready for some super-powered learning!',
    nova: 'The Curriculum Generator is a tool that creates personalized educational materials. To use it: 1) Select subject area, 2) Choose grade level, 3) Specify learning format preferences, 4) Initiate generation. The AI will analyze your learning profile to optimize the materials for your specific needs.',
  },
  focus: {
    stella:
      "I'm sorry to hear that you're having trouble focusing. Here are some gentle strategies that might help: 1) Try the Pomodoro technique (25 min work, 5 min break), 2) Use noise-canceling headphones or calming background sounds, 3) Check your medication timing on your timeline, or 4) Switch to a more visual learning format for today. Would you like me to suggest specific activities?",
    max: "Focus challenges? No problem! Let's CRUSH them! Try the Pomodoro technique - 25 minutes of SUPER FOCUS, then a 5-minute POWER BREAK! Or blast some focus-boosting sound waves with noise-canceling headphones! Check your med timeline or switch to VISUAL LEARNING MODE! Want me to suggest some HIGH-ENERGY activities?",
    nova: "I notice you're experiencing focus difficulties. Based on neurocognitive research, I suggest: 1) Implementing the Pomodoro technique (25:5 minute work-rest ratio), 2) Utilizing acoustic isolation tools or calibrated background frequencies, 3) Verifying medication schedule adherence, 4) Transitioning to visual-spatial learning modalities. Would you like a personalized focus-enhancement protocol?",
  },
  strengths: {
    stella:
      'Your top strengths are Visual Thinking (Level 9), Creativity (Level 9), and Pattern Recognition (Level 8). These give you wonderful advantages in seeing connections others miss and finding creative solutions to problems. Try leveraging these strengths when studying challenging material by creating visual maps or looking for underlying patterns.',
    max: "CHECK OUT these AMAZING strengths of yours! Visual Thinking: Level 9 - BOOM! Creativity: Level 9 - DOUBLE BOOM! Pattern Recognition: Level 8 - KABOOM! You're a VISUAL CREATIVE GENIUS who spots patterns others miss! Make some MIND-BLOWING visual maps next time you're tackling tough stuff!",
    nova: 'Analysis of your cognitive profile indicates exceptional capabilities in: Visual-Spatial Processing (9/10), Creative Ideation (9/10), and Pattern Recognition (8/10). This cognitive constellation enables superior performance in identifying non-linear connections and generating novel solutions. Consider applying visual mapping techniques to complex material to leverage your natural cognitive advantages.',
  },
  medication: {
    stella:
      'According to your medication timeline, you should take Adderall XR 10mg at 7:30 AM with breakfast. Your next medication check-in is scheduled for April 25th at 11:00 AM. Would you like to open the Medication Tracker for more details?',
    max: 'Medication CHECK! Adderall XR 10mg with breakfast at 7:30 AM! BOOM - DONE! Your next med check-in is coming up on April 25th at 11:00 AM! Want to see your AWESOME Medication Tracker for all the details?',
    nova: 'Your pharmacological schedule indicates Adderall XR 10mg administration at 0730 hours with nutritional intake. Next clinical evaluation: April 25, 1100 hours. Medication efficacy metrics are available in the comprehensive Medication Tracker interface. Would you like to access the detailed analytics?',
  },

  // Language School responses
  'conversation-partner': {
    stella:
      'The AI Conversation Partner helps you practice speaking in your target language. Just select your language, choose a conversation topic, and start talking! The AI will respond naturally and provide feedback on your pronunciation and grammar. You can also adjust the difficulty level based on your comfort. Would you like to start with Spanish, German, or Japanese?',
    max: "Time to SUPERCHARGE your language skills! The AI Conversation Partner is your new best friend! Pick your language, grab a cool topic, and START CHATTING! The AI responds to YOU and gives AWESOME feedback on your speaking! Crank up or down the difficulty - YOU'RE THE BOSS! Ready to rock some Spanish, German, or Japanese?",
    nova: 'The AI Conversation Partner facilitates practical language acquisition through simulated dialogue. Process: 1) Select target language, 2) Determine thematic parameters, 3) Initiate verbal exchange. The system employs advanced speech recognition to analyze phonological accuracy and grammatical structure, providing calibrated feedback. The difficulty coefficient is adjustable to optimize your learning gradient. Which linguistic system would you prefer to practice: Spanish, German, or Japanese?',
  },
  vocabulary: {
    stella:
      'I understand that vocabulary can be challenging. Here are some strategies that might help: 1) Try using the Vocabulary Builder tool with spaced repetition, 2) Use the multi-modal learning approach to connect words with images and sounds, 3) Focus on thematic word groups rather than random words, and 4) Practice with the language games that emphasize vocabulary retention. Would you like me to create a personalized vocabulary plan for you?',
    max: "Vocab challenges? Let's DEMOLISH them! 1) POWER UP with the Vocabulary Builder and spaced repetition - it's like BRAIN TRAINING! 2) Go MULTI-MODAL and connect words to AWESOME images and sounds! 3) Learn words in THEME GROUPS - way more EPIC than random lists! 4) GAME ON with vocabulary games that make learning STICK! Want me to craft a PERSONALIZED VOCAB CONQUEST PLAN just for you?",
    nova: 'Vocabulary acquisition difficulties are common in language learning. I recommend implementing: 1) The Vocabulary Builder utility with algorithmically-optimized spaced repetition intervals, 2) Multi-modal encoding strategies linking lexical items with visual and auditory stimuli, 3) Thematic clustering of lexical sets for enhanced semantic network formation, 4) Gamified reinforcement activities designed to maximize retention through adaptive challenge calibration. Would you like me to generate a personalized lexical acquisition protocol?',
  },

  // Secondary option responses
  'current-assignment': {
    stella:
      "I'd be happy to help with your current assignment. Please navigate to the specific assignment in your learning modules, and I'll provide specific guidance for that material.",
    max: "LET'S TACKLE that assignment together! Head over to your learning modules, click on the assignment, and I'll jump in with some AWESOME tips and tricks!",
    nova: 'I can provide assistance with your current educational task. Please navigate to the specific assignment interface within your learning module directory, and I will offer targeted pedagogical support for that particular content segment.',
  },
  accessibility: {
    stella:
      "You can customize your learning experience by clicking on your avatar and selecting 'Accessibility Settings'. There you can adjust text size, change color contrast, enable text-to-speech, and customize your reading guides.",
    max: "Time to CUSTOMIZE your learning experience! Click your avatar, hit 'Accessibility Settings' and BOOM! You can change text size, crank up the color contrast, activate TALKING TEXT, and set up those reading guides JUST HOW YOU LIKE THEM!",
    nova: "Interface customization options are available via the avatar menu > 'Accessibility Settings'. This control panel enables modification of: 1) Typographical scale, 2) Chromatic contrast ratios, 3) Text-to-speech functionality, and 4) Reading guide parameters. These adjustments can be calibrated to optimize your perceptual processing efficiency.",
  },
  tutor: {
    stella:
      "I'll connect you with a tutor who specializes in neurodivergent learning styles. Available times today are 4:00 PM or 6:30 PM. Would you like me to schedule a session?",
    max: "Let's get you a SUPER TUTOR who ROCKS at teaching neurodivergent learners! We've got slots TODAY at 4:00 PM or 6:30 PM! Want me to LOCK ONE IN for you?",
    nova: 'I can facilitate connection with an educational specialist who has expertise in neurodivergent cognitive processing. Available appointment windows: 1600 hours or 1830 hours today. Shall I proceed with scheduling a pedagogical consultation?',
  },
  farewell: {
    stella:
      "You're welcome! Remember, I'm here anytime you need assistance. Just click on the star icon to chat with me. Have a productive day!",
    max: 'ANYTIME, learning champion! Just hit up the rocket when you need a boost! GO CRUSH THOSE LEARNING GOALS!',
    nova: 'I appreciate the opportunity to be of service. The assistance interface remains accessible whenever you require further support. Optimal cognitive performance on your educational endeavors.',
  },
};

// Secondary options that appear after the first interaction
const secondaryOptions = [
  { text: 'I need help with my current assignment', context: 'current-assignment' },
  { text: 'Show me accessibility options', context: 'accessibility' },
  { text: 'Connect me with a tutor', context: 'tutor' },
  { text: "Thanks, that's all I needed", context: 'farewell' },
];

// Get the current page name from the URL
function getCurrentPage() {
  const path = window.location.pathname;
  const pathWithoutExtension = path.replace('.html', '').replace(/^\//, '');

  // Default to student dashboard if we can't determine the page
  if (!pathWithoutExtension) return 'superhero-school/student-dashboard';

  return pathWithoutExtension;
}

// Get the current section the user is viewing based on scroll position
function getCurrentSection() {
  // This is a simplified version - in a real implementation, we would check
  // which section is currently in the viewport
  const toolsSection = document.querySelector('.tools-grid');
  const curriculumSection = document.querySelector('.curriculum-section');

  if (isElementInViewport(toolsSection)) return 'tools-section';
  if (isElementInViewport(curriculumSection)) return 'curriculum-section';

  return 'default';
}

// Helper function to check if an element is in the viewport
function isElementInViewport(el) {
  if (!el) return false;

  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Get help topics based on current page and section
function getContextualHelpTopics() {
  const currentPage = getCurrentPage();
  const currentSection = getCurrentSection();

  // Get page topics
  const pageTopics =
    contextualHelpTopics[currentPage] || contextualHelpTopics['superhero-school/student-dashboard'];

  // Get section topics or default topics
  return pageTopics[currentSection] || pageTopics.default || [];
}

// Get a random character name
function getRandomCharacter() {
  const characters = Object.keys(helpCharacters);
  return characters[Math.floor(Math.random() * characters.length)];
}

// Get student name from localStorage or use a default
function getStudentName() {
  // In a real implementation, this would come from the user's profile
  return localStorage.getItem('studentName') || 'there';
}

// Initialize the help bubble system
function initializeHelpBubble(characterName = null) {
  // If no character is specified, either use the stored character or pick a random one
  if (!characterName) {
    characterName = localStorage.getItem('helpCharacter') || getRandomCharacter();
    // Store the character for consistency across pages
    localStorage.setItem('helpCharacter', characterName);
  }

  const character = helpCharacters[characterName];
  const studentName = getStudentName();

  // Update the help bubble
  const helpBubble = document.getElementById('help-bubble');
  helpBubble.textContent = character.emoji;
  helpBubble.style.backgroundColor = character.color;
  helpBubble.classList.add(`animation-${character.animation}`);

  // Update the help panel
  const helpPanel = document.getElementById('help-content');
  helpPanel.style.borderTop = `3px solid ${character.color}`;

  // Update the character name
  const characterNameElement = document.querySelector('.help-character-name');
  characterNameElement.textContent = character.name;
  characterNameElement.style.color = character.color;

  // Update the greeting message
  const helpMessage = document.querySelector('.help-message p');
  helpMessage.textContent = character.greeting.replace('{name}', studentName);

  // Update the help options
  updateHelpOptions();

  return character;
}

// Update help options based on context
function updateHelpOptions(options = null) {
  const helpOptionsContainer = document.querySelector('.help-options');
  const optionsToUse = options || getContextualHelpTopics();

  helpOptionsContainer.innerHTML = '';

  optionsToUse.forEach((option) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'help-option';
    optionElement.textContent = option.text;
    optionElement.dataset.context = option.context;
    helpOptionsContainer.appendChild(optionElement);
  });

  // Add event listeners to the new options
  document.querySelectorAll('.help-option').forEach((optionElement) => {
    optionElement.addEventListener('click', handleHelpOptionClick);
  });
}

// Handle help option clicks
function handleHelpOptionClick(event) {
  const optionText = event.target.textContent;
  const context = event.target.dataset.context;
  const characterName = localStorage.getItem('helpCharacter');
  const character = helpCharacters[characterName];

  let responseText = '';

  // Get the appropriate response based on character and context
  if (context === 'farewell') {
    responseText = character.farewell.replace('{name}', getStudentName());
  } else if (helpResponses[context]) {
    responseText = helpResponses[context][characterName] || helpResponses[context].stella;
  } else {
    // Fallback response if we don't have a specific one for this context
    responseText = `I'd be happy to help with "${optionText}". Let me look into that for you.`;
  }

  // Update the help message
  document.querySelector('.help-message').innerHTML = `<p>${responseText}</p>`;

  // If this isn't a farewell message, update to secondary options
  if (context !== 'farewell') {
    updateHelpOptions(secondaryOptions);
  }
}

// Switch to a different help character
function switchHelpCharacter(characterName) {
  if (helpCharacters[characterName]) {
    localStorage.setItem('helpCharacter', characterName);
    initializeHelpBubble(characterName);
  }
}

// Animate the help bubble when it has information related to the current context
function pulseHelpBubble() {
  const helpBubble = document.getElementById('help-bubble');
  helpBubble.classList.add('pulse-attention');

  setTimeout(() => {
    helpBubble.classList.remove('pulse-attention');
  }, 2000);
}

// Export the functions for use in other scripts
window.HelpCharacterSystem = {
  initialize: initializeHelpBubble,
  updateOptions: updateHelpOptions,
  switchCharacter: switchHelpCharacter,
  pulseAttention: pulseHelpBubble,
};
