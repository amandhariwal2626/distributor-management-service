"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { Plus, Upload, Download, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeader } from "@/components/shared/page-header"
import { KpiCards } from "@/components/shared/kpi-cards"
import { DataTable } from "@/components/shared/data-table"
import { FilterBar } from "@/components/shared/filter-bar"
import { ErrorState } from "@/components/shared/error-state"
import { usePrices } from "../hooks/use-prices"
import type { Price } from "@/modules/products/types"

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  FUTURE: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  EXPIRED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export function PriceListPage() {
  const router = useRouter()
  const { data, isLoading, isError, refetch } = usePrices()

  const columns: ColumnDef<Price>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "Product",
      accessorKey: "product",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium">{row.original.product?.productName}</p>
          <p className="text-xs text-muted-foreground">{row.original.product?.productCode}</p>
        </div>
      ),
    },
    {
      header: "MRP",
      accessorKey: "mrp",
      cell: ({ row }) => <span className="font-medium">₹{Number(row.original.mrp).toFixed(2)}</span>,
    },
    {
      header: "PTR",
      accessorKey: "ptr",
      cell: ({ row }) => <span>₹{Number(row.original.ptr).toFixed(2)}</span>,
    },
    {
      header: "PTS",
      accessorKey: "pts",
      cell: ({ row }) => <span>₹{Number(row.original.pts).toFixed(2)}</span>,
    },
    {
      header: "Effective From",
      accessorKey: "effectiveFrom",
      cell: ({ row }) => new Date(row.original.effectiveFrom).toLocaleDateString(),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <Badge className={statusStyles[row.original.status]} variant="secondary">
          {row.original.status.replace("_", " ")}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/prices/${row.original.id}/history`)}>
              View History
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const filterOptions = [
    { key: "status", label: "Status", type: "select" as const, placeholder: "Select status", options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Future", value: "FUTURE" },
      { label: "Expired", value: "EXPIRED" },
      { label: "Pending Approval", value: "PENDING_APPROVAL" },
    ]},
  ]

  if (isError) return <ErrorState onRetry={() => refetch()} />

  const activePrices = data?.data?.filter((p) => p.status === "ACTIVE").length ?? 0
  const futurePrices = data?.data?.filter((p) => p.status === "FUTURE").length ?? 0
  const expiredPrices = data?.data?.filter((p) => p.status === "EXPIRED").length ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Price Master"
        description="Manage product pricing across the organization"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => router.push("/prices/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Price
            </Button>
          </>
        }
      />

      <KpiCards
        loading={isLoading}
        cards={[
          { label: "Active Prices", value: activePrices },
          { label: "Future Prices", value: futurePrices },
          { label: "Expired Prices", value: expiredPrices },
        ]}
      />

      <FilterBar options={filterOptions} />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        searchPlaceholder="Search prices..."
        emptyTitle="No prices found"
        emptyDescription="Create your first price entry to get started."
        emptyAction={{ label: "Create Price", onClick: () => router.push("/prices/create") }}
      />
    </div>
  )
}
