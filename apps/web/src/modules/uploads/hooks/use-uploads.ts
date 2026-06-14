"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { uploadsApi, type UploadType } from "../api/uploads"

export function useUploads(type?: UploadType) {
  return useQuery({
    queryKey: ["uploads", type],
    queryFn: () => uploadsApi.list(type),
  })
}

export function useCreateUpload() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ type, file }: { type: UploadType; file: File }) =>
      uploadsApi.upload(type, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["uploads"] })
      toast.success("File uploaded successfully")
    },
    onError: (err: Error) => toast.error(err.message || "Failed to upload file"),
  })
}
