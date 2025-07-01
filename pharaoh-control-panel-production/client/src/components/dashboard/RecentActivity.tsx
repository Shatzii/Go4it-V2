import { Skeleton } from "@/components/ui/skeleton";
import { ActivityEvent } from "@shared/types";

interface RecentActivityProps {
  isLoading: boolean;
  activities?: ActivityEvent[];
}

export default function RecentActivity({ isLoading, activities = [] }: RecentActivityProps) {
  // Default activities if not provided
  const defaultActivities: ActivityEvent[] = [
    {
      id: "1",
      title: "Deployed new API endpoint",
      icon: "add_circle",
      iconColor: "text-green-500",
      timestamp: "Today, 11:30 AM"
    },
    {
      id: "2",
      title: "System updated to v2.0.4",
      icon: "update",
      iconColor: "text-primary-500",
      timestamp: "Yesterday, 09:15 PM"
    },
    {
      id: "3",
      title: "Unauthorized login attempt",
      icon: "warning",
      iconColor: "text-accent-500",
      timestamp: "Apr 17, 2023, 03:22 PM"
    },
    {
      id: "4",
      title: "Backup completed successfully",
      icon: "backup",
      iconColor: "text-blue-500",
      timestamp: "Apr 16, 2023, 02:00 AM"
    }
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="bg-dark-900 rounded-lg border border-dark-700 p-4 fade-in" style={{ animationDelay: "0.5s" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Recent Activity</h2>
        <button className="text-gray-400 hover:text-white">
          <span className="material-icons">more_horiz</span>
        </button>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <div className="space-y-3">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <span className={`material-icons ${activity.iconColor} mr-3 mt-0.5`}>
                {activity.icon}
              </span>
              <div>
                <p className="text-sm">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4">
        <a href="#" className="text-primary-400 hover:text-primary-300 text-sm flex items-center">
          <span className="material-icons text-sm mr-1">history</span>
          View all activity
        </a>
      </div>
    </div>
  );
}
