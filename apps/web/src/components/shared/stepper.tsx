"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type Step = {
  id: string
  title: string
  description?: string
}

type HorizontalStep = {
  id: string
  label: string
  description?: string
}

interface HorizontalStepperProps {
  steps: HorizontalStep[]
  currentStep: number
  onStepClick?: (step: number) => void
  className?: string
}

interface VerticalStepperProps {
  steps: Step[]
  current: number
  onStepClick?: (index: number) => void
  completed?: Set<number>
  className?: string
}

type Props = HorizontalStepperProps | VerticalStepperProps

export function Stepper(props: Props) {
  if ("current" in props && !("currentStep" in props)) {
    const { steps, current, onStepClick, completed, className } = props as VerticalStepperProps
    return (
      <nav aria-label="Progress" className={cn("flex flex-col gap-1", className)}>
        {steps.map((s, i) => {
          const isDone = completed?.has(i) ?? i < current
          const isCurrent = i === current
          return (
            <button key={s.id} type="button" disabled={!onStepClick}
              onClick={() => onStepClick?.(i)}
              className={cn("group flex items-start gap-3 rounded-md p-2 text-left transition-colors", onStepClick && "hover:bg-muted/50", isCurrent && "bg-muted/60")}>
              <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                isDone ? "border-foreground bg-foreground text-background" : isCurrent ? "border-foreground text-foreground" : "border-border text-muted-foreground")}>
                {isDone ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <div className="min-w-0">
                <div className={cn("text-sm font-medium", isCurrent ? "text-foreground" : "text-muted-foreground")}>{s.title}</div>
                {s.description ? <div className="text-xs text-muted-foreground/80">{s.description}</div> : null}
              </div>
            </button>
          )
        })}
      </nav>
    )
  }

  const { steps, currentStep, onStepClick, className } = props as HorizontalStepperProps
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isFuture = index > currentStep
          return (
            <div key={step.id} className="flex items-center gap-3">
              <button
                type="button"
                disabled={isFuture && !onStepClick}
                onClick={() => onStepClick?.(index)}
                className={cn("flex items-center gap-3", !isFuture && onStepClick && "cursor-pointer", isFuture && !onStepClick && "cursor-default")}
              >
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary text-primary",
                  isFuture && "border-muted-foreground/30 text-muted-foreground/50")}>
                  {isCompleted ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                </div>
                <div className="hidden sm:block text-left">
                  <p className={cn("text-sm font-medium", isCurrent && "text-foreground", isCompleted && "text-muted-foreground", isFuture && "text-muted-foreground/50")}>{step.label}</p>
                  {step.description && <p className="text-xs text-muted-foreground/70">{step.description}</p>}
                </div>
              </button>
              {index < steps.length - 1 && <div className={cn("mx-4 h-px w-16 sm:w-24", index < currentStep ? "bg-primary" : "bg-border")} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
