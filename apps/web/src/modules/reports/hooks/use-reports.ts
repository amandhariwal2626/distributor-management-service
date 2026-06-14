"use client"

import { useQuery } from "@tanstack/react-query"
import { reportsApi, type ReportFilters } from "../api/reports"

export function useProductReport(filters?: ReportFilters) {
  return useQuery({
    queryKey: ["reports", "products", filters],
    queryFn: () => reportsApi.products(filters),
  })
}

export function usePriceReport(filters?: ReportFilters) {
  return useQuery({
    queryKey: ["reports", "prices", filters],
    queryFn: () => reportsApi.prices(filters),
  })
}

export function useAuditReport(filters?: ReportFilters) {
  return useQuery({
    queryKey: ["reports", "audit", filters],
    queryFn: () => reportsApi.audit(filters),
  })
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: () => reportsApi.dashboard(),
  })
}
