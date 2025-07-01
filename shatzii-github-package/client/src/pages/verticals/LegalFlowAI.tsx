import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, FileText, Search, Clock, Shield, Gavel } from "lucide-react";

export default function LegalFlowAI() {
  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Document Automation",
      description: "AI generates contracts, briefs, and legal documents",
      benefit: "80% faster document creation"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Legal Research AI",
      description: "Instant case law and precedent analysis",
      benefit: "95% research accuracy"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Billing Optimization",
      description: "Automated time tracking and billing management",
      benefit: "35% revenue increase"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Compliance Monitoring",
      description: "Real-time regulatory compliance tracking",
      benefit: "100% compliance rate"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Scale className="w-12 h-12 text-indigo-600 mr-4" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              LegalFlow AI
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            AI-Powered Legal Practice Automation
          </p>
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            Automate Your Practice
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
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                  <p className="text-indigo-700 dark:text-indigo-300 font-semibold">
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