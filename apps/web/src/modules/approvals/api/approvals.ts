import { apiGet, apiPost } from "@/lib/api"

export type ApprovalStatus = "pending" | "approved" | "rejected" | "sent_back"

export interface Approval {
  id: string
  entityType: "product" | "price"
  entityId: string
  entityName?: string
  submittedBy: string
  submittedById?: string
  submittedAt: string
  changeSummary?: string
  status: ApprovalStatus
  diff?: Array<{ field: string; oldValue: unknown; newValue: unknown }>
}

export const approvalsApi = {
  list: async (status?: ApprovalStatus): Promise<Approval[]> => {
    const params = status ? { status } : undefined
    return apiGet<Approval[]>("/approvals", params as Record<string, unknown>)
  },
  approve: async (id: string, comment?: string): Promise<void> => {
    return apiPost<void>(`/approvals/${id}/approve`, { comment })
  },
  reject: async (id: string, reason: string): Promise<void> => {
    return apiPost<void>(`/approvals/${id}/reject`, { reason })
  },
  sendBack: async (id: string, reason: string): Promise<void> => {
    return apiPost<void>(`/approvals/${id}/send-back`, { reason })
  },
}
