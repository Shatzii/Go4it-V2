/**
 * Learning Streaks System
 * 
 * A gamification system that tracks learning streaks, badges, and achievements
 * to increase motivation and engagement for neurodivergent learners.
 */

class LearningStreakSystem {
  constructor(options = {}) {
    // Configuration
    this.userID = options.userID || this.getUserIDFromStorage();
    this.streakThreshold = options.streakThreshold || 1; // activities per day to maintain streak
    this.badgeSystem = options.badgeSystem !== false;
    this.pointMultipliers = options.pointMultipliers || {
      basePoints: 10,
      streakBonus: 0.1, // 10% bonus per streak day
      focusBonus: 0.5,  // 50% bonus for extended focus time
      challengeBonus: 0.2 // 20% bonus for completing challenges
    };
    this.visualEffects = options.visualEffects !== false;
    this.syncWithServer = options.syncWithServer !== false;
    this.debug = options.debug || false;
    
    // State
    this.streakData = this.loadStreakData();
    this.badges = this.loadBadges();
    this.achievements = this.loadAchievements();
    this.lastSyncTime = null;
    
    // UI Elements
    this.streakCounter = null;
    this.streakFlame = null;
    this.pointsDisplay = null;
    this.badgeContainer = null;
    this.levelIndicator = null;
    
    // Event tracking
    this.activityLog = [];
    
    // Initialize the system
    this.initialize();
  }
  
  /**
   * Initialize the streak system
   */
  initialize() {
    this.log('Initializing Learning Streak System');
    
    // Create UI elements
    this.createUIElements();
    
    // Check and update streak status
    this.checkStreakStatus();
    
    // Load achievements and badges
    this.updateBadges();
    this.updateAchievements();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Sync with server if enabled
    if (this.syncWithServer) {
      this.syncStreakData();
    }
    
    // Create animations
    if (this.visualEffects) {
      this.createAnimations();
    }
    
    this.log('Learning Streak System initialized');
  }
  
  /**
   * Create the UI elements for the streak system
   */
  createUIElements() {
    // Create streak counter
    const streakContainer = document.createElement('div');
    streakContainer.className = 'streak-container';
    streakContainer.innerHTML = `
      <div class="streak-flame">🔥</div>
      <div class="streak-counter">${this.streakData.currentStreak}</div>
      <div class="streak-label">day streak</div>
    `;
    
    // Create points display
    const pointsContainer = document.createElement('div');
    pointsContainer.className = 'points-container';
    pointsContainer.innerHTML = `
      <div class="points-value">${this.streakData.totalPoints}</div>
      <div class="points-label">learning points</div>
    `;
    
    // Create level indicator
    const levelContainer = document.createElement('div');
    levelContainer.className = 'level-container';
    const level = this.calculateLevel();
    const nextLevelPoints = this.getPointsForNextLevel();
    const progress = this.calculateLevelProgress();
    
    levelContainer.innerHTML = `
      <div class="level-info">
        <div class="level-number">Level ${level}</div>
        <div class="level-title">${this.getLevelTitle(level)}</div>
      </div>
      <div class="level-progress-bar">
        <div class="level-progress" style="width: ${progress}%"></div>
      </div>
      <div class="level-next">Next level: ${nextLevelPoints - this.streakData.totalPoints} points</div>
    `;
    
    // Create badge container
    const badgeContainer = document.createElement('div');
    badgeContainer.className = 'badge-container';
    badgeContainer.innerHTML = '<div class="badge-title">Your Badges</div><div class="badge-grid"></div>';
    
    // Create achievement container
    const achievementContainer = document.createElement('div');
    achievementContainer.className = 'achievement-container';
    achievementContainer.innerHTML = '<div class="achievement-title">Recent Achievements</div><div class="achievement-list"></div>';
    
    // Create game elements container
    const gameElementsContainer = document.createElement('div');
    gameElementsContainer.className = 'game-elements-container';
    gameElementsContainer.appendChild(streakContainer);
    gameElementsContainer.appendChild(pointsContainer);
    gameElementsContainer.appendChild(levelContainer);
    gameElementsContainer.appendChild(badgeContainer);
    gameElementsContainer.appendChild(achievementContainer);
    
    // Add the container to the page (if a specific container is not provided)
    const targetContainer = document.querySelector('.dashboard-stats') || document.querySelector('main') || document.body;
    targetContainer.appendChild(gameElementsContainer);
    
    // Store references to elements
    this.streakCounter = streakContainer.querySelector('.streak-counter');
    this.streakFlame = streakContainer.querySelector('.streak-flame');
    this.pointsDisplay = pointsContainer.querySelector('.points-value');
    this.badgeContainer = badgeContainer.querySelector('.badge-grid');
    this.levelIndicator = levelContainer.querySelector('.level-number');
    this.levelProgress = levelContainer.querySelector('.level-progress');
    this.levelTitle = levelContainer.querySelector('.level-title');
    this.levelNext = levelContainer.querySelector('.level-next');
    this.achievementList = achievementContainer.querySelector('.achievement-list');
    
    // Add styles
    this.addStyles();
  }
  
