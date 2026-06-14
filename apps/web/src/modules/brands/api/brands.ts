import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api"

export interface Brand {
  id: string
  code: string
  name: string
  status: "ACTIVE" | "INACTIVE"
  createdAt?: string
  updatedAt?: string
}

export interface CreateBrandPayload {
  code: string
  name: string
  status: "ACTIVE" | "INACTIVE"
}

interface BackendBrand {
  id: string
  brandCode: string
  brandName: string
  status: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
}

function mapBrand(b: BackendBrand): Brand {
  return {
    id: b.id,
    code: b.brandCode,
    name: b.brandName,
    status: b.status ? "ACTIVE" : "INACTIVE",
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  }
}

export const brandsApi = {
  list: async (): Promise<Brand[]> => {
    const data = await apiGet<BackendBrand[]>("/hierarchy/brands")
    return data.map(mapBrand)
  },
  getById: async (id: string): Promise<Brand> => {
    const data = await apiGet<BackendBrand>(`/hierarchy/brands/${id}`)
    return mapBrand(data)
  },
  create: async (payload: CreateBrandPayload): Promise<Brand> => {
    const data = await apiPost<BackendBrand>("/hierarchy/brands", {
      brandCode: payload.code,
      brandName: payload.name,
      status: payload.status === "ACTIVE",
    })
    return mapBrand(data)
  },
  update: async (id: string, payload: Partial<CreateBrandPayload>): Promise<Brand> => {
    const body: Record<string, unknown> = {}
    if (payload.code !== undefined) body.brandCode = payload.code
    if (payload.name !== undefined) body.brandName = payload.name
    if (payload.status !== undefined) body.status = payload.status === "ACTIVE"
    const data = await apiPatch<BackendBrand>(`/hierarchy/brands/${id}`, body)
    return mapBrand(data)
  },
  delete: async (id: string): Promise<void> => {
    return apiDelete(`/hierarchy/brands/${id}`)
  },
}
