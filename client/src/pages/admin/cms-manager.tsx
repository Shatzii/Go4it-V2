import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, LayoutGrid, Layers, FileEdit, Eye } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'wouter';
import PageManager from '@/components/admin/PageManager';
import ContentBlockManager from '@/components/admin/ContentBlockManager';
import PageComponentEditor from '@/components/admin/PageComponentEditor';
import { componentRegistry } from '@/services/component-registry-service';

export default function CmsManager() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("pages");
  
  // Get registered components from the registry
  const registeredComponents = componentRegistry.getRegisteredComponents();

  return (
    <div className="container max-w-screen-2xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">CMS Manager</h1>
          <p className="text-muted-foreground">
            Manage pages, content blocks, and components for the Go4It Sports platform
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" asChild>
            <Link href="/">
              <Eye className="h-4 w-4 mr-2" />
              Preview Site
            </Link>
          </Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Page
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="content-blocks" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Content Blocks
          </TabsTrigger>
          <TabsTrigger value="components" className="flex items-center gap-2">
            <FileEdit className="h-4 w-4" />
            Components
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pages">
          <PageManager />
        </TabsContent>
        
        <TabsContent value="content-blocks">
          <ContentBlockManager />
        </TabsContent>
        
        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle>Registered Components</CardTitle>
              <CardDescription>
                Manage UI components that can be used in pages and content blocks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {registeredComponents.map((component) => (
                  <Card key={component.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{component.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {component.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{component.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex flex-wrap gap-1 mb-4">
                        {component.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm">
                          <FileEdit className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {registeredComponents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No components have been registered yet.
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Register components with the Component Registry to make them available for use in the CMS.
                  </p>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Register Component
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}