/**
 * Star Path Module
 * 
 * This module contains all the components, hooks, and services for the Star Path feature.
 * The Star Path is a progression system that tracks an athlete's development journey
 * through various levels of achievement and skill mastery.
 */

// Export all hooks
export * from './hooks';

// Export all services
export * from './services';

// Export all components
export * from './components';

// Export types
export * from './types';

// Define Star Path Levels
export enum StarLevel {
  RISING_PROSPECT = 1,  // Level 1
  EMERGING_TALENT = 2,  // Level 2
  STANDOUT_PERFORMER = 3, // Level 3
  ELITE_PROSPECT = 4,   // Level 4
  FIVE_STAR_ATHLETE = 5 // Level 5
}

// Map level number to name
export const starLevelNames = {
  [StarLevel.RISING_PROSPECT]: 'Rising Prospect',
  [StarLevel.EMERGING_TALENT]: 'Emerging Talent',
  [StarLevel.STANDOUT_PERFORMER]: 'Standout Performer',
  [StarLevel.ELITE_PROSPECT]: 'Elite Prospect',
  [StarLevel.FIVE_STAR_ATHLETE]: 'Five-Star Athlete'
};