"use client"

import { useQuery } from "@tanstack/react-query"
import { masterDataApi, type SelectOption } from "@/lib/api/master-data"

export function useCategories() {
  return useQuery<SelectOption[]>({
    queryKey: ["master-data", "categories"],
    queryFn: masterDataApi.categories,
    staleTime: 5 * 60 * 1000,
  })
}

export function useSubCategories(categoryId?: string) {
  return useQuery<SelectOption[]>({
    queryKey: ["master-data", "sub-categories", categoryId],
    queryFn: () => masterDataApi.subCategories(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useBrands() {
  return useQuery<SelectOption[]>({
    queryKey: ["master-data", "brands"],
    queryFn: masterDataApi.brands,
    staleTime: 5 * 60 * 1000,
  })
}

export function useManufacturers() {
  return useQuery<SelectOption[]>({
    queryKey: ["master-data", "manufacturers"],
    queryFn: masterDataApi.manufacturers,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUoms() {
  return useQuery<SelectOption[]>({
    queryKey: ["master-data", "uoms"],
    queryFn: masterDataApi.uoms,
    staleTime: 5 * 60 * 1000,
  })
}

export function useTaxGroups() {
  return useQuery<SelectOption[]>({
    queryKey: ["master-data", "tax-groups"],
    queryFn: masterDataApi.taxGroups,
    staleTime: 5 * 60 * 1000,
  })
}

export function useAttributeDefinitions() {
  return useQuery<SelectOption[]>({
    queryKey: ["master-data", "attribute-definitions"],
    queryFn: masterDataApi.attributeDefinitions,
    staleTime: 5 * 60 * 1000,
  })
}
