/**
 * useStarPath Hook
 * 
 * Custom hook for interacting with Star Path data. This hook provides a simple
 * interface for components to retrieve and update Star Path progress.
 */

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchStarPath, 
  createOrUpdateStarPath, 
  fetchAttributesByCategory,
  updateAttribute,
  completeTraining,
  claimMilestone,
  dailyCheckIn
} from '../services';
import { 
  StarPathProgress, 
  AttributeCategory, 
  AttributeUpdate,
  StarPathCreateUpdate,
  StarPathLevel
} from '../types';

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

  // Helper function to convert star level number to string representation
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
        return `Level ${level}`;
    }
  };

  // Function to load the Star Path data
  const loadStarPath = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchStarPath(userId);
      setStarPath(data);
    } catch (err) {
      console.error('Error in useStarPath:', err);
      setError('Failed to load Star Path data');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to complete a training session
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
        toast({
          title: result.leveledUp ? 'Level Up!' : 'Training Complete',
          description: result.message,
          variant: result.leveledUp ? 'success' : 'default',
        });
        
        // Update local state with new XP values
        if (starPath) {
          setStarPath({
            ...starPath,
            xpTotal: starPath.xpTotal + result.xpEarned + (result.starXpEarned || 0),
            progress: result.newProgress,
            currentStarLevel: result.currentLevel
          });
        }
      }
      
      // Refresh the full star path data
      await loadStarPath();
    } catch (err) {
      console.error('Error completing training:', err);
      toast({
        title: 'Error',
        description: 'Failed to complete training session',
        variant: 'destructive',
      });
    }
  };

  // Function to claim a milestone reward
  const claimPlayerMilestone = async (userId: number, milestoneId: number): Promise<void> => {
    try {
      const result = await claimMilestone(userId, milestoneId);
      
      if (result) {
        toast({
          title: 'Milestone Claimed',
          description: `You earned ${result.xpEarned} XP${result.rewardDetails ? ` and ${result.rewardDetails}` : ''}!`,
        });
        
        // Update local state
        if (starPath) {
          setStarPath({
            ...starPath,
            progress: result.newProgress,
            milestones: starPath.milestones.map(m => 
              m.id === milestoneId ? { ...m, isCompleted: true } : m
            )
          });
        }
      }
      
      // Refresh the full star path data
      await loadStarPath();
    } catch (err) {
      console.error('Error claiming milestone:', err);
      toast({
        title: 'Error',
        description: 'Failed to claim milestone reward',
        variant: 'destructive',
      });
    }
  };

  // Function to perform daily check-in
  const performDailyCheckIn = async (userId: number): Promise<void> => {
    try {
      const result = await dailyCheckIn(userId);
      
      if (result) {
        toast({
          title: 'Daily Check-In',
          description: result.milestoneReached 
            ? `${result.streakDays} day streak! You earned ${result.xpEarned} XP and ${result.milestoneReward}!`
            : `${result.streakDays} day streak! Keep it up!`,
        });
        
        // Update local state
        if (starPath) {
          setStarPath({
            ...starPath,
            streakDays: result.streakDays,
          });
        }
      }
      
      // Refresh the full star path data
      await loadStarPath();
    } catch (err) {
      console.error('Error with daily check-in:', err);
      toast({
        title: 'Error',
        description: 'Failed to complete daily check-in',
        variant: 'destructive',
      });
    }
  };

  // Function to create or update Star Path
  const createOrUpdate = async (data: StarPathCreateUpdate): Promise<StarPathProgress | null> => {
    try {
      setIsLoading(true);
      const updatedStarPath = await createOrUpdateStarPath(data);
      
      if (updatedStarPath) {
        setStarPath(updatedStarPath);
        toast({
          title: 'Success',
          description: 'Star Path updated successfully',
        });
      }
      
      return updatedStarPath;
    } catch (err) {
      console.error('Error creating/updating Star Path:', err);
      setError('Failed to update Star Path');
      toast({
        title: 'Error',
        description: 'Failed to update Star Path',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch attributes for a specific category
  const fetchAttributes = async (category: string): Promise<AttributeCategory | null> => {
    try {
      const attributeData = await fetchAttributesByCategory(userId, category);
      
      if (attributeData) {
        setAttributeCategories(prev => ({
          ...prev,
          [category]: attributeData
        }));
      }
      
      return attributeData;
    } catch (err) {
      console.error(`Error fetching ${category} attributes:`, err);
      toast({
        title: 'Error',
        description: `Failed to load ${category} attributes`,
        variant: 'destructive',
      });
      return null;
    }
  };

  // Function to update an attribute value
  const updateAttributeValue = async (userId: number, update: AttributeUpdate): Promise<boolean> => {
    try {
      const success = await updateAttribute(userId, update);
      
      if (success) {
        // Update the local state if we have the category data
        const category = Object.values(attributeCategories).find(cat => 
          cat?.attributes.some(attr => attr.id === update.attributeId)
        );
        
        if (category) {
          const categoryKey = Object.keys(attributeCategories).find(key => 
            attributeCategories[key]?.id === category.id
          );
          
          if (categoryKey) {
            const updatedCategory = {
              ...category,
              attributes: category.attributes.map(attr => 
                attr.id === update.attributeId 
                  ? { ...attr, value: update.newValue } 
                  : attr
              )
            };
            
            setAttributeCategories(prev => ({
              ...prev,
              [categoryKey]: updatedCategory
            }));
          }
        }
        
        toast({
          title: 'Attribute Updated',
          description: `The attribute has been updated successfully.`,
        });
      }
      
      return success;
    } catch (err) {
      console.error('Error updating attribute:', err);
      toast({
        title: 'Error',
        description: 'Failed to update attribute',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Load initial data when the component mounts or userId changes
  useEffect(() => {
    if (userId) {
      loadStarPath();
    }
  }, [userId]);

  return {
    starPath,
    isLoading,
    error,
    attributeCategories,
    refreshStarPath: loadStarPath,
    createOrUpdate,
    fetchAttributes,
    updateAttributeValue,
    completePlayerTraining,
    claimPlayerMilestone,
    performDailyCheckIn,
    starLevelToString
  };
};