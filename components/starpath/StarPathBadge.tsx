"use client";

import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface StarPathBadgeProps {
  children: ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

export default function StarPathBadge({ children, variant = "default", className = "" }: StarPathBadgeProps) {
  return (
    <Badge 
      variant={variant} 
      className={`bg-amber-500/20 text-amber-400 border-amber-500/30 ${className}`}
    >
      {children}
    </Badge>
  );
}
