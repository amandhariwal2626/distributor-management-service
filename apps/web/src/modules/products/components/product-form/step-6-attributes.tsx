"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import type { ProductFormValues } from "../../schemas"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { useAttributes } from "../../hooks/use-master-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/shared/empty-state"

export function Step6Attributes() {
  const { control, register } = useFormContext<ProductFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: "attributes" })
  const attrQ = useAttributes()
  const attrs = attrQ.data ?? []

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Attributes</h2>
          <p className="text-sm text-muted-foreground">Define product attributes and their values.</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={() => append({ attributeId: "", value: "" })}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />Add attribute
        </Button>
      </div>

      <div className="mt-5 overflow-hidden rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-2 text-left font-medium">Attribute</th>
              <th className="p-2 text-left font-medium">Type</th>
              <th className="p-2 text-left font-medium">Value</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 ? (
              <tr><td colSpan={4} className="p-0"><EmptyState title="No attributes" description="Add attributes like color, flavor, dietary, etc." className="border-0 bg-transparent" /></td></tr>
            ) : fields.map((f, idx) => {
              const selectedId = (f as { attributeId: string }).attributeId
              const selected = attrs.find((a) => a.id === selectedId)
              return (
                <tr key={f.id} className="border-t border-border">
                  <td className="p-2 min-w-[200px]">
                    <Select value={(f as { attributeId: string }).attributeId}
                      onValueChange={(v) => { const id = `attributes.${idx}.attributeId` as const; register(id).onChange({ target: { name: id, value: v } }) }}>
                      <SelectTrigger className="h-8"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {attrs.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register(`attributes.${idx}.attributeId`)} />
                  </td>
                  <td className="p-2 text-xs text-muted-foreground capitalize">{selected?.type ?? "—"}</td>
                  <td className="p-2"><Input {...register(`attributes.${idx}.value`)} className="h-8" /></td>
                  <td className="p-2">
                    <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => remove(idx)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
