"use client";

import React from "react";
import {
  Bolt as Lightning,
  Target,
  Brain,
  BookOpen,
  CheckSquare,
  MapPin,
  Star,
} from "lucide-react";

export type IconProps = {
  size?: number;
  className?: string;
  title?: string;
};

const base = "icon-blueglow glow-drop";

export const SpeedTestedIcon: React.FC<IconProps> = ({ size = 28, className = "", title }) => (
  <Lightning className={`${base} ${className}`} size={size} aria-label={title || "Speed Tested"} />
);

export const MentalStrengthIcon: React.FC<IconProps> = ({ size = 28, className = "", title }) => (
  <Target className={`${base} ${className}`} size={size} aria-label={title || "Mental Strength"} />
);

export const CognitiveProfileIcon: React.FC<IconProps> = ({ size = 28, className = "", title }) => (
  <Brain className={`${base} ${className}`} size={size} aria-label={title || "Cognitive Profile"} />
);

export const LearningProfileIcon: React.FC<IconProps> = ({ size = 28, className = "", title }) => (
  <BookOpen className={`${base} ${className}`} size={size} aria-label={title || "Learning Profile"} />
);

export const CombineTestingIcon: React.FC<IconProps> = ({ size = 28, className = "", title }) => (
  <CheckSquare className={`${base} ${className}`} size={size} aria-label={title || "Combine Testing"} />
);

export const ViennaShowcaseIcon: React.FC<IconProps> = ({ size = 28, className = "", title }) => (
  <MapPin className={`${base} ${className}`} size={size} aria-label={title || "Vienna Showcase"} />
);

export const StarRatingIcon: React.FC<IconProps & { count?: number }> = ({ size = 18, className = "", title, count = 3 }) => (
  <span className={`star-blueglow ${className}`} aria-label={title || `${count} star rating`}>
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="icon-blueglow" size={size} />
    ))}
  </span>
);

export default {
  SpeedTestedIcon,
  MentalStrengthIcon,
  CognitiveProfileIcon,
  LearningProfileIcon,
  CombineTestingIcon,
  ViennaShowcaseIcon,
  StarRatingIcon,
};
