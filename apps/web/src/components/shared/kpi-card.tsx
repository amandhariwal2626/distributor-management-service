import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type Props = {
  label: string
  value: number | string | undefined
  delta?: { value: string; positive?: boolean }
  icon?: LucideIcon
  loading?: boolean
  className?: string
}

export function KpiCard({ label, value, delta, icon: Icon, loading, className }: Props) {
  return (
    <Card className={cn("flex flex-col gap-3 p-5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        {Icon ? (
          <div className="rounded-md bg-muted p-1.5 text-muted-foreground">
            <Icon className="h-3.5 w-3.5" />
          </div>
        ) : null}
      </div>
      <div className="flex items-end justify-between gap-2">
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">{value ?? "—"}</span>
        )}
        {delta ? (
          <span className={cn("text-xs font-medium", delta.positive ? "text-emerald-600" : "text-destructive")}>
            {delta.value}
          </span>
        ) : null}
      </div>
    </Card>
  )
}
