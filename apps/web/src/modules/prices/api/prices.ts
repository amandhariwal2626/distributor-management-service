import { apiGet, apiPost, apiPatch } from "@/lib/api"
import type { Price, CreatePricePayload, PaginatedResponse } from "@/modules/products/types"

export const pricesApi = {
  list: async (params?: { page?: number; limit?: number; productId?: string }): Promise<PaginatedResponse<Price>> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", String(params.page))
    if (params?.limit) searchParams.set("limit", String(params.limit))
    if (params?.productId) searchParams.set("productId", params.productId)
    const qs = searchParams.toString()
    return apiGet<PaginatedResponse<Price>>(`/prices${qs ? `?${qs}` : ""}`)
  },

  getById: async (id: string): Promise<Price> => {
    return apiGet<Price>(`/prices/${id}`)
  },

  create: async (payload: CreatePricePayload): Promise<Price> => {
    return apiPost<Price>("/prices", payload)
  },

  update: async (id: string, payload: Partial<CreatePricePayload>): Promise<Price> => {
    return apiPatch<Price>(`/prices/${id}`, payload)
  },

  getActiveByProduct: async (productId: string): Promise<Price> => {
    return apiGet<Price>(`/prices/product/${productId}/active`)
  },
}
