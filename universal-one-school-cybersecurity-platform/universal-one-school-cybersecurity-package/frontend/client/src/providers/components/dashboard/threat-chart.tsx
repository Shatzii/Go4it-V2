import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from 'react-chartjs-2';
import { generateThreatChartData, createThreatChartOptions } from "@/lib/charts";

export function ThreatChart() {
  const chartData = generateThreatChartData();
  const chartOptions = createThreatChartOptions();

  return (
    <Card className="lg:col-span-2 bg-navy-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white">
            Threat Activity (24h)
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-400">
              <div className="w-3 h-3 bg-security-red rounded-full mr-2"></div>
              Critical
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <div className="w-3 h-3 bg-security-amber rounded-full mr-2"></div>
              Warning
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <div className="w-3 h-3 bg-security-blue rounded-full mr-2"></div>
              Info
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
}
