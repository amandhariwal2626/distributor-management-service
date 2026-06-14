"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface KpiCard {
  label: string
  value: string | number
  description?: string
  trend?: { value: string; positive: boolean }
}

interface KpiCardsProps {
  cards: KpiCard[]
  loading?: boolean
}

function KpiCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
      </CardContent>
    </Card>
  )
}

export function KpiCards({ cards, loading }: KpiCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-semibold">{card.value}</p>
              {card.trend && (
                <span
                  className={`text-sm font-medium ${
                    card.trend.positive ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {card.trend.positive ? "+" : "-"}
                  {card.trend.value}
                </span>
              )}
            </div>
            {card.description && (
              <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
