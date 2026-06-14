"use client"

import { useRouter } from "next/navigation"
import { Edit, Trash2, MoreHorizontal, ArrowLeft, Clock, Shield, Package, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DetailSkeleton } from "@/components/shared/loading-skeleton"
import { ErrorState } from "@/components/shared/error-state"
import { useProduct, useDeleteProduct } from "../hooks/use-products"
import type { ProductStatus } from "../types"

const statusStyles: Record<ProductStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  INACTIVE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex items-baseline justify-between border-b py-3 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value ?? "\u2014"}</span>
    </div>
  )
}

function ActivityEntry({ action, user, date }: { action: string; user: string; date: string }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
        <Activity className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm">{action}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{user}</span>
          <span>•</span>
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

export function ProductDetailPage({ id }: { id: string }) {
  const router = useRouter()
  const { data: product, isLoading, isError, refetch } = useProduct(id)
  const deleteProduct = useDeleteProduct()

  if (isLoading) return <DetailSkeleton />

  if (isError || !product) {
    return <ErrorState message="Product not found" onRetry={() => refetch()} />
  }

  const handleDelete = () => {
    deleteProduct.mutate(id, { onSuccess: () => router.push("/products") })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/products")} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{product.productName}</h1>
              <div className="mt-1 flex items-center gap-3">
                <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                  {product.productCode}
                </code>
                <Badge className={statusStyles[product.status]}>
                  {product.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/products/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Product Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <InfoRow label="Product Code" value={product.productCode} />
                  <InfoRow label="Product Name" value={product.productName} />
                  <InfoRow label="Short Name" value={product.shortName} />
                  <InfoRow label="Description" value={product.description} />
                  <InfoRow label="Barcode" value={product.barcode} />
                  <InfoRow label="HSN Code" value={product.hsnCode} />
                  <InfoRow label="SKU Type" value={product.skuType?.replace(/_/g, " ")} />
                  <InfoRow label="UOM" value={product.uom?.uomName} />
                  <InfoRow label="Manufacturer" value={product.manufacturer?.manufacturerName} />
                  <InfoRow label="Shelf Life (Days)" value={product.shelfLifeDays} />
                  <InfoRow label="Reorder Level" value={product.reorderLevel} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hierarchy" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Product Hierarchy</CardTitle>
                </CardHeader>
                <CardContent>
                  <InfoRow label="Category" value={product.category?.categoryName} />
                  <InfoRow label="Sub Category" value={product.subCategory?.subCategoryName} />
                  <InfoRow label="Brand" value={product.brand?.brandName} />
                  <InfoRow label="Manufacturer" value={product.manufacturer?.manufacturerName} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View pricing details in the{" "}
                    <Button variant="link" className="h-auto p-0 text-sm" onClick={() => router.push("/prices")}>
                      Price Master
                    </Button>
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attributes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Attributes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Attribute data coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No documents uploaded</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Audit Trail</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No audit entries yet</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityEntry action="Product created" user="System" date={product.createdAt} />
              {product.updatedAt !== product.createdAt && (
                <ActivityEntry action="Product updated" user="System" date={product.updatedAt} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge className={statusStyles[product.status]}>
                  {product.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Audit Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
