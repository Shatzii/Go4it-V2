import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Dumbbell, 
  TrendingUp, 
  Lock, 
  Unlock, 
  ShoppingCart, 
  Trophy, 
  History, 
  Users,
  Info,
  AlertCircle,
  Star,
  Heart,
  BarChart3,
  X,
  CheckCircle2,
  Zap
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function WeightRoom() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedEquipment, setSelectedEquipment] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [intensityLevel, setIntensityLevel] = useState(50);

  // This would be fetched from the API in a real implementation
  const playerEquipment = [
    {
      id: 1,
      name: "Basic Dumbbells",
      description: "Standard dumbbells for strength training",
      category: "Weights",
      boostType: "Strength",
      boostValue: 5,
      level: 1,
      owned: true,
      equipped: true,
      rarity: "Common",
      timesUsed: 27,
      image: null
    },
    {
      id: 2,
      name: "Training Resistance Bands",
      description: "Adjustable resistance bands for mobility work",
      category: "Resistance",
      boostType: "Agility",
      boostValue: 3,
      level: 1,
      owned: true,
      equipped: false,
      rarity: "Common",
      timesUsed: 14,
      image: null
    },
    {
      id: 3,
      name: "Jump Rope",
      description: "Speed jump rope for cardio training",
      category: "Cardio",
      boostType: "Stamina",
      boostValue: 4,
      level: 1,
      owned: true,
      equipped: false,
      rarity: "Common",
      timesUsed: 8,
      image: null
    },
    {
      id: 4,
      name: "Advanced Smart Dumbbells",
      description: "Digital weight tracking and form correction",
      category: "Weights",
      boostType: "Strength",
      boostValue: 8,
      level: 3,
      owned: false,
      equipped: false,
      rarity: "Rare",
      cost: 1500,
      image: null
    },
    {
      id: 5,
      name: "Pro Kettlebell Set",
      description: "Professional kettlebells for explosive strength",
      category: "Weights",
      boostType: "Power",
      boostValue: 7,
      level: 2,
      owned: false,
      equipped: false,
      rarity: "Uncommon",
      cost: 850,
      image: null
    },
    {
      id: 6,
      name: "Elite Bench Press Station",
      description: "Commercial-grade bench press with spotting system",
      category: "Station",
      boostType: "Strength",
      boostValue: 12,
      level: 5,
      owned: false,
      equipped: false,
      rarity: "Epic",
      cost: 3200,
      image: null
    },
    {
      id: 7,
      name: "Balance Board",
      description: "Stability training board for core strength",
      category: "Balance",
      boostType: "Coordination",
      boostValue: 6,
      level: 2,
      owned: false,
      equipped: false,
      rarity: "Uncommon",
      cost: 600,
      image: null
    }
  ];

  // Player stats and progression
  const playerStats = {
    xp: 12450,
    level: 14,
    credits: 2500,
    stats: {
      strength: 42,
      agility: 38,
      stamina: 44,
      coordination: 36,
      power: 40
    },
    equipped: playerEquipment.filter(e => e.owned && e.equipped),
    recentWorkouts: [
      { id: 1, date: "2024-04-05", equipment: ["Basic Dumbbells"], xpGained: 150 },
      { id: 2, date: "2024-04-03", equipment: ["Training Resistance Bands", "Jump Rope"], xpGained: 200 },
      { id: 3, date: "2024-04-01", equipment: ["Basic Dumbbells"], xpGained: 120 },
    ]
  };

  // Filter equipment based on search query
  const filteredEquipment = playerEquipment.filter(equipment => {
    return (
      equipment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipment.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipment.boostType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Handle equipment selection
  function selectEquipment(id: number) {
    setSelectedEquipment(id);
  }

  // Get rarity color
  function getRarityColor(rarity: string) {
    switch(rarity) {
      case "Common": return "text-slate-400";
      case "Uncommon": return "text-green-500";
      case "Rare": return "text-blue-500";
      case "Epic": return "text-purple-500";
      case "Legendary": return "text-yellow-400";
      default: return "text-slate-400";
    }
  }

  // Equipment detail component
  function EquipmentDetail() {
    if (selectedEquipment === null) return null;
    
    const equipment = playerEquipment.find(e => e.id === selectedEquipment);
    if (!equipment) return null;

    function handleAction() {
      if (!equipment.owned) {
        // Purchase logic would go here
        toast({
          title: "Equipment Purchased!",
          description: `You've acquired ${equipment.name}`,
        });
      } else if (equipment.equipped) {
        // Unequip logic would go here
        toast({
          title: "Equipment Unequipped",
          description: `${equipment.name} has been unequipped`,
        });
      } else {
        // Equip logic would go here
        toast({
          title: "Equipment Equipped!",
          description: `${equipment.name} is now in use`,
        });
      }
    }

    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                {equipment.name}
                <Badge 
                  className={`ml-2 ${getRarityColor(equipment.rarity)}`}
                  variant="outline"
                >
                  {equipment.rarity}
                </Badge>
              </CardTitle>
              <CardDescription>
                Level {equipment.level} {equipment.category}
              </CardDescription>
            </div>
            <Badge variant={equipment.owned ? "secondary" : "outline"}>
              {equipment.owned ? (
                equipment.equipped ? (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                ) : (
                  <Unlock className="mr-1 h-3 w-3" />
                )
              ) : (
                <Lock className="mr-1 h-3 w-3" />
              )}
              {equipment.owned 
                ? (equipment.equipped ? "Equipped" : "Owned") 
                : `${equipment.cost} Credits`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted flex items-center justify-center mb-4 rounded-md">
            <Dumbbell className="h-12 w-12 text-muted-foreground" />
          </div>
          
          <p className="text-sm mb-4">{equipment.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border rounded-lg p-3">
              <div className="text-sm font-medium flex items-center mb-1">
                <TrendingUp className="h-4 w-4 mr-1 text-primary" />
                Boost Type
              </div>
              <div className="text-2xl font-bold">{equipment.boostType}</div>
            </div>
            <div className="border rounded-lg p-3">
              <div className="text-sm font-medium flex items-center mb-1">
                <Zap className="h-4 w-4 mr-1 text-yellow-400" />
                Boost Value
              </div>
              <div className="text-2xl font-bold">+{equipment.boostValue}</div>
            </div>
          </div>
          
          {equipment.owned && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Usage</span>
                <span className="text-sm text-muted-foreground">{equipment.timesUsed} times</span>
              </div>
              <Progress 
                value={Math.min(equipment.timesUsed / 30 * 100, 100)} 
                className="h-2" 
              />
              {equipment.timesUsed >= 30 && (
                <p className="text-xs text-green-500 mt-1">
                  Master status achieved! Max boost applied.
                </p>
              )}
            </div>
          )}
          
          {!equipment.owned && playerStats.level < equipment.level && (
            <div className="bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mb-4">
              <div className="flex items-start text-sm text-yellow-600 dark:text-yellow-400">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  You need to reach level {equipment.level} to use this equipment.
                  Currently at level {playerStats.level}.
                </span>
              </div>
            </div>
          )}
          
          {!equipment.owned && equipment.cost > playerStats.credits && (
            <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md p-3 mb-4">
              <div className="flex items-start text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  You need {equipment.cost - playerStats.credits} more credits to purchase this equipment.
                </span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4">
          {equipment.owned ? (
            <Button 
              className="w-full" 
              variant={equipment.equipped ? "outline" : "default"}
              onClick={handleAction}
            >
              {equipment.equipped ? (
                <>
                  <X className="mr-2 h-4 w-4" /> Unequip
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Equip
                </>
              )}
            </Button>
          ) : (
            <Button 
              className="w-full" 
              disabled={playerStats.level < equipment.level || equipment.cost > playerStats.credits}
              onClick={handleAction}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Purchase
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weight Room</h1>
          <p className="text-muted-foreground mt-1">
            Customize your training equipment and boost your stats
          </p>
        </div>
        <Badge variant="outline" className="text-base px-4 py-2">
          <ShoppingCart className="mr-2 h-4 w-4" />
          {playerStats.credits.toLocaleString()} Credits
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="md:col-span-2 xl:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Input
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:max-w-xs"
            />
            <div className="flex items-center gap-2">
              <Label htmlFor="intensity" className="whitespace-nowrap">Intensity:</Label>
              <Slider
                id="intensity"
                min={0}
                max={100}
                step={10}
                value={[intensityLevel]}
                onValueChange={(value) => setIntensityLevel(value[0])}
                className="w-32"
              />
              <span className="text-sm font-medium w-8">{intensityLevel}%</span>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  <Info className="h-4 w-4 mr-2" /> Boost Info
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Equipment Boosts Explained</DialogTitle>
                  <DialogDescription>
                    Understanding how equipment affects your performance.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 mt-4">
                  <p className="text-sm">
                    Each equipment piece provides specific attribute boosts that improve your athletic performance. 
                    The boost value is applied directly to your player stats.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Boost Types:</p>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center">
                        <Badge variant="outline" className="mr-2">Strength</Badge>
                        <span>Increases power and physicality</span>
                      </li>
                      <li className="flex items-center">
                        <Badge variant="outline" className="mr-2">Agility</Badge>
                        <span>Improves quickness and flexibility</span>
                      </li>
                      <li className="flex items-center">
                        <Badge variant="outline" className="mr-2">Stamina</Badge>
                        <span>Enhances endurance and recovery</span>
                      </li>
                      <li className="flex items-center">
                        <Badge variant="outline" className="mr-2">Coordination</Badge>
                        <span>Boosts precision and body control</span>
                      </li>
                      <li className="flex items-center">
                        <Badge variant="outline" className="mr-2">Power</Badge>
                        <span>Increases explosive strength</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Rarity Levels:</p>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center">
                        <Badge variant="outline" className="mr-2 text-slate-400">Common</Badge>
                        <span>1-5 boost value</span>
                      </li>
                      <li className="flex items-center">
                        <Badge variant="outline" className="mr-2 text-green-500">Uncommon</Badge>
                        <span>6-8 boost value</span>
                      </li>
                      <li className="flex items-center">
                        <Badge variant="outline" className="mr-2 text-blue-500">Rare</Badge>
                        <span>9-12 boost value</span>
                      </li>
                      <li className="flex items-center">
                        <Badge variant="outline" className="mr-2 text-purple-500">Epic</Badge>
                        <span>13-16 boost value</span>
                      </li>
                      <li className="flex items-center">
                        <Badge variant="outline" className="mr-2 text-yellow-400">Legendary</Badge>
                        <span>17-20 boost value</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button variant="outline">Got it</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Equipment</TabsTrigger>
              <TabsTrigger value="owned">Owned</TabsTrigger>
              <TabsTrigger value="shop">Shop</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="m-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEquipment.map((equipment) => (
                  <Card 
                    key={equipment.id} 
                    className={`cursor-pointer hover:border-primary transition-colors ${selectedEquipment === equipment.id ? 'border-primary' : ''}`}
                    onClick={() => selectEquipment(equipment.id)}
                  >
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base line-clamp-1">{equipment.name}</CardTitle>
                        <Badge 
                          className={`${getRarityColor(equipment.rarity)}`}
                          variant="outline"
                        >
                          {equipment.rarity}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center">
                        {equipment.category}
                        {equipment.owned && equipment.equipped && (
                          <Badge variant="secondary" className="ml-2 text-xs">Equipped</Badge>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1 text-primary" />
                          <span>{equipment.boostType} +{equipment.boostValue}</span>
                        </div>
                        <div className="flex items-center">
                          <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                          <span>Lvl {equipment.level}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      {equipment.owned ? (
                        <Badge variant="outline">
                          {equipment.timesUsed > 0 ? (
                            <>
                              <History className="h-3 w-3 mr-1" /> Used {equipment.timesUsed} times
                            </>
                          ) : (
                            <>
                              <Unlock className="h-3 w-3 mr-1" /> Owned
                            </>
                          )}
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <ShoppingCart className="h-3 w-3 mr-1" /> {equipment.cost} Credits
                        </Badge>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="owned" className="m-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEquipment
                  .filter(equipment => equipment.owned)
                  .map((equipment) => (
                    <Card 
                      key={equipment.id} 
                      className={`cursor-pointer hover:border-primary transition-colors ${selectedEquipment === equipment.id ? 'border-primary' : ''}`}
                      onClick={() => selectEquipment(equipment.id)}
                    >
                      <CardHeader className="p-4 pb-0">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base line-clamp-1">{equipment.name}</CardTitle>
                          <Badge 
                            className={`${getRarityColor(equipment.rarity)}`}
                            variant="outline"
                          >
                            {equipment.rarity}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center">
                          {equipment.category}
                          {equipment.equipped && (
                            <Badge variant="secondary" className="ml-2 text-xs">Equipped</Badge>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1 text-primary" />
                            <span>{equipment.boostType} +{equipment.boostValue}</span>
                          </div>
                          <div className="flex items-center">
                            <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                            <span>Lvl {equipment.level}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Badge variant="outline">
                          <History className="h-3 w-3 mr-1" /> Used {equipment.timesUsed} times
                        </Badge>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
              
              {filteredEquipment.filter(equipment => equipment.owned).length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No equipment owned</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Visit the shop to purchase equipment and boost your training.
                  </p>
                  <Button onClick={() => document.querySelector('[data-value="shop"]')?.click()}>
                    Browse Shop
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="shop" className="m-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEquipment
                  .filter(equipment => !equipment.owned)
                  .map((equipment) => (
                    <Card 
                      key={equipment.id} 
                      className={`cursor-pointer hover:border-primary transition-colors ${selectedEquipment === equipment.id ? 'border-primary' : ''}`}
                      onClick={() => selectEquipment(equipment.id)}
                    >
                      <CardHeader className="p-4 pb-0">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base line-clamp-1">{equipment.name}</CardTitle>
                          <Badge 
                            className={`${getRarityColor(equipment.rarity)}`}
                            variant="outline"
                          >
                            {equipment.rarity}
                          </Badge>
                        </div>
                        <CardDescription>{equipment.category}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1 text-primary" />
                            <span>{equipment.boostType} +{equipment.boostValue}</span>
                          </div>
                          <div className="flex items-center">
                            <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                            <span>Lvl {equipment.level}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Badge 
                          variant="outline"
                          className={playerStats.credits < equipment.cost ? "text-red-500" : ""}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {equipment.cost} Credits
                          {playerStats.credits < equipment.cost && " (Insufficient)"}
                        </Badge>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
              
              {filteredEquipment.filter(equipment => !equipment.owned).length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All equipment owned</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    You've purchased all available equipment. Check back later for new items.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {selectedEquipment !== null ? (
            <EquipmentDetail />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
                <CardDescription>Current attribute levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Strength</span>
                    <span className="text-sm">{playerStats.stats.strength}/100</span>
                  </div>
                  <Progress value={playerStats.stats.strength} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Agility</span>
                    <span className="text-sm">{playerStats.stats.agility}/100</span>
                  </div>
                  <Progress value={playerStats.stats.agility} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Stamina</span>
                    <span className="text-sm">{playerStats.stats.stamina}/100</span>
                  </div>
                  <Progress value={playerStats.stats.stamina} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Coordination</span>
                    <span className="text-sm">{playerStats.stats.coordination}/100</span>
                  </div>
                  <Progress value={playerStats.stats.coordination} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Power</span>
                    <span className="text-sm">{playerStats.stats.power}/100</span>
                  </div>
                  <Progress value={playerStats.stats.power} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div>
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-1 text-primary" />
                    <span className="text-sm font-medium">Level {playerStats.level}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {playerStats.xp.toLocaleString()} Total XP
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Detailed Stats
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Training Partners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Find Workout Buddy
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Equipped Boosts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {playerStats.equipped.length > 0 ? (
                playerStats.equipped.map((equipment) => (
                  <div key={equipment.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Dumbbell className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{equipment.name}</span>
                    </div>
                    <Badge className="text-xs">
                      +{equipment.boostValue} {equipment.boostType}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No equipment currently equipped
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Recent Workouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[180px]">
                <div className="space-y-3">
                  {playerStats.recentWorkouts.map((workout) => (
                    <div key={workout.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div className="text-sm font-medium">
                          {new Date(workout.date).toLocaleDateString()}
                        </div>
                        <Badge variant="outline">+{workout.xpGained} XP</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {workout.equipment.map((item, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}