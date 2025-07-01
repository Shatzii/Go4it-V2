import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs() {
  const [location] = useLocation();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.split('/').filter(Boolean);
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Home", href: "/" }
    ];

    // Define page mappings
    const pageMap: Record<string, string> = {
      'ai-agents': 'AI Agents',
      'neural-playground': 'Neural Lab',
      'model-marketplace': 'Model Marketplace',
      'autonomous-marketing': 'Live Marketing',
      'autonomous-sales': 'Live Sales',
      'enterprise-dashboard': 'Enterprise Dashboard',
      'dashboard': 'Personal Dashboard',
      'products': 'Products',
      'pharaoh': 'Pharaoh Control',
      'sentinel': 'Sentinel Guard'
    };

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      if (pageMap[segment]) {
        // Don't add href for the current page (last item)
        const isLast = index === pathSegments.length - 1;
        breadcrumbs.push({
          label: pageMap[segment],
          href: isLast ? undefined : currentPath
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (location === '/') {
    return null;
  }

  return (
    <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-cyan-500/10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 py-3 text-sm">
          {breadcrumbs.map((item, index) => (
            <li key={item.label} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-slate-500 mx-2" />
              )}
              {index === 0 && (
                <Home className="h-4 w-4 text-cyan-400 mr-2" />
              )}
              {item.href ? (
                <Link 
                  href={item.href}
                  className="text-slate-400 hover:text-cyan-400 transition-colors font-mono"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-cyan-400 font-mono font-semibold">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}