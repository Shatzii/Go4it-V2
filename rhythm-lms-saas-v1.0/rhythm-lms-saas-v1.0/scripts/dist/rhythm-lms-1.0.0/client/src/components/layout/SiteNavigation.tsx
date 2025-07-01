import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Link } from 'wouter';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  ChevronDown, 
  Home, 
  Settings, 
  Users, 
  BookOpen, 
  FolderTree,
  Edit,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-mobile';

// Import the SiteStructure type
import { SiteStructure, PageConfig } from '../editor/SiteStructureManager';

interface NavItem {
  title: string;
  href: string;
  description?: string;
  children?: NavItem[];
  isActive?: boolean;
  icon?: React.ReactNode; 
}

interface SiteNavigationProps {
  siteStructure?: SiteStructure;
  onEditStructure?: () => void;
  onThemeToggle?: () => void;
  ageGroup?: 'kids' | 'teens' | 'all';
  isDarkMode?: boolean;
  isEditable?: boolean;
  currentUser?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export const SiteNavigation: React.FC<SiteNavigationProps> = ({
  siteStructure,
  onEditStructure,
  onThemeToggle,
  ageGroup = 'kids',
  isDarkMode = false,
  isEditable = true,
  currentUser
}) => {
  const [location] = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isOpen, setIsOpen] = useState(false);

  // Default navigation items if none provided
  const defaultNavItems: NavItem[] = [
    {
      title: 'Home',
      href: '/',
      icon: <Home className="h-4 w-4" />
    },
    {
      title: 'Editor',
      href: '/editor',
      icon: <Edit className="h-4 w-4" />
    },
    {
      title: ageGroup === 'kids' ? 'Learn' : 'Documentation',
      href: '/docs',
      icon: <BookOpen className="h-4 w-4" />
    }
  ];

  // Convert site structure to nav items
  const getNavItemsFromStructure = (): NavItem[] => {
    if (!siteStructure) return defaultNavItems;

    return siteStructure.navigation.mainMenu.map(item => ({
      title: item.label,
      href: item.link,
      isActive: location === item.link,
      children: item.children 
        ? item.children.map(child => ({
            title: child.label,
            href: child.link,
            isActive: location === child.link
          }))
        : undefined,
      icon: getIconForPath(item.link)
    }));
  };

  const getIconForPath = (path: string): React.ReactNode => {
    if (path === '/' || path.includes('home')) {
      return <Home className="h-4 w-4" />;
    } else if (path.includes('about')) {
      return <Users className="h-4 w-4" />;
    } else if (path.includes('doc') || path.includes('learn')) {
      return <BookOpen className="h-4 w-4" />;
    } else if (path.includes('edit')) {
      return <Edit className="h-4 w-4" />;
    } else {
      return <FolderTree className="h-4 w-4" />;
    }
  };

  const navItems = getNavItemsFromStructure();

  // Mobile navigation
  const MobileNavigation = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            {siteStructure?.settings.siteName || (ageGroup === 'kids' ? 'My Website' : 'Site Navigation')}
          </SheetTitle>
          <SheetDescription>
            {ageGroup === 'kids' 
              ? 'Explore your awesome website!' 
              : 'Navigate to different sections of your site'}
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-6">
          {navItems.map((item, i) => (
            <Link 
              key={i} 
              href={item.href}
              onClick={() => setIsOpen(false)}
            >
              <Button 
                variant={location === item.href ? "default" : "ghost"}
                className="w-full justify-start"
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.title}
              </Button>
            </Link>
          ))}
        </nav>
        <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center justify-between w-full">
            {isEditable && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsOpen(false);
                  if (onEditStructure) onEditStructure();
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                {ageGroup === 'kids' ? 'Edit Website' : 'Edit Structure'}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onThemeToggle}>
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  // Desktop navigation
  const DesktopNavigation = () => (
    <div className="hidden md:flex items-center space-x-2">
      <NavigationMenu>
        <NavigationMenuList>
          {navItems.map((item, i) => 
            item.children ? (
              <NavigationMenuItem key={i}>
                <NavigationMenuTrigger className={cn(
                  item.isActive && "text-primary"
                )}>
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {item.children.map((child, j) => (
                      <li key={j}>
                        <NavigationMenuLink asChild>
                          <Link 
                            href={child.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              child.isActive && "bg-accent text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium">{child.title}</div>
                            {child.description && (
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {child.description}
                              </p>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem key={i}>
                <Link href={item.href}>
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      item.isActive && "text-primary",
                      "flex items-center"
                    )}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )
          )}
        </NavigationMenuList>
      </NavigationMenu>
      
      <div className="flex items-center space-x-2">
        {isEditable && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEditStructure}
          >
            <Edit className="h-4 w-4 mr-2" />
            {ageGroup === 'kids' ? 'Edit Website' : 'Edit Site'}
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onThemeToggle}>
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center mr-4">
            <Link 
              href="/" 
              className="flex items-center space-x-2 font-bold text-xl"
            >
              {siteStructure?.settings.siteName || (ageGroup === 'kids' ? 'My Website' : 'Rhythm CMS')}
            </Link>
          </div>
          
          {isMobile ? <MobileNavigation /> : <DesktopNavigation />}
        </div>
      </div>
    </header>
  );
};

export default SiteNavigation;