import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FolderTree, Plus, ChevronRight, ChevronDown, File, Folder, Home, 
  ExternalLink, Trash2, Edit, Copy, LayoutGrid, ListTree, Settings, Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SiteStructureManagerProps {
  isOpen: boolean;
  onClose: () => void;
  ageGroup?: 'kids' | 'teens' | 'all';
  onCreatePage: (page: PageConfig) => void;
  onUpdateSiteStructure: (structure: SiteStructure) => void;
  currentStructure?: SiteStructure;
}

export interface PageConfig {
  id: string;
  title: string;
  slug: string;
  template?: string;
  parent?: string;
  order?: number;
  isHomePage?: boolean;
  isPublished?: boolean;
  meta?: {
    description?: string;
    keywords?: string[];
    [key: string]: any;
  };
}

export interface SiteStructure {
  pages: PageConfig[];
  navigation: {
    mainMenu: NavItem[];
    footerMenu?: NavItem[];
  };
  settings: {
    siteName: string;
    theme?: string;
    logo?: string;
    favicon?: string;
    [key: string]: any;
  };
}

interface NavItem {
  id: string;
  label: string;
  link: string;
  parent?: string;
  children?: NavItem[];
  order?: number;
}

export const SiteStructureManager: React.FC<SiteStructureManagerProps> = ({
  isOpen,
  onClose,
  ageGroup = 'kids',
  onCreatePage,
  onUpdateSiteStructure,
  currentStructure
}) => {
  // Default site structure if none provided
  const defaultStructure: SiteStructure = {
    pages: [
      {
        id: 'home',
        title: 'Home',
        slug: 'home',
        isHomePage: true,
        isPublished: true
      },
      {
        id: 'about',
        title: 'About Us',
        slug: 'about',
        isPublished: true
      },
      {
        id: 'contact',
        title: 'Contact',
        slug: 'contact',
        isPublished: true
      }
    ],
    navigation: {
      mainMenu: [
        {
          id: 'nav-home',
          label: 'Home',
          link: '/'
        },
        {
          id: 'nav-about',
          label: 'About Us',
          link: '/about'
        },
        {
          id: 'nav-contact',
          label: 'Contact',
          link: '/contact'
        }
      ]
    },
    settings: {
      siteName: ageGroup === 'kids' ? 'My Awesome Website' : 'My Website'
    }
  };
  
  const [siteStructure, setSiteStructure] = useState<SiteStructure>(
    currentStructure || defaultStructure
  );
  const [activeTab, setActiveTab] = useState('pages');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [newPage, setNewPage] = useState<Partial<PageConfig>>({
    title: '',
    slug: '',
    parent: ''
  });
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');
  
  // Update local state when props change
  useEffect(() => {
    if (currentStructure) {
      setSiteStructure(currentStructure);
    }
  }, [currentStructure]);
  
  const toggleFolder = (id: string) => {
    const newExpandedFolders = new Set(expandedFolders);
    if (newExpandedFolders.has(id)) {
      newExpandedFolders.delete(id);
    } else {
      newExpandedFolders.add(id);
    }
    setExpandedFolders(newExpandedFolders);
  };
  
  const handleCreatePage = () => {
    if (!newPage.title) return;
    
    const pageId = newPage.title.toLowerCase().replace(/\s+/g, '-');
    const slug = newPage.slug || pageId;
    
    const page: PageConfig = {
      id: pageId,
      title: newPage.title,
      slug: slug,
      parent: newPage.parent || undefined,
      template: newPage.template,
      isPublished: false
    };
    
    // Add page to site structure
    const updatedStructure = {
      ...siteStructure,
      pages: [...siteStructure.pages, page],
      navigation: {
        ...siteStructure.navigation,
        mainMenu: [
          ...siteStructure.navigation.mainMenu,
          {
            id: `nav-${pageId}`,
            label: newPage.title,
            link: `/${slug}`
          }
        ]
      }
    };
    
    setSiteStructure(updatedStructure);
    onCreatePage(page);
    
    // Reset form
    setNewPage({
      title: '',
      slug: '',
      parent: ''
    });
    setIsCreatingPage(false);
  };
  
  const handleSaveStructure = () => {
    onUpdateSiteStructure(siteStructure);
    onClose();
  };
  
  const renderPageTree = (pages: PageConfig[], parentId: string | undefined = undefined, level = 0) => {
    const filteredPages = pages.filter(page => page.parent === parentId);
    
    if (filteredPages.length === 0) return null;
    
    return (
      <ul className={cn("pl-5", level === 0 && "pl-0")}>
        {filteredPages.map(page => {
          const hasChildren = pages.some(p => p.parent === page.id);
          const isExpanded = expandedFolders.has(page.id);
          
          return (
            <li key={page.id} className="py-1">
              <div className="flex items-center group">
                {hasChildren ? (
                  <button 
                    onClick={() => toggleFolder(page.id)} 
                    className="p-1 rounded-sm hover:bg-gray-100"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                ) : (
                  <span className="w-6"></span>
                )}
                
                <div 
                  className={cn(
                    "flex items-center flex-1 gap-2 px-2 py-1 rounded-md",
                    page.isHomePage && "font-medium text-primary"
                  )}
                >
                  {page.isHomePage ? (
                    <Home className="h-4 w-4" />
                  ) : (
                    <File className="h-4 w-4" />
                  )}
                  <span>{page.title}</span>
                  
                  {!page.isPublished && (
                    <Badge variant="outline" className="text-xs">Draft</Badge>
                  )}
                </div>
                
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {hasChildren && isExpanded && renderPageTree(pages, page.id, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };
  
  const renderPageGrid = (pages: PageConfig[]) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
        {pages.map(page => (
          <div 
            key={page.id}
            className={cn(
              "border rounded-md p-4 hover:border-primary transition-colors",
              page.isHomePage && "border-primary bg-primary/5"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {page.isHomePage ? (
                  <Home className="h-4 w-4" />
                ) : (
                  <File className="h-4 w-4" />
                )}
                <h3 className="font-medium">{page.title}</h3>
              </div>
              
              {!page.isPublished && (
                <Badge variant="outline" className="text-xs">Draft</Badge>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mb-3">/{page.slug}</p>
            
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Edit className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        <div 
          className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center h-full text-center cursor-pointer hover:bg-gray-50"
          onClick={() => setIsCreatingPage(true)}
        >
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
            <Plus className="h-5 w-5 text-gray-500" />
          </div>
          <p className="text-sm font-medium">{ageGroup === 'kids' ? 'Add a New Page' : 'Create New Page'}</p>
          <p className="text-xs text-gray-500 mt-1">
            {ageGroup === 'kids' ? 'Click to add a new page to your website' : 'Click to create a new page in your site structure'}
          </p>
        </div>
      </div>
    );
  };
  
  const renderSiteSettings = () => {
    return (
      <div className="space-y-6 p-1">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {ageGroup === 'kids' ? 'Website Name' : 'Site Name'}
          </label>
          <Input 
            value={siteStructure.settings.siteName} 
            onChange={(e) => setSiteStructure({
              ...siteStructure,
              settings: {
                ...siteStructure.settings,
                siteName: e.target.value
              }
            })}
            placeholder={ageGroup === 'kids' ? "My Cool Website" : "My Website"}
          />
          <p className="text-xs text-gray-500">
            {ageGroup === 'kids' 
              ? "This is the name of your website that everyone will see" 
              : "The name that appears in the browser tab and site header"}
          </p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Theme</label>
          <div className="grid grid-cols-3 gap-2">
            <div
              className={cn(
                "border rounded-md p-2 cursor-pointer hover:border-primary",
                (!siteStructure.settings.theme || siteStructure.settings.theme === 'default') && "border-primary ring-1 ring-primary"
              )}
              onClick={() => setSiteStructure({
                ...siteStructure,
                settings: {
                  ...siteStructure.settings,
                  theme: 'default'
                }
              })}
            >
              <div className="h-12 bg-blue-100 rounded mb-2"></div>
              <p className="text-xs text-center">Default</p>
            </div>
            <div
              className={cn(
                "border rounded-md p-2 cursor-pointer hover:border-primary",
                siteStructure.settings.theme === 'fun' && "border-primary ring-1 ring-primary"
              )}
              onClick={() => setSiteStructure({
                ...siteStructure,
                settings: {
                  ...siteStructure.settings,
                  theme: 'fun'
                }
              })}
            >
              <div className="h-12 bg-pink-100 rounded mb-2"></div>
              <p className="text-xs text-center">
                {ageGroup === 'kids' ? 'Fun' : 'Playful'}
              </p>
            </div>
            <div
              className={cn(
                "border rounded-md p-2 cursor-pointer hover:border-primary",
                siteStructure.settings.theme === 'serious' && "border-primary ring-1 ring-primary"
              )}
              onClick={() => setSiteStructure({
                ...siteStructure,
                settings: {
                  ...siteStructure.settings,
                  theme: 'serious'
                }
              })}
            >
              <div className="h-12 bg-gray-100 rounded mb-2"></div>
              <p className="text-xs text-center">
                {ageGroup === 'kids' ? 'Grown-up' : 'Professional'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {ageGroup === 'kids' ? 'Home Page' : 'Set Home Page'}
          </label>
          <select
            className="w-full border border-gray-200 rounded-md p-2 text-sm"
            value={siteStructure.pages.find(p => p.isHomePage)?.id || ''}
            onChange={(e) => {
              const newPages = siteStructure.pages.map(page => ({
                ...page,
                isHomePage: page.id === e.target.value
              }));
              
              setSiteStructure({
                ...siteStructure,
                pages: newPages
              });
            }}
          >
            {siteStructure.pages.map(page => (
              <option key={page.id} value={page.id}>{page.title}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            {ageGroup === 'kids' 
              ? "This page is shown first when someone visits your website" 
              : "The default page visitors see when they first access your site"}
          </p>
        </div>
      </div>
    );
  };
  
  const renderNavigation = () => {
    return (
      <div className="space-y-6 p-1">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              {ageGroup === 'kids' ? 'Website Menu' : 'Main Navigation'}
            </h3>
            
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Add Link
            </Button>
          </div>
          
          <div className="border rounded-md">
            <div className="bg-gray-50 p-2 text-xs font-medium border-b">
              {ageGroup === 'kids' ? 'Website Top Menu' : 'Primary Navigation'}
            </div>
            
            <ul className="p-2 space-y-1">
              {siteStructure.navigation.mainMenu.map((item, index) => (
                <li 
                  key={item.id}
                  className="flex items-center justify-between p-2 border rounded-md bg-white"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">{index + 1}</div>
                    <span>{item.label}</span>
                    <span className="text-xs text-gray-500">{item.link}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              {ageGroup === 'kids' ? 'Footer Menu' : 'Footer Navigation'}
            </h3>
            
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Add Link
            </Button>
          </div>
          
          <div className="border rounded-md">
            <div className="bg-gray-50 p-2 text-xs font-medium border-b">
              {ageGroup === 'kids' ? 'Website Bottom Menu' : 'Footer Links'}
            </div>
            
            <div className="p-8 text-center text-gray-500 text-sm">
              {ageGroup === 'kids' 
                ? "No footer links yet. Click 'Add Link' to add some!" 
                : "No footer navigation items. Add links to build your footer menu."}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const newPageDialog = (
    <Dialog open={isCreatingPage} onOpenChange={setIsCreatingPage}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {ageGroup === 'kids' ? 'Add a New Page' : 'Create New Page'}
          </DialogTitle>
          <DialogDescription>
            {ageGroup === 'kids'
              ? "Let's make a new page for your website!"
              : "Fill in the details to create a new page in your site structure."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {ageGroup === 'kids' ? 'Page Name' : 'Page Title'}
            </label>
            <Input
              value={newPage.title}
              onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
              placeholder={ageGroup === 'kids' ? "My Cool Page" : "About Us"}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {ageGroup === 'kids' ? 'Web Address' : 'Page URL (slug)'}
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">/</span>
              <Input
                value={newPage.slug}
                onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                placeholder={ageGroup === 'kids' ? "my-cool-page" : "about-us"}
              />
            </div>
            <p className="text-xs text-gray-500">
              {ageGroup === 'kids'
                ? "This is the address people will use to find your page"
                : "The URL-friendly name for your page. Leave blank to auto-generate."}
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {ageGroup === 'kids' ? 'Starting Design' : 'Page Template'}
            </label>
            <select
              className="w-full border border-gray-200 rounded-md p-2 text-sm"
              value={newPage.template || ''}
              onChange={(e) => setNewPage({ ...newPage, template: e.target.value })}
            >
              <option value="">
                {ageGroup === 'kids' ? "Blank Page" : "Default (Blank)"}
              </option>
              <option value="contact">
                {ageGroup === 'kids' ? "Contact Page" : "Contact Form"}
              </option>
              <option value="gallery">
                {ageGroup === 'kids' ? "Picture Gallery" : "Image Gallery"}
              </option>
              <option value="blog">
                {ageGroup === 'kids' ? "Blog Page" : "Blog/News"}
              </option>
            </select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreatingPage(false)}>
            {ageGroup === 'kids' ? 'Cancel' : 'Cancel'}
          </Button>
          <Button onClick={handleCreatePage}>
            {ageGroup === 'kids' ? 'Create My Page!' : 'Create Page'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FolderTree className="h-5 w-5 mr-2 text-primary" />
              {ageGroup === 'kids' 
                ? 'Website Builder Map' 
                : 'Site Structure Manager'}
            </DialogTitle>
            <DialogDescription>
              {ageGroup === 'kids'
                ? "This is where you build your website's map! Add pages and organize them."
                : "Organize your site's structure, navigation, and settings from a central location."}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="pages" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="pages" className="flex items-center gap-1 px-3">
                  <File className="h-4 w-4" />
                  <span>Pages</span>
                </TabsTrigger>
                <TabsTrigger value="navigation" className="flex items-center gap-1 px-3">
                  <ListTree className="h-4 w-4" />
                  <span>Navigation</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1 px-3">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>
              
              {activeTab === 'pages' && (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={viewMode === 'tree' ? 'default' : 'outline'} 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setViewMode('tree')}
                  >
                    <ListTree className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'grid' ? 'default' : 'outline'} 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => setIsCreatingPage(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    {ageGroup === 'kids' ? 'Add Page' : 'New Page'}
                  </Button>
                </div>
              )}
            </div>
            
            <div className="border rounded-md flex-1 overflow-hidden">
              <ScrollArea className="h-[400px] w-full">
                <TabsContent value="pages" className="m-0 p-4">
                  {viewMode === 'tree' 
                    ? renderPageTree(siteStructure.pages) 
                    : renderPageGrid(siteStructure.pages)
                  }
                </TabsContent>
                
                <TabsContent value="navigation" className="m-0 p-4">
                  {renderNavigation()}
                </TabsContent>
                
                <TabsContent value="settings" className="m-0 p-4">
                  {renderSiteSettings()}
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              {ageGroup === 'kids' ? 'Cancel' : 'Cancel'}
            </Button>
            <Button onClick={handleSaveStructure}>
              <Save className="h-4 w-4 mr-1" />
              {ageGroup === 'kids' ? 'Save My Website' : 'Save Structure'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {newPageDialog}
    </>
  );
};