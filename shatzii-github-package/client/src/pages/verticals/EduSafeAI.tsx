import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, AlertTriangle, BarChart3, DollarSign, Brain } from "lucide-react";

export default function EduSafeAI() {
  const metrics = {
    monthlyRevenue: 185000,
    studentsProtected: 250000,
    incidentPrevention: 94,
    schoolsServed: 1250
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Behavioral Pattern Recognition",
      description: "AI analyzes student digital behavior to predict risks",
      benefit: "94% incident prevention rate"
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Real-Time Crisis Intervention",
      description: "Immediate alerts for self-harm indicators",
      benefit: "Sub-60 second response time"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy-First Monitoring",
      description: "FERPA compliant student safety monitoring",
      benefit: "100% privacy compliance"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Family Communication Portal",
      description: "Automated family notifications and resources",
      benefit: "85% family engagement rate"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-green-600 mr-4" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              EduSafe AI
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
            Revolutionary Student Safety Technology - Predicting and Preventing Self-Harm
          </p>
          <div className="flex justify-center space-x-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2">
              <DollarSign className="w-4 h-4 mr-2" />
              ${metrics.monthlyRevenue.toLocaleString()}/month revenue
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              {metrics.studentsProtected.toLocaleString()} students protected
            </Badge>
          </div>
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Protect Your Students Today
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{metrics.incidentPrevention}%</div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Incident Prevention</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{metrics.studentsProtected.toLocaleString()}</div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Students Protected</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{metrics.schoolsServed}</div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Schools Served</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">&lt;60s</div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Response Time</p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-green-700 dark:text-green-300 font-semibold">
                    {feature.benefit}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Protect Every Student</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Revolutionary AI technology saving lives through predictive intervention
              </p>
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Start Student Protection
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}