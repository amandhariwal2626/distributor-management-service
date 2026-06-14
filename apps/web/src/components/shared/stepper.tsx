"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className,
}: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFuture = index > currentStep;

          return (
            <div key={step.id} className="flex items-center gap-3">
              <button
                type="button"
                disabled={isFuture && !onStepClick}
                onClick={() => onStepClick?.(index)}
                className={cn(
                  "flex items-center gap-3",
                  !isFuture && onStepClick && "cursor-pointer",
                  isFuture && !onStepClick && "cursor-default",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary text-primary",
                    isFuture &&
                      "border-muted-foreground/30 text-muted-foreground/50",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent && "text-foreground",
                      isCompleted && "text-muted-foreground",
                      isFuture && "text-muted-foreground/50",
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground/70">
                      {step.description}
                    </p>
                  )}
                </div>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-4 h-px w-16 sm:w-24",
                    index < currentStep ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
