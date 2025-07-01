import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  Zap,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  LineChart,
  PieChart,
  Activity
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PredictionModel {
  id: string;
  name: string;
  type: 'revenue' | 'market' | 'customer' | 'competitive';
  accuracy: number;
  timeframe: string;
  status: 'active' | 'training' | 'completed';
  description: string;
}

interface MarketPrediction {
  industry: string;
  currentValue: number;
  predictedValue: number;
  growthRate: number;
  confidence: number;
  timeframe: string;
  factors: string[];
}

interface RevenueForecast {
  month: string;
  predicted: number;
  conservative: number;
  optimistic: number;
  actual?: number;
}

export default function PredictiveModeling() {
  const [selectedModel, setSelectedModel] = useState<string>('revenue-forecast');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('6-months');
  const [predictions, setPredictions] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const predictionModels: PredictionModel[] = [
    {
      id: 'revenue-forecast',
      name: 'Revenue Forecasting',
      type: 'revenue',
      accuracy: 94,
      timeframe: '6 months',
      status: 'active',
      description: 'Predicts revenue growth based on sales pipeline and market trends'
    },
    {
      id: 'market-expansion',
      name: 'Market Expansion Analysis',
      type: 'market',
      accuracy: 89,
      timeframe: '12 months',
      status: 'active',
      description: 'Forecasts market opportunities and expansion potential'
    },
    {
      id: 'customer-behavior',
      name: 'Customer Behavior Prediction',
      type: 'customer',
      accuracy: 91,
      timeframe: '3 months',
      status: 'active',
      description: 'Predicts customer lifecycle and purchase behavior'
    },
    {
      id: 'competitive-analysis',
      name: 'Competitive Landscape',
      type: 'competitive',
      accuracy: 87,
      timeframe: '9 months',
      status: 'training',
      description: 'Analyzes competitive threats and opportunities'
    }
  ];

  const marketPredictions: MarketPrediction[] = [
    {
      industry: 'Healthcare AI',
      currentValue: 4200000,
      predictedValue: 6720000,
      growthRate: 60,
      confidence: 92,
      timeframe: '6 months',
      factors: ['Regulatory approval acceleration', 'Telehealth adoption', 'AI diagnostics demand']
    },
    {
      industry: 'Financial Services AI',
      currentValue: 3800000,
      predictedValue: 5510000,
      growthRate: 45,
      confidence: 89,
      timeframe: '6 months',
      factors: ['Fraud detection needs', 'Automated trading', 'Risk assessment']
    },
    {
      industry: 'Manufacturing AI',
      currentValue: 2900000,
      predictedValue: 4205000,
      growthRate: 45,
      confidence: 87,
      timeframe: '6 months',
      factors: ['Predictive maintenance', 'Supply chain optimization', 'Quality control']
    },
    {
      industry: 'Education AI',
      currentValue: 1600000,
      predictedValue: 2240000,
      growthRate: 40,
      confidence: 85,
      timeframe: '6 months',
      factors: ['Personalized learning', 'Administrative automation', 'Student analytics']
    }
  ];

  const revenueForecast: RevenueForecast[] = [
    { month: 'Jan 2025', predicted: 149000, conservative: 130000, optimistic: 168000, actual: 149000 },
    { month: 'Feb 2025', predicted: 167000, conservative: 145000, optimistic: 189000 },
    { month: 'Mar 2025', predicted: 189000, conservative: 165000, optimistic: 213000 },
    { month: 'Apr 2025', predicted: 214000, conservative: 187000, optimistic: 241000 },
    { month: 'May 2025', predicted: 243000, conservative: 212000, optimistic: 274000 },
    { month: 'Jun 2025', predicted: 276000, conservative: 241000, optimistic: 311000 },
  ];

  const generatePredictions = async () => {
    setIsGenerating(true);
    
    // Simulate AI model processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const predictionData = {
      'revenue-forecast': {
        title: 'Revenue Forecast Analysis',
        summary: 'Projected 85% revenue growth over next 6 months based on current pipeline and market trends',
        data: revenueForecast,
        insights: [
          'Strong growth trajectory with 15% month-over-month increase',
          'Healthcare and Finance verticals driving majority of growth',
          'Q2 2025 expected to exceed $650K monthly recurring revenue',
          'Conservative estimates still show 60% growth'
        ]
      },
      'market-expansion': {
        title: 'Market Expansion Opportunities',
        summary: 'Healthcare AI shows highest expansion potential with 60% projected growth',
        data: marketPredictions,
        insights: [
          'Healthcare AI market expanding rapidly due to regulatory changes',
          'Financial services showing strong demand for fraud detection',
          'Manufacturing sector ripe for predictive maintenance solutions',
          'Education market presents long-term growth opportunity'
        ]
      },
      'customer-behavior': {
        title: 'Customer Behavior Predictions',
        summary: 'Customer retention expected to increase to 96% with improved onboarding',
        data: {
          retentionRate: 94,
          predictedRetention: 96,
          churnReduction: 35,
          upsellProbability: 67
        },
        insights: [
          'Customers using 3+ AI agents have 89% higher retention',
          'Early engagement (first 30 days) predicts long-term success',
          'Enterprise customers show 78% probability of expansion',
          'SaaS model customers have 23% higher lifetime value'
        ]
      },
      'competitive-analysis': {
        title: 'Competitive Landscape Forecast',
        summary: 'Competitive advantage expected to strengthen through vertical specialization',
        data: {
          marketPosition: 'Strong',
          competitiveThreats: 'Low-Medium',
          differentiationScore: 87,
          marketShare: 12
        },
        insights: [
          'Vertical specialization creating strong competitive moats',
          'Self-hosted AI approach differentiating from cloud competitors',
          'Enterprise focus reducing direct competition with general tools',
          'Technical depth creating high switching costs'
        ]
      }
    };

    setPredictions(predictionData[selectedModel as keyof typeof predictionData]);
    setIsGenerating(false);
  };

  useEffect(() => {
    generatePredictions();
  }, [selectedModel]);

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'revenue': return <DollarSign className="w-4 h-4" />;
      case 'market': return <TrendingUp className="w-4 h-4" />;
      case 'customer': return <Users className="w-4 h-4" />;
      case 'competitive': return <Target className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'training': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-500">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="w-6 h-6 mr-2" />
            Predictive Intelligence & Future Modeling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Prediction Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {predictionModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center space-x-2">
                        {getModelIcon(model.type)}
                        <span>{model.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Timeframe</label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-months">3 Months</SelectItem>
                  <SelectItem value="6-months">6 Months</SelectItem>
                  <SelectItem value="12-months">12 Months</SelectItem>
                  <SelectItem value="24-months">24 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={generatePredictions}
                disabled={isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Predictions
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {predictionModels.map((model) => (
          <Card 
            key={model.id}
            className={`bg-slate-800 border-slate-700 cursor-pointer transition-colors ${
              selectedModel === model.id ? 'border-purple-500' : 'hover:border-slate-600'
            }`}
            onClick={() => setSelectedModel(model.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getModelIcon(model.type)}
                  <h3 className="text-sm font-medium text-white">{model.name}</h3>
                </div>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(model.status)}`} />
              </div>
              <p className="text-xs text-gray-400 mb-3">{model.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-gray-400">Accuracy: </span>
                  <span className="text-green-400">{model.accuracy}%</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {model.timeframe}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Prediction Results */}
      {predictions && (
        <div className="space-y-6">
          {/* Summary */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">{predictions.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-lg">{predictions.summary}</p>
            </CardContent>
          </Card>

          {/* Visualization */}
          {selectedModel === 'revenue-forecast' && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <LineChart className="w-5 h-5 mr-2" />
                  Revenue Forecast Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={predictions.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '6px'
                        }}
                      />
                      <Line type="monotone" dataKey="conservative" stroke="#EF4444" strokeWidth={2} name="Conservative" />
                      <Line type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={3} name="Predicted" />
                      <Line type="monotone" dataKey="optimistic" stroke="#10B981" strokeWidth={2} name="Optimistic" />
                      {predictions.data.some((d: any) => d.actual) && (
                        <Line type="monotone" dataKey="actual" stroke="#F59E0B" strokeWidth={2} name="Actual" />
                      )}
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedModel === 'market-expansion' && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Market Growth Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictions.data.map((market: MarketPrediction, index: number) => (
                    <div key={index} className="p-4 border border-slate-600 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">{market.industry}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={market.growthRate > 50 ? "default" : "secondary"}>
                            {market.growthRate > 0 ? '+' : ''}{market.growthRate}%
                          </Badge>
                          <span className="text-xs text-gray-400">{market.confidence}% confidence</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-sm text-gray-400">Current Value</div>
                          <div className="text-lg text-white">${(market.currentValue / 1000000).toFixed(1)}M</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-400">Predicted Value</div>
                          <div className="text-lg text-green-400">${(market.predictedValue / 1000000).toFixed(1)}M</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-400">Growth Rate</div>
                          <div className={`text-lg ${market.growthRate > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {market.growthRate > 0 ? <TrendingUp className="w-4 h-4 inline mr-1" /> : <TrendingDown className="w-4 h-4 inline mr-1" />}
                            {market.growthRate}%
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-400 mb-2">Growth Factors:</div>
                        <div className="flex flex-wrap gap-1">
                          {market.factors.map((factor, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Insights */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2" />
                AI-Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {predictions.insights.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-700 rounded-lg">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 flex-1">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}