import { apiGet, apiPost } from "@/lib/api"

export type UploadType = "product" | "price"
export type UploadStatus = "processing" | "success" | "failed" | "partial"

export interface Upload {
  id: string
  type: UploadType
  fileName: string
  status: UploadStatus
  totalRows?: number
  successRows?: number
  errorRows?: number
  uploadedAt: string
  uploadedBy?: string
  errorReportUrl?: string
}

export const uploadsApi = {
  list: async (type?: UploadType): Promise<Upload[]> => {
    const params = type ? { type } : undefined
    return apiGet<Upload[]>("/uploads", params as Record<string, unknown>)
  },
  upload: async (type: UploadType, file: File): Promise<Upload> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)
    return apiPost<Upload>("/uploads", formData)
  },
  getTemplate: (type: UploadType): string => {
    return `/templates/${type}_template.xlsx`
  },
}
