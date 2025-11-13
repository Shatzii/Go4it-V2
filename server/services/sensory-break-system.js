/**
 * Sensory Break System (cleaned)
 *
 * Replaced the large literal lists (which contained unintended line breaks)
 * with a smaller, syntactically-correct implementation that preserves the
 * public API used elsewhere in the codebase.
 */

class SensoryBreakSystem {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        defaultBreakDuration: 3,
        cognitiveLoadThresholds: { low: 0.3, medium: 0.6, high: 0.8 }
      },
      options
    );

    this.breakActivities = this.initializeBreakActivities();
    this.userBreakHistory = new Map();
    this.breakEffectiveness = new Map();
  }

  initializeBreakActivities() {
    // Keep a compact, valid dataset to avoid large literals that previously
    // contained accidental line breaks which caused parser errors in CI.
    return {
      physical: {
        light: [
          {
            id: 'stretch_routine',
            name: 'Desk Stretches',
            description: 'Gentle stretches you can do at your desk',
            duration: 2,
            benefits: ['Reduces muscle tension'],
            resources: { visualGuide: '/resources/breaks/stretches.svg' }
          }
        ],
        moderate: [
          {
            id: 'chair_yoga',
            name: 'Chair Yoga',
            description: 'Simple chair-adapted yoga',
            duration: 3,
            benefits: ['Improves flexibility'],
            resources: { visualGuide: '/resources/breaks/chair_yoga.svg' }
          }
        ],
        deep: [
          {
            id: 'energy_release',
            name: 'Energy Release',
            description: 'More intensive movements',
            duration: 5,
            benefits: ['Releases tension'],
            resources: { videoGuide: '/resources/breaks/energy_release.mp4' }
          }
        ]
      },
      visual: {
        light: [
          {
            id: 'visual_rest',
            name: '20-20-20 Eye Rest',
            description: 'Look away for 20 seconds',
            duration: 1,
            benefits: ['Reduces eye strain'],
            resources: { visualGuide: '/resources/breaks/eye_rest.svg' }
          }
        ],
        moderate: [
          {
            id: 'nature_immersion',
            name: 'Nature Scene',
            description: 'Short nature scene immersion',
            duration: 4,
            benefits: ['Reduces stress'],
            resources: { audioGuide: '/resources/breaks/nature_sounds.mp3' }
          }
        ],
        deep: []
      },
      cognitive: {
        light: [
          {
            id: 'mindful_minute',
            name: 'One Minute Mindfulness',
            description: 'Brief mindful awareness',
            duration: 1,
            benefits: ['Resets attention'],
            resources: { audioGuide: '/resources/breaks/mindful_minute.mp3' }
          }
        ],
        moderate: [],
        deep: []
      }
    };
  }

  generateBreakSchedule(userProfile = {}) {
    const baseInterval = userProfile.neurodivergentType === 'adhd' ? 20 : 30;
    const baseDuration = this.options.defaultBreakDuration;

    const scheduledBreaks = [0, 1, 2].map(i => ({
      scheduledTime: new Date(Date.now() + (i + 1) * baseInterval * 60000),
      estimatedDuration: baseDuration,
      breakType: ['visual', 'physical', 'cognitive'][i % 3],
      intensityLevel: i === 0 ? 'light' : 'moderate',
      adaptable: true,
      completed: false
    }));

    return {
      userId: userProfile.id || null,
      baseBreakInterval: baseInterval,
      baseBreakDuration: baseDuration,
      scheduledBreaks,
      generateDate: new Date()
    };
  }

  getDefaultBreakSchedule() {
    return this.generateBreakSchedule({});
  }

  determineSensoryPreferences(userProfile = {}) {
    // Return a deterministic order based on simple heuristics
    const order = ['physical', 'visual', 'auditory', 'tactile', 'cognitive'];
    if (userProfile.neurodivergentType === 'adhd') return ['physical', 'tactile', 'visual', 'auditory', 'cognitive'];
    return order;
  }

  selectBreakType(breakIndex, userProfile, prefs) {
    return (prefs && prefs[breakIndex]) || this.determineSensoryPreferences(userProfile)[0];
  }

  selectIntensityLevel(breakIndex) {
    return breakIndex === 0 ? 'light' : 'moderate';
  }

  getBreakRecommendation(userProfile = {}, currentState = {}) {
    const prefs = this.determineSensoryPreferences(userProfile);
    const category = prefs[0] || 'cognitive';
    const intensity = 'light';
    const list = (this.breakActivities[category] && this.breakActivities[category][intensity]) || [];
    const activity = list[0] || { id: 'default', name: 'Short Pause', description: 'Take a short pause', duration: 1, benefits: [] };

    this.recordBreakActivity(userProfile.id, activity.id, category, intensity);

    return {
      activity,
      recommendedTime: new Date(),
      basedOn: { cognitiveLoad: currentState.cognitiveLoad || 'medium', preferredSensoryChannel: category }
    };
  }

  getDefaultBreakActivity() {
    return this.getBreakRecommendation({});
  }

  getAlternativeActivities(selectedActivity, category, intensity) {
    const list = (this.breakActivities[category] && this.breakActivities[category][intensity]) || [];
    return list.filter(a => a.id !== (selectedActivity && selectedActivity.id)).slice(0, 2);
  }

  recordBreakActivity(userId, activityId, category, intensity) {
    if (!userId) return;
    if (!this.userBreakHistory.has(userId)) this.userBreakHistory.set(userId, []);
    const arr = this.userBreakHistory.get(userId);
    arr.unshift({ activityId, category, intensity, timestamp: new Date() });
    if (arr.length > 10) arr.pop();
  }

  recommendScheduleAdjustment(userProfile = {}, performanceData = {}) {
    // Simple heuristic-based adjustments
    const lapses = performanceData.attentionLapses || 0;
    if (lapses > 5) return { adjustment: 'increase_frequency', breakFrequencyChange: -10 };
    if (lapses > 2) return { adjustment: 'moderate_increase', breakFrequencyChange: -5 };
    return { adjustment: 'none' };
  }

  trackBreakEffectiveness(userId, activityId, feedback = {}) {
    if (!userId || !activityId) return false;
    if (!this.breakEffectiveness.has(activityId)) this.breakEffectiveness.set(activityId, []);
    this.breakEffectiveness.get(activityId).push(Object.assign({ timestamp: new Date() }, feedback));
    return true;
  }
}

module.exports = SensoryBreakSystem;