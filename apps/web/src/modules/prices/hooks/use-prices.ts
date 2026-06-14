"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { pricesApi } from "../api/prices"
import type { CreatePricePayload } from "@/modules/products/types"

export function usePrices(params?: { page?: number; limit?: number; productId?: string }) {
  return useQuery({
    queryKey: ["prices", params],
    queryFn: () => pricesApi.list(params),
  })
}

export function usePrice(id: string) {
  return useQuery({
    queryKey: ["prices", id],
    queryFn: () => pricesApi.getById(id),
    enabled: !!id,
  })
}

export function useCreatePrice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePricePayload) => pricesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prices"] })
      toast.success("Price created successfully")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create price")
    },
  })
}

export function useActivePrice(productId: string) {
  return useQuery({
    queryKey: ["prices", "active", productId],
    queryFn: () => pricesApi.getActiveByProduct(productId),
    enabled: !!productId,
  })
}
