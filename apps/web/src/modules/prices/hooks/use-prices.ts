"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { pricesApi } from "../api/prices"
import type { ID, Price, PriceFilters } from "../types"

export const usePrices = (filters: PriceFilters = {}) =>
  useQuery({ queryKey: ["prices", filters], queryFn: () => pricesApi.list(filters) })

export const usePrice = (id: ID | undefined) =>
  useQuery({ enabled: !!id, queryKey: ["prices", id!], queryFn: () => pricesApi.get(id!) })

export const usePriceHistory = (id: ID | undefined) =>
  useQuery({ enabled: !!id, queryKey: ["prices", id!, "history"], queryFn: () => pricesApi.history(id!) })

export const useCreatePrice = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<Price>) => pricesApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prices"] })
      toast.success("Price created")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useProductsList = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ["products", "select", params ?? {}],
    queryFn: async () => {
      const { apiGet } = await import("@/lib/api")
      const res = await apiGet<{ items?: Record<string, unknown>[]; data?: Record<string, unknown>[] }>("/products", { ...params, limit: 200 })
      const items = (res as { items?: Record<string, unknown>[] }).items ?? (res as { data?: Record<string, unknown>[] }).data ?? []
      return items.map((p) => ({ id: p.id as string, code: (p.productCode ?? p.code ?? "") as string, name: (p.productName ?? p.name ?? "") as string }))
    },
  })
