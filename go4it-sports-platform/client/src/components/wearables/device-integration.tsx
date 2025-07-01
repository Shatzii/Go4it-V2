import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Watch,
  Heart,
  Activity,
  Zap,
  Thermometer,
  Wifi,
  WifiOff,
  Battery,
  Bluetooth,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Smartphone,
  Play,
  Pause,
  Square
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WearableDevice {
  id: string;
  name: string;
  type: 'fitness_tracker' | 'heart_rate_monitor' | 'smart_watch' | 'gps_watch' | 'smart_equipment';
  brand: string;
  model: string;
  isConnected: boolean;
  batteryLevel: number;
  lastSync: string;
  capabilities: string[];
  status: 'active' | 'syncing' | 'disconnected' | 'error';
}

interface BiometricReading {
  timestamp: string;
  heartRate: number;
  steps: number;
  calories: number;
  distance: number;
  activeMinutes: number;
  restingHeartRate: number;
  hrZones: {
    zone1: number; // Fat burn
    zone2: number; // Cardio
    zone3: number; // Peak
  };
  temperature: number;
  stress: number;
  recovery: number;
}

interface WorkoutSession {
  id: string;
  type: string;
  startTime: string;
  duration: number;
  avgHeartRate: number;
  maxHeartRate: number;
  calories: number;
  distance?: number;
  pace?: string;
  garScore?: number;
  zones: {
    zone1: number;
    zone2: number;
    zone3: number;
  };
  isLive: boolean;
}

interface DeviceIntegrationProps {
  onDataReceived: (data: BiometricReading) => void;
  onWorkoutComplete: (session: WorkoutSession) => void;
}

