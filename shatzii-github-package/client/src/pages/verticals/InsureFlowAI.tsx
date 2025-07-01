import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, FileCheck, Calculator, Users, TrendingDown } from "lucide-react";

export default function InsureFlowAI() {
  const features = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Claims Processing AI",
      description: "Automated claims assessment and fraud detection",
      benefit: "90% faster processing"
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Risk Assessment Engine",
      description: "AI-powered risk analysis and premium optimization",
      benefit: "35% risk reduction"
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: "Policy Management",
      description: "Automated policy creation and renewal processing",
      benefit: "85% efficiency gain"
    },
    {
      icon: <TrendingDown className="w-6 h-6" />,
      title: "Loss Prevention AI",
      description: "Predictive analytics for loss prevention strategies",
      benefit: "40% loss reduction"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-red-600 mr-4" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              InsureFlow AI
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            Insurance Automation & Risk Intelligence
          </p>
          <Button size="lg" className="bg-red-600 hover:bg-red-700">
            Modernize Your Insurance Operations
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
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 font-semibold">
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