/**
 * Star Path Service
 * 
 * Contains all API service functions for the Star Path feature.
 * These functions handle data fetching and state management for the Star Path module.
 */

import { queryClient } from '@/lib/queryClient';
import { 
  StarPathProgress, 
  StarPathCreateUpdate, 
  StarPathResponse, 
  AttributeCategory,
  CompletedTrainingResult,
  ClaimMilestoneResult,
  DailyCheckInResult,
  AttributeUpdate
} from '../types';

// API endpoint base path
const BASE_PATH = '/api/player/star-path';

/**
 * Fetch a user's Star Path progress
 * @param userId The user's ID
 * @returns Star Path progress data
 */
export const fetchStarPath = async (userId: number): Promise<StarPathProgress | null> => {
  try {
    const response = await fetch(`${BASE_PATH}/${userId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // No star path found for this user
      }
      throw new Error(`Failed to fetch Star Path: ${response.statusText}`);
    }
    
    const data: StarPathResponse = await response.json();
    
    if (!data.success || !data.data) {
      console.error('Error fetching Star Path:', data.error || data.message);
      return null;
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching Star Path:', error);
    return null;
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
    const response = await fetch(BASE_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(starPathData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create/update Star Path: ${response.statusText}`);
    }
    
    const data: StarPathResponse = await response.json();
    
    if (!data.success || !data.data) {
      console.error('Error creating/updating Star Path:', data.error || data.message);
      return null;
    }
    
    // Invalidate the cache to refresh data
    await queryClient.invalidateQueries({ queryKey: [`${BASE_PATH}/${starPathData.userId}`] });
    
    return data.data;
  } catch (error) {
    console.error('Error creating/updating Star Path:', error);
    return null;
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
    const response = await fetch(`${BASE_PATH}/${userId}/attributes/${category}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch attributes: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('Error fetching attributes:', data.error || data.message);
      return null;
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching ${category} attributes:`, error);
    return null;
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
    const response = await fetch(`${BASE_PATH}/${userId}/attributes/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attributeUpdate)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update attribute: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('Error updating attribute:', data.error || data.message);
      return false;
    }
    
    // Invalidate relevant queries to refresh data
    await queryClient.invalidateQueries({ queryKey: [`${BASE_PATH}/${userId}/attributes`] });
    
    return true;
  } catch (error) {
    console.error('Error updating attribute:', error);
    return false;
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
): Promise<CompletedTrainingResult | null> => {
  try {
    const response = await fetch(`${BASE_PATH}/${userId}/complete-training`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trainingData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to complete training: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('Error completing training:', data.error || data.message);
      return null;
    }
    
    // Invalidate relevant queries to refresh data
    await queryClient.invalidateQueries({ queryKey: [`${BASE_PATH}/${userId}`] });
    
    return data.data;
  } catch (error) {
    console.error('Error completing training:', error);
    return null;
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
): Promise<ClaimMilestoneResult | null> => {
  try {
    const response = await fetch(`${BASE_PATH}/${userId}/claim-milestone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestoneId })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to claim milestone: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('Error claiming milestone:', data.error || data.message);
      return null;
    }
    
    // Invalidate relevant queries to refresh data
    await queryClient.invalidateQueries({ queryKey: [`${BASE_PATH}/${userId}`] });
    
    return data.data;
  } catch (error) {
    console.error('Error claiming milestone:', error);
    return null;
  }
};

/**
 * Perform daily check-in to update streak
 * @param userId The user's ID
 * @returns Daily check-in results
 */
export const dailyCheckIn = async (userId: number): Promise<DailyCheckInResult | null> => {
  try {
    const response = await fetch(`${BASE_PATH}/${userId}/daily-check-in`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to perform daily check-in: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('Error performing daily check-in:', data.error || data.message);
      return null;
    }
    
    // Invalidate relevant queries to refresh data
    await queryClient.invalidateQueries({ queryKey: [`${BASE_PATH}/${userId}`] });
    
    return data.data;
  } catch (error) {
    console.error('Error performing daily check-in:', error);
    return null;
  }
};