import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

type EmptyStateProps = {
  icon?: ReactNode | LucideIcon
  iconType?: "element" | "lucide"
  title: string
  description?: string
  action?: { label: string; onClick: () => void } | ReactNode
  className?: string
}

export function EmptyState({ icon, iconType = "element", title, description, action, className }: EmptyStateProps) {
  const renderIcon = () => {
    if (!icon) return null
    if (iconType === "lucide" || typeof icon === "function") {
      const LucideIcon = icon as LucideIcon
      return (
        <div className="mb-1 rounded-full bg-muted p-3 text-muted-foreground">
          <LucideIcon className="h-5 w-5" />
        </div>
      )
    }
    return <div className="mb-4 text-muted-foreground">{icon as ReactNode}</div>
  }

  const renderAction = () => {
    if (!action) return null
    if (typeof action === "object" && "label" in action && "onClick" in action) {
      const a = action as { label: string; onClick: () => void }
      return <div className="mt-2"><Button variant="default" size="sm" onClick={a.onClick}>{a.label}</Button></div>
    }
    return <div className="mt-2">{action as ReactNode}</div>
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center", className)}>
      {renderIcon()}
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {renderAction()}
    </div>
  )
}
