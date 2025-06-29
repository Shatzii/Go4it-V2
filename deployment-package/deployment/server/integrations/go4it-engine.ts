/**
 * go4it-engine.ts
 * Go4It Engine Integration Module
 * Version: 2.0.0
 * 
 * This integration module enables seamless communication between the Go4It Engine 
 * and the Go4It Sports platform, connecting all critical features.
 */

import axios, { AxiosInstance } from 'axios';
import jwt from 'jsonwebtoken';

// Type definitions for better code completion
export type SubscriptionTier = 'scout' | 'mvp' | 'allStar';
export type ProcessingType = 'sync' | 'async';
export type StarPathAccessLevel = 'basic' | 'standard' | 'premium';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface FeatureConfig {
  endpoint: string;
  [key: string]: any;
}

export interface GarAnalysisConfig extends FeatureConfig {
  responseFormat: 'json';
  processingType: ProcessingType;
  webhookEnabled: boolean;
  cacheTime: number;
}

export interface StarPathConfig extends FeatureConfig {
  environments: string[];
  xpSystem: boolean;
  badgeSystem: boolean;
  missionSystem: boolean;
  achievementTracking: boolean;
  visualizationApi: string;
}

export interface MediaProcessingConfig extends FeatureConfig {
  supportedFormats: string[];
  maxFileSize: number;
  highlightGeneration: boolean;
  performanceExtraction: boolean;
  bodyTracking: boolean;
  sportSpecificMetrics: boolean;
}

export interface SubscriptionConfig {
  garAnalysisLimit: number | 'unlimited';
  videoLimit: number | 'unlimited';
  starPathAccess: StarPathAccessLevel;
  mediaProcessingOptions: string[];
  academicFeatures: string[];
  messagingFeatures: string[];
}

export interface SecurityConfig {
  jwtSecret?: string;
  apiKey?: string;
  rateLimiting: boolean;
  ipWhitelist: string[];
  encryptPayloads: boolean;
}

export interface Go4ItEngineConfig {
  apiEndpoint: string;
  apiVersion: string;
  authType: 'jwt' | 'apiKey';
  retryAttempts: number;
  timeout: number;
  featureConnections: {
    garAnalysis: GarAnalysisConfig;
    starPath: StarPathConfig;
    mediaProcessing: MediaProcessingConfig;
    academics: FeatureConfig;
    combineEvents: FeatureConfig;
    recommendations: FeatureConfig;
    messaging: FeatureConfig;
    aiCoaching: FeatureConfig;
  };
  subscriptionTiers: {
    scout: SubscriptionConfig;
    mvp: SubscriptionConfig;
    allStar: SubscriptionConfig;
  };
  security: SecurityConfig;
  performance: {
    caching: boolean;
    compressionEnabled: boolean;
    batchProcessing: boolean;
    workerThreads: boolean;
    maxConcurrentJobs: number;
  };
  extensions: {
    pluginSupport: boolean;
    customMetricsEnabled: boolean;
    webhookRegistration: boolean;
    eventBroadcasting: boolean;
  };
  monitoring: {
    errorTracking: boolean;
    performanceMetrics: boolean;
    usageStatistics: boolean;
    alertingEnabled: boolean;
    logLevel: LogLevel;
  };
}

