import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api"
import type {
  Product,
  ProductListItem,
  CreateProductPayload,
  ListProductsParams,
  PaginatedResponse,
} from "../types"

export const productsApi = {
  list: async (params?: ListProductsParams): Promise<PaginatedResponse<ProductListItem>> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", String(params.page))
    if (params?.limit) searchParams.set("limit", String(params.limit))
    if (params?.search) searchParams.set("search", params.search)
    if (params?.status) searchParams.set("status", params.status)
    if (params?.skuType) searchParams.set("skuType", params.skuType)
    if (params?.brandId) searchParams.set("brandId", params.brandId)
    if (params?.categoryId) searchParams.set("categoryId", params.categoryId)
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy)
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder)
    const qs = searchParams.toString()
    return apiGet<PaginatedResponse<ProductListItem>>(`/products${qs ? `?${qs}` : ""}`)
  },

  getById: async (id: string): Promise<Product> => {
    return apiGet<Product>(`/products/${id}`)
  },

  create: async (payload: CreateProductPayload): Promise<Product> => {
    return apiPost<Product>("/products", payload)
  },

  update: async (id: string, payload: Partial<CreateProductPayload>): Promise<Product> => {
    return apiPatch<Product>(`/products/${id}`, payload)
  },

  delete: async (id: string): Promise<void> => {
    return apiDelete(`/products/${id}`)
  },

  activate: async (id: string): Promise<Product> => {
    return apiPatch<Product>(`/products/${id}/activate`, {})
  },

  deactivate: async (id: string): Promise<Product> => {
    return apiPatch<Product>(`/products/${id}/deactivate`, {})
  },
}
