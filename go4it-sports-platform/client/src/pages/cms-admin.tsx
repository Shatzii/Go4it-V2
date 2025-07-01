import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  FileText, 
  Trophy, 
  Menu,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  Globe,
  Palette
} from "lucide-react";

interface CmsContent {
  id: number;
  slug: string;
  title: string;
  content: string;
  type: string;
  status: string;
  metadata: string;
  createdAt: string;
  updatedAt: string;
}

interface CmsSports {
  id: number;
  name: string;
  description: string;
  skills: string;
  drills: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface CmsSettings {
  id: number;
  key: string;
  value: string;
  type: string;
  category: string;
  description: string;
  updatedAt: string;
}

export default function CmsAdmin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("content");
  const [editingContent, setEditingContent] = useState<CmsContent | null>(null);
  const [editingSport, setEditingSport] = useState<CmsSports | null>(null);
  const [editingSetting, setEditingSetting] = useState<CmsSettings | null>(null);

  // Fetch CMS data
  const { data: content = [] } = useQuery<CmsContent[]>({
    queryKey: ["/api/cms/content"],
  });

  const { data: sports = [] } = useQuery<CmsSports[]>({
    queryKey: ["/api/cms/sports"],
  });

  const { data: settings = [] } = useQuery<CmsSettings[]>({
    queryKey: ["/api/cms/settings"],
  });

  // Content mutations
  const createContentMutation = useMutation({
    mutationFn: async (data: Partial<CmsContent>) => {
      return await apiRequest("/api/cms/content", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/content"] });
      setEditingContent(null);
      toast({
        title: "Content Created",
        description: "Content has been successfully created.",
      });
    },
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<CmsContent> & { id: number }) => {
      return await apiRequest(`/api/cms/content/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/content"] });
      setEditingContent(null);
      toast({
        title: "Content Updated",
        description: "Content has been successfully updated.",
      });
    },
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/cms/content/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/content"] });
      toast({
        title: "Content Deleted",
        description: "Content has been successfully deleted.",
      });
    },
  });

  // Sports mutations
  const createSportMutation = useMutation({
    mutationFn: async (data: Partial<CmsSports>) => {
      return await apiRequest("/api/cms/sports", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/sports"] });
      setEditingSport(null);
      toast({
        title: "Sport Created",
        description: "Sport has been successfully created.",
      });
    },
  });

  const updateSportMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<CmsSports> & { id: number }) => {
      return await apiRequest(`/api/cms/sports/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/sports"] });
      setEditingSport(null);
      toast({
        title: "Sport Updated",
        description: "Sport has been successfully updated.",
      });
    },
  });

  // Settings mutations
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      return await apiRequest(`/api/cms/settings/${key}`, "PUT", { value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/settings"] });
      setEditingSetting(null);
      toast({
        title: "Setting Updated",
        description: "Setting has been successfully updated.",
      });
    },
  });

  const handleContentSubmit = (formData: FormData) => {
    const data = {
      slug: formData.get("slug") as string,
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      metadata: formData.get("metadata") as string || "{}",
    };

    if (editingContent?.id) {
      updateContentMutation.mutate({ id: editingContent.id, ...data });
    } else {
      createContentMutation.mutate(data);
    }
  };

  const handleSportSubmit = (formData: FormData) => {
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      skills: formData.get("skills") as string,
      drills: formData.get("drills") as string,
      isActive: formData.get("isActive") === "true",
      displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
    };

    if (editingSport?.id) {
      updateSportMutation.mutate({ id: editingSport.id, ...data });
    } else {
      createSportMutation.mutate(data);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8" />
          CMS Administration
        </h1>
        <p className="text-slate-300 text-lg">
          Manage platform content, sports configuration, and system settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="sports" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Sports
          </TabsTrigger>
          <TabsTrigger value="menus" className="flex items-center gap-2">
            <Menu className="w-4 h-4" />
            Menus
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Content Management */}
        <TabsContent value="content" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Content Management</h2>
            <Button
              onClick={() => setEditingContent({
                id: 0,
                slug: "",
                title: "",
                content: "",
                type: "page",
                status: "draft",
                metadata: "{}",
                createdAt: "",
                updatedAt: ""
              })}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Content
            </Button>
          </div>

