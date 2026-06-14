"use client"

import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"

const reports = [
  {
    title: "Product Catalog Report",
    description:
      "Complete list of all products with SKU codes, categories, brands, pack sizes, and current status across all price tiers.",
  },
  {
    title: "Price List Report",
    description:
      "Comprehensive pricing data including MRP, PTR, PTS, GST slabs, and effective dates for every active product.",
  },
  {
    title: "Approval Summary Report",
    description:
      "Summary of all pending and completed approvals with timestamps, approver details, and status breakdowns.",
  },
  {
    title: "Audit Trail Report",
    description:
      "Full audit log of system changes with user attribution, field-level diffs, and chronological event tracking.",
  },
]

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Operational and analytical reports"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.title}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-base">{report.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {report.description}
              </p>
              <Button disabled variant="outline" size="sm" className="w-full">
                Download Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
