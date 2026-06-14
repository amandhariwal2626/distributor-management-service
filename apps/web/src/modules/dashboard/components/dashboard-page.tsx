"use client"

import {
  BarChart3,
  TrendingUp,
  Upload,
  FileCheck,
  Bell,
  Activity,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { KpiCards } from "@/components/shared/kpi-cards"
import { ErrorState } from "@/components/shared/error-state"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useDashboard } from "../hooks/use-dashboard"
import type { ChartDatum } from "../api/dashboard"

function BarChart({ data, color = "hsl(var(--primary))" }: { data: ChartDatum[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-24 shrink-0 truncate text-xs text-muted-foreground">{d.label}</span>
          <div className="flex-1 overflow-hidden rounded-sm bg-muted">
            <div
              className="h-5 rounded-sm transition-all"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: color }}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-xs font-medium">{d.value}</span>
        </div>
      ))}
    </div>
  )
}

function TrendChart({ data }: { data: Array<{ date: string; value: number }> }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div>
      <div className="flex items-end gap-1" style={{ height: 100 }}>
        {data.map((d) => (
          <div
            key={d.date}
            className="flex-1 rounded-sm transition-all"
            style={{
              height: `${(d.value / max) * 100}%`,
              backgroundColor: "hsl(var(--primary))",
            }}
          />
        ))}
      </div>
      <div className="mt-1 flex gap-1">
        {data.map((d) => (
          <span key={d.date} className="flex-1 truncate text-center text-[10px] text-muted-foreground">
            {d.date}
          </span>
        ))}
      </div>
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="h-3 w-8" />
        </div>
      ))}
    </div>
  )
}

function TrendSkeleton() {
  return (
    <div>
      <div className="flex items-end gap-1" style={{ height: 100 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="flex-1 rounded-sm" style={{ height: `${20 + Math.random() * 60}%` }} />
        ))}
      </div>
      <div className="mt-1 flex gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
    </div>
  )
}

function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}

function ActivitySkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 border-b py-3 last:border-b-0">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

const statusStyles: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-700",
  APPROVED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  PENDING_APPROVAL: "bg-yellow-100 text-yellow-700",
  FAILED: "bg-red-100 text-red-700",
  SENT_BACK: "bg-red-100 text-red-700",
  DRAFT: "bg-gray-100 text-gray-700",
  UPLOADED: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-blue-100 text-blue-700",
}

function statusBadgeClass(status: string): string {
  return statusStyles[status] || "bg-gray-100 text-gray-700"
}

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboard()

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Overview of your product and pricing operations" />
        <ErrorState
          title="Failed to load dashboard"
          message={error instanceof Error ? error.message : "An unexpected error occurred"}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  if (!data) {
    return null
  }

  const kpiCards = [
    {
      label: "Total Products",
      value: data.kpis.totalProducts.toLocaleString(),
      description: "All products in system",
    },
    {
      label: "Active Products",
      value: data.kpis.activeProducts.toLocaleString(),
      trend: {
        value: `${((data.kpis.activeProducts / data.kpis.totalProducts) * 100).toFixed(1)}%`,
        positive: true,
      } as const,
      description: "Currently active",
    },
    {
      label: "Future Prices",
      value: data.kpis.futurePrices.toLocaleString(),
      description: "Scheduled price changes",
    },
    {
      label: "Pending Approvals",
      value: data.kpis.pendingApproval.toLocaleString(),
      description: "Requires attention",
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of your product and pricing operations" />

      <KpiCards cards={kpiCards} loading={isLoading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Products by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <BarChart data={data.productsByCategory} color="hsl(221.2, 83.2%, 53.3%)" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Products by Brand
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <BarChart data={data.productsByBrand} color="hsl(142.1, 76.2%, 36.3%)" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Price Change Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <TrendSkeleton /> : <TrendChart data={data.priceChangeTrend} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Approval Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <TrendSkeleton /> : <TrendChart data={data.approvalTrend} />}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Upload className="h-4 w-4" />
              Recent Uploads
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ListSkeleton />
            ) : (
              <div className="space-y-3">
                {data.recentUploads.map((u) => (
                  <div key={u.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{u.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(u.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className={statusBadgeClass(u.status)}>
                      {u.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileCheck className="h-4 w-4" />
              Recent Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ListSkeleton />
            ) : (
              <div className="space-y-3">
                {data.recentApprovals.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {a.entityName || `${a.entityType} #${a.entityId}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.submittedBy} &bull; {new Date(a.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className={statusBadgeClass(a.status)}>
                      {a.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" />
              Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ActivitySkeleton />
            ) : (
              <div className="space-y-0">
                {data.activity.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 border-b py-3 last:border-b-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm">
                        <span className="font-medium">{a.action}</span>
                        {a.entityName && <> &mdash; {a.entityName}</>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.user} &bull; {new Date(a.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
