import { apiGet } from "@/lib/api"

export interface AuditChange {
  field: string
  oldValue: unknown
  newValue: unknown
}

export interface AuditEntry {
  id: string
  module: string
  entityId: string
  entityName?: string
  user: string
  action: string
  timestamp: string
  changes?: AuditChange[]
}

export interface AuditFilters {
  user?: string
  module?: string
  from?: string
  to?: string
  page?: number
  pageSize?: number
}

export const auditApi = {
  list: async (filters?: AuditFilters): Promise<AuditEntry[]> => {
    return apiGet<AuditEntry[]>("/audit", filters as Record<string, unknown>)
  },
}
