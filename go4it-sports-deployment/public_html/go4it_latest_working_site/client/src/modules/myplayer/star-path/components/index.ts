/**
 * Star Path Components Exports
 * 
 * This file exports all UI components in the Star Path module
 * for easier importing throughout the application.
 */

export * from './StarPathCard';
export * from './StarPathFlow';
export * from './StarPathVisualizer';
export * from './AchievementDisplay';
export * from './RewardDisplay';

// Export default components explicitly for direct imports
import StarPathCardComponent from './StarPathCard';
import StarPathFlowComponent from './StarPathFlow';
import { StarPathVisualizer } from './StarPathVisualizer';
import AchievementDisplayComponent from './AchievementDisplay';
import RewardDisplayComponent from './RewardDisplay';

export { 
  StarPathCardComponent as StarPathCard,
  StarPathFlowComponent as StarPathFlow,
  StarPathVisualizer,
  AchievementDisplayComponent as AchievementDisplay,
  RewardDisplayComponent as RewardDisplay
};