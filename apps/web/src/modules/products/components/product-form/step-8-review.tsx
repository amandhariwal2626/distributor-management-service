"use client"

import { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import type { ProductFormValues } from "../../schemas"
import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle } from "lucide-react"
import {
  useBrands,
  useBusinessUnits,
  useCategories,
  useDivisions,
  useSubBrands,
  useSubCategories,
  useGeography,
  useUoms,
} from "../../hooks/use-master-data"

export function Step8Review() {
  const { getValues, formState: { errors } } = useFormContext<ProductFormValues>()
  const v = getValues()
  const errorCount = Object.keys(errors ?? {}).length

  const buQ = useBusinessUnits()
  const divQ = useDivisions(v.businessUnit || undefined)
  const catQ = useCategories()
  const subCatQ = useSubCategories(v.categoryId || undefined)
  const brandsQ = useBrands()
  const subBrandsQ = useSubBrands(v.brandId || undefined)
  const uomQ = useUoms()
  const geoQ = useGeography()

  const uomMap = useMemo(() => new Map(uomQ.data?.map((u) => [u.id, u.name])), [uomQ.data])
  const buMap = useMemo(() => new Map(buQ.data?.map((b) => [b.id, b.name])), [buQ.data])
  const divMap = useMemo(() => new Map(divQ.data?.map((d) => [d.id, d.name])), [divQ.data])
  const catMap = useMemo(() => new Map(catQ.data?.map((c) => [c.id, c.name])), [catQ.data])
  const subCatMap = useMemo(() => new Map(subCatQ.data?.map((c) => [c.id, c.name])), [subCatQ.data])
  const brandMap = useMemo(() => new Map(brandsQ.data?.map((b) => [b.id, b.name])), [brandsQ.data])
  const subBrandMap = useMemo(() => new Map(subBrandsQ.data?.map((b) => [b.id, b.name])), [subBrandsQ.data])
  const geoMap = useMemo(() => {
    const map = new Map<string, string>()
    const walk = (nodes: { id: string; name: string; children?: typeof nodes }[]) => {
      for (const n of nodes) {
        map.set(n.id, n.name)
        if (n.children) walk(n.children)
      }
    }
    if (geoQ.data) walk(geoQ.data)
    return map
  }, [geoQ.data])

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-base font-semibold">Review & Submit</h2>
        <p className="text-sm text-muted-foreground">Confirm everything looks right before submitting for approval.</p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          {errorCount === 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> All sections validated
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5" /> {errorCount} validation issue(s)
            </span>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Summary title="Product Information" rows={[["Code", v.code], ["SAP", v.sapCode], ["Name", v.name], ["Short Name", v.shortName], ["Barcode", v.barcode], ["EAN", v.eanCode]]} />
        <Summary title="Hierarchy" rows={[
          ["Business Unit", buMap.get(v.businessUnit ?? "") ?? v.businessUnit],
          ["Division", divMap.get(v.division ?? "") ?? v.division],
          ["Category", catMap.get(v.categoryId ?? "") ?? v.categoryId],
          ["Sub Category", subCatMap.get(v.subCategoryId ?? "") ?? v.subCategoryId],
          ["Brand", brandMap.get(v.brandId ?? "") ?? v.brandId],
          ["Sub Brand", subBrandMap.get(v.subBrand ?? "") ?? v.subBrand],
          ["Variant", v.variant],
        ]} />
        <Summary title="Packaging" rows={[["Base UOM", uomMap.get(v.baseUom ?? "") ?? v.baseUom], ["Pack Size", v.packSize], ["Case Qty", v.caseQuantity], ["Weight", v.weight], ["Volume", v.volume]]} />
        <Summary title="Tax" rows={[["HSN", v.hsn], ["GST %", v.gst], ["CGST %", v.cgst], ["SGST %", v.sgst], ["IGST %", v.igst]]} />
        <Summary title="Geography" rows={[
          ["Regions", v.geographies?.length
            ? v.geographies.map((g) => geoMap.get(g.geographyId) ?? g.geographyId).join(", ")
            : "0 selected"],
        ]} />
        <Summary title="Attributes" rows={[["Total", `${v.attributes?.length ?? 0} attributes`]]} />
        <Summary title="Documents" rows={[["Total", `${v.documents?.length ?? 0} files`]]} />
      </div>
    </div>
  )
}

function Summary({ title, rows }: { title: string; rows: Array<[string, React.ReactNode]> }) {
  return (
    <Card className="p-5">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <dl className="space-y-1.5 text-sm">
        {rows.map(([k, val]) => (
          <div key={k} className="flex items-start justify-between gap-3 border-b border-dashed border-border py-1 last:border-0">
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
            <dd className="text-right text-foreground">{val ?? <span className="text-muted-foreground">—</span>}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
