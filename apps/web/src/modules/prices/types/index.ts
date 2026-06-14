export type ID = string

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

export interface Paginated<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ProductBasic {
  id: string
  code: string
  name: string
}

export type PriceFilters = {
  q?: string
  productId?: ID
  status?: PriceStatus
  page?: number
  pageSize?: number
  sort?: string
}
