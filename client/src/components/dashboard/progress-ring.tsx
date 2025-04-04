import { useEffect, useState } from "react";

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  percentage,
  size = 36,
  strokeWidth = 2,
  color = "#36B37E",
  backgroundColor = "#e0e0e0",
  className = "",
  children,
}: ProgressRingProps) {
  const [offset, setOffset] = useState(0);
  
  // Calculate the center of the circle
  const center = size / 2;
  // Calculate the radius (accounting for the stroke width)
  const radius = center - strokeWidth;
  // Calculate the circumference of the circle
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Calculate the offset (the "unfilled" part of the circle)
    const calculatedOffset = ((100 - percentage) / 100) * circumference;
    setOffset(calculatedOffset);
  }, [percentage, circumference]);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Foreground circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="progress-ring-circle"
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: "stroke-dashoffset 0.35s" }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
