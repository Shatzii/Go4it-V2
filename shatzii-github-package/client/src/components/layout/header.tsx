import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown } from "lucide-react";
import { Box } from "lucide-react";
import { Link, useLocation } from "wouter";
import DemoRequestModal from "@/components/modals/demo-request-modal";
import AuthModal from "@/components/modals/auth-modal";
import SearchCommand from "@/components/features/search-command";
import NotificationSystem from "@/components/features/notification-system";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { 
      label: "Platform", 
      type: "group" as const,
      items: [
        { label: "Home", href: "/", type: "link" as const },
        { label: "Dashboard", href: "/dashboard", type: "link" as const },
        { label: "Products", id: "products", type: "scroll" as const },
      ]
    },
    { 
      label: "AI Systems", 
      type: "group" as const,
      items: [
        { label: "AI Control Center", href: "/ai-control-center", type: "link" as const },
        { label: "Agent Management", href: "/agent-management", type: "link" as const },
        { label: "Customer Database", href: "/customer-dashboard", type: "link" as const },
        { label: "Roofing AI Engine", href: "/roofing-ai", type: "link" as const },
        { label: "Advanced Analytics", href: "/analytics", type: "link" as const },
        { label: "Dashboard Customizer", href: "/dashboard-customizer", type: "link" as const },
        { label: "Enterprise Prospects", href: "/enterprise-prospects", type: "link" as const },
        { label: "Healthcare AI", href: "/healthcare-ai", type: "link" as const },
        { label: "Productivity Dashboard", href: "/productivity", type: "link" as const },
        { label: "Revenue Recovery", href: "/revenue-recovery", type: "link" as const },
        { label: "CMS Dashboard", href: "/cms", type: "link" as const },
        { label: "AI Playground", href: "/playground", type: "link" as const },
        { label: "Interactive Demo", href: "/demo", type: "link" as const },
        { label: "Innovation Lab", href: "/innovation", type: "link" as const },
        { label: "Tech Showcase", href: "/tech", type: "link" as const },
        { label: "AI Agents", href: "/ai-agents", type: "link" as const },
        { label: "Neural Lab", href: "/neural-playground", type: "link" as const },
        { label: "Model Marketplace", href: "/model-marketplace", type: "link" as const },
      ]
    },
    { 
      label: "Operations", 
      type: "group" as const,
      items: [
        { label: "Live Marketing", href: "/autonomous-marketing", type: "link" as const },
        { label: "Live Sales", href: "/autonomous-sales", type: "link" as const },
        { label: "Enterprise Dashboard", href: "/enterprise-dashboard", type: "link" as const },
      ]
    },
    { 
      label: "Products", 
      type: "group" as const,
      items: [
        { label: "All Products", href: "/products", type: "link" as const },
        { label: "AI Development", href: "/ai-development", type: "link" as const },
        { label: "Pharaoh Control", href: "/products/pharaoh", type: "link" as const },
        { label: "Sentinel Guard", href: "/products/sentinel", type: "link" as const },
      ]
    }
  ];

  return (
    <>
      <header className="bg-slate-900/95 backdrop-blur-xl border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <Box className="text-cyan-400 text-2xl mr-2" />
                  <span className="text-xl font-bold text-slate-100 font-mono">Shatzii</span>
                </Link>
              </div>
              <nav className="hidden md:ml-8 md:flex space-x-4">
                {navItems.map((group) => (
                  <DropdownMenu key={group.label}>
                    <DropdownMenuTrigger className="text-slate-300 hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-colors font-mono uppercase tracking-wide flex items-center gap-1">
                      {group.label}
                      <ChevronDown className="h-3 w-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-800/95 backdrop-blur-xl border-cyan-500/20">
                      {group.items.map((item) => (
                        <DropdownMenuItem key={item.label} className="text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50">
                          {item.type === "link" && item.href ? (
                            <Link href={item.href} className="w-full">
                              {item.label}
                            </Link>
                          ) : item.type === "scroll" && item.id ? (
                            <button
                              onClick={() => scrollToSection(item.id)}
                              className="w-full text-left"
                            >
                              {item.label}
                            </button>
                          ) : null}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
              </nav>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <SearchCommand />
              {user && <NotificationSystem />}
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-300">Welcome, {user.name}</span>
                  <Button variant="ghost" onClick={logout} className="text-slate-300 hover:text-cyan-400">
                    Logout
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setIsAuthModalOpen(true);
                  }}
                  className="text-slate-300 hover:text-cyan-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </button>
              )}
              <Button
                onClick={() => setIsDemoModalOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white border border-cyan-500/20"
              >
                Request Demo
              </Button>
              <Button
                onClick={() => window.location.href = '/admin/login'}
                variant="outline"
                className="border-orange-500/20 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
              >
                Admin
              </Button>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-slate-900 border-cyan-500/20">
                  <div className="flex flex-col space-y-6 mt-8">
                    {navItems.map((group) => (
                      <div key={group.label} className="space-y-2">
                        <h3 className="text-cyan-400 font-mono uppercase tracking-wide text-sm font-semibold">
                          {group.label}
                        </h3>
                        <div className="pl-4 space-y-2">
                          {group.items.map((item) => (
                            <button
                              key={item.label}
                              onClick={() => {
                                if (item.type === 'scroll' && item.id) {
                                  scrollToSection(item.id);
                                } else if (item.type === 'link' && item.href) {
                                  window.location.href = item.href;
                                }
                                setIsMobileMenuOpen(false);
                              }}
                              className="block w-full text-left text-slate-300 hover:text-cyan-400 py-2 text-base font-medium transition-colors"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {user ? (
                      <div className="flex flex-col space-y-2 pt-4 border-t border-cyan-500/20">
                        <span className="text-sm text-slate-300">Welcome, {user.name}</span>
                        <Button variant="ghost" onClick={logout} className="justify-start text-slate-300 hover:text-cyan-400">
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAuthMode("login");
                          setIsAuthModalOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-left text-slate-300 hover:text-cyan-400 py-2 text-lg font-medium transition-colors"
                      >
                        Login
                      </button>
                    )}
                    <Button
                      onClick={() => {
                        setIsDemoModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white justify-start"
                    >
                      Request Demo
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <DemoRequestModal
        open={isDemoModalOpen}
        onOpenChange={setIsDemoModalOpen}
      />
      
      <AuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}
