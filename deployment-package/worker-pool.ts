/**
 * Go4It Engine - Worker Pool Implementation
 * 
 * This module provides a multi-threaded worker pool system for efficient
 * video processing and other CPU-intensive tasks.
 */

import { Worker } from 'worker_threads';
import { EventEmitter } from 'events';
import os from 'os';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define job types
export enum JobType {
  VIDEO_PROCESSING = 'video_processing',
  GAR_ANALYSIS = 'gar_analysis',
  HIGHLIGHT_GENERATION = 'highlight_generation',
  PERFORMANCE_EXTRACTION = 'performance_extraction'
}

// Define job status
export enum JobStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Job interface
export interface Job {
  id: string;
  type: JobType;
  data: any;
  status: JobStatus;
  progress: number;
  result?: any;
  error?: Error;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  priority: number;
  userId: number;
  subscriptionTier: string;
}

// Worker Pool Configuration
interface WorkerPoolConfig {
  maxWorkers?: number;
  taskTimeout?: number;
  workerIdleTimeout?: number;
  priorityLevels?: {
    [key: string]: number; // Map subscription tiers to priority levels
  };
}

/**
 * Worker Pool for managing and distributing CPU-intensive tasks
 */
export class WorkerPool extends EventEmitter {
  private workers: Array<{
    worker: Worker;
    busy: boolean;
    jobId?: string;
    lastActivity: Date;
  }> = [];
  private queue: Job[] = [];
  private activeJobs: Map<string, Job> = new Map();
  private maxWorkers: number;
  private taskTimeout: number;
  private workerIdleTimeout: number;
  private priorityLevels: { [key: string]: number };
  private isProcessing: boolean = false;

  /**
   * Create a new worker pool
   */
  constructor(config: WorkerPoolConfig = {}) {
    super();
    
    // Configure the worker pool
    this.maxWorkers = config.maxWorkers || Math.max(1, os.cpus().length - 1);
    this.taskTimeout = config.taskTimeout || 5 * 60 * 1000; // 5 minutes default timeout
    this.workerIdleTimeout = config.workerIdleTimeout || 60 * 1000; // 1 minute default idle timeout
    
    // Configure priority levels based on subscription tiers
    this.priorityLevels = config.priorityLevels || {
      'scout': 1, // Lowest priority
      'mvp': 2,   // Medium priority
      'allStar': 3 // Highest priority
    };
    
    // Initialize worker cleanup
    setInterval(() => this.cleanupIdleWorkers(), this.workerIdleTimeout);
    
    // Start processing queue
    setInterval(() => this.processQueue(), 1000);
    
    console.log(`Worker pool initialized with ${this.maxWorkers} max workers`);
  }

  /**
   * Schedule a job to be processed
   */
  public scheduleJob(type: JobType, data: any, userId: number, subscriptionTier: string): Job {
    const job: Job = {
      id: uuidv4(),
      type,
      data,
      status: JobStatus.QUEUED,
      progress: 0,
      createdAt: new Date(),
      priority: this.priorityLevels[subscriptionTier] || 1,
      userId,
      subscriptionTier
    };
    
    // Add job to queue, sorting by priority
    this.queue.push(job);
    this.sortQueue();
    
    // Emit event for tracking
    this.emit('job:queued', { jobId: job.id, type, userId });
    
    console.log(`Job ${job.id} (${type}) scheduled for processing with priority ${job.priority}`);
    
    // Trigger queue processing
    this.processQueue();
    
    return job;
  }

  /**
   * Get status of a specific job
   */
  public getJobStatus(jobId: string): Job | undefined {
    // Check active jobs
    if (this.activeJobs.has(jobId)) {
      return this.activeJobs.get(jobId);
    }
    
    // Check queued jobs
    const queuedJob = this.queue.find(job => job.id === jobId);
    if (queuedJob) {
      return queuedJob;
    }
    
    return undefined;
  }