  /**
   * Add CSS styles for the streak system
   */
  addStyles() {
    if (document.getElementById('learning-streaks-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'learning-streaks-styles';
    
    style.textContent = `
      /* Game Elements Container */
      .game-elements-container {
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 10px;
        margin: 20px 0;
        padding: 20px;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        border: 1px solid rgba(30, 144, 255, 0.3);
        position: relative;
        overflow: hidden;
      }
      
      .game-elements-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(to right, #1e90ff, #32cd32, #1e90ff);
        animation: progress-border 3s linear infinite;
      }
      
      @keyframes progress-border {
        0% { background-position: 0% 50%; }
        100% { background-position: 100% 50%; }
      }
      
      /* Streak Container */
      .streak-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgba(30, 144, 255, 0.1);
        border-radius: 8px;
        padding: 15px;
        min-width: 120px;
        transition: all 0.3s ease;
        border: 1px solid rgba(30, 144, 255, 0.3);
      }
      
      .streak-container:hover {
        background-color: rgba(30, 144, 255, 0.2);
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(30, 144, 255, 0.3);
      }
      
      .streak-flame {
        font-size: 24px;
        margin-bottom: 5px;
        transition: all 0.3s ease;
      }
      
      .streak-counter {
        font-size: 32px;
        font-weight: bold;
        color: #1e90ff;
        text-shadow: 0 0 10px rgba(30, 144, 255, 0.5);
      }
      
      .streak-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }
      
      /* Points Container */
      .points-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgba(30, 144, 255, 0.1);
        border-radius: 8px;
        padding: 15px;
        min-width: 120px;
        transition: all 0.3s ease;
        border: 1px solid rgba(30, 144, 255, 0.3);
      }
      
      .points-container:hover {
        background-color: rgba(30, 144, 255, 0.2);
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(30, 144, 255, 0.3);
      }
      
      .points-value {
        font-size: 32px;
        font-weight: bold;
        color: #1e90ff;
        text-shadow: 0 0 10px rgba(30, 144, 255, 0.5);
        transition: all 0.3s ease;
      }
      
      .points-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }
      
      /* Level Container */
      .level-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: rgba(30, 144, 255, 0.1);
        border-radius: 8px;
        padding: 15px;
        min-width: 200px;
        flex: 1;
        transition: all 0.3s ease;
        border: 1px solid rgba(30, 144, 255, 0.3);
      }
      
      .level-container:hover {
        background-color: rgba(30, 144, 255, 0.2);
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(30, 144, 255, 0.3);
      }
      
      .level-info {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
      }
      
      .level-number {
        font-size: 24px;
        font-weight: bold;
        color: #1e90ff;
        text-shadow: 0 0 10px rgba(30, 144, 255, 0.5);
      }
      
      .level-title {
        font-size: 14px;
        color: #32cd32;
      }
      
      .level-progress-bar {
        height: 10px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        overflow: hidden;
      }
      
      .level-progress {
        height: 100%;
        background: linear-gradient(to right, #1e90ff, #32cd32);
        border-radius: 5px;
        transition: width 0.5s ease;
      }
      
      .level-next {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        text-align: right;
      }
      
      /* Badge Container */
      .badge-container {
        flex: 2;
        background-color: rgba(30, 144, 255, 0.1);
        border-radius: 8px;
        padding: 15px;
        transition: all 0.3s ease;
        border: 1px solid rgba(30, 144, 255, 0.3);
      }
      
      .badge-container:hover {
        background-color: rgba(30, 144, 255, 0.2);
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(30, 144, 255, 0.3);
      }
      
      .badge-title {
        font-size: 18px;
        margin-bottom: 10px;
        color: #1e90ff;
        font-weight: bold;
      }
      
      .badge-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        gap: 10px;
      }
      
      .badge {
        width: 60px;
        height: 60px;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        border: 2px solid transparent;
      }
      
      .badge.unlocked {
        background-color: rgba(30, 144, 255, 0.2);
        border-color: #1e90ff;
      }
      
      .badge.locked {
        filter: grayscale(1);
        opacity: 0.5;
      }
      
      .badge:hover {
        transform: scale(1.1);
        z-index: 1;
      }
      
      .badge-tooltip {
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease;
        z-index: 10;
      }
      
      .badge:hover .badge-tooltip {
        opacity: 1;
        top: -50px;
      }
      
      /* Achievement Container */
      .achievement-container {
        flex: 2;
        background-color: rgba(30, 144, 255, 0.1);
        border-radius: 8px;
        padding: 15px;
        transition: all 0.3s ease;
        border: 1px solid rgba(30, 144, 255, 0.3);
      }
      
      .achievement-container:hover {
        background-color: rgba(30, 144, 255, 0.2);
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(30, 144, 255, 0.3);
      }
      
      .achievement-title {
        font-size: 18px;
        margin-bottom: 10px;
        color: #1e90ff;
        font-weight: bold;
      }
      
      .achievement-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .achievement-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 5px;
        transition: all 0.3s ease;
      }
      
      .achievement-item:hover {
        background-color: rgba(0, 0, 0, 0.5);
      }
      
      .achievement-icon {
        font-size: 20px;
        min-width: 30px;
        text-align: center;
      }
      
      .achievement-info {
        flex: 1;
      }
      
      .achievement-name {
        font-weight: bold;
        color: #32cd32;
        margin-bottom: 3px;
      }
      
      .achievement-description {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }
      
      .achievement-points {
        background-color: rgba(30, 144, 255, 0.3);
        padding: 3px 8px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: bold;
      }
      
      /* Notification */
      .streak-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 0 20px rgba(30, 144, 255, 0.5);
        animation: notification-slide-in 0.5s ease-out;
        max-width: 300px;
        border-left: 3px solid #1e90ff;
      }
      
      .notification-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }
      
      .notification-icon {
        font-size: 24px;
      }
      
      .notification-title {
        font-weight: bold;
        font-size: 16px;
        color: #1e90ff;
      }
      
      .notification-message {
        margin-bottom: 10px;
      }
      
      .notification-points {
        font-weight: bold;
        color: #32cd32;
      }
      
      @keyframes notification-slide-in {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      /* Animations */
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      
      @keyframes float {
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
      }
      
      @keyframes flame {
        0% { opacity: 0.8; transform: scale(1) rotate(-5deg); }
        25% { opacity: 1; transform: scale(1.1) rotate(5deg); }
        50% { opacity: 0.8; transform: scale(1) rotate(-5deg); }
        75% { opacity: 1; transform: scale(1.2) rotate(5deg); }
        100% { opacity: 0.8; transform: scale(1) rotate(-5deg); }
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .game-elements-container {
          flex-direction: column;
        }
        
        .streak-container,
        .points-container,
        .level-container,
        .badge-container,
        .achievement-container {
          width: 100%;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Listen for learning activities
    document.addEventListener('learningActivity', this.handleLearningActivity.bind(this));
    
    // Listen for focus time
    document.addEventListener('focusSession', this.handleFocusSession.bind(this));
    
    // Listen for challenges
    document.addEventListener('challengeCompleted', this.handleChallengeCompleted.bind(this));
    
    // Check for activity before unload
    window.addEventListener('beforeunload', () => this.saveStreakData());
    
    // Custom tracking for activities
    this.setupCustomTracking();
  }
  
  /**
   * Setup custom tracking for learning activities
   */
  setupCustomTracking() {
    // Track quiz completions
    document.addEventListener('click', (e) => {
      if (e.target.matches('.quiz-submit') || e.target.closest('.quiz-submit')) {
        this.logActivity('quiz_completion', 20);
      }
    });
    
    // Track curriculum generation
    document.addEventListener('click', (e) => {
      if (e.target.matches('.curriculum-generate') || e.target.closest('.curriculum-generate')) {
        this.logActivity('curriculum_generation', 15);
      }
    });
    
    // Track lesson completions - this tracks when users scroll to the bottom of lesson content
    const lessonContents = document.querySelectorAll('.lesson-content');
    if (lessonContents.length > 0) {
      lessonContents.forEach(content => {
        let lessonCompleted = false;
        
        window.addEventListener('scroll', () => {
          if (lessonCompleted) return;
          
          const rect = content.getBoundingClientRect();
          const isAtBottom = rect.bottom <= window.innerHeight;
          
          if (isAtBottom) {
            lessonCompleted = true;
            this.logActivity('lesson_completion', 30);
          }
        });
      });
    }
    
    // Track interactive activities
    document.addEventListener('click', (e) => {
      if (e.target.matches('.interactive-activity') || e.target.closest('.interactive-activity')) {
        this.logActivity('interactive_activity', 10);
      }
    });
  }
  
  /**
   * Create animations for visual elements
   */
  createAnimations() {
    // Animate streak flame
    if (this.streakFlame) {
      const streakCount = this.streakData.currentStreak;
      
      if (streakCount >= 7) {
        this.streakFlame.style.animation = 'flame 2s infinite';
        this.streakFlame.style.textShadow = '0 0 10px #ff3700';
      } else if (streakCount >= 3) {
        this.streakFlame.style.animation = 'flame 3s infinite';
      }
    }
    
    // Animate points when they change
    if (this.pointsDisplay) {
      this.pointsDisplay.addEventListener('change', () => {
        this.pointsDisplay.style.animation = 'pulse 0.5s';
        setTimeout(() => {
          this.pointsDisplay.style.animation = '';
        }, 500);
      });
    }
    
    // Animate level progress bar
    if (this.levelProgress) {
      this.levelProgress.style.transition = 'width 1s ease-in-out';
    }
  }
  
  /**
   * Handle learning activity events
   */
  handleLearningActivity(event) {
    const detail = event.detail || {};
    const activityType = detail.type || 'general_learning';
    const points = detail.points || 10;
    
    this.logActivity(activityType, points);
  }
  
  /**
   * Handle focus session events
   */
  handleFocusSession(event) {
    const detail = event.detail || {};
    const duration = detail.duration || 0; // in minutes
    const points = Math.floor(duration / 5) * 5; // 5 points per 5 minutes
    
    // Apply focus bonus for sessions longer than 25 minutes
    let bonusMultiplier = 1;
    if (duration >= 25) {
      bonusMultiplier = 1 + this.pointMultipliers.focusBonus;
    }
    
    this.logActivity('focus_session', points, bonusMultiplier);
  }
  
  /**
   * Handle challenge completed events
   */
  handleChallengeCompleted(event) {
    const detail = event.detail || {};
    const difficulty = detail.difficulty || 'normal';
    const points = this.getPointsForChallenge(difficulty);
    
    // Apply challenge bonus
    const bonusMultiplier = 1 + this.pointMultipliers.challengeBonus;
    
    this.logActivity('challenge_completion', points, bonusMultiplier);
    
    // Check if this unlocks any achievements
    this.checkForAchievements('challenge', detail);
  }
  
  /**
   * Get points for a challenge based on difficulty
   */
  getPointsForChallenge(difficulty) {
    switch (difficulty) {
      case 'easy':
        return 15;
      case 'normal':
        return 30;
      case 'hard':
        return 50;
      case 'expert':
        return 100;
      default:
        return 30;
    }
  }
  
  /**
   * Log a learning activity
   */
  logActivity(type, basePoints, bonusMultiplier = 1) {
    // Calculate streak bonus
    const streakBonus = this.streakData.currentStreak * this.pointMultipliers.streakBonus;
    const totalMultiplier = bonusMultiplier + streakBonus;
    
    // Calculate total points
    const points = Math.round(basePoints * totalMultiplier);
    
    // Create activity record
    const activity = {
      type,
      basePoints,
      bonusMultiplier,
      streakBonus,
      totalPoints: points,
      timestamp: new Date().toISOString()
    };
    
    // Add to activity log
    this.activityLog.push(activity);
    
    // Update streak data
    this.streakData.todayActivities++;
    this.streakData.totalPoints += points;
    this.streakData.lastActivityDate = new Date().toISOString().split('T')[0]; // Store just the date
    
    // Save updated streak data
    this.saveStreakData();
    
    // Update UI
    this.updateUI();
    
    // Check for achievements
    this.checkForAchievements(type, activity);
    
    // Show notification
    this.showNotification(type, points);
    
    this.log(`Activity logged: ${type}, Points: ${points}`);
  }
  
  /**
   * Check streak status and update as needed
   */
  checkStreakStatus() {
    const today = new Date().toISOString().split('T')[0];
    const lastActivityDate = this.streakData.lastActivityDate;
    
    if (!lastActivityDate) {
      // First time user
      this.streakData.currentStreak = 0;
      this.streakData.todayActivities = 0;
      return;
    }
    
    // Calculate the difference in days
    const lastDate = new Date(lastActivityDate);
    const todayDate = new Date(today);
    const diffTime = Math.abs(todayDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      // Streak broken
      this.streakData.currentStreak = 0;
      this.streakData.todayActivities = 0;
      this.saveStreakData();
      
      // Show broken streak notification
      this.showBrokenStreakNotification();
    } else if (diffDays === 1 && this.streakData.todayActivities >= this.streakThreshold) {
      // New day, increment streak if yesterday had enough activities
      this.streakData.currentStreak++;
      this.streakData.todayActivities = 0;
      this.saveStreakData();
      
      // Show streak notification
      this.showStreakNotification();
      
      // Check for streak achievements
      this.checkForAchievements('streak', { streakDays: this.streakData.currentStreak });
    }
    
    // Update UI
    this.updateUI();
  }
  
  /**
   * Update UI elements with current data
   */
  updateUI() {
    // Update streak counter
    if (this.streakCounter) {
      this.streakCounter.textContent = this.streakData.currentStreak;
      
      // Apply animations for significant streaks
      if (this.visualEffects && this.streakFlame) {
        if (this.streakData.currentStreak >= 7) {
          this.streakFlame.style.animation = 'flame 2s infinite';
          this.streakFlame.style.textShadow = '0 0 10px #ff3700';
        } else if (this.streakData.currentStreak >= 3) {
          this.streakFlame.style.animation = 'flame 3s infinite';
        } else {
          this.streakFlame.style.animation = '';
          this.streakFlame.style.textShadow = '';
        }
      }
    }
    
    // Update points display
    if (this.pointsDisplay) {
      const oldPoints = parseInt(this.pointsDisplay.textContent);
      const newPoints = this.streakData.totalPoints;
      
      // Animate points change
      if (oldPoints !== newPoints && this.visualEffects) {
        this.animatePointsChange(oldPoints, newPoints);
      } else {
        this.pointsDisplay.textContent = newPoints;
      }
    }
    
    // Update level indicator
    if (this.levelIndicator) {
      const level = this.calculateLevel();
      this.levelIndicator.textContent = `Level ${level}`;
      
      if (this.levelTitle) {
        this.levelTitle.textContent = this.getLevelTitle(level);
      }
      
      if (this.levelProgress) {
        const progress = this.calculateLevelProgress();
        this.levelProgress.style.width = `${progress}%`;
      }
      
      if (this.levelNext) {
        const nextLevelPoints = this.getPointsForNextLevel();
        this.levelNext.textContent = `Next level: ${nextLevelPoints - this.streakData.totalPoints} points`;
      }
    }
  }
  
  /**
   * Animate points change with counting effect
   */
  animatePointsChange(oldPoints, newPoints) {
    const duration = 1000; // ms
    const step = 30; // ms
    const increment = Math.ceil((newPoints - oldPoints) / (duration / step));
    
    let current = oldPoints;
    const interval = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= newPoints) || (increment < 0 && current <= newPoints)) {
        clearInterval(interval);
        this.pointsDisplay.textContent = newPoints;
      } else {
        this.pointsDisplay.textContent = current;
      }
    }, step);
    
    // Add pulse animation
    this.pointsDisplay.style.animation = 'pulse 0.5s';
    setTimeout(() => {
      this.pointsDisplay.style.animation = '';
    }, 500);
  }
  
  /**
   * Calculate user level based on total points
   */
  calculateLevel() {
    const points = this.streakData.totalPoints;
    // Each level requires 20% more points than the previous
    let level = 1;
    let pointsRequired = 100;
    let totalRequired = pointsRequired;
    
    while (points >= totalRequired) {
      level++;
      pointsRequired = Math.floor(pointsRequired * 1.2);
      totalRequired += pointsRequired;
    }
    
    return level;
  }
  
  /**
   * Get the points required for the next level
   */
  getPointsForNextLevel() {
    const currentLevel = this.calculateLevel();
    let pointsRequired = 100;
    let totalRequired = pointsRequired;
    
    for (let i = 1; i < currentLevel; i++) {
      pointsRequired = Math.floor(pointsRequired * 1.2);
      totalRequired += pointsRequired;
    }
    
    return totalRequired;
  }
  
  /**
   * Calculate progress towards next level (as percentage)
   */
  calculateLevelProgress() {
    const points = this.streakData.totalPoints;
    const currentLevel = this.calculateLevel();
    
    // Calculate points for current level and next level
    let previousLevelPoints = 0;
    let currentLevelPoints = 100;
    
    for (let i = 1; i < currentLevel; i++) {
      previousLevelPoints += currentLevelPoints;
      currentLevelPoints = Math.floor(currentLevelPoints * 1.2);
    }
    
    const nextLevelPoints = previousLevelPoints + currentLevelPoints;
    const progress = ((points - previousLevelPoints) / (nextLevelPoints - previousLevelPoints)) * 100;
    
    return Math.min(100, Math.max(0, progress));
  }
  
  /**
   * Get title for the current level
   */
  getLevelTitle(level) {
    const titles = [
      'Novice Learner',
      'Curious Explorer',
      'Knowledge Seeker',
      'Dedicated Student',
      'Pattern Recognizer',
      'Insight Finder',
      'Skilled Practitioner',
      'Deep Thinker',
      'Master Learner',
      'Wisdom Keeper',
      'Learning Champion',
      'Cognitive Virtuoso',
      'Neural Navigator',
      'Thought Leader',
      'Learning Luminary',
      'Knowledge Architect',
      'Learning Legend',
      'Cognitive Commander',
      'Learning Maestro',
      'Educational Elite'
    ];
    
    // Cap the level to available titles
    const titleIndex = Math.min(level - 1, titles.length - 1);
    return titles[titleIndex];
  }
  
  /**
   * Update badges display
   */
  updateBadges() {
    if (!this.badgeContainer) return;
    
    // Clear existing badges
    this.badgeContainer.innerHTML = '';
    
    // Add badges
    Object.entries(this.badges).forEach(([badgeId, badge]) => {
      const badgeElement = document.createElement('div');
      badgeElement.className = `badge ${badge.unlocked ? 'unlocked' : 'locked'}`;
      badgeElement.innerHTML = `
        <span>${badge.icon}</span>
        <div class="badge-tooltip">${badge.name}${!badge.unlocked ? ' (Locked)' : ''}</div>
      `;
      
      // Add click handler to show badge details
      badgeElement.addEventListener('click', () => {
        this.showBadgeDetails(badgeId);
      });
      
      this.badgeContainer.appendChild(badgeElement);
    });
  }
  
  /**
   * Update achievements list
   */
  updateAchievements() {
    if (!this.achievementList) return;
    
    // Clear existing achievements
    this.achievementList.innerHTML = '';
    
    // Get recent achievements (up to 5)
    const recentAchievements = Object.entries(this.achievements)
      .filter(([, achievement]) => achievement.unlocked)
      .sort((a, b) => new Date(b[1].unlockedDate) - new Date(a[1].unlockedDate))
      .slice(0, 4);
    
    // Add achievements
    recentAchievements.forEach(([achievementId, achievement]) => {
      const achievementElement = document.createElement('div');
      achievementElement.className = 'achievement-item';
      achievementElement.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-info">
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-description">${achievement.description}</div>
        </div>
        <div class="achievement-points">+${achievement.points}pts</div>
      `;
      
      this.achievementList.appendChild(achievementElement);
    });
    
    // If no achievements, show message
    if (recentAchievements.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'achievement-empty';
      emptyMessage.textContent = 'Complete activities to earn achievements!';
      this.achievementList.appendChild(emptyMessage);
    }
  }
  
