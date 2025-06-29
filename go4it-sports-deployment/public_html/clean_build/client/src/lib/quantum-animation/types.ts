// Type definitions for the Quantum Animation Engine
// Version 5.0.1 - 256-bit Quantum HDR Pipeline

export interface AnimationMetric {
  id: string;
  name: string;
  unit: string;
  precision: number;
}

export interface AnimationAsset {
  id: string;
  name: string;
  path: string;
  type: 'video' | 'html' | 'json' | 'model' | string;
}

export interface AnimationPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  status: string;
  version: string;
  frameRate: number;
  duration: number;
  resolution: string;
  fileSize: number;
  lastModified: string;
  dependencies: string[];
  metrics: AnimationMetric[];
  assets: AnimationAsset[];
}

export interface RenderingEngine {
  id: string;
  name: string;
  description: string;
  version: string;
  capabilities: string[];
  performance: number;
  quality: number;
  compatibility: number;
}

export interface MotionCaptureSystem {
  id: string;
  name: string;
  description: string;
  formats: string[];
  precision: string;
  latency: string;
  integration: string[];
}

export interface MotionData {
  id: string;
  version: string;
  frameRate: number;
  frames: number;
  metrics: AnimationMetric[];
  keyframes: any[];
  motionPath: any[];
}

export interface RenderingOptions {
  quality: number;
  performance: number;
  motionBlur: boolean;
  temporalAA: boolean;
  realTimeShadows: boolean;
}

export interface MotionCaptureOptions {
  frameRate: number;
  athleteType: string;
  athleteHeight: number;
  athleteWeight: number;
  skeletalTracking: boolean;
  facialTracking: boolean;
  fingerTracking: boolean;
  physicsSimulation: boolean;
}

export interface AIEnhancementOptions {
  target: string;
  model: string;
  quality: number;
  detailLevel: number;
  processingSpeed: number;
  outputFormat: string;
  features: {
    motionSmoothing: boolean;
    detailEnhancement: boolean;
    realisticPhysics: boolean;
    styleTransfer: boolean;
    noiseReduction: boolean;
  }
}