// Default configuration
export const GO4IT_ENGINE_CONFIG: Go4ItEngineConfig = {
  apiEndpoint: process.env.GO4IT_ENGINE_API || 'http://localhost:3001/api',
  apiVersion: 'v2',
  authType: 'jwt',
  retryAttempts: 3,
  timeout: 30000, // 30 seconds
  
  featureConnections: {
    garAnalysis: {
      endpoint: '/analysis/gar',
      responseFormat: 'json',
      processingType: 'async',
      webhookEnabled: true,
      cacheTime: 3600 // 1 hour cache
    },
    
    starPath: {
      endpoint: '/progression/starpath',
      environments: ['field', 'weight_room', 'locker_room'],
      xpSystem: true,
      badgeSystem: true,
      missionSystem: true,
      achievementTracking: true,
      visualizationApi: '/progression/visualize'
    },
    
    mediaProcessing: {
      endpoint: '/media/process',
      supportedFormats: ['mp4', 'mov', 'avi', 'webm'],
      maxFileSize: 2048, // MB
      highlightGeneration: true,
      performanceExtraction: true,
      bodyTracking: true,
      sportSpecificMetrics: true
    },
    
    academics: {
      endpoint: '/academics',
      gpaTracking: true,
      ncaaEligibility: true,
      courseCatalog: true,
      attendanceMonitoring: true,
      testScoreTracking: true
    },
    
    combineEvents: {
      endpoint: '/events/combine',
      registrationProcessing: true,
      resultTracking: true,
      comparativeAnalysis: true,
      recruitingInsights: true
    },
    
    recommendations: {
      endpoint: '/recommendations',
      trainingPlan: true,
      skillDevelopment: true,
      collegeMatching: true,
      performanceImprovement: true
    },
    
    messaging: {
      endpoint: '/messaging',
      sentimentAnalysis: true,
      recruitingDetection: true,
      complianceChecking: true,
      prioritization: true
    },
    
    aiCoaching: {
      endpoint: '/coaching',
      personalizedFeedback: true,
      techniqueAnalysis: true,
      adaptiveDifficulty: true,
      performanceForecast: true
    }
  },
  
  subscriptionTiers: {
    scout: {
      garAnalysisLimit: 1,
      videoLimit: 1,
      starPathAccess: 'basic',
      mediaProcessingOptions: ['basic_analysis'],
      academicFeatures: ['gpa_tracking'],
      messagingFeatures: ['basic']
    },
    mvp: {
      garAnalysisLimit: 10,
      videoLimit: 5,
      starPathAccess: 'standard',
      mediaProcessingOptions: ['basic_analysis', 'highlight_generation'],
      academicFeatures: ['gpa_tracking', 'ncaa_eligibility'],
      messagingFeatures: ['basic', 'priority']
    },
    allStar: {
      garAnalysisLimit: 'unlimited',
      videoLimit: 'unlimited',
      starPathAccess: 'premium',
      mediaProcessingOptions: ['all'],
      academicFeatures: ['all'],
      messagingFeatures: ['all']
    }
  },
  
  security: {
    jwtSecret: process.env.GO4IT_ENGINE_JWT_SECRET,
    apiKey: process.env.GO4IT_ENGINE_API_KEY,
    rateLimiting: true,
    ipWhitelist: process.env.GO4IT_ENGINE_IP_WHITELIST?.split(',') || [],
    encryptPayloads: true
  },
  
  performance: {
    caching: true,
    compressionEnabled: true,
    batchProcessing: true,
    workerThreads: true,
    maxConcurrentJobs: 10
  },
  
  extensions: {
    pluginSupport: true,
    customMetricsEnabled: true,
    webhookRegistration: true,
    eventBroadcasting: true
  },
  
  monitoring: {
    errorTracking: true,
    performanceMetrics: true,
    usageStatistics: true,
    alertingEnabled: true,
    logLevel: 'info'
  }
};

/**
 * Validate API connection to Go4It Engine
 */
async function validateApiConnection(config: Go4ItEngineConfig): Promise<boolean> {
  try {
    const response = await axios.get(`${config.apiEndpoint}/health`, {
      timeout: config.timeout,
      headers: getAuthHeaders(config)
    });
    return response.status === 200;
  } catch (error) {
    console.error('Failed to connect to Go4It Engine:', error);
    return false;
  }
}

/**
 * Get authentication headers based on config
 */
function getAuthHeaders(config: Go4ItEngineConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Version': config.apiVersion
  };

  if (config.authType === 'jwt' && config.security.jwtSecret) {
    const token = jwt.sign({ timestamp: Date.now() }, config.security.jwtSecret as string, { expiresIn: '1h' });
    headers['Authorization'] = `Bearer ${token}`;
  } else if (config.authType === 'apiKey' && config.security.apiKey) {
    headers['X-API-Key'] = config.security.apiKey;
  }

  return headers;
}

/**
 * Create HTTP client with interceptors for auth, retries, etc.
 */
