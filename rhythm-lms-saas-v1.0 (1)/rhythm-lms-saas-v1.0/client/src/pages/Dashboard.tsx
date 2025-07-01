import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { SiteNavigation } from '@/components/layout/SiteNavigation';
import { SiteStructureManager, SiteStructure } from '@/components/editor/SiteStructureManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  FileEdit, 
  Globe, 
  Gauge, 
  PlusCircle, 
  Settings,
  BarChart3,
  Layers,
  FileText,
  FolderTree
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Placeholder for analytics data
interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageTime: string;
  bounceRate: string;
  topPages: Array<{ title: string; views: number }>;
}

const Dashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false
  );
  const [siteStructureOpen, setSiteStructureOpen] = useState(false);
  const [siteStructure, setSiteStructure] = useState<SiteStructure | undefined>();
  const [ageGroup, setAgeGroup] = useState<'kids' | 'teens' | 'all'>('kids');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    pageViews: 156,
    uniqueVisitors: 84,
    averageTime: '2m 45s',
    bounceRate: '32%',
    topPages: [
      { title: 'Home', views: 78 },
      { title: 'About Us', views: 42 },
      { title: 'Contact', views: 36 }
    ]
  });
  const { toast } = useToast();

  // Toggle dark mode
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  // Load site structure from local storage
  useEffect(() => {
    const savedStructure = localStorage.getItem('siteStructure');
    if (savedStructure) {
      try {
        setSiteStructure(JSON.parse(savedStructure));
      } catch (e) {
        console.error('Error parsing saved site structure:', e);
      }
    }
    
    // Load age group preference
    const savedAgeGroup = localStorage.getItem('ageGroup');
    if (savedAgeGroup && ['kids', 'teens', 'all'].includes(savedAgeGroup)) {
      setAgeGroup(savedAgeGroup as 'kids' | 'teens' | 'all');
    }
    
    // Apply dark mode if set
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Update site structure
  const handleUpdateSiteStructure = (structure: SiteStructure) => {
    setSiteStructure(structure);
    localStorage.setItem('siteStructure', JSON.stringify(structure));
    
    toast({
      title: ageGroup === 'kids' ? '🎉 Website updated!' : 'Site structure updated',
      description: ageGroup === 'kids' 
        ? 'Your website map has been saved!' 
        : 'Your site structure changes have been applied successfully.'
    });
  };

  // Create a new page
  const handleCreatePage = (page: any) => {
    // In a real implementation, this would create a file on the server
    toast({
      title: ageGroup === 'kids' ? '🎉 New page created!' : 'Page created',
      description: ageGroup === 'kids' 
        ? `Your "${page.title}" page is ready to edit!` 
        : `"${page.title}" has been added to your site.`
    });
  };

  // Change age group setting
  const handleAgeGroupChange = (value: string) => {
    const newAgeGroup = value as 'kids' | 'teens' | 'all';
    setAgeGroup(newAgeGroup);
    localStorage.setItem('ageGroup', newAgeGroup);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNavigation 
        siteStructure={siteStructure}
        onEditStructure={() => setSiteStructureOpen(true)}
        onThemeToggle={toggleTheme}
        isDarkMode={isDarkMode}
        ageGroup={ageGroup}
      />
      
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            {ageGroup === 'kids' ? '🚀 My Dashboard' : 'Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {ageGroup === 'kids' 
              ? 'Welcome to your awesome website control center!' 
              : 'Manage your website and monitor its performance.'}
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pages
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {siteStructure?.pages.length || 3}
              </div>
              <p className="text-xs text-muted-foreground">
                {siteStructure?.pages.filter(p => p.isPublished).length || 3} published
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {ageGroup === 'kids' ? 'Website Visitors' : 'Unique Visitors'}
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.uniqueVisitors}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {ageGroup === 'kids' ? 'Page Views' : 'Total Page Views'}
              </CardTitle>
              <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.pageViews}
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.averageTime} avg. time
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {ageGroup === 'kids' ? 'Site Structure' : 'Site Architecture'}
              </CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {siteStructure?.navigation.mainMenu.length || 3}
              </div>
              <p className="text-xs text-muted-foreground">
                Navigation items
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileEdit className="h-4 w-4" />
              <span>Pages</span>
            </TabsTrigger>
            <TabsTrigger value="structure" className="flex items-center gap-2">
              <FolderTree className="h-4 w-4" />
              <span>Structure</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {ageGroup === 'kids' ? 'What People Are Looking At' : 'Page Performance'}
                  </CardTitle>
                  <CardDescription>
                    {ageGroup === 'kids' 
                      ? 'See which pages visitors like the most!' 
                      : 'Most viewed pages in the last 30 days.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.topPages.map((page, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs mr-2">
                            {i + 1}
                          </div>
                          <span>{page.title}</span>
                        </div>
                        <span className="text-muted-foreground">{page.views} views</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {ageGroup === 'kids' ? 'Quick Actions' : 'Quick Actions'}
                  </CardTitle>
                  <CardDescription>
                    {ageGroup === 'kids' 
                      ? 'Do cool stuff with your website!' 
                      : 'Common tasks and shortcuts.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => setSiteStructureOpen(true)}
                  >
                    <FolderTree className="h-4 w-4 mr-2" />
                    {ageGroup === 'kids' 
                      ? 'Edit Website Map' 
                      : 'Manage Site Structure'}
                  </Button>
                  
                  <Link href="/editor">
                    <Button variant="outline" className="w-full justify-start text-left">
                      <FileEdit className="h-4 w-4 mr-2" />
                      {ageGroup === 'kids' 
                        ? 'Create & Edit Pages' 
                        : 'Page Editor'}
                    </Button>
                  </Link>
                  
                  <Button variant="outline" className="w-full justify-start text-left">
                    <Globe className="h-4 w-4 mr-2" />
                    {ageGroup === 'kids' 
                      ? 'View My Website' 
                      : 'Visit Site'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="pages">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {ageGroup === 'kids' ? 'My Website Pages' : 'Pages'}
                  </CardTitle>
                  <CardDescription>
                    {ageGroup === 'kids' 
                      ? 'All the pages on your website' 
                      : 'Manage all pages in your site.'}
                  </CardDescription>
                </div>
                <Button size="sm" onClick={() => setSiteStructureOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {ageGroup === 'kids' ? 'Add Page' : 'New Page'}
                </Button>
              </CardHeader>
              <CardContent>
                {(siteStructure?.pages || []).length > 0 ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-3 p-4 text-sm font-medium">
                      <div>Page</div>
                      <div>URL</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y">
                      {(siteStructure?.pages || []).map((page, i) => (
                        <div key={i} className="grid grid-cols-3 p-4 text-sm items-center">
                          <div className="font-medium">
                            {page.title} 
                            {page.isHomePage && (
                              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                Home
                              </span>
                            )}
                          </div>
                          <div className="text-muted-foreground">/{page.slug}</div>
                          <div>
                            {page.isPublished ? (
                              <span className="inline-flex h-6 items-center justify-center rounded-full bg-green-50 px-2 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex h-6 items-center justify-center rounded-full bg-amber-50 px-2 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                Draft
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-1">
                      {ageGroup === 'kids' ? 'No pages yet!' : 'No pages found'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {ageGroup === 'kids' 
                        ? 'Click the "Add Page" button to create your first page!' 
                        : 'Get started by creating your first page.'}
                    </p>
                    <Button onClick={() => setSiteStructureOpen(true)}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      {ageGroup === 'kids' ? 'Add My First Page' : 'Create Page'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="structure">
            <Card>
              <CardHeader>
                <CardTitle>
                  {ageGroup === 'kids' ? 'Website Map' : 'Site Structure'}
                </CardTitle>
                <CardDescription>
                  {ageGroup === 'kids'
                    ? 'This is how your website is organized!'
                    : 'Manage your site organization and navigation.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="p-4">
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-1">
                        {ageGroup === 'kids' ? 'Website Name' : 'Site Name'}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {siteStructure?.settings.siteName || 'My Website'}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-1">
                        {ageGroup === 'kids' ? 'Menu Items' : 'Navigation Items'}
                      </h3>
                      <ul className="space-y-1">
                        {(siteStructure?.navigation.mainMenu || []).map((item, i) => (
                          <li key={i} className="text-sm flex items-center">
                            <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs mr-2">
                              {i + 1}
                            </span>
                            <span className="font-medium">{item.label}</span>
                            <span className="text-muted-foreground ml-2">
                              {item.link}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-6">
                      <Button onClick={() => setSiteStructureOpen(true)}>
                        <FolderTree className="h-4 w-4 mr-2" />
                        {ageGroup === 'kids' 
                          ? 'Change Website Map' 
                          : 'Edit Site Structure'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>
                  {ageGroup === 'kids' ? 'Website Settings' : 'Settings'}
                </CardTitle>
                <CardDescription>
                  {ageGroup === 'kids'
                    ? 'Change how your website looks and works'
                    : 'Manage your site preferences and configuration.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {ageGroup === 'kids' ? 'Kid Mode' : 'Interface Mode'}
                    </label>
                    <div className="flex flex-col space-y-1.5">
                      <select
                        value={ageGroup}
                        onChange={(e) => handleAgeGroupChange(e.target.value)}
                        className="border rounded-md p-2"
                      >
                        <option value="kids">Kid-friendly</option>
                        <option value="teens">Teen Mode</option>
                        <option value="all">Standard</option>
                      </select>
                      <p className="text-xs text-muted-foreground">
                        {ageGroup === 'kids'
                          ? 'Makes everything super easy to understand!'
                          : 'Choose how instructions and interfaces are presented.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {ageGroup === 'kids' ? 'Dark Mode' : 'Theme Preference'}
                    </label>
                    <div className="flex flex-col space-y-1.5">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={toggleTheme}
                      >
                        {isDarkMode ? (
                          <>
                            <Sun className="h-4 w-4 mr-2" />
                            {ageGroup === 'kids' ? 'Switch to Light Mode' : 'Light Mode'}
                          </>
                        ) : (
                          <>
                            <Moon className="h-4 w-4 mr-2" />
                            {ageGroup === 'kids' ? 'Switch to Dark Mode' : 'Dark Mode'}
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        {ageGroup === 'kids'
                          ? 'Change between light and dark colors'
                          : 'Set your preferred color scheme for the interface.'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <SiteStructureManager
        isOpen={siteStructureOpen}
        onClose={() => setSiteStructureOpen(false)}
        onCreatePage={handleCreatePage}
        onUpdateSiteStructure={handleUpdateSiteStructure}
        currentStructure={siteStructure}
        ageGroup={ageGroup}
      />
    </div>
  );
};

export default Dashboard;