"use client"

import { Download, FileText, DollarSign, Users, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { ErrorState } from "@/components/shared/error-state"
import { useDashboardSummary } from "../hooks/use-reports"
import { reportsApi } from "../api/reports"
import type { ProductReport, PriceReport, AuditReport } from "../api/reports"
import { useQueryClient } from "@tanstack/react-query"

function downloadCsv(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function getDownloadConfig(id: string) {
  switch (id) {
    case "products":
      return {
        filename: "product-catalog.csv",
        headers: ["Product Code", "Product Name", "Status", "Category", "Brand", "Prices", "Documents", "Created"],
        fetch: () => reportsApi.products(),
        format: (d: ProductReport) => d.products.map((p) => [
          String(p.productCode ?? ""),
          String(p.productName ?? ""),
          String(p.status ?? ""),
          String(p.category?.name ?? ""),
          String(p.brand?.name ?? ""),
          String(p._count?.prices ?? "0"),
          String(p._count?.documents ?? "0"),
          String(p.createdAt ?? ""),
        ]),
      }
    case "prices":
      return {
        filename: "price-list.csv",
        headers: ["Product", "Product Code", "MRP", "PTR", "PTS", "Distributor Price", "Status", "Created"],
        fetch: () => reportsApi.prices(),
        format: (d: PriceReport) => d.prices.map((p) => [
          String(p.product?.productName ?? ""),
          String(p.product?.productCode ?? ""),
          String(p.mrp ?? ""),
          String(p.ptr ?? ""),
          String(p.pts ?? ""),
          String(p.distributorPrice ?? ""),
          String(p.status ?? ""),
          String(p.createdAt ?? ""),
        ]),
      }
    case "audit":
      return {
        filename: "audit-trail.csv",
        headers: ["Action", "Entity Type", "Entity ID", "Description", "Actor", "Created"],
        fetch: () => reportsApi.audit(),
        format: (d: AuditReport) => d.logs.map((l) => [
          String(l.action ?? ""),
          String(l.entityType ?? ""),
          String(l.entityId ?? ""),
          String(l.description ?? ""),
          String(l.actor?.email ?? ""),
          String(l.createdAt ?? ""),
        ]),
      }
    default:
      return null
  }
}

const reportCards = [
  {
    id: "products",
    title: "Product Catalog Report",
    description: "Complete list of all products with SKU codes, categories, brands, pack sizes, and current status across all price tiers.",
    icon: FileText,
  },
  {
    id: "prices",
    title: "Price List Report",
    description: "Comprehensive pricing data including MRP, PTR, PTS, GST slabs, and effective dates for every active product.",
    icon: DollarSign,
  },
  {
    id: "approvals",
    title: "Approval Summary Report",
    description: "Summary of all pending and completed approvals with timestamps, approver details, and status breakdowns.",
    icon: ShieldCheck,
    comingSoon: true,
  },
  {
    id: "audit",
    title: "Audit Trail Report",
    description: "Full audit log of system changes with user attribution, field-level diffs, and chronological event tracking.",
    icon: Users,
  },
]

function ReportCard({ card }: { card: (typeof reportCards)[number] }) {
  const queryClient = useQueryClient()
  const cfg = card.comingSoon ? null : getDownloadConfig(card.id)
  const isReady = !!cfg

  const handleDownload = async () => {
    if (!cfg) return
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ["reports", card.id],
        queryFn: cfg.fetch as () => Promise<unknown>,
      })
      const rows = cfg.format(data as never)
      downloadCsv(cfg.filename, cfg.headers, rows)
    } catch {
      // silent
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <card.icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-base">{card.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{card.description}</p>
        <Button onClick={handleDownload} disabled={!isReady} variant="outline" size="sm" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          {isReady ? "Download Report" : "Coming Soon"}
        </Button>
      </CardContent>
    </Card>
  )
}

export function ReportsPage() {
  const { data: summary, isLoading: summaryLoading, error: summaryError, refetch: refetchSummary } = useDashboardSummary()

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Operational and analytical reports" />

      {summaryError ? (
        <ErrorState title="Failed to load summary" message={summaryError.message} onRetry={() => refetchSummary()} />
      ) : summaryLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-5"><div className="space-y-2"><div className="h-4 w-24 rounded bg-muted animate-pulse" /><div className="h-8 w-16 rounded bg-muted animate-pulse" /></div></CardContent></Card>
          ))}
        </div>
      ) : summary ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardContent className="p-5"><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Products</p><p className="mt-1 text-3xl font-semibold tabular-nums">{summary.totalProducts}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Active Products</p><p className="mt-1 text-3xl font-semibold tabular-nums">{summary.activeProducts}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Prices</p><p className="mt-1 text-3xl font-semibold tabular-nums">{summary.totalPrices}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Last Updated</p><p className="mt-1 text-sm font-medium tabular-nums">{new Date(summary.generatedAt).toLocaleString()}</p></CardContent></Card>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {reportCards.map((card) => (
          <ReportCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
