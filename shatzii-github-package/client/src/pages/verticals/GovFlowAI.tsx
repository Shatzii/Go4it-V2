import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, FileText, Users, Clock, Shield, Database } from "lucide-react";

export default function GovFlowAI() {
  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Document Processing",
      description: "AI automates permit processing and form handling",
      benefit: "75% faster processing"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Citizen Services AI",
      description: "Automated citizen request routing and response",
      benefit: "90% satisfaction rate"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Management",
      description: "Intelligent data organization and analysis",
      benefit: "95% accuracy improvement"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Compliance Monitoring",
      description: "Automated regulatory compliance tracking",
      benefit: "100% compliance rate"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Building className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              GovFlow AI
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            Government Efficiency & Citizen Services Automation
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Modernize Government Operations
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
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300 font-semibold">
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