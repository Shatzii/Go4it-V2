import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Route, MapPin, Users, BarChart3, Clock } from "lucide-react";

export default function TransFlowAI() {
  const features = [
    {
      icon: <Route className="w-6 h-6" />,
      title: "Route Intelligence",
      description: "AI-powered route optimization for public transit",
      benefit: "35% travel time reduction"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Passenger Flow Analytics",
      description: "Real-time passenger demand prediction and routing",
      benefit: "90% capacity optimization"
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "Fleet Management AI",
      description: "Autonomous vehicle scheduling and maintenance",
      benefit: "50% operational efficiency"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Schedule Optimization",
      description: "Dynamic scheduling based on demand patterns",
      benefit: "25% improved on-time performance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Car className="w-12 h-12 text-teal-600 mr-4" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              TransFlow AI
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            Transportation & Mobility Intelligence
          </p>
          <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
            Optimize Transportation Systems
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
                <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
                  <p className="text-teal-700 dark:text-teal-300 font-semibold">
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