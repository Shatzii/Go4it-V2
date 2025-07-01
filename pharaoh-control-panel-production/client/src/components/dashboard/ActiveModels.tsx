import { Skeleton } from "@/components/ui/skeleton";
import { AIModel } from "@shared/types";

interface ActiveModelsProps {
  isLoading: boolean;
  models?: AIModel[];
}

export default function ActiveModels({ isLoading, models = [] }: ActiveModelsProps) {
  // Default models if not provided
  const defaultModels: AIModel[] = [
    {
      id: "1",
      name: "StarCoder",
      description: "Code Generation Model",
      icon: "code",
      status: "active",
      type: "code"
    },
    {
      id: "2",
      name: "Security Auditor",
      description: "Custom-trained Llama 3",
      icon: "security",
      status: "active",
      type: "security"
    },
    {
      id: "3",
      name: "SEO Optimizer",
      description: "Hugging Face Pipeline",
      icon: "analytics",
      status: "inactive",
      type: "seo"
    }
  ];

  const displayModels = models.length > 0 ? models : defaultModels;

  return (
    <div className="bg-dark-900 rounded-lg border border-dark-700 overflow-hidden fade-in" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        <h2 className="font-semibold">Active AI Models</h2>
        <button className="bg-primary-600 hover:bg-primary-700 text-white text-sm px-3 py-1 rounded-md flex items-center transition-colors">
          <span className="material-icons text-sm mr-1">add</span>
          Add Model
        </button>
      </div>
      
      <div className="divide-y divide-dark-700">
        {isLoading ? (
          <>
            <div className="p-4">
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="p-4">
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="p-4">
              <Skeleton className="h-16 w-full" />
            </div>
          </>
        ) : (
          displayModels.map((model) => (
            <div key={model.id} className="p-4 flex items-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                model.type === 'code' 
                  ? 'bg-gradient-to-br from-teal-500 to-teal-700' 
                  : model.type === 'security' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-700' 
                  : 'bg-gradient-to-br from-indigo-500 to-indigo-700'
              }`}>
                <span className="material-icons text-white text-xl shadow-lg">{model.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{model.name}</h3>
                  <span className={`flex items-center ${
                    model.status === 'active' 
                      ? 'bg-gradient-to-r from-teal-900/70 to-teal-800/70 text-teal-300 border border-teal-700/50' 
                      : 'bg-dark-800 text-gray-400 border border-gray-700/50'
                    } text-xs px-2 py-0.5 rounded-full`}>
                    {model.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mr-1.5 animate-pulse"></span>}
                    {model.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{model.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-dark-700">
        <a href="#" className="text-primary-400 hover:text-primary-300 text-sm flex items-center">
          <span className="material-icons text-sm mr-1">store</span>
          Browse AI Marketplace
        </a>
      </div>
    </div>
  );
}