  /**
   * Show badge details in a modal
   */
  showBadgeDetails(badgeId) {
    const badge = this.badges[badgeId];
    if (!badge) return;
    
    // Create modal element if it doesn't exist
    let modalElement = document.getElementById('badge-modal');
    if (!modalElement) {
      modalElement = document.createElement('div');
      modalElement.id = 'badge-modal';
      modalElement.className = 'badge-modal';
      modalElement.innerHTML = `
        <div class="badge-modal-content">
          <span class="badge-modal-close">&times;</span>
          <div class="badge-modal-header">
            <div class="badge-modal-icon"></div>
            <div class="badge-modal-title"></div>
          </div>
          <div class="badge-modal-description"></div>
          <div class="badge-modal-criteria"></div>
          <div class="badge-modal-progress">
            <div class="badge-modal-progress-bar">
              <div class="badge-modal-progress-fill"></div>
            </div>
            <div class="badge-modal-progress-text"></div>
          </div>
        </div>
      `;
      document.body.appendChild(modalElement);
      
      // Add styles
      const style = document.createElement('style');
      style.id = 'badge-modal-styles';
      style.textContent = `
        .badge-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          justify-content: center;
          align-items: center;
        }
        
        .badge-modal.active {
          display: flex;
          animation: modal-fade-in 0.3s ease-out;
        }
        
        @keyframes modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .badge-modal-content {
          background-color: rgba(0, 0, 0, 0.9);
          border-radius: 10px;
          padding: 30px;
          max-width: 500px;
          width: 80%;
          position: relative;
          border: 1px solid #1e90ff;
          box-shadow: 0 0 20px rgba(30, 144, 255, 0.3);
        }
        
        .badge-modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 24px;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.3s ease;
        }
        
        .badge-modal-close:hover {
          color: white;
        }
        
        .badge-modal-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .badge-modal-icon {
          font-size: 50px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: rgba(30, 144, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #1e90ff;
        }
        
        .badge-modal-title {
          font-size: 24px;
          font-weight: bold;
          color: #1e90ff;
        }
        
        .badge-modal-description {
          margin-bottom: 20px;
          font-size: 16px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .badge-modal-criteria {
          margin-bottom: 20px;
          padding: 10px;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 5px;
          border-left: 3px solid #32cd32;
        }
        
        .badge-modal-progress {
          margin-top: 20px;
        }
        
        .badge-modal-progress-bar {
          height: 10px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        
        .badge-modal-progress-fill {
          height: 100%;
          background: linear-gradient(to right, #1e90ff, #32cd32);
          border-radius: 5px;
          transition: width 0.5s ease;
        }
        
        .badge-modal-progress-text {
          text-align: right;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }
      `;
      document.head.appendChild(style);
      
      // Add close handler
      modalElement.querySelector('.badge-modal-close').addEventListener('click', () => {
        modalElement.classList.remove('active');
      });
      
      // Close on click outside
      modalElement.addEventListener('click', (e) => {
        if (e.target === modalElement) {
          modalElement.classList.remove('active');
        }
      });
    }
    
    // Update modal content
    const iconElement = modalElement.querySelector('.badge-modal-icon');
    const titleElement = modalElement.querySelector('.badge-modal-title');
    const descriptionElement = modalElement.querySelector('.badge-modal-description');
    const criteriaElement = modalElement.querySelector('.badge-modal-criteria');
    const progressFillElement = modalElement.querySelector('.badge-modal-progress-fill');
    const progressTextElement = modalElement.querySelector('.badge-modal-progress-text');
    
    iconElement.textContent = badge.icon;
    titleElement.textContent = badge.name;
    descriptionElement.textContent = badge.description;
    criteriaElement.textContent = badge.criteria;
    
    if (badge.unlocked) {
      progressFillElement.style.width = '100%';
      progressTextElement.textContent = 'Unlocked!';
      iconElement.style.opacity = '1';
    } else {
      // Calculate progress if available
      const progress = badge.progress || 0;
      const maxProgress = badge.maxProgress || 1;
      const progressPercent = Math.min(100, (progress / maxProgress) * 100);
      
      progressFillElement.style.width = `${progressPercent}%`;
      progressTextElement.textContent = `Progress: ${progress}/${maxProgress}`;
      iconElement.style.opacity = '0.5';
    }
    
    // Show modal
    modalElement.classList.add('active');
  }
  
