import { useQuery } from "@tanstack/react-query";
import PricingCard from "@/components/ui/pricing-card";
import type { Plan } from "@shared/schema";

export default function Pricing() {
  const { data: plans, isLoading } = useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });

  if (isLoading) {
    return (
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the perfect plan for your team</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="h-8 bg-gray-200 rounded mb-8"></div>
                <div className="space-y-2 mb-8">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">Choose the perfect plan for your team</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans?.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
