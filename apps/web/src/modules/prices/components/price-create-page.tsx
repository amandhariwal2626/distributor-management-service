"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useCreatePrice } from "../hooks/use-prices"
import { useProducts } from "@/modules/products/hooks/use-products"
import { priceFormSchema, type PriceFormValues } from "@/modules/products/schemas"
import { useMemo } from "react"

export function PriceCreatePage() {
  const router = useRouter()
  const createPrice = useCreatePrice()
  const { data: productsData } = useProducts({ limit: 1000 })

  const productOptions = useMemo(() => {
    if (!productsData?.data) return []
    return productsData.data.map((p) => ({
      value: p.id,
      label: `${p.productName} (${p.productCode})`,
    }))
  }, [productsData])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolver = zodResolver(priceFormSchema) as any
  const form = useForm<PriceFormValues>({
    resolver,
    defaultValues: {
      productId: "",
      mrp: undefined,
      ptr: undefined,
      pts: undefined,
      distributorPrice: undefined,
      effectiveFrom: "",
      effectiveTo: "",
    },
    mode: "onChange",
  })

  const values = form.watch()
  const errors = form.formState.errors
  const isValid = form.formState.isValid

  const validationChecks = [
    {
      label: "MRP ≥ PTR",
      passed: values.mrp && values.ptr ? values.mrp >= values.ptr : undefined,
    },
    {
      label: "PTR ≥ PTS",
      passed: values.ptr && values.pts ? values.ptr >= values.pts : undefined,
    },
    {
      label: "PTS ≥ Distributor Price",
      passed: values.pts && values.distributorPrice
        ? values.pts >= values.distributorPrice
        : values.distributorPrice === undefined || values.distributorPrice === null
          ? true
          : undefined,
    },
  ]

  const onSubmit = (data: PriceFormValues) => {
    const hasValidationErrors = validationChecks.some((c) => c.passed === false)
    if (hasValidationErrors) return
    createPrice.mutate(
      {
        productId: data.productId,
        mrp: data.mrp,
        ptr: data.ptr,
        pts: data.pts,
        distributorPrice: data.distributorPrice || undefined,
        effectiveFrom: data.effectiveFrom,
        effectiveTo: data.effectiveTo || undefined,
      },
      { onSuccess: () => router.push("/prices") },
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => router.push("/prices")} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Prices
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Create Price</h1>
        <p className="text-sm text-muted-foreground">Set pricing for a product</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pricing Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {productOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="mrp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>MRP (₹) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ptr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PTR (₹) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PTS (₹) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="distributorPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distributor Price (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormDescription>Price for distributor</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="effectiveFrom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Effective From *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="effectiveTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Effective To</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>Leave empty if ongoing</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => router.push("/prices")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!isValid || createPrice.isPending}>
                  {createPrice.isPending ? "Creating..." : "Create Price"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Validation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {validationChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-2">
                  {check.passed === undefined ? (
                    <div className="flex h-5 w-5 items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    </div>
                  ) : check.passed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )}
                  <span
                    className={`text-sm ${
                      check.passed === undefined
                        ? "text-muted-foreground"
                        : check.passed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-destructive"
                    }`}
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {Object.keys(errors).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-destructive">Errors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {Object.values(errors).map((err, i) => (
                  <p key={i} className="text-sm text-destructive">
                    {err.message}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
