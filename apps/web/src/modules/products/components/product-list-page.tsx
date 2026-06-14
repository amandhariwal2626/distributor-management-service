"use client"

import { useMemo, useState } from "react"
import { Plus, Upload, Download, MoreHorizontal, Package, CheckCircle2, FileEdit, Clock } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { PageHeader } from "@/components/shared/page-header"
import { KpiCard } from "@/components/shared/kpi-card"
import { DataTable } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"
import { ErrorState } from "@/components/shared/error-state"
import { FilterChips, type Chip } from "@/components/shared/filter-chips"
import { ProductSheet } from "./product-sheet"
import { SearchableCombobox } from "@/components/shared/searchable-combobox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useProducts, useDeleteProduct } from "../hooks/use-products"
import { useBrands, useCategories } from "../hooks/use-master-data"
import { toast } from "sonner"
import type { Product, ProductFilters, ProductStatus } from "../types"
import { useRouter } from "next/navigation"

export function ProductListPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, pageSize: 25 })
  const [openId, setOpenId] = useState<string | null>(null)

  const productsQ = useProducts(filters)
  const brandsQ = useBrands()
  const categoriesQ = useCategories()
  const deleteProduct = useDeleteProduct()

  const rows = productsQ.data?.data ?? []

  const kpis = useMemo(() => {
    const total = productsQ.data?.total ?? 0
    const active = rows.filter((r) => r.status === "active").length
    const draft = rows.filter((r) => r.status === "draft").length
    const pending = rows.filter((r) => r.status === "pending").length
    return { total, active, draft, pending }
  }, [rows, productsQ.data?.total])

  const columns = useMemo<ColumnDef<Product>[]>(() => [
    {
      id: "code", accessorKey: "code", header: "Product Code",
      cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.code}</span>,
    },
    {
      id: "name", accessorKey: "name", header: "Product Name",
      cell: ({ row }) => <span className="font-medium text-foreground">{row.original.name}</span>,
    },
    { id: "brand", accessorKey: "brandName", header: "Brand", cell: ({ row }) => row.original.brandName ?? "—" },
    { id: "category", accessorKey: "categoryName", header: "Category", cell: ({ row }) => row.original.categoryName ?? "—" },
    { id: "variant", accessorKey: "variant", header: "Variant", cell: ({ row }) => row.original.variant ?? "—" },
    {
      id: "status", accessorKey: "status", header: "Status",
      cell: ({ row }) => <StatusBadge value={row.original.status} />,
    },
    {
      id: "createdAt", accessorKey: "createdAt", header: "Created",
      cell: ({ row }) => <span className="text-muted-foreground">{new Date(row.original.createdAt).toLocaleDateString()}</span>,
    },
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
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setOpenId(row.original.id) }}>Quick view</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/products/${row.original.id}`) }}>Open</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); deleteProduct.mutate(row.original.id) }} className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [router, deleteProduct])

  const brandOptions = (brandsQ.data ?? []).map((b) => ({ value: b.id, label: b.name }))
  const categoryOptions = (categoriesQ.data ?? []).map((c) => ({ value: c.id, label: c.name }))

  const chips: Chip[] = []
  if (filters.code) chips.push({ key: "code", label: "Code", value: filters.code })
  if (filters.name) chips.push({ key: "name", label: "Name", value: filters.name })
  if (filters.brandId) chips.push({ key: "brandId", label: "Brand", value: brandOptions.find((b) => b.value === filters.brandId)?.label ?? filters.brandId })
  if (filters.categoryId) chips.push({ key: "categoryId", label: "Category", value: categoryOptions.find((c) => c.value === filters.categoryId)?.label ?? filters.categoryId })
  if (filters.status) chips.push({ key: "status", label: "Status", value: filters.status })

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader
        title="Product Master"
        description="Manage products across the organization."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.info("Bulk upload coming soon")}>
              <Upload className="mr-1.5 h-3.5 w-3.5" />Bulk Upload
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.info("Export coming soon")}>
              <Download className="mr-1.5 h-3.5 w-3.5" />Export
            </Button>
            <Button size="sm" onClick={() => router.push("/products/create")}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />Create Product
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Products" value={kpis.total} icon={Package} loading={productsQ.isLoading} />
        <KpiCard label="Active" value={kpis.active} icon={CheckCircle2} loading={productsQ.isLoading} />
        <KpiCard label="Draft" value={kpis.draft} icon={FileEdit} loading={productsQ.isLoading} />
        <KpiCard label="Pending Approval" value={kpis.pending} icon={Clock} loading={productsQ.isLoading} />
      </div>

      <div className="rounded-lg border border-border bg-card p-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <Input placeholder="Product code" value={filters.code ?? ""} onChange={(e) => setFilters((f) => ({ ...f, code: e.target.value || undefined }))} />
          <Input placeholder="Product name" value={filters.name ?? ""} onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value || undefined }))} />
          <SearchableCombobox value={filters.brandId} onChange={(v) => setFilters((f) => ({ ...f, brandId: v || undefined }))} options={brandOptions} placeholder="Brand" loading={brandsQ.isLoading} />
          <SearchableCombobox value={filters.categoryId} onChange={(v) => setFilters((f) => ({ ...f, categoryId: v || undefined }))} options={categoryOptions} placeholder="Category" loading={categoriesQ.isLoading} />
          <Select value={filters.status ?? ""} onValueChange={(v) => setFilters((f) => ({ ...f, status: (v || undefined) as ProductStatus | undefined }))}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {chips.length > 0 ? (
          <div className="mt-3">
            <FilterChips chips={chips} onRemove={(key) => setFilters((f) => ({ ...f, [key]: undefined }))} onClear={() => setFilters({ page: 1, pageSize: 25 })} />
          </div>
        ) : null}
      </div>

      {productsQ.isError ? (
        <ErrorState message="Failed to load products." onRetry={() => productsQ.refetch()} />
      ) : (
        <DataTable<Product>
          data={rows}
          columns={columns}
          loading={productsQ.isLoading}
          enableSelection
          onRowClick={(r) => setOpenId(r.id)}
          rowKey={(r) => r.id}
          emptyTitle="No products yet"
          emptyDescription="Create your first product or run a bulk upload to get started."
        />
      )}

      <ProductSheet id={openId} onClose={() => setOpenId(null)} />
    </div>
  )
}
