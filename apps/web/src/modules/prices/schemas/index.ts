import { z } from "zod"

export const priceSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  mrp: z.coerce.number().positive("MRP must be > 0"),
  ptr: z.coerce.number().positive("PTR must be > 0"),
  pts: z.coerce.number().positive("PTS must be > 0"),
  purchasePrice: z.coerce.number().positive("Purchase price must be > 0"),
  effectiveFrom: z.string().min(1, "Effective from is required"),
  effectiveTo: z.string().optional().or(z.literal("")),
  revisionReason: z.string().min(3, "Reason is required").max(500),
}).refine((d) => d.mrp >= d.ptr, { path: ["ptr"], message: "PTR must be <= MRP" })
  .refine((d) => d.ptr >= d.pts, { path: ["pts"], message: "PTS must be <= PTR" })
  .refine((d) => d.purchasePrice <= d.pts, { path: ["purchasePrice"], message: "Purchase price must be <= PTS" })

export type PriceFormValues = z.infer<typeof priceSchema>
