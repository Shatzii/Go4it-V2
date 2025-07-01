import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, DollarSign, MapPin, Clock, TrendingUp, Fuel } from 'lucide-react';

interface LoadOpportunity {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  rate: number;
  ratePerMile: number;
  deadheadMiles: number;
  loadType: string;
  urgency: 'high' | 'medium' | 'low';
  driverPay: number;
  ownerRevenue: number;
  estimatedProfit: number;
}

interface RevenueProjections {
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
}

export default function DriverEarnings() {
  const [selectedDriver, setSelectedDriver] = useState('driver_001');
  
  const { data: loads = [], isLoading } = useQuery<LoadOpportunity[]>({
    queryKey: ['/api/truckflow/loads', selectedDriver],
    refetchInterval: 30000 // Refresh every 30 seconds for new loads
  });

  const { data: projections } = useQuery<RevenueProjections>({
    queryKey: ['/api/truckflow/projections', selectedDriver]
  });

  const { data: liveEarnings } = useQuery({
    queryKey: ['/api/truckflow/live-earnings'],
    refetchInterval: 5000 // Live updates every 5 seconds
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">TruckFlow AI - Driver Earnings</h1>
          <p className="text-gray-600">AI-optimized load matching for maximum driver revenue</p>
        </div>
        <div className="flex items-center space-x-2">
          <Truck className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-blue-600">Live Revenue Engine</span>
        </div>
      </div>

      {/* Live Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {projections ? formatCurrency(projections.daily) : formatCurrency(875)}
            </div>
            <p className="text-xs text-gray-600">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Projection</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {projections ? formatCurrency(projections.weekly) : formatCurrency(4375)}
            </div>
            <p className="text-xs text-gray-600">On track for monthly goal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Target</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {projections ? formatCurrency(projections.monthly) : formatCurrency(19250)}
            </div>
            <p className="text-xs text-gray-600">85% achieved this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Projection</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {projections ? formatCurrency(projections.annual) : formatCurrency(231000)}
            </div>
            <p className="text-xs text-gray-600">Industry-leading earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Load Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>AI-Selected High-Revenue Loads</span>
          </CardTitle>
          <CardDescription>
            Optimized for maximum driver earnings - Updated every 30 seconds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loads.slice(0, 5).map((load: LoadOpportunity) => (
              <div key={load.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getUrgencyColor(load.urgency)} text-white`}>
                      {load.urgency.toUpperCase()}
                    </Badge>
                    <span className="font-semibold text-lg">{load.loadType}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(load.driverPay)}
                    </div>
                    <div className="text-sm text-gray-600">Driver Pay</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Route</div>
                    <div className="font-medium">{load.origin}</div>
                    <div className="text-gray-500">↓</div>
                    <div className="font-medium">{load.destination}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Distance:</span>
                      <span className="font-medium">{load.distance.toLocaleString()} miles</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rate/Mile:</span>
                      <span className="font-medium">${load.ratePerMile.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Deadhead:</span>
                      <span className="font-medium">{load.deadheadMiles} miles</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Rate:</span>
                      <span className="font-medium">{formatCurrency(load.rate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Owner Revenue:</span>
                      <span className="font-medium">{formatCurrency(load.ownerRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Net Profit:</span>
                      <span className="font-bold text-green-600">{formatCurrency(load.estimatedProfit)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Est. 2 days</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Fuel className="w-4 h-4" />
                      <span>6.5 MPG</span>
                    </div>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Book This Load
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Breakdown</CardTitle>
            <CardDescription>Driver vs Owner revenue split</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Driver Earnings (65%)</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(19250)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Owner Revenue (35%)</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(10385)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Total Monthly Revenue</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(29635)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>AI optimization results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Average Rate/Mile</span>
                <span className="font-bold">$2.89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deadhead Percentage</span>
                <span className="font-bold text-green-600">8.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Load Acceptance Rate</span>
                <span className="font-bold text-green-600">94%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Miles per Week</span>
                <span className="font-bold">2,850</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue vs Industry Avg</span>
                <span className="font-bold text-green-600">+23%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}