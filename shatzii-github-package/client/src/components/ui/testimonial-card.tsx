import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { Testimonial } from "@shared/schema";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>
        <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
        <div className="flex items-center">
          {testimonial.avatar && (
            <img
              src={testimonial.avatar}
              alt={`${testimonial.name} avatar`}
              className="w-12 h-12 rounded-full mr-4"
            />
          )}
          <div>
            <p className="font-semibold text-gray-900">{testimonial.name}</p>
            <p className="text-gray-600 text-sm">{testimonial.title}, {testimonial.company}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
