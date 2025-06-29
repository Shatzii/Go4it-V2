import React from "react";
import { cn } from "@/lib/utils";
import { Check, CircleEllipsis } from "lucide-react";

interface StepProps {
  id: number;
  title: string;
  description?: string;
  isActive?: boolean;
  isComplete?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Step({
  id,
  title,
  description,
  isActive = false,
  isComplete = false,
  onClick,
  className,
}: StepProps) {
  const canClick = onClick && (isComplete || isActive);

  return (
    <div
      className={cn(
        "flex items-start gap-2 md:gap-3",
        canClick && "cursor-pointer",
        className
      )}
      onClick={canClick ? onClick : undefined}
    >
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
          isActive &&
            !isComplete &&
            "border-primary bg-primary/10 text-primary",
          isComplete &&
            "border-primary bg-primary text-primary-foreground",
          !isActive &&
            !isComplete &&
            "border-muted-foreground/20 text-muted-foreground"
        )}
      >
        {isComplete ? (
          <Check className="h-4 w-4" />
        ) : isActive ? (
          <CircleEllipsis className="h-4 w-4" />
        ) : (
          id
        )}
      </div>
      <div className={cn(
        isActive || isComplete ? "" : "opacity-70"
      )}>
        <div
          className={cn(
            "text-sm font-medium",
            isActive && "text-foreground",
            !isActive && "text-muted-foreground"
          )}
        >
          {title}
        </div>
        {description && (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
      </div>
    </div>
  );
}

interface StepsProps {
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  children: React.ReactNode;
  className?: string;
}

export function Steps({
  currentStep,
  onStepClick,
  children,
  className,
}: StepsProps) {
  // Clone the children to pass the step state
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Cast child.props to access id
      const props = child.props as StepProps;
      const id = props.id;

      // Determine if this step is active or complete
      const isActive = id === currentStep;
      const isComplete = id < currentStep;

      // If step is clickable (complete or current), pass the onClick handler
      const onClick = (isComplete || isActive) && onStepClick
        ? () => onStepClick(id)
        : undefined;

      return React.cloneElement(child, {
        isActive,
        isComplete,
        onClick,
      });
    }
    return child;
  });

  return (
    <div className={cn("flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8", className)}>
      {childrenWithProps}
    </div>
  );
}