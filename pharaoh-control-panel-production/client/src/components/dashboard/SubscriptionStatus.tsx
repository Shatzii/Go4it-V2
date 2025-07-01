import { Skeleton } from "@/components/ui/skeleton";
import { SubscriptionInfo } from "@shared/types";

interface SubscriptionStatusProps {
  isLoading: boolean;
  subscription?: SubscriptionInfo;
}

export default function SubscriptionStatus({ isLoading, subscription }: SubscriptionStatusProps) {
  // Default subscription info if not provided
  const defaultSubscription: SubscriptionInfo = {
    plan: "Pro Plan",
    features: [
      { name: "AI Models", value: "Unlimited" },
      { name: "Auto-Healing", value: "Enabled" },
      { name: "Support", value: "Priority" },
      { name: "Next Billing", value: "May 15, 2023" }
    ],
    nextBilling: "May 15, 2023"
  };

  const displaySubscription = subscription || defaultSubscription;

  return (
    <div className="bg-dark-900 rounded-lg border border-dark-700 p-4 fade-in" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Subscription</h2>
        <span className="bg-primary-900 text-primary-300 text-xs px-2 py-1 rounded-full">
          {displaySubscription.plan}
        </span>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : (
        <div className="space-y-4">
          {displaySubscription.features.map((feature, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{feature.name}</span>
              <span className="text-sm">{feature.value}</span>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 flex space-x-2">
        <button className="bg-dark-800 hover:bg-dark-700 text-white text-sm px-3 py-2 rounded-md flex-1">
          Manage
        </button>
        <button className="bg-primary-600 hover:bg-primary-700 text-white text-sm px-3 py-2 rounded-md flex-1">
          Upgrade
        </button>
      </div>
    </div>
  );
}
