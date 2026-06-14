"use client"

import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function Step1ProductInfo() {
  const form = useFormContext()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Product Information</h3>
        <p className="text-sm text-muted-foreground">Basic product details and identifiers</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="productCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Code *</FormLabel>
              <FormControl>
                <Input placeholder="e.g. PRD-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sapProductCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SAP Product Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g. SAP-12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Product Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shortName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Name</FormLabel>
              <FormControl>
                <Input placeholder="Short display name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barcode</FormLabel>
              <FormControl>
                <Input placeholder="Barcode number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hsnCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HSN Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 22021000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shelfLifeDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shelf Life (Days)</FormLabel>
              <FormControl>
                <Input type="number" min="0" placeholder="e.g. 365" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Product description"
                  className="min-h-24 resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>Detailed description of the product</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
