import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ContentBlockManager from "@/components/admin/ContentBlockManager";
import PageManager from "@/components/admin/PageManager";
import PageComponentEditor from "@/components/admin/PageComponentEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutGrid, FileText, Blocks, Settings, Users, Code, Package, FileCode } from "lucide-react";

export default function CmsManager() {
  const [selectedTab, setSelectedTab] = useState('content-blocks');
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CMS Manager</h1>
          <p className="text-muted-foreground">
            Manage your website content, pages, and components
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="content-blocks" className="flex items-center">
                <Blocks className="w-4 h-4 mr-2" />
                Content Blocks
              </TabsTrigger>
              <TabsTrigger value="pages" className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Pages
              </TabsTrigger>
              <TabsTrigger 
                value="page-editor" 
                className="flex items-center"
                disabled={!selectedPageId}
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                Page Editor
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <TabsTrigger 
                value="settings" 
                className="flex items-center px-3"
                variant="outline"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </div>
          </div>

          <TabsContent value="content-blocks" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl">Content Blocks</CardTitle>
                <CardDescription>
                  Create and manage reusable content blocks for your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentBlockManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl">Page Manager</CardTitle>
                <CardDescription>
                  Create and manage pages on your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PageManager 
                  onSelectPage={(pageId) => {
                    setSelectedPageId(pageId);
                    setSelectedTab('page-editor');
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="page-editor" className="space-y-4">
            {selectedPageId ? (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-2xl">Page Component Editor</CardTitle>
                      <CardDescription>
                        Edit the components and layout of your page
                      </CardDescription>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <button 
                        className="text-primary hover:underline flex items-center"
                        onClick={() => setSelectedTab('pages')}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Back to Pages
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <PageComponentEditor pageId={selectedPageId} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No Page Selected</h3>
                    <p className="text-muted-foreground mb-4">
                      Select a page from the Page Manager to edit its components
                    </p>
                    <button
                      className="text-primary hover:underline flex items-center justify-center mx-auto"
                      onClick={() => setSelectedTab('pages')}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Go to Page Manager
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl">CMS Settings</CardTitle>
                <CardDescription>
                  Configure your CMS settings and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SettingsCard 
                    title="Content Types" 
                    description="Configure content type schemas and fields"
                    icon={<FileCode className="w-8 h-8" />}
                  />
                  <SettingsCard 
                    title="Component Library" 
                    description="Manage your component library and templates"
                    icon={<Package className="w-8 h-8" />}
                  />
                  <SettingsCard 
                    title="User Permissions" 
                    description="Configure user roles and permissions"
                    icon={<Users className="w-8 h-8" />}
                  />
                  <SettingsCard 
                    title="API Access" 
                    description="Manage API keys and access permissions"
                    icon={<Code className="w-8 h-8" />}
                  />
                  <SettingsCard 
                    title="Workflows" 
                    description="Configure content approval workflows"
                    icon={<Blocks className="w-8 h-8" />}
                  />
                  <SettingsCard 
                    title="Site Settings" 
                    description="Configure global site settings and metadata"
                    icon={<Settings className="w-8 h-8" />}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SettingsCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <Card className="hover:border-primary cursor-pointer transition-colors">
      <CardContent className="pt-6">
        <div className="flex gap-4 items-start">
          <div className="bg-primary/10 p-3 rounded-md text-primary">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}