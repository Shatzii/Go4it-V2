import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Monitor } from "lucide-react";
import type { NetworkNode } from "@/types/security";

export function NetworkOverview() {
  const { data: nodes, isLoading } = useQuery<NetworkNode[]>({
    queryKey: ["/api/network/nodes"],
    refetchInterval: 60000, // Refetch every minute
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge className="bg-security-green/20 text-security-green border-security-green/30">
            Secure
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-security-amber/20 text-security-amber border-security-amber/30">
            Warning
          </Badge>
        );
      case "compromised":
        return (
          <Badge className="bg-security-red/20 text-security-red border-security-red/30">
            Compromised
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            Offline
          </Badge>
        );
    }
  };

  const getNodeIcon = (nodeType: string) => {
    switch (nodeType) {
      case "server":
        return Server;
      case "database":
        return Database;
      default:
        return Monitor;
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-security-green";
      case "warning":
        return "text-security-amber";
      case "compromised":
        return "text-security-red";
      default:
        return "text-gray-400";
    }
  };

  const displayNodes = nodes?.slice(0, 4) || [];

  return (
    <Card className="bg-navy-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Network Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 bg-navy-900 rounded-lg border border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg"></div>
                    <div>
                      <div className="h-4 bg-gray-600 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-600 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-600 rounded w-16"></div>
                </div>
              </div>
            ))
          ) : displayNodes.length > 0 ? (
            displayNodes.map((node) => {
              const Icon = getNodeIcon(node.nodeType);
              const iconColor = getIconColor(node.status);
              
              return (
                <div
                  key={node.id}
                  className="flex items-center justify-between p-4 bg-navy-900 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${iconColor === 'text-security-green' ? 'bg-security-green/20' : 
                      iconColor === 'text-security-amber' ? 'bg-security-amber/20' : 
                      iconColor === 'text-security-red' ? 'bg-security-red/20' : 'bg-gray-500/20'} rounded-lg flex items-center justify-center`}>
                      <Icon className={`${iconColor} w-5 h-5`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{node.name}</p>
                      <p className="text-xs text-gray-400">{node.ipAddress}</p>
                    </div>
                  </div>
                  {getStatusBadge(node.status)}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No network nodes available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
