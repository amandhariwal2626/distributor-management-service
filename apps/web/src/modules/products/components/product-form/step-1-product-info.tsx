"use client"

import { useFormContext } from "react-hook-form"
import type { ProductFormValues } from "../../schemas"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function Step1Info() {
  const { register, formState: { errors } } = useFormContext<ProductFormValues>()
  return (
    <Card className="p-6">
      <h2 className="text-base font-semibold">Product Information</h2>
      <p className="text-sm text-muted-foreground">Basic identifying details for the product.</p>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Product Code" error={errors.code?.message}>
          <Input placeholder="e.g. SKU-001" {...register("code")} />
        </Field>
        <Field label="SAP Product Code" error={errors.sapCode?.message}>
          <Input placeholder="Optional" {...register("sapCode")} />
        </Field>
        <Field label="Product Name" error={errors.name?.message} className="md:col-span-2">
          <Input placeholder="Full product name" {...register("name")} />
        </Field>
        <Field label="Short Name" error={errors.shortName?.message}>
          <Input placeholder="Display name" {...register("shortName")} />
        </Field>
        <Field label="Barcode" error={errors.barcode?.message}>
          <Input {...register("barcode")} />
        </Field>
        <Field label="EAN Code" error={errors.eanCode?.message}>
          <Input {...register("eanCode")} />
        </Field>
        <Field label="Description" error={errors.description?.message} className="md:col-span-2">
          <Textarea rows={3} placeholder="Product description" {...register("description")} />
        </Field>
      </div>
    </Card>
  )
}

export function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1.5 inline-block text-xs font-medium text-foreground">{label}</Label>
      {children}
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
