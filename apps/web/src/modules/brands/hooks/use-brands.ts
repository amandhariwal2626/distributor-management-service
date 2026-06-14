"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { brandsApi, type CreateBrandPayload } from "../api/brands"

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: brandsApi.list,
  })
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: ["brands", id],
    queryFn: () => brandsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateBrand() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateBrandPayload) => brandsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brands"] })
      toast.success("Brand created successfully")
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create brand"),
  })
}

export function useUpdateBrand() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateBrandPayload> }) =>
      brandsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brands"] })
      toast.success("Brand updated successfully")
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update brand"),
  })
}

export function useDeleteBrand() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => brandsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brands"] })
      toast.success("Brand deleted successfully")
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete brand"),
  })
}
