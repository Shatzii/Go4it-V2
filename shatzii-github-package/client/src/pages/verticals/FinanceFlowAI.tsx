import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calculator, FileText, BarChart3, PieChart } from "lucide-react";

export default function FinanceFlowAI() {
  const metrics = {
    monthlyRevenue: 275000,
    businessesServed: 8500,
    automationLevel: 96,
    costReduction: 68
  };

  const features = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Automated Bookkeeping",
      description: "AI handles all transaction categorization and reconciliation",
      benefit: "95% accuracy, 90% time savings"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Financial Forecasting",
      description: "Predictive analytics for cash flow and growth planning",
      benefit: "85% forecast accuracy"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Tax Optimization",
      description: "Automated tax planning and compliance management",
      benefit: "Average 23% tax savings"
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Investment Analysis",
      description: "AI-powered investment recommendations and portfolio management",
      benefit: "Average 14% annual returns"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <DollarSign className="w-12 h-12 text-emerald-600 mr-4" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              FinanceFlow AI
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            Automated Financial Management & Business Intelligence
          </p>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            Optimize Your Finances
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
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                  <p className="text-emerald-700 dark:text-emerald-300 font-semibold">
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