  /**
   * Get all jobs for a specific user
   */
  public getUserJobs(userId: number): Job[] {
    const userJobs: Job[] = [];
    
    // Get active jobs
    this.activeJobs.forEach(job => {
      if (job.userId === userId) {
        userJobs.push(job);
      }
    });
    
    // Get queued jobs
    this.queue.forEach(job => {
      if (job.userId === userId) {
        userJobs.push(job);
      }
    });
    
    return userJobs;
  }

  /**
   * Cancel a job if it hasn't started processing yet
   */
  public cancelJob(jobId: string): boolean {
    const jobIndex = this.queue.findIndex(job => job.id === jobId);
    
    if (jobIndex >= 0) {
      const job = this.queue[jobIndex];
      this.queue.splice(jobIndex, 1);
      this.emit('job:cancelled', { jobId, userId: job.userId });
      return true;
    }
    
    return false;
  }

  /**
   * Update job progress
   */
  private updateJobProgress(jobId: string, progress: number, result?: any): void {
    const job = this.activeJobs.get(jobId);
    
    if (job) {
      job.progress = progress;
      if (result) {
        job.result = result;
      }
      
      this.emit('job:progress', { jobId, progress, userId: job.userId });
    }
  }

  /**
   * Process the job queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    
    try {
      // Sort queue by priority
      this.sortQueue();
      
      // Process jobs if workers are available
      while (this.queue.length > 0 && this.getAvailableWorkerCount() > 0) {
        const job = this.queue.shift();
        
        if (job) {
          await this.processJob(job);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process a specific job
   */
  private async processJob(job: Job): Promise<void> {
    // Update job status
    job.status = JobStatus.PROCESSING;
    job.startedAt = new Date();
    this.activeJobs.set(job.id, job);
    
    // Emit event for tracking
    this.emit('job:started', { jobId: job.id, type: job.type, userId: job.userId });
    
    // Get available worker
    const workerInfo = this.getAvailableWorker();
    
    if (!workerInfo) {
      // No workers available, put job back in queue
      this.queue.unshift(job);
      return;
    }
    
    // Assign job to worker
    workerInfo.busy = true;
    workerInfo.jobId = job.id;
    workerInfo.lastActivity = new Date();
    
    // Determine worker script based on job type
    const workerScript = this.getWorkerScriptForJobType(job.type);
    
    try {
      // Create worker
      workerInfo.worker = new Worker(workerScript, {
        workerData: {
          jobId: job.id,
          jobType: job.type,
          jobData: job.data
        }
      });
      
      // Set up message handling
      workerInfo.worker.on('message', (message) => {
        if (message.type === 'progress') {
          this.updateJobProgress(job.id, message.progress, message.result);
        } else if (message.type === 'complete') {
          this.completeJob(job.id, message.result);
          this.releaseWorker(workerInfo);
        }
      });
      
      // Set up error handling
      workerInfo.worker.on('error', (error) => {
        this.failJob(job.id, error);
        this.releaseWorker(workerInfo);
      });
      
      // Set up exit handling
      workerInfo.worker.on('exit', (code) => {
        if (code !== 0) {
          this.failJob(job.id, new Error(`Worker exited with code ${code}`));
        }
        this.releaseWorker(workerInfo);
      });
      
      // Set timeout for job
      setTimeout(() => {
        if (this.activeJobs.has(job.id) && this.activeJobs.get(job.id)?.status === JobStatus.PROCESSING) {
          workerInfo.worker.terminate();
          this.failJob(job.id, new Error('Job timed out'));
          this.releaseWorker(workerInfo);
        }
      }, this.taskTimeout);
      
    } catch (error) {
      this.failJob(job.id, error as Error);
      this.releaseWorker(workerInfo);
    }
  }

  /**
   * Complete a job successfully
   */
  private completeJob(jobId: string, result: any): void {
    const job = this.activeJobs.get(jobId);
    
    if (job) {
      job.status = JobStatus.COMPLETED;
      job.completedAt = new Date();
      job.progress = 100;
      job.result = result;
      
      // Emit event for tracking
      this.emit('job:completed', { 
        jobId, 
        type: job.type, 
        userId: job.userId,
        processingTime: job.completedAt.getTime() - (job.startedAt?.getTime() || job.createdAt.getTime())
      });
      
      console.log(`Job ${jobId} completed successfully`);
      
      // Remove from active jobs
      this.activeJobs.delete(jobId);
    }
  }

