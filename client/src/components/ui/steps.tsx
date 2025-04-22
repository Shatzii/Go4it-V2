import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import { Check, Circle } from "lucide-react";

interface StepsContextValue {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const StepsContext = createContext<StepsContextValue>({ currentStep: 1 });

interface StepsProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
  children: React.ReactNode;
}

export function Steps({ 
  currentStep, 
  onStepClick, 
  className, 
  children 
}: StepsProps) {
  return (
    <StepsContext.Provider value={{ currentStep, onStepClick }}>
      <div className={cn("flex items-center w-full py-4 px-6", className)}>
        {children}
      </div>
    </StepsContext.Provider>
  );
}

interface StepProps {
  id: number;
  title: string;
  description?: string;
  className?: string;
}

export function Step({ id, title, description, className }: StepProps) {
  const { currentStep, onStepClick } = useContext(StepsContext);
  
  const isCompleted = id < currentStep;
  const isCurrent = id === currentStep;
  
  const handleClick = () => {
    if (onStepClick && isCompleted) {
      onStepClick(id);
    }
  };
  
  return (
    <div 
      className={cn(
        "flex flex-col items-center flex-1 relative", 
        isCompleted ? "cursor-pointer" : "", 
        className
      )}
      onClick={handleClick}
    >
      {/* Connector line before */}
      {id !== 1 && (
        <div 
          className={cn(
            "absolute left-0 top-4 h-[2px] w-1/2 -translate-y-1/2",
            isCompleted ? "bg-primary" : "bg-border"
          )} 
        />
      )}
      
      {/* Connector line after */}
      {id !== 5 && (
        <div 
          className={cn(
            "absolute right-0 top-4 h-[2px] w-1/2 -translate-y-1/2",
            isCompleted || isCurrent ? "bg-primary" : "bg-border"
          )} 
        />
      )}
      
      {/* Step indicator */}
      <div 
        className={cn(
          "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 mb-2",
          isCompleted ? 
            "bg-primary border-primary text-primary-foreground" : 
            isCurrent ? 
              "bg-primary/10 border-primary text-primary" : 
              "bg-background border-border text-muted-foreground"
        )}
      >
        {isCompleted ? (
          <Check className="h-4 w-4" />
        ) : (
          <span className="text-sm font-medium">{id}</span>
        )}
      </div>
      
      {/* Step text */}
      <div className="text-center">
        <p 
          className={cn(
            "text-sm font-medium",
            isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {title}
        </p>
        
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}