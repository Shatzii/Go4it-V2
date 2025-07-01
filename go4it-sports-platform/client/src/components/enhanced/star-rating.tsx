import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface StarRatingProps {
  garScore: number;
  size?: "sm" | "md" | "lg";
  showScore?: boolean;
  animated?: boolean;
}

export default function StarRating({ garScore, size = "md", showScore = true, animated = true }: StarRatingProps) {
  // Convert GAR score (0-100) to star rating (1-5)
  const getStarRating = (score: number) => {
    if (score >= 90) return 5;
    if (score >= 80) return 4;
    if (score >= 70) return 3;
    if (score >= 60) return 2;
    return 1;
  };

  const starCount = getStarRating(garScore);
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const filled = index < starCount;
      
      if (animated) {
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="relative"
          >
            <Star
              className={`${sizeClasses[size]} ${
                filled 
                  ? "text-cyan-400 fill-cyan-400 neon-glow" 
                  : "text-slate-600 fill-none"
              } transition-all duration-300`}
            />
            {filled && (
              <Star
                className={`${sizeClasses[size]} text-cyan-300 fill-cyan-300 absolute inset-0 animate-pulse`}
                style={{ animationDuration: "2s" }}
              />
            )}
          </motion.div>
        );
      }

      return (
        <Star
          key={index}
          className={`${sizeClasses[size]} ${
            filled 
              ? "text-cyan-400 fill-cyan-400 neon-glow" 
              : "text-slate-600 fill-none"
          } transition-all duration-300`}
        />
      );
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {renderStars()}
      </div>
      {showScore && (
        <span className={`font-semibold ${
          size === "sm" ? "text-sm" : 
          size === "md" ? "text-base" : "text-lg"
        } ${
          garScore >= 90 ? "text-cyan-400" :
          garScore >= 80 ? "text-blue-400" :
          garScore >= 70 ? "text-purple-400" :
          garScore >= 60 ? "text-orange-400" :
          "text-slate-400"
        }`}>
          {garScore}
        </span>
      )}
    </div>
  );
}