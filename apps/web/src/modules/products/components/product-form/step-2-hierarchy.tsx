"use client"

import { Controller, useFormContext, useWatch } from "react-hook-form"
import type { ProductFormValues } from "../../schemas"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SearchableCombobox } from "@/components/shared/searchable-combobox"
import { Field } from "./step-1-product-info"
import { useBrands, useBusinessUnits, useCategories, useDivisions, useSubBrands, useSubCategories } from "../../hooks/use-master-data"

export function Step2Hierarchy() {
  const { control, register, formState: { errors } } = useFormContext<ProductFormValues>()
  const businessUnit = useWatch({ control, name: "businessUnit" })
  const categoryId = useWatch({ control, name: "categoryId" })
  const brandId = useWatch({ control, name: "brandId" })

  const buQ = useBusinessUnits()
  const divQ = useDivisions(businessUnit || undefined)
  const catQ = useCategories()
  const subCatQ = useSubCategories(categoryId || undefined)
  const brandsQ = useBrands()
  const subBrandsQ = useSubBrands(brandId || undefined)

  return (
    <Card className="p-6">
      <h2 className="text-base font-semibold">Hierarchy</h2>
      <p className="text-sm text-muted-foreground">Map this product to the business hierarchy.</p>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Business Unit" error={errors.businessUnit?.message}>
          <Controller control={control} name="businessUnit"
            render={({ field }) => (
              <SearchableCombobox value={field.value} onChange={field.onChange}
                options={(buQ.data ?? []).map((b) => ({ value: b.id, label: b.name }))}
                placeholder="Select business unit" loading={buQ.isLoading} />
            )} />
        </Field>
        <Field label="Division" error={errors.division?.message}>
          <Controller control={control} name="division"
            render={({ field }) => (
              <SearchableCombobox value={field.value} onChange={field.onChange}
                options={(divQ.data ?? []).map((d) => ({ value: d.id, label: d.name }))}
                placeholder={businessUnit ? "Select division" : "Select business unit first"}
                disabled={!businessUnit} loading={divQ.isFetching} />
            )} />
        </Field>
        <Field label="Category" error={errors.categoryId?.message}>
          <Controller control={control} name="categoryId"
            render={({ field }) => (
              <SearchableCombobox value={field.value} onChange={field.onChange}
                options={(catQ.data ?? []).map((c) => ({ value: c.id, label: c.name }))}
                placeholder="Select category" loading={catQ.isLoading} />
            )} />
        </Field>
        <Field label="Sub Category" error={errors.subCategoryId?.message}>
          <Controller control={control} name="subCategoryId"
            render={({ field }) => (
              <SearchableCombobox value={field.value} onChange={field.onChange}
                options={(subCatQ.data ?? []).map((c) => ({ value: c.id, label: c.name }))}
                placeholder={categoryId ? "Select sub category" : "Select category first"}
                disabled={!categoryId} loading={subCatQ.isFetching} />
            )} />
        </Field>
        <Field label="Brand" error={errors.brandId?.message}>
          <Controller control={control} name="brandId"
            render={({ field }) => (
              <SearchableCombobox value={field.value} onChange={field.onChange}
                options={(brandsQ.data ?? []).map((b) => ({ value: b.id, label: b.name }))}
                placeholder="Select brand" loading={brandsQ.isLoading} />
            )} />
        </Field>
        <Field label="Sub Brand" error={errors.subBrand?.message}>
          <Controller control={control} name="subBrand"
            render={({ field }) => (
              <SearchableCombobox value={field.value ?? ""} onChange={field.onChange}
                options={(subBrandsQ.data ?? []).map((b) => ({ value: b.id, label: b.name }))}
                placeholder={brandId ? "Select sub brand" : "Select brand first"}
                disabled={!brandId} loading={subBrandsQ.isFetching} />
            )} />
        </Field>
        <Field label="Variant" error={errors.variant?.message} className="md:col-span-2">
          <Input placeholder="e.g. 200g, Large" {...register("variant")} />
        </Field>
      </div>
    </Card>
  )
}
