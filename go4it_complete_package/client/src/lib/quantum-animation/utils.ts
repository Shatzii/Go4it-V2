// Utility functions for the Quantum Animation Engine
// Version 5.0.1 - 256-bit Quantum HDR Pipeline

import { AnimationPreset, RenderingEngine, MotionCaptureSystem, AnimationMetric } from './types';
import { animationPresets, renderingEngines, motionCaptureSystems } from './data';

/**
 * Get an animation preset by its ID
 */
export function getPresetById(presetId: string): AnimationPreset | undefined {
  return animationPresets.find(preset => preset.id === presetId);
}

/**
 * Get a rendering engine by its ID
 */
export function getRenderingEngineById(engineId: string): RenderingEngine | undefined {
  return renderingEngines.find(engine => engine.id === engineId);
}

/**
 * Get a motion capture system by its ID
 */
export function getMotionCaptureSystemById(systemId: string): MotionCaptureSystem | undefined {
  return motionCaptureSystems.find(system => system.id === systemId);
}

/**
 * Filter animation presets by category
 */
export function filterPresetsByCategory(category: string): AnimationPreset[] {
  if (category === 'all') return animationPresets;
  return animationPresets.filter(preset => preset.category === category);
}

/**
 * Search for animation presets by name or description
 */
export function searchPresets(searchTerm: string): AnimationPreset[] {
  if (!searchTerm) return animationPresets;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return animationPresets.filter(preset => 
    preset.name.toLowerCase().includes(lowerSearchTerm) || 
    preset.description.toLowerCase().includes(lowerSearchTerm)
  );
}

/**
 * Calculate the total number of frames for an animation preset
 */
export function calculateTotalFrames(preset: AnimationPreset): number {
  return Math.round(preset.duration * preset.frameRate);
}

/**
 * Generate motion JSON data for an animation preset
 */
export function generateMotionJSON(preset: AnimationPreset): string {
  const totalFrames = calculateTotalFrames(preset);
  
  return JSON.stringify({
    id: preset.id,
    version: preset.version,
    frameRate: preset.frameRate,
    frames: totalFrames,
    metrics: preset.metrics,
    keyframes: [],
    motionPath: []
  }, null, 2);
}

/**
 * Format file size in KB, MB, or GB
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  else return (bytes / 1073741824).toFixed(1) + ' GB';
}

/**
 * Format date to localized string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

/**
 * Generate a unique ID for a new animation
 */
export function generateAnimationId(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20);
  const timestamp = Date.now().toString(36);
  return `${base}_${timestamp}`;
}

/**
 * Get the best rendering engine for the current environment
 */
export function getBestRenderingEngine(): RenderingEngine {
  // Check if we're in a mobile environment
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check for WebGL2 support
  const hasWebGL2 = !!document.createElement('canvas').getContext('webgl2');
  
  // Default to the most advanced engine
  if (!isMobile && hasWebGL2 && window.navigator.hardwareConcurrency >= 4) {
    return renderingEngines.find(engine => engine.id === 'quantum_hdr') || renderingEngines[0];
  }
  
  // For mobile devices, use the mobile-optimized engine
  if (isMobile) {
    return renderingEngines.find(engine => engine.id === 'mobile_hd') || renderingEngines[0];
  }
  
  // For lower-end devices, use the HTML5 engine
  return renderingEngines.find(engine => engine.id === 'html5_motion') || renderingEngines[0];
}

/**
 * Extract metrics from animation data and format them for display
 */
export function formatMetrics(metrics: AnimationMetric[], values: Record<string, number>): string[] {
  return metrics.map(metric => {
    const value = values[metric.id] !== undefined ? values[metric.id] : 0;
    const formattedValue = metric.unit 
      ? `${value.toFixed(metric.precision)} ${metric.unit}`
      : value.toFixed(metric.precision);
      
    return `${metric.name}: ${formattedValue}`;
  });
}