/**
 * Go4It Sports AI Engine Integration
 * 
 * This module serves as the bridge between the Go4It application and 
 * the future AI engine that will be hosted on a private VPS.
 * 
 * The AI engine will handle:
 * - Video analysis and action recognition
 * - GAR (Growth and Ability Rating) scoring
 * - Highlight reel generation
 * - Player comparisons
 * - Transfer portal analysis
 * - StarPath progression
 * 
 * This integration is designed to work with models hosted on HuggingFace
 * and served via a FastAPI server on Hetzner.
 */

// Core service interfaces
import { VideoAnalysisService } from './services/video-analysis-service';
import { GARScoreService } from './services/gar-score-service';
import { HighlightService } from './services/highlight-service';
import { RankingService } from './services/ranking-service';
import { StarPathService } from './services/starpath-service';

// AI Engine service implementations
import { TransferPortalAIService, transferPortalAIService } from './services/transfer-portal-ai-service';
import { BlogContentService, blogContentService } from './services/blog-content-service';
import { GARScoringAIService, garScoringAIService } from './services/gar-scoring-ai-service';
import { VideoAnalysisAIService, videoAnalysisAIService } from './services/video-analysis-ai-service';
import { HighlightGeneratorAIService, highlightGeneratorAIService } from './services/highlight-generator-ai-service';

// Export the main engine services (interfaces)
export {
  VideoAnalysisService,
  GARScoreService,
  HighlightService,
  RankingService,
  StarPathService
};

// Export AI engine service interfaces and implementations
export {
  TransferPortalAIService,
  transferPortalAIService,
  BlogContentService,
  blogContentService,
  GARScoringAIService,
  garScoringAIService,
  VideoAnalysisAIService,
  videoAnalysisAIService,
  HighlightGeneratorAIService,
  highlightGeneratorAIService
};

// Export configuration and common utilities
export * from './config';
export * from './utils';