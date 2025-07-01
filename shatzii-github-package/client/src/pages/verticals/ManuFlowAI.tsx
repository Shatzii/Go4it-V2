import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Factory, Cog, BarChart3, Wrench, Package, Activity } from "lucide-react";

export default function ManuFlowAI() {
  const features = [
    {
      icon: <Cog className="w-6 h-6" />,
      title: "Production Optimization",
      description: "AI optimizes manufacturing workflows and efficiency",
      benefit: "35% production increase"
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "Predictive Maintenance",
      description: "AI predicts equipment failures before they occur",
      benefit: "75% downtime reduction"
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Supply Chain Intelligence",
      description: "Automated inventory and supplier management",
      benefit: "40% cost reduction"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Quality Control AI",
      description: "Real-time quality monitoring and defect detection",
      benefit: "99.5% quality accuracy"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Factory className="w-12 h-12 text-gray-600 mr-4" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              ManuFlow AI
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            Smart Manufacturing & Production Automation
          </p>
          <Button size="lg" className="bg-gray-600 hover:bg-gray-700">
            Optimize Your Manufacturing
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
                <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">
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