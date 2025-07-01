import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Video, Star, User } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/gar-analysis", label: "GAR", icon: Video },
    { path: "/starpath", label: "StarPath", icon: Star },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 md:hidden z-40">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location === item.path || (item.path === "/dashboard" && location === "/");
          
          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant="ghost"
                className={`flex flex-col items-center py-2 px-4 mobile-touch-target neurodivergent-focus ${
                  isActive ? "text-primary" : "text-slate-400 hover:text-white"
                }`}
              >
                <IconComponent className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
