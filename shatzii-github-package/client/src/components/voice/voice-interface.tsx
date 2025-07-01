import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Brain, 
  MessageSquare,
  Zap,
  Search,
  Users,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceCommand {
  id: string;
  phrase: string;
  action: string;
  category: string;
  description: string;
  example: string;
}

interface VoiceResponse {
  text: string;
  data?: any;
  action?: string;
  confidence: number;
}

export default function VoiceInterface() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState<VoiceResponse | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const voiceCommands: VoiceCommand[] = [
    {
      id: '1',
      phrase: 'show me healthcare prospects',
      action: 'filter_prospects',
      category: 'Data Query',
      description: 'Filter prospects by industry',
      example: 'Show me healthcare prospects with 90% conversion probability'
    },
    {
      id: '2',
      phrase: 'generate revenue report',
      action: 'generate_report',
      category: 'Analytics',
      description: 'Create detailed revenue analysis',
      example: 'Generate revenue report for last quarter'
    },
    {
      id: '3',
      phrase: 'start ai campaign',
      action: 'launch_campaign',
      category: 'Marketing',
      description: 'Launch automated marketing campaign',
      example: 'Start AI campaign for manufacturing prospects'
    },
    {
      id: '4',
      phrase: 'schedule meeting',
      action: 'schedule_meeting',
      category: 'Calendar',
      description: 'Schedule meetings with prospects',
      example: 'Schedule meeting with top 5 healthcare leads'
    },
    {
      id: '5',
      phrase: 'analyze performance',
      action: 'analyze_performance',
      category: 'Performance',
      description: 'Analyze AI agent performance metrics',
      example: 'Analyze performance of sales agents this week'
    },
    {
      id: '6',
      phrase: 'predict market trends',
      action: 'predict_trends',
      category: 'Predictive',
      description: 'Generate market trend predictions',
      example: 'Predict market trends for fintech industry'
    }
  ];

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setResponse(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        setTranscript(transcript);
        setConfidence(confidence * 100);
        processVoiceCommand(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or check microphone permissions",
          variant: "destructive",
        });
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive",
      });
    }
  }, []);

  const processVoiceCommand = async (transcript: string) => {
    setIsProcessing(true);
    
    try {
      // Match command with available actions
      const matchedCommand = voiceCommands.find(cmd => 
        transcript.toLowerCase().includes(cmd.phrase.toLowerCase())
      );

      if (matchedCommand) {
        const response = await executeVoiceCommand(matchedCommand, transcript);
        setResponse(response);
        
        if (audioEnabled) {
          speakResponse(response.text);
        }
      } else {
        // Use AI to interpret natural language
        const aiResponse = await processNaturalLanguage(transcript);
        setResponse(aiResponse);
        
        if (audioEnabled) {
          speakResponse(aiResponse.text);
        }
      }
    } catch (error) {
      const errorResponse = {
        text: "I'm sorry, I couldn't process that command. Please try again.",
        confidence: 0
      };
      setResponse(errorResponse);
      
      if (audioEnabled) {
        speakResponse(errorResponse.text);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const executeVoiceCommand = async (command: VoiceCommand, transcript: string): Promise<VoiceResponse> => {
    // Simulate AI processing based on command type
    await new Promise(resolve => setTimeout(resolve, 1500));

    switch (command.action) {
      case 'filter_prospects':
        return {
          text: "I found 47 healthcare prospects with an average conversion probability of 87%. The top 5 prospects are ready for immediate outreach.",
          data: {
            count: 47,
            avgConversion: 87,
            topProspects: 5
          },
          action: 'navigate_prospects',
          confidence: 95
        };

      case 'generate_report':
        return {
          text: "Revenue report generated successfully. Total revenue for last quarter: $2.3 million, with a 23% increase from previous quarter.",
          data: {
            revenue: 2300000,
            growth: 23,
            period: 'Q4 2024'
          },
          action: 'show_report',
          confidence: 98
        };

      case 'launch_campaign':
        return {
          text: "AI marketing campaign launched for manufacturing prospects. Expected to reach 1,200 targets with projected 15% engagement rate.",
          data: {
            targets: 1200,
            expectedEngagement: 15,
            campaignId: 'MFG-2025-001'
          },
          action: 'monitor_campaign',
          confidence: 92
        };

      case 'schedule_meeting':
        return {
          text: "5 meetings scheduled with top healthcare leads for next week. Calendar invites sent automatically.",
          data: {
            meetingsScheduled: 5,
            week: 'next',
            industry: 'healthcare'
          },
          action: 'view_calendar',
          confidence: 89
        };

      case 'analyze_performance':
        return {
          text: "Sales agent performance analysis complete. Average close rate: 34%, top performer: Agent Alpha with 67% close rate.",
          data: {
            avgCloseRate: 34,
            topPerformer: 'Agent Alpha',
            topPerformanceRate: 67
          },
          action: 'show_performance',
          confidence: 96
        };

      case 'predict_trends':
        return {
          text: "Market trend analysis shows 45% growth predicted for fintech AI solutions in next 6 months, driven by regulatory compliance needs.",
          data: {
            growth: 45,
            timeframe: '6 months',
            driver: 'regulatory compliance'
          },
          action: 'show_predictions',
          confidence: 91
        };

      default:
        return {
          text: "Command recognized but action not yet implemented. We're continuously expanding voice capabilities.",
          confidence: 75
        };
    }
  };

  const processNaturalLanguage = async (transcript: string): Promise<VoiceResponse> => {
    // Simulate AI natural language processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simple keyword matching for demo purposes
    const keywords = {
      'revenue': () => ({
        text: "Current monthly recurring revenue is $149,000 across all verticals. Would you like a detailed breakdown?",
        confidence: 85
      }),
      'agents': () => ({
        text: "We have 202 active AI agents across 13 industry verticals. All agents are performing optimally.",
        confidence: 88
      }),
      'customers': () => ({
        text: "We have 1,247 active customers with 94% satisfaction rate. 67 new customers this month.",
        confidence: 90
      }),
      'help': () => ({
        text: "I can help you with prospect management, revenue analytics, campaign launches, and performance monitoring. Just speak naturally!",
        confidence: 95
      })
    };

    for (const [keyword, response] of Object.entries(keywords)) {
      if (transcript.toLowerCase().includes(keyword)) {
        return response();
      }
    }

    return {
      text: `I heard "${transcript}" but I'm still learning this command. Try asking about prospects, revenue, campaigns, or performance.`,
      confidence: 60
    };
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Interface Header */}
      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-500">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="w-6 h-6 mr-2" />
            Shatzii AI Voice Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                {isListening ? 'Stop Listening' : 'Start Voice Command'}
              </Button>
              
              <Button
                onClick={() => setAudioEnabled(!audioEnabled)}
                variant="outline"
                size="sm"
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-300">
                Status: {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Ready'}
              </div>
              {confidence > 0 && (
                <div className="text-xs text-gray-400">
                  Confidence: {confidence.toFixed(0)}%
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Transcript & Response */}
      {(transcript || response) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transcript && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  You said:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">"{transcript}"</p>
                {confidence > 0 && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Recognition Confidence</span>
                      <span>{confidence.toFixed(0)}%</span>
                    </div>
                    <Progress value={confidence} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {response && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  Shatzii AI Response:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-2">"{response.text}"</p>
                {response.data && (
                  <div className="text-xs text-gray-400 bg-slate-700 p-2 rounded">
                    <pre>{JSON.stringify(response.data, null, 2)}</pre>
                  </div>
                )}
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>AI Confidence</span>
                    <span>{response.confidence}%</span>
                  </div>
                  <Progress value={response.confidence} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Available Voice Commands */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Available Voice Commands
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {voiceCommands.map((command) => (
              <div
                key={command.id}
                className="p-3 border border-slate-600 rounded-lg hover:border-purple-500 transition-colors cursor-pointer"
                onClick={() => {
                  setTranscript(command.example);
                  processVoiceCommand(command.example);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {command.category}
                  </Badge>
                  {command.category === 'Data Query' && <Search className="w-3 h-3 text-blue-400" />}
                  {command.category === 'Analytics' && <TrendingUp className="w-3 h-3 text-green-400" />}
                  {command.category === 'Marketing' && <Zap className="w-3 h-3 text-yellow-400" />}
                  {command.category === 'Calendar' && <Users className="w-3 h-3 text-purple-400" />}
                </div>
                <h3 className="font-medium text-white text-sm mb-1">{command.phrase}</h3>
                <p className="text-xs text-gray-400 mb-2">{command.description}</p>
                <p className="text-xs text-gray-500 italic">"{command.example}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Voice Tips */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">Voice Assistant Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <h4 className="text-white mb-2">Natural Language Examples:</h4>
              <ul className="space-y-1">
                <li>"Show me all healthcare prospects"</li>
                <li>"What's our revenue this month?"</li>
                <li>"How are our AI agents performing?"</li>
                <li>"Schedule meetings with top leads"</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-2">Pro Tips:</h4>
              <ul className="space-y-1">
                <li>Speak clearly and at normal pace</li>
                <li>Use specific industry terms</li>
                <li>Include time periods for reports</li>
                <li>Ask follow-up questions naturally</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}