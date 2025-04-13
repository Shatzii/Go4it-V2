/**
 * useStarPath Hook
 * 
 * Custom hook for interacting with Star Path data. This hook provides a simple
 * interface for components to retrieve and update Star Path progress.
 */

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  StarPathProgress, 
  AttributeCategory, 
  StarPathCreateUpdate,
  AttributeUpdate,
  StarPathLevel
} from '../types';
import {
  fetchStarPath,
  createOrUpdateStarPath,
  fetchAttributesByCategory,
  updateAttribute,
  completeTraining,
  claimMilestone,
  dailyCheckIn
} from '../services/starPathService';

export interface UseStarPathReturn {
  starPath: StarPathProgress | null;
  isLoading: boolean;
  error: string | null;
  attributeCategories: {
    [key: string]: AttributeCategory | null;
  };
  refreshStarPath: () => Promise<void>;
  createOrUpdate: (data: StarPathCreateUpdate) => Promise<StarPathProgress | null>;
  fetchAttributes: (category: string) => Promise<AttributeCategory | null>;
  updateAttributeValue: (userId: number, update: AttributeUpdate) => Promise<boolean>;
  completePlayerTraining: (
    userId: number,
    trainingData: {
      drillId: number;
      duration: number;
      score?: number;
      skillNodeId?: number;
    }
  ) => Promise<void>;
  claimPlayerMilestone: (userId: number, milestoneId: number) => Promise<void>;
  performDailyCheckIn: (userId: number) => Promise<void>;
  starLevelToString: (level: number) => string;
}

export const useStarPath = (userId: number): UseStarPathReturn => {
  const [starPath, setStarPath] = useState<StarPathProgress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [attributeCategories, setAttributeCategories] = useState<{
    [key: string]: AttributeCategory | null;
  }>({});
  
  const { toast } = useToast();

  // Function to fetch star path data
  const refreshStarPath = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchStarPath(userId);
      
      if (data) {
        setStarPath(data);
      } else {
        setError('Failed to fetch Star Path data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `Could not load Star Path: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  // Initial data fetch on mount
  useEffect(() => {
    refreshStarPath();
  }, [refreshStarPath]);

  // Create or update star path
  const createOrUpdate = async (data: StarPathCreateUpdate): Promise<StarPathProgress | null> => {
    try {
      setIsLoading(true);
      const result = await createOrUpdateStarPath(data);
      
      if (result) {
        setStarPath(result);
        toast({
          title: 'Success',
          description: 'Star Path updated successfully',
          variant: 'default',
        });
        return result;
      } else {
        throw new Error('Failed to update Star Path');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `Could not update Star Path: ${errorMessage}`,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch attributes by category
  const fetchAttributes = async (category: string): Promise<AttributeCategory | null> => {
    try {
      const attributes = await fetchAttributesByCategory(userId, category);
      
      if (attributes) {
        setAttributeCategories((prev) => ({
          ...prev,
          [category]: attributes,
        }));
        return attributes;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `Could not fetch attributes: ${errorMessage}`,
        variant: 'destructive',
      });
      return null;
    }
  };

  // Update an attribute value
  const updateAttributeValue = async (userId: number, update: AttributeUpdate): Promise<boolean> => {
    try {
      const success = await updateAttribute(userId, update);
      
      if (success) {
        // Refresh the attribute category
        const category = update.attributeId.split('.')[0]; // Assuming format like 'physical.speed'
        await fetchAttributes(category);
        
        toast({
          title: 'Success',
          description: 'Attribute updated successfully',
          variant: 'default',
        });
        return true;
      } else {
        throw new Error('Failed to update attribute');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `Could not update attribute: ${errorMessage}`,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Complete a training session
  const completePlayerTraining = async (
    userId: number,
    trainingData: {
      drillId: number;
      duration: number;
      score?: number;
      skillNodeId?: number;
    }
  ): Promise<void> => {
    try {
      const result = await completeTraining(userId, trainingData);
      
      if (result) {
        await refreshStarPath();
        toast({
          title: 'Training Completed',
          description: result.message,
          variant: result.leveledUp ? 'success' : 'default',
        });
      } else {
        throw new Error('Failed to complete training');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `Could not complete training: ${errorMessage}`,
        variant: 'destructive',
      });
    }
  };

  // Claim a milestone reward
  const claimPlayerMilestone = async (userId: number, milestoneId: number): Promise<void> => {
    try {
      const result = await claimMilestone(userId, milestoneId);
      
      if (result) {
        await refreshStarPath();
        toast({
          title: 'Milestone Claimed',
          description: result.message,
          variant: 'default',
        });
      } else {
        throw new Error('Failed to claim milestone');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `Could not claim milestone: ${errorMessage}`,
        variant: 'destructive',
      });
    }
  };

  // Perform daily check-in
  const performDailyCheckIn = async (userId: number): Promise<void> => {
    try {
      const result = await dailyCheckIn(userId);
      
      if (result) {
        await refreshStarPath();
        toast({
          title: 'Daily Check-In',
          description: result.message,
          variant: result.milestoneReached ? 'success' : 'default',
        });
      } else {
        throw new Error('Failed to complete daily check-in');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `Could not complete daily check-in: ${errorMessage}`,
        variant: 'destructive',
      });
    }
  };

  // Helper to convert star level number to string representation
  const starLevelToString = (level: number): string => {
    switch (level) {
      case StarPathLevel.RISING_PROSPECT:
        return 'Rising Prospect';
      case StarPathLevel.EMERGING_TALENT:
        return 'Emerging Talent';
      case StarPathLevel.STANDOUT_PERFORMER:
        return 'Standout Performer';
      case StarPathLevel.ELITE_PROSPECT:
        return 'Elite Prospect';
      case StarPathLevel.FIVE_STAR_ATHLETE:
        return 'Five-Star Athlete';
      default:
        return 'Unknown Level';
    }
  };

  return {
    starPath,
    isLoading,
    error,
    attributeCategories,
    refreshStarPath,
    createOrUpdate,
    fetchAttributes,
    updateAttributeValue,
    completePlayerTraining,
    claimPlayerMilestone,
    performDailyCheckIn,
    starLevelToString
  };
};