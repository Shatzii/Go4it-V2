import { useLiveMetrics } from "@/hooks/use-live-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, DollarSign, Users, Activity, Zap } from "lucide-react";

export default function LiveDashboard() {
  const { metrics, events, isConnected } = useLiveMetrics();

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Live AI Operations</h3>
        <Badge variant={isConnected ? "default" : "secondary"} className={isConnected ? "bg-green-600" : "bg-gray-600"}>
          <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></div>
          {isConnected ? "Live" : "Simulated"}
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Leads Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.leadsGenerated}</div>
            <div className="text-xs text-green-400">+{Math.floor(metrics.leadsGenerated * 0.08)} this hour</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Deals Won</CardTitle>
              <Target className="h-4 w-4 text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.dealsWon}</div>
            <div className="text-xs text-cyan-400">{metrics.conversionRate}% win rate</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${(metrics.revenue / 1000).toFixed(0)}K</div>
            <div className="text-xs text-purple-400">This month</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">AI Agents</CardTitle>
              <Users className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.activeAgents}</div>
            <div className="text-xs text-orange-400">24/7 active</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Campaigns</CardTitle>
              <Activity className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.campaignsActive}</div>
            <div className="text-xs text-blue-400">Running</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Efficiency</CardTitle>
              <Zap className="h-4 w-4 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">96%</div>
            <div className="text-xs text-yellow-400">Automation rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent AI Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {events.slice(0, 10).map((event, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">
                    {event.type === 'leadGenerated' && `New lead generated from ${event.data?.source || 'AI prospecting'}`}
                    {event.type === 'dealWon' && `Deal closed: $${event.data?.value || '25,000'}`}
                    {event.type === 'metricsUpdated' && 'Metrics updated'}
                    {event.type === 'connected' && 'Connected to live stream'}
                  </span>
                </div>
                <span className="text-gray-500 text-xs">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-gray-400 text-center py-4">
                AI agents are initializing... Events will appear here shortly.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}