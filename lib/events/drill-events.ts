/**
 * Drill Library Event System
 * 
 * Enables decoupled coordination between pipeline stages:
 * Upload → Whisper → AI Tagging → Embeddings → Approval → Publishing
 * 
 * Event Types:
 * 1. media.uploaded - New media asset uploaded to R2
 * 2. media.transcribed - Whisper transcription completed
 * 3. drill.tagged - AI tagging completed (local_fast_llm)
 * 4. drill.embedded - Vector embeddings generated (local_embed_model)
 * 5. drill.approved - Admin/coach approved drill for publication
 * 6. drill.published - Drill made public in library
 * 7. drill.assigned - Drill assigned to athlete (RED zone)
 * 8. drill.completed - Athlete completed drill (RED zone)
 * 
 * All RED zone events (assignments, completions) stay on self-hosted infrastructure.
 */

import { EventEmitter } from 'events';
import { MediaAsset, Drill, AthleteDrillAssignment } from './drill-library-schema';

// ============================================
// Event Payload Interfaces
// ============================================

export interface MediaUploadedEvent {
  mediaAssetId: string;
  filename: string;
  uploadType: 'library' | 'athlete_submission' | 'coach_demo';
  uploadedBy: string;
  zone: 'RED' | 'YELLOW' | 'GREEN';
  athleteId?: string; // Present if RED zone
  storageUrl: string;
  fileType: string;
  mimeType: string;
  duration?: number;
  timestamp: Date;
}

export interface MediaTranscribedEvent {
  mediaAssetId: string;
  transcript: string;
  language: string;
  confidence: number;
  whisperModel: string;
  processingTime: number; // ms
  wordCount: number;
  timestamp: Date;
}

export interface DrillTaggedEvent {
  drillId: string;
  mediaAssetId?: string;
  tags: {
    aiTags: string[];
    sport: string;
    category: string;
    skillLevel: string;
    equipment: string[];
    garComponent?: string;
  };
  aiConfidence: number;
  model: string; // local_fast_llm version
  processingTime: number; // ms
  timestamp: Date;
}

export interface DrillEmbeddedEvent {
  drillId: string;
  mediaAssetId?: string;
  embeddingModel: string; // local_embed_model version
  dimensions: number;
  processingTime: number; // ms
  timestamp: Date;
}

export interface DrillApprovedEvent {
  drillId: string;
  approvedBy: string; // userId
  approverRole: string; // coach, admin
  previousStatus: string;
  notes?: string;
  timestamp: Date;
}

export interface DrillPublishedEvent {
  drillId: string;
  title: string;
  sport: string;
  category: string;
  skillLevel: string;
  isPublic: boolean;
  isFeatured: boolean;
  publishedBy: string;
  timestamp: Date;
}

export interface DrillAssignedEvent {
  assignmentId: string;
  athleteId: string; // RED zone - athlete PII
  drillId: string;
  assignedBy: string; // Coach userId
  assignmentType: 'practice' | 'homework' | 'assessment' | 'remedial';
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customParameters?: {
    sets?: number;
    reps?: string;
    duration?: number;
    targetMetrics?: any;
  };
  timestamp: Date;
}

export interface DrillCompletedEvent {
  assignmentId: string;
  athleteId: string; // RED zone - athlete PII
  drillId: string;
  performanceData?: {
    timeSpent: number;
    repsCompleted?: number;
    metrics?: any;
    selfRating?: number;
  };
  videoSubmissionId?: string;
  completedAt: Date;
  timestamp: Date;
}

export interface DrillRatedEvent {
  ratingId: string;
  drillId: string;
  userId: string;
  userRole: 'athlete' | 'coach' | 'parent';
  ratings: {
    overall: number;
    difficulty?: number;
    effectiveness?: number;
    instructionClarity?: number;
    funFactor?: number;
  };
  comment?: string;
  isAnonymized: boolean;
  timestamp: Date;
}

