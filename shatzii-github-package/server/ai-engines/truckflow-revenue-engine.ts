/**
 * TruckFlow Revenue Optimization Engine
 * Maximizes earnings for drivers and truck owners through AI-powered dispatch optimization
 */

interface LoadOpportunity {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  rate: number;
  ratePerMile: number;
  deadheadMiles: number;
  loadType: string;
  weight: number;
  urgency: 'high' | 'medium' | 'low';
  brokerRating: number;
  estimatedProfit: number;
  fuelCost: number;
  tollCosts: number;
  driverPay: number;
  ownerRevenue: number;
}

interface Driver {
  id: string;
  name: string;
  location: string;
  truckType: string;
  experienceLevel: number;
  preferredRoutes: string[];
  currentStatus: 'available' | 'driving' | 'loading' | 'resting';
  hoursOfService: number;
  avgMilesPerDay: number;
  fuelEfficiency: number;
}

class TruckFlowRevenueEngine {
  private loadBoards: string[] = [
    'DAT Load Board',
    'Truckstop.com',
    '123Loadboard',
    'Direct Freight',
    'uShip'
  ];

  private fuelPricePerGallon = 3.85; // Current national average
  private tollRatePerMile = 0.12;
  private driverPayPercentage = 0.65; // Driver gets 65% of net revenue

  /**
   * AI-powered load matching that maximizes revenue for both drivers and owners
   */
  async findOptimalLoads(driver: Driver): Promise<LoadOpportunity[]> {
    console.log(`🚛 Scanning load boards for driver ${driver.name} at ${driver.location}`);
    
    // Simulate AI scanning multiple load boards
    const availableLoads = await this.scanLoadBoards(driver.location, driver.truckType);
    
    // Apply AI optimization algorithms
    const optimizedLoads = this.optimizeForRevenue(availableLoads, driver);
    
    // Rank by profit potential
    return optimizedLoads.sort((a, b) => b.estimatedProfit - a.estimatedProfit).slice(0, 5);
  }

  private async scanLoadBoards(location: string, truckType: string): Promise<LoadOpportunity[]> {
    const loads: LoadOpportunity[] = [];
    
    // Simulate high-value loads from major shipping lanes
    const highValueRoutes = [
      { origin: 'Los Angeles, CA', destination: 'Dallas, TX', baseRate: 3200, distance: 1435 },
      { origin: 'Chicago, IL', destination: 'Atlanta, GA', baseRate: 2800, distance: 717 },
      { origin: 'Miami, FL', destination: 'New York, NY', baseRate: 3500, distance: 1283 },
      { origin: 'Seattle, WA', destination: 'Denver, CO', baseRate: 2900, distance: 1316 },
      { origin: 'Houston, TX', destination: 'Los Angeles, CA', baseRate: 3400, distance: 1549 },
      { origin: 'Phoenix, AZ', destination: 'Chicago, IL', baseRate: 3100, distance: 1729 },
      { origin: 'Jacksonville, FL', destination: 'Memphis, TN', baseRate: 2200, distance: 630 },
      { origin: 'Salt Lake City, UT', destination: 'Kansas City, MO', baseRate: 2600, distance: 1128 }
    ];

    for (let i = 0; i < 15; i++) {
      const route = highValueRoutes[Math.floor(Math.random() * highValueRoutes.length)];
      const rateVariation = 0.8 + Math.random() * 0.4; // ±20% rate variation
      const rate = Math.round(route.baseRate * rateVariation);
      const deadheadMiles = Math.random() * 200; // 0-200 miles deadhead
      
      const fuelCost = this.calculateFuelCost(route.distance + deadheadMiles, 6.5); // 6.5 MPG average
      const tollCosts = this.calculateTollCosts(route.distance);
      const netRevenue = rate - fuelCost - tollCosts;
      const driverPay = netRevenue * this.driverPayPercentage;
      const ownerRevenue = netRevenue - driverPay;

      loads.push({
        id: `LOAD_${Date.now()}_${i}`,
        origin: route.origin,
        destination: route.destination,
        distance: route.distance,
        rate: rate,
        ratePerMile: rate / route.distance,
        deadheadMiles: Math.round(deadheadMiles),
        loadType: this.getRandomLoadType(),
        weight: 35000 + Math.random() * 45000, // 35k-80k lbs
        urgency: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        brokerRating: 3.5 + Math.random() * 1.5, // 3.5-5.0 rating
        estimatedProfit: Math.round(netRevenue),
        fuelCost: Math.round(fuelCost),
        tollCosts: Math.round(tollCosts),
        driverPay: Math.round(driverPay),
        ownerRevenue: Math.round(ownerRevenue)
      });
    }

    return loads;
  }