          {editingContent && (
            <Card className="go4it-card">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingContent.id ? "Edit Content" : "Create Content"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleContentSubmit(new FormData(e.currentTarget));
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="text-slate-300">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={editingContent.title}
                        className="bg-slate-800 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug" className="text-slate-300">Slug</Label>
                      <Input
                        id="slug"
                        name="slug"
                        defaultValue={editingContent.slug}
                        className="bg-slate-800 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type" className="text-slate-300">Type</Label>
                      <Select name="type" defaultValue={editingContent.type}>
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="page">Page</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="faq">FAQ</SelectItem>
                          <SelectItem value="feature">Feature</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status" className="text-slate-300">Status</Label>
                      <Select name="status" defaultValue={editingContent.status}>
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content" className="text-slate-300">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      defaultValue={editingContent.content}
                      className="bg-slate-800 border-slate-600 text-white min-h-[200px]"
                      placeholder="Enter content (supports markdown)"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Content
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingContent(null)}
                      className="border-slate-600 text-slate-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {content.map((item: CmsContent) => (
              <Card key={item.id} className="go4it-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        <Badge variant={item.status === "published" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">/{item.slug}</p>
                      <p className="text-slate-400 text-sm">
                        Updated: {new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingContent(item)}
                        className="border-slate-600 text-slate-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteContentMutation.mutate(item.id)}
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sports Management */}
        <TabsContent value="sports" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Sports Configuration</h2>
            <Button
              onClick={() => setEditingSport({
                id: 0,
                name: "",
                description: "",
                skills: "[]",
                drills: "[]",
                isActive: true,
                displayOrder: 0,
                createdAt: "",
                updatedAt: ""
              })}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Sport
            </Button>
          </div>

          {editingSport && (
            <Card className="go4it-card">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingSport.id ? "Edit Sport" : "Create Sport"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSportSubmit(new FormData(e.currentTarget));
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-slate-300">Sport Name</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingSport.name}
                        className="bg-slate-800 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="displayOrder" className="text-slate-300">Display Order</Label>
                      <Input
                        id="displayOrder"
                        name="displayOrder"
                        type="number"
                        defaultValue={editingSport.displayOrder}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-slate-300">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingSport.description}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="skills" className="text-slate-300">Skills (JSON Format)</Label>
                    <Textarea
                      id="skills"
                      name="skills"
                      defaultValue={editingSport.skills}
                      className="bg-slate-800 border-slate-600 text-white"
                      placeholder='["accuracy", "speed", "agility"]'
                    />
                  </div>

                  <div>
                    <Label htmlFor="drills" className="text-slate-300">Drills (JSON Format)</Label>
                    <Textarea
                      id="drills"
                      name="drills"
                      defaultValue={editingSport.drills}
                      className="bg-slate-800 border-slate-600 text-white"
                      placeholder='[{"name": "Drill Name", "description": "Description"}]'
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      value="true"
                      defaultChecked={editingSport.isActive}
                      className="rounded border-slate-600"
                    />
                    <Label htmlFor="isActive" className="text-slate-300">Active</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Sport
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingSport(null)}
                      className="border-slate-600 text-slate-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {sports.map((sport: CmsSports) => (
              <Card key={sport.id} className="go4it-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{sport.name}</h3>
                        <Badge variant={sport.isActive ? "default" : "secondary"}>
                          {sport.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          Order: {sport.displayOrder}
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">{sport.description}</p>
                      <p className="text-slate-400 text-sm">
                        Updated: {new Date(sport.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingSport(sport)}
                        className="border-slate-600 text-slate-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Menu Management */}
        <TabsContent value="menus" className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Menu Management</h2>
          <Card className="go4it-card">
            <CardContent className="p-6">
              <p className="text-slate-300">Menu management features coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Management */}
        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Platform Settings</h2>
          <div className="grid gap-4">
            {settings.map((setting: CmsSettings) => (
              <Card key={setting.id} className="go4it-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{setting.key}</h3>
                      <p className="text-slate-300 text-sm mb-2">{setting.description}</p>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {setting.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-slate-300">
                        Current: <span className="text-white">{setting.value}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingSetting(setting)}
                        className="border-slate-600 text-slate-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}