export interface WorkoutAssignedEvent {
  assignmentId: string;
  athleteId: string; // RED zone
  workoutId: string;
  assignedBy: string;
  drillCount: number;
  estimatedDuration: number; // minutes
  dueDate?: Date;
  timestamp: Date;
}

// ============================================
// Event Type Definitions
// ============================================

export type DrillLibraryEvents = {
  'media.uploaded': (event: MediaUploadedEvent) => void;
  'media.transcribed': (event: MediaTranscribedEvent) => void;
  'drill.tagged': (event: DrillTaggedEvent) => void;
  'drill.embedded': (event: DrillEmbeddedEvent) => void;
  'drill.approved': (event: DrillApprovedEvent) => void;
  'drill.published': (event: DrillPublishedEvent) => void;
  'drill.assigned': (event: DrillAssignedEvent) => void;
  'drill.completed': (event: DrillCompletedEvent) => void;
  'drill.rated': (event: DrillRatedEvent) => void;
  'workout.assigned': (event: WorkoutAssignedEvent) => void;
};

// ============================================
// Typed Event Emitter
// ============================================

export class DrillEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50); // Support many concurrent listeners
  }

  // Type-safe emit methods
  emitMediaUploaded(event: MediaUploadedEvent): boolean {
    console.log(`[DrillEvents] Media uploaded: ${event.filename} (${event.zone} zone) by ${event.uploadedBy}`);
    return this.emit('media.uploaded', event);
  }

  emitMediaTranscribed(event: MediaTranscribedEvent): boolean {
    console.log(`[DrillEvents] Media transcribed: ${event.mediaAssetId} (${event.wordCount} words, ${event.confidence * 100}% confidence)`);
    return this.emit('media.transcribed', event);
  }

  emitDrillTagged(event: DrillTaggedEvent): boolean {
    console.log(`[DrillEvents] Drill tagged: ${event.drillId} - Sport: ${event.tags.sport}, Category: ${event.tags.category}`);
    return this.emit('drill.tagged', event);
  }

  emitDrillEmbedded(event: DrillEmbeddedEvent): boolean {
    console.log(`[DrillEvents] Drill embedded: ${event.drillId} (${event.dimensions}D, ${event.processingTime}ms)`);
    return this.emit('drill.embedded', event);
  }

  emitDrillApproved(event: DrillApprovedEvent): boolean {
    console.log(`[DrillEvents] Drill approved: ${event.drillId} by ${event.approverRole} ${event.approvedBy}`);
    return this.emit('drill.approved', event);
  }

  emitDrillPublished(event: DrillPublishedEvent): boolean {
    console.log(`[DrillEvents] Drill published: "${event.title}" (${event.sport}/${event.category}/${event.skillLevel})`);
    return this.emit('drill.published', event);
  }

  emitDrillAssigned(event: DrillAssignedEvent): boolean {
    console.log(`[DrillEvents] 🔴 RED ZONE - Drill assigned: ${event.drillId} to athlete ${event.athleteId.substring(0, 8)}... by coach ${event.assignedBy}`);
    return this.emit('drill.assigned', event);
  }

  emitDrillCompleted(event: DrillCompletedEvent): boolean {
    console.log(`[DrillEvents] 🔴 RED ZONE - Drill completed: ${event.drillId} by athlete ${event.athleteId.substring(0, 8)}...`);
    return this.emit('drill.completed', event);
  }

  emitDrillRated(event: DrillRatedEvent): boolean {
    console.log(`[DrillEvents] Drill rated: ${event.drillId} - ${event.ratings.overall}/5 stars by ${event.userRole}`);
    return this.emit('drill.rated', event);
  }

  emitWorkoutAssigned(event: WorkoutAssignedEvent): boolean {
    console.log(`[DrillEvents] 🔴 RED ZONE - Workout assigned: ${event.workoutId} (${event.drillCount} drills) to athlete ${event.athleteId.substring(0, 8)}...`);
    return this.emit('workout.assigned', event);
  }

  // Type-safe listener methods
  onMediaUploaded(listener: (event: MediaUploadedEvent) => void): this {
    return this.on('media.uploaded', listener);
  }

  onMediaTranscribed(listener: (event: MediaTranscribedEvent) => void): this {
    return this.on('media.transcribed', listener);
  }

  onDrillTagged(listener: (event: DrillTaggedEvent) => void): this {
    return this.on('drill.tagged', listener);
  }

  onDrillEmbedded(listener: (event: DrillEmbeddedEvent) => void): this {
    return this.on('drill.embedded', listener);
  }

  onDrillApproved(listener: (event: DrillApprovedEvent) => void): this {
    return this.on('drill.approved', listener);
  }

  onDrillPublished(listener: (event: DrillPublishedEvent) => void): this {
    return this.on('drill.published', listener);
  }

  onDrillAssigned(listener: (event: DrillAssignedEvent) => void): this {
    return this.on('drill.assigned', listener);
  }

  onDrillCompleted(listener: (event: DrillCompletedEvent) => void): this {
    return this.on('drill.completed', listener);
  }

  onDrillRated(listener: (event: DrillRatedEvent) => void): this {
    return this.on('drill.rated', listener);
  }

  onWorkoutAssigned(listener: (event: WorkoutAssignedEvent) => void): this {
    return this.on('workout.assigned', listener);
  }
}

