"use client"

import { useFormContext } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/api"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useTaxGroups } from "@/hooks/use-master-data"

interface TaxGroupDetail {
  id: string
  taxName: string
  cgst: number
  sgst: number
  igst?: number
  cess?: number
}

interface TaxGroupResponse {
  items: TaxGroupDetail[]
  meta: Record<string, unknown>
}

export function Step4Tax() {
  const form = useFormContext()
  const taxGroupId = form.watch("taxGroupId")
  const { data: taxGroups, isLoading } = useTaxGroups()

  const { data: rawTaxGroups } = useQuery<TaxGroupResponse>({
    queryKey: ["master-data", "tax-groups-raw"],
    queryFn: () => apiGet<TaxGroupResponse>("/tax-groups"),
    staleTime: 5 * 60 * 1000,
  })

  const selectedGroup = rawTaxGroups?.items?.find((g) => g.id === taxGroupId)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Tax Configuration</h3>
        <p className="text-sm text-muted-foreground">Select a tax group for this product</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="taxGroupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax Group</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoading ? "Loading..." : "Select tax group"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(taxGroups ?? []).map((group) => (
                    <SelectItem key={group.value} value={group.value}>{group.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {selectedGroup && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">{selectedGroup.taxName}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CGST</span>
                  <span className="font-medium">{selectedGroup.cgst}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SGST</span>
                  <span className="font-medium">{selectedGroup.sgst}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IGST</span>
                  <span className="font-medium">{selectedGroup.igst ?? 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CESS</span>
                  <span className="font-medium">{selectedGroup.cess ?? 0}%</span>
                </div>
                <div className="col-span-2 flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Total GST</span>
                  <span className="font-medium">{selectedGroup.cgst + selectedGroup.sgst}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
