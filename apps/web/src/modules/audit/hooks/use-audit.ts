"use client"

import { useQuery } from "@tanstack/react-query"
import { auditApi, type AuditFilters } from "../api/audit"

export function useAudit(filters?: AuditFilters) {
  return useQuery({
    queryKey: ["audit", filters ?? {}],
    queryFn: () => auditApi.list(filters),
  })
}
