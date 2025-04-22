/**
 * Star Path Service
 * 
 * This service handles API interactions for the Star Path feature.
 */

import { apiRequest } from '@/lib/queryClient';
import {
  StarPathProgress,
  AttributeCategory,
  StarPathCreateUpdate,
  AttributeUpdate
} from '../types';

// Fetch the user's star path progress
export async function fetchStarPath(userId: number): Promise<StarPathProgress | null> {
  try {
    const response = await apiRequest('GET', `/api/star-path/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching star path:', error);
    return null;
  }
}

// Create or update star path progress
export async function createOrUpdateStarPath(
  data: StarPathCreateUpdate
): Promise<StarPathProgress | null> {
  try {
    const response = await apiRequest('POST', '/api/star-path', data);
    return response.data;
  } catch (error) {
    console.error('Error creating/updating star path:', error);
    return null;
  }
}

// Fetch attributes by category
export async function fetchAttributesByCategory(
  category: string
): Promise<AttributeCategory | null> {
  try {
    const response = await apiRequest('GET', `/api/attributes/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${category} attributes:`, error);
    return null;
  }
}

// Update attribute value
export async function updateAttribute(
  userId: number,
  update: AttributeUpdate
): Promise<boolean> {
  try {
    await apiRequest('PATCH', `/api/attributes/${userId}`, update);
    return true;
  } catch (error) {
    console.error('Error updating attribute:', error);
    return false;
  }
}

// Complete training
export async function completeTraining(
  userId: number,
  trainingData: {
    drillId: number;
    duration: number;
    score?: number;
    skillNodeId?: number;
  }
): Promise<{ xpGained: number; message: string; levelUp?: boolean }> {
  try {
    const response = await apiRequest(
      'POST',
      `/api/training/${userId}/complete`,
      trainingData
    );
    return response.data;
  } catch (error) {
    console.error('Error completing training:', error);
    throw error;
  }
}

// Claim milestone
export async function claimMilestone(
  userId: number,
  milestoneId: number
): Promise<{ success: boolean; message: string; reward?: any }> {
  try {
    const response = await apiRequest(
      'POST',
      `/api/milestones/${userId}/claim`,
      { milestoneId }
    );
    return response.data;
  } catch (error) {
    console.error('Error claiming milestone:', error);
    throw error;
  }
}

// Daily check-in
export async function dailyCheckIn(
  userId: number
): Promise<{ success: boolean; message: string; xpGained: number; milestoneReached?: boolean }> {
  try {
    const response = await apiRequest('POST', `/api/star-path/${userId}/check-in`);
    return response.data;
  } catch (error) {
    console.error('Error performing daily check-in:', error);
    throw error;
  }
}