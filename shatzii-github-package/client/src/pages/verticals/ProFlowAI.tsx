import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Calendar, FileText, BarChart3, Target } from "lucide-react";

export default function ProFlowAI() {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Client Management AI",
      description: "Automated client relationship and project management",
      benefit: "60% client satisfaction increase"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Project Automation",
      description: "AI-powered project planning and resource allocation",
      benefit: "45% project delivery improvement"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Proposal Generation",
      description: "Automated proposal creation and contract management",
      benefit: "3x faster proposal turnaround"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Real-time business intelligence and optimization insights",
      benefit: "35% revenue increase"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Briefcase className="w-12 h-12 text-violet-600 mr-4" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              ProFlow AI
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            Professional Services Automation & Client Intelligence
          </p>
          <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
            Automate Your Professional Services
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
                <div className="bg-violet-50 dark:bg-violet-900/20 p-3 rounded-lg">
                  <p className="text-violet-700 dark:text-violet-300 font-semibold">
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