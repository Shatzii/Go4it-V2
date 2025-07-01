import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { Alert } from "@/types/security";

export function RecentAlerts() {
  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-security-red";
      case "high":
        return "text-security-red";
      case "medium":
        return "text-security-amber";
      case "low":
        return "text-security-blue";
      default:
        return "text-gray-400";
    }
  };

  const recentAlerts = alerts?.slice(0, 5) || [];

  return (
    <Card className="bg-navy-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3 p-3 bg-navy-900 rounded-lg border border-gray-600">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))
          ) : recentAlerts.length > 0 ? (
            recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-3 p-3 bg-navy-900 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
              >
                <Circle className={`w-2 h-2 ${getSeverityColor(alert.severity)} rounded-full mt-2`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white truncate">
                      {alert.title}
                    </p>
                    <Badge variant="outline" className={`text-xs ${getSeverityColor(alert.severity)} border-current ml-2`}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {alert.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {alert.createdAt ? formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true }) : 'Unknown time'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white p-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent alerts</p>
            </div>
          )}
          
          {!isLoading && recentAlerts.length > 0 && (
            <Button
              variant="ghost"
              className="w-full mt-4 text-sm text-security-blue hover:text-blue-400 transition-colors"
            >
              View All Alerts
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