  /**
   * Show notification for activities
   */
  showNotification(type, points) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'streak-notification';
    
    // Set content based on activity type
    let icon = '🎓';
    let title = 'Learning Activity';
    let message = 'You earned points for your learning activity!';
    
    switch (type) {
      case 'quiz_completion':
        icon = '📝';
        title = 'Quiz Completed';
        message = 'Great job completing the quiz!';
        break;
      case 'curriculum_generation':
        icon = '📚';
        title = 'Curriculum Generated';
        message = 'You created personalized learning materials!';
        break;
      case 'lesson_completion':
        icon = '📖';
        title = 'Lesson Completed';
        message = 'You finished studying the lesson material!';
        break;
      case 'focus_session':
        icon = '⏱️';
        title = 'Focus Session';
        message = 'Great job staying focused on your learning!';
        break;
      case 'challenge_completion':
        icon = '🏆';
        title = 'Challenge Completed';
        message = 'You successfully completed a learning challenge!';
        break;
    }
    
    notification.innerHTML = `
      <div class="notification-header">
        <div class="notification-icon">${icon}</div>
        <div class="notification-title">${title}</div>
      </div>
      <div class="notification-message">${message}</div>
      <div class="notification-points">+${points} points</div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'notification-slide-out 0.5s ease-in forwards';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 5000);
    
    // Add style for slide-out animation if not already added
    if (!document.querySelector('style[data-notification-animation]')) {
      const style = document.createElement('style');
      style.setAttribute('data-notification-animation', 'true');
      style.textContent = `
        @keyframes notification-slide-out {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  /**
   * Show notification for broken streak
   */
  showBrokenStreakNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'streak-notification';
    notification.innerHTML = `
      <div class="notification-header">
        <div class="notification-icon">💔</div>
        <div class="notification-title">Streak Broken</div>
      </div>
      <div class="notification-message">Oh no! Your learning streak has been reset. Remember to log in and complete activities daily to maintain your streak!</div>
      <div class="notification-points">Start a new streak today!</div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 8 seconds
    setTimeout(() => {
      notification.style.animation = 'notification-slide-out 0.5s ease-in forwards';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 8000);
  }
  
  /**
   * Show notification for streak milestone
   */
  showStreakNotification() {
    // Only show for significant streaks
    if (this.streakData.currentStreak < 3) return;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'streak-notification';
    
    let message = `You've maintained your learning streak for ${this.streakData.currentStreak} days!`;
    let special = '';
    
    if (this.streakData.currentStreak === 7) {
      special = 'That\'s a full week! Keep up the great work!';
    } else if (this.streakData.currentStreak === 30) {
      special = 'That\'s a full month! You\'re building amazing learning habits!';
    } else if (this.streakData.currentStreak === 100) {
      special = '100 days! You\'re a learning champion!';
    } else if (this.streakData.currentStreak === 365) {
      special = 'A full year of consistent learning! Incredible dedication!';
    }
    
    notification.innerHTML = `
      <div class="notification-header">
        <div class="notification-icon">🔥</div>
        <div class="notification-title">Streak Milestone!</div>
      </div>
      <div class="notification-message">${message}</div>
      ${special ? `<div class="notification-special">${special}</div>` : ''}
      <div class="notification-points">Streak bonus: +${Math.round(this.streakData.currentStreak * this.pointMultipliers.streakBonus * 100)}% points</div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 8 seconds
    setTimeout(() => {
      notification.style.animation = 'notification-slide-out 0.5s ease-in forwards';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 8000);
  }
  
  /**
   * Check for achievements based on activity
   */
  checkForAchievements(type, data) {
    // Check each achievement
    Object.entries(this.achievements).forEach(([id, achievement]) => {
      // Skip already unlocked achievements
      if (achievement.unlocked) return;
      
      let unlocked = false;
      
      // Check based on achievement type
      switch (achievement.type) {
        case 'streak':
          if (type === 'streak' && this.streakData.currentStreak >= achievement.requirement) {
            unlocked = true;
          }
          break;
        case 'points':
          if (this.streakData.totalPoints >= achievement.requirement) {
            unlocked = true;
          }
          break;
        case 'activity':
          if (this.activityLog.filter(a => a.type === achievement.activityType).length >= achievement.requirement) {
            unlocked = true;
          }
          break;
        case 'level':
          if (this.calculateLevel() >= achievement.requirement) {
            unlocked = true;
          }
          break;
        case 'challenge':
          if (type === 'challenge' && data && data.difficulty === achievement.difficulty) {
            const challengeCount = this.activityLog.filter(a => 
              a.type === 'challenge_completion' && 
              a.challengeDifficulty === achievement.difficulty
            ).length;
            
            if (challengeCount >= achievement.requirement) {
              unlocked = true;
            }
          }
          break;
      }
      
      // Unlock achievement if conditions met
      if (unlocked) {
        this.unlockAchievement(id);
      }
    });
  }
  
  /**
   * Unlock an achievement
   */
  unlockAchievement(achievementId) {
    const achievement = this.achievements[achievementId];
    if (!achievement || achievement.unlocked) return;
    
    // Update achievement data
    achievement.unlocked = true;
    achievement.unlockedDate = new Date().toISOString();
    
    // Award points
    this.streakData.totalPoints += achievement.points;
    
    // Save data
    this.saveAchievements();
    this.saveStreakData();
    
    // Update UI
    this.updateAchievements();
    this.updateUI();
    
    // Show notification
    this.showAchievementNotification(achievementId);
    
    this.log(`Achievement unlocked: ${achievement.name}`);
  }
  
  /**
   * Show achievement notification
   */
  showAchievementNotification(achievementId) {
    const achievement = this.achievements[achievementId];
    if (!achievement) return;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'streak-notification achievement-notification';
    notification.innerHTML = `
      <div class="notification-header">
        <div class="notification-icon">${achievement.icon}</div>
        <div class="notification-title">Achievement Unlocked!</div>
      </div>
      <div class="notification-achievement-name">${achievement.name}</div>
      <div class="notification-message">${achievement.description}</div>
      <div class="notification-points">+${achievement.points} points</div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add style for achievement notification if not already added
    if (!document.querySelector('style[data-achievement-notification]')) {
      const style = document.createElement('style');
      style.setAttribute('data-achievement-notification', 'true');
      style.textContent = `
        .achievement-notification {
          background: linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(30, 144, 255, 0.3));
          border-left: 3px solid gold;
        }
        
        .notification-achievement-name {
          font-size: 18px;
          font-weight: bold;
          color: gold;
          margin-bottom: 8px;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Remove after 10 seconds
    setTimeout(() => {
      notification.style.animation = 'notification-slide-out 0.5s ease-in forwards';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 10000);
  }
  
  /**
   * Sync streak data with server
   */
  syncStreakData() {
    if (!this.syncWithServer) return;
    
    // TODO: Implement server sync
    this.log('Server sync not implemented');
  }
  
  /**
   * Save streak data to local storage
   */
  saveStreakData() {
    try {
      localStorage.setItem('learning_streak_data', JSON.stringify(this.streakData));
    } catch (e) {
      console.error('Error saving streak data:', e);
    }
  }
  
  /**
   * Save badges to local storage
   */
  saveBadges() {
    try {
      localStorage.setItem('learning_badges', JSON.stringify(this.badges));
    } catch (e) {
      console.error('Error saving badges:', e);
    }
  }
  
  /**
   * Save achievements to local storage
   */
  saveAchievements() {
    try {
      localStorage.setItem('learning_achievements', JSON.stringify(this.achievements));
    } catch (e) {
      console.error('Error saving achievements:', e);
    }
  }
  
  /**
   * Load streak data from local storage
   */
  loadStreakData() {
    try {
      const data = localStorage.getItem('learning_streak_data');
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading streak data:', e);
    }
    
    // Default data
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
      todayActivities: 0,
      lastActivityDate: null,
      badges: []
    };
  }
  
  /**
   * Load badges from local storage or use defaults
   */
  loadBadges() {
    try {
      const data = localStorage.getItem('learning_badges');
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading badges:', e);
    }
    
    // Default badges
    return {
      streak_3: {
        name: '3-Day Streak',
        icon: '🔥',
        description: 'Maintained a learning streak for 3 days.',
        criteria: 'Log in and complete learning activities for 3 consecutive days.',
        unlocked: false,
        progress: 0,
        maxProgress: 3
      },
      streak_7: {
        name: 'Weekly Warrior',
        icon: '🔥',
        description: 'Maintained a learning streak for 7 days.',
        criteria: 'Log in and complete learning activities for 7 consecutive days.',
        unlocked: false,
        progress: 0,
        maxProgress: 7
      },
      streak_30: {
        name: 'Monthly Master',
        icon: '🌙',
        description: 'Maintained a learning streak for 30 days.',
        criteria: 'Log in and complete learning activities for 30 consecutive days.',
        unlocked: false,
        progress: 0,
        maxProgress: 30
      },
      points_100: {
        name: 'Century Club',
        icon: '💯',
        description: 'Earned 100 learning points.',
        criteria: 'Accumulate 100 total learning points through various activities.',
        unlocked: false,
        progress: 0,
        maxProgress: 100
      },
      points_500: {
        name: 'Point Collector',
        icon: '🏅',
        description: 'Earned 500 learning points.',
        criteria: 'Accumulate 500 total learning points through various activities.',
        unlocked: false,
        progress: 0,
        maxProgress: 500
      },
      points_1000: {
        name: 'Learning Millionaire',
        icon: '🏆',
        description: 'Earned 1,000 learning points.',
        criteria: 'Accumulate 1,000 total learning points through various activities.',
        unlocked: false,
        progress: 0,
        maxProgress: 1000
      },
      quiz_5: {
        name: 'Quiz Whiz',
        icon: '📝',
        description: 'Completed 5 quizzes.',
        criteria: 'Complete 5 quizzes on any topic.',
        unlocked: false,
        progress: 0,
        maxProgress: 5
      },
      focus_60: {
        name: 'Focus Master',
        icon: '⏱️',
        description: 'Completed a 60-minute focus session.',
        criteria: 'Complete a single focus session lasting at least 60 minutes.',
        unlocked: false,
        progress: 0,
        maxProgress: 60
      },
      challenge_hard: {
        name: 'Challenge Accepted',
        icon: '🏋️',
        description: 'Completed a hard challenge.',
        criteria: 'Successfully complete a learning challenge marked as "hard".',
        unlocked: false
      },
      level_5: {
        name: 'Rising Star',
        icon: '⭐',
        description: 'Reached level 5.',
        criteria: 'Accumulate enough points to reach level 5.',
        unlocked: false,
        progress: 1,
        maxProgress: 5
      },
      level_10: {
        name: 'Learning Expert',
        icon: '🌟',
        description: 'Reached level 10.',
        criteria: 'Accumulate enough points to reach level 10.',
        unlocked: false,
        progress: 1,
        maxProgress: 10
      }
    };
  }
  
  /**
   * Load achievements from local storage or use defaults
   */
  loadAchievements() {
    try {
      const data = localStorage.getItem('learning_achievements');
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading achievements:', e);
    }
    
    // Default achievements
    return {
      first_lesson: {
        name: 'First Steps',
        icon: '👣',
        description: 'Completed your first lesson.',
        type: 'activity',
        activityType: 'lesson_completion',
        requirement: 1,
        points: 20,
        unlocked: false
      },
      first_streak: {
        name: 'Consistency Counts',
        icon: '🔥',
        description: 'Maintained a 3-day learning streak.',
        type: 'streak',
        requirement: 3,
        points: 30,
        unlocked: false
      },
      week_streak: {
        name: 'Weekly Wonder',
        icon: '📅',
        description: 'Maintained a 7-day learning streak.',
        type: 'streak',
        requirement: 7,
        points: 70,
        unlocked: false
      },
      month_streak: {
        name: 'Monthly Momentum',
        icon: '🌙',
        description: 'Maintained a 30-day learning streak.',
        type: 'streak',
        requirement: 30,
        points: 200,
        unlocked: false
      },
      quiz_master: {
        name: 'Quiz Master',
        icon: '📝',
        description: 'Completed 10 quizzes.',
        type: 'activity',
        activityType: 'quiz_completion',
        requirement: 10,
        points: 50,
        unlocked: false
      },
      curriculum_creator: {
        name: 'Curriculum Creator',
        icon: '📚',
        description: 'Generated 5 custom curriculum materials.',
        type: 'activity',
        activityType: 'curriculum_generation',
        requirement: 5,
        points: 40,
        unlocked: false
      },
      focus_champion: {
        name: 'Focus Champion',
        icon: '⏱️',
        description: 'Completed 10 focus sessions.',
        type: 'activity',
        activityType: 'focus_session',
        requirement: 10,
        points: 60,
        unlocked: false
      },
      challenge_conqueror: {
        name: 'Challenge Conqueror',
        icon: '🏆',
        description: 'Completed 5 hard challenges.',
        type: 'challenge',
        difficulty: 'hard',
        requirement: 5,
        points: 75,
        unlocked: false
      },
      point_collector: {
        name: 'Point Collector',
        icon: '💯',
        description: 'Earned 500 learning points.',
        type: 'points',
        requirement: 500,
        points: 50,
        unlocked: false
      },
      learning_enthusiast: {
        name: 'Learning Enthusiast',
        icon: '🧠',
        description: 'Reached level 5.',
        type: 'level',
        requirement: 5,
        points: 100,
        unlocked: false
      }
    };
  }
  
  /**
   * Get user ID from storage or generate a new one
   */
  getUserIDFromStorage() {
    let userID = localStorage.getItem('learning_streak_user_id');
    
    if (!userID) {
      userID = 'user_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('learning_streak_user_id', userID);
    }
    
    return userID;
  }
  
  /**
   * Log debug message
   */
  log(message) {
    if (this.debug) {
      console.log(`[LearningStreakSystem] ${message}`);
    }
  }
}

// Export to window object
window.LearningStreakSystem = LearningStreakSystem;

// Initialize if auto-initialize attribute is present
document.addEventListener('DOMContentLoaded', () => {
  const autoInit = document.querySelector('[data-auto-init-learning-streaks]');
  
  if (autoInit) {
    const options = {
      userID: autoInit.getAttribute('data-user-id'),
      streakThreshold: parseInt(autoInit.getAttribute('data-streak-threshold')) || 1,
      badgeSystem: autoInit.getAttribute('data-badge-system') !== 'false',
      visualEffects: autoInit.getAttribute('data-visual-effects') !== 'false',
      syncWithServer: autoInit.getAttribute('data-sync-with-server') !== 'false',
      debug: autoInit.getAttribute('data-debug') === 'true'
    };
    
    window.learningStreakSystem = new LearningStreakSystem(options);
  }
});