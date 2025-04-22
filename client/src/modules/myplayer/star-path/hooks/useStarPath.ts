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
  StarLevel
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

export function useStarPath(userId: number | null): UseStarPathReturn {
  const { toast } = useToast();
  const [starPath, setStarPath] = useState<StarPathProgress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [attributeCategories, setAttributeCategories] = useState<{
    [key: string]: AttributeCategory | null;
  }>({});

  // Fetch star path data initially
  useEffect(() => {
    if (userId !== null) {
      refreshStarPath();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  // Refresh star path data
  const refreshStarPath = async (): Promise<void> => {
    if (userId === null) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchStarPath(userId);
      
      if (data) {
        setStarPath(data);
      } else {
        throw new Error('Failed to fetch star path data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Star Path error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Create or update star path
  const createOrUpdate = async (
    data: StarPathCreateUpdate
  ): Promise<StarPathProgress | null> => {
    try {
      const result = await createOrUpdateStarPath(data);
      
      if (result) {
        setStarPath(result);
        return result;
      } else {
        throw new Error('Failed to create or update star path');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    }
  };

  // Fetch attributes for a specific category
  const fetchAttributes = async (category: string): Promise<AttributeCategory | null> => {
    try {
      const attributes = await fetchAttributesByCategory(category);
      
      if (attributes) {
        setAttributeCategories((prev) => ({
          ...prev,
          [category]: attributes,
        }));
        return attributes;
      } else {
        throw new Error(`Failed to fetch ${category} attributes`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `Could not load ${category} attributes: ${errorMessage}`,
        variant: 'destructive',
      });
      return null;
    }
  };

  // Update an attribute value
  const updateAttributeValue = async (
    userId: number,
    update: AttributeUpdate
  ): Promise<boolean> => {
    try {
      const success = await updateAttribute(userId, update);
      
      if (success) {
        // Update local state if the attribute category is loaded
        if (attributeCategories[update.category]) {
          const updatedCategory = { ...attributeCategories[update.category] } as AttributeCategory;
          
          const attributeIndex = updatedCategory.attributes.findIndex(
            (attr) => attr.id === update.attributeId
          );
          
          if (attributeIndex !== -1) {
            updatedCategory.attributes[attributeIndex].value = update.newValue;
            
            setAttributeCategories((prev) => ({
              ...prev,
              [update.category]: updatedCategory,
            }));
          }
        }
        
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
          title: 'Training Complete',
          description: result.message,
          variant: result.levelUp ? 'success' : 'default',
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

  // Claim a milestone
  const claimPlayerMilestone = async (userId: number, milestoneId: number): Promise<void> => {
    try {
      const result = await claimMilestone(userId, milestoneId);
      
      if (result.success) {
        await refreshStarPath();
        toast({
          title: 'Milestone Claimed',
          description: result.message,
          variant: 'success',
        });
      } else {
        throw new Error(result.message || 'Failed to claim milestone');
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
      case StarLevel.RisingProspect:
        return 'Rising Prospect';
      case StarLevel.EmergingTalent:
        return 'Emerging Talent';
      case StarLevel.StandoutPerformer:
        return 'Standout Performer';
      case StarLevel.EliteProspect:
        return 'Elite Prospect';
      case StarLevel.FiveStarAthlete:
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
}