// ============================================
// Global Event Emitter Instance
// ============================================

let globalDrillEvents: DrillEventEmitter | null = null;

export function getDrillEventEmitter(): DrillEventEmitter {
  if (!globalDrillEvents) {
    globalDrillEvents = new DrillEventEmitter();
    console.log('[DrillEvents] Global event emitter initialized');
  }
  return globalDrillEvents;
}

// ============================================
// Event Statistics & Monitoring
// ============================================

export interface EventStats {
  eventType: keyof DrillLibraryEvents;
  count: number;
  lastEmitted?: Date;
  avgProcessingTime?: number; // ms
}

export class EventMonitor {
  private stats: Map<keyof DrillLibraryEvents, EventStats> = new Map();
  private eventEmitter: DrillEventEmitter;

  constructor(eventEmitter: DrillEventEmitter) {
    this.eventEmitter = eventEmitter;
    this.setupMonitoring();
  }

  private setupMonitoring() {
    const eventTypes: (keyof DrillLibraryEvents)[] = [
      'media.uploaded',
      'media.transcribed',
      'drill.tagged',
      'drill.embedded',
      'drill.approved',
      'drill.published',
      'drill.assigned',
      'drill.completed',
      'drill.rated',
      'workout.assigned',
    ];

    eventTypes.forEach(eventType => {
      this.eventEmitter.on(eventType, () => {
        const stat = this.stats.get(eventType) || {
          eventType,
          count: 0,
        };
        stat.count++;
        stat.lastEmitted = new Date();
        this.stats.set(eventType, stat);
      });
    });
  }

  getStats(): EventStats[] {
    return Array.from(this.stats.values());
  }

  getStatsByType(eventType: keyof DrillLibraryEvents): EventStats | undefined {
    return this.stats.get(eventType);
  }

  getTotalEvents(): number {
    return Array.from(this.stats.values()).reduce((sum, stat) => sum + stat.count, 0);
  }

  reset() {
    this.stats.clear();
  }
}

// ============================================
// Event Pipeline Helpers
// ============================================

/**
 * Helper to track event processing through pipeline stages
 */
export class PipelineTracker {
  private pipeline: Map<string, PipelineStage[]> = new Map(); // mediaAssetId -> stages

  recordStage(mediaAssetId: string, stage: PipelineStage) {
    const stages = this.pipeline.get(mediaAssetId) || [];
    stages.push(stage);
    this.pipeline.set(mediaAssetId, stages);
  }

