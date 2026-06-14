"use client"

import Link from "next/link"
import { usePriceHistory } from "../hooks/use-prices"
import { PageHeader } from "@/components/shared/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, History } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { StatusBadge } from "@/components/shared/status-badge"

export function PriceHistoryPage({ id }: { id: string }) {
  const { data, isLoading, isError, refetch } = usePriceHistory(id)

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <Button asChild variant="ghost" size="sm" className="h-7 w-fit px-2">
        <Link href="/prices"><ArrowLeft className="mr-1 h-3.5 w-3.5" />Back to prices</Link>
      </Button>
      <PageHeader title="Price History" description="Versioned timeline of changes for this price." />

      {isError ? (
        <ErrorState message="Could not load history." onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : (data?.length ?? 0) === 0 ? (
        <EmptyState icon={History} title="No history" description="No revisions recorded for this price." />
      ) : (
        <ol className="relative ml-3 border-l border-border">
          {data!.map((v) => (
            <li key={v.id} className="mb-6 ml-6">
              <span className="absolute -left-[5px] mt-2 h-2.5 w-2.5 rounded-full border border-border bg-card" />
              <Card className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">Version {v.version}</p>
                    <p className="text-xs text-muted-foreground">
                      Effective {new Date(v.effectiveFrom).toLocaleDateString()} · changed by {v.changedBy ?? "—"}
                    </p>
                  </div>
                  <StatusBadge value={v.status} />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <Stat label="MRP" value={`₹${v.mrp.toFixed(2)}`} />
                  <Stat label="PTR" value={`₹${v.ptr.toFixed(2)}`} />
                  <Stat label="PTS" value={`₹${v.pts.toFixed(2)}`} />
                </div>
                {v.revisionReason ? (
                  <p className="mt-3 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">{v.revisionReason}</p>
                ) : null}
                {(v.changes?.length ?? 0) > 0 ? (
                  <div className="mt-3 space-y-1">
                    {v.changes!.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="font-medium capitalize text-foreground">{c.field}</span>
                        <span className="rounded bg-red-100 px-1.5 py-0.5 font-mono text-red-600 line-through">{String(c.oldValue)}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-emerald-600">{String(c.newValue)}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Card>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card/40 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-base font-semibold tabular-nums">{value}</p>
    </div>
  )
}
