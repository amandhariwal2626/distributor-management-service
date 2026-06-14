export type ProductStatus = "DRAFT" | "ACTIVE" | "INACTIVE"

export interface Product {
  id: string
  productCode: string
  sapProductCode?: string
  productName: string
  shortName?: string
  barcode?: string
  hsnCode?: string
  description?: string
  categoryId?: string
  category?: { id: string; categoryName: string }
  subCategoryId?: string
  subCategory?: { id: string; subCategoryName: string }
  brandId?: string
  brand?: { id: string; brandName: string }
  manufacturerId?: string
  manufacturer?: { id: string; manufacturerName: string }
  skuType?: string
  uomId?: string
  uom?: { id: string; uomName: string; uomCode?: string }
  reorderLevel?: number
  shelfLifeDays?: number
  taxGroupId?: string
  taxGroup?: { id: string; taxName: string; cgst: number; sgst: number }
  status: ProductStatus
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface ProductListItem {
  id: string
  productCode: string
  productName: string
  brand?: { id: string; brandName: string }
  category?: { id: string; categoryName: string }
  skuType?: string
  status: ProductStatus
  createdAt: string
}

export interface ProductHierarchyNode {
  id: string
  name: string
  children?: ProductHierarchyNode[]
}

export interface UomConversion {
  fromUom: string
  toUom: string
  conversionFactor: number
}

export interface ProductAttribute {
  id: string
  attributeDefId: string
  attribute: string
  type: string
  value: string
}

export interface ProductDocument {
  id: string
  fileName: string
  documentType: string
  fileType: string
  fileSize: number
  url: string
}

export interface ProductGeography {
  id: string
  state: string
  region?: string
  launchDate?: string
}

export interface CreateProductPayload {
  productCode: string
  sapProductCode?: string
  productName: string
  shortName?: string
  barcode?: string
  hsnCode?: string
  description?: string
  categoryId?: string
  subCategoryId?: string
  brandId?: string
  manufacturerId?: string
  skuType?: string
  uomId?: string
  reorderLevel?: number
  shelfLifeDays?: number
  taxGroupId?: string
  geographies?: ProductGeography[]
  attributes?: ProductAttribute[]
  documents?: ProductDocument[]
}

export interface Price {
  id: string
  productId: string
  product?: { id: string; productCode: string; productName: string }
  mrp: number
  ptr: number
  pts: number
  distributorPrice?: number
  effectiveFrom: string
  effectiveTo?: string
  status: "ACTIVE" | "FUTURE" | "EXPIRED"
  createdBy?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePricePayload {
  productId: string
  mrp: number
  ptr: number
  pts: number
  distributorPrice?: number
  effectiveFrom: string
  effectiveTo?: string
}

export interface Approval {
  id: string
  entityType: "PRODUCT" | "PRICE"
  entityId: string
  entityName: string
  changeSummary: string
  submittedBy: string
  submittedByName: string
  submittedAt: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "SENT_BACK"
}

export interface AuditEntry {
  id: string
  action: string
  entityType: string
  entityId: string
  field?: string
  oldValue?: string
  newValue?: string
  userId: string
  userName: string
  createdAt: string
}

export interface ListProductsParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  skuType?: string
  brandId?: string
  categoryId?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
