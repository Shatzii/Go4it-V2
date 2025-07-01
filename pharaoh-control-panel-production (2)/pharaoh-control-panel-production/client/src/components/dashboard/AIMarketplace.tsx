import { Skeleton } from "@/components/ui/skeleton";
import { MarketplaceModel } from "@shared/types";

interface AIMarketplaceProps {
  isLoading: boolean;
  marketplaceModels?: MarketplaceModel[];
}

export default function AIMarketplace({ isLoading, marketplaceModels = [] }: AIMarketplaceProps) {
  // Default marketplace models if not provided
  const defaultModels: MarketplaceModel[] = [
    {
      id: "1",
      name: "Auto-Scale AI",
      description: "Automatically scales your server resources based on real-time traffic patterns and ML predictions.",
      icon: "auto_fix_high",
      type: "scaling",
      memory: "250MB",
      verified: true,
      featured: true,
      badge: "Featured",
      color: "primary",
      status: "inactive"
    },
    {
      id: "2",
      name: "Database Optimizer",
      description: "Analyzes and optimizes database queries using machine learning to improve performance and reduce costs.",
      icon: "schema",
      type: "database",
      memory: "480MB",
      verified: true,
      badge: "Popular",
      color: "secondary",
      status: "inactive"
    },
    {
      id: "3",
      name: "Advanced Firewall",
      description: "Uses ML to detect and block sophisticated attack patterns before they can compromise your server.",
      icon: "health_and_safety",
      type: "security",
      memory: "320MB",
      verified: true,
      badge: "New",
      color: "accent",
      status: "inactive"
    },
    {
      id: "4",
      name: "Traffic Analyzer",
      description: "Analyzes user traffic patterns and provides actionable insights to optimize your application experience.",
      icon: "insights",
      type: "analytics",
      memory: "400MB",
      verified: true,
      badge: "Pro",
      color: "blue",
      status: "inactive"
    }
  ];

  const displayModels = marketplaceModels.length > 0 ? marketplaceModels : defaultModels;

  const getGradientClass = (color: string) => {
    switch (color) {
      case "primary":
        return "from-primary-900 to-primary-800";
      case "secondary":
        return "from-secondary-900 to-secondary-800";
      case "accent":
        return "from-accent-900 to-accent-800";
      case "blue":
        return "from-blue-900 to-blue-800";
      default:
        return "from-primary-900 to-primary-800";
    }
  };

  const getBadgeClass = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary-700 text-primary-300";
      case "secondary":
        return "bg-secondary-700 text-secondary-300";
      case "accent":
        return "bg-accent-700 text-accent-300";
      case "blue":
        return "bg-blue-700 text-blue-300";
      default:
        return "bg-primary-700 text-primary-300";
    }
  };

  const getIconBgClass = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary-700";
      case "secondary":
        return "bg-secondary-700";
      case "accent":
        return "bg-accent-700";
      case "blue":
        return "bg-blue-700";
      default:
        return "bg-primary-700";
    }
  };

  const getIconColorClass = (color: string) => {
    switch (color) {
      case "primary":
        return "text-primary-300";
      case "secondary":
        return "text-secondary-300";
      case "accent":
        return "text-accent-300";
      case "blue":
        return "text-blue-300";
      default:
        return "text-primary-300";
    }
  };

  const getButtonClass = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary-600 hover:bg-primary-700";
      case "secondary":
        return "bg-secondary-600 hover:bg-secondary-700";
      case "accent":
        return "bg-accent-600 hover:bg-accent-700";
      case "blue":
        return "bg-blue-600 hover:bg-blue-700";
      default:
        return "bg-primary-600 hover:bg-primary-700";
    }
  };

  return (
    <div className="mt-6 fade-in" style={{ animationDelay: "0.6s" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">AI Marketplace</h2>
        <button className="text-sm text-primary-400 hover:text-primary-300 flex items-center">
          <span className="material-icons text-sm mr-1">apps</span>
          View All Models
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </>
        ) : (
          displayModels.map((model) => (
            <div key={model.id} className="bg-dark-900 rounded-lg border border-dark-700 overflow-hidden">
              <div className={`bg-gradient-to-r ${getGradientClass(model.color)} p-4`}>
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-md ${getIconBgClass(model.color)} flex items-center justify-center`}>
                    <span className={`material-icons ${getIconColorClass(model.color)}`}>{model.icon}</span>
                  </div>
                  {model.badge && (
                    <span className={`${getBadgeClass(model.color)} text-xs px-2 py-0.5 rounded-full`}>
                      {model.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold mt-3">{model.name}</h3>
                <p className={`text-xs ${getIconColorClass(model.color)} mt-1`}>{model.type}</p>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-400 mb-3">{model.description}</p>
                
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <div className="flex items-center mr-3">
                    <span className="material-icons text-xs mr-1">memory</span>
                    <span>{model.memory}</span>
                  </div>
                  {model.verified && (
                    <div className="flex items-center">
                      <span className="material-icons text-xs mr-1">verified</span>
                      <span>Verified</span>
                    </div>
                  )}
                </div>
                
                <button className={`w-full ${getButtonClass(model.color)} text-white py-2 rounded-md text-sm transition-colors`}>
                  Install
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
