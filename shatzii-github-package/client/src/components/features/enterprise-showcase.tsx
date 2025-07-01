import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Brain, 
  Zap, 
  Globe,
  Building,
  Calendar,
  Clock,
  Award,
  Lightbulb,
  PieChart,
  BarChart3,
  LineChart,
  ArrowUpRight,
  CheckCircle2,
  Star
} from "lucide-react";

interface EnterpriseMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface ROICalculation {
  timePeriod: string;
  investment: number;
  returns: number;
  roi: number;
  savings: number;
}

interface ClientSuccess {
  company: string;
  industry: string;
  results: {
    revenueIncrease: number;
    efficiencyGain: number;
    costReduction: number;
    timeframe: string;
  };
  testimonial: string;
}

export default function EnterpriseShowcase() {
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<EnterpriseMetric[]>([]);
  const [roiData, setROIData] = useState<ROICalculation[]>([]);
  const [clientSuccesses, setClientSuccesses] = useState<ClientSuccess[]>([]);

  useEffect(() => {
    // Initialize enterprise metrics
    setMetrics([
      { label: "Revenue Growth", value: "347%", change: "+23%", trend: "up", color: "text-emerald-400" },
      { label: "Cost Reduction", value: "68%", change: "+12%", trend: "up", color: "text-blue-400" },
      { label: "Process Efficiency", value: "91%", change: "+18%", trend: "up", color: "text-purple-400" },
      { label: "Customer Satisfaction", value: "96%", change: "+8%", trend: "up", color: "text-cyan-400" },
      { label: "Market Response Time", value: "87%", change: "+31%", trend: "up", color: "text-orange-400" },
      { label: "Competitive Advantage", value: "94%", change: "+45%", trend: "up", color: "text-pink-400" }
    ]);

    setROIData([
      { timePeriod: "Month 1", investment: 50000, returns: 125000, roi: 150, savings: 75000 },
      { timePeriod: "Month 3", investment: 50000, returns: 285000, roi: 470, savings: 235000 },
      { timePeriod: "Month 6", investment: 50000, returns: 520000, roi: 940, savings: 470000 },
      { timePeriod: "Year 1", investment: 50000, returns: 1250000, roi: 2400, savings: 1200000 }
    ]);

    setClientSuccesses([
      {
        company: "TechCorp Global",
        industry: "Technology",
        results: { revenueIncrease: 425, efficiencyGain: 78, costReduction: 54, timeframe: "6 months" },
        testimonial: "Shatzii's AI agents transformed our entire business model. The autonomous marketing and sales operations delivered results we never thought possible."
      },
      {
        company: "Manufacturing Excellence",
        industry: "Manufacturing",
        results: { revenueIncrease: 312, efficiencyGain: 89, costReduction: 67, timeframe: "8 months" },
        testimonial: "The AI control center gave us unprecedented visibility and control over our operations. ROI exceeded expectations by 300%."
      },
      {
        company: "Financial Innovations",
        industry: "Finance",
        results: { revenueIncrease: 234, efficiencyGain: 92, costReduction: 43, timeframe: "4 months" },
        testimonial: "Game-changing technology. The autonomous agents work 24/7, delivering consistent results that our human teams couldn't match."
      }
    ]);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-4 w-4 text-green-400" />;
      case 'down': return <ArrowUpRight className="h-4 w-4 text-red-400 rotate-180" />;
      default: return <ArrowUpRight className="h-4 w-4 text-yellow-400 rotate-90" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Enterprise Header */}
      <Card className="bg-gradient-to-r from-slate-900/90 to-cyan-900/90 border-cyan-500/30">
        <CardContent className="p-8">
          <div className="text-center">
            <Building className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">Enterprise AI Transformation</h2>
            <p className="text-slate-300 text-lg mb-6">
              Witness how Fortune 500 companies leverage autonomous AI agents to dominate their markets
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-1">$2.4M+</div>
                <div className="text-slate-400">Average Annual ROI</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">89%</div>
                <div className="text-slate-400">Process Automation</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">24/7</div>
                <div className="text-slate-400">Autonomous Operations</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-cyan-500/20 grid grid-cols-4 w-full">
          <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600">
            Business Impact
          </TabsTrigger>
          <TabsTrigger value="roi" className="data-[state=active]:bg-cyan-600">
            ROI Analysis
          </TabsTrigger>
          <TabsTrigger value="success" className="data-[state=active]:bg-cyan-600">
            Client Success
          </TabsTrigger>
          <TabsTrigger value="capabilities" className="data-[state=active]:bg-cyan-600">
            AI Capabilities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-slate-900/80 border-cyan-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">{metric.label}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="flex items-end gap-2">
                    <span className={`text-2xl font-bold ${metric.color}`}>
                      {metric.value}
                    </span>
                    <span className="text-green-400 text-sm mb-1">
                      {metric.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Business Value Propositions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900/80 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-emerald-400 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Acceleration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Autonomous lead generation 24/7</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Intelligent deal optimization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Predictive sales forecasting</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Cross-sell/upsell automation</span>
                  </div>
                </div>
                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">347%</div>
                    <div className="text-slate-400 text-sm">Average revenue increase</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Operational Excellence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Process automation at scale</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Real-time decision making</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Resource optimization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">Quality assurance automation</span>
                  </div>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">89%</div>
                    <div className="text-slate-400 text-sm">Process efficiency gain</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roi" className="space-y-6">
          <Card className="bg-slate-900/80 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Return on Investment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {roiData.map((period, index) => (
                  <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-slate-400 text-sm">Time Period</div>
                        <div className="text-lg font-semibold text-cyan-400">{period.timePeriod}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">Investment</div>
                        <div className="text-lg font-semibold text-slate-300">
                          ${period.investment.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">Returns</div>
                        <div className="text-lg font-semibold text-emerald-400">
                          ${period.returns.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm">ROI</div>
                        <div className="text-xl font-bold text-green-400">{period.roi}%</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-400 text-sm">ROI Progress</span>
                        <span className="text-green-400 text-sm">{period.roi}%</span>
                      </div>
                      <Progress value={Math.min(period.roi / 25, 100)} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-lg border border-emerald-500/20">
                <div className="text-center">
                  <Award className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">Projected 5-Year ROI</h3>
                  <div className="text-4xl font-bold text-emerald-400 mb-2">4,850%</div>
                  <p className="text-slate-300">Based on current performance metrics and growth trajectory</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="success" className="space-y-6">
          <div className="space-y-6">
            {clientSuccesses.map((client, index) => (
              <Card key={index} className="bg-slate-900/80 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {client.company}
                    </div>
                    <Badge variant="outline" className="border-cyan-500/20 text-cyan-400">
                      {client.industry}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-emerald-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-400">
                        +{client.results.revenueIncrease}%
                      </div>
                      <div className="text-slate-400 text-sm">Revenue Increase</div>
                    </div>
                    <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        +{client.results.efficiencyGain}%
                      </div>
                      <div className="text-slate-400 text-sm">Efficiency Gain</div>
                    </div>
                    <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">
                        -{client.results.costReduction}%
                      </div>
                      <div className="text-slate-400 text-sm">Cost Reduction</div>
                    </div>
                    <div className="text-center p-4 bg-cyan-500/10 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-400">
                        {client.results.timeframe}
                      </div>
                      <div className="text-slate-400 text-sm">Implementation</div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-cyan-500">
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-yellow-400 mt-1" />
                      <div>
                        <p className="text-slate-300 italic">"{client.testimonial}"</p>
                        <p className="text-slate-500 text-sm mt-2">— {client.company} Executive Team</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-900/80 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Cognitive Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Natural language processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Pattern recognition</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Predictive analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Decision optimization</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Market Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Competitive analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Trend identification</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Customer insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Market forecasting</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Innovation Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Solution generation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Process optimization</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Strategy development</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Innovation discovery</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-slate-900/90 to-purple-900/90 border-purple-500/30">
            <CardContent className="p-8 text-center">
              <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-purple-400 mb-4">Enterprise AI Transformation</h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Deploy autonomous AI agents that work 24/7 to drive revenue, optimize operations, 
                and maintain competitive advantage in today's digital marketplace.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
                Schedule Enterprise Demo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}