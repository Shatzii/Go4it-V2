import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  VideoIcon, 
  Settings, 
  Trash2, 
  Edit, 
  Plus, 
  Check, 
  X,
  FileVideo,
  Clock,
  Gauge
} from "lucide-react";

const sportOptions = [
  "basketball",
  "football",
  "baseball",
  "soccer",
  "volleyball",
  "track",
  "swimming",
  "tennis",
  "golf",
  "other"
];

interface HighlightGeneratorConfig {
  id: number;
  name: string;
  sportType: string;
  description: string | null;
  minDuration: number | null;
  maxDuration: number | null;
  qualityThreshold: number | null;
  includeSlowMotion: boolean;
  includeCaptions: boolean;
  prioritizeActions: boolean;
  defaultTransition: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export default function HighlightConfigManager() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<HighlightGeneratorConfig | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sportType: "basketball",
    description: "",
    minDuration: 15,
    maxDuration: 60,
    qualityThreshold: 70,
    includeSlowMotion: true,
    includeCaptions: true,
    prioritizeActions: true,
    defaultTransition: "fade",
    active: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all highlight generator configs
  const { data: configs, isLoading } = useQuery<HighlightGeneratorConfig[]>({
    queryKey: ["/api/highlight-generator/configs"],
  });

  // Create new config mutation
  const createConfigMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/highlight-generator/configs", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Configuration Created",
        description: "The highlight generator configuration was created successfully.",
        variant: "default",
      });
      setIsAddDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["/api/highlight-generator/configs"] });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: "There was a problem creating the configuration. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update config mutation
  const updateConfigMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<typeof formData> }) => {
      const response = await apiRequest("PUT", `/api/highlight-generator/configs/${id}`, data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Configuration Updated",
        description: "The highlight generator configuration was updated successfully.",
        variant: "default",
      });
      setIsEditDialogOpen(false);
      setCurrentConfig(null);
      queryClient.invalidateQueries({ queryKey: ["/api/highlight-generator/configs"] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "There was a problem updating the configuration. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete config mutation
  const deleteConfigMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/highlight-generator/configs/${id}`);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Configuration Deleted",
        description: "The highlight generator configuration was deleted successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/highlight-generator/configs"] });
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: "There was a problem deleting the configuration. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle toggle/switch changes
  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle slider changes
  const handleSliderChange = (name: string, values: number[]) => {
    setFormData({
      ...formData,
      [name]: values[0]
    });
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: "",
      sportType: "basketball",
      description: "",
      minDuration: 15,
      maxDuration: 60,
      qualityThreshold: 70,
      includeSlowMotion: true,
      includeCaptions: true,
      prioritizeActions: true,
      defaultTransition: "fade",
      active: true
    });
  };

  // Handle edit button click
  const handleEditClick = (config: HighlightGeneratorConfig) => {
    setCurrentConfig(config);
    setFormData({
      name: config.name,
      sportType: config.sportType,
      description: config.description || "",
      minDuration: config.minDuration || 15,
      maxDuration: config.maxDuration || 60,
      qualityThreshold: config.qualityThreshold || 70,
      includeSlowMotion: config.includeSlowMotion,
      includeCaptions: config.includeCaptions,
      prioritizeActions: config.prioritizeActions,
      defaultTransition: config.defaultTransition || "fade",
      active: config.active
    });
    setIsEditDialogOpen(true);
  };

  // Toggle active state
  const toggleActiveState = (config: HighlightGeneratorConfig) => {
    updateConfigMutation.mutate({
      id: config.id,
      data: { active: !config.active }
    });
  };

  const confirmDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this configuration?")) {
      deleteConfigMutation.mutate(id);
    }
  };

  // Submit form handlers
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createConfigMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentConfig) {
      updateConfigMutation.mutate({
        id: currentConfig.id,
        data: formData
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading highlight generator configurations...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <FileVideo className="h-5 w-5 mr-2" />
            Highlight Generator Configurations
          </CardTitle>
          <CardDescription>
            Manage the settings and options for the AI highlight generator
          </CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Configuration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleAddSubmit}>
              <DialogHeader>
                <DialogTitle>Add Highlight Generator Configuration</DialogTitle>
                <DialogDescription>
                  Create a new configuration for a specific sport type.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Basketball Highlights"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="sportType">Sport Type</Label>
                  <Select
                    value={formData.sportType}
                    onValueChange={(value) => handleSelectChange("sportType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {sportOptions.map((sport) => (
                        <SelectItem key={sport} value={sport}>
                          {sport.charAt(0).toUpperCase() + sport.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Configuration for basketball highlights"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Duration Range (seconds)</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="minDuration">Min</Label>
                      <Input
                        id="minDuration"
                        name="minDuration"
                        type="number"
                        min="5"
                        max="120"
                        value={formData.minDuration}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="maxDuration">Max</Label>
                      <Input
                        id="maxDuration"
                        name="maxDuration"
                        type="number"
                        min="10"
                        max="300"
                        value={formData.maxDuration}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="qualityThreshold">
                    Quality Threshold ({formData.qualityThreshold}%)
                  </Label>
                  <Slider
                    value={[formData.qualityThreshold]}
                    min={0}
                    max={100}
                    step={5}
                    className="pt-2"
                    onValueChange={(values) => handleSliderChange("qualityThreshold", values)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeSlowMotion"
                    checked={formData.includeSlowMotion}
                    onCheckedChange={(checked) => handleToggleChange("includeSlowMotion", checked)}
                  />
                  <Label htmlFor="includeSlowMotion">Include Slow Motion</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="includeCaptions"
                    checked={formData.includeCaptions}
                    onCheckedChange={(checked) => handleToggleChange("includeCaptions", checked)}
                  />
                  <Label htmlFor="includeCaptions">Include Captions</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="prioritizeActions"
                    checked={formData.prioritizeActions}
                    onCheckedChange={(checked) => handleToggleChange("prioritizeActions", checked)}
                  />
                  <Label htmlFor="prioritizeActions">Prioritize Action Sequences</Label>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="defaultTransition">Default Transition</Label>
                  <Select
                    value={formData.defaultTransition}
                    onValueChange={(value) => handleSelectChange("defaultTransition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a transition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fade">Fade</SelectItem>
                      <SelectItem value="cut">Cut</SelectItem>
                      <SelectItem value="dissolve">Dissolve</SelectItem>
                      <SelectItem value="wipe">Wipe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleToggleChange("active", checked)}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createConfigMutation.isPending}>
                  {createConfigMutation.isPending ? "Creating..." : "Create Configuration"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Quality</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!configs || configs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No highlight generator configurations found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              configs.map((config: HighlightGeneratorConfig) => (
                <TableRow key={config.id}>
                  <TableCell className="font-medium">{config.name}</TableCell>
                  <TableCell className="capitalize">{config.sportType}</TableCell>
                  <TableCell className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    {config.minDuration || 15}-{config.maxDuration || 60}s
                  </TableCell>
                  <TableCell className="flex items-center">
                    <Gauge className="h-4 w-4 mr-1 text-muted-foreground" />
                    {config.qualityThreshold || 70}%
                  </TableCell>
                  <TableCell>
                    {config.active ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        <Check className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                        <X className="h-3 w-3 mr-1" /> Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleActiveState(config)}
                        title={config.active ? "Deactivate" : "Activate"}
                      >
                        {config.active ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(config)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => confirmDelete(config.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Highlight Generator Configuration</DialogTitle>
              <DialogDescription>
                Modify settings for the highlight generator configuration.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Basketball Highlights"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-sportType">Sport Type</Label>
                <Select
                  value={formData.sportType}
                  onValueChange={(value) => handleSelectChange("sportType", value)}
                >
                  <SelectTrigger id="edit-sportType">
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sportOptions.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport.charAt(0).toUpperCase() + sport.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  name="description"
                  placeholder="Configuration for basketball highlights"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Duration Range (seconds)</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="edit-minDuration">Min</Label>
                    <Input
                      id="edit-minDuration"
                      name="minDuration"
                      type="number"
                      min="5"
                      max="120"
                      value={formData.minDuration}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="edit-maxDuration">Max</Label>
                    <Input
                      id="edit-maxDuration"
                      name="maxDuration"
                      type="number"
                      min="10"
                      max="300"
                      value={formData.maxDuration}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-qualityThreshold">
                  Quality Threshold ({formData.qualityThreshold}%)
                </Label>
                <Slider
                  id="edit-qualityThreshold"
                  value={[formData.qualityThreshold]}
                  min={0}
                  max={100}
                  step={5}
                  className="pt-2"
                  onValueChange={(values) => handleSliderChange("qualityThreshold", values)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-includeSlowMotion"
                  checked={formData.includeSlowMotion}
                  onCheckedChange={(checked) => handleToggleChange("includeSlowMotion", checked)}
                />
                <Label htmlFor="edit-includeSlowMotion">Include Slow Motion</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-includeCaptions"
                  checked={formData.includeCaptions}
                  onCheckedChange={(checked) => handleToggleChange("includeCaptions", checked)}
                />
                <Label htmlFor="edit-includeCaptions">Include Captions</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-prioritizeActions"
                  checked={formData.prioritizeActions}
                  onCheckedChange={(checked) => handleToggleChange("prioritizeActions", checked)}
                />
                <Label htmlFor="edit-prioritizeActions">Prioritize Action Sequences</Label>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-defaultTransition">Default Transition</Label>
                <Select
                  value={formData.defaultTransition}
                  onValueChange={(value) => handleSelectChange("defaultTransition", value)}
                >
                  <SelectTrigger id="edit-defaultTransition">
                    <SelectValue placeholder="Select a transition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fade">Fade</SelectItem>
                    <SelectItem value="cut">Cut</SelectItem>
                    <SelectItem value="dissolve">Dissolve</SelectItem>
                    <SelectItem value="wipe">Wipe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleToggleChange("active", checked)}
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateConfigMutation.isPending}>
                {updateConfigMutation.isPending ? "Updating..." : "Update Configuration"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}