function createHttpClient(config: Go4ItEngineConfig): AxiosInstance {
  const client = axios.create({
    baseURL: config.apiEndpoint,
    timeout: config.timeout,
    headers: getAuthHeaders(config)
  });

  // Request interceptor
  client.interceptors.request.use((reqConfig) => {
    // Refresh auth headers if needed
    reqConfig.headers = { ...reqConfig.headers, ...getAuthHeaders(config) };
    return reqConfig;
  });

  // Response interceptor for retries
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        // Refresh token logic would go here if needed
        return client(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export interface Go4ItEngineClient {
  config: Go4ItEngineConfig;
  httpClient: AxiosInstance;
  analyze: (data: any, options?: any) => Promise<any>;
  processMedia: (mediaData: any, options?: any) => Promise<any>;
  updateStarPath: (userId: number, progressData: any) => Promise<any>;
  getAcademics: (userId: number) => Promise<any>;
  getRecommendations: (userId: number, context?: any) => Promise<any>;
  getCoachingFeedback: (userId: number, performanceData: any) => Promise<any>;
  validateSubscriptionAccess: (userId: number, feature: string) => Promise<boolean>;
  registerWebhook: (event: string, callbackUrl: string) => Promise<any>;
  extendWithPlugin: (pluginId: string, pluginConfig: any) => Promise<any>;
}

/**
 * Initialize the Go4It Engine integration
 */
export async function initializeGo4ItEngine(options: Partial<Go4ItEngineConfig> = {}): Promise<Go4ItEngineClient> {
  const config = { ...GO4IT_ENGINE_CONFIG, ...options } as Go4ItEngineConfig;
  
  // Validate API connection
  const isConnected = await validateApiConnection(config);
  if (!isConnected) {
    console.warn('Warning: Unable to connect to Go4It Engine. Some features may not work.');
  }
  
  // Create HTTP client
  const httpClient = createHttpClient(config);
  
  // Feature module implementations
  const garAnalysis = {
    process: async (data: any, options: any = {}) => {
      const endpoint = `${config.featureConnections.garAnalysis.endpoint}`;
      const response = await httpClient.post(endpoint, {
        data,
        options: {
          ...options,
          processingType: config.featureConnections.garAnalysis.processingType
        }
      });
      return response.data;
    }
  };
  
  const mediaProcessing = {
    process: async (mediaData: any, options: any = {}) => {
      const endpoint = `${config.featureConnections.mediaProcessing.endpoint}`;
      const formData = new FormData();
      
      if (mediaData.file) {
        formData.append('file', mediaData.file);
      } else if (mediaData.url) {
        formData.append('url', mediaData.url);
      }
      
      // Add options to formData
      Object.keys(options).forEach(key => {
        formData.append(key, options[key].toString());
      });
      
      const response = await httpClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    }
  };
  
  const starPath = {
    update: async (userId: number, progressData: any) => {
      const endpoint = `${config.featureConnections.starPath.endpoint}/${userId}`;
      const response = await httpClient.post(endpoint, progressData);
      return response.data;
    },
    
    getVisualization: async (userId: number, options: any = {}) => {
      const endpoint = `${config.featureConnections.starPath.visualizationApi}/${userId}`;
      const response = await httpClient.get(endpoint, { params: options });
      return response.data;
    }
  };
  
  const academics = {
    getUserData: async (userId: number) => {
      const endpoint = `${config.featureConnections.academics.endpoint}/${userId}`;
      const response = await httpClient.get(endpoint);
      return response.data;
    }
  };
  
  const recommendations = {
    get: async (userId: number, context: any = {}) => {
      const endpoint = `${config.featureConnections.recommendations.endpoint}/${userId}`;
      const response = await httpClient.get(endpoint, { params: context });
      return response.data;
    }
  };
  
  const aiCoaching = {
    getFeedback: async (userId: number, performanceData: any) => {
      const endpoint = `${config.featureConnections.aiCoaching.endpoint}/${userId}/feedback`;
      const response = await httpClient.post(endpoint, performanceData);
      return response.data;
    }
  };
  
  // Webhook system
  const webhooks = {
    register: async (event: string, callbackUrl: string) => {
      const response = await httpClient.post('/webhooks/register', {
        event,
        callbackUrl
      });
      return response.data;
    },
    
    unregister: async (webhookId: string) => {
      const response = await httpClient.delete(`/webhooks/${webhookId}`);
      return response.data;
    }
  };
  
  // Access validation
  const validateAccess = async (userId: number, feature: string): Promise<boolean> => {
    try {
      const response = await httpClient.post('/access/validate', {
        userId,
        feature
      });
      return response.data.hasAccess;
    } catch (error) {
      console.error('Failed to validate access:', error);
      return false;
    }
  };
  
  // Plugin system
  const registerPlugin = async (pluginId: string, pluginConfig: any) => {
    if (!config.extensions.pluginSupport) {
      throw new Error('Plugin support is not enabled in configuration');
    }
    
    const response = await httpClient.post('/plugins/register', {
      pluginId,
      config: pluginConfig
    });
    
    return response.data;
  };
  
  // Return fully configured client
  return {
    config,
    httpClient,
    
    // Main methods for platform integration
    analyze: garAnalysis.process,
    processMedia: mediaProcessing.process,
    updateStarPath: starPath.update,
    getAcademics: academics.getUserData,
    getRecommendations: recommendations.get,
    getCoachingFeedback: aiCoaching.getFeedback,
    
    // Utility methods
    validateSubscriptionAccess: validateAccess,
    registerWebhook: webhooks.register,
    extendWithPlugin: registerPlugin
  };
}

// Export the module
export default {
  initializeGo4ItEngine,
  GO4IT_ENGINE_CONFIG
};
