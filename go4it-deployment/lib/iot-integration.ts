/**
 * IoT Integration System for Go4It Sports Platform
 * Connects with fitness trackers, smartwatches, and performance sensors
 */

// Device Types
export type DeviceType = 'fitbit' | 'garmin' | 'apple_watch' | 'whoop' | 'polar' | 'custom_sensor';

// Biometric Data Interface
export interface BiometricData {
  timestamp: Date;
  deviceId: string;
  deviceType: DeviceType;
  data: {
    heartRate?: number;
    steps?: number;
    calories?: number;
    distance?: number;
    speed?: number;
    acceleration?: { x: number; y: number; z: number };
    gyroscope?: { x: number; y: number; z: number };
    gps?: { latitude: number; longitude: number; altitude?: number };
    temperature?: number;
    humidity?: number;
    sleepData?: {
      duration: number;
      quality: number;
      deepSleep: number;
      remSleep: number;
    };
    recovery?: {
      hrv: number;
      restingHr: number;
      strain: number;
    };
  };
}

// Performance Metrics Interface
export interface PerformanceMetrics {
  athleteId: string;
  sessionId: string;
  sport: string;
  startTime: Date;
  endTime: Date;
  metrics: {
    // General fitness
    avgHeartRate: number;
    maxHeartRate: number;
    caloriesBurned: number;
    totalDistance: number;

    // Performance specific
    maxSpeed: number;
    avgSpeed: number;
    accelerations: number;
    decelerations: number;
    jumps?: number;

    // Recovery & wellness
    fatigueLevel: number;
    readinessScore: number;
    stressLevel: number;

    // Sport specific
    sportSpecific: Record<string, number>;
  };
  zones: {
    zone1: number; // 50-60% max HR
    zone2: number; // 60-70% max HR
    zone3: number; // 70-80% max HR
    zone4: number; // 80-90% max HR
    zone5: number; // 90-100% max HR
  };
  workload: {
    acute: number; // 7-day average
    chronic: number; // 28-day average
    ratio: number; // acute/chronic
    riskLevel: 'low' | 'moderate' | 'high';
  };
}

// Device Configuration
export interface DeviceConfig {
  deviceId: string;
  deviceType: DeviceType;
  athleteId: string;
  settings: {
    samplingRate: number;
    dataTypes: string[];
    syncInterval: number;
    batteryThreshold: number;
  };
  credentials?: {
    apiKey?: string;
    accessToken?: string;
    refreshToken?: string;
    clientId?: string;
    clientSecret?: string;
  };
}

class IoTIntegrationSystem {
  private devices: Map<string, DeviceConfig> = new Map();
  private realtimeData: Map<string, BiometricData[]> = new Map();
  private performanceHistory: Map<string, PerformanceMetrics[]> = new Map();
  private websocket: WebSocket | null = null;

  constructor() {
    this.initializeWebSocket();
  }

