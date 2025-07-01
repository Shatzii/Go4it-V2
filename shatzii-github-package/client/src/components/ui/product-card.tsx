import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, LucideIcon } from "lucide-react";
import DemoRequestModal from "@/components/modals/demo-request-modal";

interface ProductCardProps {
  product: {
    id: string;
    icon: LucideIcon;
    title: string;
    description: string;
    features: string[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <>
      <Card className="hover:shadow-xl transition-shadow">
        <CardContent className="p-8">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
            <product.icon className="text-blue-600 text-xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{product.title}</h3>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <ul className="space-y-3 mb-8">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-600">
                <Check className="text-green-500 mr-3 h-4 w-4" />
                {feature}
              </li>
            ))}
          </ul>
          <Button
            onClick={() => setIsDemoModalOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try Demo
          </Button>
        </CardContent>
      </Card>

      <DemoRequestModal
        open={isDemoModalOpen}
        onOpenChange={setIsDemoModalOpen}
        defaultProduct={product.id}
      />
    </>
  );
}