  private optimizeForRevenue(loads: LoadOpportunity[], driver: Driver): LoadOpportunity[] {
    // AI optimization factors:
    // 1. Rate per mile
    // 2. Deadhead minimization
    // 3. Driver preferences
    // 4. Fuel efficiency
    // 5. Time optimization

    return loads.map(load => {
      let optimizationScore = 1.0;

      // Prefer higher rate per mile
      if (load.ratePerMile > 2.5) optimizationScore += 0.2;
      if (load.ratePerMile > 3.0) optimizationScore += 0.3;

      // Penalize high deadhead
      if (load.deadheadMiles > 100) optimizationScore -= 0.1;
      if (load.deadheadMiles > 200) optimizationScore -= 0.2;

      // Bonus for driver preferred routes
      if (driver.preferredRoutes.some(route => load.destination.includes(route))) {
        optimizationScore += 0.15;
      }

      // Bonus for high urgency (often pays premium)
      if (load.urgency === 'high') optimizationScore += 0.1;

      // Apply optimization multiplier
      load.estimatedProfit = Math.round(load.estimatedProfit * optimizationScore);
      load.driverPay = Math.round(load.driverPay * optimizationScore);
      load.ownerRevenue = Math.round(load.ownerRevenue * optimizationScore);

      return load;
    });
  }

  private calculateFuelCost(totalMiles: number, mpg: number): number {
    const gallonsNeeded = totalMiles / mpg;
    return gallonsNeeded * this.fuelPricePerGallon;
  }

  private calculateTollCosts(miles: number): number {
    // Estimate toll costs based on major highways
    return miles * this.tollRatePerMile;
  }

  private getRandomLoadType(): string {
    const loadTypes = [
      'Dry Van',
      'Refrigerated',
      'Flatbed',
      'Step Deck',
      'Tanker',
      'Auto Transport',
      'Heavy Haul'
    ];
    return loadTypes[Math.floor(Math.random() * loadTypes.length)];
  }

  /**
   * Calculate daily/weekly/monthly revenue projections
   */
  calculateRevenueProjections(driver: Driver, loads: LoadOpportunity[]): {
    daily: number;
    weekly: number;
    monthly: number;
    annual: number;
  } {
    // Assume 5 days per week, 50 weeks per year
    const avgDailyRevenue = loads.slice(0, 2).reduce((sum, load) => sum + load.driverPay, 0);
    
    return {
      daily: Math.round(avgDailyRevenue),
      weekly: Math.round(avgDailyRevenue * 5),
      monthly: Math.round(avgDailyRevenue * 22), // ~22 working days per month
      annual: Math.round(avgDailyRevenue * 250) // 50 weeks * 5 days
    };
  }

  /**
   * Generate revenue report for owners
   */
  generateOwnerRevenueReport(loads: LoadOpportunity[]): {
    totalRevenue: number;
    totalMiles: number;
    avgRatePerMile: number;
    fuelEfficiency: number;
    profitMargin: number;
  } {
    const totalRevenue = loads.reduce((sum, load) => sum + load.ownerRevenue, 0);
    const totalMiles = loads.reduce((sum, load) => sum + load.distance, 0);
    const totalGrossRevenue = loads.reduce((sum, load) => sum + load.rate, 0);

    return {
      totalRevenue: Math.round(totalRevenue),
      totalMiles: Math.round(totalMiles),
      avgRatePerMile: Math.round((totalGrossRevenue / totalMiles) * 100) / 100,
      fuelEfficiency: Math.round((totalMiles / (totalMiles / 6.5)) * 100) / 100,
      profitMargin: Math.round((totalRevenue / totalGrossRevenue) * 100)
    };
  }
}

export const truckFlowRevenueEngine = new TruckFlowRevenueEngine();