import { z } from "zod"

export const productInfoSchema = z.object({
  productCode: z.string().min(1, "Product code is required"),
  sapProductCode: z.string().optional(),
  productName: z.string().min(1, "Product name is required"),
  shortName: z.string().optional(),
  barcode: z.string().optional(),
  hsnCode: z.string().optional(),
  description: z.string().optional(),
  shelfLifeDays: z.coerce.number().int().positive("Shelf life must be positive").optional(),
})

export const hierarchySchema = z.object({
  categoryId: z.string().optional(),
  subCategoryId: z.string().optional(),
  brandId: z.string().optional(),
  manufacturerId: z.string().optional(),
  skuType: z.string().optional(),
})

export const packagingSchema = z.object({
  uomId: z.string().optional(),
  reorderLevel: z.coerce.number().int().positive("Reorder level must be positive").optional(),
  uomConversions: z.array(z.object({
    fromUom: z.string().min(1, "From UOM is required"),
    toUom: z.string().min(1, "To UOM is required"),
    conversionFactor: z.coerce.number().positive("Factor must be positive"),
  })).optional(),
})

export const taxSchema = z.object({
  taxGroupId: z.string().optional(),
})

export const geographySchema = z.object({
  states: z.array(z.object({
    id: z.string(),
    name: z.string(),
    launchDate: z.string().optional(),
  })),
})

export const attributeSchema = z.object({
  attributes: z.array(z.object({
    attributeDefId: z.string().min(1, "Attribute is required"),
    attribute: z.string().optional(),
    type: z.string().optional(),
    value: z.string().min(1, "Value is required"),
  })),
})

export const documentSchema = z.object({
  documents: z.array(z.object({
    id: z.string(),
    file: z.instanceof(File),
    documentType: z.string().min(1, "Document type is required"),
  })),
})

export const createProductSchema = productInfoSchema
  .merge(hierarchySchema)
  .merge(packagingSchema)
  .merge(taxSchema)

export type ProductInfoValues = z.infer<typeof productInfoSchema>
export type HierarchyValues = z.infer<typeof hierarchySchema>
export type PackagingValues = z.infer<typeof packagingSchema>
export type TaxValues = z.infer<typeof taxSchema>

export const priceFormSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  mrp: z.coerce.number().positive("MRP must be positive"),
  ptr: z.coerce.number().positive("PTR must be positive"),
  pts: z.coerce.number().positive("PTS must be positive"),
  distributorPrice: z.coerce.number().positive().optional(),
  effectiveFrom: z.string().min(1, "Effective from date is required"),
  effectiveTo: z.string().optional(),
})

export type PriceFormValues = z.infer<typeof priceFormSchema>
