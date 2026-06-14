"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { productsApi } from "../api/products"
import type { ID, Product, ProductFilters } from "../types"

export const qk = {
  products: (f?: ProductFilters) => ["products", f ?? {}] as const,
  product: (id: ID) => ["products", id] as const,
  productDocs: (id: ID) => ["products", id, "documents"] as const,
}

export const useProducts = (filters: ProductFilters = {}) =>
  useQuery({ queryKey: qk.products(filters), queryFn: () => productsApi.list(filters) })

export const useProduct = (id: ID | undefined) =>
  useQuery({ enabled: !!id, queryKey: qk.product(id!), queryFn: () => productsApi.get(id!) })

export const useProductDocuments = (id: ID | undefined) =>
  useQuery({ enabled: !!id, queryKey: qk.productDocs(id!), queryFn: () => productsApi.documents(id!) })

export const useCreateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<Product>) => productsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product created")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useUpdateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: ID; payload: Partial<Product> }) => productsApi.update(id, payload),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["products"] })
      qc.invalidateQueries({ queryKey: qk.product(v.id) })
      toast.success("Product updated")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export const useDeleteProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: ID) => productsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] })
      toast.success("Product deleted")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