  // Initialize WebSocket connection for real-time data
  private initializeWebSocket() {
    if (typeof window !== 'undefined') {
      try {
        this.websocket = new WebSocket('ws://localhost:5000/ws/iot');

        this.websocket.onopen = () => {
          console.log('IoT WebSocket connected');
        };

        this.websocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.handleRealtimeData(data);
        };

        this.websocket.onerror = (error) => {
          console.error('IoT WebSocket error:', error);
        };

        this.websocket.onclose = () => {
          console.log('IoT WebSocket disconnected');
          // Reconnect after 5 seconds
          setTimeout(() => this.initializeWebSocket(), 5000);
        };
      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
      }
    }
  }

  // Register a new device
  async registerDevice(config: DeviceConfig): Promise<boolean> {
    try {
      // Validate device credentials
      const isValid = await this.validateDevice(config);
      if (!isValid) {
        throw new Error('Invalid device credentials');
      }

      // Store device configuration
      this.devices.set(config.deviceId, config);

      // Initialize data storage for this device
      this.realtimeData.set(config.deviceId, []);

      // Start data sync
      await this.startDeviceSync(config.deviceId);

      return true;
    } catch (error) {
      console.error('Failed to register device:', error);
      return false;
    }
  }

  // Validate device credentials and connectivity
  private async validateDevice(config: DeviceConfig): Promise<boolean> {
    switch (config.deviceType) {
      case 'fitbit':
        return this.validateFitbit(config);
      case 'garmin':
        return this.validateGarmin(config);
      case 'apple_watch':
        return this.validateAppleWatch(config);
      case 'whoop':
        return this.validateWhoop(config);
      case 'polar':
        return this.validatePolar(config);
      default:
        return this.validateCustomSensor(config);
    }
  }

  // Fitbit integration
  private async validateFitbit(config: DeviceConfig): Promise<boolean> {
    try {
      if (!config.credentials?.accessToken) {
        return false;
      }

      // Test API call to Fitbit
      const response = await fetch('https://api.fitbit.com/1/user/-/profile.json', {
        headers: {
          Authorization: `Bearer ${config.credentials.accessToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Fitbit validation failed:', error);
      return false;
    }
  }

  // Garmin integration
  private async validateGarmin(config: DeviceConfig): Promise<boolean> {
    try {
      if (!config.credentials?.apiKey) {
        return false;
      }

      // Test Garmin Connect IQ API
      const response = await fetch('https://apis.garmin.com/wellness-api/rest/user', {
        headers: {
          Authorization: `Bearer ${config.credentials.accessToken}`,
          'X-API-Key': config.credentials.apiKey,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Garmin validation failed:', error);
      return false;
    }
  }

  // Apple Watch integration (via HealthKit)
  private async validateAppleWatch(config: DeviceConfig): Promise<boolean> {
    try {
      // Check if HealthKit is available
      if (typeof window !== 'undefined' && 'webkit' in window) {
        return true; // Simplified check
      }
      return false;
    } catch (error) {
      console.error('Apple Watch validation failed:', error);
      return false;
    }
  }

  // WHOOP integration
  private async validateWhoop(config: DeviceConfig): Promise<boolean> {
    try {
      if (!config.credentials?.accessToken) {
        return false;
      }

      const response = await fetch('https://api.prod.whoop.com/developer/v1/user/profile/basic', {
        headers: {
          Authorization: `Bearer ${config.credentials.accessToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('WHOOP validation failed:', error);
      return false;
    }
  }

  // Polar integration
  private async validatePolar(config: DeviceConfig): Promise<boolean> {
    try {
      if (!config.credentials?.accessToken) {
        return false;
      }

      const response = await fetch('https://www.polaraccesslink.com/v3/users', {
        headers: {
          Authorization: `Bearer ${config.credentials.accessToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Polar validation failed:', error);
      return false;
    }
  }

  // Custom sensor validation
  private async validateCustomSensor(config: DeviceConfig): Promise<boolean> {
    // For custom sensors, we assume they're valid if they have basic config
    return !!config.deviceId && !!config.athleteId;
  }

  // Start syncing data from a device
  private async startDeviceSync(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device) return;

    // Set up periodic sync based on device settings
    setInterval(async () => {
      await this.syncDeviceData(deviceId);
    }, device.settings.syncInterval * 1000);

    // Initial sync
    await this.syncDeviceData(deviceId);
  }

  // Sync data from a specific device
  private async syncDeviceData(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device) return;

    try {
      let data: BiometricData[] = [];

      switch (device.deviceType) {
        case 'fitbit':
          data = await this.syncFitbitData(device);
          break;
        case 'garmin':
          data = await this.syncGarminData(device);
          break;
        case 'apple_watch':
          data = await this.syncAppleWatchData(device);
          break;
        case 'whoop':
          data = await this.syncWhoopData(device);
          break;
        case 'polar':
          data = await this.syncPolarData(device);
          break;
        default:
          data = await this.syncCustomSensorData(device);
      }

      // Store the data
      this.storeDeviceData(deviceId, data);

      // Process for performance metrics
      await this.processPerformanceMetrics(device.athleteId, data);
    } catch (error) {
      console.error(`Failed to sync data from ${deviceId}:`, error);
    }
  }

  // Sync Fitbit data
  private async syncFitbitData(device: DeviceConfig): Promise<BiometricData[]> {
    const today = new Date().toISOString().split('T')[0];
    const data: BiometricData[] = [];

    try {
      // Get various data types
      const endpoints = [
        {
          url: `https://api.fitbit.com/1/user/-/activities/heart/date/${today}/1d.json`,
          type: 'heartRate',
        },
        {
          url: `https://api.fitbit.com/1/user/-/activities/steps/date/${today}/1d.json`,
          type: 'steps',
        },
        {
          url: `https://api.fitbit.com/1/user/-/activities/calories/date/${today}/1d.json`,
          type: 'calories',
        },
      ];

      for (const endpoint of endpoints) {
        const response = await fetch(endpoint.url, {
          headers: {
            Authorization: `Bearer ${device.credentials?.accessToken}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          // Process Fitbit response and convert to BiometricData format
          data.push(this.processFitbitResponse(result, device, endpoint.type));
        }
      }
    } catch (error) {
      console.error('Fitbit sync error:', error);
    }

    return data;
  }

  // Process Fitbit API response
  private processFitbitResponse(
    response: any,
    device: DeviceConfig,
    dataType: string,
  ): BiometricData {
    const now = new Date();

    return {
      timestamp: now,
      deviceId: device.deviceId,
      deviceType: device.deviceType,
      data: this.extractFitbitData(response, dataType),
    };
  }

  // Extract specific data from Fitbit response
  private extractFitbitData(response: any, dataType: string): any {
    const data: any = {};

    switch (dataType) {
      case 'heartRate':
        if (response['activities-heart']) {
          data.heartRate = response['activities-heart'][0]?.value?.restingHeartRate || 0;
        }
        break;
      case 'steps':
        if (response['activities-steps']) {
          data.steps = parseInt(response['activities-steps'][0]?.value || '0');
        }
        break;
      case 'calories':
        if (response['activities-calories']) {
          data.calories = parseInt(response['activities-calories'][0]?.value || '0');
        }
        break;
    }

    return data;
  }

  // Sync Garmin data (simplified implementation)
  private async syncGarminData(device: DeviceConfig): Promise<BiometricData[]> {
    // Implementation for Garmin Connect IQ API
    return this.generateSampleData(device, 'garmin');
  }

  // Sync Apple Watch data (simplified implementation)
  private async syncAppleWatchData(device: DeviceConfig): Promise<BiometricData[]> {
    // Implementation for HealthKit data
    return this.generateSampleData(device, 'apple_watch');
  }

  // Sync WHOOP data (simplified implementation)
  private async syncWhoopData(device: DeviceConfig): Promise<BiometricData[]> {
    // Implementation for WHOOP API
    return this.generateSampleData(device, 'whoop');
  }

  // Sync Polar data (simplified implementation)
  private async syncPolarData(device: DeviceConfig): Promise<BiometricData[]> {
    // Implementation for Polar AccessLink API
    return this.generateSampleData(device, 'polar');
  }

  // Sync custom sensor data
  private async syncCustomSensorData(device: DeviceConfig): Promise<BiometricData[]> {
    // Custom implementation based on sensor type
    return this.generateSampleData(device, 'custom_sensor');
  }

  // Generate sample data for demonstration
  private generateSampleData(device: DeviceConfig, type: string): BiometricData[] {
    const now = new Date();
    const data: BiometricData[] = [];

    // Generate last hour of data (every minute)
    for (let i = 0; i < 60; i++) {
      const timestamp = new Date(now.getTime() - i * 60 * 1000);

      data.push({
        timestamp,
        deviceId: device.deviceId,
        deviceType: device.deviceType as DeviceType,
        data: {
          heartRate: 70 + Math.random() * 40,
          steps: Math.floor(Math.random() * 100),
          calories: Math.floor(Math.random() * 50),
          distance: Math.random() * 1000,
          speed: Math.random() * 20,
          acceleration: {
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
            z: Math.random() * 2 - 1,
          },
          temperature: 36.5 + Math.random() * 2,
          recovery: {
            hrv: 30 + Math.random() * 40,
            restingHr: 50 + Math.random() * 20,
            strain: Math.random() * 10,
          },
        },
      });
    }

    return data;
  }

  // Store device data
  private storeDeviceData(deviceId: string, data: BiometricData[]): void {
    const existing = this.realtimeData.get(deviceId) || [];
    const updated = [...existing, ...data];

    // Keep only last 24 hours of data in memory
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const filtered = updated.filter((d) => d.timestamp > cutoff);

    this.realtimeData.set(deviceId, filtered);
  }

  // Process performance metrics
  private async processPerformanceMetrics(athleteId: string, data: BiometricData[]): Promise<void> {
    if (data.length === 0) return;

    const sessionId = `session-${Date.now()}`;
    const sport = 'general'; // Would be determined from activity context

    // Calculate aggregated metrics
    const heartRates = data
      .map((d) => d.data.heartRate)
      .filter((hr) => hr !== undefined) as number[];
    const speeds = data.map((d) => d.data.speed).filter((s) => s !== undefined) as number[];
    const distances = data.map((d) => d.data.distance).filter((d) => d !== undefined) as number[];

    if (heartRates.length === 0) return;

    const avgHeartRate = heartRates.reduce((a, b) => a + b, 0) / heartRates.length;
    const maxHeartRate = Math.max(...heartRates);
    const avgSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
    const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;
    const totalDistance = distances.length > 0 ? distances.reduce((a, b) => a + b, 0) : 0;

    // Calculate heart rate zones
    const maxHR = 220 - 25; // Assume 25 years old, would get from athlete profile
    const zones = this.calculateHeartRateZones(heartRates, maxHR);

    // Calculate workload
    const workload = await this.calculateWorkload(athleteId, avgHeartRate, data[0].timestamp);

    const metrics: PerformanceMetrics = {
      athleteId,
      sessionId,
      sport,
      startTime: data[0].timestamp,
      endTime: data[data.length - 1].timestamp,
      metrics: {
        avgHeartRate,
        maxHeartRate,
        caloriesBurned: data.reduce((sum, d) => sum + (d.data.calories || 0), 0),
        totalDistance,
        maxSpeed,
        avgSpeed,
        accelerations: this.countAccelerations(data),
        decelerations: this.countDecelerations(data),
        fatigueLevel: this.calculateFatigueLevel(heartRates),
        readinessScore: this.calculateReadinessScore(data),
        stressLevel: this.calculateStressLevel(heartRates),
        sportSpecific: {},
      },
      zones,
      workload,
    };

    // Store performance metrics
    const existing = this.performanceHistory.get(athleteId) || [];
    existing.push(metrics);
    this.performanceHistory.set(athleteId, existing);
  }

  // Calculate heart rate zones
  private calculateHeartRateZones(heartRates: number[], maxHR: number) {
    const zones = { zone1: 0, zone2: 0, zone3: 0, zone4: 0, zone5: 0 };

    heartRates.forEach((hr) => {
      const percentage = (hr / maxHR) * 100;
      if (percentage < 60) zones.zone1++;
      else if (percentage < 70) zones.zone2++;
      else if (percentage < 80) zones.zone3++;
      else if (percentage < 90) zones.zone4++;
      else zones.zone5++;
    });

    return zones;
  }

  // Calculate workload and injury risk
  private async calculateWorkload(
    athleteId: string,
    avgHeartRate: number,
    sessionDate: Date,
  ): Promise<any> {
    const history = this.performanceHistory.get(athleteId) || [];

    // Get last 7 days (acute) and 28 days (chronic)
    const sevenDaysAgo = new Date(sessionDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twentyEightDaysAgo = new Date(sessionDate.getTime() - 28 * 24 * 60 * 60 * 1000);

    const acute =
      history
        .filter((m) => m.startTime > sevenDaysAgo)
        .reduce((sum, m) => sum + m.metrics.avgHeartRate, 0) / 7;

    const chronic =
      history
        .filter((m) => m.startTime > twentyEightDaysAgo)
        .reduce((sum, m) => sum + m.metrics.avgHeartRate, 0) / 28;

    const ratio = chronic > 0 ? acute / chronic : 1;

    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    if (ratio > 1.5) riskLevel = 'high';
    else if (ratio > 1.2) riskLevel = 'moderate';

    return { acute, chronic, ratio, riskLevel };
  }

  // Helper methods for metric calculations
  private countAccelerations(data: BiometricData[]): number {
    let count = 0;
    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1].data.speed || 0;
      const curr = data[i].data.speed || 0;
      if (curr > prev + 2) count++; // Speed increase > 2 units
    }
    return count;
  }

  private countDecelerations(data: BiometricData[]): number {
    let count = 0;
    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1].data.speed || 0;
      const curr = data[i].data.speed || 0;
      if (curr < prev - 2) count++; // Speed decrease > 2 units
    }
    return count;
  }

  private calculateFatigueLevel(heartRates: number[]): number {
    // Simplified fatigue calculation based on heart rate variability
    const avg = heartRates.reduce((a, b) => a + b, 0) / heartRates.length;
    const variance =
      heartRates.reduce((sum, hr) => sum + Math.pow(hr - avg, 2), 0) / heartRates.length;

    // Lower HRV = higher fatigue
    return Math.max(0, Math.min(100, 100 - Math.sqrt(variance)));
  }

  private calculateReadinessScore(data: BiometricData[]): number {
    // Simplified readiness score based on multiple factors
    const recoveryData = data.filter((d) => d.data.recovery).map((d) => d.data.recovery!);
    if (recoveryData.length === 0) return 75; // Default value

    const avgHRV = recoveryData.reduce((sum, r) => sum + r.hrv, 0) / recoveryData.length;
    const avgStrain = recoveryData.reduce((sum, r) => sum + r.strain, 0) / recoveryData.length;

    return Math.max(0, Math.min(100, avgHRV - avgStrain * 5));
  }

  private calculateStressLevel(heartRates: number[]): number {
    // Simplified stress calculation
    const avg = heartRates.reduce((a, b) => a + b, 0) / heartRates.length;
    return Math.max(0, Math.min(100, (avg - 60) * 2)); // Normalized stress level
  }

  // Handle real-time data from WebSocket
  private handleRealtimeData(data: any): void {
    // Process incoming real-time data
    console.log('Received real-time IoT data:', data);

    // Broadcast to subscribers
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(
        JSON.stringify({
          type: 'performance_update',
          data: data,
        }),
      );
    }
  }

  // Public API methods

  // Get real-time data for an athlete
  getRealtimeData(athleteId: string): BiometricData[] {
    const allData: BiometricData[] = [];

    for (const [deviceId, device] of this.devices) {
      if (device.athleteId === athleteId) {
        const deviceData = this.realtimeData.get(deviceId) || [];
        allData.push(...deviceData);
      }
    }

    return allData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Get performance history for an athlete
  getPerformanceHistory(athleteId: string, days: number = 30): PerformanceMetrics[] {
    const history = this.performanceHistory.get(athleteId) || [];
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    return history.filter((m) => m.startTime > cutoff);
  }

  // Get injury risk assessment
  getInjuryRisk(athleteId: string): { level: string; score: number; recommendations: string[] } {
    const recent = this.getPerformanceHistory(athleteId, 7);

    if (recent.length === 0) {
      return {
        level: 'unknown',
        score: 0,
        recommendations: ['Insufficient data for assessment'],
      };
    }

    const avgWorkloadRatio = recent.reduce((sum, m) => sum + m.workload.ratio, 0) / recent.length;
    const avgFatigue = recent.reduce((sum, m) => sum + m.metrics.fatigueLevel, 0) / recent.length;

    let score = 0;
    if (avgWorkloadRatio > 1.5) score += 40;
    else if (avgWorkloadRatio > 1.2) score += 20;

    if (avgFatigue > 80) score += 30;
    else if (avgFatigue > 60) score += 15;

    let level = 'low';
    let recommendations: string[] = [];

    if (score > 50) {
      level = 'high';
      recommendations = [
        'Reduce training intensity',
        'Focus on recovery activities',
        'Consider rest day',
        'Monitor symptoms closely',
      ];
    } else if (score > 25) {
      level = 'moderate';
      recommendations = [
        'Monitor workload carefully',
        'Ensure adequate recovery',
        'Consider lighter training',
      ];
    } else {
      recommendations = ['Continue current training', 'Maintain good recovery habits'];
    }

    return { level, score, recommendations };
  }

  // Disconnect device
  async disconnectDevice(deviceId: string): Promise<boolean> {
    try {
      this.devices.delete(deviceId);
      this.realtimeData.delete(deviceId);
      return true;
    } catch (error) {
      console.error('Failed to disconnect device:', error);
      return false;
    }
  }

  // Get connected devices for an athlete
  getConnectedDevices(athleteId: string): DeviceConfig[] {
    const devices: DeviceConfig[] = [];

    for (const [deviceId, device] of this.devices) {
      if (device.athleteId === athleteId) {
        // Return device config without credentials for security
        devices.push({
          ...device,
          credentials: undefined,
        });
      }
    }

    return devices;
  }
}

export const iotSystem = new IoTIntegrationSystem();
