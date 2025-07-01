import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Shield, Monitor, PieChart } from "lucide-react";
import type { DashboardStats } from "@/types/security";

interface StatsCardsProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      title: "Active Threats",
      value: stats?.activeThreats ?? 0,
      icon: AlertTriangle,
      iconBg: "bg-security-red/20",
      iconColor: "text-security-red",
      subtitle: "+3 from last hour",
      trend: "up"
    },
    {
      title: "Blocked Attacks",
      value: stats?.blockedAttacks ?? 0,
      icon: Shield,
      iconBg: "bg-security-green/20",
      iconColor: "text-security-green",
      subtitle: "Today",
      trend: "neutral"
    },
    {
      title: "Monitored Endpoints",
      value: stats?.endpoints ?? 0,
      icon: Monitor,
      iconBg: "bg-security-blue/20",
      iconColor: "text-security-blue",
      subtitle: "All online",
      trend: "neutral"
    },
    {
      title: "Security Score",
      value: stats?.securityScore ?? "0%",
      icon: PieChart,
      iconBg: "bg-security-amber/20",
      iconColor: "text-security-amber",
      subtitle: "Good standing",
      trend: "neutral"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-navy-800 border-gray-700">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-600 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-600 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-600 rounded w-20"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-600 rounded-lg"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isStringValue = typeof card.value === 'string';
        
        return (
          <Card key={index} className="bg-navy-800 border-gray-700 hover:border-gray-600 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">{card.title}</p>
                  <p className={`text-3xl font-bold ${card.iconColor}`}>
                    {isStringValue ? card.value : card.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                </div>
                <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${card.iconColor} w-6 h-6`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
