"use client"

import { useState } from "react"
import { Upload, FileText, Download, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shared/page-header"

const uploadTypes = [
  {
    id: "products",
    title: "Product Upload",
    description: "Bulk upload products via CSV/Excel",
    template: "product_template.xlsx",
  },
  {
    id: "prices",
    title: "Price Upload",
    description: "Bulk upload pricing data via CSV/Excel",
    template: "price_template.xlsx",
  },
]

const recentUploads = [
  { type: "PRODUCT", fileName: "products_june.xlsx", status: "COMPLETED", totalRows: 25, successRows: 25, errorRows: 0, date: "2 hours ago" },
  { type: "PRICE", fileName: "prices_q2.xlsx", status: "PARTIAL", totalRows: 50, successRows: 48, errorRows: 2, date: "1 day ago" },
  { type: "PRODUCT", fileName: "new_launches.xlsx", status: "FAILED", totalRows: 10, successRows: 0, errorRows: 10, date: "3 days ago" },
]

export function UploadCenterPage() {
  const [dragOver, setDragOver] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Center"
        description="Bulk upload and manage your product and pricing data"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {uploadTypes.map((ut) => (
          <Card
            key={ut.id}
            className={`transition-colors ${dragOver === ut.id ? "border-primary bg-primary/5" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(ut.id) }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => { e.preventDefault(); setDragOver(null) }}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">{ut.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{ut.description}</p>
                <label className="mt-6">
                  <Button variant="default" asChild>
                    <span>Choose File</span>
                  </Button>
                  <input type="file" className="hidden" accept=".csv,.xlsx,.xls" />
                </label>
                <Button variant="link" size="sm" className="mt-2">
                  <Download className="mr-2 h-4 w-4" />
                  Download {ut.template}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUploads.map((u, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{u.fileName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-[10px]">{u.type}</Badge>
                      <Clock className="h-3 w-3" />
                      <span>{u.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    {u.status === "COMPLETED" ? (
                      <span className="text-green-600">{u.successRows}/{u.totalRows} rows</span>
                    ) : u.status === "PARTIAL" ? (
                      <span className="text-yellow-600">{u.successRows}/{u.totalRows} rows</span>
                    ) : (
                      <span className="text-red-600">Failed</span>
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      u.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : u.status === "PARTIAL"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }
                  >
                    {u.status}
                  </Badge>
                  {u.errorRows > 0 && (
                    <Button variant="ghost" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Errors
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
