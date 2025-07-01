import { useState, useEffect } from "react";
import { Activity, Zap, TrendingUp, Shield } from "lucide-react";

interface PerformanceMetric {
  label: string;
  value: number;
  unit: string;
  icon: React.ComponentType<any>;
  trend: "up" | "down";
  color: string;
}

export default function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      label: "API Response Time",
      value: 0,
      unit: "ms",
      icon: Zap,
      trend: "down",
      color: "text-green-500"
    },
    {
      label: "System Load",
      value: 0,
      unit: "%",
      icon: Activity,
      trend: "down",
      color: "text-blue-500"
    },
    {
      label: "Uptime",
      value: 0,
      unit: "%",
      icon: TrendingUp,
      trend: "up",
      color: "text-purple-500"
    },
    {
      label: "Security Score",
      value: 0,
      unit: "/100",
      icon: Shield,
      trend: "up",
      color: "text-emerald-500"
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.label === "API Response Time" 
          ? Math.floor(Math.random() * 50) + 15
          : metric.label === "System Load"
          ? Math.floor(Math.random() * 30) + 10
          : metric.label === "Uptime"
          ? 99.9 + Math.random() * 0.09
          : 95 + Math.random() * 5
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className="glass-morphism p-4 rounded-xl modern-card-hover"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className={`w-5 h-5 ${metric.color}`} />
              <div className={`text-xs px-2 py-1 rounded-full ${
                metric.trend === "up" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
              }`}>
                {metric.trend === "up" ? "↗" : "↘"}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.label === "Uptime" ? metric.value.toFixed(2) : Math.floor(metric.value)}
              <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
            </div>
            <div className="text-xs text-gray-600">{metric.label}</div>
          </div>
        );
      })}
    </div>
  );
}