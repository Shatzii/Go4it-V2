import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export interface ProgressData {
  id: string;
  name: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  category?: string;
  superheroTheme?: string;
}

interface ProgressTrackerProps {
  title?: string;
  items: ProgressData[];
  showCategory?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'standard' | 'superhero';
  onItemClick?: (item: ProgressData) => void;
}

/**
 * A reusable progress tracker component for showing student progress across different educational entities
 * (standards, activities, lessons, etc.)
 */
const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  title,
  items,
  showCategory = true,
  size = 'md',
  variant = 'standard',
  onItemClick
}) => {
  // Get status color based on status value
  const getStatusColor = (status: string, superheroTheme?: string) => {
    if (variant === 'superhero' && superheroTheme) {
      switch (superheroTheme.toLowerCase()) {
        case 'focus force': return {
          bg: status === 'mastered' ? 'bg-purple-600' : status === 'completed' ? 'bg-purple-500' : 'bg-purple-900/40',
          text: status === 'not_started' ? 'text-purple-300' : 'text-white'
        };
        case 'pattern pioneers': return {
          bg: status === 'mastered' ? 'bg-blue-600' : status === 'completed' ? 'bg-blue-500' : 'bg-blue-900/40', 
          text: status === 'not_started' ? 'text-blue-300' : 'text-white'
        };
        case 'sensory squad': return {
          bg: status === 'mastered' ? 'bg-teal-600' : status === 'completed' ? 'bg-teal-500' : 'bg-teal-900/40',
          text: status === 'not_started' ? 'text-teal-300' : 'text-white'
        };
        case 'vision voyagers': return {
          bg: status === 'mastered' ? 'bg-amber-600' : status === 'completed' ? 'bg-amber-500' : 'bg-amber-900/40',
          text: status === 'not_started' ? 'text-amber-300' : 'text-white'
        };
        default: return {
          bg: status === 'mastered' ? 'bg-indigo-600' : status === 'completed' ? 'bg-indigo-500' : 'bg-indigo-900/40',
          text: status === 'not_started' ? 'text-indigo-300' : 'text-white'
        };
      }
    }
    
    // Standard colors
    switch (status) {
      case 'mastered': return { bg: 'bg-green-600', text: 'text-white' };
      case 'completed': return { bg: 'bg-blue-600', text: 'text-white' };
      case 'in_progress': return { bg: 'bg-amber-600', text: 'text-white' };
      case 'not_started': return { bg: 'bg-gray-600', text: 'text-gray-200' };
      default: return { bg: 'bg-gray-600', text: 'text-gray-200' };
    }
  };
  
  // Get progress color based on progress value and superhero theme
  const getProgressColor = (progress: number, superheroTheme?: string) => {
    if (variant === 'superhero' && superheroTheme) {
      switch (superheroTheme.toLowerCase()) {
        case 'focus force': return progress > 90 ? 'bg-purple-600' : progress > 70 ? 'bg-purple-500' : 'bg-purple-400';
        case 'pattern pioneers': return progress > 90 ? 'bg-blue-600' : progress > 70 ? 'bg-blue-500' : 'bg-blue-400';
        case 'sensory squad': return progress > 90 ? 'bg-teal-600' : progress > 70 ? 'bg-teal-500' : 'bg-teal-400';
        case 'vision voyagers': return progress > 90 ? 'bg-amber-600' : progress > 70 ? 'bg-amber-500' : 'bg-amber-400';
        default: return progress > 90 ? 'bg-indigo-600' : progress > 70 ? 'bg-indigo-500' : 'bg-indigo-400';
      }
    }
    
    // Standard colors
    return progress > 90 ? 'bg-green-600' : progress > 70 ? 'bg-blue-600' : progress > 40 ? 'bg-amber-600' : 'bg-gray-600';
  };
  
  // Get status icon based on status value
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'mastered': return <i className="ri-verified-badge-fill text-green-300 mr-1"></i>;
      case 'completed': return <i className="ri-checkbox-circle-fill text-blue-300 mr-1"></i>;
      case 'in_progress': return <i className="ri-time-fill text-amber-300 mr-1"></i>;
      case 'not_started': return <i className="ri-circle-line text-gray-400 mr-1"></i>;
      default: return <i className="ri-circle-line text-gray-400 mr-1"></i>;
    }
  };
  
  // Get superhero icon based on theme
  const getSuperheroIcon = (theme?: string) => {
    if (!theme) return null;
    
    switch (theme.toLowerCase()) {
      case 'focus force': return <i className="ri-focus-3-line text-purple-400 mr-1"></i>;
      case 'pattern pioneers': return <i className="ri-brain-line text-blue-400 mr-1"></i>;
      case 'sensory squad': return <i className="ri-empathize-line text-teal-400 mr-1"></i>;
      case 'vision voyagers': return <i className="ri-eye-line text-amber-400 mr-1"></i>;
      default: return <i className="ri-superhero-line text-indigo-400 mr-1"></i>;
    }
  };
  
  // Determine card style based on component size
  const getCardStyle = () => {
    switch (size) {
      case 'sm': return 'p-2 text-sm';
      case 'lg': return 'p-4';
      default: return 'p-3';
    }
  };
  
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
      
      <div className="space-y-2">
        {items.map((item, index) => {
          const statusColor = getStatusColor(item.status, item.superheroTheme);
          const progressColor = getProgressColor(item.progress, item.superheroTheme);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card 
                className={`cursor-pointer hover:bg-dark-800 transition-colors ${getCardStyle()}`}
                onClick={() => onItemClick && onItemClick(item)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center">
                          {variant === 'superhero' && getSuperheroIcon(item.superheroTheme)}
                          <span className="font-medium">{item.name}</span>
                        </div>
                        
                        {showCategory && item.category && (
                          <div className="text-xs text-gray-400 mt-0.5">{item.category}</div>
                        )}
                      </div>
                      
                      <Badge className={`ml-2 ${statusColor.bg} ${statusColor.text}`}>
                        {getStatusIcon(item.status)}
                        <span className="capitalize">
                          {item.status.replace('_', ' ')}
                        </span>
                      </Badge>
                    </div>
                    
                    <div className="w-full">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <Progress
                        value={item.progress}
                        className="h-2 bg-dark-700"
                        indicatorClassName={progressColor}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        
        {items.length === 0 && (
          <div className="text-center py-6 text-gray-400">
            <i className="ri-file-list-3-line text-3xl mb-2"></i>
            <p>No progress data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;