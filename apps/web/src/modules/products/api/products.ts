import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api"
import type { Product, ProductFilters, Paginated, ProductDocument, ID } from "../types"

const STATUS_MAP: Record<string, string> = {
  active: "ACTIVE",
  draft: "DRAFT",
  pending: "PENDING",
  inactive: "INACTIVE",
}

function mapProduct(data: Record<string, unknown>): Product {
  const brand = data.brand as Record<string, unknown> | undefined
  const category = data.category as Record<string, unknown> | undefined
  return {
    id: data.id as string,
    code: (data.productCode ?? data.code ?? "") as string,
    name: (data.productName ?? data.name ?? "") as string,
    shortName: data.shortName as string | undefined,
    barcode: data.barcode as string | undefined,
    description: data.description as string | undefined,
    brandId: data.brandId as string | undefined,
    brandName: (brand?.brandName ?? data.brandName) as string | undefined,
    categoryId: data.categoryId as string | undefined,
    categoryName: (category?.categoryName ?? data.categoryName) as string | undefined,
    status: ((data.status as string)?.toLowerCase() ?? "draft") as Product["status"],
    createdAt: data.createdAt as string,
    updatedAt: data.updatedAt as string | undefined,
    imageUrl: data.imageUrl as string | undefined,
  }
}

export const productsApi = {
  list: async (filters: ProductFilters = {}): Promise<Paginated<Product>> => {
    const params: Record<string, unknown> = {}
    if (filters.q) params.search = filters.q
    if (filters.code) params.productCode = filters.code
    if (filters.name) params.productName = filters.name
    if (filters.brandId) params.brandId = filters.brandId
    if (filters.categoryId) params.categoryId = filters.categoryId
    if (filters.status) params.status = STATUS_MAP[filters.status]
    if (filters.page) params.page = filters.page
    if (filters.pageSize) params.limit = filters.pageSize
    const res = await apiGet<Record<string, unknown>>("/products", params)
    const items = (res as unknown as { items?: Record<string, unknown>[] }).items
      ?? (res as unknown as { data?: Record<string, unknown>[] }).data
      ?? []
    const total = (res as unknown as { total?: number }).total ?? items.length
    return {
      data: items.map(mapProduct),
      total,
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 25,
    }
  },
  get: async (id: ID): Promise<Product> => {
    const data = await apiGet<Record<string, unknown>>(`/products/${id}`)
    return mapProduct(data)
  },
  create: async (payload: Partial<Product>): Promise<Product> => {
    const body: Record<string, unknown> = {}
    if (payload.code) body.productCode = payload.code
    if (payload.name) body.productName = payload.name
    if (payload.shortName) body.shortName = payload.shortName
    if (payload.barcode) body.barcode = payload.barcode
    if (payload.description) body.description = payload.description
    if (payload.brandId) body.brandId = payload.brandId
    if (payload.categoryId) body.categoryId = payload.categoryId
    if (payload.subCategoryId) body.subCategoryId = payload.subCategoryId
    if (payload.baseUom) body.uomId = payload.baseUom
    if (payload.hsn) body.hsnCode = payload.hsn
    body.skuType = "FINISHED_GOOD"
    const data = await apiPost<Record<string, unknown>>("/products", body)
    return mapProduct(data)
  },
  update: async (id: ID, payload: Partial<Product>): Promise<Product> => {
    const data = await apiPatch<Record<string, unknown>>(`/products/${id}`, payload)
    return mapProduct(data)
  },
  remove: async (id: ID): Promise<void> => {
    return apiDelete(`/products/${id}`)
  },
  documents: async (id: ID): Promise<ProductDocument[]> => {
    return apiGet<ProductDocument[]>(`/products/${id}/documents`)
  },
}
