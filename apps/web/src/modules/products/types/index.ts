export type ID = string

export type ProductStatus = "active" | "draft" | "pending" | "inactive"

export interface Product {
  id: ID
  code: string
  sapCode?: string
  name: string
  shortName?: string
  barcode?: string
  eanCode?: string
  description?: string
  brandId?: ID
  brandName?: string
  categoryId?: ID
  categoryName?: string
  subCategoryId?: ID
  variant?: string
  businessUnit?: string
  division?: string
  subBrand?: string
  baseUom?: string
  packSize?: number
  caseQuantity?: number
  weight?: number
  volume?: number
  dimensions?: { l?: number; w?: number; h?: number }
  hsn?: string
  gst?: number
  cgst?: number
  sgst?: number
  igst?: number
  cess?: number
  tds?: number
  tcs?: number
  status: ProductStatus
  createdAt: string
  updatedAt?: string
  imageUrl?: string
}

export type PriceStatus = "active" | "future" | "expired" | "pending"

export interface Price {
  id: ID
  productId: ID
  productName?: string
  productCode?: string
  mrp: number
  ptr: number
  pts: number
  purchasePrice?: number
  effectiveFrom: string
  effectiveTo?: string
  status: PriceStatus
  revisionReason?: string
  changedBy?: string
  createdAt: string
}

export type PriceVersion = Price & {
  version: number
  changes?: Array<{ field: string; oldValue: unknown; newValue: unknown }>
}

export interface Brand { id: ID; code: string; name: string; status?: string }
export interface Category { id: ID; code: string; name: string; parentId?: ID | null }
export interface Attribute { id: ID; code: string; name: string; type: "text" | "number" | "boolean" | "select"; options?: string[] }

export interface GeographyNode {
  id: ID
  name: string
  code?: string
  children?: GeographyNode[]
}

export interface ProductGeography {
  geographyId: ID
  status: "available" | "restricted" | "launch_pending" | "blocked"
  launchDate?: string
}

export interface ProductAttribute { attributeId: ID; value: string }

export interface UomConversion { id?: string; fromUom: string; toUom: string; factor: number }

export interface ProductDocument {
  id: ID
  name: string
  type: string
  version?: string
  url?: string
  uploadedAt: string
  size?: number
}

export type ProductFilters = {
  q?: string
  code?: string
  name?: string
  brandId?: ID
  categoryId?: ID
  status?: ProductStatus
  geographyId?: ID
  page?: number
  pageSize?: number
  sort?: string
}

export type PriceFilters = {
  q?: string
  productId?: ID
  status?: PriceStatus
  page?: number
  pageSize?: number
  sort?: string
}

export interface Paginated<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