  /**
   * Mark a job as failed
   */
  private failJob(jobId: string, error: Error): void {
    const job = this.activeJobs.get(jobId);
    
    if (job) {
      job.status = JobStatus.FAILED;
      job.completedAt = new Date();
      job.error = error;
      
      // Emit event for tracking
      this.emit('job:failed', { 
        jobId, 
        type: job.type, 
        userId: job.userId,
        error: error.message
      });
      
      console.error(`Job ${jobId} failed: ${error.message}`);
      
      // Remove from active jobs
      this.activeJobs.delete(jobId);
    }
  }

  /**
   * Get an available worker or create a new one
   */
  private getAvailableWorker(): { worker: Worker; busy: boolean; jobId?: string; lastActivity: Date } | null {
    // Find idle worker
    for (const workerInfo of this.workers) {
      if (!workerInfo.busy) {
        return workerInfo;
      }
    }
    
    // Create new worker if below max
    if (this.workers.length < this.maxWorkers) {
      const workerInfo = {
        worker: new Worker(path.resolve(__dirname, './workers/base-worker.js')),
        busy: false,
        lastActivity: new Date()
      };
      
      this.workers.push(workerInfo);
      return workerInfo;
    }
    
    return null;
  }

  /**
   * Release a worker
   */
  private releaseWorker(workerInfo: { worker: Worker; busy: boolean; jobId?: string; lastActivity: Date }): void {
    workerInfo.busy = false;
    workerInfo.jobId = undefined;
    workerInfo.lastActivity = new Date();
  }

  /**
   * Get count of available workers
   */
  private getAvailableWorkerCount(): number {
    let count = 0;
    
    for (const workerInfo of this.workers) {
      if (!workerInfo.busy) {
        count++;
      }
    }
    
    // Add potential new workers
    count += Math.max(0, this.maxWorkers - this.workers.length);
    
    return count;
  }

  /**
   * Clean up idle workers
   */
  private cleanupIdleWorkers(): void {
    const now = new Date();
    
    for (let i = this.workers.length - 1; i >= 0; i--) {
      const workerInfo = this.workers[i];
      
      if (!workerInfo.busy && (now.getTime() - workerInfo.lastActivity.getTime() > this.workerIdleTimeout)) {
        // Terminate and remove idle worker
        workerInfo.worker.terminate();
        this.workers.splice(i, 1);
      }
    }
  }

  /**
   * Sort queue by priority
   */
  private sortQueue(): void {
    this.queue.sort((a, b) => {
      // Sort by priority (higher number = higher priority)
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      
      // If priority is the same, sort by creation time (older = higher priority)
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  /**
   * Get the appropriate worker script for a job type
   */
  private getWorkerScriptForJobType(jobType: JobType): string {
    switch (jobType) {
      case JobType.VIDEO_PROCESSING:
        return path.resolve(__dirname, './workers/video-processor.js');
      case JobType.GAR_ANALYSIS:
        return path.resolve(__dirname, './workers/gar-analyzer.js');
      case JobType.HIGHLIGHT_GENERATION:
        return path.resolve(__dirname, './workers/highlight-generator.js');
      case JobType.PERFORMANCE_EXTRACTION:
        return path.resolve(__dirname, './workers/performance-extractor.js');
      default:
        return path.resolve(__dirname, './workers/base-worker.js');
    }
  }

  /**
   * Shut down the worker pool
   */
  public async shutdown(): Promise<void> {
    // Terminate all workers
    for (const workerInfo of this.workers) {
      await workerInfo.worker.terminate();
    }
    
    this.workers = [];
    
    // Mark all active jobs as failed
    this.activeJobs.forEach((job) => {
      this.failJob(job.id, new Error('Worker pool shutdown'));
    });
    
    console.log('Worker pool shut down');
  }
}

// Export singleton instance
export const workerPool = new WorkerPool();