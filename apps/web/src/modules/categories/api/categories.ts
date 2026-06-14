import { apiGet, apiPost } from "@/lib/api"

export interface Category {
  id: string
  code: string
  name: string
  parentId?: string | null
  parentName?: string
  createdAt?: string
  updatedAt?: string
}

interface BackendCategory {
  id: string
  categoryCode: string
  categoryName: string
  description?: string
  status: boolean
  parentId?: string | null
  createdAt?: string
  updatedAt?: string
  _count?: { subCategories: number }
}

function mapCategory(c: BackendCategory): Category {
  return {
    id: c.id,
    code: c.categoryCode,
    name: c.categoryName,
    parentId: c.parentId ?? null,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }
}

export const categoriesApi = {
  list: async (): Promise<Category[]> => {
    const data = await apiGet<BackendCategory[]>("/hierarchy/categories")
    return data.map(mapCategory)
  },
  getById: async (id: string): Promise<Category> => {
    const data = await apiGet<BackendCategory>(`/hierarchy/categories/${id}`)
    return mapCategory(data)
  },
  create: async (payload: Partial<Category>): Promise<Category> => {
    const body: Record<string, unknown> = {
      categoryCode: payload.code,
      categoryName: payload.name,
    }
    if (payload.parentId) body.parentId = payload.parentId
    const data = await apiPost<BackendCategory>("/hierarchy/categories", body)
    return mapCategory(data)
  },
}
