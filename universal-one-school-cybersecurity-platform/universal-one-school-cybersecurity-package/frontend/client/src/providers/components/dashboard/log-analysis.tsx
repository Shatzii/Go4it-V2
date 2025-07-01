import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { Log } from "@/types/security";

export function LogAnalysis() {
  const { data: logs, isLoading } = useQuery<Log[]>({
    queryKey: ["/api/logs"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return (
          <Badge className="bg-security-red/20 text-security-red border-security-red/30 font-mono text-xs">
            ERROR
          </Badge>
        );
      case "warn":
        return (
          <Badge className="bg-security-amber/20 text-security-amber border-security-amber/30 font-mono text-xs">
            WARN
          </Badge>
        );
      case "info":
        return (
          <Badge className="bg-security-blue/20 text-security-blue border-security-blue/30 font-mono text-xs">
            INFO
          </Badge>
        );
      case "debug":
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 font-mono text-xs">
            DEBUG
          </Badge>
        );
      default:
        return (
          <Badge className="bg-security-green/20 text-security-green border-security-green/30 font-mono text-xs">
            SUCCESS
          </Badge>
        );
    }
  };

  const recentLogs = logs?.slice(0, 5) || [];

  return (
    <Card className="bg-navy-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">Log Analysis</CardTitle>
          <Button
            size="sm"
            className="bg-security-blue hover:bg-blue-600 text-white text-xs"
          >
            Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3 p-3 bg-navy-900 rounded-lg border border-gray-600">
                  <div className="h-4 bg-gray-600 rounded w-16"></div>
                  <div className="h-4 bg-gray-600 rounded w-12"></div>
                  <div className="h-4 bg-gray-600 rounded flex-1"></div>
                </div>
              </div>
            ))
          ) : recentLogs.length > 0 ? (
            recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center space-x-3 p-3 bg-navy-900 rounded-lg border border-gray-600 text-xs font-mono hover:border-gray-500 transition-colors"
              >
                <span className="text-gray-500 min-w-0 flex-shrink-0">
                  {log.timestamp ? 
                    new Date(log.timestamp).toLocaleTimeString('en-US', { 
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    }) : 
                    '--:--:--'
                  }
                </span>
                {getLevelBadge(log.level)}
                <span className="text-gray-300 flex-1 truncate" title={log.message}>
                  {log.message}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent logs available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
