import { apiGet } from "@/lib/api"

export interface ProductReportItem {
  id: string
  productCode: string
  productName: string
  status: string
  category?: { id: string; name: string } | null
  brand?: { id: string; name: string } | null
  _count: { prices: number; documents: number; images: number }
  createdAt: string
}

export interface ProductReport {
  totalProducts: number
  byStatus: Record<string, number>
  products: ProductReportItem[]
}

export interface PriceReportItem {
  id: string
  mrp: number
  ptr: number
  pts: number
  distributorPrice: number
  product: { id: string; productCode: string; productName: string }
  createdAt: string
  status: string
}

export interface PriceReport {
  totalPrices: number
  prices: PriceReportItem[]
}

export interface AuditReportItem {
  id: string
  action: string
  entityType: string
  entityId: string
  description?: string
  actor?: { id: string; email: string; profile?: { firstName: string; lastName: string } } | null
  createdAt: string
}

export interface AuditReport {
  totalLogs: number
  byAction: Record<string, number>
  byEntityType: Record<string, number>
  logs: AuditReportItem[]
}

export interface DashboardSummary {
  totalProducts: number
  activeProducts: number
  totalPrices: number
  generatedAt: string
}

export interface ReportFilters {
  status?: string
  categoryId?: string
  productId?: string
  entityType?: string
  action?: string
  fromDate?: string
  toDate?: string
}

export const reportsApi = {
  products: (filters?: ReportFilters) => apiGet<ProductReport>("/reports/products", filters as Record<string, unknown>),
  prices: (filters?: ReportFilters) => apiGet<PriceReport>("/reports/prices", filters as Record<string, unknown>),
  audit: (filters?: ReportFilters) => apiGet<AuditReport>("/reports/audit", filters as Record<string, unknown>),
  dashboard: () => apiGet<DashboardSummary>("/reports/dashboard"),
}
