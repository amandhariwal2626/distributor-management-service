"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Plus, Upload, Download, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCards } from "@/components/shared/kpi-cards";
import { DataTable } from "@/components/shared/data-table";
import { FilterBar } from "@/components/shared/filter-bar";
import { ErrorState } from "@/components/shared/error-state";
import { useProducts, useDeleteProduct } from "../hooks/use-products";
import type { ProductListItem, ProductStatus } from "../types";

const statusStyles: Record<ProductStatus, string> = {
  ACTIVE:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  INACTIVE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function ProductListPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useProducts();
  const deleteProduct = useDeleteProduct();

  const columns: ColumnDef<ProductListItem>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "Product Code",
      accessorKey: "productCode",
    },
    {
      header: "Product Name",
      accessorKey: "productName",
    },
    {
      header: "Brand",
      accessorKey: "brand",
      cell: ({ row }) => row.original.brand?.brandName ?? "-",
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: ({ row }) => row.original.category?.categoryName ?? "-",
    },
    {
      header: "SKU Type",
      accessorKey: "skuType",
      cell: ({ row }) => {
        const type = row.original.skuType as string;
        return (
          <span className="text-sm">{type.replace(/_/g, " ")}</span>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status as ProductStatus;
        return (
          <Badge className={statusStyles[status]} variant="secondary">
            {status}
          </Badge>
        );
      },
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/products/${row.original.id}`)}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/products/${row.original.id}/edit`)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => deleteProduct.mutate(row.original.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filterOptions = [
    {
      key: "productCode",
      label: "Product Code",
      type: "text" as const,
      placeholder: "Search by code...",
    },
    {
      key: "productName",
      label: "Product Name",
      type: "text" as const,
      placeholder: "Search by name...",
    },
    {
      key: "brandId",
      label: "Brand",
      type: "select" as const,
      placeholder: "Select brand",
      options: [],
    },
    {
      key: "categoryId",
      label: "Category",
      type: "select" as const,
      placeholder: "Select category",
      options: [],
    },
    {
      key: "skuType",
      label: "SKU Type",
      type: "select" as const,
      placeholder: "Select type",
      options: [
        { label: "Finished Good", value: "FINISHED_GOOD" },
        { label: "Raw Material", value: "RAW_MATERIAL" },
        { label: "Service", value: "SERVICE" },
      ],
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      placeholder: "Select status",
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Draft", value: "DRAFT" },
        { label: "Inactive", value: "INACTIVE" },
      ],
    },
  ];

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const total = data?.total ?? 0;
  const activeCount =
    data?.data?.filter((p) => p.status === "ACTIVE").length ?? 0;
  const draftCount =
    data?.data?.filter((p) => p.status === "DRAFT").length ?? 0;
  const inactiveCount =
    data?.data?.filter((p) => p.status === "INACTIVE").length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Master"
        description="Manage products across the organization"
        actions={
          <>
            <Button variant="outline">
              <Upload className="mr-1 h-4 w-4" />
              Bulk Upload
            </Button>
            <Button variant="outline">
              <Download className="mr-1 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => router.push("/products/create")}>
              <Plus className="mr-1 h-4 w-4" />
              Create Product
            </Button>
          </>
        }
      />

      <KpiCards
        loading={isLoading}
        cards={[
          { label: "Total Products", value: total },
          {
            label: "Active Products",
            value: activeCount,
            trend: { value: "12%", positive: true },
          },
          { label: "Draft Products", value: draftCount },
          { label: "Inactive Products", value: inactiveCount },
        ]}
      />

      <FilterBar options={filterOptions} />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        searchKey="productName"
        searchPlaceholder="Search products..."
        onRowClick={(row) => router.push(`/products/${row.id}`)}
        onDeleteRows={(rows) => rows.forEach((r) => deleteProduct.mutate(r.id))}
        emptyTitle="No products found"
        emptyDescription="Create your first product to get started."
        emptyAction={{
          label: "Create Product",
          onClick: () => router.push("/products/create"),
        }}
      />
    </div>
  );
}
