"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Trash2, Plus } from "lucide-react"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useUoms } from "@/hooks/use-master-data"

export function Step3Packaging() {
  const form = useFormContext()
  const { data: uoms, isLoading: uomLoading } = useUoms()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "uomConversions",
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Packaging & UOM</h3>
        <p className="text-sm text-muted-foreground">Configure packaging details and unit of measure conversions</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="uomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UOM</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={uomLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={uomLoading ? "Loading..." : "Select UOM"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(uoms ?? []).map((uom) => (
                    <SelectItem key={uom.value} value={uom.value}>{uom.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reorderLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reorder Level</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="e.g. 10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">UOM Conversions</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ fromUom: "", toUom: "", conversionFactor: 1 })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Row
          </Button>
        </div>
        {fields.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From UOM</TableHead>
                  <TableHead>To UOM</TableHead>
                  <TableHead>Factor</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                        value={form.watch(`uomConversions.${index}.fromUom`)}
                        onChange={(e) => form.setValue(`uomConversions.${index}.fromUom`, e.target.value)}
                      >
                        <option value="">Select</option>
                        {(uoms ?? []).map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                      </select>
                    </TableCell>
                    <TableCell>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                        value={form.watch(`uomConversions.${index}.toUom`)}
                        onChange={(e) => form.setValue(`uomConversions.${index}.toUom`, e.target.value)}
                      >
                        <option value="">Select</option>
                        {(uoms ?? []).map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                      </select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        className="h-9"
                        value={form.watch(`uomConversions.${index}.conversionFactor`)}
                        onChange={(e) => form.setValue(`uomConversions.${index}.conversionFactor`, Number(e.target.value))}
                      />
                    </TableCell>
                    <TableCell>
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
