"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { BadgeIndianRupee, Clock, Download, MoreHorizontal, Plus, Upload } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { KpiCard } from "@/components/shared/kpi-card"
import { DataTable } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"
import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePrices } from "../hooks/use-prices"
import { toast } from "sonner"
import type { Price, PriceFilters, PriceStatus } from "../types"

export function PriceListPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<PriceFilters>({ page: 1, pageSize: 25 })
  const pricesQ = usePrices(filters)
  const rows = pricesQ.data?.data ?? []

  const kpis = useMemo(() => ({
    active: rows.filter((r) => r.status === "active").length,
    future: rows.filter((r) => r.status === "future").length,
    pending: rows.filter((r) => r.status === "pending").length,
    expiring: rows.filter((r) => r.effectiveTo && new Date(r.effectiveTo) < new Date(Date.now() + 30 * 86400000)).length,
  }), [rows])

  const columns = useMemo<ColumnDef<Price>[]>(() => [
    { id: "product", header: "Product", cell: ({ row }) => (
      <div>
        <div className="font-medium text-foreground">{row.original.productName ?? row.original.productId}</div>
        <div className="font-mono text-xs text-muted-foreground">{row.original.productCode ?? "—"}</div>
      </div>
    ) },
    { id: "mrp", accessorKey: "mrp", header: "MRP", cell: ({ row }) => <span className="tabular-nums">₹{row.original.mrp.toFixed(2)}</span> },
    { id: "ptr", accessorKey: "ptr", header: "PTR", cell: ({ row }) => <span className="tabular-nums">₹{row.original.ptr.toFixed(2)}</span> },
    { id: "pts", accessorKey: "pts", header: "PTS", cell: ({ row }) => <span className="tabular-nums">₹{row.original.pts.toFixed(2)}</span> },
    { id: "effectiveFrom", header: "Effective", cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {new Date(row.original.effectiveFrom).toLocaleDateString()}
        {row.original.effectiveTo ? ` → ${new Date(row.original.effectiveTo).toLocaleDateString()}` : ""}
      </span>
    ) },
    { id: "status", header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
    {
      id: "actions", header: "", size: 40,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/prices/${row.original.id}/history`)}>View history</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [router])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader
        title="Price Master"
        description="Track active, future, and pending prices across products."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.info("Bulk upload coming soon")}>
              <Upload className="mr-1.5 h-3.5 w-3.5" />Bulk Upload
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.info("Export coming soon")}>
              <Download className="mr-1.5 h-3.5 w-3.5" />Export
            </Button>
            <Button size="sm" onClick={() => router.push("/prices/create")}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />Create Price
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Active Prices" value={kpis.active} icon={BadgeIndianRupee} loading={pricesQ.isLoading} />
        <KpiCard label="Future Prices" value={kpis.future} icon={Clock} loading={pricesQ.isLoading} />
        <KpiCard label="Pending Approval" value={kpis.pending} icon={Clock} loading={pricesQ.isLoading} />
        <KpiCard label="Expiring (30d)" value={kpis.expiring} icon={Clock} loading={pricesQ.isLoading} />
      </div>

      <div className="rounded-lg border border-border bg-card p-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Input placeholder="Search product…" value={filters.q ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value || undefined }))} />
          <Select value={filters.status ?? ""}
            onValueChange={(v) => setFilters((f) => ({ ...f, status: (v || undefined) as PriceStatus | undefined }))}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="future">Future</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {pricesQ.isError ? (
        <ErrorState message="Failed to load prices." onRetry={() => pricesQ.refetch()} />
      ) : (
        <DataTable<Price>
          data={rows}
          columns={columns}
          loading={pricesQ.isLoading}
          enableSelection
          rowKey={(r) => r.id}
          onRowClick={(r) => router.push(`/prices/${r.id}/history`)}
          emptyTitle="No prices yet"
          emptyDescription="Create a price to make it available to outlets."
        />
      )}
    </div>
  )
}