  getPipeline(mediaAssetId: string): PipelineStage[] {
    return this.pipeline.get(mediaAssetId) || [];
  }

  getStageStatus(mediaAssetId: string, stageName: string): PipelineStage | undefined {
    const stages = this.pipeline.get(mediaAssetId) || [];
    return stages.find(s => s.stage === stageName);
  }

  isPipelineComplete(mediaAssetId: string): boolean {
    const stages = this.pipeline.get(mediaAssetId) || [];
    const requiredStages = ['uploaded', 'transcribed', 'tagged', 'embedded', 'approved', 'published'];
    return requiredStages.every(required => 
      stages.some(s => s.stage === required && s.status === 'completed')
    );
  }

  getTotalProcessingTime(mediaAssetId: string): number {
    const stages = this.pipeline.get(mediaAssetId) || [];
    return stages.reduce((sum, s) => sum + (s.processingTime || 0), 0);
  }
}

export interface PipelineStage {
  stage: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  processingTime?: number; // ms
  error?: string;
  metadata?: any;
}

// ============================================
// Webhook Integration (for external systems)
// ============================================

export interface WebhookConfig {
  url: string;
  events: (keyof DrillLibraryEvents)[];
  headers?: Record<string, string>;
  retryAttempts?: number;
  zone?: 'RED' | 'YELLOW' | 'GREEN'; // Only send events matching this zone
}

export class WebhookManager {
  private webhooks: Map<string, WebhookConfig> = new Map();
  private eventEmitter: DrillEventEmitter;

  constructor(eventEmitter: DrillEventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  registerWebhook(id: string, config: WebhookConfig) {
    this.webhooks.set(id, config);
    
    // Subscribe to specified events
    config.events.forEach(eventType => {
      this.eventEmitter.on(eventType, async (event: any) => {
        // Zone filtering - don't send RED zone events externally
        if (config.zone && event.zone !== config.zone) {
          console.log(`[Webhook] Skipping ${eventType} for ${id} - zone mismatch (${event.zone} !== ${config.zone})`);
          return;
        }

        await this.sendWebhook(id, eventType, event, config);
      });
    });

    console.log(`[Webhook] Registered webhook ${id} for events: ${config.events.join(', ')}`);
  }

  private async sendWebhook(
    webhookId: string,
    eventType: string,
    event: any,
    config: WebhookConfig
  ) {
    const maxRetries = config.retryAttempts || 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        console.log(`[Webhook] Sending ${eventType} to ${webhookId} (attempt ${attempt + 1}/${maxRetries})`);
        
        const response = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Event-Type': eventType,
            'X-Webhook-ID': webhookId,
            ...config.headers,
          },
          body: JSON.stringify({
            event: eventType,
            timestamp: new Date().toISOString(),
            data: event,
          }),
        });

        if (response.ok) {
          console.log(`[Webhook] Successfully sent ${eventType} to ${webhookId}`);
          return;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        attempt++;
        console.error(`[Webhook] Failed to send ${eventType} to ${webhookId} (attempt ${attempt}):`, error);
        
        if (attempt < maxRetries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    console.error(`[Webhook] Gave up sending ${eventType} to ${webhookId} after ${maxRetries} attempts`);
  }

  unregisterWebhook(id: string) {
    this.webhooks.delete(id);
    console.log(`[Webhook] Unregistered webhook ${id}`);
  }

  listWebhooks(): Array<{ id: string; config: WebhookConfig }> {
    return Array.from(this.webhooks.entries()).map(([id, config]) => ({ id, config }));
  }
}

// ============================================
// Export singleton instances
// ============================================

export const drillEvents = getDrillEventEmitter();
export const eventMonitor = new EventMonitor(drillEvents);
export const pipelineTracker = new PipelineTracker();
export const webhookManager = new WebhookManager(drillEvents);
