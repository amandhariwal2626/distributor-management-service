"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { attributesApi, type Attribute } from "../api/attributes"

export function useAttributes() {
  return useQuery({
    queryKey: ["attributes"],
    queryFn: () => attributesApi.list(),
  })
}

export function useCreateAttribute() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<Attribute>) => attributesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] })
      toast.success("Attribute created successfully")
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create attribute")
    },
  })
}
