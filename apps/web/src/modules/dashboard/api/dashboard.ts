import { apiGet } from "@/lib/api"

export interface DashboardKpis {
  totalProducts: number
  activeProducts: number
  draftProducts: number
  pendingApproval: number
  futurePrices: number
  expiringPrices: number
}

export interface ChartDatum {
  label: string
  value: number
}

export interface RecentUpload {
  id: string
  type: string
  fileName: string
  status: string
  uploadedAt: string
}

export interface RecentApproval {
  id: string
  entityType: string
  entityId: string
  entityName?: string
  submittedBy: string
  submittedAt: string
  status: string
}

export interface ActivityItem {
  id: string
  action: string
  entityName?: string
  user: string
  timestamp: string
}

export interface DashboardData {
  kpis: DashboardKpis
  productsByCategory: ChartDatum[]
  productsByBrand: ChartDatum[]
  priceChangeTrend: Array<{ date: string; value: number }>
  approvalTrend: Array<{ date: string; value: number }>
  recentUploads: RecentUpload[]
  recentApprovals: RecentApproval[]
  upcomingPriceChanges: Array<{ productName: string; currentPrice: number; newPrice: number; effectiveFrom: string }>
  activity: ActivityItem[]
}

export const dashboardApi = {
  get: async (): Promise<DashboardData> => {
    return apiGet<DashboardData>("/dashboard")
  },
}
