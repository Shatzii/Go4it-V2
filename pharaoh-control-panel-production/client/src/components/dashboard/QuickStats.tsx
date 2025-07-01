import { Skeleton } from "@/components/ui/skeleton";
import { ServerMetric } from "@shared/types";

interface QuickStatsProps {
  isLoading: boolean;
  metrics?: ServerMetric[];
}

export default function QuickStats({ isLoading, metrics = [] }: QuickStatsProps) {
  // Default metrics if not provided
  const defaultMetrics: ServerMetric[] = [
    { name: "CPU Usage", value: 24, change: -2.3, status: "healthy" },
    { name: "Memory Usage", value: 68, change: 4.7, status: "attention" },
    { name: "Disk Usage", value: 42, change: -0.5, status: "healthy" },
    { name: "Network Usage", value: 54, change: 12.8, status: "healthy" }
  ];

  const displayMetrics = metrics.length > 0 ? metrics : defaultMetrics;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-secondary-500";
      case "attention":
        return "bg-accent-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-secondary-500";
    }
  };

  const getBarColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-gradient-to-r from-teal-500 to-teal-400";
      case "attention":
        return "bg-gradient-to-r from-indigo-600 to-indigo-500";
      case "critical":
        return "bg-gradient-to-r from-red-600 to-red-500";
      default:
        return "bg-gradient-to-r from-teal-500 to-teal-400";
    }
  };

  const getChangeColor = (change: number) => {
    return change < 0 ? "text-secondary-400" : "text-accent-400";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in" style={{ animationDelay: "0.1s" }}>
      {displayMetrics.map((metric, index) => (
        <div key={index} className="bg-dark-900 rounded-lg border border-dark-700 p-4">
          {isLoading ? (
            <>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-end mt-2">
                <Skeleton className="h-8 w-16" />
                <div className="ml-auto">
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
              <Skeleton className="h-2 w-full mt-3" />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">{metric.name}</p>
                <span className={`flex items-center ${getChangeColor(metric.change)} text-sm`}>
                  <span className="material-icons text-sm mr-1">
                    {metric.change < 0 ? "arrow_downward" : "arrow_upward"}
                  </span>
                  {Math.abs(metric.change)}%
                </span>
              </div>
              <div className="flex items-end mt-2">
                <p className="text-2xl font-semibold">{metric.value}%</p>
                <div className="ml-auto flex items-center bg-dark-800 rounded-full px-2 py-1">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(metric.status)} mr-1`}></span>
                  <span className="text-xs text-white">
                    {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="mt-3 h-2 bg-dark-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getBarColor(metric.status)} rounded-full`} 
                  style={{ width: `${metric.value}%` }}
                ></div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
