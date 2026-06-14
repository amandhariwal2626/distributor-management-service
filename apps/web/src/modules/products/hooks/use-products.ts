"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { productsApi } from "../api/products"
import type { CreateProductPayload, ListProductsParams } from "../types"

export function useProducts(params?: ListProductsParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.list(params),
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product created successfully")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create product")
    },
  })
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<CreateProductPayload>) => productsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["products", id] })
      toast.success("Product updated successfully")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update product")
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product deleted successfully")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete product")
    },
  })
}

export function useActivateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productsApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product activated successfully")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to activate product")
    },
  })
}

export function useDeactivateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productsApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product deactivated successfully")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to deactivate product")
    },
  })
}
