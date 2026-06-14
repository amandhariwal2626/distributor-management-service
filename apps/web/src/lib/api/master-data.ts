import { apiGet } from "@/lib/api"

export interface SelectOption {
  value: string
  label: string
}

interface CategoryRes {
  id: string
  categoryName: string
}
interface SubCategoryRes {
  id: string
  subCategoryName: string
}
interface BrandRes {
  id: string
  brandName: string
}
interface ManufacturerRes {
  id: string
  manufacturerName: string
}
interface UomRes {
  id: string
  uomName: string
  uomCode: string
}
interface TaxGroupRes {
  id: string
  taxName: string
  cgst: number
  sgst: number
}
interface AttributeDefRes {
  id: string
  attributeName: string
}
interface PaginatedResponse<T> {
  items: T[]
  meta: Record<string, unknown>
}

export const masterDataApi = {
  categories: (): Promise<SelectOption[]> =>
    apiGet<CategoryRes[]>("/hierarchy/categories").then((res) =>
      res.map((c) => ({ value: c.id, label: c.categoryName }))
    ),

  subCategories: (categoryId?: string): Promise<SelectOption[]> =>
    apiGet<SubCategoryRes[]>("/hierarchy/subcategories", categoryId ? { categoryId } : undefined).then((res) =>
      res.map((s) => ({ value: s.id, label: s.subCategoryName }))
    ),

  brands: (): Promise<SelectOption[]> =>
    apiGet<BrandRes[]>("/hierarchy/brands").then((res) =>
      res.map((b) => ({ value: b.id, label: b.brandName }))
    ),

  manufacturers: (): Promise<SelectOption[]> =>
    apiGet<ManufacturerRes[]>("/hierarchy/manufacturers").then((res) =>
      res.map((m) => ({ value: m.id, label: m.manufacturerName }))
    ),

  uoms: (): Promise<SelectOption[]> =>
    apiGet<UomRes[]>("/hierarchy/uoms").then((res) =>
      res.map((u) => ({ value: u.id, label: `${u.uomName} (${u.uomCode})` }))
    ),

  taxGroups: (): Promise<SelectOption[]> =>
    apiGet<PaginatedResponse<TaxGroupRes>>("/tax-groups").then((res) =>
      res.items.map((t) => ({ value: t.id, label: `${t.taxName} (${t.cgst + t.sgst}%)` }))
    ),

  attributeDefinitions: (): Promise<SelectOption[]> =>
    apiGet<PaginatedResponse<AttributeDefRes>>("/attributes/definitions").then((res) =>
      res.items.map((a) => ({ value: a.id, label: a.attributeName }))
    ),
}
