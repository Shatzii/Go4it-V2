// Quantum Animation Engine - Modular Export
// Version 5.0.1 - 256-bit Quantum HDR Pipeline with Neural Rendering

// Export the main components
export { default as AdvancedAnimationStudio } from '@/components/admin/AdvancedAnimationStudio';

// Export animation presets
export { 
  animationPresets,
  renderingEngines,
  motionCaptureSystems 
} from './data';

// Export utilities
export * from './utils';

// Export types
export * from './types';