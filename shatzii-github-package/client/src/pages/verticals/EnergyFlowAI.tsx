import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Battery, Wind, Sun, BarChart3, Leaf } from "lucide-react";

export default function EnergyFlowAI() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Grid Optimization",
      description: "AI optimizes energy distribution and load balancing",
      benefit: "30% efficiency increase"
    },
    {
      icon: <Sun className="w-6 h-6" />,
      title: "Renewable Integration",
      description: "Smart integration of solar, wind, and renewable sources",
      benefit: "50% renewable adoption"
    },
    {
      icon: <Battery className="w-6 h-6" />,
      title: "Energy Storage Management",
      description: "Intelligent battery and storage system optimization",
      benefit: "40% storage efficiency"
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Carbon Reduction AI",
      description: "Automated carbon footprint tracking and reduction",
      benefit: "60% emissions reduction"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-12 h-12 text-yellow-600 mr-4" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              EnergyFlow AI
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            Smart Grid & Renewable Energy Automation
          </p>
          <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700">
            Optimize Your Energy Systems
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {feature.icon}
                  <span className="ml-3">{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {feature.description}
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <p className="text-yellow-700 dark:text-yellow-300 font-semibold">
                    {feature.benefit}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}