import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Search, DollarSign, Camera, MapPin, TrendingUp } from "lucide-react";

export default function RealtyFlowAI() {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Property Valuation AI",
      description: "Instant accurate property valuations using market data",
      benefit: "95% valuation accuracy"
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Virtual Tour Generation",
      description: "AI creates immersive virtual property tours",
      benefit: "60% more qualified leads"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Market Analysis Engine",
      description: "Real-time neighborhood and market trend analysis",
      benefit: "Superior market insights"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Lead Management",
      description: "Automated lead qualification and nurturing",
      benefit: "3x conversion rate"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Home className="w-12 h-12 text-orange-600 mr-4" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              RealtyFlow AI
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            Real Estate Automation & Market Intelligence
          </p>
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
            Automate Your Real Estate Business
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
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <p className="text-orange-700 dark:text-orange-300 font-semibold">
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