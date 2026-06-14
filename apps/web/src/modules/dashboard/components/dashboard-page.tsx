"use client"

import { useRouter } from "next/navigation"
import {
  Package,
  TrendingUp,
  CheckCircle2,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { KpiCards } from "@/components/shared/kpi-cards"

const recentProducts = [
  { name: "Classic Cola 250ml", code: "PRD-042", date: "2026-06-05", status: "ACTIVE" as const },
  { name: "Mango Juice 1L", code: "PRD-043", date: "2026-06-04", status: "PENDING_APPROVAL" as const },
  { name: "Wheat Biscuits 200g", code: "PRD-044", date: "2026-06-03", status: "DRAFT" as const },
]

const recentApprovals = [
  { entity: "Price - Classic Cola 250ml", user: "Rahul S.", date: "2h ago", status: "APPROVED" as const },
  { entity: "Product - Mango Juice 1L", user: "Priya M.", date: "5h ago", status: "PENDING" as const },
  { entity: "Price - Wheat Biscuits 200g", user: "Amit K.", date: "1d ago", status: "SENT_BACK" as const },
]

const activityFeed = [
  { action: "Product created", entity: "Classic Cola 250ml", user: "Rahul S.", time: "2 hours ago" },
  { action: "Price updated", entity: "Mango Juice 1L", user: "Priya M.", time: "5 hours ago" },
  { action: "Bulk upload completed", entity: "15 products", user: "System", time: "1 day ago" },
  { action: "Price approved", entity: "Wheat Biscuits 200g", user: "Amit K.", time: "1 day ago" },
]

export function DashboardPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your product and pricing operations</p>
      </div>

      <KpiCards
        cards={[
          { label: "Total Products", value: "1,247", trend: { value: "12%", positive: true }, description: "vs last month" },
          { label: "Active Products", value: "1,183", trend: { value: "8%", positive: true }, description: "94.8% of total" },
          { label: "Future Prices", value: "24", description: "Scheduled price changes" },
          { label: "Pending Approvals", value: "7", trend: { value: "3", positive: false }, description: "Requires attention" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" />
              Recent Product Launches
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/products")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentProducts.map((p) => (
                <div key={p.code} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <code className="text-xs text-muted-foreground">{p.code}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{p.date}</span>
                    <Badge
                      variant="secondary"
                      className={
                        p.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : p.status === "PENDING_APPROVAL"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }
                    >
                      {p.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Recent Approvals
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/approvals")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentApprovals.map((a, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{a.entity}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.user} • {a.date}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      a.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : a.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }
                  >
                    {a.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {activityFeed.map((a, i) => (
                <div key={i} className="flex items-start gap-3 border-b py-3 last:border-b-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm">
                      <span className="font-medium">{a.action}</span> — {a.entity}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {a.user} • {a.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Upcoming Price Changes
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/prices")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Classic Cola 250ml</p>
                  <p className="text-xs text-muted-foreground">Current: ₹20.00 → New: ₹22.00</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-emerald-600">+10%</p>
                  <p className="text-xs text-muted-foreground">From Jul 1</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Mango Juice 1L</p>
                  <p className="text-xs text-muted-foreground">Current: ₹85.00 → New: ₹90.00</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-emerald-600">+5.9%</p>
                  <p className="text-xs text-muted-foreground">From Jul 15</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Wheat Biscuits 200g</p>
                  <p className="text-xs text-muted-foreground">Current: ₹30.00 → New: ₹32.00</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-emerald-600">+6.7%</p>
                  <p className="text-xs text-muted-foreground">From Aug 1</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
