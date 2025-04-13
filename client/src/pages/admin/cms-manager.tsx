import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Rocket, BookOpen, LayoutTemplate, PanelLeft, 
  LayoutDashboard, PlusCircle, Workflow, Component, 
  Grid3X3
} from "lucide-react";
import ContentBlockManager from "@/components/admin/ContentBlockManager";
import PageManager from "@/components/admin/PageManager";

export default function CMSManager() {
  const [activeTab, setActiveTab] = useState("pages");
  const navigate = useNavigate();

  // Fetch summary data 
  const { data: pages = [], isLoading: loadingPages } = useQuery({
    queryKey: ['/api/pages'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/pages');
        if (!response.ok) return [];
        return response.json();
      } catch (err) {
        console.error("Error fetching pages:", err);
        return [];
      }
    }
  });

  const { data: contentBlocks = [], isLoading: loadingBlocks } = useQuery({
    queryKey: ['/api/content-blocks'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/content-blocks');
        if (!response.ok) return [];
        return response.json();
      } catch (err) {
        console.error("Error fetching content blocks:", err);
        return [];
      }
    }
  });

  // Get unique sections
  const sections = Array.from(
    new Set(contentBlocks.map((block: any) => block.section).filter(Boolean))
  );

  // Dashboard stats
  const stats = [
    { 
      title: "Pages", 
      value: pages.length, 
      description: "Total CMS pages", 
      icon: <BookOpen className="h-5 w-5" /> 
    },
    { 
      title: "Content Blocks", 
      value: contentBlocks.length, 
      description: "Reusable content pieces", 
      icon: <Grid3X3 className="h-5 w-5" />
    },
    { 
      title: "Sections", 
      value: sections.length, 
      description: "Content categories", 
      icon: <PanelLeft className="h-5 w-5" />
    },
    { 
      title: "Published", 
      value: pages.filter((page: any) => page.active).length, 
      description: "Active pages", 
      icon: <Rocket className="h-5 w-5" />
    }
  ];

  return (
    <div className="container max-w-screen-2xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Content Management System</h1>
          <p className="text-muted-foreground">
            Manage all website content through a centralized CMS
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/admin-dashboard")}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button onClick={() => navigate("/cms-home")}>
            <Rocket className="h-4 w-4 mr-2" />
            View Live Site
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold mt-1">
                    {loadingPages || loadingBlocks ? "..." : stat.value}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className="rounded-full p-3 bg-primary/10">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button variant="outline" onClick={() => {
          setActiveTab("pages");
          setTimeout(() => {
            const createBtn = document.querySelector('[data-action="create-page"]') as HTMLButtonElement;
            if (createBtn) createBtn.click();
          }, 100);
        }}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Page
        </Button>
        <Button variant="outline" onClick={() => {
          setActiveTab("blocks");
          setTimeout(() => {
            const createBtn = document.querySelector('[data-action="create-block"]') as HTMLButtonElement;
            if (createBtn) createBtn.click();
          }, 100);
        }}>
          <Component className="h-4 w-4 mr-2" />
          New Content Block
        </Button>
        <Button variant="outline" onClick={() => setActiveTab("layout")}>
          <LayoutTemplate className="h-4 w-4 mr-2" />
          Layout Builder
        </Button>
        <Button variant="outline" onClick={() => navigate("/admin/content-workflows")}>
          <Workflow className="h-4 w-4 mr-2" />
          Content Workflows
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="blocks" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Content Blocks
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4" />
            Layout Builder
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            CMS Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pages" className="mt-6">
          <PageManager />
        </TabsContent>
        
        <TabsContent value="blocks" className="mt-6">
          <ContentBlockManager />
        </TabsContent>
        
        <TabsContent value="layout" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Layout Builder</CardTitle>
              <CardDescription>
                Visually arrange content blocks into page layouts
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <div className="text-center p-8 border rounded-md border-dashed">
                <p className="mb-4 text-muted-foreground">
                  The layout builder is coming soon. It will allow you to visually
                  arrange content blocks and components into complete page layouts.
                </p>
                <Button disabled>Coming Soon</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>CMS Settings</CardTitle>
              <CardDescription>
                Configure global CMS settings and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <div className="text-center p-8 border rounded-md border-dashed">
                <p className="mb-4 text-muted-foreground">
                  CMS settings will be available soon. Here you'll be able to manage
                  site-wide configurations, user roles, and publication workflows.
                </p>
                <Button disabled>Coming Soon</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}