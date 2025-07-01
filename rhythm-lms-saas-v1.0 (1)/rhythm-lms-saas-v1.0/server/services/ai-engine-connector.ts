import { Request, Response } from 'express';
import { storage } from '../storage';
import { StateStandard, LearningObjective, NeurodivergentProfile } from '@shared/schema';

/**
 * AI Academic Engine Connector Service
 * 
 * This service handles the integration with a self-hosted AI academic engine
 * for curriculum generation, lesson planning, and personalized adaptations.
 */
class AIEngineConnector {
  private baseUrl: string;
  private connected: boolean = false;
  private engineCapabilities: string[] = [];
  
  constructor() {
    // Default to localhost for development, would be configurable in production
    this.baseUrl = process.env.AI_ENGINE_URL || 'http://localhost:3030';
    this.initialize();
  }
  
  /**
   * Initialize connection to the AI engine and discover capabilities
   */
  async initialize() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (response.ok) {
        const data = await response.json();
        this.connected = data.status === 'healthy';
        this.engineCapabilities = data.capabilities || [];
        console.log(`AI Engine connected. Capabilities: ${this.engineCapabilities.join(', ')}`);
      } else {
        console.log('AI Engine is not available. Using local fallback mechanisms.');
        this.connected = false;
      }
    } catch (error) {
      console.error('Failed to connect to AI Engine:', error);
      this.connected = false;
    }
  }
  
  /**
   * Check if the AI engine is connected and has specific capability
   */
  hasCapability(capability: string): boolean {
    return this.connected && this.engineCapabilities.includes(capability);
  }
  
  /**
   * Generate a curriculum path for a student based on their neurodivergent profile
   * and aligned with state standards
   */
  async generateCurriculumPath(
    studentId: number, 
    profileId: number, 
    stateCode: string, 
    gradeLevel: string,
    subjects: string[]
  ) {
    if (!this.connected) {
      throw new Error('AI Engine is not connected. Unable to generate curriculum path.');
    }
    
    try {
      // Fetch student's neurodivergent profile
      const profiles = await storage.getNeurodivergentProfiles();
      const profile = profiles.find(p => p.id === profileId);
      
      if (!profile) {
        throw new Error(`Neurodivergent profile with ID ${profileId} not found.`);
      }
      
      // Fetch relevant state standards
      const standards: StateStandard[] = [];
      for (const subject of subjects) {
        const subjectStandards = await storage.getStateStandards(stateCode, subject, gradeLevel);
        standards.push(...subjectStandards);
      }
      
      // Prepare the request payload
      const payload = {
        studentId,
        profile,
        standards,
        gradeLevel,
        subjects
      };
      
      // Send request to AI engine
      const response = await fetch(`${this.baseUrl}/curriculum/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`AI Engine error: ${error}`);
      }
      
      const curriculumPath = await response.json();
      
      // Save the generated curriculum path to storage
      const savedPath = await storage.createCurriculumPath({
        studentId,
        profileId,
        stateCode,
        gradeLevel,
        subjects: subjects.join(','),
        status: 'active',
        content: JSON.stringify(curriculumPath.content),
        metadata: JSON.stringify({
          generatedBy: 'ai-engine',
          timestamp: new Date().toISOString(),
          engineVersion: curriculumPath.engineVersion || '1.0.0'
        })
      });
      
      // Log the activity
      await storage.logActivity({
        type: 'curriculum-generated',
        userId: 1, // Would use authenticated user ID in production
        details: JSON.stringify({
          curriculumPathId: savedPath.id,
          studentId,
          profileId,
          subjects
        })
      });
      
      return savedPath;
    } catch (error) {
      console.error('Failed to generate curriculum path:', error);
      throw error;
    }
  }
  
  /**
   * Adapt a lesson plan for a specific neurodivergent profile
   */
  async adaptLessonPlan(lessonPlanId: number, profileType: string) {
    if (!this.connected) {
      throw new Error('AI Engine is not connected. Unable to adapt lesson plan.');
    }
    
    try {
      // Fetch the original lesson plan
      const lessonPlans = await storage.getLessonPlans({ id: lessonPlanId });
      
      if (!lessonPlans || lessonPlans.length === 0) {
        throw new Error(`Lesson plan with ID ${lessonPlanId} not found.`);
      }
      
      const originalPlan = lessonPlans[0];
      
      // Prepare the request payload
      const payload = {
        lessonPlan: originalPlan,
        profileType,
        adaptationLevel: 'comprehensive'
      };
      
      // Send request to AI engine
      const response = await fetch(`${this.baseUrl}/lessons/adapt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`AI Engine error: ${error}`);
      }
      
      const adaptedPlan = await response.json();
      
      // Create a new lesson plan with the adaptations
      const newLessonPlan = await storage.createLessonPlan({
        title: `${originalPlan.title} (${profileType} Adaptation)`,
        description: adaptedPlan.description || originalPlan.description,
        subject: originalPlan.subject,
        gradeLevel: originalPlan.gradeLevel,
        standardIds: originalPlan.standardIds,
        duration: originalPlan.duration,
        objectives: adaptedPlan.objectives || originalPlan.objectives,
        materials: adaptedPlan.materials || originalPlan.materials,
        content: adaptedPlan.content || originalPlan.content,
        assessments: adaptedPlan.assessments || originalPlan.assessments,
        adaptations: adaptedPlan.adaptations || [],
        metadata: JSON.stringify({
          adaptedFrom: lessonPlanId,
          profileType,
          adaptedBy: 'ai-engine',
          timestamp: new Date().toISOString()
        })
      });
      
      return newLessonPlan;
    } catch (error) {
      console.error('Failed to adapt lesson plan:', error);
      throw error;
    }
  }
  
  /**
   * Generate learning objectives based on a state standard
   */
  async generateLearningObjectives(standardId: number, count: number = 5) {
    if (!this.connected) {
      throw new Error('AI Engine is not connected. Unable to generate learning objectives.');
    }
    
    try {
      // Fetch the standard
      const standards = await storage.getStateStandards('', '', '');
      const standard = standards.find(s => s.id === standardId);
      
      if (!standard) {
        throw new Error(`Standard with ID ${standardId} not found.`);
      }
      
      // Prepare the request payload
      const payload = {
        standard,
        count
      };
      
      // Send request to AI engine
      const response = await fetch(`${this.baseUrl}/objectives/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`AI Engine error: ${error}`);
      }
      
      const generatedObjectives = await response.json();
      
      // Save the generated objectives
      const savedObjectives = [];
      for (const objective of generatedObjectives.objectives) {
        const savedObjective = await storage.createLearningObjective({
          standardId,
          description: objective.description,
          criteria: objective.criteria || '',
          difficulty: objective.difficulty || 'medium',
          tags: objective.tags ? objective.tags.join(',') : '',
          metadata: JSON.stringify({
            generatedBy: 'ai-engine',
            timestamp: new Date().toISOString()
          })
        });
        
        savedObjectives.push(savedObjective);
      }
      
      return savedObjectives;
    } catch (error) {
      console.error('Failed to generate learning objectives:', error);
      throw error;
    }
  }
  
  /**
   * Check for compliance issues in a curriculum path against state requirements
   */
  async checkCompliance(curriculumPathId: number, stateCode: string) {
    if (!this.connected) {
      throw new Error('AI Engine is not connected. Unable to check compliance.');
    }
    
    try {
      // Fetch the curriculum path
      const paths = await storage.getCurriculumPaths(0); // We'll filter in JS
      const path = paths.find(p => p.id === curriculumPathId);
      
      if (!path) {
        throw new Error(`Curriculum path with ID ${curriculumPathId} not found.`);
      }
      
      // Prepare the request payload
      const payload = {
        curriculumPath: path,
        stateCode
      };
      
      // Send request to AI engine
      const response = await fetch(`${this.baseUrl}/compliance/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`AI Engine error: ${error}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to check compliance:', error);
      throw error;
    }
  }
  
  /**
   * Get the status of the AI engine
   */
  getStatus() {
    return {
      connected: this.connected,
      capabilities: this.engineCapabilities,
      url: this.baseUrl
    };
  }
}

// Export a singleton instance
export const aiEngineConnector = new AIEngineConnector();