export default function DeviceIntegration({ onDataReceived, onWorkoutComplete }: DeviceIntegrationProps) {
  const [connectedDevices, setConnectedDevices] = useState<WearableDevice[]>([]);
  const [currentReading, setCurrentReading] = useState<BiometricReading | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [realTimeMode, setRealTimeMode] = useState(false);

  // Sample connected devices
  const sampleDevices: WearableDevice[] = [
    {
      id: '1',
      name: 'Apple Watch Series 9',
      type: 'smart_watch',
      brand: 'Apple',
      model: 'Series 9',
      isConnected: true,
      batteryLevel: 78,
      lastSync: '2 minutes ago',
      capabilities: ['heart_rate', 'gps', 'accelerometer', 'gyroscope', 'temperature'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Polar H10',
      type: 'heart_rate_monitor',
      brand: 'Polar',
      model: 'H10',
      isConnected: true,
      batteryLevel: 92,
      lastSync: '1 minute ago',
      capabilities: ['heart_rate', 'hrv', 'running_dynamics'],
      status: 'active'
    },
    {
      id: '3',
      name: 'Garmin HRM-Pro',
      type: 'heart_rate_monitor',
      brand: 'Garmin',
      model: 'HRM-Pro',
      isConnected: false,
      batteryLevel: 45,
      lastSync: '2 hours ago',
      capabilities: ['heart_rate', 'running_dynamics', 'swimming'],
      status: 'disconnected'
    }
  ];

  // Simulate real-time data
  useEffect(() => {
    if (realTimeMode && connectedDevices.length > 0) {
      const interval = setInterval(() => {
        const newReading: BiometricReading = {
          timestamp: new Date().toISOString(),
          heartRate: 70 + Math.floor(Math.random() * 80),
          steps: 8547 + Math.floor(Math.random() * 50),
          calories: 456 + Math.floor(Math.random() * 20),
          distance: 3.2 + Math.random() * 0.5,
          activeMinutes: 45 + Math.floor(Math.random() * 10),
          restingHeartRate: 58 + Math.floor(Math.random() * 8),
          hrZones: {
            zone1: 15 + Math.floor(Math.random() * 10),
            zone2: 25 + Math.floor(Math.random() * 15),
            zone3: 5 + Math.floor(Math.random() * 8)
          },
          temperature: 98.2 + Math.random() * 2,
          stress: 35 + Math.floor(Math.random() * 30),
          recovery: 75 + Math.floor(Math.random() * 20)
        };
        setCurrentReading(newReading);
        onDataReceived(newReading);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [realTimeMode, connectedDevices, onDataReceived]);

  useEffect(() => {
    setConnectedDevices(sampleDevices);
    if (sampleDevices.length > 0) {
      setCurrentReading({
        timestamp: new Date().toISOString(),
        heartRate: 72,
        steps: 8547,
        calories: 456,
        distance: 3.2,
        activeMinutes: 45,
        restingHeartRate: 62,
        hrZones: {
          zone1: 20,
          zone2: 35,
          zone3: 8
        },
        temperature: 98.6,
        stress: 28,
        recovery: 85
      });
    }
  }, []);

  const handleDeviceConnection = async (deviceId: string) => {
    setIsScanning(true);
    
    setTimeout(() => {
      setConnectedDevices(prev => 
        prev.map(device => 
          device.id === deviceId 
            ? { ...device, isConnected: !device.isConnected, status: device.isConnected ? 'disconnected' : 'active' }
            : device
        )
      );
      setIsScanning(false);
    }, 2000);
  };

  const startWorkout = (type: string) => {
    const newWorkout: WorkoutSession = {
      id: Date.now().toString(),
      type,
      startTime: new Date().toISOString(),
      duration: 0,
      avgHeartRate: 0,
      maxHeartRate: 0,
      calories: 0,
      zones: { zone1: 0, zone2: 0, zone3: 0 },
      isLive: true
    };
    setActiveWorkout(newWorkout);
    setRealTimeMode(true);
  };

  const stopWorkout = () => {
    if (activeWorkout) {
      const completedWorkout = {
        ...activeWorkout,
        duration: Math.floor((new Date().getTime() - new Date(activeWorkout.startTime).getTime()) / 1000),
        avgHeartRate: currentReading?.heartRate || 0,
        maxHeartRate: (currentReading?.heartRate || 0) + 20,
        calories: currentReading?.calories || 0,
        isLive: false,
        garScore: 85.5
      };
      onWorkoutComplete(completedWorkout);
      setActiveWorkout(null);
      setRealTimeMode(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smart_watch': return Watch;
      case 'heart_rate_monitor': return Heart;
      case 'fitness_tracker': return Activity;
      case 'gps_watch': return Target;
      default: return Watch;
    }
  };

  const renderDeviceList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Connected Devices</h3>
        <Button
          onClick={() => setIsScanning(true)}
          disabled={isScanning}
          size="sm"
        >
          {isScanning ? (
            <>
              <Bluetooth className="w-4 h-4 mr-2 animate-pulse" />
              Scanning...
            </>
          ) : (
            <>
              <Bluetooth className="w-4 h-4 mr-2" />
              Scan for Devices
            </>
          )}
        </Button>
      </div>

      {connectedDevices.map((device) => {
        const DeviceIcon = getDeviceIcon(device.type);
        return (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  device.isConnected ? "bg-blue-100" : "bg-gray-100"
                )}>
                  <DeviceIcon className={cn(
                    "w-6 h-6",
                    device.isConnected ? "text-blue-600" : "text-gray-400"
                  )} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{device.name}</h4>
                    <Badge
                      variant={device.isConnected ? "default" : "secondary"}
                      className={cn(
                        device.isConnected && "bg-green-100 text-green-700"
                      )}
                    >
                      {device.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{device.brand} {device.model}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Battery className="w-3 h-3" />
                      {device.batteryLevel}%
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {device.lastSync}
                    </div>
                  </div>
                </div>
              </div>
              <Switch
                checked={device.isConnected}
                onCheckedChange={() => handleDeviceConnection(device.id)}
              />
            </div>
            
            {device.isConnected && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-xs text-gray-600 mb-2">Capabilities:</div>
                <div className="flex flex-wrap gap-1">
                  {device.capabilities.map((capability) => (
                    <Badge key={capability} variant="outline" className="text-xs">
                      {capability.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );

  const renderRealTimeData = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Real-time Biometrics</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm">Live Mode</span>
          <Switch
            checked={realTimeMode}
            onCheckedChange={setRealTimeMode}
          />
        </div>
      </div>

      {currentReading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{currentReading.heartRate}</div>
              <div className="text-sm text-gray-600">BPM</div>
              <div className="text-xs text-gray-500 mt-1">
                Rest: {currentReading.restingHeartRate}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{currentReading.steps.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Steps</div>
              <div className="text-xs text-gray-500 mt-1">
                {currentReading.distance.toFixed(1)} miles
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{currentReading.calories}</div>
              <div className="text-sm text-gray-600">Calories</div>
              <div className="text-xs text-gray-500 mt-1">
                {currentReading.activeMinutes} active min
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Thermometer className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{currentReading.temperature.toFixed(1)}°</div>
              <div className="text-sm text-gray-600">Body Temp</div>
              <div className="text-xs text-gray-500 mt-1">
                Stress: {currentReading.stress}%
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-4" />
          <p>No real-time data available</p>
          <p className="text-sm">Connect a device and enable live mode</p>
        </div>
      )}

      {currentReading && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Heart Rate Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Fat Burn Zone</span>
                  <span className="text-sm font-medium">{currentReading.hrZones.zone1} min</span>
                </div>
                <Progress value={(currentReading.hrZones.zone1 / 60) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Cardio Zone</span>
                  <span className="text-sm font-medium">{currentReading.hrZones.zone2} min</span>
                </div>
                <Progress value={(currentReading.hrZones.zone2 / 60) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Peak Zone</span>
                  <span className="text-sm font-medium">{currentReading.hrZones.zone3} min</span>
                </div>
                <Progress value={(currentReading.hrZones.zone3 / 30) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderWorkoutTracking = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Workout Tracking</h3>
        <Button
          onClick={() => setAutoSync(!autoSync)}
          variant="outline"
          size="sm"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {activeWorkout ? (
        <Card className="border-2 border-green-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              Live Workout: {activeWorkout.type}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.floor((new Date().getTime() - new Date(activeWorkout.startTime).getTime()) / 60000)}
                </div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{currentReading?.heartRate || 0}</div>
                <div className="text-sm text-gray-600">Avg HR</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{currentReading?.calories || 0}</div>
                <div className="text-sm text-gray-600">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{currentReading?.distance?.toFixed(1) || 0}</div>
                <div className="text-sm text-gray-600">Distance</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={stopWorkout} variant="destructive">
                <Square className="w-4 h-4 mr-2" />
                Stop Workout
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Running', 'Cycling', 'Basketball', 'Training'].map((type) => (
            <Button
              key={type}
              onClick={() => startWorkout(type)}
              variant="outline"
              className="h-20 flex-col"
            >
              <Play className="w-6 h-6 mb-2" />
              {type}
            </Button>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sync Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-sync with GAR System</div>
                <div className="text-sm text-gray-600">Automatically integrate workout data with performance analysis</div>
              </div>
              <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Real-time Performance Alerts</div>
                <div className="text-sm text-gray-600">Get notifications for heart rate zones and performance metrics</div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Recovery Recommendations</div>
                <div className="text-sm text-gray-600">Receive personalized recovery suggestions based on biometric data</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="go4it-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Watch className="w-6 h-6" />
            Wearable Device Integration
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
          <TabsTrigger value="devices" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Bluetooth className="w-4 h-4" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Activity className="w-4 h-4" />
            Real-time Data
          </TabsTrigger>
          <TabsTrigger value="workouts" className="flex items-center gap-2 data-[state=active]:bg-blue-600">
            <Target className="w-4 h-4" />
            Workout Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            {renderDeviceList()}
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            {renderRealTimeData()}
          </div>
        </TabsContent>

        <TabsContent value="workouts" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            {renderWorkoutTracking()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}