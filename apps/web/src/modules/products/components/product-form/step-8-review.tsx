"use client"

import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ReviewData {
  productInfo: Record<string, unknown>
  hierarchy: Record<string, unknown>
  packaging: Record<string, unknown>
  tax: Record<string, unknown>
  geography: { states: { name: string }[] }
  attributes: { attribute: string; type: string; value: string }[]
  documents: { id: string; file: File; documentType: string }[]
}

function SectionCard({
  title,
  children,
  warnings,
}: {
  title: string
  children: React.ReactNode
  warnings?: string[]
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {warnings && warnings.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-amber-600">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{warnings.length} warning(s)</span>
          </div>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function FieldRow({ label, value, highlight }: { label: string; value?: string | number | null; highlight?: boolean }) {
  if (!value && value !== 0) return null
  return (
    <div className={cn("flex items-baseline justify-between py-1.5", highlight && "text-amber-600")}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium", highlight && "text-amber-600")}>{String(value)}</span>
    </div>
  )
}

interface Step8ReviewProps {
  data: ReviewData
  onBack: () => void
  onSubmit: () => void
  submitting?: boolean
}

export function Step8Review({ data, onBack, onSubmit, submitting }: Step8ReviewProps) {
  const warnings: string[] = []

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Review & Submit</h3>
        <p className="text-sm text-muted-foreground">
          Verify all information before submitting for approval
        </p>
      </div>

      {warnings.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                {warnings.length} validation warning(s)
              </p>
              <ul className="mt-1 list-inside list-disc text-sm text-amber-700 dark:text-amber-400">
                {warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Product Information">
          <FieldRow label="Product Code" value={data.productInfo.productCode as string} />
          <FieldRow label="SAP Code" value={data.productInfo.sapProductCode as string} />
          <FieldRow label="Product Name" value={data.productInfo.productName as string} />
          <FieldRow label="Short Name" value={data.productInfo.shortName as string} />
          <FieldRow label="Barcode" value={data.productInfo.barcode as string} />
          <FieldRow label="HSN Code" value={data.productInfo.hsnCode as string} />
          <FieldRow label="Shelf Life (Days)" value={data.productInfo.shelfLifeDays as number} />
        </SectionCard>

        <SectionCard title="Hierarchy">
          <FieldRow label="Category" value={data.hierarchy.categoryId as string} />
          <FieldRow label="Sub Category" value={data.hierarchy.subCategoryId as string} />
          <FieldRow label="Brand" value={data.hierarchy.brandId as string} />
          <FieldRow label="Manufacturer" value={data.hierarchy.manufacturerId as string} />
          <FieldRow label="SKU Type" value={data.hierarchy.skuType as string} />
        </SectionCard>

        <SectionCard title="Packaging">
          <FieldRow label="UOM" value={data.packaging.uomId as string} />
          <FieldRow label="Reorder Level" value={data.packaging.reorderLevel as number} />
        </SectionCard>

        <SectionCard title="Tax">
          <FieldRow label="Tax Group" value={data.tax.taxGroupId as string} />
        </SectionCard>
      </div>

      <SectionCard title="Geography">
        {data.geography.states.length === 0 ? (
          <p className="text-sm text-muted-foreground">No states selected</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.geography.states.map((s) => (
              <Badge key={s.name} variant="secondary">
                {s.name}
              </Badge>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Attributes">
        {data.attributes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No attributes added</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.attributes.map((attr, i) => (
              <div key={i} className="rounded-md bg-muted/50 px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground">{attr.attribute}</p>
                <p className="text-sm">{attr.value}</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Documents">
        {data.documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents uploaded</p>
        ) : (
          <p className="text-sm text-muted-foreground">{data.documents.length} file(s) attached</p>
        )}
      </SectionCard>

      <Separator />

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit For Approval"}
        </Button>
      </div>
    </div>
  )
}
