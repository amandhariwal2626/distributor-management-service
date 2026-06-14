"use client"

import { useRef, type ChangeEvent } from "react"
import { AlertCircle, FileSpreadsheet, Package, BadgeIndianRupee } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { useUploads, useCreateUpload } from "../hooks/use-uploads"
import type { Upload, UploadType, UploadStatus } from "../api/uploads"

const uploadTypes: { type: UploadType; title: string; description: string; icon: typeof Package }[] = [
  { type: "product", title: "Product Upload", description: "Bulk upload products via CSV/Excel", icon: Package },
  { type: "price", title: "Price Upload", description: "Bulk upload pricing data via CSV/Excel", icon: BadgeIndianRupee },
]

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

const statusConfig: Record<UploadStatus, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  processing: { variant: "outline", label: "Processing" },
  success: { variant: "default", label: "Success" },
  failed: { variant: "destructive", label: "Failed" },
  partial: { variant: "secondary", label: "Partial" },
}

function UploadCard({
  type,
  title,
  description,
  icon: Icon,
  onUpload,
  isUploading,
}: {
  type: UploadType
  title: string
  description: string
  icon: typeof Package
  onUpload: (type: UploadType, file: File) => void
  isUploading: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    onUpload(type, file)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center text-center p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>

        <div className="mt-6 flex flex-col items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button
            variant="default"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? "Uploading..." : "Choose File"}
          </Button>
          <Button variant="link" size="sm" asChild>
            <a href={`/templates/${type}_template.xlsx`} download>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Download Template
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function UploadCenterPage() {
  const { data: uploads, isLoading, isError, error, refetch } = useUploads()
  const { mutate: createUpload, isPending: isUploading } = useCreateUpload()

  function handleUpload(type: UploadType, file: File) {
    createUpload({ type, file })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Center"
        description="Bulk upload and manage your product and pricing data"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {uploadTypes.map((ut) => (
          <UploadCard
            key={ut.type}
            type={ut.type}
            title={ut.title}
            description={ut.description}
            icon={ut.icon}
            onUpload={handleUpload}
            isUploading={isUploading}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <ErrorState
              message={(error as Error)?.message || "Failed to load uploads"}
              onRetry={() => refetch()}
            />
          ) : !uploads || uploads.length === 0 ? (
            <EmptyState
              icon={<FileSpreadsheet className="h-8 w-8" />}
              title="No uploads yet"
              description="Upload a file to see your recent uploads here"
            />
          ) : (
            <div className="space-y-3">
              {uploads.map((u: Upload) => (
                <div key={u.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{u.fileName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-[10px]">
                          {u.type.toUpperCase()}
                        </Badge>
                        <span>{formatDate(u.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    {u.status !== "processing" && u.totalRows != null && (
                      <div className="text-right text-sm whitespace-nowrap">
                        {u.status === "failed" ? (
                          <span className="text-red-600">Failed</span>
                        ) : (
                          <span className={u.errorRows ? "text-yellow-600" : "text-green-600"}>
                            {u.successRows}/{u.totalRows} rows
                          </span>
                        )}
                      </div>
                    )}
                    <Badge variant={statusConfig[u.status].variant}>
                      {statusConfig[u.status].label}
                    </Badge>
                    {(u.status === "failed" || u.status === "partial") && u.errorRows != null && u.errorRows > 0 && (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={u.errorReportUrl || "#"}
                          download={!!u.errorReportUrl}
                          onClick={!u.errorReportUrl ? (e) => e.preventDefault() : undefined}
                        >
                          <AlertCircle className="mr-1 h-4 w-4" />
                          {u.errorRows} Error{u.errorRows > 1 ? "s" : ""}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
