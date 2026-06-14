"use client"

import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import type { ProductFormValues } from "../../schemas"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchableCombobox } from "@/components/shared/searchable-combobox"
import { Field } from "./step-1-product-info"
import { useUoms } from "../../hooks/use-master-data"
import { Plus, Trash2 } from "lucide-react"

export function Step3Packaging() {
  const { control, register, formState: { errors } } = useFormContext<ProductFormValues>()
  const uomQ = useUoms()
  const uomOptions = (uomQ.data ?? []).map((u) => ({ value: u.id, label: u.name, hint: u.code }))
  const { fields, append, remove } = useFieldArray({ control, name: "uomConversions" })

  return (
    <Card className="p-6">
      <h2 className="text-base font-semibold">Packaging</h2>
      <p className="text-sm text-muted-foreground">UOM, pack size, and physical dimensions.</p>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Base UOM" error={errors.baseUom?.message}>
          <Controller control={control} name="baseUom"
            render={({ field }) => (
              <SearchableCombobox value={field.value} onChange={field.onChange} options={uomOptions} placeholder="Select UOM" loading={uomQ.isLoading} />
            )} />
        </Field>
        <Field label="Pack Size" error={errors.packSize?.message}>
          <Input type="number" step="any" {...register("packSize")} />
        </Field>
        <Field label="Case Quantity" error={errors.caseQuantity?.message}>
          <Input type="number" step="1" {...register("caseQuantity")} />
        </Field>
        <Field label="Weight (g)" error={errors.weight?.message}>
          <Input type="number" step="any" {...register("weight")} />
        </Field>
        <Field label="Volume (ml)" error={errors.volume?.message}>
          <Input type="number" step="any" {...register("volume")} />
        </Field>
        <div className="grid grid-cols-3 gap-2 md:col-span-2">
          <Field label="Length (cm)"><Input type="number" step="any" {...register("dimensions.l")} /></Field>
          <Field label="Width (cm)"><Input type="number" step="any" {...register("dimensions.w")} /></Field>
          <Field label="Height (cm)"><Input type="number" step="any" {...register("dimensions.h")} /></Field>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">UOM Conversions</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => append({ fromUom: "", toUom: "", factor: 1 })}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />Add row
          </Button>
        </div>
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-2 text-left font-medium">From UOM</th>
                <th className="p-2 text-left font-medium">To UOM</th>
                <th className="p-2 text-left font-medium">Factor</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {fields.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-xs text-muted-foreground">No conversions added.</td></tr>
              ) : fields.map((f, idx) => (
                <tr key={f.id} className="border-t border-border">
                  <td className="p-2"><Input {...register(`uomConversions.${idx}.fromUom`)} className="h-8" /></td>
                  <td className="p-2"><Input {...register(`uomConversions.${idx}.toUom`)} className="h-8" /></td>
                  <td className="p-2"><Input type="number" step="any" {...register(`uomConversions.${idx}.factor`)} className="h-8" /></td>
                  <td className="p-2">
                    <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => remove(idx)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}
