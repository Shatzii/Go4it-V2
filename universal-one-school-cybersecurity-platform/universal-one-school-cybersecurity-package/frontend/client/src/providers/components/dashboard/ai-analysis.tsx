import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Search, Shield } from "lucide-react";
import type { Anomaly } from "@/types/security";

export function AiAnalysis() {
  const { data: anomalies } = useQuery<Anomaly[]>({
    queryKey: ["/api/anomalies"],
    refetchInterval: 60000, // Refetch every minute
  });

  const analysisItems = [
    {
      icon: Brain,
      title: "Anomaly Detection",
      description: "AI detected 3 behavioral anomalies in the last hour. Investigating potential insider threats.",
      progress: 75,
      status: "analyzing",
      color: "text-security-amber"
    },
    {
      icon: Search,
      title: "Threat Intelligence",
      description: "Updated threat signatures from 15 intelligence feeds. 247 new IOCs processed.",
      progress: 100,
      status: "updated",
      color: "text-security-green"
    },
    {
      icon: Shield,
      title: "Auto Response",
      description: "Automatically blocked 23 malicious IPs and updated firewall rules in real-time.",
      progress: 100,
      status: "active",
      color: "text-security-blue"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "updated":
        return (
          <Badge className="bg-security-green/20 text-security-green border-security-green/30">
            Updated
          </Badge>
        );
      case "analyzing":
        return (
          <Badge className="bg-security-amber/20 text-security-amber border-security-amber/30">
            Analyzing
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-security-blue/20 text-security-blue border-security-blue/30">
            Active
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            {status}
          </Badge>
        );
    }
  };

  const getTimeText = (status: string) => {
    switch (status) {
      case "updated":
        return "2 minutes ago";
      case "analyzing":
        return "In progress";
      case "active":
        return "Continuous";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="bg-navy-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">AI Security Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analysisItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <div
                key={index}
                className="p-4 bg-navy-900 rounded-lg border border-gray-600"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className={`${item.color} w-4 h-4`} />
                  <span className="text-sm font-medium text-white">{item.title}</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{item.description}</p>
                
                {item.status === "analyzing" && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Analysis Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  {getStatusBadge(item.status)}
                  <span className="text-xs text-gray-500">{getTimeText(item.status)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
