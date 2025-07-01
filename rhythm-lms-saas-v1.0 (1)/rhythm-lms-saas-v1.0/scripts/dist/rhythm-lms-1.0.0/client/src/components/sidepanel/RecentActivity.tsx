import React, { useEffect, useState } from 'react';
import { getRecentActivity } from '@/lib/file-service';
import { formatRelativeTime, truncateText } from '@/lib/utils';
import { useEditor } from '@/context/EditorContext';

interface ActivityItem {
  path: string;
  prompt: string;
  time: string;
}

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { openFile } = useEditor();
  
  useEffect(() => {
    const loadActivity = async () => {
      try {
        const data = await getRecentActivity(3);
        setActivities(data);
      } catch (error) {
        console.error('Failed to load recent activity', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadActivity();
    
    // Set up polling for updates
    const interval = setInterval(loadActivity, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const handleActivityClick = (path: string) => {
    openFile(path);
  };
  
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <button className="text-xs text-primary-400 hover:text-primary-300">View All</button>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-dark-700 rounded-lg p-3 animate-pulse">
              <div className="flex justify-between mb-1">
                <div className="h-4 bg-dark-600 rounded w-1/3"></div>
                <div className="h-3 bg-dark-600 rounded w-12"></div>
              </div>
              <div className="h-3 bg-dark-600 rounded w-full mt-2"></div>
              <div className="h-3 bg-dark-600 rounded w-2/3 mt-1"></div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-dark-700 rounded-lg p-3 text-dark-400 text-sm text-center">
          No recent activity
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div 
              key={index} 
              className="bg-dark-700 rounded-lg p-3 cursor-pointer hover:bg-dark-600 transition-colors"
              onClick={() => handleActivityClick(activity.path)}
            >
              <div className="flex justify-between mb-1">
                <span className="text-secondary-400 font-medium">{activity.path}</span>
                <span className="text-dark-400 text-xs">{formatRelativeTime(new Date(activity.time))}</span>
              </div>
              <p className="text-sm text-dark-200 line-clamp-2">
                {truncateText(activity.prompt, 100)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
