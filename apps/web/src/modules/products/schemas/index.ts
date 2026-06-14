import { z } from "zod"

export const productInfoSchema = z.object({
  code: z.string().min(1, "Product code is required").max(50),
  sapCode: z.string().max(50).optional().or(z.literal("")),
  name: z.string().min(2, "Product name is required").max(200),
  shortName: z.string().max(80).optional().or(z.literal("")),
  barcode: z.string().max(50).optional().or(z.literal("")),
  eanCode: z.string().max(50).optional().or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
})

export const productHierarchySchema = z.object({
  businessUnit: z.string().optional().or(z.literal("")),
  division: z.string().optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  subCategoryId: z.string().optional().or(z.literal("")),
  brandId: z.string().optional().or(z.literal("")),
  subBrand: z.string().optional().or(z.literal("")),
  variant: z.string().optional().or(z.literal("")),
})

export const productPackagingSchema = z.object({
  baseUom: z.string().optional().or(z.literal("")),
  packSize: z.coerce.number().positive("Must be > 0").optional(),
  caseQuantity: z.coerce.number().int().positive("Must be > 0").optional(),
  weight: z.coerce.number().nonnegative().optional(),
  volume: z.coerce.number().nonnegative().optional(),
  dimensions: z.object({
    l: z.coerce.number().nonnegative().optional(),
    w: z.coerce.number().nonnegative().optional(),
    h: z.coerce.number().nonnegative().optional(),
  }).optional(),
  uomConversions: z.array(z.object({
    fromUom: z.string().min(1),
    toUom: z.string().min(1),
    factor: z.coerce.number().positive(),
  })).default([]),
})

export const productTaxSchema = z.object({
  hsn: z.string().optional().or(z.literal("")),
  gst: z.coerce.number().min(0).max(100).optional(),
  cgst: z.coerce.number().min(0).max(100).optional(),
  sgst: z.coerce.number().min(0).max(100).optional(),
  igst: z.coerce.number().min(0).max(100).optional(),
  cess: z.coerce.number().min(0).max(100).optional(),
  tds: z.coerce.number().min(0).max(100).optional(),
  tcs: z.coerce.number().min(0).max(100).optional(),
})

export const productGeographySchema = z.object({
  geographies: z.array(z.object({
    geographyId: z.string(),
    status: z.enum(["available", "restricted", "launch_pending", "blocked"]),
    launchDate: z.string().optional(),
  })).default([]),
})

export const productAttributesSchema = z.object({
  attributes: z.array(z.object({
    attributeId: z.string().min(1),
    value: z.string().min(1),
  })).default([]),
})

export const productDocumentsSchema = z.object({
  documents: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    version: z.string().optional(),
    url: z.string().optional(),
    uploadedAt: z.string(),
  })).default([]),
})

export const productFullSchema = productInfoSchema
  .merge(productHierarchySchema)
  .merge(productPackagingSchema)
  .merge(productTaxSchema)
  .merge(productGeographySchema)
  .merge(productAttributesSchema)
  .merge(productDocumentsSchema)

export type ProductFormValues = z.infer<typeof productFullSchema>
