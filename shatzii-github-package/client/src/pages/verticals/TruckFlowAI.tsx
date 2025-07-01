import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Truck, Route, BarChart3, FileText, DollarSign, Clock, TrendingUp } from "lucide-react";

export default function TruckFlowAI() {
  const [activeTab, setActiveTab] = useState("overview");

  const roi = {
    monthlyRevenue: 850000,
    costSavings: 425000,
    efficiency: 85,
    paybackPeriod: "3 weeks"
  };

  const features = [
    {
      icon: <Route className="w-6 h-6" />,
      title: "Autonomous Dispatch",
      description: "AI assigns optimal loads automatically",
      benefit: "40% utilization increase",
      status: "active"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-Time Route Optimization",
      description: "Dynamic routing based on traffic, weather, fuel",
      benefit: "25% fuel cost reduction",
      status: "active"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "DOT Compliance Automation",
      description: "Electronic logs and inspection records",
      benefit: "10+ hours saved weekly",
      status: "active"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Driver safety and efficiency tracking",
      benefit: "60% safety improvement",
      status: "active"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Truck className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              TruckFlow AI
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            Revolutionizing the $800B Logistics Industry with Autonomous Operations
          </p>
          <div className="flex justify-center space-x-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2">
              <DollarSign className="w-4 h-4 mr-2" />
              ${roi.monthlyRevenue.toLocaleString()}/month revenue
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              {roi.paybackPeriod} payback period
            </Badge>
          </div>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Start Free Route Analysis
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    {feature.icon}
                    <span className="ml-3">{feature.title}</span>
                  </div>
                  <Badge variant={feature.status === "active" ? "default" : "secondary"}>
                    {feature.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {feature.description}
                </p>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-green-700 dark:text-green-300 font-semibold">
                    {feature.benefit}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Fleet?</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Join hundreds of fleets already saving millions with TruckFlow AI automation
              </p>
              <div className="flex justify-center space-x-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Free Analysis
                </Button>
                <Button size="lg" variant="outline">
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}