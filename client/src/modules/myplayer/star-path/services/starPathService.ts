/**
 * Star Path Service
 * 
 * Contains all API service functions for the Star Path feature.
 * These functions handle data fetching and state management for the Star Path module.
 */

import {
  StarPathProgress,
  StarPathCreateUpdate,
  StarPathResponse,
  AttributeCategory,
  AttributeUpdate,
  CompletedTrainingResult,
  ClaimMilestoneResult,
  DailyCheckInResult,
} from '../types';

/**
 * Fetch a user's Star Path progress
 * @param userId The user's ID
 * @returns Star Path progress data
 */
export const fetchStarPath = async (userId: number): Promise<StarPathProgress | null> => {
  try {
    const response = await fetch(`/api/star-path/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Star Path: ${response.status}`);
    }
    
    const data: StarPathResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error fetching Star Path data');
    }
    
    return data.data || null;
  } catch (error) {
    console.error('Error fetching Star Path:', error);
    throw error;
  }
};

/**
 * Create or update a user's Star Path
 * @param starPathData The data to create or update
 * @returns The updated Star Path data
 */
export const createOrUpdateStarPath = async (
  starPathData: StarPathCreateUpdate
): Promise<StarPathProgress | null> => {
  try {
    const response = await fetch('/api/star-path', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(starPathData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create/update Star Path: ${response.status}`);
    }
    
    const data: StarPathResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error creating/updating Star Path');
    }
    
    return data.data || null;
  } catch (error) {
    console.error('Error creating/updating Star Path:', error);
    throw error;
  }
};

/**
 * Fetch attribute data for a specific category
 * @param userId The user's ID
 * @param category The attribute category (physical, mental, technical)
 * @returns Attribute category data
 */
export const fetchAttributesByCategory = async (
  userId: number,
  category: string
): Promise<AttributeCategory | null> => {
  try {
    const response = await fetch(`/api/star-path/${userId}/attributes/${category}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch attributes: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error fetching attributes');
    }
    
    return data.data || null;
  } catch (error) {
    console.error(`Error fetching ${category} attributes:`, error);
    throw error;
  }
};

/**
 * Update a specific attribute's value
 * @param userId The user's ID
 * @param attributeUpdate The attribute update data
 * @returns Success status
 */
export const updateAttribute = async (
  userId: number,
  attributeUpdate: AttributeUpdate
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/star-path/${userId}/attributes/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attributeUpdate),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update attribute: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error updating attribute');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating attribute:', error);
    throw error;
  }
};

/**
 * Record completed training to update Star Path progress
 * @param userId The user's ID
 * @param trainingData The training completion data
 * @returns Training completion results
 */
export const completeTraining = async (
  userId: number,
  trainingData: {
    drillId: number;
    duration: number;
    score?: number;
    skillNodeId?: number;
  }
): Promise<CompletedTrainingResult> => {
  try {
    const response = await fetch(`/api/star-path/${userId}/training/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trainingData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to record training completion: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error recording training completion');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error completing training:', error);
    throw error;
  }
};

/**
 * Claim a milestone reward
 * @param userId The user's ID
 * @param milestoneId The milestone ID to claim
 * @returns Milestone claim results
 */
export const claimMilestone = async (
  userId: number,
  milestoneId: number
): Promise<ClaimMilestoneResult> => {
  try {
    const response = await fetch(`/api/star-path/${userId}/milestones/${milestoneId}/claim`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to claim milestone: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error claiming milestone');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error claiming milestone:', error);
    throw error;
  }
};

/**
 * Perform daily check-in to update streak
 * @param userId The user's ID
 * @returns Daily check-in results
 */
export const dailyCheckIn = async (userId: number): Promise<DailyCheckInResult | null> => {
  try {
    const response = await fetch(`/api/star-path/${userId}/check-in`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to perform daily check-in: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error performing daily check-in');
    }
    
    return data.data || null;
  } catch (error) {
    console.error('Error performing daily check-in:', error);
    throw error;
  }
};