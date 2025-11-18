"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StarPathPanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function StarPathPanel({ title, children, className = "" }: StarPathPanelProps) {
  return (
    <Card className={`border-amber-500/20 bg-black/40 backdrop-blur ${className}`}>
      {title && (
        <CardHeader>
          <CardTitle className="text-amber-400">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={title ? "" : "p-6"}>
        {children}
      </CardContent>
    </Card>
  );
}
