"use client"

import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/api"
import type { Brand, Category, Attribute, GeographyNode, ID } from "../types"

export const useBrands = () =>
  useQuery({
    queryKey: ["masters", "brands"],
    queryFn: async () => {
      const data = await apiGet<Record<string, unknown>[]>("/hierarchy/brands")
      return (data ?? []).map((b) => ({ id: b.id as string, code: b.brandCode as string, name: b.brandName as string } as Brand))
    },
  })

export const useSubBrands = (id?: ID) =>
  useQuery({
    enabled: !!id,
    queryKey: ["masters", "brands", id!, "sub"],
    queryFn: async () => {
      const data = await apiGet<Record<string, unknown>[]>(`/hierarchy/brands/${id}/sub-brands`)
      return (data ?? []).map((b) => ({ id: b.id as string, code: (b.brandCode ?? b.code) as string, name: (b.brandName ?? b.name) as string } as Brand))
    },
  })

export const useCategories = () =>
  useQuery({
    queryKey: ["masters", "categories"],
    queryFn: async () => {
      const data = await apiGet<Record<string, unknown>[]>("/hierarchy/categories")
      return (data ?? []).map((c) => ({ id: c.id as string, code: c.categoryCode as string, name: c.categoryName as string } as Category))
    },
  })

export const useSubCategories = (id?: ID) =>
  useQuery({
    enabled: !!id,
    queryKey: ["masters", "categories", id!, "sub"],
    queryFn: async () => {
      const data = await apiGet<Record<string, unknown>[]>(`/hierarchy/categories/${id}/sub-categories`)
      return (data ?? []).map((c) => ({ id: c.id as string, code: c.subCategoryCode as string, name: c.subCategoryName as string } as Category))
    },
  })

export const useAttributes = () =>
  useQuery({
    queryKey: ["masters", "attributes"],
    queryFn: async () => {
      const res = await apiGet<{ items?: Record<string, unknown>[] }>("/attributes/definitions")
      const items = Array.isArray(res) ? res : (res as { items?: Record<string, unknown>[] }).items ?? []
      return items.map((a) => ({
        id: a.id as string,
        code: a.attributeCode as string,
        name: a.attributeName as string,
        type: ((a.dataType as string)?.toLowerCase() === "number" ? "number"
          : (a.dataType as string)?.toLowerCase() === "boolean" ? "boolean"
            : ["select", "dropdown"].includes((a.dataType as string)?.toLowerCase()) ? "select" : "text") as Attribute["type"],
      } as Attribute))
    },
  })

export const useGeography = () =>
  useQuery({
    queryKey: ["masters", "geography"],
    queryFn: async (): Promise<GeographyNode[]> => {
      try { return await apiGet<GeographyNode[]>("/geography/tree") }
      catch { return [] }
    },
  })

export const useBusinessUnits = () =>
  useQuery({
    queryKey: ["masters", "bu"],
    queryFn: async (): Promise<{ id: string; name: string }[]> => {
      try { return await apiGet<{ id: string; name: string }[]>("/masters/business-units") }
      catch { return [] }
    },
  })

export const useDivisions = (buId?: ID) =>
  useQuery({
    queryKey: ["masters", "divisions", buId ?? null],
    queryFn: async (): Promise<{ id: string; name: string }[]> => {
      try { return await apiGet<{ id: string; name: string }[]>("/masters/divisions", { buId }) }
      catch { return [] }
    },
  })

export const useUoms = () =>
  useQuery({
    queryKey: ["masters", "uoms"],
    queryFn: async () => {
      const data = await apiGet<Record<string, unknown>[]>("/hierarchy/uoms")
      return (data ?? []).map((u) => ({ id: u.id as string, code: u.uomCode as string, name: u.uomName as string }))
    },
  })
