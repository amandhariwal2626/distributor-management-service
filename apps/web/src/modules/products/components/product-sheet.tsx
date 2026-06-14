"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/shared/status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useProduct } from "../hooks/use-products"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export function ProductSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { data, isLoading } = useProduct(id ?? undefined)
  return (
    <Sheet open={!!id} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {isLoading ? <Skeleton className="h-5 w-40" /> : (data?.name ?? "Product")}
            {data ? <StatusBadge value={data.status} /> : null}
          </SheetTitle>
          <SheetDescription className="font-mono text-xs">
            {isLoading ? <Skeleton className="h-3 w-24" /> : data?.code}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 px-4">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
              <TabsTrigger value="tax">Tax</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 space-y-2 text-sm">
              <Row label="Brand" value={data?.brandName} loading={isLoading} />
              <Row label="Category" value={data?.categoryName} loading={isLoading} />
              <Row label="Variant" value={data?.variant} loading={isLoading} />
              <Row label="Base UOM" value={data?.baseUom} loading={isLoading} />
              <Row label="Pack Size" value={data?.packSize} loading={isLoading} />
              <Row label="Description" value={data?.description} loading={isLoading} />
            </TabsContent>
            <TabsContent value="hierarchy" className="mt-4 space-y-2 text-sm">
              <Row label="Business Unit" value={data?.businessUnit} loading={isLoading} />
              <Row label="Division" value={data?.division} loading={isLoading} />
              <Row label="Sub Brand" value={data?.subBrand} loading={isLoading} />
            </TabsContent>
            <TabsContent value="tax" className="mt-4 space-y-2 text-sm">
              <Row label="HSN" value={data?.hsn} loading={isLoading} />
              <Row label="GST" value={data?.gst != null ? `${data.gst}%` : undefined} loading={isLoading} />
              <Row label="CGST" value={data?.cgst != null ? `${data.cgst}%` : undefined} loading={isLoading} />
              <Row label="SGST" value={data?.sgst != null ? `${data.sgst}%` : undefined} loading={isLoading} />
              <Row label="IGST" value={data?.igst != null ? `${data.igst}%` : undefined} loading={isLoading} />
            </TabsContent>
          </Tabs>
        </div>

        {data ? (
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-border px-4 pt-4">
            <Button asChild variant="outline" size="sm">
              <Link href={`/products/${data.id}`}>
                Open full details
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function Row({ label, value, loading }: { label: string; value?: React.ReactNode; loading?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-dashed border-border py-2 last:border-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-right text-foreground">
        {loading ? <Skeleton className="h-3.5 w-24" /> : (value ?? <span className="text-muted-foreground">—</span>)}
      </span>
    </div>
  )
}
