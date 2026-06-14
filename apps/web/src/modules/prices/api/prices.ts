import { apiGet, apiPost } from "@/lib/api"
import type { Price, PriceFilters, Paginated, PriceVersion, ID } from "../types"

const STATUS_MAP: Record<string, string> = {
  active: "ACTIVE",
  future: "FUTURE",
  expired: "EXPIRED",
  pending: "PENDING",
}

function mapPrice(data: Record<string, unknown>): Price {
  const product = data.product as Record<string, unknown> | undefined
  return {
    id: data.id as string,
    productId: data.productId as string,
    productName: product?.productName as string | undefined ?? (data.productName as string | undefined),
    productCode: product?.productCode as string | undefined ?? (data.productCode as string | undefined),
    mrp: Number(data.mrp ?? 0),
    ptr: Number(data.ptr ?? 0),
    pts: Number(data.pts ?? 0),
    purchasePrice: data.purchasePrice ? Number(data.purchasePrice) : undefined,
    effectiveFrom: data.effectiveFrom as string,
    effectiveTo: data.effectiveTo as string | undefined,
    status: ((data.status as string)?.toLowerCase() ?? "active") as Price["status"],
    revisionReason: data.revisionReason as string | undefined,
    changedBy: data.changedBy as string | undefined,
    createdAt: data.createdAt as string,
  }
}

function mapPriceVersion(data: Record<string, unknown>): PriceVersion {
  const base = mapPrice(data)
  return {
    ...base,
    version: Number(data.version ?? 1),
    changes: data.changes as PriceVersion["changes"],
  }
}

export const pricesApi = {
  list: async (filters: PriceFilters = {}): Promise<Paginated<Price>> => {
    const params: Record<string, unknown> = {}
    if (filters.q) params.search = filters.q
    if (filters.productId) params.productId = filters.productId
    if (filters.status) params.status = STATUS_MAP[filters.status]
    if (filters.page) params.page = filters.page
    if (filters.pageSize) params.limit = filters.pageSize
    const res = await apiGet<{ items?: Record<string, unknown>[]; data?: Record<string, unknown>[]; total?: number }>("/prices", params)
    const items = (res as { items?: Record<string, unknown>[] }).items ?? (res as { data?: Record<string, unknown>[] }).data ?? []
    return { data: items.map(mapPrice), total: (res as { total?: number }).total ?? items.length, page: filters.page ?? 1, pageSize: filters.pageSize ?? 25 }
  },
  get: async (id: ID): Promise<Price> => {
    const data = await apiGet<Record<string, unknown>>(`/prices/${id}`)
    return mapPrice(data)
  },
  create: async (payload: Partial<Price>): Promise<Price> => {
    const body: Record<string, unknown> = {
      productId: payload.productId,
      mrp: payload.mrp,
      ptr: payload.ptr,
      pts: payload.pts,
      effectiveFrom: payload.effectiveFrom,
    }
    if (payload.purchasePrice) body.purchasePrice = payload.purchasePrice
    if (payload.effectiveTo) body.effectiveTo = payload.effectiveTo
    const data = await apiPost<Record<string, unknown>>("/prices", body)
    return mapPrice(data)
  },
  history: async (id: ID): Promise<PriceVersion[]> => {
    const data = await apiGet<Record<string, unknown>[]>("/prices/" + id + "/history")
    return (data ?? []).map(mapPriceVersion)
  },
}
