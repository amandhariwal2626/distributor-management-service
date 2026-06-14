"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/shared/data-table"
import { ErrorState } from "@/components/shared/error-state"
import { useBrands } from "../hooks/use-brands"
import type { Brand } from "../api/brands"
import { BrandCreateSheet } from "./brand-create-sheet"

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  INACTIVE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export function BrandListPage() {
  const { data, isLoading, isError, refetch } = useBrands()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)

  const columns: ColumnDef<Brand>[] = [
    {
      header: "Code",
      accessorKey: "code",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.code}</span>
      ),
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge className={statusStyles[status]} variant="secondary">
            {status}
          </Badge>
        )
      },
    },
  ]

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brand Master"
        description="Manage product brands"
        actions={
          <Button onClick={() => { setSelectedBrand(null); setSheetOpen(true) }}>
            <Plus className="mr-1 h-4 w-4" />
            Create Brand
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        searchKey="name"
        searchPlaceholder="Search brands..."
        onRowClick={(row) => { setSelectedBrand(row); setSheetOpen(true) }}
        emptyTitle="No brands found"
        emptyDescription="Create your first brand to get started."
        emptyAction={{
          label: "Create Brand",
          onClick: () => { setSelectedBrand(null); setSheetOpen(true) },
        }}
      />

      <BrandCreateSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        brand={selectedBrand}
      />
    </div>
  )
}
