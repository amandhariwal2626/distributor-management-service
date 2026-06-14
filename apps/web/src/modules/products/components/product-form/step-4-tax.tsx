"use client"

import { useFormContext, useWatch } from "react-hook-form"
import type { ProductFormValues } from "../../schemas"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field } from "./step-1-product-info"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function Step4Tax() {
  const { register, formState: { errors }, control } = useFormContext<ProductFormValues>()
  const gst = Number(useWatch({ control, name: "gst" }) ?? 0)
  const cgst = Number(useWatch({ control, name: "cgst" }) ?? 0)
  const sgst = Number(useWatch({ control, name: "sgst" }) ?? 0)
  const igst = Number(useWatch({ control, name: "igst" }) ?? 0)
  const splitMatches = Math.abs((cgst + sgst) - gst) < 0.01
  const igstMatches = Math.abs(igst - gst) < 0.01

  return (
    <Card className="p-6">
      <h2 className="text-base font-semibold">Tax</h2>
      <p className="text-sm text-muted-foreground">HSN classification and tax breakdown.</p>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="HSN Code" error={errors.hsn?.message}><Input {...register("hsn")} /></Field>
        <Field label="GST %" error={errors.gst?.message}><Input type="number" step="0.01" {...register("gst")} /></Field>
        <Field label="CGST %" error={errors.cgst?.message}><Input type="number" step="0.01" {...register("cgst")} /></Field>
        <Field label="SGST %" error={errors.sgst?.message}><Input type="number" step="0.01" {...register("sgst")} /></Field>
        <Field label="IGST %" error={errors.igst?.message}><Input type="number" step="0.01" {...register("igst")} /></Field>
        <Field label="CESS %" error={errors.cess?.message}><Input type="number" step="0.01" {...register("cess")} /></Field>
        <Field label="TDS %" error={errors.tds?.message}><Input type="number" step="0.01" {...register("tds")} /></Field>
        <Field label="TCS %" error={errors.tcs?.message}><Input type="number" step="0.01" {...register("tcs")} /></Field>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <ValidationBadge ok={splitMatches} label={`CGST + SGST = GST (${gst}%)`} />
        <ValidationBadge ok={igstMatches || igst === 0} label={`IGST = GST (${gst}%)`} />
      </div>
    </Card>
  )
}

function ValidationBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <Badge variant="outline" className={ok ? "border-emerald-200 text-emerald-700" : "border-amber-200 text-amber-700"}>
      {ok ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <AlertCircle className="mr-1 h-3 w-3" />}
      {label}
    </Badge>
  )
}
